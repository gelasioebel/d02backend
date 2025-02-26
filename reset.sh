#!/bin/bash
# Simple reset script for Plant API Backend project
# Cleans the project, resets the database, and reinstalls dependencies

echo "==== Plant API Backend Reset Script ===="

# Stop any running server processes
echo "Stopping any running server processes..."
if command -v taskkill >/dev/null 2>&1; then
  # Windows
  taskkill /F /IM node.exe >/dev/null 2>&1 || echo "No Node.js processes found"
else
  # Unix/Linux/macOS
  pkill -f "node.*server.ts" >/dev/null 2>&1 || echo "No server processes found"
fi

# Clean project directories
echo "Cleaning project..."
rm -rf node_modules
rm -f package-lock.json
rm -rf dist

# Clean database files (without asking)
echo "Cleaning database files..."
mkdir -p db
rm -rf db/*.db

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Fix directory structure
echo "Ensuring correct directory structure..."
mkdir -p src/database src/controllers src/models src/routes src/middlewares

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build || {
  echo "⚠️ Build failed. You may need to fix TypeScript errors."
  echo "Use 'npm run dev' to see errors in real-time."
}

# Offer to populate database
read -p "Do you want to populate the database with sample data? (Y/n) " choice
if [[ $choice =~ ^[Yy]$ ]]; then
  if [ -f "src/database/initDatabase.ts" ]; then
    echo "Initializing database..."
    npx ts-node src/database/initDatabase.ts
  else
    echo "⚠️ No database initialization script found."
  fi
fi

echo "Reset completed! You can now start the server with:"
echo "  npm run dev  (for development with auto-reload)"
echo "  npm start    (for production mode)"