#!/usr/bin/env python3
"""
SportsCardsPro CSV → Seed Spreadsheet Reconciler
=================================================
Reads the SCP price-guide CSV and the schema-shaped seed spreadsheet,
reconciles them using the SCP CSV as source of truth, and writes a
cleaned ODS file plus a plain-text report.

Inputs:
    scripts/input/price-guide.csv
    scripts/input/2023-topps-chrome-baseball.seed.ods

Outputs:
    scripts/output/2023-topps-chrome-baseball_reconciled.ods
    scripts/output/reconcile-report.txt

Usage:
    cd /Users/zachseabolt/Developer/dir-app
    python3 scripts/reconcile-scp-csv.py
"""

import re
from pathlib import Path
from typing import Optional

import pandas as pd

# ---------------------------------------------------------------------------
# Paths — all relative to the repo root so the script can be called from there
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).parent.parent
INPUT_DIR = REPO_ROOT / "scripts" / "input"
OUTPUT_DIR = REPO_ROOT / "scripts" / "output"

SCP_CSV = INPUT_DIR / "price-guide.csv"
SEED_ODS = INPUT_DIR / "2023-topps-chrome-baseball.seed.ods"
OUTPUT_ODS = OUTPUT_DIR / "2023-topps-chrome-baseball_reconciled.ods"
OUTPUT_REPORT = OUTPUT_DIR / "reconcile-report.txt"

