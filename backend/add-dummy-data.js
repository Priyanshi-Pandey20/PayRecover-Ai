const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Payment = require('./src/models/Payment');

dotenv.config();

const dummyPayments = [
    {
        orderId: 'order_demo_001',
        razorpayOrderId: 'order_demo_001',
        amount: 3500,
        currency: 'INR',
        customer: {
            name: 'Priyanshi Pandey',
            email: 'priyanshi@example.com',
            phone: '9876543210'
        },
        status: 'recovered',
        failureReason: 'Insufficient funds',
        recoveryLink: 'https://rzp.io/demo/001',
        recoveryMethod: 'email',
        retryCount: 1,
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        recoveredAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
        orderId: 'order_demo_002',
        razorpayOrderId: 'order_demo_002',
        amount: 4500,
        currency: 'INR',
        customer: {
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '9876543211'
        },
        status: 'recovered',
        failureReason: 'Card declined',
        recoveryLink: 'https://rzp.io/demo/002',
        recoveryMethod: 'email',
        retryCount: 2,
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        recoveredAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
        orderId: 'order_demo_003',
        razorpayOrderId: 'order_demo_003',
        amount: 8000,
        currency: 'INR',
        customer: {
            name: 'Sneha Patel',
            email: 'sneha@example.com',
            phone: '9876543212'
        },
        status: 'recovered',
        failureReason: 'Bank timeout',
        recoveryLink: 'https://rzp.io/demo/003',
        recoveryMethod: 'email',
        retryCount: 1,
        createdAt: new Date(Date.now() - 90 * 60 * 1000),
        recoveredAt: new Date(Date.now() - 75 * 60 * 1000)
    },
    {
        orderId: 'order_demo_004',
        razorpayOrderId: 'order_demo_004',
        amount: 2500,
        currency: 'INR',
        customer: {
            name: 'Amit Kumar',
            email: 'amit@example.com',
            phone: '9876543213'
        },
        status: 'failed',
        failureReason: 'Insufficient balance',
        recoveryLink: null,
        recoveryMethod: null,
        retryCount: 0,
        createdAt: new Date(Date.now() - 120 * 60 * 1000),
        recoveredAt: null
    },
    {
        orderId: 'order_demo_005',
        razorpayOrderId: 'order_demo_005',
        amount: 6000,
        currency: 'INR',
        customer: {
            name: 'Neha Singh',
            email: 'neha@example.com',
            phone: '9876543214'
        },
        status: 'failed',
        failureReason: 'Invalid card',
        recoveryLink: null,
        recoveryMethod: null,
        retryCount: 0,
        createdAt: new Date(Date.now() - 180 * 60 * 1000),
        recoveredAt: null
    }
];

async function addDummyData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/payrecover');
        console.log('✅ Connected to MongoDB');
        
        // Clear existing dummy data (optional)
        await Payment.deleteMany({ orderId: { $regex: '^order_demo_' } });
        console.log('🗑️ Cleared old dummy data');
        
        // Insert dummy payments
        const result = await Payment.insertMany(dummyPayments);
        console.log(`✅ Added ${result.length} dummy payments`);
        
        // Show summary
        const stats = await Payment.aggregate([
            { $match: { orderId: { $regex: '^order_demo_' } } },
            { $group: {
                _id: '$status',
                count: { $sum: 1 },
                total: { $sum: '$amount' }
            }}
        ]);
        console.log('📊 Summary:', stats);
        
        await mongoose.disconnect();
        console.log('✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addDummyData();