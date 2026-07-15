import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { FooterWrapper } from '@/components/layout/FooterWrapper';
import { cn } from "@/lib/utils";

import { Toaster } from 'sonner';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BariBazar - Find Your Perfect Home',
  description: 'Real estate platform for buying and selling properties',
  icons: {
    icon: '/logo.svg', // অথবা '/favicon.png'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <FooterWrapper/>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}