// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract STRP is ERC20 {

    constructor() ERC20('STRIP Principal token', 'STRP') {} 
 
	// fonction faucet pour créer des Dai tokens
	function mintp(address recipient, uint amount) external {
		_mint(recipient, amount);
	}

}