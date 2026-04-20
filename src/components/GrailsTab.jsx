/**
 * GrailsTab
 *
 * Renders the list of grail cards in the Top Chases / Grails tab interface.
 * Grails are cards with print_run ≤ 10 — filtered upstream before reaching here.
 *
 * Purely presentational — no state, no filtering logic. Filtering happens in
 * BoxProfilePage before this component receives its data.
 *
 * @param {Array} cards - Grail card objects (already filtered to print_run ≤ 10)
 */

import { GrailCard } from './GrailCard';
import './GrailsTab.css';

export function GrailsTab({ cards }) {
  return (
    <div className="grails-tab">
      {cards.length === 0 ? (
        <p className="grails-tab__empty">No Grails in this set.</p>
      ) : (
        <>
          <div className="grails-tab__list">
            {cards.map((card) => (
              <GrailCard key={card.id} card={card} />
            ))}
          </div>
          {/* Important product context — grails are excluded from the EV/ROI figures
              shown in the hero section because their pull probability is effectively zero */}
          <p className="grails-tab__disclaimer">
            Grails are excluded from EV and ROI calculations.
          </p>
        </>
      )}
    </div>
  );
}
