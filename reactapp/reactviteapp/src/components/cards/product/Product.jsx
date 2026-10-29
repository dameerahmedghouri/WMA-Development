import React from "react";
import "./Product.css";

// Humne 'product' ko as a prop pass kiya hai
export default function ProductCard({ product }) {
  // Agar kisi wajah se product ka data na mile to crash na ho
  if (!product) return null;

  return (
    <div className="product-card">
      <div className="badge">{product.category}</div>
      
      <div className="product-tumb">
        <img src={product.image} alt={product.title} />
      </div>
      
      <div className="product-details">
        <h4 className="product-title" title={product.title}>
          {product.title}
        </h4>
        
        {product.rating && (
          <div className="product-rating">
            <span className="stars">⭐ {product.rating.rate}</span>
            <span className="count">({product.rating.count} reviews)</span>
          </div>
        )}
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-bottom-details">
          <div className="product-price">${product.price?.toFixed(2)}</div>
          <button className="add-to-cart-btn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
