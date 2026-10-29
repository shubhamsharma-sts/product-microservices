import { describe, expect, it, vi } from "vitest";
import { ProductApiClient } from "../../src/clients/product-api.client.js";

describe("ProductApiClient (HTTP adapter tests)", () => {
  it("calls the Flask list endpoint and parses its JSON response", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, name: "Keyboard", description: null, price: "12.50", stock: 2 }]), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const client = new ProductApiClient("http://product-service.test", fetchMock);
    await expect(client.listProducts()).resolves.toMatchObject([{ id: 1, name: "Keyboard", price: "12.50" }]);
    expect(fetchMock).toHaveBeenCalledWith("http://product-service.test/products", undefined);
  });

  it("returns null when Flask returns 404 for a missing product", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("Not found", { status: 404 }));
    const client = new ProductApiClient("http://product-service.test", fetchMock);
    await expect(client.getProduct("404")).resolves.toBeNull();
  });

  it("treats a successful 204 delete as true without trying to parse JSON", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 204 }));
    const client = new ProductApiClient("http://product-service.test", fetchMock);
    await expect(client.deleteProduct("1")).resolves.toBe(true);
  });
});
