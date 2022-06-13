import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/400.css";
import theme from "../styles/theme";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { ActiveChainProvider } from "../contexts/ActiveChainContext";
import { LensProvider } from "../contexts/LensContext";
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
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={client}>
        <ActiveChainProvider>
          <LensProvider>
            <Component {...pageProps} />
          </LensProvider>
        </ActiveChainProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default MyApp;
