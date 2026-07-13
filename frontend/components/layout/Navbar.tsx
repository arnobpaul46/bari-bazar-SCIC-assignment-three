'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Menu, X, User, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import api from '@/lib/axios';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      console.error("User fetch error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0;';
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const avatarUrl = useMemo(() => {
    if (user?.image) return user.image;
    if (user?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&bold=true`;
    }
    return null;
  }, [user]);

  const isLoggedIn = !!user;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[80%] px-4 h-16 flex items-center">
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-[80%] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* লোগো */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              BariBazar
            </span>
          </Link>

          {/* ডেস্কটপ নেভিগেশন */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  pathname === link.href ? 'text-orange-500 font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ডান পাশের বাটন ও ড্রপডাউন */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn && (user?.role === 'seller' || user?.role === 'admin') && (
              <Link href="/items/add" className="hidden sm:inline-block">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                  <PlusCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Add Property
                </Button>
              </Link>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none ring-offset-background rounded-full focus-visible:ring-2 focus-visible:ring-orange-500">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-transparent transition-all hover:ring-orange-500">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />}
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-xs sm:text-sm">
                      {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate w-[150px]">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          user?.role === 'admin'
                            ? '/admin/dashboard'
                            : user?.role === 'seller'
                            ? '/seller/dashboard'
                            : '/dashboard'
                        }
                        className="cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* মোবাইল মেনু টগল */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
            >
              {isMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="mx-auto w-full max-w-[80%] px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  pathname === link.href ? 'text-orange-500 font-semibold' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <div className="border-t pt-2 space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-orange-500"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-muted-foreground hover:text-orange-500"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm font-medium text-red-600"
                >
                  Sign Out
                </button>
              </div>
            )}
            {!isLoggedIn && (
              <div className="border-t pt-2 space-y-2">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-start bg-orange-500 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}