/**
 * AudioEngine — Deferred-Unlock Pattern
 *
 * The AudioContext is NOT created on page load. Instead, it is created and
 * immediately unlocked on the very first user gesture (click/keydown/touchstart).
 * At that moment the boot sound plays. Every subsequent sound just checks
 * this.ctx.state === 'running', with no resume() gymnastics needed.
 *
 * This solves:
 *  - Chromium silent playback (context was created before gesture → muted)
 *  - React Strict Mode double-invoke (second call is a no-op via bootPlayed guard)
 *  - Boot sound never playing on hard refresh (now always plays on first click)
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this._bootPlayed = false;
    this._unlockBound = this._onFirstGesture.bind(this);
    this._pendingBoot = false;

    if (typeof window !== 'undefined') {
      // Register gesture listeners immediately so we catch the very first click
      window.addEventListener('click',      this._unlockBound, { once: true, capture: true });
      window.addEventListener('keydown',    this._unlockBound, { once: true, capture: true });
      window.addEventListener('touchstart', this._unlockBound, { once: true, capture: true });
    }
  }

  /** Called once on the first user gesture anywhere on the page */
  _onFirstGesture() {
    if (this.ctx) return; // already unlocked

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    try {
      this.ctx = new AudioContext();
      // Context created during a gesture is guaranteed to be 'running' in all browsers
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      return;
    }

    // If someone called playBootSound() before the gesture arrived, fire it now
    if (this._pendingBoot) {
      this._pendingBoot = false;
      this._doPlayBoot();
    }
  }

  /** Schedule t = currentTime + offset, safe to call any time after unlock */
  _t(offset = 0.02) {
    return this.ctx.currentTime + offset;
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Request a boot sound. If the AudioContext isn't unlocked yet (e.g. called
   * from a useEffect before any click), set a pending flag so it fires on the
   * first gesture instead of silently failing.
   */
  playBootSound() {
    if (!this.enabled || this._bootPlayed) return;
    this._bootPlayed = true; // prevent Strict Mode double-invoke

    if (!this.ctx || this.ctx.state !== 'running') {
      // Park it — will fire in _onFirstGesture
      this._pendingBoot = true;
      return;
    }

    this._doPlayBoot();
  }

  _doPlayBoot() {
    if (!this.ctx) return;
    try {
      const t = this._t(0.05);

      // 1. Bass sweep
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(30, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 1.5);
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.5);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 1.5);

      // 2. High-tech data trills
      let trillTime = t;
      for (let i = 0; i < 15; i++) {
        const to = this.ctx.createOscillator();
        const tg = this.ctx.createGain();
        to.type = 'square';
        to.frequency.setValueAtTime(800 + Math.random() * 800, trillTime);
        tg.gain.setValueAtTime(0.025, trillTime);
        tg.gain.exponentialRampToValueAtTime(0.001, trillTime + 0.05);
        to.connect(tg);
        tg.connect(this.ctx.destination);
        to.start(trillTime);
        to.stop(trillTime + 0.05);
        trillTime += 0.05 + Math.random() * 0.05;
      }
    } catch (_) {}
  }

  /** Heavy mechanical clack + electric surge */
  async playThemeSwitch() {
    if (!this._ready()) return;
    try {
      const t = this._t();

      // Mechanical clack (filtered white noise)
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise      = this.ctx.createBufferSource();
      noise.buffer     = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 1000;
      const noiseGain  = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.7, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(t);

      // Electric hum
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    } catch (_) {}
  }

  /** Very subtle hover blip */
  async playHover() {
    if (!this._ready()) return;
    try {
      const t = this._t();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
      gain.gain.setValueAtTime(0.018, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch (_) {}
  }

  /** Fast mechanical keystroke click */
  async playKeystroke() {
    if (!this._ready()) return;
    try {
      const t = this._t(0.01);
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.02);
      gain.gain.setValueAtTime(0.012, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.02);
    } catch (_) {}
  }

  /** Access Granted — ascending two-tone chime */
  async playTerminalSuccess() {
    if (!this._ready()) return;
    try {
      const t = this._t();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800,  t);
      osc.frequency.setValueAtTime(1200, t + 0.12);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.setValueAtTime(0.05, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch (_) {}
  }

  /** Access Denied — short sawtooth buzz */
  async playTerminalError() {
    if (!this._ready()) return;
    try {
      const t = this._t();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (_) {}
  }

  /** Sonar ping on section change */
  async playSonarPing() {
    if (!this._ready()) return;
    try {
      const t = this._t();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, t);
      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch (_) {}
  }

  /** Uplink Established — radio click + data burst */
  async playUplinkEstablished() {
    if (!this._ready()) return;
    try {
      const t = this._t();

      // Radio click
      const co = this.ctx.createOscillator();
      const cg = this.ctx.createGain();
      co.type = 'square';
      co.frequency.setValueAtTime(200, t);
      cg.gain.setValueAtTime(0.04, t);
      cg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      co.connect(cg);
      cg.connect(this.ctx.destination);
      co.start(t);
      co.stop(t + 0.05);

      // Data burst
      let tt = t + 0.06;
      for (let i = 0; i < 20; i++) {
        const to = this.ctx.createOscillator();
        const tg = this.ctx.createGain();
        to.type = 'sawtooth';
        to.frequency.setValueAtTime(1000 + Math.random() * 2000, tt);
        tg.gain.setValueAtTime(0.018, tt);
        tg.gain.exponentialRampToValueAtTime(0.001, tt + 0.03);
        to.connect(tg);
        tg.connect(this.ctx.destination);
        to.start(tt);
        to.stop(tt + 0.03);
        tt += 0.02 + Math.random() * 0.02;
      }
    } catch (_) {}
  }

  /** Payload Delivered — ascending confirmation chime */
  async playPayloadDelivered() {
    if (!this._ready()) return;
    try {
      const t = this._t();
      const osc  = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, t);
      osc.frequency.setValueAtTime(2000, t + 0.12);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.setValueAtTime(0.05, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.5);
    } catch (_) {}
  }

  // ─── Internal helpers ─────────────────────────────────────────────────────

  /** Returns true only if audio is enabled AND the context is live */
  _ready() {
    return this.enabled && this.ctx && this.ctx.state === 'running';
  }
}

// Singleton — one instance shared across the whole app
export const audioSystem = new AudioEngine();
