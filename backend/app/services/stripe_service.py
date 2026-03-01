import stripe

from app.core.config import settings
from app.models.schemas import CartItem

# stripe.api_key is set at module load. If STRIPE_SECRET_KEY is empty (template default),
# this does NOT cause an import error — Stripe calls will fail at runtime only.
stripe.api_key = settings.STRIPE_SECRET_KEY


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

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{base_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{base_url}/shop",
    )
    return session.url
