const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function analyzeWithGemini(prompt, modelName = "gemini-1.5-flash") {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze content with Gemini");
  } 
}

async function getInsightSummary(title, content) {
  const prompt = `
  You are an expert research analyst. 
  Review the following insight in 3–4 concise lines:
  1. Provide a clear summary of the main point.  
  2. Suggest corrections or improvements (if any).  
  3. Keep the response sharp, professional, and directly related to the content.  

  Title: ${title}  
  Content: ${content}  

  Return only the review — no introductions, no extra formatting.
  `;

  return analyzeWithGemini(prompt);
}

async function scoreInsight(title, content) {
  const prompt = `
    Analyze this financial insight and provide scores in JSON format:
    {
      "originality": 0-100,
      "sentiment": -100-100,
      "clarity": 0-100,
      "keywords": []
    }

    Title: ${title}
    Content: ${content}

    Respond with the scores only no additional comments e.g originalityScore- 50, sentiment- 30 e.t.c
    the above is an example, return with the real scores based on the insight above
  `;

  return analyzeWithGemini(prompt);
}

module.exports = { getInsightSummary, scoreInsight };