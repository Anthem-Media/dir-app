/**
 * granularPullRates.js
 *
 * Per-format pull rate data sourced from Baseballcardpedia insertion ratio tables
 * for 2023 Topps Chrome Baseball. Each key matches a format slug from FORMAT_ORDER.
 *
 * Used by TopPullsTab in BoxProfilePageV2 to show the 10 rarest named parallels
 * per format. More granular than the simplified pullRates in formatSwitcherData.js
 * (which summarizes by broad category for the Pull Rates grid).
 *
 * Source: 2023-topps-chrome-baseball_from_scp.ods, pull_rates sheet.
 * During database phase: replace with a real fetch from pull_rates table.
 */

export const GRANULAR_PULL_RATES = {
  hobby: [
    { category: 'Future Stars Autograph SuperFractor',           oddsNumerator: 1, oddsDenominator: 2472912, probability: 0.000000404, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars Autograph SuperFractor',  oddsNumerator: 1, oddsDenominator:  824304, probability: 0.000001,    source: 'Baseballcardpedia' },
    { category: '1988 Topps Autograph SuperFractor',             oddsNumerator: 1, oddsDenominator:  824304, probability: 0.000001,    source: 'Baseballcardpedia' },
    { category: 'Titans SuperFractor',                           oddsNumerator: 1, oddsDenominator:  824304, probability: 0.000001,    source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars SuperFractor',            oddsNumerator: 1, oddsDenominator:  494583, probability: 0.000002,    source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Printing Plates',        oddsNumerator: 1, oddsDenominator:  618228, probability: 0.000002,    source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Red Refractor',          oddsNumerator: 1, oddsDenominator:  494583, probability: 0.000002,    source: 'Baseballcardpedia' },
    { category: 'Future Stars SuperFractor',                     oddsNumerator: 1, oddsDenominator:  412152, probability: 0.000002,    source: 'Baseballcardpedia' },
    { category: 'Gimmicks Tier 1 SuperFractor',                  oddsNumerator: 1, oddsDenominator:  412152, probability: 0.000002,    source: 'Baseballcardpedia' },
    { category: 'In Technicolor Autographs SuperFractor',        oddsNumerator: 1, oddsDenominator:  618228, probability: 0.000002,    source: 'Baseballcardpedia' },
  ],
  jumbo: [
    { category: 'Future Stars Autograph SuperFractor',    oddsNumerator: 1, oddsDenominator: 317196, probability: 0.000003, source: 'Baseballcardpedia' },
    { category: 'Dual Rookie Autographs SuperFractor',    oddsNumerator: 1, oddsDenominator: 317196, probability: 0.000003, source: 'Baseballcardpedia' },
    { category: 'Titans SuperFractor',                    oddsNumerator: 1, oddsDenominator: 317196, probability: 0.000003, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars SuperFractor',     oddsNumerator: 1, oddsDenominator: 211464, probability: 0.000005, source: 'Baseballcardpedia' },
    { category: 'Future Stars SuperFractor',              oddsNumerator: 1, oddsDenominator: 211464, probability: 0.000005, source: 'Baseballcardpedia' },
    { category: 'Gimmicks Tier 1 SuperFractor',           oddsNumerator: 1, oddsDenominator: 211464, probability: 0.000005, source: 'Baseballcardpedia' },
    { category: "Let's Go! SuperFractor",                 oddsNumerator: 1, oddsDenominator: 211464, probability: 0.000005, source: 'Baseballcardpedia' },
    { category: '1988 Topps SuperFractor',                oddsNumerator: 1, oddsDenominator: 211464, probability: 0.000005, source: 'Baseballcardpedia' },
    { category: 'In Technicolor SuperFractor',            oddsNumerator: 1, oddsDenominator: 158598, probability: 0.000006, source: 'Baseballcardpedia' },
    { category: 'Expose SuperFractor',                    oddsNumerator: 1, oddsDenominator: 126879, probability: 0.000008, source: 'Baseballcardpedia' },
  ],
  blaster: [
    { category: 'Ultraviolet All-Stars SuperFractor',            oddsNumerator: 1, oddsDenominator:  980046, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'In Technicolor Autographs SuperFractor',        oddsNumerator: 1, oddsDenominator: 1960091, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Titans SuperFractor',                           oddsNumerator: 1, oddsDenominator: 1960091, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: '1988 Topps Autograph SuperFractor',             oddsNumerator: 1, oddsDenominator: 1960091, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: "Let's Go! SuperFractor",                        oddsNumerator: 1, oddsDenominator:  980046, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Red Refractor',          oddsNumerator: 1, oddsDenominator:  980046, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Printing Plates',        oddsNumerator: 1, oddsDenominator: 1960091, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Dual Rookie Autographs Red Refractor',          oddsNumerator: 1, oddsDenominator:  980046, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars Autograph SuperFractor',  oddsNumerator: 1, oddsDenominator: 1960091, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Gimmicks Tier 1 SuperFractor',                  oddsNumerator: 1, oddsDenominator:  653364, probability: 0.000002, source: 'Baseballcardpedia' },
  ],
  mega: [
    { category: 'In Technicolor Autographs SuperFractor',               oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars Autograph SuperFractor',          oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Titans SuperFractor',                                   oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: '1988 Topps Autograph SuperFractor',                     oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: "Let's Go! SuperFractor",                                oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars SuperFractor',                    oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Red Refractor',                  oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Future Stars Autograph Printing Plates',                oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Dual Rookie Autographs Red Refractor',                  oddsNumerator: 1, oddsDenominator: 956081, probability: 0.000001, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars Autograph Printing Plates',       oddsNumerator: 1, oddsDenominator: 478041, probability: 0.000002, source: 'Baseballcardpedia' },
  ],
  breaker: [
    { category: 'Future Stars Autograph Red Refractor',          oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'In Technicolor Autographs SuperFractor',        oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: "Let's Go! SuperFractor",                        oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: '1988 Topps Autograph SuperFractor',             oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'Radiating Rookies Autographs SuperFractor',     oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'Ultraviolet All-Stars SuperFractor',            oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'Expose SuperFractor',                           oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'Future Stars SuperFractor',                     oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: '1988 Topps SuperFractor',                       oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
    { category: 'Dual Rookie Autographs Red Refractor',          oddsNumerator: 1, oddsDenominator: 12014, probability: 0.000083, source: 'Baseballcardpedia' },
  ],
};
