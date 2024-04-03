import { Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react'

const HeaderMenu = () => {
  return (
    <> 
       <Menu backgroundColor="#CBC49B">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} mr="3rem" width="15rem" backgroundColor="#CBC49B" alignSelf="end">
                    Menu
            </MenuButton>
            <MenuList>
                <MenuItem as='a' href='/mint'>Mint STRU</MenuItem>
                <MenuItem as='a' href='/stake'>Deposit</MenuItem>
                <MenuItem as='a' href='/claim'>Claim rewards</MenuItem>
                <MenuItem as='a' href='/withdraw'>Withdraw</MenuItem>
            </MenuList>
        </Menu>
    </>
  )
}
 
export default HeaderMenu
