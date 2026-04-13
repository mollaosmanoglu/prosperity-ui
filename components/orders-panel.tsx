"use client"

import { FileText, ArrowRightLeft, BarChart3 } from "lucide-react"

const panels = [
  {
    icon: FileText,
    title: "Submitted Orders",
    message: "Unavailable In Submission Log Export",
  },
  {
    icon: ArrowRightLeft,
    title: "Own Fills At This Tick",
    message: "No Own Fills",
  },
  {
    icon: BarChart3,
    title: "Market Trades At This Tick",
    message: "No Trades",
  },
]

export function OrdersPanel() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {panels.map((panel) => (
        <div
          key={panel.title}
          className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3"
        >
          <div className="flex items-center gap-1.5">
            <panel.icon className="size-4 text-zinc-500" />
            <h3 className="text-xs font-semibold">{panel.title}</h3>
          </div>
          <div className="flex items-center justify-center rounded-md bg-zinc-50 py-4 text-[11px] text-zinc-400">
            {panel.message}
          </div>
        </div>
      ))}
    </div>
  )
}
