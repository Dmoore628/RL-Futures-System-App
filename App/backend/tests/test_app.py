import pytest
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

class TestApp:
    def test_health_endpoint(self, client):
        """Test the health endpoint returns correct response"""
        response = client.get('/health')
        
        assert response.status_code == 200
        assert response.json['status'] == 'ok'
    
    def test_root_endpoint(self, client):
        """Test the root endpoint returns correct response"""
        response = client.get('/')
        
        assert response.status_code == 200
        assert response.data.decode('utf-8') == 'Backend is running'
    
    def test_health_endpoint_methods(self, client):
        """Test that health endpoint only accepts GET method"""
        # Test POST method (should fail)
        response = client.post('/health')
        assert response.status_code == 405  # Method Not Allowed
        
        # Test PUT method (should fail)
        response = client.put('/health')
        assert response.status_code == 405  # Method Not Allowed
        
        # Test DELETE method (should fail)
        response = client.delete('/health')
        assert response.status_code == 405  # Method Not Allowed
    
    def test_root_endpoint_methods(self, client):
        """Test that root endpoint only accepts GET method"""
        # Test POST method (should fail)
        response = client.post('/')
        assert response.status_code == 405  # Method Not Allowed
        
        # Test PUT method (should fail)
        response = client.put('/')
        assert response.status_code == 405  # Method Not Allowed
        
        # Test DELETE method (should fail)
        response = client.delete('/')
        assert response.status_code == 405  # Method Not Allowed
    
    def test_health_response_format(self, client):
        """Test that health endpoint returns proper JSON format"""
        response = client.get('/health')
        
        assert response.content_type == 'application/json'
        assert 'status' in response.json
        assert response.json['status'] == 'ok'
    
    def test_nonexistent_endpoint(self, client):
        """Test that nonexistent endpoints return 404"""
        response = client.get('/nonexistent')
        assert response.status_code == 404
    
    def test_health_endpoint_headers(self, client):
        """Test that health endpoint has proper headers"""
        response = client.get('/health')
        
        # Check for CORS headers if implemented
        assert response.status_code == 200
        
        # Check content type
        assert 'application/json' in response.content_type
    
    def test_root_endpoint_headers(self, client):
        """Test that root endpoint has proper headers"""
        response = client.get('/')
        
        assert response.status_code == 200
        assert 'text/html' in response.content_type or 'text/plain' in response.content_type
    
    def test_multiple_health_requests(self, client):
        """Test that health endpoint handles multiple requests correctly"""
        # Make multiple requests
        for i in range(5):
            response = client.get('/health')
            assert response.status_code == 200
            assert response.json['status'] == 'ok'
    
    def test_health_endpoint_performance(self, client):
        """Test that health endpoint responds quickly"""
        import time
        
        start_time = time.time()
        response = client.get('/health')
        end_time = time.time()
        
        assert response.status_code == 200
        # Should respond in under 100ms
        assert (end_time - start_time) < 0.1
    
    def test_app_configuration(self):
        """Test that app is configured correctly"""
        assert app.config['TESTING'] == True
        
        # Test that app has required attributes
        assert hasattr(app, 'route')
        assert hasattr(app, 'run')
    
    def test_health_endpoint_content(self, client):
        """Test the exact content of health endpoint"""
        response = client.get('/health')
        
        expected_content = {'status': 'ok'}
        assert response.json == expected_content
    
    def test_root_endpoint_content(self, client):
        """Test the exact content of root endpoint"""
        response = client.get('/')
        
        expected_content = 'Backend is running'
        assert response.data.decode('utf-8') == expected_content
