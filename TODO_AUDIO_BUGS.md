# Audio System Bugs & Quirks

> **Status as of 2026-06-15** — All known bugs resolved. Audio is muted by default
> for new visitors. Mute preference persists via localStorage.

---

## ✅ FIXED — Chrome Silent Playback (v4 — Lazy-Init)

- **Root cause**: Previous versions created the `AudioContext` in a capture-phase
  gesture listener, but Chrome sometimes failed to recognize this as a valid user
  activation (especially with `{ once: true }` + capture phase).
- **Fix**: `_ensureRunning()` now lazily creates the AudioContext inside any play
  method that's called from a user gesture (onClick, onKeyDown, etc.). This is the
  standard Web Audio pattern used by game engines. The gesture listener is kept as
  a secondary path specifically for the boot sound.

---

## ✅ FIXED — React Strict Mode Double Boot

- **Fix**: `_bootPlayed` flag — only the first call counts.

---

## ✅ FIXED — Boot Sound Timing

- **Fix**: `playBootSound()` sets `_wantsBoot = true` when context isn't ready.
  The gesture handler fires boot inside `resume().then()`. For new visitors
  (muted by default), boot simply doesn't play — expected behavior.

---

## ✅ FIXED — Theme Switch Volume Imbalance

- **Previous**: White noise at `0.7`, oscillator at `0.15`. Way too loud.
- **Current**: Bandpass-filtered noise at `0.06`, sine tick at `0.025`.
  Now proportional to hover (`0.012`) and sonar (`0.02`).

---

## ✅ FIXED — Sonar Ping Sounded Like Notification

- **Previous**: Pure 1500Hz sine sustained for 0.5s — sounded like a phone notification.
- **Current**: Short highpass-filtered noise burst (15ms) + low sine click (30ms).
  Sounds like a CRT radar tick, much more appropriate for section transitions.

---

## ✅ FIXED — Hover Sounds Missing on Many Elements

- **Coverage now**: Hero CTAs, Hero social links, map scan button, telemetry
  overlay toggle, SkillsLoadout modules, ProjectsBank rows, OperationsRecord
  items, StickyTerminal buttons, ContactForm social links, GlobalLayout nav
  nodes + social buttons.

---

## ✅ FIXED — Mute by Default

- New visitors start muted. Preference saved to `localStorage` key `audio_preference`.
- `audioSystem.setEnabled(bool)` handles persistence.
- Unmute button plays a confirmation click sound.

---

## Design: Volume Hierarchy

| Sound | Peak Gain | Context |
|---|---|---|
| Boot bass | 0.25 | One-time, on first gesture |
| Boot trills | 0.015 | Layered with bass |
| Click (unmute confirm) | 0.04 + 0.02 | Noise + tone |
| Theme switch | 0.06 + 0.025 | Intentional action |
| Terminal success | 0.03 | Command feedback |
| Terminal error | 0.025 | Command feedback |
| Sonar (section scroll) | 0.02 + 0.015 | Passive, subtle |
| Uplink | 0.025 + 0.012 | Form interaction |
| Hover | 0.012 | Ambient, very subtle |
| Keystroke | 0.008 | Rapid fire, quietest |

## Future Improvements

- `DynamicsCompressorNode` as master bus to prevent clipping during boot.
- Debounce `playKeystroke` (min 30ms gap) for fast typing.
- `localStorage` persistence already implemented for mute preference.
