import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_LENGTH } from '../data/timelineData';

// Solar system planets with realistic-ish properties
const PLANET_DATA = [
  {
    name: 'Mercury',
    color: '#8c7e6d',
    emissive: '#4a3f2f',
    size: 0.3,
    position: [6, 2, -5],
    orbitSpeed: 0.4,
    rotationSpeed: 0.01,
    tilt: 0.03,
    hasRing: false,
  },
  {
    name: 'Venus',
    color: '#e8c98e',
    emissive: '#c4894a',
    size: 0.55,
    position: [-7, -1.5, -20],
    orbitSpeed: 0.25,
    rotationSpeed: -0.005,
    tilt: 2.64,
    hasRing: false,
  },
  {
    name: 'Earth',
    color: '#4a90d9',
    emissive: '#1a5f3a',
    size: 0.6,
    position: [8, 1, -35],
    orbitSpeed: 0.2,
    rotationSpeed: 0.02,
    tilt: 0.41,
    hasRing: false,
    hasAtmosphere: true,
    atmosphereColor: '#6eb5ff',
  },
  {
    name: 'Mars',
    color: '#c1582a',
    emissive: '#8b3a15',
    size: 0.4,
    position: [-6.5, 2.5, -50],
    orbitSpeed: 0.15,
    rotationSpeed: 0.018,
    tilt: 0.44,
    hasRing: false,
  },
  {
    name: 'Jupiter',
    color: '#d4a574',
    emissive: '#8b6914',
    size: 1.4,
    position: [9, -2, -65],
    orbitSpeed: 0.08,
    rotationSpeed: 0.04,
    tilt: 0.05,
    hasRing: false,
    hasBands: true,
  },
  {
    name: 'Saturn',
    color: '#e8d5a3',
    emissive: '#a08040',
    size: 1.1,
    position: [-8.5, 1.5, -80],
    orbitSpeed: 0.06,
    rotationSpeed: 0.035,
    tilt: 0.47,
    hasRing: true,
    ringColor: '#c4a265',
    ringInner: 1.4,
    ringOuter: 2.2,
  },
  {
    name: 'Uranus',
    color: '#7ec8e3',
    emissive: '#3a8a9e',
    size: 0.8,
    position: [7.5, 3, -95],
    orbitSpeed: 0.04,
    rotationSpeed: -0.025,
    tilt: 1.71,
    hasRing: true,
    ringColor: '#5eaab8',
    ringInner: 1.1,
    ringOuter: 1.6,
  },
  {
    name: 'Neptune',
    color: '#3f54ba',
    emissive: '#1a2a6c',
    size: 0.75,
    position: [-7, -2, -110],
    orbitSpeed: 0.03,
    rotationSpeed: 0.028,
    tilt: 0.49,
    hasRing: false,
  },
];

function Planet({ data }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const glowRef = useRef();
  const ringRef = useRef();

  // Create planet surface texture procedurally
  const surfaceTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const base = new THREE.Color(data.color);

    // Base color fill
    ctx.fillStyle = data.color;
    ctx.fillRect(0, 0, 256, 256);

    // Add noise/surface variation
    for (let i = 0; i < 800; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 6 + 1;
      const brightness = 0.7 + Math.random() * 0.6;
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = `rgb(${Math.floor(base.r * 255 * brightness)}, ${Math.floor(base.g * 255 * brightness)}, ${Math.floor(base.b * 255 * brightness)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Jupiter-like bands
    if (data.hasBands) {
      ctx.globalAlpha = 0.3;
      const bandColors = ['#c4884a', '#d4a574', '#b87a3a', '#e8c498', '#a06828'];
      for (let i = 0; i < 12; i++) {
        const y = (i / 12) * 256;
        ctx.fillStyle = bandColors[i % bandColors.length];
        ctx.fillRect(0, y, 256, 256 / 14);
      }
    }

    ctx.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, [data.color, data.hasBands]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle orbital motion — small orbit circle
      const ox = Math.sin(t * data.orbitSpeed) * 0.5;
      const oy = Math.cos(t * data.orbitSpeed * 0.7) * 0.3;
      groupRef.current.position.x = data.position[0] + ox;
      groupRef.current.position.y = data.position[1] + oy;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y = t * data.rotationSpeed;
    }

    if (glowRef.current) {
      const pulse = 1.0 + Math.sin(t * 0.8 + data.position[2]) * 0.08;
      glowRef.current.scale.set(pulse, pulse, pulse);
      glowRef.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.03;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.05;
    }
  });

  const planetColor = new THREE.Color(data.color);

  return (
    <group ref={groupRef} position={data.position}>
      {/* Planet sphere */}
      <mesh ref={meshRef} rotation={[data.tilt, 0, 0]}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial
          map={surfaceTexture}
          emissive={data.emissive}
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[data.size * 1.25, 32, 32]} />
        <meshBasicMaterial
          color={data.hasAtmosphere ? data.atmosphereColor : data.color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ring system (Saturn, Uranus) */}
      {data.hasRing && (
        <mesh
          ref={ringRef}
          rotation={[Math.PI / 2 + data.tilt * 0.3, 0, 0]}
        >
          <ringGeometry
            args={[
              data.size * data.ringInner,
              data.size * data.ringOuter,
              64,
            ]}
          />
          <meshBasicMaterial
            color={data.ringColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Point light for local illumination */}
      <pointLight
        color={planetColor}
        intensity={0.5}
        distance={6}
        decay={2}
      />
    </group>
  );
}

export default function Planets() {
  return (
    <group>
      {PLANET_DATA.map((planet) => (
        <Planet key={planet.name} data={planet} />
      ))}
    </group>
  );
}
