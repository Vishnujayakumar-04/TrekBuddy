import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ModelViewer - Loads and displays a 3D .glb model with interactions
 * @param {string} modelPath - Path to .glb model file
 * @param {number} scale - Scale factor for the model
 * @param {boolean} autoRotate - Enable auto-rotation
 */
function Model({ modelPath, scale = 1, autoRotate = true }) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Clone the scene to avoid sharing between instances
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (meshRef.current && autoRotate) {
      const speed = hovered ? 0.02 : 0.01;
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

/**
 * Fallback Model - Shows a placeholder when model is not available
 */
function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#0E7C86" />
    </mesh>
  );
}

/**
 * ModelViewer Component
 * Wraps the model with loading state and error handling
 */
export default function ModelViewer({ 
  modelPath, 
  scale = 1, 
  autoRotate = true,
  fallback = true 
}) {
  // If no model path provided, show fallback
  if (!modelPath && fallback) {
    return <FallbackModel />;
  }

  try {
    return <Model modelPath={modelPath} scale={scale} autoRotate={autoRotate} />;
  } catch (error) {
    console.warn('Failed to load 3D model:', error);
    return fallback ? <FallbackModel /> : null;
  }
}

// Preload models (optional optimization)
export function preloadModel(modelPath) {
  useGLTF.preload(modelPath);
}

