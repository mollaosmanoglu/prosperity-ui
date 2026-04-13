"use client"

import { useState } from "react"
import { PillTabs } from "@/components/pill-tabs"
import { useDashboard } from "@/lib/dashboard-context"

const sources = ["Tutorial Sub", "IMC Day Replay"] as const

export function Filters() {
  const { products, selectedProduct, setSelectedProduct } = useDashboard()
  const [source, setSource] = useState<(typeof sources)[number]>("Tutorial Sub")

  const productOptions = ["All Products", ...products] as const

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Source</span>
        <PillTabs id="source" options={sources} value={source} onChange={setSource} />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Product</span>
        <PillTabs
          id="product"
          options={productOptions}
          value={selectedProduct}
          onChange={(v) => setSelectedProduct(v === "All Products" ? products[0] : v)}
        />
      </div>
    </div>
  )
}
