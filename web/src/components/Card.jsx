import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Card({ place, category }) {
  const item = place || category;
  const isCategory = !place;

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl overflow-hidden shadow-md hover:shadow-xl bg-white dark:bg-[#111] cursor-pointer border border-transparent hover:border-teal/50"
    >
      <Link to={isCategory ? `/${item.id}` : `/place/${item.id}`}>
        <div className="relative h-48 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name || item.label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal to-blue flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {(item.name || item.label || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {place?.rating && (
            <div className="absolute top-2 right-2 bg-teal text-white px-2 py-1 rounded-full text-sm font-semibold">
              ⭐ {place.rating}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.name || item.label}
          </h3>
          {item.description && (
            <p className="text-gray-600 text-sm line-clamp-2">
              {typeof item.description === 'string' 
                ? item.description 
                : item.description?.nameOrigin || item.description?.specialFeatures || 'No description'}
            </p>
          )}
          {place?.location && (
            <p className="text-gray-500 text-xs mt-2">📍 {place.location}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

