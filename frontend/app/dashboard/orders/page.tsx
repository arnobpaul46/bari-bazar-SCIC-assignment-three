'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      setOrders(orders.filter((o: any) => o._id !== orderId));
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-background/50 p-4 animate-pulse">
              <div className="h-6 w-1/3 bg-muted rounded" />
              <div className="h-4 w-1/4 bg-muted rounded mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">Start exploring and make your first purchase.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const item = order.itemId;
            const canCancel = new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000 > Date.now();
            return (
              <div key={order._id} className="rounded-2xl border bg-background/50 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{item?.title || 'Property'}</h3>
                  <p className="text-sm text-muted-foreground">${item?.price?.toLocaleString()} • {item?.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canCancel && order.status !== 'completed' && (
                    <Button variant="destructive" size="sm" onClick={() => cancelOrder(order._id)}>
                      <XCircle className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                  )}
                  {!canCancel && order.status === 'pending' && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Cancel window closed
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}