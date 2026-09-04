import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart } = location.state || { cart: [] };
    
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    //  Show popup after 5 seconds of inactivity on checkout page
    useEffect(() => {
        let inactivityTimer;

        const showCheckoutPopup = () => {
            if (totalAmount > 0 && customer.email) {
                console.log(' SHOWING CHECKOUT POPUP!');
                setShowPopup(true);
                toast.warning(' Complete your payment!', {
                    position: "top-right",
                    autoClose: 4000,
                });
            }
        };

        const startInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            if (totalAmount > 0 && customer.email) {
                inactivityTimer = setTimeout(showCheckoutPopup, 30000);
            }
        };

        // Reset timer on user activity
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            if (totalAmount > 0 && customer.email) {
                inactivityTimer = setTimeout(showCheckoutPopup, 80000);
            }
        };

        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        activityEvents.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        if (totalAmount > 0 && customer.email) {
            startInactivityTimer();
        }

        return () => {
            clearTimeout(inactivityTimer);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [totalAmount, customer.email]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!customer.name || !customer.email || !customer.phone) {
            toast.error('Please fill all customer details!');
            return;
        }

        setLoading(true);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
                return;
            }

            const data = await createOrder(totalAmount, customer);
            
            if (!data.success) {
                toast.error('Failed to create order. Please try again.');
                return;
            }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'FashionHub',
                description: 'Order Payment',
                order_id: data.orderId,
                handler: function (response) {
                    console.log('Payment success:', response);
                    toast.success(' Payment Successful!');
                    navigate('/payment-success', { 
                        state: { 
                            paymentId: response.razorpay_payment_id,
                            amount: totalAmount,
                            orderId: data.orderId
                        }
                    });
                },
                prefill: {
                    name: customer.name,
                    email: customer.email,
                    contact: customer.phone
                },
                modal: {
                    ondismiss: function() {
                        console.log('Checkout closed');
                        setLoading(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = () => {
        setShowPopup(false);
        handlePayment();
    };

    const handleDismissPopup = () => {
        setShowPopup(false);
        toast.info('Continue filling your details!', {
            position: "bottom-center",
            autoClose: 2000,
        });
    };

    if (cart.length === 0) {
        return <h2> Cart is empty! <a href="/">Continue Shopping</a></h2>;
    }

    return (
        <div className="checkout-page">
            <ToastContainer />
            
            <h1> Checkout</h1>

            <div className="checkout-grid">
                <div className="order-summary">
                    <h3>Your Order</h3>
                    {cart.map((item, index) => (
                        <div key={index} className="order-item">
                            <span>{item.icon} {item.name}</span>
                            <span>₹{item.price}</span>
                        </div>
                    ))}
                    <div className="order-total">
                        <strong>Total:</strong>
                        <strong>₹{totalAmount}</strong>
                    </div>
                </div>

                <div className="customer-details">
                    <h3>Customer Details</h3>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    />

                    <button onClick={handlePayment} disabled={loading} className="pay-btn">
                        {loading ? ' Processing...' : `PAY ₹${totalAmount}`}
                    </button>

                    <div className="test-cards">
                        <p><strong> Test Cards:</strong></p>
                        <p> Failure: <strong>4000 0000 0000 0002</strong> (Insufficient funds)</p>
                        <p> Success: <strong>4111 1111 1111 1111</strong> (Works perfectly)</p>
                        <p> CVV: 123 | Expiry: 12/26</p>
                    </div>
                </div>
            </div>

            {/*  CHECKOUT POPUP - "MAKE PAYMENT NOW" */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: '#1a1a2e',
                        padding: '35px',
                        borderRadius: '16px',
                        maxWidth: '450px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '8px' }}></div>
                        <h2 style={{ color: '#ffffff', fontSize: '22px', marginBottom: '6px' }}>Complete Your Payment!</h2>
                        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '4px' }}>
                            You have an order worth <strong>₹{totalAmount}</strong> ready to pay!
                        </p>
                        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                             We noticed you stopped. Complete your payment now!
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={handlePayNow}
                                style={{
                                    background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)'
                                }}
                            >
                                 Complete Payment Now
                            </button>
                            <button
                                onClick={handleDismissPopup}
                                style={{
                                    background: '#f0f0f0',
                                    color: '#666',
                                    border: 'none',
                                    padding: '14px 24px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }}
                            >
                                Continue
                            </button>
                        </div>
                        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '15px' }}>
                             Popup appears after 5 seconds of inactivity
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default Checkout;