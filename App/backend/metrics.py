"""
Prometheus Metrics Collection for RL Futures Trading System
Provides comprehensive metrics for monitoring and alerting
"""

import time
import threading
from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

@dataclass
class MetricValue:
    """Represents a metric value with timestamp"""
    value: float
    timestamp: datetime
    labels: Dict[str, str]

class MetricsCollector:
    """Collects and manages application metrics"""
    
    def __init__(self):
        self.metrics = {}
        self._lock = threading.Lock()
        self.start_time = datetime.utcnow()
    
    def increment_counter(self, name: str, labels: Dict[str, str] = None, value: int = 1):
        """Increment a counter metric"""
        with self._lock:
            key = self._get_metric_key(name, labels)
            if key not in self.metrics:
                self.metrics[key] = MetricValue(0, datetime.utcnow(), labels or {})
            self.metrics[key].value += value
            self.metrics[key].timestamp = datetime.utcnow()
    
    def set_gauge(self, name: str, value: float, labels: Dict[str, str] = None):
        """Set a gauge metric value"""
        with self._lock:
            key = self._get_metric_key(name, labels)
            self.metrics[key] = MetricValue(value, datetime.utcnow(), labels or {})
    
    def record_histogram(self, name: str, value: float, labels: Dict[str, str] = None):
        """Record a histogram metric value"""
        with self._lock:
            # Create histogram buckets
            buckets = [0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0]
            
            for bucket in buckets:
                bucket_labels = labels.copy() if labels else {}
                bucket_labels["le"] = str(bucket)
                bucket_key = self._get_metric_key(f"{name}_bucket", bucket_labels)
                if bucket_key not in self.metrics:
                    self.metrics[bucket_key] = MetricValue(0, datetime.utcnow(), bucket_labels)
                
                if value <= bucket:
                    self.metrics[bucket_key].value += 1
                    self.metrics[bucket_key].timestamp = datetime.utcnow()
            
            # Record sum and count
            sum_key = self._get_metric_key(f"{name}_sum", labels)
            count_key = self._get_metric_key(f"{name}_count", labels)
            
            if sum_key not in self.metrics:
                self.metrics[sum_key] = MetricValue(0, datetime.utcnow(), labels or {})
            if count_key not in self.metrics:
                self.metrics[count_key] = MetricValue(0, datetime.utcnow(), labels or {})
            
            self.metrics[sum_key].value += value
            self.metrics[count_key].value += 1
            self.metrics[sum_key].timestamp = datetime.utcnow()
            self.metrics[count_key].timestamp = datetime.utcnow()
    
    def get_metric(self, name: str, labels: Dict[str, str] = None) -> Optional[MetricValue]:
        """Get a specific metric value"""
        with self._lock:
            key = self._get_metric_key(name, labels)
            return self.metrics.get(key)
    
    def get_all_metrics(self) -> Dict[str, MetricValue]:
        """Get all collected metrics"""
        with self._lock:
            return self.metrics.copy()
    
    def reset_metrics(self):
        """Reset all metrics"""
        with self._lock:
            self.metrics.clear()
    
    def _get_metric_key(self, name: str, labels: Dict[str, str] = None) -> str:
        """Generate a unique key for a metric"""
        if not labels:
            return name
        
        # Sort labels for consistent key generation
        sorted_labels = sorted(labels.items())
        label_str = "_".join(f"{k}_{v}" for k, v in sorted_labels)
        return f"{name}_{label_str}"
    
    def generate_prometheus_format(self) -> str:
        """Generate metrics in Prometheus exposition format"""
        with self._lock:
            lines = []
            
            # Add application info
            lines.append("# HELP rl_futures_app_info Application information")
            lines.append("# TYPE rl_futures_app_info gauge")
            lines.append(f"rl_futures_app_info{{version=\"0.1.0\"}} 1")
            lines.append("")
            
            # Group metrics by type
            counters = {}
            gauges = {}
            histograms = {}
            
            for key, metric in self.metrics.items():
                if key.endswith('_sum') or key.endswith('_count') or key.endswith('_bucket'):
                    histograms[key] = metric
                elif key.startswith('counter_'):
                    counters[key] = metric
                else:
                    gauges[key] = metric
            
            # Output counters
            if counters:
                lines.append("# HELP rl_futures_counters Application counters")
                lines.append("# TYPE rl_futures_counters counter")
                for key, metric in counters.items():
                    label_str = self._format_labels(metric.labels)
                    lines.append(f"rl_futures_counters{{{label_str}}} {metric.value}")
                lines.append("")
            
            # Output gauges
            if gauges:
                lines.append("# HELP rl_futures_gauges Application gauges")
                lines.append("# TYPE rl_futures_gauges gauge")
                for key, metric in gauges.items():
                    label_str = self._format_labels(metric.labels)
                    lines.append(f"rl_futures_gauges{{{label_str}}} {metric.value}")
                lines.append("")
            
            # Output histograms
            if histograms:
                lines.append("# HELP rl_futures_histograms Application histograms")
                lines.append("# TYPE rl_futures_histograms histogram")
                for key, metric in histograms.items():
                    label_str = self._format_labels(metric.labels)
                    lines.append(f"rl_futures_histograms{{{label_str}}} {metric.value}")
                lines.append("")
            
            # Add uptime metric
            uptime = (datetime.utcnow() - self.start_time).total_seconds()
            lines.append("# HELP rl_futures_uptime_seconds Application uptime in seconds")
            lines.append("# TYPE rl_futures_uptime_seconds gauge")
            lines.append(f"rl_futures_uptime_seconds {uptime}")
            
            return "\n".join(lines)
    
    def _format_labels(self, labels: Dict[str, str]) -> str:
        """Format labels for Prometheus output"""
        if not labels:
            return ""
        
        formatted = []
        for key, value in sorted(labels.items()):
            # Escape special characters in label values
            escaped_value = value.replace('\\', '\\\\').replace('"', '\\"')
            formatted.append(f'{key}="{escaped_value}"')
        
        return ",".join(formatted)

