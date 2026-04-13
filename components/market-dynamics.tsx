"use client"

import { Info } from "lucide-react"
import { marketDynamics } from "@/lib/mock-data"

const rows = [
  { label: "Volatility", value: marketDynamics.volatility },
  { label: "Trade Momentum", value: marketDynamics.tradeMomentum },
  { label: "Spread Efficiency", value: marketDynamics.spreadEfficiency },
]

export function MarketDynamics() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-semibold">Market Dynamics: EMERALDS</h3>
        <Info className="size-3 text-zinc-400" />
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-md bg-zinc-50 px-2.5 py-1.5"
          >
            <span className="text-[11px] text-zinc-500">{row.label}</span>
            <span className="text-xs font-mono font-semibold">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
