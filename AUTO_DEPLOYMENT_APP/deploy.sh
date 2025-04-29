#!/bin/bash

LOG_FILE="../AUTO_DEPLOYMENT_APP/deployment.log"
BACKEND_DIR="../BACKEND_APP"
BRANCH="BACKENDReleseBranch"

{
  echo "📥 $(date): Switching to $BRANCH and pulling latest code in $BACKEND_DIR..."
  cd "$BACKEND_DIR" || { echo "❌ Failed to cd into $BACKEND_DIR"; exit 1; }
  
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"

  echo "📦 Installing dependencies..."
  npm install

  echo "🔁 Restarting hamrorealstate service..."
  sudo systemctl restart hamrorealstate

  echo "🔁 Restarting cloudflared service..."
  sudo systemctl restart cloudflared

  echo "✅ Deployment from $BRANCH completed at $(date)"
} 2>&1 | tee -a "$LOG_FILE"
