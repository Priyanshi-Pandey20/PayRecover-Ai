const cron = require('node-cron');
const AbandonedCart = require('../models/AbandonedCart');
const { sendRecoveryEmail } = require('./email');


cron.schedule('*/2 * * * *', async () => {
    console.log(' Checking for abandoned carts...');
    
    try {
        // Check for carts older than 2 minutes (for testing)
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        
        const abandonedCarts = await AbandonedCart.find({
            status: 'active',
            createdAt: { $lt: twoMinutesAgo },
            reminderSentAt: null
        });
        
        console.log(` Found ${abandonedCarts.length} abandoned carts`);
        
        for (const cart of abandonedCarts) {
            const recoveryLink = `http://localhost:3000/checkout?cartId=${cart.cartId}`;
            
            await sendRecoveryEmail({
                email: cart.customer.email,
                name: cart.customer.name || 'Customer',
                amount: cart.totalAmount,
                recoveryLink: recoveryLink,
                orderId: cart.cartId,
                type: 'abandoned_cart'
            });
            
            cart.reminderSentAt = new Date();
            cart.status = 'reminded';
            await cart.save();
            
            console.log(` Reminder sent for cart: ${cart.cartId}`);
        }
    } catch (error) {
        console.error('Cron job error:', error);
    }
});

module.exports = { 
    startCron: () => console.log(' Cron job started (running every 2 minutes for testing)') 
};