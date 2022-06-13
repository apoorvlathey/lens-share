import { Button, Box, Text, Skeleton, Image, Center } from "@chakra-ui/react";
import { useAccount, useBalance } from "wagmi";
import { useLens } from "../../contexts/LensContext";
import slicedAddress from "../../utils/slicedAddress";
import Identicon from "./Identicon";

type Props = {
  handleOpenModal: any;
};

const AccountInfo = ({ handleOpenModal }: Props) => {
  const { data: account } = useAccount();
  const { data: etherBalance, isLoading: isBalanceLoading } = useBalance({
    addressOrName: account?.address,
  });
  const { lensHandle, lensAvatar } = useLens();

  return account?.address ? (
    <Center pr={["0", "0", "4"]}>
      <Box
        py="1"
        px="2"
        display="flex"
        alignItems="center"
        background="green.500"
        borderRadius="xl"
      >
        <Box pr={["0", "2", "3"]} display={["none", "flex", "flex"]}>
          <Text color="white" fontSize="md">
            {isBalanceLoading && <Skeleton rounded={"lg"}>0.00 ETH</Skeleton>}
            {etherBalance && (
              <>
                {parseFloat(etherBalance.formatted).toFixed(4)}{" "}
                {etherBalance.symbol}
              </>
            )}
          </Text>
        </Box>
        <Button
          m="1px"
          px={[4, 3, 3]}
          h="38px"
          bg="green.700"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          borderRadius="xl"
          onClick={handleOpenModal}
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {lensHandle ?? slicedAddress(account.address)}
          </Text>
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
        </Button>
      </Box>
    </Center>
  ) : (
    <></>
  );
};

export default AccountInfo;
