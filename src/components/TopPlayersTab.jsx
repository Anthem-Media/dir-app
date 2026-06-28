/**
 * TopPlayersTab
 *
 * Ranked list of the most sought-after players in this set.
 * Shows rank, name, team, position, and rookie status.
 *
 * Props:
 *   players — array from MOCK_TOP_CHASE_PLAYERS
 */

import './TopPlayersTab.css';

export function TopPlayersTab({ players }) {
  if (!players || players.length === 0) return null;

  return (
    <div className="top-players-tab">
      {players.slice(0, 10).map((player, index) => (
        <div key={player.id} className="top-players-tab__row">
          <span className="top-players-tab__rank">{index + 1}</span>
          <span className="top-players-tab__name">{player.name}</span>
          {player.isRookie && (
            <span className="top-players-tab__rc-badge" aria-label="Rookie Card">
              RC
            </span>
          )}
          <span className="top-players-tab__meta">
            {player.teamAbbr} · {player.position}
          </span>
        </div>
      ))}
    </div>
  );
}
