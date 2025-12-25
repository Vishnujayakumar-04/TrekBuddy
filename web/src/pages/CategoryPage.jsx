import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import PageTransition from '../components/PageTransition';
import { loadCategoryData } from '../utils/dataLoader';
import { getCategoryById } from '../data/categories';

export default function CategoryPage() {
  const { name } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    // Get category info
    const cat = getCategoryById(name);
    setCategory(cat);

    // Load places for this category
    loadCategoryData(name).then((data) => {
      setPlaces(data);
      setLoading(false);
    });
  }, [name]);

  const categoryName = category?.label || name?.charAt(0).toUpperCase() + name?.slice(1) || 'Category';

  return (
    <PageTransition>
      <div className="py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-teal">Home</Link>
          <span className="mx-2">/</span>
          <span className="capitalize">{categoryName}</span>
        </nav>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 capitalize"
        >
          {categoryName}
        </motion.h1>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Loading {categoryName.toLowerCase()}...</p>
          </div>
        ) : (
          <>
            {places.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">No places found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}

