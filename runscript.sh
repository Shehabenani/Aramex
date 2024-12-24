#!/bin/bash

#chmod +x runscript.sh
#Aramex % ./runscript.sh
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
RESET="\033[0m"

set -e

log() {
    echo -e "${GREEN}[INFO]${RESET} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${RESET} $1"
}

error() {
    echo -e "${RED}[ERROR]${RESET} $1"
    exit 1
}

# Create a Docker network if it doesn't exist
log "Creating Docker network..."
docker network create aramex-network 2>/dev/null || true

# Start MongoDB container
log "Starting MongoDB container..."
docker run -d --name mongodb \
    --network aramex-network \
    -p 27017:27017 \
    mongo || error "Failed to start MongoDB container!"

log "Building frontend Docker image..."
(
    cd AramexFrontEnd || error "AramexFrontEnd directory not found!"
    docker build -t aramex-frontend . || error "Failed to build the frontend Docker image!"
)

log "Starting the aramex-frontend container..."
docker run -d --name aramex-frontend \
    --network aramex-network \
    -p 4000:4000 \
    aramex-frontend || error "Failed to start the frontend container!"

log "Building backend image..."
(
    cd Backend || error "Backend directory not found!"
    docker build -t aramex-backend . || error "Failed to build the backend Docker image!"
)

log "Starting the aramex-backend container..."
docker run -d --name aramex-backend \
    --network aramex-network \
    -p 8000:8000 \
    -e MONGO_URL='mongodb://mongodb:27017' \
    aramex-backend || error "Failed to start the backend container!"

log "Verifying each container status..."
docker ps --filter "network=aramex-network" || warn "Some containers may not be running as expected."

log "All containers are running."
log "Frontend is accessible at http://localhost:4000"
log "Backend API is accessible at http://localhost:8000"
log "MongoDB is running locally at mongodb://localhost:27017"