const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const { sendRecoveryEmail } = require('./email');

const triggerRecovery = async (payment) => {
    console.log(`Starting recovery for order: ${payment.orderId}`);

    try {
        // Create new Razorpay order for recovery
        const recoveryOrder = await razorpay.orders.create({
            amount: payment.amount * 100,
            currency: 'INR',
            receipt: 'recovery_' + payment.orderId,
            payment_capture: 1
        });

        // Create payment link
        const paymentLink = await razorpay.paymentLink.create({
            amount: payment.amount * 100,
            currency: 'INR',
            accept_partial: false,
            expire_by: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
            reference_id: recoveryOrder.receipt,
            customer: {
                name: payment.customer?.name || 'Customer',
                email: payment.customer?.email || '',
                contact: payment.customer?.phone || ''
            },
            notify: {
                sms: true,
                email: true
            },
            reminder_enable: true,
            callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
            callback_method: 'get'
        });

        console.log('Recovery link generated:', paymentLink.short_url);

        // Save recovery link
        payment.recoveryLink = paymentLink.short_url;
        payment.recoveryMethod = 'email';
        payment.status = 'retrying';
        await payment.save();

        // Send recovery email
        if (payment.customer?.email) {
            await sendRecoveryEmail({
                email: payment.customer.email,
                name: payment.customer?.name || 'Customer',
                amount: payment.amount,
                recoveryLink: paymentLink.short_url,
                orderId: payment.orderId
            });
            console.log('Recovery email sent!');
        }

        console.log(` Recovery initiated for ${payment.amount}`);

        return {
            success: true,
            recoveryLink: paymentLink.short_url
        };

    } catch (error) {
        console.error('Recovery error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { triggerRecovery };