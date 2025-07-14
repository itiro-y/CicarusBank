#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

SERVICE_NAME=$1

if [ -z "$SERVICE_NAME" ]; then
    echo "No service name provided. Building and starting all services."
    echo "Shutting down any current containers"
    sudo docker compose down

    echo "Running Maven clean and package for all modules..."
    ./mvnw clean package

    echo "Building and starting all Docker containers..."
    sudo docker compose up --build -d
else
    echo "Building and starting only the '$SERVICE_NAME' service."

    # Check if the service directory exists
    if [ ! -d "$SERVICE_NAME" ]; then
        echo "Error: Service directory '$SERVICE_NAME' not found."
        exit 1
    fi

    echo "Shutting down '$SERVICE_NAME' container..."
    # Use || true to prevent script from exiting if the container is not running
    sudo docker compose stop "$SERVICE_NAME" || true

    echo "Running Maven clean and package for '$SERVICE_NAME' module..."
    # Assuming the service name matches the module directory name (e.g., 'account', 'auth')
    ./mvnw clean package -pl "$SERVICE_NAME"

    echo "Building '$SERVICE_NAME' Docker container..."
    sudo docker compose build "$SERVICE_NAME"

    echo "Starting '$SERVICE_NAME' Docker container..."
    sudo docker compose up -d "$SERVICE_NAME"
fi

echo "Done."