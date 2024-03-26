// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './STRY.sol';

contract StripPoolInstance  {

    IERC20 underlyingToken;
    IERC20 strp;
    IERC20 stry;

    address public underlyingTokenId;
    uint public maturity;
    uint public amountDposited;

    event Deposit(uint amount);
    event CollectYeld();
    event Redeem(address underlyingTokenId);

    constructor(address investorAddress) {

        underlyingToken = IERC20(investorAddress);
        stry = IERC20(investorAddress);

    } 

    function foo(address recipient, uint amount) external {

        underlyingToken.transfer(recipient, amount);

    }

    function deposit(uint amount) external {
        // Control / gestion erreur : token sous-jacent = token du pool, sinon annulation du dépôt 
        // Récupérer information sur rendement du token sous-jacent pour l'appliquer au furut STRY
        // Mint STRP
        stry = IERC20(msg.sender);
        emitStry(msg.sender,amount);
        // Mint SRTY

        //stry.emitStry(msg.sender, amount);
        // Emit a deposit event
        emit Deposit(amount);
    }

    function claim() external {
        /**
        si type = sous-jacent : montant à distribuer = montant token - deposited(ou total principal); sinon montant à distribuer = montant token. i.e. si le token verse des intérêt en se multipliant, on garde le principal. s’il verse des intérêt d’une autre nature, on distribue tout. Exemple : realT verse des USDT, stETH des stETH
        si montant à distribuer < 0 : next token
        pour chaque hoder de yield token (trésorier)
        du= montant à distribuer * nombre de token yield détenus par le trésorier / nombre total yield
        transfert du * token à tresorier
         */
        if(block.timestamp > maturity){
            redeem();
        }
    }

    function redeem() internal {
        emit Redeem(underlyingTokenId);
    }

    function emitStry(address recipient, uint amount) internal {
		//stry._mint(recipient, amount);
	}


}