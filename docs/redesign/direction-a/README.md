# Handoff: MealGenie Redesign — Direction A ("Cozy Polish home kitchen")

## Overview

This handoff covers a full visual redesign of the MealGenie product around **Direction A**: a warm, comforting, "cookbook from babcia's shelf" aesthetic. The core product surfaces — landing, dashboard, meal generator, suggestions, recipe page, chat drawer, and mobile — were prototyped at high fidelity and live in `MealGenie Directions.html`.

The plan is **complete UI replacement, but rolled out safely** — token-first, screen-by-screen, with the existing routing and state untouched.

## About the Design Files

The HTML files in this bundle are **design references**, not production code to copy verbatim. They were built in plain React + inline styles to communicate intent. Your job is to **recreate them in the existing React + Tailwind codebase** using its established components, hooks, and state management — keeping data layer, API calls, and routing exactly as they are.

## Fidelity

**High-fidelity.** Colors, type hierarchy, spacing, radii, shadows, layout proportions, and motion intent are final and should be matched closely. Food photography is shown as labeled placeholders — replace with the existing image pipeline.

---

## ⚠️ Critical change from the prototype: Typography

The prototype uses **Fraunces** for headlines. That choice has been pulled — Fraunces' optical sizes don't sit right with Polish diacritics (ą, ę, ć, ł, ń, ś, ź, ż look uneven at display weights), and it reads more "trendy editorial" than "warm cookbook."

### Use this typography stack instead:

| Role | Family | Notes |
|---|---|---|
| Display & headlines | **Source Serif 4** (Google) | Variable optical-size font with full Polish diacritic support. Use `optical-size: 32–60` at display sizes. Weights 300–700, italic available. |
| Body & UI | **Source Sans 3** (Google) | Pairs natively with Source Serif 4. Replaces Inter — better Polish diacritics, similar metrics so layouts don't shift. |
| Handwritten kicker | **Caveat** (Google) — KEEP | The cursive eyebrow line ("~ jak u babci ~") works as-is. Use sparingly — never for body or CTAs. |
| Mono (timers, recipe numbers) | **JetBrains Mono** | For ingredient quantities and step numbers when tabular alignment matters. |

**Why Source Serif 4 over Fraunces:** softer terminals, calmer italic, designed by Frank Grießhammer specifically for long reading; full Latin Extended-A coverage for Polish text; variable weight + optical size in a single file. Test pages must include "ąęćłńóśźż" and "PIEROGI Z KOPERKIEM" before committing.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:ital,wght@0,400..700;1,400..700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..700&display=swap" rel="stylesheet">
```

### Type scale (rem assumes 16px root)

| Token | Size | Line-height | Weight | Use |
|---|---|---|---|---|
| `--text-display-xl` | 5.5rem (88px) | 0.95 | 400 | Landing hero only |
| `--text-display-lg` | 3.5rem (56px) | 1.0 | 400 | Page heroes |
| `--text-display-md` | 2.5rem (40px) | 1.05 | 500 | Section heads |
| `--text-h1` | 2rem (32px) | 1.1 | 500 | Recipe titles |
| `--text-h2` | 1.5rem (24px) | 1.15 | 500 | Card titles |
| `--text-h3` | 1.125rem (18px) | 1.2 | 500 | Sub-titles |
| `--text-body-lg` | 1.0625rem (17px) | 1.6 | 400 | Hero copy, recipe steps |
| `--text-body` | 0.875rem (14px) | 1.55 | 400 | Default UI |
| `--text-sm` | 0.8125rem (13px) | 1.5 | 400 | Secondary |
| `--text-eyebrow` | 0.6875rem (11px) | 1.0 | 700 | Uppercase labels, `letter-spacing: 0.14em` |
| `--text-caption` | 0.75rem (12px) | 1.4 | 400 | Captions, meta |
| `--text-handwritten` | 1.25rem (20px) | 1.0 | 400 | Caveat kicker |

Display tier always uses `Source Serif 4` with italic for the accent word ("ugotujemy?", "co dziś?"). Mix italic and roman in the same headline — that's the signature voice.

---

## Implementation Update: Dark Mode Palette Override

As of the Etap 6 generator review on 2026-05-06, MealGenie no longer uses the original warm-brown `hearth dark` values below as the production dark-mode target.

Marek approved a deliberate dark-mode adjustment after visual review: backgrounds should move toward a neutral warm graphite, while the cozy Direction A character should come from terracotta, basil, saffron, typography, paper surfaces in light mode, and very subtle glows. This improves long-session readability and prevents the interface from becoming too sepia/brown.

Use `frontend/src/index.css` as the source of truth. For future implementation sessions, do not restore the older `#1c1410 -> #271c15` brown dark palette unless Marek explicitly asks for that rollback.

