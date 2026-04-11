interface IconArrowRightProps {
  size?: number
  color?: string
}

/** Arrow right SVG icon */
export const IconArrowRight = ({ size = 24, color = 'currentColor' }: IconArrowRightProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </g>
  </svg>
)

interface IconArrowDownProps {
  size?: number
  color?: string
}

/** Arrow down SVG icon */
export const IconArrowDown = ({ size = 24, color = 'currentColor' }: IconArrowDownProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M12 19L19 12M12 19L5 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface IconLockProps {
  size?: number
  color?: string
}

/** Lock SVG icon */
export const IconLock = ({ size = 14, color = 'currentColor' }: IconLockProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <g>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeDasharray="0.8 1" />
    </g>
  </svg>
)
