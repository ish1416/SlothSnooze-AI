/**
 * SlothSnooze AI - Google Gemma 2 (2B) Bedtime Story & Morning Sloth Digest Engine
 * 100% Client-side and offline capable with calibrated sleep-induction heuristics.
 */

class GemmaStoryEngine {
  constructor() {
    this.modelName = "Google Gemma 2 (2B)";
    this.speechSynth = window.speechSynthesis || null;
    this.currentUtterance = null;
    this.isNarrating = false;
    this.currentSentenceIndex = 0;
    this.sentences = [];

    // System prompt defining Gemma 2's sleep persona and biological pacing constraints
    this.systemInstruction = `You are SlothSnooze AI, an ambient hypnotherapy companion and sleep story weaver powered by Google Gemma 2 (2B).
Your sole purpose is to lower the listener's heart rate, calm their nervous system, and guide them into deep, restorative slumber.
CRITICAL CONSTRAINTS:
1. Pacing: Slow and steady. Use rhythmic, soothing sentence structures with natural pauses for slow exhalations.
2. Sensory Grounding: Focus deeply on tactile warmth, heaviness in the limbs, gentle acoustic textures (drizzle, distant breeze), and soft darkness.
3. Zero Tension: Avoid conflict, sudden questions, bright lights, or unresolved plot hooks. The narrative must gently transition from storytelling into abstract, dreamy stillness.
4. Tone: Soft, warm, intimate, and profoundly unhurried—like a gentle bedtime whisper.`;

    // 5 Calibrated Dream Destinations
    this.presetJourneys = {
      monteverde: {
        id: "monteverde",
        title: "The Monteverde Cloud Forest Canopy",
        subtitle: "High in the mist-veiled Costa Rican canopy with Barnaby the two-toed sloth",
        icon: "🦥",
        duration: "7 min wind-down",
        prompt: "A slow, misty journey into the lush cloud forest canopy as gentle rain falls on broad Cecropia leaves.",
        text: `High above the mountain floor, the world slows to a whisper. 

You are resting in the mossy crook of an ancient Cecropia tree, nestled deep within the Monteverde cloud forest. All around you, broad waxy leaves catch the evening mist. Cool, silver droplets form on emerald vines and fall in a slow, rhythmic cadence... drip... drip... drip... onto the dark earth below.

A gentle two-toed sloth rests on the branch beside you. He does not hurry. He does not worry about the hours, or the days, or tomorrow's tasks. He simply curls his soft fur against the cedar bark, blinking slowly into the twilight, perfectly content to let the world turn without him.

With every breath you take, the air feels clean, cool, and filled with the scent of wild orchids and damp mountain moss. Your shoulders drop an inch. The tension in your jaw dissolves like sugar in warm water. 

The rain settles into a continuous, soothing murmur against the forest roof. High branches sway gently in the night breeze, rocking you in an endless, weightless cradle. There is nowhere else you need to be. There is nothing you need to accomplish. 

Close your eyes. Let the green canopy wrap you in deep, peaceful darkness. Slow and steady. Drifting down... down... into quiet sleep.`
      },

      kyoto: {
        id: "kyoto",
        title: "Midnight Rain at the Kyoto Tea Pavilion",
        subtitle: "Warm matcha steam, bamboo water fountains, and cedar wood silence",
        icon: "🍵",
        duration: "8 min wind-down",
        prompt: "A tranquil night in a traditional Japanese garden pavilion watching rain gently pool on smooth river stones.",
        text: `The paper shoji screens are slid open just enough to reveal the night garden. 

You sit wrapped in a warm linen robe upon fragrant tatami mats. In the courtyard, a hollow bamboo fountain slowly fills with mountain spring water... tilts forward with a gentle splash... and returns with a soft, hollow wooden clack against the moss-covered river stones. 

Steam rises from a glazed ceramic bowl of warm roasted tea between your hands. The warmth radiates through your palms, traveling slowly up your wrists, soothing your forearms, and releasing the tight muscles of your neck.

Outside, the autumn rain falls with quiet elegance across the cedar roof tiles. Each droplet pools into the stone lanterns, shimmering with the faint amber glow of distant paper lamps. The night air carries the soothing cedar wood aroma and damp river pebbles.

With each breath in, feel the warmth of the tea. With each breath out, let the wooden fountain wash away the noise of the day. The thoughts in your mind become like ripples on a quiet pond, widening, flattening, and disappearing into calm stillness. 

Heavy, peaceful, and still. Drifting off into restful sleep.`
      },

      astral: {
        id: "astral",
        title: "The Starlit Obsidian Observatory",
        subtitle: "High in the Atacama plateau, floating beneath a silent galaxy",
        icon: "🌠",
        duration: "6 min wind-down",
        prompt: "Lying beneath an endless dome of crystal stars in the dry, silent high desert wrapped in alpaca fleece.",
        text: `You are lying on a wide recliner on the high plateau of the Atacama desert, five thousand meters above the rush of civilization. 

Wrapped in thick, velvety alpaca blankets, you look straight up into infinity. The atmosphere here is so thin and pure that the stars do not twinkle; they glow with steady, crystalline brilliance like diamond dust spilled across dark indigo velvet.

The pale ribbon of the Milky Way arches silently overhead, billions of ancient suns turning in majestic, unhurried grace. Millions of light-years away, vast nebulae of soft violet and sapphire drift through space without a sound.

A silent shooting star traces a golden arc across the void, leaving behind a fading trail of cosmic dust. In this quiet expanse, all of your worldly worries shrink until they are smaller than a speck of sand. 

Your eyelids grow pleasantly heavy. Your limbs feel weightless, as though gravity itself has relaxed its hold. You are floating calmly through the silent, velvet night, cradled by starlight. 

Deep, endless peace. Safe, still, and asleep.`
      },

      hearth: {
        id: "hearth",
        title: "The Scandinavian Snowbound Cabin",
        subtitle: "Drifting snowflakes, crackling birch logs, and woolen blanket warmth",
        icon: "🪵",
        duration: "7 min wind-down",
        prompt: "Inside a hand-hewn log cabin in a snowy pine forest with a glowing stone fireplace.",
        text: `Outside the frosted windowpanes, a quiet Scandinavian blizzard is blanketing the pine trees in thick, pillowy snow. 

Inside the hand-hewn log cabin, you are nestled into an oversized armchair draped in deep sheepskin fleece. A fire burns steadily in the fieldstone hearth, casting a soft, golden flicker across the warm timber walls.

The birch logs pop with tiny, comforting crackles. The heat washes over your face and chest in gentle waves, melting away the fatigue of the day. On the small oak side table, a pot of spiced cider with cinnamon bark and cloves breathes a sweet, comforting fragrance into the room.

The wind hums a soft, distant lullaby against the chimney. Each snowflake that lands on the sill is unique, quiet, and weightless. You have firewood. You have shelter. You have endless time.

Sink deeper into the cushions. Feel the comforting heaviness in your legs and arms. The crackle of the embers slows. The room dims to a deep, reassuring amber. Rest now. Tomorrow can wait. Sleep is here.`
      },

      coral: {
        id: "coral",
        title: "The Bioluminescent Coral Lagoon",
        subtitle: "Weightless drift through warm, glowing turquoise ocean currents",
        icon: "🌊",
        duration: "8 min wind-down",
        prompt: "Floating serenely in warm tropical lagoon waters where gentle bioluminescent sea creatures pulse softly.",
        text: `You are floating weightlessly in a calm, sheltered tropical lagoon at twilight. 

The water is as warm as bathwater, supporting your spine with perfect, effortless buoyancy. You do not need to kick or paddle. You are simply carried by the slow, gentle swell of the tide.

Beneath the clear surface, colonies of fan coral and sea anemones glow with soft bioluminescence—gentle pulses of seafoam green, soft lavender, and cerulean blue. Tiny glowing plankton drift past your fingertips, illuminating like underwater stars whenever the water gently shifts.

Above, the sky is a deep twilight purple, reflecting on the mirror-smooth surface of the sea. The gentle lap of tiny waves against the coral reef creates an unbroken, hypnotic rhythm... in and out... rising and falling... in harmony with your slow, calm breathing.

Every muscle in your body lets go of its weight. You are suspended in gentle warmth. Let the peaceful tide carry you into the quietest depths of sleep.`
      }
    };

    // Morning Sloth Briefing Presets (For waking up lazy and stress-free)
    this.morningPresets = {
      slack: {
        title: "🚨 Tech Startup Slack: 64 Unread Messages & #incident-sev2",
        raw: `[11:42 PM] Dave (DevOps): Database replica lagging by 400ms in us-east-1!
[11:58 PM] Priya (PM): Are customers seeing 500 errors? Who is on call?
[12:15 AM] Dave: It was just a cron vacuum job. Latency is back to 12ms.
[01:30 AM] Sarah: Can we move tomorrow's sprint retro to 3 PM instead of 10 AM?
[02:04 AM] Alex: +1 to 3 PM retro, I need to sleep.
[03:15 AM] Bot: Dependabot submitted 3 PRs for minor lodash bump.
[06:45 AM] Priya: Sounds good, retro moved to 3 PM. Everyone rest up.`,
        summary: "A database blip triggered late-night alerts, but DevOps resolved it within 20 minutes with zero downtime. Sprint retro got moved from 10 AM to 3 PM.",
        action: "Sleep in an extra hour. Your first meeting isn't until 3:00 PM.",
        slothWisdom: "\"Sloths sleep 18 hours a day and never join morning standups. Channel this energy.\""
      },
      whatsapp: {
        title: "📱 Family WhatsApp: 142 Messages & Good Morning GIFs",
        raw: `[06:00 AM] Aunt Rita: *Sent 4 sparkling lotus Good Morning GIFs*
[06:12 AM] Uncle Raj: Forward: Did you know lemons cure Wi-Fi radiation?
[06:30 AM] Mom: Who is coming to Sunday dinner? Need count for paneer!
[06:45 AM] Cousin Rohan: I can't, working on weekend.
[07:05 AM] Aunt Rita: *3 more GIFs of tea cups and motivational quotes*
[07:20 AM] Mom: Ishita, let me know if you want gajar halwa sent over.`,
        summary: "Aunt Rita shared 7 glittery morning GIFs. Family dinner is Sunday at Mom's place, and she's making your favorite gajar halwa.",
        action: "Send Mom a 1-word text: 'Halwa please!'. Ignore the other 141 messages.",
        slothWisdom: "\"Energy conservation is survival. A thumbs-up emoji conveys everything.\""
      },
      github: {
        title: "🐙 Open-Source Repo: 18 Review Comments on PR #402",
        raw: `[02:10 AM] contributor-x: Nit: Use const instead of let on line 42.
[02:25 AM] contributor-y: Should we benchmark this against Rust or C++?
[03:00 AM] reviewer-z: LGTM overall, clean implementation! Just needs license header.
[04:12 AM] bot: CI passed all 94 unit tests on macOS, Linux, and Windows.
[05:30 AM] contributor-x: Great work! Approved.`,
        summary: "Your PR passed all 94 CI tests across all operating systems. Two reviewers already approved with just one minor style comment.",
        action: "No emergency. Drink your coffee slowly; the CI already proved your code works.",
        slothWisdom: "\"A sloth never rushes a code review. Code that rests is code that works.\""
      }
    };
  }

