import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Minus, Plus, ArrowRight, ShoppingBag,
  CheckCircle, Printer, Home, Calendar, Package, Receipt
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import Toast from '../components/Toast';
import './Cart.css';
 
export default function Cart() {
  const { items, removeItem, updateQty, clear, total, count } = useCart();
  const { user } = useAuth();
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [facture, setFacture]   = useState(null);
  const navigate = useNavigate();
 
  const handleOrder = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        quantity: i.quantity,
        product: { id: i.product.id }
      }));
 
      await orderService.place({ total, items: orderItems });
 
      const factureData = {
        date: new Date(),
        client: user.name || user.email,
        items: items.map(i => ({ ...i })),
        total,
        numero: 'CMD-' + Date.now().toString().slice(-6)
      };
 
      clear();
      setFacture(factureData);
    } catch {
      setToast({ msg: 'Erreur lors de la commande', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
 
  /* ─── FACTURE ─────────────────────────────────── */
  if (facture) {
    const { date, client, items: fi, total: ft, numero } = facture;
    return (
      <div className="container facture-page">
        <div className="facture-card card fade-in">
 
          <div className="facture-header">
            <div className="facture-success-icon"><CheckCircle size={48} /></div>
            <h1>Commande confirmée !</h1>
            <p>Merci pour votre achat. Voici votre reçu.</p>
          </div>
 
          <div className="facture-body" id="facture-print">
 
            <div className="facture-store">
              <span className="facture-store-name">✦ LuxeStore</span>
              <span className="facture-store-sub">Votre boutique de confiance</span>
            </div>
 
            <div className="facture-divider dashed" />
 
            <div className="facture-meta">
              <div className="facture-meta-row">
                <span className="facture-meta-label"><Receipt size={13} /> N° Commande</span>
                <span className="facture-meta-value">{numero}</span>
              </div>
              <div className="facture-meta-row">
                <span className="facture-meta-label"><Calendar size={13} /> Date</span>
                <span className="facture-meta-value">
                  {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {' à '}
                  {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="facture-meta-row">
                <span className="facture-meta-label"><Package size={13} /> Client</span>
                <span className="facture-meta-value">{client}</span>
              </div>
            </div>
 
            <div className="facture-divider dashed" />
 
            {/* Tableau produits */}
            <div className="facture-items">
              <div className="facture-items-header">
                <span>Produit</span>
                <span>Qté</span>
                <span>Prix unit.</span>
                <span>Sous-total</span>
              </div>
              {fi.map(({ product, quantity }) => (
                <div key={product.id} className="facture-item-row">
                  <span className="facture-item-name">{product.name}</span>
                  <span className="facture-item-qty">× {quantity}</span>
                  <span className="facture-item-pu">{product.price.toFixed(2)} TND</span>
                  <span className="facture-item-total">
                    {(product.price * quantity).toFixed(2)} TND
                  </span>
                </div>
              ))}
            </div>
 
            <div className="facture-divider" />
 
            {/* Récap prix */}
            <div className="facture-recap">
              <div className="facture-recap-row">
                <span>Nombre d'articles</span>
                <span>{fi.reduce((s, i) => s + i.quantity, 0)} article(s)</span>
              </div>
              <div className="facture-recap-row">
                <span>Livraison</span>
                <span className="gratuit">Gratuite</span>
              </div>
            </div>
 
            <div className="facture-divider dashed" />
 
            <div className="facture-total-row">
              <span>TOTAL À PAYER</span>
              <span className="facture-total-amount">{ft.toFixed(2)} TND</span>
            </div>
 
            <div className="facture-divider dashed" />
            <p className="facture-thanks">Merci de votre confiance ! À bientôt 🙏</p>
          </div>
 
          <div className="facture-actions">
            <button className="btn btn-ghost" onClick={() => window.print()}>
              <Printer size={16} /> Imprimer
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <Home size={16} /> Retour à la boutique
            </button>
          </div>
        </div>
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }
 
  /* ─── PANIER VIDE ─────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: '100px' }}>
          <ShoppingCart size={52} />
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des produits depuis la boutique.</p>
          <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/')}>
            <ShoppingBag size={16} /> Continuer mes achats
          </button>
        </div>
      </div>
    );
  }
 
  /* ─── PANIER ──────────────────────────────────── */
  return (
    <div className="container cart-page">
      <div className="page-header">
        <h1>Mon Panier</h1>
        <p>{count} article{count !== 1 ? 's' : ''} sélectionné{count !== 1 ? 's' : ''}</p>
      </div>
 
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item card fade-in">
              <div className="cart-item-img">
                <img
                  src={product.image || `https://placehold.co/120x90/1e1e2a/f0a500?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  onError={e => { e.target.src = `https://placehold.co/120x90/1e1e2a/f0a500?text=Img`; }}
                />
              </div>
              <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p className="cart-item-price">{product.price?.toFixed(2)} TND</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button onClick={() => updateQty(product.id, quantity - 1)}><Minus size={14} /></button>
                  <span>{quantity}</span>
                  <button onClick={() => updateQty(product.id, quantity + 1)}><Plus size={14} /></button>
                </div>
                <span className="cart-item-sub">{(product.price * quantity).toFixed(2)} TND</span>
                <button className="cart-remove" onClick={() => removeItem(product.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
 
        <div className="cart-summary card">
          <h2 className="summary-title">Récapitulatif</h2>
          <div className="summary-rows">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="summary-row">
                <span>{product.name} × {quantity}</span>
                <span>{(product.price * quantity).toFixed(2)} TND</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span className="total-amount">{total.toFixed(2)} TND</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: '20px' }}
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? <span className="btn-spinner" /> : <>Passer la commande <ArrowRight size={17} /></>}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
            onClick={() => navigate('/')}
          >
            <ShoppingBag size={15} /> Continuer mes achats
          </button>
        </div>
      </div>
 
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}