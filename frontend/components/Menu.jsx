import { Button } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

const HeaderMenu = () => {
  return (
    <> 
       <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Menu
            </MenuButton>
            <MenuList>
                <MenuItem as='a' href='/mint'>Mint</MenuItem>
                <MenuItem as='a' href='/stake'>Deposit</MenuItem>
                <MenuItem as='a' href='/claim'>Claim rewards</MenuItem>
                <MenuItem as='a' href='/withdraw'>Withdraw</MenuItem>
            </MenuList>
        </Menu>
    </>
  )
}
 
export default HeaderMenu
