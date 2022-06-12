import React from "react";
import dynamic from "next/dynamic";
import { Box, Center, Text, Input, HStack, VStack } from "@chakra-ui/react";
import { useAccount } from "wagmi";
const ConnectWallet = dynamic(() => import("./ConnectWallet"), {
  ssr: false,
});

function Body() {
  const { data: account } = useAccount();

  return (
    <Box
      h="100vh"
      bgGradient={
        "linear-gradient(45deg, rgba(69,182,73,1) 0%, rgba(235,244,64,1) 100%)"
      }
    >
      <Center pt="15rem" flexDir={"column"}>
        <Box>
          <HStack>
            <Text color={"brand.text"} fontWeight="extrabold">
              Enter Tweet URL
            </Text>
          </HStack>
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
            />
            {!account?.address && <ConnectWallet />}
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}

export default Body;
