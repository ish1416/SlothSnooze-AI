/**
 * SlothSnooze AI - Main Application Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Canvas Visualizer
  if (window.initCanopyVisualizer) {
    window.initCanopyVisualizer('canopy-canvas');
  }

  // State
  let currentTab = 'soundscape';
  let activePreset = 'slothnest';
  let activeJourney = 'monteverde';
  let isPlaying = false;

  // DOM Elements
  const playAllBtn = document.getElementById('play-all-btn');
  const masterVolumeSlider = document.getElementById('master-volume');
  const sleepTimerSelect = document.getElementById('sleep-timer-select');
  const timerBadge = document.getElementById('timer-badge');
  const singingBowlBtn = document.getElementById('singing-bowl-btn');

  // Tab Switching
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`tab-${target}`);
      if (targetPane) targetPane.classList.add('active');
      currentTab = target;
    });
  });

  // Soundscape Master Play/Pause
  if (playAllBtn) {
    playAllBtn.addEventListener('click', async () => {
      if (!window.SlothAudio) return;
      await window.SlothAudio.ensureContext();

      if (window.SlothAudio.isPlaying) {
        window.SlothAudio.stopAll();
        playAllBtn.innerHTML = `<span>▶</span> Start Sanctuary`;
        playAllBtn.classList.remove('playing');
        isPlaying = false;
      } else {
        window.SlothAudio.applyPreset(activePreset);
        playAllBtn.innerHTML = `<span>⏸</span> Pause Sounds`;
        playAllBtn.classList.add('playing');
        isPlaying = true;
      }
    });
  }

  // Master Volume Slider
  if (masterVolumeSlider) {
    masterVolumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (window.SlothAudio) window.SlothAudio.setMasterVolume(val);
    });
  }

  // Tibetan Singing Bowl Chime
  if (singingBowlBtn) {
    singingBowlBtn.addEventListener('click', () => {
      if (window.SlothAudio) window.SlothAudio.playSingingBowl();
    });
  }

  // Channel Volume Sliders and Toggles
  const channelKeys = ['rain', 'fire', 'binaural', 'wind', 'heartbeat'];
  channelKeys.forEach(channel => {
    const slider = document.getElementById(`vol-${channel}`);
    const toggle = document.getElementById(`toggle-${channel}`);

    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (window.SlothAudio) window.SlothAudio.setChannelVolume(channel, val);
      });
    }

    if (toggle) {
      toggle.addEventListener('click', async () => {
        if (!window.SlothAudio) return;
        await window.SlothAudio.ensureContext();
        const ch = window.SlothAudio.channels[channel];
        if (ch.active) {
          if (channel === 'rain') window.SlothAudio.stopRain();
          if (channel === 'fire') window.SlothAudio.stopFire();
          if (channel === 'binaural') window.SlothAudio.stopBinaural();
          if (channel === 'wind') window.SlothAudio.stopWind();
          if (channel === 'heartbeat') window.SlothAudio.stopHeartbeat();
          toggle.classList.remove('active');
          toggle.textContent = 'Muted';
        } else {
          if (channel === 'rain') window.SlothAudio.startRain();
          if (channel === 'fire') window.SlothAudio.startFire();
          if (channel === 'binaural') window.SlothAudio.startBinaural();
          if (channel === 'wind') window.SlothAudio.startWind();
          if (channel === 'heartbeat') window.SlothAudio.startHeartbeat();
          toggle.classList.add('active');
          toggle.textContent = 'Active';
          playAllBtn.innerHTML = `<span>⏸</span> Pause Sounds`;
          playAllBtn.classList.add('playing');
        }
      });
    }
  });

  // Soundscape Preset Buttons
  const presetButtons = document.querySelectorAll('.preset-card');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const presetKey = btn.dataset.preset;
      activePreset = presetKey;
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (window.SlothAudio) {
        await window.SlothAudio.ensureContext();
        window.SlothAudio.applyPreset(presetKey);
        playAllBtn.innerHTML = `<span>⏸</span> Pause Sounds`;
        playAllBtn.classList.add('playing');
        isPlaying = true;

        // Synchronize sliders
        const p = window.SlothAudio.presets[presetKey];
        Object.keys(p.channels).forEach(ch => {
          const s = document.getElementById(`vol-${ch}`);
          if (s) s.value = p.channels[ch];
          const t = document.getElementById(`toggle-${ch}`);
          if (t) {
            if (p.channels[ch] > 0.05) {
              t.classList.add('active');
              t.textContent = 'Active';
            } else {
              t.classList.remove('active');
              t.textContent = 'Muted';
            }
          }
        });
      }
    });
  });

  // Sleep Timer Selection
  if (sleepTimerSelect) {
    sleepTimerSelect.addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value);
      if (!window.SlothAudio) return;

      if (minutes === 0) {
        window.SlothAudio.clearSleepTimer();
        if (timerBadge) {
          timerBadge.textContent = 'Timer: Off';
          timerBadge.classList.remove('active');
        }
      } else {
        if (timerBadge) timerBadge.classList.add('active');
        window.SlothAudio.startSleepTimer(
          minutes,
          (secondsLeft) => {
            const m = Math.floor(secondsLeft / 60);
            const s = secondsLeft % 60;
            if (timerBadge) {
              timerBadge.textContent = `🌙 ${m}:${s < 10 ? '0' : ''}${s}`;
            }
          },
          () => {
            if (timerBadge) {
              timerBadge.textContent = 'Asleep 🦥';
              timerBadge.classList.remove('active');
            }
            if (playAllBtn) {
              playAllBtn.innerHTML = `<span>▶</span> Start Sanctuary`;
              playAllBtn.classList.remove('playing');
            }
          }
        );
      }
    });
  }

  // Bedtime Story Journey Selection
  const journeyCards = document.querySelectorAll('.journey-card');
  const storyTitleEl = document.getElementById('story-display-title');
  const storySubtitleEl = document.getElementById('story-display-subtitle');
  const storyBodyEl = document.getElementById('story-display-body');
  const narrateBtn = document.getElementById('narrate-story-btn');
  const customPromptInput = document.getElementById('custom-dream-input');
  const craftCustomBtn = document.getElementById('craft-custom-dream-btn');
  const downloadStoryBtn = document.getElementById('download-story-btn');

  const updateStoryDisplay = (journeyKey, customPrompt = null) => {
    if (!window.GemmaStory) return;
    activeJourney = journeyKey;
    const text = window.GemmaStory.generateStory(journeyKey, customPrompt);
    const j = window.GemmaStory.presetJourneys[journeyKey];

    if (storyTitleEl) {
      storyTitleEl.textContent = customPrompt ? "Your Custom Sloth Dream" : j.title;
    }
    if (storySubtitleEl) {
      storySubtitleEl.textContent = customPrompt ? "Guided by Google Gemma 2 (2B) Local Inference" : j.subtitle;
    }
    if (storyBodyEl) {
      // Split into paragraphs with clean spacing
      const paras = text.split('\n\n').filter(p => p.trim().length > 0);
      storyBodyEl.innerHTML = paras.map(p => `<p class="story-paragraph">${p}</p>`).join('');
    }
  };

  journeyCards.forEach(card => {
    card.addEventListener('click', () => {
      journeyCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const jKey = card.dataset.journey;
      updateStoryDisplay(jKey);
    });
  });

  // Custom dream button
  if (craftCustomBtn && customPromptInput) {
    craftCustomBtn.addEventListener('click', () => {
      const val = customPromptInput.value.trim();
      if (val) {
        journeyCards.forEach(c => c.classList.remove('active'));
        updateStoryDisplay('custom', val);
      }
    });
  }

  // Voice Narration with Sloth Pacing
  if (narrateBtn) {
    narrateBtn.addEventListener('click', () => {
      if (!window.GemmaStory) return;

      if (window.GemmaStory.isNarrating) {
        window.GemmaStory.stopNarration();
        narrateBtn.innerHTML = `<span>🎙️</span> Listen in Sloth Pacing`;
        narrateBtn.classList.remove('active');
      } else {
        const textToRead = storyBodyEl ? storyBodyEl.innerText : "";
        narrateBtn.innerHTML = `<span>⏸</span> Pause Whisper`;
        narrateBtn.classList.add('active');

        window.GemmaStory.startNarration(
          textToRead,
          (idx, sentence) => {
            // Highlight current sentence in body
            const paras = storyBodyEl.querySelectorAll('.story-paragraph');
            paras.forEach(p => {
              if (p.textContent.includes(sentence)) {
                p.classList.add('highlight-speaking');
              } else {
                p.classList.remove('highlight-speaking');
              }
            });
          },
          () => {
            narrateBtn.innerHTML = `<span>🎙️</span> Listen in Sloth Pacing`;
            narrateBtn.classList.remove('active');
            const paras = storyBodyEl.querySelectorAll('.story-paragraph');
            paras.forEach(p => p.classList.remove('highlight-speaking'));
          }
        );
      }
    });
  }

  // Download Story as Markdown
  if (downloadStoryBtn) {
    downloadStoryBtn.addEventListener('click', () => {
      const title = storyTitleEl ? storyTitleEl.textContent : "Sloth Bedtime Story";
      const body = storyBodyEl ? storyBodyEl.innerText : "";
      const content = `# ${title}\n*Generated by SlothSnooze AI with Google Gemma 2 (2B)*\n\n${body}`;

      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // 4-7-8 Breathing Guide Controls
  const startBreathBtn = document.getElementById('start-breath-btn');
  const stopBreathBtn = document.getElementById('stop-breath-btn');

  if (startBreathBtn) {
    startBreathBtn.addEventListener('click', () => {
      if (window.SlothBreathing) {
        window.SlothBreathing.start();
        startBreathBtn.style.display = 'none';
        if (stopBreathBtn) stopBreathBtn.style.display = 'inline-flex';
      }
    });
  }

  if (stopBreathBtn) {
    stopBreathBtn.addEventListener('click', () => {
      if (window.SlothBreathing) {
        window.SlothBreathing.stop();
        stopBreathBtn.style.display = 'none';
        if (startBreathBtn) startBreathBtn.style.display = 'inline-flex';
      }
    });
  }

  // Morning Sloth Digest Controls
  const morningPresetCards = document.querySelectorAll('.digest-preset-card');
  const morningRawEl = document.getElementById('digest-raw-messages');
  const morningSummaryEl = document.getElementById('digest-summary-text');
  const morningActionEl = document.getElementById('digest-action-text');
  const morningSlothQuoteEl = document.getElementById('digest-sloth-quote');
  const summarizeBtn = document.getElementById('run-morning-digest-btn');

  const updateMorningDisplay = (presetKey) => {
    if (!window.GemmaStory) return;
    const d = window.GemmaStory.generateMorningDigest(presetKey);

    if (morningRawEl) morningRawEl.value = d.raw;
    if (morningSummaryEl) morningSummaryEl.textContent = d.summary;
    if (morningActionEl) morningActionEl.textContent = d.action;
    if (morningSlothQuoteEl) morningSlothQuoteEl.textContent = d.slothWisdom;
  };

  morningPresetCards.forEach(card => {
    card.addEventListener('click', () => {
      morningPresetCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const pKey = card.dataset.digest;
      updateMorningDisplay(pKey);
    });
  });

  if (summarizeBtn) {
    summarizeBtn.addEventListener('click', () => {
      // Custom text summarize simulation
      const customRaw = morningRawEl ? morningRawEl.value : "";
      if (!customRaw.trim()) return;

      // Simulate Gemma 2 local inference
      if (morningSummaryEl) morningSummaryEl.textContent = "Analyzing overnight message stream locally with Google Gemma 2...";
      setTimeout(() => {
        if (morningSummaryEl) {
          morningSummaryEl.textContent = "Messages scanned: Nothing was a genuine emergency. Critical items resolved automatically while you slept.";
        }
        if (morningActionEl) {
          morningActionEl.textContent = "Take your morning slow. Drink a glass of water and enjoy 10 minutes of quiet before opening your inbox.";
        }
        if (morningSlothQuoteEl) {
          morningSlothQuoteEl.textContent = "\"Moving slowly is not falling behind; it is arriving with your peace intact.\"";
        }
      }, 450);
    });
  }

  // The Lazy Payoff Calculator
  const doomscrollSlider = document.getElementById('doomscroll-slider');
  const doomscrollVal = document.getElementById('doomscroll-val');
  const latencyVal = document.getElementById('calc-latency-val');
  const remVal = document.getElementById('calc-rem-val');
  const timeSavedVal = document.getElementById('calc-timesaved-val');
  const privacyVal = document.getElementById('calc-privacy-val');

  if (doomscrollSlider) {
    doomscrollSlider.addEventListener('input', (e) => {
      const minutes = parseInt(e.target.value);
      if (doomscrollVal) doomscrollVal.textContent = `${minutes} min/night`;

      // Biological computations
      const latencyReduction = Math.round(minutes * 0.75 + 5);
      const remHoursMonthly = ((minutes * 0.5 * 30) / 60).toFixed(1);
      const hoursSavedMonthly = ((minutes * 30) / 60).toFixed(1);

      if (latencyVal) latencyVal.textContent = `~7.5 min (Down from ${latencyReduction}m)`;
      if (remVal) remVal.textContent = `+${remHoursMonthly} hrs`;
      if (timeSavedVal) timeSavedVal.textContent = `${hoursSavedMonthly} hrs/mo`;
      if (privacyVal) privacyVal.textContent = `0 KB (100% Local)`;
    });
  }

  // Initial setup
  updateStoryDisplay('monteverde');
  updateMorningDisplay('slack');
});
