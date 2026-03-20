import stripe

from app.core.config import settings
from app.models.schemas import CartItem


def _stripe_key() -> str:
    """Read Stripe key at call time, not import time, to avoid stale module cache."""
    key = settings.STRIPE_SECRET_KEY
    if not key:
        raise ValueError("STRIPE_SECRET_KEY is not set in backend .env")
    return key


def create_checkout_session(cart_items: list[CartItem], base_url: str) -> str:
    line_items = [
        {
            "price_data": {
                "currency": settings.STRIPE_CURRENCY,
                "product_data": {
                    "name": item.product.name,
                    "description": f"Size: {item.size}",
                },
                "unit_amount": int(item.product.price * 100),
            },
            "quantity": item.quantity,
        }
        for item in cart_items
    ]

    stripe.api_key = _stripe_key()
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{base_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{base_url}/shop",
    )
    return session.url


def create_payment_intent(cart_items: list[CartItem]) -> str:
    """Create a Stripe PaymentIntent and return its client_secret."""
    total = sum(int(item.product.price * 100) * item.quantity for item in cart_items)

    metadata = {}
    for i, item in enumerate(cart_items):
        metadata[f"item_{i}_id"] = item.product.id
        metadata[f"item_{i}_size"] = item.size
        metadata[f"item_{i}_qty"] = str(item.quantity)

    stripe.api_key = _stripe_key()
    intent = stripe.PaymentIntent.create(
        amount=total,
        currency=settings.STRIPE_CURRENCY,
        metadata=metadata,
    )
    return intent.client_secret
