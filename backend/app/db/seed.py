import json

from app.core.config import settings
from app.db import models
from app.db.base import Base, SessionLocal, engine


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.Product).count() == 0:
        products = [
            models.Product(
                id="void-hoodie-001",
                name="Void Hoodie 001",
                price=148.00,
                description="Oversized silhouette. Brushed fleece interior. Embroidered Karisma arc logo.",
                sizes=json.dumps(["S", "M", "L", "XL"]),
                in_stock=True,
                drop_id="ss26",
            ),
            models.Product(
                id="archive-tee-ss26",
                name="Archive Tee SS26",
                price=68.00,
                description="Heavyweight 280gsm cotton. Washed black. Screenprint front.",
                sizes=json.dumps(["XS", "S", "M", "L", "XL"]),
                in_stock=True,
                drop_id="ss26",
            ),
            models.Product(
                id="track-pant-001",
                name="Karisma Track Pant 001",
                price=118.00,
                description="Tapered fit. Side zip ankles. Tonal embroidery.",
                sizes=json.dumps(["S", "M", "L"]),
                in_stock=True,
                drop_id="ss26",
            ),
        ]
        db.add_all(products)

    if db.query(models.SiteConfig).count() == 0:
        db.add(
            models.SiteConfig(
                id=1,
                drop_timestamp="",
                gate_password=settings.GATE_PASSWORD,
            )
        )

    db.commit()
    db.close()
    print("Database seeded.")


if __name__ == "__main__":
    seed()
