/**
 * InsertSetsSection
 *
 * Groups all insert cards by set name and renders them as an expandable
 * accordion — one row per insert set. Expanding a set shows the unique
 * players in that set (parallels collapsed into the player name row).
 *
 * Props:
 *   cards — flat array of insert cards from the Inserts & Short Prints tier
 */

import { useState, useMemo } from 'react';
import './InsertSetsSection.css';

// Display order for insert sets (most recognizable first).
const SET_ORDER = [
  'TacoFractor',
  'Youthquake',
  'Future Stars',
  "Let's Go!",
  'Radiating Rookies',
  'Exposé',
  'In Technicolor',
  'Titans',
  '1988 Chrome',
  'Ultraviolet All-Stars',
  'Short Print',
  'MVP Refractor Buybacks',
];

function buildInsertGroups(cards) {
  const map = new Map();

  for (const card of cards) {
    const setName = card.category_name;
    if (!map.has(setName)) {
      map.set(setName, { name: setName, players: new Map(), parallels: new Set() });
    }
    const group = map.get(setName);

    // Track unique players by name — keep the base/lowest-parallel entry
    if (!group.players.has(card.player_name)) {
      group.players.set(card.player_name, card);
    }

    // Collect parallel names (anything that isn't the plain base card)
    const v = card.variation_name;
    if (v && v !== 'Base' && v !== 'Refractor') {
      group.parallels.add(v);
    }
  }

  // Sort groups by SET_ORDER, then alphabetically for any unknown sets
  return [...map.values()].sort((a, b) => {
    const ai = SET_ORDER.indexOf(a.name);
    const bi = SET_ORDER.indexOf(b.name);
    if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function InsertSetsSection({ cards }) {
  const [expandedSets, setExpandedSets] = useState(new Set());

  const groups = useMemo(() => buildInsertGroups(cards ?? []), [cards]);

  function toggleSet(name) {
    setExpandedSets((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  if (!groups.length) return null;

  return (
    <div className="insert-sets">
      {groups.map((group) => {
        const isOpen = expandedSets.has(group.name);
        const players = [...group.players.values()];
        const parallels = [...group.parallels];

        return (
          <div key={group.name} className="insert-sets__set">
            <button
              className="insert-sets__header"
              onClick={() => toggleSet(group.name)}
              aria-expanded={isOpen}
            >
              <span className="insert-sets__name">{group.name}</span>
              <span className="insert-sets__count">{players.length} players</span>
              <span
                className={`insert-sets__chevron${isOpen ? ' insert-sets__chevron--open' : ''}`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>

            {isOpen && (
              <div className="insert-sets__body">
                {parallels.length > 0 && (
                  <div className="insert-sets__parallels">
                    {parallels.slice(0, 8).map((p) => (
                      <span key={p} className="insert-sets__parallel-tag">{p}</span>
                    ))}
                    {parallels.length > 8 && (
                      <span className="insert-sets__parallel-tag insert-sets__parallel-tag--more">
                        +{parallels.length - 8} more
                      </span>
                    )}
                  </div>
                )}
                <div className="insert-sets__players">
                  {players.map((card) => (
                    <div key={card.id} className="insert-sets__player-row">
                      <span className="insert-sets__player-name">{card.player_name}</span>
                      <span className="insert-sets__card-number">#{card.card_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
