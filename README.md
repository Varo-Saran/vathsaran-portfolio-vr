# SYS.ARCH // VATHSARAN_YASOTHARAN_PORTFOLIO_v1.0

> **STATUS:** ONLINE  
> **CLEARANCE LEVEL:** PUBLIC / OPEN_SOURCE  
> **FRAMEWORK:** VITE // REACT // TAILWIND_V4  

---

## [ OVERVIEW ]
This repository contains the source code for Vathsaran Yasotharan's personal portfolio. 

The aesthetic is specifically designed to emulate a **Diegetic HUD / Data Broker Interface (DBH)**. It completely rejects the modern standard of generic "SaaS slop" (no soft drop-shadows, no bento boxes, no rounded corners). Instead, it relies on strict brutalist geometry, monospace typography, terminal-style decryptions, and hardware-inspired interactive elements.

## [ TECH STACK LOADOUT ]
- **Core Engine:** React 19 + Vite 8
- **Styling Architecture:** Tailwind CSS v4 (Using raw OKLCH semantic theming)
- **Animation Physics:** Framer Motion (Spring-based mechanical transitions, clip-path reveals)
- **Vector Assets:** Lucide-React & Custom Inline SVGs

## [ CORE FEATURES ]
- **Terminal Decryption Typist:** Custom `[ DecryptedText ]` component that randomizes cryptographic characters before settling on the target text.
- **Optics Persistence:** Global Light/Dark mode toggled via a mechanical slider, persisting in `localStorage` with explicit FOIT (Flash of Incorrect Theme) prevention injected before React hydration.
- **Segmented Data Loaders:** Skill proficiencies represented as physical LCD-style power bars rather than standard progress bars.
- **Targeting Reticles:** Custom interactive global CSS classes (`reticle-sm`, `reticle-lg`) that generate tactical framing brackets around hover states.
- **RSA Handshake Forms:** The `[ SECURE_UPLINK ]` contact form features hardware-inspired holographic input fields with scanlines and CSS data-glitch keyframes.

---

## [ DEPLOYMENT PROTOCOL ]

### Local Deployment
To initialize the system locally, execute the following commands in your terminal:

```bash
# 1. Clone the repository
git clone https://github.com/vathsaran/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Boot local dev server
npm run dev
```

### Production Deployment (Vercel)
This repository is pre-configured and completely sanitized for **Zero-Config Vercel Deployment**.
1. Import the repository into your Vercel dashboard.
2. The framework preset will automatically detect **Vite**.
3. Deploy. The `npm run build` command will generate the highly optimized static bundle into the `/dist` directory.

---
*END OF LOG.*
