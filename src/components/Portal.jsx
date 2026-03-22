import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import useTimelineStore from '../store/useTimelineStore';

export default function Portal({ data }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const innerRef = useRef();
  const [hovered, setHovered] = useState(false);

  const enterPortal = useTimelineStore((s) => s.enterPortal);
  const setHoveredPortal = useTimelineStore((s) => s.setHoveredPortal);
  const isDetailView = useTimelineStore((s) => s.isDetailView);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isDetailView) {
        enterPortal(data);
      }
    },
    [data, enterPortal, isDetailView]
  );

  const handlePointerOver = useCallback(
    (e) => {
      e.stopPropagation();
      setHovered(true);
      setHoveredPortal(data.year);
      document.body.style.cursor = 'pointer';
    },
    [data.year, setHoveredPortal]
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    setHoveredPortal(null);
    document.body.style.cursor = 'default';
  }, [setHoveredPortal]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Ring rotation
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.3;
    }

    // Glow pulse
    if (glowRef.current) {
      const baseScale = hovered ? 1.15 : 1;
      const pulse = Math.sin(t * 2 + data.zPosition) * 0.05;
      const s = baseScale + pulse;
      glowRef.current.scale.set(s, s, s);
      glowRef.current.material.opacity = hovered ? 0.4 : 0.15 + Math.sin(t * 3) * 0.05;
    }

    // Inner portal shimmer
    if (innerRef.current) {
      innerRef.current.material.opacity = 0.08 + Math.sin(t * 2) * 0.04;
    }
  });

  const portalColor = new THREE.Color(data.color);

  return (
    <group position={[0, 0, data.zPosition]}>
      {/* Main portal ring */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <torusGeometry args={[2.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color={portalColor}
          emissive={portalColor}
          emissiveIntensity={hovered ? 2.5 : 1.0}
          toneMapped={false}
        />
      </mesh>

      {/* Glow ring */}
      <mesh ref={glowRef}>
        <torusGeometry args={[2.2, 0.25, 16, 64]} />
        <meshBasicMaterial
          color={portalColor}
          transparent
          opacity={0.15}
          toneMapped={false}
        />
      </mesh>

      {/* Inner portal fill */}
      <mesh
        ref={innerRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <circleGeometry args={[2.1, 64]} />
        <meshBasicMaterial
          color={portalColor}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Icon label */}
      {data.icon && (
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.45}
          anchorX="center"
          anchorY="middle"
        >
          {data.icon}
        </Text>
      )}

      {/* Year label */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.5}
        color={data.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {String(data.year)}
      </Text>

      {/* Company label */}
      <Text
        position={[0, -2.8, 0]}
        fontSize={0.25}
        color="#aaaaaa"
        anchorX="center"
        anchorY="middle"
      >
        {data.company}
      </Text>

      {/* Point light for local glow */}
      <pointLight
        color={portalColor}
        intensity={hovered ? 3 : 1}
        distance={8}
        decay={2}
      />
    </group>
  );
}
