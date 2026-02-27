import json

from app.core.config import settings
from app.db import models
from app.db.base import Base, SessionLocal, engine


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Always replace products so reruns reflect the current seed
    db.query(models.Product).delete()
    db.commit()

    products = [
        models.Product(
            id="karisma-archive-001",
            name="Karisma Archive 001",
            price=148.00,
            description="Cut from brushed fleece in a colour that refuses definition. Oversized through the body, collapsed at the shoulder. Worn like absence.",
            image_url="/images/IMG_8709.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-002",
            name="Karisma Archive 002",
            price=68.00,
            description="Heavyweight 280gsm cotton, washed until the black becomes something else. A single mark on the chest. Nothing more is needed.",
            image_url="/images/IMG_8711.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-003",
            name="Karisma Archive 003",
            price=218.00,
            description="Structured where structure matters. Unlined, unpadded, resolute. The seams hold the shape the body cannot.",
            image_url="/images/IMG_8712.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-004",
            name="Karisma Archive 004",
            price=128.00,
            description="Tapered from the knee. Side-zip ankles close like a statement. Worn low, worn long, worn once and never forgotten.",
            image_url="/images/IMG_8713.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-005",
            name="Karisma Archive 005",
            price=98.00,
            description="The shirt as a proposition. Oversized collar, dropped shoulders, fabric that moves before you do. Presence through restraint.",
            image_url="/images/IMG_8715.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-006",
            name="Karisma Archive 006",
            price=158.00,
            description="A second study in weight. Longer hem, raw edge at the cuff. The drawstring is decorative — the silhouette does the work.",
            image_url="/images/IMG_8726.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-007",
            name="Karisma Archive 007",
            price=72.00,
            description="What remains after intention is stripped away. Boxy, silent, precise. A garment that knows exactly what it is.",
            image_url="/images/IMG_8728.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-008",
            name="Karisma Archive 008",
            price=228.00,
            description="Lighter than the first. The shell moves with the wind, not against it. Closure at the throat, open everywhere else.",
            image_url="/images/IMG_8736.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26",
        ),
        models.Product(
            id="karisma-archive-009",
            name="Karisma Archive 009",
            price=138.00,
            description="Wide through the thigh, drawn in at the ankle. The pleat is intentional. Every crease earned, none of them accidental.",
            image_url="/images/IMG_8742.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
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
