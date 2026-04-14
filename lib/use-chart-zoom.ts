"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useChartZoom<T extends { tick: number; [key: string]: any }>(fullData: T[]) {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null)
  const dragRef = useRef<{ start: string | null; end: string | null }>({ start: null, end: null })

  useEffect(() => setZoomDomain(null), [fullData])

  const zoomedData = useMemo(() => {
    if (!zoomDomain) return fullData
    return fullData.filter(d => d.tick >= zoomDomain[0] && d.tick <= zoomDomain[1])
  }, [fullData, zoomDomain])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMouseDown = useCallback((e: any) => {
    if (e?.activeLabel != null) dragRef.current = { start: String(e.activeLabel), end: null }
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMouseMove = useCallback((e: any) => {
    if (dragRef.current.start && e?.activeLabel != null) dragRef.current.end = String(e.activeLabel)
  }, [])
  const onMouseUp = useCallback(() => {
    const { start, end } = dragRef.current
    if (start && end) {
      const left = Math.min(Number(start), Number(end))
      const right = Math.max(Number(start), Number(end))
      if (right > left) setZoomDomain([left, right])
    }
    dragRef.current = { start: null, end: null }
  }, [])

  return {
    zoomedData,
    zoomDomain,
    resetZoom: useCallback(() => setZoomDomain(null), []),
    chartHandlers: { onMouseDown, onMouseMove, onMouseUp },
  }
}
