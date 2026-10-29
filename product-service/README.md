# Flask CRUD API — layered architecture

This refactor separates HTTP transport, business rules, persistence, and tests.

## Structure

- `app/api/rest/`: REST routes and HTTP responses
- `app/services/`: business rules and use cases
- `app/repositories/`: SQLAlchemy queries and transactions
- `app/models/`: database models
- `app/extensions.py`: shared Flask-SQLAlchemy extension
- `tests/unit/`: service/business-rule tests
- `tests/integration/`: Flask API + test-database tests

The REST API calls `ProductService`; service methods use `ProductRepository`. GraphQL lives in the separate TypeScript gateway and calls this service over HTTP.
The repository is the only application layer that directly performs database operations.

## Local setup

1. Create/activate a virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and edit `DATABASE_URL`.
4. Create the database/user in MySQL.
5. Create tables for local development: `flask --app run.py init-db`
6. Start the server: `python run.py`

## Run tests

`pytest -q`

Tests use an in-memory SQLite database and do not need the development MySQL database.

## Important

`init-db` is for local learning/development. For production schema changes, use database migrations (e.g. Flask-Migrate/Alembic), not `db.create_all()` at application startup. Do not commit `.env`.
