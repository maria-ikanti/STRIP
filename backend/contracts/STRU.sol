// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract Stru is ERC20 {

    constructor() ERC20('Faucet STRU staked token', 'STRU'){} 
 
	// fonction mint pour créer des STRU tokens
	function mint(address _recipient, uint _amount) external {
		require(_amount>0, "You must enter a positif ammount");
		_mint(_recipient, _amount);
	}

    function increaseAllow(address owner, address recipient, uint amount) external {
		_approve(owner, recipient, amount);
	}

    /*function setReward(uint _newReward) external onlyOwner {
        reward = _newReward;
    }*/



}