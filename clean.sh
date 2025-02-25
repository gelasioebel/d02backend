#!/bin/bash
echo "Stopping any running servers..."
pkill -f "node.*server.ts" || true

echo "Cleaning project..."
rm -rf node_modules
rm -f package-lock.json
rm -rf dist
echo "Cleared build artifacts"

# Uncomment the next line if you want to clear the database too
# rm -rf db/*.db

echo "Cleaning npm cache..."
npm cache clean --force

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Project cleaned and rebuilt successfully!"
echo "You can now start the server with 'npm run dev' or 'npm start'"