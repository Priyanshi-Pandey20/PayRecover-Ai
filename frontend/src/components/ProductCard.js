import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="product-card">
            <img 
                src={product.image} 
                alt={product.name}
                style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    margin: '8px auto',
                    display: 'block',
                    border: '1px solid #E8E0D4'
                }}
                onError={(e) => {
                    e.target.src = 'https://picsum.photos/seed/default/200/200';
                }}
            />
            <h3>{product.name}</h3>
            <p className="price">₹{product.price}</p>
            <button onClick={() => onAddToCart(product)}>
                 Add to Cart
            </button>
        </div>
    );
};

export default ProductCard;