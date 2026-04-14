"use client"

import { useRef, useState, type ReactNode } from "react"

export function ChartZoomWrapper({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const startRef = useRef<number | null>(null)
  const [sel, setSel] = useState<[number, number] | null>(null)

  return (
    <div
      ref={ref}
      className="relative overflow-hidden select-none"
      onMouseDown={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (rect) startRef.current = e.clientX - rect.left
      }}
      onMouseMove={(e) => {
        if (startRef.current != null) {
          const rect = ref.current?.getBoundingClientRect()
          if (rect) setSel([startRef.current, e.clientX - rect.left])
        }
      }}
      onMouseUp={() => { startRef.current = null; setSel(null) }}
      onMouseLeave={() => { startRef.current = null; setSel(null) }}
    >
      {children}
      {sel && Math.abs(sel[1] - sel[0]) > 4 && (
        <div
          className="absolute top-0 bottom-0 bg-blue-400/20 border-x border-blue-400/40 pointer-events-none"
          style={{ left: Math.min(sel[0], sel[1]), width: Math.abs(sel[1] - sel[0]) }}
        />
      )}
    </div>
  )
}
