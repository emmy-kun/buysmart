import { useState, useMemo } from 'react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

export default function Products() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = cat === 'All' || p.category === cat;
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [query, cat]);

  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div className="flex-1 px-4 md:px-10 py-8">
      {/* Search */}
      <section className="py-10 flex justify-center bg-[#0f0f0f] rounded-xl mb-8">
        <div className="w-full max-w-2xl text-center px-4">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Find What You’re Looking For</h2>
          <p className="text-[#aaa] text-sm mb-6">Search across all categories and discover great deals.</p>
          <div className="flex items-center bg-[#1a1a1a] rounded-full px-4 py-2 border border-[#2a2a2a] shadow-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and categories..."
              className="flex-1 bg-transparent border-none outline-none text-white text-[15px] px-2 py-2 placeholder:text-[#888]"
            />
            <button className="px-5 py-2 bg-[#4DA3FF] rounded-full text-black font-semibold hover:bg-[#78b8ff] transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-colors ${
              cat === c
                ? 'bg-[#4DA3FF] text-black border-[#4DA3FF]'
                : 'bg-transparent text-[#c0c0c0] border-[#444] hover:border-[#4DA3FF] hover:text-[#4DA3FF]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#aaa] mt-10">No products found.</p>
      )}

      {!showAll && filtered.length > 8 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(true)}
            className="px-8 py-3 border-2 border-[#4DA3FF] text-[#4DA3FF] font-bold rounded-full hover:bg-[#4DA3FF] hover:text-black transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
