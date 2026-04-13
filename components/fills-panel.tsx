"use client"

import { TableProperties } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const mockFills = [
  { timestamp: 2900, side: "BUY", symbol: "TOMATOES", price: 4998.0, quantity: 3 },
  { timestamp: 3300, side: "BUY", symbol: "TOMATOES", price: 4997.0, quantity: 3 },
  { timestamp: 3900, side: "SELL", symbol: "TOMATOES", price: 5002.0, quantity: 6 },
  { timestamp: 4200, side: "BUY", symbol: "TOMATOES", price: 5001.0, quantity: 7 },
  { timestamp: 5900, side: "SELL", symbol: "EMERALDS", price: 10007.0, quantity: 8 },
]

export function FillsPanel() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TableProperties className="size-4 text-zinc-500" />
          <h3 className="text-xs font-semibold">Own Fills Details</h3>
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <Checkbox />
          <span className="text-[10px] text-zinc-500">
            Show All Own Fills Through 0
          </span>
        </label>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[11px]">Timestamp</TableHead>
            <TableHead className="text-[11px]">Side</TableHead>
            <TableHead className="text-[11px]">Symbol</TableHead>
            <TableHead className="text-[11px] text-right">Price</TableHead>
            <TableHead className="text-[11px] text-right">Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockFills.map((fill, i) => (
            <TableRow key={i}>
              <TableCell className="text-xs font-mono">{fill.timestamp}</TableCell>
              <TableCell>
                <span
                  className={`text-xs font-medium ${
                    fill.side === "BUY" ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {fill.side}
                </span>
              </TableCell>
              <TableCell className="text-xs">{fill.symbol}</TableCell>
              <TableCell className="text-xs font-mono text-right">
                {fill.price.toLocaleString()}
              </TableCell>
              <TableCell className="text-xs font-mono text-right">
                {fill.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
