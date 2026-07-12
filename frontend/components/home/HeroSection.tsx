'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, Shield, CheckCircle, TrendingUp, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

export function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { value: '12k+', label: 'READY PROPERTIES', icon: Home },
        { value: '500+', label: 'AGENT NETWORK', icon: Users },
        { value: '4.9/5', label: 'USER RATING', icon: Star },
    ];

    const trustBadges = [
        { icon: Shield, label: 'Verified Listing', desc: 'Inspected by our professional team' },
        { icon: CheckCircle, label: 'PRE-APPROVED', desc: 'Get mortgage ready instantly' },
    ];

    return (
        <section className="relative overflow-hidden py-10 md:py-16 lg:py-20">
            
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5" />
                <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-3xl" />
            </div>

            <div className="mx-auto w-full max-w-[92%] sm:max-w-[88%] md:max-w-[80%] px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 items-center">
                    
                    <div className="text-center lg:text-left">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5 }}
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/50 bg-orange-50 px-3 py-1 text-[10px] font-medium text-orange-700 dark:border-orange-800/30 dark:bg-orange-950/30 dark:text-orange-400 sm:px-4 sm:py-1.5 sm:text-xs"
                        >
                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            TRUSTED BY 20,000+ HOMEOWNERS
                        </motion.div>

                        
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-3 text-3xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                        >
                            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
                                Find Your Perfect
                            </span>
                            <br />
                            <span className="text-foreground">Next Chapter.</span>
                        </motion.h1>


                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6 text-xs text-muted-foreground sm:text-sm md:mb-8 md:text-base"
                        >
                            Experience the most advanced real estate search platform. Discover verified listings,
                            connect with top agents, and find a place you'll love.
                        </motion.p>

                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-8 md:mb-10"
                        >
                            <div className="flex flex-col gap-2 rounded-2xl border bg-background/80 p-1.5 backdrop-blur-sm sm:flex-row sm:items-center sm:p-2 md:gap-2.5 md:p-2.5">
                                
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4 md:left-3" />
                                    <Input
                                        type="text"
                                        placeholder="Your Location"
                                        className="h-9 w-full border-0 bg-transparent pl-8 text-xs focus-visible:ring-0 focus-visible:ring-offset-0 sm:h-10 sm:pl-9 sm:text-sm md:h-11"
                                    />
                                </div>

                                
                                <div className="relative flex-1">
                                    <Home className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground sm:h-4 sm:w-4 md:left-3" />
                                    <Select>
                                        <SelectTrigger className="h-9 w-full border-0 bg-transparent pl-8 py-5 text-xs focus:ring-0 focus:ring-offset-0 sm:h-10 sm:pl-9 sm:text-sm md:h-11">
                                            <SelectValue placeholder="Select PROPERTY TYPE" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="sale">For Sale</SelectItem>
                                            <SelectItem value="rent">For Rent</SelectItem>
                                            <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                                            <SelectItem value="furnished">Furnished</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button className="h-9 w-full bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600 sm:h-10 sm:w-auto sm:px-4 sm:text-sm md:px-6">
                                    <Search className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                                    Search
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mb-8 flex flex-wrap items-center justify-center gap-2.5 md:gap-3 lg:justify-start"
                        >
                            {trustBadges.map((badge, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-xl border bg-background/50 px-2.5 py-2 backdrop-blur-sm sm:gap-2.5 sm:px-3.5 sm:py-2.5 md:px-4"
                                >
                                    <badge.icon className="h-4 w-4 flex-shrink-0 text-orange-500 sm:h-5 sm:w-5" />
                                    <div className="text-left">
                                        <p className="text-xs font-semibold sm:text-sm">{badge.label}</p>
                                        <p className="hidden text-[10px] text-muted-foreground sm:block sm:text-xs">{badge.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={mounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:justify-start xl:gap-10"
                        >
                            {stats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                                            <Icon className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />
                                            <span className="text-lg font-bold text-foreground sm:text-xl md:text-2xl lg:text-3xl">
                                                {stat.value}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
                                            {stat.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={mounted ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="relative mt-8 md:mt-0"
                    >
                        <div className="relative aspect-[4/3] sm:aspect-[5/4] md:aspect-[5/5] w-full max-w-sm sm:max-w-md md:max-w-full mx-auto overflow-hidden rounded-2xl shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1668119425427-ac0924024069?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTAzfHxsdXh1cnklMjB2aWxsYXxlbnwwfHwwfHx8MA%3D%3D"
                                alt="Luxury modern house"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}