ADMIN_KEY = "testadminsecret"
WRONG_KEY = "wrongkey"


def test_get_config_with_valid_key(client):
    response = client.get(
        "/api/admin/config",
        headers={"X-Admin-Key": ADMIN_KEY},
    )
    assert response.status_code == 200
    data = response.json()
    assert "drop_timestamp" in data
    assert data["gate_password"] == "***"


def test_get_config_with_wrong_key(client):
    response = client.get(
        "/api/admin/config",
        headers={"X-Admin-Key": WRONG_KEY},
    )
    assert response.status_code == 403
    assert response.json()["detail"] == "Forbidden"


def test_update_config_with_valid_key(client):
    response = client.post(
        "/api/admin/config",
        json={"gate_password": "newpass"},
        headers={"X-Admin-Key": ADMIN_KEY},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "updated"


def test_get_orders_with_valid_key(client):
    response = client.get(
        "/api/admin/orders",
        headers={"X-Admin-Key": ADMIN_KEY},
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
