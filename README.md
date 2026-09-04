PAYRECOVER AI - AI-POWERED REVENUE RECOVERY SYSTEM

PayRecover AI is an intelligent revenue recovery system built for the Razorpay Buildathon (Track 03: AI Revenue Recovery). It detects payment failures, generates recovery links, and recovers lost revenue automatically.

PROBLEM STATEMENT

Businesses lose revenue daily due to payment failures, checkout abandonment, subscription failures, and overdue invoices. PayRecover AI solves this by detecting revenue at risk, determining the right intervention, and executing a recovery workflow.

FEATURES

Payment Failure Recovery: Detects failed payments via Razorpay webhooks, generates unique recovery links automatically, and sends recovery links to customers via email or popup.

Abandoned Cart Recovery: Detects when users leave items in cart, shows popup reminder after inactivity, and provides one-click recovery to checkout.

Checkout Drop-off Recovery: Detects when users stop on checkout page, shows popup to complete payment, and directs user to complete transaction.

Revenue Dashboard: Shows total payments, displays failed and recovered payments, calculates recovery rate, shows money recovered, and provides complete audit trail of all transactions.

TECH STACK

Backend: Node.js, Express.js, MongoDB/Mongoose, Razorpay API, Nodemailer, Node-Cron

Frontend: React.js, React Router, Axios, Chart.js, React Toastify

Tools: Ngrok (for webhook testing), Git/GitHub

ARCHITECTURE

E-Commerce Store (React) -> Payment Gateway (Razorpay) -> Webhook Handler (payment.failed) -> Recovery Engine (generates links) -> Recovery Popup/Email (notifies customer) -> Customer pays via recovery link -> Dashboard (shows recovered money)

INSTALLATION

Prerequisites: Node.js (v16+), MongoDB (local or Atlas), Razorpay Account (Test Mode), Ngrok (for webhook testing)

Steps:

Clone the repository: git clone https://github.com/Priyanshi-Pandey20/PayRecover-AI.git and cd PayRecover-AI

Install Backend Dependencies: cd backend and npm install

Install Frontend Dependencies: cd frontend and npm install

Create .env file in backend folder with: PORT=5000, MONGODB_URI=mongodb://127.0.0.1:27017/payrecover, RAZORPAY_KEY_ID=your_razorpay_key_id, RAZORPAY_KEY_SECRET=your_razorpay_key_secret, RAZORPAY_WEBHOOK_SECRET=your_webhook_secret, EMAIL_USER=your_email@gmail.com, EMAIL_PASS=your_app_password, FRONTEND_URL=http://localhost:3000

Start Backend: cd backend and npm run dev

Start Frontend: cd frontend and npm start

Start Ngrok for webhooks: ngrok http 5000

Configure Razorpay Webhook with URL: https://your-ngrok-url/api/webhook/razorpay and Events: payment.failed and payment.captured

TESTING

Test Cards:

4111 1111 1111 1111 for Success

4000 0000 0000 0002 for Failure

Test Flow:

Add items to cart

Checkout with success card -> Payment succeeds

Checkout with failure card -> Payment fails

Recovery popup appears with link

Click link -> Pay with success card

Dashboard shows recovered money

API ENDPOINTS

POST /api/payment/create-order - Create Razorpay order
POST /api/webhook/razorpay - Handle Razorpay webhooks
GET /api/payments - Get all payments
GET /api/stats - Get recovery statistics
GET /api/recovery/data - Get recovery link data
POST /api/cart/track - Track abandoned cart

PROJECT STRUCTURE

payrecover-ai/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ ├── database.js
│ │ │ └── razorpay.js
│ │ ├── models/
│ │ │ ├── Payment.js
│ │ │ └── AbandonedCart.js
│ │ ├── routes/
│ │ │ ├── payment.js
│ │ │ ├── webhook.js
│ │ │ ├── cart.js
│ │ │ └── recovery.js
│ │ └── services/
│ │ ├── recovery.js
│ │ ├── email.js
│ │ └── cron.js
│ ├── .env
│ ├── server.js
│ └── package.json
├── frontend/
│ ├── public/
│ │ └── images/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Navbar.js
│ │ │ ├── ProductCard.js
│ │ │ ├── SummaryCards.js
│ │ │ ├── PaymentTable.js
│ │ │ ├── RecoveryPopup.js
│ │ │ └── AbandonedCartPopup.js
│ │ ├── pages/
│ │ │ ├── Products.js
│ │ │ ├── Checkout.js
│ │ │ ├── Dashboard.js
│ │ │ └── Success.js
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── styles/
│ │ │ └── App.css
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
└── products/
└── products.json

DEMO FLOW

Successful Payment: Add items to cart -> Checkout -> Success card -> Payment succeeds

Payment Failure: Add items to cart -> Checkout -> Failure card -> Payment fails

Recovery: Webhook detects failure -> Recovery link generated -> Popup appears -> Click link -> Pay with success card -> Payment succeeds

Dashboard: Shows total payments, failed, recovered, recovery rate, and money recovered

TRACK 03 ALIGNMENT

Detect revenue at risk: Webhook catches payment.failed events
Determine intervention: AI generates recovery link instantly
Execute recovery workflow: Customer clicks link -> pays -> money recovered
Payment degradation -> recovery: Failed payment -> Root cause -> Recovery link
Show measured money recovered: Dashboard shows recovered amount and recovery rate
Audit trail: Complete transaction history in dashboard

AUTHOR: Priyanshi Pandey



