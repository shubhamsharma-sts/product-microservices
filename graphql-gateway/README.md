# TypeScript GraphQL Gateway

GraphQL is a separate service. It does not connect directly to MySQL and does not contain product persistence logic. It calls the Flask product service over HTTP.

## Requirements

- Node.js 20+ (recommended)
- The Flask product service running at `http://127.0.0.1:5000`

## Run locally on Windows PowerShell

```powershell
cd graphql-gateway
Copy-Item .env.example .env
npm install
npm run dev
```

The gateway listens on `http://127.0.0.1:4000/graphql`. The gateway loads `.env` using `dotenv`. If you prefer to set the value in the terminal instead:

```powershell
$env:PRODUCT_SERVICE_URL = "http://127.0.0.1:5000"
npm run dev
```

## Try in Postman

- Method: `POST`
- URL: `http://127.0.0.1:4000/graphql`
- Header: `Content-Type: application/json`
- Body → raw → JSON:

```json
{
  "query": "{ products { id name description price stock } }"
}
```

Create a product:

```json
{
  "query": "mutation { createProduct(input: { name: \"Mouse\", description: \"Wireless mouse\", price: 25.5, stock: 3 }) { id name price stock } }"
}
```

## Tests

```powershell
npm test
npm run build
```

- `tests/unit/` tests GraphQL behavior with a mocked product API client. These tests do not require Flask or MySQL.
- `tests/integration/` tests the HTTP adapter with mocked `fetch` responses. These also do not require Flask or MySQL.
- We will add a true cross-service integration test after these layers are understood.

## Current behavior

- `GET /graphql` serves GraphiQL/Yoga's browser IDE depending on the Yoga version/configuration.
- GraphQL requests are sent to `POST /graphql`.
- Flask `GET /products` returns a list.
- Flask `GET /products/<id>` returns a product or a 404.
- Flask `POST /products` creates a product.
- Flask `PUT /products/<id>` updates a product.
- Flask `DELETE /products/<id>` returns 204 when successful.


