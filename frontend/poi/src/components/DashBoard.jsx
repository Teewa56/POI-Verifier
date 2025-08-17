import { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { GetAllInsights } from '../api/api';
import apiErrorHandler from '../utils/apiErrorHandler';
import { User, LogOut } from 'lucide-react';
import InsightCard from '../components/InsightCard'

export default function DashboardPage() {
    const { connectWallet, account, disconnectWallet } = useWeb3();
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
                setInsights(res?.data?.data)
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
                <div className='flex flex-col gap-1'>
                    <button
                        onClick={connectWallet}
                        className="px-4 py-2 rounded-3xl bg-amber-300 font-bold cursor-pointer"
                    >
                        {account ? `Connected` : 'Connect Wallet'}
                    </button>
                    {account && 
                    <button 
                        onClick={disconnectWallet}
                        className='flex items-center px-4 py-2 rounded-3xl bg-amber-300 justify-start gap-2 cursor-pointer'>
                        <LogOut size={20} /> <p>Disconnect</p>
                    </button>}
                </div>
            </div>
            
            <div className='grid grid-cols-2 gap-3'>
                <a href="/submit"
                    className="bg-blue-600 w-fit text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    + New Insight
                </a>
                <a href="/verify"
                    className="bg-blue-600 w-fit text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                    Verify Insight
                </a>
            </div>

            <h1 className="text-xl font-semibold">Your Verified Insights</h1>
            <div className="grid grid-cols-2 mt-5 gap-2">
                {insights.length > 0 ? (
                    insights.map((insight, idx) => (
                        <InsightCard insight={insight} key={idx} />
                    ))
                ) : (
                    <p>No insights found.</p>
                )}
            </div>
        </div>
    );
}
