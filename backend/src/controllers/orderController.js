const Order = require('../models/Order');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { symbol, type, orderType, quantity, price, duration } = req.body;
    
    // Get stock details
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    // Validate quantity
    if (quantity < 1 || quantity > 100000) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    const totalAmount = quantity * (price || stock.price);
    
    // For BUY orders, check sufficient balance
    if (type === 'BUY') {
      const user = await User.findById(req.user._id);
      if (user.balance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      stock: stock._id,
      symbol: stock.symbol,
      type,
      orderType: orderType || 'MARKET',
      quantity,
      price: price || stock.price,
      total: totalAmount,
      duration: duration || 'DAY',
      status: 'PENDING'
    });
    
    // For market orders, execute immediately
    if (orderType === 'MARKET') {
      await executeOrder(order._id);
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Execute an order
// @route   POST /api/orders/:id/execute
// @access  Private
const executeOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== 'PENDING') {
      throw new Error('Order not found or already executed');
    }
    
    const stock = await Stock.findById(order.stock);
    const user = await User.findById(order.user);
    
    if (order.type === 'BUY') {
      // Deduct balance
      user.balance -= order.total;
      await user.save();
      
      // Update portfolio
      let portfolio = await Portfolio.findOne({ user: order.user });
      const existingHolding = portfolio.holdings.find(
        h => h.stock.toString() === order.stock.toString()
      );
      
      if (existingHolding) {
        // Update existing holding
        const newQuantity = existingHolding.quantity + order.quantity;
        const newAveragePrice = (
          (existingHolding.averagePrice * existingHolding.quantity) + 
          (order.price * order.quantity)
        ) / newQuantity;
        existingHolding.quantity = newQuantity;
        existingHolding.averagePrice = newAveragePrice;
        existingHolding.totalInvestment = newQuantity * newAveragePrice;
      } else {
        // Add new holding
        portfolio.holdings.push({
          stock: order.stock,
          symbol: order.symbol,
          quantity: order.quantity,
          averagePrice: order.price,
          totalInvestment: order.total
        });
      }
      
      await portfolio.save();
    } else if (order.type === 'SELL') {
      // Check if user has enough shares
      const portfolio = await Portfolio.findOne({ user: order.user });
      const holding = portfolio.holdings.find(
        h => h.stock.toString() === order.stock.toString()
      );
      
      if (!holding || holding.quantity < order.quantity) {
        throw new Error('Insufficient shares to sell');
      }
      
      // Add to balance
      user.balance += order.total;
      await user.save();
      
      // Update portfolio
      holding.quantity -= order.quantity;
      if (holding.quantity === 0) {
        portfolio.holdings = portfolio.holdings.filter(
          h => h.stock.toString() !== order.stock.toString()
        );
      }
      await portfolio.save();
    }
    
    // Update order status
    order.status = 'EXECUTED';
    order.executedPrice = order.price;
    order.executedQuantity = order.quantity;
    order.executedAt = Date.now();
    await order.save();
    
    // Create transaction record
    await Transaction.create({
      user: order.user,
      order: order._id,
      type: order.type,
      symbol: order.symbol,
      quantity: order.quantity,
      price: order.price,
      amount: order.total,
      status: 'COMPLETED'
    });
    
    return order;
  } catch (error) {
    console.error('Order execution error:', error);
    throw error;
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = { user: req.user._id };
    
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel an order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'PENDING') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    
    order.status = 'CANCELLED';
    order.cancelledAt = Date.now();
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  cancelOrder
};