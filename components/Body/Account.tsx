import React from "react";
import dynamic from "next/dynamic";
import { useDisclosure } from "@chakra-ui/react";
const AccountInfo = dynamic(() => import("./AccountInfo"), {
  ssr: false,
});
import AccountModal from "./AccountModal";

function Account() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AccountInfo handleOpenModal={onOpen} />
      <AccountModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Account;
