"""
reconcile_cards_pull_rates.py

Reconciles 2023-topps-chrome-baseball_from_scp.ods so every card joins cleanly
to its pull rate.  Reads the ODS, applies all fixes, and writes:

  scripts/output/cards-from-scp.csv              — fixed card checklist
  scripts/output/pull_rates-from-scp.csv         — fixed pull rates
  scripts/output/removed_logofractor_contamination.csv
  scripts/output/removed_other_product_oddballs.csv
  (ODS is also updated in-place with the same changes)

Fixes applied:
  1. Remove 1,438 Logofractor contamination rows
  2. Remove 8 other-product oddball rows
  3. Add pull_rate_category + pull_rate_is_approximated columns
  4. Fill 5 blank "Super Short Print" pull_rates rows from Gimmicks Tier 1
     Orange Speckle Refractor odds (same /25 print run, same published odds)
  5. Calculate pull_probability for Future Stars Autograph SuperFractor / hobby

Usage:
    python scripts/reconcile_cards_pull_rates.py
"""

import csv
import sys
from pathlib import Path

from odf.opendocument import load as load_ods, OpenDocumentSpreadsheet
from odf.table import Table, TableRow, TableCell
from odf.text import P
from odf import teletype
from odf.namespaces import OFFICENS


# ── Paths ──────────────────────────────────────────────────────────────────────

ODS_PATH = Path(
    "/Users/zachseabolt/Developer/Diamond in the rough Documents"
    "/Baseball/Baseball Seed Spreadsheet"
    "/2023 topps chrome baseball/2023-topps-chrome-baseball_from_scp.ods"
)
OUTPUT_DIR = Path(__file__).parent / "output"

CARDS_OUT         = OUTPUT_DIR / "cards-from-scp.csv"
PR_OUT            = OUTPUT_DIR / "pull_rates-from-scp.csv"
LOGO_REMOVED      = OUTPUT_DIR / "removed_logofractor_contamination.csv"
ODDBALL_REMOVED   = OUTPUT_DIR / "removed_other_product_oddballs.csv"


# ── Step 1 & 2: Removal sets ───────────────────────────────────────────────────

ODDBALL_VARIATION_NAMES = {
    "Chrome Refractor",
    "Frozen Refractor",
    "Silver  Wave",          # double space — exact match required
    "Autograph",
    "Black Autograph",
    "Refractor Autograph",
    "Yellow Refractor Autograph",
    "Rookie Autographs Mojo",
}


# ── Step 3: pull_rate_category mapping ────────────────────────────────────────
# Keys are variation_name values; values are (pull_rate_category, is_approximated).

