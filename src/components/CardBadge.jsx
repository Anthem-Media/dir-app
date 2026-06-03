/**
 * CardBadge
 *
 * Renders pill badges for a checklist card based on its attributes.
 * Badges appear in priority order (highest rarity first).
 * A card with no matching conditions renders nothing (empty fragment).
 *
 * Badge priority order:
 *   1/1 → Grail → Case hit → Auto → Relic → RC →
 *   Refractor → Numbered → SP → In circulation → Pulled
 *
 * 1/1 and Grail are mutually exclusive:
 *   - print_run === 1   → 1/1 only
 *   - print_run 2–10    → Grail only
 *
 * Numbered badge only shows when print_run > 10 (not already shown as 1/1 or Grail).
 */

import {
  Crown,
  Lock,
  Flame,
  Pen,
  Shirt,
  Star,
  Sparkles,
  Hash,
  Layers,
  CircleDot,
  CheckCircle,
} from 'lucide-react';
import './CardBadge.css';

const ICON_SIZE = 11;

export function CardBadge({ card }) {
  // Support both real DB field names (category_name, is_autograph, etc.) and
  // the simplified mock data shape (category). The ?? fallback means this
  // component works with mock data today and real Supabase data later with no
  // second fix required.
  const cat = (card.category_name ?? card.category ?? '').toLowerCase();

  const printRun = card.print_run ?? null;
  const isCaseHit = card.is_case_hit ?? false;
  const isAuto    = card.is_autograph ?? cat.includes('auto');
  const isRelic   = card.is_relic ?? cat.includes('relic');
  const isRC      = card.rookie_card ?? cat.includes('rookie');
  const isRefractor = cat.includes('refractor');
  const isSP      = cat.includes('short print');
  const circulation = card.circulation_status ?? null;

  const badges = [];

  // 1/1 — supersedes Grail
  if (printRun === 1 || printRun === '1') {
    badges.push(
      <span key="1of1" className="card-badge card-badge--1of1">
        <Crown size={ICON_SIZE} />
        1/1
      </span>
    );
  } else if (printRun != null && printRun !== '' && Number(printRun) >= 2 && Number(printRun) <= 10) {
    // Grail (print run 2–10)
    badges.push(
      <span key="grail" className="card-badge card-badge--grail">
        <Lock size={ICON_SIZE} />
        Grail
      </span>
    );
  }

  // Case hit
  if (isCaseHit === true || isCaseHit === 'true') {
    badges.push(
      <span key="casehit" className="card-badge card-badge--casehit">
        <Flame size={ICON_SIZE} />
        Case hit
      </span>
    );
  }

  // Auto
  if (isAuto) {
    badges.push(
      <span key="auto" className="card-badge card-badge--auto">
        <Pen size={ICON_SIZE} />
        Auto
      </span>
    );
  }

  // Relic
  if (isRelic) {
    badges.push(
      <span key="relic" className="card-badge card-badge--relic">
        <Shirt size={ICON_SIZE} />
        Relic
      </span>
    );
  }

  // RC
  if (isRC) {
    badges.push(
      <span key="rc" className="card-badge card-badge--rc">
        <Star size={ICON_SIZE} />
        RC
      </span>
    );
  }

  // Refractor
  if (isRefractor) {
    badges.push(
      <span key="refractor" className="card-badge card-badge--refractor">
        <Sparkles size={ICON_SIZE} />
        Refractor
      </span>
    );
  }

  // Numbered (only when print_run > 10 — not already shown as 1/1 or Grail)
  const prNum = Number(printRun);
  if (printRun != null && printRun !== '' && !isNaN(prNum) && prNum > 10) {
    badges.push(
      <span key="numbered" className="card-badge card-badge--numbered">
        <Hash size={ICON_SIZE} />
        /{prNum}
      </span>
    );
  }

  // Short Print
  if (isSP) {
    badges.push(
      <span key="sp" className="card-badge card-badge--sp">
        <Layers size={ICON_SIZE} />
        SP
      </span>
    );
  }

  // In circulation
  if (circulation === 'in_circulation') {
    badges.push(
      <span key="incirc" className="card-badge card-badge--incirc">
        <CircleDot size={ICON_SIZE} />
        In circulation
      </span>
    );
  }

  // Pulled
  if (circulation === 'pulled_sold') {
    badges.push(
      <span key="pulled" className="card-badge card-badge--pulled">
        <CheckCircle size={ICON_SIZE} />
        Pulled
      </span>
    );
  }

  if (badges.length === 0) return null;

  return <div className="card-badge-row">{badges}</div>;
}
