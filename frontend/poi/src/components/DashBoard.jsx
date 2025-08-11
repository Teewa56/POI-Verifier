import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
        try {
            const response = await fetch('/api/insights');
            const data = await response.json();
            setInsights(data);
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchInsights();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Verified Insights</h1>
                <Link
                to="/submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                + New Insight
                </Link>
            </div>
            
            {insights.length === 0 ? (
                <div className="text-center p-8 border rounded-lg">
                <p className="mb-4">You haven't submitted any insights yet.</p>
                <Link
                    to="/submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Submit Your First Insight
                </Link>
                </div>
            ) : (
                <div className="space-y-4">
                {insights.map((insight) => (
                    <div key={insight.id} className="border p-4 rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div>
                        <h3 className="font-medium">{insight.title || 'Untitled Insight'}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            {new Date(insight.timestamp).toLocaleDateString()}
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
                    <p className="mt-2 text-gray-700">{insight.content}</p>
                    {insight.blockchainHash && (
                        <div className="mt-3 text-xs text-gray-500">
                        Blockchain Hash: <code>{insight.blockchainHash}</code>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;