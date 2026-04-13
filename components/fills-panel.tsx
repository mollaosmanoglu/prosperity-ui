"use client"

import { memo, useState } from "react"
import { TableProperties, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDashboard } from "@/lib/dashboard-context"

export const FillsPanel = memo(function FillsPanel() {
  const { fills } = useDashboard()
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? fills : fills.slice(0, 5)
  const hasMore = fills.length > 5

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TableProperties className="size-4 text-zinc-500" />
          <h3 className="text-xs font-semibold">Own Fills Details</h3>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox />
          <span className="text-[10px] text-zinc-500">
            Show All Own Fills
          </span>
        </label>
      </div>
      {fills.length === 0 ? (
        <p className="text-xs text-zinc-400 py-4 text-center">No Own Fills</p>
      ) : (
        <div className={expanded ? "max-h-[400px] overflow-y-auto thin-scrollbar pr-1" : ""}>
          <table className="w-full caption-bottom text-sm">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead className="text-[11px]">Timestamp</TableHead>
                <TableHead className="text-[11px]">Side</TableHead>
                <TableHead className="text-[11px]">Symbol</TableHead>
                <TableHead className="text-[11px] text-right">Price</TableHead>
                <TableHead className="text-[11px] text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((fill, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono">{fill.timestamp}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        fill.side === "BUY" ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {fill.side}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{fill.symbol}</TableCell>
                  <TableCell className="text-xs font-mono text-right">
                    {fill.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-right">
                    {fill.quantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>
      )}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-900 transition-colors py-1"
        >
          {expanded ? "Show less" : `Show more (${fills.length} total)`}
          <ChevronDown className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  )
})
