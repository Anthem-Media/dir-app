# THEME.md

Complete color and theming reference for the Ripper (working name DIR) codebase. Every color the app renders comes from one of two places:

1. A CSS variable defined in `src/index.css` (the only valid source for component colors)
2. One of two documented hardcoded-hex exceptions in Recharts components (because Recharts passes values directly to SVG attributes, where `var(--color-x)` does not work)

If you ever need to change the look of the app, this file tells you everything you need to touch.

---

## CSS Variables (src/index.css)

All variables live in a single `:root` block at the top of `src/index.css`. They are grouped by role. The table below preserves the same grouping.

### Brand colors

| Variable | Current Value | Role |
|---|---|---|
| `--color-green` | `#ef4444` | Legacy alias for `--color-accent`. All non-financial "green" usage in the codebase resolves to purple via this variable. |
| `--color-red` | `#dc2626` | Error text color (form validation messages, error banners, destructive states). |

### Financial sentiment

| Variable | Current Value | Role |
|---|---|---|
| `--color-positive` | `#16a34a` | Positive ROI, positive EV, upward price movement. Intentionally green — must not be retargeted to the accent purple, because the semantic meaning ("up is green, down is red") is universal in finance. |

### Text

| Variable | Current Value | Role |
|---|---|---|
| `--color-text-primary` | `#f0f0f0` | Headings, body copy, primary readable text. |
| `--color-text-secondary` | `#777777` | Subtitles, captions, chart axis labels, de-emphasized supporting text. |
| `--color-text-muted` | `#9ca3af` | Placeholder copy, helper text, lowest-emphasis labels. |

### Backgrounds

| Variable | Current Value | Role |
|---|---|---|
| `--color-background-primary` | `#111214` | Page-level background (body, full-bleed sections). |
| `--color-background-secondary` | `#1e1f24` | Cards, panels, elevated surfaces. |
| `--color-background-tertiary` | `#18191d` | Inset areas, hero sections, input wells, image placeholders. |
| `--color-bg` | `#111214` | Legacy alias for `--color-background-primary`. Kept for compatibility with older component CSS that already references it. |
| `--color-bg-subtle` | `#18191d` | Legacy alias for `--color-background-tertiary`. Same compatibility reason. |

### Surface aliases (semantic shortcuts)

These are `var()`-of-`var()` aliases — semantic names that resolve to existing background tokens. Editing the underlying background variable propagates here automatically.

| Variable | Current Value | Role |
|---|---|---|
| `--color-surface` | `var(--color-background-secondary)` → `#1e1f24` | Card and panel backgrounds (semantic name). |
| `--color-surface-alt` | `var(--color-background-tertiary)` → `#18191d` | Image placeholders, inset areas (semantic name). |
| `--color-surface-hover` | `var(--color-background-tertiary)` → `#18191d` | Hover state for list items and selectable rows. |

### Accent

| Variable | Current Value | Role |
|---|---|---|
| `--color-accent` | `#ef4444` | Primary interactive color — buttons, links, focus rings, active tabs. The signature Ripper purple. |
| `--color-accent-bg` | `#2d0f0f` | Tinted accent background for badges, highlights, and "active" pill states. |
| `--color-accent-text` | `#fca5a5` | Lighter accent shade for text on dark surfaces (better contrast than the base accent on `--color-background-secondary`). |

### Accent hover state

| Variable | Current Value | Role |
|---|---|---|
| `--color-green-dark` | `#c0392b` | Hover state for buttons and links that use `--color-accent` / `--color-green`. Slightly darker purple. Name is a legacy artifact from when the accent was green. |

### Borders

| Variable | Current Value | Role |
|---|---|---|
| `--color-border` | `#2a2a2e` | Default border for cards, panels, table rows, inputs. |
| `--color-border-subtle` | `#1e1f24` | Almost-invisible dividers — matches the secondary background, so the border reads as a hairline edge rather than a line. |
| `--color-border-strong` | `#3a3a3f` | Emphasized borders — focused inputs, selected card outlines. |

### Nav bar

