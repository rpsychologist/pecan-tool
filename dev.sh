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

DATABASE_FILENAME=.tmp/data-$DB_NAME.db 
yarn clear && yarn concurrently "cd frontend && LOCALES=$LOCALES DEFAULT_LOCALE=$DEFAULT_LOCALE NEXT_PUBLIC_DEMO_MODE=true yarn dev" "cd backend && DATABASE_FILENAME=$DATABASE_FILENAME yarn develop"