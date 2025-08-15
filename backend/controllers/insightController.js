const Insight = require('../models/insightModel');
const { AppError } = require('./errorController');
const {getInsightSummary, scoreInsight} = require('../services/nlpService');
const {verifyHashOnChain} = require('../services/blockchainService');

exports.getAllInsights = async (req, res, next) => {
  try {
    const insights = await Insight.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: insights.length, data: insights });
  } catch (err) { next(err); }
};

exports.createInsight = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) return next(new AppError('Title and content are required', 400));
    const insight = await Insight.create({ title, content, tags: tags || [], user: req.user.id });
    res.status(201).json({ status: 'success', data: insight });
  } catch (err) { next(err); }
};

exports.getInsight = async (req, res, next) => {
  try {
    const insight = await Insight.findOne({ _id: req.params.id, user: req.user.id });
    if (!insight) return next(new AppError('Insight not found', 404));
    res.status(200).json({ status: 'success', data: insight });
  } catch (err) { next(err); }
};

exports.verifyInsight = async(req, res, next) => {
  try {
    const hash = req.body;
    const insight = verifyHashOnChain(hash);
    res.status(200).json({status: 'success', data: insight})
  } catch (error) {
    next(err);
  }
}

exports.getSummary = async (req, res, next) => {
  const {title, content} = req.body;
  try {
      const summary = await getInsightSummary(title, content);
      res.status(200).json({
          status: 'success', 
          data: summary
      })
  } catch (error) {
      next(error);
  }
}

exports.generateInsightScores = async (req, res, next) => {
  const {title, content} = req.body;
  try {
      const scores = await scoreInsight(title, content);
      res.status(200).json({
          status: 'success', 
          data: scores
      })
  } catch (error) {
      next(error);
  }
}