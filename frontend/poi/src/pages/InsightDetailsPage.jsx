import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiCall } from '../api/api';

export default function InsightDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsight = async () => {
            const { data } = await apiCall('get', `/insights/${id}`);
            setInsight(data);
            setLoading(false);
        };
        fetchInsight();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="insight-detail">
            <h1>{insight.title}</h1>
            <div className="metadata">
                <span>By {insight.author.name}</span>
                <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="content">{insight.content}</div>
            {user?._id === insight.author._id && (
                <button className="edit-button">Edit Insight</button>
            )}
        </div>
    );
}