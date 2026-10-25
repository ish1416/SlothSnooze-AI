/**
 * SlothSnooze AI - Web Audio Procedural Synthesis Engine
 * 100% Offline, Zero external samples required.
 * Generates pink noise rain, hearth crackle, 432Hz binaural delta beats,
 * modulated canopy wind, 48 BPM sloth restorative heartbeat, and singing bowl.
 */

class SlothAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.analyser = null;
    this.isInitialized = false;
    this.isPlaying = false;
    this.sleepTimer = null;
    this.sleepTimerSeconds = 0;
    this.sleepTimerInterval = null;

    // Track channels
    this.channels = {
      rain: { gain: null, source: null, volume: 0.5, active: false, filter: null },
      fire: { gain: null, interval: null, volume: 0.35, active: false },
      binaural: { gain: null, oscL: null, oscR: null, volume: 0.4, active: false },
      wind: { gain: null, source: null, lfo: null, volume: 0.3, active: false },
      heartbeat: { gain: null, interval: null, volume: 0.45, active: false },
      bowl: { gain: null, active: false, volume: 0.5 }
    };

    // Preset configurations
    this.presets = {
      rainforest: {
        name: "Misty Rainforest Canopy",
        description: "Lush tropical rainfall, swaying night wind, and restorative 432Hz delta tones.",
        channels: { rain: 0.65, wind: 0.4, binaural: 0.45, fire: 0, heartbeat: 0.3 }
      },
      hearth: {
        name: "Cozy Sloth Hearth",
        description: "Crackling birchwood fire, gentle mountain breeze, and a slow 48 BPM heart rate.",
        channels: { fire: 0.6, wind: 0.25, heartbeat: 0.5, rain: 0, binaural: 0.2 }
      },
      astral: {
        name: "Deep Delta Cosmic Drift",
        description: "Hypnotic 432Hz binaural brainwave entrainment with ambient celestial resonance.",
        channels: { binaural: 0.75, wind: 0.35, rain: 0, fire: 0, heartbeat: 0.35 }
      },
      slothnest: {
        name: "The Sloth Sanctuary",
        description: "The ultimate low-energy wind-down: canopy drizzle, deep heartbeat, and night breeze.",
        channels: { rain: 0.5, heartbeat: 0.55, wind: 0.45, fire: 0.15, binaural: 0.35 }
      }
    };
  }

  init() {
    if (this.isInitialized) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master bus
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    // Master analyser for 60FPS visualizer
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 128;
    this.analyser.smoothingTimeConstant = 0.85;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    // Initialize individual channel gain nodes
    Object.keys(this.channels).forEach(channelKey => {
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(this.channels[channelKey].volume, this.ctx.currentTime);
      g.connect(this.masterGain);
      this.channels[channelKey].gain = g;
    });

    this.isInitialized = true;
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      return this.ctx.resume();
    }
    return Promise.resolve();
  }

  // Generate 4-second looping pink noise buffer (Voss-McCartney 1/f algorithm)
  createPinkNoiseBuffer() {
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 1. RAIN SYNTHESIS
  startRain() {
    if (this.channels.rain.active) return;
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to simulate soft raindrops hitting canopy leaves
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.channels.rain.gain);
    noiseSource.start();

    this.channels.rain.source = noiseSource;
    this.channels.rain.filter = filter;
    this.channels.rain.active = true;
  }

  stopRain() {
    if (!this.channels.rain.active) return;
    try {
      this.channels.rain.source.stop();
      this.channels.rain.source.disconnect();
    } catch (e) {}
    this.channels.rain.active = false;
  }

  // 2. FIRE CRACKLE & EMBERS
  startFire() {
    if (this.channels.fire.active) return;
    this.channels.fire.active = true;

    const popCrackle = () => {
      if (!this.channels.fire.active || !this.ctx) return;
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
      }
      const popSource = this.ctx.createBufferSource();
      popSource.buffer = buffer;

      const popFilter = this.ctx.createBiquadFilter();
      popFilter.type = 'highpass';
      popFilter.frequency.setValueAtTime(800 + Math.random() * 1200, this.ctx.currentTime);

      const popGain = this.ctx.createGain();
      const popVol = (Math.random() * 0.3 + 0.1) * (this.channels.fire.volume / 0.5);
      popGain.gain.setValueAtTime(popVol, this.ctx.currentTime);

      popSource.connect(popFilter);
      popFilter.connect(popGain);
      popGain.connect(this.channels.fire.gain);

      popSource.start();
      popSource.onended = () => {
        popSource.disconnect();
        popFilter.disconnect();
        popGain.disconnect();
      };

      // Random scheduling between 60ms and 240ms for organic timber crackling
      const nextDelay = Math.random() * 180 + 60;
      this.channels.fire.interval = setTimeout(popCrackle, nextDelay);
    };

    popCrackle();
  }

  stopFire() {
    if (!this.channels.fire.active) return;
    clearTimeout(this.channels.fire.interval);
    this.channels.fire.active = false;
  }

  // 3. 432 Hz BINAURAL DELTA WAVES (2.5 Hz Delta Beat for Stage-3 Deep Sleep)
  startBinaural() {
    if (this.channels.binaural.active) return;
    const baseFreq = 432.0;
    const beatFreq = 2.5; // Delta wave (0.5 - 4 Hz) for deep restorative REM

    const oscL = this.ctx.createOscillator();
    const oscR = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscR.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    oscR.frequency.setValueAtTime(baseFreq + beatFreq, this.ctx.currentTime);

    // Left and Right stereo panners
    let panL, panR;
    if (this.ctx.createStereoPanner) {
      panL = this.ctx.createStereoPanner();
      panR = this.ctx.createStereoPanner();
      panL.pan.setValueAtTime(-1, this.ctx.currentTime);
      panR.pan.setValueAtTime(1, this.ctx.currentTime);
    } else {
      // Fallback
      panL = this.ctx.createGain();
      panR = this.ctx.createGain();
    }

    oscL.connect(panL);
    oscR.connect(panR);
    panL.connect(this.channels.binaural.gain);
    panR.connect(this.channels.binaural.gain);

    oscL.start();
    oscR.start();

    this.channels.binaural.oscL = oscL;
    this.channels.binaural.oscR = oscR;
    this.channels.binaural.active = true;
  }

  stopBinaural() {
    if (!this.channels.binaural.active) return;
    try {
      this.channels.binaural.oscL.stop();
      this.channels.binaural.oscR.stop();
      this.channels.binaural.oscL.disconnect();
      this.channels.binaural.oscR.disconnect();
    } catch (e) {}
    this.channels.binaural.active = false;
  }

  // 4. CANOPY NIGHT WIND (Sweeping Resonant Bandpass with Slow LFO)
  startWind() {
    if (this.channels.wind.active) return;
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.2, this.ctx.currentTime);

    // 0.08 Hz LFO for gentle wind gusts
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime); // Swings frequency 60Hz - 300Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseSource.connect(filter);
    filter.connect(this.channels.wind.gain);

    noiseSource.start();
    lfo.start();

    this.channels.wind.source = noiseSource;
    this.channels.wind.lfo = lfo;
    this.channels.wind.active = true;
  }

  stopWind() {
    if (!this.channels.wind.active) return;
    try {
      this.channels.wind.source.stop();
      this.channels.wind.lfo.stop();
      this.channels.wind.source.disconnect();
      this.channels.wind.lfo.disconnect();
    } catch (e) {}
    this.channels.wind.active = false;
  }

  // 5. RESTORATIVE SLOTH HEARTBEAT (48 BPM, Entraining Parasympathetic Rest)
  startHeartbeat() {
    if (this.channels.heartbeat.active) return;
    this.channels.heartbeat.active = true;

    const pulseInterval = (60 / 48) * 1000; // 1250ms per beat

    const beatSound = () => {
      if (!this.channels.heartbeat.active || !this.ctx) return;

      // Lub-dub acoustic simulation
      const playThump = (freq, duration, gainVal, delay) => {
        setTimeout(() => {
          if (!this.channels.heartbeat.active || !this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + duration);

          gain.gain.setValueAtTime(gainVal * (this.channels.heartbeat.volume / 0.5), this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

          osc.connect(gain);
          gain.connect(this.channels.heartbeat.gain);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        }, delay);
      };

      // First beat (Lub: 58Hz)
      playThump(58, 0.22, 0.45, 0);
      // Second beat (Dub: 48Hz, slightly quieter, 160ms later)
      playThump(48, 0.18, 0.32, 160);

      this.channels.heartbeat.interval = setTimeout(beatSound, pulseInterval);
    };

    beatSound();
  }

  stopHeartbeat() {
    if (!this.channels.heartbeat.active) return;
    clearTimeout(this.channels.heartbeat.interval);
    this.channels.heartbeat.active = false;
  }

  // 6. TIBETAN SINGING BOWL (Harmonic inharmonic overtones)
  playSingingBowl() {
    this.ensureContext().then(() => {
      const now = this.ctx.currentTime;
      const fundamental = 432;
      const harmonics = [fundamental, fundamental * 2.01, fundamental * 3.03];
      const gains = [0.4, 0.2, 0.12];

      harmonics.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx] * this.channels.bowl.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(gain);
        gain.connect(this.channels.bowl.gain);
        osc.start(now);
        osc.stop(now + 6.0);
      });
    });
  }

  // Channel volume adjuster
  setChannelVolume(channelKey, val) {
    if (this.channels[channelKey]) {
      this.channels[channelKey].volume = val;
      if (this.channels[channelKey].gain && this.ctx) {
        this.channels[channelKey].gain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
      }
    }
  }

  setMasterVolume(val) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.05);
    }
  }

  // Audio ducking for bedtime story narration
  duckForNarration(isSpeaking) {
    if (!this.masterGain || !this.ctx) return;
    const target = isSpeaking ? 0.25 : 0.85;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.4);
  }

  // Apply a soundscape preset
  applyPreset(presetKey) {
    const p = this.presets[presetKey];
    if (!p) return;

    this.ensureContext().then(() => {
      Object.keys(p.channels).forEach(channel => {
        const vol = p.channels[channel];
        this.setChannelVolume(channel, vol);
        if (vol > 0.05) {
          if (channel === 'rain') this.startRain();
          if (channel === 'fire') this.startFire();
          if (channel === 'binaural') this.startBinaural();
          if (channel === 'wind') this.startWind();
          if (channel === 'heartbeat') this.startHeartbeat();
        } else {
          if (channel === 'rain') this.stopRain();
          if (channel === 'fire') this.stopFire();
          if (channel === 'binaural') this.stopBinaural();
          if (channel === 'wind') this.stopWind();
          if (channel === 'heartbeat') this.stopHeartbeat();
        }
      });
      this.isPlaying = true;
    });
  }

  // Toggle all sounds (Play/Pause)
  togglePlayAll() {
    return this.ensureContext().then(() => {
      if (this.isPlaying) {
        this.stopAll();
      } else {
        // Start default preset (Rainforest)
        this.applyPreset('slothnest');
      }
      return this.isPlaying;
    });
  }

  stopAll() {
    this.stopRain();
    this.stopFire();
    this.stopBinaural();
    this.stopWind();
    this.stopHeartbeat();
    this.isPlaying = false;
  }

  // Sleep Timer with smooth fadeout in final 60 seconds
  startSleepTimer(minutes, onTick, onComplete) {
    this.clearSleepTimer();
    this.sleepTimerSeconds = minutes * 60;

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerSeconds--;

      if (this.sleepTimerSeconds <= 60 && this.sleepTimerSeconds > 0) {
        // Smooth fade out
        if (this.masterGain && this.ctx) {
          const fadeVol = (this.sleepTimerSeconds / 60) * 0.85;
          this.masterGain.gain.setValueAtTime(Math.max(0, fadeVol), this.ctx.currentTime);
        }
      }

      if (onTick) onTick(this.sleepTimerSeconds);

      if (this.sleepTimerSeconds <= 0) {
        this.clearSleepTimer();
        this.stopAll();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  clearSleepTimer() {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    this.sleepTimerSeconds = 0;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    }
  }

  // Get live frequency data for 60FPS visualizer
  getFrequencyData(array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }
}

window.SlothAudio = new SlothAudioEngine();
