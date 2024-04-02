'use client';

import { useReadContract, useAccount } from 'wagmi';

import Claim from "@/components/Claim";

import { Heading} from "@chakra-ui/react";

export default function claim() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  
  return (
    <>
      {isConnected ? (
        <>
          <Claim />
        </>
        ) : (
        <>
          <Heading as='h2' size='xl' ml='20rem' mt='5rem' width="100%">
              Please connect !
          </Heading>
        </>
      )}
    </>
  );
}