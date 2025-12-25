import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import { QUICK_CATEGORIES } from '../data/categories';
import { getFeaturedPlaces } from '../utils/dataLoader';

export default function Home() {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const categories = QUICK_CATEGORIES;

  useEffect(() => {
    // Load featured places
    getFeaturedPlaces(6).then(setFeaturedPlaces);
  }, []);

  return (
    <PageTransition>
      <div className="py-8">
        <HeroSection />

        {/* Categories Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explore Categories
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card category={category} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Places Section */}
        {featuredPlaces.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Featured Places
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaces.map((place, index) => (
                <motion.div
                  key={place.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Card place={place} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </PageTransition>
  );
}

