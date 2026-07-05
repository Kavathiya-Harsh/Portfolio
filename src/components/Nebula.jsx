import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Nebula component: a large semi-transparent sphere with subtle emissive color
export default function Nebula() {
  const nebulaRef = useRef();

  // Slow rotation for dynamic feel
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = Math.sin(elapsed * 0.02) * 0.1;
      nebulaRef.current.rotation.x = Math.cos(elapsed * 0.015) * 0.08;
    }
  });

  return (
    <mesh ref={nebulaRef} position={[0, 0, -30]}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshStandardMaterial
        color="#2a0c43"
        emissive="#5a1ab0"
        emissiveIntensity={0.4}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
}
