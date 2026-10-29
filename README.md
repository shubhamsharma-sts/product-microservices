# Docker setup for the Product Microservices project

This is a Docker configuration overlay for the existing project. Copy the files in each folder into the matching `product-service/` and `graphql-gateway/` folders. It does not replace your application source code, Apollo schema, resolvers, Flask routes, or tests.

## Architecture

- `product-service/Dockerfile`: Flask REST service, served with Gunicorn.
- `product-service/docker-compose.yml`: Flask + MySQL, with a persistent named volume.
- `graphql-gateway/Dockerfile`: builds and runs the existing TypeScript GraphQL gateway.
- `graphql-gateway/docker-compose.yml`: runs the gateway separately.
- Both Compose projects use the Docker network `product-network` so the gateway can reach Flask at `http://product-service:5000`.

MySQL is exposed on host port `3307` to avoid colliding with a local MySQL installation on port `3306`. Containers communicate with MySQL on port `3306`.

## 1. Copy the files

Copy the files from this overlay into the matching folders in your project. Keep the existing source files and tests.

## 2. Configure the Flask/MySQL Compose project

Open PowerShell in the `product-service` folder and run:

```powershell
Copy-Item .env.docker.example .env.docker
```

Start the Flask + MySQL stack:

```powershell
docker compose --env-file .env.docker up --build -d
```

Watch startup logs:

```powershell
docker compose logs -f product-service
```

Check the Flask health endpoint in another PowerShell window:

```powershell
Invoke-RestMethod http://localhost:5000/health
```

The expected healthy response includes `status: ok` and `database: connected`.

## 3. Configure and start the GraphQL gateway

Open a second PowerShell window in the `graphql-gateway` folder:

```powershell
Copy-Item .env.docker.example .env.docker
docker compose --env-file .env.docker up --build -d
```

Check its logs:

```powershell
docker compose logs -f graphql-gateway
```

Send GraphQL requests to `http://localhost:4000/graphql` if your Apollo/Yoga server is configured at `/graphql`. For example, in Postman use POST with Body → raw → JSON:

```json
{
  "query": "{ products { id name description price stock } }"
}
```

## 4. Useful commands

Run from the folder whose Compose project you want to manage:

```powershell
docker compose ps
docker compose logs -f
docker compose down
```

To stop both projects, run `docker compose down` once in `graphql-gateway`, then once in `product-service`.

**Database persistence:** `docker compose down` keeps the named MySQL volume. Do not run `docker compose down -v` unless you intentionally want to delete the Docker database volume and its data.

## Notes

- Start the Flask/MySQL Compose project first. It creates the shared `product-network` network; the GraphQL Compose project joins it as an external network.
- The Flask container creates missing tables on startup using the project's existing `init-db` command. This is convenient for learning, but production systems should use database migrations.
- The GraphQL Dockerfile uses the existing `npm run build` and `npm run start` scripts. Make sure your local gateway has a working production `start` script (for example, `node dist/server.js`) and compiles successfully before building.
- This overlay doesn't add Redis caching. Redis can be added to the Flask Compose file after the app's Redis integration and tests are complete.