PULL_RATE_MAPPING = {
    # Direct renames (is_approximated = False)
    "1988 Topps Autographs":                          ("1988 Topps Autograph",                          False),
    "1988 Topps Autographs Orange Refractor":         ("1988 Topps Autograph Orange Refractor",         False),
    "1988 Topps Autographs Red Refractor":            ("1988 Topps Autograph Red Refractor",            False),
    "Authentics Relics":                              ("Authentics",                                    False),
    "Authentics Relics Autograph":                    ("Authentics Autographs",                         False),
    "Authentics Relics Gold Refractor":               ("Authentics Gold Refractor",                     False),
    "Authentics Relics Green Refractor":              ("Authentics Green Refractor",                    False),
    "Authentics Relics Orange Refractor":             ("Authentics Orange Refractor",                   False),
    "Authentics Relics Red Refractor":                ("Authentics Red Refractor",                      False),
    "Exposé":                                         ("Expose",                                        False),
    "Exposé Red Refractor":                           ("Expose Red Refractor",                          False),
    "Exposé SuperFractor":                            ("Expose SuperFractor",                           False),
    "Future Stars Autographs":                        ("Future Stars Autograph",                        False),
    "Future Stars Autographs Orange Refractor":       ("Future Stars Autograph Orange Refractor",       False),
    "Future Stars Autographs Red Refractor":          ("Future Stars Autograph Red Refractor",          False),
    "Future Stars Autographs SuperFractor":           ("Future Stars Autograph SuperFractor",           False),
    "Rookie Autographs Black & White Mini Diamond":   ("Rookie Autographs Black & White Mini Diamond Refractor", False),
    "TacoFractor":                                    ("TacoFractors",                                  False),
    "Ultraviolet All-Stars Autographs":               ("Ultraviolet All-Stars Autograph",               False),
    "Ultraviolet All-Stars Autographs Orange Refractor": ("Ultraviolet All-Stars Autograph Orange Refractor", False),
    "Ultraviolet All-Stars Autographs Red Refractor": ("Ultraviolet All-Stars Autograph Red Refractor", False),
    # Approximated (is_approximated = True)
    "Future Stars Blue Refractor":                    ("Future Stars",                                  True),
    "Future Stars Rose Gold Refractor":               ("Future Stars",                                  True),
    "Future Stars Yellow Refractor":                  ("Future Stars",                                  True),
    "In Technicolor Rose Gold Refractor":             ("In Technicolor",                                True),
    "SP Variation":                                   ("Super Short Print",                             True),
    "SP Variation Gold Speckle Refractor":            ("Super Short Print",                             True),
    "SP Variation Green Speckle Refractor":           ("Super Short Print",                             True),
    "SP Variation Orange Speckle Refractor":          ("Super Short Print",                             True),
    "SP Variation Red Speckle Refractor":             ("Super Short Print",                             True),
    "SSP Variation":                                  ("Super Short Print",                             True),
    "Rookie Relics":                                  ("Authentics",                                    True),
    "Rookie Relics Gold Refractor":                   ("Authentics",                                    True),
    "Rookie Relics Orange Refractor":                 ("Authentics",                                    True),
    "Rookie Relics Red Refractor":                    ("Authentics",                                    True),
    "Rookie Relics SuperFractor":                     ("Authentics",                                    True),
    "Cyan Printing Plate":                            ("Printing Plates",                               True),
    "Yellow Printing Plate":                          ("Printing Plates",                               True),
}

NEW_CARD_COLUMNS = ["pull_rate_category", "pull_rate_is_approximated"]


# ── ODS helpers ────────────────────────────────────────────────────────────────

def read_sheet(sheet) -> tuple[list[str], list[dict]]:
    """Return (headers, rows-as-dicts) from an ODS Table."""
    all_rows = sheet.getElementsByType(TableRow)
    headers = [teletype.extractText(c) for c in all_rows[0].getElementsByType(TableCell)]
    data = []
    for row in all_rows[1:]:
        vals = [teletype.extractText(c) for c in row.getElementsByType(TableCell)]
        while len(vals) < len(headers):
            vals.append("")
        data.append(dict(zip(headers, vals)))
    return headers, data


def make_cell(value: str) -> TableCell:
    cell = TableCell()
    cell.setAttrNS(OFFICENS, "value-type", "string")
    p = P(text=str(value))
    cell.addElement(p)
    return cell


def write_sheet_to_ods(doc: OpenDocumentSpreadsheet, name: str, headers: list[str], rows: list[dict]):
    sheet = Table(name=name)
    doc.spreadsheet.addElement(sheet)
    hr = TableRow()
    for h in headers:
        hr.addElement(make_cell(h))
    sheet.addElement(hr)
    for row in rows:
        tr = TableRow()
        for h in headers:
            tr.addElement(make_cell(row.get(h, "")))
        sheet.addElement(tr)


