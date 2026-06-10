/**
 * AudioEngine — Deferred-Unlock with Gesture-Gated Boot
 *
 * Strategy:
 *   1. AudioContext is NEVER created until a real user gesture (click/key/touch).
 *   2. On the first gesture, we create the context, call resume(), and fire
 *      the boot sound inside the .then() callback — guaranteeing Chrome won't mute it.
 *   3. All other sounds lazily await context readiness. If the context was
 *      suspended (e.g. tab hidden and Chrome suspended it), they re-resume before playing.
 *   4. A single _bootPlayed flag prevents React Strict Mode double-invocation.
 *   5. Zero console.log in production — fail silently.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this._bootPlayed = false;
    this._wantsBoot = false;

    if (typeof document !== 'undefined') {
      this._onGesture = this._onGesture.bind(this);
      for (const e of ['click', 'keydown', 'touchstart']) {
        document.addEventListener(e, this._onGesture, { capture: true });
      }
    }
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  /** Fires once on the very first user gesture. */
  _onGesture() {
    // Remove all listeners immediately (before any async work)
    for (const e of ['click', 'keydown', 'touchstart']) {
      document.removeEventListener(e, this._onGesture, true);
    }

    if (this.ctx) return; // already created

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    try { this.ctx = new AC(); } catch (_) { return; }

    // Always call resume() — even if state is already 'running', it's a no-op
    // that resolves instantly. This handles both Chrome (running) and Brave (suspended).
    this.ctx.resume()
      .then(() => {
        // Context is now guaranteed running. Fire pending boot if requested.
        if (this._wantsBoot && !this._bootPlayed && this.enabled) {
          this._bootPlayed = true;
          this._fireBoot();
        }
      })
      .catch(() => {}); // Swallow — can't unlock, sounds just won't play
  }

  /**
   * Ensure the context is in 'running' state. Used by all play methods
   * to handle mid-session suspensions (tab hidden, etc.).
   * Returns true if ready to play.
   */
  async _ensureRunning() {
    if (!this.enabled || !this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch (_) { return false; }
    }
    return this.ctx.state === 'running';
  }

  /** Shorthand for scheduling offset */
  _t(offset = 0.02) {
    return this.ctx.currentTime + offset;
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /**
   * Request boot sound. Called from useEffect on mount.
   * If context isn't unlocked yet, parks the request for _onGesture().
   */
  playBootSound() {
    if (!this.enabled || this._bootPlayed) return;

    if (this.ctx && this.ctx.state === 'running') {
      this._bootPlayed = true;
      this._fireBoot();
    } else {
      // Park it — will fire in _onGesture → resume().then()
      this._wantsBoot = true;
    }
  }

  /** Theme toggle — mechanical clack + electric hum */
  async playThemeSwitch() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();

      // White-noise clack (filtered)
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

      const ns = this.ctx.createBufferSource();
      ns.buffer = buf;
      const nf = this.ctx.createBiquadFilter();
      nf.type = 'lowpass';
      nf.frequency.value = 900;
      const ng = this.ctx.createGain();
      ng.gain.setValueAtTime(0.12, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      ns.connect(nf); nf.connect(ng); ng.connect(this.ctx.destination);
      ns.start(t);

      // Electric hum
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(80, t);
      o.frequency.exponentialRampToValueAtTime(20, t + 0.25);
      g.gain.setValueAtTime(0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.25);
    } catch (_) {}
  }

  /** Subtle hover blip — sine sweep down */
  async playHover() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(800, t + 0.06);
      g.gain.setValueAtTime(0.015, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.06);
    } catch (_) {}
  }

  /** Fast keystroke tick */
  async playKeystroke() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t(0.005);
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(350, t);
      o.frequency.exponentialRampToValueAtTime(80, t + 0.018);
      g.gain.setValueAtTime(0.01, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.018);
    } catch (_) {}
  }

  /** Access granted — ascending two-tone chime */
  async playTerminalSuccess() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(800, t);
      o.frequency.setValueAtTime(1200, t + 0.12);
      g.gain.setValueAtTime(0.04, t);
      g.gain.setValueAtTime(0.04, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.4);
    } catch (_) {}
  }

  /** Access denied — short sawtooth buzz */
  async playTerminalError() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(100, t);
      g.gain.setValueAtTime(0.035, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.2);
    } catch (_) {}
  }

  /** Section-change sonar ping */
  async playSonarPing() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1500, t);
      g.gain.setValueAtTime(0.02, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.45);
    } catch (_) {}
  }

  /** Uplink — radio click + data burst */
  async playUplinkEstablished() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      // Radio click
      const co = this.ctx.createOscillator();
      const cg = this.ctx.createGain();
      co.type = 'square';
      co.frequency.setValueAtTime(200, t);
      cg.gain.setValueAtTime(0.035, t);
      cg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      co.connect(cg); cg.connect(this.ctx.destination);
      co.start(t); co.stop(t + 0.04);
      // Data burst
      let tt = t + 0.06;
      for (let i = 0; i < 16; i++) {
        const ro = this.ctx.createOscillator();
        const rg = this.ctx.createGain();
        ro.type = 'sawtooth';
        ro.frequency.setValueAtTime(1000 + Math.random() * 2000, tt);
        rg.gain.setValueAtTime(0.015, tt);
        rg.gain.exponentialRampToValueAtTime(0.001, tt + 0.025);
        ro.connect(rg); rg.connect(this.ctx.destination);
        ro.start(tt); ro.stop(tt + 0.025);
        tt += 0.02 + Math.random() * 0.02;
      }
    } catch (_) {}
  }

  /** Payload delivered — ascending confirmation chime */
  async playPayloadDelivered() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(1000, t);
      o.frequency.setValueAtTime(2000, t + 0.12);
      g.gain.setValueAtTime(0.04, t);
      g.gain.setValueAtTime(0.04, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.45);
    } catch (_) {}
  }

  /** Generic UI click — short percussive tap */
  async playClick() {
    if (!await this._ensureRunning()) return;
    try {
      const t = this._t();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(600, t);
      o.frequency.exponentialRampToValueAtTime(200, t + 0.04);
      g.gain.setValueAtTime(0.025, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.04);
    } catch (_) {}
  }

  // ── Internal ───────────────────────────────────────────────────────────────

  /** Actually synthesize the boot sequence. Only called when ctx is running. */
  _fireBoot() {
    try {
      const t = this._t(0.05);

      // 1. Bass sweep
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(30, t);
      o.frequency.exponentialRampToValueAtTime(150, t + 1.5);
      g.gain.setValueAtTime(0.01, t);
      g.gain.linearRampToValueAtTime(0.3, t + 0.5);
      g.gain.linearRampToValueAtTime(0.01, t + 1.5);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t + 1.5);

      // 2. Data trills
      let tt = t;
      for (let i = 0; i < 12; i++) {
        const to = this.ctx.createOscillator();
        const tg = this.ctx.createGain();
        to.type = 'square';
        to.frequency.setValueAtTime(800 + Math.random() * 800, tt);
        tg.gain.setValueAtTime(0.02, tt);
        tg.gain.exponentialRampToValueAtTime(0.001, tt + 0.05);
        to.connect(tg); tg.connect(this.ctx.destination);
        to.start(tt); to.stop(tt + 0.05);
        tt += 0.05 + Math.random() * 0.05;
      }
    } catch (_) {}
  }
}

// Singleton
export const audioSystem = new AudioEngine();
