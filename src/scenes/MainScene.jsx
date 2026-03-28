import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import Tunnel from '../components/Tunnel';
import Portal from '../components/Portal';
import Particles from '../components/Particles';
import CameraController from '../components/CameraController';
import Planets from '../components/Planets';
import Stars from '../components/Stars';
import Nebula from '../components/Nebula';
import Sun from '../components/Sun';
import { timelineData } from '../data/timelineData';

export default function MainScene() {
  return (
    <Canvas
      id="main-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
      camera={{ position: [0, 0, 5], fov: 70, near: 0.1, far: 250 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
    >
      <color attach="background" args={['#000206']} />
      <fog attach="fog" args={['#000206', 30, 120]} />

      <Suspense fallback={null}>
        {/* Ambient lighting — dim for space */}
        <ambientLight intensity={0.25} />

        {/* Directional starlight */}
        <directionalLight
          position={[5, 10, 15]}
          color="#ffeedd"
          intensity={0.4}
        />

        {/* Colored accent lights along the tunnel */}
        <pointLight position={[0, 0, 3]} color="#0affff" intensity={1.5} distance={25} />
        <pointLight position={[0, 0, -20]} color="#9333ea" intensity={1.0} distance={25} />
        <pointLight position={[0, 0, -50]} color="#0891b2" intensity={1.0} distance={25} />
        <pointLight position={[0, 0, -80]} color="#c026d3" intensity={1.0} distance={25} />
        <pointLight position={[0, 0, -100]} color="#6b21a8" intensity={1.0} distance={25} />

        {/* ───── Universe Elements ───── */}
        <Stars />
        <Nebula />
        <Sun />
        <Planets />

        {/* ───── Tunnel & Content ───── */}
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
