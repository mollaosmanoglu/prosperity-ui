"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, animate, motion, useTransform } from "motion/react"
import { useDashboard } from "@/lib/dashboard-context"

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, format = (n) => n.toLocaleString(), className }: AnimatedNumberProps) {
  const { playing } = useDashboard()

  // During playback: plain span, zero animation overhead
  if (playing) return <span className={className}>{format(value)}</span>

  return <AnimatedNumberInner value={value} format={format} className={className} />
}

function AnimatedNumberInner({ value, format = (n) => n.toLocaleString(), className }: AnimatedNumberProps) {
  const mv = useMotionValue(0)
  const display = useTransform(mv, (v) => format(v))
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      mv.set(value)
      initialized.current = true
      return
    }
    const controls = animate(mv, value, { duration: 0.2, ease: "easeOut" })
    return () => controls.stop()
  }, [value, mv])

  return <motion.span className={className}>{display}</motion.span>
}
