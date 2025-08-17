export const  cleanGeminiResponse = (raw) => {
    if (!raw) return null;

    const cleaned = raw.replace(/```json|```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("Failed to parse Gemini JSON:", err);
        return null;
    }
}