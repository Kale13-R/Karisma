import time

from sqlalchemy.orm import Session

from app.db.base import SessionLocal
from app.db import models

_cache: dict = {"password": None, "drop_timestamp": None, "fetched_at": 0}
CACHE_TTL = 60  # seconds


def get_site_config() -> dict:
    now = time.time()
    if now - _cache["fetched_at"] < CACHE_TTL and _cache["password"] is not None:
        return _cache

    db: Session = SessionLocal()
    try:
        config = db.query(models.SiteConfig).filter_by(id=1).first()
        if config:
            _cache["password"] = config.gate_password
            _cache["drop_timestamp"] = config.drop_timestamp
            _cache["fetched_at"] = now
    finally:
        db.close()

    return _cache


def invalidate_config_cache() -> None:
    _cache["fetched_at"] = 0
