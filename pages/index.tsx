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
        <link rel="icon" href="/leaf.png" />

        {/* <!-- Primary Meta Tags --> */}
        <title>Lens share</title>
        <meta name="title" content="Lens share" />
        <meta
          name="description"
          content="Move your Tweets to the Lens Protocol 🌿"
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lens-share.apoorv.xyz/" />
        <meta property="og:title" content="Lens share" />
        <meta
          property="og:description"
          content="Move your Tweets to the Lens Protocol 🌿"
        />
        <meta
          property="og:image"
          content="https://lens-share.apoorv.xyz/metaIMG.png"
        />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lens-share.apoorv.xyz/" />
        <meta property="twitter:title" content="Lens share" />
        <meta
          property="twitter:description"
          content="Move your Tweets to the Lens Protocol 🌿"
        />
        <meta
          property="twitter:image"
          content="https://lens-share.apoorv.xyz/metaIMG.png"
        />
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
