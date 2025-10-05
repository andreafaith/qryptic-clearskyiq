# ClearSkyIQ - NASA Space Apps Challenge 2025

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge%202025-blue)](https://www.spaceappschallenge.org/2025/find-a-team/qryptic/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**ClearSkyIQ** is a comprehensive air quality monitoring and prediction platform that combines NASA TEMPO satellite data with machine learning models to provide real-time atmospheric pollution visualization and forecasting capabilities. This project was developed for the [2025 NASA Space Apps Challenge](https://www.spaceappschallenge.org/2025/find-a-team/qryptic/) by team **qryptic**.

## Project Overview

ClearSkyIQ addresses the critical need for accessible, real-time air quality monitoring by integrating multiple data sources and advanced visualization techniques. The platform provides:

- **Real-time NASA TEMPO Data Visualization**: Interactive maps, zonal mean plots, and contour visualizations
- **Machine Learning Forecasting**: AI-powered air quality predictions using ensemble models
- **Multi-dimensional Analysis**: 3D atmospheric layer views and pollutant composition analysis
- **Historical Trend Analysis**: Long-term pollution pattern recognition and seasonal cycle visualization
- **Comparative City Dashboard**: Side-by-side air quality comparisons across regions

## Architecture

The project consists of three main components:

```
cskyiq/
├── clearskyiq/          # Next.js Frontend Application
├── harmony-api/         # Python FastAPI Backend
└── ml/                  # Machine Learning Models & Notebooks
```

### Frontend (`clearskyiq/`)
- **Framework**: Next.js 15.5.4 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Features**: 
  - Interactive NASA TEMPO data visualization
  - Machine learning model exploration interface
  - Responsive design with mobile-first approach
  - Real-time data updates and progress tracking

### Backend (`harmony-api/`)
- **Framework**: FastAPI with Python 3.11+
- **Data Source**: NASA TEMPO via Harmony-py
- **Features**:
  - Secure API with token-based authentication
  - Smart caching system (10x-100x performance improvement)
  - Parallel processing for multiple visualizations
  - Real-time job status tracking
  - Comprehensive error handling and recovery

### Machine Learning (`ml/`)
- **Models**: Ensemble of CatBoost, LightGBM, and Neural Networks
- **Applications**: Air quality prediction, wildfire risk assessment
- **Data Processing**: Advanced feature engineering and time series analysis
- **Deployment**: TensorFlow SavedModel format for production

## Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Python** 3.11+
- **NASA Earthdata Account** (for TEMPO data access)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cskyiq.git
cd cskyiq
```

### 2. Setup Backend (Harmony API)

```bash
cd harmony-api

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp env.example .env
# Edit .env with your NASA Earthdata credentials

# Run the API
python main.py
```

The API will be available at `http://localhost:8000`

### 3. Setup Frontend (Next.js)

```bash
cd clearskyiq

# Install dependencies
pnpm install

# Configure environment
cp env.example .env.local
# Edit .env.local with API configuration

# Run development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 4. Setup Machine Learning Models

```bash
cd ml

# Install ML dependencies
pip install -r requirements.txt

# Run Jupyter notebooks for model training
jupyter notebook tempo.ipynb
jupyter notebook airquality/AirQuality.ipynb
```

## Features

### NASA TEMPO Data Visualization

- **Geographic Maps**: Real-time pollution visualization across North America
- **Zonal Mean Plots**: Latitude-based pollution analysis
- **Contour Plots**: Detailed 2D atmospheric data representation
- **Data Quality Flags**: Visual indicators for data reliability
- **Time Range Selection**: Flexible temporal data filtering (2023-2024)
- **Bounding Box Filtering**: Geographic region customization

### Machine Learning Capabilities

- **Air Quality Forecasting**: 48-hour AQI predictions with confidence intervals
- **Wildfire Risk Assessment**: Fire danger prediction using meteorological data
- **Ensemble Modeling**: Combined CatBoost, LightGBM, and Neural Network predictions
- **Feature Engineering**: Advanced time series and meteorological feature extraction
- **Model Interpretability**: SHAP values and feature importance analysis

### Interactive Dashboards

- **Dynamic Air Quality Timeline**: Time-lapse visualization with color gradients
- **3D Atmospheric Layer View**: Vertical pollutant dispersion visualization
- **Comparative City Dashboard**: Multi-region air quality comparison
- **Pollutant Composition Wheel**: Radial chart showing pollutant breakdown
- **Correlation Heatmap**: Relationship analysis between pollutants and weather
- **Historical Trend Explorer**: Long-term pattern analysis with animations

## API Endpoints for Harmony Api

### Core Endpoints
- `GET /` - Health check
- `GET /health` - Detailed system status
- `POST /tempo/data` - Raw TEMPO data fetching
- `GET /tempo/collections` - Available data collections

### Visualization Endpoints
- `POST /tempo/visualize` - Single visualization generation
- `POST /tempo/visualize/all` - All three visualizations (optimized)
- `POST /tempo/visualize/parallel` - Parallel processing job start
- `GET /tempo/visualize/status/{job_id}` - Job status and progress
- `GET /tempo/visualize/results/{job_id}` - Completed job results

### Cache Management
- `GET /cache/status` - Cache statistics
- `POST /cache/clear` - Clear all cached data
- `POST /cache/cleanup` - Remove expired entries

## Development

### Project Structure

```
cskyiq/
├── clearskyiq/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/        # React components
│   │   │   │   └── TempoVisualization/  # TEMPO visualization components
│   │   │   ├── api/              # API proxy routes
│   │   │   └── ml/               # ML dashboard page
│   │   └── lib/                  # Configuration and utilities
│   ├── public/                   # Static assets
│   └── package.json
├── harmony-api/                   # Python FastAPI Backend
│   ├── main.py                   # Main application
│   ├── requirements.txt          # Python dependencies
│   ├── env.example              # Environment template
│   └── README.md                # API documentation
└── ml/                          # Machine Learning
    ├── airquality/              # Air quality models
    ├── wildfire/                # Wildfire prediction models
    ├── tempo.ipynb             # TEMPO data analysis
    ├── stacked_model.pkl       # Trained ensemble model
    └── requirements.txt        # ML dependencies
```

### Environment Configuration

#### Backend (`.env`)
```env
EARTHDATA_USERNAME=your_nasa_username
EARTHDATA_PASSWORD=your_nasa_password
SECRET_KEY=your_secure_api_token
API_VERSION=1.0.0
DEBUG=false
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_HARMONY_API_URL=http://localhost:8000
NEXT_PUBLIC_HARMONY_API_TOKEN=your_secure_api_token
```

## Deployment

### Docker Deployment

The backend is containerized and ready for deployment:

```bash
cd harmony-api

# Build Docker image
docker build -t clearskyiq-api .

# Run container
docker run -p 8000:8000 --env-file .env clearskyiq-api
```

### VPS Deployment

See `HOSTINGER_VPS_SETUP_GUIDE.md` for comprehensive VPS deployment instructions including:
- Multi-app Docker hosting setup
- Nginx reverse proxy configuration
- SSL certificate management with Let's Encrypt
- Domain and subdomain configuration

## Performance Optimizations

### Caching System
- **TTL**: 1-hour cache expiration
- **Size Limit**: 100 cached items maximum
- **LRU Eviction**: Automatic cleanup of oldest entries
- **Thread Safety**: Concurrent access protection

### API Optimizations
- **Batch Processing**: Single request for multiple visualizations
- **Parallel Processing**: Multi-threaded image generation
- **Memory Management**: Efficient data structure handling
- **Error Recovery**: Graceful failure handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

**qryptic** - NASA Space Apps Challenge 2025

- **Andrea Faith Alimorong** - Lead Engineer
- **Loyd Martin Vendiola** - Cloud Engineer  
- **Harold Martin Patacsil** - Frontend Engineer
- **Scheidj Bleu Villados** - Backend Engineer
- **Francheska Ivonne Ojastro** - UI Designer

## Links

- [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/2025/find-a-team/qryptic/)
- [NASA TEMPO Mission](https://www.earthdata.nasa.gov/data/instruments/tempo)
- [NASA Earthdata](https://www.earthdata.nasa.gov/)
- [Harmony-py Documentation](https://nasa.github.io/ASDC_Data_and_User_Services/TEMPO/how_to_examine_TEMPO_data_using_harmony-py.html)

## Acknowledgments

- NASA for providing TEMPO satellite data
- NASA Space Apps Challenge for the platform and support
- The open-source community for the amazing tools and libraries
- Our mentors and supporters throughout the development process

---

**Built for the 2025 NASA Space Apps Challenge**
