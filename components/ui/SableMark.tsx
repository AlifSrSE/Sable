interface SableMarkProps {
  size?: number
}

export function SableMark({ size = 28 }: SableMarkProps) {
  const rx = Math.round(size * 0.27)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      aria-hidden="true"
    >
      {/* Background uses CSS var so it adapts in light mode */}
      <rect width="30" height="30" rx={rx} fill="var(--t1)" />
      <path
        d="M9 21 L15 7 L21 21"
        stroke="var(--bg)"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="11.3" y1="16.5"
        x2="18.7" y2="16.5"
        stroke="var(--v)"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </svg>
  )
}
