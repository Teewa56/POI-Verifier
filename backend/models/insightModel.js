const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'An insight must have content'],
        trim: true,
    },
    tags: [String],
    contentHash: {
        type: String,
        required: [true, 'An insight must have a content hash'],
        unique: true,
    },
    blockchainTxHash: String,
    blockchainTimestamp: Date,
    originalityScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    sentimentScore: {
        type: Number,
        min: -1,
        max: 1,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'An insight must belong to a user'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
});

insightSchema.index({ contentHash: 1 });
insightSchema.index({ user: 1 });
insightSchema.index({ tags: 1 });

insightSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name email role',
    });
    next();
});

const Insight = mongoose.model('Insight', insightSchema);

module.exports = Insight;