# Global metrics collector instance
metrics_collector = MetricsCollector()

# Convenience functions for common metrics
def increment_request_counter(method: str, endpoint: str, status_code: int):
    """Increment HTTP request counter"""
    metrics_collector.increment_counter(
        "http_requests_total",
        {"method": method, "endpoint": endpoint, "status": str(status_code)}
    )

def record_request_duration(method: str, endpoint: str, duration: float):
    """Record HTTP request duration"""
    metrics_collector.record_histogram(
        "http_request_duration_seconds",
        duration,
        {"method": method, "endpoint": endpoint}
    )

def set_active_connections(count: int):
    """Set active connections gauge"""
    metrics_collector.set_gauge("active_connections", count)

def increment_file_upload_counter(success: bool, file_type: str):
    """Increment file upload counter"""
    metrics_collector.increment_counter(
        "file_uploads_total",
        {"success": str(success).lower(), "file_type": file_type}
    )

def record_file_upload_size(file_type: str, size_bytes: int):
    """Record file upload size"""
    metrics_collector.record_histogram(
        "file_upload_size_bytes",
        size_bytes,
        {"file_type": file_type}
    )

def set_memory_usage(bytes_used: int):
    """Set memory usage gauge"""
    metrics_collector.set_gauge("memory_usage_bytes", bytes_used)

def set_cpu_usage(percentage: float):
    """Set CPU usage gauge"""
    metrics_collector.set_gauge("cpu_usage_percent", percentage)

def increment_security_event_counter(event_type: str, risk_level: str):
    """Increment security event counter"""
    metrics_collector.increment_counter(
        "security_events_total",
        {"event_type": event_type, "risk_level": risk_level}
    )

def record_validation_duration(validation_type: str, duration: float):
    """Record validation duration"""
    metrics_collector.record_histogram(
        "validation_duration_seconds",
        duration,
        {"validation_type": validation_type}
    )

def get_metrics_summary() -> Dict[str, Any]:
    """Get a summary of current metrics"""
    all_metrics = metrics_collector.get_all_metrics()
    
    summary = {
        'total_metrics': len(all_metrics),
        'counters': {},
        'gauges': {},
        'histograms': {},
        'timestamp': datetime.utcnow().isoformat(),
    }
    
    for key, metric in all_metrics.items():
        if key.endswith('_sum') or key.endswith('_count') or key.endswith('_bucket'):
            summary['histograms'][key] = {
                'value': metric.value,
                'labels': metric.labels,
                'timestamp': metric.timestamp.isoformat()
            }
        elif key.startswith('counter_'):
            summary['counters'][key] = {
                'value': metric.value,
                'labels': metric.labels,
                'timestamp': metric.timestamp.isoformat()
            }
        else:
            summary['gauges'][key] = {
                'value': metric.value,
                'labels': metric.labels,
                'timestamp': metric.timestamp.isoformat()
            }
    
    return summary

def reset_all_metrics():
    """Reset all collected metrics"""
    metrics_collector.reset_metrics()
    logger.info("All metrics have been reset")

def export_prometheus_metrics() -> str:
    """Export metrics in Prometheus format"""
    return metrics_collector.generate_prometheus_format()
