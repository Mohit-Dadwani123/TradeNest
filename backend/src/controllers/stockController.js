const Stock = require('../models/Stock');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public
const getAllStocks = async (req, res) => {
  try {
    const { page = 1, limit = 50, sector, search } = req.query;
    const query = {};
    
    if (sector) query.sector = sector;
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    const stocks = await Stock.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ symbol: 1 });
    
    const total = await Stock.countDocuments(query);
    
    res.json({
      stocks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get stock by symbol
// @route   GET /api/stocks/:symbol
// @access  Public
const getStockBySymbol = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    res.json(stock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search stocks
// @route   GET /api/stocks/search
// @access  Public
const searchStocks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query required' });
    }
    
    const stocks = await Stock.find({
      $or: [
        { symbol: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    }).limit(20);
    
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get stock historical data
// @route   GET /api/stocks/:symbol/history
// @access  Public
const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1d', range = '1mo' } = req.query;
    
    // For now, return mock historical data
    // In production, integrate with real stock API
    const history = generateMockHistory(range);
    
    res.json({ symbol, interval, range, history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate mock historical data
const generateMockHistory = (range) => {
  const data = [];
  const days = range === '1d' ? 1 : range === '1wk' ? 7 : range === '1mo' ? 30 : 90;
  let basePrice = 2000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * 100;
    basePrice += change;
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(100, basePrice),
      volume: Math.floor(Math.random() * 1000000) + 100000
    });
  }
  
  return data;
};

module.exports = {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getStockHistory
};