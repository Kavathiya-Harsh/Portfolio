import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Preload } from '@react-three/drei';
import * as THREE from 'three';

// Floating shape component with dynamic geometry and smooth floating/rotation animation
function FloatingShape({ 
  position, 
  scale = 1, 
  type = 'icosahedron', 
  speedFactor = 1 
}) {
  const ref = useRef(null);

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime() * speedFactor;
      // Rotation
      ref.current.rotation.x = time * 0.12;
      ref.current.rotation.y = time * 0.08;
      ref.current.rotation.z = time * 0.05;
      // Floating motion
      ref.current.position.y = position[1] + Math.sin(time * 0.6) * 0.7;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        {type === 'icosahedron' && <icosahedronGeometry args={[scale, 1]} />}
        {type === 'torus' && <torusGeometry args={[scale * 0.7, scale * 0.2, 8, 24]} />}
        {type === 'box' && <boxGeometry args={[scale * 1.2, scale * 1.2, scale * 1.2]} />}
        <meshStandardMaterial 
          color="#e0f2fe" 
          emissive="#06b6d4" 
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

// Scene wrapper to handle mouse parallax and scroll offset
function InteractiveScene({ children }) {
  const groupRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // Lerp mouse parallax rotation
      const targetRotationX = (mouse.current.y * Math.PI) / 20;
      const targetRotationY = (mouse.current.x * Math.PI) / 20;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);

      // Scroll effect: move the scene downwards slightly on scroll to create depth
      const targetY = -scrollY.current * 0.02;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function ParticleBackground() {
  const containerRef = useRef(null);

  // Performance tuning based on device
  const isLowPower = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;
  const starCount = isLowPower ? 180 : 350;

  // Add scroll fade to the canvas container for smooth fade out
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const fadeHeight = 600; // Complete fade out by 600px of scroll
      const opacity = Math.max(0, 1 - scrollPos / fadeHeight);
      container.style.opacity = opacity.toString();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-300"
      style={{ background: 'transparent' }}
    >
      <Canvas
        camera={{ position: [0, 0, 35], fov: 45 }}
        gl={{ 
          alpha: true, 
          antialias: !isLowPower, 
          powerPreference: 'high-performance' 
        }}
        dpr={isLowPower ? 1 : [1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#0891b2" />
          <pointLight position={[15, 10, 10]} intensity={0.9} color="#3b82f6" />
          
          <InteractiveScene>
            {/* Sparse elegant particles */}
            <Stars 
              radius={150} 
              depth={50} 
              count={starCount} 
              factor={2.5} 
              saturation={0} 
              fade 
              speed={0.3}
            />

            {/* Professional floating objects */}
            <FloatingShape position={[-10, 4, -12]} scale={1.3} type="icosahedron" speedFactor={0.8} />
            <FloatingShape position={[12, -5, -16]} scale={1.0} type="torus" speedFactor={1.1} />
            <FloatingShape position={[-7, -6, -10]} scale={0.8} type="box" speedFactor={0.9} />
            <FloatingShape position={[9, 7, -14]} scale={1.2} type="icosahedron" speedFactor={0.7} />
          </InteractiveScene>
          
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
