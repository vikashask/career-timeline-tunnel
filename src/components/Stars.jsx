import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STAR_COUNT = 2500;
const STAR_SPHERE_RADIUS = 60;

export default function Stars() {
  const meshRef = useRef();

  const { positions, colors, sizes, twinklePhases } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    const sz = new Float32Array(STAR_COUNT);
    const phases = new Float32Array(STAR_COUNT);

    const starColors = [
      new THREE.Color('#ffffff'),  // White
      new THREE.Color('#ffeedd'),  // Warm white
      new THREE.Color('#aaccff'),  // Blue white
      new THREE.Color('#ffccaa'),  // Orange
      new THREE.Color('#ccddff'),  // Cool white
      new THREE.Color('#ffe4b5'),  // Moccasin / yellow
      new THREE.Color('#b0c4ff'),  // Light blue
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute on a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = STAR_SPHERE_RADIUS + (Math.random() - 0.5) * 20;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 60;

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      // Varied sizes — most small, few bright
      const rand = Math.random();
      if (rand > 0.98) {
        sz[i] = 0.15 + Math.random() * 0.1; // Bright stars
      } else if (rand > 0.9) {
        sz[i] = 0.08 + Math.random() * 0.06; // Medium stars
      } else {
        sz[i] = 0.02 + Math.random() * 0.04; // Dim stars
      }

      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, colors: col, sizes: sz, twinklePhases: phases };
  }, []);

  // Twinkle animation
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const sizeAttr = meshRef.current.geometry.attributes.size;
    const arr = sizeAttr.array;

    for (let i = 0; i < STAR_COUNT; i++) {
      const base = sizes[i];
      const twinkle = Math.sin(t * (1.5 + twinklePhases[i] * 0.5) + twinklePhases[i]) * 0.4 + 0.6;
      arr[i] = base * twinkle;
    }
    sizeAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={STAR_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={STAR_COUNT}
          array={new Float32Array(sizes)}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
