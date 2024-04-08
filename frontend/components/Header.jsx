import { Flex, Button, ChevronDownIcon, Image } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import HeaderMenu from './Menu.jsx'

const Header = () => {
  return (
    <>
     <Flex 
        position="sticky"
        width="98%"
        top="30"
        zIndex="docked" // Assure que le header reste au-dessus du contenu lors du scroll
        justifyContent="space-between"
        alignItems="center"
        p="2rem"
        height="5rem" // Hauteur ajustée du header
        >
        <Image src='logo.png' alt='Strip project' boxSize='120px' mb='2rem' mt='2rem'/>
        <HeaderMenu/>
        <ConnectButton label="Please connect" />
      </Flex>
      
    </>

  )
}

export default Header