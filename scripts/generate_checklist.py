"""
generate_checklist.py

Reads all 21 SCP pricing CSVs for 2023 Topps Chrome Baseball and generates
src/utils/checklistTiers2023ToppsChrome.js — a complete MOCK_CHECKLIST_TIERS
export for the checklist accordion on BoxProfilePage.

Run from the project root:
  python3 scripts/generate_checklist.py
"""

import pandas as pd
import glob, os, re, json

BASE_DIR = "data/2023 topps chrome baseball/2023 Topps Chrome Pricing Csv/"
OUTPUT_FILE = "src/utils/checklistTiers2023ToppsChrome.js"

# ── Print run mapping for known 2023 Topps Chrome parallels ─────────────────
PRINT_RUNS = {
    'Superfractor':             1,
    'Sub Zero FrozenFractor':   1,
    'Logofractor Rose Gold':    4,
    'Red':                      5,
    'Red Wave':                 5,
    'Red RayWave':              5,
    'Orange':                   25,
    'Orange Wave':              25,
    'Gold':                     50,
    'Gold Wave':                50,
    'Blue Sonar':               125,
    'Green':                    99,
    'Green Sonar':              99,
    'Green Wave':               99,
    'Blue':                     150,
    'Blue Wave':                150,
    'Purple':                   250,
    'Purple Sonar':             250,
    'Purple Speckle':           250,
    'Magenta':                  299,
    'Magenta Speckle':          299,
    'Yellow':                   299,
}

NUMBERED_VARIATIONS = set(PRINT_RUNS.keys())

# ── Insert set display names ─────────────────────────────────────────────────
INSERT_NAMES = {
    '2023_Topps_Chrome_1988':                       '1988 Chrome',
    '2023_Topps_Chrome_Expose':                     'Exposé',
    '2023_Topps_Chrome_Future_Stars':               'Future Stars',
    '2023_Topps_Chrome_Lets_Go':                    "Let's Go!",
    '2023_Topps_Chrome_MVP_Refractor_Buybacks':     'MVP Refractor Buybacks',
    '2023_Topps_Chrome_Radiating_Rookies':          'Radiating Rookies',
    '2023_Topps_Chrome_TacoFractor':                'TacoFractor',
    '2023_Topps_Chrome_Titans':                     'Titans',
    '2023_Topps_Chrome_Ultraviolet_All_Stars':      'Ultraviolet All-Stars',
    '2023_Topps_Chrome_Youthquake':                 'Youthquake',
    '2023_Topps_Chrome_in_Technicolor':             'In Technicolor',
    '2023_Topps_Chrome_Authentics_Relics':          'Authentics Relic',
    '2023_Topps_Chrome_Rookie_Relics':              'Rookie Relic',
    '2023_Topps_Chrome_Dual_Rookie_Autographs':     'Dual Rookie Auto',
}

# SP variation keywords in the main Chrome file → Inserts & Short Prints tier
SP_KEYWORDS = ['SP Variation', 'SP variation']


def parse_product_name(name):
    """Parse 'Player Name [Variation] #CARD-NUM' → (player, variation, card_number)."""
    # Card number: text after the last #
    card_num = re.search(r'#([A-Za-z0-9\-]+)\s*$', name)
    card_number = card_num.group(1) if card_num else ''

    # Variation: text inside [ ]
    var_match = re.search(r'\[([^\]]+)\]', name)
    variation = var_match.group(1) if var_match else None

    # Player: everything before [ or before # (if no variation)
    player = re.sub(r'\s*\[[^\]]*\]\s*', '', name)
    player = re.sub(r'\s*#[A-Za-z0-9\-]+\s*$', '', player).strip()

    return player, variation, card_number


