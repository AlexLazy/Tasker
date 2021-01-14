import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  ApolloLink,
  HttpLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { cache, authVar, errorVar } from "./cache";
import Pages from "./pages";

const httpLink = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_URI });
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: authVar().token || "",
      "client-name": "Tasker [web]",
      "client-version": "0.0.1",
    },
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions }) => {
      if (extensions?.code === "UNAUTHENTICATED") window.location.reload();

      errorVar({
        text: `[GraphQL error]: ${message}`,
        open: true,
      });
    });

  if (networkError)
    errorVar({
      text: `[Network error]: ${networkError}`,
      open: true,
    });
});

const client = new ApolloClient({
  cache,
  link: from([errorLink, authMiddleware, httpLink]),
});

const App = () => (
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>
);

export default App;
