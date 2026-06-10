# DESIGN SYSTEM: Cybernetic / Technical HUD (VR Portfolio)

## 1. GLOBAL PHILOSOPHY
You are building a highly technical, sci-fi-inspired developer portfolio. The aesthetic is "Diegetic HUD." It must feel like an interface from Detroit: Become Human or a high-end spacecraft console. 
- NEVER use standard "SaaS" layouts (e.g., 3-column bento grids, rounded cards, soft drop shadows).
- NEVER use gradients unless they are strict, linear, and used to indicate a "scanning" or "active" state.
- Embrace structural asymmetry. Use visible grid lines and technical crosshairs to divide space.

## 2. TYPOGRAPHY RULES
- **Primary Font (Headings & UI Labels):** Use a geometric, squared-off sans-serif (e.g., 'Rajdhani', 'Chakra Petch', or 'Space Grotesk'). 
  - ALL headings and interactive labels MUST be `text-transform: uppercase`.
  - Apply wide letter-spacing (`tracking-widest` or `0.1em` to `0.2em`).
- **Secondary Font (Body):** A clean, highly legible grotesque (e.g., 'Helvetica Neue', 'Inter'). Keep it thin (`font-weight: 300` or `400`).
- **Tertiary Font (Data & Metadata):** A strict monospace font (e.g., 'JetBrains Mono', 'Fira Code'). Use this for dates, coordinates, tags, or small technical annotations.

## 3. COLOR TOKENS (OKLCH SYSTEM)
Use modern OKLCH for precise contrast. The theme relies on stark monochromes with an electric blue accent.

**Dark Theme (Default):**
- Background: Deep slate/charcoal `oklch(0.20 0.01 250)`
- Surface (Glass): Translucent dark `oklch(0.25 0.01 250 / 0.4)`
- Text Primary: Pure stark white `oklch(0.98 0 0)`
- Text Secondary: Muted steel `oklch(0.70 0.02 250)`
- Accent/Active: Electric Cyan `oklch(0.75 0.15 230)`

**Light Theme:**
- Background: Icy/Frosted White `oklch(0.95 0.01 250)`
- Surface (Glass): Translucent white `oklch(0.98 0.01 250 / 0.6)`
- Text Primary: Deep charcoal `oklch(0.20 0.01 250)`
- Text Secondary: Slate gray `oklch(0.50 0.02 250)`
- Accent/Active: Deep Tech Blue `oklch(0.50 0.15 250)`

## 4. SHAPE & STRUCTURE (THE ANTI-SLOP RULES)
- **BORDER-RADIUS IS FORBIDDEN:** All standard corners must be `0px`.
- **Borders:** Use thin `1px` borders extensively to define containers, sections, and active states. Use `border-opacity` to make them subtle.
- **Micro-Decorations:** Inject pseudo-elements (`::before`, `::after`) to create HUD elements like corner brackets (`┌  ┐`), crosshairs, or small technical dots at the intersection of grid lines.
- **Glassmorphism:** Use `backdrop-filter: blur(12px)` for overlay menus and panels to give a sense of depth over the background.

## 5. INTERACTION & MOTION
- **No Bouncy Animations:** Transitions should be linear, sharp, and fast (e.g., `transition-timing-function: cubic-bezier(0, 0, 0.2, 1)`, duration `150ms` to `200ms`).
- **Hover States:** Instead of scaling buttons up, use "targeting" effects. On hover, apply a `1px` electric blue border, bracket the text with `[ ]`, or slide a solid 2px line underneath the element.
- **Active States:** Active menu items should have a solid or subtly striped background fill of the Accent Color, with text reversed out (e.g., black text on cyan background).

## 6. SPECIFIC DBH COMPONENTS (v1.0 IMPLEMENTATION)
- **Targeting Reticles:** The global `reticle-sm` and `reticle-lg` CSS classes provide automated, 4-corner bracket framing to UI elements, specifically expanding inward on hover to emulate targeting locks.
- **Terminal Decryption:** The `[ DecryptedText ]` component handles cryptographic letter randomization on mount, giving text an authentic "loading from mainframe" aesthetic.
- **Hardware Switches:** Toggles (like the Theme optics switch) emulate physical sliders. They feature a defined inner track and a heavy, shadowed accent block that slides via precise spring physics, exposing internal `DRK`/`LGT` text.
- **Segmented Power Bars:** Progress meters (like the Skills Loadout) are segmented into individual lit blocks with empty ghost blocks behind them, replicating physical LCD diagnostic readouts instead of generic solid lines.
- **Monogram Branding:** The core identity (Favicon/Logo) is a brutalist, strictly geometric "VY" SVG monogram avoiding all curves, enforcing the corporate-technical vibe.