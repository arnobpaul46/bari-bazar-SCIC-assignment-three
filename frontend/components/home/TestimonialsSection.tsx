'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    content: 'BariBazar made finding my dream home so easy. The verified listings and professional agents saved me so much time and stress. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rafiq Hasan',
    role: 'Investor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    content: 'I have bought and sold multiple properties through BariBazar. The platform is reliable, transparent, and the support team is always helpful.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Nadia Khan',
    role: 'First-time Buyer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60',
    content: 'As a first-time buyer, I was nervous. But BariBazar guided me every step of the way. The pre-approval feature was a game changer!',
    rating: 5,
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
    content: 'BariBazar is a game-changer for agents. The platform connects me with serious buyers and makes the entire process seamless.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Fatima Begum',
    role: 'Property Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
    content: 'I listed my property and got an offer within 48 hours. BariBazar is the most efficient real estate platform in Bangladesh!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-12 md:py-20 border-t overflow-hidden">
      <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            What Our <span className="text-orange-500">Users Say</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2"
          >
            Real stories from real people who found their perfect home with us.
          </motion.p>
        </div>
      </div>

      
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-4 md:gap-6 w-max"
          animate={{
            x: ['0%', '-33.33%'],
          }}
          transition={{
            duration: 25,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0"
            >
              <div className="rounded-2xl border bg-background/50 p-5 shadow-sm h-full flex flex-col transition-all hover:shadow-md hover:border-orange-500/50">
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'fill-orange-500 text-orange-500'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>


                <p className="text-sm text-muted-foreground mb-4 flex-1 italic line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                
                <div className="flex items-center gap-3 mt-auto pt-3 border-t">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-orange-500/30 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}