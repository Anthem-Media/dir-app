"""
merge_scp_pricing.py

Reads all SCP pricing CSVs from the 2023 Topps Chrome Inserts Pricing folder,
matches each card's loose-price against the seed spreadsheet by card_number +
player_name + parallel, and writes current_value + value_source into the cards
tab of the ODS spreadsheet.

Outputs:
  - Updated ODS file (same location, _priced suffix)
  - unmatched.csv — rows from SCP that couldn't be matched to any spreadsheet row

Usage:
    python scripts/merge_scp_pricing.py
"""

import csv
import re
import sys
from pathlib import Path
from collections import defaultdict

import pandas as pd
from odf.opendocument import load, OpenDocumentSpreadsheet
from odf.table import Table, TableRow, TableCell
from odf.text import P
from odf import teletype
from odf.namespaces import OFFICENS

# ── Paths ──────────────────────────────────────────────────────────────────────

SEED_PATH = Path(
    "/Users/zachseabolt/Developer/Diamond in the rough Documents"
    "/Baseball/Baseball Seed Spreadsheet"
    "/2023 topps chrome baseball/2023-topps-chrome-baseball_seed.ods"
)

CSV_DIR = Path(
    "/Users/zachseabolt/Developer/Diamond in the rough Documents"
    "/Baseball/Baseball Seed Spreadsheet"
    "/2023 topps chrome baseball/2023 Topps Chrome Inserts Pricing"
)

OUTPUT_PATH = SEED_PATH.parent / "2023-topps-chrome-baseball_seed_priced.ods"
UNMATCHED_PATH = Path(__file__).parent / "output" / "scp_unmatched.csv"

VALUE_SOURCE = "sportscardspro"

# Suffixes to strip from spreadsheet variation_name to get a clean color qualifier
VARIATION_SUFFIXES = [
    " Refractor",
    "-Fractor",
    " FrozenFractor",
    " Auto",
]


# ── Helpers ────────────────────────────────────────────────────────────────────

def get_cell_text(cell) -> str:
    """Extract plain text from an ODS TableCell."""
    parts = []
    for p in cell.getElementsByType(P):
        parts.append(teletype.extractText(p))
    return " ".join(parts).strip()


def set_cell_text(cell, value: str):
    """Replace the text content of an ODS TableCell."""
    from odf.namespaces import OFFICENS
    # Remove existing <text:p> children
    for p in cell.getElementsByType(P):
        cell.removeChild(p)
    # Add a new <text:p> with the value
    p = P(text=value)
    cell.addElement(p)
    # Set value-type using the proper namespace tuple
    cell.setAttrNS(OFFICENS, "value-type", "string")


def parse_product_name(product_name: str):
    """
    Split SCP product-name into (player_name, parallel_text, card_number).

    Examples:
      'Aaron Judge #62'                      → ('Aaron Judge', '', '62')
      'Aaron Judge [Aqua Lava] #62'          → ('Aaron Judge', 'Aqua Lava', '62')
      'Corbin Carroll, Riley Greene #DRA-GC' → ('Corbin Carroll, Riley Greene', '', 'DRA-GC')
    """
    # Card number is everything after the last '#'
    match = re.search(r"#([^\s]+)\s*$", product_name)
    if not match:
        return None, None, None
    card_number = match.group(1).strip()
    before_number = product_name[:match.start()].strip()

    # Parallel is in square brackets
    bracket_match = re.search(r"\[([^\]]+)\]", before_number)
    if bracket_match:
        parallel_text = bracket_match.group(1).strip()
        player_name = before_number[:bracket_match.start()].strip()
    else:
        parallel_text = ""
        player_name = before_number.strip()

    return player_name, parallel_text, card_number


def strip_variation_suffix(variation_name: str):
    """
    Strip trailing refractor/auto suffixes to get the bare color qualifier.
    Returns (stripped_name, suffix_removed).

    'Aqua Lava Refractor' → ('Aqua Lava', ' Refractor')
    'Rookie Autographs Refractor' → ('Rookie Autographs', ' Refractor')
    'Base' → ('Base', '')
    """
    name = variation_name.strip()
    for suffix in VARIATION_SUFFIXES:
        if name.endswith(suffix):
            return name[:-len(suffix)].strip(), suffix.strip()
    return name, ""


def parse_price(price_str: str):
    """Convert '$2.05' or '2.05' to float. Returns None if empty or unparseable."""
    if not price_str:
        return None
    cleaned = price_str.replace("$", "").replace(",", "").strip()
    try:
        val = float(cleaned)
        return val if val > 0 else None
    except ValueError:
        return None


def normalize_name(name: str) -> str:
    """Lowercase + collapse whitespace for loose name comparison."""
    return re.sub(r"\s+", " ", name.strip().lower())


