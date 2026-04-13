"use client"

import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react"
import {
  parseLog,
  getPriceData,
  getPnlData,
  getPositionData,
  getOrderBook,
  getStats,
  getProductSummary,
  getMarketDynamics,
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
  stats as mockStats,
  productSummary as mockProductSummary,
  marketDynamics as mockMarketDynamics,
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

  // Derived data
  priceData: PricePoint[]
  pnlData: PnlPoint[]
  positionData: PositionPoint[]
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

  const priceData = useMemo(
    () => (data ? getPriceData(data, selectedProduct) : mockPriceData),
    [data, selectedProduct],
  )

  const pnlData = useMemo(
    () => (data ? getPnlData(data) : mockPnlData),
    [data],
  )

  const positionData = useMemo(
    () => (data ? getPositionData(data, selectedProduct) : mockPositionData),
    [data, selectedProduct],
  )

  const orderBook = useMemo(
    () => (data ? getOrderBook(data, selectedProduct, currentTick) : mockOrderBook),
    [data, selectedProduct, currentTick],
  )

  const stats = useMemo(
    () => (data ? getStats(data, selectedProduct) : mockStats),
    [data, selectedProduct],
  )

  const productSummary = useMemo(
    () => (data ? getProductSummary(data, selectedProduct, currentTick) : mockProductSummary),
    [data, selectedProduct, currentTick],
  )

  const marketDynamics = useMemo(
    () => (data ? getMarketDynamics(data, selectedProduct) : mockMarketDynamics),
    [data, selectedProduct],
  )

  const fills = useMemo(
    () => (data?.fills ?? mockFills),
    [data],
  )

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
    pnlData,
    positionData,
    orderBook,
    stats,
    productSummary,
    marketDynamics,
    fills,
    logs,
    loadLog,
  }), [
    data, products, selectedProduct, currentTick, playing, totalTicks,
    priceData, pnlData, positionData, orderBook, stats,
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
