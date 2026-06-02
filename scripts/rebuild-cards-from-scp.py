#!/usr/bin/env python3
"""
SportsCardsPro CSV → Cards Tab Builder (POC tool)
==================================================
Reads the SCP price-guide CSV and rebuilds the cards tab from scratch
using only SCP data. The box_sets and pull_rates tabs are copied
unchanged from the seed spreadsheet.

This is a one-box POC tool. It does not touch the codebase, Vercel, or Supabase.

Inputs:
    scripts/input/price-guide.csv
    scripts/input/2023-topps-chrome-baseball.seed.ods

Outputs:
    scripts/output/2023-topps-chrome-baseball_rebuilt.ods
    scripts/output/rebuild-report.txt

Usage:
    cd /Users/zachseabolt/Developer/dir-app
    python3 scripts/rebuild-cards-from-scp.py
"""

import re
from pathlib import Path
from typing import Optional

import pandas as pd

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).parent.parent
INPUT_DIR = REPO_ROOT / "scripts" / "input"
OUTPUT_DIR = REPO_ROOT / "scripts" / "output"

SCP_CSV = INPUT_DIR / "price-guide.csv"
SEED_ODS = INPUT_DIR / "2023-topps-chrome-baseball.seed.ods"
OUTPUT_CARDS_CSV = OUTPUT_DIR / "cards-rebuilt.csv"
OUTPUT_BOX_SETS_CSV = OUTPUT_DIR / "box_sets.csv"
OUTPUT_PULL_RATES_CSV = OUTPUT_DIR / "pull_rates.csv"
OUTPUT_REPORT = OUTPUT_DIR / "rebuild-report.txt"

# POC: every card row gets this slug (only one format seeded for the POC)
BOX_SET_SLUG = "2023-topps-chrome-baseball-hobby"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_price(raw) -> Optional[float]:
    """Strip $ and convert to float. Return None if empty or unparseable."""
    if raw is None:
        return None
    s = str(raw).strip()
    if not s or s.lower() == "nan" or s == "-":
        return None
    cleaned = s.lstrip("$").replace(",", "")
    try:
        return float(cleaned)
    except ValueError:
        return None


def parse_product_name(name: str):
    """
    Parse a SCP product-name into
    (player_name, variation_name, card_number, print_run, is_numbered).

    Examples:
        "Aaron Judge #62"              -> ("Aaron Judge", "Base", "62", None, False)
        "Aaron Judge [Aqua Lava] #62"  -> ("Aaron Judge", "Aqua Lava", "62", None, False)
        "Aaron Judge [Gold] #62 /50"   -> ("Aaron Judge", "Gold", "62", 50, True)
        "Aaron Judge [Superfractor] #62 1/1" -> ("Aaron Judge", "Superfractor", "62", 1, True)
    """
    bracket_match = re.search(r"\[([^\]]+)\]", name)
    variation_name = bracket_match.group(1).strip() if bracket_match else "Base"

    number_match = re.search(r"#(.+)$", name)
    card_number = number_match.group(1).strip() if number_match else ""

    cut = len(name)
    if bracket_match:
        cut = min(cut, bracket_match.start())
    if number_match:
        cut = min(cut, name.index("#"))
    player_name = name[:cut].strip()

    # Parse print run from product-name (e.g. "/50" or "1/1")
    print_run_match = re.search(r'(?<!\d)(\d+)/(\d+)(?!\d)', name)
    if print_run_match:
        denominator = int(print_run_match.group(2))
        print_run = denominator
        is_numbered = True
    else:
        print_run = None
        is_numbered = False

    return player_name, variation_name, card_number, print_run, is_numbered


# ---------------------------------------------------------------------------
# Step 1 — Read inputs
# ---------------------------------------------------------------------------

