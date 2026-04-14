"use client"

import { memo, useMemo } from "react"
import { Maximize2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useDashboard } from "@/lib/dashboard-context"
import type { PositionPoint } from "@/lib/parse-log"

const MARGIN = { top: 5, right: 5, bottom: 5, left: 5 }
const TICK_STYLE = { fontSize: 10, fill: "#a1a1aa" }
const AXIS_LINE = { stroke: "#e4e4e7" }
const Y_DOMAIN: [number, number] = [-20, 20]
const TOOLTIP_STYLE = {
  fontSize: 11,
  borderRadius: 8,
  border: "1px solid #e4e4e7",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
}

// Thin wrapper: re-renders on tick (cheap), passes stable refs to inner
export function PositionChart() {
  const { positionDataFull, selectedProduct, currentTick, totalTicks, playing } = useDashboard()
  const pct = (currentTick / Math.max(totalTicks - 1, 1)) * 100
  return <PositionChartInner data={positionDataFull} product={selectedProduct} cursorPct={playing ? pct : null} />
}

const PositionChartInner = memo(function PositionChartInner({ data, product, cursorPct }: { data: PositionPoint[], product: string, cursorPct: number | null }) {
  const sampled = useMemo(() => data.filter((_, i) => i % 10 === 0), [data])

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampled} margin={MARGIN}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="tick" tick={TICK_STYLE} tickLine={false} axisLine={AXIS_LINE} />
            <YAxis domain={Y_DOMAIN} tick={TICK_STYLE} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={0} stroke="#a1a1aa" strokeDasharray="3 3" />
            <Line isAnimationActive={false} type="monotone" dataKey="position" stroke="#6d28d9" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Position: {product}</h3>
        <Dialog>
          <DialogTrigger className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
            <Maximize2 className="size-3" />
            Expand
          </DialogTrigger>
          <DialogContent className="!max-w-[95vw] w-full p-6">
            <h3 className="text-xs font-semibold mb-2">Position: {product}</h3>
            {renderChart("h-[80vh]")}
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative overflow-hidden">
        {renderChart("h-44")}
        {cursorPct != null && <div className="absolute top-1 bottom-1 pointer-events-none" style={{ left: `${cursorPct}%`, width: 2, background: '#18181b', opacity: 0.2 }} />}
      </div>
    </div>
  )
})
