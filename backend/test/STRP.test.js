const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test STRP Contract', function() {
    let strpContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRP');
            strpContract = await contract.deploy();
        })

        it('should deploy the smart contract', async function() {
            let theStrpInstance = await strpContract.owner();
            assert.equal(owner.address, theStrpInstance);
        })
    })


    describe('Testing mint function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let contract = await ethers.getContractFactory('STRP');
            stryContract = await contract.deploy();
        })

        it('should NOT mint in STRP smart contract if NOT the owner', async function() {
            console.log("Calls the mint function  with " + addr1.address + " to add 100 STRP  to " + addr2.address);
            
            await expect(
                strpContract
                .connect(addr1)
                .mintp(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    strpContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .mintp(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should mint is the amount 100 STRP', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .mintp(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit a Minted event after minting  successfully', async function() {

            await expect(
                strpContract
                .connect(owner)
                .mintp(addr2.address, 1000))
                .to.emit(
                    strpContract,
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
            let contract = await ethers.getContractFactory('STRP');
            strpContract = await contract.deploy();
        })

        it('should NOT increase allowance in STRP smart contract if NOT the owner', async function() {
            console.log("Calls the increaseAllow function  with " + addr1.address + " to add 100 STRP  to " + addr2.address);
            
            await expect(
                strpContract
                .connect(addr1)
                .increaseAllow(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    strpContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT mint is the amount is not > 0', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .increaseAllow(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit ab Allowed event after minting  successfully', async function() {

            await expect(
                strpContract
                .connect(owner)
                .increaseAllow(addr2.address, 1000))
                .to.emit(
                    strpContract,
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
            let contract = await ethers.getContractFactory('STRP');
            strpContract = await contract.deploy();
            await strpContract.mintp(addr3.address, 50);
            //await console.log(stryContract.balanceOf(addr3.addres));
        })

        it('should NOT burn in STRP smart contract if NOT the owner', async function() {
            //console.log("Calls the mint function  with " + addr1.address + " to add 100 STRP  to " + addr2.address);
            
            await expect(
                strpContract
                .connect(addr1)
                .burnp(addr2.address, 100))
                .to.be.revertedWithCustomError(
                    strpContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should NOT burn is the amount is not > 0', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .burnp(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should burn  the amount 10 STRP', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .burnp(addr3.address, 1000))
                .to.be.revertedWith(
                    "You can't burn more than you have."
                )
        })

        it('should emit a Burned event after burning  successfully', async function() {

            await expect(
                strpContract
                .connect(owner)
                .burnp(addr3.address, 10))
                .to.emit(
                    strpContract,
                    'Burned',
                )
                .withArgs(
                    addr3.address,
                    10
                )
        })

    })

})