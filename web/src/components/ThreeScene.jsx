import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

/**
 * ThreeScene - React Three Fiber canvas setup with lighting and environment
 * Used as a base for 3D model rendering
 */
export default function ThreeScene({ children, className = "h-96 w-full" }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Environment for realistic reflections */}
        <Environment preset="sunset" />
        
        {/* Model content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}

