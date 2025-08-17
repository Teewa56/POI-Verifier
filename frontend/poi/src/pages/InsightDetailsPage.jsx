import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetInsightById } from '../api/api';

export default function InsightDetailPage() {
    const { id } = useParams();
    const [insight, setInsight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await GetInsightById(id);
                setInsight(res?.data?.data || null); // backend shape
            } finally {
                setLoading(false);
            }
            })();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!insight) return <div>Not found</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">{insight.title}</h1>
        <div className="text-sm text-gray-600 flex gap-3">
            <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
            {insight.user?.name && <span>By {insight.user.name}</span>}
        </div>
        {Array.isArray(insight.tags) && insight.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
            {insight.tags.map((t) => (
                <span key={t} className="px-2 py-1 text-xs rounded bg-gray-100 border">{t}</span>
            ))}
            </div>
        )}
        <div className="whitespace-pre-wrap leading-7">{insight.content}</div>
        <p>Hash: {insight.hash}</p>
        </div>
    );
}