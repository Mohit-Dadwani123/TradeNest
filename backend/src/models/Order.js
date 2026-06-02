const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL'],
    required: true
  },
  orderType: {
    type: String,
    enum: ['MARKET', 'LIMIT', 'STOP_LOSS'],
    default: 'MARKET'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 100000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  triggerPrice: Number, // For stop loss orders
  total: Number,
  status: {
    type: String,
    enum: ['PENDING', 'EXECUTED', 'CANCELLED', 'REJECTED', 'PARTIALLY_FILLED'],
    default: 'PENDING'
  },
  duration: {
    type: String,
    enum: ['DAY', 'GTC', 'IOC'],
    default: 'DAY'
  },
  executedPrice: Number,
  executedQuantity: Number,
  executedAt: Date,
  cancelledAt: Date,
  remarks: String
}, {
  timestamps: true
});

// Calculate total before saving
orderSchema.pre('save', function(next) {
  this.total = this.quantity * this.price;
  next();
});

module.exports = mongoose.model('Order', orderSchema);