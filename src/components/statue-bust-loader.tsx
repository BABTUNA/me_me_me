type StatueBustLoaderProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
};

const TICKER = ["01", "10", "00", "11", "01", "10"];

export function StatueBustLoader({
  width,
  height,
  className = "",
}: StatueBustLoaderProps) {
  const sized = width != null && height != null;

  return (
    <div
      className={`overflow-hidden ${sized ? "" : "h-full w-full"} ${className}`}
      style={sized ? { width, height } : undefined}
      aria-hidden
      role="presentation"
    >
      <div className="statue-loader-frame flex h-full w-full flex-col items-center justify-center border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]/40">
        <div className="statue-loader-scan pointer-events-none absolute inset-0" />

        <div className="relative flex flex-col items-center gap-4 px-6">
          <span className="inline-block h-2 w-2 bg-[var(--color-accent)] statue-loader-pulse" />

          <div className="flex items-center gap-3">
            {TICKER.map((bits, i) => (
              <span
                key={`${bits}-${i}`}
                className="font-mono text-[10px] tracking-widest text-[var(--color-fg-dim)] statue-loader-bit"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                {bits}
              </span>
            ))}
          </div>

          <span className="num tracking-[0.2em] uppercase">loading model</span>
        </div>
      </div>
    </div>
  );
}
