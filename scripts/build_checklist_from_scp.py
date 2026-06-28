"""
build_checklist_from_scp.py

Builds a complete card checklist + pricing ODS directly from SCP CSVs.
No dependency on the old hand-entered seed spreadsheet for card rows.
Pull rates tab is copied from the existing seed spreadsheet.

Each CSV maps to a known tier, category, and insert type via CSV_CONFIG.
Rookie status is inferred: any player in a "rookie" CSV is flagged RC=TRUE
across ALL CSVs (so the same player's Base card in the main set gets flagged).

Output columns match the database schema exactly — ready for Supabase import.

Usage:
    python scripts/build_checklist_from_scp.py
"""

import csv
import re
import sys
from pathlib import Path

from odf.opendocument import load as load_ods, OpenDocumentSpreadsheet
from odf.table import Table, TableRow, TableCell
from odf.text import P
from odf import teletype
from odf.namespaces import OFFICENS


# ── Paths ──────────────────────────────────────────────────────────────────────

CSV_DIR = Path(
    "/Users/zachseabolt/Developer/Diamond in the rough Documents"
    "/Baseball/Baseball Seed Spreadsheet"
    "/2023 topps chrome baseball/2023 Topps Chrome Inserts Pricing"
)

SEED_PATH = Path(
    "/Users/zachseabolt/Developer/Diamond in the rough Documents"
    "/Baseball/Baseball Seed Spreadsheet"
    "/2023 topps chrome baseball/2023-topps-chrome-baseball_seed.ods"
)

OUTPUT_PATH = SEED_PATH.parent / "2023-topps-chrome-baseball_from_scp.ods"

BOX_SET_SLUG = "2023-topps-chrome-baseball"
VALUE_SOURCE = "sportscardspro"

OUTPUT_HEADERS = [
    "box_set_slug",
    "category_name",
    "card_number",
    "player_name",
    "rookie_card",
    "variation_name",
    "print_run",
    "is_numbered",
    "is_autograph",
    "is_relic",
    "is_case_hit",
    "insert_set_name",
    "circulation_status",
    "current_value",
    "value_source",
    "image_url",
    "notes",
    "_needs_review",
    "_source_notes",
]


# ── CSV → Metadata Config ──────────────────────────────────────────────────────
# Defines how rows from each CSV are categorized in the database.
#
# insert_set_name: None for main-set cards; the insert set name for inserts.
# is_autograph / is_relic: card attribute flags (True/False).
# all_rookies: True if every player in this CSV is a first-year rookie card.
# use_main_set_map: True only for the main base/refractor CSV.
# variation_prefix: base name prepended to the parallel descriptor to form
#   variation_name for non-main-set CSVs.

