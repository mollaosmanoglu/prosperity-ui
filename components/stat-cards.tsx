"use client"

import { Info, TrendingUp, TrendingDown } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { stats } from "@/lib/mock-data"

const cards = [
  {
    title: "Total PnL",
    value: stats.totalPnl.toLocaleString(),
    subtitle: "Cumulative",
    trend: "up" as const,
  },
  {
    title: "Max Drawdown",
    value: stats.maxDrawdown.toLocaleString(),
    subtitle: "Peak-to-Trough",
    trend: "down" as const,
  },
  {
    title: "EMERALDS PnL",
    value: stats.emeraldsPnl.toLocaleString(),
    subtitle: "By Product",
    trend: "up" as const,
  },
  {
    title: "Position",
    value: stats.position.toString(),
    subtitle: "Current Inventory",
    trend: "down" as const,
  },
  {
    title: "Microprice",
    value: stats.microprice.toFixed(2),
    subtitle: `Mid: ${stats.midPrice.toFixed(1)}`,
    trend: null,
  },
]

export function StatCards() {
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
              <TooltipContent>{card.title}</TooltipContent>
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
}
