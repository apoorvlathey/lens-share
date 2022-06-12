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
    <Center mr="1rem">
      <Box
        display="flex"
        alignItems="center"
        background="brand.light"
        borderRadius="xl"
        py="1"
        pr="2"
      >
        <Box px="3">
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
          onClick={handleOpenModal}
          bg="brand.darker"
          border="1px solid transparent"
          _hover={{
            border: "1px",
            borderStyle: "solid",
            borderColor: "blue.400",
            backgroundColor: "gray.700",
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          h="38px"
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
