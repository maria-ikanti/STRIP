import { useEffect, useState } from 'react'; 
// On importe les données de contrats
import { stakingContractAddress, stakingContractAbi } from '@/constants';
import { struTokenAddress, struTokenAbi } from '@/constants'
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt} from 'wagmi';
import {Box, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';
import { isAddress } from "viem";
import { GiMoneyStack } from "react-icons/gi"

const Claim = () => {

    // On récupère l'adresse connectée à la DApp
    const { address } = useAccount();
    //alert (connectedUserAddress);

    const toast = useToast();

    // Un state pour stocker l'adresse du user à minter
    const [addressToMint, setAddressToMint] = useState('');
    // Un State pour stocker le nombre de l'input
    const [tokenAmount, setTokenAmount] = useState('');

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
      <Heading as='h2' size='xl' ml='5rem'>
                   Claim your rewards
      </Heading>
      <Box p="2rem">
            {/* Est ce qu'on est en train de récupérer la balance en STRU ? */}
            {earnedPending ? (
                <Spinner />
            ) : (
                <Text>Yout current yelds amount is : {earnedGet?.toString()}</Text>
            )}
       </Box>

        <Flex mt="2rem" mb="2rem">
            <Button w='15rem' leftIcon={<GiMoneyStack />} ml="1rem" mr="2rem" backgroundColor="#CBC49B" disabled={claimIsPending} onClick={claimYelds}>Claim</Button>
        </Flex>

      
    </>
  )
}

export default Claim
