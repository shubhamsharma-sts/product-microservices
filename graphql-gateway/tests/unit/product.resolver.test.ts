import { describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/app.js";
import type { ProductApi } from "../../src/types.js";

const sampleProduct = { id: 7, name: "Keyboard", description: "Mechanical", price: "49.99", stock: 10 };

function mockProductApi(): ProductApi {
  return {
    listProducts: vi.fn().mockResolvedValue([sampleProduct]),
    getProduct: vi.fn().mockResolvedValue(sampleProduct),
    createProduct: vi.fn().mockResolvedValue(sampleProduct),
    updateProduct: vi.fn().mockResolvedValue(sampleProduct),
    deleteProduct: vi.fn().mockResolvedValue(true),
  };
}

async function execute(
  app: ReturnType<typeof createApp>,
  query: string,
) {
  const result = await app.server.executeOperation(
    { query },
    { contextValue: await app.context() },
  );

  if (result.body.kind !== "single") {
    throw new Error("Expected a single GraphQL response");
  }

  return result.body.singleResult;
}



describe("Product GraphQL resolvers (unit tests)", () => {
  it("lists products and converts price to a GraphQL number", async () => {
    const api = mockProductApi();
    const result = await execute(
      createApp(api),
      "{ products { id name price stock } }",
    );

    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      products: [
        { id: "7", name: "Keyboard", price: 49.99, stock: 10 },
      ],
    });
    expect(api.listProducts).toHaveBeenCalledOnce();
  });

  it("forwards create input to the product API client", async () => {
    const api = mockProductApi();
    const result = await execute(
      createApp(api),
      'mutation { createProduct(input: { name: "Mouse", price: 25.5, stock: 3 }) { id name price } }',
    );

    expect(result.errors).toBeUndefined();
    expect(api.createProduct).toHaveBeenCalledWith({
      name: "Mouse",
      price: 25.5,
      stock: 3,
    });
    expect(result.data).toMatchObject({
      createProduct: {
        id: "7",
        name: "Keyboard",
        price: 49.99,
      },
    });
  });

  it("returns null when the product API client cannot find a product", async () => {
    const api = mockProductApi();
    vi.mocked(api.getProduct).mockResolvedValue(null);

    const result = await execute(
      createApp(api),
      '{ product(id: "404") { id name } }',
    );

    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      product: null,
    });
  });
});

