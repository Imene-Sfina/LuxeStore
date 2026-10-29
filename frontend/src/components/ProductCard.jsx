import React, { useState } from 'react';
import { ShoppingCart, Trash2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';
 
export default function ProductCard({ product, onDelete }) {
  const { isAdmin } = useAuth();
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
 
  const fallback = `https://placehold.co/400x300/1e1e2a/f0a500?text=${encodeURIComponent(product.name || 'Product')}`;
  const imgSrc = product.image && !imgError ? product.image : fallback;
 
  return (
    <div className="product-card card fade-in">
      <div className="product-img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          onError={() => setImgError(true)}
        />
        <div className="product-overlay">
          <button className="btn btn-primary btn-sm" onClick={() => addItem(product)}>
            <ShoppingCart size={15} />
            Ajouter
          </button>
        </div>
      </div>
 
      <div className="product-info">
        <div className="product-header">
          <Package size={14} className="product-icon" />
          <h3>{product.name}</h3>
        </div>
 
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
 
        <div className="product-footer">
          <span className="product-price">
            {product.price?.toFixed(2)} <span>TND</span>
          </span>
          <div className="product-actions">
            {isAdmin && onDelete && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(product.id)}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}