# SCP uses inconsistent names for some parallels. Map SCP bracket text to the
# canonical color qualifier used in the seed spreadsheet.
SCP_PARALLEL_ALIASES = {
    # SCP drops the hyphen; spreadsheet "X-Fractor" strips "-Fractor" → color qualifier "x"
    "xfractor": "x",
    # Logofractor word order — SCP uses both "[Logofractor Blue]" and "[Blue Logofractor]"
    "logofractor blue": "blue logofractor",
    "logofractor gold": "gold logofractor",
    "logofractor green": "green logofractor",
    "logofractor orange": "orange logofractor",
    "logofractor pink": "pink logofractor",
    "logofractor purple": "purple logofractor",
    "logofractor red": "red logofractor",
    "logofractor rose gold": "rose gold logofractor",
    # Printing plates — SCP names the color; spreadsheet uses generic "Printing Plates"
    "cyan printing plate": "printing plates",
    "magenta printing plate": "printing plates",
    "yellow printing plate": "printing plates",
    "black printing plate": "printing plates",
}


def normalize_parallel(parallel_text: str) -> str:
    """Apply alias map to handle SCP naming inconsistencies."""
    lower = parallel_text.strip().lower()
    return SCP_PARALLEL_ALIASES.get(lower, lower)


# ── Build spreadsheet index ────────────────────────────────────────────────────

def build_card_index(ws_rows: list[dict]) -> dict:
    """
    Returns a dict keyed by (card_number, normalized_player_name).
    Each value is a list of dicts: {variation_name, color_qualifier, row_idx}.

    For each (card_number, player) group, we find the "base" variation — the
    shortest variation_name — and use it as a prefix to extract color qualifiers
    from the other variations.
    """
    # Group by (card_number, player)
    groups = defaultdict(list)
    for row in ws_rows:
        key = (row["card_number"], normalize_name(row["player_name"]))
        groups[key].append(row)

    index = {}
    for key, rows in groups.items():
        if not rows:
            continue

        # Shortest variation_name = the base/insert-base variation
        base_variation = min(rows, key=lambda r: len(r["variation_name"]))["variation_name"]
        base_stripped, _ = strip_variation_suffix(base_variation)

        entries = []
        for row in rows:
            var = row["variation_name"]
            stripped, suffix_removed = strip_variation_suffix(var)

            if stripped.lower() == base_stripped.lower():
                if suffix_removed:
                    # e.g., "Rookie Autographs Refractor" → stripped equals base
                    # but a suffix was removed → color qualifier is the suffix itself
                    color_qualifier = suffix_removed.lower()
                else:
                    color_qualifier = ""  # This IS the base
            elif stripped.lower().startswith(base_stripped.lower()):
                color_qualifier = stripped[len(base_stripped):].strip().lower()
            else:
                color_qualifier = stripped.lower()

            entries.append({
                "variation_name": var,
                "color_qualifier": color_qualifier,
                "row_idx": row["row_idx"],
            })

        index[key] = entries
    return index


def find_match(index: dict, player_name: str, parallel_text: str, card_number: str):
    """
    Look up the best matching spreadsheet row_idx for a given SCP card.
    Returns row_idx or None.
    """
    key = (card_number, normalize_name(player_name))
    entries = index.get(key)
    if not entries:
        return None

    parallel_lower = normalize_parallel(parallel_text)

    # Single entry → use it regardless
    if len(entries) == 1:
        return entries[0]["row_idx"]

    # Exact color qualifier match (after alias normalization)
    for entry in entries:
        if entry["color_qualifier"] == parallel_lower:
            return entry["row_idx"]

    # Fallback: parallel_text contained in color_qualifier (handles edge cases)
    matches = [e for e in entries if parallel_lower in e["color_qualifier"] or
               e["color_qualifier"] in parallel_lower]
    if len(matches) == 1:
        return matches[0]["row_idx"]

    return None


# ── Read ODS ───────────────────────────────────────────────────────────────────

