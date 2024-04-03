'use client';

import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { useReadContract, useAccount } from 'wagmi';

import { useEffect, useState } from 'react'; 

import Mint from "@/components/Mint";

import { Heading} from "@chakra-ui/react";

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
        <Heading as='h2' size='xl' ml='20rem' mt='5rem' width="100%">
            You're not the owner and you cannot mint. {address}
        </Heading>
        )
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