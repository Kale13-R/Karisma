"""
Tests for /api/accounts/* endpoints.
Uses unique emails per test to avoid DB collisions across runs.
send_welcome_email is mocked so tests never hit the Resend API.
"""
import uuid
from unittest.mock import patch

import pytest


@pytest.fixture(autouse=True)
def mock_welcome_email():
    with patch("app.api.routes.accounts.send_welcome_email"):
        yield


def _email() -> str:
    return f"test_{uuid.uuid4().hex[:10]}@example.com"


# ── Register ────────────────────────────────────────────────────────────────

def test_register_success(client):
    res = client.post("/api/accounts/register", json={"email": _email(), "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "user" in data
    assert data["user"]["id"] is not None
    assert "karisma_user" in res.cookies


def test_register_duplicate_email_returns_409(client):
    email = _email()
    client.post("/api/accounts/register", json={"email": email, "password": "password123"})
    res = client.post("/api/accounts/register", json={"email": email, "password": "password123"})
    assert res.status_code == 409
    assert "already exists" in res.json()["detail"]


def test_register_short_password_returns_422(client):
    res = client.post("/api/accounts/register", json={"email": _email(), "password": "short"})
    assert res.status_code == 422


def test_register_invalid_email_returns_422(client):
    res = client.post("/api/accounts/register", json={"email": "notanemail", "password": "password123"})
    assert res.status_code == 422


# ── Login ────────────────────────────────────────────────────────────────────

def test_login_success(client):
    email = _email()
    client.post("/api/accounts/register", json={"email": email, "password": "password123"})

    res = client.post("/api/accounts/login", json={"email": email, "password": "password123"})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["user"]["email"] == email
    assert "karisma_user" in res.cookies


def test_login_wrong_password_returns_401(client):
    email = _email()
    client.post("/api/accounts/register", json={"email": email, "password": "password123"})

    res = client.post("/api/accounts/login", json={"email": email, "password": "wrongpassword"})
    assert res.status_code == 401
    assert "Invalid" in res.json()["detail"]


def test_login_unknown_email_returns_401(client):
    res = client.post("/api/accounts/login", json={"email": "nobody@example.com", "password": "password123"})
    assert res.status_code == 401


# ── Me ───────────────────────────────────────────────────────────────────────

def test_me_returns_user_when_authenticated(client):
    email = _email()
    client.post("/api/accounts/register", json={"email": email, "password": "password123"})

    # TestClient preserves cookies within the same instance
    res = client.get("/api/accounts/me")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["user"]["email"] == email


def test_me_returns_401_when_unauthenticated(client):
    res = client.get("/api/accounts/me")
    assert res.status_code == 401


# ── Logout ───────────────────────────────────────────────────────────────────

def test_logout_clears_cookie(client):
    email = _email()
    client.post("/api/accounts/register", json={"email": email, "password": "password123"})
    assert "karisma_user" in client.cookies

    res = client.post("/api/accounts/logout")
    assert res.status_code == 200
    assert res.json()["success"] is True
    # Cookie should be cleared
    assert "karisma_user" not in client.cookies
