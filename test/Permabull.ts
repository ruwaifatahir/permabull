import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const ROUTER_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
const parse = ethers.parseUnits;
const format = ethers.formatUnits;

const deployPermabull = async () => {
  const [owner, otherAccount, otherAccount1, otherAccount2] =
    await ethers.getSigners();
  const permabull = await ethers.deployContract("Permabull", [
    otherAccount1.address,
    ROUTER_ADDRESS,
    0,
    5,
    0,
  ]);

  await permabull.waitForDeployment();

  await permabull.transfer(otherAccount2.address, parse("100", 9));

  return { owner, otherAccount, permabull, otherAccount1, otherAccount2 };
};

describe.only("Permabull", function () {
  describe("Transfer", () => {
    describe("Dev Fee", () => {
      it("should deduct the dev fee and send remaining to receiver", async () => {
        // Arrange
        const { permabull, otherAccount } = await loadFixture(deployPermabull);
        const amountToTransfer = parse("100", 9);

        // Act
        await permabull.transfer(otherAccount.address, amountToTransfer);

        const feeAmount = (amountToTransfer * BigInt(5)) / BigInt(100);
        const remainingAmount = amountToTransfer - feeAmount;

        // Assert
        const balanceOfReceiver = await permabull.balanceOf(
          otherAccount.address
        );
        expect(balanceOfReceiver).to.equal(remainingAmount);
      });
      it("should deduct the dev fee and send it to dev", async () => {
        // Arrange
        const { permabull, otherAccount, otherAccount1 } = await loadFixture(
          deployPermabull
        );
        const amountToTransfer = parse("100", 9);

        // Act
        await permabull.transfer(otherAccount.address, amountToTransfer);

        const feeAmount = (amountToTransfer * BigInt(5)) / BigInt(100);

        // Assert
        const balanceOfDev = await permabull.balanceOf(otherAccount1.address);
        expect(balanceOfDev).to.equal(feeAmount);
      });
    });

    describe.only("Tax Fee", () => {
      it("should deduct the dev fee and send remaining to receiver", async () => {
        // Arrange
        const { permabull, otherAccount } = await loadFixture(deployPermabull);
        const amountToTransfer = parse("100", 9);
        await permabull.setDevFeePercent(0);
        await permabull.setTaxFeePercent(5);

        // Act
        await permabull.transfer(otherAccount.address, amountToTransfer);

        const feeAmount = (amountToTransfer * BigInt(5)) / BigInt(100);
        const remainingAmount = amountToTransfer - feeAmount;

        // Assert
        const balanceOfReceiver = await permabull.balanceOf(
          otherAccount.address
        );

        expect(balanceOfReceiver).to.equal(remainingAmount);
      });

      it("should deduct the dev fee and distribute remaining", async () => {
        // Arrange
        const { permabull, otherAccount, otherAccount1, otherAccount2 } =
          await loadFixture(deployPermabull);
        const amountToTransfer = parse("100", 9);
        await permabull.setDevFeePercent(0);
        await permabull.setTaxFeePercent(5);

        // Act
        await permabull.transfer(otherAccount.address, amountToTransfer);
        await permabull.transfer(otherAccount.address, amountToTransfer);
        await permabull.transfer(otherAccount.address, amountToTransfer);

        const feeAmount = (amountToTransfer * BigInt(5)) / BigInt(100);
        const remainingAmount = amountToTransfer - feeAmount;

        // Assert

        permabull.setTaxFeePercent(0);

        await permabull
          .connect(otherAccount2)
          .transfer(otherAccount1.address, parse("5", 9));

        const balanceOfReceiver = await permabull.balanceOf(
          otherAccount2.address
        );

        console.log(balanceOfReceiver);

        // expect(balanceOfReceiver).to.equal(remainingAmount);
      });
    });
  });
});
