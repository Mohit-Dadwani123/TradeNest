const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id })
      .populate('stocks.stock');
    
    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user._id,
        stocks: []
      });
    }
    
    // Get live prices for watchlist stocks
    const stocksWithPrices = await Promise.all(
      watchlist.stocks.map(async (item) => {
        const stock = await Stock.findById(item.stock);
        return {
          _id: item._id,
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          addedAt: item.addedAt
        };
      })
    );
    
    res.json({ watchlist: stocksWithPrices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;
    
    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    let watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: req.user._id,
        stocks: []
      });
    }
    
    // Check if already in watchlist
    const alreadyExists = watchlist.stocks.some(
      item => item.stock.toString() === stockId
    );
    
    if (alreadyExists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }
    
    watchlist.stocks.push({
      stock: stockId,
      symbol: stock.symbol,
      addedAt: Date.now()
    });
    
    await watchlist.save();
    
    res.status(201).json({ message: 'Added to watchlist', stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/watchlist/:stockId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ user: req.user._id });
    
    if (!watchlist) {
      return res.status(404).json({ message: 'Watchlist not found' });
    }
    
    watchlist.stocks = watchlist.stocks.filter(
      item => item.stock.toString() !== req.params.stockId
    );
    
    await watchlist.save();
    
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist
};