from flask_sqlalchemy import SQLAlchemy
import redis
# Define the extension once; initialize it inside create_app().
db = SQLAlchemy()
redis_client = redis.Redis.from_url(
    "redis://localhost:6379/0",
    decode_responses=True,
)