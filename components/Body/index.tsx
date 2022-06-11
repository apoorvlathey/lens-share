import React from "react";
import {
  Box,
  Center,
  Text,
  Input,
  HStack,
  Spacer,
  Button,
  VStack,
} from "@chakra-ui/react";

function Body() {
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
            />
            <Button
              bgColor={"brand.light"}
              fontWeight="bold"
              color={"white"}
              border="2px solid"
              borderColor={"brand.text"}
              _hover={{
                bgColor: "brand.text",
              }}
            >
              Connect Wallet
            </Button>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}

export default Body;
