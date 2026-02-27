import json

from fastapi import APIRouter, Depends, HTTPException
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


@router.get("/products/{product_id}")
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "description": product.description,
        "imageUrl": product.image_url,
        "sizes": json.loads(product.sizes),
        "inStock": product.in_stock,
        "dropId": product.drop_id,
    }
