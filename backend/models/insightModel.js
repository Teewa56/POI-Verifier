const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  hash: {type: String},
  generatedTags: [{ type: String }], 
  summary: { type: String },         
  originalityScore: { type: Number }, 
  sentimentScore: { type: Number }, 
  blockchainTxHash: [{ type: String }], 
  blockchainTimestamp: { type: Date }, 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Insight', insightSchema);