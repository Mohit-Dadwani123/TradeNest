const express = require('express');
const {
  placeOrder,
  getUserOrders,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes require authentication

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.delete('/:id', cancelOrder);

module.exports = router;