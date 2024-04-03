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
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            const today = new Date();
            const durationToSet=today.getTime()+60; // one minute
            const duration = await stakingContract.setYeldDuration(durationToSet);
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
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target], signer);
            //console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            stakeContr = await stakingContract.waitForDeployment();
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            const allow = await struContract.allowance(addr1.address,stakingContract.target);
            const today = new Date();
            const durationToSet=today.getTime()+60; // one minute
            const duration = await stakingContract.setYeldDuration(durationToSet);
            console.log(duration);
        })

        it('should NOT stake if the amount is not > 0', async function() {
            
            await expect(
                stakeContr
                .connect(owner)
                .stake(0))
                .to.be.revertedWith(
                    'Amount to be staked must be > 0'
                )
        })

       /* it('should emit a Stake event after staking  successfully', async function() {

            await expect(
                stakeContr
                .connect(addr1.address)
                .stake(1000))
                .to.emit(
                    stakeContr,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    1000
                )
        })*/

    })

   /* describe('Testing withdraw function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target], owner);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(owner, stakingContract.target, 1000);
            const allow = await struContract.allowance(owner,stakingContract.target);
            await stakingContract.stake(500);
            const today = new Date();
            const durationToSet=today.getTime()+60; // one minute
            const duration = await stakingContract.setYeldDuration(durationToSet);
        })

        it('should NOT withdraw if the amount is not > 0', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .withdraw(0))
                .to.be.revertedWith(
                    'Must withrow a positive value'
                )
        })


        it('should NOT withdraw if the amount is not > 0', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .withdraw(5000))
                .to.be.revertedWith(
                    "You don't have enough tokens"
                )
        })

      /*  it('should emit a Withdrawn event after withdrawing  successfully', async function() {

            await expect(
                stakingContract
                .connect(addr1.address)
                .withdraw(3))
                .to.emit(
                    stakingContract,
                    'Withdrawn',
                )
                .withArgs(
                    owner,
                    3
                )
        })

    })*/

    describe('Testing claimYeld function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target], addr1);
            //console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            stakeContr = await stakingContract.waitForDeployment();
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            const allow = await struContract.allowance(addr1.address,stakingContract.target);
            const today = new Date();
            const durationToSet=today.getTime()+60; // one minute

            const duration = await expect(
                stakeContr
                .connect(owner)
                .setYeldDuration(durationToSet))
                .to.emit(
                    stakeContr,
                    'YeldDurationUpdated',
                )
                .withArgs(
                    durationToSet
                ) 
            //const duration = 0; stakeContr.setYeldDuration(durationToSet);
            console.log(durationToSet);
        })

       /*  it('should NOT return yelds if the amount is not > 0', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .claimYeld())
                .to.be.revertedWith(
                    'You have no yelds'
                )
        })*/

      /*  it('should emit a Stake event after staking  successfully', async function() {

            await expect(
                stakeContr
                .connect(owner)
                .claimYeld())
                .to.emit(
                    stakeContr,
                    'YeldPaid',
                )
                .withArgs(
                    addr1.address,
                    2
                )
        })*/

    })

    describe('Testing earned function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target], addr1);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            stakeContr = await stakingContract.waitForDeployment();
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            const allow = await struContract.allowance(addr1.address,stakingContract.target);
        })

        it('should return an error if the amount is = 0', async function() {
            
          /*  await expect(
                stakingContract
                .connect(owner)
                .earned(addr1.address))
                .to.be.revertedWith(
                    'You  have no gain'
                )*/
        })



      /*  it('to be defined', async function() {

            const earnedAmount = await expect(
                stakeContr
                .connect(owner)
                .earned(addr1.address));

            console.log(earnedAmount);
                
        })*/
        

    })

    describe('Testing exit function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target], addr1);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            stakeContr = await stakingContract.waitForDeployment();
            const mint = await struContract.mint(addr1.address, 2000);
            await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            const allow = await struContract.allowance(addr1.address,stakingContract.target);
        })

        it('should return an error if the amount is = 0', async function() {
            
          /*  await expect(
                stakingContract
                .connect(owner)
                .earned(addr1.address))
                .to.be.revertedWith(
                    'You  have no gain'
                )*/
        })



     /*   it('should shoud exit sucessfully', async function() {

            await expect(
                stakeContr
                .connect(owner)
                .exit())
                .to.emit(
                    stakeContr,
                    'Exit',
                )
                .withArgs(
                    owner,
                    100
                )
        })*/
        

    })

   /* describe('Testing setYeldDuration function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target, 3, 2], addr1);
            //console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target, 3, 2);
            stakeContr = await stakingContract.waitForDeployment();
            //const mint = await struContract.mint(addr1.address, 2000);
            //await struContract.increaseAllow(addr1.address, stakingContract.target, 1000);
            //const allow = await struContract.allowance(addr1.address,stakingContract.target);

            
        })

        it('Should revert if  block.timestamp > periodFinish', async function() {
            
            const today = new Date();
            //const durationToSet=today.getTime()+60; // one minute

            const duration = await expect(
                stakeContr
                .connect(owner)
                .setYeldDuration(1711911457046))
                .to.be.revertedWith(
                    'Previous yeld period must be complete before changing the duration for the new period'
                )
            //const duration = 0; stakeContr.setYeldDuration(durationToSet);
            //console.log(durationToSet);
        })

        it('Should emit a YeldDurationUpdated event after updating the yeld duration successfully ', async function() {

            const today = new Date();
            const durationToSet=today.getTime()+60; // one minute
            
            const duration = await expect(
                stakeContr
                .connect(owner)
                .setYeldDuration(1711911785327))
                .to.emit(
                    stakeContr,
                    'YeldDurationUpdated',
                )
                .withArgs(
                    durationToSet
                ) 
            //const duration = 0; stakeContr.setYeldDuration(durationToSet);
            console.log(durationToSet);
        })

    })*/


})