import React from 'react';
import { useNavigate } from 'react-router-dom';

const AbandonedCartPopup = ({ isOpen, onClose, cartItems, totalAmount, customerEmail, onRecover }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleRecover = () => {
        onRecover();
        navigate('/checkout', { state: { cart: cartItems } });
    };

    return (
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
                border: '1px solid #8b5cf6',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '22px',
                        cursor: 'pointer',
                        color: '#94a3b8'
                    }}
                >
                    ✕
                </button>

                <div style={{ fontSize: '52px', marginBottom: '8px' }}>🛒</div>
                <h2 style={{ color: '#8b5cf6', fontSize: '22px', marginBottom: '6px' }}>
                    You left items in your cart!
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '4px' }}>
                    You have <strong style={{ color: '#ffffff' }}>{cartItems?.length || 0}</strong> items worth
                </p>
                <p style={{ color: '#8b5cf6', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {totalAmount || 0}
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '18px' }}>
                     We'll send a reminder to <strong style={{ color: '#ffffff' }}>{customerEmail}</strong>
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleRecover}
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: 'bold'
                        }}
                    >
                        ✅ Complete Order Now
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#2d1b4e',
                            color: '#e2e8f0',
                            border: 'none',
                            padding: '12px 22px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default AbandonedCartPopup;