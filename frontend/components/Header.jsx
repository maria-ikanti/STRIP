"use client"
import { Flex, Text, Box, Image } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Header = () => {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" p="2rem">
          <Image src='logo.png' alt='Strip project' boxSize='120px'/>
          <ConnectButton/>
      </Flex>
    </>
  )
}

export default Header