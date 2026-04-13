"use client"

import { useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw, Upload } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboard } from "@/lib/dashboard-context"

export function TickScrubber() {
  const { currentTick, setCurrentTick, playing, setPlaying, totalTicks, loadLog } = useDashboard()
  const rafRef = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxTick = totalTicks - 1
  const atEnd = currentTick >= maxTick

  const stop = useCallback(() => {
    setPlaying(false)
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [setPlaying])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setCurrentTick((t: number) => {
        if (t >= maxTick) {
          stop()
          return maxTick
        }
        return t + 5
      })
    }, 80) // 12.5fps — bounded render budget
    return () => clearInterval(id)
  }, [playing, stop, maxTick, setCurrentTick])

  function togglePlay() {
    if (atEnd) {
      setCurrentTick(0)
      setPlaying(true)
      return
    }
    setPlaying(!playing)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    loadLog(text)
    e.target.value = ""
  }

  return (
    <div className="flex flex-1 items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".log"
        className="hidden"
        onChange={handleUpload}
      />
      <Tooltip>
        <TooltipTrigger
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Upload .log file</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          className="relative flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-white cursor-pointer"
          onClick={togglePlay}
        >
        <AnimatePresence mode="wait">
          {atEnd ? (
            <motion.span
              key="reset"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <RotateCcw className="size-3.5" />
            </motion.span>
          ) : playing ? (
            <motion.span
              key="pause"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Pause className="size-3.5" />
            </motion.span>
          ) : (
            <motion.span
              key="play"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Play className="size-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
        {playing && (
          <motion.span
            className="absolute inset-0 rounded-md bg-white/20"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </TooltipTrigger>
        <TooltipContent>{atEnd ? "Restart" : playing ? "Pause" : "Play"}</TooltipContent>
      </Tooltip>
      <span className="text-[11px] font-mono text-zinc-500 shrink-0">
        {currentTick.toLocaleString()} / {maxTick.toLocaleString()}
      </span>
      <Slider
        value={[currentTick]}
        onValueChange={(v) => { const val = Array.isArray(v) ? v[0] : v; setCurrentTick(val); if (playing) stop() }}
        min={0}
        max={maxTick}
        className="flex-1"
      />
    </div>
  )
}
