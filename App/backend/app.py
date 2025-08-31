"""
Enhanced Flask backend for RL Futures Trading System with security features.
"""

from flask import Flask, jsonify, request
from security import (
    require_validation, 
    rate_limit, 
    sanitize_input, 
    security_middleware,
    InputValidator,
    SecurityError
)
import logging
import os
import time
from health import get_health_status, get_detailed_health, record_request
from metrics import increment_request_counter, record_request_duration, export_prometheus_metrics
from logging_config import setup_logging, log_request, log_security_event

# Configure logging
setup_logging(
    log_level=os.environ.get('LOG_LEVEL', 'INFO'),
    log_file=os.environ.get('LOG_FILE', 'logs/app.log'),
    enable_console=True,
    enable_file=True,
    enable_security_logging=True
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Request monitoring middleware
@app.before_request
def before_request():
    """Record request start time and basic info"""
    request.start_time = time.time()
    request.request_id = f"req_{int(time.time() * 1000)}"

@app.after_request
def after_request(response):
    """Record request metrics and logging"""
    if hasattr(request, 'start_time'):
        duration = time.time() - request.start_time
        request_id = getattr(request, 'request_id', 'unknown')
        
        # Record metrics
        increment_request_counter(request.method, request.endpoint, response.status_code)
        record_request_duration(request.method, request.endpoint, duration)
        
        # Log request
        log_request(
            request_id=request_id,
            method=request.method,
            endpoint=request.endpoint,
            status_code=response.status_code,
            response_time=duration,
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent')
        )
        
        # Log security events for failed requests
        if response.status_code >= 400:
            log_security_event(
                message=f"Request failed: {request.method} {request.endpoint}",
                level="WARNING",
                ip_address=request.remote_addr,
                user_agent=request.headers.get('User-Agent'),
                endpoint=request.endpoint,
                risk_level="medium" if response.status_code >= 500 else "low"
            )
    
    return response

# Apply security middleware
security_middleware()

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

@app.route('/health', methods=['GET'])
@rate_limit(max_requests=100, window=60)
def health():
    """Enhanced health check endpoint with comprehensive monitoring."""
    health_data = get_health_status()
    return jsonify(health_data), 200

@app.route('/health/detailed', methods=['GET'])
@rate_limit(max_requests=50, window=60)
def detailed_health():
    """Detailed health check endpoint with system information."""
    health_data = get_detailed_health()
    return jsonify(health_data), 200

@app.route('/metrics', methods=['GET'])
@rate_limit(max_requests=100, window=60)
def metrics():
    """Prometheus metrics endpoint."""
    try:
        metrics_data = export_prometheus_metrics()
        return metrics_data, 200, {'Content-Type': 'text/plain'}
    except Exception as e:
        logger.error(f"Failed to export metrics: {e}")
        return jsonify({'error': 'Failed to export metrics'}), 500

@app.route('/metrics/summary', methods=['GET'])
@rate_limit(max_requests=50, window=60)
def metrics_summary():
    """Human-readable metrics summary endpoint."""
    try:
        from metrics import get_metrics_summary
        summary = get_metrics_summary()
        return jsonify(summary), 200
    except Exception as e:
        logger.error(f"Failed to get metrics summary: {e}")
        return jsonify({'error': 'Failed to get metrics summary'}), 500

@app.route('/', methods=['GET'])
@rate_limit(max_requests=100, window=60)
def index():
    """Main endpoint with rate limiting."""
    return jsonify({
        'message': 'RL Futures Trading System Backend',
        'status': 'running',
        'endpoints': {
            'health': '/health',
            'upload': '/api/upload',
            'config': '/api/config'
        }
    }), 200

@app.route('/api/upload', methods=['POST'])
@rate_limit(max_requests=10, window=60)  # Stricter rate limit for file uploads
@require_validation(['filename', 'data'])
def upload_file():
    """File upload endpoint with validation and sanitization."""
    try:
        data = request.get_json()
        
        # Validate and sanitize input
        filename = InputValidator.sanitize_filename(data['filename'])
        file_data = data['data']
        
        # Additional validation for file data
        if not isinstance(file_data, (str, list)):
            raise SecurityError("Invalid file data format")
        
        # Process the file data (placeholder for actual processing)
        processed_data = {
            'filename': filename,
            'size': len(str(file_data)),
            'status': 'processed'
        }
        
        logger.info(f"File uploaded successfully: {filename}")
        return jsonify(processed_data), 200
        
    except SecurityError as e:
        logger.warning(f"Upload validation failed: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Upload processing error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/config', methods=['GET', 'POST'])
@rate_limit(max_requests=50, window=60)
def config_endpoint():
    """Configuration endpoint with different methods."""
    if request.method == 'GET':
        return jsonify({
            'trading_params': {
                'risk_tolerance': 'medium',
                'max_position_size': 1000,
                'stop_loss_percentage': 2.0
            },
            'ppo_settings': {
                'learning_rate': 0.0003,
                'batch_size': 64,
                'epochs': 10
            }
        }), 200
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            if not data:
                raise SecurityError("No configuration data provided")
            
            # Validate and sanitize configuration data
            sanitized_data = sanitize_input(data)
            
            # Process configuration (placeholder)
            logger.info(f"Configuration updated: {sanitized_data}")
            
            return jsonify({
                'message': 'Configuration updated successfully',
                'data': sanitized_data
            }), 200
            
        except SecurityError as e:
            logger.warning(f"Configuration validation failed: {str(e)}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"Configuration processing error: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/validate', methods=['POST'])
@rate_limit(max_requests=100, window=60)
@require_validation(['data'])
def validate_data():
    """Data validation endpoint."""
    try:
        data = request.get_json()
        input_data = data['data']
        
        # Sanitize and validate the input
        sanitized_data = sanitize_input(input_data)
        
        # Perform additional validation based on data type
        validation_result = {
            'valid': True,
            'sanitized_data': sanitized_data,
            'warnings': []
        }
        
        # Add specific validation logic here
        if isinstance(sanitized_data, str) and len(sanitized_data) > 1000:
            validation_result['warnings'].append('Data length exceeds recommended limit')
        
        return jsonify(validation_result), 200
        
    except SecurityError as e:
        logger.warning(f"Data validation failed: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Validation processing error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({'error': 'Method not allowed'}), 405

@app.errorhandler(413)
def payload_too_large(error):
    """Handle 413 errors (file too large)."""
    return jsonify({'error': 'File too large'}), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Production settings
    debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    
    app.run(
        host='0.0.0.0', 
        port=8000,
        debug=debug_mode,
        threaded=True
    )