Current production dark-mode direction:

```css
:root.dark,
:root[data-theme="dark"] {
  --bg: #151312;
  --bg-elevated: #1e1b1a;
  --bg-sunken: #0d0b0a;
  --bg-inverse: #fdf8ec;

  --ink: #f0eae4;
  --ink-soft: #c4bdb6;
  --ink-muted: #a49d96;
  --ink-disabled: #5a4a3c;
  --ink-inverse: #1c1410;

  --border: #332d29;
  --border-strong: #453e39;
  --border-dotted: #5a514b;

  --accent: #e88a4a;
  --accent-hover: #f29a5e;
  --accent-pressed: #d27a3a;
  --accent-soft: #3a2218;
  --accent-deep: #c25728;

  --basil: #8bc27a;
  --basil-soft: #223321;
  --saffron: #f0c050;
  --saffron-soft: #3a2e14;
  --bordeaux: #c26060;
}
```

Dark background glows should remain minimal. The current app-level dark overlay is intentionally very low opacity to avoid visible blob artifacts.

---

## Design Tokens (CSS Variables)

Drop this in `src/styles/tokens.css` and import it from your root entry. All colors are tested AA-compliant against their pairing surface. The `--ink-*` and `--bg-*` tokens flip in dark mode; the brand `--accent-*`, `--basil-*`, `--saffron-*` keep their hue but step lighter.

