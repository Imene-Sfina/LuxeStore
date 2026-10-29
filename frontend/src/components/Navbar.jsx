import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag, ShoppingCart, LogOut, LogIn, UserPlus,
  LayoutDashboard, Menu, X, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <Sparkles size={20} />
          <span>LuxeStore</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <ShoppingBag size={16} />
            Boutique
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
        </div>

        {/* Desktop right */}
        <div className="navbar-right">
          {user ? (
            <>
              <span className="navbar-user">
                <span className={`tag ${isAdmin ? 'tag-admin' : 'tag-user'}`}>
                  {user.role}
                </span>
                {user.name}
              </span>
              <Link to="/cart" className="cart-btn">
                <ShoppingCart size={20} />
                {count > 0 && <span className="cart-badge">{count}</span>}
              </Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={15} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                <LogIn size={15} />
                Connexion
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={15} />
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>
            <ShoppingBag size={16} /> Boutique
          </Link>
          {isAdmin && (
            <Link to="/admin" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
          {user ? (
            <>
              <Link to="/cart" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <ShoppingCart size={16} /> Panier {count > 0 && `(${count})`}
              </Link>
              <button className="mobile-link" onClick={handleLogout}>
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <LogIn size={16} /> Connexion
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileOpen(false)}>
                <UserPlus size={16} /> S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
