"use client"

import { GitCompare, Eye, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useData, RUN_COLORS } from "@/lib/dashboard-context"

export function RunsPanel() {
  const { runs, activeRun, setActiveRun, comparing, setComparing, hiddenRuns, toggleRunVisibility } = useData()

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-2 md:p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <GitCompare className="size-4 text-zinc-500" />
          <h3 className="text-xs font-semibold">Runs</h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <span className="text-[10px] text-zinc-400">Compare</span>
            <Switch checked={comparing} onCheckedChange={setComparing} className="scale-75" />
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col">
        <div className="grid grid-cols-[1fr_70px_50px_20px] gap-1 px-2 py-1 text-[9px] font-medium text-zinc-400 uppercase tracking-wider">
          <span>Name</span>
          <span className="text-right">PnL</span>
          <span className="text-right">Trades</span>
          <span />
        </div>
        {runs.map((run, i) => {
          const visible = !hiddenRuns.has(run.name)
          const color = RUN_COLORS[i % RUN_COLORS.length]
          return (
            <div
              key={run.name}
              onClick={() => setActiveRun(run.name)}
              className={`grid grid-cols-[1fr_70px_50px_20px] gap-1 items-center rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
                run.name === activeRun ? "bg-blue-50 ring-1 ring-blue-200" : "hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[11px] font-medium truncate">{run.name}</span>
              </div>
              <span className={`text-[11px] font-mono font-semibold text-right ${run.totalPnl > 0 ? "text-emerald-500" : run.totalPnl < 0 ? "text-red-500" : ""}`}>
                {run.totalPnl > 0 ? "+" : ""}{run.totalPnl.toLocaleString()}
              </span>
              <span className="text-[11px] font-mono text-zinc-400 text-right">{run.trades}</span>
              {comparing && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleRunVisibility(run.name) }}
                  className="flex items-center justify-center"
                >
                  {visible ? (
                    <Eye className="size-3 text-zinc-400 hover:text-zinc-600 transition-colors" />
                  ) : (
                    <EyeOff className="size-3 text-zinc-300 hover:text-zinc-500 transition-colors" />
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {runs.length === 0 && (
        <p className="text-[10px] text-zinc-400 text-center py-2">Upload a .log file to get started</p>
      )}
    </div>
  )
}
