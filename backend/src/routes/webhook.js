const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { triggerRecovery } = require('../services/recovery');
const fs = require('fs');
const path = require('path');

router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log(' ===== WEBHOOK RECEIVED =====');
    console.log(' Body length:', req.body ? req.body.length : 0);
    
    try {
        const webhookBody = req.body.toString();
        const webhookSignature = req.headers['x-razorpay-signature'];

        console.log(' Signature received:', webhookSignature);

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'Welcome@123';
        console.log(' Using secret:', secret);

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(webhookBody)
            .digest('hex');

        console.log('Expected signature:', expectedSignature);

        if (expectedSignature !== webhookSignature) {
            console.log(' Signature mismatch! Webhook rejected.');
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const event = JSON.parse(webhookBody);
        console.log(' Webhook verified! Event:', event.event);

        // ========== HANDLE PAYMENT FAILED ==========
        if (event.event === 'payment.failed') {
            const paymentData = event.payload.payment.entity;
            const orderId = paymentData.order_id;

            console.log(` Payment FAILED: ₹${paymentData.amount / 100}`);
            console.log(` Order ID: ${orderId}`);
            console.log(` Reason: ${paymentData.error_description || 'Unknown'}`);

            const payment = await Payment.findOne({ razorpayOrderId: orderId });

            if (payment) {
                // Update payment status
                payment.status = 'failed';
                payment.failureReason = paymentData.error_description || 'Unknown error';
                await payment.save();
                console.log(' Payment updated in database successfully!');

                //  TRIGGER RECOVERY - Generate recovery link! 
                console.log(' TRIGGERING RECOVERY...');
                const recoveryResult = await triggerRecovery(payment);
                
                if (recoveryResult.success) {
                    console.log(` Recovery link generated: ${recoveryResult.recoveryLink}`);
                    
                    // Save recovery data for frontend popup
                    const recoveryData = {
                        recoveryLink: recoveryResult.recoveryLink,
                        amount: payment.amount,
                        orderId: payment.orderId,
                        timestamp: Date.now()
                    };
                    
                    const filePath = path.join(__dirname, '../../recovery-data.json');
                    fs.writeFileSync(filePath, JSON.stringify(recoveryData));
                    console.log(' Recovery data saved for frontend!');
                } else {
                    console.log(' Recovery failed:', recoveryResult.error);
                }
            } else {
                console.log(' Payment not found in database for order:', orderId);
            }
        }

        // ========== HANDLE PAYMENT CAPTURED ==========
        if (event.event === 'payment.captured') {
            const paymentData = event.payload.payment.entity;
            const orderId = paymentData.order_id;

            console.log(` Payment CAPTURED: ₹${paymentData.amount / 100}`);

            const payment = await Payment.findOne({ razorpayOrderId: orderId });

            if (payment && payment.status === 'failed') {
                payment.status = 'recovered';
                payment.recoveredAt = new Date();
                await payment.save();
                console.log(' Payment marked as recovered!');
            }
        }

        res.status(200).json({ success: true });

    } catch (error) {
        console.error(' Webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;