const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL'],
    required: true
  },
  symbol: String,
  quantity: Number,
  price: Number,
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'COMPLETED'
  },
  reference: String,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);