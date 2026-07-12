'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, User, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DEMO_USER = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'seller',
  isLoggedIn: true,
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const user = DEMO_USER;
  const isLoggedIn = user.isLoggedIn;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const protectedLinks = isLoggedIn
    ? [
        ...(user.role === 'seller' || user.role === 'admin'
          ? [{ href: '/items/add', label: 'Add Property', icon: PlusCircle }]
          : []),
        ...(user.role === 'seller' || user.role === 'admin'
          ? [{ href: '/items/manage', label: 'My Listings' }]
          : []),
        ...(user.role === 'admin'
          ? [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
          : []),
      ]
    : [];

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

          {/* ডেস্কটপ নেভ */}
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

          {/* ডান পাশ */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn && (user.role === 'seller' || user.role === 'admin') && (
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
                {/* ✅ সরাসরি Avatar, Button বাদ (নেস্টেড বাটন সলভ) */}
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 cursor-pointer ring-2 ring-transparent transition-all hover:ring-orange-500">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* ✅ asChild ব্যবহার করি নি, শুধু Link */}
                  {protectedLinks.map((link) => (
                    <DropdownMenuItem key={link.href} className="cursor-pointer">
                      <Link href={link.href} className="flex w-full items-center text-sm">
                        {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile" className="flex w-full items-center text-sm">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 text-sm">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
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

      {/* মোবাইল মেনু (আগের মতো) */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            {isLoggedIn && (user.role === 'seller' || user.role === 'admin') && (
              <Link
                href="/items/add"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center py-2 text-sm text-orange-500 font-medium"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Property
              </Link>
            )}
            {isLoggedIn && (
              <div className="border-t pt-2 space-y-1">
                {protectedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-2 text-sm text-muted-foreground hover:text-orange-500"
                  >
                    {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center py-2 text-sm text-muted-foreground hover:text-orange-500"
                >
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
                <button className="flex w-full items-center py-2 text-sm text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
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