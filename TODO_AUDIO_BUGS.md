# Audio System Bugs & Quirks

> **Status as of 2026-06-10** — All known bugs resolved via Deferred-Unlock with
> Gesture-Gated Boot pattern. Volume balancing applied. Notes kept for reference.

---

## ✅ FIXED — Chromium Silent Playback

- **Root cause**: `AudioContext` was created before any user gesture. Chrome let it
  report `state: running` (MEI-based), but silently muted all oscillator output.
- **Fix (v3)**: Context is now created exclusively inside a `document`-level capture-phase
  event listener (`click`/`keydown`/`touchstart`). `resume()` is always called, and boot
  sound fires inside the `.then()` callback — ensuring the context is truly running
  before any audio nodes are scheduled.

---

## ✅ FIXED — React Strict Mode Double Boot

- **Root cause**: Strict Mode double-invokes `useEffect`. `playBootSound()` ran twice.
- **Fix**: `_bootPlayed` flag makes it idempotent — only first call counts.

---

## ✅ FIXED — Boot Sound Never Playing on Hard Refresh

- **Root cause**: Context started `suspended`, `playBootSound()` aborted, and the boot
  window was lost. By the time the user clicked, boot was already skipped.
- **Fix**: `playBootSound()` sets `_wantsBoot = true` when context isn't ready. The
  gesture handler checks this flag in `resume().then()` and fires boot immediately
  after the context is confirmed running.

---

## ✅ FIXED — Theme Switch Too Loud

- **Root cause**: White-noise gain was `0.7` and oscillator gain was `0.15`, while
  hover/sonar/terminal sounds were at `0.015–0.04`.
- **Fix**: Reduced noise to `0.12`, hum to `0.04`. Volume hierarchy is now:
  `Boot > Theme/Terminal > Sonar/Hover > Keystroke`

---

## ✅ FIXED — Hover Sounds Missing on Many Elements

- **Root cause**: `onMouseEnter → audioSystem.playHover()` was only wired in
  `GlobalLayout` nav nodes, `ContactForm` social buttons, and transmit button.
- **Fix**: Added hover sounds to Hero CTAs (INITIATE_CONTACT, DOWNLOAD_DATASET),
  Hero social links, map scan button, telemetry overlay toggle, project cards in
  ProjectsBank, and StickyTerminal open buttons (desktop + mobile).

---

## Non-Issues / Informational

- **HMR Boot Sound**: Boot sound plays during Vite HMR because the component remounts
  while the user's previous gesture keeps the context alive. This is expected and not a bug.

## Future Improvements

- Add `DynamicsCompressorNode` as master bus to prevent clipping during boot trill.
- Debounce `playKeystroke` (min 30ms gap) to reduce CPU load on fast typing.
- Consider `localStorage` persistence for mute preference.
