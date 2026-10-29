from decimal import Decimal
from unittest.mock import Mock

import pytest

from app.errors import ValidationError, NotFoundError
from app.models import Product
from app.services.product_service import ProductService


def test_create_product_applies_defaults_and_trims_name():
    repo = Mock()
    repo.add.side_effect = lambda product: product
    service = ProductService(repository=repo)

    product = service.create_product({
        "name": "  Keyboard  ",
        "price": 25.5,
    })

    assert product.name == "Keyboard"
    assert product.price == Decimal("25.50")
    assert product.stock == 0
    repo.add.assert_called_once_with(product)


@pytest.mark.parametrize("price", [-1, "not-a-number", float("inf"), True])
def test_create_product_rejects_invalid_price(price):
    service = ProductService(repository=Mock())

    with pytest.raises(ValidationError):
        service.create_product({"name": "Mouse", "price": price})


def test_create_product_requires_name():
    service = ProductService(repository=Mock())

    with pytest.raises(ValidationError):
        service.create_product({"name": "  ", "price": 10})


def test_get_product_raises_when_missing():
    repo = Mock()
    repo.get_by_id.return_value = None
    service = ProductService(repository=repo)

    with pytest.raises(NotFoundError):
        service.get_product(123)
