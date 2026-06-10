# Audio System Bugs & Quirks

## Chromium Silent Playback Bug
- **Issue**: On Chrome (and sometimes Edge), the `AudioContext` initializes in a `running` state instead of `suspended` even without a user gesture (sometimes due to MEI score). When the user clicks the theme toggle, the console logs `[AudioSystem] Playing Theme Switch sound...` but **no sound is actually heard**.
- **Logs**:
  ```
  [AudioSystem] Attempting to play Boot Sound...
  [AudioSystem] AudioContext created. State: running
  [AudioSystem] Playing Boot sound...
  [AudioSystem] Playing Theme Switch sound...
  ```
- **Potential Causes to Investigate**:
  1. Chromium might be aggressively muting Web Audio API gain nodes if it suspects autoplay evasion, despite reporting `running`.
  2. The scheduling offset (`currentTime + 0.02`) might need to be dynamically adjusted based on `baseLatency` or `outputLatency`.
  3. React Strict Mode is double-invoking the `useEffect` (seen in logs as duplicate `Playing Boot sound...`), which might be creating multiple parallel AudioContexts or oscillator nodes that cancel each other out or cause browser throttling.
  4. The generated white-noise buffer might be triggering a clipping limiter in Chrome's audio pipeline.
  
## Browser Autoplay Policy (Brave / Safari)
- **Issue**: On strict browsers like Brave, the context correctly starts `suspended`. The `playBootSound` is aborted as intended. When clicking the theme toggle, it resumes and plays the theme switch. This behaves correctly, but means the boot sound is intentionally lost on first load.
- **Logs**:
  ```
  [AudioSystem] Attempting to play Boot Sound...
  [AudioSystem] AudioContext created. State: suspended
  [AudioSystem] Boot sound aborted: Context is suspended (Browser autoplay policy blocked initial load).
  ```

## Future Fixes to Try
- Ensure `audioSystem` uses a singleton `AudioContext` reliably across React Strict Mode re-renders.
- Test replacing the mathematically synthesized Web Audio API nodes with simple HTML5 `<audio>` tags or Howler.js to see if Chrome treats standard `.mp3` or `.wav` playback differently than synthesized oscillator nodes.
- Add a "Click to Enter" overlay on the entire site to guarantee a user gesture before the application mounts, thus unlocking the `AudioContext` perfectly for the Boot Sound and subsequent interactions.
