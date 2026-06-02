#!/usr/bin/env python3
"""
calculate-ev.py
===============
Calculates Expected Value (EV) for 2023 Topps Chrome Baseball Hobby.

Correct EV formula per category:
  expected_cards_per_box = packsPerBox × pull_probability
  EV_from_category = expected_cards_per_box × mean(priced card values in category)

Which is equivalent to:
  EV_from_category = Σ_cards[ price_i × (expected_per_box / total_cards_in_category) ]

The denominator uses ALL cards in the category (priced + unpriced) so that
unpriced cards contribute $0 to EV — the honest treatment.

Eligibility rules:
  - Grails (print_run ≤ 10) are excluded from EV entirely
  - A card with no price contributes $0 to its category average

Inputs:
    scripts/output/cards-rebuilt.csv
    scripts/output/pull_rates.csv

Usage:
    cd /Users/zachseabolt/Developer/dir-app
    python3 scripts/calculate-ev.py
"""

from pathlib import Path
from collections import defaultdict
import pandas as pd

REPO_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = REPO_ROOT / "scripts" / "output"

CARDS_CSV = OUTPUT_DIR / "cards-rebuilt.csv"
PULL_RATES_CSV = OUTPUT_DIR / "pull_rates.csv"
GRAIL_CUTOFF = 10  # print_run <= this = grail, excluded entirely

# Packs per box by format slug
PACKS_PER_BOX = {
    "2023-topps-chrome-baseball-hobby":   18,
    "2023-topps-chrome-baseball-jumbo":    6,
    "2023-topps-chrome-baseball-blaster":  7,
    "2023-topps-chrome-baseball-mega":     5,
    "2023-topps-chrome-baseball-breaker":  1,
}

FORMAT_LABELS = {
    "2023-topps-chrome-baseball-hobby":   "Hobby",
    "2023-topps-chrome-baseball-jumbo":   "Jumbo",
    "2023-topps-chrome-baseball-blaster": "Blaster",
    "2023-topps-chrome-baseball-mega":    "Mega",
    "2023-topps-chrome-baseball-breaker": "Breaker Delight",
}

FORMAT_MSRP = {
    "2023-topps-chrome-baseball-hobby":   149.99,
    "2023-topps-chrome-baseball-jumbo":   229.99,
    "2023-topps-chrome-baseball-blaster":  24.99,
    "2023-topps-chrome-baseball-mega":     49.99,
    "2023-topps-chrome-baseball-breaker": 299.99,
}

GUARANTEED_PULLS = {
    "2023-topps-chrome-baseball-hobby": [
        {"category_name": "Base Auto", "count": 1},
    ],
    "2023-topps-chrome-baseball-jumbo": [
        {"category_name": "Base Auto", "count": 3},
    ],
    "2023-topps-chrome-baseball-blaster": [
        {"category_name": "Refractor", "count": 4},
    ],
    "2023-topps-chrome-baseball-mega": [
        {"category_name": "Refractor", "count": 10},
    ],
    "2023-topps-chrome-baseball-breaker": [
        {"category_name": "Base Auto",          "count": 2},
        {"category_name": "Refractor",          "count": 6},
        {"category_name": "Numbered Refractor", "count": 3},
        {"category_name": "Insert",             "count": 1},
    ],
}


