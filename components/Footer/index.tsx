import NextImage from "next/image";
import React from "react";
import {
  Flex,
  Heading,
  Link,
  HStack,
  Text,
  Spacer,
  Button,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Footer = () => {
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  return (
    <Flex
      flexDir={["column", "row", "row"]}
      py="1rem"
      bgColor={"green.500"}
      color="white"
    >
      <Center>
        <Heading pl="2rem" size={"md"} fontFamily="Poppins" fontWeight={500}>
          <HStack>
            <NextImage src="/lens.png" width="24px" height="24px" alt="lens" />
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
      <Spacer />
      <Center>
        <Button
          mr={[0, 0, "1rem"]}
          mt={[2, 2, 0]}
          bgColor={"green.700"}
          fontWeight="bold"
          color={"white"}
          border="2px solid"
          borderColor={"green.600"}
          _hover={{
            bgColor: "green.600",
          }}
          onClick={openModal}
        >
          Add Bookmarklet!
        </Button>
      </Center>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Bookmarklet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"} mb="1rem">
              <Text>Drag the following link into your bookmarks tab:</Text>
              <Center>
                <Link
                  color="blue.400"
                  textDecor={"underline"}
                  href="javascript:window.open('https://lens-share.apoorv.xyz/?url=%27+window.location.href);"
                  onClick={(e) => e.preventDefault()}
                >
                  🌿 lens-share
                </Link>
              </Center>
              <Text mt="1rem" fontWeight={500}>
                To use
              </Text>
              <OrderedList>
                <ListItem>Visit any twitter post</ListItem>
                <ListItem>Click this bookmarklet</ListItem>
                <ListItem>
                  Lens share opens up with tweet already loaded
                </ListItem>
                <ListItem>Instantly post to Lens protocol!</ListItem>
              </OrderedList>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Footer;
