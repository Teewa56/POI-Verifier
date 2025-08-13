import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function BlockchainVerification({ insightId, contentHash }) {
    const { contract } = useWeb3();
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(false);

    const verifyOnChain = async () => {
        setLoading(true);
        try {
            const tx = await contract.verifyInsight(insightId, contentHash);
            await tx.wait();
            setVerification({ verified: true, txHash: tx.hash });
        } catch (error) {
            console.error('Verification failed:', error);
            setVerification({ verified: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="blockchain-verification">
        {verification ? (
            verification.verified ? (
            <div className="verified">
                ✅ Verified on blockchain
                <a href={`https://basescan.org/tx/${verification.txHash}`} target="_blank" rel="noopener noreferrer">
                View transaction
                </a>
            </div>
            ) : (
            <div className="error">Verification failed: {verification.error}</div>
            )
        ) : (
            <button onClick={verifyOnChain} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify on Blockchain'}
            </button>
        )}
        </div>
    );
}