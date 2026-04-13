"use client"

import { TableProperties } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function FillsPanel() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TableProperties className="size-4 text-zinc-500" />
          <h3 className="text-sm font-semibold">Own Fills Details</h3>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox />
          <span className="text-[10px] text-zinc-500">
            Show All Own Fills Through 0
          </span>
        </label>
      </div>
      <div className="flex items-center justify-center rounded-md bg-zinc-50 py-6 text-xs text-zinc-400">
        No Own Fills At This Tick
      </div>
    </div>
  )
}
