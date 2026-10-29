import click
from flask import Flask, jsonify

from app.config import Config
from app.extensions import db
from app.errors import AppError
from app.api.rest.products import products_bp
from app.api.rest.health import health_bp


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

    app.register_blueprint(products_bp)
    app.register_blueprint(health_bp)

    @app.get("/")
    def home():
        return jsonify({
            "message": "Flask CRUD API is running",
            "rest": "/products",
        })

    @app.errorhandler(AppError)
    def handle_app_error(error):
        return jsonify({"error": error.message}), error.status_code

    @app.cli.command("init-db")
    def init_db_command():
        """Create tables for local development; use migrations for production."""
        with app.app_context():
            db.create_all()
        click.echo("Database tables created (if missing).")

    return app
