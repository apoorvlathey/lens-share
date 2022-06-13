import NextImage from "next/image";
import React from "react";
import { Flex, Heading, HStack, Spacer, Box } from "@chakra-ui/react";
import Account from "../Body/Account";

function Navbar() {
  return (
    <Flex
      bgColor={"green.700"}
      borderBottom={"2px"}
      borderColor="black"
      boxShadow="xl"
    >
      <HStack py="1rem" pl="1rem">
        <NextImage src="/leaf.png" width="48px" height="41px" alt="logo" />
        <Heading
          pl="0.5rem"
          fontSize={"2xl"}
          color="white"
          fontFamily={"Poppins"}
          fontWeight={500}
        >
          Lens share
        </Heading>
      </HStack>
      <Spacer />
      <Account />
    </Flex>
  );
}

export default Navbar;
