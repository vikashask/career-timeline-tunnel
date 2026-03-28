import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NEBULA_PATCHES = [
  { position: [12, 5, -15], color: '#6b21a8', size: 14, rotation: 0.3 },
  { position: [-10, -6, -35], color: '#0e7490', size: 16, rotation: -0.5 },
  { position: [8, -4, -55], color: '#9333ea', size: 12, rotation: 0.8 },
  { position: [-12, 7, -70], color: '#c026d3', size: 18, rotation: -0.2 },
  { position: [14, 3, -90], color: '#0891b2', size: 15, rotation: 0.6 },
  { position: [-8, -5, -105], color: '#7c3aed', size: 13, rotation: -0.7 },
];

function NebulaCloud({ data }) {
  const meshRef = useRef();

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 256, 256);

    // Create soft radial gradient cloud
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    const baseColor = new THREE.Color(data.color);
    const r = Math.floor(baseColor.r * 255);
    const g = Math.floor(baseColor.g * 255);
    const b = Math.floor(baseColor.b * 255);

    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.6)`);
    gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.3)`);
    gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.1)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Add some cloudy noise
    for (let i = 0; i < 200; i++) {
      const x = 128 + (Math.random() - 0.5) * 200;
      const y = 128 + (Math.random() - 0.5) * 200;
      const radius = Math.random() * 30 + 5;
      const alpha = Math.random() * 0.15;

      const grad2 = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad2.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
      grad2.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, 256, 256);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [data.color]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Very slow drift and rotation
    meshRef.current.rotation.z = data.rotation + t * 0.015;
    meshRef.current.material.opacity =
      0.12 + Math.sin(t * 0.3 + data.position[2] * 0.1) * 0.04;
  });

  return (
    <mesh ref={meshRef} position={data.position}>
      <planeGeometry args={[data.size, data.size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Nebula() {
  return (
    <group>
      {NEBULA_PATCHES.map((patch, i) => (
        <NebulaCloud key={i} data={patch} />
      ))}
    </group>
  );
}
