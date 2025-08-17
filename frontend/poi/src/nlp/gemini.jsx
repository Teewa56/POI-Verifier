import { GetSummary, GenerateInsightScores } from '../api/api';
import { cleanGeminiResponse } from '../utils/responseCleaner';

export const generateScore = async ({ title, content }) => {
  try {
    const response = await GenerateInsightScores({ title, content });
    const payload = response?.data?.data;
    const parsed = cleanGeminiResponse(payload);
    return {
      success: true,
      originalityScore: parsed?.originality,
      sentimentScore: parsed?.sentiment,
      clarity: parsed?.clarity,
      tags: parsed?.keywords || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Failed to analyze insight',
    };
  }
};

export const generateSummary = async ({ title, content }) => {
  try {
    const response = await GetSummary({ title, content });
    const payload = response?.data?.data;
    return {
      success: true,
      summary: payload?.summary ?? payload,
    };
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.message || 'Failed to generate summary',
    };
  }
}