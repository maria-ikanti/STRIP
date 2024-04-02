// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract STRU is ERC20, Ownable {

	event Minted(address receiver, uint256 amount); 
	event Allowed(address receiver, uint256 amount); 

	uint public price;
	//uint decimals;
	//uint mult_dec;
	

    constructor() ERC20('Faucet STRU staked token', 'STRU') Ownable(msg.sender){
		/*price = 100000000000000000; //price in wei 1 Token = 0.1ETH
        decimals = 18;
        mult_dec = 10**decimals;*/
	} 
 
	/**
	@notice Mint Faucet
	@param _recipient receiver address
	@param _amount to be minted
	 */
	function mint(address _recipient, uint _amount) external onlyOwner{
		require(_amount>0, "You must enter a positif ammount");
		_mint(_recipient, _amount);
		emit Minted(_recipient, _amount);
	}

	/**
	@notice Increase allowance Faucet
	@param _recipient receiver address
	@param _amount to be allowed
	 */
    function increaseAllow(address _sender, address _recipient, uint _amount) external onlyOwner{
		require(_amount>0, "You must enter a positif ammount");
		_approve(_sender, _recipient, _amount);
		emit Allowed(_recipient, _amount);
	}

	/** @notice Recevie implementation for security reasons */
	receive() external payable {}
	/** @notice Fallback implementation for security reasons */
	fallback() external payable {}
}