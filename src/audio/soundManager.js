// Web Audio API Synthesizer & Spectrum Analyzer for Active Theory Style HUD

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;
    this.muted = localStorage.getItem('eworld_sound_muted') === 'true';
    this.initialized = false;
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 64;
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        this.initialized = true;

        if (!this.muted) {
          this.startSubtleAmbient();
        }
      }
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) {
      this.init();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  startSubtleAmbient() {
    try {
      if (!this.audioCtx || this.ambientOsc) return;
      this.ambientOsc = this.audioCtx.createOscillator();
      this.ambientGain = this.audioCtx.createGain();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(55, this.audioCtx.currentTime); // Low 55Hz subtle drone

      this.ambientGain.gain.setValueAtTime(0.004, this.audioCtx.currentTime);

      this.ambientOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      this.ambientOsc.start();
    } catch (e) {}
  }

  stopSubtleAmbient() {
    try {
      if (this.ambientOsc) {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
        this.ambientOsc = null;
      }
    } catch (e) {}
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('eworld_sound_muted', this.muted);

    if (this.muted) {
      this.stopSubtleAmbient();
    } else {
      this.ensureContext();
      this.startSubtleAmbient();
      this.playSuccess();
    }
    return this.muted;
  }

  // Get live frequency data for HUD wave visualizer
  getFrequencyData() {
    if (!this.analyser || this.muted) return [2, 4, 3, 6, 4, 2, 5, 3];
    this.analyser.getByteFrequencyData(this.dataArray);
    return Array.from(this.dataArray.slice(0, 8)).map((v) => Math.max(2, Math.floor(v / 18)));
  }

  // Active Theory precise click
  playClick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch (e) {}
  }

  // Active Theory scene slide warp
  playSlideWarp() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const filter = this.audioCtx.createBiquadFilter();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.25);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch (e) {}
  }

  playHover() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      const now = this.audioCtx.currentTime;
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.03);

      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.015, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.2);

        osc.connect(gain);
        gain.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.22);
      });
    } catch (e) {}
  }
}

export const soundManager = new SoundManager();
