import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, ShieldCheck, FileText, Quote } from 'lucide-react';

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = document.querySelectorAll('.reveal');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalQty } = useCart();
  const { user, loading } = useAuth();

  useReveal();

  const slides = [
    { t: 'Smart Shopping', s: 'Shop smarter with BuySmart', img: '/images/shopping-cart-bags-black-background.jpg' },
    { t: 'Latest Tech Products', s: 'Get your latest quality tech products', img: '/images/wireless-earbuds-with-neon-cyberpunk-style-lighting.jpg' },
    { t: 'Shop Comfortably', s: 'Shop from the comfort of your home', img: '/images/full-shot-people-sitting-together-couch.jpg' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setSlide((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user && !localStorage.getItem('signupModalDismissed')) {
      const t = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(t);
    }
  }, [loading, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const featured = products.slice(0, 4);
  const feats = [
    { i: <Search className='text-[#4DA3FF]' />, t: 'Smart Product Search', d: 'Easily find products using category and keyword filtering.' },
    { i: <ShoppingBag className='text-[#4DA3FF]' />, t: 'Simple Cart Management', d: 'Add, remove, and update products instantly.' },
    { i: <ShieldCheck className='text-[#4DA3FF]' />, t: 'Secure Checkout', d: 'Structured checkout with validation and order summary.' },
    { i: <FileText className='text-[#4DA3FF]' />, t: 'Instant Invoice', d: 'Automatic invoice generation after checkout.' },
  ];

  const testimonials = [
    { text: 'BuySmart makes online shopping very easy. The interface is clean and smooth.', author: 'Gift Moses' },
    { text: 'I like how the cart updates instantly. It feels professional.', author: 'Praise Edoho' },
    { text: 'The invoice generation feature is impressive.', author: 'Eke Tobechukwu' },
  ];

  return (
    <div className='flex-1 relative'>
      {/* Hero */}
      <section className='relative h-[70vh] min-h-[400px] overflow-hidden'>
        {slides.map((sl, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={sl.img} alt='' className='absolute inset-0 w-full h-full object-cover' />
            <div className='absolute inset-0 bg-black/60' />
            <h1 className='relative z-10 text-white text-4xl md:text-6xl font-bold mb-4'>{sl.t}</h1>
            <p className='relative z-10 text-[#c0c0c0] text-lg md:text-xl mb-8'>{sl.s}</p>
            <Link to='/products' className='relative z-10 px-8 py-3 bg-[#4DA3FF] text-black font-bold rounded-full hover:bg-[#78b8ff] transition-colors'>
              Shop Now
            </Link>
          </div>
        ))}
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-3 h-3 rounded-full transition-colors ${i === slide ? 'bg-[#4DA3FF]' : 'bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className='py-16 px-4 md:px-10 bg-[#0f0f0f] reveal opacity-0 translate-y-10 transition-all duration-700'>
        <h2 className='text-white text-2xl md:text-3xl font-bold text-center mb-2'>Why Choose BuySmart</h2>
        <p className='text-[#aaa] text-center mb-10 max-w-xl mx-auto'>BuySmart is designed to provide a smooth, secure, and efficient online shopping experience.</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {feats.map((f, i) => (
            <div key={i} className='bg-[#141414] p-6 rounded-xl text-center'>
              <div className='text-3xl mb-3 flex justify-center'>{f.i}</div>
              <h3 className='text-white font-semibold mb-2'>{f.t}</h3>
              <p className='text-[#aaa] text-sm'>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className='py-16 px-4 md:px-10 bg-[#0f0f0f] reveal opacity-0 translate-y-10 transition-all duration-700'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-white text-2xl md:text-3xl font-bold mb-2'>Find What You are Looking For</h2>
          <p className='text-[#aaa] mb-8'>Search across all categories and discover great deals.</p>
          <form onSubmit={handleSearch} className='flex items-center bg-[#141414] rounded-full overflow-hidden border border-[#333] focus-within:border-[#4DA3FF] transition-colors'>
            <input
              type='text'
              placeholder='Search for products, brands and categories...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex-1 bg-transparent text-white px-6 py-4 outline-none placeholder:text-[#777]'
            />
            <button type='submit' className='px-6 py-4 text-[#4DA3FF] hover:text-white transition-colors'>
              <Search size={22} />
            </button>
          </form>
        </div>
      </section>

      {/* Featured Products */}
      <section className='py-16 px-4 md:px-10 reveal opacity-0 translate-y-10 transition-all duration-700'>
        <h2 className='text-white text-2xl md:text-3xl font-bold text-center mb-2'>Featured Products</h2>
        <p className='text-[#aaa] text-center mb-10 max-w-xl mx-auto'>Explore some of our top-selling and highly rated products.</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className='text-center mt-10'>
          <Link to='/products' className='inline-block px-8 py-3 border-2 border-[#4DA3FF] text-[#4DA3FF] font-bold rounded-full hover:bg-[#4DA3FF] hover:text-black transition-colors'>
            See More
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-16 px-4 md:px-10 bg-[#0f0f0f] reveal opacity-0 translate-y-10 transition-all duration-700'>
        <h2 className='text-white text-2xl md:text-3xl font-bold text-center mb-10'>What Our Users Say</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
          {testimonials.map((t, i) => (
            <div key={i} className='bg-[#141414] p-6 rounded-xl border border-[#222]'>
              <Quote className='text-[#4DA3FF] mb-3' size={24} />
              <p className='text-[#ccc] mb-4 italic'>"{t.text}"</p>
              <h4 className='text-white font-semibold text-sm'>— {t.author}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Cart */}
      <Link
        to='/cart'
        className='fixed bottom-6 right-6 z-50 bg-[#4DA3FF] text-black p-4 rounded-full shadow-lg hover:bg-[#78b8ff] transition-colors flex items-center justify-center'
      >
        <ShoppingBag size={22} />
        {totalQty > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center'>
            {totalQty}
          </span>
        )}
      </Link>

      {/* Signup Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-[100000] px-4'>
          <div className='bg-white w-full max-w-sm p-6 rounded-xl text-center relative'>
            <button onClick={() => { localStorage.setItem('signupModalDismissed', 'true'); setShowModal(false); }} className='absolute top-3 right-4 text-2xl text-[#333] hover:text-black'>
              &times;
            </button>
            <h2 className='text-black text-xl font-bold mb-2'>Join BuySmart</h2>
            <p className='text-[#555] text-sm mb-5'>Sign up to get exclusive deals and track your orders.</p>
            <Link to='/auth' onClick={() => { localStorage.setItem('signupModalDismissed', 'true'); setShowModal(false); }} className='block w-full py-3 bg-[#1e73ff] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity'>
              Create Account
            </Link>
            <p className='mt-3 text-[#555] text-xs'>
              Already have an account?{' '}
              <Link to='/auth' onClick={() => { localStorage.setItem('signupModalDismissed', 'true'); setShowModal(false); }} className='text-[#1e73ff] font-medium'>
                Log in
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}