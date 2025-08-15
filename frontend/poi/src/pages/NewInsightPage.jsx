import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sha256 } from 'js-sha256';

export default function InsightForm() {
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { contract, account } = useWeb3();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract || !account) return;

        setIsSubmitting(true);
        try {
            const contentHash = '0x' + sha256(content);
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            const tx = await contract.storeInsight(contentHash, tagsArray);
            await tx.wait();

            toast.success('Insight submitted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Submission failed:', error);
            toast.error('Failed to submit insight');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Submit Your Insight</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">
                        Your Insight
                    </label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows={6}
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
                        placeholder="blockchain, AI, crypto"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !account}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    >
                    {!account ? 'Connect Wallet' : isSubmitting ? 'Submitting...' : 'Submit Insight'}
                </button>
            </form>
        </div>
    );
}