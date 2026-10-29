
import { ApolloServer } from "@apollo/server";
import { ProductApiClient } from "./clients/product-api.client.js";
import { resolvers, typeDefs } from "./schema/product.schema.js";
import type { ProductApi } from "./types.js";

export function createApp(productApi: ProductApi = new ProductApiClient()) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const context = async () => ({
    productApi,
  });

  return { server, context };
}
