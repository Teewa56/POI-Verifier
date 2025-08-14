import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {GetAllInsights} from '../api/api';
import InsightCard from '../components/InsightCard';

export default function DashboardPage() {
    const { user } = useAuth();
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await GetAllInsights();
            setInsights(data.insights);
            setLoading(false);
        };

        fetchData();
    }, [user.id]);

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-container">            
            <div className="insights-grid">
                {insights.map(insight => (
                <InsightCard 
                    key={insight.id} 
                    insight={insight} 
                    editable={true}
                />
                ))}
            </div>
        </div>
    );
}