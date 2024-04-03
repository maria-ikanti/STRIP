const hre = require("hardhat");


async function main() {

  const Stru = await hre.ethers.deployContract("STRU");
  
  const stru = await Stru.waitForDeployment();

  /*const Strp = await hre.ethers.deployContract("STRP");
  
  const strup = await Strp.waitForDeployment();

  const Stry = await hre.ethers.deployContract("STRY");
  
  const stry = await Stry.waitForDeployment();*/

  const yeldsTokenAddr = Stru.target;
  const stakingTokenAddr = Stru.target;
  //const strpTokenAddr = Strp.target;
  //const stryTokenAddr = Stry.target;

  console.log(
    `STRU deployed to ${stakingTokenAddr}`
  );

  /*console.log(
    `STRP deployed to ${strpTokenAddr}`
  );

  console.log(
    `STRY deployed to ${stryTokenAddr}`
  );*/


  //const staking = await hre.ethers.deployContract("Staking", [yeldsTokenAddr, stakingTokenAddr, strpTokenAddr, stryTokenAddr]);
  const staking = await hre.ethers.deployContract("Staking", [yeldsTokenAddr, stakingTokenAddr]);

  await staking.waitForDeployment();
  const stAddr = staking.target;

  console.log(
    `Staking deployed to ${staking.target}`
  );
  
  const testAddr = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
  await stru.mint(testAddr,10000);
  await stru.mint(stAddr,10000);

  const balanceStr = await stru.balanceOf(testAddr);


  console.log(
    `Balance of  ${testAddr} is ${balanceStr.toString()}`
  );
  

  await stru.increaseAllow(testAddr, stAddr, 10000);
  await stru.increaseAllow(stAddr, testAddr, 10000);

  const allowanceStr = await stru.allowance(testAddr, stAddr);

  await staking.setYeldDuration(300);
  await staking.setYeldAmount(600); // 


  const yeldForDuration = await staking.getYeldForDuration();

  console.log(
    `getYeldForDuration is  ${yeldForDuration.toString()}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});