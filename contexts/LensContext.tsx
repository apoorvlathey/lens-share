import { createContext, useContext, useEffect, useState } from "react";
import { apolloClient } from "../apollo-client";
import { gql } from "@apollo/client";
import { useAccount } from "wagmi";

const GET_DEFAULT_PROFILES = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      handle
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          chainId
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
      }
    }
  }
`;
const GET_PROFILES = `
  query($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        handle
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
        }
      }
    }
  }
`;

const getDefaultProfile = async (ethereumAddress: string) => {
  return await apolloClient.query({
    query: gql(GET_DEFAULT_PROFILES),
    variables: {
      request: {
        ethereumAddress,
      },
    },
  });
};

const getProfiles = (ethereumAddress: string) => {
  return apolloClient.query({
    query: gql(GET_PROFILES),
    variables: {
      request: { ownedBy: [ethereumAddress], limit: 1 },
    },
  });
};

type LensContextType = {
  lensHandle?: string;
  lensAvatar?: string;
};

export const LensContext = createContext<LensContextType>({});

export const LensProvider = ({ children }: { children?: React.ReactNode }) => {
  const [lensHandle, setLensHandle] = useState<string>();
  const [lensAvatar, setLensAvatar] = useState<string>();

  const { data: account } = useAccount();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getDefaultProfile(account!.address!);
      const defaultProfile = res.data.defaultProfile;

      let profile: any;
      if (defaultProfile) {
        profile = defaultProfile;
      } else {
        const res = await getProfiles(account!.address!);
        profile = res.data.profiles.items[0];
      }

      if (profile) {
        setLensHandle(profile.handle);
        if (profile.picture) {
          setLensAvatar(profile.picture.original.url);
        }
      }
    };

    if (account?.address) {
      fetchProfile();
    }
  }, [account]);

  return (
    <LensContext.Provider
      value={{
        lensHandle,
        lensAvatar,
      }}
    >
      {children}
    </LensContext.Provider>
  );
};

export const useLens = () => useContext(LensContext);
