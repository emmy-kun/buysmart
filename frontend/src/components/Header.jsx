import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Home, Package, CreditCard, LogIn, LogOut, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalQty } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  /* Lock body scroll when menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/products', label: 'Products', icon: Package },
    { to: '/checkout', label: 'Checkout', icon: CreditCard },
    ...(user
      ? [{ to: '/profile', label: 'Profile', icon: User }]
      : [{ to: '/auth', label: 'Sign Up', icon: LogIn }]),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-black to-[#111] border-b border-[#333]">
      <div className="flex items-center justify-between px-5 md:px-10 h-20 md:h-28">
        {/* Cart Link */}
        <Link to="/cart" className="relative text-[#c0c0c0] hover:text-[#4DA3FF] transition-colors">
          <ShoppingCart size={26} />
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
            className="h-16 md:h-24 w-auto object-contain"
          />
        </Link>

        {/* Animated Hamburger */}
        <button
          className="md:hidden relative w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer z-[60]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`
              absolute block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out
              ${menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}
            `}
          />
          <span
            className={`
              absolute block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out
              ${menuOpen ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'}
            `}
          />
          <span
            className={`
              absolute block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ease-in-out
              ${menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}
            `}
          />
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
      </header>

      {/* ────────── Mobile Drawer ────────── */}
      <div
        className={`
          md:hidden fixed inset-0 z-[55]
          transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/70 backdrop-blur-md
            transition-opacity duration-500
            ${menuOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={() => setMenuOpen(false)}
        />

        {/* Slide-in Panel */}
        <div
          className={`
            absolute top-0 right-0 h-full w-[85vw] max-w-[360px]
            bg-[#0a0a0a] border-l border-[#222]
            flex flex-col
            transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-[#1a1a1a]">
            <span className="text-white text-lg font-semibold tracking-wide">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1a1a1a] text-white hover:bg-[#222] transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col px-6 pt-8 gap-1 overflow-y-auto">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-4 rounded-xl
                    text-[#b0b0b0] text-[17px] font-medium
                    hover:text-white hover:bg-[#151515]
                    transition-all duration-300
                    ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}
                  `}
                  style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : '0ms' }}
                >
                  <Icon size={22} strokeWidth={1.8} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 pb-8 pt-4 border-t border-[#1a1a1a]">
            {user ? (
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="
                  flex items-center gap-4 w-full px-4 py-4 rounded-xl
                  text-red-400 text-[17px] font-medium
                  hover:text-red-300 hover:bg-[#151515]
                  transition-all duration-300
                "
              >
                <LogOut size={22} strokeWidth={1.8} />
                Logout
              </button>
            ) : (
              <div className="text-[#555] text-xs text-center">
                BuySmart © {new Date().getFullYear()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
