
const hre = require("hardhat");


async function main() {

  const Stru = await hre.ethers.deployContract("Stru");
  

  const stru = await Stru.waitForDeployment();
  //stru.getAddress();
  console.log(
    `Stru deployed to ${Stru.target}`
  );

  const inAddr = Stru.target;
  const outAddr = Stru.target;

  const staking = await hre.ethers.deployContract("Staking", [inAddr, outAddr]);

  await staking.waitForDeployment();
  const stAddr = staking.target;

  console.log(
    `Staking deployed to ${stAddr}`
  );
  
  await stru.faucet(stAddr,1000);

  const balanceStr = await stru.balanceOf(stAddr);

  console.log(
    `Balance of  ${stAddr} is ${balanceStr.toString()}`
  );

  const testAddr = "0xAD784af0Eb9F29452A8B148A690aa8e23450e796";
  await staking.sendInitialAmount(testAddr,500);
  //await stru.approve("testAddr",500);
  //const gain = await staking.gain(inAddr);
  await staking.stake(testAddr,200);
  const balance = await stru.balanceOf(testAddr);


  console.log(
    `Balance for ${testAddr} is ${balance}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});