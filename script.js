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
      name: '月',
      enName: 'Moon',
      radius: 17,
      mass: 1.0,
      color: '#cbd5e1',
      glow: '#f1f5f9',
      score: 2,
      details: 'moon'
    },
    {
      level: 1,
      name: '水星',
      enName: 'Mercury',
      radius: 24,
      mass: 1.4,
      color: '#94a3b8',
      glow: '#cbd5e1',
      score: 4,
      details: 'mercury'
    },
    {
      level: 2,
      name: '火星',
      enName: 'Mars',
      radius: 33,
      mass: 2.0,
      color: '#ef4444',
      glow: '#fca5a5',
      score: 8,
      details: 'mars'
    },
    {
      level: 3,
      name: '金星',
      enName: 'Venus',
      radius: 43,
      mass: 2.8,
      color: '#f59e0b',
      glow: '#fde047',
      score: 16,
      details: 'venus'
    },
    {
      level: 4,
      name: '地球',
      enName: 'Earth',
      radius: 54,
      mass: 3.8,
      color: '#0284c7',
      glow: '#38bdf8',
      score: 32,
      details: 'earth'
    },
    {
      level: 5,
      name: '海王星',
      enName: 'Neptune',
      radius: 66,
      mass: 5.0,
      color: '#4338ca',
      glow: '#818cf8',
      score: 64,
      details: 'neptune'
    },
    {
      level: 6,
      name: '天王星',
      enName: 'Uranus',
      radius: 79,
      mass: 6.5,
      color: '#0d9488',
      glow: '#2dd4bf',
      score: 128,
      details: 'uranus'
    },
    {
      level: 7,
      name: '土星',
      enName: 'Saturn',
      radius: 93,
      mass: 8.5,
      color: '#eab308',
      glow: '#fef08a',
      score: 256,
      details: 'saturn'
    },
    {
      level: 8,
      name: '木星',
      enName: 'Jupiter',
      radius: 110,
      mass: 11.0,
      color: '#c07d32',
      glow: '#fef3c7',
      score: 512,
      details: 'jupiter'
    },
    {
      level: 9,
      name: '太陽',
      enName: 'Sun',
      radius: 130,
      mass: 15.0,
      color: '#fbbf24',
      glow: '#fef08a',
      score: 1024,
      details: 'sun'
    }
  ];

  // --- 2. GAME STATE & CONSTANTS ---
  const CANVAS_WIDTH = 440;
  const CANVAS_HEIGHT = 660;
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

  let particles = [];
  let stars = [];
  let isMuted = false;

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

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playDropSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playMergeSound(level) {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const baseFreq = 240 + level * 55;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  function playGameOverSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  }

  function playSunCreationSound() {
    if (isMuted || !audioCtx) return;
    try {
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // Fanfare C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = audioCtx.currentTime + idx * 0.09;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.6);
      });
    } catch (e) {}
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
    const ground = Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 15, CANVAS_WIDTH + 100, 30, {
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

    // Setup input listeners
    setupInputs();

    // Setup next planet queue
    currentPlanetIndex = getRandomSpawnLevel();
    nextPlanetIndex = getRandomSpawnLevel();
    updateNextPlanetUI();

    // Setup evolution modal previews
    renderEvolutionCanvases();

    // Start Animation Render Loop
    requestAnimationFrame(gameLoop);
  }

  function getRandomSpawnLevel() {
    // Only spawn Moon, Mercury, Mars, or Venus (levels 0-3)
    return Math.floor(Math.random() * 4);
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
    btnSound.addEventListener('click', () => {
      isMuted = !isMuted;
      iconSoundOn.classList.toggle('hidden', isMuted);
      iconSoundOff.classList.toggle('hidden', !isMuted);
    });

    btnInfo.addEventListener('click', () => {
      elInfoModal.classList.remove('hidden');
      renderEvolutionCanvases();
    });

    btnCloseInfo.addEventListener('click', () => {
      elInfoModal.classList.add('hidden');
    });

    btnStartGame.addEventListener('click', () => {
      elInfoModal.classList.add('hidden');
    });

    btnRestart.addEventListener('click', resetGame);
    btnPlayAgain.addEventListener('click', resetGame);
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

        // Schedule removal and spawn of next planet body
        setTimeout(() => {
          Matter.Composite.remove(world, bodyA);
          Matter.Composite.remove(world, bodyB);

          addScore(PLANETS[currentLevel].score * 2);
          playMergeSound(nextLevel);
          spawnMergeParticles(midX, midY, PLANETS[Math.min(nextLevel, PLANETS.length - 1)].color);

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
            if (nextLevel === 9) {
              triggerSunCreationVictory(midX, midY);
            }
          }
        }, 0);
      }
    }
  }

  function triggerSunCreationVictory(x, y) {
    playSunCreationSound();
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
      text: '☀️ 太陽誕生！ BONUS +5000',
      x: x,
      y: y - 20,
      vy: -1.4,
      alpha: 1.0
    });
  }

  function addScore(points) {
    score += points;
    elCurrentScore.textContent = score;

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
    elNextName.textContent = nextDef.name;
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
    elMaxPlanetReached.textContent = PLANETS[maxLevelReached].name;

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
      ctx.font = "900 20px 'Orbitron', 'Zen Kaku Gothic New', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
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

    // Draw Background Stars
    drawBackground();

    // Check Danger Line Status
    checkDangerLine();

    // Render Physics Bodies (Planets)
    renderPlanets();

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

    updateFloatingTexts();
    renderFloatingTexts();

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

      let previewRadius = 10 + level * 0.9;
      if (level === 7) previewRadius = 13; // Saturn
      if (level === 8) previewRadius = 17; // Jupiter
      if (level === 9) previewRadius = 17; // Sun

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
    ctx.strokeStyle = dangerTimer > 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, DANGER_LINE_Y);
    ctx.lineTo(CANVAS_WIDTH, DANGER_LINE_Y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function checkDangerLine() {
    if (isGameOver) return;

    const bodies = Matter.Composite.allBodies(world);
    let isAboveDanger = false;

    for (let body of bodies) {
      if (body.isPlanet && body.isDropped) {
        const topY = body.position.y - body.circleRadius;
        if (topY < DANGER_LINE_Y && Math.abs(body.velocity.y) < 0.4) {
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
      dangerTimer = Math.max(0, dangerTimer - 2);
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
    ctx.lineTo(pointerX, CANVAS_HEIGHT);
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
        drawPlanetVisual(body.position.x, body.position.y, planetDef, body.angle);

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
      ctx.font = `900 ${Math.floor(r * 0.38)}px 'Zen Kaku Gothic New', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 12;
      ctx.fillText(planetDef.name, 0, 0);

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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = `bold ${Math.max(10, Math.floor(r * 0.35))}px 'Zen Kaku Gothic New', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(planetDef.name, 0, 0);
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

    if (detailType === 'moon') {
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
