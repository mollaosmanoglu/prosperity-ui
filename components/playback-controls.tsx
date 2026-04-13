"use client"

import { SkipBack, Play, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { TOTAL_TICKS_COUNT } from "@/lib/mock-data"

export function PlaybackControls() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        {/* Transport buttons */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 p-0.5">
            <Button variant="ghost" className="size-7 p-0">
              <SkipBack className="size-3.5" />
            </Button>
            <Button variant="ghost" className="size-7 p-0">
              <Play className="size-3.5" />
            </Button>
            <Button variant="ghost" className="size-7 p-0">
              <SkipForward className="size-3.5" />
            </Button>
          </div>

          {/* Speed buttons */}
          <div className="flex items-center gap-0.5 rounded-lg border border-zinc-200 p-0.5">
            {["1x", "2x", "5x", "10x", "20x"].map((speed) => (
              <button
                key={speed}
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                  speed === "1x"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>

        {/* Progress input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            defaultValue={0}
            className="h-7 w-14 rounded-md border border-zinc-200 bg-zinc-50 px-2 text-center text-xs font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400/60"
          />
          <span className="text-xs text-zinc-500">0%</span>
        </div>
      </div>

      {/* Timeline info */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Tick 0 / {(TOTAL_TICKS_COUNT - 1).toLocaleString()}
          </span>
          <span className="text-[11px] font-mono text-zinc-400">TS: 0 (D-1)</span>
        </div>
        <Slider defaultValue={[0]} min={0} max={TOTAL_TICKS_COUNT - 1} />
      </div>
    </div>
  )
}
