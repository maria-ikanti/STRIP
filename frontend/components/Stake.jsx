'use client'

import { useEffect, useState } from 'react'; 
// On importe les données de contrats
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi';
import {Alert, AlertIcon, Box, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';
import { isAddress } from "viem";
import { FaPiggyBank } from "react-icons/fa"

const Stake = () => {

  // On récupère l'adresse connectée à la DApp
  const { address } = useAccount();
  //alert (connectedUserAddress);

  const [owner, setOwner] = useState([]);

  const toast = useToast();

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
    account: address
  });

  const { data: stryBalanceGet, error: stryBalanceError, isPending: stryBalancePending, refetch: stryBalanceRefetch } = useReadContract({
    // adresse du contrat
    address: stakingContractAddress,
    // abi du contrat
    abi: stakingContractAbi,
    // nom de la fonction dans le smart contract
    functionName: 'balanceOfStry',
    // qui appelle la fonction ?
    account: address
  });

  const { data: strpBalanceGet, error: strpBalanceError, isPending: strpBalancePending, refetch: strpBalanceRefetch } = useReadContract({
    // adresse du contrat
    address: stakingContractAddress,
    // abi du contrat
    abi: stakingContractAbi,
    // nom de la fonction dans le smart contract
    functionName: 'balanceOfStrp',
    // qui appelle la fonction ?
    account: address
  });

  const { data: contractBalanceGet, error: contractBlanceError, isPending: contractBalancePending, refetch: contractBalanceRefetch } = useReadContract({
    // adresse du contrat
    address: stakingContractAddress,
    // abi du contrat
    abi: stakingContractAbi,
    // nom de la fonction dans le smart contract
    functionName: 'balanceOf',
    //arguments
    args : [address],
    // qui appelle la fonction ?
    account: address
  });

  const { data: hash, error: stakeError, isPending: stakeIsPending, writeContract } = useWriteContract({
    mutation: {
        // Si ça a marché d'écrire dans le contrat
        onSuccess: () => {
            toast({
                title: 'The stake has ended successfuly',
                status: "success",
                duration: 6000,
                isClosable: true,
            });
          //refetchEverything();
          setTokenAmount('');
        },
        // Si erreur
        onError: (stakeError) => {
            toast({
                title: stakeError.shortMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        },
    }
  });

  const stakeSTRU = async() => {
        console.log(tokenAmount);
        console.log(balanceGet);
        console.log(stakingContractAddress);
      if(!isNaN(tokenAmount)) {
            if(tokenAmount>balanceGet){
                toast({
                    title: "The amount of token in your balance is not enough. ",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }else{
                writeContract({
                    address: stakingContractAddress,
                    abi: stakingContractAbi,
                    functionName: 'stake',
                    args: [tokenAmount],
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
              title: "The staking was confirmed in the blockchain with success",
              status: "success",
              duration: 3000,
              isClosable: true,
          });
         // refetchEverything();
          setTokenAmount('');
      }
  }, [isSuccess, errorConfirmation])*/
    
  return (
    <>  

      <Heading as='h2' ml='5rem' mt='10rem' mb="3rem">
                    Stake & Strip
      </Heading>

    <Flex>
      <Box ml="2rem" bg='#ffffED' borderRadius={10} width='50%'>
        <Text ml="1rem" mt="1rem" mr='1rem'>Welcome to your STRIP application. </Text>
        <Text ml="1rem" mb="2rem" mr='1rem'>Stake your STRU and strip them to STRP and STRY tokens. </Text>
        {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
        {balancePending ? (
            <Spinner />
        ) : (
            <Text color='tomato' ml="1rem" mb='1rem' fontFamily='raleway'>Your current STRU balance is: {balanceGet?.toString()}</Text>
        )}
        {/* Est ce qu'on est en train de récupérer la balance du contrat en STRU ? */}
        {contractBalancePending ? (
            <Spinner />
        ) : (
            <Text color="#26516A" ml="1rem" fontFamily='raleway'>Your current staken STRU amount is: {contractBalanceGet?.toString()}</Text>
        )}
        {/* Est ce qu'on est en train de récupérer la balance du contrat en STRU ? */}
        {strpBalancePending ? (
            <Spinner />
        ) : (
            <Text color="#26516A" ml="1rem" fontFamily='raleway'>Your current yearned STRP amount is: {strpBalanceGet?.toString()}</Text>
        )}
        {/* Est ce qu'on est en train de récupérer la balance du contrat en STRU ? */}
        {stryBalancePending ? (
            <Spinner />
        ) : (
            <Text color="#26516A" ml="1rem" mb='1rem' fontFamily='raleway'>Your current yearned STRY amount is: {stryBalanceGet?.toString()}</Text>
        )}
       </Box>
            
       <Box ml="2rem" width='50%' bg='#ffffED' borderRadius={10} mr="2rem">
            <Input id='amnt' w='20rem' backgroundColor="#ffffDD" placeholder='Amount to stake' ml="1rem" mt="2rem" mb='2rem' value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)} />
            <Button leftIcon={<FaPiggyBank />} ml="1rem" mr="1rem" backgroundColor="#CBC49B" disabled={stakeIsPending} onClick={stakeSTRU}>Stake & Strip</Button>
       </Box>
       </Flex>
    </>
  )
}

export default Stake
