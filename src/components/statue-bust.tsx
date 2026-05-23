"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import type { Group } from "three";

const MODEL_URL = "/models/bust-lo.glb";

function Bust({ scale = 1 }: { scale?: number }) {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<Group>(null);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.18;
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
 * Small 3D Greek bust used as a decorative aura element next to page titles.
 * Auto-rotates. Renders the low-res draco GLB for snappy load.
 */
export function StatueBust({ size = 160, className = "" }: StatueBustProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 32 }}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        {/* Cool monochrome key + warm magenta rim */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <directionalLight
          position={[-4, 2, -3]}
          intensity={0.9}
          color="#ff2a6d"
        />
        <directionalLight position={[0, -4, 2]} intensity={0.25} color="#88a" />
        <Suspense fallback={null}>
          <Center>
            <Bust scale={1.6} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
