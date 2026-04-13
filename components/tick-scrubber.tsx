"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Slider } from "@/components/ui/slider"
import { TOTAL_TICKS_COUNT } from "@/lib/mock-data"

const MAX_TICK = TOTAL_TICKS_COUNT - 1

export function TickScrubber() {
  const [playing, setPlaying] = useState(false)
  const [tick, setTick] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const atEnd = tick >= MAX_TICK

  const stop = useCallback(() => {
    setPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setTick(0)
  }, [stop])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTick((t) => {
          if (t >= MAX_TICK) {
            stop()
            return MAX_TICK
          }
          return t + 10
        })
      }, 16)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, stop])

  function togglePlay() {
    if (atEnd) {
      setTick(0)
      setPlaying(true)
      return
    }
    setPlaying(!playing)
  }

  return (
    <div className="flex flex-1 items-center gap-3">
      <button
        className="relative flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-white"
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
            className="absolute inset-0 rounded-md bg-zinc-900"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </button>
      <span className="text-[11px] font-mono text-zinc-500 shrink-0">
        {tick.toLocaleString()} / {MAX_TICK.toLocaleString()}
      </span>
      <Slider
        value={[tick]}
        onValueChange={(v: number[]) => { setTick(v[0]); if (playing) stop() }}
        min={0}
        max={MAX_TICK}
        className="flex-1"
      />
    </div>
  )
}
