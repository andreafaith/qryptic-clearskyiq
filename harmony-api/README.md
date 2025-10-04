# Harmony API

A modern, secure FastAPI backend for fetching NASA TEMPO data using Harmony-py.

## Features

- 🔐 **Secure API** with token-based authentication
- 🌍 **NASA TEMPO Data** integration via Harmony-py
- ⚡ **FastAPI** for high-performance async operations
- 🛡️ **Input validation** with Pydantic models
- 📊 **Data processing** with xarray and numpy
- 🚀 **Easy deployment** with virtual environment

## Quick Start

### 1. Setup Virtual Environment

```bash
cd harmony-api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp env.example .env
# Edit .env with your NASA Earthdata credentials
```

Required environment variables:
- `EARTHDATA_USERNAME`: Your NASA Earthdata username
- `EARTHDATA_PASSWORD`: Your NASA Earthdata password
- `SECRET_KEY`: API authentication token (change from default)

### 4. Run the API

```bash
python main.py
```

The API will be available at `http://localhost:8001`

## API Endpoints

### Health Check
- `GET /` - Root endpoint with health status
- `GET /health` - Detailed health check

### TEMPO Data
- `POST /tempo/data` - Fetch TEMPO data with time range and optional spatial filter
- `GET /tempo/collections` - Get available data collections

## Usage Examples

### Fetch TEMPO Data

```bash
curl -X POST "http://localhost:8001/tempo/data" \
  -H "Authorization: Bearer harmony-api-secret-key-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{
    "start_time": "2023-12-30T22:30:00",
    "end_time": "2023-12-30T22:45:00",
    "bbox": [-115, 35, -95, 45],
    "variables": ["vertical_column"]
  }'
```

### Health Check

```bash
curl "http://localhost:8001/health"
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8001/docs`
- ReDoc: `http://localhost:8001/redoc`

## Security

- Token-based authentication using Bearer tokens
- Input validation and sanitization
- CORS middleware for cross-origin requests
- Environment-based configuration

## Development

### Project Structure

```
harmony-api/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── env.example         # Environment variables template
├── README.md           # This file
└── venv/               # Virtual environment (created)
```

### Adding New Features

1. Add new endpoints in `main.py`
2. Update Pydantic models for request/response validation
3. Add tests for new functionality
4. Update documentation

## Dependencies

- **FastAPI**: Modern web framework
- **harmony-py**: NASA Harmony client
- **xarray**: Multi-dimensional data arrays
- **numpy**: Numerical computing
- **cartopy**: Geospatial data processing
- **matplotlib**: Data visualization

## License

MIT License - see LICENSE file for details.
