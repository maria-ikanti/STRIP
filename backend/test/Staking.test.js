const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test Staking Contract', function() {
    let stakingContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Staking',["0x7a2088a1bFc9d81c55368AE168C2C02570cB814F", "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F", 3, 2]);
            stakingContract = await contract.deploy();
        })

        it('should deploy the smart contract', async function() {
            let theStakingInstance = await stakingContract.owner();
            assert.equal(owner.address, theStakingInstance);
        })
    })

})