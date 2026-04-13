// --- Raw log types (input) ---

interface RawLog {
  submissionId: string
  activitiesLog: string
  tradeHistory: RawTrade[]
  logs: RawLogEntry[]
}

interface RawTrade {
  timestamp: number
  buyer: string
  seller: string
  symbol: string
  currency: string
  price: number
  quantity: number
}

export interface RawLogEntry {
  sandboxLog: string
  lambdaLog: string
  timestamp: number
}

// --- Parsed types ---

export interface ActivityRow {
  day: number
  timestamp: number
  product: string
  bidLevels: { price: number; size: number }[]
  askLevels: { price: number; size: number }[]
  midPrice: number
  pnl: number
}

export interface Fill {
  timestamp: number
  side: "BUY" | "SELL"
  symbol: string
  price: number
  quantity: number
}

export interface DashboardData {
  products: string[]
  timestamps: number[] // sorted unique tick indices
  activitiesByProduct: Map<string, ActivityRow[]>
  fills: Fill[]
  tradesByProduct: Map<string, Fill[]>
  logs: RawLogEntry[]
}

// --- Output types (matching component shapes) ---

export interface PricePoint {
  tick: number
  bid: number
  ask: number
  mid: number
  buyFill?: number
  sellFill?: number
}

export interface PnlPoint {
  tick: number
  total: number
  [product: string]: number
}

export interface PositionPoint {
  tick: number
  position: number
}

export interface OrderBookData {
  spread: number
  midPrice: number
  asks: { price: number; size: number }[]
  bids: { price: number; size: number }[]
}

export interface StatsData {
  totalPnl: number
  maxDrawdown: number
  emeraldsPnl: number
  position: number
  microprice: number
  midPrice: number
}

export interface ProductSummaryData {
  position: number
  pnl: number
  midPrice: number
  spread: number
}

export interface MarketDynamicsData {
  volatility: string
  tradeMomentum: string
  spreadEfficiency: string
}

// --- Main parser ---

export function parseLog(raw: RawLog): DashboardData {
  const activities = parseActivitiesLog(raw.activitiesLog)
  const fills = parseTrades(raw.tradeHistory)

  // Group activities by product
  const activitiesByProduct = new Map<string, ActivityRow[]>()
  for (const row of activities) {
    const arr = activitiesByProduct.get(row.product) ?? []
    arr.push(row)
    activitiesByProduct.set(row.product, arr)
  }

  // Extract unique products and sequential tick indices
  const products = [...activitiesByProduct.keys()].sort()
  // Use the first product's row count as tick count (all products have same timestamps)
  const firstProductRows = activitiesByProduct.get(products[0]) ?? []
  const timestamps = firstProductRows.map((_, i) => i)

  // Group trades by product
  const tradesByProduct = new Map<string, Fill[]>()
  for (const fill of fills) {
    const arr = tradesByProduct.get(fill.symbol) ?? []
    arr.push(fill)
    tradesByProduct.set(fill.symbol, arr)
  }

  return {
    products,
    timestamps,
    activitiesByProduct,
    fills,
    tradesByProduct,
    logs: raw.logs,
  }
}

function parseActivitiesLog(csv: string): ActivityRow[] {
  const lines = csv.split("\n")
  const rows: ActivityRow[] = []

  // Skip header (line 0), skip trailing empty line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const f = line.split(";")
    // f: day;timestamp;product;bp1;bv1;bp2;bv2;bp3;bv3;ap1;av1;ap2;av2;ap3;av3;mid;pnl

    const bidLevels: { price: number; size: number }[] = []
    for (let j = 0; j < 3; j++) {
      const price = f[3 + j * 2]
      const size = f[4 + j * 2]
      if (price && size) bidLevels.push({ price: +price, size: +size })
    }

    const askLevels: { price: number; size: number }[] = []
    for (let j = 0; j < 3; j++) {
      const price = f[9 + j * 2]
      const size = f[10 + j * 2]
      if (price && size) askLevels.push({ price: +price, size: +size })
    }

    rows.push({
      day: +f[0],
      timestamp: +f[1],
      product: f[2],
      bidLevels,
      askLevels,
      midPrice: +f[15],
      pnl: +f[16],
    })
  }

  // Sort by day then timestamp for stable ordering
  rows.sort((a, b) => a.day - b.day || a.timestamp - b.timestamp)
  return rows
}

