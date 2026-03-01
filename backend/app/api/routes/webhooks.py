import json

import stripe
from fastapi import APIRouter, Header, HTTPException, Request

from app.core.config import settings
from app.db import models
from app.db.base import SessionLocal
from app.services.email_service import send_order_confirmation

router = APIRouter()


@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None),
):
    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        db = SessionLocal()
        try:
            existing = db.query(models.Order).filter_by(
                stripe_session_id=session["id"]
            ).first()
            if not existing:
                order = models.Order(
                    stripe_session_id=session["id"],
                    customer_email=session.get("customer_details", {}).get("email", ""),
                    total=session.get("amount_total", 0) / 100,
                    status="confirmed",
                    items=json.dumps(session.get("display_items", [])),
                )
                db.add(order)
                db.commit()
                db.refresh(order)
                send_order_confirmation(
                    customer_email=order.customer_email,
                    order_id=str(order.id),
                    total=order.total,
                    items_json=order.items,
                )
        finally:
            db.close()

    return {"status": "received"}
