# Bayescase Frontend Styling Guide

This is the single source of truth for how Bayescase should look and feel. Keep it simple, consistent, and fast to implement.

## Design philosophy (for UX)

- Modern, minimal, professional; brand anchored in deep purple
- Data-first: charts and numbers read clearly; UI provides structure, never visual noise
- Medium-to-dense information packing: optimize screen real estate while maintaining clarity; avoid excessive whitespace
- Balance density with breathing room: generous container spacing, tighter within components
- AI suggestions are clearly distinguished: use `aiBlue` badges/chips, subtle backgrounds, and inline contextual placement; never interrupt flow
- Hierarchy via type, spacing, and elevation; don't rely on color alone
- Purposeful motion: quick, subtle feedback only (200ms)
- Accessibility by default: contrast, labels, keyboard flows
- Consistency across patterns: cards, buttons, chips, and tabs behave the same everywhere

## 1) Design Principles

- Data-first UI: styling supports content, never competes with it
- Minimal, modern, enterprise feel (no gradients/textures)
- Consistent tokens via theme and shared colors
- Subtle motion (200ms) to indicate state changes only

## 2) Tech & Sources of Truth

- MUI v5 with sx prop and component overrides
- Colors: `shared/style/colors.ts`
- Theme: `frontend/src/style/theme.ts`
- Shadows: `frontend/src/style/shadow.ts`
- Global CSS: `frontend/src/style/main.css`

Always import colors from `@global/style/colors`. Don't hardcode hex or RGB.

## 3) Color System

- Brand primary: `colors.mainPurple` (primary actions, links, selected)
- Confirmed: `colors.confirmedPurple` (validated states)
- Status: success `colors.goodGreen`, error `colors.badRed`, warning `colors.mediumYellow`
- Greys: structure and text hierarchy using `lighterGrey`, `lightGrey`, `midGrey`, `darkGrey`
- Feature badges: `aiBlue`, `manualGray`, `tourTeal`, `interviewIndigo`
- Transparent/lighter colors: append hex opacity to any color (e.g., `colors.mainPurple + "20"` for subtle, `"40"` for light, `"80"` for medium); use for backgrounds, overlays, and hover states

Rules

- Never hardcode colors; use `colors.*`
- Text on white: use `text.primary`/`text.secondary` (theme)
- Text on purple: white only
- Pair status color with an icon/label for accessibility

## 4) Typography

- Font family from theme: system stack (see `theme.ts`)
- Default body: `Typography variant="body1"` (16px, 400)
- Sections: `h6` (20px, 500)
- Secondary text: `body2`
- Small labels: `caption`
- Emphasis via `fontWeight` 500600, not color alone
- Recommended line-heights: headings 1.2, body 1.5, compact 1.0

Do

- Use MUI variants and semantic color tokens (`text.primary`, `text.secondary`)
- Truncate long text with ellipsis where needed

Avoid

- Custom font sizes outside the scale
- More than 3 weights per screen

## 5) Spacing & Layout

- 8px scale: use theme spacing units (0.5, 1, 2, 3, 4, 6)
- Use `gap` for spacing between children (prefer over margins)
- Common: padding 2 (16px), gaps 23 (1624px)
- Responsive via sx breakpoints (xs/sm/md/lg/xl)

Do

- Add padding to containers, not each child
- Keep layouts simple and shallow DOM

Avoid

- Arbitrary pixel values (e.g., 17px)
- Negative margins, except for rare, documented cases

## 6) Radius & Shape

- Default radius: 5px (theme shape)
- Chips/pills: 12px
- Circles: 50%

Consistent application across similar components. Don't mix multiple radii in the same context.

## 7) Elevation & Shadows

- Default card/container: `boxShadow: 3`
- Hover: `boxShadow: 6` + `transform: translateY(-4px)`
- Active/selected: up to `boxShadow: 8`
- Modals/popovers: `boxShadow: 12`
- For non-MUI or special cases: use `standardShadow` / `elevatedShadow`

Keep shadows soft (alpha ~0.150.2). Always transition transform and box-shadow together (200ms, ease).

## 8) Interactive States

- Hover: subtle lift + stronger shadow; cursor pointer when clickable
- Focus: clear focus ring (purple outline); ensure keyboard navigability
- Active: slight press (translateY back to 0, darker bg if relevant)
- Disabled: mid-grey, reduced opacity; keep contrast for labels
- Selected: purple indication or clear selected style per component

Checklist per interactive element

- Hover, focus, active, selected, disabled states present
- Smooth 200ms transitions on transform/box-shadow/background
- ARIA labels and keyboard activation (Enter/Space)