# RICOX — Design Spec

Visual north star: `design/references/vestilo-investment.jpg`.
Keep all RICOX information intact. Color and atmosphere follow this reference — not the old slate / purple / pink theme.

## Brand

- Name: **RICOX**
- Category: Cryptocurrency investment platform
- Promise: Invest in vetted crypto projects, trade digital assets, and build a diversified portfolio with ease.

## Color Palette

Space-navy ground with a luminous blue CTA. No purple or pink chrome.

| Token | Hex / value | Use |
|---|---|---|
| Void | `#05060D` | Page background |
| Navy | `#070B14` | Header, footer, raised bands |
| Surface | `#0C1018` | Cards |
| Surface 2 | `#121826` | Nested panels, inputs |
| Line | `rgba(148, 173, 214, 0.14)` | Hairline borders |
| Line strong | `rgba(148, 173, 214, 0.28)` | Hover borders, ghost buttons |
| Text | `#F4F7FB` | Primary type |
| Muted | `#8B93A7` | Body, captions, labels |
| Accent | `#4D7CFF` | Primary buttons, progress, badges |
| Accent 2 | `#6EA0FF` | Links, highlights, gradient peak |
| Cyan | `#5EEAD4` | Secondary highlight |
| Green | `#34D399` | Positive change, live status |
| Red | `#F87171` | Negative change |
| Glow | `rgba(77, 124, 255, 0.38)` | Button and hero bloom |

Tokens live in `app/globals.css`. Do not reintroduce `#8B5CF6`, pink, or generic `slate-900` chrome.

## Type

- UI and headings: **Inter**
- Hero display: 40–60px, bold
- Section titles: 24–36px, bold
- Body: 16–18px
- Captions / nav: 12–14px

## Surfaces

- Cards: glass fill, 1px line, ~16–24px radius
- Hero: radial navy bloom + starfield over photography
- Primary CTA: fully rounded pill, blue fill, outer glow
- Ghost CTA: pill, line-strong border, no fill
