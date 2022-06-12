import { createContext, useContext, useEffect, useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useNetwork, useAccount } from "wagmi";
import { targetChain } from "../config";

type ActiveChainContextType = {};

export const ActiveChainContext = createContext<ActiveChainContextType>({});

export const ActiveChainProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { activeChain, switchNetwork, isLoading } = useNetwork();
  const { data: account } = useAccount();

  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  useEffect(() => {
    if (activeChain && activeChain?.unsupported && switchNetwork) {
      openModal();
    } else {
      if (isModalOpen) {
        closeModal();
      }
    }
  }, [activeChain, switchNetwork]);

  useEffect(() => {
    console.log({ account, activeChain });
  }, [account, activeChain]);

  return (
    <ActiveChainContext.Provider value={{}}>
      {children}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>⚠️ Incorrect Network</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Press OK to switch to {targetChain.name} Network
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => {
                switchNetwork!(targetChain.id);
              }}
              isLoading={isLoading}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ActiveChainContext.Provider>
  );
};

export const useActiveChain = () => useContext(ActiveChainContext);
