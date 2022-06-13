import type { NextPage } from "next";
import Head from "next/head";
import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import Body from "../components/Body";
import Footer from "../components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Lens share</title>
        <link rel="icon" href="/leaf.png" />
      </Head>
      <Flex flexDir={"column"} minH="100vh">
        <Navbar />
        <Body />
        <Footer />
      </Flex>
    </>
  );
};

export default Home;
