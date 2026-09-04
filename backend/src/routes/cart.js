const express = require('express');
const router = express.Router();
const AbandonedCart = require('../models/AbandonedCart');

// Track cart abandonment
router.post('/track', async (req, res) => {
    try {
        const { customer, items, totalAmount } = req.body;
        
        let cart = await AbandonedCart.findOne({ 
            'customer.email': customer.email,
            status: 'active'
        });
        
        if (cart) {
            cart.items = items;
            cart.totalAmount = totalAmount;
            cart.createdAt = new Date();
            await cart.save();
        } else {
            cart = new AbandonedCart({
                cartId: 'cart_' + Date.now(),
                customer: customer,
                items: items,
                totalAmount: totalAmount
            });
            await cart.save();
        }
        
        res.json({ success: true, cartId: cart.cartId });
    } catch (error) {
        console.error('Cart tracking error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get abandoned carts
router.get('/abandoned', async (req, res) => {
    try {
        const carts = await AbandonedCart.find({ status: 'active' })
            .sort({ createdAt: -1 });
        res.json({ success: true, data: carts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Recover cart
router.post('/recover/:cartId', async (req, res) => {
    try {
        const cart = await AbandonedCart.findOne({ cartId: req.params.cartId });
        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }
        
        cart.status = 'recovered';
        cart.recoveredAt = new Date();
        await cart.save();
        
        res.json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;