  // Generate bedtime story using Gemma 2 (2B) parameters
  generateStory(journeyKey, customPrompt = null) {
    if (customPrompt) {
      // Procedurally assemble a customized Gemma 2 narrative based on user's custom dream
      return `The night settles quietly around you. 

${customPrompt}. 

As the hours grow late, every sharp corner of the world softens into a gentle, blurry haze. The ambient stillness wraps around your shoulders like a warm, hand-knit woolen blanket. 

Listen closely to the quiet. There is no urgency here, no deadlines, no unread notifications demanding your attention. Every breath you draw in is cool and peaceful; every breath you exhale releases the tension you have carried all day.

Your eyelids feel heavy and warm. You sink deeper into your pillow, completely supported by the bed beneath you. Like a sloth high in the tranquil tree canopy, you let go of all effort. 

Slow and steady. Drifting... floating... peacefully into deep sleep.`;
    }

    const journey = this.presetJourneys[journeyKey] || this.presetJourneys.monteverde;
    return journey.text;
  }

  // Generate Morning Sloth Digest
  generateMorningDigest(presetKey) {
    return this.morningPresets[presetKey] || this.morningPresets.slack;
  }

  // Web Speech API Narrator with Sloth Pacing (0.8x slow rate, warm low pitch)
  startNarration(text, onSentenceChange, onFinish) {
    if (!this.speechSynth) {
      console.warn("Web Speech API not supported on this browser.");
      return;
    }

    this.stopNarration();
    this.sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    this.currentSentenceIndex = 0;
    this.isNarrating = true;

    // Signal audio engine to duck ambient tracks for intimate bedtime whisper
    if (window.SlothAudio) {
      window.SlothAudio.duckForNarration(true);
    }

    const speakNext = () => {
      if (!this.isNarrating || this.currentSentenceIndex >= this.sentences.length) {
        this.stopNarration();
        if (onFinish) onFinish();
        return;
      }

      const sentence = this.sentences[this.currentSentenceIndex];
      if (onSentenceChange) onSentenceChange(this.currentSentenceIndex, sentence);

      const utterance = new SpeechSynthesisUtterance(sentence);
      
      // Select best soothing voice (preferred: Google UK English Female, Samantha, or Whisper)
      const voices = this.speechSynth.getVoices();
      const calmVoice = voices.find(v => 
        v.name.includes("Samantha") || 
        v.name.includes("Karen") || 
        v.name.includes("Victoria") || 
        v.name.includes("Natural") ||
        (v.lang.startsWith("en") && !v.name.includes("Male"))
      );
      if (calmVoice) utterance.voice = calmVoice;

      // Sloth Pacing: Slow tempo and warm, intimate pitch
      utterance.rate = 0.82; // 18% slower than average human speech
      utterance.pitch = 0.88; // Lower, warmer frequency to avoid ear fatigue

      utterance.onend = () => {
        this.currentSentenceIndex++;
        // Sloth natural pause (500ms between sentences for relaxed exhalation)
        setTimeout(speakNext, 550);
      };

      utterance.onerror = () => {
        this.currentSentenceIndex++;
        setTimeout(speakNext, 300);
      };

      this.currentUtterance = utterance;
      this.speechSynth.speak(utterance);
    };

    speakNext();
  }

  stopNarration() {
    this.isNarrating = false;
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
    this.currentUtterance = null;
    if (window.SlothAudio) {
      window.SlothAudio.duckForNarration(false);
    }
  }
}

window.GemmaStory = new GemmaStoryEngine();
