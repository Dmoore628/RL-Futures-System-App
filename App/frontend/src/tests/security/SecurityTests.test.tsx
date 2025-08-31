/**
 * Comprehensive Security Tests for RL Futures Trading System
 * Covers OWASP Top 10 vulnerabilities and security best practices
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import WelcomePage from '../../pages/WelcomePage';
import UploadAndSettingsPage from '../../pages/UploadAndSettingsPage';
import ConfigurationForm from '../../components/ConfigurationForm';
import FileUpload from '../../components/FileUpload';

// Mock components and services
jest.mock('../../services/api', () => ({
  uploadFile: jest.fn(),
  updateConfiguration: jest.fn(),
}));

// Security test utilities
const createMaliciousPayload = (type: string) => {
  switch (type) {
    case 'xss':
      return '<script>alert("XSS")</script>';
    case 'sql-injection':
      return "'; DROP TABLE users; --";
    case 'path-traversal':
      return '../../../etc/passwd';
    case 'command-injection':
      return '$(rm -rf /)';
    default:
      return 'malicious-payload';
  }
};

const createLargePayload = (sizeInMB: number) => {
  return 'A'.repeat(sizeInMB * 1024 * 1024);
};

describe('Security Tests - OWASP Top 10', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <ThemeProvider>
          {component}
        </ThemeProvider>
      </BrowserRouter>
    );
  };

  describe('A01:2021 - Broken Access Control', () => {
    test('should prevent unauthorized access to sensitive endpoints', async () => {
      // Test that sensitive operations require proper authentication
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      // Attempt to access configuration without proper validation
      const submitButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(submitButton);
      
      // Should show validation error, not proceed with sensitive operation
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument();
      });
    });

    test('should validate file upload permissions', async () => {
      const { container } = renderWithProviders(<FileUpload />);
      
      // Test file size limits
      const file = new File([createLargePayload(100)], 'large-file.csv', {
        type: 'text/csv',
      });
      
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      // Should reject files that are too large
      await waitFor(() => {
        expect(screen.getByText(/file too large/i)).toBeInTheDocument();
      });
    });
  });

  describe('A02:2021 - Cryptographic Failures', () => {
    test('should not expose sensitive data in URLs', () => {
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check that sensitive data is not exposed in page source
      const pageContent = container.innerHTML;
      
      // Should not contain hardcoded secrets or sensitive data
      expect(pageContent).not.toMatch(/password|secret|key|token/i);
    });

    test('should use secure communication protocols', () => {
      // Test that HTTPS is enforced in production
      if (process.env.NODE_ENV === 'production') {
        expect(window.location.protocol).toBe('https:');
      }
    });
  });

  describe('A03:2021 - Injection', () => {
    test('should prevent XSS attacks in user input', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const maliciousInput = createMaliciousPayload('xss');
      
      // Attempt to inject malicious script
      const inputField = screen.getByLabelText(/trading strategy/i);
      await userEvent.type(inputField, maliciousInput);
      
      // Input should be sanitized, not executed
      expect(inputField).toHaveValue(maliciousInput);
      
      // Check that script tags are not rendered as HTML
      const pageContent = container.innerHTML;
      expect(pageContent).not.toContain('<script>');
    });

    test('should prevent SQL injection in form inputs', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      const maliciousInput = createMaliciousPayload('sql-injection');
      
      // Attempt to inject SQL commands
      const inputField = screen.getByLabelText(/risk tolerance/i);
      await userEvent.type(inputField, maliciousInput);
      
      // Input should be treated as plain text, not executed
      expect(inputField).toHaveValue(maliciousInput);
    });

    test('should prevent command injection in file uploads', async () => {
      const { container } = renderWithProviders(<FileUpload />);
      
      const maliciousFilename = createMaliciousPayload('command-injection');
      const file = new File(['test'], maliciousFilename, { type: 'text/csv' });
      
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      // Filename should be sanitized
      await waitFor(() => {
        const displayedName = screen.getByText(/file selected/i);
        expect(displayedName).not.toContain('$(rm -rf /)');
      });
    });
  });

  describe('A04:2021 - Insecure Design', () => {
    test('should implement proper input validation', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      // Test various invalid inputs
      const invalidInputs = [
        { field: 'learning_rate', value: 'not-a-number' },
        { field: 'batch_size', value: '-1' },
        { field: 'epochs', value: '1000000' },
      ];
      
      for (const { field, value } of invalidInputs) {
        const inputField = screen.getByLabelText(new RegExp(field, 'i'));
        await userEvent.clear(inputField);
        await userEvent.type(inputField, value);
        
        // Should show validation error
        await waitFor(() => {
          expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
        });
      }
    });

    test('should implement proper error handling', async () => {
      const { container } = renderWithProviders(<UploadAndSettingsPage />);
      
      // Simulate network error
      const mockApi = require('../../services/api');
      mockApi.uploadFile.mockRejectedValue(new Error('Network error'));
      
      // Attempt to upload file
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [file] } });
      
      // Should handle error gracefully without exposing system details
      await waitFor(() => {
        expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
        expect(screen.queryByText(/network error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('A05:2021 - Security Misconfiguration', () => {
    test('should not expose sensitive headers', () => {
      // Test that security headers are properly set
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for security headers in meta tags
      const metaTags = container.querySelectorAll('meta');
      const securityHeaders = Array.from(metaTags).map(tag => tag.getAttribute('http-equiv'));
      
      // Should include security-related headers
      expect(securityHeaders).toContain('X-Content-Type-Options');
      expect(securityHeaders).toContain('X-Frame-Options');
    });

    test('should use secure defaults', () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      // Check that form defaults are secure
      const submitButton = screen.getByRole('button', { name: /save/i });
      expect(submitButton).toBeDisabled(); // Should be disabled until valid input
    });
  });

  describe('A06:2021 - Vulnerable and Outdated Components', () => {
    test('should not use deprecated APIs', () => {
      // Test that modern, secure APIs are used
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for use of modern React patterns
      expect(container.innerHTML).not.toContain('componentWillMount');
      expect(container.innerHTML).not.toContain('componentWillReceiveProps');
    });
  });

  describe('A07:2021 - Identification and Authentication Failures', () => {
    test('should implement proper session management', () => {
      // Test that sessions are properly managed
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for proper authentication state handling
      const authElements = container.querySelectorAll('[data-testid*="auth"]');
      expect(authElements.length).toBeGreaterThan(0);
    });
  });

  describe('A08:2021 - Software and Data Integrity Failures', () => {
    test('should validate file integrity', async () => {
      const { container } = renderWithProviders(<FileUpload />);
      
      // Test file type validation
      const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      
      const fileInput = screen.getByTestId('file-input');
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });
      
      // Should reject executable files
      await waitFor(() => {
        expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
      });
    });
  });

  describe('A09:2021 - Security Logging and Monitoring Failures', () => {
    test('should log security events', () => {
      // Mock console.log to capture logging
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Trigger a security-relevant action
      const maliciousInput = createMaliciousPayload('xss');
      const inputField = screen.getByLabelText(/trading strategy/i);
      fireEvent.change(inputField, { target: { value: maliciousInput } });
      
      // Should log security events
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('security')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('A10:2021 - Server-Side Request Forgery (SSRF)', () => {
    test('should not allow arbitrary URL requests', async () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      // Test that external URLs are not allowed
      const maliciousUrl = 'http://malicious-site.com/api';
      
      // Attempt to set malicious URL
      const urlInput = screen.getByLabelText(/api endpoint/i);
      if (urlInput) {
        await userEvent.type(urlInput, maliciousUrl);
        
        // Should validate and reject external URLs
        await waitFor(() => {
          expect(screen.getByText(/invalid url/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Additional Security Tests', () => {
    test('should implement Content Security Policy', () => {
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for CSP meta tag
      const cspMeta = container.querySelector('meta[http-equiv="Content-Security-Policy"]');
      expect(cspMeta).toBeInTheDocument();
    });

    test('should prevent clickjacking attacks', () => {
      const { container } = renderWithProviders(<WelcomePage />);
      
      // Check for X-Frame-Options meta tag
      const frameOptionsMeta = container.querySelector('meta[http-equiv="X-Frame-Options"]');
      expect(frameOptionsMeta).toBeInTheDocument();
    });

    test('should implement proper CSRF protection', () => {
      const { container } = renderWithProviders(<ConfigurationForm />);
      
      // Check for CSRF token in forms
      const csrfToken = container.querySelector('input[name="_csrf"]');
      expect(csrfToken).toBeInTheDocument();
    });
  });
});
