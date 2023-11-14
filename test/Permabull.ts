import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";

const parse = ethers.parseUnits;
const format = ethers.formatUnits;

describe("Permabull", function () {
  const deploy = async () => {
    const [owner, rufi, jaw, homer] = await ethers.getSigners();
    const permabull = await ethers.deployContract("Permabull");

    await permabull.waitForDeployment();

    await permabull.transfer(rufi.address, parse("10000", 9));
    await permabull.transfer(jaw.address, parse("10000", 9));

    return { permabull, owner, rufi, jaw, homer };
  };
  describe("Reflection", () => {
    it("should distribute reflection", async function () {
      const { permabull, rufi, homer, jaw } = await loadFixture(deploy);

      await permabull.connect(rufi).transfer(homer.address, parse("100", 9));
      await permabull.connect(rufi).transfer(homer.address, parse("100", 9));
      await permabull.connect(rufi).transfer(homer.address, parse("100", 9));
      await permabull.connect(rufi).transfer(homer.address, parse("100", 9));

      console.log(await permabull.isExcludedFromReward(rufi.address));
      console.log(await permabull.isExcludedFromReward(homer.address));
      console.log(await permabull.isExcludedFromReward(jaw.address));

      console.log(format(await permabull.balanceOf(homer.address), 9));
      console.log(format(await permabull.balanceOf(jaw.address), 9));
    });
  });
});
