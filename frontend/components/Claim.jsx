'use client'

import { useEffect, useState } from 'react'; 
// On importe les données de contrats
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
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
        <Heading as='h2' ml='5rem' mt='10rem' mb="3rem">
                   Claim your rewards
        </Heading>

        <Flex>
            <Box ml="2rem" bg='#ffffED' borderRadius={10} width='95%'>
                <Text ml="1rem" mt="1rem" mr='1rem'>If you wish, you can claim all your rewards earned until now. </Text>

                {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
                {strpBalancePending ? (
                    <Spinner />
                ) : (
                    <Text  color="#26516A" ml="1rem" mt="2rem" mr='1rem' fontFamily='raleway'>Your global STRU balance is: {balanceGet?.toString()}</Text>
                )}

                {/* Est ce qu'on est en train de récupérer la balance du contrat en STRU ? */}
                {contractBalancePending ? (
                    <Spinner />
                ) : (
                    <Text color="#26516A" ml="1rem" mr='1rem' mb='1rem' fontFamily='raleway'>Your current staken STRU amount is: {contractBalanceGet?.toString()}</Text>
                )}

                {/* Est ce qu'on est en train de récupérer le earned ? */}
                {earnedPending ? (
                    <Spinner />
                ) : (
                    <Text fontSize='2xl' color="green" ml="1rem" mr='1rem' fontFamily='raleway'>Yout current rewards amount is : {earnedGet?.toString()}</Text>
                )}

                <Button w='10%' leftIcon={<GiReceiveMoney />} mt="2rem" ml="1rem" mr="1rem" mb="2rem" backgroundColor="#CBC49B" disabled={claimIsPending} onClick={claimYelds}>Claim</Button>
            </Box>
        </Flex>
    </>
  )
}

export default Claim
