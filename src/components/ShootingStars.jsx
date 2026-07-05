import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ShootingStars: occasional fast moving bright points
export default function ShootingStars({ count = 5 }) {
  const starsRef = useRef();
  const { viewport } = useThree();

  // Initialize positions and velocities
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // start off-screen left
      positions[i * 3] = -viewport.width / 2 - Math.random() * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height;
      positions[i * 3 + 2] = -Math.random() * 5 - 5;
      // speed to the right and slight upward drift
      velocities[i * 3] = 0.1 + Math.random() * 0.2; // x speed
      velocities[i * 3 + 1] = 0.02 * (Math.random() - 0.5); // y drift
      velocities[i * 3 + 2] = 0; // z
    }
    return { positions, velocities };
  }, [count, viewport]);

  useFrame(() => {
    if (!starsRef.current) return;
    const pos = starsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      pos[ix] += velocities[ix];
      pos[ix + 1] += velocities[ix + 1];
      // reset when out of view
      if (pos[ix] > viewport.width / 2 + 5) {
        pos[ix] = -viewport.width / 2 - 5;
        pos[ix + 1] = (Math.random() - 0.5) * viewport.height;
      }
    }
    starsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
