'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Package, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axios';

// ✅ Recharts import
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Helper to decode JWT
function getUserFromToken(token: string): { id: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ bookmarks: 0, orders: 0, properties: 0 });
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);

  const COLORS = ['#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

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
    if (userData) {
      setUser({ ...userData, name: 'User' });
    }

    const fetchData = async () => {
      try {
        const [userRes, bookmarksRes, ordersRes, itemsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/bookmarks'),
          api.get('/orders'),
          api.get('/items?limit=100'),
        ]);

        setUser(userRes.data.user);

        const bookmarksCount = bookmarksRes.data.bookmarks?.length || 0;
        const ordersCount = ordersRes.data.orders?.length || 0;
        const items = itemsRes.data.items || [];
        const propertiesCount = items.length;

        setStats({
          bookmarks: bookmarksCount,
          orders: ordersCount,
          properties: propertiesCount,
        });

        // ✅ পাই চার্টের জন্য: ক্যাটাগরি ভিত্তিক প্রপার্টি কাউন্ট
        const categoryMap: Record<string, number> = {};
        items.forEach((item: any) => {
          const cat = item.category || 'uncategorized';
          categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });

        const pieChartData = Object.entries(categoryMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

        setPieData(pieChartData.length > 0 ? pieChartData : [{ name: 'No Data', value: 1 }]);

        // ✅ বার চার্টের জন্য: মাস অনুযায়ী অর্ডার (ডেমো ডেটা)
        // রিয়েল ডেটা পেলে অর্ডার থেকে মাস বের করে আপডেট করবেন
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const orders = ordersRes.data.orders || [];
        const monthMap: Record<string, number> = {};
        orders.forEach((order: any) => {
          const month = new Date(order.createdAt).getMonth();
          const key = monthNames[month];
          monthMap[key] = (monthMap[key] || 0) + 1;
        });

        const barChartData = monthNames.map((m) => ({
          name: m,
          orders: monthMap[m] || 0,
        }));

        setBarData(barChartData);

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          document.cookie = 'token=; path=/; max-age=0';
          router.push('/login');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-muted-foreground mb-6">Here's a quick overview of your account.</p>

      {/* ✅ স্ট্যাট কার্ড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.properties}</div>
            <p className="text-xs text-muted-foreground">Total listings</p>
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

      {/* ✅ চার্ট সেকশন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* পাই চার্ট: ক্যাটাগরি ভিত্তিক প্রপার্টি */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Properties by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* বার চার্ট: মাস অনুযায়ী অর্ডার */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Orders by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}