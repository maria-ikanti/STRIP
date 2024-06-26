const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test STRU Contract', function() {
    let struContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRU');
            struContract = await contract.deploy();
        })

        it('should deploy the smart contract', async function() {
            let theStruInstance = await struContract.owner();
            assert.equal(owner.address, theStruInstance);
        })
    })


    describe('Testing mint function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRU');
            struContract = await contract.deploy();
        })

        it('should NOT mint in STRU smart contract if NOT the owner', async function() {
            console.log("Calls the mint function  with " + addr1.address + " to add 100 STRU  to " + addr2.address);
            
            await expect(
                struContract
                .connect(addr1)
                .mint(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    struContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                struContract
                .connect(owner)
                .mint(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should mint is the amount 100 SRTU', async function() {
            
            await expect(
                struContract
                .connect(owner)
                .mint(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit a Minted event after minting  successfully', async function() {

            await expect(
                struContract
                .connect(owner)
                .mint(addr2.address, 1000))
                .to.emit(
                    struContract,
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
            let contract = await ethers.getContractFactory('STRU');
            struContract = await contract.deploy();
            const mint = await struContract.mint(addr1.address, 2000);
            
        })

        it('should NOT increase allowance in STRU smart contract if NOT the owner', async function() {
            console.log("Calls the increaseAllow function  with " + addr1.address + " to add 100 STRU  to " + addr2.address);
            
            await expect(
                struContract
                .connect(addr1)
                .increaseAllow(addr2.address, addr1.address, 100))
                .to.be.revertedWithCustomError(
                    struContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                struContract
                .connect(owner)
                .increaseAllow(addr2.address, addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit ab Allowed event after minting  successfully', async function() {

            await expect(
                struContract
                .connect(owner)
                .increaseAllow(addr1.address, addr2.address, 1000))
                .to.emit(
                    struContract,
                    'Allowed',
                )
                .withArgs(
                    addr2.address,
                    1000
                )
        })
    })

})