"use client"

import { memo, useMemo, useState } from "react"
import { PillTabs } from "@/components/pill-tabs"
import { useDashboard } from "@/lib/dashboard-context"

const tabs = ["Sandbox Logs", "Algorithm Logs"] as const

export const LogViewer = memo(function LogViewer() {
  const { logs, currentTick } = useDashboard()
  const [tab, setTab] = useState<(typeof tabs)[number]>("Sandbox Logs")

  const currentLog = useMemo(() => {
    if (!logs.length) return null
    return logs[currentTick] ?? null
  }, [logs, currentTick])

  const content = tab === "Sandbox Logs"
    ? currentLog?.sandboxLog || "Submission log export contains no sandbox logs for this tick."
    : currentLog?.lambdaLog || "No algorithm logs available."

  return (
    <div className="flex flex-col gap-2">
      <PillTabs id="logs" options={tabs} value={tab} onChange={setTab} />
      <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px] whitespace-pre-wrap">
        {content}
      </div>
    </div>
  )
})
