// On utilise useState ou useEffect ou ChakraUI, donc on met un use client.
'use client'

import { useEffect, useState } from 'react'; 
// On importe les données du contrat
import { contractAddress, contractAbi } from '@/constants'

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
  const [stakAmount, setStakAmount] = useState(null);
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
      address: contractAddress,
      // abi du contrat
      abi: contractAbi,
      // nom de la fonction dans le smart contract
      functionName: 'totalSupply',
      // qui appelle la fonction ?
      account: address
  });

      // Permet d'écrire dans un contrat (et donc de faire une transaction)
    // data renommé en hash : le hash de la transaction
    // error (non renommé) : il y a t-il une erreur ?
    // isPending renommé en setIsPending : est-on en train d'écrire dans le contrat ?
    // writeContract : on pourra appeler cette fonction pour ensuite vraiment écrire dans le contrat plus tard
    const { data: hash, error, isPending: setIsPending, writeContract } = useWriteContract();

    // Lorsque l'utilisateur clique sur le bouton set
    const setTheAmount = async() => {
        // alors on écrit vraiment dans le contrat intelligent (fonction store du contrat)
        writeContract({ 
            address: contractAddress, 
            abi: contractAbi,
            functionName: 'stack', 
            args: [stakAmount], 
            account : address
        }) 
    }

    // Equivalent de transaction.wait() en ethersjs, on récupère si la transaction est en train d'être intégré dans un bloc (isConfirming) et si ça a marché au final (isConfirmed), il faut passer en paramètre le hash de la transaction (voir ci-dessus)
    const { isLoading: isConfirming, isSuccess, error: errorConfirmation } = 
    useWaitForTransactionReceipt({ 
        hash,
    })

    const refetchEverything = async() => {
        await refetch();
        await getEvents();
    }

    useEffect(() => {
        if(isSuccess) {
            toast({
                title: "Vous avez stacké",
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
        address: contractAddress,
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
            Total supply
        </Heading>
        <Text>Contract address : {contractAddress}</Text>
        <Text>Caller address : {address}</Text>
        <Flex>
            {/* Est ce qu'on est en train de récupérer le nombre ? */}
            {getIsPending ? (
                <Spinner />
            ) : (
                <Text>Result : {supplyGet?.toString()}</Text>
            )}
        </Flex>

        <Heading as='h4' size='md' mt="2rem" mb="1rem">
            Set
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
            <Input placeholder='Amount to stak' onChange={(e) => setStakAmount(e.target.value)} />
            <Button disabled={setIsPending} onClick={setTheAmount}>{setIsPending ? 'Confirming...' : 'Set'} </Button>
        </Flex>

    </Flex>
    <Flex>
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
