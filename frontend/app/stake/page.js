'use client';

import { useReadContract, useAccount } from 'wagmi';

import Stake from "@/components/Stake";

import { Heading} from "@chakra-ui/react";

export default function stake() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  
  return (
    <>
      {isConnected ? (
        <>
          <Stake />
        </>
        ) : (
        <>
          <Heading as='h2' ml='2rem' mt='10rem'>
              Please connect !
          </Heading>
        </>
      )}
    </>
  );
}