import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  Box,
  Center,
  Text,
  Input,
  HStack,
  VStack,
  Spinner,
  Image,
  Button,
  Flex,
  Link,
  Heading,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import axios from "axios";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});
import { useLens } from "../../contexts/LensContext";
import { TweetMedia } from "../../interfaces/TweetMedia";
import { htmlDecode } from "../../utils/helpers";
import { ExternalLinkIcon } from "@chakra-ui/icons";

function Body() {
  const router = useRouter();
  const tweetURL = router.query.url as string;
  const { data: account } = useAccount();
  const [isFetching, setIsFetching] = useState(false);
  const [tweetText, setTweetText] = useState<string>();
  const [tweetMedia, setTweetMedia] = useState<TweetMedia[]>();

  const {
    isFetchingProfile,
    lensHandle,
    createPost,
    postingText: loadingText,
    isPosting,
  } = useLens();

  const onPaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;

    for (const index in items) {
      const item = items[index];

      if (item.kind === "string" && item.type === "text/plain") {
        const _tweetURL = e.clipboardData.getData("Text");
        fetchTweetInfoById(_tweetURL);
      }
    }
  };

  const fetchTweetInfoById = async (_tweetURL: string) => {
    setIsFetching(true);

    const _tweetId = _tweetURL.split("/").pop()?.split("?")[0];

    try {
      const res = await axios(`/api/getTweet/${_tweetId}`);
      const { data: resData } = res;
      let _tweetText = htmlDecode(resData.data.text);

      let _tweetMedia;
      if (resData.includes) {
        _tweetMedia = resData.includes.media.filter(
          (m: { type: "photo" | "video" }) => m.type === "photo"
        );

        // remove t.co link from tweet text
        _tweetText = _tweetText.split("https://t.co/").slice(0, -1).join("");
      }

      console.log({ _tweetText, _tweetMedia });
      setTweetText(_tweetText);
      setTweetMedia(_tweetMedia);
    } catch (e: any) {
      console.log(e);
    }

    setIsFetching(false);
  };

  useEffect(() => {
    if (tweetURL) {
      fetchTweetInfoById(tweetURL);
    }
  }, [tweetURL]);

  return (
    <Flex
      flex={1}
      pb="2rem"
      flexDir="column"
      justifyContent="flex-start"
      alignItems="center"
      bgGradient={
        "linear-gradient(45deg, rgba(69,182,73,1) 0%, rgba(235,244,64,1) 110%)"
      }
    >
      {!tweetText && (
        <Heading pt="10rem" color="white" fontFamily="Poppins">
          Post your Tweets to Lens Protocol 🌿
        </Heading>
      )}
      <Center pt="5rem" flexDir={"column"}>
        {isFetching ? (
          <Spinner />
        ) : (
          <Box>
            <Text color={"green.800"} fontWeight="extrabold">
              Enter Tweet URL
            </Text>
            <VStack>
              <Input
                bgColor={"white"}
                w="35rem"
                borderColor={"green.800"}
                rounded={"lg"}
                autoComplete="off"
                placeholder="https://twitter.com/username/status/1234"
                _placeholder={{
                  color: "gray.300",
                }}
                isReadOnly={!lensHandle}
                cursor={!lensHandle ? "not-allowed" : "text"}
                onPaste={onPaste}
              />
              {!account?.address && <ConnectWallet />}
              {account?.address && !lensHandle && !isFetchingProfile && (
                <VStack pt="2rem">
                  <Text
                    fontWeight={"bold"}
                    color="white"
                    bgColor={"red.400"}
                    py="0.5rem"
                    px="1rem"
                    rounded="lg"
                  >{`⚠️ Lens Profile doesn't exist`}</Text>
                  <HStack color="white">
                    <Text>Claim your profile at</Text>
                    <Link href="https://www.lensfrens.xyz/" isExternal>
                      https://www.lensfrens.xyz/ <ExternalLinkIcon />
                    </Link>
                  </HStack>
                </VStack>
              )}
            </VStack>
          </Box>
        )}
        {tweetText && (
          <Center flexDir={"column"} mt="2rem">
            <Button
              color={"white"}
              fontWeight="bold"
              bgColor={"green.600"}
              border="2px solid"
              borderColor={"green.600"}
              _hover={{
                bgColor: "green.800",
                color: "white",
              }}
              boxShadow="lg"
              onClick={() => createPost(tweetText, tweetMedia)}
              isLoading={isPosting}
              loadingText={loadingText}
              disabled={!lensHandle}
            >
              POST 🌿
            </Button>
            <Box
              mt="0.5rem"
              w="60rem"
              py="1rem"
              px="2rem"
              bgColor={"white"}
              rounded="xl"
            >
              <Text whiteSpace={"pre-line"}>{tweetText}</Text>
              <Flex mt="1rem">
                {tweetMedia &&
                  tweetMedia.map((m, i) => {
                    return (
                      <Box key={i} maxW="30rem" ml="0.5rem">
                        <Image src={m.url} alt={m.url} rounded="lg" />
                      </Box>
                    );
                  })}
              </Flex>
            </Box>
          </Center>
        )}
      </Center>
    </Flex>
  );
}

export default Body;
