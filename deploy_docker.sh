#!/bin/bash

LOG_FILE="/home/pi/HAMRO_DEPLOY_LOGS/deployment.log"
APP_DIR="/home/pi/HAMRO_REALSTATE"
BRANCH="BACKENDReleseBranch"
GIT_REPO="https://github.com/sujanpok/HAMRO-REAL-STATE.git"

{
  echo "📥 $(date): Starting Docker-based deployment..."

  # Clean and re-clone the repository
  echo "🧹 Cleaning and cloning fresh code..."
  rm -rf "$APP_DIR"
  git clone --branch "$BRANCH" --single-branch "$GIT_REPO" "$APP_DIR" || { echo "❌ Git clone failed."; exit 1; }

  # Navigate to project directory
  cd "$APP_DIR" || { echo "❌ Cannot enter project directory."; exit 1; }

  echo "🐳 Stopping and removing old containers..."
  docker-compose down || echo "⚠️ No containers to stop."

  echo "🔧 Rebuilding Docker images..."
  docker-compose build --no-cache || { echo "❌ Docker build failed."; exit 1; }

  echo "🚀 Starting containers..."
  docker-compose up -d || { echo "❌ Docker up failed."; exit 1; }

  echo "✅ Deployment completed successfully."

} >> "$LOG_FILE" 2>&1
