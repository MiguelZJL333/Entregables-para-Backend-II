#!/bin/bash
# Script para construir y subir imagen a DockerHub
# Uso: ./scripts/build-docker.sh <dockerhub-username>

set -e

DOCKER_USERNAME=${1:-"miguelzambrano"}
IMAGE_NAME="backend-ecommerce"
VERSION="1.0.0"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"
LATEST_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:latest"

echo "============================================="
echo "  Build Docker Image - Backend E-commerce"
echo "============================================="

# Login a DockerHub
echo ""
echo "Por favor, inicia sesion en DockerHub:"
docker login

# Build de la imagen con version
echo ""
echo "Construyendo imagen ${FULL_IMAGE_NAME}..."
docker build -t ${FULL_IMAGE_NAME} .

# Tag para latest
echo ""
echo "Creando tag latest..."
docker tag ${FULL_IMAGE_NAME} ${LATEST_IMAGE}

# Push de ambas versiones
echo ""
echo "Subiendo imagen a DockerHub..."
docker push ${FULL_IMAGE_NAME}
docker push ${LATEST_IMAGE}

echo ""
echo "============================================="
echo "  Imagen subida exitosamente!"
echo "  URL: https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo "============================================="