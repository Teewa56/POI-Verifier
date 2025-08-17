const Insight = require('../models/insightModel');
const User = require('../models/userModel');
const { AppError } = require('./errorController');
const { getInsightSummary, scoreInsight } = require('../services/nlpService');
const { verifyHashOnChain, storeHashOnChain } = require('../services/blockchainService');
const { ethers } = require('ethers');

exports.getAllInsights = async (req, res, next) => {
  try {
    const insights = await Insight.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json({ status: 'success', results: insights.length, data: insights });
  } catch (err) {
    next(err);
  }
};

const cleanGeminiResponse = (raw) => {
    if (!raw) return null;

    const cleaned = raw.replace(/```json|```/g, '').trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("Failed to parse Gemini JSON:", err);
        return null;
    }
}

exports.createInsight = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) return next(new AppError('Title and content are required', 400));
    
    const insight = await Insight.create({ title, content, tags: tags || [], user: req.user.id });

    // Generate NLP scores and summary
    const { originality, sentiment, tags: keywords } = cleanGeminiResponse(await scoreInsight(title, content));
    const summary = await getInsightSummary(title, content);
    const contentHash = ethers.keccak256(
      ethers.toUtf8Bytes(title + content + Date.now())
    );
    const txResult = await storeHashOnChain(contentHash, originality, sentiment, insight._id, keywords);

    // Update insight with blockchain and NLP results
    insight.summary = summary;
    insight.hash = contentHash;
    insight.originalityScore = originality;
    insight.sentimentScore = sentiment;
    insight.generatedTags = keywords;
    insight.blockchainTxHash = txResult.txHash;
    insight.blockchainTimestamp = new Date();
    await insight.save();

    res.status(201).json({ status: 'success', data: insight });
  } catch (err) {
    next(err);
  }
};

exports.getInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findOne({ _id: req.params.id, user: req.user.id }).populate('user', 'name');
    if (!insight) return next(new AppError('Insight not found', 404));
    res.status(200).json({ status: 'success', data: insight });
  } catch (err) {
    next(err);
  }
};

exports.verifyInsight = async (req, res, next) => {
  try {
    const { hash } = req.body;
    if (!hash) return next(new AppError('Hash is required', 400));

    const result = await verifyHashOnChain(hash);
    const insight = await Insight.findOne({ hash: hash }).populate('user', 'name');
    res.status(200).json({ status: 'success', data: result, uploaderName: insight.user.name });
  } catch (err) {
    next(err);
  }
};

exports.getSummary = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const summary = await getInsightSummary(title, content);
    res.status(200).json({ status: 'success', data: summary });
  } catch (err) {
    next(err);
  }
};

exports.generateInsightScores = async (req, res, next) => {
  const { title, content } = req.body;
  try {
    const scores = await scoreInsight(title, content);
    res.status(200).json({ status: 'success', data: scores });
  } catch (err) {
    next(err);
  }
};
