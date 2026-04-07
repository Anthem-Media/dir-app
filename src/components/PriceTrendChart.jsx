/**
 * PriceTrendChart
 *
 * Renders a line + area chart showing the sealed box market price over time.
 * Uses Recharts (already installed) — a composable charting library for React.
 *
 * Design: green line, light green fill below the line, clean axes, no grid clutter.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../utils/formatters';
import './PriceTrendChart.css';

/**
 * Custom tooltip shown when hovering over the chart.
 * Recharts passes `active`, `payload`, and `label` automatically.
 */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="price-chart__tooltip">
      <span className="price-chart__tooltip-label">{label}</span>
      <span className="price-chart__tooltip-value">{formatCurrency(payload[0].value)}</span>
    </div>
  );
}

/**
 * @param {Array<{ date: string, price: number }>} data - Price history array
 */
export function PriceTrendChart({ data }) {
  return (
    <div className="price-chart">
      {/* ResponsiveContainer fills the width of its parent automatically */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          {/* Gradient definition for the area fill */}
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Subtle horizontal grid lines only */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={48}
            // Only show ticks at even round numbers to keep it clean
            tickCount={5}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#16a34a"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#16a34a', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
