type BinaryBackgroundProps = {
  /** 0–1 opacity of the binary text. */
  opacity?: number;
  /** PRNG seed — change to get a different stable pattern. */
  seed?: number;
};

/**
 * Decorative binary (0/1) background. SSR-safe (deterministic from seed).
 * Position the parent `relative`; this fills it absolutely.
 */
export function BinaryBackground({
  opacity = 0.06,
  seed = 42,
}: BinaryBackgroundProps) {
  const rows = generateRows(80, 140, seed);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden
    >
      <pre
        className="m-0 p-0 font-mono whitespace-pre text-[var(--color-fg)]"
        style={{
          opacity,
          fontSize: 11,
          lineHeight: "16px",
        }}
      >
        {rows.join("\n")}
      </pre>
    </div>
  );
}

function generateRows(rowCount: number, colCount: number, seed: number) {
  const rand = mulberry32(seed);
  const out: string[] = [];
  for (let r = 0; r < rowCount; r++) {
    let row = "";
    for (let c = 0; c < colCount; c++) {
      row += rand() > 0.5 ? "1" : "0";
      // Occasional grouping space — makes it scan like real binary
      if ((c + 1) % 8 === 0) row += " ";
    }
    out.push(row);
  }
  return out;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
