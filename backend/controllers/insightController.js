const Insight = require('../models/insightModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const blockchainService = require('../services/blockchainService');
const {getInsightSummary, scoreInsight} = require('../services/nlpService');

exports.getAllInsights = async (req, res, next) => {
    try {
        const features = new APIFeatures(
            Insight.find({ user: req.user.id }),
            req.query
        )
        .filter()
        .sort()
        .limitFields()
        .paginate();

        const insights = await features.query;

        res.status(200).json({
            status: 'success',
            results: insights.length,
            data: {
                insights,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.createInsight = async (req, res, next) => {
    try {
        const { content, tags } = req.body;
        
        const contentHash = crypto.createHash('sha256').update(content).digest('hex');
        
        const newInsight = await Insight.create({
            content,
            tags,
            user: req.user.id,
            contentHash,
        });

        blockchainService.storeHashOnChain(contentHash, req.user.id, newInsight._id)
        .catch(err => console.error('Blockchain storage failed:', err));

        res.status(201).json({
            status: 'success',
            data: {
                insight: newInsight,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.getInsight = async (req, res, next) => {
    try {
        const insight = await Insight.findOne({ _id: req.params.id, user: req.user.id });
        
        if (!insight) {
            throw new AppError('No insight found with that ID', 404);
        }
        
        if (insight.contentHash) {
            const blockchainData = await blockchainService.verifyHashOnChain(insight.contentHash);
            insight.blockchainVerification = blockchainData;
        }

        res.status(200).json({
            status: 'success',
            data: {
                insight,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.updateInsight = async (req, res, next) => {
    try {
        const insight = await Insight.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        {
            new: true,
            runValidators: true,
        }
        );

        if (!insight) {
            throw new AppError('No insight found with that ID', 404);
        }

        res.status(200).json({
            status: 'success',
            data: {
                insight,
            },
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteInsight = async (req, res, next) => {
    try {
        const insight = await Insight.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!insight) {
            throw new AppError('No insight found with that ID', 404);
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        next(err);
    }
};

exports.getSummary = async (req, res, next) => {
    const {title, content} = req.data;
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

exports.scoreInsight = async (req, res, next) => {
    const {title, content} = req.data;
    try {
        const scores = await getInsightSummary(title, content);
        res.status(200).json({
            status: 'success', 
            data: scores
        })
    } catch (error) {
        next(error);
    }
}