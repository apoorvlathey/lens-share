import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins";
import theme from "../styles/theme";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ActiveChainProvider } from "../contexts/ActiveChainContext";
import { targetChain } from "../config";

const { chains, provider } = configureChains(
  [targetChain],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: targetChain.rpcUrls.default,
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        shimChainChangedDisconnect: true,
      },
    }),
  ],
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <ActiveChainProvider>
          <Component {...pageProps} />
        </ActiveChainProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
