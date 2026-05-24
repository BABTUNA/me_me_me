"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Preload, useGLTF } from "@react-three/drei";
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
 *
 * Perf notes:
 * - Renders only when in viewport (IntersectionObserver) to free GPU/CPU when scrolled away.
 * - Calls useGLTF.preload for the active model so navigation between pages stays warm.
 * - Uses drei <Preload all /> so once the GLB downloads, textures upload to GPU before render.
 * - Use ReactDOM.preload(...) in the page that hosts this for HTML-time fetch start.
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Prime the GLTF cache for the active model as soon as the component mounts.
  // Safe to call repeatedly — it's idempotent.
  useEffect(() => {
    useGLTF.preload(model);
  }, [model]);

  // Only mount the Canvas when scrolled into view — saves first-paint cost
  // and avoids GPU work for off-screen busts.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {inView && (
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov: 35 }}
          gl={{
            alpha: true,
            antialias: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            gl.setClearAlpha(0);
            scene.background = null;
          }}
          style={{
            background: "transparent",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <ambientLight intensity={0.18} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={2.0}
            color="#e8eaf0"
          />
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
            <Preload all />
            <FadeInOnReady onReady={() => setLoaded(true)} />
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
      )}
    </div>
  );
}

/**
 * Tiny helper that runs once after the parent Suspense resolves — fades the
 * canvas in so users don't see a hard pop when the model snaps into place.
 */
function FadeInOnReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // Defer one frame so first render of the model lands before opacity flips
    const id = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

useGLTF.preload(DEFAULT_MODEL);
