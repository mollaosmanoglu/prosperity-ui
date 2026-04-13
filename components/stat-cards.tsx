"use client"

import { memo, useMemo } from "react"
import { Info, TrendingUp, TrendingDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboard } from "@/lib/dashboard-context"

export const StatCards = memo(function StatCards() {
  const { stats } = useDashboard()

  const cards = useMemo(() => [
    {
      title: "Total PnL",
      value: stats.totalPnl.toLocaleString(),
      subtitle: "Cumulative",
      trend: "up" as const,
      tooltip: "Total profit and loss across all products",
    },
    {
      title: "Max Drawdown",
      value: stats.maxDrawdown.toLocaleString(),
      subtitle: "Peak-to-Trough",
      trend: "down" as const,
      tooltip: "Largest peak-to-trough decline in PnL",
    },
    {
      title: "EMERALDS PnL",
      value: stats.emeraldsPnl.toLocaleString(),
      subtitle: "By Product",
      trend: "up" as const,
      tooltip: "Profit and loss for EMERALDS only",
    },
    {
      title: "Position",
      value: stats.position.toString(),
      subtitle: "Current Inventory",
      trend: "down" as const,
      tooltip: "Current net position (positive = long, negative = short)",
    },
    {
      title: "Microprice",
      value: stats.microprice.toFixed(2),
      subtitle: `Mid: ${stats.midPrice.toFixed(1)}`,
      trend: null,
      tooltip: "Size-weighted midpoint price from the order book",
    },
  ], [stats])

  return (
    <div className="grid grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-3"
        >
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-zinc-500">
              {card.title}
            </span>
            <Tooltip>
              <TooltipTrigger className="cursor-default">
                <Info className="size-3 text-zinc-400" />
              </TooltipTrigger>
              <TooltipContent>{card.tooltip}</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold font-mono tabular-nums">
              {card.value}
            </span>
            {card.trend === "up" && (
              <TrendingUp className="size-4 text-emerald-500" />
            )}
            {card.trend === "down" && (
              <TrendingDown className="size-4 text-red-500" />
            )}
          </div>
          <span className="text-[10px] text-zinc-400">{card.subtitle}</span>
        </div>
      ))}
    </div>
  )
})
