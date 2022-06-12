import type { NextPage } from "next";
import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Body from "../components/Body";

const Home: NextPage = () => {
  return (
    <Flex flexDir={"column"} minH="100vh">
      <Navbar />
      <Body />
    </Flex>
  );
};

export default Home;
