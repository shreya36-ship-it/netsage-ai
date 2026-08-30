import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Single 3D Book mesh component with title & spine detailing
function BookMesh({ position, rotation, color, title, spineTitle, scale = [1.8, 2.4, 0.35] }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    // Gentle hovering sway effect
    meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.001;
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation}>
      {/* Book Cover Mesh */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Book Pages (Inside white block) */}
      <mesh position={[0.02, 0, 0]} castShadow>
        <boxGeometry args={[scale[0] - 0.1, scale[1] - 0.08, scale[2] - 0.04]} />
        <meshStandardMaterial color="#FAF6EE" roughness={0.7} />
      </mesh>

      {/* Gold Foil Corner Accents */}
      <mesh position={[scale[0]/2 - 0.1, scale[1]/2 - 0.1, scale[2]/2 + 0.001]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#F5B719" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 4-Book Interactive Composition arranged like the 4-Quadrant Logo Mark
function BookStackComposition() {
  const groupRef = useRef();
  const [targetRot, setTargetRot] = useState([0, 0]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth lerp mouse parallax rotation
    const mouseX = (state.pointer.x * Math.PI) / 8;
    const mouseY = (state.pointer.y * Math.PI) / 12;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.05);
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Book 1 - Top Left (Yellow - #F5B719) */}
        <BookMesh 
          position={[-1.1, 0.9, 0.2]} 
          rotation={[0.1, 0.25, 0.08]} 
          color="#F5B719" 
        />

        {/* Book 2 - Top Right (Green - #20AC69) */}
        <BookMesh 
          position={[1.0, 0.7, -0.2]} 
          rotation={[-0.1, -0.3, -0.05]} 
          color="#20AC69" 
        />

        {/* Book 3 - Bottom Left (Red - #F0534C) */}
        <BookMesh 
          position={[-0.9, -0.8, -0.1]} 
          rotation={[0.15, 0.35, -0.1]} 
          color="#F0534C" 
        />

        {/* Book 4 - Bottom Right (Blue - #3C6EE6) */}
        <BookMesh 
          position={[1.2, -0.6, 0.3]} 
          rotation={[-0.05, -0.2, 0.12]} 
          color="#3C6EE6" 
        />

        {/* Center Open Highlight Book (Deep Navy & Gold) */}
        <BookMesh 
          position={[0, 0, 0.6]} 
          rotation={[0.2, 0, 0]} 
          color="#1A1F2B"
          scale={[2.2, 2.8, 0.4]}
        />
      </Float>

      {/* Realistic Floor Contact Shadows */}
      <ContactShadows 
        position={[0, -2.4, 0]} 
        opacity={0.6} 
        scale={10} 
        blur={2} 
        far={4} 
        color="#0A0D14"
      />
    </group>
  );
}

// Fallback HTML Skeleton while 3D Canvas loads
function CanvasFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-navy-dark/40 rounded-3xl border border-navy-border/50 p-8 text-center">
      <div className="space-y-4 animate-pulse">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center">
          <span className="text-4xl font-serif text-brand-yellow font-bold">B</span>
        </div>
        <p className="text-sm font-sans text-slate-300">Loading 3D Book Gallery...</p>
      </div>
    </div>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-[460px] md:h-[540px] relative select-none">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          className="w-full h-full rounded-3xl overflow-hidden"
          gl={{ antialias: true, alpha: true }}
        >
          {/* Ambient & Key Lights */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#3C6EE6" />
          <spotLight position={[0, 10, 2]} intensity={1} color="#F5B719" angle={0.6} penumbra={1} />

          {/* Interactive 3D Stack */}
          <BookStackComposition />
        </Canvas>
      </Suspense>

      {/* Floating 4-Color Badge Overlay */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-navy/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-navy-border shadow-xl flex items-center gap-3">
        <div className="grid grid-cols-2 gap-1 w-6 h-6">
          <div className="bg-brand-yellow rounded-sm"></div>
          <div className="bg-brand-green rounded-sm"></div>
          <div className="bg-brand-red rounded-sm"></div>
          <div className="bg-brand-blue rounded-sm"></div>
        </div>
        <div className="text-xs font-sans">
          <p className="font-semibold text-white">3D Interactive Shelf</p>
          <p className="text-slate-400 text-[11px]">Move cursor / touch to tilt</p>
        </div>
      </div>
    </div>
  );
}
