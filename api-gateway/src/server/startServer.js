import { ApolloServer } from "apollo-server-express";
import {ExpressPeerServer} from "peer";
import http from "http";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import resolvers from "../graphql/resolvers";
import typeDefs from "../graphql/typeDefs";
import accessEnv from "../helpers/accessEnv";

import formatGraphqlErrors from "./formatGraphqlErrors";
import injectSession from "./injectSession";
import contextMiddleware from "./contextMiddleware";

const PORT = accessEnv("PORT", 7000);

const apolloServer = new ApolloServer({
  context: contextMiddleware,
  formatError: formatGraphqlErrors,
  resolvers,
  typeDefs
});

const app = express();

// To allow to read cookie
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

// app.use(injectSession);

apolloServer.applyMiddleware({ app, cors: false, path: "/graphql" });

const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.info(
    `API gateway is listening on ${PORT}${apolloServer.graphqlPath}`
  );
  console.info(
    `Subscription at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );
});
