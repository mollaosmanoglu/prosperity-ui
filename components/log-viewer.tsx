"use client"

import { memo, useMemo, useState } from "react"
import { Terminal, Code } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useDashboard } from "@/lib/dashboard-context"

export const LogViewer = memo(function LogViewer() {
  const { logs, currentTick } = useDashboard()

  const currentLog = useMemo(() => {
    if (!logs.length) return null
    return logs[currentTick] ?? null
  }, [logs, currentTick])

  return (
    <Tabs defaultValue="sandbox">
      <TabsList>
        <TabsTrigger value="sandbox" className="gap-1.5 text-xs">
          <Terminal className="size-3" />
          Sandbox Logs
        </TabsTrigger>
        <TabsTrigger value="algorithm" className="gap-1.5 text-xs">
          <Code className="size-3" />
          Algorithm Logs
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sandbox">
        <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px] whitespace-pre-wrap">
          {currentLog?.sandboxLog || "Submission log export contains no sandbox logs for this tick."}
        </div>
      </TabsContent>
      <TabsContent value="algorithm">
        <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px] whitespace-pre-wrap">
          {currentLog?.lambdaLog || "No algorithm logs available."}
        </div>
      </TabsContent>
    </Tabs>
  )
})
