"""
Comprehensive Health Monitoring System for RL Futures Trading System
Provides detailed health checks, metrics, and system status information
"""

import os
import psutil
import time
import threading
from datetime import datetime, timedelta
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class HealthMonitor:
    """Comprehensive health monitoring system"""
    
    def __init__(self):
        self.start_time = time.time()
        self.health_history = []
        self.max_history_size = 100
        self.metrics = {
            'requests_total': 0,
            'requests_successful': 0,
            'requests_failed': 0,
            'average_response_time': 0,
            'last_check': None,
        }
        self._lock = threading.Lock()
    
    def get_system_health(self) -> Dict[str, Any]:
        """Get comprehensive system health status"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            health_status = {
                'status': 'healthy',
                'timestamp': datetime.utcnow().isoformat(),
                'uptime': self._get_uptime(),
                'system': {
                    'cpu_percent': cpu_percent,
                    'memory_percent': memory.percent,
                    'memory_available_gb': round(memory.available / (1024**3), 2),
                    'disk_percent': disk.percent,
                    'disk_free_gb': round(disk.free / (1024**3), 2),
                },
                'application': {
                    'requests_total': self.metrics['requests_total'],
                    'requests_successful': self.metrics['requests_successful'],
                    'requests_failed': self.metrics['requests_failed'],
                    'success_rate': self._calculate_success_rate(),
                    'average_response_time': self.metrics['average_response_time'],
                },
                'environment': {
                    'python_version': os.sys.version,
                    'environment': os.getenv('FLASK_ENV', 'development'),
                    'debug_mode': os.getenv('FLASK_DEBUG', 'false').lower() == 'true',
                }
            }
            
            # Determine overall health status
            if (cpu_percent > 90 or memory.percent > 90 or 
                disk.percent > 90 or self._calculate_success_rate() < 0.95):
                health_status['status'] = 'degraded'
            
            if (cpu_percent > 95 or memory.percent > 95 or 
                disk.percent > 95 or self._calculate_success_rate() < 0.90):
                health_status['status'] = 'unhealthy'
            
            # Store health history
            self._store_health_history(health_status)
            
            return health_status
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                'status': 'error',
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e),
                'uptime': self._get_uptime(),
            }
    
    def get_detailed_health(self) -> Dict[str, Any]:
        """Get detailed health information including history"""
        basic_health = self.get_system_health()
        
        detailed_health = {
            **basic_health,
            'history': self._get_health_summary(),
            'processes': self._get_process_info(),
            'network': self._get_network_info(),
        }
        
        return detailed_health
    
    def record_request(self, success: bool, response_time: float):
        """Record request metrics"""
        with self._lock:
            self.metrics['requests_total'] += 1
            if success:
                self.metrics['requests_successful'] += 1
            else:
                self.metrics['requests_failed'] += 1
            
            # Update average response time
            current_avg = self.metrics['average_response_time']
            total_requests = self.metrics['requests_total']
            self.metrics['average_response_time'] = (
                (current_avg * (total_requests - 1) + response_time) / total_requests
            )
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics"""
        with self._lock:
            return self.metrics.copy()
    
    def reset_metrics(self):
        """Reset all metrics"""
        with self._lock:
            self.metrics = {
                'requests_total': 0,
                'requests_successful': 0,
                'requests_failed': 0,
                'average_response_time': 0,
                'last_check': None,
            }
    
    def _get_uptime(self) -> str:
        """Get formatted uptime string"""
        uptime_seconds = time.time() - self.start_time
        uptime_timedelta = timedelta(seconds=int(uptime_seconds))
        
        days = uptime_timedelta.days
        hours, remainder = divmod(uptime_timedelta.seconds, 3600)
        minutes, seconds = divmod(remainder, 60)
        
        if days > 0:
            return f"{days}d {hours}h {minutes}m"
        elif hours > 0:
            return f"{hours}h {minutes}m"
        else:
            return f"{minutes}m {seconds}s"
    
    def _calculate_success_rate(self) -> float:
        """Calculate request success rate"""
        total = self.metrics['requests_total']
        if total == 0:
            return 1.0
        return self.metrics['requests_successful'] / total
    
    def _store_health_history(self, health_status: Dict[str, Any]):
        """Store health status in history"""
        with self._lock:
            self.health_history.append(health_status)
            if len(self.health_history) > self.max_history_size:
                self.health_history.pop(0)
    
    def _get_health_summary(self) -> Dict[str, Any]:
        """Get summary of health history"""
        if not self.health_history:
            return {}
        
        recent_checks = self.health_history[-10:]  # Last 10 checks
        status_counts = {}
        
        for check in recent_checks:
            status = check.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            'recent_status_distribution': status_counts,
            'total_checks': len(self.health_history),
            'last_10_statuses': [check.get('status') for check in recent_checks],
        }
    
    def _get_process_info(self) -> Dict[str, Any]:
        """Get current process information"""
        try:
            process = psutil.Process()
            return {
                'pid': process.pid,
                'memory_mb': round(process.memory_info().rss / (1024**2), 2),
                'cpu_percent': process.cpu_percent(),
                'num_threads': process.num_threads(),
                'open_files': len(process.open_files()),
                'connections': len(process.connections()),
            }
        except Exception as e:
            logger.error(f"Failed to get process info: {e}")
            return {'error': str(e)}
    
    def _get_network_info(self) -> Dict[str, Any]:
        """Get network interface information"""
        try:
            network_stats = psutil.net_io_counters()
            return {
                'bytes_sent': network_stats.bytes_sent,
                'bytes_recv': network_stats.bytes_recv,
                'packets_sent': network_stats.packets_sent,
                'packets_recv': network_stats.packets_recv,
                'connections': len(psutil.net_connections()),
            }
        except Exception as e:
            logger.error(f"Failed to get network info: {e}")
            return {'error': str(e)}

# Global health monitor instance
health_monitor = HealthMonitor()

def get_health_status() -> Dict[str, Any]:
    """Get basic health status"""
    return health_monitor.get_system_health()

def get_detailed_health() -> Dict[str, Any]:
    """Get detailed health information"""
    return health_monitor.get_detailed_health()

def record_request(success: bool, response_time: float):
    """Record request metrics"""
    health_monitor.record_request(success, response_time)

def get_metrics() -> Dict[str, Any]:
    """Get current metrics"""
    return health_monitor.get_metrics()

def reset_metrics():
    """Reset all metrics"""
    health_monitor.reset_metrics()
