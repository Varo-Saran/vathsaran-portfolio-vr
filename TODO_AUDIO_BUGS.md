# Audio System Bugs & Quirks

> **Status as of 2026-06-10** — All three original bugs have been resolved by switching to the
> *Deferred-Unlock Pattern* in `audioSystem.js`. Notes kept below for historical reference.

---

## ✅ FIXED — Chromium Silent Playback

- **Root cause**: The `AudioContext` was being created on module load (before any user gesture).
  Chrome technically allowed `state: running` in that case (due to high MEI score), but still
  silently muted all oscillator output because it detected autoplay evasion.
- **Fix**: The `AudioContext` is now **never created until the first user gesture**
  (`click`, `keydown`, or `touchstart`). A one-time capture-phase listener on `window` handles
  this. Contexts created inside a gesture handler are guaranteed to start in `running` state and
  are never muted.

---

## ✅ FIXED — React Strict Mode Double Boot Sound

- **Root cause**: React 18 Strict Mode double-invokes `useEffect` in development. The `playBootSound()`
  call inside the mount effect was therefore called twice, creating two overlapping boot sequences.
- **Fix**: A `_bootPlayed` flag on the singleton ensures `_doPlayBoot()` can only execute once per
  page session, regardless of how many times `playBootSound()` is called.

---

## ✅ FIXED — Boot Sound Never Playing on Hard Refresh

- **Root cause**: On a hard refresh, the `AudioContext` started `suspended`. `playBootSound()` aborted
  immediately. By the time the user clicked (e.g. the theme toggle), the boot window had passed.
- **Fix**: If `playBootSound()` is called before the gesture arrives, it sets `_pendingBoot = true`
  instead of aborting. The gesture handler (`_onFirstGesture`) checks this flag and fires the boot
  sound immediately after unlocking the context.
- **HMR Quirk (informational)**: The boot sound was previously observed to play only during Vite HMR
  hot-swaps. This was because HMR remounted the component while the user's previous gesture kept
  the context alive. This quirk is now irrelevant since boot always plays on first gesture.

---

## Future Improvements (Not Bugs)

- Consider adding a `DynamicsCompressorNode` as a master bus to prevent clipping when multiple
  oscillators play simultaneously (e.g. during the boot trill).
- The `playKeystroke` throttling could be improved — rapid typing fires many overlapping nodes.
  A simple timestamp debounce (e.g. min 30ms between keystrokes) would reduce audio CPU load.
