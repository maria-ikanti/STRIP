// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./STRP.sol";
import "./STRY.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Strip is ReentrancyGuard, Ownable {

    constructor() Ownable(msg.sender) {
    }

    function strip(address _address, uint _amount) external nonReentrant {
            STRP strp = new STRP();
           // strp.mintp(_address, _amount);
          //  STRY stry = new STRY();
           // stry.mint(_address, _amount);
    }

}