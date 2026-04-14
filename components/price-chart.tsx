"use client"

import { useState, useMemo, useCallback, memo } from "react"
import { SlidersHorizontal, Maximize2 } from "lucide-react"
import { PillTabs } from "@/components/pill-tabs"
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
} from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useData } from "@/lib/dashboard-context"
import { ChartCursor } from "@/components/chart-cursor"
import { lttb } from "@/lib/lttb"
import type { PricePoint } from "@/lib/parse-log"

type ChartView = "prices" | "spread" | "volume"

const seriesColors = {
  ask: "#ef4444",
  mid: "#18181b",
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
const SAMPLE_TARGET = 500

const CHART_TICK = { fontSize: 10, fill: "#a1a1aa" }
const CHART_MARGIN = { top: 5, right: 5, bottom: 5, left: 5 }
const AXIS_LINE = { stroke: "#e4e4e7" }
const Y_DOMAIN_AUTO: [string, string] = ["auto", "auto"]
const TOOLTIP_STYLE = {
  fontSize: 11,
  borderRadius: 8,
  border: "1px solid #e4e4e7",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
}

// Only render a circle where a fill value exists — skips nulls entirely
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fillDot = (color: string) => (props: any) => {
  const { cx, cy, payload, dataKey } = props
  if (payload[dataKey] == null || !cx || !cy) return <g />
  return <circle cx={cx} cy={cy} r={3} fill={color} stroke="#fff" strokeWidth={1} />
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PriceTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  const data = payload[0]?.payload
  if (!data) return null

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md">
      <p className="text-[10px] font-mono text-zinc-400 mb-1.5">{label}</p>
      {data.ask != null && (
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: seriesColors.ask }} />
          <span className="text-[10px] text-zinc-500">Ask</span>
          <span className="ml-auto text-[10px] font-mono font-medium">{data.ask.toLocaleString()}</span>
        </div>
      )}
      {data.mid != null && (
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: seriesColors.mid }} />
          <span className="text-[10px] text-zinc-500">Mid</span>
          <span className="ml-auto text-[10px] font-mono font-medium">{data.mid.toLocaleString()}</span>
        </div>
      )}
      {data.bid != null && (
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: seriesColors.bid }} />
          <span className="text-[10px] text-zinc-500">Bid</span>
          <span className="ml-auto text-[10px] font-mono font-medium">{data.bid.toLocaleString()}</span>
        </div>
      )}
      {data.buyFill != null && (
        <>
          <div className="my-1 border-t border-zinc-100" />
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: seriesColors.buyFill }} />
            <span className="text-[10px] font-medium text-emerald-600">BUY</span>
            <span className="ml-auto text-[10px] font-mono font-medium">@ {data.buyFill.toLocaleString()}</span>
          </div>
        </>
      )}
      {data.sellFill != null && (
        <>
          {data.buyFill == null && <div className="my-1 border-t border-zinc-100" />}
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: seriesColors.sellFill }} />
            <span className="text-[10px] font-medium text-red-500">SELL</span>
            <span className="ml-auto text-[10px] font-mono font-medium">@ {data.sellFill.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  )
}

// margin.left(5) + yAxis(50) = 55px left offset, margin.right(5) = 5px right offset
const CURSOR_STYLE = (p: number) => ({ left: `calc(55px + (100% - 60px) * ${p})`, width: 2, background: '#18181b', opacity: 0.2 })

export function PriceChart() {
  const { priceDataFull, selectedProduct } = useData()
  return <PriceChartInner data={priceDataFull} product={selectedProduct} />
}

const PriceChartInner = memo(function PriceChartInner({ data: fullData, product }: { data: PricePoint[], product: string }) {
  const [view, setView] = useState<ChartView>("prices")
  const [resolution, setResolution] = useState<"sampled" | "full">("sampled")
  const [visible, setVisible] = useState<Set<string>>(new Set(SERIES_KEYS))
  const [advanced, setAdvanced] = useState<Set<string>>(new Set())

  const sampledData = useMemo(() => lttb(fullData, SAMPLE_TARGET, d => d.mid), [fullData])
  const data = resolution === "sampled" ? sampledData : fullData

  const spreadData = useMemo(
    () => sampledData.map((d) => ({ tick: d.tick, spread: Math.round((d.ask - d.bid) * 10) / 10 })),
    [sampledData]
  )
  const volumeData = useMemo(
    () => sampledData.map((d, i) => ({ tick: d.tick, volume: Math.round((d.ask - d.bid) * (3 + (i % 5) + 1)) })),
    [sampledData]
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

  const renderChart = useCallback((height: string) => {
    return (
      <div className={height}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          {view === "prices" ? (
            <ComposedChart data={data} margin={CHART_MARGIN}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={AXIS_LINE} />
              <YAxis domain={Y_DOMAIN_AUTO} tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip content={<PriceTooltip />} />
              {show("ask") && <Line isAnimationActive={false} type="monotone" dataKey="ask" stroke={seriesColors.ask} dot={false} strokeWidth={1} />}
              {show("mid") && <Line isAnimationActive={false} type="monotone" dataKey="mid" stroke={seriesColors.mid} dot={false} strokeWidth={1.5} strokeDasharray="4 2" />}
              {show("bid") && <Line isAnimationActive={false} type="monotone" dataKey="bid" stroke={seriesColors.bid} dot={false} strokeWidth={1} />}
              {show("buyFill") && <Line isAnimationActive={false} type="monotone" dataKey="buyFill" stroke="none" dot={fillDot(seriesColors.buyFill)} connectNulls={false} />}
              {show("sellFill") && <Line isAnimationActive={false} type="monotone" dataKey="sellFill" stroke="none" dot={fillDot(seriesColors.sellFill)} connectNulls={false} />}
            </ComposedChart>
          ) : view === "spread" ? (
            <BarChart data={spreadData} margin={CHART_MARGIN}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={AXIS_LINE} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar isAnimationActive={false} dataKey="spread" fill={seriesColors.spread} />
            </BarChart>
          ) : (
            <BarChart data={volumeData} margin={CHART_MARGIN}>
              <CartesianGrid stroke="#f0f0f0" />
              <XAxis dataKey="tick" tick={CHART_TICK} tickLine={false} axisLine={AXIS_LINE} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar isAnimationActive={false} dataKey="volume" fill={seriesColors.volume} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    )
  }, [view, data, spreadData, volumeData, visible])

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold">Price &amp; Liquidity: {product}</h3>
        <div className="flex items-center gap-2">
          <PillTabs id="resolution" options={["sampled", "full"] as const} value={resolution} onChange={setResolution} />
          <span className="text-[10px] text-zinc-400">
            {data.length.toLocaleString()} / {fullData.length.toLocaleString()}
          </span>
          <Dialog>
            <DialogTrigger className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
              <Maximize2 className="size-3" />
              Expand
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] w-full p-6">
              <h3 className="text-xs font-semibold mb-2">Price &amp; Liquidity: {product}</h3>
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

      <div className="relative overflow-hidden">
        {renderChart("h-64")}
        <ChartCursor style={CURSOR_STYLE} />
      </div>
    </div>
  )
})
