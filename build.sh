#!/bin/bash
ENV_FILE=${1:-.env}

# Verify that the specified .env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file '$ENV_FILE' not found."
  exit 1
fi

# Source environment variables
set -o allexport
source "$ENV_FILE"
set +o allexport

# Ensure required variables are set
if [ -z "$SITE_NAME" ] || [ -z "$DB_NAME" ] || [ -z "$LOCALES" ] || [ -z "$DEFAULT_LOCALE" ]; then
  echo "Error: Missing required environment variables in '$ENV_FILE'."
  echo "Please ensure SITE_NAME, DB_NAME, LOCALES, and DEFAULT_LOCALE are set."
  exit 1
fi

# Function to check backend port is in use
is_port_in_use() {
  lsof -i :1337 > /dev/null 2>&1
}
# Function to wait for the backend to be ready
wait_for_backend() {
  echo "Waiting for backend to start on port 1337..."
  for i in {1..30}; do  # Try 30 times (60 seconds)
    if is_port_in_use; then
      echo "Backend is up and running on port 1337."
      return 0 
    fi
    sleep 2 
  done
  echo "Error: Backend did not start on port 1337 in time."
  exit 1  # Exit if the backend did not start
}

# Check if port 1337 is already in use
# to avoid pulling data from a dev backend
echo "Checking if port 1337 is in use..."
if is_port_in_use; then
  echo "Error: Port 1337 is already in use."
  exit 1  # Exit the script if port is in use
fi

echo "Starting backend..."
cd backend
DATABASE_FILENAME=.tmp/data-$DB_NAME.db yarn develop &  # Start backend in the background
BACKEND_PID=$!

# Wait for the backend to be fully up and running
wait_for_backend

echo "Building frontend..."
cd ../frontend
LOCALES=$LOCALES DEFAULT_LOCALE=$DEFAULT_LOCALE NEXT_PUBLIC_DEMO_MODE=true yarn next build

echo "Stopping backend..."
kill $BACKEND_PID

netlify deploy --site $SITE_NAME