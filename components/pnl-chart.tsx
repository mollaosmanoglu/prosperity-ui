"use client"

import { Maximize2 } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { pnlData } from "@/lib/mock-data"

const sampled = pnlData.filter((_, i) => i % 4 === 0)

export function PnlChart() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">PnL Performance</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-zinc-900" />
              <span className="text-[10px] text-zinc-500">TOTAL</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-zinc-500">EMERALDS</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400">Drag to zoom</span>
          <button className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
            <Maximize2 className="size-3" />
            Expand
          </button>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampled} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis
              dataKey="tick"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#18181b"
              dot={false}
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="emeralds"
              stroke="#10b981"
              dot={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
