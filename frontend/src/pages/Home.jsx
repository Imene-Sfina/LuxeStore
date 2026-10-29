import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    productService.getAll()
      .then(({ data }) => { setProducts(data); setFiltered(data); })
      .catch(() => setToast({ msg: 'Erreur de chargement des produits', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    ));
  }, [search, products]);

  return (
    <div className="home-page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge">
            <ShoppingBag size={14} />
            Nouvelle collection
          </div>
          <h1 className="hero-title">
            Découvrez notre<br />
            <span className="hero-accent">Boutique</span>
          </h1>
          <p className="hero-sub">
            Des produits sélectionnés avec soin, livrés chez vous.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        {/* Search bar */}
        <div className="search-bar card">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
          <div className="search-count">
            <Filter size={14} />
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner" />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3>Aucun produit trouvé</h3>
            <p>Essayez un autre terme de recherche.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p, i) => (
              <div key={p.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
