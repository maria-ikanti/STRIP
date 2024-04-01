"use client"
import { Flex, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Flex
        p="2rem"
        mt="10"
        justifyContent="center"
        alignItems="center"
    >
        <Text>All rights reserved &copy; Ikanti {new Date().getFullYear()}</Text>
    </Flex>
  )
}

export default Footer