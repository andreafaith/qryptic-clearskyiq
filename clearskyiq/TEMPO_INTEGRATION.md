# NASA TEMPO Data Visualization Integration

This document describes the integration of NASA TEMPO data visualization capabilities into the ClearSkyIQ Next.js application with a comprehensive Python API backend.

## Overview

The integration provides a complete end-to-end solution for NASA TEMPO data visualization:
- **Python FastAPI Backend**: Secure, high-performance API with caching and parallel processing
- **Next.js Frontend**: Modern, responsive interface with automatic preloading
- **Real-time Visualizations**: Map, Zonal Mean, and Contour plots with instant display
- **Smart Caching**: 10x-100x performance improvement for repeated requests
- **Environment Configuration**: Secure API credentials and URL management

## Architecture

### Backend (Python FastAPI)
- **Location**: `harmony-api/`
- **Port**: 8000
- **Features**: Caching, parallel processing, authentication, data visualization
- **Dependencies**: FastAPI, Harmony-py, Matplotlib, Cartopy, Xarray

### Frontend (Next.js)
- **Location**: `clearskyiq/`
- **Port**: 3000
- **Features**: Componentized UI, environment configuration, real-time updates
- **Dependencies**: Next.js 15+, React 18+, TypeScript

## Components

### 1. TempoVisualization Component (`src/app/components/TempoVisualization.tsx`)

A comprehensive React component with:
- **Automatic Preloading**: Sample data loads on page visit
- **Componentized Architecture**: Broken into 7 smaller, reusable components
- **Real-time Updates**: Progressive loading of visualizations
- **Error Handling**: Comprehensive error states with retry functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS

#### Sub-components:
- `DataDescription.tsx` - Shows data context and metadata
- `LoadingState.tsx` - Progress indicators and status updates
- `EmptyState.tsx` - Welcome screen and navigation
- `ErrorDisplay.tsx` - Error messages with retry options
- `VisualizationCard.tsx` - Individual plot display
- `VisualizationForm.tsx` - Parameter input form
- `HelpContent.tsx` - Educational content and guidance

### 2. API Routes (Next.js Proxy)

#### Health Check (`src/app/api/health/route.ts`)
- Proxies to Harmony API health endpoint
- Provides API connectivity testing

#### Single Visualization (`src/app/api/tempo/visualize/route.ts`)
- Proxies to Harmony API single visualization endpoint
- Handles individual plot generation

#### All Three Visualizations (`src/app/api/tempo/visualize/all/route.ts`)
- Proxies to optimized Harmony API endpoint
- Generates all three visualization types in one request

#### Parallel Processing (`src/app/api/tempo/visualize/parallel/route.ts`)
- Proxies to Harmony API parallel processing endpoint
- Handles background job management

#### Job Status (`src/app/api/tempo/visualize/status/[jobId]/route.ts`)
- Proxies to Harmony API job status endpoint
- Real-time progress tracking

#### Job Results (`src/app/api/tempo/visualize/results/[jobId]/route.ts`)
- Proxies to Harmony API job results endpoint
- Retrieves completed visualizations

### 3. Configuration (`src/lib/config.ts`)
- Centralized API configuration
- Environment variable management
- Endpoint URL generation

## Features

### Backend Features (Python API)
- **Smart Caching**: 1-hour TTL with automatic cleanup
- **Parallel Processing**: Multi-threaded visualization generation
- **Authentication**: Bearer token security
- **Data Quality Support**: Special handling for quality flags
- **Error Recovery**: Comprehensive error handling and logging
- **Memory Management**: LRU cache with size limits

### Frontend Features (Next.js)
- **Auto Preloading**: Sample data loads immediately on page visit
- **Progressive Loading**: Images appear as they're generated
- **Component Architecture**: 7 reusable, focused components
- **Environment Config**: Secure API credentials management
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first, accessible interface

### Form Controls
- **Start/End Time**: DateTime pickers with 2023-2024 range restrictions
- **Bounding Box**: Optional geographic constraints with auto-population
- **Variable Selection**: 
  - Vertical Column (Total)
  - Vertical Column Troposphere
  - Data Quality Flag (with color coding)
- **Plot Types**:
  - 🗺️ Map (Geographic visualization)
  - 📈 Zonal Mean (Latitude analysis)
  - 🌊 Contour (2D data representation)
  - 🎨 All Three (Optimized batch processing)

### Visualization Display
- **Single Plots**: Full-width display with metadata and size info
- **All Three**: Vertical stack layout with individual plot cards
- **Real-time Updates**: Progress indicators and status messages
- **Error Handling**: Clear error messages with retry options
- **Loading States**: Visual feedback with progress tracking

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

### Python FastAPI Backend (`http://localhost:8000`)

#### Core Endpoints
- `GET /` - Root health check
- `GET /health` - Detailed health status
- `POST /tempo/data` - Raw data fetching
- `GET /tempo/collections` - Available data collections

#### Visualization Endpoints
- `POST /tempo/visualize` - Single visualization generation
- `POST /tempo/visualize/all` - All three visualizations (optimized)
- `POST /tempo/visualize/parallel` - Parallel processing job start
- `GET /tempo/visualize/status/{job_id}` - Job status and progress
- `GET /tempo/visualize/results/{job_id}` - Completed job results
- `GET /tempo/visualize/image/{job_id}` - Direct image access

#### Cache Management
- `GET /cache/status` - Cache statistics and status
- `POST /cache/clear` - Clear all cached data
- `POST /cache/cleanup` - Remove expired entries

### Next.js Frontend (`http://localhost:3000`)

#### Proxy Routes
- `GET /api/health` - Health check proxy
- `POST /api/tempo/visualize` - Single visualization proxy
- `POST /api/tempo/visualize/all` - All three visualizations proxy
- `POST /api/tempo/visualize/parallel` - Parallel processing proxy
- `GET /api/tempo/visualize/status/[jobId]` - Job status proxy
- `GET /api/tempo/visualize/results/[jobId]` - Job results proxy

## Environment Configuration

### Backend (`.env`)
```env
EARTHDATA_USERNAME=your_nasa_username
EARTHDATA_PASSWORD=your_nasa_password
SECRET_KEY=your_secure_api_token
API_VERSION=1.0.0
DEBUG=false
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_HARMONY_API_URL=http://localhost:8000
NEXT_PUBLIC_HARMONY_API_TOKEN=your_secure_api_token
```

## Error Handling

### Backend Error Handling
- **Authentication**: Bearer token validation
- **Data Processing**: Graceful handling of NASA API failures
- **Memory Management**: Automatic cache cleanup and size limits
- **Thread Safety**: Lock-based concurrent access protection

### Frontend Error Handling
- **API Connectivity**: Connection testing and retry mechanisms
- **Data Validation**: Input parameter validation and sanitization
- **Network Issues**: Timeout handling and user feedback
- **Image Loading**: Fallback states for failed visualizations
- **Type Safety**: TypeScript error prevention and runtime checks

## Performance Optimizations

### Caching System
- **TTL**: 1-hour cache expiration
- **Size Limit**: 100 cached items maximum
- **LRU Eviction**: Automatic cleanup of oldest entries
- **Thread Safety**: Concurrent access protection

### API Optimizations
- **Batch Processing**: Single request for all three visualizations
- **Parallel Processing**: Multi-threaded image generation
- **Memory Management**: Efficient data structure handling
- **Error Recovery**: Graceful failure handling

### Frontend Optimizations
- **Component Splitting**: Smaller, focused components
- **Lazy Loading**: Progressive image display
- **Environment Config**: Centralized API management
- **Type Safety**: Compile-time error prevention
