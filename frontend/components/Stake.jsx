'use client'

import { useEffect, useState } from 'react'; 
// On importe les données du contrat
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import {Alert, AlertIcon, Box, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';
import { isAddress } from "viem";
import { FaPiggyBank } from "react-icons/fa"

// Permet de parser l'event
import { parseAbiItem } from 'viem';
// On importe le publicClient créé 
import { publicClient } from '../utils/client';


const Stake = () => {

  // On récupère l'adresse connectée à la DApp
  const { address } = useAccount();
  //alert (connectedUserAddress);

  const [owner, setOwner] = useState([]);

  const toast = useToast();

  // Un state pour stocker l'adresse du user à minter
  const [addressToMint, setAddressToMint] = useState('');
  // Un State pour stocker le nombre de l'input
  const [tokenAmount, setTokenAmount] = useState('');

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

  const stakeSTRU = async() => {
      if(!isNaN(tokenAmount)) {
            if(tokenAmount>balanceGet){
                toast({
                    title: "The amount of token in your balance is not enough",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }else{
                writeContract({
                    address: struTokenAddress,
                    abi: struTokenAbi,
                    functionName: 'stake',
                    args: [addressToMint, tokenAmount],
                    account: address
                })
            }
      }
      else {
          toast({
              title: "Please enter a valid amount",
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
    {contractOwner == address ? (
                <Text>This is the owner</Text>
            ) : (
                <Text>This is NOT the owner</Text>
            )}

      <Heading as='h2' size='xl' ml='5rem'>
                    Stake your STRU
      </Heading>
      <Box p="2rem">
            {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
            {balancePending ? (
                <Spinner />
            ) : (
                <Text>Your current STRU balance is: {balanceGet?.toString()}</Text>
            )}
       </Box>

        <Flex mt="2rem" mb="2rem">
            <Input id='amnt' w='20rem' backgroundColor="#CBC49B" placeholder='Amount to stake' ml="1rem"  value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />
            <Button w='15rem' leftIcon={<FaPiggyBank />} ml="1rem" mr="2rem" backgroundColor="#CBC49B" disabled={mintIsPending} onClick={stakeSTRU}>Stake</Button>
        </Flex>

      
    </>
  )
}

export default Stake
