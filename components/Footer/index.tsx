import React from "react";
import { Image, Center, Heading, Link, HStack, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Footer = () => {
  return (
    <Center py="1.5rem" bgColor={"green.500"} color="white">
      <Heading size={"md"} fontFamily="Poppins" fontWeight={500}>
        <HStack>
          <Image src="/lens.png" w="24px" h="24px" alt="lens" />
          <Text>Built by</Text>
          <Link
            textDecor={"underline"}
            href="https://lenster.xyz/u/apoorv.lens"
            isExternal
          >
            apoorv.lens <ExternalLinkIcon />
          </Link>
        </HStack>
      </Heading>
    </Center>
  );
};

export default Footer;
