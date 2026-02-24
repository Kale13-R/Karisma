def test_correct_password_returns_200_and_sets_cookie(client):
    response = client.post("/auth/gate", json={"password": "testpassword"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["session"] is not None
    assert data["session"]["isAuthenticated"] is True
    assert "karisma_session" in response.cookies


def test_wrong_password_returns_401(client):
    response = client.post("/auth/gate", json={"password": "wrongpassword"})
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "Invalid password"


def test_missing_body_returns_422(client):
    response = client.post("/auth/gate")
    assert response.status_code == 422
