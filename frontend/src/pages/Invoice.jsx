import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = import.meta.env.VITE_API_URL || 'https://backend-nine-kappa-25.vercel.app';

export default function Invoice() {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    if (!reference) return;
    axios
      .get(`${API}/api/paystack/verify?reference=${reference}`)
      .then((res) => {
        const data = res.data.data;
        setOrder(data);
        setLoading(false);
        // Clear cart only if payment was actually successful
        if (data?.status === 'success') {
          clearCart();
        }
      })
      .catch(() => setLoading(false));
  }, [reference, clearCart]);

  if (loading) return <div className="flex-1 flex items-center justify-center text-white">Verifying payment...</div>;
  if (!order) return <div className="flex-1 flex items-center justify-center text-white">Order not found.</div>;

  const meta = order.metadata || {};
  const items = meta.items || [];
  const total = order.amount / 100;

  return (
    <div className="flex-1 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white text-black rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-2">BuySmart Invoice</h1>
        <p className="text-sm text-[#666] mb-1">Order ID: {order.reference}</p>
        <p className="text-sm text-[#666] mb-6">Customer: {meta.name || 'N/A'} | {meta.phone || 'N/A'}</p>

        <div className="space-y-3 mb-6">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-[#eee] pb-2">
              <span>{item.name} x{item.qty}</span>
              <span className="font-semibold">₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xl font-bold border-t border-[#ccc] pt-4 mb-8">
          <span>Total Paid</span>
          <span>₦{total.toLocaleString()}</span>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-[#0b5ed7] text-white font-bold rounded-lg hover:bg-[#094bb5] transition-colors"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
