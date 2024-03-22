// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract AAVE is ERC20 {

    constructor() ERC20('Faucet AAVE staked token', 'AAVE') {} 
 
	// fonction faucet pour créer des Dai tokens
	function faucet(address recipient, uint amount) external {
		_mint(recipient, amount);
	}

}