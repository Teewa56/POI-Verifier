import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/api';
import InsightCard from '../components/InsightCard';
import StatsWidget from '../components/StatsWidget';

export default function DashboardPage() {
    const { user } = useAuth();
    const [insights, setInsights] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
        const { data } = await apiCall('get', `/users/${user.id}/insights`);
        setInsights(data.insights);
        
        const { data: statsData } = await apiCall('get', `/users/${user.id}/stats`);
        setStats(statsData);
        setLoading(false);
        };

        fetchData();
    }, [user.id]);

    if (loading) return <div className="loading-spinner">Loading...</div>;

    return (
        <div className="dashboard-container">
            <StatsWidget stats={stats} />
            
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