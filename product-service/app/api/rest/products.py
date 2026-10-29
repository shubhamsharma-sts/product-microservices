from flask import Blueprint, jsonify, request

from app.services.product_service import ProductService

products_bp = Blueprint("products", __name__)
product_service = ProductService()


@products_bp.get("/products")
def list_products():
    products = product_service.list_products()
    return jsonify([product.to_dict() for product in products])


@products_bp.get("/products/<int:product_id>")
def get_product(product_id):
    return jsonify(product_service.get_product(product_id).to_dict())


@products_bp.post("/products")
def create_product():
    data = request.get_json(silent=True)
    product = product_service.create_product(data)
    return jsonify(product.to_dict()), 201


@products_bp.put("/products/<int:product_id>")
def update_product(product_id):
    data = request.get_json(silent=True)
    product = product_service.update_product(product_id, data)
    return jsonify(product.to_dict())


@products_bp.delete("/products/<int:product_id>")
def delete_product(product_id):
    product_service.delete_product(product_id)
    return "", 204
