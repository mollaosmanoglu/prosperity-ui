"use client"

import { memo, useMemo } from "react"
import { Info } from "lucide-react"
import { useDashboard } from "@/lib/dashboard-context"

export const ProductSummary = memo(function ProductSummary() {
  const { productSummary, selectedProduct } = useDashboard()

  const rows = useMemo(() => [
    { label: "Position", value: productSummary.position.toString(), color: productSummary.position < 0 ? "text-red-500" : productSummary.position > 0 ? "text-emerald-500" : "" },
    { label: "PnL", value: productSummary.pnl > 0 ? `+${productSummary.pnl.toLocaleString()}` : productSummary.pnl.toLocaleString(), color: productSummary.pnl > 0 ? "text-emerald-500" : productSummary.pnl < 0 ? "text-red-500" : "" },
    { label: "Mid Price", value: productSummary.midPrice.toLocaleString(), color: "" },
    { label: "Spread", value: productSummary.spread.toFixed(1), color: "" },
  ], [productSummary])

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
            <span className={`text-xs font-mono font-semibold ${row.color}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
})
