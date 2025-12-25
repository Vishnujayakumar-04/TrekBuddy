import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import beachesData from '../data/beaches.json';

export default function Beaches() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Load beaches data
    setPlaces(Array.isArray(beachesData) ? beachesData : []);
  }, []);

  return (
    <PageTransition>
      <div className="py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          Beaches
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {places.map((place, index) => (
            <motion.div
              key={place.id || index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Card place={place} />
            </motion.div>
          ))}
        </motion.div>

        {places.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading beaches...</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

