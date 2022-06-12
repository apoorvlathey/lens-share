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
        bgColor={"green.500"}
        fontWeight="bold"
        color={"white"}
        border="2px solid"
        borderColor={"green.600"}
        _hover={{
          bgColor: "green.600",
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
