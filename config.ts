import { chain } from "wagmi";

export const targetChain = chain.polygonMumbai;

export const chainIdToAddresses = {
  [chain.polygonMumbai.id]: {
    lensHubProxy: "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82",
  },
  [chain.polygon.id]: {
    lensHubProxy: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
  },
};
