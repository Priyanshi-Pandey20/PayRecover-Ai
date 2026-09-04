const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { triggerRecovery } = require('../services/recovery');

// Get recovery link for a failed payment
router.get('/link/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }
        
        res.json({
            success: true,
            recoveryLink: payment.recoveryLink,
            amount: payment.amount,
            orderId: payment.orderId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;