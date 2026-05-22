/**
 * Stylized "Creation of Adam" fingertip touch.
 * Two hand silhouettes filled with a 0/1 binary pattern, meeting at a magenta spark.
 */
export function CreationHands() {
  return (
    <svg
      viewBox="0 0 800 360"
      className="h-auto w-full text-[var(--color-fg-muted)]"
      aria-hidden
      role="img"
    >
      <defs>
        {/* Binary text fill pattern */}
        <pattern
          id="binary-fill"
          width="56"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <text
            x="0"
            y="13"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="13"
            fontWeight="500"
            fill="currentColor"
            letterSpacing="1"
          >
            01001101
          </text>
        </pattern>

        {/* Slightly denser/brighter pattern for fingertip emphasis */}
        <pattern
          id="binary-fill-hot"
          width="42"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <text
            x="0"
            y="12"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="12"
            fontWeight="600"
            fill="var(--color-accent)"
            letterSpacing="1"
            opacity="0.85"
          >
            10110
          </text>
        </pattern>

        {/* Magenta glow for the spark */}
        <radialGradient id="spark-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
          <stop offset="40%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </radialGradient>

        {/* Mask: hand silhouette, used to clip pattern + outline */}
        <clipPath id="left-hand-clip">
          <path d={LEFT_HAND_PATH} />
        </clipPath>
        <clipPath id="right-hand-clip">
          <path d={RIGHT_HAND_PATH} />
        </clipPath>
      </defs>

      {/* Decorative drifting binary in background */}
      <g opacity="0.08" fill="currentColor" fontFamily="monospace" fontSize="10">
        <text x="40" y="40">01001000 01100001 01101110 01100100</text>
        <text x="500" y="60">01000111 01101111 01100100</text>
        <text x="60" y="340">01010100 01101111 01110101 01100011 01101000</text>
        <text x="540" y="320">01010011 01110000 01100001 01110010 01101011</text>
      </g>

      {/* LEFT HAND */}
      <g clipPath="url(#left-hand-clip)">
        <rect x="0" y="0" width="400" height="360" fill="url(#binary-fill)" />
        {/* Hot fingertip area */}
        <rect x="320" y="140" width="80" height="80" fill="url(#binary-fill-hot)" />
      </g>
      <path
        d={LEFT_HAND_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.4"
      />

      {/* RIGHT HAND */}
      <g clipPath="url(#right-hand-clip)">
        <rect x="400" y="0" width="400" height="360" fill="url(#binary-fill)" />
        <rect x="400" y="140" width="80" height="80" fill="url(#binary-fill-hot)" />
      </g>
      <path
        d={RIGHT_HAND_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.4"
      />

      {/* SPARK between fingertips */}
      <circle cx="400" cy="180" r="60" fill="url(#spark-glow)" />
      <circle cx="400" cy="180" r="2.5" fill="var(--color-accent)" />
      <line
        x1="392"
        y1="180"
        x2="408"
        y2="180"
        stroke="var(--color-accent)"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="400"
        y1="172"
        x2="400"
        y2="188"
        stroke="var(--color-accent)"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

/* ---- Hand silhouettes ----
 *
 * Stylized "reaching arm with extended index finger" shapes.
 * Coordinates use the 800x360 viewBox.
 * Left hand enters from the left edge, fingertip at ~x=392.
 * Right hand mirrors it from the right, fingertip at ~x=408.
 */

const LEFT_HAND_PATH = [
  "M 0 120",
  "L 220 130",
  "C 260 134 290 142 315 155",
  "L 345 165",
  "C 360 170 372 174 382 178",
  "L 392 181",
  "L 388 188",
  "L 378 192",
  "C 368 196 354 198 340 198",
  "L 330 205",
  "C 350 208 365 214 372 222",
  "L 360 230",
  "C 340 232 318 230 296 224",
  "L 270 222",
  "C 240 228 210 232 180 234",
  "L 0 250",
  "Z",
].join(" ");

const RIGHT_HAND_PATH = [
  "M 800 120",
  "L 580 130",
  "C 540 134 510 142 485 155",
  "L 455 165",
  "C 440 170 428 174 418 178",
  "L 408 181",
  "L 412 188",
  "L 422 192",
  "C 432 196 446 198 460 198",
  "L 470 205",
  "C 450 208 435 214 428 222",
  "L 440 230",
  "C 460 232 482 230 504 224",
  "L 530 222",
  "C 560 228 590 232 620 234",
  "L 800 250",
  "Z",
].join(" ");
