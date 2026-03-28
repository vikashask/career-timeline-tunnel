import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_LENGTH, TUNNEL_RADIUS } from '../data/timelineData';

const PARTICLE_COUNT = 1200;

export default function Particles() {
  const meshRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    // Cosmic stardust palette
    const palette = [
      new THREE.Color('#e0c3fc'), // Soft lavender
      new THREE.Color('#8ec5fc'), // Soft blue
      new THREE.Color('#ffd6a5'), // Warm gold
      new THREE.Color('#c4b5fd'), // Violet
      new THREE.Color('#a5f3fc'), // Cyan
      new THREE.Color('#fca5a5'), // Soft red
      new THREE.Color('#d4fc79'), // Lime glow
      new THREE.Color('#ffffff'), // Pure white
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scatter in a cylinder
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * (TUNNEL_RADIUS - 0.8);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -Math.random() * TUNNEL_LENGTH;

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.015 + Math.random() * 0.04;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posArr = geo.attributes.position.array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Zero-gravity float animation
      posArr[i * 3] += Math.sin(t * 0.5 + i * 0.08) * 0.0008;
      posArr[i * 3 + 1] += Math.cos(t * 0.4 + i * 0.12) * 0.0008;
      posArr[i * 3 + 2] += Math.sin(t * 0.3 + i * 0.05) * 0.0003;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
