import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TUNNEL_LENGTH, TUNNEL_RADIUS } from '../data/timelineData';

export default function Tunnel() {
  const gridRef = useRef();
  const glowRef = useRef();

  // Create tunnel geometry — a cylinder rendered from inside
  const tunnelGeometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(
      TUNNEL_RADIUS,
      TUNNEL_RADIUS,
      TUNNEL_LENGTH,
      64,
      128,
      true
    );
    // Flip normals so we see the inside
    geo.scale(-1, 1, -1);
    return geo;
  }, []);

  // Create cosmic grid texture — semi-transparent so universe shows through
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Transparent base
    ctx.clearRect(0, 0, 512, 512);

    // Subtle cosmic grid lines
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.35;

    // Horizontal lines — purple tinted
    ctx.strokeStyle = '#7c3aed';
    for (let i = 0; i < 512; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Vertical lines — teal tinted
    ctx.strokeStyle = '#0ea5e9';
    for (let i = 0; i < 512; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }

    // Scatter small star-like dots on the surface
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 1.5 + 0.3;
      const colors = ['#ffffff', '#aaccff', '#ffddcc', '#cc99ff'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 16);
    return tex;
  }, []);

  const textureRef = useRef(null);
  useEffect(() => { textureRef.current = gridTexture; }, [gridTexture]);

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.offset.y += 0.0003;
    }
  });

  // Neon rings along the tunnel — cosmic colors
  const rings = useMemo(() => {
    const arr = [];
    for (let z = 0; z > -TUNNEL_LENGTH; z -= 5) {
      arr.push(z);
    }
    return arr;
  }, []);

  const ringColors = ['#7c3aed', '#0ea5e9', '#c026d3', '#6b21a8', '#0891b2'];

  return (
    <group>
      {/* Main tunnel mesh — semi-transparent cosmic wireframe */}
      <mesh
        ref={gridRef}
        geometry={tunnelGeometry}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -TUNNEL_LENGTH / 2]}
      >
        <meshStandardMaterial
          map={gridTexture}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          emissive="#6b21a8"
          emissiveIntensity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Glow tube overlay — cosmic purple */}
      <mesh
        ref={glowRef}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -TUNNEL_LENGTH / 2]}
      >
        <cylinderGeometry
          args={[
            TUNNEL_RADIUS + 0.05,
            TUNNEL_RADIUS + 0.05,
            TUNNEL_LENGTH,
            64,
            1,
            true,
          ]}
        />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.015}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Neon ring accents — alternating cosmic colors */}
      {rings.map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[0, 0, 0]}>
          <torusGeometry args={[TUNNEL_RADIUS - 0.02, 0.012, 8, 64]} />
          <meshBasicMaterial
            color={ringColors[i % ringColors.length]}
            transparent
            opacity={0.18 + Math.sin(i * 0.5) * 0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
