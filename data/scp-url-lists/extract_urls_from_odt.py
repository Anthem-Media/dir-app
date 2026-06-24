"""
Extract SportsCardsPro page URLs from ODT notes files, grouped by sport.

ODT files are ZIP archives containing content.xml. This script strips XML tags
to get plain text, then extracts well-formed sportscardspro.com URLs.

Usage:
    python3 extract_urls_from_odt.py

Input:  scripts/input/Raw ODT Files /  (relative to repo root)
Output: data/scp-url-lists/<sport>-raw-urls.txt  (one per sport, deduplicated)
"""

import os
import re
import sys
import zipfile
from collections import defaultdict
from pathlib import Path

# ── Paths ─────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
ODT_DIR = REPO_ROOT / "scripts" / "input" / "Raw ODT Files "
OUT_DIR = REPO_ROOT / "data" / "scp-url-lists"

# ── URL pattern ───────────────────────────────────────────────────────────────
# Matches full sportscardspro.com or pricecharting.com URLs.
# Stops at whitespace or common trailing punctuation so notes text doesn't bleed in.
URL_PATTERN = re.compile(
    r'https?://(?:www\.)?(?:sportscardspro\.com|pricecharting\.com)'
    r'[^\s<>"\')\]]*'
)

# Characters that can incorrectly attach to the end of a URL from surrounding notes
TRAILING_JUNK = re.compile(r'[.,;:!?\'")\]]+$')


def extract_text_from_odt(path: Path) -> str:
    """Return the plain-text content of an ODT file by stripping all XML tags."""
    with zipfile.ZipFile(path) as z:
        xml_bytes = z.read("content.xml")
    xml = xml_bytes.decode("utf-8", errors="replace")
    # Decode XML entities before stripping tags so &amp; → & doesn't leave noise
    xml = xml.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    text = re.sub(r"<[^>]+>", " ", xml)
    return re.sub(r"\s+", " ", text).strip()


def extract_urls(text: str) -> list[str]:
    """Return well-formed SportsCardsPro / PriceCharting URLs found in text."""
    raw = URL_PATTERN.findall(text)
    cleaned = []
    for url in raw:
        url = TRAILING_JUNK.sub("", url)
        if url:
            cleaned.append(url)
    return cleaned


def sport_from_filename(name: str) -> str | None:
    """Derive a lowercase sport key from the ODT filename, or None if unrecognised."""
    lower = name.lower()
    if "football" in lower:
        return "football"
    if "hockey" in lower:
        return "hockey"
    if "basketball" in lower:
        return "basketball"
    if "baseball" in lower:
        return "baseball"
    if "soccer" in lower:
        return "soccer"
    return None


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    if not ODT_DIR.is_dir():
        print(f"ERROR: ODT directory not found: {ODT_DIR}", file=sys.stderr)
        sys.exit(1)

    odt_files = sorted(ODT_DIR.glob("*.odt"))
    if not odt_files:
        print("ERROR: No .odt files found in input directory.", file=sys.stderr)
        sys.exit(1)

    # sport → {url, ...}  (set for deduplication)
    urls_by_sport: dict[str, set] = defaultdict(set)
    # sport → [filenames processed]
    files_by_sport: dict[str, list] = defaultdict(list)
    zero_url_files: list[str] = []

    # ── MENTAL-TEST: first file only, print first 5 URLs ──────────────────────
    first_file = odt_files[0]
    first_sport = sport_from_filename(first_file.name)
    first_text = extract_text_from_odt(first_file)
    first_urls = extract_urls(first_text)
    print(f"\n── Mental-test preview ({first_file.name}) ──")
    if first_urls:
        for u in first_urls[:5]:
            print(f"  {u}")
    else:
        print("  ⚠  No URLs found in first file — check extraction logic.")
    print()

    # ── Full extraction pass ───────────────────────────────────────────────────
    for odt_path in odt_files:
        sport = sport_from_filename(odt_path.name)
        if sport is None:
            print(f"⚠  UNRECOGNISED sport in filename, skipping: {odt_path.name}")
            continue

        text = extract_text_from_odt(odt_path)
        urls = extract_urls(text)

        if not urls:
            zero_url_files.append(odt_path.name)
        else:
            urls_by_sport[sport].update(urls)
            files_by_sport[sport].append(odt_path.name)

    # Flag files with zero URLs (don't fail, just warn)
    if zero_url_files:
        print("⚠  The following ODT files produced zero URLs (check content):")
        for f in zero_url_files:
            print(f"     {f}")
        print()

    # ── Write output files ─────────────────────────────────────────────────────
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print("── Extraction summary ────────────────────────────────────────────")
    total_files = len(odt_files)
    print(f"Total ODT files read: {total_files}")
    print()

    for sport in sorted(urls_by_sport):
        sorted_urls = sorted(urls_by_sport[sport])
        out_path = OUT_DIR / f"{sport}-raw-urls.txt"
        out_path.write_text("\n".join(sorted_urls) + "\n", encoding="utf-8")

        src_files = files_by_sport[sport]
        print(f"  {sport}:")
        print(f"    Source files : {len(src_files)}")
        for f in sorted(src_files):
            # Count per-file for the per-file breakdown
            text = extract_text_from_odt(ODT_DIR / f)
            file_urls = extract_urls(text)
            print(f"      {f}: {len(file_urls)} URLs")
        print(f"    Total unique : {len(sorted_urls)}")
        print(f"    Output       : {out_path.relative_to(REPO_ROOT)}")
        print()

    if not urls_by_sport:
        print("  ⚠  No URLs extracted from any file. Check ODT_DIR path and URL pattern.")

    print("── Done ──────────────────────────────────────────────────────────")


if __name__ == "__main__":
    main()
