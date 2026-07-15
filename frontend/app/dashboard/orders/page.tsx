'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, XCircle, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'sonner';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<Record<string, number>>({});

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
      // প্রতিটি pending অর্ডারের জন্য অবশিষ্ট সময় ক্যালকুলেট
      const initialTimers: Record<string, number> = {};
      res.data.orders?.forEach((order: any) => {
        if (order.status === 'pending') {
          const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
          const remaining = Math.max(0, 600 - elapsed); // 600 সেকেন্ড = 10 মিনিট
          initialTimers[order._id] = remaining;
        }
      });
      setTimers(initialTimers);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ কাউন্টডাউন টাইমার (প্রতি সেকেন্ডে আপডেট)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev };
        let hasChanged = false;
        Object.keys(updated).forEach((key) => {
          if (updated[key] > 0) {
            updated[key] = updated[key] - 1;
            hasChanged = true;
          }
        });
        return hasChanged ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await api.delete(`/orders/${orderId}`);
      toast.success('Order cancelled successfully');
      await fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  // সময় ফরম্যাট (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start exploring properties and make your first purchase.</p>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => router.push('/explore')}
          >
            Explore Properties
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => {
            const item = order.itemId;
            const remaining = timers[order._id] || 0;
            const isExpired = remaining <= 0 && order.status === 'pending';
            const isCompleted = order.status === 'completed';
            const isCancelled = order.status === 'cancelled';
            const canCancel = order.status === 'pending' && remaining > 0;

            return (
              <div key={order._id} className="rounded-2xl border bg-background/50 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{item?.title || 'Property'}</h3>
                  <p className="text-sm text-muted-foreground">${item?.price?.toLocaleString()} • {item?.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  {/* ✅ কাউন্টডাউন টাইমার (শুধু pending অর্ডারের জন্য) */}
                  {order.status === 'pending' && (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className={`text-sm font-mono font-semibold ${remaining <= 60 ? 'text-red-500 animate-pulse' : 'text-foreground'}`}>
                        {formatTime(remaining)}
                      </span>
                      <span className="text-xs text-muted-foreground">remaining to confirm</span>
                    </div>
                  )}

                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    isCompleted
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : isCancelled
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : 'Pending'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <Button variant="destructive" size="sm" onClick={() => cancelOrder(order._id)}>
                      <XCircle className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                  )}
                  {isExpired && !isCancelled && !isCompleted && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Auto-confirmed
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Completed
                    </span>
                  )}
                  {isCancelled && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Cancelled
                    </span>
                  )}
                  {!canCancel && order.status === 'pending' && !isExpired && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Waiting for confirmation
                    </span>
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