| Variable | Current Value | Role |
|---|---|---|
| `--color-nav-bg` | `#18191d` | Header / nav strip background. |
| `--color-nav-text` | `#f0f0f0` | Nav link text color. |
| `--color-nav-hover` | `rgba(255, 255, 255, 0.08)` | Hover background for nav links — a translucent white wash that works over any nav color. |
| `--color-nav-active` | `rgba(124, 111, 255, 0.20)` | Active/selected nav link background — a translucent wash of the accent purple (`#7c6fff`). The RGB triplet `124, 111, 255` literally encodes the accent color. |

### Badge / tag tints

| Variable | Current Value | Role |
|---|---|---|
| `--color-green-bg` | `#2d0f0f` | Accent background tint for badges (RC tags, "New Release", etc.). Aliases `--color-accent-bg` by value. |
| `--color-green-border` | `#ef4444` | Accent border/text on dark surfaces for badges. Aliases `--color-accent` by value. |
| `--color-red-bg` | `#450a0a` | Error banner background (form validation, error states). Deep red tint. |
| `--color-red-border` | `#7f1d1d` | Error banner border. |
| `--color-success` | `#16a34a` | Success banner text (e.g. "Password reset successful" on SignInPage). Mirrors `--color-positive`. |
| `--color-success-bg` | `#052e16` | Success banner background. Deep green tint. |
| `--color-success-border` | `#14532d` | Success banner border. |

---

## Hardcoded Hex Exceptions

Only two files in the codebase contain hardcoded hex values. Both are Recharts chart components, both pass their colors directly to SVG attributes (Recharts does not accept `var(--color-x)` strings for `stroke`, `fill`, etc.). Each hardcoded value is annotated in-file with the CSS variable it shadows, so when the variable changes the hex must change in lockstep.

### `src/components/TierPriceTrendChart.jsx`

```js
const CHART_COLORS = {
  line:     '#16a34a', // --color-positive
  gradient: '#16a34a', // --color-positive
  grid:     '#2a2a2e', // --color-border
  axis:     '#777777', // --color-text-secondary
  cursor:   '#2a2a2e', // --color-border
};
```

### `src/components/PriceTrendChart.jsx`

```js
const CHART_COLORS = {
  line:     '#16a34a', // --color-positive
  gradient: '#16a34a', // --color-positive
  grid:     '#2a2a2e', // --color-border
  axis:     '#777777', // --color-text-secondary
  cursor:   '#2a2a2e', // --color-border
};
```

**Why the exception exists:** Recharts renders the chart with SVG elements like `<path stroke="...">` and `<line stroke="...">`. SVG presentation attributes do not resolve CSS custom properties — `stroke="var(--color-positive)"` is invalid SVG and the browser ignores it. The only way to color a Recharts chart from a token system is to pass the resolved hex value at the JS level.

**Maintenance rule:** If you change `--color-positive`, `--color-border`, or `--color-text-secondary` in `index.css`, update the matching hex in **both** chart files. The comments next to each hex tell you which variable to keep in sync with. There are no other hardcoded hex values anywhere in `src/`.

---

## How to Retheme

The whole codebase reads from `:root` in `src/index.css`. Editing that one block recolors the entire app (with the two chart-component exceptions noted above). Below are the most common retheme operations.

### Change the accent color (e.g. purple → blue)

The "Ripper purple" `#7c6fff` is used by name in several variables for legacy reasons (the accent used to be green). To change it cleanly, update all of these together:

1. `--color-accent` (line ~37 in index.css) — the canonical accent value.
2. `--color-green` (line ~12) — alias of `--color-accent`. Set to the same new value.
3. `--color-green-border` (line ~57) — alias of `--color-accent`. Set to the same new value.
4. `--color-accent-bg` (line ~38) — tinted background derived from the accent. Pick a deep, low-saturation version of the new accent (e.g. if accent is `#3b82f6`, use a navy like `#1e2a55`).
5. `--color-accent-text` (line ~39) — lighter shade of the accent for text on dark surfaces. Pick a brighter, slightly desaturated version (e.g. for `#3b82f6`, use `#7aaaff`).
6. `--color-green-bg` (line ~56) — alias of `--color-accent-bg`. Match it.
7. `--color-green-dark` (line ~42) — hover state for the accent. Pick a slightly darker version of the new accent.
8. `--color-nav-active` (line ~53) — uses the accent RGB triplet literally as `rgba(124, 111, 255, 0.20)`. Replace the `124, 111, 255` with the new accent's RGB values (e.g. for `#3b82f6`, use `rgba(59, 130, 246, 0.20)`).

