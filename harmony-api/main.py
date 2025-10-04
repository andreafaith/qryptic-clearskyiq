"""
Harmony API - NASA TEMPO Data API using Harmony-py
A modern, secure FastAPI backend for fetching NASA TEMPO data
"""

import os
import datetime as dt
import io
import base64
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

import numpy as np
import xarray as xr
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
import cartopy.feature as cfeature
from cartopy.mpl.gridliner import LONGITUDE_FORMATTER, LATITUDE_FORMATTER
from xarray.plot.utils import label_from_attrs

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import httpx

from harmony import BBox, Client, Collection, Request
from harmony.config import Environment

# Load environment variables
load_dotenv()

# Security
security = HTTPBearer()

# Pydantic models
class TempoDataRequest(BaseModel):
    """Request model for TEMPO data"""
    start_time: str = Field(..., description="Start time in ISO format (YYYY-MM-DDTHH:MM:SS)")
    end_time: str = Field(..., description="End time in ISO format (YYYY-MM-DDTHH:MM:SS)")
    bbox: Optional[List[float]] = Field(None, description="Bounding box [west, south, east, north]")
    variables: Optional[List[str]] = Field(None, description="Specific variables to retrieve")
    
class TempoDataResponse(BaseModel):
    """Response model for TEMPO data"""
    success: bool
    data: Optional[Dict[str, Any]] = None
    message: Optional[str] = None
    job_id: Optional[str] = None

class VisualizationRequest(BaseModel):
    """Request model for data visualization"""
    start_time: str = Field(..., description="Start time in ISO format (YYYY-MM-DDTHH:MM:SS)")
    end_time: str = Field(..., description="End time in ISO format (YYYY-MM-DDTHH:MM:SS)")
    bbox: Optional[List[float]] = Field(None, description="Bounding box [west, south, east, north]")
    variables: Optional[List[str]] = Field(None, description="Specific variables to visualize")
    plot_type: str = Field("map", description="Type of plot: 'map', 'zonal_mean', or 'contour'")
    collection_id: str = Field("C2930730944-LARC_CLOUD", description="Collection ID for TEMPO data")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    version: str

# Global variables
harmony_client: Optional[Client] = None

# Visualization helper functions
def make_nice_map(axis):
    """Create a nice map with coastlines and gridlines"""
    axis.add_feature(cfeature.STATES, color="gray", lw=0.1)
    axis.coastlines(resolution="50m", color="gray", linewidth=0.5)
    axis.set_extent([-150, -40, 14, 65], crs=ccrs.PlateCarree())
    grid = axis.gridlines(draw_labels=["left", "bottom"], dms=True)
    grid.xformatter = LONGITUDE_FORMATTER
    grid.yformatter = LATITUDE_FORMATTER

def create_map_visualization(datatree, variable_name="product/vertical_column", title="TEMPO Data"):
    """Create a map visualization of TEMPO data"""
    try:
        # Get the data variable
        da = datatree[variable_name]
        
        # Create figure and axis
        fig, ax = plt.subplots(figsize=(12, 8), subplot_kw={"projection": ccrs.PlateCarree()})
        
        # Make nice map
        make_nice_map(ax)
        
        # Plot the data
        contour_handle = ax.contourf(
            datatree["geolocation/longitude"],
            datatree["geolocation/latitude"],
            da,
            levels=50,
            vmin=0,
            zorder=2,
            transform=ccrs.PlateCarree()
        )
        
        # Add colorbar
        cb = plt.colorbar(contour_handle, ax=ax, shrink=0.8)
        cb.set_label(label_from_attrs(da))
        
        ax.set_title(title, fontsize=14, fontweight='bold')
        
        # Convert to base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close(fig)
        
        return img_base64
        
    except Exception as e:
        print(f"Error creating map visualization: {e}")
        return None

def create_zonal_mean_plot(datatree, variable_name="product/vertical_column", title="Zonal Mean"):
    """Create a zonal mean plot of TEMPO data"""
    try:
        # Get the data variable
        da = datatree[variable_name]
        
        # Define latitude bins
        lat_bins = np.arange(15, 61, 5)
        lat_centers = np.arange(15, 60, 5)
        
        # Group by latitude bins and take mean
        product_lat_mean = da.groupby_bins(
            datatree["geolocation/latitude"], lat_bins, labels=lat_centers
        ).mean(dim=xr.ALL_DIMS)
        
        # Create figure
        fig, ax = plt.subplots(figsize=(10, 6))
        
        # Plot zonal mean
        product_lat_mean.plot(ax=ax)
        ax.invert_xaxis()
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.set_xlabel("Latitude")
        ax.set_ylabel(label_from_attrs(da))
        
        # Convert to base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close(fig)
        
        return img_base64
        
    except Exception as e:
        print(f"Error creating zonal mean plot: {e}")
        return None

