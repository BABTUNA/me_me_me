"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

type GlobeOptions = COBEOptions & {
  onRender?: (state: Record<string, number>) => void;
};

// Browse.sh-style marker palette: dark navy, pink, gold, deep green, magenta, violet, dark cyan
const COLORS: [number, number, number][] = [
  [0.05, 0.15, 0.55], // navy
  [0.92, 0.32, 0.58], // pink
  [0.93, 0.7, 0.18],  // gold
  [0.08, 0.45, 0.25], // green
  [1.0, 0.165, 0.427], // magenta
  [0.4, 0.2, 0.7],    // violet
  [0.1, 0.55, 0.6],   // teal
  [0.85, 0.25, 0.15], // red-orange
];

// Seeded pseudo-random for stable marker positions across renders
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Continent bounding boxes with per-region dominant color bias.
// Density is approximate; random points within each box.
type Region = {
  lat: [number, number];
  lng: [number, number];
  colorIdx: number[];
  density: number;
};

const REGIONS: Region[] = [
  // Africa
  { lat: [-32, 35], lng: [-17, 50], colorIdx: [0, 2, 1], density: 65 },
  // Europe
  { lat: [36, 68], lng: [-10, 40], colorIdx: [1, 5, 3], density: 38 },
  // Middle East
  { lat: [12, 40], lng: [40, 60], colorIdx: [2, 4, 0], density: 18 },
  // South Asia
  { lat: [6, 35], lng: [60, 95], colorIdx: [2, 4, 3], density: 30 },
  // East Asia
  { lat: [20, 50], lng: [100, 145], colorIdx: [3, 4, 1], density: 45 },
  // Southeast Asia
  { lat: [-10, 22], lng: [95, 140], colorIdx: [3, 2, 4], density: 22 },
  // Russia / Siberia
  { lat: [50, 70], lng: [40, 160], colorIdx: [5, 0, 6], density: 28 },
  // Australia
  { lat: [-38, -12], lng: [115, 153], colorIdx: [2, 3], density: 18 },
  // North America (US / Canada)
  { lat: [28, 60], lng: [-125, -68], colorIdx: [0, 1, 4], density: 55 },
  // Central America / Mexico
  { lat: [8, 28], lng: [-108, -82], colorIdx: [1, 4, 2], density: 12 },
  // South America
  { lat: [-50, 10], lng: [-78, -38], colorIdx: [3, 2, 0], density: 38 },
];

function generateMarkers() {
  const rand = mulberry32(42);
  const out: { location: [number, number]; size: number; color: [number, number, number] }[] = [];
  for (const r of REGIONS) {
    for (let i = 0; i < r.density; i++) {
      const lat = r.lat[0] + rand() * (r.lat[1] - r.lat[0]);
      const lng = r.lng[0] + rand() * (r.lng[1] - r.lng[0]);
      out.push({
        location: [lat, lng],
        size: 0.022 + rand() * 0.022,
        color: COLORS[r.colorIdx[i % r.colorIdx.length]],
      });
    }
  }
  return out;
}

const MARKERS = generateMarkers();

/**
 * Dotted WebGL globe — patterned after browse.sh.
 * Cream-background card with mix-blend-mode: multiply for the multi-color dot look.
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
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 1.6,
      mapBaseBrightness: 0,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.92, 0.32, 0.58],
      glowColor: [1, 1, 1],
      markers: MARKERS,
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.003;
        }
        state.phi = phi + pointerInteractionMovement.current;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    const globe = createGlobe(canvas, options as COBEOptions);

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative shrink-0" style={{ width: 220, height: 220 }}>
      <div
        className="relative aspect-square shrink-0"
        style={{ width: "100%", mixBlendMode: "multiply" }}
      >
        <div
          className="absolute inset-0 aspect-square overflow-hidden rounded-full cursor-grab active:cursor-grabbing"
          style={{
            boxShadow:
              "0 14px 28px -10px rgba(0, 0, 0, 0.18), 0 4px 10px -4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              pointerInteracting.current =
                e.clientX - pointerInteractionMovement.current;
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
                const delta =
                  e.touches[0].clientX - pointerInteracting.current;
                pointerInteractionMovement.current = delta / 100;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
              contain: "layout paint size",
              opacity: 0,
              transition: "opacity 0.5s ease",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: [
                "radial-gradient(circle at center, transparent 62%, rgba(255, 255, 255, 0.18) 90%, rgba(255, 255, 255, 0.45) 98%, transparent 100%)",
                "radial-gradient(circle at 38% 32%, transparent 0%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)",
              ].join(", "),
            }}
          />
        </div>
      </div>
    </div>
  );
}