def load_seed_passthrough(path: Path):
    """
    Load box_sets and pull_rates tabs for passthrough.
    Load the cards tab headers only (no data rows).
    Returns (df_box_sets, df_pull_rates, cards_columns).
    """
    df_box_sets = pd.read_excel(path, sheet_name="box_sets", engine="odf", dtype=str)
    df_pull_rates = pd.read_excel(path, sheet_name="pull_rates", engine="odf", dtype=str)
    df_pull_rates = df_pull_rates[df_pull_rates["category_name"] != "Patch Auto"].reset_index(drop=True)
    df_cards_headers = pd.read_excel(path, sheet_name="cards", engine="odf", dtype=str, nrows=0)
    cards_columns = list(df_cards_headers.columns)
    return df_box_sets, df_pull_rates, cards_columns


# ---------------------------------------------------------------------------
# Step 2 — Parse the SCP CSV
# ---------------------------------------------------------------------------

def load_and_parse_scp(path: Path):
    """
    Load the SCP CSV. Filter to card rows only (product-name contains #).
    Parse each card row into structured fields.
    Returns (df_cards, sealed_count).
    """
    df = pd.read_csv(path, dtype=str)

    card_mask = df["product-name"].str.contains("#", na=False)
    sealed_count = int((~card_mask).sum())
    df_cards = df[card_mask].copy()

    parsed = df_cards["product-name"].apply(parse_product_name)
    df_cards = df_cards.copy()
    df_cards["_player_name"] = parsed.apply(lambda x: x[0])
    df_cards["_variation_name"] = parsed.apply(lambda x: x[1])
    df_cards["_card_number"] = parsed.apply(lambda x: x[2])
    df_cards["_print_run"] = parsed.apply(lambda x: x[3])
    df_cards["_is_numbered"] = parsed.apply(lambda x: x[4])
    df_cards["_current_value"] = df_cards["loose-price"].apply(parse_price)
    df_cards["_sales_volume"] = (
        pd.to_numeric(df_cards["sales-volume"], errors="coerce").fillna(0).astype(int)
    )

    return df_cards, sealed_count


# ---------------------------------------------------------------------------
# Step 3 — Build the cards tab
# ---------------------------------------------------------------------------

def infer_category_name(card_number, variation_name, is_autograph, rookie_card, current_value):
    """
    Infer category_name from card identity fields.
    Maps to one of the 15 valid card_categories in the schema.
    """
    cn = str(card_number).strip().upper()
    vn = str(variation_name).strip().lower()

    # Auto sub-category prefixes from seed (appended rows)
    if cn.startswith('DRA-') or cn.startswith('FSA-') or cn.startswith('RRA-'):
        return 'Numbered Autograph'
    if cn.startswith('CLA-') or cn.startswith('88BA-') or cn.startswith('TTA-') or cn.startswith('UVA-'):
        return 'Base Auto'
    if cn.startswith('TCAA-'):
        return 'Memorabilia / Relic'

    # Superfractor
    if 'superfractor' in vn:
        return 'Superfractor'

    # Autographs — must run before SP Variation so that 'SP Variation Autograph'
    # cards land in the correct autograph category, not Short Print
    if is_autograph:
        numbered_keywords = ['gold', 'orange', 'red', 'blue', 'green', 'aqua',
                             'purple', 'wave', 'sonar', 'lava', 'speckle', 'raywave']
        if any(k in vn for k in numbered_keywords):
            return 'Numbered Autograph'
        if 'refractor' in vn:
            return 'Refractor Auto'
        return 'Base Auto'

    # SP Variation (non-autograph)
    if 'sp variation' in vn:
        return 'Short Print'

    # Base card (no parallel)
    if vn == 'base':
        return 'Base Rookie' if rookie_card else 'Base'

    # Plain refractor (no color modifier)
    if vn == 'refractor':
        return 'Rookie Refractor' if rookie_card else 'Refractor'

    # Numbered parallels (color + wave/sonar/lava = numbered)
    numbered_keywords = ['aqua', 'blue', 'gold', 'green', 'orange', 'red',
                         'purple', 'magenta', 'pink', 'sepia', 'negative',
                         'wave', 'sonar', 'lava', 'speckle', 'logofractor',
                         'printing plates', 'image variation', 'xfractor',
                         'x-fractor', 'prism', 'sub zero', 'frozenfractor']
    if any(k in vn for k in numbered_keywords):
        return 'Numbered Rookie Refractor' if rookie_card else 'Numbered Refractor'

    # Fallback
    return 'Numbered Refractor' if rookie_card else 'Refractor'


