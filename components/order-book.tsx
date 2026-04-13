"use client"

import { BarChart3 } from "lucide-react"
import { orderBook } from "@/lib/mock-data"

export function OrderBook() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="size-4 text-zinc-500" />
          <h3 className="text-sm font-semibold">Order Book: EMERALDS</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-zinc-500">SPREAD:</span>
          <span className="font-mono font-semibold">{orderBook.spread.toFixed(1)}</span>
        </div>
      </div>

      {/* Book */}
      <div className="font-mono text-xs">
        {/* Header row */}
        <div className="grid grid-cols-3 gap-1 border-b border-zinc-100 pb-1 text-[10px] text-zinc-400">
          <span className="text-right">Size</span>
          <span className="text-center">Price</span>
          <span className="text-left">Size</span>
        </div>

        {/* Empty top */}
        <div className="grid grid-cols-3 gap-1 py-0.5 text-zinc-300">
          <span className="text-right">00</span>
          <span className="text-center">00,000</span>
          <span className="text-left">00</span>
        </div>

        {/* Asks (red side) */}
        {orderBook.asks.map((level) => (
          <div key={level.price} className="grid grid-cols-3 gap-1 py-0.5">
            <span className="text-right" />
            <span className="text-center text-red-500">
              {level.price.toLocaleString()}
            </span>
            <span className="text-left font-semibold text-red-500">
              {level.size}
            </span>
          </div>
        ))}

        {/* Mid */}
        <div className="my-1 border-y border-zinc-100 py-1 text-center text-[10px] text-zinc-400">
          MID: {orderBook.midPrice.toFixed(1)}
        </div>

        {/* Bids (green side) */}
        {orderBook.bids.map((level) => (
          <div key={level.price} className="grid grid-cols-3 gap-1 py-0.5">
            <span className="text-right font-semibold text-emerald-500">
              {level.size}
            </span>
            <span className="text-center text-emerald-500">
              {level.price.toLocaleString()}
            </span>
            <span className="text-left" />
          </div>
        ))}

        {/* Empty bottom */}
        <div className="grid grid-cols-3 gap-1 py-0.5 text-zinc-300">
          <span className="text-right">00</span>
          <span className="text-center">00,000</span>
          <span className="text-left">00</span>
        </div>
      </div>

      {/* Market Pressure */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <BarChart3 className="size-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-500">Market Pressure</span>
          </div>
          <span className="text-[10px] font-mono font-semibold">0.00%</span>
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-300" />
        </div>
        <div className="flex justify-between text-[9px] text-zinc-400">
          <span>Bids Heavy</span>
          <span>Asks Heavy</span>
        </div>
      </div>
    </div>
  )
}
