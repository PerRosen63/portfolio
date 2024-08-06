import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import gql from "graphql-tag";
import fetch from "cross-fetch";

console.log("apollo-client-node.ts is being loaded");

const apolloClientInstance = new ApolloClient({
  link: new HttpLink({
    uri: "http://portfolio.local/graphql",
    fetch,
  }),
  cache: new InMemoryCache(),
});

export { apolloClientInstance, gql };
