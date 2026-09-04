import React from 'react';

const Cart = ({ cart, onRemoveItem, onCheckout }) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cart.length === 0) {
        return (
            <div className="cart-container">
                <h3> Your Cart</h3>
                <p>Cart is empty</p>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h3> Your Cart</h3>
            {cart.map((item, index) => (
                <div key={index} className="cart-item">
                    <span>{item.name} - ₹{item.price}</span>
                    <button onClick={() => onRemoveItem(index)}>✕</button>
                </div>
            ))}
            <div className="cart-total">
                <strong>Total: ₹{total}</strong>
                <button className="checkout-btn" onClick={onCheckout}>
                    Checkout →
                </button>
            </div>
        </div>
    );
};

export default Cart;