```css
/* tokens.css */
:root {
  /* ───── Surfaces ───── */
  --bg:               #f6efe2;   /* parchment */
  --bg-elevated:      #fdf8ec;   /* cream paper — cards */
  --bg-sunken:        #ece2d0;   /* recessed wells */
  --bg-inverse:       #1f1612;   /* dark accents on light mode */

  /* ───── Ink (text) ───── */
  --ink:              #3a2818;   /* primary brown */
  --ink-soft:         #7a5d44;   /* secondary */
  --ink-muted:        #a89580;   /* tertiary, captions */
  --ink-disabled:     #c4b5a1;
  --ink-inverse:      #fdf8ec;   /* on dark surfaces */

  /* ───── Borders & dividers ───── */
  --border:           #e3d6bf;
  --border-strong:    #d0bd9e;
  --border-dotted:    #c4b094;   /* used with border-style: dotted */

  /* ───── Brand ───── */
  --accent:           #c25728;   /* terracotta primary */
  --accent-hover:     #a8481f;
  --accent-pressed:   #8e3a18;
  --accent-soft:      #fbe1d0;   /* tinted bg */
  --accent-deep:      #9a4220;   /* dark variant */

  --basil:            #5a8a4a;   /* secondary — confirms, success */
  --basil-soft:       #dbe8d3;
  --saffron:          #d4a017;   /* warning, "premium" tag */
  --saffron-soft:     #fbeec9;
  --bordeaux:         #8a3a3a;   /* destructive only */

  /* ───── Radii ───── */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 999px;

  /* ───── Spacing scale (4px base) ───── */
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.25rem;  /* 20 */
  --space-6: 1.5rem;   /* 24 */
  --space-8: 2rem;     /* 32 */
  --space-10: 2.5rem;  /* 40 */
  --space-12: 3rem;    /* 48 */
  --space-16: 4rem;    /* 64 */
  --space-20: 5rem;    /* 80 */

  /* ───── Shadows (warm-tinted, never neutral gray) ───── */
  --shadow-xs: 0 1px 2px rgba(58, 40, 24, 0.06);
  --shadow-sm: 0 4px 10px -2px rgba(58, 40, 24, 0.08);
  --shadow-md: 0 12px 24px -8px rgba(58, 40, 24, 0.14);
  --shadow-lg: 0 30px 60px -20px rgba(58, 40, 24, 0.25);
  --shadow-accent: 0 12px 24px -8px rgba(194, 87, 40, 0.40);

  /* ───── Type ───── */
  --font-serif: "Source Serif 4", "Iowan Old Style", Georgia, serif;
  --font-sans:  "Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-script: "Caveat", "Snell Roundhand", cursive;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;

  /* ───── Motion ───── */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --duration-fast: 140ms;
  --duration-base: 220ms;
  --duration-slow: 380ms;
  --duration-drawer: 320ms;
}

/* ───── Dark mode ───── */
[data-theme="dark"] {
  --bg:               #1c1410;   /* warm near-black, never pure */
  --bg-elevated:      #271c15;   /* "warm hearth" card */
  --bg-sunken:        #15100c;
  --bg-inverse:       #fdf8ec;

  --ink:              #f4ede1;   /* warm cream, never #fff */
  --ink-soft:         #c5b4a0;
  --ink-muted:        #8a7864;
  --ink-disabled:     #5a4a3c;
  --ink-inverse:      #1c1410;

  --border:           #3a2c20;
  --border-strong:    #4a3826;
  --border-dotted:    #5a4634;

  --accent:           #e88a4a;   /* shifted lighter — terracotta glows in dark */
  --accent-hover:     #f29a5e;
  --accent-pressed:   #d27a3a;
  --accent-soft:      #3a2218;
  --accent-deep:      #c25728;

  --basil:            #7ab068;
  --basil-soft:       #2a3a26;
  --saffron:          #f0c050;
  --saffron-soft:     #3a2e14;
  --bordeaux:         #c26060;

  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-sm: 0 4px 10px -2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 12px 24px -8px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 30px 60px -20px rgba(0, 0, 0, 0.7);
  --shadow-accent: 0 0 32px rgba(232, 138, 74, 0.3);
}
```

### Dark-mode rules of thumb (specific to Direction A)

The cozy aesthetic is fragile in dark mode. Generic dark schemes feel cold; you need **"hearth dark,"** not "tech dark":

1. **Never use pure black or pure white.** Backgrounds stay in the `#1c1410 → #271c15` warm-brown range; text stays in the `#f4ede1` cream range. Pure values break the parchment/paper metaphor.
2. **Lift the accent, don't dim it.** Terracotta `#c25728` muddies on dark — shift to `#e88a4a` (saturated, warmer). This is non-negotiable for AA contrast.
3. **Replace paper texture with a soft radial glow.** The dot-pattern texture used on the light landing reads as noise on dark. Use `radial-gradient(ellipse at 30% 20%, rgba(232,138,74,0.06), transparent 50%)` instead.
4. **Folk pattern divider must shift.** Use `--accent` (now light terracotta) — never dim it to a brown line, that disappears.
5. **Card elevation flips.** In light mode, cards are *brighter* than the page (cream on parchment). In dark mode, cards are *also brighter* than the page (`--bg-elevated` is lighter than `--bg`). Keep that "lifted paper" feel — never use darker cards on a lighter dark page.
6. **Shadows stop being shadows; they become glows.** `--shadow-accent` in dark mode is a soft halo, not a drop-shadow. The hero CTA and selected pierogi card should glow.
7. **Caveat handwritten kicker** stays in `--accent` — italic terracotta on cream OR italic light-terracotta on warm-black both feel handwritten.
8. **The recipe page's hero photo gets a darker overlay** (15–25% black) to keep the title readable on dark mode without crushing color in the food.
9. **Toggle behavior:** respect `prefers-color-scheme` by default, allow override via `data-theme` attribute on `<html>`. Persist to `localStorage`. No flash on load — set the attribute synchronously in `<head>`.

