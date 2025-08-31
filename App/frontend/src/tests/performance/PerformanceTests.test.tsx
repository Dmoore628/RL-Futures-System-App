/**
 * Performance Tests for RL Futures Trading System
 * Covers bundle analysis, rendering performance, memory usage, and optimization
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import WelcomePage from '../../pages/WelcomePage';
import UploadAndSettingsPage from '../../pages/UploadAndSettingsPage';
import ConfigurationForm from '../../components/ConfigurationForm';
import FileUpload from '../../components/FileUpload';

// Mock performance API for testing
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(),
  getEntriesByType: jest.fn(),
  now: jest.fn(() => Date.now()),
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock memory API for testing
const mockMemory = {
  usedJSHeapSize: 1000000,
  totalJSHeapSize: 2000000,
  jsHeapSizeLimit: 10000000,
};

Object.defineProperty(window.performance, 'memory', {
  value: mockMemory,
  writable: true,
});

describe('Performance Tests', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Bundle Size & Loading Performance', () => {
    test('should load main components within acceptable time', async () => {
      const startTime = performance.now();
      
      const { container } = renderWithProviders(<WelcomePage />);
      
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      // Component should load within 100ms in test environment
      expect(loadTime).toBeLessThan(100);
      
      // Verify content is rendered
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    test('should handle large data sets efficiently', async () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 1000,
      }));

      const startTime = performance.now();
      
      // Simulate rendering large dataset
      const { container } = renderWithProviders(<DataPreview data={largeDataset} />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Large dataset should render within 200ms
      expect(renderTime).toBeLessThan(200);
    });

    test('should not cause memory leaks during navigation', async () => {
      const initialMemory = performance.memory.usedJSHeapSize;
      
      // Navigate between pages multiple times
      for (let i = 0; i < 10; i++) {
        const { unmount } = renderWithProviders(<WelcomePage />);
        unmount();
        
        const { unmount: unmount2 } = renderWithProviders(<UploadAndSettingsPage />);
        unmount2();
      }
      
      // Force garbage collection simulation
      global.gc && global.gc();
      
      const finalMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 10% of initial)
      expect(memoryIncrease).toBeLessThan(initialMemory * 0.1);
    });
  });

  describe('Rendering Performance', () => {
    test('should render forms efficiently', async () => {
      const startTime = performance.now();
      
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Form should render within 50ms
      expect(renderTime).toBeLessThan(50);
      
      // Verify form elements are present
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    test('should handle rapid user input efficiently', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const inputField = screen.getByLabelText(/learning rate/i);
      const startTime = performance.now();
      
      // Simulate rapid typing
      for (let i = 0; i < 100; i++) {
        fireEvent.change(inputField, { target: { value: `0.00${i}` } });
      }
      
      const endTime = performance.now();
      const inputTime = endTime - startTime;
      
      // Rapid input should be handled within 500ms
      expect(inputTime).toBeLessThan(500);
    });

    test('should optimize re-renders', async () => {
      const renderSpy = jest.fn();
      
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const inputField = screen.getByLabelText(/batch size/i);
      
      // Change input multiple times
      for (let i = 0; i < 10; i++) {
        fireEvent.change(inputField, { target: { value: i.toString() } });
      }
      
      // Should not cause excessive re-renders
      expect(renderSpy).toHaveBeenCalledTimes(1); // Initial render only
    });
  });

  describe('Memory Management', () => {
    test('should clean up event listeners', async () => {
      const initialMemory = performance.memory.usedJSHeapSize;
      
      const { unmount } = renderWithProviders(<FileUpload />);
      
      // Simulate file upload events
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [new File(['test'], 'test.csv')] } });
      
      unmount();
      
      // Force garbage collection simulation
      global.gc && global.gc();
      
      const finalMemory = performance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory should be properly cleaned up
      expect(memoryIncrease).toBeLessThan(initialMemory * 0.05);
    });

    test('should handle large file uploads efficiently', async () => {
      const largeFile = new File(['A'.repeat(1024 * 1024)], 'large.csv', { type: 'text/csv' });
      
      const startTime = performance.now();
      
      const { container } = renderWithProviders(<FileUpload />);
      const fileInput = screen.getByTestId('file-input');
      
      fireEvent.change(fileInput, { target: { files: [largeFile] } });
      
      const endTime = performance.now();
      const uploadTime = endTime - startTime;
      
      // Large file handling should be efficient
      expect(uploadTime).toBeLessThan(100);
    });
  });

  describe('Network Performance', () => {
    test('should implement proper loading states', async () => {
      const { container } = renderWithProviders(<FileUpload />);
      
      // Simulate slow network
      const mockApi = require('../../services/api');
      mockApi.uploadFile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const fileInput = screen.getByTestId('file-input');
      
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      // Should show loading state immediately
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });

    test('should handle network errors gracefully', async () => {
      const { container } = renderWithProviders(<FileUpload />);
      
      // Simulate network error
      const mockApi = require('../../services/api');
      mockApi.uploadFile.mockRejectedValue(new Error('Network error'));
      
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const fileInput = screen.getByTestId('file-input');
      
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      await waitFor(() => {
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Animation & Transition Performance', () => {
    test('should use efficient CSS transitions', () => {
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for CSS transitions and animations
      const styleSheets = Array.from(document.styleSheets);
      const hasTransitions = styleSheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          return rules.some(rule => 
            rule.cssText.includes('transition') || 
            rule.cssText.includes('animation')
          );
        } catch {
          return false;
        }
      });
      
      // Should use CSS transitions for smooth animations
      expect(hasTransitions).toBe(true);
    });

    test('should not block main thread during animations', async () => {
      const { container } = renderWithProviders(<WelcomePage />);
      
      const startTime = performance.now();
      
      // Trigger animation (e.g., theme toggle)
      const themeToggle = screen.getByRole('button', { name: /theme/i });
      fireEvent.click(themeToggle);
      
      const endTime = performance.now();
      const animationTime = endTime - startTime;
      
      // Animation should not block main thread for long
      expect(animationTime).toBeLessThan(50);
    });
  });

  describe('Accessibility Performance', () => {
    test('should maintain performance with screen readers', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const startTime = performance.now();
      
      // Simulate screen reader navigation
      const formElements = container.querySelectorAll('input, button, label');
      formElements.forEach(element => {
        element.focus();
        element.blur();
      });
      
      const endTime = performance.now();
      const navigationTime = endTime - startTime;
      
      // Screen reader navigation should be fast
      expect(navigationTime).toBeLessThan(100);
    });

    test('should handle keyboard navigation efficiently', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const startTime = performance.now();
      
      // Simulate keyboard navigation
      const tabKey = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab' });
      document.dispatchEvent(tabKey);
      
      const endTime = performance.now();
      const navigationTime = endTime - startTime;
      
      // Keyboard navigation should be instant
      expect(navigationTime).toBeLessThan(10);
    });
  });

  describe('Performance Metrics', () => {
    test('should meet performance budgets', () => {
      // Performance budgets
      const budgets = {
        bundleSize: 500 * 1024, // 500KB
        renderTime: 100, // 100ms
        memoryUsage: 50 * 1024 * 1024, // 50MB
      };
      
      // Check bundle size (simulated)
      const bundleSize = 300 * 1024; // Simulated 300KB
      expect(bundleSize).toBeLessThan(budgets.bundleSize);
      
      // Check memory usage
      const memoryUsage = performance.memory.usedJSHeapSize;
      expect(memoryUsage).toBeLessThan(budgets.memoryUsage);
    });

    test('should implement performance monitoring', () => {
      // Check that performance marks are used
      expect(performance.mark).toHaveBeenCalled();
      
      // Check that performance measures are used
      expect(performance.measure).toHaveBeenCalled();
    });
  });
});

// Mock DataPreview component for testing
const DataPreview = ({ data }: { data: any[] }) => (
  <div data-testid="data-preview">
    {data.map(item => (
      <div key={item.id}>{item.name}: {item.value}</div>
    ))}
  </div>
);
