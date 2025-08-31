"""
Security module for the RL Futures Trading System backend.
Provides input validation, sanitization, and security utilities.
"""

import re
import html
import json
from typing import Any, Dict, List, Optional, Union
from flask import request, jsonify, current_app
from functools import wraps
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SecurityError(Exception):
    """Custom exception for security-related errors."""
    pass

class InputValidator:
    """Input validation and sanitization utilities."""
    
    @staticmethod
    def sanitize_string(value: str, max_length: int = 1000) -> str:
        """Sanitize and validate string input."""
        if not isinstance(value, str):
            raise SecurityError("Input must be a string")
        
        if len(value) > max_length:
            raise SecurityError(f"Input too long. Maximum length: {max_length}")
        
        # Remove null bytes and control characters
        value = re.sub(r'[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]', '', value)
        
        # HTML escape to prevent XSS
        value = html.escape(value)
        
        return value.strip()
    
    @staticmethod
    def validate_email(email: str) -> str:
        """Validate and sanitize email address."""
        if not email:
            raise SecurityError("Email is required")
        
        email = email.lower().strip()
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_pattern, email):
            raise SecurityError("Invalid email format")
        
        return email
    
    @staticmethod
    def validate_numeric(value: Any, min_val: Optional[float] = None, 
                        max_val: Optional[float] = None) -> float:
        """Validate and convert numeric input."""
        try:
            num = float(value)
        except (ValueError, TypeError):
            raise SecurityError("Input must be a valid number")
        
        if min_val is not None and num < min_val:
            raise SecurityError(f"Value must be at least {min_val}")
        
        if max_val is not None and num > max_val:
            raise SecurityError(f"Value must be at most {max_val}")
        
        return num
    
    @staticmethod
    def validate_json(data: str, max_size: int = 1024 * 1024) -> Dict:
        """Validate and parse JSON input."""
        if len(data) > max_size:
            raise SecurityError("JSON payload too large")
        
        try:
            parsed = json.loads(data)
            if not isinstance(parsed, dict):
                raise SecurityError("JSON must be an object")
            return parsed
        except json.JSONDecodeError as e:
            raise SecurityError(f"Invalid JSON: {str(e)}")
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename to prevent path traversal."""
        if not filename:
            raise SecurityError("Filename is required")
        
        # Remove path traversal attempts
        filename = re.sub(r'[./\\]', '_', filename)
        
        # Remove dangerous characters
        filename = re.sub(r'[^\w\-_.]', '', filename)
        
        if not filename:
            raise SecurityError("Invalid filename")
        
        return filename

class RateLimiter:
    """Simple in-memory rate limiter for development."""
    
    def __init__(self):
        self.requests = {}
        self.max_requests = 100  # requests per window
        self.window_size = 60    # seconds
    
    def is_allowed(self, ip: str) -> bool:
        """Check if IP is allowed to make a request."""
        current_time = int(time.time())
        window_start = current_time - self.window_size
        
        # Clean old entries
        if ip in self.requests:
            self.requests[ip] = [t for t in self.requests[ip] if t > window_start]
        
        # Check rate limit
        if ip not in self.requests:
            self.requests[ip] = []
        
        if len(self.requests[ip]) >= self.max_requests:
            return False
        
        self.requests[ip].append(current_time)
        return True

# Global rate limiter instance
rate_limiter = RateLimiter()

def require_validation(required_fields: List[str] = None):
    """Decorator to require input validation."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Validate required fields
                if required_fields:
                    data = request.get_json() or {}
                    for field in required_fields:
                        if field not in data:
                            raise SecurityError(f"Missing required field: {field}")
                
                return f(*args, **kwargs)
            except SecurityError as e:
                logger.warning(f"Security validation failed: {str(e)}")
                return jsonify({'error': str(e)}), 400
            except Exception as e:
                logger.error(f"Unexpected error: {str(e)}")
                return jsonify({'error': 'Internal server error'}), 500
        
        return decorated_function
    return decorator

def rate_limit(max_requests: int = 100, window: int = 60):
    """Decorator to apply rate limiting."""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip = request.remote_addr
            
            if not rate_limiter.is_allowed(ip):
                logger.warning(f"Rate limit exceeded for IP: {ip}")
                return jsonify({'error': 'Rate limit exceeded'}), 429
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def sanitize_input(data: Union[str, Dict, List]) -> Union[str, Dict, List]:
    """Recursively sanitize input data."""
    if isinstance(data, str):
        return InputValidator.sanitize_string(data)
    elif isinstance(data, dict):
        return {k: sanitize_input(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [sanitize_input(item) for item in data]
    else:
        return data

# Security middleware
def security_middleware():
    """Apply security headers and checks to all responses."""
    @current_app.after_request
    def add_security_headers(response):
        # Security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Remove server information
        response.headers.pop('Server', None)
        
        return response
    
    return security_middleware
