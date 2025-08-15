import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { GetAllInsights } from '../api/api';
import apiErrorHandler from '../utils/apiErrorHandler';
import { User } from 'lucide-react';

export default function DashboardPage() {
    const { connectWallet, account } = useWeb3();
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account) {
            setLoading(false); 
            return;
        }

        const fetchInsights = async () => {
            try {
                setLoading(true);
                const res = await GetAllInsights();
                console.log('API Response:', res); // Debug log
                
                // Safely handle the response
                if (res?.data?.insights) {
                    // Filter out any null/undefined insights
                    const validInsights = res.data.insights.filter(insight => insight?._id);
                    setInsights(validInsights);
                } else {
                    setInsights([]);
                }
            } catch (error) {
                apiErrorHandler(error);
                setInsights([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [account]);

    if (loading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div 
                    className='flex flex-row gap-2 cursor-pointer' 
                    onClick={() => window.location.href = '/profile'}>
                    <User size={40} />
                    <p className='text-2xl font-bold'>Profile</p>
                </div>
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 rounded-3xl bg-amber-300 font-bold"
                >
                    {account ? `Connected: ${account.slice(0, 6)}...` : 'Connect Wallet'}
                </button>
            </div>
            
            <div className='flex flex-col gap-2'>
                <h1 className="text-xl font-semibold">Your Verified Insights</h1>
                <a href="/submit"
                    className="bg-blue-600 w-fit text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    + New Insight
                </a>
            </div>

            <div className="space-y-4 mt-10">
                {insights.length > 0 ? (
                    insights.map((insight, idx) => (
                        <div key={idx} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="font-semibold">{insight.title}</h2>
                            <p>{insight.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No insights found.</p>
                )}
            </div>
        </div>
    );
}
