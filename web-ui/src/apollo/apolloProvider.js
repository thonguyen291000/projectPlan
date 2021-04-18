import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { createUploadLink } from "apollo-upload-client";
import { offsetLimitPagination } from "@apollo/client/utilities";

// get the authentication token from local storage if it exists
const user = JSON.parse(localStorage.getItem("user"));
const httpLink = createUploadLink({
  // uri: "https://app-apigateway.herokuapp.com/graphql",
  uri: "http://localhost:7000/graphql",
});
// const uploadLink = createUploadLink({
//   uri: "http://localhost:7000/graphql",
// });

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.token}` : "",
    },
  };
});

//For realtime websocket
const wsLink = new WebSocketLink({
  // uri: "wss://app-apigateway.herokuapp.com/graphql",
  uri: "ws://localhost:7000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: user ? `Bearer ${user.token}` : "",
      authToken: user ? user.token : "",
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  // uploadLink,
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default function ApolloProvider(props) {
  return <Provider client={client} {...props} />;
}
