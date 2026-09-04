const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayOrderId: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    customer: {
        name: String,
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'failed', 'recovered', 'retrying'],
        default: 'created'
    },
    failureReason: {
        type: String,
        default: null
    },
    recoveryLink: {
        type: String,
        default: null
    },
    recoveryMethod: {
        type: String,
        enum: ['email', 'sms', 'whatsapp', 'retry', null],
        default: null
    },
    retryCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    recoveredAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);