def read_ods_cards_tab(doc):
    """
    Returns (headers, ws_rows, raw_row_objects).
    ws_rows: list of dicts with card field values + row_idx.
    raw_row_objects: list of TableRow objects (index 0 = header, 1+ = data).
    """
    for sheet in doc.spreadsheet.getElementsByType(Table):
        if sheet.getAttribute("name") == "cards":
            all_rows = sheet.getElementsByType(TableRow)
            header_row = all_rows[0]
            headers = [get_cell_text(c) for c in header_row.getElementsByType(TableCell)]

            col = {h: i for i, h in enumerate(headers)}

            ws_rows = []
            for row_idx, row in enumerate(all_rows[1:], start=1):
                cells = row.getElementsByType(TableCell)
                vals = [get_cell_text(c) for c in cells]
                # Pad to header length
                while len(vals) < len(headers):
                    vals.append("")

                ws_rows.append({
                    "row_idx": row_idx,
                    "card_number": vals[col["card_number"]],
                    "player_name": vals[col["player_name"]],
                    "variation_name": vals[col["variation_name"]],
                    "current_value": vals[col["current_value"]],
                    "row_obj": row,
                    "cells": cells,
                    "col_current_value": col["current_value"],
                    "col_value_source": col["value_source"],
                })

            return headers, ws_rows, col

    raise ValueError("No 'cards' sheet found in the ODS file.")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if not SEED_PATH.exists():
        print(f"ERROR: Seed spreadsheet not found at {SEED_PATH}")
        sys.exit(1)

    if not CSV_DIR.exists():
        print(f"ERROR: CSV directory not found at {CSV_DIR}")
        sys.exit(1)

    UNMATCHED_PATH.parent.mkdir(parents=True, exist_ok=True)

    print(f"Loading seed spreadsheet…")
    doc = load(str(SEED_PATH))
    headers, ws_rows, col = read_ods_cards_tab(doc)
    print(f"  {len(ws_rows):,} card rows loaded.")

    print("Building card index…")
    index = build_card_index(ws_rows)
    print(f"  {len(index):,} unique (card_number, player) keys indexed.")

    # Find all CSVs
    csv_files = sorted(CSV_DIR.glob("*.csv"))
    print(f"\nFound {len(csv_files)} CSV files in {CSV_DIR.name}")

    # Track updates
    updated = 0
    skipped_no_price = 0
    unmatched_rows = []
    already_priced = 0
    duplicate_overwrites = 0

    # Track which spreadsheet rows have been written (row_idx → price)
    written = {}

    for csv_path in csv_files:
        print(f"\n  Processing {csv_path.name}…")
        file_matched = 0
        file_unmatched = 0

        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for scp_row in reader:
                product_name = scp_row.get("product-name", "").strip()
                loose_price_str = scp_row.get("loose-price", "").strip()

                if not product_name:
                    continue

                price = parse_price(loose_price_str)
                if price is None:
                    skipped_no_price += 1
                    continue

                player_name, parallel_text, card_number = parse_product_name(product_name)
                if not player_name or not card_number:
                    continue

                row_idx = find_match(index, player_name, parallel_text, card_number)

                if row_idx is None:
                    file_unmatched += 1
                    unmatched_rows.append({
                        "csv_file": csv_path.name,
                        "product_name": product_name,
                        "loose_price": loose_price_str,
                        "parsed_player": player_name,
                        "parsed_parallel": parallel_text,
                        "parsed_card_number": card_number,
                    })
                    continue

                # Write price into the ODS row
                ws_row = ws_rows[row_idx - 1]

                if row_idx in written:
                    duplicate_overwrites += 1

                if ws_row["current_value"] and row_idx not in written:
                    already_priced += 1

                # Update the cell objects in-place
                cells = ws_row["cells"]
                cv_idx = ws_row["col_current_value"]
                vs_idx = ws_row["col_value_source"]

                if cv_idx < len(cells):
                    set_cell_text(cells[cv_idx], f"{price:.2f}")
                if vs_idx < len(cells):
                    set_cell_text(cells[vs_idx], VALUE_SOURCE)

                # Also update our in-memory record so duplicate detection works
                ws_rows[row_idx - 1]["current_value"] = str(price)
                written[row_idx] = price
                updated += 1
                file_matched += 1

        print(f"    matched: {file_matched}  |  unmatched: {file_unmatched}")

    # ── Save updated ODS ──────────────────────────────────────────────────────
    print(f"\nSaving updated spreadsheet to:\n  {OUTPUT_PATH}")
    doc.save(str(OUTPUT_PATH))
    print("  Saved.")

    # ── Write unmatched CSV ───────────────────────────────────────────────────
    if unmatched_rows:
        with open(UNMATCHED_PATH, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=unmatched_rows[0].keys())
            writer.writeheader()
            writer.writerows(unmatched_rows)
        print(f"\nUnmatched rows written to:\n  {UNMATCHED_PATH}")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "─" * 60)
    print("SUMMARY")
    print(f"  Prices written:          {updated:,}")
    print(f"  No price in SCP (blank): {skipped_no_price:,}")
    print(f"  No match in spreadsheet: {len(unmatched_rows):,}")
    print(f"  Duplicate overwrites:    {duplicate_overwrites:,}")
    print("─" * 60)

    match_rate = updated / (updated + len(unmatched_rows)) * 100 if (updated + len(unmatched_rows)) else 0
    print(f"  Match rate: {match_rate:.1f}%")

    if unmatched_rows:
        print(f"\nReview scripts/output/scp_unmatched.csv for the {len(unmatched_rows):,} rows")
        print("that couldn't be matched. These will need manual review or are cards")
        print("not in the seed spreadsheet.")


if __name__ == "__main__":
    main()
