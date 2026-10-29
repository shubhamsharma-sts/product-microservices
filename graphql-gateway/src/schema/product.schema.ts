
import type { ProductApi } from "../types.js";

export const typeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int
  }

  input ProductUpdateInput {
    name: String
    description: String
    price: Float
    stock: Int
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductUpdateInput!): Product
    deleteProduct(id: ID!): Boolean!
  }
`;

interface GraphQLContext {
  productApi: ProductApi;
}

export const resolvers = {
  Query: {
    products: (_parent: unknown, _args: unknown, context: GraphQLContext) =>
      context.productApi.listProducts(),
    product: (_parent: unknown, args: { id: string }, context: GraphQLContext) =>
      context.productApi.getProduct(args.id),
  },
  Mutation: {
    createProduct: (
      _parent: unknown,
      args: { input: { name: string; description?: string | null; price: number; stock?: number } },
      context: GraphQLContext,
    ) => context.productApi.createProduct(args.input),
    updateProduct: (
      _parent: unknown,
      args: { id: string; input: { name?: string | null; description?: string | null; price?: number | null; stock?: number | null } },
      context: GraphQLContext,
    ) => context.productApi.updateProduct(args.id, args.input),
    deleteProduct: (_parent: unknown, args: { id: string }, context: GraphQLContext) =>
      context.productApi.deleteProduct(args.id),
  },
  Product: {
    price: (product: { price: number | string }) => Number(product.price),
  },
};

