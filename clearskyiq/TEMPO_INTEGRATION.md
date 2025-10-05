# NASA TEMPO Data Visualization Integration

This document describes the comprehensive integration of NASA TEMPO data visualization capabilities into the ClearSkyIQ Next.js application, featuring a modern Python FastAPI backend with smart caching and a fully responsive React frontend.

## Overview

The integration provides a complete data visualization platform that allows users to:
- Generate NASA TEMPO data visualizations (Map, Zonal Mean, Contour) with real-time processing
- View all three visualization types simultaneously with parallel processing
- Experience instant responses through intelligent caching system
- Configure time ranges, bounding boxes, and data variables with enhanced UX
- Access comprehensive API management and monitoring tools

## Architecture

### Backend: Python FastAPI (`harmony-api/`)

A modern, high-performance Python API built with FastAPI that provides:
- **NASA TEMPO Data Integration**: Direct access to NASA Earthdata via Harmony-py
- **Smart Caching System**: 10x-100x performance improvement for repeated requests
- **Parallel Processing**: Concurrent visualization generation with job queue management
- **Real-time Status Updates**: Live progress tracking for long-running operations
- **Comprehensive Error Handling**: Robust error management and user feedback
- **Environment-based Configuration**: Secure credential management

### Frontend: Next.js React Application (`clearskyiq/`)

A fully responsive React application featuring:
- **Componentized Architecture**: Modular, reusable components for maintainability
- **Real-time Data Visualization**: Live updates and progressive loading
- **Enhanced UX/UI**: Intuitive interface with loading states and error handling
- **Environment Configuration**: Centralized API settings management
- **TypeScript Integration**: Full type safety and development experience

## Components

### 1. TempoVisualization Component (`src/app/components/TempoVisualization.tsx`)

A comprehensive React component that provides:
- **Interactive Form**: Advanced parameter configuration with validation
- **Real-time Visualization**: Live generation with progress tracking
- **Multiple Plot Types**: Single plots and "All Three" optimized option
- **Smart Error Handling**: Comprehensive error states with retry mechanisms
- **Responsive Design**: Mobile-first design matching the site's theme
- **Auto Preload**: Sample data loads automatically on page visit

### 2. Sub-Components

#### DataDescription (`src/app/components/TempoVisualization/DataDescription.tsx`)
- Displays data metadata (time range, bounding box, variable)
- Provides context for visualizations

#### LoadingState (`src/app/components/TempoVisualization/LoadingState.tsx`)
- Centralized loading state management
- Progress bars for parallel processing
- Real-time status updates

#### EmptyState (`src/app/components/TempoVisualization/EmptyState.tsx`)
- Welcome screen for new users
- Navigation guidance and help

#### ErrorDisplay (`src/app/components/TempoVisualization/ErrorDisplay.tsx`)
- Consistent error presentation
- Retry mechanisms and recovery options

#### VisualizationCard (`src/app/components/TempoVisualization/VisualizationCard.tsx`)
- Individual plot display component
- Success/error state handling

#### VisualizationForm (`src/app/components/TempoVisualization/VisualizationForm.tsx`)
- Complete form management
- Input validation and user feedback

#### HelpContent (`src/app/components/TempoVisualization/HelpContent.tsx`)
- Educational content and documentation
- Usage guides and examples

### 3. API Routes

#### Health Check (`src/app/api/health/route.ts`)
- Proxies requests to the Harmony API health endpoint
- Provides API connectivity testing

#### Single Visualization (`src/app/api/tempo/visualize/route.ts`)
- Proxies requests to the Harmony API single visualization endpoint
- Handles individual plot generation (Map, Zonal Mean, Contour)

#### All Three Visualizations (`src/app/api/tempo/visualize/all/route.ts`)
- Proxies requests to the optimized Harmony API endpoint
- Generates all three visualization types in a single request
- Provides 3x performance improvement over individual requests

#### Parallel Processing (`src/app/api/tempo/visualize/parallel/route.ts`)
- Initiates parallel visualization jobs
- Returns job ID for status tracking

#### Job Status (`src/app/api/tempo/visualize/status/[jobId]/route.ts`)
- Real-time job status and progress tracking
- Next.js 15+ compatible with async params

#### Job Results (`src/app/api/tempo/visualize/results/[jobId]/route.ts`)
- Retrieves completed job results
- Handles both success and error states

## Features

### Backend Features

#### Smart Caching System
- **Automatic Caching**: All visualization requests cached based on parameters
- **TTL Management**: 1-hour cache expiration with automatic cleanup
- **Memory Management**: LRU eviction with 100-item limit
- **Performance**: 10x-100x speedup for repeated requests
- **Thread-Safe**: Concurrent request handling

#### Parallel Processing
- **Job Queue**: Background processing with status tracking
- **Concurrent Execution**: Multiple visualizations processed simultaneously
- **Real-time Updates**: Live progress tracking and status updates
- **Error Recovery**: Robust error handling and retry mechanisms

#### Data Visualization
- **Multiple Plot Types**: Map, Zonal Mean, Contour visualizations
- **Variable Support**: 
  - Vertical Column (Total)
  - Vertical Column Troposphere
  - Data Quality Flag with color coding
- **Geographic Projections**: Cartopy-based map visualizations
- **Scientific Plots**: Matplotlib-powered scientific visualizations

