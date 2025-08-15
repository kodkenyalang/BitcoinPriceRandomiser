// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  // Replace with the actual address of the randomness sender for your network
  const randomnessSenderAddress = "0x40c3c8B834F81A59942d937013214555A287316A";

  const randomNumberGenerator = await hre.ethers.deployContract("RandomNumberGenerator", [randomnessSenderAddress, deployer.address]);

  await randomNumberGenerator.waitForDeployment();

  console.log(
    `RandomNumberGenerator deployed to ${randomNumberGenerator.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
