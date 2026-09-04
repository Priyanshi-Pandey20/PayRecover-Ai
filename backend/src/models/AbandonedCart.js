const mongoose = require('mongoose');

const AbandonedCartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        name: String,
        email: String,
        phone: String
    },
    items: [{
        name: String,
        price: Number,
        quantity: Number,
        icon: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'reminded', 'recovered', 'expired'],
        default: 'active'
    },
    reminderSentAt: {
        type: Date,
        default: null
    },
    recoveredAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AbandonedCart', AbandonedCartSchema);