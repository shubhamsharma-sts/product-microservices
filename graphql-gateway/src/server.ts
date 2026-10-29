
import "dotenv/config";
import { startStandaloneServer } from "@apollo/server/standalone";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 4000);

const { server, context } = createApp();

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context,
});

console.log(`GraphQL gateway listening at ${url}`);
