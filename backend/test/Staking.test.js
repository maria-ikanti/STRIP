const { ethers } = require('hardhat');
const { expect, assert } = require('chai');

describe('Test Staking Contract', function() {
    let stakingContract;
    let struContract;
    let owner, addr1, addr2, addr3;

    describe('Initialisation', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target, 3, 2]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target, 3, 2);
        })

       it('should deploy the smart contract', async function() {
            let theStakingInstance = await stakingContract.owner();
            assert.equal(owner.address, theStakingInstance);
        })
    })

    describe('Testing stake function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            const signer = await ethers.provider.getSigner();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target, 3, 2], signer);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target, 3, 2);
            stakeContr = await stakingContract.waitForDeployment();
            console.log(stakingContract.target);
            console.log(stakeContr.target);
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            const allow = await struContract.allowance(addr1.address,stakingContract.target);
            console.log(allow);
        })

       /* it('should NOT stake if the amount is not > 0', async function() {
            
            await expect(
                stakeContr
                .connect(addr2.address)
                .stake(addr1.address, 0))
                .to.be.revertedWith(
                    'Amount to be staked must be > 0'
                )
        })*/

        it('should emit a Stake event after staking  successfully', async function() {

            await expect(
                stakeContr
                .connect(owner)
                .stake(addr1.address, 1000))
                .to.emit(
                    stakeContr,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    1000
                )
        })

  /*      it('should mint is the amount 100 STRP', async function() {
            
            await expect(
                strpContract
                .connect(owner)
                .mint(addr3.address, 0))
                .to.be.revertedWith(
                    'You must enter a positif ammount'
                )
        })

        it('should emit a Minted event after minting  successfully', async function() {

            await expect(
                strpContract
                .connect(owner)
                .mint(addr2.address, 1000))
                .to.emit(
                    strpContract,
                    'Minted',
                )
                .withArgs(
                    addr2.address,
                    1000
                )
        })*/

    })



})