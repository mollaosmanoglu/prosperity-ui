"use client"

import { memo, useMemo } from "react"
import { BarChart3 } from "lucide-react"
import { useData, useTick } from "@/lib/dashboard-context"
import { AnimatedNumber } from "@/components/animated-number"

export const OrderBook = memo(function OrderBook() {
  const { selectedProduct } = useData()
  const { orderBook } = useTick()

  // Market pressure: bid volume vs ask volume
  const { pressure, pressurePct } = useMemo(() => {
    const totalBid = orderBook.bids.reduce((s, b) => s + b.size, 0)
    const totalAsk = orderBook.asks.reduce((s, a) => s + a.size, 0)
    const total = totalBid + totalAsk
    if (total === 0) return { pressure: 0, pressurePct: 50 }
    const pct = (totalBid / total) * 100
    return { pressure: Math.round((pct - 50) * 2) / 100, pressurePct: pct }
  }, [orderBook])

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="size-4 text-zinc-500" />
          <h3 className="text-xs font-semibold">Order Book: {selectedProduct}</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-zinc-500">SPREAD:</span>
          <AnimatedNumber value={orderBook.spread} format={(n) => n.toFixed(1)} className="font-mono font-semibold" />
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
        {orderBook.asks.map((level, i) => (
          <div key={i} className="grid grid-cols-3 gap-1 py-0.5">
            <span className="text-right" />
            <AnimatedNumber value={level.price} format={(n) => Math.round(n).toLocaleString()} className="text-center text-red-500" />
            <AnimatedNumber value={level.size} format={(n) => Math.round(n).toString()} className="text-left font-semibold text-red-500" />
          </div>
        ))}

        {/* Mid */}
        <div className="my-1 border-y border-zinc-100 py-1 text-center text-[10px] text-zinc-400">
          MID: <AnimatedNumber value={orderBook.midPrice} format={(n) => n.toFixed(1)} />
        </div>

        {/* Bids (green side) */}
        {orderBook.bids.map((level, i) => (
          <div key={i} className="grid grid-cols-3 gap-1 py-0.5">
            <AnimatedNumber value={level.size} format={(n) => Math.round(n).toString()} className="text-right font-semibold text-emerald-500" />
            <AnimatedNumber value={level.price} format={(n) => Math.round(n).toLocaleString()} className="text-center text-emerald-500" />
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
          <AnimatedNumber value={pressure} format={(n) => `${n.toFixed(2)}%`} className="text-[10px] font-mono font-semibold" />
        </div>
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="absolute inset-y-0 left-1/2 w-px bg-zinc-300" />
          <div
            className="absolute inset-y-0 bg-emerald-400/60 rounded-full transition-all duration-200 ease-out"
            style={{
              left: `${Math.min(pressurePct, 50)}%`,
              width: `${Math.abs(pressurePct - 50)}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-medium text-zinc-400 uppercase tracking-wider">
          <span>Bids</span>
          <span>Asks</span>
        </div>
      </div>
    </div>
  )
})
