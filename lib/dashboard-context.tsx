"use client"

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react"
import {
  parseLog,
  getPriceData,
  getPnlData,
  getPositionData,
  getOrderBook,
  type DashboardData,
  type PricePoint,
  type PnlPoint,
  type PositionPoint,
  type OrderBookData,
  type StatsData,
  type ProductSummaryData,
  type MarketDynamicsData,
  type Fill,
  type RawLogEntry,
} from "@/lib/parse-log"
import {
  priceData as mockPriceData,
  pnlData as mockPnlData,
  positionData as mockPositionData,
  getOrderBookAtTick as mockGetOrderBook,
  TOTAL_TICKS_COUNT as mockTotalTicks,
} from "@/lib/mock-data"

const mockFills: Fill[] = []
const mockLogs: RawLogEntry[] = []
const mockProducts = ["EMERALDS", "TOMATOES"]

// ── Context types ────────────────────────────────────────────────────

export interface RunInfo {
  name: string
  totalPnl: number
  trades: number
}

interface DataContextValue {
  data: DashboardData | null
  products: string[]
  selectedProduct: string
  setSelectedProduct: (p: string) => void
  totalTicks: number
  priceDataFull: PricePoint[]
  pnlDataFull: PnlPoint[]
  positionDataFull: PositionPoint[]
  runs: RunInfo[]
  activeRun: string
  setActiveRun: (name: string) => void
  logs: RawLogEntry[]
  loadLog: (text: string, fileName?: string) => void
}

interface TickContextValue {
  currentTick: number
  setCurrentTick: React.Dispatch<React.SetStateAction<number>>
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  scrubbing: boolean
  setScrubbing: React.Dispatch<React.SetStateAction<boolean>>
  orderBook: OrderBookData
  stats: StatsData
  productSummary: ProductSummaryData
  marketDynamics: MarketDynamicsData
  fills: Fill[]
}