CSV_CONFIG = {
    "2023_Topps_Chrome.csv": {
        "insert_set_name": None,
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": True,
        "variation_prefix": None,
    },
    "2023_Topps_Chrome_Rookie_Autographs.csv": {
        "insert_set_name": None,
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Rookie Autographs",
    },
    "2023_Topps_Chrome_Dual_Rookie_Autographs.csv": {
        "insert_set_name": None,
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Dual Rookie Autographs",
    },
    "2023_Topps_Chrome_Rookie_Relics.csv": {
        "insert_set_name": None,
        "is_autograph": False,
        "is_relic": True,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Rookie Relics",
    },
    "2023_Topps_Chrome_Authentics_Relics.csv": {
        "insert_set_name": None,
        "is_autograph": False,
        "is_relic": True,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Authentics Relics",
    },
    "2023_Topps_Chrome_1988.csv": {
        "insert_set_name": "1988 Topps",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "1988 Topps",
    },
    "2023_Topps_Chrome_1988_Autographs.csv": {
        "insert_set_name": "1988 Topps Autographs",
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "1988 Topps Autographs",
    },
    "2023_Topps_Chrome_Expose.csv": {
        "insert_set_name": "Exposé",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Exposé",
    },
    "2023_Topps_Chrome_Future_Stars.csv": {
        "insert_set_name": "Future Stars",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Future Stars",
    },
    "2023_Topps_Chrome_Future_Stars_Autographs.csv": {
        "insert_set_name": "Future Stars Autographs",
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Future Stars Autographs",
    },
    "2023_Topps_Chrome_Lets_Go.csv": {
        "insert_set_name": "Let's Go!",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Let's Go!",
    },
    "2023_Topps_Chrome_MVP_Refractor_Buybacks.csv": {
        "insert_set_name": "MVP Refractor Buybacks",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "MVP Refractor Buyback",
    },
    "2023_Topps_Chrome_Radiating_Rookies.csv": {
        "insert_set_name": "Radiating Rookies",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Radiating Rookies",
    },
    "2023_Topps_Chrome_Radiating_Rookies_Autographs.csv": {
        "insert_set_name": "Radiating Rookies Autographs",
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "Radiating Rookies Autographs",
    },
    "2023_Topps_Chrome_TacoFractor.csv": {
        "insert_set_name": "TacoFractor",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "TacoFractor",
    },
    "2023_Topps_Chrome_Titans.csv": {
        "insert_set_name": "Titans",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Titans",
    },
    "2023_Topps_Chrome_Ultraviolet_All_Stars.csv": {
        "insert_set_name": "Ultraviolet All-Stars",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Ultraviolet All-Stars",
    },
    "2023_Topps_Chrome_Ultraviolet_All_Stars_Autographs.csv": {
        "insert_set_name": "Ultraviolet All-Stars Autographs",
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "Ultraviolet All-Stars Autographs",
    },
    "2023_Topps_Chrome_Youthquake.csv": {
        "insert_set_name": "YouthQuake",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": True,
        "use_main_set_map": False,
        "variation_prefix": "YouthQuake",
    },
    "2023_Topps_Chrome_in_Technicolor.csv": {
        "insert_set_name": "In Technicolor",
        "is_autograph": False,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "In Technicolor",
    },
    "2023_Topps_Chrome_in_Technicolor_Autographs.csv": {
        "insert_set_name": "In Technicolor Autographs",
        "is_autograph": True,
        "is_relic": False,
        "is_case_hit": False,
        "all_rookies": False,
        "use_main_set_map": False,
        "variation_prefix": "In Technicolor Autographs",
    },
}


# ── Main Set Parallel Map ──────────────────────────────────────────────────────
# Used only for 2023_Topps_Chrome.csv.
# Maps lowercase SCP bracket text → (canonical variation_name, print_run, is_numbered)
# Print runs are Hobby box defaults. Mark _needs_review=True if you want to verify.

