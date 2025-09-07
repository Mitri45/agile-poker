#!/bin/bash

set -e

echo "Starting deployment of Agile Poker..."

# Navigate to the project directory
cd /home/dima/agile-poker

# Build the frontend
echo "Building frontend..."
cd app
npm install
npm run build

# Build the backend
echo "Building backend..."
cd ../server
npm install
npm run build

# Copy frontend build to NGINX root directory
echo "Copying frontend build to NGINX root..."
sudo cp -r ../app/dist/* /var/www/agilepoker/html/

# Restart the backend server with PM2
echo "Restarting backend server with PM2..."
pm2 stop agile-poker || true  # Stop if running
pm2 delete agile-poker || true  # Delete existing process
pm2 start npm --name agile-poker -- run start:prod

echo "Deployment complete! The app should be available at https://agilepoker.madeby.dev"