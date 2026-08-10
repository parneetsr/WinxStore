'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/orders?email=${session.user.email}`);
        const data = await res.json();

        if (data.success) {
          setOrders(data.data);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchOrders();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Order History</h1>
          <Link href="/" className="text-blue-600 font-medium text-sm hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {status === 'unauthenticated' ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You must be signed in to view your order history.</p>
            <Link
              href="/auth/signin"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <p className="text-center text-gray-500 py-12">Loading your orders...</p>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs text-gray-500 block">Order ID: {order._id}</span>
                    <span className="text-sm font-semibold text-gray-700">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-gray-100 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded bg-gray-100" />
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-sm">
                  <span className="text-gray-600">
                    Shipping to: {order.shippingAddress.address}, {order.shippingAddress.city}
                  </span>
                  <span className="font-bold text-gray-900 text-base">
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}