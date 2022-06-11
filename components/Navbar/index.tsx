import React from "react";
import { Flex, Heading, Image, HStack } from "@chakra-ui/react";

function Navbar() {
  return (
    <Flex bgColor={"brand.dark"} boxShadow="dark-lg">
      <HStack py="1rem" pl="1rem">
        <Image src="/leaf.png" w="3rem" alt="logo" />
        <Heading
          pl="0.5rem"
          fontSize={"2xl"}
          color="white"
          fontFamily={"Poppins"}
          fontWeight={800}
        >
          Lens share
        </Heading>
      </HStack>
    </Flex>
  );
}

export default Navbar;
