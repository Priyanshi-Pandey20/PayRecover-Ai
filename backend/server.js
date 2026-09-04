const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const Payment = require('./src/models/Payment');

// Load env
dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Webhook route - uses raw body
const webhookRoutes = require('./src/routes/webhook');
app.use('/api/webhook', webhookRoutes);

// For all other routes, use express.json()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Payment routes
const paymentRoutes = require('./src/routes/payment');
app.use('/api/payment', paymentRoutes);

//  ADD THIS: Cart routes for abandoned cart recovery
const cartRoutes = require('./src/routes/cart');
app.use('/api/cart', cartRoutes);

// Recovery routes
const recoveryRoutes = require('./src/routes/recovery');
app.use('/api/recovery', recoveryRoutes);

// Get all payments
app.get('/api/payments', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        console.error('❌ Error fetching payments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get stats
app.get('/api/stats', async (req, res) => {
    try {
        const total = await Payment.countDocuments();
        const failed = await Payment.countDocuments({ status: 'failed' });
        const recovered = await Payment.countDocuments({ status: 'recovered' });
        
        const failedAmount = await Payment.aggregate([
            { $match: { status: 'failed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recoveredAmount = await Payment.aggregate([
            { $match: { status: 'recovered' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const recoveryRate = (failed + recovered) > 0 
            ? Math.round((recovered / (failed + recovered)) * 100) 
            : 0;

        res.json({
            success: true,
            data: {
                totalPayments: total,
                failedPayments: failed,
                recoveredPayments: recovered,
                failedAmount: failedAmount[0]?.total || 0,
                recoveredAmount: recoveredAmount[0]?.total || 0,
                recoveryRate: recoveryRate
            }
        });
    } catch (error) {
        console.error(' Error fetching stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({
        message: 'PayRecover AI Backend is running!',
        status: 'OK'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` Test API: http://localhost:${PORT}/api/test`);
    console.log(` Payment API: http://localhost:${PORT}/api/payment/create-order`);
    console.log(` Payments List: http://localhost:${PORT}/api/payments`);
    console.log(` Stats: http://localhost:${PORT}/api/stats`);
    console.log(` Cart API: http://localhost:${PORT}/api/cart`);
});

//  ADD THIS: Start cron job for abandoned cart recovery
const cronService = require('./src/services/cron');
cronService.startCron();