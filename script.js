/* ==========================================================================
   PLANET MERGE GAME - SCRIPT.JS
   Matter.js Physics, Custom HTML5 Canvas Renderer, Web Audio API, UI Logic
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. PLANET DEFINITIONS ---
  const PLANETS = [
    {
      level: 0,
      name: '冥王星',
      enName: 'Pluto',
      radius: 11,
      mass: 0.7,
      color: '#a8a29e',
      glow: '#f5f5f4',
      score: 1,
      details: 'pluto'
    },
    {
      level: 1,
      name: '月',
      enName: 'Moon',
      radius: 15,
      mass: 1.0,
      color: '#cbd5e1',
      glow: '#f1f5f9',
      score: 2,
      details: 'moon'
    },
    {
      level: 2,
      name: '水星',
      enName: 'Mercury',
      radius: 21,
      mass: 1.4,
      color: '#94a3b8',
      glow: '#cbd5e1',
      score: 4,
      details: 'mercury'
    },
    {
      level: 3,
      name: '火星',
      enName: 'Mars',
      radius: 28,
      mass: 2.0,
      color: '#ef4444',
      glow: '#fca5a5',
      score: 8,
      details: 'mars'
    },
    {
      level: 4,
      name: '金星',
      enName: 'Venus',
      radius: 36,
      mass: 2.8,
      color: '#f59e0b',
      glow: '#fde047',
      score: 16,
      details: 'venus'
    },
    {
      level: 5,
      name: '地球',
      enName: 'Earth',
      radius: 45,
      mass: 3.8,
      color: '#0284c7',
      glow: '#38bdf8',
      score: 32,
      details: 'earth'
    },
    {
      level: 6,
      name: '海王星',
      enName: 'Neptune',
      radius: 55,
      mass: 5.0,
      color: '#4338ca',
      glow: '#818cf8',
      score: 64,
      details: 'neptune'
    },
    {
      level: 7,
      name: '天王星',
      enName: 'Uranus',
      radius: 66,
      mass: 6.5,
      color: '#0d9488',
      glow: '#2dd4bf',
      score: 128,
      details: 'uranus'
    },
    {
      level: 8,
      name: '土星',
      enName: 'Saturn',
      radius: 78,
      mass: 8.5,
      color: '#eab308',
      glow: '#fef08a',
      score: 256,
      details: 'saturn'
    },
    {
      level: 9,
      name: '木星',
      enName: 'Jupiter',
      radius: 90,
      mass: 11.0,
      color: '#c07d32',
      glow: '#fef3c7',
      score: 512,
      details: 'jupiter'
    },
    {
      level: 10,
      name: '太陽',
      enName: 'Sun',
      radius: 102,
      mass: 15.0,
      color: '#fbbf24',
      glow: '#fef08a',
      score: 1024,
      details: 'sun'
    }
  ];

  // --- INTERNATIONALIZATION (i18n) ---
  function detectInitialLanguage() {
    // 1. URL search param (?lang=en or ?lang=ja)
    try {
      const params = new URLSearchParams(window.location.search);
      const qLang = params.get('lang');
      if (qLang) {
        return qLang.toLowerCase().startsWith('ja') ? 'ja' : 'en';
      }
    } catch (e) {}

    // 2. Saved preference in LocalStorage
    try {
      const savedLang = localStorage.getItem('planet_merge_lang');
      if (savedLang) {
        return savedLang === 'ja' ? 'ja' : 'en';
      }
    } catch (e) {}

    // 3. navigator.language (Primary browser UI language)
    const navLang = navigator.language || navigator.userLanguage;
    if (navLang) {
      return navLang.toLowerCase().startsWith('ja') ? 'ja' : 'en';
    }

    // 4. navigator.languages
    if (navigator.languages && navigator.languages.length > 0) {
      return navigator.languages[0].toLowerCase().startsWith('ja') ? 'ja' : 'en';
    }

    return 'en';
  }

  let currentLang = detectInitialLanguage();
  let isJapanese = currentLang === 'ja';

  const TEXTS = {
    ja: {
      title: 'PLANET MERGE - 惑星合体ゲーム',
      metaDesc: '駅から宇宙へ！冥王星から太陽まで合体させてハイスコアを目指そう！スイカゲーム風の宇宙テーマ惑星合体物理パズルゲーム。',
      subtitle: '惑星合体ゲーム',
      soundTitle: 'サウンド切替',
      infoTitle: '遊び方',
      restartTitle: 'リスタート',
      langTitle: '英語に切替 (Switch to English)',
      nextLabel: 'NEXT:',
      controlsHint: '画面をタップまたはクリックして惑星を落とそう！',
      testMode: '[テストモード: 太陽合体] 太陽を落としてブラックホールを出現させよう！',
      infoModalTitle: '遊び方 ＆ 惑星進化表',
      infoDesc: '同じ惑星同士をぶつけると合体して1つ大きな惑星に進化します！太陽同士が合体するとブラックホールが出現し、盤面の全惑星を吸い込んで大消滅ボーナス獲得！上限ラインを超えないようにハイスコアを目指しましょう。',
      btnStart: 'プレイ開始',
      gameOverTitle: 'GAME OVER',
      gameOverSub: '惑星が溢れてしまいました！',
      scoreLabel: 'スコア',
      bestLabel: 'ハイスコア',
      maxPlanetLabel: '到達レベル',
      btnPlayAgain: 'もう一度プレイ',
      sunCreated: '☀️ 太陽誕生！ BONUS +5000',
      doubleSunMerge: '☀️☀️ 太陽合体！ ブラックホール覚醒！',
      blackHoleClear: '🕳️ 超新星大爆発！ SUPER BONUS +15000'
    },
    en: {
      title: 'PLANET MERGE - Space Planet Merge Puzzle',
      metaDesc: 'Merge cosmic planets from Pluto to Sun to achieve high scores! A space-themed physics puzzle game.',
      subtitle: 'Planet Merge Game',
      soundTitle: 'Sound Toggle',
      infoTitle: 'How to Play',
      restartTitle: 'Restart Game',
      langTitle: 'Switch to Japanese (日本語に切替)',
      nextLabel: 'NEXT:',
      controlsHint: 'Tap or click to drop planets!',
      testMode: '[TEST MODE: SUN MERGE] Drop the Sun to spawn Black Hole!',
      infoModalTitle: 'How to Play & Evolution Chart',
      infoDesc: 'Collide matching planets to merge them into larger ones! When two Suns merge, a Black Hole spawns and sucks in all planets on screen for a massive Supernova Bonus! Keep planets below the danger line and aim for high scores.',
      btnStart: 'Start Game',
      gameOverTitle: 'GAME OVER',
      gameOverSub: 'Planets overflowed the danger line!',
      scoreLabel: 'SCORE',
      bestLabel: 'BEST',
      maxPlanetLabel: 'HIGHEST PLANET',
      btnPlayAgain: 'Play Again',
      sunCreated: '☀️ SUN CREATED! BONUS +5000',
      doubleSunMerge: '☀️☀️ SUN MERGE! BLACK HOLE AWAKENS!',
      blackHoleClear: '🕳️ SUPERNOVA BURST! SUPER BONUS +15000'
    }
  };

  function getI18N() {
    return isJapanese ? TEXTS.ja : TEXTS.en;
  }

  function getPlanetDisplayName(planetDef) {
    if (!planetDef) return '';
    return isJapanese ? planetDef.name : planetDef.enName;
  }

  function toggleLanguage() {
    currentLang = currentLang === 'ja' ? 'en' : 'ja';
    isJapanese = currentLang === 'ja';
    try {
      localStorage.setItem('planet_merge_lang', currentLang);
    } catch (e) {}
    applyI18n();
    updateNextPlanetUI();
    if (elGameOverModal && !elGameOverModal.classList.contains('hidden')) {
      elMaxPlanetReached.textContent = getPlanetDisplayName(PLANETS[maxLevelReached]);
    }
    renderEvolutionCanvases();
  }

  function applyI18n() {
    const t = getI18N();
    document.title = t.title;
    document.documentElement.lang = currentLang;

    const elMeta = document.querySelector('meta[name="description"]');
    if (elMeta) elMeta.setAttribute('content', t.metaDesc);

    const elSub = document.querySelector('.game-subtitle');
    if (elSub) elSub.textContent = t.subtitle;

    const elPreviewLabel = document.querySelector('.preview-label');
    if (elPreviewLabel) elPreviewLabel.textContent = t.nextLabel;

    const btnLang = document.getElementById('btn-lang');
    if (btnLang) {
      btnLang.textContent = isJapanese ? 'EN' : 'JA';
      btnLang.setAttribute('title', t.langTitle);
      btnLang.setAttribute('aria-label', t.langTitle);
    }

    if (btnSound) btnSound.setAttribute('title', t.soundTitle);
    if (btnInfo) btnInfo.setAttribute('title', t.infoTitle);
    if (btnRestart) btnRestart.setAttribute('title', t.restartTitle);

    const elHint = document.querySelector('.controls-hint span');
    if (elHint) elHint.textContent = t.controlsHint;

    const elInfoTitle = document.querySelector('#info-modal .modal-header h2');
    if (elInfoTitle) elInfoTitle.textContent = t.infoModalTitle;

    const elInfoDesc = document.querySelector('#info-modal .info-desc');
    if (elInfoDesc) elInfoDesc.textContent = t.infoDesc;

    if (btnStartGame) btnStartGame.textContent = t.btnStart;

    const elGOSub = document.querySelector('#gameover-modal .gameover-sub');
    if (elGOSub) elGOSub.textContent = t.gameOverSub;

    const scoreRows = document.querySelectorAll('#gameover-modal .score-row');
    if (scoreRows.length >= 3) {
      scoreRows[0].querySelector('span:first-child').textContent = t.scoreLabel;
      scoreRows[1].querySelector('span:first-child').textContent = t.bestLabel;
      scoreRows[2].querySelector('span:first-child').textContent = t.maxPlanetLabel;
    }

    if (btnPlayAgain) btnPlayAgain.textContent = t.btnPlayAgain;

    // Update Evolution Chart Names
    const evoCards = document.querySelectorAll('.evolution-grid .evolution-card');
    evoCards.forEach((card, idx) => {
      const nameSpan = card.querySelector('.evo-name');
      if (nameSpan && PLANETS[idx]) {
        nameSpan.textContent = getPlanetDisplayName(PLANETS[idx]);
      }
    });
  }

  // --- 2. GAME STATE & CONSTANTS ---
  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 660;
  const GROUND_Y = CANVAS_HEIGHT - 14;
  const WALL_THICKNESS = 40;
  const DANGER_LINE_Y = 105;
  const DROP_SPAWN_Y = 50;

  let engine, world;
  let canvas, ctx;
  let score = 0;
  let highScore = 0;
  let maxLevelReached = 0;

  let currentPlanetIndex = 0;
  let nextPlanetIndex = 0;
  let pointerX = CANVAS_WIDTH / 2;

  let isGameOver = false;
  let isDropCoolingDown = false;
  let dangerTimer = 0;
  const DANGER_TIME_LIMIT = 110; // ~1.8s at 60fps

  // Combo & Screen Shake State
  let comboCount = 0;
  let lastMergeTime = 0;
  let comboResetTimeout = null;
  const COMBO_WINDOW_MS = 1600; // 1.6s

  let shakeIntensity = 0;
  const SHAKE_DECAY = 0.88;

  let particles = [];
  let stars = [];
  let isMuted = false;

  // Black Hole State
  let blackHole = null;
  let isBlackHoleActive = false;
  let screenFlashAlpha = 0;

  // DOM Elements
  const elCurrentScore = document.getElementById('current-score');
  const elHighScore = document.getElementById('high-score');
  const elNextBadge = document.getElementById('next-planet-badge');
  const elNextName = document.getElementById('next-planet-name');
  const elDangerLine = document.getElementById('danger-line');
  const elGameOverModal = document.getElementById('gameover-modal');
  const elInfoModal = document.getElementById('info-modal');
  const elFinalScore = document.getElementById('final-score');
  const elFinalHighScore = document.getElementById('final-high-score');
  const elMaxPlanetReached = document.getElementById('max-planet-reached');

  // Buttons
  const btnLang = document.getElementById('btn-lang');
  const btnSound = document.getElementById('btn-sound');
  const btnInfo = document.getElementById('btn-info');
  const btnRestart = document.getElementById('btn-restart');
  const btnCloseInfo = document.getElementById('btn-close-info');
  const btnStartGame = document.getElementById('btn-start-game');
  const btnPlayAgain = document.getElementById('btn-play-again');
  const iconSoundOn = document.getElementById('sound-icon-on');
  const iconSoundOff = document.getElementById('sound-icon-off');

  // --- 3. WEB AUDIO API SYNTHESIZER ---
  let audioCtx = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let bgmInterval = null;
  let bgmChordIndex = 0;
  let lastBounceSoundTime = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        masterGain = audioCtx.createGain();
        masterGain.gain.setValueAtTime(isMuted ? 0 : 1, audioCtx.currentTime);
        masterGain.connect(audioCtx.destination);

        bgmGain = audioCtx.createGain();
        bgmGain.gain.setValueAtTime(0.075, audioCtx.currentTime);
        bgmGain.connect(masterGain);

        sfxGain = audioCtx.createGain();
        sfxGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
        sfxGain.connect(masterGain);

        startAmbientBGM();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cosmic ambient chord progression: Fm9 -> Dbmaj7 -> Bbm9 -> Eb7sus4
  const BGM_CHORDS = [
    [174.61, 261.63, 311.13, 392.00], // F3, C4, Eb4, G4 (Fm9)
    [138.59, 207.65, 261.63, 349.23], // Db3, Ab3, C4, F4 (Dbmaj7)
    [116.54, 174.61, 277.18, 349.23], // Bb2, F3, Db4, F4 (Bbm9)
    [155.56, 233.08, 277.18, 392.00]  // Eb3, Bb3, Db4, G4 (Eb7)
  ];

  function startAmbientBGM() {
    if (bgmInterval || !audioCtx) return;
    playBGMChord();
    bgmInterval = setInterval(() => {
      playBGMChord();
    }, 3800);
  }

  function playBGMChord() {
    if (!audioCtx || isMuted) return;
    try {
      const chord = BGM_CHORDS[bgmChordIndex % BGM_CHORDS.length];
      bgmChordIndex++;

      const chordDuration = 3.6;
      const now = audioCtx.currentTime;

      // Low-pass filter for warm space pad texture
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 1.8);
      filter.frequency.exponentialRampToValueAtTime(450, now + chordDuration);
      filter.connect(bgmGain);

      chord.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime((i % 2 === 0 ? 3 : -3), now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.05, now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0005, now + chordDuration);

        osc.connect(noteGain);
        noteGain.connect(filter);

        osc.start(now);
        osc.stop(now + chordDuration);
      });

      // Occasional gentle sparkle overtone
      if (Math.random() < 0.6) {
        const sparkleFreq = chord[Math.floor(Math.random() * chord.length)] * 2;
        const sparkleOsc = audioCtx.createOscillator();
        const sparkleGain = audioCtx.createGain();
        const sparkleTime = now + 0.8 + Math.random() * 1.5;

        sparkleOsc.type = 'sine';
        sparkleOsc.frequency.setValueAtTime(sparkleFreq, sparkleTime);

        sparkleGain.gain.setValueAtTime(0.001, sparkleTime);
        sparkleGain.gain.linearRampToValueAtTime(0.02, sparkleTime + 0.2);
        sparkleGain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + 1.2);

        sparkleOsc.connect(sparkleGain);
        sparkleGain.connect(bgmGain);

        sparkleOsc.start(sparkleTime);
        sparkleOsc.stop(sparkleTime + 1.2);
      }
    } catch (e) {}
  }

  function playDropSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  function playBounceSound(speed, mass) {
    if (isMuted || !audioCtx) return;
    const now = Date.now();
    if (now - lastBounceSoundTime < 60) return;
    lastBounceSoundTime = now;

    try {
      const actNow = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const basePitch = Math.max(90, 210 - mass * 6);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(basePitch, actNow);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 0.7, actNow + 0.08);

      const vol = Math.min(0.18, Math.max(0.03, (speed - 1.5) * 0.03));
      gain.gain.setValueAtTime(vol, actNow);
      gain.gain.exponentialRampToValueAtTime(0.001, actNow + 0.08);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(actNow);
      osc.stop(actNow + 0.08);
    } catch (e) {}
  }

  function playMergeSound(level, combo = 1) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const baseFreq = 220 + level * 42;
      const pitchMult = Math.pow(1.09, Math.min(10, combo - 1));
      const rootFreq = baseFreq * pitchMult;

      // Primary tone
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(rootFreq, now);
      osc1.frequency.exponentialRampToValueAtTime(rootFreq * 1.45, now + 0.2);

      gain1.gain.setValueAtTime(0.28, now);
      gain1.gain.exponentialRampToValueAtTime(0.005, now + 0.22);
      osc1.connect(gain1);
      gain1.connect(sfxGain);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Harmonious overtone (Fifth to Octave)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(rootFreq * 1.5, now);
      osc2.frequency.exponentialRampToValueAtTime(rootFreq * 2.0, now + 0.22);

      gain2.gain.setValueAtTime(0.16, now);
      gain2.gain.exponentialRampToValueAtTime(0.002, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(sfxGain);
      osc2.start(now);
      osc2.stop(now + 0.22);

      // High combo additional sparkle
      if (combo >= 3) {
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(rootFreq * 2.5, now + 0.04);
        gain3.gain.setValueAtTime(0.14, now + 0.04);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc3.connect(gain3);
        gain3.connect(sfxGain);
        osc3.start(now + 0.04);
        osc3.stop(now + 0.26);
      }
    } catch (e) {}
  }

  function playClickSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  function playGameOverSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.7);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.7);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  function playSunCreationSound() {
    if (isMuted || !audioCtx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // Fanfare C5, E5, G5, C6, E6
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = audioCtx.currentTime + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.32, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);
        osc.connect(gain);
        gain.connect(sfxGain);
        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    } catch (e) {}
  }

  function playBlackHoleStartSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;

      // 1. Deep Sub-bass Gravitational Drone Sweep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.exponentialRampToValueAtTime(65, now + 1.8);
      filter.Q.setValueAtTime(7.0, now);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 2.0);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.38, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 2.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 2.5);

      // 2. Cosmic LFO frequency modulation
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(7, now);
      lfo.frequency.linearRampToValueAtTime(22, now + 1.8);
      lfoGain.gain.setValueAtTime(35, now);
      lfo.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + 2.5);
    } catch (e) {}
  }

  function playBlackHoleAbsorbSound(count = 0) {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const baseFreq = 420 * Math.pow(1.06, Math.min(18, count));

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * 0.8, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.85, now + 0.12);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  function playBlackHoleCollapseSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(1900, now + 1.2);
      filter.Q.setValueAtTime(4.5, now);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(sfxGain);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {}
  }

  function playSupernovaFanfareSound() {
    if (isMuted || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      // Grand radiant chord: C4, G4, C5, E5, G5, B5, C6
      const freqs = [261.63, 392.00, 523.25, 659.25, 783.99, 987.77, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = now + idx * 0.05;

        osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq * 1.01, startTime + 1.2);

        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

        osc.connect(gain);
        gain.connect(sfxGain);

        osc.start(startTime);
        osc.stop(startTime + 1.5);
      });
    } catch (e) {}
  }

  function triggerScreenShake(level, combo = 0) {
    let base = 2 + level * 1.5;
    if (level >= 7) base += 4;
    if (level >= 9) base += 10;
    if (combo >= 2) base += Math.min(10, combo * 2.5);
    shakeIntensity = Math.min(28, Math.max(shakeIntensity, base));
  }

  let shockwaves = [];
  let floatingTexts = [];

  // --- 4. INITIALIZATION ---
  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    // Load High Score from LocalStorage
    const savedHighScore = localStorage.getItem('planet_merge_highscore');
    if (savedHighScore) {
      highScore = parseInt(savedHighScore, 10) || 0;
    }
    elHighScore.textContent = highScore;

    // Matter.js Physics Engine setup
    const { Engine, World, Bodies } = Matter;
    engine = Engine.create({
      gravity: { x: 0, y: 1.1, scale: 0.001 }
    });
    world = engine.world;

    // Add static boundary walls
    const ground = Bodies.rectangle(CANVAS_WIDTH / 2, GROUND_Y + 15, CANVAS_WIDTH + 100, 30, {
      isStatic: true,
      friction: 0.5
    });
    const leftWall = Bodies.rectangle(-15, CANVAS_HEIGHT / 2, 30, CANVAS_HEIGHT * 2, {
      isStatic: true,
      friction: 0.5
    });
    const rightWall = Bodies.rectangle(CANVAS_WIDTH + 15, CANVAS_HEIGHT / 2, 30, CANVAS_HEIGHT * 2, {
      isStatic: true,
      friction: 0.5
    });

    World.add(world, [ground, leftWall, rightWall]);

    // Setup collision listener
    Matter.Events.on(engine, 'collisionStart', handleCollisions);

    // Setup background stars
    initStars();

    // Apply Internationalization
    applyI18n();

    // Setup input listeners
    setupInputs();

    // Setup next planet queue
    currentPlanetIndex = getRandomSpawnLevel();
    nextPlanetIndex = getRandomSpawnLevel();
    updateNextPlanetUI();

    // Setup evolution modal previews
    renderEvolutionCanvases();

    // Check Test Mode (?test in URL)
    checkTestMode();

    // Start Animation Render Loop
    requestAnimationFrame(gameLoop);
  }

  function checkTestMode() {
    const isTestMode = window.location.search.includes('test');
    if (!isTestMode) return;

    // Pre-spawn a Sun and other planets at the bottom of the board for testing
    const { Bodies, World } = Matter;

    // 1. Sun (Level 10) resting on ground at bottom-left
    const sunDef = PLANETS[10];
    const sunBody = Bodies.circle(135, GROUND_Y - sunDef.radius, sunDef.radius, {
      restitution: 0.15,
      friction: 0.3,
      density: 0.002 * sunDef.mass,
      label: 'planet'
    });
    sunBody.planetLevel = 10;
    sunBody.isPlanet = true;
    sunBody.isDropped = true;

    // 2. Jupiter (Level 9) resting on ground at bottom-right
    const jupDef = PLANETS[9];
    const jupBody = Bodies.circle(325, GROUND_Y - jupDef.radius, jupDef.radius, {
      restitution: 0.15,
      friction: 0.3,
      density: 0.002 * jupDef.mass,
      label: 'planet'
    });
    jupBody.planetLevel = 9;
    jupBody.isPlanet = true;
    jupBody.isDropped = true;

    // 3. Earth (Level 5) on top of Jupiter
    const earthDef = PLANETS[5];
    const earthBody = Bodies.circle(300, GROUND_Y - jupDef.radius * 2 - earthDef.radius - 8, earthDef.radius, {
      restitution: 0.15,
      friction: 0.3,
      density: 0.002 * earthDef.mass,
      label: 'planet'
    });
    earthBody.planetLevel = 5;
    earthBody.isPlanet = true;
    earthBody.isDropped = true;

    // 4. Mars (Level 3) above Sun
    const marsDef = PLANETS[3];
    const marsBody = Bodies.circle(115, GROUND_Y - sunDef.radius * 2 - marsDef.radius - 8, marsDef.radius, {
      restitution: 0.15,
      friction: 0.3,
      density: 0.002 * marsDef.mass,
      label: 'planet'
    });
    marsBody.planetLevel = 3;
    marsBody.isPlanet = true;
    marsBody.isDropped = true;

    World.add(world, [sunBody, jupBody, earthBody, marsBody]);

    // Set queue to drop Sun next
    currentPlanetIndex = 10;
    nextPlanetIndex = 10;
    updateNextPlanetUI();

    // Show Test Mode Notice in Controls Hint
    const elHint = document.querySelector('.controls-hint span');
    if (elHint) {
      elHint.textContent = getI18N().testMode;
      elHint.style.color = '#fbbf24';
      elHint.style.fontWeight = 'bold';
    }
  }

  function getRandomSpawnLevel() {
    // Spawn probabilities: Pluto 24%, Moon 24%, Mercury 24%, Mars 18%, Venus 10%
    const r = Math.random();
    if (r < 0.24) return 0; // Pluto (冥王星: 24%)
    if (r < 0.48) return 1; // Moon (月: 24%)
    if (r < 0.72) return 2; // Mercury (水星: 24%)
    if (r < 0.90) return 3; // Mars (火星: 18%)
    return 4;               // Venus (金星: 10%)
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  // --- 5. INPUT HANDLERS ---
  function setupInputs() {
    const container = document.getElementById('game-container');

    function updatePointerX(e) {
      initAudio();
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const scaleX = CANVAS_WIDTH / rect.width;
      const rawX = (clientX - rect.left) * scaleX;
      
      const currentRadius = PLANETS[currentPlanetIndex].radius;
      pointerX = Math.max(currentRadius + 5, Math.min(CANVAS_WIDTH - currentRadius - 5, rawX));
    }

    function handleDrop(e) {
      if (e) e.preventDefault();
      initAudio();
      if (isGameOver || isDropCoolingDown) return;

      dropPlanet();
    }

    container.addEventListener('mousemove', updatePointerX);
    container.addEventListener('touchstart', (e) => { updatePointerX(e); }, { passive: false });
    container.addEventListener('touchmove', (e) => { updatePointerX(e); e.preventDefault(); }, { passive: false });
    container.addEventListener('click', handleDrop);
    container.addEventListener('touchend', handleDrop);

    // Header buttons
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        playClickSound();
        toggleLanguage();
      });
    }

    btnSound.addEventListener('click', () => {
      playClickSound();
      isMuted = !isMuted;
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(isMuted ? 0 : 1, audioCtx.currentTime);
      }
      iconSoundOn.classList.toggle('hidden', isMuted);
      iconSoundOff.classList.toggle('hidden', !isMuted);
    });

    btnInfo.addEventListener('click', () => {
      playClickSound();
      elInfoModal.classList.remove('hidden');
      renderEvolutionCanvases();
    });

    btnCloseInfo.addEventListener('click', () => {
      playClickSound();
      elInfoModal.classList.add('hidden');
    });

    btnStartGame.addEventListener('click', () => {
      playClickSound();
      initAudio();
      elInfoModal.classList.add('hidden');
    });

    btnRestart.addEventListener('click', () => {
      playClickSound();
      resetGame();
    });
    btnPlayAgain.addEventListener('click', () => {
      playClickSound();
      resetGame();
    });
  }

  // --- 6. GAME MECHANICS & PHYSICS ---
  function dropPlanet() {
    isDropCoolingDown = true;

    const planetDef = PLANETS[currentPlanetIndex];
    const { Bodies, World } = Matter;

    const body = Bodies.circle(pointerX, DROP_SPAWN_Y, planetDef.radius, {
      restitution: 0.15,
      friction: 0.1,
      frictionStatic: 0.4,
      density: 0.002 * planetDef.mass,
      label: 'planet'
    });

    body.planetLevel = currentPlanetIndex;
    body.isPlanet = true;
    body.isDropped = false;

    // Mark as active dropped planet after short delay
    setTimeout(() => {
      body.isDropped = true;
    }, 150);

    World.add(world, body);
    playDropSound();

    // Advance queue
    currentPlanetIndex = nextPlanetIndex;
    nextPlanetIndex = getRandomSpawnLevel();
    updateNextPlanetUI();

    // Re-enable drop after cooldown
    setTimeout(() => {
      isDropCoolingDown = false;
    }, 550);
  }

  function handleCollisions(event) {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const { bodyA, bodyB } = pairs[i];

      if (bodyA.isPlanet && bodyB.isPlanet && bodyA.planetLevel === bodyB.planetLevel) {
        if (bodyA.isMerging || bodyB.isMerging) continue;

        bodyA.isMerging = true;
        bodyB.isMerging = true;

        const currentLevel = bodyA.planetLevel;
        const nextLevel = currentLevel + 1;

        const midX = (bodyA.position.x + bodyB.position.x) / 2;
        const midY = (bodyA.position.y + bodyB.position.y) / 2;

        // Combo Tracking
        const now = Date.now();
        if (now - lastMergeTime < COMBO_WINDOW_MS) {
          comboCount++;
        } else {
          comboCount = 1;
        }
        lastMergeTime = now;
        if (comboResetTimeout) clearTimeout(comboResetTimeout);
        comboResetTimeout = setTimeout(() => {
          comboCount = 0;
        }, COMBO_WINDOW_MS);

        const currentCombo = comboCount;

        // Trigger Screen Shake on Merge
        triggerScreenShake(currentLevel, currentCombo);

        // Schedule removal and spawn of next planet body
        setTimeout(() => {
          Matter.Composite.remove(world, bodyA);
          Matter.Composite.remove(world, bodyB);

          let baseScore = PLANETS[currentLevel].score * 2;
          let comboBonus = 0;
          if (currentCombo >= 2) {
            comboBonus = currentCombo * 12 * (nextLevel + 1);
          }
          addScore(baseScore + comboBonus);
          playMergeSound(nextLevel, currentCombo);
          spawnMergeParticles(midX, midY, PLANETS[Math.min(nextLevel, PLANETS.length - 1)].color);

          // Display combo floating text
          if (currentCombo >= 2) {
            const comboText = currentCombo >= 4 ? `⚡ ${currentCombo} MEGA COMBO! +${comboBonus}` : `🔥 ${currentCombo} COMBO! +${comboBonus}`;
            const comboColor = currentCombo >= 4 ? '#ec4899' : currentCombo >= 3 ? '#fbbf24' : '#38bdf8';
            const shadowColor = currentCombo >= 4 ? '#f43f5e' : currentCombo >= 3 ? '#d97706' : '#0284c7';
            const fontSize = Math.min(26, 18 + currentCombo * 2);

            floatingTexts.push({
              text: comboText,
              x: midX,
              y: midY - 25,
              vy: -1.3,
              alpha: 1.0,
              color: comboColor,
              shadowColor: shadowColor,
              fontSize: fontSize
            });
          }

          if (nextLevel < PLANETS.length) {
            const nextDef = PLANETS[nextLevel];
            const newBody = Matter.Bodies.circle(midX, midY, nextDef.radius, {
              restitution: 0.15,
              friction: 0.1,
              frictionStatic: 0.4,
              density: 0.002 * nextDef.mass,
              label: 'planet'
            });

            newBody.planetLevel = nextLevel;
            newBody.isPlanet = true;
            newBody.isDropped = true;

            Matter.World.add(world, newBody);

            if (nextLevel > maxLevelReached) {
              maxLevelReached = nextLevel;
            }

            // Grand celebration when reaching the Sun
            if (nextLevel === PLANETS.length - 1) {
              triggerSunCreationVictory(midX, midY);
            }
          } else if (currentLevel === PLANETS.length - 1) {
            // Merging two Suns -> Spawn Black Hole Sequence!
            triggerBlackHoleSequence(midX, midY);
          }
        }, 0);
      } else {
        // Non-merging planet collision bounce sound
        if (bodyA.isPlanet || bodyB.isPlanet) {
          const relVx = bodyA.velocity.x - bodyB.velocity.x;
          const relVy = bodyA.velocity.y - bodyB.velocity.y;
          const relSpeed = Math.sqrt(relVx * relVx + relVy * relVy);
          if (relSpeed > 1.6) {
            const mass = (bodyA.isPlanet ? bodyA.density * 500 : 1) + (bodyB.isPlanet ? bodyB.density * 500 : 1);
            playBounceSound(relSpeed, mass);
          }
        }
      }
    }
  }

  function triggerSunCreationVictory(x, y) {
    playSunCreationSound();
    triggerScreenShake(10, comboCount);
    addScore(5000); // Massive bonus points!

    // Multi-color explosion of particles
    spawnMergeParticles(x, y, '#fef08a', 90);
    spawnMergeParticles(x, y, '#f97316', 70);
    spawnMergeParticles(x, y, '#ffffff', 50);
    spawnMergeParticles(x, y, '#ec4899', 40);

    // Expanding golden shockwaves
    shockwaves.push({ x: x, y: y, radius: 10, maxRadius: 260, color: 'rgba(254, 240, 138, 0.9)', alpha: 1.0 });
    shockwaves.push({ x: x, y: y, radius: 5, maxRadius: 180, color: 'rgba(249, 115, 22, 0.85)', alpha: 1.0 });

    // Floating text banner
    floatingTexts.push({
      text: I18N.sunCreated,
      x: x,
      y: y - 20,
      vy: -1.4,
      alpha: 1.0,
      color: '#fef08a',
      shadowColor: '#f59e0b',
      fontSize: 22
    });
  }

  function triggerBlackHoleSequence(x, y) {
    isBlackHoleActive = true;
    isDropCoolingDown = true;
    dangerTimer = 0;
    elDangerLine.classList.remove('warning');

    blackHole = {
      x: x,
      y: y,
      radius: 0,
      targetRadius: 65,
      accretionAngle: 0,
      state: 'GROWING', // 'GROWING' | 'SUCKING' | 'COLLAPSING' | 'SUPERNOVA'
      timer: 0,
      absorbedCount: 0,
      initialPlanetsCount: 0
    };

    playBlackHoleStartSound();
    triggerScreenShake(16, 0);

    // Initial expansive cosmic burst
    shockwaves.push({ x: x, y: y, radius: 10, maxRadius: 320, color: 'rgba(168, 85, 247, 0.95)', alpha: 1.0 });
    spawnMergeParticles(x, y, '#c084fc', 60);
    spawnMergeParticles(x, y, '#38bdf8', 50);
    spawnMergeParticles(x, y, '#ffffff', 40);

    floatingTexts.push({
      text: getI18N().doubleSunMerge,
      x: x,
      y: Math.max(60, y - 45),
      vy: -1.2,
      alpha: 1.0,
      color: '#f0abfc',
      shadowColor: '#6366f1',
      fontSize: 22
    });
  }

  function updateBlackHole() {
    if (!blackHole) return;

    blackHole.accretionAngle += 0.08;

    // --- STAGE 1: MAJESTIC BIRTH / EXPANSION (~1.6s, 95 frames) ---
    if (blackHole.state === 'GROWING') {
      blackHole.timer++;
      // Smooth asymptotic growth
      blackHole.radius += (blackHole.targetRadius - blackHole.radius) * 0.045;

      // Periodic gravitational wave pulses
      if (blackHole.timer % 30 === 0) {
        shockwaves.push({
          x: blackHole.x,
          y: blackHole.y,
          radius: blackHole.radius * 0.8,
          maxRadius: 260,
          color: 'rgba(56, 189, 248, 0.75)',
          alpha: 0.85
        });
        triggerScreenShake(4, 0);
      }

      if (blackHole.timer > 95 || blackHole.radius >= blackHole.targetRadius - 1.0) {
        blackHole.radius = blackHole.targetRadius;
        blackHole.state = 'SUCKING';
        blackHole.timer = 0;
        const allPlanets = Matter.Composite.allBodies(world).filter(b => b.isPlanet);
        blackHole.initialPlanetsCount = allPlanets.length;
      }
    }
    // --- STAGE 2: ORBITAL INFLOW & SPAGHETTIFICATION (~3.5s - 4.5s) ---
    else if (blackHole.state === 'SUCKING') {
      blackHole.timer++;

      // Swirl inward suction particles continuously
      if (Math.random() < 0.9) {
        const pAngle = Math.random() * Math.PI * 2;
        const pDist = blackHole.radius * 1.8 + Math.random() * 120;
        const swirlTangential = 3.2;
        const swirlInward = 2.4;
        particles.push({
          x: blackHole.x + Math.cos(pAngle) * pDist,
          y: blackHole.y + Math.sin(pAngle) * pDist,
          vx: -Math.cos(pAngle) * swirlInward - Math.sin(pAngle) * swirlTangential,
          vy: -Math.sin(pAngle) * swirlInward + Math.cos(pAngle) * swirlTangential,
          radius: Math.random() * 2.8 + 1.2,
          color: Math.random() > 0.6 ? '#38bdf8' : Math.random() > 0.3 ? '#c084fc' : '#fef08a',
          alpha: 0.95,
          decay: 0.018
        });
      }

      const planets = Matter.Composite.allBodies(world).filter(b => b.isPlanet);

      planets.forEach(body => {
        const dx = blackHole.x - body.position.x;
        const dy = blackHole.y - body.position.y;
        const dist = Math.hypot(dx, dy);

        // Smooth orbital inward spiral velocity (graceful arcs instead of sudden rush)
        const pullSpeed = Math.min(8.5, Math.max(2.2, 220 / (dist + 30)));
        const tangentialSpeed = Math.min(10.0, Math.max(3.0, 260 / (dist + 20)));

        const directAngle = Math.atan2(dy, dx);
        const spiralAngle = directAngle + Math.PI / 2.0;

        const vx = Math.cos(directAngle) * pullSpeed + Math.cos(spiralAngle) * tangentialSpeed;
        const vy = Math.sin(directAngle) * pullSpeed + Math.sin(spiralAngle) * tangentialSpeed;

        Matter.Body.setVelocity(body, { x: vx, y: vy });
        Matter.Body.setAngularVelocity(body, 0.18);

        // Stream color trails from each planet
        const planetDef = PLANETS[body.planetLevel];
        if (planetDef && Math.random() < 0.5) {
          particles.push({
            x: body.position.x + (Math.random() - 0.5) * 10,
            y: body.position.y + (Math.random() - 0.5) * 10,
            vx: Math.cos(directAngle) * 2.5,
            vy: Math.sin(directAngle) * 2.5,
            radius: Math.random() * 2.5 + 1.0,
            color: planetDef.color,
            alpha: 0.85,
            decay: 0.03
          });
        }

        // Absorption trigger when reached event horizon
        if (dist < 26 || (blackHole.timer > 320 && dist < 70)) {
          Matter.Composite.remove(world, body);
          const pts = (planetDef ? planetDef.score * 3 : 150) + 300;
          addScore(pts);
          blackHole.absorbedCount++;

          playBlackHoleAbsorbSound(blackHole.absorbedCount);
          spawnMergeParticles(blackHole.x, blackHole.y, planetDef ? planetDef.color : '#ffffff', 22);

          // Small absorption pulse
          shockwaves.push({
            x: blackHole.x,
            y: blackHole.y,
            radius: 8,
            maxRadius: 85,
            color: planetDef ? planetDef.glow : 'rgba(56, 189, 248, 0.8)',
            alpha: 0.9
          });

          // Floating score popup for absorbed planet
          floatingTexts.push({
            text: `+${pts} ${getPlanetDisplayName(planetDef)}`,
            x: blackHole.x + (Math.random() - 0.5) * 60,
            y: blackHole.y - 20 - (Math.random() * 30),
            vy: -1.2,
            alpha: 1.0,
            color: planetDef ? planetDef.color : '#fef08a',
            shadowColor: planetDef ? planetDef.glow : '#38bdf8',
            fontSize: 16
          });

          triggerScreenShake(4, 0);
        }
      });

      // Check if all planets are sucked in and minimum suction duration met (~2.5s)
      const remainingPlanets = Matter.Composite.allBodies(world).filter(b => b.isPlanet);
      if (remainingPlanets.length === 0 && (blackHole.timer >= 150 || blackHole.initialPlanetsCount === 0)) {
        blackHole.state = 'COLLAPSING';
        blackHole.timer = 0;
        playBlackHoleCollapseSound();
      }
    }
    // --- STAGE 3: SUSPENSEFUL SINGULARITY CONTRACTION (~1.3s, 80 frames) ---
    else if (blackHole.state === 'COLLAPSING') {
      blackHole.timer++;
      // Gradual contraction from 65px down to 1.5px
      blackHole.radius = Math.max(1.2, blackHole.radius * 0.94);

      // Increasing vibration and tension shake
      const tensionShake = 3 + (blackHole.timer / 80) * 12;
      triggerScreenShake(tensionShake, 0);

      // Inward collapse spark rays
      if (Math.random() < 0.9) {
        const cAngle = Math.random() * Math.PI * 2;
        const cDist = 40 + Math.random() * 60;
        particles.push({
          x: blackHole.x + Math.cos(cAngle) * cDist,
          y: blackHole.y + Math.sin(cAngle) * cDist,
          vx: -Math.cos(cAngle) * 6.0,
          vy: -Math.sin(cAngle) * 6.0,
          radius: Math.random() * 2.2 + 1.0,
          color: '#ffffff',
          alpha: 1.0,
          decay: 0.04
        });
      }

      if (blackHole.radius <= 2.2 || blackHole.timer > 80) {
        blackHole.state = 'SUPERNOVA';
        blackHole.timer = 0;

        // FLASH & DETONATION!
        screenFlashAlpha = 0.95;
        playSupernovaFanfareSound();
        triggerScreenShake(28, 0);

        const totalBonus = 15000 + blackHole.absorbedCount * 250;
        addScore(totalBonus);

        floatingTexts.push({
          text: getI18N().blackHoleClear,
          x: blackHole.x,
          y: Math.max(80, blackHole.y - 35),
          vy: -1.3,
          alpha: 1.0,
          color: '#fef08a',
          shadowColor: '#ec4899',
          fontSize: 24
        });

        // 6 Multi-Color Concentric Shockwaves
        shockwaves.push({ x: blackHole.x, y: blackHole.y, radius: 10, maxRadius: 480, color: 'rgba(255, 255, 255, 1.0)', alpha: 1.0 });
        shockwaves.push({ x: blackHole.x, y: blackHole.y, radius: 8, maxRadius: 390, color: 'rgba(56, 189, 248, 0.95)', alpha: 1.0 });
        shockwaves.push({ x: blackHole.x, y: blackHole.y, radius: 6, maxRadius: 320, color: 'rgba(236, 72, 153, 0.95)', alpha: 1.0 });
        shockwaves.push({ x: blackHole.x, y: blackHole.y, radius: 4, maxRadius: 260, color: 'rgba(251, 191, 36, 0.9)', alpha: 1.0 });
        shockwaves.push({ x: blackHole.x, y: blackHole.y, radius: 4, maxRadius: 200, color: 'rgba(168, 85, 247, 0.9)', alpha: 1.0 });

        // Over 300 Sparkling Fireworks Particles
        spawnMergeParticles(blackHole.x, blackHole.y, '#ffffff', 90);
        spawnMergeParticles(blackHole.x, blackHole.y, '#38bdf8', 75);
        spawnMergeParticles(blackHole.x, blackHole.y, '#ec4899', 75);
        spawnMergeParticles(blackHole.x, blackHole.y, '#fbbf24', 70);
        spawnMergeParticles(blackHole.x, blackHole.y, '#a855f7', 60);
      }
    }
    // --- STAGE 4: CLIMAX & RETURN TO GAMEPLAY (~2.2s, 130 frames) ---
    else if (blackHole.state === 'SUPERNOVA') {
      blackHole.timer++;
      if (blackHole.timer > 120) {
        blackHole = null;
        isBlackHoleActive = false;
        isDropCoolingDown = false;
        dangerTimer = 0;
        elDangerLine.classList.remove('warning');
      }
    }
  }

  function drawBlackHoleVisual() {
    if (!blackHole || blackHole.state === 'SUPERNOVA') return;

    const { x, y, radius, accretionAngle } = blackHole;
    const r = radius;

    ctx.save();
    ctx.translate(x, y);

    // 1. Gravitational Lensing & Space Distortion Glow
    const glowGrad = ctx.createRadialGradient(0, 0, r * 0.8, 0, 0, r * 3.0);
    glowGrad.addColorStop(0, 'rgba(139, 92, 246, 0.85)');
    glowGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.5)');
    glowGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.18)');
    glowGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 3.0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Rotating Luminous Accretion Disk (Interstellar-style Relativistic Beaming)
    ctx.save();
    ctx.rotate(accretionAngle);

    // Outer Swirling Accretion Disk Rays (16 stream rays)
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 / 16) * i;
      const rayLen = r * 2.5;
      ctx.save();
      ctx.rotate(angle);

      const rayGrad = ctx.createLinearGradient(r * 0.9, 0, rayLen, 0);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      rayGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.75)');
      rayGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.55)');
      rayGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(r * 0.9, -r * 0.16);
      ctx.lineTo(rayLen, 0);
      ctx.lineTo(r * 0.9, r * 0.16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Accretion Ring Ellipse (Tilted 3D disk with Doppler asymmetric brightness)
    ctx.save();
    ctx.scale(1, 0.42);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.88)';
    ctx.lineWidth = r * 0.38;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 22;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // Restore Accretion Disk Rotation

    // 3. Thin Intense Photon Sphere (Luminous boundary ring)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.08, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Pure Jet Black Event Horizon (The Black Hole Void)
    ctx.fillStyle = '#000000';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner deep shadow
    ctx.strokeStyle = 'rgba(10, 10, 15, 0.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function addScore(points) {
    score += points;
    elCurrentScore.textContent = score;

    // Pop animation trigger
    elCurrentScore.classList.remove('pop');
    void elCurrentScore.offsetWidth;
    elCurrentScore.classList.add('pop');

    if (score > highScore) {
      highScore = score;
      elHighScore.textContent = highScore;
      localStorage.setItem('planet_merge_highscore', highScore);
    }
  }

  function updateNextPlanetUI() {
    const nextDef = PLANETS[nextPlanetIndex];
    elNextBadge.style.backgroundColor = nextDef.color;
    elNextBadge.style.boxShadow = `0 0 12px ${nextDef.glow}`;
    elNextName.textContent = getPlanetDisplayName(nextDef);
  }

  function resetGame() {
    // Clear all planet bodies from physics world
    const allBodies = Matter.Composite.allBodies(world);
    allBodies.forEach(body => {
      if (body.isPlanet) {
        Matter.Composite.remove(world, body);
      }
    });

    score = 0;
    maxLevelReached = 0;
    dangerTimer = 0;
    isGameOver = false;
    isDropCoolingDown = false;
    blackHole = null;
    isBlackHoleActive = false;
    comboCount = 0;
    lastMergeTime = 0;
    if (comboResetTimeout) {
      clearTimeout(comboResetTimeout);
      comboResetTimeout = null;
    }
    shakeIntensity = 0;
    particles = [];
    shockwaves = [];
    floatingTexts = [];

    elCurrentScore.textContent = '0';
    elDangerLine.classList.remove('warning');
    elGameOverModal.classList.add('hidden');

    currentPlanetIndex = getRandomSpawnLevel();
    nextPlanetIndex = getRandomSpawnLevel();
    updateNextPlanetUI();
  }

  function triggerGameOver() {
    if (isGameOver) return;
    isGameOver = true;
    playGameOverSound();

    elFinalScore.textContent = score;
    elFinalHighScore.textContent = highScore;
    elMaxPlanetReached.textContent = getPlanetDisplayName(PLANETS[maxLevelReached]);

    elGameOverModal.classList.remove('hidden');
  }

  // --- 7. PARTICLE SYSTEM ---
  function spawnMergeParticles(x, y, color, count = 24) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity on particles
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
      }
    }
  }

  function updateShockwaves() {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += 7;
      sw.alpha -= 0.025;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
      }
    }
  }

  function renderShockwaves() {
    shockwaves.forEach(sw => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  function updateFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.012;
      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
      }
    }
  }

  function renderFloatingTexts() {
    floatingTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      const fontSize = ft.fontSize || 20;
      ctx.font = `900 ${fontSize}px 'Orbitron', 'Zen Kaku Gothic New', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = ft.color || '#fef08a';
      ctx.shadowColor = ft.shadowColor || '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    });
  }

  // --- 8. RENDERING LOOP ---
  function gameLoop() {
    // Step Matter.js Physics Engine
    Matter.Engine.update(engine, 1000 / 60);

    // Clear Canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Screen Shake Transform
    ctx.save();
    if (shakeIntensity > 0.1) {
      const angle = Math.random() * Math.PI * 2;
      const offsetX = Math.cos(angle) * shakeIntensity;
      const offsetY = Math.sin(angle) * shakeIntensity;
      ctx.translate(offsetX, offsetY);
      shakeIntensity *= SHAKE_DECAY;
    } else {
      shakeIntensity = 0;
    }

    // Draw Background Stars
    drawBackground();

    // Check Danger Line Status
    checkDangerLine();

    // Render Physics Bodies (Planets)
    renderPlanets();

    // Update & Render Black Hole
    updateBlackHole();
    drawBlackHoleVisual();

    // Render Drop Preview & Aim Line
    if (!isGameOver && !isDropCoolingDown) {
      renderAimGuide();
    }

    // Render Shockwaves & Floating Texts
    updateShockwaves();
    renderShockwaves();

    // Render Particles
    updateParticles();
    renderParticles();

    // Render Flash Overlay if active
    if (screenFlashAlpha > 0.01) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${screenFlashAlpha})`;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      screenFlashAlpha *= 0.92;
      ctx.restore();
    } else {
      screenFlashAlpha = 0;
    }

    updateFloatingTexts();
    renderFloatingTexts();

    ctx.restore(); // Restore Shake Transform

    // Render Evolution Modal Canvases if visible
    if (!elInfoModal.classList.contains('hidden')) {
      renderEvolutionCanvases();
    }

    requestAnimationFrame(gameLoop);
  }

  function renderEvolutionCanvases() {
    const evoCanvases = document.querySelectorAll('.evo-canvas');
    const origCtx = ctx;

    evoCanvases.forEach(c => {
      const level = parseInt(c.getAttribute('data-level'), 10);
      if (isNaN(level) || !PLANETS[level]) return;

      const pCtx = c.getContext('2d');
      pCtx.clearRect(0, 0, c.width, c.height);

      ctx = pCtx;
      const planetDef = PLANETS[level];

      let previewRadius = 9 + level * 0.85;
      if (planetDef.details === 'pluto') previewRadius = 8;
      if (planetDef.details === 'saturn') previewRadius = 13;
      if (planetDef.details === 'jupiter') previewRadius = 17;
      if (planetDef.details === 'sun') previewRadius = 17;

      const previewDef = { ...planetDef, radius: previewRadius };

      drawPlanetVisual(c.width / 2, c.height / 2, previewDef, 0);
    });

    ctx = origCtx;
  }

  function drawBackground() {
    // Subtle star twinkle
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      s.alpha += Math.sin(Date.now() * s.speed) * 0.01;
      const clampedAlpha = Math.max(0.1, Math.min(0.9, s.alpha));
      ctx.globalAlpha = clampedAlpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw Danger Line on Canvas
    if (dangerTimer > 0) {
      const pulse = Math.sin(Date.now() * 0.012) * 0.3 + 0.7;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.9 * pulse})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
    }
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, DANGER_LINE_Y);
    ctx.lineTo(CANVAS_WIDTH, DANGER_LINE_Y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Draw Visual Ground Platform
    drawGroundPlatform();
  }

  function drawGroundPlatform() {
    const gy = GROUND_Y;

    // 1. Futuristic Base Floor Platform (Rich dark slate-indigo gradient)
    const baseGrad = ctx.createLinearGradient(0, gy, 0, CANVAS_HEIGHT);
    baseGrad.addColorStop(0, '#1e2942');
    baseGrad.addColorStop(0.3, '#111827');
    baseGrad.addColorStop(1, '#0a0f1d');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, gy, CANVAS_WIDTH, CANVAS_HEIGHT - gy);

    // 2. Glowing Surface Laser Beam (Cyan-Indigo-Purple Neon Gradient)
    const beamGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
    beamGrad.addColorStop(0, '#6366f1');
    beamGrad.addColorStop(0.25, '#38bdf8');
    beamGrad.addColorStop(0.5, '#a855f7');
    beamGrad.addColorStop(0.75, '#38bdf8');
    beamGrad.addColorStop(1, '#6366f1');

    ctx.save();
    ctx.strokeStyle = beamGrad;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(CANVAS_WIDTH, gy);
    ctx.stroke();

    // 3. Technical Grid Accent Hatching on the floor platform
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 0;
    for (let x = 16; x < CANVAS_WIDTH; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, gy + 2);
      ctx.lineTo(x - 6, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // 4. Bottom Edge Line
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, CANVAS_HEIGHT - 0.5);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function checkDangerLine() {
    if (isGameOver || isBlackHoleActive) return;

    const bodies = Matter.Composite.allBodies(world);
    let isAboveDanger = false;

    for (let body of bodies) {
      if (body.isPlanet && body.isDropped) {
        const radius = body.circleRadius || (PLANETS[body.planetLevel] ? PLANETS[body.planetLevel].radius : 0);
        const topY = body.position.y - radius;

        // Trigger danger state if top of planet is above DANGER_LINE_Y (105)
        // and planet is not rapidly free-falling downward (velocity.y < 2.0)
        if (topY < DANGER_LINE_Y && body.velocity.y < 2.0) {
          isAboveDanger = true;
          break;
        }
      }
    }

    if (isAboveDanger) {
      dangerTimer++;
      elDangerLine.classList.add('warning');
      if (dangerTimer > DANGER_TIME_LIMIT) {
        triggerGameOver();
      }
    } else {
      dangerTimer = Math.max(0, dangerTimer - 1);
      if (dangerTimer === 0) {
        elDangerLine.classList.remove('warning');
      }
    }
  }

  function renderAimGuide() {
    const currentDef = PLANETS[currentPlanetIndex];

    // Vertical dashed guide line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pointerX, DROP_SPAWN_Y);
    ctx.lineTo(pointerX, GROUND_Y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw translucent preview planet at spawn position
    ctx.save();
    ctx.globalAlpha = 0.85;
    drawPlanetVisual(pointerX, DROP_SPAWN_Y, currentDef, 0);
    ctx.restore();
  }

  function renderPlanets() {
    const bodies = Matter.Composite.allBodies(world);

    for (let body of bodies) {
      if (body.isPlanet) {
        const planetDef = PLANETS[body.planetLevel];
        if (!planetDef) continue;

        // Visual spaghettification & shrinking when sucked into Black Hole
        let drawDef = planetDef;
        if (isBlackHoleActive && blackHole) {
          const dx = blackHole.x - body.position.x;
          const dy = blackHole.y - body.position.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            const scale = Math.max(0.18, Math.min(1.0, dist / 180));
            drawDef = { ...planetDef, radius: planetDef.radius * scale };
          }
        }

        drawPlanetVisual(body.position.x, body.position.y, drawDef, body.angle);

        // Emit glowing solar embers around active Sun
        if (planetDef.details === 'sun' && Math.random() < 0.45) {
          const angle = Math.random() * Math.PI * 2;
          const dist = planetDef.radius * (0.95 + Math.random() * 0.45);
          particles.push({
            x: body.position.x + Math.cos(angle) * dist,
            y: body.position.y + Math.sin(angle) * dist,
            vx: Math.cos(angle) * 0.9,
            vy: Math.sin(angle) * 0.9 - 0.5,
            radius: Math.random() * 3 + 1,
            color: Math.random() > 0.5 ? '#fef08a' : '#f97316',
            alpha: 1,
            decay: 0.025
          });
        }
      }
    }
  }

  function drawSunVisual(ctx, r) {
    const time = Date.now() * 0.0018;

    // 1. Multi-layered Pulsing Glow Aura
    const pulseGlow = Math.sin(time * 3) * 0.08 + 1.05;
    const glow1 = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.85 * pulseGlow);
    glow1.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
    glow1.addColorStop(0.35, 'rgba(249, 115, 22, 0.6)');
    glow1.addColorStop(0.75, 'rgba(239, 68, 68, 0.25)');
    glow1.addColorStop(1, 'transparent');

    ctx.fillStyle = glow1;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.85 * pulseGlow, 0, Math.PI * 2);
    ctx.fill();

    // 2. Rotating Outer Solar Plasma Rays (16 rays)
    ctx.save();
    ctx.rotate(time);
    const rayCount = 16;
    for (let i = 0; i < rayCount; i++) {
      const rayAngle = (Math.PI * 2 / rayCount) * i;
      const rayLen = r * (1.38 + 0.14 * Math.sin(time * 4 + i));
      const rayW = r * 0.18;

      ctx.save();
      ctx.rotate(rayAngle);

      const rayGrad = ctx.createLinearGradient(r * 0.6, 0, rayLen, 0);
      rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      rayGrad.addColorStop(0.35, 'rgba(250, 204, 21, 0.75)');
      rayGrad.addColorStop(0.75, 'rgba(239, 68, 68, 0.4)');
      rayGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(r * 0.6, -rayW / 2);
      ctx.lineTo(rayLen, 0);
      ctx.lineTo(r * 0.6, rayW / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 3. Counter-rotating Inner Corona Flares (12 flares)
    ctx.save();
    ctx.rotate(-time * 0.85);
    for (let i = 0; i < 12; i++) {
      const flareAngle = (Math.PI * 2 / 12) * i;
      const flareLen = r * (1.22 + 0.12 * Math.cos(time * 3 + i * 2));
      const flareW = r * 0.22;

      ctx.save();
      ctx.rotate(flareAngle);

      const flareGrad = ctx.createLinearGradient(r * 0.7, 0, flareLen, 0);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      flareGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.8)');
      flareGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = flareGrad;
      ctx.beginPath();
      ctx.moveTo(r * 0.7, -flareW / 2);
      ctx.lineTo(flareLen, 0);
      ctx.lineTo(r * 0.7, flareW / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 4. Sun Sphere Body with Fiery Core Gradient
    const sunBodyGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r);
    sunBodyGrad.addColorStop(0, '#ffffff');
    sunBodyGrad.addColorStop(0.25, '#fef08a');
    sunBodyGrad.addColorStop(0.6, '#f97316');
    sunBodyGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = sunBodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 5. Surface Plasma Waves inside Sphere
    ctx.save();
    ctx.clip();

    const p1 = Math.sin(time * 3.5) * 0.08;
    const p2 = Math.cos(time * 2.8) * 0.08;

    ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
    ctx.beginPath();
    ctx.arc(-r * 0.2 + p1 * r, -r * 0.25, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.arc(r * 0.15, r * 0.2 + p2 * r, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawPlanetVisual(x, y, planetDef, angle) {
    const r = planetDef.radius;

    ctx.save();
    ctx.translate(x, y);

    // Custom flashy rendering for the Sun
    if (planetDef.details === 'sun') {
      drawSunVisual(ctx, r);

      // Label / Name overlay inside planet
      ctx.fillStyle = '#ffffff';
      const sunFontScale = isJapanese ? 0.38 : 0.35;
      const sunFontFam = isJapanese ? "'Zen Kaku Gothic New', sans-serif" : "'Orbitron', sans-serif";
      ctx.font = `900 ${Math.floor(r * sunFontScale)}px ${sunFontFam}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 12;
      ctx.fillText(getPlanetDisplayName(planetDef), 0, 0);

      ctx.restore();
      return;
    }

    // Planet Glow Outer Radial Gradient
    const glowGrad = ctx.createRadialGradient(0, 0, r * 0.7, 0, 0, r * 1.35);
    glowGrad.addColorStop(0, planetDef.glow);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 1. Draw BACK portion of Saturn's ring BEFORE planet body
    if (planetDef.details === 'saturn') {
      ctx.save();
      ctx.rotate(angle);
      drawSaturnRing(ctx, r, true); // Back half
      ctx.restore();
    }

    // 2. Planet Base Sphere Gradient (3D light source from top-left)
    const bodyGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    bodyGrad.addColorStop(0, '#ffffff');
    bodyGrad.addColorStop(0.35, planetDef.color);
    bodyGrad.addColorStop(1, adjustColor(planetDef.color, -50));
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // 3. Details inside sphere boundary (surface bands, craters, etc.)
    ctx.save();
    ctx.rotate(angle);
    drawPlanetDetails(ctx, planetDef.details, r);
    ctx.restore();

    // 4. Draw FRONT portion of Saturn's ring AFTER planet body
    if (planetDef.details === 'saturn') {
      ctx.save();
      ctx.rotate(angle);
      drawSaturnRing(ctx, r, false); // Front half
      ctx.restore();
    }

    // Label / Name overlay inside planet
    if (r >= 22) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      const fontScale = isJapanese ? 0.35 : 0.26;
      const fontFam = isJapanese ? "'Zen Kaku Gothic New', sans-serif" : "'Orbitron', sans-serif";
      ctx.font = `bold ${Math.max(9, Math.floor(r * fontScale))}px ${fontFam}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 4;
      ctx.fillText(getPlanetDisplayName(planetDef), 0, 0);
    }

    ctx.restore();
  }

  function drawSaturnRing(ctx, r, isBackHalf) {
    ctx.save();
    ctx.rotate(-0.25); // Slight tilt for 3D perspective
    ctx.scale(1, 0.35);

    // Extend angles slightly past 0 and PI to seamlessly join arcs
    const startAngle = isBackHalf ? Math.PI - 0.05 : -0.05;
    const endAngle = isBackHalf ? Math.PI * 2 + 0.05 : Math.PI + 0.05;

    // Outer Main Ring
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.78)';
    ctx.lineWidth = r * 0.38;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.45, startAngle, endAngle);
    ctx.stroke();

    // Inner Ring Detail / Cassini Division Accent
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.95)';
    ctx.lineWidth = r * 0.15;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.3, startAngle, endAngle);
    ctx.stroke();

    // Outer Edge Glow Rim
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = r * 0.04;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.62, startAngle, endAngle);
    ctx.stroke();

    ctx.restore();
  }

  function drawPlanetDetails(ctx, detailType, r) {
    ctx.save();
    ctx.clip(); // Clip surface details to sphere boundary

    if (detailType === 'pluto') {
      // Tombaugh Regio (Heart-shaped nitrogen ice plain) & subtle frost
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-r * 0.1, r * 0.05, r * 0.32, r * 0.22, Math.PI / 6, 0, Math.PI * 2);
      ctx.ellipse(r * 0.1, r * 0.05, r * 0.3, r * 0.2, -Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      // Frost crater spot
      ctx.fillStyle = 'rgba(214, 211, 209, 0.5)';
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.25, r * 0.15, 0, Math.PI * 2);
      ctx.fill();
    } else if (detailType === 'moon') {
      // Craters
      ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.beginPath();
      ctx.arc(-r * 0.3, -r * 0.2, r * 0.22, 0, Math.PI * 2);
      ctx.arc(r * 0.25, r * 0.3, r * 0.18, 0, Math.PI * 2);
      ctx.arc(r * 0.1, -r * 0.4, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    } else if (detailType === 'earth') {
      // Continents patch
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.beginPath();
      ctx.arc(-r * 0.2, -r * 0.1, r * 0.45, 0, Math.PI * 2);
      ctx.arc(r * 0.3, r * 0.2, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (detailType === 'jupiter') {
      // Cloud Bands (Layered ochre & deep brown bands)
      ctx.fillStyle = 'rgba(120, 65, 15, 0.45)';
      ctx.fillRect(-r, -r * 0.55, r * 2, r * 0.22);
      ctx.fillStyle = 'rgba(180, 110, 30, 0.35)';
      ctx.fillRect(-r, -r * 0.25, r * 2, r * 0.15);
      ctx.fillStyle = 'rgba(100, 50, 10, 0.4)';
      ctx.fillRect(-r, r * 0.18, r * 2, r * 0.22);
      // Great Red Spot (大赤斑)
      ctx.fillStyle = 'rgba(190, 45, 25, 0.85)';
      ctx.beginPath();
      ctx.ellipse(r * 0.35, r * 0.25, r * 0.26, r * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (detailType === 'saturn') {
      // Surface bands on Saturn sphere
      ctx.fillStyle = 'rgba(161, 98, 7, 0.3)';
      ctx.fillRect(-r, -r * 0.3, r * 2, r * 0.2);
      ctx.fillRect(-r, r * 0.1, r * 2, r * 0.25);
    } else if (detailType === 'sun') {
      // Solar Flare Swirls
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function renderParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // Color brightness helper
  function adjustColor(col, amt) {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  // Start app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
