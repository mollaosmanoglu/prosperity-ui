// Deterministic PRNG to avoid SSR/client hydration mismatch
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) | 0
    return (s >>> 0) / 0xffffffff
  }
}

// Generate realistic price series for EMERALDS starting around 10000
function generatePriceSeries(ticks: number) {
  const rand = seededRandom(42)
  const data: {
    tick: number
    bid: number
    ask: number
    mid: number
    buyFill?: number
    sellFill?: number
  }[] = []

  let mid = 10000
  for (let i = 0; i < ticks; i++) {
    const drift = (rand() - 0.48) * 2
    const vol = Math.sin(i / 200) * 3
    mid = mid + drift + vol * 0.1
    const spread = 8 + rand() * 8
    const halfSpread = spread / 2

    const point: (typeof data)[number] = {
      tick: i,
      bid: Math.round((mid - halfSpread) * 10) / 10,
      ask: Math.round((mid + halfSpread) * 10) / 10,
      mid: Math.round(mid * 10) / 10,
    }

    // Scatter some fills
    if (rand() < 0.03) point.buyFill = point.ask + rand() * 2
    if (rand() < 0.03) point.sellFill = point.bid - rand() * 2

    data.push(point)
  }
  return data
}

// Generate PnL curve that ends around 2315
function generatePnlSeries(ticks: number) {
  const rand = seededRandom(123)
  const data: { tick: number; total: number; emeralds: number }[] = []
  let total = 0
  let emeralds = 0

  for (let i = 0; i < ticks; i++) {
    const emeraldsDelta = (rand() - 0.42) * 8
    const tomatoesDelta = (rand() - 0.44) * 5
    emeralds += emeraldsDelta
    total += emeraldsDelta + tomatoesDelta

    data.push({
      tick: i,
      total: Math.round(total * 100) / 100,
      emeralds: Math.round(emeralds * 100) / 100,
    })
  }

  // Scale to match target ending values
  const totalScale = 2315.297 / (total || 1)
  const emeraldsScale = 1050 / (emeralds || 1)
  return data.map((d) => ({
    tick: d.tick,
    total: Math.round(d.total * totalScale * 100) / 100,
    emeralds: Math.round(d.emeralds * emeraldsScale * 100) / 100,
  }))
}

// Generate position series oscillating between -20 and 20
function generatePositionSeries(ticks: number) {
  const rand = seededRandom(456)
  const data: { tick: number; position: number }[] = []
  let pos = 0

  for (let i = 0; i < ticks; i++) {
    const delta = Math.round((rand() - 0.5) * 4)
    pos = Math.max(-20, Math.min(20, pos + delta))
    data.push({ tick: i, position: pos })
  }
  return data
}

const TOTAL_TICKS = 2000

export const priceData = generatePriceSeries(TOTAL_TICKS)
export const pnlData = generatePnlSeries(TOTAL_TICKS)
export const positionData = generatePositionSeries(TOTAL_TICKS)

export const orderBook = {
  spread: 16.0,
  midPrice: 10000.0,
  asks: [
    { price: 10010, size: 30 },
    { price: 10008, size: 15 },
  ],
  bids: [
    { price: 9992, size: 15 },
    { price: 9990, size: 30 },
  ],
}

export const TOTAL_TICKS_COUNT = TOTAL_TICKS
