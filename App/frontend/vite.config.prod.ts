import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
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
  },
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      host: 'localhost',
      port: 3000,
    },
  },
  // Serve the public directory as static assets (standard React practice)
  publicDir: 'public',
  // Optimize dependencies
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
    include: ['react', 'react-dom'],
  },
  // Configure build options for better development experience
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
      // Force inclusion of BrokerLogosBanner component
      output: {
        manualChunks: undefined,
      },
    },
    // Disable tree-shaking for our components
    minify: false,
  },
})


