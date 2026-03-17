# Products are seeded automatically via the lifespan event when the
# TestClient context is entered (see tests/conftest.py → client fixture).


def test_get_products_returns_list(client):
    response = client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_product_by_id_returns_correct_fields(client):
    response = client.get("/products/karisma-archive-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "karisma-archive-001"
    assert data["name"] == "Karisma Archive 001"
    assert data["price"] == 148.00
    assert isinstance(data["sizes"], list)
    assert "imageUrl" in data
    assert "description" in data
    assert "inStock" in data
    assert "dropId" in data


def test_get_product_not_found_returns_404(client):
    response = client.get("/products/does-not-exist")
    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"


def test_get_ss26_products_by_drop_filter(client):
    """Storefront fetches /products?drop=ss26-new — must return the new release items."""
    response = client.get("/products?drop=ss26-new")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    ids = {p["id"] for p in data}
    assert "new-red-tee" in ids
    assert "new-black-tee" in ids


def test_get_ss26_product_detail_has_all_fields(client):
    """PDP fetches /products/{id} — must return full product info."""
    for product_id in ("new-red-tee", "new-black-tee"):
        response = client.get(f"/products/{product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == product_id
        assert data["name"]
        assert data["price"] > 0
        assert data["description"]
        assert data["imageUrl"].startswith("/images/")
        assert isinstance(data["sizes"], list)
        assert len(data["sizes"]) > 0
        assert data["inStock"] is True
        assert data["dropId"] == "ss26-new"