---

## Tailwind Class Strategy

Extend Tailwind to consume the CSS variables — don't redefine the palette in `tailwind.config.js` with hex values. This way, dark mode is a single attribute swap, not a class rewrite.

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-sunken': 'var(--bg-sunken)',
        'bg-inverse': 'var(--bg-inverse)',
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
          muted: 'var(--ink-muted)',
          disabled: 'var(--ink-disabled)',
          inverse: 'var(--ink-inverse)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          pressed: 'var(--accent-pressed)',
          soft: 'var(--accent-soft)',
          deep: 'var(--accent-deep)',
        },
        basil: { DEFAULT: 'var(--basil)', soft: 'var(--basil-soft)' },
        saffron: { DEFAULT: 'var(--saffron)', soft: 'var(--saffron-soft)' },
      },
      fontFamily: {
        serif: 'var(--font-serif)',
        sans: 'var(--font-sans)',
        script: 'var(--font-script)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '20px',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        accent: 'var(--shadow-accent)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },
    },
  },
};
```

### Usage patterns

```jsx
// Hero headline
<h1 className="font-serif text-[5.5rem] leading-[0.95] tracking-[-0.03em] text-ink">
  Co dziś <em className="italic font-medium text-accent">ugotujemy?</em>
</h1>

// Eyebrow / kicker
<div className="font-script italic text-accent text-xl">
  ~ jak u babci, ale w telefonie ~
</div>

// Card
<article className="bg-bg-elevated border border-border rounded-lg p-6 shadow-sm">

// Primary button — hover should NEVER use opacity, always darken
<button className="bg-accent hover:bg-accent-hover active:bg-accent-pressed text-ink-inverse rounded-md px-6 py-3.5 font-sans font-semibold shadow-accent transition-colors duration-base ease-out">
  Zacznij gotować →
</button>

// Eyebrow label
<div className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent">
  Plan tygodnia · 12-18 maja
</div>

