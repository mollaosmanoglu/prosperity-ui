"use client"

import { memo } from "react"
import { Terminal, Code } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export const LogViewer = memo(function LogViewer() {
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
        <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px]">
          Submission log export contains no sandbox logs for this tick.
        </div>
      </TabsContent>
      <TabsContent value="algorithm">
        <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px]">
          No algorithm logs available.
        </div>
      </TabsContent>
    </Tabs>
  )
})
