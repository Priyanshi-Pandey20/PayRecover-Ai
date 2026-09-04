import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const [cart, setCart] = useState([]);
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupTimer, setPopupTimer] = useState(null);
    const navigate = useNavigate();

    //  Updated with your image filenames
    const products = [
        { 
            id: 1, 
            name: 'Premium T-Shirt', 
            price: 1500, 
            image: '/images/tshirt.avif' 
        },
        { 
            id: 2, 
            name: 'Denim Jeans', 
            price: 2500, 
            image: '/images/jeans.avif' 
        },
        { 
            id: 3, 
            name: 'Sports Sneakers', 
            price: 3500, 
            image: '/images/sneaker.jpg' 
        },
        { 
            id: 4, 
            name: 'Smart Watch', 
            price: 4500, 
            image: '/images/watch.jpg' 
        },
        { 
            id: 5, 
            name: 'Wireless Headphones', 
            price: 3000, 
            image: '/images/headphone.jpg' 
        },
        { 
            id: 6, 
            name: 'Backpack', 
            price: 2000, 
            image: '/images/bagpack.jpg' 
        },
    ];

    const getTotalItems = () => cart.length;
    const getTotalAmount = () => cart.reduce((sum, item) => sum + item.price, 0);

    //  Function to show popup
    const showAbandonedCartPopup = () => {
        if (cart.length > 0 && customerEmail && !showPopup) {
            console.log(' SHOWING POPUP NOW!');
            setShowPopup(true);
            toast.warning(' You left items in your cart!', {
                position: "top-right",
                autoClose: 4000,
            });
        }
    };

    //  Start timer when cart has items and email is set
    useEffect(() => {
        console.log('Checking conditions:', { cartLength: cart.length, email: customerEmail });
        
        if (popupTimer) {
            clearTimeout(popupTimer);
            setPopupTimer(null);
        }

        if (cart.length > 0 && customerEmail) {
            console.log(' Starting 5-second timer...');
            const timer = setTimeout(() => {
                showAbandonedCartPopup();
            }, 5000);
            setPopupTimer(timer);
        }

        return () => {
            if (popupTimer) {
                clearTimeout(popupTimer);
            }
        };
    }, [cart.length, customerEmail]);

    //  Track cart when items are added
    const trackAbandonedCart = async () => {
        if (cart.length === 0) return;
        
        try {
            const email = customerEmail || 'guest@example.com';
            const phone = customerPhone || '9876543210';
            
            console.log(' Tracking cart...');
            await axios.post('http://localhost:5000/api/cart/track', {
                customer: {
                    name: 'Guest',
                    email: email,
                    phone: phone
                },
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    image: item.image
                })),
                totalAmount: getTotalAmount()
            });
            
            console.log(' Cart tracked successfully!');
        } catch (error) {
            console.error('Cart tracking error:', error.response?.data || error.message);
        }
    };

    // Track cart 3 seconds after adding items
    useEffect(() => {
        if (cart.length > 0) {
            const timer = setTimeout(() => {
                trackAbandonedCart();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [cart]);

    const addToCart = (product) => {
        console.log(' Adding to cart:', product.name);
        setCart(prevCart => [...prevCart, product]);
        toast.success(` Added ${product.name} to cart!`, {
            position: "bottom-center",
            autoClose: 1500,
        });
    };

    const goToCheckout = () => {
        if (cart.length === 0) {
            toast.error('Please add items to cart first!');
            return;
        }
        setShowPopup(false);
        navigate('/checkout', { state: { cart } });
    };

    const handleDismissPopup = () => {
        setShowPopup(false);
        toast.info('Continue shopping! We\'ll keep your cart saved.', {
            position: "bottom-center",
            autoClose: 2000,
        });
    };

    return (
        <div className="products-page">
            <ToastContainer />
            
            <h1> FashionHub Store</h1>
            <p style={{ color: '#6B655A', marginBottom: '10px' }}>
                Shop the latest collection with AI-powered payment recovery!
            </p>

            <div className="email-input-container">
                <label> For cart recovery:</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <span className={`status ${customerEmail ? 'success' : 'warning'}`}>
                    {customerEmail ? ' Email set' : ' Add email to get recovery reminders'}
                </span>
            </div>

            <div className="cart-bar">
                <span>
                     Cart: <strong>{getTotalItems()}</strong> items 
                    | Total: <strong>₹{getTotalAmount()}</strong>
                </span>
                <button className="checkout-btn" onClick={goToCheckout}>
                    Checkout →
                </button>
            </div>

            <div className="test-info">
                <h4>Test Mode Instructions</h4>
                <p>Use card: <strong>4000 0000 0000 0002</strong> → Payment <strong>FAILS</strong></p>
                <p>Use card: <strong>4111 1111 1111 1111</strong> → Payment <strong>SUCCEEDS</strong></p>
                <p>CVV: 123 | Expiry: 12/26</p>
            </div>

            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                    />
                ))}
            </div>

            {/*  POPUP */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '16px',
                        maxWidth: '480px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ fontSize: '56px', marginBottom: '10px' }}></div>
                        <h2 style={{ marginBottom: '8px' }}>You left items in your cart!</h2>
                        <p style={{ color: '#666', fontSize: '16px' }}>
                            You have <strong>{cart.length}</strong> items worth
                        </p>
                        <p style={{ color: '#D4A574', fontSize: '28px', fontWeight: 'bold' }}>
                            ₹{getTotalAmount()}
                        </p>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                             We'll send a reminder to <strong>{customerEmail}</strong>
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={goToCheckout}
                                style={{
                                    background: '#2D2A24',
                                    color: '#EAE2D6',
                                    border: 'none',
                                    padding: '14px 32px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 15px rgba(45, 42, 36, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#D4A574';
                                    e.target.style.color = '#2D2A24';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#2D2A24';
                                    e.target.style.color = '#EAE2D6';
                                }}
                            >
                                 Complete Order Now
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
                                Continue Shopping
                            </button>
                        </div>
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

export default Products;