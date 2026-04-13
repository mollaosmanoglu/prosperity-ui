"use client"

import { Badge } from "@/components/ui/badge"

export function Filters() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-medium">Filters</span>
          <p className="text-[10px] text-zinc-500">
            Tutorial source, day, and product
          </p>
        </div>
        <Badge variant="secondary" className="text-[10px]">2 tracked</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Source */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-zinc-500">Source</span>
          <div className="flex gap-0.5 rounded-lg border border-zinc-200 p-0.5">
            <button className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-medium text-white">
              Tutorial Sub
            </button>
            <button className="rounded-md px-2.5 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100">
              IMC Day Replay
            </button>
          </div>
        </div>
        {/* Product */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-zinc-500">Product</span>
          <div className="flex gap-0.5 rounded-lg border border-zinc-200 p-0.5">
            <button className="rounded-md px-2.5 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100">
              All Products
            </button>
            <button className="rounded-md bg-zinc-900 px-2.5 py-1 text-[10px] font-medium text-white">
              EMERALDS
            </button>
            <button className="rounded-md px-2.5 py-1 text-[10px] font-medium text-zinc-500 hover:bg-zinc-100">
              TOMATOES
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
