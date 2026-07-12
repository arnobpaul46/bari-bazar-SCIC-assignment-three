'use client';

import { motion } from 'framer-motion';
import { Shield, CheckCircle, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Listing',
    description: 'Inspected by our professional team for authenticity and quality.',
  },
  {
    icon: CheckCircle,
    title: 'Pre-Approved',
    description: 'Get mortgage ready instantly with our streamlined approval process.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Your transactions are protected with bank-grade encryption.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated team is always here to help you with any queries.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 border-t">
      <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Why Choose <span className="text-orange-500">BariBazar</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2"
          >
            We make buying and selling properties easier, safer, and faster.
          </motion.p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl border bg-background/50 p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-orange-500/50"
              >
                <div className="mb-3 inline-flex rounded-full bg-orange-500/10 p-3 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-base sm:text-lg font-semibold">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}