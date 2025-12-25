import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { getPlaceById } from '../utils/dataLoader';

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaceById(id).then((data) => {
      setPlace(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageTransition>
        <div className="py-8">
          <div className="text-center py-20">
            <p className="text-gray-500">Loading place details...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!place) {
    return (
      <PageTransition>
        <div className="py-8">
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Place not found.</p>
            <Link to="/" className="text-teal hover:underline">Go back to Home</Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const description = place.description?.nameOrigin || place.description || 'No description available.';
  const images = place.images || (place.image ? [place.image] : []);
  const facilities = place.description?.facilities || [];
  const nearbyShops = place.description?.nearbyShops || [];

  return (
    <PageTransition>
      <div className="py-8 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-teal">Home</Link>
          {place.categoryId && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/${place.categoryId}`} className="hover:text-teal capitalize">
                {place.categoryId}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span>{place.name}</span>
        </nav>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate(-1)}
          className="mb-4 text-teal hover:text-teal/80 flex items-center gap-2"
        >
          ← Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{place.name}</h1>
          {place.nameTamil && (
            <p className="text-xl text-gray-600 mb-4">{place.nameTamil}</p>
          )}
          {place.location && (
            <p className="text-gray-600 flex items-center gap-2">
              <span>📍</span>
              {place.location}
            </p>
          )}
          {place.rating && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">{place.rating}</span>
            </div>
          )}
        </motion.div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.slice(0, 4).map((img, index) => (
                <motion.img
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  src={img}
                  alt={place.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
              {place.description?.historicalImportance && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Historical Importance</h3>
                  <p className="text-gray-700">{place.description.historicalImportance}</p>
                </div>
              )}
              {place.description?.naturalFeatures && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Natural Features</h3>
                  <p className="text-gray-700">{place.description.naturalFeatures}</p>
                </div>
              )}
            </motion.section>

            {/* Facilities */}
            {facilities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Facilities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Nearby Shops */}
            {nearbyShops.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Shops & Services</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {nearbyShops.map((shop, index) => (
                    <li key={index}>{shop}</li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md sticky top-4"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h2>
              
              {place.type && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-semibold text-gray-900">{place.type}</p>
                </div>
              )}

              {place.entryFee !== undefined && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Entry Fee:</span>
                  <p className="font-semibold text-gray-900">{place.entryFee || 'Free'}</p>
                </div>
              )}

              {place.openingTimeWeekdays && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Opening Hours:</span>
                  <p className="font-semibold text-gray-900">
                    {place.openingTimeWeekdays}
                    {place.closingTimeWeekdays && ` - ${place.closingTimeWeekdays}`}
                  </p>
                </div>
              )}

              {place.address && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Address:</span>
                  <p className="text-gray-900 text-sm">{place.address}</p>
                </div>
              )}

              {place.mapsUrl && (
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-teal text-white text-center py-2 rounded-lg hover:bg-teal/90 transition mt-4"
                >
                  View on Google Maps
                </a>
              )}

              {place.phoneNumber && (
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Contact:</span>
                  <a href={`tel:${place.phoneNumber}`} className="block text-teal hover:underline">
                    {place.phoneNumber}
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

