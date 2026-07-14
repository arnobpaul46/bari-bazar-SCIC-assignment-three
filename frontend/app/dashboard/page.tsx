'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Bookmark, Package, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    bookmarks: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data.user);
        // Fetch counts (you can implement these endpoints)
        // For now, we'll use dummy or fetch from existing endpoints
        const [bookmarksRes, ordersRes] = await Promise.all([
          api.get('/bookmarks'),
          api.get('/orders'),
        ]);
        setStats({
          bookmarks: bookmarksRes.data.bookmarks?.length || 0,
          orders: ordersRes.data.orders?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-muted-foreground mb-6">Here's a quick overview of your account.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookmarks}</div>
            <p className="text-xs text-muted-foreground">Saved properties</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders}</div>
            <p className="text-xs text-muted-foreground">Total purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{user?.email}</div>
            <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}