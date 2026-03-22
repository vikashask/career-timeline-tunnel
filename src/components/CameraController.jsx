import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useTimelineStore from '../store/useTimelineStore';
import { TUNNEL_LENGTH } from '../data/timelineData';

export default function CameraController() {
  const { camera } = useThree();
  const scrollTarget = useRef(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const lookOffset = useRef(new THREE.Vector2());

  const setCameraZ = useTimelineStore((s) => s.setCameraZ);
  const isDetailView = useTimelineStore((s) => s.isDetailView);
  const activePortal = useTimelineStore((s) => s.activePortal);

  // Smooth scroll handler
  const handleWheel = useCallback(
    (e) => {
      if (isDetailView) return;
      scrollTarget.current = THREE.MathUtils.clamp(
        scrollTarget.current + e.deltaY * 0.015,
        0,
        TUNNEL_LENGTH - 15
      );
    },
    [isDetailView]
  );

  // Mouse look handler
  const handleMouseMove = useCallback(
    (e) => {
      if (isDetailView) return;
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    [isDetailView]
  );

  // Touch scroll support
  const touchStart = useRef(0);
  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (isDetailView) return;
      const delta = touchStart.current - e.touches[0].clientY;
      touchStart.current = e.touches[0].clientY;
      scrollTarget.current = THREE.MathUtils.clamp(
        scrollTarget.current + delta * 0.05,
        0,
        TUNNEL_LENGTH - 15
      );
    },
    [isDetailView]
  );

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleMouseMove, handleTouchStart, handleTouchMove]);

  useFrame((_, delta) => {
    if (isDetailView && activePortal) {
      // Zoom into portal
      const targetPos = new THREE.Vector3(0, 0, activePortal.zPosition + 3);
      camera.position.lerp(targetPos, delta * 3);
      camera.lookAt(0, 0, activePortal.zPosition);
    } else {
      // Scroll-based movement
      const targetZ = -scrollTarget.current;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3);

      // Subtle mouse look
      lookOffset.current.x = THREE.MathUtils.lerp(
        lookOffset.current.x,
        mouseX.current * 0.3,
        delta * 3
      );
      lookOffset.current.y = THREE.MathUtils.lerp(
        lookOffset.current.y,
        -mouseY.current * 0.2,
        delta * 3
      );

      camera.position.x = lookOffset.current.x;
      camera.position.y = lookOffset.current.y;

      camera.lookAt(
        lookOffset.current.x * 0.5,
        lookOffset.current.y * 0.5,
        camera.position.z - 10
      );

      setCameraZ(camera.position.z);
    }
  });

  return null;
}
