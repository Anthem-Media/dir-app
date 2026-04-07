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

// Recharts prop values are plain strings passed directly to SVG elements,
// so CSS custom properties (var(--color-green)) can't be used here.
// Centralizing them as constants means changing the brand color is still one edit.
const CHART_COLORS = {
  line:     '#16a34a', // --color-green
  gradient: '#16a34a', // --color-green
  grid:     '#f3f4f6', // --color-border-subtle
  axis:     '#9ca3af', // --color-text-muted
  cursor:   '#e5e7eb', // --color-border
};

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
              <stop offset="5%" stopColor={CHART_COLORS.gradient} stopOpacity={0.15} />
              <stop offset="95%" stopColor={CHART_COLORS.gradient} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Subtle horizontal grid lines only */}
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tickFormatter={(v) => `$${v}`}
            tick={{ fontSize: 11, fill: CHART_COLORS.axis }}
            axisLine={false}
            tickLine={false}
            width={48}
            // Only show ticks at round numbers to keep the axis clean
            tickCount={5}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART_COLORS.cursor, strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="price"
            stroke={CHART_COLORS.line}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.line, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
