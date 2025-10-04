"""
Harmony API - NASA TEMPO Data API using Harmony-py
A modern, secure FastAPI backend for fetching NASA TEMPO data
"""

import os
import datetime as dt
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
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

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    version: str

# Global variables
harmony_client: Optional[Client] = None

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False").lower() == "true"
    )
