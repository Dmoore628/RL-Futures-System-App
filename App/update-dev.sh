#!/bin/bash

# Development Workflow Script
# This script ensures Docker configurations stay in sync

echo "🔄 Updating Docker configurations..."
node sync-docker-configs.js

echo "🐳 Rebuilding development environment..."
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build

echo "✅ Development environment updated and running!"
echo "🌐 Access at: http://localhost:3000/welcome"
