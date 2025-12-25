import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import { loadCategoryData } from '../utils/dataLoader';

export default function Temples() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryData('temples').then((data) => {
      setPlaces(data);
      setLoading(false);
    });
  }, []);

  return (
    <PageTransition>
      <div className="py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          Temples
        </motion.h1>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading temples...</p>
          </div>
        ) : (
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
        )}

        {!loading && places.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">No temples found.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

