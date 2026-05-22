type ArrowProps = {
  className?: string;
  variant?: "default" | "accent";
};

export function Arrow({ className = "", variant = "default" }: ArrowProps) {
  const color = variant === "accent" ? "text-[var(--color-accent)]" : "";
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className={`${color} ${className}`}
      aria-hidden
    >
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}
