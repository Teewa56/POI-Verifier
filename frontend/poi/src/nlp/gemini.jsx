import API from '../api/api';

export const analyzeInsight = async (content) => {
    try {
        const response = await API.post('/gemini/analyze', { content });
        return {
            success: true,
            originalityScore: response.data.originalityScore,
            sentimentScore: response.data.sentimentScore,
            tags: response.data.tags,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to analyze insight',
        };
    }
};

export const generateSummary = async (content) => {
    try {
        const response = await API.post('/gemini/summary', { content });
        return {
            success: true,
            summary: response.data.summary,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to generate summary',
        };
    }
};