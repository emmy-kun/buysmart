import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://backend-nine-kappa-25.vercel.app';

function formatNaira(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num) || num < 0) return '₦0';
  return `₦${num.toLocaleString()}`;
}

export default function Invoice() {
  const [params] = useSearchParams();
  const reference = params.get('reference') || params.get('trxref');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { clearCart } = useCart();

  useEffect(() => {
    if (!reference) {
      setError('No payment reference found in URL.');
      setLoading(false);
      return;
    }
    axios
      .get(`${API}/api/paystack/verify?reference=${reference}`)
      .then((res) => {
        const data = res.data?.data;
        if (!data) {
          setError('Unable to load order details.');
          setLoading(false);
          return;
        }
        setOrder(data);
        setLoading(false);
        // Clear cart only if payment was actually successful
        if (data.status === 'success') {
          clearCart();
        }
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Verification failed. Please contact support if you were charged.';
        setError(msg);
        setLoading(false);
      });
  }, [reference, clearCart]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#334155]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0b5ed7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl p-8 text-center border border-[#e5e7eb]">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0f172a] mb-2">Something went wrong</h2>
          <p className="text-[#666] mb-6">{error}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-[#0b5ed7] text-white font-bold rounded-lg hover:bg-[#094bb5] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const meta = order.metadata || {};
  const items = meta.items || [];
  const total = Number(order.amount) / 100;
  const isSuccess = order.status === 'success';

  return (
    <div className="flex-1 px-4 py-8 bg-[#f5f7fa]">
      <div className="max-w-2xl mx-auto bg-white text-black rounded-xl p-8 border border-[#e5e7eb]">
        <div className="flex items-center gap-3 mb-2">
          {isSuccess && <CheckCircle size={28} className="text-green-600" />}
          <h1 className="text-2xl font-bold">BuySmart Invoice</h1>
        </div>
        <p className="text-sm text-[#666] mb-1">Order ID: {order.reference}</p>
        <p className="text-sm text-[#666] mb-6">Customer: {meta.name || 'N/A'} | {meta.phone || 'N/A'}</p>

        {!isSuccess && (
          <div className="flex items-start gap-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-amber-700 text-sm">Payment status: {order.status}. If you were charged, please contact support.</p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {items.map((item, i) => {
            const price = Number(item.price);
            const qty = Number(item.qty) || 1;
            const lineTotal = Number.isFinite(price) ? price * qty : 0;
            return (
              <div key={i} className="flex justify-between border-b border-[#eee] pb-2">
                <span>{item.name || 'Unknown Item'} x{qty}</span>
                <span className="font-semibold">{formatNaira(lineTotal)}</span>
              </div>
            );
          })}
          {items.length === 0 && (
            <p className="text-sm text-[#999] italic">No item details available.</p>
          )}
        </div>

        <div className="flex justify-between text-xl font-bold border-t border-[#ccc] pt-4 mb-8">
          <span>Total Paid</span>
          <span>{formatNaira(total)}</span>
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
