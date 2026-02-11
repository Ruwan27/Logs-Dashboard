import pytest
from uuid import uuid4


class TestHealthEndpoint:
    
    
    def test_health_check(self, client):
        
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["api"] == "healthy"


class TestCreateLog:
    
    
    def test_create_log_success(self, client, sample_log_data):
        
        response = client.post("/logs", json=sample_log_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["message"] == sample_log_data["message"]
        assert data["severity"] == sample_log_data["severity"]
        assert data["source"] == sample_log_data["source"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
    
    def test_create_log_with_timestamp(self, client):
        
        log_data = {
            "message": "Test message",
            "severity": "ERROR",
            "source": "test-service",
            "timestamp": "2026-01-15T10:30:00Z"
        }
        
        response = client.post("/logs", json=log_data)
        
        assert response.status_code == 201
        data = response.json()
        assert "2026-01-15" in data["timestamp"]
    
    def test_create_log_empty_message(self, client):
        log_data = {
            "message": "",
            "severity": "INFO",
            "source": "test-service"
        }
        
        response = client.post("/logs", json=log_data)
        assert response.status_code == 422
    
    def test_create_log_invalid_severity(self, client):
        
        log_data = {
            "message": "Test message",
            "severity": "INVALID",
            "source": "test-service"
        }
        
        response = client.post("/logs", json=log_data)
        assert response.status_code == 422
    
    def test_create_log_missing_required_fields(self, client):
        response = client.post("/logs", json={})
        assert response.status_code == 422


class TestGetLog:
    
    
    def test_get_log_success(self, client, sample_log_data):
        
        # Create a log first
        create_response = client.post("/logs", json=sample_log_data)
        log_id = create_response.json()["id"]
        
        # Get the log
        response = client.get(f"/logs/{log_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == log_id
        assert data["message"] == sample_log_data["message"]
    
    def test_get_log_not_found(self, client):
        
        fake_id = str(uuid4())
        response = client.get(f"/logs/{fake_id}")
        
        assert response.status_code == 404
    
    def test_get_log_invalid_id(self, client):
        
        response = client.get("/logs/invalid-uuid")
        assert response.status_code == 422


class TestListLogs:
    
    
    def test_list_logs_empty(self, client):
        
        response = client.get("/logs")
        
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["page"] == 1
    
    def test_list_logs_pagination(self, client, sample_log_data):
        
        # Create multiple logs
        for i in range(5):
            log_data = sample_log_data.copy()
            log_data["message"] = f"Message {i}"
            client.post("/logs", json=log_data)
        
        # Get first page
        response = client.get("/logs?page=1&page_size=2")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 5
        assert data["page"] == 1
        assert data["page_size"] == 2
        assert data["total_pages"] == 3
    
    def test_list_logs_sorting(self, client, sample_log_data):
        
        # Create logs with different severities
        severities = ["ERROR", "INFO", "DEBUG"]
        for severity in severities:
            log_data = sample_log_data.copy()
            log_data["severity"] = severity
            client.post("/logs", json=log_data)
        
        # Sort by severity ascending
        response = client.get("/logs?sort_by=severity&sort_order=asc")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 3


class TestUpdateLog:
    
    
    def test_update_log_success(self, client, sample_log_data):
        
        # Create a log
        create_response = client.post("/logs", json=sample_log_data)
        log_id = create_response.json()["id"]
        
        # Update the log
        update_data = {
            "message": "Updated message",
            "severity": "ERROR"
        }
        response = client.put(f"/logs/{log_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Updated message"
        assert data["severity"] == "ERROR"
        assert data["source"] == sample_log_data["source"]  # Unchanged
    
    def test_update_log_not_found(self, client):
        
        fake_id = str(uuid4())
        update_data = {"message": "Updated"}
        
        response = client.put(f"/logs/{fake_id}", json=update_data)
        assert response.status_code == 404
    
    def test_update_log_partial(self, client, sample_log_data):
        
        # Create a log
        create_response = client.post("/logs", json=sample_log_data)
        log_id = create_response.json()["id"]
        
        # Update only source
        response = client.put(f"/logs/{log_id}", json={"source": "new-source"})
        
        assert response.status_code == 200
        data = response.json()
        assert data["source"] == "new-source"
        assert data["message"] == sample_log_data["message"]


class TestDeleteLog:
    
    
    def test_delete_log_success(self, client, sample_log_data):
        
        # Create a log
        create_response = client.post("/logs", json=sample_log_data)
        log_id = create_response.json()["id"]
        
        # Delete the log
        response = client.delete(f"/logs/{log_id}")
        assert response.status_code == 204
        
        # Verify deletion
        get_response = client.get(f"/logs/{log_id}")
        assert get_response.status_code == 404
    
    def test_delete_log_not_found(self, client):
        
        fake_id = str(uuid4())
        response = client.delete(f"/logs/{fake_id}")
        assert response.status_code == 404


class TestSearchLogs:
    
    
    def test_search_by_severity(self, client, sample_log_data):
        
        # Create logs with different severities
        for severity in ["INFO", "ERROR", "INFO"]:
            log_data = sample_log_data.copy()
            log_data["severity"] = severity
            client.post("/logs", json=log_data)
        
        # Search for INFO logs
        response = client.get("/logs/search?severity=INFO")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2
        for item in data["items"]:
            assert item["severity"] == "INFO"
    
    def test_search_by_source(self, client, sample_log_data):
        
        # Create logs with different sources
        sources = ["api-gateway", "auth-service", "api-worker"]
        for source in sources:
            log_data = sample_log_data.copy()
            log_data["source"] = source
            client.post("/logs", json=log_data)
        
        # Search for logs with 'api' in source
        response = client.get("/logs/search?source=api")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2  # api-gateway and api-worker
    
    def test_search_by_message(self, client):
        
        # Create logs with different messages
        messages = ["User logged in", "Payment processed", "User logged out"]
        for message in messages:
            client.post("/logs", json={
                "message": message,
                "severity": "INFO",
                "source": "test"
            })
        
        # Search for logs with 'User' in message
        response = client.get("/logs/search?message=User")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 2


class TestAnalytics:
    
    
    def test_log_count_analytics(self, client, sample_log_data):
        """Test log count analytics endpoint."""
        # Create some logs
        for _ in range(3):
            client.post("/logs", json=sample_log_data)
        
        response = client.get("/analytics/log-count")
        
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "total_count" in data
        assert data["total_count"] == 3
        assert data["granularity"] == "day"
    
    def test_log_count_hourly_granularity(self, client, sample_log_data):
        
        client.post("/logs", json=sample_log_data)
        
        response = client.get("/analytics/log-count?granularity=hour")
        
        assert response.status_code == 200
        data = response.json()
        assert data["granularity"] == "hour"
    
    def test_severity_distribution(self, client, sample_log_data):
        
        # Create logs with different severities
        severities = ["INFO", "INFO", "ERROR", "WARN"]
        for severity in severities:
            log_data = sample_log_data.copy()
            log_data["severity"] = severity
            client.post("/logs", json=log_data)
        
        response = client.get("/analytics/severity-distribution")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total_count"] == 4
        assert len(data["data"]) == 3  # INFO, ERROR, WARN


class TestExportLogs:
    
    
    def test_export_logs_csv(self, client, sample_log_data):
        
        # Create some logs
        for _ in range(3):
            client.post("/logs", json=sample_log_data)
        
        response = client.get("/logs/export")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/csv; charset=utf-8"
        assert "attachment" in response.headers["content-disposition"]
        
        # Check CSV content
        content = response.text
        lines = content.strip().split("\n")
        assert len(lines) == 4  # Header + 3 logs
        assert "ID,Timestamp,Severity,Source,Message" in lines[0]
    
    def test_export_logs_filtered(self, client):
        """Test exporting filtered logs to CSV."""
        # Create logs with different severities
        for severity in ["INFO", "ERROR", "INFO"]:
            client.post("/logs", json={
                "message": "Test",
                "severity": severity,
                "source": "test"
            })
        
        # Export only ERROR logs
        response = client.get("/logs/export?severity=ERROR")
        
        assert response.status_code == 200
        content = response.text
        lines = content.strip().split("\n")
        assert len(lines) == 2  # Header + 1 ERROR log
