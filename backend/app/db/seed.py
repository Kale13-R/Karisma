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
        # ─── SS26 NEW RELEASES ───────────────────────────────────────────
        models.Product(
            id="new-red-tee",
            name="KARISMA — Red",
            price=148.00,
            description="SS26 new release. Limited run. The red speaks for itself.",
            image_url="/images/new/new-release-red-tee.jpg",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26-new",
        ),
        models.Product(
            id="new-black-tee",
            name="KARISMA — Black",
            price=148.00,
            description="SS26 new release. Limited run. Same energy, different darkness.",
            image_url="/images/new/new-release-black-tee.jpg",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="ss26-new",
        ),

        # ─── SPRING 24 — ORGANIZED KHAOS (existing archive) ─────────────
        models.Product(
            id="karisma-archive-001",
            name="Karisma Archive 001",
            price=148.00,
            description="Cut from brushed fleece in a colour that refuses definition. Oversized through the body, collapsed at the shoulder. Worn like absence.",
            image_url="/images/IMG_8709.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-002",
            name="Karisma Archive 002",
            price=68.00,
            description="Heavyweight 280gsm cotton, washed until the black becomes something else. A single mark on the chest. Nothing more is needed.",
            image_url="/images/IMG_8711.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-003",
            name="Karisma Archive 003",
            price=218.00,
            description="Structured where structure matters. Unlined, unpadded, resolute. The seams hold the shape the body cannot.",
            image_url="/images/IMG_8712.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-004",
            name="Karisma Archive 004",
            price=128.00,
            description="Tapered from the knee. Side-zip ankles close like a statement. Worn low, worn long, worn once and never forgotten.",
            image_url="/images/IMG_8713.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-005",
            name="Karisma Archive 005",
            price=98.00,
            description="The shirt as a proposition. Oversized collar, dropped shoulders, fabric that moves before you do. Presence through restraint.",
            image_url="/images/IMG_8715.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-006",
            name="Karisma Archive 006",
            price=158.00,
            description="A second study in weight. Longer hem, raw edge at the cuff. The drawstring is decorative — the silhouette does the work.",
            image_url="/images/IMG_8726.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-007",
            name="Karisma Archive 007",
            price=72.00,
            description="What remains after intention is stripped away. Boxy, silent, precise. A garment that knows exactly what it is.",
            image_url="/images/IMG_8728.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-008",
            name="Karisma Archive 008",
            price=228.00,
            description="Lighter than the first. The shell moves with the wind, not against it. Closure at the throat, open everywhere else.",
            image_url="/images/IMG_8736.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="karisma-archive-009",
            name="Karisma Archive 009",
            price=138.00,
            description="Wide through the thigh, drawn in at the ankle. The pleat is intentional. Every crease earned, none of them accidental.",
            image_url="/images/IMG_8742.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        # karisma.live archive items
        models.Product(
            id="krsm-snapback-green",
            name="RismaSnapBack — Green",
            price=35.00,
            description="Hand-painted trucker snapback. One of a kind.",
            image_url="/images/archive/risma-snapback-green.png",
            sizes=json.dumps(["ONE SIZE"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-logo-hoodie",
            name="Logo Hoodie",
            price=40.00,
            description="Classic Karisma logo hoodie.",
            image_url="/images/archive/logo-hoodie.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-trenches-tee",
            name="Made in The Trenches Tee",
            price=50.00,
            description="Made in The Trenches.",
            image_url="/images/archive/made-in-trenches-tee.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=False,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-lavender-zip",
            name="Baby Lavender Crop Zip Up",
            price=70.00,
            description="Baby lavender crop zip up hoodie.",
            image_url="/images/archive/baby-lavender-crop-zip.png",
            sizes=json.dumps(["XS", "S", "M"]),
            in_stock=False,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-white-hoodie",
            name="WhiteMARS Long Sleeve",
            price=65.00,
            description="WhiteMARS long sleeve graphic tee.",
            image_url="/images/archive/white-banned-hoodie.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=False,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-black-hoodie",
            name="BlackMars Long Sleeve",
            price=65.00,
            description="BlackMars long sleeve tee.",
            image_url="/images/archive/black-banned-shirt.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=False,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-blue-hoodie",
            name="Blue KOLOSSAL Hoodie",
            price=60.00,
            description="Blue KOLOSSAL heavyweight hoodie.",
            image_url="/images/archive/blue-colossal-hoodie.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=False,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-marisma",
            name="Marisma :)",
            price=50.00,
            description="Marisma graphic tee.",
            image_url="/images/archive/marisma.png",
            sizes=json.dumps(["S", "M", "L", "XL"]),
            in_stock=True,
            drop_id="spring24",
        ),
        models.Product(
            id="krsm-sage-beanie",
            name="Baby Sage Beanie",
            price=30.00,
            description="Hand-painted sage beanie.",
            image_url="/images/archive/baby-sage-beanie.png",
            sizes=json.dumps(["ONE SIZE"]),
            in_stock=True,
            drop_id="spring24",
        ),
    ]

    db.add_all(products)

    existing_config = db.query(models.SiteConfig).filter_by(id=1).first()
    if existing_config:
        existing_config.gate_password = settings.GATE_PASSWORD
    else:
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
