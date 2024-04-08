"use client"
import Header from './Header'
import Footer from './Footer'
import HeaderMenu from './Menu.jsx'
import { Flex } from '@chakra-ui/react'

const Layout = ({ children }) => {
  return (
    <Flex bgGradient='linear(to-b, #26526A, #4A9DFF)'
      direction="column"
      minH="100vh"
      justifyContent="left"
    >
        <Header />

            {children}
    </Flex>
  )
}

export default Layout