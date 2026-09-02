import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.displayName || '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const items = Object.values(cart);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const payWithPaystack = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill all shipping details');
      return;
    }
    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      // Initialize transaction on backend
      const { data } = await axios.post(`${API}/api/paystack/initialize`, {
        email: user?.email || 'guest@buysmart.com',
        amount: totalPrice,
        metadata: { name: form.name, phone: form.phone, address: form.address, items },
      });

      if (data?.data?.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.data.authorization_url;
      } else {
        alert('Payment initialization failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-10 py-8 bg-[#f5f7fa] text-[#222]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6">
          <h2 className="text-base font-bold mb-4">Shipping Details</h2>
          <div className="space-y-3">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full p-3.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#1e73ff]" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full p-3.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#1e73ff]" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Delivery Address" className="w-full p-3.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#1e73ff]" required />
          </div>

          <h2 className="text-base font-bold mt-6 mb-4">Payment Method</h2>
          <div className="flex items-center gap-3 p-3.5 border border-[#e0e6ed] rounded-lg bg-[#f8fbff]">
            <input type="radio" checked readOnly className="w-5 h-5 accent-[#1e73ff]" />
            <div>
              <strong className="text-sm">Pay with Paystack</strong>
              <p className="text-xs text-[#666]">Secure card, bank transfer, or USSD payment</p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl p-6 h-fit lg:sticky lg:top-24">
          <h2 className="text-base font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm text-[#334155] mb-2">
            <span>Subtotal</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#0f172a] border-t border-[#e5e7eb] pt-3 mb-5">
            <span>Total</span>
            <span>₦{totalPrice.toLocaleString()}</span>
          </div>
          <button
            onClick={payWithPaystack}
            disabled={loading}
            className="w-full py-3.5 bg-[#0b5ed7] text-white font-bold rounded-lg hover:bg-[#094bb5] transition-colors disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
