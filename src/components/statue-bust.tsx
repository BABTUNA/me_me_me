"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Glitch,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { Vector2, type Group } from "three";

const DEFAULT_MODEL = "/models/bust-hi.glb";

function Model({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url);
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
  /** Canvas square dimension (shorthand). Overridden by `width`/`height` if set. */
  size?: number;
  /** Canvas width in px. Defaults to `size`. */
  width?: number;
  /** Canvas height in px. Defaults to `size`. */
  height?: number;
  className?: string;
  /** GLB model URL. Defaults to the marble bust. */
  model?: string;
  /** Model scale inside the scene. */
  scale?: number;
  /** Camera distance from the model. Increase to zoom out. */
  cameraZ?: number;
};

/**
 * Decorative 3D model with subtle glitch + chromatic aberration aura.
 * Transparent canvas — blends into the page background.
 */
export function StatueBust({
  size = 260,
  width,
  height,
  className = "",
  model = DEFAULT_MODEL,
  scale = 0.7,
  cameraZ = 10,
}: StatueBustProps) {
  const w = width ?? size;
  const h = height ?? size;
  return (
    <div
      className={className}
      style={{ width: w, height: h }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 35 }}
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: false,
        }}
        dpr={[1, 2]}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.setClearAlpha(0);
          scene.background = null;
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.18} />
        <directionalLight position={[4, 6, 4]} intensity={2.0} color="#e8eaf0" />
        <directionalLight
          position={[-5, 2, -4]}
          intensity={1.5}
          color="#ff10f0"
        />
        <directionalLight
          position={[0, -3, 2]}
          intensity={0.3}
          color="#5a6a8a"
        />

        <Suspense fallback={null}>
          <Center>
            <Model url={model} scale={scale} />
          </Center>
        </Suspense>

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <ChromaticAberration
            offset={new Vector2(0.0025, 0.0018)}
            radialModulation={false}
            modulationOffset={0}
            blendFunction={BlendFunction.NORMAL}
          />
          <Glitch
            delay={new Vector2(2.5, 6)}
            duration={new Vector2(0.1, 0.3)}
            strength={new Vector2(0.15, 0.45)}
            mode={GlitchMode.SPORADIC}
            active
            ratio={0.6}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

useGLTF.preload(DEFAULT_MODEL);
