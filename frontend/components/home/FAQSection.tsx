'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const faqs = [
  {
    question: 'How do I list my property on BariBazar?',
    answer:
      'Simply create a seller account, subscribe to our seller plan, and click on "Add Property". Fill in the details, upload images, and your listing will be live for thousands of buyers to see.',
  },
  {
    question: 'Is there a fee for using BariBazar?',
    answer:
      'Creating an account and browsing properties is completely free. Sellers need to subscribe to a monthly or yearly plan to list properties. Buyers do not pay any fees to use the platform.',
  },
  {
    question: 'How does the pre-approval process work?',
    answer:
      'Our pre-approval feature helps buyers get mortgage-ready instantly. Simply submit your financial details, and our system will provide you with a pre-approval letter within 24 hours.',
  },
  {
    question: 'How do I contact a seller?',
    answer:
      'Each property listing has a "Contact Seller" button. Clicking it will allow you to send a message directly to the seller. You can also find their contact information on the property details page.',
  },
  {
    question: 'What happens after I buy a property?',
    answer:
      'After payment confirmation, the property status will be updated to "Sold". You will receive all necessary documents via email, and our support team will guide you through the handover process.',
  },
];

export function FAQSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-12 md:py-20 border-t">
      <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:gap-16 lg:grid-cols-2 items-center">
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Frequently Asked <span className="text-orange-500">Questions</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Find answers to the most common questions about our platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:text-orange-500 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border bg-gradient-to-br from-orange-500/5 to-amber-500/5 p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold">Subscribe to Our Newsletter</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Get the latest property listings, market trends, and exclusive offers delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-11"
                />
                <Button
                  type="submit"
                  className="h-11 bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" /> Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Subscribe
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            
            <div className="absolute -bottom-2 -right-2 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl -z-10" />
            <div className="absolute -top-2 -left-2 h-16 w-16 rounded-full bg-amber-500/10 blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}