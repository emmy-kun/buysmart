import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, User } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/auth');
  }, [user, navigate]);

  if (!user) return null;

  const items = Object.values(cart);
  const initial = user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="flex-1 px-4 md:px-10 py-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#111] rounded-xl p-5 mb-8 gap-6 sm:gap-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#132f4c] flex items-center justify-center text-white text-2xl font-bold">
            {initial}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user.displayName || 'User'}</h2>
            <p className="text-[#aaa] text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={async () => { await logout(); navigate('/'); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4DA3FF] text-white rounded-lg font-medium hover:bg-[#3a8de6] transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      <section>
        <h3 className="text-white text-lg font-bold mb-4">My Cart</h3>
        {items.length === 0 ? (
          <div className="bg-[#111] rounded-xl p-6 text-center text-[#aaa]">No products added yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-[#111] rounded-xl p-4 flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <strong className="text-white text-sm">{item.name}</strong>
                  <p className="text-[#aaa] text-xs">Qty: {item.qty}</p>
                </div>
                <div className="text-[#4DA3FF] font-bold text-sm">
                  ₦{(item.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
