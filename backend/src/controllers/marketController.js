const Stock = require('../models/Stock');

// @desc    Get market overview
// @route   GET /api/market/overview
// @access  Public
const getMarketOverview = async (req, res) => {
  try {
    // Get market indices (mock data)
    const indices = [
      { name: 'NIFTY 50', value: 21456.75, change: 245.30, changePercent: 1.16 },
      { name: 'SENSEX', value: 71234.50, change: 678.90, changePercent: 0.96 },
      { name: 'BANK NIFTY', value: 45678.25, change: 345.60, changePercent: 0.76 }
    ];
    
    // Get top gainers
    const topGainers = await Stock.find({ changePercent: { $gt: 0 } })
      .sort({ changePercent: -1 })
      .limit(5);
    
    // Get top losers
    const topLosers = await Stock.find({ changePercent: { $lt: 0 } })
      .sort({ changePercent: 1 })
      .limit(5);
    
    // Get most active stocks
    const mostActive = await Stock.find()
      .sort({ volume: -1 })
      .limit(5);
    
    res.json({
      indices,
      topGainers,
      topLosers,
      mostActive,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top gainers
// @route   GET /api/market/top-gainers
// @access  Public
const getTopGainers = async (req, res) => {
  try {
    const gainers = await Stock.find({ changePercent: { $gt: 0 } })
      .sort({ changePercent: -1 })
      .limit(20);
    
    res.json(gainers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top losers
// @route   GET /api/market/top-losers
// @access  Public
const getTopLosers = async (req, res) => {
  try {
    const losers = await Stock.find({ changePercent: { $lt: 0 } })
      .sort({ changePercent: 1 })
      .limit(20);
    
    res.json(losers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get sector performance
// @route   GET /api/market/sectors
// @access  Public
const getSectorPerformance = async (req, res) => {
  try {
    const sectors = await Stock.aggregate([
      {
        $group: {
          _id: '$sector',
          totalChange: { $avg: '$changePercent' },
          totalVolume: { $sum: '$volume' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          sector: '$_id',
          performance: '$totalChange',
          volume: '$totalVolume',
          stocksCount: '$count',
          _id: 0
        }
      },
      { $sort: { performance: -1 } }
    ]);
    
    res.json(sectors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMarketOverview,
  getTopGainers,
  getTopLosers,
  getSectorPerformance
};