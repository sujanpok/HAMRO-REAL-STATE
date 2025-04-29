#!/bin/bash

LOG_FILE="/home/pi/FOR_AUTO_DEPLOY/HAMRO-REAL-STATE/AUTO_DEPLOYMENT_APP/deployment.log"
BACKEND_DIR="/home/pi/FOR_BACKEND_API"
BRANCH="BACKENDReleseBranch"
GIT_REPO="https://github.com/sujanpok/HAMRO-REAL-STATE.git"
DEPLOY_APP_DIR="/home/pi/FOR_BACKEND_API/BACKEND_APP"

{
  echo "📥 $(date): Starting deployment..."

  # Always re-create the backend directory
  echo "🧹 Cleaning up and creating $BACKEND_DIR..."
  rm -rf "$BACKEND_DIR"
  mkdir -p "$BACKEND_DIR" || { echo "❌ Failed to create directory."; exit 1; }

  # Clone the repository fresh
  echo "📁 Cloning repository branch $BRANCH..."
  git clone --branch "$BRANCH" --single-branch "$GIT_REPO" "$BACKEND_DIR" || { echo "❌ Failed to clone repository."; exit 1; }

  # Navigate to the deployment app directory for npm install
  echo "📂 Navigating to $DEPLOY_APP_DIR"
  cd "$DEPLOY_APP_DIR" || { echo "❌ Failed to cd into $DEPLOY_APP_DIR"; exit 1; }

  echo "📦 Running npm install in AUTO_DEPLOYMENT_APP..."
  npm install || { echo "❌ npm install failed."; exit 1; }

  echo "🚀 Deployment completed!"

  echo "⏳ Waiting 5 seconds before restarting service..."
  sleep 5

  echo "🔄 Restarting service: hamrorealstate"
  sudo systemctl restart hamrorealstate || { echo "❌ Failed to restart service."; exit 1; }

  echo "✅ Service restarted successfully!"
} >> "$LOG_FILE" 2>&1
