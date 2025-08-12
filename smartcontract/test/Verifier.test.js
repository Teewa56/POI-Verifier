const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PoIVerifier", function () {
    let PoIVerifier;
    let poiVerifier;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();

        PoIVerifier = await ethers.getContractFactory("PoIVerifier");
        poiVerifier = await PoIVerifier.deploy();
        await poiVerifier.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await poiVerifier.owner()).to.equal(owner.address);
        });
    });

    describe("Insight Operations", function () {
        const testHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test content"));
        const testTags = ["blockchain", "ai"];

        it("Should store new insight", async function () {
            await expect(poiVerifier.connect(addr1).storeInsight(testHash, testTags))
                .to.emit(poiVerifier, "InsightStored")
                .withArgs(testHash, addr1.address, anyValue, testTags);
            
            const insight = await poiVerifier.insights(testHash);
            expect(insight.author).to.equal(addr1.address);
            expect(insight.tags.length).to.equal(2);
        });

        it("Should reject duplicate insights", async function () {
            await poiVerifier.connect(addr1).storeInsight(testHash, testTags);
            
            await expect(
                poiVerifier.connect(addr1).storeInsight(testHash, testTags)
            ).to.be.revertedWith("Insight already exists");
        });

        it("Should update insight scores (owner only)", async function () {
            await poiVerifier.connect(addr1).storeInsight(testHash, testTags);
            
            // Test owner can update
            await poiVerifier.updateInsightScores(testHash, 85, 25);
            let insight = await poiVerifier.insights(testHash);
            expect(insight.originalityScore).to.equal(85);
            expect(insight.sentimentScore).to.equal(25);

            // Test non-owner cannot update
            await expect(
                poiVerifier.connect(addr1).updateInsightScores(testHash, 90, 30)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should retrieve user insights", async function () {
            await poiVerifier.connect(addr1).storeInsight(testHash, testTags);
            
            const userInsights = await poiVerifier.getUserInsights(addr1.address);
            expect(userInsights.length).to.equal(1);
            expect(userInsights[0]).to.equal(testHash);
        });

        it("Should retrieve tag insights", async function () {
            await poiVerifier.connect(addr1).storeInsight(testHash, testTags);
            
            const blockchainInsights = await poiVerifier.getTagInsights("blockchain");
            expect(blockchainInsights.length).to.equal(1);
            expect(blockchainInsights[0]).to.equal(testHash);
        });
    });
});

function anyValue() {
    return true;
}