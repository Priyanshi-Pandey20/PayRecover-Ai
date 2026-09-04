const express = require('express');
const router = express.Router();
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');

// Create order for checkout
router.post('/create-order', async (req, res) => {
    console.log(' ===== CREATE ORDER REQUEST =====');
    console.log(' Body:', req.body);
    
    try {
        const { amount, currency, customer } = req.body;
        
        console.log(' Amount received:', amount);

        // Validate amount
        if (!amount || amount <= 0) {
            console.log(' Invalid amount:', amount);
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid amount. Amount must be greater than 0.' 
            });
        }

        const options = {
            amount: amount * 100,
            currency: currency || 'INR',
            receipt: 'order_' + Date.now(),
            payment_capture: 1
        };

        console.log(' Creating Razorpay order with options:', options);

        const order = await razorpay.orders.create(options);
        console.log(' Razorpay order created:', order.id);

        const payment = new Payment({
            orderId: order.receipt,
            razorpayOrderId: order.id,
            amount: amount,
            currency: order.currency,
            customer: customer,
            status: 'created'
        });

        await payment.save();
        console.log(' Payment saved to database');

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TXGbT8iLeaC1kH'
        });

    } catch (error) {
        console.error(' Order creation error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: error.response?.data?.error?.description || error.message 
        });
    }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const crypto = require('crypto');
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'paid' }
            );
            res.json({ success: true, message: 'Payment verified!' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;