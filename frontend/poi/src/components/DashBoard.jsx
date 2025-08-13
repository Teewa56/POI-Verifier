import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { format } from 'date-fns';

export default function DashboardPage() {
    const { contract, account } = useWeb3();
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            if (!contract || !account) return;

            try {
                const hashes = await contract.getUserInsights(account);
                
                // Get each insight's details
                const insightPromises = hashes.map(async (hash) => {
                    const insight = await contract.getInsight(hash);
                    return {
                        contentHash: hash,
                        author: insight.author,
                        timestamp: Number(insight.timestamp),
                        tags: insight.tags,
                        originalityScore: Number(insight.originalityScore),
                        sentimentScore: Number(insight.sentimentScore),
                    };
                });

                const userInsights = await Promise.all(insightPromises);
                setInsights(userInsights);
            } catch (error) {
                console.error('Failed to fetch insights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [contract, account]);

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Verified Insights</h1>
            <a
            href="/submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
            + New Insight
            </a>
        </div>
        
        {insights.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
            <p className="mb-4">You haven't submitted any insights yet.</p>
            <a
                href="/submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                Submit Your First Insight
            </a>
            </div>
        ) : (
            <div className="space-y-4">
            {insights.map((insight) => (
                <div key={insight.contentHash} className="border p-4 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="font-medium">
                        Insight #{insight.contentHash.slice(0, 8)}...
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        {format(new Date(insight.timestamp * 1000), 'MMM d, yyyy h:mm a')}
                    </p>
                    </div>
                    <div className="flex space-x-2">
                    {insight.tags.map((tag) => (
                        <span key={tag} className="bg-gray-200 px-2 py-1 text-xs rounded">
                        {tag}
                        </span>
                    ))}
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                    <p className="text-sm text-gray-500">Originality Score</p>
                    <p className="font-medium">
                        {insight.originalityScore || 'Not rated yet'}
                    </p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Sentiment Score</p>
                    <p className="font-medium">
                        {insight.sentimentScore || 'Not rated yet'}
                    </p>
                    </div>
                </div>
                <div className="mt-3 text-xs text-gray-500 break-all">
                    Blockchain Hash: {insight.contentHash}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
}