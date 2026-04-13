"use client"

import { motion } from "motion/react"

interface PillTabsProps<T extends string> {
  id: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function PillTabs<T extends string>({ id, options, value, onChange, className }: PillTabsProps<T>) {
  return (
    <div className={`flex gap-0.5 rounded-lg border border-zinc-200 p-0.5 ${className ?? ""}`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className="relative cursor-pointer rounded-md px-2.5 py-0.5 text-[10px] font-medium capitalize"
        >
          {option === value && (
            <motion.span
              layoutId={`pill-${id}`}
              className="absolute inset-0 rounded-md bg-zinc-900"
              transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
            />
          )}
          <span className={`relative z-10 ${option === value ? "text-white" : "text-zinc-500"}`}>
            {option}
          </span>
        </button>
      ))}
    </div>
  )
}
