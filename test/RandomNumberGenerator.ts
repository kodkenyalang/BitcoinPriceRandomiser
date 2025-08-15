const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RandomNumberGenerator", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployRandomNumberGeneratorFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount, randomnessSender] = await ethers.getSigners();

    const RandomNumberGenerator = await ethers.getContractFactory("RandomNumberGenerator");
    const randomNumberGenerator = await RandomNumberGenerator.deploy(randomnessSender.address, owner.address);

    return { randomNumberGenerator, owner, otherAccount, randomnessSender };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { randomNumberGenerator, owner } = await loadFixture(deployRandomNumberGeneratorFixture);

      expect(await randomNumberGenerator.owner()).to.equal(owner.address);
    });
  });

  describe("Random Number Generation", function () {
    it("Should emit an event on randomness request", async function () {
      const { randomNumberGenerator } = await loadFixture(deployRandomNumberGeneratorFixture);
      const callbackGasLimit = 300000;
      await expect(randomNumberGenerator.rollDiceWithDirectFunding(callbackGasLimit, {value: ethers.parseEther("0.1")}))
        .to.emit(randomNumberGenerator, "RandomNumberRequested")
        .withArgs(anyValue, anyValue); // We accept any value for the request ID and requester
    });

    it("Should not allow prediction before fulfillment", async function () {
        const { randomNumberGenerator } = await loadFixture(deployRandomNumberGeneratorFixture);
        const callbackGasLimit = 300000;
      	await randomNumberGenerator.rollDiceWithDirectFunding(callbackGasLimit, {value: ethers.parseEther("0.1")});
        await expect(randomNumberGenerator.predictBitcoinRandom()).to.be.revertedWith(
          "Prediction not yet available"
        );
    });
  });

});
