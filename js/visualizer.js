/**
 * SlothSnooze AI - 60 FPS Twilight Canopy & Sleeping Sloth Canvas Visualizer
 * Features procedural bioluminescent fireflies, swaying rainforest canopy,
 * sleeping breathing sloth, and live Web Audio FFT spectrum analyzer.
 */

class CanopyVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // Fireflies / Spores
    this.particles = [];
    this.numParticles = 45;

    // FFT Data buffer
    this.fftData = new Uint8Array(64);

    // Sloth breathing animation phase (48 BPM = 0.8 Hz)
    this.breathePhase = 0;

    // Interactive mouse / touch ripple
    this.mouse = { x: -1000, y: -1000, active: false };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse / touch listeners for gentle firefly ripples
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.active = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.active = false;
    });

    this.initParticles();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 1.2,
        baseAlpha: Math.random() * 0.5 + 0.3,
        alphaPulseSpeed: Math.random() * 0.02 + 0.01,
        alphaPhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3 - 0.1, // gentle upward drift
        color: Math.random() > 0.4 ? 'rgba(52, 211, 153,' : 'rgba(251, 191, 36,' // Emerald & Warm Amber
      });
    }
  }

  drawBackground() {
    // Rich midnight twilight gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#060913'); // Deep cosmic obsidian
    grad.addColorStop(0.5, '#0b1329'); // Night indigo
    grad.addColorStop(1, '#06201b'); // Rainforest canopy emerald tint

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle moonlight glow top center
    const moonGrad = this.ctx.createRadialGradient(
      this.width * 0.5, 0, 10,
      this.width * 0.5, 0, this.height * 0.75
    );
    moonGrad.addColorStop(0, 'rgba(110, 231, 183, 0.14)');
    moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = moonGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawTreeCanopy() {
    this.ctx.save();
    this.ctx.fillStyle = '#03080e'; // Branch silhouette

    // Gentle swaying wind offset
    const sway = Math.sin(Date.now() * 0.001) * 3;

    // Main horizontal branch supporting the sleeping sloth
    const branchY = this.height * 0.62 + sway;
    this.ctx.beginPath();
    this.ctx.moveTo(0, branchY - 12);
    this.ctx.bezierCurveTo(
      this.width * 0.3, branchY - 5,
      this.width * 0.7, branchY + 15,
      this.width, branchY + 8
    );
    this.ctx.lineTo(this.width, branchY + 45);
    this.ctx.bezierCurveTo(
      this.width * 0.6, branchY + 40,
      this.width * 0.2, branchY + 25,
      0, branchY + 30
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Moss / vines hanging down
    this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    this.ctx.lineWidth = 1.8;
    for (let i = 1; i <= 6; i++) {
      const vx = (this.width / 7) * i;
      const vLen = 25 + Math.sin(i * 99) * 15;
      this.ctx.beginPath();
      this.ctx.moveTo(vx, branchY + 20);
      this.ctx.quadraticCurveTo(
        vx + Math.sin(Date.now() * 0.0015 + i) * 8, branchY + 20 + vLen * 0.5,
        vx + Math.sin(Date.now() * 0.0012 + i) * 5, branchY + 20 + vLen
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  drawSleepingSloth() {
    this.ctx.save();

    // Sloth coordinates on branch
    const sway = Math.sin(Date.now() * 0.001) * 3;
    const branchY = this.height * 0.62 + sway;
    const slothX = this.width * 0.48;
    const slothY = branchY - 2;

    // Breathing expansion (48 BPM cycle)
    this.breathePhase += 0.035;
    const breatheOffset = Math.sin(this.breathePhase) * 2.8;

    // Body (Curled brown/mossy fur)
    this.ctx.fillStyle = '#1e293b'; // Dark shadow body
    this.ctx.beginPath();
    this.ctx.ellipse(slothX, slothY - 18 - (breatheOffset * 0.5), 38, 22 + breatheOffset, -0.08, 0, Math.PI * 2);
    this.ctx.fill();

    // Outer warm fur outline
    this.ctx.strokeStyle = '#334155';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Head resting on branch
    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(slothX + 32, slothY - 14, 14, 0, Math.PI * 2);
    this.ctx.fill();

    // Sloth facial mask (Classic dark eyestripes)
    this.ctx.fillStyle = '#64748b';
    this.ctx.beginPath();
    this.ctx.ellipse(slothX + 34, slothY - 13, 8, 5, 0.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Sleeping peaceful curved eyes
    this.ctx.strokeStyle = '#cbd5e1';
    this.ctx.lineWidth = 1.4;
    this.ctx.beginPath();
    this.ctx.arc(slothX + 34, slothY - 14, 3.5, 0.1, Math.PI - 0.1);
    this.ctx.stroke();

    // Cute tiny round nose
    this.ctx.fillStyle = '#020617';
    this.ctx.beginPath();
    this.ctx.arc(slothX + 41, slothY - 11, 2.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Claws hooked securely under the branch
    this.ctx.strokeStyle = '#e2e8f0';
    this.ctx.lineWidth = 2.2;
    this.ctx.beginPath();
    this.ctx.moveTo(slothX - 16, slothY);
    this.ctx.lineTo(slothX - 14, slothY + 12);
    this.ctx.moveTo(slothX - 10, slothY);
    this.ctx.lineTo(slothX - 8, slothY + 13);
    this.ctx.moveTo(slothX - 4, slothY);
    this.ctx.lineTo(slothX - 2, slothY + 12);
    this.ctx.stroke();

    // Tiny floating "Zzz" particles
    const zPhase = (Date.now() * 0.0012) % 3;
    if (zPhase < 2.5) {
      this.ctx.fillStyle = 'rgba(52, 211, 153, ' + (1 - zPhase / 2.5) * 0.75 + ')';
      this.ctx.font = '600 ' + (10 + zPhase * 3) + 'px "Outfit", sans-serif';
      this.ctx.fillText(
        'z',
        slothX + 42 + Math.sin(zPhase * 3) * 6,
        slothY - 26 - zPhase * 16
      );
    }

    this.ctx.restore();
  }

  drawParticles() {
    this.ctx.save();

    for (let p of this.particles) {
      // Sinusoidal alpha pulsation
      p.alphaPhase += p.alphaPulseSpeed;
      const currentAlpha = p.baseAlpha + Math.sin(p.alphaPhase) * 0.25;

      // Gentle movement
      p.x += p.vx;
      p.y += p.vy;

      // Mouse ripple effect
      if (this.mouse.active) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 1.5;
          p.y += (dy / dist) * 1.5;
        }
      }

      // Wrap edges
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      // Draw particle glow
      const glowGrad = this.ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.radius * 3.5
      );
      glowGrad.addColorStop(0, p.color + currentAlpha + ')');
      glowGrad.addColorStop(0.4, p.color + (currentAlpha * 0.4) + ')');
      glowGrad.addColorStop(1, p.color + '0)');

      this.ctx.fillStyle = glowGrad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
      this.ctx.fill();

      // Sharp center core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawFFTSpectrum() {
    if (!window.SlothAudio || !window.SlothAudio.isPlaying) return;

    window.SlothAudio.getFrequencyData(this.fftData);

    this.ctx.save();
    const barCount = 36;
    const barWidth = (this.width / barCount) * 0.65;
    const spacing = (this.width / barCount);
    const startY = this.height - 4;

    for (let i = 0; i < barCount; i++) {
      const val = this.fftData[i] || 0;
      const barHeight = (val / 255) * 45;

      const grad = this.ctx.createLinearGradient(0, startY - barHeight, 0, startY);
      grad.addColorStop(0, 'rgba(52, 211, 153, 0.7)'); // Emerald
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.15)'); // Indigo

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.roundRect(i * spacing + (spacing - barWidth) / 2, startY - barHeight, barWidth, barHeight, [3, 3, 0, 0]);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  animate() {
    this.drawBackground();
    this.drawParticles();
    this.drawTreeCanopy();
    this.drawSleepingSloth();
    this.drawFFTSpectrum();

    requestAnimationFrame(() => this.animate());
  }
}

window.initCanopyVisualizer = (canvasId) => {
  window.SlothCanvas = new CanopyVisualizer(canvasId);
};
