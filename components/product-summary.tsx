"use client"

import { memo } from "react"
import { Info } from "lucide-react"
import { useData, useTick } from "@/lib/dashboard-context"
import { AnimatedNumber } from "@/components/animated-number"

export const ProductSummary = memo(function ProductSummary() {
  const { selectedProduct } = useData()
  const { productSummary } = useTick()

  const rows = [
    { label: "Position", value: productSummary.position, format: (n: number) => Math.round(n).toString(), color: productSummary.position < 0 ? "text-red-500" : productSummary.position > 0 ? "text-emerald-500" : "" },
    { label: "PnL", value: productSummary.pnl, format: (n: number) => n > 0 ? `+${n.toLocaleString()}` : n.toLocaleString(), color: productSummary.pnl > 0 ? "text-emerald-500" : productSummary.pnl < 0 ? "text-red-500" : "" },
    { label: "Mid Price", value: productSummary.midPrice, format: (n: number) => n.toLocaleString(), color: "" },
    { label: "Spread", value: productSummary.spread, format: (n: number) => n.toFixed(1), color: "" },
  ]

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-semibold">Product Summary: {selectedProduct}</h3>
        <Info className="size-3 text-zinc-400" />
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-md bg-zinc-50 px-2.5 py-1.5"
          >
            <span className="text-[11px] text-zinc-500">{row.label}</span>
            <AnimatedNumber
              value={row.value}
              format={row.format}
              className={`text-xs font-mono font-semibold ${row.color}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
})
