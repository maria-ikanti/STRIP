'use client';

import { useReadContract, useAccount } from 'wagmi';

import Claim from "@/components/Claim";

import { Flex, Box, Text} from "@chakra-ui/react";

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
          <Flex>
            <Box ml="2rem" mr="2rem" mt='10rem' bg='#ffffED' borderRadius={10} width='100%'>
              <Text ml="1rem" mt="1rem" mr='1rem' mb='1rem' color="tomato">
                  Please connect !
              </Text>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
}