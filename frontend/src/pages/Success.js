import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const { paymentId, amount, orderId } = location.state || {};

    return (
        <div className="success-page">
            <div className="success-card">
                <div className="icon"></div>
                <h1>Payment Successful!</h1>
                <p>Your payment of <strong>₹{amount}</strong> was completed successfully.</p>
                {paymentId && <p style={{ fontSize: '14px', color: '#666' }}>Payment ID: {paymentId}</p>}
                {orderId && <p style={{ fontSize: '14px', color: '#666' }}>Order ID: {orderId}</p>}
                <Link to="/" className="home-btn"> Continue Shopping</Link>
            </div>
        </div>
    );
};

export default Success;