def create_contour_plot(datatree, variable_name="product/vertical_column", title="Contour Plot"):
    """Create a contour plot of TEMPO data"""
    try:
        # Get the data variable
        da = datatree[variable_name]
        
        # Create figure
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # Create contour plot
        contour = da.plot.contourf(
            x="mirror_step", y="xtrack", vmin=0, ax=ax
        )
        
        ax.invert_xaxis()
        ax.set_title(title, fontsize=14, fontweight='bold')
        
        # Convert to base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', dpi=150, bbox_inches='tight')
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close(fig)
        
        return img_base64
        
    except Exception as e:
        print(f"Error creating contour plot: {e}")
        return None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global harmony_client
    
    # Initialize Harmony client
    try:
        username = os.getenv("EARTHDATA_USERNAME")
        password = os.getenv("EARTHDATA_PASSWORD")
        
        if not username or not password or username == "your_username_here":
            print("⚠️  Harmony client not initialized - credentials not set")
            print("   Please set EARTHDATA_USERNAME and EARTHDATA_PASSWORD in .env file")
            harmony_client = None
        else:
            harmony_client = Client(
                env=Environment.PROD, 
                auth=(username, password)
            )
            print("✅ Harmony client initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize Harmony client: {e}")
        harmony_client = None
    
    yield
    
    # Cleanup
    harmony_client = None

# Create FastAPI app
app = FastAPI(
    title=os.getenv("API_TITLE", "Harmony API"),
    description=os.getenv("API_DESCRIPTION", "NASA TEMPO Data API using Harmony-py"),
    version=os.getenv("API_VERSION", "1.0.0"),
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get Harmony client
def get_harmony_client() -> Client:
    if harmony_client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Harmony client not available"
        )
    return harmony_client

# Security dependency
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Simple token verification - replace with proper auth in production"""
    token = credentials.credentials
    expected_token = os.getenv("SECRET_KEY", "default-token")
    
    if token != expected_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with health check"""
    return HealthResponse(
        status="healthy",
        timestamp=dt.datetime.utcnow().isoformat(),
        version=os.getenv("API_VERSION", "1.0.0")
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if harmony_client else "unhealthy",
        timestamp=dt.datetime.utcnow().isoformat(),
        version=os.getenv("API_VERSION", "1.0.0")
    )

@app.post("/tempo/data", response_model=TempoDataResponse)
async def get_tempo_data(
    request: TempoDataRequest,
    client: Client = Depends(get_harmony_client),
    token: str = Depends(verify_token)
):
    """
    Fetch TEMPO data using Harmony-py
    
    This endpoint retrieves NASA TEMPO (Tropospheric Emissions: Monitoring of Pollution) data
    for the specified time range and optional spatial bounding box.
    """
    try:
        # Parse datetime strings
        start_dt = dt.datetime.fromisoformat(request.start_time.replace('Z', '+00:00'))
        end_dt = dt.datetime.fromisoformat(request.end_time.replace('Z', '+00:00'))
        
        # Create Harmony request
        harmony_request = Request(
            collection=Collection(id="C2930730944-LARC_CLOUD"),
            temporal={
                "start": start_dt,
                "stop": end_dt,
            },
        )
        
        # Add spatial filter if provided
        if request.bbox and len(request.bbox) == 4:
            harmony_request.spatial = BBox(
                request.bbox[0],  # west
                request.bbox[1],  # south
                request.bbox[2],  # east
                request.bbox[3]   # north
            )
        
        # Submit job
        job_id = client.submit(harmony_request)
        
        # Wait for processing
        client.wait_for_processing(job_id, show_progress=True)
        
        # Download results
        results = client.download_all(job_id, directory="/tmp", overwrite=True)
        result_files = [f.result() for f in results]
        
        # Process data files - simplified version without xarray
        processed_data = []
        for file_path in result_files:
            try:
                # Basic file information without heavy dependencies
                data_info = {
                    "file_path": file_path,
                    "file_size": os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                    "file_name": os.path.basename(file_path),
                    "status": "downloaded"
                }
                
                # Add basic metadata if available
                if request.variables:
                    data_info["requested_variables"] = request.variables
                
                processed_data.append(data_info)
                
            except Exception as e:
                print(f"Error processing file {file_path}: {e}")
                continue
        
        return TempoDataResponse(
            success=True,
            data={
                "job_id": job_id,
                "files_processed": len(processed_data),
                "data": processed_data
            },
            message=f"Successfully processed {len(processed_data)} files"
        )
        
    except Exception as e:
        return TempoDataResponse(
            success=False,
            message=f"Error fetching TEMPO data: {str(e)}"
        )

