'use client';

import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { useReadContract, useAccount } from 'wagmi';

import { useEffect, useState } from 'react'; 

import Mint from "@/components/Mint";

import { Flex, Text, Box} from "@chakra-ui/react";

export default function mint() {

  // On récupère l'adresse du compte qui est connecté à la DApp
  // On récupère aussi s'il y a qqn connecté ou pas
  const { address, isConnected } = useAccount();

  // On récupère l'adresse du owner de la DAPP
  const [owner, setOwner] = useState([]);

  // gets the owner
  const { data : contractOwner, isLoading : ownerLoading, refetch : refetchOwner } = useReadContract({
    address : stakingContractAddress,
    abi : stakingContractAbi,
    functionName : 'owner',
    account : address
    })

    useEffect(() => {
        if(contractOwner) {
            setOwner(contractOwner);
            console.log(contractOwner);
            console.log(owner);
        }
    }, [contractOwner])

  return (
    <>
      {isConnected ? (
        contractOwner == address ? (
        <>
          <Mint />
        </>
      ):
        (
          <Flex>
            <Box ml="2rem" mr="2rem" mt='10rem' bg='#ffffED' borderRadius={10} width='100%'>
              <Text ml="1rem" mt="1rem" mr='1rem' mb='1rem'>
                  The address {address} is not the owner and cannot mint STRU. 
              </Text>
            </Box>
          </Flex>
        )
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