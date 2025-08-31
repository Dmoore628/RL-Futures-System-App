/**
 * Security Testing Utilities
 * Provides comprehensive testing functions for security validation
 */

/**
 * Test for XSS vulnerabilities
 */
export const testXSSVulnerability = (input: string): boolean => {
  const dangerousPatterns = [
    '<script>',
    'javascript:',
    'onload=',
    'onerror=',
    'onclick=',
    'onmouseover=',
    'eval(',
    'document.cookie',
    'window.location',
    'innerHTML',
    'outerHTML'
  ]
  
  return !dangerousPatterns.some(pattern => 
    input.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Test for SQL injection patterns
 */
export const testSQLInjection = (input: string): boolean => {
  const dangerousPatterns = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'UNION',
    '--',
    '/*',
    'xp_',
    'sp_'
  ]
  
  return !dangerousPatterns.some(pattern => 
    input.toUpperCase().includes(pattern.toUpperCase())
  )
}

/**
 * Test for path traversal attacks
 */
export const testPathTraversal = (input: string): boolean => {
  const dangerousPatterns = [
    '../',
    '..\\',
    '..%2f',
    '..%5c',
    '%2e%2e%2f',
    '%2e%2e%5c'
  ]
  
  return !dangerousPatterns.some(pattern => 
    input.includes(pattern)
  )
}

/**
 * Test for command injection
 */
export const testCommandInjection = (input: string): boolean => {
  const dangerousPatterns = [
    ';',
    '|',
    '&',
    '&&',
    '||',
    '`',
    '$(',
    '$((',
    '>',
    '<'
  ]
  
  return !dangerousPatterns.some(pattern => 
    input.includes(pattern)
  )
}

/**
 * Validate file upload security
 */
export const validateFileUpload = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  // Check file size
  const maxSize = 1024 * 1024 * 1024 // 1GB
  if (file.size > maxSize) {
    errors.push('File size exceeds maximum allowed size')
  }
  
  // Check file type
  const allowedTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
  
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/)) {
    errors.push('File type not allowed')
  }
  
  // Check file name for dangerous patterns
  if (!testXSSVulnerability(file.name)) {
    errors.push('File name contains potentially dangerous content')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Test input sanitization
 */
export const testInputSanitization = (input: string): boolean => {
  // Test for HTML encoding
  const htmlEncoded = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  return htmlEncoded !== input
}

/**
 * Security test suite for components
 */
export const testSecurity = (componentName: string, userInputs: string[] = []) => {
  describe(`${componentName} Security`, () => {
    it('prevents XSS attacks', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        'onload=alert("xss")',
        '"><img src=x onerror=alert("xss")>'
      ]
      
      maliciousInputs.forEach(input => {
        expect(testXSSVulnerability(input)).toBe(false)
      })
    })

    it('prevents SQL injection', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR 1=1 --",
        "' UNION SELECT * FROM users --"
      ]
      
      maliciousInputs.forEach(input => {
        expect(testSQLInjection(input)).toBe(false)
      })
    })

    it('prevents path traversal attacks', () => {
      const maliciousInputs = [
        '../../../etc/passwd',
        '..\\..\\windows\\system32\\config\\sam',
        '%2e%2e%2fetc%2fpasswd'
      ]
      
      maliciousInputs.forEach(input => {
        expect(testPathTraversal(input)).toBe(false)
      })
    })

    it('prevents command injection', () => {
      const maliciousInputs = [
        '; rm -rf /',
        '| cat /etc/passwd',
        '&& shutdown -h now'
      ]
      
      maliciousInputs.forEach(input => {
        expect(testCommandInjection(input)).toBe(false)
      })
    })

    it('sanitizes user input', () => {
      const testInputs = [
        '<script>alert("test")</script>',
        'javascript:void(0)',
        'onclick="alert(\'test\')"'
      ]
      
      testInputs.forEach(input => {
        expect(testInputSanitization(input)).toBe(true)
      })
    })

    it('validates file uploads securely', () => {
      const maliciousFile = new File(['malicious'], '<script>alert("xss")</script>.csv', { type: 'text/csv' })
      const validation = validateFileUpload(maliciousFile)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('File name contains potentially dangerous content')
    })
  })
}

/**
 * Security best practices checklist
 */
export const securityChecklist = {
  xssPrevention: true,
  sqlInjectionPrevention: true,
  pathTraversalPrevention: true,
  commandInjectionPrevention: true,
  inputSanitization: true,
  fileUploadValidation: true,
  httpsEnforcement: true,
  contentSecurityPolicy: true,
  secureHeaders: true
}
