import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  chakra,
  Box,
  Center,
  Text,
  Input,
  HStack,
  VStack,
  Spinner,
  Image,
  Button,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import axios from "axios";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});
import { useLens } from "../../contexts/LensContext";
import { TweetMedia } from "../../interfaces/TweetMedia";
import { htmlDecode } from "../../utils/helpers";

function Body() {
  const { data: account } = useAccount();
  const [isFetching, setIsFetching] = useState(false);
  const [tweetText, setTweetText] = useState<string>();
  const [tweetMedia, setTweetMedia] = useState<TweetMedia[]>();

  const { createPost } = useLens();

  const onPaste = async (e: React.ClipboardEvent) => {
    setIsFetching(true);
    const items = e.clipboardData.items;

    for (const index in items) {
      const item = items[index];

      if (item.kind === "string" && item.type === "text/plain") {
        const tweetURL = e.clipboardData.getData("Text");
        const _tweetId = tweetURL.split("/").pop()?.split("?")[0];

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
            _tweetText = _tweetText
              .split("https://t.co/")
              .slice(0, -1)
              .join("");
          }

          console.log({ _tweetText, _tweetMedia });
          setTweetText(_tweetText);
          setTweetMedia(_tweetMedia);
        } catch (e: any) {
          console.log(e);
        }
      }
    }

    setIsFetching(false);
  };

  return (
    <Box
      minH="100vh"
      bgGradient={
        "linear-gradient(45deg, rgba(69,182,73,1) 0%, rgba(235,244,64,1) 100%)"
      }
    >
      <Center pt="15rem" flexDir={"column"}>
        {isFetching ? (
          <Spinner />
        ) : (
          <Box>
            <Text color={"brand.text"} fontWeight="extrabold">
              Enter Tweet URL
            </Text>
            <VStack>
              <Input
                bgColor={"white"}
                w="35rem"
                borderColor={"brand.text"}
                rounded={"lg"}
                autoComplete="off"
                placeholder="https://twitter.com/username/status/1234"
                _placeholder={{
                  color: "gray.300",
                }}
                onPaste={onPaste}
              />
              {!account?.address && <ConnectWallet />}
            </VStack>
          </Box>
        )}
        <Button onClick={() => createPost(tweetText, tweetMedia)}>POST</Button>
        <Box mt="2rem" maxW="70rem" bgColor={"white"}>
          {tweetText && <Text>{tweetText}</Text>}
          <HStack>
            {tweetMedia &&
              tweetMedia.map((m, i) => {
                return (
                  <Image
                    key={i}
                    src={m.url}
                    alt={m.url}
                    maxW="30rem"
                    rounded="lg"
                  />
                );
              })}
          </HStack>
        </Box>
      </Center>
    </Box>
  );
}

export default Body;
