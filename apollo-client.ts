import { ApolloClient, InMemoryCache } from "@apollo/client";
import { targetChain, chainIdToConfig } from "./config";

export const apolloClient = new ApolloClient({
  uri: chainIdToConfig[targetChain.id].apiURL,
  cache: new InMemoryCache(),
});
