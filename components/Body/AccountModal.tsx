import {
  Box,
  Button,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { ExternalLinkIcon, CopyIcon } from "@chakra-ui/icons";
import { useAccount, useDisconnect } from "wagmi";
import { useLens } from "../../contexts/LensContext";
import Identicon from "./Identicon";
import slicedAddress from "../../utils/slicedAddress";
import { targetChain } from "../../config";

type Props = {
  isOpen: any;
  onClose: any;
};

const AccountModal = ({ isOpen, onClose }: Props) => {
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();

  const { lensHandle, lensAvatar } = useLens();

  function handleDisconnectAccount() {
    disconnect();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent
        background="green.900"
        border="1px"
        borderStyle="solid"
        borderColor="green.400"
        borderRadius="3xl"
      >
        <ModalHeader color="white" px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          color="white"
          fontSize="sm"
          _hover={{
            color: "whiteAlpha.700",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="3xl"
            border="1px"
            borderStyle="solid"
            borderColor="green.400"
            px={5}
            pt={4}
            pb={2}
            mb={3}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text color="green.400" fontSize="sm">
                Connected with {account?.connector?.name}
              </Text>
              <Button
                onClick={handleDisconnectAccount}
                variant="outline"
                size="sm"
                borderColor="white"
                borderRadius="3xl"
                color="white"
                fontSize="13px"
                fontWeight="normal"
                px={2}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "green.300",
                  color: "green.300",
                }}
              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              {lensAvatar ? (
                <Image
                  src={lensAvatar}
                  w="24px"
                  h="24px"
                  rounded={"full"}
                  alt="lens avatar"
                />
              ) : (
                <Identicon />
              )}
              <Text
                color="white"
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {lensHandle ??
                  (account &&
                    account.address &&
                    slicedAddress(account.address))}
              </Text>
            </Flex>
            {lensHandle && (
              <>
                <Link
                  href={`https://${
                    process.env.NEXT_PUBLIC_USE_TESTNET ? "testnet." : ""
                  }lenster.xyz/u/${lensHandle}`}
                  isExternal
                >
                  <HStack
                    mx={3}
                    color="white"
                    _hover={{
                      textDecoration: "none",
                      color: "whiteAlpha.800",
                    }}
                  >
                    <ExternalLinkIcon />
                    <Text>View on Lenster </Text>
                    <Image src="/lenster.svg" w="20px" h="20px" alt="lenster" />
                  </HStack>
                </Link>
                <Divider mt="0.5rem" />
              </>
            )}
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color="white"
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                  color: "whiteAlpha.800",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(account?.address!);
                }}
              >
                <CopyIcon mr={1} />
                Copy Address
              </Button>
              <Link
                fontSize="sm"
                display="flex"
                alignItems="center"
                href={`${targetChain.blockExplorers?.default.url}/address/${account?.address}`}
                isExternal
                color="white"
                ml={6}
                _hover={{
                  color: "whiteAlpha.800",
                  textDecoration: "underline",
                }}
              >
                <ExternalLinkIcon mr={1} />
                View on Explorer
              </Link>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          background="green.900"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={4}
        >
          <Text
            color="white"
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          ></Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
