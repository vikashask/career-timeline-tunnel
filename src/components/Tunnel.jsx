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

  // Create grid texture for the wireframe look
  const gridTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#0affff';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;

    // Horizontal lines
    for (let i = 0; i < 512; i += 16) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
    // Vertical lines
    for (let i = 0; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
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
      textureRef.current.offset.y += 0.0005;
    }
  });

  // Neon rings along the tunnel
  const rings = useMemo(() => {
    const arr = [];
    for (let z = 0; z > -TUNNEL_LENGTH; z -= 5) {
      arr.push(z);
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Main tunnel mesh */}
      <mesh
        ref={gridRef}
        geometry={tunnelGeometry}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, -TUNNEL_LENGTH / 2]}
      >
        <meshStandardMaterial
          map={gridTexture}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          emissive="#0affff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Glow tube overlay */}
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
          color="#0affff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Neon ring accents */}
      {rings.map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[0, 0, 0]}>
          <torusGeometry args={[TUNNEL_RADIUS - 0.02, 0.015, 8, 64]} />
          <meshBasicMaterial
            color="#0affff"
            transparent
            opacity={0.25 + Math.sin(i * 0.5) * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
