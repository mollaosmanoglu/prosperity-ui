"use client"

import { memo } from "react"
import { Info } from "lucide-react"
import { marketDynamics } from "@/lib/mock-data"

const rows = [
  { label: "Volatility", value: marketDynamics.volatility, pct: 0, color: "bg-zinc-400" },
  { label: "Trade Momentum", value: marketDynamics.tradeMomentum, pct: 50, color: "bg-zinc-400" },
  { label: "Spread Efficiency", value: marketDynamics.spreadEfficiency, pct: 16, color: "bg-emerald-400" },
]

export const MarketDynamics = memo(function MarketDynamics() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-semibold">Market Dynamics: EMERALDS</h3>
        <Info className="size-3 text-zinc-400" />
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">{row.label}</span>
              <span className="text-[11px] font-mono font-semibold">{row.value}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100">
              <div
                className={`h-full rounded-full ${row.color}`}
                style={{ width: `${Math.max(row.pct, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
