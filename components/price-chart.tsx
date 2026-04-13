"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal, Maximize2 } from "lucide-react"
import { PillTabs } from "@/components/pill-tabs"
import {
  Bar,
  Brush,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  BarChart,
} from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { priceData } from "@/lib/mock-data"

type ChartView = "prices" | "spread" | "volume"

const fullData = priceData
const sampledData = priceData.filter((_, i) => i % 10 === 0)

const seriesColors = {
  ask: "#ef4444",
  mid: "#a1a1aa",
  bid: "#22c55e",
  buyFill: "#3b82f6",
  sellFill: "#f97316",
  spread: "#18181b",
  volume: "#22c55e",
}

const SERIES_KEYS = ["bid", "mid", "ask", "buyFill", "sellFill"] as const
const SERIES_LABELS: Record<string, { label: string; color: string }> = {
  ask: { label: "Ask", color: seriesColors.ask },
  mid: { label: "Mid", color: seriesColors.mid },
  bid: { label: "Bid", color: seriesColors.bid },
  buyFill: { label: "Buy Fills", color: seriesColors.buyFill },
  sellFill: { label: "Sell Fills", color: seriesColors.sellFill },
}

const ADVANCED_KEYS = ["Depth", "Dom Mid", "Micro", "Deep VAMP"] as const

const CHART_TICK = { fontSize: 10, fill: "#a1a1aa" }
const TOOLTIP_STYLE = {
  fontSize: 11,
  borderRadius: 8,
  border: "1px solid #e4e4e7",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
}

export function PriceChart() {
  const [view, setView] = useState<ChartView>("prices")
  const [resolution, setResolution] = useState<"sampled" | "full">("sampled")
  const [visible, setVisible] = useState<Set<string>>(new Set(SERIES_KEYS))
  const [advanced, setAdvanced] = useState<Set<string>>(new Set())

  const data = resolution === "sampled" ? sampledData : fullData

  const spreadData = useMemo(
    () => data.map((d) => ({ tick: d.tick, spread: Math.round((d.ask - d.bid) * 10) / 10 })),
    [data]
  )
  const volumeData = useMemo(
    () => data.map((d) => ({ tick: d.tick, volume: Math.round((d.ask - d.bid) * (3 + Math.random() * 5)) })),
    [data]
  )

  function toggleSeries(key: string) {
    setVisible((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function toggleAdvanced(key: string) {
    setAdvanced((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const show = (key: string) => visible.has(key)

  function renderChart(height: string) {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%">
          {view === "prices" ? (
            <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} />
              <YAxis domain={["auto", "auto"]} tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              {show("ask") && <Line isAnimationActive={false} type="monotone" dataKey="ask" stroke={seriesColors.ask} dot={false} strokeWidth={1} />}
              {show("mid") && <Line isAnimationActive={false} type="monotone" dataKey="mid" stroke={seriesColors.mid} dot={false} strokeWidth={1.5} strokeDasharray="4 2" />}
              {show("bid") && <Line isAnimationActive={false} type="monotone" dataKey="bid" stroke={seriesColors.bid} dot={false} strokeWidth={1} />}
              {show("buyFill") && <Scatter isAnimationActive={false} dataKey="buyFill" fill={seriesColors.buyFill} shape="triangle" />}
              {show("sellFill") && <Scatter isAnimationActive={false} dataKey="sellFill" fill={seriesColors.sellFill} shape="triangle" />}
              <Brush dataKey="tick" height={12} stroke="#e4e4e7" fill="#fafafa" travellerWidth={6} tickFormatter={() => ""} />
            </ComposedChart>
          ) : view === "spread" ? (
            <BarChart data={spreadData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar isAnimationActive={false} dataKey="spread" fill={seriesColors.spread} />
              <Brush dataKey="tick" height={12} stroke="#e4e4e7" fill="#fafafa" travellerWidth={6} tickFormatter={() => ""} />
            </BarChart>
          ) : (
            <BarChart data={volumeData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar isAnimationActive={false} dataKey="volume" fill={seriesColors.volume} />
              <Brush dataKey="tick" height={12} stroke="#e4e4e7" fill="#fafafa" travellerWidth={6} tickFormatter={() => ""} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Price &amp; Liquidity: EMERALDS</h3>
        <div className="flex items-center gap-2">
          <PillTabs id="resolution" options={["sampled", "full"] as const} value={resolution} onChange={setResolution} />
          <span className="text-[10px] text-zinc-400">
            {data.length.toLocaleString()} / 2,000
          </span>
          <Dialog>
            <DialogTrigger className="flex size-6 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
              <Maximize2 className="size-3" />
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] w-full p-6">
              <h3 className="text-xs font-semibold mb-2">Price &amp; Liquidity: EMERALDS</h3>
              {renderChart("h-[80vh]")}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* View tabs + series toggles */}
      <div className="flex items-center justify-between">
        <PillTabs id="chart-view" options={["prices", "spread", "volume"] as const} value={view} onChange={setView} />

        {view === "prices" && (
            <div className="flex items-center gap-0.5">
              {SERIES_KEYS.map((key) => {
                const s = SERIES_LABELS[key]
                const active = visible.has(key)
                return (
                  <button
                    key={key}
                    onClick={() => toggleSeries(key)}
                    className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      active ? "bg-zinc-100 text-zinc-900" : "text-zinc-400"
                    }`}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: active ? s.color : "#d4d4d8" }}
                    />
                    {s.label}
                  </button>
                )
              })}
              <Popover>
                <PopoverTrigger className="flex size-6 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50">
                  <SlidersHorizontal className="size-3" />
                </PopoverTrigger>
                <PopoverContent align="end" className="w-44 p-2">
                  <p className="mb-1.5 text-[10px] font-medium text-zinc-400">Advanced</p>
                  <div className="flex flex-wrap gap-1">
                    {ADVANCED_KEYS.map((key) => (
                      <button
                        key={key}
                        onClick={() => toggleAdvanced(key)}
                        className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          advanced.has(key) ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                        }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
      </div>

      {renderChart("h-64")}
    </div>
  )
}
