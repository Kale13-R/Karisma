# Products are seeded automatically via the lifespan event when the
# TestClient context is entered (see tests/conftest.py → client fixture).


def test_get_products_returns_list(client):
    response = client.get("/products")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_product_by_id_returns_correct_fields(client):
    response = client.get("/products/karisma-void-hoodie-001")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "karisma-void-hoodie-001"
    assert data["name"] == "Karisma Void Hoodie 001"
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
