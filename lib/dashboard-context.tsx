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
  orderBook as mockOrderBook,
  TOTAL_TICKS_COUNT as mockTotalTicks,
} from "@/lib/mock-data"

const mockFills: Fill[] = []
const mockLogs: RawLogEntry[] = []
const mockProducts = ["EMERALDS", "TOMATOES"]

interface DashboardContextValue {
  // State
  data: DashboardData | null
  products: string[]
  selectedProduct: string
  setSelectedProduct: (p: string) => void
  currentTick: number
  setCurrentTick: React.Dispatch<React.SetStateAction<number>>
  playing: boolean
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>
  totalTicks: number

  // Derived data (sliced to currentTick for rendering, full for Brush range)
  priceData: PricePoint[]
  priceDataFull: PricePoint[]
  pnlData: PnlPoint[]
  pnlDataFull: PnlPoint[]
  positionData: PositionPoint[]
  positionDataFull: PositionPoint[]
  orderBook: OrderBookData
  stats: StatsData
  productSummary: ProductSummaryData
  marketDynamics: MarketDynamicsData
  fills: Fill[]
  logs: RawLogEntry[]

  // Actions
  loadLog: (text: string) => void
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [selectedProduct, setSelectedProduct] = useState("EMERALDS")
  const [currentTick, setCurrentTick] = useState(0)
  const [playing, setPlaying] = useState(false)

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

  const priceDataFull = useMemo(
    () => (data ? getPriceData(data, selectedProduct) : mockPriceData),
    [data, selectedProduct],
  )
  const priceData = useMemo(
    () => priceDataFull.slice(0, currentTick + 1),
    [priceDataFull, currentTick],
  )

  const pnlDataFull = useMemo(
    () => (data ? getPnlData(data) : mockPnlData),
    [data],
  )
  const pnlData = useMemo(
    () => pnlDataFull.slice(0, currentTick + 1),
    [pnlDataFull, currentTick],
  )

  const positionDataFull = useMemo(
    () => (data ? getPositionData(data, selectedProduct) : mockPositionData),
    [data, selectedProduct],
  )
  const positionData = useMemo(
    () => positionDataFull.slice(0, currentTick + 1),
    [positionDataFull, currentTick],
  )

  const orderBook = useMemo(
    () => (data ? getOrderBook(data, selectedProduct, currentTick) : mockOrderBook),
    [data, selectedProduct, currentTick],
  )

  // Derive stats from sliced arrays so they work for both mock and real data
  const stats = useMemo(() => {
    const lastPnl = pnlData[pnlData.length - 1]
    const lastPos = positionData[positionData.length - 1]
    // Max drawdown
    let peak = -Infinity, maxDrawdown = 0
    for (const p of pnlData) {
      if (p.total > peak) peak = p.total
      const dd = peak - p.total
      if (dd > maxDrawdown) maxDrawdown = dd
    }
    // Microprice
    let microprice = orderBook.midPrice
    if (orderBook.bids[0] && orderBook.asks[0]) {
      const bb = orderBook.bids[0], ba = orderBook.asks[0]
      microprice = (bb.price * ba.size + ba.price * bb.size) / (bb.size + ba.size)
    }
    return {
      totalPnl: lastPnl?.total ?? 0,
      maxDrawdown: Math.round(maxDrawdown * 1000) / 1000,
      emeraldsPnl: lastPnl?.emeralds ?? 0,
      position: lastPos?.position ?? 0,
      microprice: Math.round(microprice * 100) / 100,
      midPrice: orderBook.midPrice,
    }
  }, [pnlData, positionData, orderBook])

  const productSummary = useMemo(() => {
    const lastPos = positionData[positionData.length - 1]
    const lastPrice = priceData[priceData.length - 1]
    return {
      position: lastPos?.position ?? 0,
      pnl: (pnlData[pnlData.length - 1] as Record<string, number>)?.[selectedProduct.toLowerCase()] ?? 0,
      midPrice: lastPrice?.mid ?? 0,
      spread: orderBook.spread,
    }
  }, [positionData, priceData, pnlData, selectedProduct, orderBook])

  const marketDynamics = useMemo(() => {
    // Volatility from price changes
    const changes: number[] = []
    for (let i = 1; i < priceData.length; i++) {
      changes.push(priceData[i].mid - priceData[i - 1].mid)
    }
    const mean = changes.reduce((s, c) => s + c, 0) / (changes.length || 1)
    const variance = changes.reduce((s, c) => s + (c - mean) ** 2, 0) / (changes.length || 1)
    const volatility = Math.sqrt(variance)
    // Momentum from position
    const pos = positionData[positionData.length - 1]?.position ?? 0
    // Spread efficiency
    let spreadSum = 0, count = 0
    for (const p of priceData) {
      if (p.bid && p.ask && p.mid) {
        spreadSum += (p.ask - p.bid) / p.mid
        count++
      }
    }
    const efficiency = count > 0 ? (spreadSum / count) * 100 : 0
    return {
      volatility: `${volatility.toFixed(2)} pts`,
      tradeMomentum: `${pos} vol`,
      spreadEfficiency: `${efficiency.toFixed(3)}%`,
    }
  }, [priceData, positionData])

  // Filter fills up to current tick
  const allFills = useMemo(() => (data?.fills ?? mockFills), [data])
  const fills = useMemo(() => {
    if (!data) return allFills
    const rows = data.activitiesByProduct.get(selectedProduct) ?? []
    const row = rows[currentTick]
    if (!row) return allFills
    const tickOrigTs = row.timestamp + (row.day === 0 ? 100000 : 0)
    return allFills.filter(f => f.timestamp <= tickOrigTs)
  }, [allFills, data, selectedProduct, currentTick])

  const logs = useMemo(
    () => (data?.logs ?? mockLogs),
    [data],
  )

  const value = useMemo<DashboardContextValue>(() => ({
    data,
    products,
    selectedProduct,
    setSelectedProduct,
    currentTick,
    setCurrentTick,
    playing,
    setPlaying,
    totalTicks,
    priceData,
    priceDataFull,
    pnlData,
    pnlDataFull,
    positionData,
    positionDataFull,
    orderBook,
    stats,
    productSummary,
    marketDynamics,
    fills,
    logs,
    loadLog,
  }), [
    data, products, selectedProduct, currentTick, playing, totalTicks,
    priceData, priceDataFull, pnlData, pnlDataFull, positionData, positionDataFull, orderBook, stats,
    productSummary, marketDynamics, fills, logs, loadLog,
  ])

  return (
    <DashboardContext value={value}>
      {children}
    </DashboardContext>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider")
  return ctx
}