MAIN_SET_PARALLEL_MAP = {
    "":                        ("Base",                          None, False),
    "refractor":               ("Refractor",                     None, False),
    "xfractor":                ("X-Fractor",                     None, False),
    "prism":                   ("Prism Refractor",               None, False),
    "pink":                    ("Pink Refractor",                 None, False),
    "sepia":                   ("Sepia Refractor",               None, False),
    "negative":                ("Negative Refractor",            None, False),
    "magenta":                 ("Magenta Refractor",             None, False),
    "purple speckle":          ("Purple Speckle Refractor",       299, True),
    "magenta speckle":         ("Magenta Speckle Refractor",       50, True),
    "purple sonar":            ("Purple Sonar Refractor",         199, True),
    "purple":                  ("Purple Refractor",               250, True),
    "aqua lava":               ("Aqua Lava Refractor",            25,  True),
    "aqua":                    ("Aqua Refractor",                 25,  True),
    "blue sonar":              ("Blue Sonar Refractor",           150, True),
    "blue wave":               ("Blue Wave Refractor",            75,  True),
    "blue":                    ("Blue Refractor",                 150, True),
    "green sonar":             ("Green Sonar Refractor",          75,  True),
    "green wave":              ("Green Wave Refractor",           99,  True),
    "green":                   ("Green Refractor",                99,  True),
    "gold wave":               ("Gold Wave Refractor",            50,  True),
    "gold":                    ("Gold Refractor",                 50,  True),
    "orange wave":             ("Orange Wave Refractor",          25,  True),
    "orange":                  ("Orange Refractor",               25,  True),
    "red wave":                ("Red Wave Refractor",             5,   True),
    "red":                     ("Red Refractor",                  5,   True),
    "sub-zero":                ("Sub-Zero FrozenFractor",        None, False),
    "sub zero frozenfractor":  ("Sub-Zero FrozenFractor",        None, False),  # SCP's actual bracket text
    "superfractor":            ("SuperFractor",                   1,   True),
    "cyan printing plate":     ("Cyan Printing Plate",            1,   True),
    "magenta printing plate":  ("Magenta Printing Plate",         1,   True),
    "yellow printing plate":   ("Yellow Printing Plate",          1,   True),
    "black printing plate":    ("Black Printing Plate",           1,   True),
    # Logofractor — both word orders appear in SCP data; yellow variant confirmed in data
    "logofractor":             ("Logofractor",                   None, False),
    "blue logofractor":        ("Blue Logofractor",              None, False),
    "logofractor blue":        ("Blue Logofractor",              None, False),
    "gold logofractor":        ("Gold Logofractor",              None, False),
    "logofractor gold":        ("Gold Logofractor",              None, False),
    "green logofractor":       ("Green Logofractor",             None, False),
    "logofractor green":       ("Green Logofractor",             None, False),
    "orange logofractor":      ("Orange Logofractor",            None, False),
    "logofractor orange":      ("Orange Logofractor",            None, False),
    "pink logofractor":        ("Pink Logofractor",              None, False),
    "logofractor pink":        ("Pink Logofractor",              None, False),
    "purple logofractor":      ("Purple Logofractor",            None, False),
    "logofractor purple":      ("Purple Logofractor",            None, False),
    "red logofractor":         ("Red Logofractor",               None, False),
    "logofractor red":         ("Red Logofractor",               None, False),
    "rose gold logofractor":   ("Rose Gold Logofractor",         None, False),
    "logofractor rose gold":   ("Rose Gold Logofractor",         None, False),
    "yellow logofractor":      ("Yellow Logofractor",            None, False),
    "logofractor yellow":      ("Yellow Logofractor",            None, False),
    # SP Variations — short print base card variants with colored borders/speckles
    "sp variation":                     ("SP Variation",                        None, False),
    "sp variation gold speckle":        ("SP Variation Gold Speckle Refractor", None, False),
    "sp variation green speckle":       ("SP Variation Green Speckle Refractor",None, False),
    "sp variation orange speckle":      ("SP Variation Orange Speckle Refractor",None,False),
    "sp variation red speckle":         ("SP Variation Red Speckle Refractor",  None, False),
    # Gimmicks — base-card SP variations
    "gimmicks tier 1":                         ("Gimmicks Tier 1",                          None, False),
    "gimmicks tier 1 green speckle refractor":  ("Gimmicks Tier 1 Green Speckle Refractor",  None, False),
    "gimmicks tier 1 gold speckle refractor":   ("Gimmicks Tier 1 Gold Speckle Refractor",   None, False),
    "gimmicks tier 1 orange speckle refractor": ("Gimmicks Tier 1 Orange Speckle Refractor", None, False),
    "gimmicks tier 1 red speckle refractor":    ("Gimmicks Tier 1 Red Speckle Refractor",    None, False),
    "gimmicks tier 1 superfractor":             ("Gimmicks Tier 1 SuperFractor",             1,    True),
    # Logofractor auto/SP hybrids — is_autograph will be False (config-level), mark _needs_review
    # These are correctly captured but the is_autograph flag needs a manual pass
    "logofractor gimmick autograph":            ("Logofractor Gimmick Autograph",            None, False),
    "logofractor sp variation autograph":       ("Logofractor SP Variation Autograph",       None, False),
    "logofractor rose gold gimmicks variation": ("Rose Gold Logofractor Gimmicks Variation", None, False),
    "superfractor logofractor":                 ("SuperFractor Logofractor",                 1,    True),
}


