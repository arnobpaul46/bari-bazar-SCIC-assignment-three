'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react'; 

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/explore', label: 'Explore Properties' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];


const socialLinks = [
  { icon: '👍', href: 'https://facebook.com', label: 'Facebook' },
  { icon: '📸', href: 'https://instagram.com', label: 'Instagram' },
  { icon: '▶️', href: 'https://youtube.com', label: 'YouTube' },
  { icon: '🐦', href: 'https://twitter.com', label: 'Twitter' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/50">
      <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">

          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                BariBazar
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Find your dream home with Bangladesh's most trusted real estate platform.
              Verified listings, top agents, and seamless transactions.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border p-2 text-muted-foreground transition-all hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10"
                  aria-label={social.label}
                >
                  <span className="text-lg">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>


          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-orange-500" />
                <span>House #12, Road #5, Gulshan-1, Dhaka-1212</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0 text-orange-500" />
                <a href="tel:+8801234567890" className="hover:text-orange-500 transition-colors">
                  +880 1234 567890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0 text-orange-500" />
                <a href="mailto:info@baribazar.com" className="hover:text-orange-500 transition-colors">
                  info@baribazar.com
                </a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get the latest property listings and market insights.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing!');
              }}
              className="flex flex-col gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                required
                className="h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="h-10 rounded-md bg-orange-500 text-sm font-medium text-white transition-colors hover:bg-orange-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          &copy; {currentYear} BariBazar. All rights reserved. | Made with ❤️ in Bangladesh | By Arnob Paul
        </div>
      </div>
    </footer>
  );
}