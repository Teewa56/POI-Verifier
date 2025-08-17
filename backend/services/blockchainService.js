const { ethers } = require('ethers');
const Insight = require('../models/insightModel');
const contractABI = require('../abi/insightContractABI.json');

let provider;
let wallet;
let contract;

const initialize = () => {
    try {
        provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);
        console.log('Blockchain service initialized');
    } catch (err) {
        console.error('Failed to initialize blockchain service:', err);
        throw err;
    }
};

const storeHashOnChain = async (contentHash, originalityScore, sentimentScore, insightId, tags = []) => {
    try {
        if (!contract) initialize();

        const tx = await contract.storeInsight(contentHash, tags);
        const receipt = await tx.wait();
        console.log("Done with storing")

        const updateTx = await contract.updateInsightScores(contentHash, originalityScore, sentimentScore);
        const updateReceipt = await updateTx.wait();

        await Insight.findByIdAndUpdate(insightId, {
            blockchainTxHash: [receipt.transactionHash, updateReceipt.transactionHash],
            blockchainTimestamp: new Date(),
        });

        return { txHash: [receipt.transactionHash, updateReceipt.transactionHash], blockNumber: receipt.blockNumber };
    } catch (err) {
        console.error('Failed to store hash on blockchain:', err);
        throw new Error(err.revert?.args?.[0]);
    }
};

const verifyHashOnChain = async (contentHash) => {
    try {
        if (!contract) initialize();

        const [timestamp, author] = await contract.verifyInsight(contentHash);
        return { timestamp: new Date(Number(timestamp) * 1000), author };
    } catch (err) {
        console.error('Failed to verify hash on blockchain:', err);
        throw new Error('Failed to verify on blockchain');
    }
};

module.exports = { initialize, storeHashOnChain, verifyHashOnChain };