import json
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db import models
from app.db.base import get_db

router = APIRouter()


def verify_admin(x_admin_key: str = Header(None)):
    if x_admin_key != settings.ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")


class SiteConfigUpdate(BaseModel):
    drop_timestamp: Optional[str] = None
    gate_password: Optional[str] = None


@router.get("/admin/config")
def get_config(db: Session = Depends(get_db), _=Depends(verify_admin)):
    config = db.query(models.SiteConfig).filter_by(id=1).first()
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return {"drop_timestamp": config.drop_timestamp, "gate_password": "***"}


@router.post("/admin/config")
def update_config(
    payload: SiteConfigUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_admin),
):
    config = db.query(models.SiteConfig).filter_by(id=1).first()
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    if payload.drop_timestamp is not None:
        config.drop_timestamp = payload.drop_timestamp
    if payload.gate_password is not None:
        config.gate_password = payload.gate_password
    db.commit()
    return {"status": "updated"}


@router.get("/admin/orders")
def get_orders(db: Session = Depends(get_db), _=Depends(verify_admin)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "stripe_session_id": o.stripe_session_id,
            "customer_email": o.customer_email,
            "total": o.total,
            "status": o.status,
            "items": json.loads(o.items) if o.items else [],
            "created_at": o.created_at,
        }
        for o in orders
    ]
