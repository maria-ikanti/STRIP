'use client'

import { useEffect, useState } from 'react'; 
// On importe les données du contrat
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import {Alert, AlertIcon, AlertTitle, AlertDescription, useToast, Flex, Heading, Spinner, Table, Input, Button} from '@chakra-ui/react';
import { isAddress } from "viem";

// Permet de parser l'event
import { parseAbiItem } from 'viem';
// On importe le publicClient créé 
import { publicClient } from '../utils/client';


const Admin = () => {

  // On récupère l'adresse connectée à la DApp
  const { address } = useAccount();

  const toast = useToast();

  // Un state pour stocker l'adresse du user à minter
  const [addressToMint, setAddressToMint] = useState('');
  // Un State pour stocker le nombre de l'input
  const [tokenAmount, setTokenAmount] = useState('');

  const { data: mintData, error: mintError, isPending: mintIsPending, writeContract } = useWriteContract({
    mutation: {
        // Si ça a marché d'écrire dans le contrat
        onSuccess: () => {
            toast({
                title: "The mint has started",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
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
  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = 
  useWaitForTransactionReceipt({ 
    mintData,
  })

  const refetchEverything = async() => {
      await refetch();
      //await getEvents();
  }

  useEffect(() => {
      if(isSuccess) {
          toast({
              title: "The mint has ended with success",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
          refetchEverything();
          setAddressToMint('');
          setTokenAmount('');
      }
  }, [isSuccess, errorConfirmation])
    
  return (
    <>
      <Heading as='h2' size='xl' mt='1rem'>
                    Mint STRU
      </Heading>
            <Flex direction="column">
            {mintData && 
                <Alert status='success' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Transaction Hash: {mintData}
                </Alert>
            }
            {isConfirming && 
                <Alert status='success' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Waiting for confirmation...
                </Alert>
            }
            {isSuccess && 
                <Alert status='success' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Transaction confirmed.
                </Alert>
            }
            {errorConfirmation && (
                <Alert status='error' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Error: {(errorConfirmation).shortMessage || errorConfirmation.message}
                </Alert>
            )}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center" width="100%" mt="2rem" mb="2rem">
            <Input placeholder='Address to mint' value={addressToMint} onChange={(e) => setAddressToMint(e.target.value)} />
            <Input placeholder='Amount to mint' onChange={(e) => setTokenAmount(e.target.value)} />
            <Button ml="1rem" colorScheme="green" disabled={mintIsPending} onClick={mintSTRU}>{mintIsPending ? 'Confirming...' : 'Mint'} </Button>
        </Flex>
        
      
    </>
  )
}

export default Admin
