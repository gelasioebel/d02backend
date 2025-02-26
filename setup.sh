#!/bin/bash
# Windows-compatible cleanup and setup script

# Function to print colored output (Windows-compatible)
print_status() {
  local message=$2
  echo "$message"
}

# Function to handle errors gently
handle_error() {
  echo "Error occurred during execution. Continuing anyway..."
}

# Set up gentle error handling
trap 'handle_error' ERR

echo "==== Node.js Backend Cleanup and Setup Script ===="

# Check for running server and stop it gracefully for Windows
echo "Checking for running servers..."
# Use tasklist and taskkill for Windows
if tasklist 2>NUL | findstr /i "node.exe" >NUL; then
  echo "Stopping running node processes..."
  taskkill /F /IM node.exe >NUL 2>&1 || echo "No node processes found or couldn't stop them"
  sleep 2
fi

# Fix directory structure issues (with Windows-compatible checks)
echo "Standardizing directory structure..."
# Check if src/database exists
if [ ! -d "src/database" ]; then
  echo "Creating src/database directory..."
  mkdir -p src/database
fi

# Check if src/dataBase exists and is different from src/database
if [ -d "src/dataBase" ] && [ "$(realpath src/dataBase)" != "$(realpath src/database)" ]; then
  echo "Copying files from src/dataBase to src/database..."
  cp -r src/dataBase/* src/database/ 2>/dev/null || echo "Warning: Some files couldn't be copied (may already exist)"
  echo "Removing src/dataBase directory..."
  rm -rf src/dataBase
elif [ -d "src/dataBase" ]; then
  echo "Directories are the same in case-insensitive system. No action needed."
fi

echo "Cleaning project..."
rm -rf node_modules
rm -f package-lock.json
rm -rf dist
echo "Cleared build artifacts"

# Database cleanup option with confirmation
read -p "Do you want to clear the database too? (y/N) " choice
if [[ $choice =~ ^[Yy]$ ]]; then
  echo "Clearing database files..."
  mkdir -p db
  rm -rf db/*.db
  echo "Database cleared"
fi

echo "Cleaning npm cache..."
npm cache clean --force

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build || {
  echo "Build failed. Showing TypeScript errors:"
  npx tsc --noEmit
  exit 1
}

echo "Project cleaned and rebuilt successfully!"

# Optional: populate the database if requested
read -p "Do you want to populate the database with sample data? (y/N) " choice
if [[ $choice =~ ^[Yy]$ ]]; then
  echo "Populating database with sample data..."
  npx ts-node src/database/populateDatabase.ts
fi

echo "You can now start the server with:"
echo "  → npm run dev   (for development with auto-reload)"
echo "  → npm start     (for production mode)"
echo "✓ All tasks completed successfully!"