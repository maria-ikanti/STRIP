// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract STRY is ERC20 {

    constructor() ERC20('STRIP Yeld token', 'STRY') {} 
 
	// fonction faucet pour créer des Dai tokens
	function minty(address recipient, uint amount) external {
		_mint(recipient, amount);
	}

}