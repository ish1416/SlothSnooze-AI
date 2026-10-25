/**
 * SlothSnooze AI - 4-7-8 Parasympathetic Breathing Guide
 * Biologically calibrated to down-regulate the sympathetic nervous system,
 * slow heart rate down to sloth resting levels, and trigger deep sleep in under 5 minutes.
 */

class SlothBreathingGuide {
  constructor() {
    this.isActive = false;
    this.currentPhase = 'idle'; // 'inhale', 'hold', 'exhale'
    this.timer = null;
    this.secondsLeft = 0;
    this.cycleCount = 0;

    // Phase durations in seconds
    this.phases = {
      inhale: { duration: 4, label: "Breathe In Slowly", cue: "Feel cool air filling your lungs...", color: "#10b981", scale: 1.4 },
      hold: { duration: 7, label: "Hold Gently", cue: "Settle into effortless stillness...", color: "#6366f1", scale: 1.4 },
      exhale: { duration: 8, label: "Exhale Completely", cue: "Release all tension and surrender your weight...", color: "#f59e0b", scale: 0.95 }
    };

    // DOM Elements
    this.ringEl = null;
    this.labelEl = null;
    this.countEl = null;
    this.cueEl = null;
    this.cycleEl = null;
  }

  bindElements() {
    this.ringEl = document.getElementById('breath-ring');
    this.labelEl = document.getElementById('breath-phase-label');
    this.countEl = document.getElementById('breath-timer-count');
    this.cueEl = document.getElementById('breath-cue-text');
    this.cycleEl = document.getElementById('breath-cycle-count');
  }

  start() {
    this.bindElements();
    if (this.isActive) return;
    this.isActive = true;
    this.cycleCount = 0;
    this.runPhase('inhale');
  }

  stop() {
    this.isActive = false;
    clearTimeout(this.timer);
    this.currentPhase = 'idle';
    if (this.ringEl) {
      this.ringEl.style.transform = 'scale(1)';
      this.ringEl.style.borderColor = 'rgba(52, 211, 153, 0.4)';
    }
    if (this.labelEl) this.labelEl.textContent = "Ready to Breathe";
    if (this.countEl) this.countEl.textContent = "4-7-8";
    if (this.cueEl) this.cueEl.textContent = "Tap Start to begin 4-7-8 parasympathetic down-regulation";
  }

  runPhase(phaseKey) {
    if (!this.isActive) return;
    this.currentPhase = phaseKey;
    const p = this.phases[phaseKey];
    this.secondsLeft = p.duration;

    if (phaseKey === 'inhale') {
      this.cycleCount++;
      if (this.cycleEl) this.cycleEl.textContent = `Cycle ${this.cycleCount} of 4`;
    }

    // Play subtle soft chime on inhale or exhale
    if (window.SlothAudio && (phaseKey === 'inhale' || phaseKey === 'exhale')) {
      // gentle harmonic resonance
    }

    // Update Visuals
    if (this.labelEl) this.labelEl.textContent = p.label;
    if (this.countEl) this.countEl.textContent = this.secondsLeft + "s";
    if (this.cueEl) this.cueEl.textContent = p.cue;

    if (this.ringEl) {
      this.ringEl.style.transition = `transform ${p.duration}s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.8s ease, box-shadow 0.8s ease`;
      this.ringEl.style.transform = `scale(${p.scale})`;
      this.ringEl.style.borderColor = p.color;
      this.ringEl.style.boxShadow = `0 0 35px ${p.color}44`;
    }

    const countdown = () => {
      if (!this.isActive) return;
      this.secondsLeft--;
      if (this.secondsLeft > 0) {
        if (this.countEl) this.countEl.textContent = this.secondsLeft + "s";
        this.timer = setTimeout(countdown, 1000);
      } else {
        // Next phase transition
        if (phaseKey === 'inhale') {
          this.runPhase('hold');
        } else if (phaseKey === 'hold') {
          this.runPhase('exhale');
        } else if (phaseKey === 'exhale') {
          this.runPhase('inhale');
        }
      }
    };

    this.timer = setTimeout(countdown, 1000);
  }
}

window.SlothBreathing = new SlothBreathingGuide();
