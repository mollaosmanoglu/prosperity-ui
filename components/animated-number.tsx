"use client"

import { useEffect, useRef } from "react"
import { useMotionValue, animate, motion, useTransform } from "motion/react"
import { useTick } from "@/lib/dashboard-context"

interface AnimatedNumberProps {
  value: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, format = (n) => n.toLocaleString(), className }: AnimatedNumberProps) {
  const { playing } = useTick()

  // During playback: plain span, zero animation overhead
  if (playing) return <span className={className}>{format(value)}</span>

  return <AnimatedNumberInner value={value} format={format} className={className} />
}

function AnimatedNumberInner({ value, format = (n) => n.toLocaleString(), className }: AnimatedNumberProps) {
  const mv = useMotionValue(value)
  const display = useTransform(mv, (v) => format(v))
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current === value) return
    prevValue.current = value
    const controls = animate(mv, value, { duration: 0.2, ease: "easeOut" })
    return () => controls.stop()
  }, [value, mv])

  return <motion.span className={className}>{display}</motion.span>
}
