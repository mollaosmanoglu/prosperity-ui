"use client"

import { memo } from "react"
import { Info, TrendingUp, TrendingDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboard } from "@/lib/dashboard-context"
import { AnimatedNumber } from "@/components/animated-number"

export const StatCards = memo(function StatCards() {
  const { stats } = useDashboard()

  const cards = [
    {
      title: "Total PnL",
      value: stats.totalPnl,
      format: (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 3 }),
      subtitle: "Cumulative",
      trend: "up" as const,
      tooltip: "Total profit and loss across all products",
    },
    {
      title: "Max Drawdown",
      value: stats.maxDrawdown,
      format: (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 3 }),
      subtitle: "Peak-to-Trough",
      trend: "down" as const,
      tooltip: "Largest peak-to-trough decline in PnL",
    },
    {
      title: "EMERALDS PnL",
      value: stats.emeraldsPnl,
      format: (n: number) => n.toLocaleString(),
      subtitle: "By Product",
      trend: "up" as const,
      tooltip: "Profit and loss for EMERALDS only",
    },
    {
      title: "Position",
      value: stats.position,
      format: (n: number) => Math.round(n).toString(),
      subtitle: "Current Inventory",
      trend: stats.position < 0 ? "down" as const : stats.position > 0 ? "up" as const : null,
      tooltip: "Current net position (positive = long, negative = short)",
    },
    {
      title: "Microprice",
      value: stats.microprice,
      format: (n: number) => n.toFixed(2),
      subtitle: `Mid: ${stats.midPrice.toFixed(1)}`,
      trend: null,
      tooltip: "Size-weighted midpoint price from the order book",
    },
  ]

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
            <AnimatedNumber
              value={card.value}
              format={card.format}
              className="text-lg font-bold font-mono tabular-nums"
            />
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
