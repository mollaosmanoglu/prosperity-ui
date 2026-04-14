/**
 * Largest Triangle Three Buckets (LTTB) downsampling.
 * Reduces data points while preserving visual shape — industry standard for time-series.
 */
export function lttb<T>(data: T[], threshold: number, y: (d: T) => number): T[] {
  const len = data.length
  if (threshold >= len || threshold < 3) return data

  const sampled: T[] = [data[0]]
  const bucket = (len - 2) / (threshold - 2)
  let a = 0

  for (let i = 0; i < threshold - 2; i++) {
    const rStart = Math.floor((i + 1) * bucket) + 1
    const rEnd = Math.min(Math.floor((i + 2) * bucket) + 1, len)

    // Average of next bucket (look-ahead)
    const nStart = Math.floor((i + 2) * bucket) + 1
    const nEnd = Math.min(Math.floor((i + 3) * bucket) + 1, len)
    let avgX = 0, avgY = 0
    for (let j = nStart; j < nEnd; j++) { avgX += j; avgY += y(data[j]) }
    const cnt = nEnd - nStart
    avgX /= cnt || 1; avgY /= cnt || 1

    // Largest triangle in current bucket
    let maxArea = -1, pick = rStart
    const ay = y(data[a])
    for (let j = rStart; j < rEnd; j++) {
      const area = Math.abs((a - avgX) * (y(data[j]) - ay) - (a - j) * (avgY - ay))
      if (area > maxArea) { maxArea = area; pick = j }
    }
    sampled.push(data[pick])
    a = pick
  }

  sampled.push(data[len - 1])
  return sampled
}
