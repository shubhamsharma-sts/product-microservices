def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json == {"status": "ok", "database": "connected"}


def test_rest_create_list_update_delete_product(client):
    created = client.post("/products", json={
        "name": "Keyboard",
        "description": "Mechanical",
        "price": 2500,
        "stock": 10,
    })
    assert created.status_code == 201
    product_id = created.json["id"]
    assert created.json["name"] == "Keyboard"

    listed = client.get("/products")
    assert listed.status_code == 200
    assert any(p["id"] == product_id for p in listed.json)

    updated = client.put(f"/products/{product_id}", json={
        "name": "Keyboard Pro",
        "stock": 7,
    })
    assert updated.status_code == 200
    assert updated.json["name"] == "Keyboard Pro"
    assert updated.json["stock"] == 7

    deleted = client.delete(f"/products/{product_id}")
    assert deleted.status_code == 204

    missing = client.get(f"/products/{product_id}")
    assert missing.status_code == 404


def test_rest_rejects_invalid_product(client):
    response = client.post("/products", json={"name": "", "price": -2})
    assert response.status_code == 400
    assert "error" in response.json
