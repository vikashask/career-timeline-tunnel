import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_LENGTH, TUNNEL_RADIUS } from '../data/timelineData';

const PARTICLE_COUNT = 800;

export default function Particles() {
  const meshRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color('#0affff'),
      new THREE.Color('#ff00ff'),
      new THREE.Color('#00ff88'),
      new THREE.Color('#ffcc00'),
      new THREE.Color('#ff3366'),
      new THREE.Color('#9933ff'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Scatter in a cylinder
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * (TUNNEL_RADIUS - 1);
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = -Math.random() * TUNNEL_LENGTH;

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 0.02 + Math.random() * 0.04;
    }

    return { positions: pos, colors: col, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posArr = geo.attributes.position.array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Subtle float animation
      posArr[i * 3] += Math.sin(t + i * 0.1) * 0.001;
      posArr[i * 3 + 1] += Math.cos(t + i * 0.15) * 0.001;
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
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
