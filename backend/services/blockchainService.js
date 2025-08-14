const { ethers } = require('ethers');
const Insight = require('../models/insightModel');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const contractABI = require('../abi/insightContractABI.json'); 

let provider;
let wallet;
let contract;

const initialize = () => {
    try {
        provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
        wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            contractABI.abi,
            wallet
        );
        
        logger.info('Blockchain service initialized');
    } catch (err) {
        logger.error('Failed to initialize blockchain service:', err);
        throw err;
    }
};

const storeHashOnChain = async (contentHash, originalityScore, sentimentScore, insightId) => {
    try {
        if (!contract) initialize();
        
        const tx = await contract.storeInsight(contentHash);
        const receipt = await tx.wait();
        const updatedTx = await contract.updateInsightScores(contentHash, originalityScore, sentimentScore);
        const newReciept = await updatedTx.wait();
        await Insight.findByIdAndUpdate(insightId, {
            blockchainTxHash: [receipt.transactionHash, newReciept.transactionHash],
            blockchainTimestamp: new Date(),
        });
        
        return {
            txHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber,
        };
    } catch (err) {
        logger.error('Failed to store hash on blockchain:', err);
        throw new AppError('Failed to store on blockchain', 500);
    }
};

const verifyHashOnChain = async (contentHash) => {
    try {
        if (!contract) initialize();
        
        const [timestamp, author] = await contract.verifyInsight(contentHash);
        return {
            timestamp: new Date(timestamp * 1000), // Convert to JS timestamp
            author,
        };
    } catch (err) {
        logger.error('Failed to verify hash on blockchain:', err);
        throw new AppError('Failed to verify on blockchain', 500);
    }
};

module.exports = {
    initialize,
    storeHashOnChain,
    verifyHashOnChain,
};