# 🚀 Development Workflow - Docker Configuration Sync

## **Overview**
This document describes the automated Docker configuration sync workflow that ensures development and production environments stay consistent and up-to-date.

## **🔄 Automated Sync Commands**

### **Development Environment Updates**
```bash
# Update and restart development environment
npm run update-dev

# This command:
# 1. Syncs Docker configurations
# 2. Stops development containers
# 3. Rebuilds and starts development environment
# 4. Ensures consistency between dev and prod configs
```

### **Production Environment Updates**
```bash
# Update and test production build
npm run update-prod

# This command:
# 1. Syncs Docker configurations
# 2. Builds production Docker image
# 3. Verifies component inclusion
# 4. Ready for deployment testing
```

### **Manual Configuration Sync**
```bash
# Just sync configurations without rebuilding
npm run sync-docker

# This command:
# 1. Updates production Dockerfile with exact Node.js version
# 2. Syncs Vite configuration for production builds
# 3. Creates production docker-compose file
# 4. Ensures build consistency
```

## **📁 Configuration Files**

### **Automatically Synced Files**
- `frontend/Dockerfile` → `frontend/Dockerfile.prod`
- `docker-compose.yml` → `docker-compose.prod.yml`
- `frontend/vite.config.ts` → `frontend/vite.config.prod.ts`

### **Production-Specific Optimizations**
- **Node.js Version**: Exact version matching (20.15.0)
- **Build Verification**: Component inclusion checks
- **Tree-Shaking Prevention**: Ensures all components are included
- **Source Maps**: Enabled for debugging

## **🔄 Workflow Process**

### **1. Development Changes**
```bash
# Make changes to source code
# Update Docker configurations if needed
npm run update-dev
```

### **2. Testing in Development**
```bash
# Access development environment
http://localhost:3000/welcome

# Test carousel functionality
# Verify all features work correctly
```

### **3. Production Testing**
```bash
# Build and test production
npm run update-prod

# Test production build
docker run --rm -p 8080:80 rl-futures-frontend:latest
# Visit: http://localhost:8080/welcome
```

### **4. Deployment**
```bash
# Production is ready when:
# ✅ Development environment works
# ✅ Production build includes all components
# ✅ Carousel functionality works in production
# ✅ All tests pass
```

## **🐳 Docker Environment Management**

### **Development Environment**
- **Port**: 3000 (frontend), 8000 (backend)
- **Hot Reload**: Enabled
- **Source Maps**: Enabled
- **Debugging**: Full access

### **Production Environment**
- **Port**: 8080 (frontend), 8000 (backend)
- **Optimized**: Minified and bundled
- **Health Checks**: Enabled
- **Monitoring**: Ready for production

## **🔧 Troubleshooting**

### **Common Issues**

#### **Component Not Included in Production Build**
```bash
# Check if component exists in source
grep -r "BrokerLogosBanner" frontend/src/

# Verify Docker build includes component
docker run --rm rl-futures-frontend:latest grep "BrokerLogosBanner" /usr/share/nginx/html/assets/*.js
```

#### **Build Failures**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
npm run update-prod
```

#### **Configuration Sync Issues**
```bash
# Manual sync
npm run sync-docker

# Check file differences
diff frontend/Dockerfile frontend/Dockerfile.prod
```

## **📋 Best Practices**

### **Before Committing Changes**
1. **Run tests**: `npm test`
2. **Update dev environment**: `npm run update-dev`
3. **Test functionality**: Verify carousel works
4. **Update production**: `npm run update-prod`
5. **Verify production**: Test carousel in production build

### **Regular Maintenance**
1. **Weekly**: Run `npm run sync-docker`
2. **After Node.js updates**: Verify version consistency
3. **After Docker updates**: Test build process
4. **Before deployment**: Full production test

## **🎯 Success Criteria**

### **Development Environment**
- ✅ Hot reload works
- ✅ All components render correctly
- ✅ Carousel scrolls continuously
- ✅ Click and drag works
- ✅ Momentum physics work

### **Production Environment**
- ✅ Build completes successfully
- ✅ All components included in bundle
- ✅ Carousel functionality works
- ✅ Performance optimized
- ✅ Health checks pass

## **📚 Additional Resources**

- **Docker Documentation**: https://docs.docker.com/
- **Vite Build Configuration**: https://vitejs.dev/config/
- **React Production Builds**: https://reactjs.org/docs/optimizing-performance.html

---

*Last Updated: August 31st, 2025 - Development Workflow Established*
