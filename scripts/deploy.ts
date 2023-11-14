import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const permabull = await ethers.deployContract("Permabull", [
    owner.address,
    "Permabull",
    "PMB",
    9,
    ethers.parseUnits("1000000000000000", 9),
    owner.address,
  ]);

  await permabull.waitForDeployment();

  console.log(`Permabull Address: ${await permabull.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
