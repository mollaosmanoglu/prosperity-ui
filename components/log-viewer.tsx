"use client"

import { Terminal, Code, Database } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function LogViewer() {
  return (
    <Tabs defaultValue="sandbox">
      <TabsList>
        <TabsTrigger value="sandbox" className="gap-1.5">
          <Terminal className="size-3.5" />
          Sandbox Logs
        </TabsTrigger>
        <TabsTrigger value="algorithm" className="gap-1.5">
          <Code className="size-3.5" />
          Algorithm Logs
        </TabsTrigger>
        <TabsTrigger value="trader" className="gap-1.5">
          <Database className="size-3.5" />
          Trader Data
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
      <TabsContent value="trader">
        <div className="rounded-xl bg-zinc-900 p-4 font-mono text-xs text-zinc-400 min-h-[160px]">
          No trader data available.
        </div>
      </TabsContent>
    </Tabs>
  )
}
