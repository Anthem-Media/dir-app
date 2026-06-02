#!/usr/bin/env python3
"""
generate-hardcoded-data.py
==========================
Reads the rebuilt cards CSV and pull rates CSV and outputs a JavaScript file
with real SCP pricing and pull rate data ready to paste into the codebase.

This is a POC-stage tool. The generated file is the hardcoded data layer —
it will be replaced by live Supabase queries when the database phase is complete.

Inputs:
    scripts/output/cards-rebuilt.csv
    scripts/output/pull_rates.csv

Output:
    scripts/output/hardcoded-data.js

Usage:
    cd /Users/zachseabolt/Developer/dir-app
    python3 scripts/generate-hardcoded-data.py
"""

import re
from datetime import date
from pathlib import Path

import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).parent.parent
OUTPUT_DIR = REPO_ROOT / "scripts" / "output"

CARDS_CSV = OUTPUT_DIR / "cards-rebuilt.csv"
PULL_RATES_CSV = OUTPUT_DIR / "pull_rates.csv"
OUTPUT_JS = OUTPUT_DIR / "hardcoded-data.js"

HOBBY_SLUG = "2023-topps-chrome-baseball-hobby"
TOP_CHASES_COUNT = 7


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    """Convert a category name to a lowercase hyphenated slug for use as an id."""
    return re.sub(r"[^a-z0-9]+", "-", text.strip().lower()).strip("-")


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
        # Trim unnecessary trailing zeros but keep at least one decimal place
        return f"{val:.2f}" if val != int(val) else str(int(val))
    return str(val)


def safe_bool(val) -> bool:
    """Parse a boolean from a CSV string field."""
    return str(val).strip().lower() == "true"


def safe_float(val):
    """Parse a float from a CSV string field. Returns None if empty or unparseable."""
    s = str(val).strip()
    if not s or s.lower() == "nan":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def safe_int(val):
    """Parse an int from a CSV string field. Returns None if empty or unparseable."""
    f = safe_float(val)
    return int(f) if f is not None else None


# ---------------------------------------------------------------------------
# Step 2 — Build MOCK_TOP_CHASES
# ---------------------------------------------------------------------------

def build_top_chases(cards_csv: Path) -> list[dict]:
    df = pd.read_csv(cards_csv, dtype=str)

    # Only rows with a price
    df = df[df["current_value"].str.strip().ne("") & df["current_value"].notna()].copy()

    # Parse current_value for sorting
    df["_value_float"] = df["current_value"].apply(safe_float)
    df = df[df["_value_float"].notna()]

    # Exclude Grails: print_run <= 10
    def is_grail(row):
        pr = safe_int(row["print_run"])
        return pr is not None and pr <= 10

    df = df[~df.apply(is_grail, axis=1)]

    # Sort descending by value, take top 25
    df = df.sort_values("_value_float", ascending=False).head(TOP_CHASES_COUNT)

    entries = []
    for i, (_, row) in enumerate(df.iterrows(), start=1):
        cn = str(row["card_number"]).strip()
        entries.append({
            "id": f"tc-{cn}-{i}",
            "playerName": str(row["player_name"]).strip(),
            "variationName": str(row["variation_name"]).strip(),
            "category": str(row["category_name"]).strip(),
            "currentValue": safe_float(row["current_value"]),
            "rookieCard": safe_bool(row["rookie_card"]),
            "isAutograph": safe_bool(row["is_autograph"]),
            "printRun": safe_int(row["print_run"]),
        })

    return entries


# ---------------------------------------------------------------------------
# Step 3 — Build MOCK_PULL_RATES
# ---------------------------------------------------------------------------

def build_pull_rates(pull_rates_csv: Path) -> list[dict]:
    df = pd.read_csv(pull_rates_csv, dtype=str)

    # Hobby format only
    df = df[df["box_set_slug"] == HOBBY_SLUG].copy()

    entries = []
    for _, row in df.iterrows():
        cat = str(row["category_name"]).strip()
        entries.append({
            "id": f"pr-{slugify(cat)}",
            "category": cat,
            "oddsNumerator": safe_int(row["odds_numerator"]),
            "oddsDenominator": safe_int(row["odds_denominator"]),
            "probability": safe_float(row["pull_probability"]),
            "source": str(row["odds_source"]).strip(),
        })

    return entries


# ---------------------------------------------------------------------------
# Step 4 — Write JavaScript output
# ---------------------------------------------------------------------------

def render_object(obj: dict, indent: int = 2) -> str:
    """Render a Python dict as a JavaScript object literal."""
    pad = " " * indent
    inner_pad = " " * (indent + 2)
    lines = ["{"]
    for key, val in obj.items():
        lines.append(f"{inner_pad}{key}: {js_value(val)},")
    lines.append(f"{pad}}}")
    return "\n".join(lines)


def write_js(top_chases: list[dict], pull_rates: list[dict], path: Path) -> None:
    today = date.today().isoformat()

    lines = [
        "// AUTO-GENERATED by scripts/generate-hardcoded-data.py",
        "// Source: scripts/output/cards-rebuilt.csv + scripts/output/pull_rates.csv",
        f"// Generated: {today}",
        "// DO NOT EDIT MANUALLY — re-run the script to regenerate",
        "",
        "",
        "export const MOCK_TOP_CHASES = [",
    ]

    for entry in top_chases:
        lines.append(f"  {render_object(entry, indent=2)},")

    lines += [
        "];",
        "",
        "",
        "export const MOCK_PULL_RATES = [",
    ]

    for entry in pull_rates:
        lines.append(f"  {render_object(entry, indent=2)},")

    lines += [
        "];",
        "",
    ]

    path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Building MOCK_TOP_CHASES from cards-rebuilt.csv...")
    top_chases = build_top_chases(CARDS_CSV)
    print(f"  {len(top_chases)} entries")

    print("Building MOCK_PULL_RATES from pull_rates.csv...")
    pull_rates = build_pull_rates(PULL_RATES_CSV)
    print(f"  {len(pull_rates)} entries")

    print(f"Writing {OUTPUT_JS.name}...")
    write_js(top_chases, pull_rates, OUTPUT_JS)

    print()
    print("=" * 58)
    print("DONE")
    print("=" * 58)
    print(f"  MOCK_TOP_CHASES entries:  {len(top_chases)}")
    print(f"  MOCK_PULL_RATES entries:  {len(pull_rates)}")
    print()
    print("  Top 5 cards by value:")
    for entry in top_chases[:5]:
        print(f"    {entry['playerName']}  [{entry['variationName']}]  —  ${entry['currentValue']:.2f}")
    print()
    print(f"  Output: {OUTPUT_JS}")
    print("=" * 58)


if __name__ == "__main__":
    main()
