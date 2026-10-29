from app.extensions import db
from app.models import Product


class ProductRepository:
    """All SQLAlchemy/database operations for Product live here."""

    def list_all(self):
        return db.session.execute(
            db.select(Product).order_by(Product.id)
        ).scalars().all()

    def get_by_id(self, product_id):
        return db.session.get(Product, product_id)

    def add(self, product):
        try:
            db.session.add(product)
            db.session.commit()
            return product
        except Exception:
            db.session.rollback()
            raise

    def save(self, product):
        try:
            db.session.commit()
            return product
        except Exception:
            db.session.rollback()
            raise

    def delete(self, product):
        try:
            db.session.delete(product)
            db.session.commit()
        except Exception:
            db.session.rollback()
            raise
