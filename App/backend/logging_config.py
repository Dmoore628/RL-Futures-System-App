"""
Structured Logging Configuration for RL Futures Trading System
Provides consistent, structured logging across the application
"""

import logging
import logging.handlers
import os
import sys
from datetime import datetime
from typing import Dict, Any
import json

class StructuredFormatter(logging.Formatter):
    """Custom formatter for structured logging"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as structured JSON"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)
        
        # Add extra fields if present
        if hasattr(record, 'extra_fields'):
            log_entry.update(record.extra_fields)
        
        # Add request context if available
        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id
        
        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id
        
        return json.dumps(log_entry, default=str)

class SecurityFormatter(logging.Formatter):
    """Special formatter for security-related logs"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format security log record with additional context"""
        security_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'security_event': True,
            'ip_address': getattr(record, 'ip_address', 'unknown'),
            'user_agent': getattr(record, 'user_agent', 'unknown'),
            'endpoint': getattr(record, 'endpoint', 'unknown'),
            'user_id': getattr(record, 'user_id', 'anonymous'),
            'risk_level': getattr(record, 'risk_level', 'low'),
        }
        
        if record.exc_info:
            security_entry['exception'] = self.formatException(record.exc_info)
        
        return json.dumps(security_entry, default=str)

def setup_logging(
    log_level: str = "INFO",
    log_file: str = "logs/app.log",
    max_file_size: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5,
    enable_console: bool = True,
    enable_file: bool = True,
    enable_security_logging: bool = True
) -> None:
    """Setup comprehensive logging configuration"""
    
    # Create logs directory if it doesn't exist
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Create formatters
    structured_formatter = StructuredFormatter()
    security_formatter = SecurityFormatter()
    
    # Console handler
    if enable_console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(structured_formatter)
        root_logger.addHandler(console_handler)
    
    # File handler for general logs
    if enable_file:
        file_handler = logging.handlers.RotatingFileHandler(
            log_file,
            maxBytes=max_file_size,
            backupCount=backup_count
        )
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(structured_formatter)
        root_logger.addHandler(file_handler)
    
    # Security logging handler
    if enable_security_logging:
        security_log_file = log_file.replace('.log', '_security.log')
        security_handler = logging.handlers.RotatingFileHandler(
            security_log_file,
            maxBytes=max_file_size,
            backupCount=backup_count
        )
        security_handler.setLevel(logging.INFO)
        security_handler.setFormatter(security_formatter)
        
        # Create security logger
        security_logger = logging.getLogger('security')
        security_logger.addHandler(security_handler)
        security_logger.setLevel(logging.INFO)
        security_logger.propagate = False
    
    # Error logging handler
    error_log_file = log_file.replace('.log', '_error.log')
    error_handler = logging.handlers.RotatingFileHandler(
        error_log_file,
        maxBytes=max_file_size,
        backupCount=backup_count
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(structured_formatter)
    
    # Create error logger
    error_logger = logging.getLogger('error')
    error_logger.addHandler(error_handler)
    error_logger.setLevel(logging.ERROR)
    error_logger.propagate = False
    
    # Set specific logger levels
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    
    # Log startup message
    logging.info("Logging system initialized", extra={
        'extra_fields': {
            'log_level': log_level,
            'log_file': log_file,
            'max_file_size_mb': max_file_size // (1024 * 1024),
            'backup_count': backup_count,
        }
    })

def log_security_event(
    message: str,
    level: str = "INFO",
    ip_address: str = None,
    user_agent: str = None,
    endpoint: str = None,
    user_id: str = None,
    risk_level: str = "low",
    extra_fields: Dict[str, Any] = None
) -> None:
    """Log security-related events with structured context"""
    security_logger = logging.getLogger('security')
    
    # Create log record with security context
    record = logging.LogRecord(
        name='security',
        level=getattr(logging, level.upper()),
        pathname='',
        lineno=0,
        msg=message,
        args=(),
        exc_info=None
    )
    
    # Add security context
    record.ip_address = ip_address
    record.user_agent = user_agent
    record.endpoint = endpoint
    record.user_id = user_id
    record.risk_level = risk_level
    
    # Add extra fields
    if extra_fields:
        record.extra_fields = extra_fields
    
    security_logger.handle(record)

def log_request(
    request_id: str,
    method: str,
    endpoint: str,
    status_code: int,
    response_time: float,
    user_id: str = None,
    ip_address: str = None,
    user_agent: str = None
) -> None:
    """Log HTTP request details"""
    logger = logging.getLogger('requests')
    
    log_data = {
        'request_id': request_id,
        'method': method,
        'endpoint': endpoint,
        'status_code': status_code,
        'response_time_ms': round(response_time * 1000, 2),
        'user_id': user_id,
        'ip_address': ip_address,
        'user_agent': user_agent,
    }
    
    # Determine log level based on status code
    if status_code >= 500:
        log_level = logging.ERROR
    elif status_code >= 400:
        log_level = logging.WARNING
    else:
        log_level = logging.INFO
    
    logger.log(log_level, f"HTTP {method} {endpoint} - {status_code}", extra={
        'extra_fields': log_data
    })

def log_performance_metric(
    metric_name: str,
    value: float,
    unit: str = None,
    tags: Dict[str, str] = None
) -> None:
    """Log performance metrics"""
    logger = logging.getLogger('performance')
    
    log_data = {
        'metric_name': metric_name,
        'value': value,
        'unit': unit,
        'tags': tags or {},
    }
    
    logger.info(f"Performance metric: {metric_name} = {value}{unit or ''}", extra={
        'extra_fields': log_data
    })

def log_business_event(
    event_type: str,
    event_data: Dict[str, Any],
    user_id: str = None,
    session_id: str = None
) -> None:
    """Log business events"""
    logger = logging.getLogger('business')
    
    log_data = {
        'event_type': event_type,
        'event_data': event_data,
        'user_id': user_id,
        'session_id': session_id,
    }
    
    logger.info(f"Business event: {event_type}", extra={
        'extra_fields': log_data
    })

# Convenience functions for common logging patterns
def log_error_with_context(
    message: str,
    error: Exception = None,
    context: Dict[str, Any] = None
) -> None:
    """Log error with context information"""
    logger = logging.getLogger('error')
    
    extra_fields = context or {}
    if error:
        extra_fields['error_type'] = type(error).__name__
        extra_fields['error_message'] = str(error)
    
    logger.error(message, extra={'extra_fields': extra_fields}, exc_info=bool(error))

def log_warning_with_context(
    message: str,
    context: Dict[str, Any] = None
) -> None:
    """Log warning with context information"""
    logger = logging.getLogger('warning')
    
    extra_fields = context or {}
    logger.warning(message, extra={'extra_fields': extra_fields})

def log_info_with_context(
    message: str,
    context: Dict[str, Any] = None
) -> None:
    """Log info with context information"""
    logger = logging.getLogger('info')
    
    extra_fields = context or {}
    logger.info(message, extra={'extra_fields': extra_fields})