const DataContext = createContext<DataContextValue | null>(null)
const TickContext = createContext<TickContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [allRuns, setAllRuns] = useState<Map<string, DashboardData>>(new Map())
  const [activeRun, setActiveRun] = useState("Tutorial Sub")
  const [selectedProduct, setSelectedProduct] = useState("EMERALDS")
  const [currentTick, setCurrentTick] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)

  const data = allRuns.get(activeRun) ?? null

  const switchRun = useCallback((name: string) => {
    setActiveRun(name)
    setPlaying(false)
    const d = allRuns.get(name)
    const ticks = d ? d.timestamps.length : mockTotalTicks
    setCurrentTick(ticks - 1)
    if (d) setSelectedProduct(d.products[0])
    else setSelectedProduct("EMERALDS")
  }, [allRuns])

  const loadLog = useCallback((text: string, fileName?: string) => {
    try {
      const raw = JSON.parse(text)
      const parsed = parseLog(raw)
      const name = fileName?.replace(/\.[^.]+$/, "") ?? parsed.submissionId ?? "Upload"
      setAllRuns(prev => new Map(prev).set(name, parsed))
      setActiveRun(name)
      setSelectedProduct(parsed.products[0])
      setCurrentTick(0)
      setPlaying(false)
    } catch {
      alert("Invalid log file")
    }
  }, [])

  const products = data?.products ?? mockProducts
  const totalTicks = data?.timestamps.length ?? mockTotalTicks

  // ── Stable full data arrays (change on data load / product switch) ──

  const priceDataFull = useMemo(
    () => (data ? getPriceData(data, selectedProduct) : mockPriceData),
    [data, selectedProduct],
  )
  const pnlDataFull = useMemo(
    () => (data ? getPnlData(data) : mockPnlData),
    [data],
  )
  const positionDataFull = useMemo(
    () => (data ? getPositionData(data, selectedProduct) : mockPositionData),
    [data, selectedProduct],
  )

  // ── Pre-computed running stats: O(n) once, O(1) per tick ───────────

  const runningStats = useMemo(() => {
    const pLen = pnlDataFull.length
    const drawdown = new Float64Array(pLen)

    let peak = -Infinity, maxDD = 0
    for (let i = 0; i < pLen; i++) {
      if (pnlDataFull[i].total > peak) peak = pnlDataFull[i].total
      const dd = peak - pnlDataFull[i].total
      if (dd > maxDD) maxDD = dd
      drawdown[i] = maxDD
    }

    return { drawdown }
  }, [pnlDataFull])

  const logs = useMemo(() => (data?.logs ?? mockLogs), [data])

  const runs = useMemo<RunInfo[]>(() => {
    const mockLast = mockPnlData[mockPnlData.length - 1]
    const list: RunInfo[] = [
      { name: "Tutorial Sub", totalPnl: Math.round((mockLast?.total ?? 0) * 1000) / 1000, trades: 0 },
    ]
    for (const [name, d] of allRuns) {
      const pnl = getPnlData(d)
      const lastPnl = pnl[pnl.length - 1]
      list.push({
        name,
        totalPnl: Math.round((lastPnl?.total ?? 0) * 1000) / 1000,
        trades: d.fills.length,
      })
    }
    return list
  }, [allRuns])

  // ── Tick-dependent (O(1) lookups) ──────────────────────────────────

  const orderBook = useMemo(
    () => (data ? getOrderBook(data, selectedProduct, currentTick) : mockGetOrderBook(currentTick)),
    [data, selectedProduct, currentTick],
  )

  const stats = useMemo<StatsData>(() => {
    const t = Math.min(currentTick, pnlDataFull.length - 1)
    const lastPnl = pnlDataFull[t]
    const lastPos = positionDataFull[Math.min(currentTick, positionDataFull.length - 1)]
    let microprice = orderBook.midPrice
    if (orderBook.bids[0] && orderBook.asks[0]) {
      const bb = orderBook.bids[0], ba = orderBook.asks[0]
      microprice = (bb.price * ba.size + ba.price * bb.size) / (bb.size + ba.size)
    }
    return {
      totalPnl: lastPnl?.total ?? 0,
      maxDrawdown: Math.round((runningStats.drawdown[t] ?? 0) * 1000) / 1000,
      emeraldsPnl: lastPnl?.emeralds ?? 0,
      position: lastPos?.position ?? 0,
      microprice: Math.round(microprice * 100) / 100,
      midPrice: orderBook.midPrice,
    }
  }, [currentTick, pnlDataFull, positionDataFull, orderBook, runningStats])

  const productSummary = useMemo<ProductSummaryData>(() => {
    const lastPos = positionDataFull[Math.min(currentTick, positionDataFull.length - 1)]
    const lastPrice = priceDataFull[Math.min(currentTick, priceDataFull.length - 1)]
    const lastPnl = pnlDataFull[Math.min(currentTick, pnlDataFull.length - 1)]
    return {
      position: lastPos?.position ?? 0,
      pnl: (lastPnl as Record<string, number>)?.[selectedProduct.toLowerCase()] ?? 0,
      midPrice: lastPrice?.mid ?? 0,
      spread: orderBook.spread,
    }
  }, [currentTick, positionDataFull, priceDataFull, pnlDataFull, selectedProduct, orderBook])

  const marketDynamics = useMemo<MarketDynamicsData>(() => {
    const t = Math.min(currentTick, priceDataFull.length - 1)
    const cur = priceDataFull[t]
    // Volatility: population stddev of mid prices over 21-tick rolling window
    const wStart = Math.max(0, t - 20)
    const window = priceDataFull.slice(wStart, t + 1)
    let vol = 0
    if (window.length > 1) {
      const mean = window.reduce((s, p) => s + p.mid, 0) / window.length
      const variance = window.reduce((s, p) => s + (p.mid - mean) ** 2, 0) / window.length
      vol = Math.sqrt(variance)
    }
    // Trade momentum: net trade volume at this tick only
    const rows = data?.activitiesByProduct.get(selectedProduct) ?? []
    const row = rows[t]
    const tickTs = row ? row.timestamp + (row.day === 0 ? 100000 : 0) : -1
    const trades = data?.tradesByProduct.get(selectedProduct) ?? []
    const mom = trades.filter(f => f.timestamp === tickTs).reduce((s, f) => s + (f.side === "BUY" ? f.quantity : -f.quantity), 0)
    // Spread efficiency: current tick's spread / mid
    const eff = cur.mid ? ((cur.ask - cur.bid) / cur.mid) * 100 : 0
    return {
      volatility: `${vol.toFixed(2)} pts`,
      tradeMomentum: `${mom} vol`,
      spreadEfficiency: `${eff.toFixed(3)}%`,
    }
  }, [currentTick, priceDataFull, data, selectedProduct])

  const allFills = useMemo(() => (data?.fills ?? mockFills), [data])
  const fills = useMemo(() => {
    if (!data) return allFills
    const rows = data.activitiesByProduct.get(selectedProduct) ?? []
    const row = rows[currentTick]
    if (!row) return allFills
    const tickOrigTs = row.timestamp + (row.day === 0 ? 100000 : 0)
    return allFills.filter(f => f.timestamp <= tickOrigTs)
  }, [allFills, data, selectedProduct, currentTick])

  // ── Context values ─────────────────────────────────────────────────

  const dataValue = useMemo<DataContextValue>(() => ({
    data, products, selectedProduct, setSelectedProduct,
    totalTicks, priceDataFull, pnlDataFull, positionDataFull,
    runs, activeRun, setActiveRun: switchRun,
    logs, loadLog,
  }), [data, products, selectedProduct, totalTicks, priceDataFull, pnlDataFull, positionDataFull, runs, activeRun, switchRun, logs, loadLog])

  const tickValue = useMemo<TickContextValue>(() => ({
    currentTick, setCurrentTick, playing, setPlaying, scrubbing, setScrubbing,
    orderBook, stats, productSummary, marketDynamics, fills,
  }), [currentTick, playing, scrubbing, orderBook, stats, productSummary, marketDynamics, fills])

  return (
    <DataContext value={dataValue}>
      <TickContext value={tickValue}>
        {children}
      </TickContext>
    </DataContext>
  )
}

// ── Hooks ────────────────────────────────────────────────────────────

/** Stable data — only changes on data load or product switch. */
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within DashboardProvider")
  return ctx
}

/** Tick-frequency data — changes every tick during playback. */
export function useTick() {
  const ctx = useContext(TickContext)
  if (!ctx) throw new Error("useTick must be used within DashboardProvider")
  return ctx
}

/** Combined hook — subscribes to both contexts. Use useData() in charts to avoid tick re-renders. */
export function useDashboard() {
  return { ...useData(), ...useTick() }
}