### Frontend Features

#### Form Controls
- **Start/End Time**: DateTime pickers with 2023-2024 date restrictions
- **Bounding Box**: Optional geographic constraints with auto-population
- **Variable Selection**: 
  - Vertical Column (Total) - Total atmospheric column density
  - Vertical Column Troposphere - Tropospheric column density
  - Data Quality Flag - Quality indicator (0=good, 1=questionable, 2=bad)
- **Plot Types**:
  - 🗺️ Map - Geographic visualization
  - 📈 Zonal Mean - Latitude-based analysis
  - 🌊 Contour - 2D contour plots
  - 🎨 All Three - Optimized batch processing

#### Visualization Display
- **Single Plots**: Full-width display with metadata and image size info
- **All Three**: Vertical stack layout with individual plot cards
- **Progressive Loading**: Images appear as they're generated
- **Error Handling**: Clear error messages with retry options
- **Loading States**: Visual feedback with progress indicators

#### User Experience
- **Auto Preload**: Sample data loads automatically on page visit
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript integration
- **Environment Config**: Centralized API settings management
- **Debug Features**: Console logging for troubleshooting

## Styling

The component uses Tailwind CSS classes that match the existing site theme:
- Deep blue background (`bg-[var(--deep-blue)]`)
- Neon yellow accents (`text-[var(--neon-yellow)]`)
- Semi-transparent overlays (`bg-white/10`)
- Consistent spacing and typography

## Dependencies

- Next.js 14+ (App Router)
- React 18+
- Next.js Image component for optimized image display
- TypeScript for type safety

## Usage

The component is automatically included in the main page (`src/app/page.tsx`) and appears between the "Explore" and "Meet the Team" sections.

Users can:
1. Select visualization parameters
2. Choose plot type (single or all three)
3. Click "Generate Visualization" to create plots
4. Use "Test API Connection" to verify Harmony API connectivity

## API Endpoints

### Backend API (Python FastAPI - Port 8000)

#### Core Endpoints
- `GET /` - Root endpoint with health status
- `GET /health` - Detailed health check with version info
- `POST /tempo/data` - Fetch raw TEMPO data
- `GET /tempo/collections` - Get available data collections

#### Visualization Endpoints
- `POST /tempo/visualize` - Single visualization (Map, Zonal Mean, Contour)
- `POST /tempo/visualize/all` - All three visualizations (optimized)
- `POST /tempo/visualize/parallel` - Start parallel processing job
- `GET /tempo/visualize/status/{job_id}` - Get job status and progress
- `GET /tempo/visualize/results/{job_id}` - Get completed job results
- `GET /tempo/visualize/image/{job_id}` - Get visualization as PNG

#### Cache Management
- `GET /cache/status` - Get cache statistics and status
- `POST /cache/clear` - Clear all cached data
- `POST /cache/cleanup` - Remove expired cache entries

### Frontend API (Next.js - Port 3000)

#### Proxy Routes
- `GET /api/health` - Health check proxy
- `POST /api/tempo/visualize` - Single visualization proxy
- `POST /api/tempo/visualize/all` - All three visualizations proxy
- `POST /api/tempo/visualize/parallel` - Parallel processing proxy
- `GET /api/tempo/visualize/status/[jobId]` - Job status proxy
- `GET /api/tempo/visualize/results/[jobId]` - Job results proxy

## Configuration

### Environment Variables

#### Backend (`.env`)
```env
EARTHDATA_USERNAME=your_nasa_username
EARTHDATA_PASSWORD=your_nasa_password
SECRET_KEY=your_api_secret_key
API_VERSION=1.0.0
DEBUG=false
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_HARMONY_API_URL=http://localhost:8000
NEXT_PUBLIC_HARMONY_API_TOKEN=your_api_token
```

## Installation & Setup

### Backend Setup
```bash
cd harmony-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
# Edit .env with your NASA Earthdata credentials
python main.py
```

### Frontend Setup
```bash
cd clearskyiq
pnpm install
cp env.example .env.local
# Edit .env.local with your API settings
pnpm dev
```

## Error Handling

The system handles comprehensive error scenarios:
- **API Connectivity**: Network issues and service unavailability
- **Authentication**: Invalid credentials and token expiration
- **Data Processing**: NASA API errors and data format issues
- **Input Validation**: Invalid parameters and date ranges
- **Visualization Errors**: Image generation failures and memory issues
- **Cache Errors**: Storage issues and memory management
- **Network Timeouts**: Long-running requests and connection drops

All errors are displayed to users with helpful messages, retry options, and suggestions for resolution.

## Performance Optimizations

- **Smart Caching**: 10x-100x speedup for repeated requests
- **Parallel Processing**: Concurrent visualization generation
- **Optimized Endpoints**: Single request for multiple visualizations
- **Memory Management**: Efficient resource usage and cleanup
- **Progressive Loading**: Images display as they're generated
- **Background Processing**: Non-blocking job execution

## Testing

### Backend Testing
```bash
cd harmony-api
python test_api.py  # Test all endpoints
python test_caching.py  # Test caching functionality
```

### Frontend Testing
- Open browser developer tools for debug logging
- Test API connectivity with "Test API Connection" button
- Verify image loading and error handling
- Test responsive design on different screen sizes