That's all eight. Refresh the browser and the entire accent system follows.

### Change the page background

Change `--color-background-primary` (line ~24). The body element reads it directly. `--color-bg` (the legacy alias) should be updated to the same value for consistency.

### Change card / panel surface color

Change `--color-background-secondary` (line ~25). The surface aliases (`--color-surface`, etc.) follow automatically because they are `var()`-of-`var()` aliases.

### Change financial green (positive ROI / EV)

Change `--color-positive` (line ~16) and `--color-success` (line ~60) together — they currently share the value `#16a34a`. Then update the hardcoded `#16a34a` in both chart files (`TierPriceTrendChart.jsx` and `PriceTrendChart.jsx`) to match. **You almost never want to do this** — green is the universal "positive" color in finance and changing it confuses users.

### Add a new themed color

1. Add a new variable to the `:root` block in `index.css` with a descriptive name (`--color-warning`, `--color-info`, etc.).
2. Reference it from components with `color: var(--color-warning);` — never inline a hex.
3. If the color needs to render inside a Recharts chart, add it to the relevant `CHART_COLORS` object with a `// --color-x` annotation comment.

### Never do these

- Don't put hex codes directly in component CSS or JSX `style={}` props. The two Recharts files are the only sanctioned exceptions.
- Don't rename existing variables — too much component CSS depends on the current names. Add new aliases instead.
- Don't change `--color-positive`, `--color-success`, or `--color-red` family without a deliberate design conversation. Their meanings are semantic, not aesthetic.

---

## Light Mode Readiness

`src/index.css` currently defines all color tokens inside a single `:root { ... }` block. This is a dark-mode-only setup — there is no `prefers-color-scheme` media query, no `[data-theme]` selector, and no light-mode token block.

To add light mode, the pattern is:

1. **Keep the existing `:root` block as the dark-mode default.** Optionally rename the selector to `:root, [data-theme="dark"]` so the dark theme is explicitly addressable.
2. **Add a second `[data-theme="light"] { ... }` block below it**, redefining every color token with light-mode-appropriate values. Backgrounds become near-white, text becomes near-black, accents typically darken slightly to maintain WCAG contrast on a light surface. The variable *names* stay identical so every component renders unchanged — only the *values* differ.
3. **Add a toggle UI** (likely in the header or in a future Settings page). The toggle calls `document.documentElement.setAttribute('data-theme', 'light')` or `'dark'`. Persist the choice in `localStorage` so it survives reloads. Read the persisted choice in `main.jsx` (or App.jsx) on app boot and apply it before first paint to avoid a flash of the wrong theme.
4. **Update the two Recharts files.** Because their hex values are baked in at JS level, they cannot follow CSS variables automatically. Two options: (a) read the resolved CSS variable values at runtime via `getComputedStyle(document.documentElement).getPropertyValue('--color-positive')` and pass those to `CHART_COLORS`, re-running when the theme changes; (b) hardcode a `CHART_COLORS_LIGHT` and `CHART_COLORS_DARK` and switch based on the active theme. Option (a) keeps `index.css` as the single source of truth and is the recommended path.
5. **Audit each component visually under light mode.** Border contrast, focus rings, and badge tints often need per-token tweaks that are not obvious until you see the page. The first light-mode pass is always a polish loop, not a one-shot conversion.

Until that work is scheduled, the app remains dark-mode-only. The token system is structured so the conversion is a values-only change (no component edits) once a light palette is chosen — that is the payoff for the strict "all colors go through CSS variables" rule.

Project context: a redesign milestone is scheduled for after the POC pipeline is complete and real data is live (see `CLAUDE.md` → UI redesign policy). Light mode adoption is most naturally addressed at that milestone, not earlier.

---

## Maintenance

- Add to this file whenever a new variable is introduced in `index.css`.
- Re-run the audit (`grep -rniE "#[0-9a-f]{3}([0-9a-f]{3})?\b" src/`) before every Pro code audit. The expected result is the two Recharts files and nothing else. Any new hit is a regression.
- If a redesign changes a value, update the "Current Value" column here in the same commit.
