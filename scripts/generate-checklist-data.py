#!/usr/bin/env python3
"""
generate-checklist-data.py
==========================
Reads cards-rebuilt.csv and generates a JavaScript file containing
REAL_CHECKLIST_TIERS — the full 2023 Topps Chrome Baseball checklist
grouped into 5 tiers, ready to drop into the codebase.

Input:  scripts/output/cards-rebuilt.csv
Output: scripts/output/checklist-data.js

Usage:
    cd /Users/zachseabolt/Developer/dir-app
    python3 scripts/generate-checklist-data.py
"""

import re
from datetime import date
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = REPO_ROOT / "scripts" / "output"
CARDS_CSV = OUTPUT_DIR / "cards-rebuilt.csv"
OUTPUT_JS = OUTPUT_DIR / "checklist-data.js"

TIER_MAP = {
    'Base':                       1,
    'Base Rookie':                1,
    'Insert':                     2,
    'Short Print':                2,
    'Refractor':                  3,
    'Rookie Refractor':           3,
    'Numbered Refractor':         3,
    'Numbered Rookie Refractor':  3,
    'Base Auto':                  4,
    'Refractor Auto':             4,
    'Numbered Autograph':         4,
    'Superfractor':               5,
    'Memorabilia / Relic':        5,
}

TIER_NAMES = {
    1: 'Base & Rookies',
    2: 'Inserts & Short Prints',
    3: 'Refractors',
    4: 'Autographs',
    5: 'Premium Hits',
}


def slugify(text: str) -> str:
    """Convert a string to a lowercase hyphenated slug for use in an id."""
    return re.sub(r"[^a-z0-9]+", "-", str(text).strip().lower()).strip("-")


def js_value(val) -> str:
    """Render a Python value as a JavaScript literal."""
    if val is None or (isinstance(val, float) and pd.isna(val)):
        return "null"
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, str):
        escaped = val.replace("\\", "\\\\").replace("'", "\\'")
        return f"'{escaped}'"
    if isinstance(val, float):
        return f"{val:.2f}" if val != int(val) else str(int(val))
    return str(val)


def main() -> None:
    df = pd.read_csv(CARDS_CSV, dtype=str)

    # Parse current_value to float
    df["_value"] = pd.to_numeric(df["current_value"], errors="coerce")

    # Assign tier number; drop rows with unmapped categories
    df["_tier"] = df["category_name"].map(TIER_MAP)
    unmapped = df[df["_tier"].isna()]["category_name"].value_counts()
    if not unmapped.empty:
        print(f"  Warning: {unmapped.sum()} rows with unmapped categories dropped:")
        for cat, count in unmapped.items():
            print(f"    {cat}: {count}")
    df = df[df["_tier"].notna()].copy()
    df["_tier"] = df["_tier"].astype(int)

    tiers_js = []
    tier_summaries = []

    for tier_num in sorted(set(TIER_MAP.values())):
        tier_df = df[df["_tier"] == tier_num].copy()
        if tier_df.empty:
            continue

        # Sort: priced rows descending by value, then unpriced alphabetically by player
        priced = tier_df[tier_df["_value"].notna()].sort_values("_value", ascending=False)
        unpriced = tier_df[tier_df["_value"].isna()].sort_values("player_name")
        tier_sorted = pd.concat([priced, unpriced], ignore_index=True)

        total_cards = len(tier_sorted)
        priced_values = tier_sorted["_value"].dropna()
        avg_value = round(float(priced_values.mean()), 2) if len(priced_values) > 0 else None

        # Build card objects
        card_lines = []
        for _, row in tier_sorted.iterrows():
            cn  = str(row.get("card_number",   "")).strip()
            vn  = str(row.get("variation_name","")).strip()
            pn  = str(row.get("player_name",   "")).strip()
            cat = str(row.get("category_name", "")).strip()
            val = row["_value"]
            val_js = f"{val:.2f}" if not pd.isna(val) else "null"

            # print_run — integer or null
            pr_raw = str(row.get("print_run", "")).strip()
            try:
                pr_js = str(int(float(pr_raw))) if pr_raw and pr_raw.lower() != "nan" else "null"
            except (ValueError, TypeError):
                pr_js = "null"

            # boolean fields — stored as "True"/"False" strings in the CSV
            def to_bool_js(field):
                v = str(row.get(field, "")).strip().lower()
                return "true" if v == "true" else "false"

            card_id = f"{slugify(cn)}-{slugify(vn)}"

            card_lines.append(
                f"    {{ id: {js_value(card_id)}, "
                f"card_number: {js_value(cn)}, "
                f"player_name: {js_value(pn)}, "
                f"variation_name: {js_value(vn)}, "
                f"print_run: {pr_js}, "
                f"category_name: {js_value(cat)}, "
                f"current_value: {val_js}, "
                f"is_autograph: {to_bool_js('is_autograph')}, "
                f"rookie_card: {to_bool_js('rookie_card')}, "
                f"is_relic: {to_bool_js('is_relic')}, "
                f"is_case_hit: {to_bool_js('is_case_hit')}, "
                f"is_numbered: {to_bool_js('is_numbered')} }}"
            )

        cards_block = ",\n".join(card_lines)
        avg_js = f"{avg_value:.2f}" if avg_value is not None else "null"

        tier_block = (
            f"  {{\n"
            f"    id: 'tier-{tier_num}',\n"
            f"    label: '{TIER_NAMES[tier_num]}',\n"
            f"    cardCount: {total_cards},\n"
            f"    avgValue: {avg_js},\n"
            f"    cards: [\n"
            f"{cards_block}\n"
            f"    ],\n"
            f"  }}"
        )
        tiers_js.append(tier_block)

        tier_summaries.append((tier_num, TIER_NAMES[tier_num], total_cards, avg_value))

    today = date.today().isoformat()
    output = (
        f"// AUTO-GENERATED by scripts/generate-checklist-data.py\n"
        f"// Source: scripts/output/cards-rebuilt.csv\n"
        f"// Generated: {today}\n"
        f"// DO NOT EDIT MANUALLY — re-run the script to regenerate\n"
        f"\n"
        f"export const REAL_CHECKLIST_TIERS = [\n"
        + ",\n".join(tiers_js)
        + "\n];\n"
    )

    OUTPUT_JS.write_text(output, encoding="utf-8")

    # Summary
    sep = "=" * 58
    print(sep)
    print("CHECKLIST DATA GENERATED")
    print(sep)
    print(f"  {'Tier':<6} {'Name':<25} {'Cards':>6}  {'Avg Value':>10}")
    print(f"  {'-'*56}")
    total = 0
    for tier_num, name, count, avg in tier_summaries:
        avg_str = f"${avg:.2f}" if avg is not None else "n/a"
        print(f"  Tier {tier_num}  {name:<25} {count:>6,}  {avg_str:>10}")
        total += count
    print(f"  {'-'*56}")
    print(f"  {'TOTAL':<32} {total:>6,}")
    print()
    print(f"  Output: {OUTPUT_JS}")
    print(sep)


if __name__ == "__main__":
    main()
