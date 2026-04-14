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
import { useData, type ComparisonSeries } from "@/lib/dashboard-context"
import { ChartCursor } from "@/components/chart-cursor"
import { lttb } from "@/lib/lttb"
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
const SAMPLE_TARGET = 200

export function PositionChart() {
  const { positionDataFull, selectedProduct, comparisonPosition, comparisonRuns } = useData()
  if (comparisonPosition) {
    return <PositionComparisonInner data={comparisonPosition} runs={comparisonRuns} product={selectedProduct} />
  }
  return <PositionChartInner data={positionDataFull} product={selectedProduct} />
}

// margin.left(5) + yAxis(30) = 35px, margin.right(5) = 5px
const CURSOR_STYLE = (p: number) => ({ left: `calc(35px + (100% - 40px) * ${p})`, width: 2, background: '#18181b', opacity: 0.2 })

const PositionChartInner = memo(function PositionChartInner({ data, product }: { data: PositionPoint[], product: string }) {
  const sampled = useMemo(() => lttb(data, SAMPLE_TARGET, d => d.position), [data])

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})

const PositionComparisonInner = memo(function PositionComparisonInner({ data, runs, product }: { data: Record<string, number>[], runs: ComparisonSeries[], product: string }) {
  const sampled = useMemo(() => lttb(data, SAMPLE_TARGET, d => d[runs[0]?.name] ?? 0), [data, runs])

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={sampled} margin={MARGIN}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="tick" tick={TICK_STYLE} tickLine={false} axisLine={AXIS_LINE} />
            <YAxis domain={Y_DOMAIN} tick={TICK_STYLE} tickLine={false} axisLine={false} width={30} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <ReferenceLine y={0} stroke="#a1a1aa" strokeDasharray="3 3" />
            {runs.map(r => (
              <Line key={r.name} isAnimationActive={false} type="monotone" dataKey={r.name} stroke={r.color} dot={false} strokeWidth={1.5} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Position Comparison: {product}</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            {runs.map(r => (
              <div key={r.name} className="flex items-center gap-1">
                <div className="size-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-[10px] text-zinc-500 truncate max-w-20">{r.name}</span>
              </div>
            ))}
          </div>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
              <Maximize2 className="size-3" />
              Expand
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] w-full p-6">
              <h3 className="text-xs font-semibold mb-2">Position Comparison: {product}</h3>
              {renderChart("h-[80vh]")}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative overflow-hidden">
        {renderChart("h-44")}
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})
