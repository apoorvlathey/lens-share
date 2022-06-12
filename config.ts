import { chain } from "wagmi";

export const targetChain = process.env.NEXT_PUBLIC_USE_TESTNET
  ? chain.polygonMumbai
  : chain.polygon;

export const chainIdToConfig = {
  [chain.polygonMumbai.id]: {
    lensHubProxy: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
    apiURL: "https://api-mumbai.lens.dev",
  },
  [chain.polygon.id]: {
    lensHubProxy: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
    apiURL: "https://api.lens.dev",
  },
};

export const config = chainIdToConfig[targetChain.id];
