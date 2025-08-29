# RL Futures Trading System

A professional, AI-powered reinforcement learning system for futures trading that trains PPO models to achieve configurable profit targets during individual trading days, with transfer learning between days and live deployment via API to futures brokers.

## Features

- **PPO Algorithm**: State-of-the-art reinforcement learning for trading strategy optimization
- **High-Fidelity Simulator**: Realistic market conditions for robust model training
- **Transfer Learning**: Knowledge retention between trading days for continuous improvement
- **Live API Integration**: Seamless deployment to futures brokers for real-time trading
- **Configurable Targets**: Customizable profit targets and risk management parameters
- **Professional UI**: Modern, intuitive interface built with React and TypeScript

## Architecture

```
App/
├── frontend/          # React + TypeScript frontend application
│   ├── src/          # Source code
│   ├── content/      # Content management (JSON files)
│   ├── Dockerfile    # Production build
│   └── Dockerfile.dev # Development with hot reloading
├── backend/          # Python Flask backend
│   ├── app.py        # Main application
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile    # Backend container
└── docker-compose.yml # Container orchestration
```

## Quick Start Guide

### **Step 1: Prerequisites**
Ensure you have the following installed:
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop)
- **Git**: For version control
- **Node.js**: Version 18+ (for local development)
- **Python**: Version 3.11+ (for local development)

### **Step 2: Clone and Setup**
```bash
# Clone the repository
git clone <your-repo-url>
cd rl-futures-trading-system/App

# Verify the structure
ls -la
# You should see: frontend/, backend/, docker-compose.yml, README.md
```

### **Step 3: Start the Application (Production Mode)**
```bash
# Start all containers
docker-compose up -d

# Wait for containers to start (about 10-15 seconds)
# Check container status
docker-compose ps

# You should see:
# - frontend_prod: Up (port 3000)
# - backend_placeholder: Up (port 8000)
```

### **Step 4: Access Your Application**
- **Frontend**: http://localhost:3000 
- **Backend API**: http://localhost:8000 
- **Health Check**: http://localhost:8000/health 

### **Step 5: Verify Everything is Working**
```bash
# Test frontend
curl http://localhost:3000
# Should return HTML content

# Test backend health
curl http://localhost:8000/health
# Should return: {"status": "healthy", "message": "Backend is running"}

# View container logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Development Setup

### **Option 1: Development Mode with Live Editing**
```bash
# Stop production containers
docker-compose down

# Start development containers with hot reloading
docker-compose -f docker-compose.dev.yml up -d

# Wait for startup (about 15-20 seconds)
# Access: http://localhost:3000

# View development logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### **Option 2: Local Development (No Docker)**
```bash
# Frontend Development
cd App/frontend
npm install
npm run dev          # Starts at http://localhost:3000
npm test             # Run tests
npm run lint         # Check code quality

# Backend Development (in new terminal)
cd App/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python app.py          # Starts at http://localhost:8000
```

## Content Management

### **Editing Welcome Page Content**
The welcome page content is managed through JSON files for easy updates:

**File Location**: `App/frontend/content/welcomeContent.json`

**What You Can Edit**:
- **Brand**: Change the application name
- **Title**: Update the main heading
- **Subtitle**: Modify the description
- **Sections**: Add, remove, or modify content sections

**Example Content Structure**:
```json
{
  "brand": "RL Futures Trading System",
  "title": "Welcome to the Reinforcement Learning System for Futures Trading",
  "subtitle": "Advanced AI-powered trading system...",
  "sections": [
    {
      "heading": "What This Application Does",
      "paragraph": "Description text here..."
    }
  ]
}
```

**Live Updates**: In development mode, changes to this file will be reflected immediately in the browser.

### **Editing Styling**
**File Location**: `App/frontend/src/pages/WelcomePage.module.css`

**What You Can Edit**:
- Colors, fonts, spacing
- Layout and responsive design
- Hover effects and animations
- Professional styling elements

## Adding New Pages

### **Step 1: Create New Page Component**
```typescript
// App/frontend/src/pages/NewPage.tsx
import React from 'react'
import styles from './NewPage.module.css'

const NewPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>New Page</h1>
      <p>Your content here</p>
    </div>
  )
}

export default NewPage
```

