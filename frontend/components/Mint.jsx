'use client'

import { useEffect, useState } from 'react'; 
// On importe les données du contrat
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import {Alert, AlertIcon, Box, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';
import { isAddress } from "viem";
import { MdBuild , MdCall } from "react-icons/md"

// Permet de parser l'event
import { parseAbiItem } from 'viem';
// On importe le publicClient créé 
import { publicClient } from '../utils/client';


const Mint = () => {

  // On récupère l'adresse connectée à la DApp
  const { address } = useAccount();
  //alert (connectedUserAddress);

  const toast = useToast();

  // Un state pour stocker l'adresse du user à minter
  const [addressToMint, setAddressToMint] = useState('');
  // Un State pour stocker le nombre de l'input
  const [tokenAmount, setTokenAmount] = useState('');

  const { data: balanceGet, error: balanceError, isPending: balancePending, refetch: balanceRefetch } = useReadContract({
    // adresse du contrat
    address: struTokenAddress,
    // abi du contrat
    abi: struTokenAbi,
    // nom de la fonction dans le smart contract
    functionName: 'balanceOf',
    //arguments
    args : [address],
    // qui appelle la fonction ?
    account: struTokenAddress
  });

  const { data: hash, error: mintError, isPending: mintIsPending, writeContract } = useWriteContract({
    mutation: {
        // Si ça a marché d'écrire dans le contrat
        onSuccess: () => {
            toast({
                title: 'The mint has ended successfuly',
                status: "success",
                duration: 6000,
                isClosable: true,
            });
          //refetchEverything();
          setAddressToMint('');
          setTokenAmount('');
        },
        // Si erreur
        onError: (mintError) => {
            toast({
                title: mintError.shortMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        },
    }
  });

  const mintSTRU = async() => {
      if(isAddress(addressToMint)&& !isNaN(tokenAmount)) {
            //alert(addressToMint);
            //alert(tokenAmount);
          writeContract({
              address: struTokenAddress,
              abi: struTokenAbi,
              functionName: 'mint',
              args: [addressToMint, tokenAmount],
              account: address
          })
      }
      else {
          toast({
              title: "Please enter a valid address and amount",
              status: "error",
              duration: 3000,
              isClosable: true,
          });
      }
  }

  // Equivalent de transaction.wait() en ethersjs, on récupère si la transaction est en train d'être intégré dans un bloc (isConfirming) et si ça a marché au final (isConfirmed), il faut passer en paramètre le hash de la transaction (voir ci-dessus)
  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = useWaitForTransactionReceipt({ 
    hash,
  })

  const refetchEverything = async() => {
      //await balanceRefetch();
      //await getEvents();
  }

 /* useEffect(() => {
      if(isSuccess) {
          toast({
              title: "The mint has ended with success",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
         // refetchEverything();
          setAddressToMint('');
          setTokenAmount('');
      }
  }, [isSuccess, errorConfirmation])*/
    
  return (
    <>
      <Heading as='h2' size='xl' ml='5rem'>
                    Mint STRU
      </Heading>
      <Box p="2rem">
            {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
            {balancePending ? (
                <Spinner />
            ) : (
                <Text>STRU balance of: {address} is {balanceGet?.toString()}</Text>
            )}
       </Box>

        <Flex mt="2rem" mb="2rem">
            <Input id='addr' mr="2rem" backgroundColor="#CBC49B" placeholder='Address to mint' ml="1rem" value={addressToMint} onChange={(e) => setAddressToMint(e.target.value)} />
            <Input id='amnt' w='20rem' backgroundColor="#CBC49B" placeholder='Amount to mint' ml="1rem"  value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />
            <Button w='15rem' leftIcon={<MdBuild />} ml="1rem" mr="2rem" backgroundColor="#CBC49B" disabled={mintIsPending} onClick={mintSTRU}>Mint</Button>
        </Flex>

      
    </>
  )
}

export default Mint
