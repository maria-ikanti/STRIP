const hre = require("hardhat");


async function main() {

  const Stru = await hre.ethers.deployContract("STRU");
  
  const stru = await Stru.waitForDeployment();

  const Strp = await hre.ethers.deployContract("STRP");
  
  const strup = await Strp.waitForDeployment();

  const Stry = await hre.ethers.deployContract("STRY");
  
  const stry = await Stry.waitForDeployment();

  const yeldsTokenAddr = Stru.target;
  const stakingTokenAddr = Stru.target;
  const strpTokenAddr = Strp.target;
  const stryTokenAddr = Stry.target;

  console.log(
    `STRU deployed to ${stakingTokenAddr}`
  );

  console.log(
    `STRP deployed to ${strpTokenAddr}`
  );

  console.log(
    `STRY deployed to ${stryTokenAddr}`
  );


  const staking = await hre.ethers.deployContract("Staking", [yeldsTokenAddr, stakingTokenAddr, strpTokenAddr, stryTokenAddr]);

  await staking.waitForDeployment();
  const stAddr = staking.target;

  console.log(
    `Staking deployed to ${staking.target}`
  );

  const yeldForDuration = await staking.getYeldForDuration();

  console.log(
    `getYeldForDuration is  ${yeldForDuration.toString()}`
  );
  
  const testAddr = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
  await stru.mint(testAddr,1000);
  await stru.mint(stAddr,5000);

  const balanceStr = await stru.balanceOf(testAddr);


  console.log(
    `Balance of  ${testAddr} is ${balanceStr.toString()}`
  );
  

  await stru.increaseAllow(testAddr, stAddr, 1000);
  await stru.increaseAllow(stAddr, testAddr, 1000);

  const allowanceStr = await stru.allowance(testAddr, stAddr);
  
  console.log(
    `Allowance of  ${stAddr} for the token ${stru} is ${allowanceStr.toString()}`
  );
  staking.setYeldDuration(30);
  staking.notifyYeldAmount(5);
  //await staking.sendInitialAmount(testAddr,50);
  
  //await staking.stake(testAddr, 200);
  const balanceTest = await stru.balanceOf(testAddr);
  //const yeldPerToken = await staking.yeldPerToken();
  //const totalSupply = await staking.totalSupply();
  //await staking.setYeldDuration(500);
  

  /*console.log(
    `Balance of  ${testAddr} is ${balanceTest.toString()}`
  );

  const newBalanceStr = await stru.balanceOf(stAddr);

  console.log(
    `Balance of  ${stAddr} is ${newBalanceStr.toString()}`
  );

  /*console.log(
    `yeldPerToken  is ${yeldPerToken}`
  );

  console.log(
    `totalSupply  is ${totalSupply}`
  );*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});