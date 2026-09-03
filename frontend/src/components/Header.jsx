import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu, X, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black to-[#111] border-b border-[#333]">
      <div className="flex items-center justify-between px-5 md:px-10 h-28 md:h-40">
        {/* Cart Link */}
        <Link to="/cart" className="relative text-[#c0c0c0] hover:text-[#4DA3FF] transition-colors">
          <ShoppingCart size={28} />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-black text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {totalQty}
            </span>
          )}
        </Link>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="BuySmart Logo"
            className="h-24 md:h-36 w-auto object-contain"
          />
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link to="/" className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#4DA3FF] after:transition-all hover:after:w-full">
            Home
          </Link>
          <Link to="/products" className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#4DA3FF] after:transition-all hover:after:w-full">
            Products
          </Link>
          <Link to="/checkout" className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors relative pb-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#4DA3FF] after:transition-all hover:after:w-full">
            Checkout
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors flex items-center gap-1">
                <User size={16} />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="text-[#c0c0c0] text-[15px] font-semibold hover:text-[#4DA3FF] transition-colors">
              Sign Up
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile Nav — Professional Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Panel */}
        <nav
          className={`
            absolute top-28 left-4 right-4 bg-[#111] border border-[#333] rounded-2xl shadow-2xl
            flex flex-col items-center py-10 px-6 gap-2
            transition-all duration-300 ease-out
            ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
          `}
        >
          <div className="w-12 h-1 bg-[#333] rounded-full mb-6" />

          {[
            { to: '/', label: 'Home' },
            { to: '/products', label: 'Products' },
            { to: '/checkout', label: 'Checkout' },
            ...(user ? [
              { to: '/profile', label: 'Profile' },
            ] : [
              { to: '/auth', label: 'Sign Up' },
            ]),
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="w-full text-center text-white text-lg font-medium py-3 rounded-xl hover:bg-[#1a1a1a] hover:text-[#4DA3FF] transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="w-full text-center text-red-400 text-lg font-medium py-3 rounded-xl hover:bg-[#1a1a1a] hover:text-red-300 transition-all duration-200 mt-2 border-t border-[#222] pt-4"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
