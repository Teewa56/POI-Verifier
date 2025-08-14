const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function analyzeWithGemini(prompt, modelName = "gemini-1.5-flash") {
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to analyze content with Gemini");
    }
}

async function getInsightSummary(title, content) {
    const prompt = `
        As a professional research analyst, create a concise 3-4 sentence summary of this insight.
        Focus on extracting key findings and unique perspectives.
        
        Title: ${title}
        Content: ${content}
        
        Respond with the summary only, no introductory text.
    `;
    
    return analyzeWithGemini(prompt);
}

async function scoreInsight(title, content) {
  const prompt = `
    Analyze this financial insight and provide scores in JSON format:
    {
      "originality": 0-100,  // How novel/unique the perspective is
      "sentiment": -100-100, // Negative to positive sentiment
      "clarity": 0-100,      // How clearly expressed
      "keywords": []         // 3-5 key topical keywords
    }
    
    Title: ${title}
    Content: ${content}
    
    Respond with valid JSON only, no additional commentary.
  `;
  
  const result = await analyzeWithGemini(prompt);
  return JSON.parse(result);
}


module.exports = {getInsightSummary, scoreInsight}