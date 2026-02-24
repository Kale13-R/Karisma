from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_correct_password_returns_200_and_sets_cookie():
    response = client.post("/auth/gate", json={"password": "test-gate-password"})
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert "karisma_session" in response.cookies


def test_wrong_password_returns_401():
    response = client.post("/auth/gate", json={"password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json()["success"] is False
    assert response.json()["error"] == "Invalid password"


def test_missing_body_returns_422():
    response = client.post("/auth/gate")
    assert response.status_code == 422
