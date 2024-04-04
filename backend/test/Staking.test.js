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
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            await struContract.mint(addr1.address,10000);
            const strContractAddress = stakingContract.target;
            await struContract.mint(strContractAddress,10000);
            const allowanceAvant = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceAvant = ', allowanceAvant);
            await struContract.increaseAllow(addr1.address, strContractAddress, 10000);
            const allowanceApres = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceApres = ', allowanceApres);
            await stakingContract.setYeldDuration(60);
            await stakingContract.setYeldAmount(300);
        })

        it('should NOT stake if the amount is not > 0', async function() {
            await expect(
                stakingContract
                .connect(owner)
                .stake(0))
                .to.be.revertedWith(
                    'Amount to be staked must be > 0'
                )
        })

        it('should emit a Stake event after staking  successfully', async function() {
            await expect(
                stakingContract
                .connect(addr1)
                .stake(100))
                .to.emit(
                    stakingContract,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    100
                )
        })
    })

    describe('Testing withdraw function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            await struContract.mint(addr1.address,10000);
            const strContractAddress = stakingContract.target;
            await struContract.mint(strContractAddress,10000);
            const allowanceAvant = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceAvant = ', allowanceAvant);
            await struContract.increaseAllow(addr1.address, strContractAddress, 10000);
            const allowanceApres = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceApres = ', allowanceApres);
            await stakingContract.setYeldDuration(60);
            await stakingContract.setYeldAmount(300);
        })

        it('should NOT withdraw if the amount is not > 0', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .withdraw(0))
                .to.be.revertedWith(
                    'Must withraw a positive value'
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

        it('should emit a Withdrawn event after withdrawing  successfully', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .stake(100))
                .to.emit(
                    stakingContract,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    100
                )
                
            const tempBalance = await stakingContract.balanceOf(addr1.address);
            console.log('tempBalance ', tempBalance);

            await expect(
                stakingContract
                .connect(addr1)
                .withdraw(3))
                .to.emit(
                    stakingContract,
                    'Withdrawn',
                )
                .withArgs(
                    addr1.address,
                    3
                )
        })

    })

    describe('Testing claimYeld function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            await struContract.mint(addr1.address,10000);
            const strContractAddress = stakingContract.target;
            await struContract.mint(strContractAddress,10000);
            const allowanceAvant = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceAvant = ', allowanceAvant);
            await struContract.increaseAllow(addr1.address, strContractAddress, 10000);
            const allowanceApres = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceApres = ', allowanceApres);
            await stakingContract.setYeldDuration(60);
            await stakingContract.setYeldAmount(300);

            await expect(
                stakingContract
                .connect(addr1)
                .stake(100))
                .to.emit(
                    stakingContract,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    100
                )

            await expect(
                stakingContract
                .connect(addr1)
                .stake(100))
                .to.emit(
                    stakingContract,
                    'Staked',
                )
                .withArgs(
                    addr1.address,
                    100
                )
        })

        it('should NOT return yelds if the amount is not > 0', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .claimYeld())
                .to.be.revertedWith(
                    'You have no yelds'
                )
        })

        it('should emit a YeldPaid event after paying the yelds  successfully', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .claimYeld())
                .to.emit(
                    stakingContract,
                    'YeldPaid',
                )
                .withArgs(
                    addr1.address,
                    10
                )
        })

    })


    describe('Testing setYeldDuration function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            await struContract.mint(addr1.address,10000);
            const strContractAddress = stakingContract.target;
            await struContract.mint(strContractAddress,10000);
            const allowanceAvant = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceAvant = ', allowanceAvant);
            await struContract.increaseAllow(addr1.address, strContractAddress, 10000);
            const allowanceApres = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceApres = ', allowanceApres);
            await stakingContract.setYeldDuration(60);
            await stakingContract.setYeldAmount(300);
        })

        it('Should emit a YeldDurationUpdated event after updating the yeld duration successfully ', async function() {
            
            await expect(
                stakingContract
                .connect(owner)
                .setYeldDuration(60))
                .to.emit(
                    stakingContract,
                    'YeldDurationUpdated',
                )
                .withArgs(
                    60
                ) 
        })

    })

    describe('Testing setYeldAmount function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
            await struContract.mint(addr1.address,10000);
            const strContractAddress = stakingContract.target;
            await struContract.mint(strContractAddress,10000);
            const allowanceAvant = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceAvant = ', allowanceAvant);
            await struContract.increaseAllow(addr1.address, strContractAddress, 10000);
            const allowanceApres = await struContract.allowance(addr1.address, strContractAddress);
            console.log('allowanceApres = ', allowanceApres);
            await stakingContract.setYeldDuration(60);
            //await stakingContract.setYeldAmount(300);
        })

        it('should revert setYeldAmount if not the owner', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .setYeldAmount(300))
                .to.be.revertedWithCustomError(
                    stakingContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })

        it('should test the if branch of setYeldAmount', async function() {

            await stakingContract.setYeldAmount(300);

            await expect(
                stakingContract
                .connect(owner)
                .setYeldAmount(300))
                .to.emit(
                    stakingContract,
                    'YeldAdded',
                )
                .withArgs(
                    300
                )
        })

        it('should test the if branch of setYeldAmount', async function() {

            await expect(
                stakingContract
                .connect(owner)
                .setYeldAmount(30000))
                .to.be.revertedWith(
                    'Provided amount too high'
                )
        })

        it('should test the else branch of setYeldAmount', async function() {

            await stakingContract.setYeldAmount(300);

            await expect(
                stakingContract
                .connect(owner)
                .setYeldAmount(300))
                .to.emit(
                    stakingContract,
                    'YeldAdded',
                )
                .withArgs(
                    300
                )
        })
    })

    describe('Testing totalSupply function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
        })

        it('should test the if branch of setYeldAmount', async function() {

            await expect(
                stakingContract
                .connect(owner)
                .totalSupply())
                .not.to.be.reverted
        })
    })

    describe('Testing balanceOfStrp function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
        })

        it('should test the if branch of setYeldAmount', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .balanceOfStrp())
                .not.to.be.reverted
        })
    })

    describe('Testing balanceOfStry function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
        })

        it('should test the if branch of setYeldAmount', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .balanceOfStry())
                .not.to.be.reverted
        })
    })

    describe('Testing getYeldForDuration function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
        })

        it('should test the if branch of setYeldAmount', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .getYeldForDuration())
                .not.to.be.reverted
        })
    })

    describe('Testing setYeldDuration function', function() {
        beforeEach(async function() {
            [owner, addr1, addr2, addr3] = await ethers.getSigners();
            let struCont = await ethers.getContractFactory('STRU');
            struContract = await struCont.deploy();
            let contract = await ethers.getContractFactory('Staking',[struContract.target, struContract.target]);
            console.log(struContract.target);
            stakingContract = await contract.deploy(struContract.target, struContract.target);
        })

        it('should revert if not the owner', async function() {

            await expect(
                stakingContract
                .connect(addr1)
                .setYeldDuration(30))
                .to.be.revertedWithCustomError(
                    stakingContract,
                    "OwnableUnauthorizedAccount"
                ).withArgs(
                    addr1.address
                )
        })
    })
})