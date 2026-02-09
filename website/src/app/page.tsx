'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin,
  Map,
  Search,
  MessageCircle,
  Bus,
  ArrowRight,
  Star,
  Sunset,
  Landmark,
  Utensils,
  Camera,
  GraduationCap
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Data constants moved outside component
  const filteredSuggestions = searchQuery.length > 0
    ? SEARCH_DATA.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-cyan-100 selection:text-cyan-900">

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-900 pb-48 pt-32">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1582563364956-65a25e197c38?q=80&w=2669&auto=format&fit=crop"
            alt="Puducherry Coast"
            fill
            className="object-cover opacity-50 scale-105 animate-[zoom_20s_infinite_alternate]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-50 dark:to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950/60 to-slate-950/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-5xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-cyan-200 text-sm font-medium tracking-wider shadow-xl hover:bg-white/10 transition-colors cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-3 animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              THE INTELLIGENT GUIDE TO PUDUCHERRY
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              Discover the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-300 animate-pulse">
                French Riviera
              </span>{' '}
              of the East
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-lg opacity-90">
              Explore golden beaches, heritage streets, and spiritual vibes in the heart of India&apos;s south coast.
            </p>

            {/* Premium Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="max-w-2xl mx-auto mt-12 w-full px-4 relative z-50"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-700" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-2 shadow-2xl">
                  <Search className="ml-5 w-6 h-6 text-slate-300" />
                  <Input
                    type="text"
                    placeholder="Search beaches, cafes, temples..."
                    className="flex-1 border-none bg-transparent text-white placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg px-4 font-light tracking-wide"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <Button size="lg" className="rounded-full px-8 h-12 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-lg border-none shadow-lg transition-all hover:scale-105">
                    Explore
                  </Button>
                </div>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    {filteredSuggestions.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="flex items-center justify-between px-6 py-4 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-cyan-500" />
                          <span className="text-slate-900 dark:text-white font-medium">{item.name}</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}

                {/* No results message */}
                {showSuggestions && searchQuery.length > 2 && filteredSuggestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 text-center"
                  >
                    <p className="text-slate-500">No places found for &quot;{searchQuery}&quot;</p>
                    <p className="text-sm text-slate-400 mt-1">Try searching for beaches, temples, or cafes</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overlapping Feature Cards */}
      <section className="container mx-auto px-4 -mt-32 relative z-40 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Trip Planner",
              desc: "Build your custom itinerary with our smart, map-based planning tool.",
              icon: Map,
              color: "text-cyan-500",
              bg: "bg-cyan-500/10",
              href: "/dashboard/planner"
            },
            {
              title: "AI Guide",
              desc: "Chat with our AI expert for instant local tips and hidden gems.",
              icon: MessageCircle,
              color: "text-indigo-500",
              bg: "bg-indigo-500/10",
              href: "/dashboard/chat"
            },
            {
              title: "Local Transit",
              desc: "Find bus routes, schedules, and transport options easily.",
              icon: Bus,
              color: "text-emerald-500",
              bg: "bg-emerald-500/10",
              href: "/dashboard/transit/bus"
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 + 0.5 }}
            >
              <Link href={feature.href} className="block h-full">
                <Card className="h-full border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                  <CardContent className="p-8 flex items-start space-x-6">
                    <div className={`p-4 rounded-2xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories - Image Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest text-xs uppercase">Curated Collections</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Interest</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-light">
                Dive into curated collections. Whether you crave the sound of waves, the silence of meditation, or the aroma of French bakeries.
              </p>
            </div>
            <Button variant="outline" className="border-slate-300 dark:border-slate-700 hover:border-cyan-600 hover:text-cyan-600 rounded-full px-8 py-6 text-base font-medium transition-all group" asChild>
              <Link href="/dashboard/categories">
                View All Categories
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="col-span-1"
              >
                <Link href={`/dashboard/categories/${cat.id}`}>
                  <div className="group relative h-72 md:h-96 w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="absolute inset-0 bg-slate-900">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-90"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <cat.icon className="w-6 h-6 mb-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <h3 className="text-xl font-bold mb-1 tracking-tight">{cat.name}</h3>
                      <p className="text-xs text-slate-300 font-medium opacity-80 group-hover:text-cyan-200 transition-colors">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Places Carousel */}
      <section className="py-24 bg-white dark:bg-slate-900 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest text-xs uppercase px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800">Don&apos;t Miss Out</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-light">
              Handpicked favorites loved by travelers and locals alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((place, i) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group h-full"
              >
                <Link href={`/dashboard/places/${place.id}`}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden bg-white dark:bg-slate-950 rounded-3xl group-hover:-translate-y-2">
                    {/* Image Placeholder */}
                    <div className="relative h-72 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <Image
                        src={place.image}
                        alt={place.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md text-white text-xs font-bold border border-white/10 shadow-lg tracking-wide uppercase">
                          {place.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold">{place.rating}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="flex-1 p-6 space-y-4 relative">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {place.name}
                        </h3>
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed font-light">
                        {place.description}
                      </p>

                      <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/50 flex items-center text-cyan-600 dark:text-cyan-400 text-sm font-semibold group/link">
                        View Details <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <Button size="lg" className="rounded-full px-12 py-8 text-lg bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-2xl hover:shadow-cyan-500/20 transition-all font-bold tracking-tight" asChild>
              <Link href="/dashboard/categories/places">
                Explore All Destinations
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Static Data Constants (Moved outside component for performance) ---

const SEARCH_DATA = [
  { name: 'Promenade Beach', category: 'Beaches', path: '/dashboard/places/promenade-beach' },
  { name: 'Paradise Beach', category: 'Beaches', path: '/dashboard/places/paradise-beach' },
  { name: 'Serenity Beach', category: 'Beaches', path: '/dashboard/places/serenity-beach' },
  { name: 'Auroville Beach', category: 'Beaches', path: '/dashboard/places/auroville-beach' },
  { name: 'Auroville', category: 'Spiritual', path: '/dashboard/places/auroville' },
  { name: 'Matrimandir', category: 'Spiritual', path: '/dashboard/places/matrimandir' },
  { name: 'Sri Aurobindo Ashram', category: 'Spiritual', path: '/dashboard/places/ashram' },
  { name: 'White Town', category: 'Heritage', path: '/dashboard/places/white-town' },
  { name: 'French Quarter', category: 'Heritage', path: '/dashboard/places/french-quarter' },
  { name: 'Manakula Vinayagar Temple', category: 'Temples', path: '/dashboard/places/manakula-temple' },
  { name: 'Baker Street', category: 'Cafes', path: '/dashboard/places/baker-street' },
  { name: 'Cafe des Arts', category: 'Cafes', path: '/dashboard/places/cafe-des-arts' },
  { name: 'Surguru', category: 'Restaurants', path: '/dashboard/places/surguru' },
  { name: 'Le Club', category: 'Restaurants', path: '/dashboard/places/le-club' },
  { name: 'Rock Beach Park', category: 'Parks', path: '/dashboard/places/rock-beach-park' },
  { name: 'Botanical Garden', category: 'Parks', path: '/dashboard/places/botanical-garden' },
];

const categories = [
  {
    id: 'beaches',
    name: 'Beaches',
    image: 'https://images.unsplash.com/photo-1590487920786-89ccb2c86f2b?q=80&w=800&auto=format&fit=crop',
    desc: 'Sun, Sand & Surf',
    icon: Sunset
  },
  {
    id: 'temples',
    name: 'Heritage',
    image: 'https://images.unsplash.com/photo-1582563364956-65a25e197c38?q=80&w=800&auto=format&fit=crop',
    desc: 'Colonial & Spiritual',
    icon: Landmark
  },
  {
    id: 'hotels',
    name: 'Hotels',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
    desc: 'Luxury to Budget',
    icon: Star
  },
  {
    id: 'restaurants',
    name: 'Dining',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    desc: 'Crepes to Curry',
    icon: Utensils
  },
  {
    id: 'places',
    name: 'Sights',
    image: 'https://images.unsplash.com/photo-1533929736472-ed2199d435bb?q=80&w=800&auto=format&fit=crop',
    desc: 'Must-visit Spots',
    icon: Camera
  },
  {
    id: 'education',
    name: 'Education',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    desc: 'Universities & Schools',
    icon: GraduationCap
  },
];

const popularDestinations = [
  {
    id: 'promenade-beach',
    name: 'Promenade Beach',
    rating: 4.8,
    reviews: 1240,
    description: 'Iconic rock beach with a long promenade, perfect for sunrise walks.',
    image: 'https://images.unsplash.com/photo-1621577708605-6c703080bf07?q=80&w=800&auto=format&fit=crop',
    tag: 'Must Visit'
  },
  {
    id: 'auroville',
    name: 'Auroville',
    rating: 4.9,
    reviews: 3500,
    description: 'An experimental township dedicated to human unity and sustainable living.',
    image: 'https://images.unsplash.com/photo-1580211782250-b4d241d7f6c3?q=80&w=800&auto=format&fit=crop',
    tag: 'Spiritual'
  },
  {
    id: 'white-town',
    name: 'White Town',
    rating: 4.7,
    reviews: 890,
    description: 'Charming French Quarter with colonial architecture and vibrant cafes.',
    image: 'https://images.unsplash.com/photo-1605374467006-25f16e949984?q=80&w=800&auto=format&fit=crop',
    tag: 'Heritage'
  },
  {
    id: 'paradise-beach',
    name: 'Paradise Beach',
    rating: 4.6,
    reviews: 1100,
    description: 'Pristine island beach accessible by boat, known for golden sands.',
    image: 'https://images.unsplash.com/photo-1563294060-63d1912a201b?q=80&w=800&auto=format&fit=crop',
    tag: 'Nature'
  }
];
