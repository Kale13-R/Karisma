import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import models
from app.db.base import get_db

router = APIRouter()


@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).filter_by(in_stock=True).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "description": p.description,
            "imageUrl": p.image_url,
            "sizes": json.loads(p.sizes),
            "inStock": p.in_stock,
            "dropId": p.drop_id,
        }
        for p in products
    ]