# Canonical column order for the output cards tab — matches the seed spreadsheet
CARDS_COLUMNS = [
    "box_set_slug", "category_name", "card_number", "player_name",
    "team", "position", "rookie_card", "variation_name", "print_run",
    "is_numbered", "is_autograph", "is_relic", "is_case_hit",
    "circulation_status", "current_value", "value_source",
    "image_url", "notes", "_needs_review", "_source_notes",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def safe_str(val) -> str:
    """Convert a cell value to a clean string; return '' for NaN/None."""
    if val is None:
        return ""
    s = str(val).strip()
    return "" if s.lower() == "nan" else s


def parse_price(raw) -> Optional[float]:
    """Strip leading $ and convert to float. Return None if empty or unparseable."""
    s = safe_str(raw)
    if not s or s == "-":
        return None
    cleaned = s.lstrip("$").replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None


def normalize_card_number(raw) -> str:
    """
    Normalize a card number for matching.
    Converts '062' → '62', '1' → '1'. Falls back to lowercased string
    for non-numeric card numbers (e.g. 'RA-101').
    """
    s = safe_str(raw)
    try:
        return str(int(float(s)))
    except (ValueError, TypeError):
        return s.lower()


def parse_product_name(name: str) -> tuple[str, str, str]:
    """
    Parse a SCP product-name into (player_name, parallel_name, card_number).

    Examples:
        "Aaron Judge #62"              → ("Aaron Judge", "Base", "62")
        "Aaron Judge [Aqua] #62"       → ("Aaron Judge", "Aqua", "62")
        "Aaron Judge [Blue Lava] #62"  → ("Aaron Judge", "Blue Lava", "62")
    """
    # Parallel is the text between the first pair of square brackets, if present
    bracket_match = re.search(r"\[([^\]]+)\]", name)
    parallel_name = bracket_match.group(1).strip() if bracket_match else "Base"

    # Card number is everything after the last '#'
    number_match = re.search(r"#(.+)$", name)
    card_number = number_match.group(1).strip() if number_match else ""

    # Player name is everything before the first '[' or '#', trimmed
    cut = len(name)
    if bracket_match:
        cut = min(cut, bracket_match.start())
    if number_match:
        cut = min(cut, name.index("#"))
    player_name = name[:cut].strip()

    return player_name, parallel_name, card_number


def normalize_parallel(variation: str) -> str:
    """
    Strip the word 'Refractor' (case-insensitive, with surrounding whitespace)
    from a parallel name before comparing.

    The seed spreadsheet appends 'Refractor' to most parallel names
    (e.g. 'Aqua Lava Refractor') while SCP omits it ('Aqua Lava').
    Stripping it from both sides produces a shared comparison surface.
    """
    normalized = re.sub(r"\bRefractor\b", "", variation, flags=re.IGNORECASE)
    return normalized.strip().lower()


def match_key(card_number: str, player_name: str, variation: str) -> tuple:
    """
    Build a normalized 3-field lookup key.
    Matching on all three fields is required for correctness — a player like
    Aaron Judge has dozens of parallels all sharing the same card number.
    The variation field is normalized via normalize_parallel() so that
    'Aqua Lava Refractor' (seed) and 'Aqua Lava' (SCP) produce the same key.
    """
    return (
        normalize_card_number(card_number),
        player_name.strip().lower(),
        normalize_parallel(variation),
    )


# ---------------------------------------------------------------------------
# Step 1 — Load and parse the SCP CSV
# ---------------------------------------------------------------------------

def load_scp_csv(path: Path):
    """
    Load the SCP CSV and return (df_cards, sealed_row_count).

    Card rows are those whose product-name contains '#'.
    Sealed box rows (Hobby Box, Blaster Box, etc.) do not contain '#' and
    are excluded from reconciliation — only counted for the report.
    """
    df = pd.read_csv(path, dtype=str)

    card_mask = df["product-name"].str.contains("#", na=False)
    sealed_count = int((~card_mask).sum())

    df_cards = df[card_mask].copy()

    # Parse product-name into three structured fields
    parsed = df_cards["product-name"].apply(parse_product_name)
    df_cards["scp_player_name"] = parsed.apply(lambda x: x[0])
    df_cards["scp_parallel_name"] = parsed.apply(lambda x: x[1])
    df_cards["scp_card_number"] = parsed.apply(lambda x: x[2])

    # Normalize price columns
    df_cards["loose_price_parsed"] = df_cards["loose-price"].apply(parse_price)
    df_cards["graded_price_parsed"] = df_cards["graded-price"].apply(parse_price)
    df_cards["sales_volume_int"] = (
        pd.to_numeric(df_cards["sales-volume"], errors="coerce").fillna(0).astype(int)
    )

    return df_cards, sealed_count


# ---------------------------------------------------------------------------
# Step 2 — Load the seed spreadsheet
# ---------------------------------------------------------------------------

def load_seed_ods(path: Path):
    """Return (df_box_sets, df_cards, df_pull_rates) from the three-tab seed file."""
    df_box_sets = pd.read_excel(path, sheet_name="box_sets", engine="odf", dtype=str)
    df_cards = pd.read_excel(path, sheet_name="cards", engine="odf", dtype=str)
    df_pull_rates = pd.read_excel(path, sheet_name="pull_rates", engine="odf", dtype=str)
    return df_box_sets, df_cards, df_pull_rates


# ---------------------------------------------------------------------------
# Step 3 — Reconcile
# ---------------------------------------------------------------------------

def reconcile(df_scp: pd.DataFrame, df_seed: pd.DataFrame):
    """
    Iterate over every SCP card row and match it to a seed row using a
    three-field key: (card_number, player_name, variation_name).

    Returns:
        output_rows   — all reconciled card dicts (the new cards tab)
        new_rows      — SCP rows that had no seed match (added)
        phantom_rows  — seed rows that had no SCP match (removed)
        no_price_rows — output rows whose current_value is empty
    """

    # Build seed lookup. Key → (original_index, row_dict).
    # If the seed has duplicate keys (shouldn't happen in clean data), last write wins.
    seed_lookup = {}
    for idx, row in df_seed.iterrows():
        key = match_key(
            safe_str(row.get("card_number", "")),
            safe_str(row.get("player_name", "")),
            safe_str(row.get("variation_name", "")),
        )
        seed_lookup[key] = (idx, row.to_dict())

    seed_matched = set()  # original seed indices that were matched
    output_rows = []
    new_rows = []
    no_price_rows = []

    for _, scp_row in df_scp.iterrows():
        key = match_key(
            scp_row["scp_card_number"],
            scp_row["scp_player_name"],
            scp_row["scp_parallel_name"],
        )

        price = scp_row["loose_price_parsed"]
        has_price = price is not None and not (isinstance(price, float) and pd.isna(price))

        if key in seed_lookup:
            # ── Matched row ────────────────────────────────────────────────
            seed_idx, seed_row_dict = seed_lookup[key]
            seed_matched.add(seed_idx)

            out = {col: safe_str(seed_row_dict.get(col, "")) for col in CARDS_COLUMNS}

            if has_price:
                out["current_value"] = str(price)
                out["value_source"] = "sportscardspro"
            # If no price in SCP, keep whatever was in the seed row (may still be empty)

            output_rows.append(out)

            if not out.get("current_value"):
                no_price_rows.append(out)

        else:
            # ── New row (in SCP, not in seed) ─────────────────────────────
            out = {col: "" for col in CARDS_COLUMNS}
            out["card_number"] = scp_row["scp_card_number"]
            out["player_name"] = scp_row["scp_player_name"]
            out["variation_name"] = scp_row["scp_parallel_name"]
            out["circulation_status"] = "unknown"
            out["_needs_review"] = "TRUE"
            out["_source_notes"] = "Added from SCP CSV — not in seed"

            if has_price:
                out["current_value"] = str(price)
                out["value_source"] = "sportscardspro"

            output_rows.append(out)
            new_rows.append(out)

            if not out.get("current_value"):
                no_price_rows.append(out)

    # Phantoms: seed rows that were never matched to any SCP row
    phantom_rows = []
    for idx, row in df_seed.iterrows():
        if idx not in seed_matched:
            phantom_rows.append({col: safe_str(row.get(col, "")) for col in CARDS_COLUMNS})

    return output_rows, new_rows, phantom_rows, no_price_rows


# ---------------------------------------------------------------------------
# Step 4 — Write outputs
# ---------------------------------------------------------------------------

def write_output_ods(
    output_rows: list[dict],
    df_box_sets: pd.DataFrame,
    df_pull_rates: pd.DataFrame,
    path: Path,
) -> None:
    """Write the reconciled three-tab ODS. box_sets and pull_rates pass through unchanged."""
    df_cards_out = pd.DataFrame(output_rows, columns=CARDS_COLUMNS)

    with pd.ExcelWriter(str(path), engine="odf") as writer:
        df_box_sets.to_excel(writer, sheet_name="box_sets", index=False)
        df_cards_out.to_excel(writer, sheet_name="cards", index=False)
        df_pull_rates.to_excel(writer, sheet_name="pull_rates", index=False)


def _card_label(row: dict) -> str:
    """Format a card row as a readable one-liner for the report."""
    pn = row.get("player_name") or "?"
    cn = row.get("card_number") or "?"
    vn = row.get("variation_name") or "Base"
    return f"  {pn}  #{cn}  [{vn}]"


def write_report(
    path: Path,
    scp_total: int,
    sealed_count: int,
    matched_count: int,
    new_rows: list[dict],
    phantom_rows: list[dict],
    no_price_rows: list[dict],
) -> None:
    """Write the plain-text reconciliation report."""
    sep = "=" * 62
    sub = "-" * 62

    lines = [
        sep,
        "RECONCILIATION REPORT — 2023 Topps Chrome Baseball",
        sep,
        "",
        f"  Total SCP card rows processed:          {scp_total}",
        f"  Sealed box rows excluded from SCP CSV:  {sealed_count}",
        f"  Total matched rows (price updated):     {matched_count}",
        f"  Total new rows added (CSV, not in seed):{len(new_rows)}",
        f"  Total phantoms removed (seed, not CSV): {len(phantom_rows)}",
        f"  Total rows with no price:               {len(no_price_rows)}",
        "",
    ]

    if phantom_rows:
        lines += [
            sub,
            f"PHANTOM CARDS REMOVED ({len(phantom_rows)} rows — in seed, not in SCP CSV)",
            sub,
        ]
        for row in phantom_rows:
            lines.append(_card_label(row))
        lines.append("")

    if new_rows:
        lines += [
            sub,
            f"NEW CARDS ADDED FROM SCP CSV ({len(new_rows)} rows — not in seed)",
            sub,
        ]
        for row in new_rows:
            lines.append(_card_label(row))
        lines.append("")

    if no_price_rows:
        lines += [
            sub,
            f"CARDS WITH NO PRICE AFTER RECONCILIATION ({len(no_price_rows)} rows)",
            sub,
        ]
        for row in no_price_rows:
            lines.append(_card_label(row))
        lines.append("")

    lines += [sep, "END OF REPORT", sep]
    path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Reading SCP CSV...")
    df_scp, sealed_count = load_scp_csv(SCP_CSV)
    print(f"  {len(df_scp):,} card rows | {sealed_count} sealed box rows excluded")

    print("Reading seed spreadsheet...")
    df_box_sets, df_seed_cards, df_pull_rates = load_seed_ods(SEED_ODS)
    print(f"  {len(df_seed_cards):,} rows in seed cards tab")

    print("Reconciling...")
    output_rows, new_rows, phantom_rows, no_price_rows = reconcile(df_scp, df_seed_cards)
    matched_count = len(output_rows) - len(new_rows)

    print("Writing reconciled ODS...")
    write_output_ods(output_rows, df_box_sets, df_pull_rates, OUTPUT_ODS)

    print("Writing report...")
    write_report(
        OUTPUT_REPORT,
        scp_total=len(df_scp),
        sealed_count=sealed_count,
        matched_count=matched_count,
        new_rows=new_rows,
        phantom_rows=phantom_rows,
        no_price_rows=no_price_rows,
    )

    # Terminal summary
    print()
    print("=" * 62)
    print("RECONCILIATION COMPLETE")
    print("=" * 62)
    print(f"  SCP card rows processed:        {len(df_scp):>6,}")
    print(f"  Sealed box rows excluded:       {sealed_count:>6}")
    print(f"  Matched (price updated):        {matched_count:>6,}")
    print(f"  New rows added:                 {len(new_rows):>6,}")
    print(f"  Phantoms removed:               {len(phantom_rows):>6,}")
    print(f"  No-price rows:                  {len(no_price_rows):>6,}")
    print(f"  Output ODS:  {OUTPUT_ODS}")
    print(f"  Report:      {OUTPUT_REPORT}")
    print("=" * 62)


if __name__ == "__main__":
    main()
