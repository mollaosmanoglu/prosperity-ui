"use client"

import { useState } from "react"
import { PillTabs } from "@/components/pill-tabs"

const sources = ["Tutorial Sub", "IMC Day Replay"] as const
const products = ["All Products", "EMERALDS", "TOMATOES"] as const

export function Filters() {
  const [source, setSource] = useState<(typeof sources)[number]>("Tutorial Sub")
  const [product, setProduct] = useState<(typeof products)[number]>("EMERALDS")

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Source</span>
        <PillTabs id="source" options={sources} value={source} onChange={setSource} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Product</span>
        <PillTabs id="product" options={products} value={product} onChange={setProduct} />
      </div>
    </div>
  )
}
