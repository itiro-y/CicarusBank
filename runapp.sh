#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Shutting down any current containers"
sudo docker compose down

# Run Maven wrapper to clean and package the project
echo "Running Maven clean and package..."
./mvnw clean package

# Run Docker Compose with sudo, build and start containers in detached mode
echo "Building and starting Docker containers..."
sudo docker compose up --build -d

echo "Done."