def calculate_ev_for_format(slug, df_cards, df_rates, packs_per_box):
    """
    Calculate EV for one format slug.
    Returns (ev_total, cards_used, skipped_grail, skipped_no_rate, breakdown).
    """
    df_fmt_rates = df_rates[df_rates["box_set_slug"] == slug].copy()
    df_fmt_rates["pull_probability"] = pd.to_numeric(
        df_fmt_rates["pull_probability"], errors="coerce"
    )
    rate_lookup = dict(
        zip(df_fmt_rates["category_name"], df_fmt_rates["pull_probability"])
    )

    # Classify card rows
    skipped_grail = 0
    category_total_count = defaultdict(int)
    category_priced_count = defaultdict(int)
    category_price_sum = defaultdict(float)

    for _, row in df_cards.iterrows():
        print_run_raw = str(row.get("print_run", "")).strip()
        if print_run_raw and print_run_raw.lower() not in ("nan", ""):
            try:
                if float(print_run_raw) <= GRAIL_CUTOFF:
                    skipped_grail += 1
                    continue
            except ValueError:
                pass

        category = str(row.get("category_name", "")).strip()
        category_total_count[category] += 1

        price_raw = str(row.get("current_value", "")).strip()
        if price_raw and price_raw.lower() not in ("nan", ""):
            try:
                category_price_sum[category] += float(price_raw)
                category_priced_count[category] += 1
            except ValueError:
                pass

    # Calculate EV
    ev_total = 0.0
    cards_used = 0
    skipped_no_rate = 0
    breakdown = []

    for category, prob in rate_lookup.items():
        if pd.isna(prob):
            continue
        total_in_cat = category_total_count.get(category, 0)
        if total_in_cat == 0:
            breakdown.append((category, prob, 0, 0, 0.0, 0.0))
            continue
        priced_in_cat = category_priced_count.get(category, 0)
        price_sum = category_price_sum.get(category, 0.0)
        expected_per_box = packs_per_box * prob
        mean_price = price_sum / total_in_cat
        cat_ev = expected_per_box * mean_price
        ev_total += cat_ev
        cards_used += priced_in_cat
        breakdown.append((category, prob, total_in_cat, priced_in_cat, expected_per_box, cat_ev))

    for cat, count in category_total_count.items():
        if cat not in rate_lookup:
            skipped_no_rate += count

    # Build category average price lookup (over ALL cards, unpriced = $0)
    category_avg_price = {
        cat: category_price_sum.get(cat, 0.0) / count
        for cat, count in category_total_count.items()
        if count > 0
    }

    return ev_total, cards_used, skipped_grail, skipped_no_rate, breakdown, category_avg_price


