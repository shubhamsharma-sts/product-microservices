export interface Product {
  id: string | number;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price: number;
  stock?: number;
}

export interface UpdateProductInput {
  name?: string | null;
  description?: string | null;
  price?: number | null;
  stock?: number | null;
}

export interface ProductApi {
  listProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: string, input: UpdateProductInput): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}
