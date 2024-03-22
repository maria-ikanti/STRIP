// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract StripProtocol  {

    IERC20 aave;
    IERC20 strp;
    IERC20 stry;


    constructor(address investorAddress) {

        aave = IERC20(investorAddress);

    } 

    function foo(address recipient, uint amount) external {

        aave.transfer(recipient, amount);

    }

}