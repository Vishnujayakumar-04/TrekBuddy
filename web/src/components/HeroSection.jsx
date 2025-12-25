import { motion } from 'framer-motion';
import ThreeScene from './ThreeScene';
import ModelViewer from './ModelViewer';

export default function HeroSection() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center py-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold tracking-tight text-gray-900 mb-4"
        >
          Welcome to <span className="text-teal">TrekBuddy</span>
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8">
          Your smart travel companion for exploring Pondicherry. Discover amazing places, plan trips, and get AI-powered recommendations.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-teal text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal/90 transition"
        >
          Start Exploring
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="h-96 w-full"
      >
        <ThreeScene>
          <ModelViewer 
            modelPath="/models/trekbuddy-logo.glb" 
            scale={1} 
            autoRotate={true}
            fallback={true}
          />
        </ThreeScene>
      </motion.div>
    </div>
  );
}

