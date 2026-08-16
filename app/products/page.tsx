'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Winx Store Catalog - Updated</h1>
          <Link href="/" className="text-blue-400 font-medium hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading products...</p>
        ) : error ? (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No products found in the database yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden shadow-sm flex flex-col text-white"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-neutral-900"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-900 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <h2 className="font-bold text-lg text-white mt-2">{product.name}</h2>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
