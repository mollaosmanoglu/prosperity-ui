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
} from "recharts"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useData, type ComparisonSeries } from "@/lib/dashboard-context"
import { ChartCursor } from "@/components/chart-cursor"
import { lttb } from "@/lib/lttb"
import type { PnlPoint } from "@/lib/parse-log"

const MARGIN = { top: 5, right: 5, bottom: 5, left: 5 }
const TICK_STYLE = { fontSize: 10, fill: "#a1a1aa" }
const AXIS_LINE = { stroke: "#e4e4e7" }
const TOOLTIP_STYLE = {
  fontSize: 11,
  borderRadius: 8,
  border: "1px solid #e4e4e7",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
}

const PRODUCT_COLORS: Record<string, string> = {
  EMERALDS: "#059669",
  TOMATOES: "#e11d48",
}
const DEFAULT_COLOR = "#2563eb"
const SAMPLE_TARGET = 200

export function PnlChart() {
  const { pnlDataFull, selectedProduct, products, comparisonPnl, comparisonRuns } = useData()
  if (comparisonPnl) {
    return <PnlComparisonInner data={comparisonPnl} runs={comparisonRuns} product={selectedProduct} />
  }
  if (selectedProduct === "ALL") {
    return <PnlAllProductsInner data={pnlDataFull} products={products} />
  }
  return <PnlChartInner data={pnlDataFull} product={selectedProduct} />
}

// margin.left(5) + yAxis(50) = 55px, margin.right(5) = 5px
const CURSOR_STYLE = (p: number) => ({ left: `calc(55px + (100% - 60px) * ${p})`, width: 2, background: '#18181b', opacity: 0.2 })

const PnlChartInner = memo(function PnlChartInner({ data, product }: { data: PnlPoint[], product: string }) {
  const sampled = useMemo(() => lttb(data, SAMPLE_TARGET, d => d.total), [data])
  const productKey = product.toLowerCase()
  const productColor = PRODUCT_COLORS[product] ?? DEFAULT_COLOR

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={sampled} margin={MARGIN}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="tick" tick={TICK_STYLE} tickLine={false} axisLine={AXIS_LINE} />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={50} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line isAnimationActive={false} type="monotone" dataKey="total" stroke="#18181b" dot={false} strokeWidth={1.5} />
            <Line isAnimationActive={false} type="monotone" dataKey={productKey} stroke={productColor} dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold">PnL Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-zinc-900" />
              <span className="text-[10px] text-zinc-500">TOTAL</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full" style={{ backgroundColor: productColor }} />
              <span className="text-[10px] text-zinc-500">{product}</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
              <Maximize2 className="size-3" />
              Expand
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] w-full p-6">
              <h3 className="text-xs font-semibold mb-2">PnL Performance</h3>
              {renderChart("h-[80vh]")}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative overflow-hidden">
        {renderChart("h-52")}
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})

const ALL_PRODUCT_COLORS: Record<string, string> = {
  EMERALDS: "#059669",
  TOMATOES: "#e11d48",
}

const PnlAllProductsInner = memo(function PnlAllProductsInner({ data, products }: { data: PnlPoint[], products: string[] }) {
  const sampled = useMemo(() => lttb(data, SAMPLE_TARGET, d => d.total), [data])

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={sampled} margin={MARGIN}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="tick" tick={TICK_STYLE} tickLine={false} axisLine={AXIS_LINE} />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={50} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Line isAnimationActive={false} type="monotone" dataKey="total" stroke="#18181b" dot={false} strokeWidth={1.5} />
            {products.map(p => (
              <Line key={p} isAnimationActive={false} type="monotone" dataKey={p.toLowerCase()} stroke={ALL_PRODUCT_COLORS[p] ?? DEFAULT_COLOR} dot={false} strokeWidth={1.5} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold">PnL Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-zinc-900" />
              <span className="text-[10px] text-zinc-500">TOTAL</span>
            </div>
            {products.map(p => (
              <div key={p} className="flex items-center gap-1">
                <div className="size-2 rounded-full" style={{ backgroundColor: ALL_PRODUCT_COLORS[p] ?? DEFAULT_COLOR }} />
                <span className="text-[10px] text-zinc-500">{p}</span>
              </div>
            ))}
          </div>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
              <Maximize2 className="size-3" />
              Expand
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] w-full p-6">
              <h3 className="text-xs font-semibold mb-2">PnL Performance</h3>
              {renderChart("h-[80vh]")}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative overflow-hidden">
        {renderChart("h-52")}
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})

const PnlComparisonInner = memo(function PnlComparisonInner({ data, runs, product }: { data: Record<string, number>[], runs: ComparisonSeries[], product: string }) {
  const sampled = useMemo(() => lttb(data, SAMPLE_TARGET, d => d[runs[0]?.name] ?? 0), [data, runs])

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={sampled} margin={MARGIN}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis dataKey="tick" tick={TICK_STYLE} tickLine={false} axisLine={AXIS_LINE} />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} width={50} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-semibold">PnL Comparison: {product}</h3>
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
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
              <h3 className="text-xs font-semibold mb-2">PnL Comparison</h3>
              {renderChart("h-[80vh]")}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="relative overflow-hidden">
        {renderChart("h-52")}
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})
