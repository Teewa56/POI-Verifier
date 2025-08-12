const { run } = require("hardhat");

async function verify(contractAddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
        console.log("Contract verified successfully!");
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Contract is already verified");
        } else {
            console.error("Verification failed:", err);
        }
    }
}

module.exports = { verify };