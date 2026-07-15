'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/axios';

function getUserFromToken(token: string): { id: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      router.push('/login');
      return;
    }

    const userData = getUserFromToken(token);
    if (userData?.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders?limit=1000');
        setOrders(res.data.orders || []);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        if (error.response?.status === 401) {
          document.cookie = 'token=; path=/; max-age=0';
          router.push('/login');
        } else {
          toast.error('Failed to load orders');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const filteredOrders = orders.filter((o: any) =>
    o.itemId?.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.userId?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">📋 Order List</h1>
          <p className="text-muted-foreground">View all orders placed by buyers</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by property or buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-background/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Buyer</th>
                <th className="px-4 py-3 text-left font-medium">Property</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Ordered</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: any) => {
                const item = order.itemId;
                const buyer = order.userId;
                return (
                  <tr key={order._id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">{buyer?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">{item?.title || 'N/A'}</td>
                    <td className="px-4 py-3 text-orange-500 font-medium">
                      ${item?.price?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full flex items-center gap-1 w-fit ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {order.status === 'cancelled' && <XCircle className="h-3 w-3" />}
                        {order.status === 'pending' && <Clock className="h-3 w-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}