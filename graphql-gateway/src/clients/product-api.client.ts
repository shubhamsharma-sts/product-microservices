import type { CreateProductInput, Product, ProductApi, UpdateProductInput } from "../types.js";

/** HTTP adapter for the Flask product microservice. It contains no business rules. */
export class ProductApiClient implements ProductApi {
  constructor(
    private readonly baseUrl = process.env.PRODUCT_SERVICE_URL ?? "http://127.0.0.1:5000",
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async listProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async getProduct(id: string): Promise<Product | null> {
    const response = await this.fetchImpl(this.url(`/products/${encodeURIComponent(id)}`));
    if (response.status === 404) return null;
    if (!response.ok) throw await this.httpError(response);
    return (await response.json()) as Product;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return this.request<Product>("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
    const response = await this.fetchImpl(this.url(`/products/${encodeURIComponent(id)}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw await this.httpError(response);
    return (await response.json()) as Product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const response = await this.fetchImpl(this.url(`/products/${encodeURIComponent(id)}`), {
      method: "DELETE",
    });
    if (response.status === 404) return false;
    if (!response.ok) throw await this.httpError(response);
    return true; // Flask returns 204 No Content for a successful delete.
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetchImpl(this.url(path), init);
    if (!response.ok) throw await this.httpError(response);
    return (await response.json()) as T;
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}${path}`;
  }

  private async httpError(response: Response): Promise<Error> {
    let message = `Product service returned HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // A 204 or non-JSON error body is allowed; retain the status-based message.
    }
    return new Error(message);
  }
}