# ── Generic Parallel Map ───────────────────────────────────────────────────────
# For all non-main-set CSVs.
# Maps lowercase SCP bracket text → (variation_suffix, print_run, is_numbered)
# variation_name = "{variation_prefix} {variation_suffix}".strip()

GENERIC_PARALLEL_MAP = {
    "":                        ("",                              None, False),
    "refractor":               ("Refractor",                     None, False),
    "xfractor":                ("X-Fractor",                     None, False),
    "prism":                   ("Prism Refractor",               None, False),
    "pink":                    ("Pink Refractor",                 None, False),
    "sepia":                   ("Sepia Refractor",               None, False),
    "negative":                ("Negative Refractor",            None, False),
    "magenta":                 ("Magenta Refractor",             None, False),
    "purple speckle":          ("Purple Speckle Refractor",       299, True),
    "magenta speckle":         ("Magenta Speckle Refractor",       50, True),
    "purple sonar":            ("Purple Sonar Refractor",         199, True),
    "purple":                  ("Purple Refractor",               250, True),
    "aqua lava":               ("Aqua Lava Refractor",            25,  True),
    "aqua wave":               ("Aqua Wave Refractor",            25,  True),
    "aqua":                    ("Aqua Refractor",                 25,  True),
    "blue sonar":              ("Blue Sonar Refractor",           150, True),
    "blue raywave":            ("Blue RayWave Refractor",         150, True),
    "blue wave":               ("Blue Wave Refractor",            75,  True),
    "blue":                    ("Blue Refractor",                 150, True),
    "green sonar":             ("Green Sonar Refractor",          75,  True),
    "green wave":              ("Green Wave Refractor",           99,  True),
    "green":                   ("Green Refractor",                99,  True),
    "gold wave":               ("Gold Wave Refractor",            50,  True),
    "gold":                    ("Gold Refractor",                 50,  True),
    "orange wave":             ("Orange Wave Refractor",          25,  True),
    "orange":                  ("Orange Refractor",               25,  True),
    "red wave":                ("Red Wave Refractor",             5,   True),
    "red":                     ("Red Refractor",                  5,   True),
    "sub-zero":                ("Sub-Zero FrozenFractor",        None, False),
    "sub zero frozenfractor":  ("Sub-Zero FrozenFractor",        None, False),
    "superfractor":            ("SuperFractor",                   1,   True),
    "cyan printing plate":     ("Cyan Printing Plate",            1,   True),
    "magenta printing plate":  ("Magenta Printing Plate",         1,   True),
    "yellow printing plate":   ("Yellow Printing Plate",          1,   True),
    "black printing plate":    ("Black Printing Plate",           1,   True),
    # Color-only parallels that appear on inserts (no "Refractor" in SCP text)
    "yellow":                  ("Yellow Refractor",              None, False),
    "rose gold":               ("Rose Gold Refractor",           None, False),
    # Logofractor — all colors + base; both word orders
    "logofractor":             ("Logofractor",                   None, False),
    "blue logofractor":        ("Blue Logofractor",              None, False),
    "logofractor blue":        ("Blue Logofractor",              None, False),
    "gold logofractor":        ("Gold Logofractor",              None, False),
    "logofractor gold":        ("Gold Logofractor",              None, False),
    "green logofractor":       ("Green Logofractor",             None, False),
    "logofractor green":       ("Green Logofractor",             None, False),
    "orange logofractor":      ("Orange Logofractor",            None, False),
    "logofractor orange":      ("Orange Logofractor",            None, False),
    "pink logofractor":        ("Pink Logofractor",              None, False),
    "logofractor pink":        ("Pink Logofractor",              None, False),
    "purple logofractor":      ("Purple Logofractor",            None, False),
    "logofractor purple":      ("Purple Logofractor",            None, False),
    "red logofractor":         ("Red Logofractor",               None, False),
    "logofractor red":         ("Red Logofractor",               None, False),
    "rose gold logofractor":   ("Rose Gold Logofractor",         None, False),
    "logofractor rose gold":   ("Rose Gold Logofractor",         None, False),
    "yellow logofractor":      ("Yellow Logofractor",            None, False),
    "logofractor yellow":      ("Yellow Logofractor",            None, False),
    # Rookie Auto specials
    "black & white mini diamond": ("Black & White Mini Diamond", None, False),
    # Auto relic variant (Authentics Relics CSV; is_autograph stays False at config level)
    "autograph":               ("Autograph",                     None, False),
    # SuperFractor Logofractor hybrid (1/1)
    "superfractor logofractor":("SuperFractor Logofractor",      1,    True),
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def parse_product_name(product_name: str):
    """Split 'Player Name [Parallel] #CardNumber' into its three parts."""
    match = re.search(r"#([^\s]+)\s*$", product_name)
    if not match:
        return None, None, None
    card_number = match.group(1).strip()
    before_number = product_name[:match.start()].strip()
    bracket_match = re.search(r"\[([^\]]+)\]", before_number)
    if bracket_match:
        parallel_text = bracket_match.group(1).strip()
        player_name = before_number[:bracket_match.start()].strip()
    else:
        parallel_text = ""
        player_name = before_number.strip()
    return player_name, parallel_text, card_number


def parse_price(price_str: str):
    """'$2.05' → 2.05. Returns None if blank or zero."""
    if not price_str:
        return None
    cleaned = price_str.replace("$", "").replace(",", "").strip()
    try:
        val = float(cleaned)
        return val if val > 0 else None
    except ValueError:
        return None


def normalize_name(name: str) -> str:
    return re.sub(r"\s+", " ", name.strip().lower())


def determine_category(config: dict, parallel_lower: str, is_numbered: bool, rookie_card: bool) -> str:
    """Map CSV config + card attributes to a category_name."""
    is_insert = bool(config["insert_set_name"])
    is_auto = config["is_autograph"]
    is_relic = config["is_relic"]

    if is_insert:
        if is_auto:
            return "Insert Auto"
        if is_relic:
            return "Insert Relic"
        return "Insert"

    if is_relic:
        if is_auto:
            return "Auto Relic"
        return "Relic"

    if is_auto:
        if is_numbered:
            return "Numbered Autograph"
        return "Base Auto"

    # Main set (use_main_set_map = True)
    if parallel_lower == "":
        return "Base"
    if parallel_lower.startswith("gimmicks"):
        return "Base"  # Gimmicks are base card SP variants
    if is_numbered:
        return "Numbered Rookie Refractor" if rookie_card else "Numbered"
    return "Refractor"


# ── Pass 1: Collect all rookie players ────────────────────────────────────────

def collect_rookie_players(csv_files: list[Path]) -> set[str]:
    """
    Return a set of normalized player names that are rookies,
    sourced from any CSV with all_rookies=True.
    """
    rookie_players = set()
    for csv_path in csv_files:
        config = CSV_CONFIG.get(csv_path.name)
        if not config or not config["all_rookies"]:
            continue
        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            for row in csv.DictReader(f):
                product_name = row.get("product-name", "").strip()
                if not product_name:
                    continue
                player_name, _, _ = parse_product_name(product_name)
                if player_name:
                    # Dual auto cards have comma-separated names — flag both
                    for name in re.split(r",\s*", player_name):
                        rookie_players.add(normalize_name(name.strip()))
    return rookie_players


# ── Pass 2: Build card rows ────────────────────────────────────────────────────

def build_card_rows(csv_files: list[Path], rookie_players: set[str]) -> list[dict]:
    all_rows = []
    # Track (csv_name, card_number, variation_name) to deduplicate within a CSV
    # (SCP sometimes lists both [Logofractor Blue] and [Blue Logofractor] for the same card)
    seen = set()

    for csv_path in sorted(csv_files):
        config = CSV_CONFIG.get(csv_path.name)
        if config is None:
            print(f"  WARNING: no config for {csv_path.name} — skipping")
            continue

        use_main = config["use_main_set_map"]
        variation_prefix = config["variation_prefix"] or ""
        insert_set_name = config["insert_set_name"] or ""
        file_rows = 0
        file_skipped = 0

        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            for scp_row in csv.DictReader(f):
                product_name = scp_row.get("product-name", "").strip()
                if not product_name:
                    continue

                player_name, parallel_text, card_number = parse_product_name(product_name)
                if not player_name or not card_number:
                    continue

                parallel_lower = parallel_text.strip().lower()

                # Resolve variation_name, print_run, is_numbered
                if use_main:
                    entry = MAIN_SET_PARALLEL_MAP.get(parallel_lower)
                else:
                    entry = GENERIC_PARALLEL_MAP.get(parallel_lower)

                if entry is None:
                    # Unknown parallel — keep it with raw SCP text as variation_name
                    suffix = parallel_text if parallel_text else ""
                    variation_name = (f"{variation_prefix} {suffix}").strip() if variation_prefix else suffix
                    print_run = None
                    is_numbered = False
                    _needs_review = True
                else:
                    suffix_or_full, print_run, is_numbered = entry
                    if use_main:
                        variation_name = suffix_or_full
                    else:
                        variation_name = (f"{variation_prefix} {suffix_or_full}").strip()
                    _needs_review = False

                # Deduplicate: same physical card listed twice in SCP under different bracket names
                dedup_key = (csv_path.name, card_number, normalize_name(player_name), variation_name.lower())
                if dedup_key in seen:
                    file_skipped += 1
                    continue
                seen.add(dedup_key)

                # Rookie flag: all_rookies config OR player is in the rookie set
                # For dual autos, check each name in the comma-separated field
                player_names = [p.strip() for p in re.split(r",\s*", player_name)]
                is_rookie = config["all_rookies"] or any(
                    normalize_name(n) in rookie_players for n in player_names
                )

                category = determine_category(config, parallel_lower, is_numbered, is_rookie)

                # /1 cards that haven't been pulled get Unknown; everything else is blank
                circulation_status = "Unknown" if print_run == 1 else ""

                price = parse_price(scp_row.get("loose-price", ""))

                all_rows.append({
                    "box_set_slug":    BOX_SET_SLUG,
                    "category_name":   category,
                    "card_number":     card_number,
                    "player_name":     player_name,
                    "rookie_card":     "TRUE" if is_rookie else "FALSE",
                    "variation_name":  variation_name,
                    "print_run":       str(print_run) if print_run is not None else "",
                    "is_numbered":     "TRUE" if is_numbered else "FALSE",
                    "is_autograph":    "TRUE" if config["is_autograph"] else "FALSE",
                    "is_relic":        "TRUE" if config["is_relic"] else "FALSE",
                    "is_case_hit":     "TRUE" if config["is_case_hit"] else "FALSE",
                    "insert_set_name": insert_set_name,
                    "circulation_status": circulation_status,
                    "current_value":   f"{price:.2f}" if price is not None else "",
                    "value_source":    VALUE_SOURCE if price is not None else "",
                    "image_url":       "",
                    "notes":           "",
                    "_needs_review":   "TRUE" if _needs_review else "FALSE",
                    "_source_notes":   csv_path.name,
                })
                file_rows += 1

        print(f"  {csv_path.name}: {file_rows} rows  ({file_skipped} deduped)")

    return all_rows


# ── ODS writing ────────────────────────────────────────────────────────────────

def make_cell(value: str) -> TableCell:
    cell = TableCell()
    cell.setAttrNS(OFFICENS, "value-type", "string")
    p = P(text=str(value))
    cell.addElement(p)
    return cell


def write_cards_sheet(doc: OpenDocumentSpreadsheet, rows: list[dict]):
    sheet = Table(name="cards")
    doc.spreadsheet.addElement(sheet)

    # Header row
    header_row = TableRow()
    for col in OUTPUT_HEADERS:
        header_row.addElement(make_cell(col))
    sheet.addElement(header_row)

    # Data rows
    for row in rows:
        tr = TableRow()
        for col in OUTPUT_HEADERS:
            tr.addElement(make_cell(row.get(col, "")))
        sheet.addElement(tr)


def copy_pull_rates_sheet(source_doc, dest_doc):
    """Copy the pull_rates tab from the existing seed ODS into the new file."""
    for sheet in source_doc.spreadsheet.getElementsByType(Table):
        if sheet.getAttribute("name") == "pull_rates":
            # Clone by re-reading all rows and writing fresh cells
            new_sheet = Table(name="pull_rates")
            dest_doc.spreadsheet.addElement(new_sheet)
            all_rows = sheet.getElementsByType(TableRow)
            for src_row in all_rows:
                new_row = TableRow()
                for cell in src_row.getElementsByType(TableCell):
                    val = teletype.extractText(cell)
                    new_row.addElement(make_cell(val))
                new_sheet.addElement(new_row)
            print(f"  pull_rates tab copied ({len(all_rows)} rows)")
            return
    print("  WARNING: pull_rates tab not found in seed spreadsheet")


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    if not CSV_DIR.exists():
        print(f"ERROR: CSV directory not found:\n  {CSV_DIR}")
        sys.exit(1)

    csv_files = sorted(CSV_DIR.glob("*.csv"))
    if not csv_files:
        print(f"ERROR: no CSV files found in {CSV_DIR}")
        sys.exit(1)

    print(f"Found {len(csv_files)} CSV files\n")

    print("Pass 1 — collecting rookie players...")
    rookie_players = collect_rookie_players(csv_files)
    print(f"  {len(rookie_players)} unique rookie players identified\n")

    print("Pass 2 — building card rows...")
    rows = build_card_rows(csv_files, rookie_players)

    print(f"\nTotal card rows: {len(rows):,}")

    print("\nBuilding ODS...")
    doc = OpenDocumentSpreadsheet()
    write_cards_sheet(doc, rows)

    if SEED_PATH.exists():
        print("Copying pull_rates tab from existing seed...")
        seed_doc = load_ods(str(SEED_PATH))
        copy_pull_rates_sheet(seed_doc, doc)
    else:
        print(f"  WARNING: seed not found at {SEED_PATH} — pull_rates tab skipped")

    doc.save(str(OUTPUT_PATH))

    print(f"\nSaved: {OUTPUT_PATH.name}")
    print(f"Location: {OUTPUT_PATH.parent}")

    # Summary by category
    from collections import Counter
    cats = Counter(r["category_name"] for r in rows)
    inserts = Counter(r["insert_set_name"] for r in rows if r["insert_set_name"])
    rookies = sum(1 for r in rows if r["rookie_card"] == "TRUE")
    priced = sum(1 for r in rows if r["current_value"])

    print("\n── Category breakdown ──────────────────────────────────────")
    for cat, count in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"  {count:5d}  {cat}")
    print(f"\n── Insert sets ─────────────────────────────────────────────")
    for name, count in sorted(inserts.items(), key=lambda x: -x[1]):
        print(f"  {count:5d}  {name}")
    print(f"\n── Totals ──────────────────────────────────────────────────")
    print(f"  Total rows:    {len(rows):,}")
    print(f"  Rookie rows:   {rookies:,}")
    print(f"  Priced rows:   {priced:,}  ({priced/len(rows)*100:.1f}%)")
    needs_review = sum(1 for r in rows if r["_needs_review"] == "TRUE")
    if needs_review:
        print(f"  Needs review:  {needs_review:,}  (unknown parallels — check variation_name)")


if __name__ == "__main__":
    main()
