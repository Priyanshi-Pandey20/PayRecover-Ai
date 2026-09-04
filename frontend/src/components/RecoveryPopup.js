import React from 'react';

const RecoveryPopup = ({ isOpen, onClose, recoveryLink, amount, orderId }) => {
    if (!isOpen) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(recoveryLink);
        alert(' Recovery link copied to clipboard!');
    };

    return (
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
                padding: '35px',
                borderRadius: '16px',
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔗</div>
                <h2 style={{ marginBottom: '8px', color: '#1a1a1a' }}>
                    Recovery Link Generated!
                </h2>
                <p style={{ color: '#666', fontSize: '15px', marginBottom: '5px' }}>
                    Amount: <strong style={{ color: '#6c63ff', fontSize: '20px' }}>₹{amount}</strong>
                </p>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '15px' }}>
                    Order ID: {orderId}
                </p>
                
                <div style={{
                    background: '#f5f5f5',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    wordBreak: 'break-all',
                    fontSize: '13px',
                    color: '#333',
                    border: '1px solid #e0e0e0'
                }}>
                    <strong>Link:</strong> {recoveryLink}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a
                        href={recoveryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: 'linear-gradient(135deg, #6c63ff, #5a52d5)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            boxShadow: '0 4px 15px rgba(108, 99, 255, 0.3)'
                        }}
                    >
                         Open Payment Link
                    </a>
                    <button
                        onClick={handleCopyLink}
                        style={{
                            background: '#f0f0f0',
                            color: '#333',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                         Copy Link
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            color: '#999',
                            border: '1px solid #ddd',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px'
                        }}
                    >
                        ✕ Close
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default RecoveryPopup;