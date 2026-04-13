"use client"

import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function StrategyPanel() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-sm font-semibold">Strategy Management</h3>
        <Info className="size-3 text-zinc-400" />
      </div>
      <button className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-900 bg-zinc-50 p-2.5 text-left">
        <span className="text-xs font-semibold">Tutorial Sub</span>
        <Badge className="text-[10px]">Comparing</Badge>
      </button>
      <p className="text-[10px] text-zinc-400">
        * Click a strategy to view its full details. Use &apos;Compare&apos; to
        overlay PnL on the chart.
      </p>
    </div>
  )
}