function parseTrades(trades: RawTrade[]): Fill[] {
  return trades
    .filter((t) => t.buyer === "SUBMISSION" || t.seller === "SUBMISSION")
    .map((t) => ({
      timestamp: t.timestamp,
      side: (t.buyer === "SUBMISSION" ? "BUY" : "SELL") as "BUY" | "SELL",
      symbol: t.symbol,
      price: t.price,
      quantity: t.quantity,
    }))
}

// --- Derived data functions ---

export function getPriceData(data: DashboardData, product: string): PricePoint[] {
  const rows = data.activitiesByProduct.get(product) ?? []
  const trades = data.tradesByProduct.get(product) ?? []

  // Build trade lookup: original timestamp → fills
  const buysByTs = new Map<number, number>()
  const sellsByTs = new Map<number, number>()
  for (const t of trades) {
    if (t.side === "BUY") buysByTs.set(t.timestamp, t.price)
    else sellsByTs.set(t.timestamp, t.price)
  }

  return rows.map((row, i) => {
    const point: PricePoint = {
      tick: i,
      bid: row.bidLevels[0]?.price ?? row.midPrice,
      ask: row.askLevels[0]?.price ?? row.midPrice,
      mid: row.midPrice,
    }
    const origTs = row.timestamp + (row.day === 0 ? 100000 : 0)
    const buy = buysByTs.get(origTs)
    const sell = sellsByTs.get(origTs)
    if (buy !== undefined) point.buyFill = buy
    if (sell !== undefined) point.sellFill = sell
    return point
  })
}

export function getPnlData(data: DashboardData): PnlPoint[] {
  const firstProduct = data.products[0]
  const rowCount = data.activitiesByProduct.get(firstProduct)?.length ?? 0
  const points: PnlPoint[] = []

  for (let i = 0; i < rowCount; i++) {
    const point: PnlPoint = { tick: i, total: 0 }
    for (const product of data.products) {
      const rows = data.activitiesByProduct.get(product)!
      const pnl = rows[i]?.pnl ?? 0
      point[product.toLowerCase()] = pnl
      point.total += pnl
    }
    points.push(point)
  }

  return points
}

export function getPositionData(data: DashboardData, product: string): PositionPoint[] {
  const rows = data.activitiesByProduct.get(product) ?? []
  const trades = data.tradesByProduct.get(product) ?? []

  // Build trade map: original timestamp → net delta
  const deltaByTs = new Map<number, number>()
  for (const t of trades) {
    const origTs = t.timestamp
    const delta = t.side === "BUY" ? t.quantity : -t.quantity
    deltaByTs.set(origTs, (deltaByTs.get(origTs) ?? 0) + delta)
  }

  let position = 0
  return rows.map((row, i) => {
    const origTs = row.timestamp + (row.day === 0 ? 100000 : 0)
    const delta = deltaByTs.get(origTs)
    if (delta !== undefined) position += delta
    return { tick: i, position }
  })
}

export function getOrderBook(data: DashboardData, product: string, tick: number): OrderBookData {
  const rows = data.activitiesByProduct.get(product) ?? []
  const row = rows[tick] ?? rows[rows.length - 1]
  if (!row) {
    return { spread: 0, midPrice: 0, asks: [], bids: [] }
  }
  const bestBid = row.bidLevels[0]?.price ?? 0
  const bestAsk = row.askLevels[0]?.price ?? 0
  return {
    spread: bestAsk - bestBid,
    midPrice: row.midPrice,
    asks: row.askLevels,
    bids: row.bidLevels,
  }
}