def write_csv(path: Path, headers: list[str], rows: list[dict]):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if not ODS_PATH.exists():
        print(f"ERROR: ODS not found at {ODS_PATH}")
        sys.exit(1)

    print(f"Loading {ODS_PATH.name}...")
    doc = load_ods(str(ODS_PATH))

    cards_sheet = None
    pr_sheet = None
    for sheet in doc.spreadsheet.getElementsByType(Table):
        n = sheet.getAttribute("name")
        if n == "cards":
            cards_sheet = sheet
        elif n == "pull_rates":
            pr_sheet = sheet

    if not cards_sheet or not pr_sheet:
        print("ERROR: could not find 'cards' or 'pull_rates' tab")
        sys.exit(1)

    card_headers, card_rows = read_sheet(cards_sheet)
    pr_headers, pr_rows = read_sheet(pr_sheet)

    original_card_count = len(card_rows)
    print(f"  Cards: {original_card_count:,} rows")
    print(f"  Pull rates: {len(pr_rows):,} rows")

    # ── Step 1: Remove Logofractor rows ───────────────────────────────────────
    logo_rows   = [r for r in card_rows if "Logofractor" in r["variation_name"]]
    clean_rows  = [r for r in card_rows if "Logofractor" not in r["variation_name"]]
    print(f"\nStep 1 — Logofractor removal: {len(logo_rows):,} rows removed")
    write_csv(LOGO_REMOVED, card_headers, logo_rows)
    print(f"  Saved → {LOGO_REMOVED.name}")

    # ── Step 2: Remove other-product oddballs ─────────────────────────────────
    oddball_rows = [r for r in clean_rows if r["variation_name"] in ODDBALL_VARIATION_NAMES]
    clean_rows   = [r for r in clean_rows if r["variation_name"] not in ODDBALL_VARIATION_NAMES]
    print(f"\nStep 2 — Oddball removal: {len(oddball_rows)} rows removed")
    for r in oddball_rows:
        print(f"  {r['variation_name']!r}")
    write_csv(ODDBALL_REMOVED, card_headers, oddball_rows)
    print(f"  Saved → {ODDBALL_REMOVED.name}")

    remaining = len(clean_rows)
    expected  = original_card_count - len(logo_rows) - len(oddball_rows)
    print(f"\n  Cards remaining: {remaining:,}  (expected {expected:,})")
    assert remaining == expected, "Row count mismatch after removal!"

    # ── Step 3: Add pull_rate_category + pull_rate_is_approximated ────────────
    print("\nStep 3 — Adding pull_rate_category / pull_rate_is_approximated...")
    approx_count = 0
    unmapped = set()

    for row in clean_rows:
        vn = row["variation_name"]
        if vn in PULL_RATE_MAPPING:
            cat, is_approx = PULL_RATE_MAPPING[vn]
            row["pull_rate_category"]        = cat
            row["pull_rate_is_approximated"] = "TRUE" if is_approx else "FALSE"
            if is_approx:
                approx_count += 1
        else:
            # Default: pull_rate_category = variation_name, not approximated
            row["pull_rate_category"]        = vn
            row["pull_rate_is_approximated"] = "FALSE"

    new_card_headers = card_headers + NEW_CARD_COLUMNS
    print(f"  pull_rate_is_approximated = TRUE: {approx_count} rows")

    # Verify variation_name is byte-for-byte unchanged (spot-check first 5)
    card_headers_orig, card_rows_orig = read_sheet(cards_sheet)
    orig_vns  = [r["variation_name"] for r in card_rows_orig
                 if "Logofractor" not in r["variation_name"]
                 and r["variation_name"] not in ODDBALL_VARIATION_NAMES]
    clean_vns = [r["variation_name"] for r in clean_rows]
    assert orig_vns == clean_vns, "variation_name values changed — aborting!"
    print("  variation_name column: byte-for-byte unchanged ✓")

    # ── Step 4: Fill Super Short Print odds in pull_rates ─────────────────────
    print("\nStep 4 — Filling Super Short Print pull_rates rows...")

    # Build a lookup: box_set_slug → Gimmicks Tier 1 Orange Speckle Refractor odds
    gimm_key = "Gimmicks Tier 1 Orange Speckle Refractor"
    gimm_odds = {r["box_set_slug"]: r for r in pr_rows if r["category_name"] == gimm_key}

    ssp_rows_modified = 0
    for row in pr_rows:
        if row["category_name"] == "Super Short Print":
            slug = row["box_set_slug"]
            src = gimm_odds.get(slug)
            if src:
                row["odds_numerator"]   = src["odds_numerator"]
                row["odds_denominator"] = src["odds_denominator"]
                row["pull_probability"] = src["pull_probability"]
                row["odds_source"]      = "Cardboard Connection"
                row["_needs_review"]    = ""
                ssp_rows_modified += 1
                print(f"  {slug}: 1/{src['odds_denominator']} → {src['pull_probability']}")
            else:
                print(f"  WARNING: no Gimmicks source row found for {slug}")

    print(f"  {ssp_rows_modified} Super Short Print rows filled")

    # ── Step 5: Calculate Future Stars Autograph SuperFractor / hobby prob ────
    print("\nStep 5 — Future Stars Autograph SuperFractor / hobby pull_probability...")
    fs_key = "Future Stars Autograph SuperFractor"
    fs_hobby_slug = "2023-topps-chrome-baseball-hobby"
    filled = 0
    for row in pr_rows:
        if row["category_name"] == fs_key and row["box_set_slug"] == fs_hobby_slug:
            num   = float(row["odds_numerator"])
            denom = float(row["odds_denominator"])
            prob  = num / denom
            row["pull_probability"] = str(round(prob, 10))
            print(f"  {fs_hobby_slug}: {num}/{denom} = {row['pull_probability']}")
            filled += 1
    assert filled == 1, f"Expected exactly 1 row to fill, got {filled}"

    # ── Verify: every pull_rate_category (except Base) exists in pull_rates ──
    print("\nAudit — join coverage check...")
    pr_cats = {r["category_name"] for r in pr_rows}
    prc_in_cards = {r["pull_rate_category"] for r in clean_rows}
    mismatches = [c for c in prc_in_cards if c != "Base" and c not in pr_cats]
    if mismatches:
        print(f"  MISMATCHES ({len(mismatches)}):")
        for m in sorted(mismatches):
            count = sum(1 for r in clean_rows if r["pull_rate_category"] == m)
            print(f"    {m!r}  ({count} card rows)")
    else:
        print("  Zero mismatches — every pull_rate_category joins cleanly ✓")

    # ── Write outputs ──────────────────────────────────────────────────────────
    print("\nWriting outputs...")
    write_csv(CARDS_OUT, new_card_headers, clean_rows)
    write_csv(PR_OUT, pr_headers, pr_rows)
    print(f"  {CARDS_OUT.name}: {len(clean_rows):,} rows")
    print(f"  {PR_OUT.name}: {len(pr_rows):,} rows")

    # Update ODS in-place (rewrite both sheets)
    # Remove old sheets and replace
    to_remove = []
    for sheet in doc.spreadsheet.getElementsByType(Table):
        if sheet.getAttribute("name") in ("cards", "pull_rates"):
            to_remove.append(sheet)
    for sheet in to_remove:
        doc.spreadsheet.removeChild(sheet)

    write_sheet_to_ods(doc, "cards", new_card_headers, clean_rows)
    write_sheet_to_ods(doc, "pull_rates", pr_headers, pr_rows)
    doc.save(str(ODS_PATH))
    print(f"  ODS updated in-place: {ODS_PATH.name}")

    # ── Final audit summary ────────────────────────────────────────────────────
    print("\n" + "─" * 60)
    print("AUDIT CHECKLIST")
    print(f"  ✓ cards row count: {remaining:,}  (orig {original_card_count:,} - {len(logo_rows):,} logo - {len(oddball_rows)} oddballs)")
    print(f"  ✓ removed_logofractor_contamination.csv: {len(logo_rows):,} rows")
    print(f"  ✓ removed_other_product_oddballs.csv: {len(oddball_rows)} rows")
    print(f"  ✓ pull_rate_category + pull_rate_is_approximated columns added")
    print(f"  ✓ variation_name column unchanged")
    print(f"  ✓ pull_rate_is_approximated = TRUE: {approx_count} rows")
    print(f"  ✓ Super Short Print rows filled: {ssp_rows_modified}")
    print(f"  ✓ Future Stars Autograph SuperFractor / hobby pull_probability calculated")
    print(f"  ✓ pull_rates row count unchanged: {len(pr_rows):,}")
    print(f"  {'✓' if not mismatches else '✗'} Join coverage: {'zero mismatches' if not mismatches else f'{len(mismatches)} mismatches'}")
    print("─" * 60)


if __name__ == "__main__":
    main()
