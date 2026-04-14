# prosperity-ui

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61dafb)

Real-time analytics dashboard for IMC Prosperity algorithmic trading competition. Visualize PnL curves, order book depth, position Greeks, and multi-run alpha across trading rounds.

<p align="center">
  <img src="docs/demo.gif" alt="Dashboard demo" width="800"/>
</p>

## Features

- **Tick-by-tick playback** — Scrub through any trading round, frame by frame
- **Order book depth** — Live ladder with bid/ask spreads and volume
- **PnL tracking** — Multi-run comparison with cumulative profit curves
- **Position analysis** — Holdings over time, per product or aggregated
- **Trade fills** — Tabular view of every execution with prices and timestamps
- **Market dynamics** — Volatility, spread, and momentum indicators
- **Log viewer** — Raw algorithm output for debugging

## Install

```bash
bun install
bun dev
```

Open [localhost:3000](http://localhost:3000).

## Usage

1. Export your Prosperity logs (JSON format)
2. Drag-and-drop into the dashboard
3. Select product filter (or "ALL" for portfolio view)
4. Scrub timeline, inspect charts, analyze fills

## Tech Stack

| Layer    | Tools                                          |
| -------- | ---------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4           |
| UI       | shadcn/ui, Motion animations                   |
| Charts   | Recharts with custom zoom and cursor sync      |
| State    | React Context with tick-scrubber coordination  |

## License

MIT
