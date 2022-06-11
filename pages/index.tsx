import type { NextPage } from "next";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Body from "../components/Body";

const Home: NextPage = () => {
  return (
    <Box>
      <Navbar />
      <Body />
    </Box>
  );
};

export default Home;
