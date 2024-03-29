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
  Stack,
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
      console.log({ resData });
      let _tweetText = htmlDecode(resData.data.text);

      let _tweetMedia;
      if (resData.includes) {
        _tweetMedia = resData.includes.media.filter(
          (m: { type: "photo" | "video" }) => m.type === "photo"
        );

        // remove t.co link from tweet text
        // (twitter auto adds t.co link for the tweet itself in case media is present)
        _tweetText = _tweetText
          .split("https://t.co/")
          .slice(0, -1)
          .join("https://t.co/"); // joining this because a tweet can have multiple t.co links
      }

      if (resData.data.entities && resData.data.entities.urls) {
        const urls = resData.data.entities.urls;
        for (var i = 0; i < urls.length; i++) {
          const tempArr = _tweetText.split(urls[i].url);
          tempArr.splice(1, 0, urls[i].unwound_url);
          _tweetText = tempArr.join("");
        }
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
        <Heading
          pt={["6rem", "7rem", "10rem"]}
          color="white"
          fontFamily="Poppins"
        >
          <HStack px="1rem">
            <Text color="transparent" textShadow={"0 0 0 white"}>
              Post your Tweets to Lens Protocol 🌿
            </Text>
          </HStack>
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
                minW={["18rem", "25rem", "35rem", "35rem"]}
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
                  <Flex
                    flexDir={["column", "row", "row"]}
                    alignItems="center"
                    color="white"
                  >
                    <Text>Claim your profile at</Text>
                    <Link ml="1" href="https://claim.lens.xyz/" isExternal>
                      https://claim.lens.xyz/ <ExternalLinkIcon />
                    </Link>
                  </Flex>
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
