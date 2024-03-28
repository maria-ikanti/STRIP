// On utilise useState ou useEffect ou ChakraUI, donc on met un use client.
'use client'

import { useEffect, useState } from 'react'; 
// On importe les données du contrat
import { stakingContractAddress, stakingContractAbi } from '@/constants'
import { struTokenAddress, struTokenAbi } from '@/constants'

// On importe les éléments de Wagmi qui vont nous permettre de :
/*
useReadContract : Lire les données d'un contrat
useAccount : Récupérer les données d'un compte connecté à la DApp via RainbowKit
useWriteContract : Ecrire des données dans un contrat
useWaitForTransactionReceipt : Attendre que la transaction soit confirmée (équivalent de transaction.wait() avec ethers)
useWatchContractEvent : Récupérer en temps réel si un évènement a été émis
*/
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent } from 'wagmi'

import {Alert, AlertIcon, AlertTitle, AlertDescription, useToast, Flex, Heading, Spinner, Text, Input, Button} from '@chakra-ui/react';

// Permet de parser l'event
import { parseAbiItem } from 'viem'
// On importe le publicClient créé (voir ce fichier pour avoir les commentaires sur ce que fait réellement ce publicClient)
import { publicClient } from '../utils/client'

const DefiStripAppli = () => {

  // On récupère l'adresse connectée à la DApp
  const { address } = useAccount();

  // Un State pour stocker le nombre de l'input
  const [stakeAmount, setStakeAmount] = useState(null);
  // Un State pour stocker les events
  const [events, setEvents] = useState([])

  // Permet d'afficher des toasts (voir chakraUI)
  const toast = useToast();

  // Lis des données d'un contrat
  // data renommé en numberGet : le nombre sur la blockchain
  // error renommé en getError : Il y a-t-il une erreur lors de la lecture du nombre dans le contrat ?
  // isPending renommé en getIsPending : Pour savoir si on est en train de fetch le nombre
  // refetch (pas renommé) : Permet de rappeler par la suite cette fonction
  const { data: supplyGet, error: getError, isPending: getIsPending, refetch } = useReadContract({
      // adresse du contrat
      address: stakingContractAddress,
      // abi du contrat
      abi: stakingContractAbi,
      // nom de la fonction dans le smart contract
      functionName: 'totalSupply',
      // qui appelle la fonction ?
      account: address
  });

  const { data: balanceGet, error: balanceError, isPending: balancePending, balanceRefetch } = useReadContract({
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

  const { data: allowanceGet, error: allowanceError, isPending: allowanceIsPending, allowanceRefetch } = useReadContract({
    // adresse du contrat
    address: struTokenAddress,
    // abi du contrat
    abi: struTokenAbi,
    // nom de la fonction dans le smart contract
    functionName: 'allowance',
    //arguments
    args : [struTokenAddress, stakingContractAddress],
    // qui appelle la fonction ?
    account: address
  });

  const { data: gainGet, error: gainError, isPending: gainPending, gainRefetch } = useReadContract({
    // adresse du contrat
    address: stakingContractAddress,
    // abi du contrat
    abi: stakingContractAbi,
    // nom de la fonction dans le smart contract
    functionName: 'gain',
    // qui appelle la fonction ?
    account: address
  });

      // Permet d'écrire dans un contrat (et donc de faire une transaction)
    // data renommé en hash : le hash de la transaction
    // error (non renommé) : il y a t-il une erreur ?
    // isPending renommé en setIsPending : est-on en train d'écrire dans le contrat ?
    // writeContract : on pourra appeler cette fonction pour ensuite vraiment écrire dans le contrat plus tard
        // augmenter allowance before staking
    const { data: approveStruGet, error: approveStruError, isPending: approveStruIsPending, writeContract: approveStru } = useWriteContract();
    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract();

    /* Lorsque l'utilisateur clique sur le bouton set on augmente l'allowance du contrat pour les
    const setStruApproveAmount = async() => {
        // alors on écrit vraiment dans le contrat intelligent (fonction store du contrat)
        approveStru({ 
            address: struTokenAddress, 
            abi: struTokenAbi,
            functionName: 'approve', 
            args: [stakingContractAddress, struTokenAddress,stakeAmount], 
            account : address
        }) 
    }*/
    
    // Lorsque l'utilisateur clique sur le bouton set
    const setTheAmount = async() => {
        // alors on écrit vraiment dans le contrat intelligent (fonction store du contrat)
        approveStru({ 
            address: struTokenAddress, 
            abi: struTokenAbi,
            functionName: 'approve', 
            args: [stakingContractAddress, struTokenAddress,stakeAmount], 
            account : struTokenAddress
        }) 
        writeContract({ 
            address: stakingContractAddress, 
            abi: stakingContractAbi,
            functionName: 'stake', 
            args: [address,stakeAmount], 
            account : address
        }) 
    }



    // Equivalent de transaction.wait() en ethersjs, on récupère si la transaction est en train d'être intégré dans un bloc (isConfirming) et si ça a marché au final (isConfirmed), il faut passer en paramètre le hash de la transaction (voir ci-dessus)
    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = 
    useWaitForTransactionReceipt({ 
        approveStruGet,
        hash,
    })

    const refetchEverything = async() => {
        await refetch();
        await getEvents();
    }

    useEffect(() => {
        if(isSuccess) {
            toast({
                title: "You stacked successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            refetchEverything();
        }
        if(errorConfirmation) {
            toast({
                title: errorConfirmation.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [isSuccess, errorConfirmation])

  // Récupère tous les events, pour cela getLogs de Viem est de loin le plus efficace
  const getEvents = async() => {
    // On récupère tous les events Staked
    const stakedLog = await publicClient.getLogs({
        address: stakingContractAddress,
        event: parseAbiItem('event Staked(address indexed user, uint256 amount)'),
        // du premier bloc
        fromBlock: 0n,
        // jusqu'au dernier
        toBlock: 'latest' // Pas besoin valeur par défaut
    })
    
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    setEvents(stakedLog.map(
        log => ({
            user: log.args.user.toString(),
            amount: log.args.amount.toString()
        })
    ))
}


  // Lorsque l'on a qqn qui est connecté, on fetch les events
  useEffect(() => {
    const getAllEvents = async() => {
        if(address !== 'undefined') {
            await getEvents();
        }
    }
    getAllEvents()
  }, [address])

  return (
    <>
      <Flex direction="column"width="100%">
        <Heading as='h4' size='md' mb="1rem">
            Total STRU supply
        </Heading>
        <Text>Staking contract address : {stakingContractAddress}</Text>
        <Text>STRU token address : {struTokenAddress}</Text>
        <Text>Caller address : {address}</Text>

        <Heading as='h4' size='md' mb="1rem" mt="1rem">
            Total staked amount for connected user :
        </Heading>
        <Flex>
            {/* Est ce qu'on est en train de récupérer le nombre ? */}
            {balancePending ? (
                <Spinner />
            ) : (
                <Text>STRU : {balanceGet?.toString()}</Text>
            )}
        </Flex>
        <Flex>
            {/* Est ce qu'on est en train de récupérer l'allowance ? */}
            {allowanceIsPending ? (
                <Spinner />
            ) : (
                <Text>Allowance for STRU contact : {allowanceGet?.toString()}</Text>
            )}
        </Flex>

        <Heading as='h4' size='md' mb="1rem" mt="1rem">
            Account stacking gain :
        </Heading>
        <Flex>
            {/* Est ce qu'on est en train de récupérer le nombre ? */}
            {gainPending ? (
                <Spinner />
            ) : (
                <Text>Gain : {gainGet?.toString()}</Text>
            )}
        </Flex>

        <Heading as='h4' size='md' mt="2rem" mb="1rem">
            Stake STRU
        </Heading>
        <Flex direction="column">
            {hash && 
                <Alert status='success' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Transaction Hash: {hash}
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
            {error && (
                <Alert status='error' mt="1rem" mb="1rem">
                    <AlertIcon />
                    Error: {(error).shortMessage || error.message}
                </Alert>
            )} 
        </Flex>
        <Flex>
            <Input placeholder='Amount to stake' onChange={(e) => setStakeAmount(e.target.value)} />
            <Button ml="1rem" disabled={setIsPending} onClick={setTheAmount}>{setIsPending ? 'Confirming...' : 'Stake'} </Button>
        </Flex>
        <Heading as='h4' size='md' mt="2rem" mb="2rem">
            Events
        </Heading>
        <Flex direction='column'>
            {/* Ici, il faut afficher la liste des events si on a des events. Il faut toujours avoir une clé unique au niveau des éléments d'un map dans reactjs, pour cela on peut utiliser aussi crypto.randomUUID() */}
            {events && events.map((event) => {
                return <Flex key={crypto.randomUUID()}>
                    User : {event.user} - Amount : {event.amount}
                </Flex>
            })}
        </Flex>

    </Flex>
    </>
  )
}

export default DefiStripAppli
