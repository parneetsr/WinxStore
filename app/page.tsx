'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  gender?: string;
  size?: string;
  imageUrl: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const { addToCart, totalItems } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Dynamic filter options based on available products
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const genders = ['All', 'Women', 'Men', 'Kids', 'Unisex'];

  // Filter logic combining Search, Gender, Category, and Price
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGender = selectedGender === 'All' || product.gender?.toLowerCase() === selectedGender.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesGender && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Winx</h1>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition">
            Cart ({totalItems})
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
            My Orders
          </Link>
          <Link href="/admin/products/new" className="text-sm font-medium text-blue-600 hover:underline">
            Add Product
          </Link>
          {session ? (
            <>
              <span className="text-sm text-gray-700">Hello, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Amazon-Style Filter Sidebar */}
        <aside className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGender('All');
                setSelectedCategory('All');
                setMaxPrice(1000);
              }}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Gender / Department Filter (Men, Women, Kids) */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Department</label>
            <div className="flex flex-col gap-1.5">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedGender === g
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category</label>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider Filter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase text-gray-500">Max Price</label>
              <span className="text-sm font-bold text-blue-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <section className="md:col-span-3 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Explore Collection</h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} results found</span>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">Loading products from database...</p>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <p className="text-gray-500 mb-4">No products match your selected filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGender('All');
                  setSelectedCategory('All');
                  setMaxPrice(1000);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
              >
                Clear all Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                  <div className="relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover bg-gray-100"
                    />
                    {product.gender && (
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded">
                        {product.gender}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {product.category}
                        </span>
                        {product.size && (
                          <span className="text-xs text-gray-500 font-medium">Size: {product.size}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mt-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
