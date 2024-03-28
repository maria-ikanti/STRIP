'use client';
import Layout from "@/components/Layout";

import { useAccount } from "wagmi";

import NotConnected from "@/components/NotConnected";
import DefiStripAppli from "@/components/DefiStripAppli";
import Admin from "@/components/Admin";

import { Flex } from "@chakra-ui/react";

export default function Home() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <>
          <Admin />
        </>
      ) : (
        <>
          <Admin />
        </>
      )}
    </>
  );
}