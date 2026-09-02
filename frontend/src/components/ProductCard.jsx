import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product }) {
  const { cart, addItem, removeItem } = useCart();
  const inCart = cart[product.id];

  return (
    <div className="bg-[#141414] rounded-xl overflow-hidden relative flex flex-col hover:-translate-y-1 transition-transform duration-300">
      {product.badge && (
        <span className="absolute top-3 right-3 bg-[#4DA3FF] text-black text-[11px] font-bold px-3 py-1 rounded-full z-10">
          {product.badge}
        </span>
      )}
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white text-base font-semibold mb-1">{product.name}</h3>
        <p className="text-[#aaa] text-sm mb-2 flex-1">{product.desc}</p>
        <p className="text-[#4DA3FF] font-bold text-lg mb-3">₦{product.price.toLocaleString()}</p>
        <div className="flex items-center justify-center gap-2">
          {inCart ? (
            <>
              <button
                onClick={() => removeItem(product.id)}
                className="w-8 h-8 rounded-full bg-[#222] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-white text-sm font-semibold min-w-[24px] text-center">
                {inCart.qty}
              </span>
              <button
                onClick={() => addItem(product)}
                className="w-8 h-8 rounded-full bg-[#222] text-white flex items-center justify-center hover:bg-[#333] transition-colors"
              >
                <Plus size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="px-5 py-2.5 rounded-full bg-[#c0c0c0] text-black font-bold text-sm hover:bg-[#4DA3FF] transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
