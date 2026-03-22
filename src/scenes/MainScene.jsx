import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Tunnel from '../components/Tunnel';
import Portal from '../components/Portal';
import Particles from '../components/Particles';
import CameraController from '../components/CameraController';
import { timelineData } from '../data/timelineData';

export default function MainScene() {
  return (
    <Canvas
      id="main-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5], fov: 70, near: 0.1, far: 200 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <color attach="background" args={['#020408']} />
      <fog attach="fog" args={['#020408', 10, 80]} />

      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 3]} color="#0affff" intensity={2} distance={30} />
        <pointLight position={[0, 0, -20]} color="#ff00ff" intensity={1.5} distance={30} />
        <pointLight position={[0, 0, -50]} color="#00ff88" intensity={1.5} distance={30} />
        <pointLight position={[0, 0, -80]} color="#ffcc00" intensity={1.5} distance={30} />
        <pointLight position={[0, 0, -100]} color="#9933ff" intensity={1.5} distance={30} />

        {/* Scene content */}
        <Tunnel />
        <Particles />

        {/* Portals for each timeline entry */}
        {timelineData.map((data) => (
          <Portal key={data.year} data={data} />
        ))}

        {/* Camera rig */}
        <CameraController />
      </Suspense>
    </Canvas>
  );
}