def main():
    df_cards = pd.read_csv(CARDS_CSV, dtype=str)
    df_rates = pd.read_csv(PULL_RATES_CSV, dtype=str)
    df_rates["pull_probability"] = pd.to_numeric(
        df_rates["pull_probability"], errors="coerce"
    )

    sep = "=" * 62
    sub = "-" * 62

    # ── Compute split Refractor averages (veteran vs rookie) ──────────────────
    # Guaranteed Refractors in Blaster/Mega are random base refractors, not rookies.
    # Using the full-category average overstates EV because rookies skew it up.
    def _price(row):
        v = str(row.get("current_value", "")).strip()
        if v and v.lower() != "nan":
            try:
                return float(v)
            except ValueError:
                pass
        return None

    vet_refractor_prices = []
    rookie_refractor_prices = []
    for _, row in df_cards.iterrows():
        cat = str(row.get("category_name", "")).strip()
        is_rookie = str(row.get("rookie_card", "")).strip().lower() == "true"
        price = _price(row)
        if price is None:
            continue
        if cat == "Refractor" and not is_rookie:
            vet_refractor_prices.append(price)
        elif cat == "Rookie Refractor" and is_rookie:
            rookie_refractor_prices.append(price)

    avg_refractor_price = (
        sum(vet_refractor_prices) / len(vet_refractor_prices) if vet_refractor_prices else 0.0
    )
    avg_rookie_refractor_price = (
        sum(rookie_refractor_prices) / len(rookie_refractor_prices) if rookie_refractor_prices else 0.0
    )

    print(sep)
    print("EV CALCULATION — 2023 Topps Chrome Baseball (all formats)")
    print(sep)
    print(f"  Avg Refractor price (veteran, non-rookie):  ${avg_refractor_price:.2f}"
          f"  ({len(vet_refractor_prices)} cards)")
    print(f"  Avg Refractor price (rookie cards only):    ${avg_rookie_refractor_price:.2f}"
          f"  ({len(rookie_refractor_prices)} cards)")
    print()

    # Override lookup for guaranteed pull pricing — keyed by category
    # Blaster/Mega guaranteed Refractors use veteran-only average
    guaranteed_avg_override = {
        "Refractor": avg_refractor_price,
    }

    results = {}
    for slug, label in FORMAT_LABELS.items():
        packs = PACKS_PER_BOX[slug]
        ev_prob, cards_used, _, _, breakdown, cat_avg = calculate_ev_for_format(
            slug, df_cards, df_rates, packs
        )

        # Guaranteed pulls contribution
        ev_guaranteed = 0.0
        guarantee_lines = []
        for g in GUARANTEED_PULLS.get(slug, []):
            cat = g["category_name"]
            cnt = g["count"]
            # Use override avg if available, otherwise fall back to full-category avg
            avg = guaranteed_avg_override.get(cat, cat_avg.get(cat, 0.0))
            contribution = avg * cnt
            ev_guaranteed += contribution
            guarantee_lines.append((cat, cnt, avg, contribution))

        ev_total = ev_prob + ev_guaranteed
        msrp = FORMAT_MSRP[slug]
        roi = (ev_total - msrp) / msrp

        results[slug] = (label, packs, ev_prob, ev_guaranteed, ev_total,
                         msrp, roi, cards_used, breakdown, guarantee_lines)

    # ── Summary table ─────────────────────────────────────────────────────────
    print(f"  {'Format':<18} {'Prob EV':>9}  {'Guar EV':>9}  {'Total EV':>9}  {'MSRP':>8}  {'ROI':>8}")
    print(f"  {sub}")
    for slug, (label, packs, ev_prob, ev_guar, ev_total,
               msrp, roi, cards_used, breakdown, guarantee_lines) in results.items():
        roi_str = f"{roi*100:+.1f}%"
        print(f"  {label:<18} ${ev_prob:>8.2f}  ${ev_guar:>8.2f}  ${ev_total:>8.2f}  ${msrp:>7.2f}  {roi_str:>8}")
    print(f"  {sub}")
    print()

    # ── Per-format detailed breakdown ─────────────────────────────────────────
    for slug, (label, packs, ev_prob, ev_guar, ev_total,
               msrp, roi, cards_used, breakdown, guarantee_lines) in results.items():
        print(sep)
        print(f"  {label}  |  MSRP: ${msrp:.2f}  |  Total EV: ${ev_total:.2f}  |  ROI: {roi*100:+.1f}%")
        print(f"  Packs per box: {packs}")
        print()
        print(f"  Probability-weighted EV: ${ev_prob:.2f}")
        print(f"  {'Category':<35} {'1 in':>6}  {'Exp/box':>7}  {'Cards':>6}  {'EV $':>8}")
        print(f"  {sub}")
        for cat, prob, total, priced, exp, cat_ev in sorted(breakdown, key=lambda x: -x[5]):
            one_in = round(1 / prob) if prob > 0 else "—"
            print(f"  {cat:<35} {one_in:>6}  {exp:>7.4f}  {total:>6,}  ${cat_ev:>7.2f}")
        print(f"  {sub}")
        print(f"  {'Prob-weighted subtotal':<35}                        ${ev_prob:>7.2f}")
        print()
        print(f"  Guaranteed pulls contribution: ${ev_guar:.2f}")
        print(f"  {'Category':<35} {'Count':>5}  {'Avg $':>8}  {'EV $':>8}")
        print(f"  {sub}")
        for cat, cnt, avg, contrib in guarantee_lines:
            print(f"  {cat:<35} {cnt:>5}  ${avg:>7.2f}  ${contrib:>7.2f}")
        print(f"  {sub}")
        print(f"  {'Guarantees subtotal':<35}                        ${ev_guar:>7.2f}")
        print()
        print(f"  TOTAL EV: ${ev_total:.2f}   MSRP: ${msrp:.2f}   ROI: {roi*100:+.1f}%")
        print()

    print(sep)


if __name__ == "__main__":
    main()
