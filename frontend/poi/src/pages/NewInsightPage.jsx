import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateInsight } from '../api/api';
import { generateScore, generateSummary } from '../nlp/gemini';

export default function InsightForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [aiScores, setAiScores] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Run AI analysis whenever title or content changes (debounced)
  useEffect(() => {
    if (!title || !content) {
      setAiScores(null);
      setAiSummary('');
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoadingAi(true);
        const summaryResult = await generateSummary({ title, content });
        const scoreResult = await generateScore({ title, content });
        if (scoreResult.success) setAiScores(scoreResult);
        if (summaryResult.success) setAiSummary(summaryResult.summary);
      } catch (err) {
        console.log('AI analysis failed', err);
      } finally {
        setLoadingAi(false);
      }
    }, 800); // 800ms debounce

    return () => clearTimeout(timeout);
  }, [title, content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Title and content are required');

    setIsSubmitting(true);
    try {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

      await CreateInsight({ title, content, tags: tagsArray });
      toast.success('Insight submitted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit insight');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Your Insight</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Your Insight</label>
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
          <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="blockchain, AI, crypto"
          />
        </div>

        {/* AI Insights Preview */}
        {loadingAi && <p className="text-gray-500">Analyzing content…</p>}
        {aiScores && (
          <div className="p-3 border rounded-lg bg-gray-50 space-y-2">
            <h3 className="font-semibold">AI Insights:</h3>
            <p><strong>Originality Score:</strong> {aiScores.originalityScore}</p>
            <p><strong>Sentiment Score:</strong> {aiScores.sentimentScore}</p>
            <p><strong>Clarity Score Score:</strong> {aiScores.clarity}</p>
            <p><strong>Suggested Tags:</strong> {aiScores.tags.join(', ')}</p>
            {aiSummary && (
              <p><strong>Summary:</strong> {aiSummary}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting…' : 'Submit Insight'}
        </button>
      </form>
    </div>
  );
}