### **Step 2: Add Route**
```typescript
// App/frontend/src/App.tsx
import NewPage from './pages/NewPage'

const router = createBrowserRouter([
  { path: '/', element: <WelcomePage /> },
  { path: '/new', element: <NewPage /> },  // Add this line
])
```

### **Step 3: Create CSS Module**
```css
/* App/frontend/src/pages/NewPage.module.css */
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
```

### **Step 4: Test Your New Page**
```bash
# In development mode, navigate to: http://localhost:3000/new
# The page will automatically reload with your changes
```

## Development Workflow

### **Daily Development Cycle**
```bash
# 1. Start development mode
docker-compose -f docker-compose.dev.yml up -d

# 2. Make your changes to code/content
# 3. See changes immediately in browser
# 4. Run tests to ensure quality
cd frontend && npm test

# 5. Check code quality
npm run lint

# 6. When ready, build for production
npm run build

# 7. Test production build
docker-compose up -d
```

### **Testing Your Changes**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Check code quality
npm run lint
npm run format
```

## Docker Commands Reference

### **Production Mode**
```bash
# Start application
docker-compose up -d

# Stop application
docker-compose down

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Rebuild containers
docker-compose build
docker-compose up -d
```

### **Development Mode**
```bash
# Start development
docker-compose -f docker-compose.dev.yml up -d

# Stop development
docker-compose -f docker-compose.dev.yml down

# View development logs
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

### **Container Management**
```bash
# Check container status
docker-compose ps

# View container resources
docker stats

# Access container shell
docker-compose exec frontend sh
docker-compose exec backend bash

# Clean up Docker
docker system prune -a
```

## Quality Assurance

### **Automated Testing**
```bash
# Frontend tests
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Coverage report

# Backend tests
cd backend
pytest                # Run Python tests
pytest --cov=.        # With coverage
```

### **Code Quality Checks**
```bash
# Frontend
npm run lint          # ESLint checks
npm run format        # Prettier formatting
npm run format:check  # Check formatting without changes

# Backend
flake8 .              # Python linting
black --check .       # Check code formatting
```

### **Build Verification**
```bash
# Frontend build
npm run build         # Production build
npm run preview       # Preview production build

# Docker build
docker-compose build  # Rebuild all containers
```

## Monitoring and Debugging

### **Application Health**
```bash
# Check frontend
curl http://localhost:3000

# Check backend
curl http://localhost:8000/health

# Check container status
docker-compose ps
```

### **Logs and Debugging**
```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Debug container issues
docker-compose exec frontend sh
docker-compose exec backend bash
```

### **Performance Monitoring**
```bash
# Container resource usage
docker stats

# Build performance
time npm run build
time docker-compose build
```

## Deployment

### **Production Deployment**
```bash
# 1. Build production containers
docker-compose build

# 2. Start production services
docker-compose up -d

# 3. Verify deployment
curl http://localhost:3000
curl http://localhost:8000/health

# 4. Monitor logs
docker-compose logs -f
```

### **Environment Configuration**
Create a `.env` file in the App directory:
```env
# Frontend
VITE_API_URL=http://localhost:8000

# Backend
FLASK_ENV=production
FLASK_DEBUG=false
```

## 🔧 Troubleshooting

### **Common Issues**

**Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill process or change port in docker-compose.yml
```

**Container Won't Start**
```bash
# Check logs
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Build Failures**
```bash
# Clear Docker cache
docker system prune -a

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Tests Failing**
```bash
# Clear Jest cache
npm test -- --clearCache

# Update test snapshots
npm test -- -u

# Run specific test file
npm test -- WelcomePage.test.tsx
```

## 📚 Additional Resources

### **Development Tools**
- **Storybook**: `npm run storybook` - Component development
- **React DevTools**: Browser extension for debugging
- **TypeScript**: Enhanced development experience
- **Vite**: Fast build tool with hot reloading

### **Learning Resources**
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Flask Documentation](https://flask.palletsprojects.com/)

## Contributing

### **Development Workflow**
1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
1. Check the [Issues](../../issues) page
2. Review the documentation
3. Contact the development team

---

**Built with ❤️ using React, TypeScript, Python, and Docker**