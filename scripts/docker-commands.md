# DOCKER COMMANDS FOR MANUAL EXECUTION
# =====================================

# Build image locally
docker build -t backend-ecommerce:1.0.0 .

# Tag for DockerHub
docker tag backend-ecommerce:1.0.0 miguelzambrano/backend-ecommerce:1.0.0
docker tag backend-ecommerce:1.0.0 miguelzambrano/backend-ecommerce:latest

# Login to DockerHub
docker login

# Push to DockerHub
docker push miguelzambrano/backend-ecommerce:1.0.0
docker push miguelzambrano/backend-ecommerce:latest

# Pull from DockerHub
docker pull miguelzambrano/backend-ecommerce:1.0.0

# Run container
docker run -d -p 8080:8080 \
  -e URL_MONGODB=mongodb://localhost:27017/ecommerce \
  -e JWT_SECRET=your-secret-key \
  --name backend-ecommerce \
  miguelzambrano/backend-ecommerce:1.0.0

# Run with docker-compose
docker-compose up -d

# View logs
docker logs -f backend-ecommerce

# Stop and remove
docker stop backend-ecommerce && docker rm backend-ecommerce