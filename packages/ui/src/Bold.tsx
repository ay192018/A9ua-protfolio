import type { ReactNode } from 'react'

interface BoldProps {
  children: ReactNode
}

/** Bold keyword inline component */
export const Bold = ({ children }: BoldProps) => (
  <span style={{ fontWeight: 900 }}>{children}</span>
)
