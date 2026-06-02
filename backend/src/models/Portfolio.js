const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  holdings: [{
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true
    },
    symbol: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalInvestment: Number,
    currentValue: Number,
    profitLoss: Number,
    profitLossPercentage: Number
  }],
  totalInvestment: {
    type: Number,
    default: 0
  },
  totalCurrentValue: {
    type: Number,
    default: 0
  },
  totalProfitLoss: {
    type: Number,
    default: 0
  },
  totalProfitLossPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to calculate portfolio summary
portfolioSchema.methods.calculateSummary = function() {
  this.totalInvestment = this.holdings.reduce((sum, h) => sum + (h.quantity * h.averagePrice), 0);
  this.totalCurrentValue = this.holdings.reduce((sum, h) => sum + (h.quantity * h.currentValue), 0);
  this.totalProfitLoss = this.totalCurrentValue - this.totalInvestment;
  this.totalProfitLossPercentage = (this.totalProfitLoss / this.totalInvestment) * 100;
  return this;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);