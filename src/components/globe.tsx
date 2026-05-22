"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

type GlobeOptions = COBEOptions & {
  onRender?: (state: Record<string, number>) => void;
};

/**
 * Dotted WebGL globe (cobe), styled to match the site:
 * dark base, magenta dot markers, subtle glow.
 * Auto-rotates; draggable for manual rotation.
 */
export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    let width = 0;
    const onResize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const options: GlobeOptions = {
      devicePixelRatio: Math.min(2, window.devicePixelRatio || 1),
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 16000,
      mapBrightness: 5,
      baseColor: [0.12, 0.12, 0.13],
      markerColor: [1.0, 0.165, 0.427],
      glowColor: [0.18, 0.18, 0.18],
      markers: [
        // Some scattered cities — visual flavor only.
        { location: [40.7128, -74.006], size: 0.05 },   // NYC
        { location: [37.7749, -122.4194], size: 0.05 }, // SF
        { location: [51.5072, -0.1276], size: 0.05 },   // London
        { location: [35.6762, 139.6503], size: 0.05 },  // Tokyo
        { location: [-23.5505, -46.6333], size: 0.04 }, // São Paulo
        { location: [-33.8688, 151.2093], size: 0.04 }, // Sydney
        { location: [19.4326, -99.1332], size: 0.04 },  // Mexico City
        { location: [55.7558, 37.6173], size: 0.04 },   // Moscow
        { location: [28.6139, 77.209], size: 0.04 },    // Delhi
      ],
      onRender: (state) => {
        // Auto-rotate unless user is interacting
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    const globe = createGlobe(canvas, options as COBEOptions);

    // Fade in once first frame is painted
    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
          e.currentTarget.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 0.6s ease",
        }}
      />
      {/* Subtle outer glow ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(255, 42, 109, 0.06) 78%, rgba(255, 42, 109, 0.18) 92%, transparent 100%)",
        }}
      />
    </div>
  );
}
