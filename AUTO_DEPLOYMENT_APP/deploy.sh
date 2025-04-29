#!/bin/bash

LOG_FILE="../AUTO_DEPLOYMENT_APP/deployment.log"
BACKEND_DIR="/home/pi/FOR_BACKEND_API/"
BRANCH="BACKENDReleseBranch"
GIT_REPO="https://github.com/sujanpok/HAMRO-REAL-STATE.git"

{
  echo "📥 $(date): Starting deployment..."

  # Clone repo if not present
  if [ ! -d "$BACKEND_DIR" ]; then
    echo "📁 BACKEND_APP not found. Cloning repository branch $BRANCH..."
    git clone --branch "$BRANCH" --single-branch "$GIT_REPO" "$BACKEND_DIR" || { echo "❌ Failed to clone repository."; exit 1; }
  fi

  # Navigate to the backend directory
  cd "$BACKEND_DIR" || { echo "❌ Failed to cd into $BACKEND_DIR"; exit 1; }

  # Ensure correct Git remote and branch
  echo "🔁 Setting Git remote to $GIT_REPO"
  git remote set-url origin "$GIT_REPO"
  git fetch origin

  echo "🔄 Checking out branch $BRANCH"
  git checkout "$BRANCH" || git checkout -b "$BRANCH" "origin/$BRANCH"

  echo "⬇️ Pulling latest changes..."
  git pull origin "$BRANCH"

  # Install Node.js dependencies
  echo "📦 Running npm install..."
  npm install || { echo "❌ npm install failed."; exit 1; }

  # Optional: build if using TypeScript, React, etc.
  # echo "🏗️ Building project..."
  # npm run build || { echo "❌ npm run build failed."; exit 1; }

  echo "🚀 Deployment completed!"

  echo "⏳ Waiting 5 seconds before restarting service..."
  sleep 5

  echo "🔄 Restarting service: hamrorealstate"
  sudo systemctl restart hamrorealstate || { echo "❌ Failed to restart service."; exit 1; }

  echo "✅ Service restarted successfully!"
} >> "$LOG_FILE" 2>&1
