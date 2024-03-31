const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test STRU Contract', function() {
    let struContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('Stru');
            struContract = await contract.deploy();
        })

        it('should deploy the smart contract', async function() {
            let theStruInstance = await struContract.owner();
            assert.equal(owner.address, theStruInstance);
        })
    })

})