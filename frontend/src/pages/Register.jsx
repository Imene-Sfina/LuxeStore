import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { authService } from '../services/api';
import Toast from '../components/Toast';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setToast({ msg: 'Veuillez remplir tous les champs', type: 'error' });
      return;
    }
    if (form.password.length < 6) {
      setToast({ msg: 'Mot de passe trop court (min 6 caractères)', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      await authService.register(form);
      setToast({ msg: 'Compte créé avec succès !', type: 'success' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg = err.response?.data || "Erreur lors de l'inscription";
      setToast({ msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-logo">
          <Sparkles size={28} />
          <span>LuxeStore</span>
        </div>

        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez notre communauté</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nom complet</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Votre nom"
                value={form.name}
                onChange={handleChange}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div className="field">
            <label>Adresse e-mail</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={handleChange}
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div className="field">
            <label>Mot de passe</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Minimum 6 caractères"
                value={form.password}
                onChange={handleChange}
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
              />
              <button
                type="button"
                className="input-suffix"
                onClick={() => setShowPw(v => !v)}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              <>
                <UserPlus size={17} />
                S'inscrire
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/login" className="auth-link">Se connecter</Link>
        </p>
      </div>

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
