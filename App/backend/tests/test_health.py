import pytest

from app import app as flask_app


def test_health_endpoint():
    with flask_app.test_client() as client:
        resp = client.get('/health')
        assert resp.status_code == 200
        assert resp.get_json() == {'status': 'ok'}


