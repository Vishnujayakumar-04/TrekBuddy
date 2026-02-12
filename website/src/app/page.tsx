'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Map,
  Search,
  MessageCircle,
  Bus,
  Umbrella,
  Camera,
  Hotel,
  Utensils
} from 'lucide-react';
// import { collection, getDocs, limit, query, where } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { Place, Category } from '@/types';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Featured categories matching mobile app
  const categories = [
    { id: 'beaches', name: 'Beaches', icon: Umbrella, color: 'text-blue-500' },
    { id: 'temples', name: 'Temples', icon: '🛕', color: 'text-orange-500' },
    { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'text-purple-500' },
    { id: 'restaurants', name: 'Restaurants', icon: Utensils, color: 'text-red-500' },
    { id: 'places', name: 'Places', icon: Camera, color: 'text-green-500' },
    { id: 'education', name: 'Education', icon: '🎓', color: 'text-yellow-500' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-slate-900">
          <Image
            src="/images/hero-bg.jpg"
            alt="Discover Puducherry"
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="relative z-10 container flex flex-col items-center text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-sm font-medium tracking-wide">
              WELCOME TO PONDICHERRY
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                French Riviera
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
              Explore golden beaches, heritage streets, and spiritual vibes in the heart of India's south coast.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-xl mx-auto"
          >
            <div className="flex items-center p-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl ring-1 ring-white/10 transition-all focus-within:ring-cyan-500/50 focus-within:bg-white/15">
              <div className="pl-4 text-slate-300">
                <Search className="w-6 h-6" />
              </div>
              <Input
                type="text"
                placeholder="Search places, hotels, beaches..."
                className="flex-1 border-none bg-transparent text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition-transform shadow-lg border-none text-white font-semibold">
                Explore
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce text-slate-400"
          >
            <span className="text-sm">Scroll to explore</span>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/planner">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-primary">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Trip Planner</h3>
                  <p className="text-sm text-muted-foreground">Create your perfect itinerary</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-secondary">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="p-3 bg-secondary/10 rounded-full text-secondary-foreground">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Travel Guide</h3>
                  <p className="text-sm text-muted-foreground">Ask anything about Pondy</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/bus-routes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-accent">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="p-3 bg-accent/10 rounded-full text-accent">
                  <Bus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Local Bus Routes</h3>
                  <p className="text-sm text-muted-foreground">Find easy transportation</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="bg-slate-50 dark:bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Explore by <span className="text-cyan-500">Interest</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg max-w-lg">
                Whether you're looking for spiritual peace, adventure, or culinary delights, we have curated lists for you.
              </p>
            </div>
            <Link href="/dashboard/categories">
              <Button variant="outline" className="group border-slate-300 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500">
                View All Categories
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {categories.map((cat) => (
              <Link key={cat.id} href={`/dashboard/categories/${cat.id}`}>
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                >
                  <Card className="h-full border-none shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-slate-800 group overflow-hidden relative">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-current ${cat.color}`} />
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className={`p-4 rounded-full bg-slate-50 dark:bg-slate-900 group-hover:scale-110 transition-transform duration-300 ${cat.color}`}>
                        {typeof cat.icon === 'string' ? <span className="text-3xl">{cat.icon}</span> : <cat.icon className="w-8 h-8" />}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors">{cat.name}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Places Carousel (Placeholder for now) */}
      <section className="container py-24">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <span className="text-cyan-500 font-semibold tracking-wider text-sm uppercase">Don't Miss Out</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Popular <span className="relative inline-block">
              Destinations
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.6" />
              </svg>
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl text-lg">
            The most visited and highly rated locations in Puducherry this month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group">
                <div className="relative h-64 bg-slate-200 overflow-hidden">
                  {/* Placeholder for real images */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-slate-300 animate-pulse group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <span className="text-xs font-bold bg-cyan-500 px-2 py-1 rounded-sm mb-2 inline-block">MUST VISIT</span>
                    <h3 className="font-bold text-xl">Promenade Beach</h3>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 bg-white dark:bg-slate-800 relative z-20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      {'★★★★★'} <span className="text-slate-400 ml-1">(4.8)</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    A beautiful stretch of rock beach along the Bay of Bengal, perfect for morning walks.
                  </p>
                  <Button variant="link" className="p-0 mt-4 h-auto text-cyan-600 font-semibold group-hover:translate-x-1 transition-transform">
                    View Details →
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/dashboard/categories/places">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
              Explore All Destinations
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
