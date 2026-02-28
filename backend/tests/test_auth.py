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
    assert response.json()["detail"] == "Invalid password"


def test_missing_body_returns_422(client):
    response = client.post("/auth/gate")
    assert response.status_code == 422


def test_admin_password_change_takes_effect(client):
    """DB-sync loop: admin updates password → old fails → new succeeds."""
    # Change password via admin API (invalidates cache immediately)
    change = client.post(
        "/api/admin/config",
        json={"gate_password": "newpassword123"},
        headers={"x-admin-key": "testadminsecret"},
    )
    assert change.status_code == 200

    # Old password must now fail
    old = client.post("/auth/gate", json={"password": "testpassword"})
    assert old.status_code == 401

    # New password must succeed
    new = client.post("/auth/gate", json={"password": "newpassword123"})
    assert new.status_code == 200
    assert new.json()["success"] is True

    # Restore original password so other tests remain valid
    client.post(
        "/api/admin/config",
        json={"gate_password": "testpassword"},
        headers={"x-admin-key": "testadminsecret"},
    )
