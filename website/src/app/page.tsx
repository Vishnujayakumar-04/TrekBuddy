'use client';

import { useState } from 'react';
import Link from 'next/link';
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
      <section className="relative h-[500px] flex items-center justify-center bg-slate-900 text-white">
        <div
          className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="relative z-10 container text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover <span className="text-primary">Puducherry</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Your ultimate guide to the French Riviera of the East.
            Beaches, Heritage, Food, and Spiritual Vibes.
          </p>

          <div className="flex max-w-md mx-auto items-center space-x-2 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
            <Search className="w-5 h-5 ml-3 text-gray-300" />
            <Input
              type="text"
              placeholder="Search places, hotels, beaches..."
              className="border-none bg-transparent text-white placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" className="rounded-full px-6">Explore</Button>
          </div>
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
      <section className="bg-muted/30 py-16">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Explore Categories</h2>
              <p className="text-muted-foreground mt-2">Find the best places by your interest</p>
            </div>
            <Link href="/dashboard/categories">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/dashboard/categories/${cat.id}`}>
                <Card className="h-full hover:border-primary cursor-pointer transition-colors group">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className={`text-4xl group-hover:scale-110 transition-transform ${cat.color}`}>
                      {typeof cat.icon === 'string' ? cat.icon : <cat.icon className="w-10 h-10" />}
                    </div>
                    <span className="font-medium">{cat.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Places Carousel (Placeholder for now) */}
      <section className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Popular Destinations</h2>
          <Button variant="link">See Top Rated</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
