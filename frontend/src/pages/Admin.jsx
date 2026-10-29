import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Plus, Trash2, Package, Image,
  DollarSign, FileText, RefreshCw, ShieldCheck,
  Pencil, X, Upload, Check
} from 'lucide-react';
import { productService } from '../services/api';
import Toast from '../components/Toast';
import './Admin.css';
 
const EMPTY_ADD  = { name: '', price: '', description: '', imageFile: null };
const EMPTY_EDIT = { name: '', price: '', description: '', image: '' };
 
export default function Admin() {
  const [products, setProducts]   = useState([]);
  const [form, setForm]           = useState(EMPTY_ADD);
  const [preview, setPreview]     = useState(null);   // aperçu fichier
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [activeTab, setActiveTab] = useState('products');
 
  // Modal edit
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm]       = useState(EMPTY_EDIT);
  const [saving, setSaving]           = useState(false);
 
  const fileRef = useRef();
 
  /* ---------- Fetch ---------- */
  const fetchProducts = () => {
    setLoading(true);
    productService.getAll()
      .then(({ data }) => setProducts(data))
      .catch(() => showToast('Erreur de chargement', 'error'))
      .finally(() => setLoading(false));
  };
 
  useEffect(fetchProducts, []);
 
  const showToast = (msg, type = 'success') => setToast({ msg, type });
 
  /* ---------- Add form ---------- */
  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
 
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };
 
  const resetAdd = () => {
    setForm(EMPTY_ADD);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };
 
  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Nom et prix obligatoires', 'error'); return;
    }
    if (!form.imageFile) {
      showToast('Veuillez choisir une image', 'error'); return;
    }
    setAdding(true);
    try {
      await productService.add(form);
      resetAdd();
      showToast('Produit ajouté !');
      setActiveTab('products');
      fetchProducts();
    } catch {
      showToast("Erreur lors de l'ajout", 'error');
    } finally {
      setAdding(false);
    }
  };
 
  /* ---------- Delete ---------- */
  const handleDelete = async id => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await productService.delete(id);
      setProducts(p => p.filter(x => x.id !== id));
      showToast('Produit supprimé');
    } catch {
      showToast('Erreur de suppression', 'error');
    }
  };
 
  /* ---------- Edit modal ---------- */
  const openEdit = p => {
    setEditProduct(p);
    setEditForm({ name: p.name, price: String(p.price), description: p.description || '', image: p.image || '' });
  };
 
  const closeEdit = () => { setEditProduct(null); setEditForm(EMPTY_EDIT); };
 
  const handleEditChange = e =>
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
 
  const handleUpdate = async e => {
    e.preventDefault();
    if (!editForm.name || !editForm.price) {
      showToast('Nom et prix obligatoires', 'error'); return;
    }
    setSaving(true);
    try {
      const updated = await productService.update(editProduct.id, editForm);
      setProducts(p => p.map(x => x.id === editProduct.id ? updated.data : x));
      showToast('Produit mis à jour !');
      closeEdit();
    } catch {
      showToast('Erreur de mise à jour', 'error');
    } finally {
      setSaving(false);
    }
  };
 
  /* ---------- Render ---------- */
  return (
    <div className="admin-page">
      <div className="container">
 
        {/* Header */}
        <div className="page-header">
          <div className="admin-header-inner">
            <div>
              <div className="admin-badge">
                <ShieldCheck size={14} />
                Espace Administrateur
              </div>
              <h1>Tableau de bord</h1>
              <p>Gérez vos produits et votre catalogue</p>
            </div>
            <div className="admin-stats">
              <div className="stat-card card">
                <Package size={20} className="stat-icon" />
                <div>
                  <span className="stat-num">{products.length}</span>
                  <span className="stat-label">Produits</span>
                </div>
              </div>
              <div className="stat-card card">
                <DollarSign size={20} className="stat-icon" />
                <div>
                  <span className="stat-num">
                    {products.reduce((s, p) => s + (p.price || 0), 0).toFixed(0)}
                  </span>
                  <span className="stat-label">TND total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
 
        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            Produits ({products.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <Plus size={16} />
            Ajouter un produit
          </button>
          <button className="admin-refresh" onClick={fetchProducts} title="Actualiser">
            <RefreshCw size={16} />
          </button>
        </div>
 
        {/* ── Products tab ── */}
        {activeTab === 'products' && (
          loading ? (
            <div className="spinner" />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Package size={48} />
              <h3>Aucun produit</h3>
              <p>Ajoutez votre premier produit.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '20px' }}
                onClick={() => setActiveTab('add')}
              >
                <Plus size={16} /> Ajouter
              </button>
            </div>
          ) : (
            <div className="products-grid admin-grid">
              {products.map(p => (
                <div key={p.id} className="admin-product-card card fade-in">
                  <div className="admin-product-img">
                    <img
                      src={p.image || `https://placehold.co/400x300/1e1e2a/f0a500?text=${encodeURIComponent(p.name)}`}
                      alt={p.name}
                      onError={e => {
                        e.target.src = `https://placehold.co/400x300/1e1e2a/f0a500?text=${encodeURIComponent(p.name)}`;
                      }}
                    />
                  </div>
                  <div className="admin-product-info">
                    <h3>{p.name}</h3>
                    <p className="product-desc">{p.description}</p>
                    <span className="product-price">{p.price?.toFixed(2)} <span>TND</span></span>
                  </div>
                  <div className="admin-product-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>
                      <Pencil size={14} /> Modifier
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
 
        {/* ── Add tab ── */}
        {activeTab === 'add' && (
          <div className="add-form-wrap fade-in">
            <div className="add-form card">
              <h2 className="add-form-title">
                <Plus size={20} />
                Nouveau produit
              </h2>
 
              <form onSubmit={handleAdd} className="product-form">
                <div className="form-grid">
                  <div className="field">
                    <label><Package size={14} /> Nom du produit *</label>
                    <input
                      type="text" name="name"
                      placeholder="Ex : Montre élégante"
                      value={form.name} onChange={handleChange}
                    />
                  </div>
                  <div className="field">
                    <label><DollarSign size={14} /> Prix (TND) *</label>
                    <input
                      type="number" name="price"
                      placeholder="0.00" step="0.01" min="0"
                      value={form.price} onChange={handleChange}
                    />
                  </div>
                </div>
 
                {/* ── Image upload depuis le PC ── */}
                <div className="field">
                  <label><Image size={14} /> Image du produit *</label>
                  <div
                    className="file-drop"
                    onClick={() => fileRef.current.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f) { setForm(x => ({ ...x, imageFile: f })); setPreview(URL.createObjectURL(f)); }
                    }}
                  >
                    {preview ? (
                      <img src={preview} alt="aperçu" className="file-preview" />
                    ) : (
                      <div className="file-placeholder">
                        <Upload size={28} />
                        <span>Cliquer ou glisser une image</span>
                        <small>PNG, JPG, WEBP — max 10 Mo</small>
                      </div>
                    )}
                    {preview && (
                      <button
                        type="button"
                        className="file-remove"
                        onClick={e => { e.stopPropagation(); setPreview(null); setForm(x => ({ ...x, imageFile: null })); fileRef.current.value = ''; }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFile}
                  />
                </div>
 
                <div className="field">
                  <label><FileText size={14} /> Description</label>
                  <textarea
                    name="description"
                    placeholder="Description du produit..."
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
 
                <div className="form-actions">
                  <button
                    type="button" className="btn btn-ghost"
                    onClick={() => { resetAdd(); setActiveTab('products'); }}
                  >
                    Annuler
                  </button>
                  <button className="btn btn-primary" disabled={adding}>
                    {adding
                      ? <span className="btn-spinner" />
                      : <><Plus size={16} /> Ajouter le produit</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
 
      {/* ── Edit Modal ── */}
      {editProduct && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Pencil size={18} /> Modifier le produit</h2>
              <button className="modal-close" onClick={closeEdit}><X size={20} /></button>
            </div>
 
            <form onSubmit={handleUpdate} className="product-form">
              <div className="form-grid">
                <div className="field">
                  <label><Package size={14} /> Nom *</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} />
                </div>
                <div className="field">
                  <label><DollarSign size={14} /> Prix (TND) *</label>
                  <input type="number" name="price" step="0.01" min="0" value={editForm.price} onChange={handleEditChange} />
                </div>
              </div>
 
              <div className="field">
                <label><Image size={14} /> URL image actuelle</label>
                <input type="url" name="image" placeholder="https://..." value={editForm.image} onChange={handleEditChange} />
                {editForm.image && (
                  <div className="img-preview">
                    <img src={editForm.image} alt="aperçu" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
 
              <div className="field">
                <label><FileText size={14} /> Description</label>
                <textarea
                  name="description" rows={3}
                  value={editForm.description} onChange={handleEditChange}
                />
              </div>
 
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={closeEdit}>Annuler</button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="btn-spinner" /> : <><Check size={16} /> Enregistrer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
 
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}