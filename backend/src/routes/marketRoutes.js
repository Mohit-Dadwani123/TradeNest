const express = require('express');
const {
  getMarketOverview,
  getTopGainers,
  getTopLosers,
  getSectorPerformance
} = require('../controllers/marketController');

const router = express.Router();

router.get('/overview', getMarketOverview);
router.get('/top-gainers', getTopGainers);
router.get('/top-losers', getTopLosers);
router.get('/sectors', getSectorPerformance);

module.exports = router;