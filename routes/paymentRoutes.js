const express = require('express');
const router = express.Router();
const { createCheckout } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/payment/checkout
// @desc    Create Stripe Checkout Session
// @access  Private
router.post('/checkout', authMiddleware, createCheckout);

// Note: The webhook route is registered in server.js with raw body parser
// This is because Stripe requires the raw body for signature verification

module.exports = router;
