"use client"

import { PlaybackControls } from "@/components/playback-controls"
import { StatCards } from "@/components/stat-cards"
import { Filters } from "@/components/filters"
import { PriceChart } from "@/components/price-chart"
import { PnlChart } from "@/components/pnl-chart"
import { PositionChart } from "@/components/position-chart"
import { OrderBook } from "@/components/order-book"
import { ProductSummary } from "@/components/product-summary"
import { MarketDynamics } from "@/components/market-dynamics"
import { FillsPanel } from "@/components/fills-panel"
import { LogViewer } from "@/components/log-viewer"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans">
      <div className="mx-auto max-w-7xl p-4 space-y-4">
        <h2 className="text-lg font-bold">Dashboard</h2>

        <PlaybackControls />
        <StatCards />
        <Filters />

        <div className="grid grid-cols-[1fr_300px] gap-4">
          <div className="space-y-4">
            <PriceChart />
            <PnlChart />
            <PositionChart />
          </div>
          <div className="space-y-4">
            <OrderBook />
            <ProductSummary />
            <MarketDynamics />
          </div>
        </div>

        <FillsPanel />
        <LogViewer />
      </div>
    </div>
  )
}
