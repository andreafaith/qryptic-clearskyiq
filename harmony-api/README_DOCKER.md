# ClearSkyIQ Harmony API - Docker Deployment Guide

This guide covers building, pushing, and deploying the ClearSkyIQ Harmony API using Docker with persistent storage for VPS deployment.

## Quick Start

### 1. Build and Test Locally

```bash
# Build the Docker image
./build.sh

# Test locally with persistent storage
docker-compose up -d

# Check if it's running
curl http://localhost:8000/health
```

### 2. Push to DockerHub

```bash
# Login to DockerHub
docker login

# Push the image
docker push ${dockerhub_username}/clearskyiq-harmony-api:latest

# Optional: Tag and push specific version
docker tag ${dockerhub_username}/clearskyiq-harmony-api:latest ${dockerhub_username}/clearskyiq-harmony-api:v1.0.0
docker push ${dockerhub_username}/clearskyiq-harmony-api:v1.0.0
```

### 3. Deploy to VPS

```bash
# On your VPS, clone the repository
git clone <your-repo-url>
cd cskyiq/harmony-api

# Configure environment
cp env.docker .env
# Edit .env with your NASA Earthdata credentials

# Deploy
./deploy-vps.sh
```

## Persistent Storage Features

The Docker setup includes persistent storage for:

### Cache Storage (`/app/cache`)
- **SQLite Database**: Persistent cache with TTL and LRU eviction
- **Survives Restarts**: All cached data persists between container restarts
- **Performance**: 10x-100x faster response for repeated queries
- **Automatic Cleanup**: Expired entries are automatically removed

### Data Storage (`/app/data`)
- **Visualizations**: Saved PNG images for all generated plots
- **Query Results**: JSON metadata for all processed queries
- **Metadata**: Plot parameters, timestamps, and processing info
- **Backup Ready**: Data can be easily backed up and restored

### Logs (`/app/logs`)
- **Application Logs**: All API logs and error messages
- **Access Logs**: Request tracking and performance metrics
- **Debug Info**: Detailed logging for troubleshooting

## Docker Compose Files

### Development (`docker-compose.yml`)
- Uses local build
- Mounts local directories for development
- Includes health checks

### Production (`docker-compose.prod.yml`)
- Uses DockerHub image: `${dockerhub_username}/clearskyiq-harmony-api:latest`
- Persistent volumes for data retention
- Resource limits for VPS optimization
- Automatic restart policies

## Environment Configuration

Create a `.env` file with your credentials:

```env
# NASA Earthdata Credentials
EARTHDATA_USERNAME=your_nasa_username
EARTHDATA_PASSWORD=your_nasa_password

# API Configuration
SECRET_KEY=your_secure_api_token
API_VERSION=1.0.0
DEBUG=false
```

## VPS Deployment Steps

### 1. Prepare VPS

```bash
# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd cskyiq/harmony-api

# Configure environment
cp env.docker .env
nano .env  # Edit with your credentials

# Deploy
./deploy-vps.sh
```

### 3. Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Test API
curl http://your-vps-ip:8000/health
```

## Data Persistence

### Cache Management

```bash
# View cache statistics
curl -H "Authorization: Bearer your-token" http://your-vps-ip:8000/cache/status

# Clear cache
curl -X POST -H "Authorization: Bearer your-token" http://your-vps-ip:8000/cache/clear

# Cleanup expired entries
curl -X POST -H "Authorization: Bearer your-token" http://your-vps-ip:8000/cache/cleanup
```

### Data Backup

```bash
# Backup persistent data
docker run --rm -v harmony_data_prod:/data -v $(pwd):/backup alpine tar czf /backup/harmony-data-backup.tar.gz -C /data .

# Restore data
docker run --rm -v harmony_data_prod:/data -v $(pwd):/backup alpine tar xzf /backup/harmony-data-backup.tar.gz -C /data
```

## Monitoring and Maintenance

### Health Checks

```bash
# Container health
docker ps

# API health
curl http://your-vps-ip:8000/health

# Detailed status
curl http://your-vps-ip:8000/cache/status
```

### Log Management

```bash
# View recent logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs harmony-api
```

### Updates

```bash
# Pull latest image
docker pull ${dockerhub_username}/clearskyiq-harmony-api:latest

# Restart with new image
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   # Check logs
   docker-compose -f docker-compose.prod.yml logs
   
   # Check environment variables
   docker-compose -f docker-compose.prod.yml config
   ```

2. **API not responding**
   ```bash
   # Check if container is running
   docker ps
   
   # Check port binding
   netstat -tlnp | grep 8000
   ```

3. **Cache issues**
   ```bash
   # Clear cache
   curl -X POST -H "Authorization: Bearer your-token" http://your-vps-ip:8000/cache/clear
   ```

### Performance Optimization

1. **Increase cache size** (edit docker-compose.prod.yml):
   ```yaml
   environment:
     - CACHE_MAX_SIZE=2000
     - CACHE_TTL_HOURS=48
   ```

2. **Resource limits** (already configured):
   ```yaml
   deploy:
     resources:
       limits:
         memory: 2G
         cpus: '1.0'
   ```

## Security Considerations

1. **Change default SECRET_KEY** in production
2. **Use HTTPS** with reverse proxy (Nginx)
3. **Firewall rules** to restrict access
4. **Regular updates** of the Docker image
5. **Monitor logs** for suspicious activity

## API Endpoints

- `GET /health` - Health check
- `GET /docs` - API documentation
- `POST /tempo/visualize` - Create visualizations
- `GET /cache/status` - Cache statistics
- `POST /cache/clear` - Clear cache

## Support

For issues and questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Test API endpoints
4. Check Docker container status
