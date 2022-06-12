import React from "react";
import { Button } from "@chakra-ui/react";
import { useConnect } from "wagmi";

function ConnectWallet() {
  const { connect, connectors, isConnecting } = useConnect();

  const handleConnectWallet = () => {
    connect(connectors[0]);
  };

  return (
    <>
      <Button
        bgColor={"brand.light"}
        fontWeight="bold"
        color={"white"}
        border="2px solid"
        borderColor={"brand.text"}
        _hover={{
          bgColor: "brand.text",
        }}
        onClick={handleConnectWallet}
        isLoading={isConnecting}
        loadingText="Connecting"
      >
        Connect Wallet
      </Button>
    </>
  );
}

export default ConnectWallet;
