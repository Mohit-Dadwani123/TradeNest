const express = require('express');
const {
  getPortfolio,
  getPortfolioPerformance
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getPortfolio);
router.get('/performance', getPortfolioPerformance);

module.exports = router;