export function getStats(data: DashboardData, product: string): StatsData {
  const pnlSeries = getPnlData(data)
  const lastPnl = pnlSeries[pnlSeries.length - 1]

  // Max drawdown from total PnL
  let peak = -Infinity
  let maxDrawdown = 0
  for (const p of pnlSeries) {
    if (p.total > peak) peak = p.total
    const dd = peak - p.total
    if (dd > maxDrawdown) maxDrawdown = dd
  }

  // Final position
  const trades = data.tradesByProduct.get(product) ?? []
  let position = 0
  for (const t of trades) {
    position += t.side === "BUY" ? t.quantity : -t.quantity
  }

  // Microprice from last tick's order book
  const rows = data.activitiesByProduct.get(product) ?? []
  const lastRow = rows[rows.length - 1]
  let microprice = lastRow?.midPrice ?? 0
  if (lastRow && lastRow.bidLevels[0] && lastRow.askLevels[0]) {
    const bb = lastRow.bidLevels[0]
    const ba = lastRow.askLevels[0]
    microprice = (bb.price * ba.size + ba.price * bb.size) / (bb.size + ba.size)
  }

  return {
    totalPnl: lastPnl?.total ?? 0,
    maxDrawdown: Math.round(maxDrawdown * 1000) / 1000,
    emeraldsPnl: lastPnl?.emeralds ?? 0,
    position,
    microprice: Math.round(microprice * 100) / 100,
    midPrice: lastRow?.midPrice ?? 0,
  }
}

export function getProductSummary(data: DashboardData, product: string, tick: number): ProductSummaryData {
  const rows = data.activitiesByProduct.get(product) ?? []
  const row = rows[tick] ?? rows[rows.length - 1]

  // Position up to tick
  const trades = data.tradesByProduct.get(product) ?? []
  let position = 0
  for (const t of trades) {
    const origTs = t.timestamp
    const rowAtTick = rows[tick]
    if (rowAtTick) {
      const tickOrigTs = rowAtTick.timestamp + (rowAtTick.day === 0 ? 100000 : 0)
      if (origTs <= tickOrigTs) {
        position += t.side === "BUY" ? t.quantity : -t.quantity
      }
    }
  }

  const bestBid = row?.bidLevels[0]?.price ?? 0
  const bestAsk = row?.askLevels[0]?.price ?? 0

  return {
    position,
    pnl: row?.pnl ?? 0,
    midPrice: row?.midPrice ?? 0,
    spread: bestAsk - bestBid,
  }
}

export function getMarketDynamics(data: DashboardData, product: string): MarketDynamicsData {
  const rows = data.activitiesByProduct.get(product) ?? []
  const trades = data.tradesByProduct.get(product) ?? []

  // Volatility: stddev of mid price changes
  const changes: number[] = []
  for (let i = 1; i < rows.length; i++) {
    changes.push(rows[i].midPrice - rows[i - 1].midPrice)
  }
  const mean = changes.reduce((s, c) => s + c, 0) / (changes.length || 1)
  const variance = changes.reduce((s, c) => s + (c - mean) ** 2, 0) / (changes.length || 1)
  const volatility = Math.sqrt(variance)

  // Trade momentum: net volume
  let momentum = 0
  for (const t of trades) {
    momentum += t.side === "BUY" ? t.quantity : -t.quantity
  }

  // Spread efficiency: average spread / mid
  let spreadSum = 0
  let count = 0
  for (const row of rows) {
    const bid = row.bidLevels[0]?.price
    const ask = row.askLevels[0]?.price
    if (bid && ask && row.midPrice) {
      spreadSum += (ask - bid) / row.midPrice
      count++
    }
  }
  const efficiency = count > 0 ? (spreadSum / count) * 100 : 0

  return {
    volatility: `${volatility.toFixed(2)} pts`,
    tradeMomentum: `${momentum} vol`,
    spreadEfficiency: `${efficiency.toFixed(3)}%`,
  }
}