def _norm_variation(v: str) -> str:
    """Normalize a variation name for seed matching: lowercase, strip whitespace,
    remove the word 'Refractor' — same logic used in the reconciler."""
    return re.sub(r"\bRefractor\b", "", str(v), flags=re.IGNORECASE).strip().lower()


def build_seed_print_run_lookup(df_seed: pd.DataFrame) -> dict:
    """
    Build a lookup from (card_number, normalized_variation) -> (print_run, is_numbered)
    using the seed spreadsheet's cards tab. Used to backfill print_run and is_numbered
    on SCP-sourced rows that don't carry that information in the CSV.
    """
    lookup = {}
    for _, row in df_seed.iterrows():
        cn = str(row.get("card_number", "")).strip()
        vn = _norm_variation(str(row.get("variation_name", "")))
        pr_raw = str(row.get("print_run", "")).strip()
        in_raw = str(row.get("is_numbered", "")).strip().lower()
        pr = pr_raw if pr_raw and pr_raw.lower() != "nan" else ""
        is_num = True if in_raw == "true" else (False if in_raw == "false" else "")
        if pr or is_num:
            lookup[(cn, vn)] = (pr, is_num)
    return lookup


def build_cards_tab(df_scp: pd.DataFrame, cards_columns: list, rookie_card_numbers: set,
                    seed_print_run_lookup: dict) -> pd.DataFrame:
    """
    Build a fresh cards DataFrame from SCP data.
    All columns not derivable from SCP are left blank.
    rookie_card_numbers is the set of card_number values flagged as rookies in the seed.
    seed_print_run_lookup maps (card_number, normalized_variation) -> (print_run, is_numbered)
    so that print run data from the seed can be carried over to SCP-sourced rows.
    """
    rows = []
    for _, row in df_scp.iterrows():
        price = row["_current_value"]
        has_price = price is not None

        out = {col: "" for col in cards_columns}
        out["box_set_slug"] = BOX_SET_SLUG
        out["card_number"] = row["_card_number"]
        out["player_name"] = row["_player_name"]
        out["variation_name"] = row["_variation_name"]

        is_auto = "autograph" in row["_variation_name"].lower()
        out["is_autograph"] = True if is_auto else False
        is_relic = "authentic" in row["_variation_name"].lower()
        out["is_relic"] = True if is_relic else False  # Topps Chrome Authentics are memorabilia cards
        out["rookie_card"] = True if row["_card_number"] in rookie_card_numbers else False
        # Start with whatever print_run/is_numbered the SCP product name gave us
        out["print_run"] = row["_print_run"] if row["_print_run"] is not None else ""
        out["is_numbered"] = True if row["_is_numbered"] else False

        # Override with seed data where available — seed has explicit print run values
        # that SCP doesn't include in its product names
        seed_key = (row["_card_number"], _norm_variation(row["_variation_name"]))
        if seed_key in seed_print_run_lookup:
            seed_pr, seed_is_num = seed_print_run_lookup[seed_key]
            if seed_pr:
                out["print_run"] = seed_pr
            if seed_is_num != "":
                out["is_numbered"] = seed_is_num

        out["category_name"] = infer_category_name(
            row["_card_number"],
            row["_variation_name"],
            out["is_autograph"],
            out["rookie_card"],
            row["_current_value"],
        )

        if has_price:
            out["current_value"] = price
            out["value_source"] = "sportscardspro"
        # value_source intentionally left blank when there is no price

        rows.append(out)

    return pd.DataFrame(rows, columns=cards_columns)


# ---------------------------------------------------------------------------
# Step 4 — Write outputs
# ---------------------------------------------------------------------------

def write_output_csvs(
    df_cards: pd.DataFrame,
    df_box_sets: pd.DataFrame,
    df_pull_rates: pd.DataFrame,
) -> None:
    """Write three separate CSVs. box_sets and pull_rates pass through unchanged."""
    df_cards.to_csv(str(OUTPUT_CARDS_CSV), index=False)
    df_box_sets.to_csv(str(OUTPUT_BOX_SETS_CSV), index=False)
    df_pull_rates.to_csv(str(OUTPUT_PULL_RATES_CSV), index=False)