@app.get("/tempo/collections")
async def get_available_collections(
    client: Client = Depends(get_harmony_client),
    token: str = Depends(verify_token)
):
    """Get available TEMPO collections"""
    try:
        # This is a simplified version - in practice you'd query the CMR
        collections = [
            {
                "id": "C2930730944-LARC_CLOUD",
                "name": "TEMPO Level 2 Data",
                "description": "TEMPO Level 2 atmospheric composition data"
            }
        ]
        
        return {
            "success": True,
            "collections": collections
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching collections: {str(e)}"
        )

@app.post("/tempo/visualize")
async def visualize_tempo_data(
    request: VisualizationRequest,
    client: Client = Depends(get_harmony_client),
    token: str = Depends(verify_token)
):
    """
    Create visualizations of TEMPO data
    
    This endpoint fetches NASA TEMPO data and creates various visualizations
    including maps, zonal means, and contour plots.
    """
    try:
        # Parse datetime strings
        start_dt = dt.datetime.fromisoformat(request.start_time.replace('Z', '+00:00'))
        end_dt = dt.datetime.fromisoformat(request.end_time.replace('Z', '+00:00'))
        
        # Create Harmony request
        harmony_request = Request(
            collection=Collection(id=request.collection_id),
            temporal={
                "start": start_dt,
                "stop": end_dt,
            },
        )
        
        # Add spatial filter if provided
        if request.bbox and len(request.bbox) == 4:
            harmony_request.spatial = BBox(
                request.bbox[0],  # west
                request.bbox[1],  # south
                request.bbox[2],  # east
                request.bbox[3]   # north
            )
        
        # Add variables if specified
        if request.variables:
            harmony_request.variables = request.variables
        
        # Submit job
        job_id = client.submit(harmony_request)
        
        # Wait for processing
        client.wait_for_processing(job_id, show_progress=True)
        
        # Download results
        results = client.download_all(job_id, directory="/tmp", overwrite=True)
        result_files = [f.result() for f in results]
        
        if not result_files:
            return TempoDataResponse(
                success=False,
                message="No data files found for the specified parameters"
            )
        
        # Process the first data file for visualization
        datatree = xr.open_datatree(result_files[0])
        
        # Determine variable to plot
        variable_name = "product/vertical_column"
        if request.variables and request.variables[0]:
            variable_name = request.variables[0]
        
        # Create visualization based on plot type
        img_base64 = None
        if request.plot_type == "map":
            img_base64 = create_map_visualization(
                datatree, 
                variable_name, 
                f"TEMPO {variable_name} Map"
            )
        elif request.plot_type == "zonal_mean":
            img_base64 = create_zonal_mean_plot(
                datatree, 
                variable_name, 
                f"TEMPO {variable_name} Zonal Mean"
            )
        elif request.plot_type == "contour":
            img_base64 = create_contour_plot(
                datatree, 
                variable_name, 
                f"TEMPO {variable_name} Contour"
            )
        else:
            return TempoDataResponse(
                success=False,
                message=f"Invalid plot type: {request.plot_type}. Use 'map', 'zonal_mean', or 'contour'"
            )
        
        if img_base64 is None:
            return TempoDataResponse(
                success=False,
                message="Failed to create visualization"
            )
        
        return TempoDataResponse(
            success=True,
            data={
                "job_id": job_id,
                "plot_type": request.plot_type,
                "variable": variable_name,
                "image_base64": img_base64,
                "files_processed": len(result_files)
            },
            message=f"Successfully created {request.plot_type} visualization"
        )
        
    except Exception as e:
        return TempoDataResponse(
            success=False,
            message=f"Error creating visualization: {str(e)}"
        )

@app.get("/tempo/visualize/image/{job_id}")
async def get_visualization_image(
    job_id: str,
    plot_type: str = "map",
    variable: str = "product/vertical_column",
    client: Client = Depends(get_harmony_client),
    token: str = Depends(verify_token)
):
    """
    Get visualization image as PNG
    
    This endpoint returns the visualization as a PNG image that can be
    displayed directly in a web browser or frontend application.
    """
    try:
        # This is a simplified version - in practice you'd store/cache the images
        # For now, we'll return a placeholder or error
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Direct image endpoint not yet implemented. Use /tempo/visualize to get base64 encoded images."
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving image: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False").lower() == "true"
    )
