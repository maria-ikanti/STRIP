// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract SRTU is ERC20 {

    constructor() ERC20('Faucet STRU staked token', 'STRU') {} 
 
	// fonction faucet pour créer des Dai tokens
	function faucet(address recipient, uint amount) external {
		_mint(recipient, amount);
	}

    /*function setReward(uint _newReward) external onlyOwner {
        reward = _newReward;
    }*/



}