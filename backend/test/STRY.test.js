const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test STRY Contract', function() {
    let stryContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRY');
            stryContract = await contract.deploy();
        })

        it('should deploy the smart contract', async function() {
            let theStryInstance = await stryContract.owner();
            assert.equal(owner.address, theStryInstance);
        })
    })


    describe('Testing mint function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRY');
            stryContract = await contract.deploy();
        })

        it('should NOT mint in STRY smart contract if NOT the owner', async function() {
            console.log("Calls the mint function  with " + addr1.address + " to add 100 STRY  to " + addr2.address);
            
            await expect(
                stryContract
                .connect(addr1)
                .minty(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    stryContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                stryContract
                .connect(owner)
                .minty(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should mint is the amount 100 STRY', async function() {
            
            await expect(
                stryContract
                .connect(owner)
                .minty(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit a Minted event after minting  successfully', async function() {

            await expect(
                stryContract
                .connect(owner)
                .minty(addr2.address, 1000))
                .to.emit(
                    stryContract,
                    'Minted',
                )
                .withArgs(
                    addr2.address,
                    1000
                )
        })

    })

    describe('Testing increaseAllow function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRY');
            stryContract = await contract.deploy();
        })

        it('should NOT increase allowance in STRY smart contract if NOT the owner', async function() {
            console.log("Calls the increaseAllow function  with " + addr1.address + " to add 100 STRY  to " + addr2.address);
            
            await expect(
                stryContract
                .connect(addr1)
                .increaseAllow(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    stryContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                stryContract
                .connect(owner)
                .increaseAllow(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit ab Allowed event after minting  successfully', async function() {

            await expect(
                stryContract
                .connect(owner)
                .increaseAllow(addr2.address, 1000))
                .to.emit(
                    stryContract,
                    'Allowed',
                )
                .withArgs(
                    addr2.address,
                    1000
                )
        })
    })

    describe('Testing burn function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRY');
            stryContract = await contract.deploy();
            await stryContract.minty(addr3.address, 50);
            await console.log(stryContract.balanceOf(addr3.addres));
        })

        it('should NOT burn in STRY smart contract if NOT the owner', async function() {
            console.log("Calls the mint function  with " + addr1.address + " to add 100 STRY  to " + addr2.address);
            
            await expect(
                stryContract
                .connect(addr1)
                .burny(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    stryContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT burn is the amount is not > 0', async function() {
            
            await expect(
                stryContract
                .connect(owner)
                .burny(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should burn  the amount 10 STRY', async function() {
            
            await expect(
                stryContract
                .connect(owner)
                .burny(addr3.address, 1000))
                .to.be.revertedWith(
                    "You can't burn more than you have."
                )
        })

        it('should emit a Burned event after burning  successfully', async function() {

            await expect(
                stryContract
                .connect(owner)
                .burny(addr3.address, 10))
                .to.emit(
                    stryContract,
                    'Burned',
                )
                .withArgs(
                    addr3.address,
                    10
                )
        })

    })

})