def write_output_ods(
    df_cards: pd.DataFrame,
    df_box_sets: pd.DataFrame,
    df_pull_rates: pd.DataFrame,
) -> None:
    """Write a single ODS file with three tabs."""
    output_ods = OUTPUT_DIR / "2023-topps-chrome-baseball_rebuilt.ods"
    with pd.ExcelWriter(str(output_ods), engine="odf") as writer:
        df_box_sets.to_excel(writer, sheet_name="box_sets", index=False)
        df_cards.to_excel(writer, sheet_name="cards", index=False)
        df_pull_rates.to_excel(writer, sheet_name="pull_rates", index=False)
    return output_ods


def write_report(
    path: Path,
    total_scp: int,
    sealed_count: int,
    total_written: int,
    rows_with_price: int,
    rows_no_price: int,
    top10: pd.DataFrame,
) -> None:
    """Write the plain-text rebuild report."""
    sep = "=" * 60
    sub = "-" * 60

    lines = [
        sep,
        "REBUILD REPORT — 2023 Topps Chrome Baseball",
        sep,
        "",
        f"  Total SCP rows processed:       {total_scp:>6,}",
        f"  Sealed box rows skipped:        {sealed_count:>6}",
        f"  Total card rows written:        {total_written:>6,}",
        f"  Rows with a price:              {rows_with_price:>6,}",
        f"  Rows with no price:             {rows_no_price:>6,}",
        "",
        sub,
        "TOP 10 CARDS BY SALES VOLUME",
        sub,
    ]

    for _, row in top10.iterrows():
        pn = row["_player_name"]
        cn = row["_card_number"]
        vn = row["_variation_name"]
        sv = int(row["_sales_volume"])
        price = row["_current_value"]
        price_str = f"${price:.2f}" if price is not None else "no price"
        lines.append(f"  {pn} #{cn} [{vn}]  —  {sv} sales  ({price_str})")

    lines += ["", sep, "END OF REPORT", sep]
    path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Auto append
# ---------------------------------------------------------------------------

AUTO_PREFIXES = ["TCAA-", "CLA-", "88BA-", "DRA-", "FSA-", "RRA-", "TTA-", "UVA-"]


