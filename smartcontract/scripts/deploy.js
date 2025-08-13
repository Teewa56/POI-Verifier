const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    const PoIVerifier = await ethers.getContractFactory("PoIVerifier");
    const contract = await PoIVerifier.deploy();
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    const details = `VerifierContractAddress: ${address}`
    fs.writeFileSync('contractAddress.json', details, null, 2);
    if (process.env.NETWORK !== "hardhat") {
        console.log("Waiting for 5 block confirmations...");
        await contract.deployTransaction.wait(5);
        await verify(contract.address, []);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });