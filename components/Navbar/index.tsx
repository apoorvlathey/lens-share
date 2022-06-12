import React from "react";
import { Flex, Heading, Image, HStack, Spacer, Box } from "@chakra-ui/react";
import Account from "../Body/Account";

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
      <Spacer />
      <Account />
    </Flex>
  );
}

export default Navbar;