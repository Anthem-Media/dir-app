/**
 * TierPriceTrendChart
 *
 * Renders a line + area chart showing the average card sale price for a single
 * tier over time. Answers: "Are the hits in this set appreciating or tanking?"
 *
 * Purely presentational — receives data and activeTier label via props.
 * No tab logic, no state, no data fetching. Only renders what it's given.
 *
 * Follows the same structure as PriceTrendChart.jsx for visual consistency:
 * same line color (--color-positive green), same axis style, same tooltip shape.
 *
 * Note on gradient ID: this component uses id="tierGradient" for its SVG gradient.
 * PriceTrendChart uses "priceGradient". Using different IDs prevents the two gradients
 * from conflicting when both charts appear on the same page.
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
import './TierPriceTrendChart.css';

// Recharts prop values are plain strings passed to SVG elements —
// CSS custom properties (var(--color-positive)) cannot be used here.
// These mirror the values in PriceTrendChart.jsx for visual consistency.
const CHART_COLORS = {
  line:     '#16a34a', // --color-positive
  gradient: '#16a34a', // --color-positive
  grid:     '#2a2a2e', // --color-border
  axis:     '#777777', // --color-text-secondary
  cursor:   '#2a2a2e', // --color-border
};

/**
 * Custom tooltip shown when hovering over the chart.
 * Recharts passes `active`, `payload`, and `label` automatically.
 */
function TierChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="tier-chart__tooltip">
      <span className="tier-chart__tooltip-label">{label}</span>
      <span className="tier-chart__tooltip-value">{formatCurrency(payload[0].value)}</span>
    </div>
  );
}

/**
 * @param {Array<{ date: string, avgPrice: number }>} data       - Trend data for the active tier
 * @param {string}                                    activeTier - Slug of the active tier (unused
 *   in rendering, but passed so React re-renders cleanly when the tier changes)
 */
export function TierPriceTrendChart({ data, activeTier }) {
  return (
    <div className="tier-chart">
      {/* ResponsiveContainer fills the width of its parent automatically */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          {/* Gradient fill below the line — same low-opacity treatment as PriceTrendChart */}
          <defs>
            <linearGradient id="tierGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS.gradient} stopOpacity={0.15} />
              <stop offset="95%" stopColor={CHART_COLORS.gradient} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Subtle horizontal grid lines only — no vertical lines */}
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
            tickCount={5}
          />

          <Tooltip
            content={<TierChartTooltip />}
            cursor={{ stroke: CHART_COLORS.cursor, strokeWidth: 1 }}
          />

          {/* avgPrice is the data key for this chart — differs from PriceTrendChart's "price" */}
          <Area
            type="monotone"
            dataKey="avgPrice"
            stroke={CHART_COLORS.line}
            strokeWidth={2}
            fill="url(#tierGradient)"
            dot={false}
            activeDot={{ r: 4, fill: CHART_COLORS.line, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
