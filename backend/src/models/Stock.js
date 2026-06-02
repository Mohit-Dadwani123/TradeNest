const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    enum: ['NSE', 'BSE'],
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  industry: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  open: Number,
  high: Number,
  low: Number,
  previousClose: Number,
  change: Number,
  changePercent: Number,
  volume: {
    type: Number,
    default: 0
  },
  marketCap: Number,
  peRatio: Number,
  dividendYield: Number,
  eps: Number,
  week52High: Number,
  week52Low: Number,
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better search performance
stockSchema.index({ symbol: 'text', name: 'text' });

module.exports = mongoose.model('Stock', stockSchema);