const express = require('express');
const {
  getAllStocks,
  getStockBySymbol,
  searchStocks,
  getStockHistory
} = require('../controllers/stockController');

const router = express.Router();

router.get('/', getAllStocks);
router.get('/search', searchStocks);
router.get('/:symbol', getStockBySymbol);
router.get('/:symbol/history', getStockHistory);

module.exports = router;