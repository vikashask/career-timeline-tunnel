import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sun() {
  const coreRef = useRef();
  const coronaRef = useRef();
  const outerGlowRef = useRef();
  const raysRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Core pulse
    if (coreRef.current) {
      const pulse = 1.0 + Math.sin(t * 1.5) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
      coreRef.current.material.emissiveIntensity = 2.0 + Math.sin(t * 2) * 0.5;
    }

    // Corona breathing
    if (coronaRef.current) {
      const scale = 1.0 + Math.sin(t * 0.8) * 0.08;
      coronaRef.current.scale.set(scale, scale, scale);
      coronaRef.current.material.opacity = 0.15 + Math.sin(t * 1.2) * 0.05;
    }

    // Outer glow pulsing
    if (outerGlowRef.current) {
      const scale = 1.0 + Math.sin(t * 0.5) * 0.1;
      outerGlowRef.current.scale.set(scale, scale, scale);
      outerGlowRef.current.material.opacity = 0.06 + Math.sin(t * 0.7) * 0.02;
    }

    // Rays rotation
    if (raysRef.current) {
      raysRef.current.rotation.z = t * 0.05;
    }
  });

  const sunPosition = [0, 5, 12];

  return (
    <group position={sunPosition}>
      {/* Core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#fff4e0"
          emissive="#ffaa33"
          emissiveIntensity={2.5}
          toneMapped={false}
          roughness={0.2}
        />
      </mesh>

      {/* Inner corona */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#ffcc44"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[3.0, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Light rays (ring planes) */}
      <group ref={raysRef}>
        {[0, 0.52, 1.05, 1.57, 2.09, 2.62].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}>
            <planeGeometry args={[0.15, 6]} />
            <meshBasicMaterial
              color="#ffdd66"
              transparent
              opacity={0.04}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* Sun point light — illuminates everything */}
      <pointLight
        color="#ffcc66"
        intensity={8}
        distance={80}
        decay={1.5}
      />
      <pointLight
        color="#ff8833"
        intensity={3}
        distance={40}
        decay={2}
      />
    </group>
  );
}
