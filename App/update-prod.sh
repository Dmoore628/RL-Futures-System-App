#!/bin/bash

# Production Workflow Script
# This script ensures production builds work correctly

echo "🔄 Syncing Docker configurations..."
node sync-docker-configs.js

echo "🐳 Building production image..."
docker build --no-cache -t rl-futures-frontend:latest -f frontend/Dockerfile frontend

echo "✅ Production build completed!"
echo "🧪 Test production build:"
echo "   docker run --rm -p 8080:80 rl-futures-frontend:latest"
echo "   Then visit: http://localhost:8080/welcome"