def clean_price(val):
    if pd.isna(val):
        return None
    s = str(val).replace('$', '').replace(',', '').strip()
    try:
        return round(float(s), 2)
    except ValueError:
        return None


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def main():
    files = sorted(glob.glob(os.path.join(BASE_DIR, "*.csv")))
    if not files:
        print(f"ERROR: No CSV files found in {BASE_DIR}")
        return

    # Tier buckets: list of card dicts per tier
    tiers = {
        'base':          [],   # Base & Rookies
        'inserts':       [],   # Inserts & Short Prints
        'refractors':    [],   # Refractors
        'autographs':    [],   # Autographs
        'premium-hits':  [],   # Premium Hits (relics, rare numbered autos)
    }

    seen_ids = set()

    for filepath in files:
        fname = os.path.basename(filepath)
        key = fname.replace('.csv', '')
        df = pd.read_csv(filepath)

        is_auto  = 'Autograph' in key
        is_relic = 'Relic' in key or 'Authentics' in key
        is_dual  = 'Dual' in key

        # Determine insert set name (None for main Chrome and Rookie Autos)
        insert_name = None
        for k, v in INSERT_NAMES.items():
            if key == k or key == k + '_Autographs':
                if is_auto:
                    insert_name = v
                elif not is_auto:
                    insert_name = v
                break

        is_rookie_file = 'Rookie' in key and not is_dual
        is_main_chrome = key == '2023_Topps_Chrome'

        for _, row in df.iterrows():
            name = str(row.get('product-name', ''))
            player, variation, card_number = parse_product_name(name)
            if not player or not card_number:
                continue

            price = clean_price(row.get('loose-price'))
            print_run = PRINT_RUNS.get(variation)
            is_numbered = variation in NUMBERED_VARIATIONS

            # ── Detect SPs in main Chrome file
            is_sp = is_main_chrome and variation and any(kw in variation for kw in SP_KEYWORDS)

            # ── Determine category name
            if is_relic and is_auto:
                category = 'Auto Relic'
            elif is_relic:
                category = insert_name or 'Relic'
            elif is_auto:
                if insert_name:
                    category = f'{insert_name} Auto'
                elif is_dual:
                    category = 'Dual Rookie Auto'
                elif is_rookie_file:
                    category = 'Rookie Auto'
                else:
                    category = 'Auto'
            elif is_sp:
                category = 'Short Print'
            elif insert_name:
                category = insert_name
            elif variation is None or variation == 'Base':
                category = 'Base Rookie' if is_rookie_file else 'Base'
            elif is_numbered:
                category = 'Numbered Refractor'
            else:
                category = 'Refractor'

            # ── Build unique ID
            var_slug = slugify(variation or 'base')
            raw_id = f'{slugify(card_number)}-{var_slug}'
            # Namespace by file to avoid cross-set collisions
            if not is_main_chrome:
                raw_id = f'{slugify(key)}-{raw_id}'

            # Deduplicate
            uid = raw_id
            if uid in seen_ids:
                uid = f'{raw_id}-{len(seen_ids)}'
            seen_ids.add(uid)

            card = {
                'id':             uid,
                'card_number':    card_number,
                'player_name':    player,
                'variation_name': variation or 'Base',
                'print_run':      print_run,
                'category_name':  category,
                'current_value':  price,
                'is_autograph':   is_auto,
                'rookie_card':    is_rookie_file,
                'is_relic':       is_relic,
                'is_case_hit':    is_relic,
                'is_numbered':    is_numbered,
            }

            # ── Assign tier
            if is_relic:
                tiers['premium-hits'].append(card)
            elif is_auto:
                # Superfractors and 1-of-1 autos → premium-hits
                if print_run is not None and print_run <= 5:
                    tiers['premium-hits'].append(card)
                else:
                    tiers['autographs'].append(card)
            elif is_sp or insert_name:
                tiers['inserts'].append(card)
            elif variation is None or variation == 'Base':
                tiers['base'].append(card)
            else:
                tiers['refractors'].append(card)

    # ── Sort each tier by price descending (nulls last)
    for bucket in tiers.values():
        bucket.sort(key=lambda c: c['current_value'] or 0, reverse=True)

    # ── Compute average value per tier
    def avg_val(cards):
        priced = [c['current_value'] for c in cards if c['current_value']]
        return round(sum(priced) / len(priced), 2) if priced else 0

    tier_defs = [
        ('tier-5', 'Premium Hits',        'premium-hits'),
        ('tier-4', 'Autographs',          'autographs'),
        ('tier-3', 'Refractors',          'refractors'),
        ('tier-2', 'Inserts & Short Prints', 'inserts'),
        ('tier-1', 'Base & Rookies',      'base'),
    ]

    # ── Print summary
    print("=== CHECKLIST SUMMARY ===")
    total = 0
    for tier_id, label, key in tier_defs:
        n = len(tiers[key])
        total += n
        print(f"  {label:30s} {n:>6} cards")
    print(f"  {'TOTAL':30s} {total:>6} cards")
    print()

    # ── Generate JS output
    def card_to_js(c):
        def js_val(v):
            if v is None:
                return 'null'
            if isinstance(v, bool):
                return 'true' if v else 'false'
            if isinstance(v, (int, float)):
                return str(v)
            # Escape single quotes
            return "'" + str(v).replace("'", "\\'") + "'"

        fields = [
            f"id: {js_val(c['id'])}",
            f"card_number: {js_val(c['card_number'])}",
            f"player_name: {js_val(c['player_name'])}",
            f"variation_name: {js_val(c['variation_name'])}",
            f"print_run: {js_val(c['print_run'])}",
            f"category_name: {js_val(c['category_name'])}",
            f"current_value: {js_val(c['current_value'])}",
            f"is_autograph: {js_val(c['is_autograph'])}",
            f"rookie_card: {js_val(c['rookie_card'])}",
            f"is_relic: {js_val(c['is_relic'])}",
            f"is_case_hit: {js_val(c['is_case_hit'])}",
            f"is_numbered: {js_val(c['is_numbered'])}",
        ]
        return '    { ' + ', '.join(fields) + ' },'

    lines = [
        '/**',
        ' * checklistTiers2023ToppsChrome.js',
        ' *',
        ' * Auto-generated from SCP pricing CSVs by scripts/generate_checklist.py',
        ' * DO NOT EDIT BY HAND — re-run the script to regenerate.',
        ' *',
        f' * Total cards: {total}',
        ' */',
        '',
        'export const MOCK_CHECKLIST_TIERS = [',
    ]

    for tier_id, label, key in tier_defs:
        cards = tiers[key]
        lines.append('  {')
        lines.append(f"    id: '{tier_id}',")
        lines.append(f"    label: '{label}',")
        lines.append(f"    cardCount: {len(cards)},")
        lines.append(f"    avgValue: {avg_val(cards)},")
        lines.append('    cards: [')
        for c in cards:
            lines.append(card_to_js(c))
        lines.append('    ],')
        lines.append('  },')

    lines.append('];')
    lines.append('')

    output = '\n'.join(lines)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(output)

    print(f"Written to {OUTPUT_FILE} ({len(output):,} bytes)")


if __name__ == '__main__':
    main()
