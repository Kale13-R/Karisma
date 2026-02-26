from unittest.mock import MagicMock, patch

import stripe

VALID_CART_PAYLOAD = {
    "cart_items": [
        {
            "product": {
                "id": "prod_001",
                "name": "Void Hoodie 001",
                "price": 185.00,
                "description": "Heavyweight cotton fleece.",
                "imageUrl": "/images/void-hoodie-001.jpg",
                "sizes": ["M"],
                "inStock": True,
                "dropId": "drop_ss26",
            },
            "size": "M",
            "quantity": 1,
        }
    ],
    "base_url": "http://localhost:3000",
}


def test_create_checkout_session_returns_checkout_url(client):
    mock_session = MagicMock()
    mock_session.url = "https://checkout.stripe.com/pay/cs_test_abc123"

    with patch("stripe.checkout.Session.create", return_value=mock_session):
        response = client.post("/api/checkout/session", json=VALID_CART_PAYLOAD)

    assert response.status_code == 200
    data = response.json()
    assert "checkout_url" in data
    assert data["checkout_url"] == "https://checkout.stripe.com/pay/cs_test_abc123"


def test_webhook_invalid_signature_returns_400(client):
    with patch(
        "stripe.Webhook.construct_event",
        side_effect=stripe.error.SignatureVerificationError("Invalid signature", "sig_header"),
    ):
        response = client.post(
            "/api/webhooks/stripe",
            content=b'{"type": "checkout.session.completed"}',
            headers={"stripe-signature": "t=invalid,v1=badsig"},
        )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid signature"
