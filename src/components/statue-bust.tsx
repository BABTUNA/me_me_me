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
import { StatueBustLoader } from "./statue-bust-loader";

const DEFAULT_MODEL = "/models/apollo.glb";
const DRACO_DECODER = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/";

function Model({ url, scale = 1 }: { url: string; scale?: number }) {
  const { scene } = useGLTF(url, DRACO_DECODER, false);
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
  width?: number | string;
  height?: number | string;
  className?: string;
  model?: string;
  scale?: number;
  cameraZ?: number;
  /** Hero busts: fetch + mount immediately instead of waiting for intersection. */
  priority?: boolean;
  /** Post FX are pretty but cost GPU time; off by default on coarse pointers. */
  effects?: boolean;
};

export function StatueBust({
  size = 260,
  width,
  height,
  className = "",
  model = DEFAULT_MODEL,
  scale = 0.7,
  cameraZ = 10,
  priority = false,
  effects,
}: StatueBustProps) {
  const w = width ?? size;
  const h = height ?? size;
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [enableEffects, setEnableEffects] = useState(false);

  const useEffects =
    effects ??
    (typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches);

  useEffect(() => {
    setLoaded(false);
    setShowLoader(false);
    useGLTF.preload(model, DRACO_DECODER, false);
  }, [model]);

  useEffect(() => {
    if (!inView || loaded) {
      setShowLoader(false);
      return;
    }
    const delay = window.setTimeout(() => setShowLoader(true), 350);
    return () => window.clearTimeout(delay);
  }, [inView, loaded]);

  useEffect(() => {
    if (priority) return;
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [priority]);

  useEffect(() => {
    if (loaded && useEffects) {
      const id = requestAnimationFrame(() => setEnableEffects(true));
      return () => cancelAnimationFrame(id);
    }
    setEnableEffects(false);
  }, [loaded, useEffects]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {inView && showLoader && !loaded && (
        <StatueBustLoader className="pointer-events-none absolute inset-0 h-full w-full" />
      )}

      {inView && (
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov: 35 }}
          gl={{
            alpha: true,
            antialias: false,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.25]}
          onCreated={({ gl, scene }) => {
            gl.setClearColor(0x000000, 0);
            gl.setClearAlpha(0);
            scene.background = null;
          }}
          style={{
            background: "transparent",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.35s ease",
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

          <Suspense
            fallback={
              <LoaderBridge onShow={() => setShowLoader(true)} />
            }
          >
            <Center>
              <Model url={model} scale={scale} />
            </Center>
            <Preload all />
            <FadeInOnReady onReady={() => setLoaded(true)} />
          </Suspense>

          {enableEffects && (
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
          )}
        </Canvas>
      )}
    </div>
  );
}

function LoaderBridge({ onShow }: { onShow: () => void }) {
  useEffect(() => {
    onShow();
  }, [onShow]);
  return null;
}

function FadeInOnReady({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const id = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

useGLTF.preload(DEFAULT_MODEL, DRACO_DECODER, false);
