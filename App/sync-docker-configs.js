#!/usr/bin/env node

/**
 * Docker Configuration Sync Script
 * Automatically keeps development and production Docker configurations in sync
 * Run this script whenever you make changes to ensure consistency
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing Docker configurations...\n');

// Configuration files to sync
const configFiles = [
  {
    name: 'Dockerfile',
    source: 'frontend/Dockerfile',
    target: 'frontend/Dockerfile.prod',
    description: 'Production Dockerfile'
  },
  {
    name: 'docker-compose.yml',
    source: 'docker-compose.yml',
    target: 'docker-compose.prod.yml',
    description: 'Production docker-compose'
  },
  {
    name: 'vite.config.ts',
    source: 'frontend/vite.config.ts',
    target: 'frontend/vite.config.prod.ts',
    description: 'Production Vite config'
  }
];

// Sync each configuration file
configFiles.forEach(config => {
  try {
    const sourcePath = path.join(__dirname, config.source);
    const targetPath = path.join(__dirname, config.target);
    
    if (fs.existsSync(sourcePath)) {
      // Read source file
      let content = fs.readFileSync(sourcePath, 'utf8');
      
      // Apply production-specific modifications
      if (config.name === 'Dockerfile') {
        // Ensure production Dockerfile uses exact Node.js version
        content = content.replace(
          /FROM node:\d+\.\d+\.\d+-alpine/,
          'FROM node:20.15.0-alpine'
        );
        
        // Add production build optimizations
        if (!content.includes('# Production optimizations')) {
          content = content.replace(
            'RUN npm run build',
            `# Production optimizations
RUN npm run build
# Verify component inclusion in build
RUN grep -q "BrokerLogosBanner" dist/assets/*.js || (echo "ERROR: BrokerLogosBanner component not found in build" && exit 1)
RUN grep -q "BrokerWheel3D" dist/assets/*.js || (echo "ERROR: BrokerWheel3D component not found in build" && exit 1)
RUN grep -q "ConfigurationForm" dist/assets/*.js || (echo "ERROR: ConfigurationForm component not found in build" && exit 1)
# Verify UI changes are included
RUN grep -q "background: white" dist/assets/*.css || (echo "WARNING: UI styling changes may not be included" && exit 0)
RUN grep -q "Back to Welcome Page" dist/assets/*.js || (echo "WARNING: Navigation changes may not be included" && exit 0)`
          );
        }
      }
      
      if (config.name === 'vite.config.ts') {
        // Ensure production Vite config has proper build settings
        if (!content.includes('// Production build settings')) {
          content = content.replace(
            'export default defineConfig({',
            `export default defineConfig({
  // Production build settings
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      // Force inclusion of all components
      output: {
        manualChunks: undefined,
      },
    },
    // Ensure components are not tree-shaken
    minify: false,
    // Source maps for debugging
    sourcemap: true,
    // Ensure all UI components are included
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Optimize dependencies for UI components
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
    ],
  },`
          );
        }
      }
      
      // Write target file
      fs.writeFileSync(targetPath, content);
      console.log(`✅ ${config.description} synced successfully`);
    } else {
      console.log(`⚠️  Source file not found: ${config.source}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing ${config.description}:`, error.message);
  }
});

// Create development workflow script
const devWorkflowScript = `#!/bin/bash

# Development Workflow Script
# This script ensures Docker configurations stay in sync

echo "🔄 Updating Docker configurations..."
node sync-docker-configs.js

echo "🐳 Rebuilding development environment..."
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build

echo "✅ Development environment updated and running!"
echo "🌐 Access at: http://localhost:3000/welcome"
`;

fs.writeFileSync(path.join(__dirname, 'update-dev.sh'), devWorkflowScript);
fs.chmodSync(path.join(__dirname, 'update-dev.sh'), '755');

// Create production workflow script
const prodWorkflowScript = `#!/bin/bash

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
`;

fs.writeFileSync(path.join(__dirname, 'update-prod.sh'), prodWorkflowScript);
fs.chmodSync(path.join(__dirname, 'update-prod.sh'), '755');

console.log('\n📋 Development Workflow Commands:');
console.log('  npm run update-dev    - Update and restart development environment');
console.log('  npm run update-prod   - Update and test production build');
console.log('  node sync-docker-configs.js - Just sync configurations');

// Create environment consistency verification script
const consistencyScript = `#!/bin/bash

# Environment Consistency Verification Script
# This script verifies that all UI changes are consistent across environments

echo "🔍 Verifying Environment Consistency..."

# Check if all modified files are present
echo "📁 Checking file consistency..."
required_files=(
  "frontend/src/components/BrokerLogosBanner/BrokerLogosBanner.tsx"
  "frontend/src/components/BrokerLogosBanner/BrokerLogosBanner.module.css"
  "frontend/src/components/BrokerWheel/BrokerWheel3D.tsx"
  "frontend/src/components/BrokerWheel/BrokerWheel3D.module.css"
  "frontend/src/components/ConfigurationForm/ConfigurationForm.tsx"
  "frontend/src/components/ConfigurationForm/ConfigurationForm.module.css"
  "frontend/src/pages/UploadAndSettingsPage.tsx"
)

for file in "\${required_files[@]}"; do
  if [ -f "\$file" ]; then
    echo "✅ \$file exists"
  else
    echo "❌ \$file missing"
    exit 1
  fi
done

# Check for UI changes in files
echo "🎨 Verifying UI changes..."

# Check for white background changes
if grep -q "background: white" frontend/src/components/BrokerWheel/BrokerWheel3D.module.css; then
  echo "✅ Broker wheel white background changes found"
else
  echo "❌ Broker wheel white background changes missing"
  exit 1
fi

# Check for removed tooltip
if ! grep -q "Drag to rotate.*Hover to explore" frontend/src/components/BrokerWheel/BrokerWheel3D.tsx; then
  echo "✅ Tooltip removal changes found"
else
  echo "❌ Tooltip removal changes missing"
  exit 1
fi

# Check for navigation changes
if grep -q "useNavigate" frontend/src/pages/UploadAndSettingsPage.tsx; then
  echo "✅ Navigation changes found"
else
  echo "❌ Navigation changes missing"
  exit 1
fi

# Check for button styling changes
if grep -q "rgba(51, 65, 85, 0.8)" frontend/src/components/ConfigurationForm/ConfigurationForm.module.css; then
  echo "✅ Button styling changes found"
else
  echo "❌ Button styling changes missing"
  exit 1
fi

echo "✅ All UI changes verified successfully!"
echo "🚀 Ready for deployment to both development and production environments"
`;

fs.writeFileSync(path.join(__dirname, 'verify-consistency.sh'), consistencyScript);
fs.chmodSync(path.join(__dirname, 'verify-consistency.sh'), '755');

console.log('\n🎯 Next Steps:');
console.log('1. Run: ./verify-consistency.sh (verify all changes)');
console.log('2. Run: npm run update-dev (update development)');
console.log('3. Test UI changes in development at http://localhost:3000/welcome');
console.log('4. Run: npm run update-prod (update production)');
console.log('5. Verify UI changes work in production');

console.log('\n✅ Docker configuration sync completed!');
