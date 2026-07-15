'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import { Users, Home, UserCheck, Star, ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { icon: Users, value: '12,000+', label: 'Happy Homeowners' },
  { icon: Home, value: '8,500+', label: 'Properties Listed' },
  { icon: UserCheck, value: '500+', label: 'Expert Agents' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
];

const team = [
  {
    name: 'Arnob Paul',
    role: 'Founder & CEO',
    image: 'https://ui-avatars.com/api/?name=Arnob+Paul&background=f97316&color=fff&size=128',
    bio: '10+ years in real estate tech, passionate about making home buying accessible.',
  },
  {
    name: 'Rafiq Hasan',
    role: 'Head of Operations',
    image: 'https://ui-avatars.com/api/?name=Rafiq+Hasan&background=f97316&color=fff&size=128',
    bio: 'Expert in streamlining real estate processes and customer experience.',
  },
  {
    name: 'Nadia Khan',
    role: 'Lead Developer',
    image: 'https://ui-avatars.com/api/?name=Nadia+Khan&background=f97316&color=fff&size=128',
    bio: 'Full-stack developer building the future of real estate platforms.',
  },
  {
    name: 'Jamil Ahmed',
    role: 'Head of Sales',
    image: 'https://ui-avatars.com/api/?name=Jamil+Ahmed&background=f97316&color=fff&size=128',
    bio: 'Connecting buyers with their dream homes through personalized service.',
  },
];

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-[80%] px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-500">
              About BariBazar
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Your Trusted Partner in
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                {' '}Finding Home
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              We're redefining the real estate experience in Bangladesh with transparency,
              technology, and a human touch.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl border bg-background/50 p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-orange-500">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To empower every person in Bangladesh to find their perfect home with
                confidence, ease, and joy. We believe that everyone deserves a place they love.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border bg-background/50 p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-amber-500">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                To become the most trusted and innovative real estate marketplace in
                South Asia, connecting millions of people with their dream properties.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold">Our Impact in Numbers</h2>
            <p className="mt-2 text-muted-foreground">
              The trust of thousands of homeowners and buyers speaks for itself.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={mounted ? 'visible' : 'hidden'}
                  variants={statsVariants}
                  className="rounded-2xl border bg-background/50 p-6 text-center shadow-sm transition-all hover:shadow-md"
                >
                  <Icon className="mx-auto h-8 w-8 text-orange-500" />
                  <p className="mt-3 text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <div className="mx-auto max-w-[80%] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="mt-2 text-muted-foreground">
              Passionate professionals dedicated to your home-buying journey.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-2xl border bg-background/50 p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-orange-500/30"
              >
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-orange-500/20">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-orange-500">{member.role}</p>
                <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-[80%] px-4">
          <Card className="border-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-8 md:p-12">
            <CardContent className="p-0 text-center">
              <h2 className="text-3xl font-bold">Ready to Find Your Dream Home?</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Join thousands of happy homeowners who found their perfect property
                through BariBazar.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link href="/explore">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    Explore Properties <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}