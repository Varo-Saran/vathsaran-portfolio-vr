class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Hardcoded to true for now, can be toggled later
    this.isInitialized = false;
  }

  init() {
    if (typeof window === 'undefined') return;
    
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isInitialized = true;
  }

  // Heavy mechanical clack + electric surge
  playThemeSwitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const t = this.ctx.currentTime;
      
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
      console.warn("Audio play failed", e);
    }
  }

  // Low bass sweep up + high-tech trill
  playBootSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    // Note: Autoplay policies might block this if user hasn't interacted with page yet.
    // It will just fail silently or log a warning in console.
    try {
      const t = this.ctx.currentTime;

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
      console.warn("Audio play failed", e);
    }
  }

  // Very subtle blip
  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const t = this.ctx.currentTime;
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
}

// Export a singleton instance
export const audioSystem = new AudioEngine();
