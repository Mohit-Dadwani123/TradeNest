const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');

// @desc    Get user's portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id })
      .populate('holdings.stock');
    
    if (!portfolio) {
      portfolio = await Portfolio.create({
        user: req.user._id,
        holdings: []
      });
    }
    
    // Update current values
    for (let holding of portfolio.holdings) {
      const stock = await Stock.findById(holding.stock);
      if (stock) {
        holding.currentValue = stock.price;
        holding.profitLoss = (stock.price - holding.averagePrice) * holding.quantity;
        holding.profitLossPercentage = ((stock.price - holding.averagePrice) / holding.averagePrice) * 100;
      }
    }
    
    // Calculate portfolio summary
    portfolio.calculateSummary();
    await portfolio.save();
    
    res.json(portfolio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get portfolio performance
// @route   GET /api/portfolio/performance
// @access  Private
const getPortfolioPerformance = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id })
      .populate('holdings.stock');
    
    if (!portfolio) {
      return res.json({
        totalValue: 0,
        totalProfitLoss: 0,
        dailyChange: 0,
        holdings: []
      });
    }
    
    const performance = {
      totalValue: portfolio.totalCurrentValue,
      totalProfitLoss: portfolio.totalProfitLoss,
      totalProfitLossPercentage: portfolio.totalProfitLossPercentage,
      holdings: portfolio.holdings.map(h => ({
        symbol: h.symbol,
        quantity: h.quantity,
      averagePrice: h.averagePrice,
        currentPrice: h.currentValue,
        value: h.currentValue * h.quantity,
        profitLoss: h.profitLoss,
        profitLossPercentage: h.profitLossPercentage
      }))
    };
    
    res.json(performance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPortfolio,
  getPortfolioPerformance
};