def append_seed_autos(df_cards: pd.DataFrame, df_seed: pd.DataFrame, cards_columns: list):
    """
    Extract rows from the seed whose card_number starts with any AUTO_PREFIX.
    Append any that don't already exist in df_cards (matched by card_number).
    Clears current_value and value_source on appended rows — no SCP pricing for these.
    Returns (df_combined, counts_by_prefix) where counts_by_prefix is a dict.
    """
    existing_card_numbers = set(df_cards["card_number"].str.strip().unique())

    mask = df_seed["card_number"].str.startswith(tuple(AUTO_PREFIXES), na=False)
    df_auto_candidates = df_seed[mask].copy()

    rows_to_append = []
    counts_by_prefix = {p: 0 for p in AUTO_PREFIXES}

    for _, row in df_auto_candidates.iterrows():
        cn = str(row["card_number"]).strip()
        if cn in existing_card_numbers:
            continue

        # Build an output row keeping all seed column values
        out = {col: str(row[col]) if col in row.index and str(row[col]).lower() != "nan" else ""
               for col in cards_columns}
        # No SCP pricing for these rows
        out["current_value"] = ""
        out["value_source"] = ""
        # Re-infer category_name so it matches the same logic as SCP-sourced rows
        out["category_name"] = infer_category_name(
            cn,
            out.get("variation_name", ""),
            out.get("is_autograph", "").lower() == "true",
            out.get("rookie_card", "").lower() == "true",
            None,
        )

        rows_to_append.append(out)
        existing_card_numbers.add(cn)  # prevent duplicates if seed itself has dupes

        for prefix in AUTO_PREFIXES:
            if cn.startswith(prefix):
                counts_by_prefix[prefix] += 1
                break

    if rows_to_append:
        df_appended = pd.DataFrame(rows_to_append, columns=cards_columns)
        df_combined = pd.concat([df_cards, df_appended], ignore_index=True)
    else:
        df_combined = df_cards

    return df_combined, counts_by_prefix


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Reading seed spreadsheet (headers + passthrough tabs)...")
    df_box_sets, df_pull_rates, cards_columns = load_seed_passthrough(SEED_ODS)
    print(f"  Cards tab columns: {len(cards_columns)}")

    print("Reading rookie card numbers from seed...")
    df_seed_cards = pd.read_excel(SEED_ODS, sheet_name="cards", engine="odf", dtype=str)
    rookie_card_numbers = set(
        df_seed_cards[df_seed_cards["rookie_card"].astype(str).str.lower() == "true"]["card_number"].str.strip().unique()
    )
    print(f"  {len(rookie_card_numbers)} unique rookie card numbers found in seed")

    print("Reading and parsing SCP CSV...")
    df_scp, sealed_count = load_and_parse_scp(SCP_CSV)
    print(f"  {len(df_scp):,} card rows | {sealed_count} sealed box rows skipped")

    print("Building seed print run lookup...")
    seed_print_run_lookup = build_seed_print_run_lookup(df_seed_cards)
    print(f"  {len(seed_print_run_lookup)} seed entries with print_run or is_numbered data")

    print("Building cards tab...")
    df_cards = build_cards_tab(df_scp, cards_columns, rookie_card_numbers, seed_print_run_lookup)
    rows_before_append = len(df_cards)

    print("Appending missing auto rows from seed...")
    df_cards, auto_counts = append_seed_autos(df_cards, df_seed_cards, cards_columns)
    rows_appended = len(df_cards) - rows_before_append
    print(f"  {rows_appended} rows appended")
    for prefix, count in auto_counts.items():
        if count:
            print(f"    {prefix:8s} {count}")

    rows_with_price = int((df_scp["_current_value"].notna()).sum())
    rows_no_price = len(df_scp) - rows_with_price
    top10 = df_scp.nlargest(10, "_sales_volume")[
        ["_player_name", "_card_number", "_variation_name", "_sales_volume", "_current_value"]
    ]

    print("Writing output CSVs...")
    write_output_csvs(df_cards, df_box_sets, df_pull_rates)

    print("Writing output ODS...")
    output_ods = write_output_ods(df_cards, df_box_sets, df_pull_rates)

    print("Writing report...")
    write_report(
        OUTPUT_REPORT,
        total_scp=len(df_scp),
        sealed_count=sealed_count,
        total_written=len(df_cards),
        rows_with_price=rows_with_price,
        rows_no_price=rows_no_price,
        top10=top10,
    )

    # Terminal summary
    print()
    print("=" * 60)
    print("REBUILD COMPLETE")
    print("=" * 60)
    print(f"  SCP card rows processed:    {len(df_scp):>6,}")
    print(f"  Sealed box rows skipped:    {sealed_count:>6}")
    print(f"  Card rows from SCP:         {rows_before_append:>6,}")
    print(f"  Rows appended from seed:    {rows_appended:>6,}")
    print(f"  Total card rows written:    {len(df_cards):>6,}")
    print(f"  Rows with price:            {rows_with_price:>6,}")
    print(f"  Rows with no price:         {rows_no_price:>6,}")
    print()
    print("  Top 10 by sales volume:")
    for _, row in top10.iterrows():
        price = row["_current_value"]
        price_str = f"${price:.2f}" if price is not None else "no price"
        print(f"    {row['_player_name']} #{row['_card_number']} [{row['_variation_name']}]"
              f"  —  {int(row['_sales_volume'])} sales  ({price_str})")
    print()
    print(f"  Cards CSV:       {OUTPUT_CARDS_CSV}")
    print(f"  Box sets CSV:    {OUTPUT_BOX_SETS_CSV}")
    print(f"  Pull rates CSV:  {OUTPUT_PULL_RATES_CSV}")
    print(f"  ODS:             {output_ods}")
    print(f"  Report:          {OUTPUT_REPORT}")
    print("=" * 60)


if __name__ == "__main__":
    main()
