'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export function FooterWrapper() {
  const pathname = usePathname();
  
  // ড্যাশবোর্ড পেজগুলোতে ফুটার লুকান
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return <Footer />;
}