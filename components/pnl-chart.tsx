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
import { useDashboard } from "@/lib/dashboard-context"

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

export const PnlChart = memo(function PnlChart() {
  const { pnlData, selectedProduct } = useDashboard()
  const sampled = useMemo(() => pnlData.filter((_, i) => i % 10 === 0), [pnlData])
  const productKey = selectedProduct.toLowerCase()
  const productColor = PRODUCT_COLORS[selectedProduct] ?? DEFAULT_COLOR

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%">
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
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">PnL Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-zinc-900" />
              <span className="text-[10px] text-zinc-500">TOTAL</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full" style={{ backgroundColor: productColor }} />
              <span className="text-[10px] text-zinc-500">{selectedProduct}</span>
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
      {renderChart("h-52")}
    </div>
  )
})
