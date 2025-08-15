import { useState, useEffect } from 'react';
import { apiCall } from '../api/api';
import AdminInsightTable from '../components/AdminInsightTable';

export default function AdminPage() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
        const { data } = await apiCall('get', '/admin/insights');
        setInsights(data);
        setLoading(false);
        };
        fetchInsights();
    }, []);

    const handleVerify = async (insightId) => {
        await apiCall('patch', `/admin/insights/${insightId}/verify`);
        setInsights(insights.map(i => 
        i._id === insightId ? {...i, verified: true} : i
        ));
    };

    return (
        <div className="admin-panel">
        <h1>Insight Verification</h1>
        <AdminInsightTable 
            insights={insights} 
            onVerify={handleVerify}
            loading={loading}
        />
        </div>
    );
}