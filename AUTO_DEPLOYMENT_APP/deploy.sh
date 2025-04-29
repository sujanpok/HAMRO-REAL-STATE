#!/bin/bash

LOG_FILE="../AUTO_DEPLOYMENT_APP/deployment.log"
BACKEND_DIR="../BACKEND_APP"
BRANCH="BACKENDReleseBranch"
GIT_REPO="https://github.com/sujanpok/HAMRO-REAL-STATE.git"

{
  echo "📥 $(date): Starting deployment..."

  # Clone repo if not present
  if [ ! -d "$BACKEND_DIR" ]; then
    echo "📁 BACKEND_APP not found. Cloning repository..."
    git clone "$GIT_REPO" "$BACKEND_DIR" || { echo "❌ Failed to clone repository."; exit 1; }
  fi

  # Navigate to the backend directory
  cd "$BACKEND_DIR" || { echo "❌ Failed to cd into $BACKEND_DIR"; exit 1; }

  # Ensure correct Git remote and branch
  echo "🔁 Setting Git remote to $GIT_REPO"
  git remote set-url origin "$GIT_REPO"
  git fetch origin

  echo "🔄 Checking out branch $BRANCH"
  git checkout "$BRANCH" || git checkout -b "$BRANCH" "origin/$BRANCH
