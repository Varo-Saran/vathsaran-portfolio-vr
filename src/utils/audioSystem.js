/**
 * AudioEngine — Lazy-Init Singleton
 *
 * Architecture:
 *   - AudioContext is created lazily on the first play call that happens during
 *     a user gesture (click, keydown, touchstart).
 *   - _ensureRunning() handles creation + resume in one step.
 *   - Boot sound is special: registered via playBootSound() from useEffect,
 *     parked as _wantsBoot, and fires on the first gesture via document listeners.
 *   - Muted by default for new users (enabled = false).
 *   - Mute state is persisted via localStorage key 'audio_preference'.
 *   - Zero console output.
 */

const STORAGE_KEY = 'audio_preference';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this._bootPlayed = false;
    this._wantsBoot = false;

    // Default: muted for new visitors. Returning users get their preference.
    const stored = typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;
    this.enabled = stored === 'unmuted';

    if (typeof document !== 'undefined') {
      this._gestureHandler = this._onGesture.bind(this);
      for (const e of ['click', 'keydown', 'touchstart']) {
        document.addEventListener(e, this._gestureHandler, true);
      }
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  /** Fires on every user gesture until context is created. */
  _onGesture() {
    if (this.ctx) {
      // Context exists — remove listeners, we're done
      this._removeGestureListeners();
      // If boot was requested and context is running, fire it
      if (this._wantsBoot && !this._bootPlayed && this.enabled && this.ctx.state === 'running') {
        this._bootPlayed = true;
        this._fireBoot();
      }
      return;
    }

    // Create context inside user gesture (Chrome guarantees no silent-mute)
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { this.ctx = new AC(); } catch (_) { return; }

    // Always resume — even if Chrome reports 'running', this is a no-op
    this.ctx.resume()
      .then(() => {
        this._removeGestureListeners();
        if (this._wantsBoot && !this._bootPlayed && this.enabled) {
          this._bootPlayed = true;
          this._fireBoot();
        }
      })
      .catch(() => {});
  }

  _removeGestureListeners() {
    if (!this._gestureHandler) return;
    for (const e of ['click', 'keydown', 'touchstart']) {
      document.removeEventListener(e, this._gestureHandler, true);
    }
    this._gestureHandler = null;
  }

  /**
   * Ensures the AudioContext exists and is running.
   * Creates it lazily if needed (works when called from a user gesture).
   * Returns true if ready to play.
   */
  async _ensureRunning() {
    if (!this.enabled) return false;

    // Lazy-create if no gesture listener caught it yet
    if (!this.ctx) {
      if (typeof window === 'undefined') return false;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try { this.ctx = new AC(); } catch (_) { return false; }
    }

    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch (_) { return false; }
    }

    return this.ctx.state === 'running';
  }

  _t(offset = 0.015) {
    return this.ctx.currentTime + offset;
  }

  /** Persist mute preference */
  setEnabled(on) {
    this.enabled = on;
    try { localStorage.setItem(STORAGE_KEY, on ? 'unmuted' : 'muted'); } catch (_) {}
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Boot sound — called from useEffect on mount.
   * Parks the request if context isn't ready; gesture handler fires it later.
   */
  playBootSound() {
    if (!this.enabled || this._bootPlayed) return;
    if (this.ctx && this.ctx.state === 'running') {
      this._bootPlayed = true;
      this._fireBoot();
    } else {
      this._wantsBoot = true;
    }
  }

  /**
   * Theme toggle — soft mechanical relay click.
   * Short, snappy, not overpowering.
   */
  async playThemeSwitch() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();

      // Filtered noise snap (very short, low volume)
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.025, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = this.ctx.createBufferSource();
      ns.buffer = buf;
      const nf = this.ctx.createBiquadFilter();
      nf.type = 'bandpass';
      nf.frequency.value = 800;
      nf.Q.value = 2;
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.06, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
      ns.connect(nf); nf.connect(ng); ng.connect(this.ctx.destination);
      ns.start(t);

      // Subtle electric tick
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.08);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.08);
    } catch (_) {}
  }

  /** Hover — tiny digital pip, barely there */
  async playHover() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1100, t);
      o.frequency.exponentialRampToValueAtTime(700, t + 0.04);
      g.gain.setValueAtTime(0.012, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.04);
    } catch (_) {}
  }

  /** Keystroke — fast tick */
  async playKeystroke() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t(0.005);
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(350, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.015);
      g.gain.setValueAtTime(0.008, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.015);
    } catch (_) {}
  }

  /** Terminal success — clean two-tone "access granted" chime */
  async playTerminalSuccess() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      // Two quick ascending tones
      const o1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(600, t);
      g1.gain.setValueAtTime(0.03, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      o1.connect(g1); g1.connect(this.ctx.destination);
      o1.start(t); o1.stop(t + 0.12);

      const o2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(900, t + 0.08);
      g2.gain.setValueAtTime(0.001, t);
      g2.gain.setValueAtTime(0.03, t + 0.08);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o2.connect(g2); g2.connect(this.ctx.destination);
      o2.start(t + 0.08); o2.stop(t + 0.3);
    } catch (_) {}
  }

  /** Terminal error — low buzz */
  async playTerminalError() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(90, t);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.18);
    } catch (_) {}
  }

  /**
   * Section scroll — short radar tick (NOT a notification chime).
   * Brief filtered noise burst with a subtle low click.
   */
  async playSonarPing() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();

      // Short noise tick
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.015, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = this.ctx.createBufferSource();
      ns.buffer = buf;
      const nf = this.ctx.createBiquadFilter();
      nf.type = 'highpass';
      nf.frequency.value = 2000;
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.02, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      ns.connect(nf); nf.connect(ng); ng.connect(this.ctx.destination);
      ns.start(t);

      // Subtle low click underneath
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(200, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.03);
      g.gain.setValueAtTime(0.015, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.03);
    } catch (_) {}
  }

  /** Uplink — radio click + data burst */
  async playUplinkEstablished() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const co = this.ctx.createOscillator();
      const cg = this.ctx.createGain();
      co.type = 'square';
      co.frequency.setValueAtTime(200, t);
      cg.gain.setValueAtTime(0.025, t);
      cg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      co.connect(cg); cg.connect(this.ctx.destination);
      co.start(t); co.stop(t + 0.04);

      let tt = t + 0.06;
      for (let i = 0; i < 12; i++) {
        const ro = this.ctx.createOscillator();
        const rg = this.ctx.createGain();
        ro.type = 'sawtooth';
        ro.frequency.setValueAtTime(1000 + Math.random() * 2000, tt);
        rg.gain.setValueAtTime(0.012, tt);
        rg.gain.exponentialRampToValueAtTime(0.001, tt + 0.02);
        ro.connect(rg); rg.connect(this.ctx.destination);
        ro.start(tt); ro.stop(tt + 0.02);
        tt += 0.02 + Math.random() * 0.015;
      }
    } catch (_) {}
  }

  /** Payload delivered — ascending confirmation */
  async playPayloadDelivered() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o1 = this.ctx.createOscillator();
      const g1 = this.ctx.createGain();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(800, t);
      g1.gain.setValueAtTime(0.03, t);
      g1.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o1.connect(g1); g1.connect(this.ctx.destination);
      o1.start(t); o1.stop(t + 0.15);

      const o2 = this.ctx.createOscillator();
      const g2 = this.ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(1200, t + 0.1);
      g2.gain.setValueAtTime(0.001, t);
      g2.gain.setValueAtTime(0.03, t + 0.1);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o2.connect(g2); g2.connect(this.ctx.destination);
      o2.start(t + 0.1); o2.stop(t + 0.4);
    } catch (_) {}
  }

  /** Generic click — percussive tap */
  async playClick() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      // Noise transient
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.01, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const ns = this.ctx.createBufferSource();
      ns.buffer = buf;
      const nf = this.ctx.createBiquadFilter();
      nf.type = 'bandpass';
      nf.frequency.value = 1500;
      nf.Q.value = 3;
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.04, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
      ns.connect(nf); nf.connect(ng); ng.connect(this.ctx.destination);
      ns.start(t);

      // Tonal body
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(500, t);
      o.frequency.exponentialRampToValueAtTime(150, t + 0.03);
      g.gain.setValueAtTime(0.02, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.03);
    } catch (_) {}
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  _fireBoot() {
    try {
      const t = this._t(0.04);

      // Bass sweep
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(30, t);
      o.frequency.exponentialRampToValueAtTime(150, t + 1.2);
      g.gain.setValueAtTime(0.01, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.4);
      g.gain.linearRampToValueAtTime(0.01, t + 1.2);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 1.2);

      // Data trills
      let tt = t;
      for (let i = 0; i < 10; i++) {
        const to = this.ctx.createOscillator();
        const tg = this.ctx.createGain();
        to.type = 'square';
        to.frequency.setValueAtTime(800 + Math.random() * 800, tt);
        tg.gain.setValueAtTime(0.015, tt);
        tg.gain.exponentialRampToValueAtTime(0.001, tt + 0.04);
        to.connect(tg); tg.connect(this.ctx.destination);
        to.start(tt); to.stop(tt + 0.04);
        tt += 0.04 + Math.random() * 0.04;
      }
    } catch (_) {}
  }
}

// Singleton
export const audioSystem = new AudioEngine();
