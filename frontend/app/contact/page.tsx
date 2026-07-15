'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'House #12, Road #5, Gulshan-1, Dhaka-1212',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+880 1234 567890',
    href: 'tel:+8801234567890',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: 'info@baribazar.com',
    href: 'mailto:info@baribazar.com',
  },
];

const socialLinks = [
  { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
];

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 800));
    toast.success('✅ Message sent successfully!', {
      description: 'Our team will get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-20">
        <div className="mx-auto max-w-[80%] px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
              Get in Touch
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              We'd Love to Hear
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                {' '}From You
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Have questions, feedback, or want to list your property? Reach out to us – we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <div className="grid gap-8 lg:grid-cols-5 items-stretch">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3 flex"
            >
              <Card className="flex-1">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                  <h2 className="text-2xl font-bold">Send a Message</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4 flex-1 flex flex-col">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="mt-1.5 resize-none h-[120px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={loading}
                    >
                      <Send className="mr-2 h-4 w-4" /> {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl border bg-background/50 p-6 shadow-sm transition-all hover:shadow-md flex-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-orange-500/10 p-3 text-orange-500">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-muted-foreground hover:text-orange-500 transition-colors"
                          >
                            {item.details}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.details}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Social Links */}
              <div className="rounded-2xl border bg-background/50 p-6 shadow-sm transition-all hover:shadow-md">
                <h3 className="font-semibold mb-3">Connect with Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Link
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border p-2 text-muted-foreground transition-all hover:border-orange-500 hover:text-orange-500 hover:bg-orange-500/10"
                      >
                        <Icon className="h-4 w-4" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="overflow-hidden rounded-2xl border shadow-sm"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902!2d90.3912!3d23.7475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b56f4b5d7b%3A0x8e2c4e5f6a7b8c9d!2sGulshan%20Dhaka!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
              title="BariBazar Office Location"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-8 text-center">
            <h2 className="text-2xl font-bold">Prefer to Talk to Us Directly?</h2>
            <p className="mt-2 text-muted-foreground">
              Call our hotline or visit our office during business hours.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <a href="tel:+8801234567890" className="text-orange-500 font-semibold hover:underline">
                📞 +880 1234 567890
              </a>
              <span className="text-muted-foreground">|</span>
              <span className="text-sm text-muted-foreground">Mon–Fri, 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}