const crypto = require('crypto');
const { ethers } = require('ethers');

exports.generateHash = (content) => {
    return crypto.createHash('sha256').update(content).digest('hex');
};

exports.storeOnBlockchain = async (hash) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        ['function storeHash(bytes32)'],
        wallet
    );
    
    const tx = await contract.storeHash(hash);
    return tx.wait();
};