'use client'

import { useEffect, useState } from 'react'; 
// On importe les données de contrats
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt} from 'wagmi';
import {Box, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';
import { GiReceiveMoney } from "react-icons/gi"

const Claim = () => {

    // On récupère l'adresse connectée à la DApp
    const { address } = useAccount();

    const toast = useToast();

    // Un state pour stocker l'adresse du user qui claim
    //const [addressClaiming, setAddressClaiming] = useState('');
    // Un State pour stocker le nombre de l'input
    //const [tokenAmount, setTokenAmount] = useState('');

    const { data: earnedGet, error: earnedError, isPending: earnedPending, refetch: earnedRefetch } = useReadContract({
        // adresse du contrat
        address: stakingContractAddress,
        // abi du contrat
        abi: stakingContractAbi,
        // nom de la fonction dans le smart contract
        functionName: 'earned',
        //arguments
        args : [address],
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

    const { data: hash, error: claimError, isPending: claimIsPending, writeContract } = useWriteContract({
        mutation: {
            // Si ça a marché d'écrire dans le contrat
            onSuccess: () => {
                toast({
                    title: 'The claim has ended successfuly',
                    status: "success",
                    duration: 6000,
                    isClosable: true,
                });
              //refetchEverything();
              //setAddressToMint('');
              // setTokenAmount('');
            },
            // Si erreur
            onError: (claimError) => {
                toast({
                    title: claimError.shortMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            },
        }
      });

    const claimYelds = async() => {

            writeContract({
                address: stakingContractAddress,
                abi: stakingContractAbi,
                functionName: 'claimYeld',
                account: address
            })
    }


  return (
    <>
      <Heading as='h2' size='xl' ml='5rem' mt="3rem" mb="3rem">
                   Claim your rewards
      </Heading>
      <Box ml="2rem">
            {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
            {strpBalancePending ? (
                <Spinner />
            ) : (
                <Text color='tomato'>Your global STRU balance is: {strpBalanceGet?.toString()}</Text>
            )}
       </Box>
      <Box ml="2rem">
            {/* Est ce qu'on est en train de récupérer la balance du contrat en STRU ? */}
            {contractBalancePending ? (
                <Spinner />
            ) : (
                <Text color="orange">Your current staken STRU amount is: {contractBalanceGet?.toString()}</Text>
            )}
       </Box>
      <Box p="2rem">
            {/* Est ce qu'on est en train de récupérer le earned ? */}
            {earnedPending ? (
                <Spinner />
            ) : (
                <Text color="yellow">Yout current rewards amount is : {earnedGet?.toString()}</Text>
            )}
       </Box>

        <Flex mt="2rem" mb="2rem">
            <Button w='15rem' leftIcon={<GiReceiveMoney />} ml="1rem" mr="2rem" backgroundColor="#CBC49B" disabled={claimIsPending} onClick={claimYelds}>Claim</Button>
        </Flex>

      
    </>
  )
}

export default Claim