// Folk divider
<FolkDivider />  // see "New components" below
```

**Class composition rule:** prefer `clsx`/`cn` with semantic prop-driven variants in components, not string-mashing in markup. The rare exception is one-off layout in pages.

---

## Component Mapping

> The exact paths assume a typical CRA/Vite layout: `src/components/`, `src/pages/`, `src/layouts/`. Adjust to match the repo.

| Existing file | Action | Notes |
|---|---|---|
| `src/styles/index.css` | **Replace** | Import `tokens.css` first, then minimal resets. |
| `src/styles/tokens.css` | **Create** | Block above. |
| `src/components/ui/Button.tsx` | **Refactor** | Match new variants: `primary`, `secondary`, `ghost`, `pill`. |
| `src/components/ui/Card.tsx` | **Refactor** | Add `variant: paper \| sunken \| dark`. |
| `src/components/ui/Input.tsx` | **Refactor** | Pill rounded, dotted-border focus ring in `--accent`. |
| `src/components/ui/Tag.tsx` / `Pill.tsx` | **Refactor** | Active state = solid `--ink`, idle = outlined. |
| `src/components/ui/Badge.tsx` | **Refactor** | "Polecane" red badge style. |
| `src/components/Logo.tsx` | **Replace** | New SVG mark — see Logo Concepts. |
| `src/components/layout/AppNav.tsx` | **Refactor** | Cream background, text-only nav, pill auth button. |
| `src/components/layout/AppShell.tsx` | **Light refactor** | Apply `--bg` and font stack at root. |
| `src/pages/Landing.tsx` | **Rebuild** | Map to `A_LandingHero` from prototype. |
| `src/pages/Dashboard.tsx` | **Rebuild** | Map to `A_Dashboard`. Plan grid + shopping card + suggestion row. |
| `src/pages/Generator.tsx` | **Rebuild** | Map to `A_Generator`. Three-step form. |
| `src/pages/Suggestions.tsx` | **Rebuild** | Map to `A_Suggestions`. Six-card grid. |
| `src/pages/Recipe.tsx` | **Rebuild** | Map to `A_Recipe`. Two-column hero photo + content. |
| `src/components/chat/ChatDrawer.tsx` | **Rebuild** | Map to `A_Chat`. Right-side drawer 55% width. |
| Mobile views | **Inherit** | Same components, responsive rules below. |

---

## New Reusable Components to Create

Build these *first*, before rebuilding pages — every page consumes them.

### 1. `<FolkDivider />`
```jsx
// src/components/ui/FolkDivider.tsx
export const FolkDivider = ({ width = 120, className }) => (
  <svg width={width} height={12} viewBox="0 0 120 12" className={className} aria-hidden="true">
    <path d="M0 6 L20 6 M100 6 L120 6" stroke="currentColor" strokeWidth="1"/>
    <circle cx="30" cy="6" r="1.5" fill="currentColor"/>
    <path d="M40 6 Q50 0 60 6 T80 6" stroke="currentColor" strokeWidth="1.2" fill="none"/>
    <circle cx="90" cy="6" r="1.5" fill="currentColor"/>
  </svg>
);
```
Use as section break under headlines and recipe cards. `text-accent` by default; `text-border-strong` for muted dividers.

### 2. `<Eyebrow />`
```jsx
<Eyebrow tone="accent">Plan tygodnia · 12-18 maja</Eyebrow>
```
The 11px uppercase tracked label that appears 40+ times across the design. Tones: `accent` (default), `muted`, `basil`, `saffron`.

### 3. `<HandwrittenKicker />`
```jsx
<HandwrittenKicker>~ co dziś ugotujemy ~</HandwrittenKicker>
```
Caveat italic, `--accent`, optional `~ … ~` decoration. Used as an emotional eyebrow above hero/section heads.

### 4. `<RecipeCard />` (refactor existing if present)
Variants:
- `compact` — image 90px tall, side-by-side layout (dashboard "quick ideas").
- `default` — image 110px, vertical (suggestions grid).
- `featured` — adds "Polecane" badge ribbon, accent border.

Always include: image, eyebrow tag, serif title, italic Fraunces tagline, dotted-border meta row (time / kcal / difficulty).

### 5. `<DottedRow />`
```jsx
<DottedRow label="mąka pszenna" value="500 g" />
```
The "ingredient row with dotted leader" — used in recipe ingredients, shopping list, planning summary. Border-bottom: `1px dotted var(--border-dotted)`.

### 6. `<TapeAccent />`
The masking-tape decoration on the hero recipe card. SVG with paper-texture noise. Optional, but worth shipping for the cookbook feel on at least the hero and the empty-state recipe scrap.

### 7. `<PaperTexture />` (background utility)
A fixed-position pseudo-element wrapper that overlays a subtle dot SVG pattern at 0.4 opacity (light) / radial glow (dark). Mounts once at the layout root.

### 8. `<DayChip />`
The week-planner mini-cell. Variants: `planned`, `today`, `empty`. Used in dashboard plan card.

### 9. `<MealEmoji />`
A tiny `<div>` with terracotta-tinted gradient background and centered emoji or single-letter glyph — placeholder when there's no photo. Sizes: 32, 54, 80.

### 10. `<ChatBubble />`
Variants: `genie` (rounded `14px 14px 14px 4px`, soft bg, Fraunces body) and `user` (rounded `14px 14px 4px 14px`, accent bg, sans body). Avatar prop on `genie`.

### 11. `<ThemeToggle />`
Sun/moon swap, persists to `localStorage`, dispatches no flash on load. See "Dark mode rules" #9.

---

## Components to Refactor First (priority list)

The order matters — refactor leaves before branches.

1. **Tokens layer** — `tokens.css` + `tailwind.config.js`. Nothing else can land before this.
2. **`<Logo />`** — pick from concepts, ship as inline SVG component.
3. **Atomic UI** — `Button`, `Input`, `Tag`, `Badge`, `Card`. These are referenced everywhere.
4. **New atoms** — `Eyebrow`, `HandwrittenKicker`, `FolkDivider`, `DottedRow`. Cheap to build, used on every page.
5. **`<AppNav />` + `<AppShell />`** — sets the global background, font, theme toggle. Once these land, the *empty* product already feels like Direction A.
6. **`<RecipeCard />`** + **`<MealEmoji />`** + **`<DayChip />`** — the molecule that powers Dashboard, Suggestions, and Planner.
7. Page-by-page rebuild in this order: **Recipe → Suggestions → Dashboard → Generator → Chat Drawer → Landing**. Recipe is highest-traffic and easiest to validate visually; Landing is most exposure but lowest user-count, so ship it last.

Each page should land behind a feature flag (`?theme=v2` query or LD flag) so QA can compare side-by-side until cutover.

---

## Responsive Rules

Breakpoints (Tailwind defaults are fine):
- `sm: 640px` — phones land/large phones
- `md: 768px` — tablets portrait
- `lg: 1024px` — tablets landscape, small laptops
- `xl: 1280px` — desktops (design baseline)

### Layout transforms by breakpoint

| Surface | < 640 (mobile) | 640–1024 (tablet) | ≥ 1024 (desktop) |
|---|---|---|---|
| **Landing hero** | Single column, headline 56px, recipe card stacks below copy | Single column, headline 72px, side-by-side starts | Two-column, headline 88px |
| **Dashboard** | Single column, cards stack: plan → shopping → suggestions | Two columns from `md`, suggestions still 1 col → 2 col at `lg` | 2/3 + 1/3 split, 3-col suggestions |
| **Generator** | Full-width form, 4-button time-grid stays | Single centered column, max 600px | Centered column max 680px |
| **Suggestions** | 1 column | 2 columns | 3 columns |
| **Recipe** | Image first, full-width 280px tall, content below in single column; ingredients then steps | Image still full-width 360px, content single column | Two-column 1fr / 1.1fr; ingredients + steps side-by-side |
| **Chat drawer** | Full-screen modal, slides up from bottom | 65% width side drawer | 50–55% width side drawer |
| **Nav** | Hamburger + logo + auth pill | Logo + 3 nav items + auth pill | Full nav |

### Type scale shifts

Mobile cuts the display tier: `--text-display-xl` → 56px on `<sm`, `--text-display-lg` → 40px. Other tiers stay; the cookbook calm tolerates large body type on small screens.

### Touch targets
All interactive elements ≥ 44×44px. The pill tag chips need extra `py-2` on mobile vs. `py-1.5` desktop.

### Container queries
Use container queries (`@container`) on `<RecipeCard />` so the same card renders compact in dashboard sidebar (≤ 320px wide) and default in the suggestions grid (≥ 320px). Tailwind 3.4+ supports `@container/card:`.

---

## Motion Guidelines

The cozy aesthetic is **calm**. Motion should feel like turning a page in a cookbook — never bouncy, never tech-feeling.

### Universal
- All transitions: `var(--duration-base)` (220ms) by default, `var(--ease-out)` for entrances, `var(--ease-in-out)` for state changes.
- **Never** transition `transform: scale()` for hover on cards — it feels app-store-y. Lift via `box-shadow` and `translate-y(-2px)` instead.
- Reduce-motion: respect `prefers-reduced-motion: reduce` — drop all non-essential transitions to `0.01ms` (not `0` — Safari bug). Keep opacity-only fades for state clarity.

### Component-specific

| Element | Motion |
|---|---|
| **Buttons** | `bg-color` 140ms ease-out on hover; `transform: translateY(1px)` on `:active`. No spring. |
| **Cards (recipe, meal)** | `box-shadow` xs → sm + `translateY(-2px)` 220ms on hover. |
| **Tags / chips** | `bg-color` only, 140ms. |
| **Chat drawer** | `transform: translateX(100%)` → `translateX(0)` 320ms `ease-out`, with backdrop opacity 0 → 1 fading 220ms behind it. |
| **Drawer dismiss** | Same in reverse, 280ms `ease-in-out`. |
| **Page transitions** | Cross-fade only, 220ms. No slides — feels like book pages flipping if you keep it gentle. |
| **Recipe step reveal** (when scrolling through cooking mode) | Steps fade-in + 8px translate-up, staggered 60ms each, observed via `IntersectionObserver`. |
| **Loading skeleton** | A **slow** parchment shimmer — gradient sweep, 1800ms, ease-in-out. NOT 1000ms — too fast feels stressful. |
| **Pierogi/recipe match-percentage rings** | Animate stroke-dashoffset on mount, 600ms ease-out. One-shot. |
| **Form input focus** | Border `--border` → `--accent`, plus a 2px outer ring of `--accent-soft`, 140ms. No glow. |
| **Genie chat typing dots** | Three dots, opacity 0.3 → 1, sequential 200ms each, infinite. The only looping animation in the product. |
| **Caveat kicker on landing** | Optional one-time sketch-in: animate `stroke-dashoffset` if rendered as SVG. Skip if rendered as text. |

### Hard "no"s
- No bouncy spring physics.
- No parallax.
- No auto-playing carousels.
- No gradient shimmer on the brand color (saved for skeletons only).

---

## Accessibility Notes

### Required
- **Color contrast (WCAG AA)**:
  - `--ink` on `--bg`: 11.8:1 ✓
  - `--ink-soft` on `--bg`: 5.9:1 ✓
  - `--accent` on `--bg`: 4.7:1 ✓ (AA large only — use `--accent-deep` for body text accents)
  - `--ink-muted` on `--bg`: 3.6:1 — **NOT body-text legal**, restrict to ≥ 18px or 14px+bold
  - Dark mode: `--ink` on `--bg`: 13.2:1 ✓; `--accent` on `--bg`: 6.4:1 ✓
- **Focus rings**: 2px `--accent` outer ring with 2px offset on **every** focusable. Never `outline: none` without a replacement.
- **Reduced motion**: see above.
- **Polish locale**: `<html lang="pl">`. Date formatting via `Intl.DateTimeFormat('pl-PL')`. Currency `Intl.NumberFormat('pl-PL', {style:'currency', currency:'PLN'})`.

### Component-level
- **Recipe steps** are `<ol>` not `<div>`. Step numbers as `::before` content or `<span aria-hidden>` so screen readers don't double-read.
- **Ingredient list** is `<ul>` with `role="list"` (Safari kills bullets in some resets). Quantities visually right-aligned but in DOM order with the name.
- **Folk dividers**: `aria-hidden="true"`, decorative.
- **Handwritten kicker (Caveat)**: this is a known dyslexia-difficult font. **Always pair** with the headline below — never use Caveat as a standalone heading. Body text never in script.
- **Chat drawer**:
  - `<dialog>` element preferred (or `role="dialog" aria-modal="true"`)
  - Trap focus, return focus on close, ESC closes
  - First focus on close button, last on input
  - Backdrop click closes only after a short delay (300ms) to avoid mis-tap dismissal mid-typing
- **Chat messages** in `role="log" aria-live="polite"` — new messages announce without interrupting.
- **"Polecane" badge** on recipe cards: include `<span class="sr-only">Recommended:</span>` before the recipe title so screen readers don't say "polecane" out of context.
- **Day chips in planner**: each is a button. `aria-label` includes the full day, date, and meal name. `aria-current="date"` on today's chip.
- **Form inputs**: every input needs an associated `<label>` (visually hidden when the design uses placeholder-as-label).
- **Skip-to-content** link as the first focusable element on every page.

### Internationalization-readiness
Polish copy is the launch language but engineer for `pl-PL` plus `en-GB` future. All strings through `i18next` or equivalent. Caveat decorative copy ("~ jak u babci ~") is brand voice — leave Polish-only and move to a CMS field marked `non-translatable`.

---

## Implementation Order (one engineer, ~3 sprints)

### Sprint 1 — Foundation (week 1)
1. `tokens.css` + Tailwind config
2. Font loading (Source Serif 4, Source Sans 3, Caveat, JetBrains Mono) with `font-display: swap` and `<link rel="preload">` on critical weights
3. `<ThemeToggle />` + `<html data-theme>` swap with `localStorage` and no-FOUC inline script
4. New `<Logo />` SVG component
5. Atoms refactor: `Button`, `Input`, `Tag`, `Badge`, `Card`
6. New atoms: `Eyebrow`, `HandwrittenKicker`, `FolkDivider`, `DottedRow`, `MealEmoji`
7. **Visual regression baseline** — Storybook with all atoms, light + dark.

### Sprint 2 — Core surfaces (week 2)
1. `<AppShell />` + `<AppNav />` — global feel lands
2. `<RecipeCard />` + `<DayChip />` — molecules
3. **Recipe page** — full rebuild
4. **Suggestions page** — full rebuild
5. **Dashboard** — full rebuild
6. Behind `?theme=v2` flag from start; ship to staging.

### Sprint 3 — Acquisition + chat (week 3)
1. **Generator page**
2. **Chat drawer** with new bubble styling, motion, focus management
3. **Landing page** — last because it's the most "designed" and benefits from prior atoms shaking out
4. Mobile audit pass — every page on iPhone SE, iPhone 14, Pixel 7
5. Accessibility sweep — axe-core CI, manual screen-reader pass
6. Cutover plan: gradual rollout 5% → 25% → 100% over 5 days, watching for error rate + bounce on Landing.

### Out of scope for this redesign
- Image asset replacement (placeholders → real photos): separate workstream owned by content.
- Email + transactional templates: defer until product UI is shipped.
- Onboarding flow: not in the prototype, treat as Phase 2.

---

## Logo

The current logo (purple cloche + blue star + gradient wordmark) clashes with Direction A — it reads "premium fintech app," not "warm cookbook." A new mark is required.

See **`Logo Concepts.html`** in this bundle for three drafts:

1. **Pierogi mark** — terracotta circle with a single golden pinched pierogi.
2. **Spoon monogram** — wooden spoon centered like a serif glyph (recommended — most flexible at small sizes).
3. **Bowl & wheat** — terracotta bowl with wheat sprig rising.

All three pair with a serif-italic wordmark `Meal*Genie*` where the italic on "Genie" is the only typographic flourish. The wordmark italic is the constant — the mark can swap.

Each concept includes light + dark mode variants and small-size simplifications. Recommend final selection before Sprint 1 starts so the logo lands with the rest of the foundation layer.

---

## Files in this bundle

- **`README.md`** — this document
- **`MealGenie Directions.html`** — all three explored directions (canvas of 21 artboards). Direction A is the one to implement.
- **`directions/direction-a.jsx`** — the prototype source for Direction A's seven screens. Reference for layouts, copy, exact spacing.
- **`directions/shared.jsx`** — shared placeholder components used by all directions (Phone frame, FoodImg placeholder, GenieMark — disregard the GenieMark, use the new logo).
- **`Logo Concepts.html`** — three new logo directions for review.

For everything not specified here (data shapes, API contracts, routing, auth flow), keep what the codebase already has. This handoff is purely a visual + interaction redesign.
