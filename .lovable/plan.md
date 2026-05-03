# Memoir — Milestone 1 UI

Mobile-first React prototype of two core screens: **The Shelf** (home) and **The Entry Editor**. Static mocked data only — no backend, no persistence. Editorial, tactile, generous whitespace.

## Design system setup

Update `src/styles.css` to encode the Memoir tokens (light mode for M1):

- `--background: #F9F9F7` (paper cream)
- `--foreground: #1A1A1A` (deep ink)
- `--muted-foreground: #6B6B66` (warm tan/slate for metadata)
- `--border: #E8E4DA` (ghost ink)
- `--card: #FFFDF8` (warm white for book covers / sheets)
- Accents: `--accent-sepia: #8B5A2B`, `--accent-slate: #3D5068`, `--accent-forest: #4A6741`, `--accent-vermilion: #8B2E12` (primary CTA)
- `--radius: 10px` (8–12px range)
- Remove dark-mode overrides for now (leave structure for later).

Typography (dual-font):
- Add Google Fonts `<link>` for **Lora** (serif: headers + journal body) and **Inter** (sans: UI/nav/buttons) in `src/routes/__root.tsx` head links.
- Tailwind v4 theme tokens: `--font-serif: "Lora", Georgia, serif;` and `--font-sans: "Inter", system-ui, sans-serif;` exposed via `@theme inline` so `font-serif` / `font-sans` utilities work.
- Body defaults to `font-sans`; journal/editorial surfaces opt into `font-serif`.

Global feel:
- Subtle paper texture: a very low-opacity SVG noise as a fixed background layer behind `body` (CSS only, no asset file needed — inline data URI).
- Buttons: rounded-[10px], min-h-11, never pure black, hover = soft sepia tint.

## Routes

- `src/routes/index.tsx` → **Shelf View**
- `src/routes/entry.$entryId.tsx` → **Entry Editor** (uses param so we can navigate from a cover; mocked entries keyed by id)

`__root.tsx` keeps the shell minimal — no global header, since the Shelf and Editor each own their chrome.

## Screen 1 — The Shelf (`/`)

Layout (mobile-first):
- Top: generous 64px+ vertical padding. Serif wordmark "Memoir" centered, small sans subtitle "Your life, beautifully remembered".
- Quiet greeting line in serif italic: "Good evening, Anna." + today's date in small sans uppercase tracking.
- **Bookshelf grid**: 2 columns on mobile (`grid-cols-2 gap-5`), 3 on `md`, 4 on `lg`. Vertical scroll.
- Each **Volume card**:
  - Aspect ratio ~2:3 (book cover proportions).
  - Cloth-like background (one of 4 muted cover colors: sepia, slate, forest, deep cream).
  - Thin inset border + a faint embossed serif title ("2026 — Vol. I"), small sans subtitle ("Jan – Apr · 47 entries").
  - 3D shadow effect: layered box-shadows (right + bottom) + a 2px darker "spine" strip on the left edge to imply depth.
  - Hover/press: gentle lift (translate-y-[-2px], shadow grows) — 200ms ease-out.
- A "+ New Volume" card at the end: dashed warm border, serif "+" glyph, no fill.

Bottom navigation (minimalist, fixed):
- 4 icons (lucide): `BookOpen` (Shelf, active), `PenLine` (Write), `Search`, `User`.
- Background: `--card` with a hairline top border, `backdrop-blur-sm`. Icon size 22, label in tiny uppercase Inter, 11px, tracking-wide. Active state = ink color + a tiny sepia dot under icon (no pill, no fill).
- Tap target ≥ 44×44.

Mocked data: array of 6 volumes in `src/data/mockVolumes.ts`. Tapping any volume navigates to `/entry/$id` (M1 shortcut: a volume opens a sample entry; in later milestones it'll open the volume's TOC).

## Screen 2 — The Entry Editor (`/entry/:entryId`)

Distraction-free canvas on `#F9F9F7`.

Top bar (sticky, 56px tall, transparent with hairline bottom border that fades in on scroll):
- Left: `ChevronLeft` Back button (ghost, sans label "Shelf" optional on ≥sm). Returns to `/`.
- Center: tiny sans uppercase metadata — "Tuesday · May 5".
- Right: "Save" button — ghost text button in sepia, sans, weight 500. Disabled state when nothing changed (mocked: always enabled).

Canvas (max-w-[680px] mx-auto, px-6, py-10):
- **Title**: serif, 32px mobile / 40px sm+, weight 500, ink color, contenteditable-styled (a styled `<input>` with no border, placeholder "Title your day…" in tertiary ink).
- **Date line**: small caps sans, muted, under title, 24px margin.
- **Body**: serif, 18px, line-height 1.7, generous letter spacing. Rendered as a styled `<textarea>` that auto-grows (or a contenteditable `div`). Placeholder: "Begin where you are."
- Pre-filled sample entry (Lora, ~3 paragraphs of reflective prose) so the visual is complete.
- A faint center-aligned ornamental glyph (`✦` or a thin SVG flourish) between paragraphs is **not** added by default — kept for later.

Bottom toolbar (fixed, 56px, paper card with hairline top border):
- 3 icons left-aligned with comfy spacing: `ImagePlus` (photos), `Mic` (voice note), `MapPin` (location).
- 1 icon right-aligned: `MoreHorizontal`.
- All icons: 22px, ink-secondary color, no labels, 44×44 tap targets, gentle hover bg `--bg-sunken`.
- Buttons are mocked — clicking shows a small toast ("Coming soon") via existing sonner.

## Transition between screens

Use **Framer Motion** (already-friendly with TanStack Router via `AnimatePresence` wrapper) OR — to keep deps minimal — pure CSS classes:
- Add `motion` (`framer-motion`) as a dep.
- Wrap each route's root element in `motion.div` with: `initial={{ opacity: 0, x: 12 }}`, `animate={{ opacity: 1, x: 0 }}`, `exit={{ opacity: 0, x: -8 }}`, `transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}`.
- Total ≤ 250ms, subtle slide + crossfade. No 3D curls.

## Components to add

```
src/
  components/
    memoir/
      VolumeCard.tsx        # book cover card with 3D shadow + spine
      ShelfHeader.tsx       # wordmark + greeting
      BottomNav.tsx         # 4-icon fixed nav (Shelf only)
      EditorTopBar.tsx
      EditorToolbar.tsx     # bottom toolbar in editor
      PageTransition.tsx    # framer-motion wrapper
  data/
    mockVolumes.ts
    mockEntries.ts
  routes/
    index.tsx               # Shelf
    entry.$entryId.tsx      # Editor
```

Shadcn usage: `Button` (heavily restyled via `variant="ghost"` + custom classes), `Toaster` (sonner) for the "coming soon" toasts. No Card/Dialog defaults — Volume cards are hand-built so they don't read as SaaS.

## Out of scope for M1

- Real persistence, auth, AI features, dark mode, volume detail/TOC, photo/voice/location capture, search, profile screen, page-curl 3D, printed export.

## Acceptance checks

- Background is `#F9F9F7` everywhere; no pure black or pure white in UI.
- Headers and journal body render in Lora; nav/buttons render in Inter.
- Shelf shows 6 mocked volumes in a 2-col mobile grid with visible 3D shadow + spine.
- Bottom nav is fixed, ≥44px tap targets, active state on Shelf icon.
- Tapping a volume navigates to `/entry/{id}` with a ≤250ms slide+fade transition.
- Editor renders a pre-filled serif sample entry, sticky top bar (Back/Save), and bottom toolbar with 3 ghost icons.
- Layout looks right at 375px, 414px, 768px, 1280px.
