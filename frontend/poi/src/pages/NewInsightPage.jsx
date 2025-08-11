import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InsightForm = () => {
    const [insight, setInsight] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch('/api/insights', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: insight, tags: tags.split(',') }),
            });
            
            if (response.ok) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Submit Your Insight</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label htmlFor="insight" className="block text-sm font-medium mb-1">
                    Your Insight
                </label>
                <textarea
                    id="insight"
                    value={insight}
                    onChange={(e) => setInsight(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="6"
                    required
                />
                </div>
                <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags (comma separated)
                </label>
                <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ethereum, Inflation, Tech Stocks"
                />
                </div>
                <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                {isSubmitting ? 'Submitting...' : 'Submit Insight'}
                </button>
            </form>
        </div>
    );
};

export default InsightForm;