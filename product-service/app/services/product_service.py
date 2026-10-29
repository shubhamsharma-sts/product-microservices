from decimal import Decimal, InvalidOperation

from app.errors import NotFoundError, ValidationError
from app.models import Product
from app.repositories.product_repository import ProductRepository


class ProductService:
    """Business rules/use cases. This layer does not issue SQL directly."""

    def __init__(self, repository=None):
        self.repository = repository or ProductRepository()

    def list_products(self):
        return self.repository.list_all()

    def get_product(self, product_id):
        product = self.repository.get_by_id(self._parse_id(product_id))
        if product is None:
            raise NotFoundError()
        return product

    def create_product(self, data):
        if not isinstance(data, dict):
            raise ValidationError("Request body must be a JSON object.")

        name = data.get("name")
        if not isinstance(name, str) or not name.strip():
            raise ValidationError("A non-empty name is required.")

        if "price" not in data:
            raise ValidationError("Price is required.")

        price = self._parse_price(data["price"])
        stock = self._parse_stock(data.get("stock", 0))
        description = data.get("description")

        if description is not None and not isinstance(description, str):
            raise ValidationError("Description must be a string or null.")

        product = Product(
            name=name.strip(),
            description=description,
            price=price,
            stock=stock,
        )
        return self.repository.add(product)

    def update_product(self, product_id, data):
        if not isinstance(data, dict):
            raise ValidationError("Request body must be a JSON object.")

        product = self.get_product(product_id)

        if "name" in data:
            name = data["name"]
            if not isinstance(name, str) or not name.strip():
                raise ValidationError("Name must be a non-empty string.")
            product.name = name.strip()

        if "description" in data:
            description = data["description"]
            if description is not None and not isinstance(description, str):
                raise ValidationError("Description must be a string or null.")
            product.description = description

        if "price" in data:
            product.price = self._parse_price(data["price"])

        if "stock" in data:
            product.stock = self._parse_stock(data["stock"])

        return self.repository.save(product)

    def delete_product(self, product_id):
        product = self.get_product(product_id)
        self.repository.delete(product)
        return True

    @staticmethod
    def _parse_id(value):
        if isinstance(value, bool):
            raise ValidationError("Product ID must be an integer.")
        try:
            parsed = int(value)
        except (TypeError, ValueError):
            raise ValidationError("Product ID must be an integer.")
        if parsed < 1:
            raise ValidationError("Product ID must be positive.")
        return parsed

    @staticmethod
    def _parse_price(value):
        if isinstance(value, bool):
            raise ValidationError("Price must be a valid non-negative number.")
        try:
            price = Decimal(str(value))
        except (InvalidOperation, ValueError, TypeError):
            raise ValidationError("Price must be a valid non-negative number.")
        if not price.is_finite() or price < 0 or price > Decimal("99999999.99"):
            raise ValidationError("Price is outside the allowed range.")
        return price.quantize(Decimal("0.01"))

    @staticmethod
    def _parse_stock(value):
        if isinstance(value, bool) or not isinstance(value, int) or value < 0:
            raise ValidationError("Stock must be a non-negative integer.")
        return value
