import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeItem, addItem, deleteItem, totalQty, totalPrice } = useCart();
  const items = Object.values(cart);

  return (
    <div className="flex-1 px-4 md:px-10 py-8">
      <h1 className="text-white text-2xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#aaa] text-lg mb-6">Your cart is empty.</p>
          <Link to="/products" className="inline-block px-8 py-3 bg-[#0b5ed7] text-white font-bold rounded-lg hover:bg-[#094bb5] transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 flex gap-4 items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="text-[#0f172a] font-medium text-sm mb-1">{item.name}</h3>
                  <p className="text-[#0b5ed7] font-bold text-sm">₦{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeItem(item.id)} className="w-7 h-7 border border-[#cbd5e1] rounded-md flex items-center justify-center hover:bg-[#e8f0ff]">
                    <Minus size={14} className="text-[#0f172a]" />
                  </button>
                  <span className="text-[#0f172a] text-sm font-semibold min-w-[20px] text-center">{item.qty}</span>
                  <button onClick={() => addItem(item)} className="w-7 h-7 border border-[#cbd5e1] rounded-md flex items-center justify-center hover:bg-[#e8f0ff]">
                    <Plus size={14} className="text-[#0f172a]" />
                  </button>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-6 h-fit lg:sticky lg:top-24 border border-[#e5e7eb]">
            <h2 className="text-[#0f172a] text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-[#334155] mb-3">
              <span>Subtotal</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#0f172a] border-t border-[#e5e7eb] pt-3 mb-5">
              <span>Total</span>
              <span>₦{totalPrice.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="block w-full text-center py-3 bg-[#0b5ed7] text-white font-bold rounded-lg hover:bg-[#094bb5] transition-colors">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
