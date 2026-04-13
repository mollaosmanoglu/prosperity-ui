"use client"

import { Maximize2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
} from "recharts"
import { priceData } from "@/lib/mock-data"

// Downsample for performance
const sampled = priceData.filter((_, i) => i % 4 === 0)

const seriesColors = {
  ask: "#ef4444",
  mid: "#a1a1aa",
  bid: "#22c55e",
  buyFill: "#22c55e",
  sellFill: "#ef4444",
}

const SERIES_TOGGLES = [
  "Prices",
  "Spread",
  "Volume",
] as const

const INDIVIDUAL_TOGGLES = [
  "Bid",
  "Mid",
  "Ask",
  "Depth",
  "Dom Mid",
  "Micro",
  "Deep VAMP",
  "Buy Fills",
  "Sell Fills",
] as const

export function PriceChart() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Price &amp; Liquidity: EMERALDS</h3>
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-3">
            {(["ASK", "MID", "BID", "BUY FILL", "SELL FILL"] as const).map(
              (label) => {
                const colorKey = label.toLowerCase().replace(" ", "") as string
                const color =
                  colorKey === "ask"
                    ? seriesColors.ask
                    : colorKey === "mid"
                      ? seriesColors.mid
                      : colorKey === "bid"
                        ? seriesColors.bid
                        : colorKey === "buyfill"
                          ? seriesColors.buyFill
                          : seriesColors.sellFill
                return (
                  <div key={label} className="flex items-center gap-1">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] text-zinc-500">{label}</span>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5 rounded-lg border border-zinc-200 p-0.5">
          <button className="rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-medium text-white">
            Sampled
          </button>
          <button className="rounded-md px-2 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100">
            Full
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400">Drag to zoom</span>
          <button className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
            <Maximize2 className="size-3" />
            Expand
          </button>
        </div>
      </div>

      {/* Resolution note */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400">
        <span>Resolution: downsampled for performance. Switch to Full to render every visible tick.</span>
        <span>{sampled.length.toLocaleString()} / 2,000 plotted</span>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={sampled} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="tick"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="ask"
              stroke={seriesColors.ask}
              dot={false}
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="mid"
              stroke={seriesColors.mid}
              dot={false}
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
            <Line
              type="monotone"
              dataKey="bid"
              stroke={seriesColors.bid}
              dot={false}
              strokeWidth={1}
            />
            <Scatter dataKey="buyFill" fill={seriesColors.buyFill} shape="triangle" />
            <Scatter dataKey="sellFill" fill={seriesColors.sellFill} shape="triangle" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom toggles */}
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex gap-0.5 rounded-lg border border-zinc-200 p-0.5">
          {SERIES_TOGGLES.map((t, i) => (
            <button
              key={t}
              className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${
                i === 0
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {INDIVIDUAL_TOGGLES.map((t) => (
          <button
            key={t}
            className="rounded-md border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}
