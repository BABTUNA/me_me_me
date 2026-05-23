"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF, Environment } from "@react-three/drei";
import type { Group } from "three";

const MODEL_URL = "/models/bust-hi.glb";

function Bust({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });

  return (
    <group ref={ref} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

type StatueBustProps = {
  size?: number;
  className?: string;
};

/**
 * Decorative 3D Greek bust. Auto-rotates. Renders to a transparent canvas
 * so it blends naturally against the page background.
 */
export function StatueBust({ size = 260, className = "" }: StatueBustProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 30 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        {/* Dim ambient — keeps shadows real */}
        <ambientLight intensity={0.15} />

        {/* Cool key from upper-right */}
        <directionalLight position={[4, 6, 4]} intensity={2.2} color="#e8eaf0" />

        {/* Warm magenta rim from behind-left */}
        <directionalLight
          position={[-5, 2, -4]}
          intensity={1.6}
          color="#ff2a6d"
        />

        {/* Subtle fill from below */}
        <directionalLight
          position={[0, -3, 2]}
          intensity={0.3}
          color="#5a6a8a"
        />

        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.25} />
          <Center>
            <Bust scale={1.8} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
