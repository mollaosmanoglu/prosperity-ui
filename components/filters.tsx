"use client"

import { useState } from "react"

const sources = ["Tutorial Sub", "IMC Day Replay"]
const products = ["All Products", "EMERALDS", "TOMATOES"]

export function Filters() {
  const [source, setSource] = useState("Tutorial Sub")
  const [product, setProduct] = useState("EMERALDS")

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Source</span>
        <div className="flex gap-0.5 rounded-lg border border-zinc-200 bg-white p-0.5">
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                s === source
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-zinc-400">Product</span>
        <div className="flex gap-0.5 rounded-lg border border-zinc-200 bg-white p-0.5">
          {products.map((p) => (
            <button
              key={p}
              onClick={() => setProduct(p)}
              className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                p === product
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:bg-zinc-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
