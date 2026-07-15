'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Home,
  Package,
  ShoppingBag,
  User,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axios';
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

function getUserFromToken(token: string): { id: string; role: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalSellers: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [userRoleData, setUserRoleData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const COLORS = ['#f97316', '#f59e0b', '#10b981'];

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

    const fetchData = async () => {
      try {
        setLoading(true);

        const [usersRes, itemsRes, ordersRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/items?limit=1000'),
          api.get('/orders?limit=1000'),
        ]);

        const users = usersRes.data.users || [];
        const items = itemsRes.data.items || [];
        const orders = ordersRes.data.orders || [];

        // ✅ ইউজার রোল অনুযায়ী কাউন্ট
        const sellers = users.filter((u: any) => u.role === 'seller').length;
        const buyers = users.filter((u: any) => u.role === 'buyer').length;
        const admins = users.filter((u: any) => u.role === 'admin').length;

        // ✅ কমপ্লিটেড অর্ডার থেকে রেভিনিউ
        const completedOrders = orders.filter((o: any) => o.status === 'completed');
        const revenue = completedOrders.reduce((acc: number, o: any) => {
          const price = o.itemId?.price || 0;
          return acc + price;
        }, 0);

        setStats({
          totalUsers: users.length,
          totalProperties: items.length,
          totalSellers: sellers,
          totalOrders: orders.length,
          revenue,
        });

        // ✅ ইউজার রোল চার্ট
        setUserRoleData([
          { name: 'Buyer', value: buyers },
          { name: 'Seller', value: sellers },
          { name: 'Admin', value: admins },
        ]);

        // ✅ মাস অনুযায়ী রেভিনিউ চার্ট
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthMap: Record<string, number> = {};
        completedOrders.forEach((order: any) => {
          const month = new Date(order.createdAt).getMonth();
          const key = monthNames[month];
          monthMap[key] = (monthMap[key] || 0) + (order.itemId?.price || 0);
        });
        const revData = monthNames.map((m) => ({
          name: m,
          Revenue: monthMap[m] || 0,
        }));
        setRevenueData(revData);

      } catch (error: any) {
        console.error('Error fetching admin data:', error);
        if (error.response?.status === 401) {
          document.cookie = 'token=; path=/; max-age=0';
          router.push('/login');
        } else {
          toast.error('Failed to load admin data');
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
        <div className="text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">Overview of your platform</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSellers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {userRoleData.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenue (by month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}