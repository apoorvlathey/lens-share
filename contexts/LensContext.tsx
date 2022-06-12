import { createContext, useContext, useEffect, useState } from "react";
import { apolloClient } from "../apollo-client";
import { gql } from "@apollo/client";
import {
  useAccount,
  useContractWrite,
  useSignMessage,
  useSignTypedData,
} from "wagmi";
import { v4 as uuidv4 } from "uuid";
import { uploadFromURLToIpfs, uploadIpfs } from "../utils/ipfs";
import { Metadata } from "../interfaces/publication";
import { omit, prettyJSON } from "../utils/helpers";
import { ethers } from "ethers";
import { config } from "../config";
import LensHubABI from "../abi/LensHub.json";
import { TweetMedia } from "../interfaces/TweetMedia";
import axios from "axios";

const GET_DEFAULT_PROFILES = `
  query($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      id
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
        id
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
const GET_CHALLENGE = `
  query($request: ChallengeRequest!) {
    challenge(request: $request) { text }
  }
`;
const AUTHENTICATION = `
  mutation($request: SignedAuthChallenge!) { 
    authenticate(request: $request) {
      accessToken
      refreshToken
    }
 }
`;
const CREATE_POST_TYPED_DATA = `
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleInitData
        referenceModule
        referenceModuleInitData
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

const generateChallenge = (address: string) => {
  return apolloClient.query({
    query: gql(GET_CHALLENGE),
    variables: {
      request: {
        address,
      },
    },
  });
};

const authenticate = (address: string, signature: string) => {
  return apolloClient.mutate({
    mutation: gql(AUTHENTICATION),
    variables: {
      request: {
        address,
        signature,
      },
    },
  });
};

const createPostTypedData = (createPostTypedDataRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(CREATE_POST_TYPED_DATA),
    variables: {
      request: createPostTypedDataRequest,
    },
  });
};

const getImageMimeType = async (url: string) => {
  const res = await axios.get(url);
  return res.headers["content-type"];
};

type LensContextType = {
  lensHandle?: string;
  lensAvatar?: string;
  profileId?: string;
  createPost: Function;
};

export const LensContext = createContext<LensContextType>({
  createPost: () => {},
});

export const LensProvider = ({ children }: { children?: React.ReactNode }) => {
  const [lensHandle, setLensHandle] = useState<string>();
  const [lensAvatar, setLensAvatar] = useState<string>();
  const [profileId, setProfileId] = useState<string>();
  const [authenticationToken, setAuthenticationToken] = useState<string>();

  const { data: account } = useAccount();

  const { signMessageAsync: signMessage } = useSignMessage();
  const { signTypedDataAsync: signTypedData } = useSignTypedData();
  const { writeAsync: postWithSig } = useContractWrite(
    {
      addressOrName: config.lensHubProxy,
      contractInterface: LensHubABI,
    },
    "postWithSig"
  );

  const login = async () => {
    if (authenticationToken) {
      console.log("login: already logged in");
      return;
    }

    console.log("login: address", account?.address);

    // request a challenge from the server
    const challengeResponse = await generateChallenge(account?.address!);
    const signature = await signMessage({
      message: challengeResponse.data.challenge.text,
    });

    const tokens = await authenticate(account?.address!, signature);
    prettyJSON("login: result", tokens.data);
    localStorage.setItem("accessToken", tokens.data.authenticate.accessToken);
    localStorage.setItem("refreshToken", tokens.data.authenticate.refreshToken);

    setAuthenticationToken(tokens.data.authenticate.accessToken);
  };

  const createPost = async (tweetText: string, tweetMedia?: TweetMedia[]) => {
    if (!lensHandle) {
      console.log("createPost: no lens handle");
      return;
    }
    await login();

    let image: null | string = null;
    let imageMimeType: null | string = null;
    let media: {
      item: string;
      type: string;
    }[] = [];
    if (tweetMedia) {
      if (tweetMedia[0].type === "photo") {
        image = await uploadFromURLToIpfs(tweetMedia[0].url!);
        imageMimeType = await getImageMimeType(tweetMedia[0].url!);

        media.push({
          item: await uploadFromURLToIpfs(tweetMedia[0].url!),
          type: imageMimeType,
        });
      }
      for (var i = 1; i < tweetMedia.length; i++) {
        if (tweetMedia[i].type === "photo") {
          media.push({
            item: await uploadFromURLToIpfs(tweetMedia[i].url!),
            type: await getImageMimeType(tweetMedia[i].url!),
          });
        }
      }
    }

    const ipfsResult = await uploadIpfs<Metadata>({
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: tweetText,
      content: tweetText,
      external_url: null,
      image,
      imageMimeType,
      name: `Post by @${lensHandle}`,
      attributes: [
        {
          traitType: "string",
          value: "post",
        },
      ],
      media,
      appId: "lens-share",
    });
    console.log("create post: ipfs result", ipfsResult);

    const createPostRequest = {
      profileId,
      contentURI: ipfsResult,
      collectModule: {
        freeCollectModule: { followerOnly: false },
      },
    };

    const result = await createPostTypedData(createPostRequest);
    console.log("create post: createPostTypedData", result);

    const typedData = result.data.createPostTypedData.typedData;
    console.log("create post: typedData", typedData);

    const signature = await signTypedData({
      domain: omit(typedData.domain, "__typename"),
      types: omit(typedData.types, "__typename"),
      value: omit(typedData.value, "__typename"),
    });
    const { v, r, s } = ethers.utils.splitSignature(signature);
    await postWithSig({
      args: {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      },
    });
  };

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
        setProfileId(profile.id);
        if (profile.picture) {
          setLensAvatar(profile.picture.original.url);
        }
      } else {
        setLensHandle(undefined);
        setLensHandle(undefined);
      }
    };

    if (account?.address) {
      fetchProfile();
    }
  }, [account]);

  useEffect(() => {
    if (lensHandle) {
      login();
    }
  }, [lensHandle]);

  return (
    <LensContext.Provider
      value={{
        lensHandle,
        lensAvatar,
        profileId,
        createPost,
      }}
    >
      {children}
    </LensContext.Provider>
  );
};

export const useLens = () => useContext(LensContext);
