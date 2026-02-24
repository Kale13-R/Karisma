from typing import List

from fastapi import APIRouter

from app.models.schemas import Product

router = APIRouter()

SAMPLE_PRODUCTS: List[Product] = [
    Product(
        id="prod_001",
        name="Void Hoodie 001",
        price=185.00,
        description="Heavyweight cotton fleece. Oversized silhouette. Drop-shoulder construction. Unbranded exterior.",
        imageUrl="/images/void-hoodie-001.jpg",
        sizes=["XS", "S", "M", "L", "XL"],
        inStock=True,
        dropId="drop_ss26",
    ),
    Product(
        id="prod_002",
        name="Archive Tee SS26",
        price=85.00,
        description="Garment-dyed heavyweight tee. Distressed graphic on reverse. Single-stitch construction.",
        imageUrl="/images/archive-tee-ss26.jpg",
        sizes=["S", "M", "L", "XL", "XXL"],
        inStock=True,
        dropId="drop_ss26",
    ),
    Product(
        id="prod_003",
        name="Karisma Track Pant 001",
        price=145.00,
        description="Nylon-shell track pant. Tapered leg. Zip ankles. Dual-pocket utility design.",
        imageUrl="/images/track-pant-001.jpg",
        sizes=["S", "M", "L", "XL"],
        inStock=True,
        dropId="drop_ss26",
    ),
]


@router.get("/products", response_model=List[Product])
async def get_products():
    return SAMPLE_PRODUCTS
