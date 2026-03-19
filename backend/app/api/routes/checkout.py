from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    CheckoutRequest,
    CheckoutResponse,
    PaymentIntentRequest,
    PaymentIntentResponse,
)
from app.services.stripe_service import create_checkout_session, create_payment_intent

router = APIRouter()


@router.post("/checkout/session", response_model=CheckoutResponse)
async def create_session(payload: CheckoutRequest):
    try:
        url = create_checkout_session(payload.cart_items, payload.base_url)
        return CheckoutResponse(checkout_url=url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/checkout/payment-intent", response_model=PaymentIntentResponse)
async def create_intent(payload: PaymentIntentRequest):
    try:
        secret = create_payment_intent(payload.cart_items)
        return PaymentIntentResponse(client_secret=secret)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
