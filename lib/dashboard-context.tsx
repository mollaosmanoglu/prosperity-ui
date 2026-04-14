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

interface DataContextValue {
  data: DashboardData | null
  products: string[]
  selectedProduct: string
  setSelectedProduct: (p: string) => void
  totalTicks: number
  priceDataFull: PricePoint[]
  pnlDataFull: PnlPoint[]
  positionDataFull: PositionPoint[]
  logs: RawLogEntry[]
  loadLog: (text: string) => void
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
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedProduct, setSelectedProduct] = useState("EMERALDS")
  const [currentTick, setCurrentTick] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [scrubbing, setScrubbing] = useState(false)

  const loadLog = useCallback((text: string) => {
    try {
      const raw = JSON.parse(text)
      const parsed = parseLog(raw)
      setData(parsed)
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
    const prLen = priceDataFull.length
    const n = Math.max(pLen, prLen)
    const drawdown = new Float64Array(n)
    const volatility = new Float64Array(n)
    const spreadEff = new Float64Array(n)

    // Running max drawdown
    let peak = -Infinity, maxDD = 0
    for (let i = 0; i < pLen; i++) {
      if (pnlDataFull[i].total > peak) peak = pnlDataFull[i].total
      const dd = peak - pnlDataFull[i].total
      if (dd > maxDD) maxDD = dd
      drawdown[i] = maxDD
    }

    // Running volatility + spread efficiency
    let sumC = 0, sumC2 = 0, sSum = 0, sCount = 0
    for (let i = 0; i < prLen; i++) {
      if (i > 0) {
        const c = priceDataFull[i].mid - priceDataFull[i - 1].mid
        sumC += c
        sumC2 += c * c
      }
      if (i > 0) {
        const mean = sumC / i
        volatility[i] = Math.sqrt(Math.max(0, sumC2 / i - mean * mean))
      }
      const p = priceDataFull[i]
      if (p.bid && p.ask && p.mid) {
        sSum += (p.ask - p.bid) / p.mid
        sCount++
      }
      spreadEff[i] = sCount > 0 ? (sSum / sCount) * 100 : 0
    }

    return { drawdown, volatility, spreadEff }
  }, [pnlDataFull, priceDataFull])

  const logs = useMemo(() => (data?.logs ?? mockLogs), [data])

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
    const pos = positionDataFull[Math.min(currentTick, positionDataFull.length - 1)]?.position ?? 0
    return {
      volatility: `${(runningStats.volatility[t] ?? 0).toFixed(2)} pts`,
      tradeMomentum: `${pos} vol`,
      spreadEfficiency: `${(runningStats.spreadEff[t] ?? 0).toFixed(3)}%`,
    }
  }, [currentTick, priceDataFull, positionDataFull, runningStats])

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
    logs, loadLog,
  }), [data, products, selectedProduct, totalTicks, priceDataFull, pnlDataFull, positionDataFull, logs, loadLog])

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
