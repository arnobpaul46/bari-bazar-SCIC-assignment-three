'use client';

import { motion } from 'framer-motion';
import { Building2, Home, Briefcase, Crown } from 'lucide-react';

const categories = [
  {
    icon: Building2,
    label: 'Apartments',
    count: '1,200+',
    bg: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
  },
  {
    icon: Home,
    label: 'Villas',
    count: '850+',
    bg: 'from-green-500/20 to-green-500/5',
    iconColor: 'text-green-500',
  },
  {
    icon: Briefcase,
    label: 'Office Spaces',
    count: '400+',
    bg: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-500',
  },
  {
    icon: Crown,
    label: 'Luxury Homes',
    count: '300+',
    bg: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-500',
  },
];

export function CategoriesSection() {
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
            Browse by <span className="text-orange-500">Property Type</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mt-2"
          >
            Find your dream property from our wide range of categories.
          </motion.p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group relative cursor-pointer rounded-2xl border bg-background/50 p-6 text-center shadow-sm transition-all hover:shadow-lg hover:border-orange-500/50"
              >
                <div
                  className={`mx-auto mb-3 inline-flex rounded-full bg-gradient-to-br ${category.bg} p-4`}
                >
                  <Icon className={`h-8 w-8 ${category.iconColor}`} />
                </div>
                <h3 className="mb-1 text-base sm:text-lg font-semibold">{category.label}</h3>
                <p className="text-sm text-muted-foreground">{category.count} properties</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}