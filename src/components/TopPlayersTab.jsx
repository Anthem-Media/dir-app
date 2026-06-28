/**
 * TopPlayersTab
 *
 * Grid of the most sought-after players in this set.
 * Shows name, team, position, rookie status, and base auto price.
 *
 * Props:
 *   players — array from MOCK_TOP_CHASE_PLAYERS
 */

import { formatCurrency } from '../utils/formatters';
import './TopPlayersTab.css';

export function TopPlayersTab({ players }) {
  if (!players || players.length === 0) return null;

  return (
    <div className="top-players-tab">
      {players.slice(0, 10).map((player) => (
        <div key={player.id} className="top-players-tab__card">
          <div className="top-players-tab__card-header">
            <span className="top-players-tab__name">{player.name}</span>
            {player.isRookie && (
              <span className="top-players-tab__rc-badge" aria-label="Rookie Card">
                RC
              </span>
            )}
          </div>
          <div className="top-players-tab__meta">
            {player.teamAbbr} · {player.position}
          </div>
          {player.baseAutoPrice != null && (
            <div className="top-players-tab__price">
              Base Auto · {formatCurrency(player.baseAutoPrice)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
