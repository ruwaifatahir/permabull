import { ethers } from "hardhat";

const ROUTER_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

async function main() {
  const permabull = await ethers.deployContract("Permabull");

  await permabull.waitForDeployment();

  console.log(`Permabull Address: ${await permabull.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
