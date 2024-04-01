"use client"
import { Flex, Text, Box, Image } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <>
      <Flex justifyContent="center" direction="column" alignItems="center" p="2rem">
          <Image src='logo.png' alt='Strip project' boxSize='150px' mb='2rem'/>
          <ConnectButton label="Sign in"/>
      </Flex>


    </>
  )
}

export default Header