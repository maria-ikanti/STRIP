const hre = require("hardhat");

async function main() {

  const Stru = await hre.ethers.deployContract("STRU");
  const stru = await Stru.waitForDeployment();

  const yeldsTokenAddr = Stru.target;
  const stakingTokenAddr = Stru.target;

  console.log(`STRU deployed to ${stakingTokenAddr}`);

  const staking = await hre.ethers.deployContract("Staking", [yeldsTokenAddr, stakingTokenAddr]);
  const str = await staking.waitForDeployment();
  const stAddr = staking.target;

  console.log(`Staking deployed to ${staking.target}`);
  
  const testAddr = "0xBcd4042DE499D14e55001CcbB24a551F3b954096";
  await stru.mint(testAddr,10000);
  await stru.mint(stAddr,10000);

  const balanceStr = await stru.balanceOf(testAddr);

  console.log(`Balance of  ${testAddr} is ${balanceStr.toString()}`);
  
  await stru.increaseAllow(testAddr, stAddr, 10000);
  await stru.increaseAllow(stAddr, testAddr, 10000);

  await staking.setYeldDuration(300);
  await staking.setYeldAmount(600); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});