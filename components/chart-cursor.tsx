"use client"

import { useTick } from "@/lib/dashboard-context"
import { useData } from "@/lib/dashboard-context"

/**
 * Lightweight cursor line that reads tick state directly from context.
 * Renders independently of the parent chart (bypasses memo via context subscription).
 */
export function ChartCursor({ style }: { style: (p: number) => React.CSSProperties }) {
  const { currentTick } = useTick()
  const { totalTicks } = useData()
  if (currentTick === 0) return null
  const progress = currentTick / Math.max(totalTicks - 1, 1)
  return <div className="absolute top-1 bottom-5 pointer-events-none" style={style(progress)} />
}
