class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Hardcoded to true for now, can be toggled later
    this.isInitialized = false;
  }

  init() {
    if (typeof window === 'undefined') return false;
    
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.warn("[AudioSystem] Web Audio API not supported in this browser.");
        return false;
      }
      try {
        this.ctx = new AudioContext();
        console.log("[AudioSystem] AudioContext created. State:", this.ctx.state);
      } catch (e) {
        console.error("[AudioSystem] Failed to create AudioContext:", e);
        return false;
      }
    }
    
    this.isInitialized = true;
    return true;
  }

  // Heavy mechanical clack + electric surge
  async playThemeSwitch() {
    if (!this.enabled) return;
    
    if (!this.init() || !this.ctx) {
      console.warn("[AudioSystem] Theme switch aborted: Engine not ready.");
      return;
    }
    
    if (this.ctx.state === 'suspended') {
      try {
        console.log("[AudioSystem] Attempting to resume suspended context for Theme Switch...");
        await this.ctx.resume();
        console.log("[AudioSystem] Context resumed successfully. State:", this.ctx.state);
      } catch (e) {
        console.warn("[AudioSystem] Could not resume context.", e);
        return;
      }
    }
    
    if (this.ctx.state !== 'running') {
      console.warn("[AudioSystem] Theme switch aborted: Context state is", this.ctx.state);
      return;
    }
    
    console.log("[AudioSystem] Playing Theme Switch sound...");
    try {
      const t = this.ctx.currentTime + 0.02; // Small offset for scheduling safety
      
      // 1. Mechanical Clack (White noise burst)
      const bufferSize = this.ctx.sampleRate * 0.05; // 50ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = buffer;
      
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 1000;
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.8, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
      
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      
      noiseSource.start(t);

      // 2. Electric hum (Low frequency sawtooth descending)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(20, t + 0.3);
      
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.3);
    } catch(e) {
      console.error("[AudioSystem] Theme switch audio play failed:", e);
    }
  }

  // Low bass sweep up + high-tech trill
  playBootSound() {
    if (!this.enabled) return;
    
    console.log("[AudioSystem] Attempting to play Boot Sound...");
    if (!this.init() || !this.ctx) {
      console.warn("[AudioSystem] Boot sound aborted: Engine not ready.");
      return;
    }
    
    // Do NOT attempt to resume() here, as it will hang indefinitely waiting for user interaction!
    if (this.ctx.state === 'suspended') {
      console.warn("[AudioSystem] Boot sound aborted: Context is suspended (Browser autoplay policy blocked initial load).");
      return;
    }
    
    if (this.ctx.state !== 'running') {
      console.warn("[AudioSystem] Boot sound aborted: Context state is", this.ctx.state);
      return;
    }
    
    console.log("[AudioSystem] Playing Boot sound...");
    try {
      const t = this.ctx.currentTime + 0.02;

      // 1. Bass sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(30, t);
      osc.frequency.exponentialRampToValueAtTime(150, t + 1.5);
      
      gain.gain.setValueAtTime(0.01, t); // Start low to avoid click
      gain.gain.linearRampToValueAtTime(0.4, t + 0.5);
      gain.gain.linearRampToValueAtTime(0.01, t + 1.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 1.5);

      // 2. High tech data trills
      let trillTime = t;
      for (let i = 0; i < 15; i++) {
        const trillOsc = this.ctx.createOscillator();
        const trillGain = this.ctx.createGain();
        
        trillOsc.type = 'square';
        // Random frequency between 800 and 1600 Hz
        trillOsc.frequency.setValueAtTime(800 + Math.random() * 800, trillTime);
        
        trillGain.gain.setValueAtTime(0.03, trillTime);
        trillGain.gain.exponentialRampToValueAtTime(0.001, trillTime + 0.05);
        
        trillOsc.connect(trillGain);
        trillGain.connect(this.ctx.destination);
        
        trillOsc.start(trillTime);
        trillOsc.stop(trillTime + 0.05);
        
        trillTime += 0.05 + Math.random() * 0.05; // Random interval
      }
    } catch(e) {
      console.error("[AudioSystem] Boot sound play failed:", e);
    }
  }

  // Very subtle blip
  async playHover() {
    if (!this.enabled) return;
    
    if (!this.init() || !this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        return;
      }
    }
    
    if (this.ctx.state !== 'running') return;
    
    try {
      const t = this.ctx.currentTime + 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.05);
      
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.05);
    } catch(e) {
      // fail silently
    }
  }

  // Fast mechanical keystroke click
  async playKeystroke() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.01;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.02);
      
      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.02);
    } catch(e) {}
  }

  // Access Granted Chime
  async playTerminalSuccess() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.setValueAtTime(1200, t + 0.1); // jump up
      
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.setValueAtTime(0.05, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.4);
    } catch(e) {}
  }

  // Access Denied Buzz
  async playTerminalError() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.setValueAtTime(100, t + 0.1);
      
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.2);
    } catch(e) {}
  }

  // Sonar Ping for mapping new sectors
  async playSonarPing() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500, t);
      
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.5);
    } catch(e) {}
  }

  // Uplink Established (Radio click + Data burst)
  async playUplinkEstablished() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.02;
      
      // Radio click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'square';
      clickOsc.frequency.setValueAtTime(200, t);
      clickGain.gain.setValueAtTime(0.05, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.05);
      
      // Data burst
      let trillTime = t + 0.05;
      for (let i = 0; i < 20; i++) {
        const trillOsc = this.ctx.createOscillator();
        const trillGain = this.ctx.createGain();
        trillOsc.type = 'sawtooth';
        trillOsc.frequency.setValueAtTime(1000 + Math.random() * 2000, trillTime);
        trillGain.gain.setValueAtTime(0.02, trillTime);
        trillGain.gain.exponentialRampToValueAtTime(0.001, trillTime + 0.03);
        trillOsc.connect(trillGain);
        trillGain.connect(this.ctx.destination);
        trillOsc.start(trillTime);
        trillOsc.stop(trillTime + 0.03);
        trillTime += 0.02 + Math.random() * 0.02;
      }
    } catch(e) {}
  }

  // Payload Delivered Chime
  async playPayloadDelivered() {
    if (!this.enabled || !this.init() || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const t = this.ctx.currentTime + 0.02;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, t);
      osc.frequency.setValueAtTime(2000, t + 0.1);
      
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.setValueAtTime(0.05, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.5);
    } catch(e) {}
  }
}

// Export a singleton instance
export const audioSystem = new AudioEngine();
