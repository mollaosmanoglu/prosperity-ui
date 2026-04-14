"use client"

import { memo } from "react"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useData, useTick } from "@/lib/dashboard-context"

export const MarketDynamics = memo(function MarketDynamics() {
  const { selectedProduct } = useData()
  const { marketDynamics } = useTick()

  // Parse numeric values for bar widths
  const volNum = parseFloat(marketDynamics.volatility) || 0
  const momNum = parseFloat(marketDynamics.tradeMomentum) || 0
  const effNum = parseFloat(marketDynamics.spreadEfficiency) || 0

  const rows = [
    { label: "Volatility", value: marketDynamics.volatility, pct: Math.min(volNum * 20, 100), color: "bg-zinc-400" },
    { label: "Trade Momentum", value: marketDynamics.tradeMomentum, pct: Math.min(Math.abs(momNum) * 2, 100), color: "bg-zinc-400" },
    { label: "Spread Efficiency", value: marketDynamics.spreadEfficiency, pct: Math.min(effNum * 200, 100), color: "bg-emerald-400" },
  ]

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-semibold">Market Dynamics: {selectedProduct}</h3>
        <Tooltip>
          <TooltipTrigger className="cursor-default"><Info className="size-3 text-zinc-400" /></TooltipTrigger>
          <TooltipContent>Volatility (21-tick rolling stddev), trade volume at tick, and spread/mid ratio</TooltipContent>
        </Tooltip>
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
                className={`h-full rounded-full ${row.color} transition-[width] duration-200 ease-out`}
                style={{ width: `${Math.max(row.pct, 1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})
