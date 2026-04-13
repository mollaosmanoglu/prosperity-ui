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
  ReferenceLine,
} from "recharts"
import { positionData } from "@/lib/mock-data"

const sampled = positionData.filter((_, i) => i % 10 === 0)

export function PositionChart() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Position: EMERALDS</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400">Drag to zoom</span>
          <button className="flex items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[10px] text-zinc-500 hover:bg-zinc-50">
            <Maximize2 className="size-3" />
            Expand
          </button>
        </div>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampled} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid stroke="#f0f0f0" />
            <XAxis
              dataKey="tick"
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
            />
            <YAxis
              domain={[-20, 20]}
              tick={{ fontSize: 10, fill: "#a1a1aa" }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <ReferenceLine y={0} stroke="#a1a1aa" strokeDasharray="3 3" />
            <Line
              isAnimationActive={false}
              type="monotone"
              dataKey="position"
              stroke="#7c3aed"
              dot={false}
              strokeWidth={1.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
