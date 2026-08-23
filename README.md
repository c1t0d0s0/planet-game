# 🪐 PLANET MERGE (Celestial Body Merge Game)

A stunning, dark space-themed Suika Game (Watermelon Game) clone built with HTML5 Canvas, Vanilla CSS, JavaScript, and the **Matter.js** 2D physics engine. Players drop celestial bodies into a cosmic container and merge identical bodies to evolve them from the Moon all the way up to the radiant Sun!

[日本語版 README (README.ja.md)](README.ja.md)

---

## 🌟 Celestial Evolution Hierarchy

Merge 2 identical celestial bodies to evolve into the next level:

1. **Moon** - `+2 pts` (Small slate cratered moon)
2. **Mercury** - `+4 pts` (Metallic gray rocky planet)
3. **Mars** - `+8 pts` (Rusty red planet)
4. **Venus** - `+16 pts` (Golden atmosphere planet)
5. **Earth** - `+32 pts` (Blue ocean with continents and atmosphere rim)
6. **Neptune** - `+64 pts` (Deep indigo gas giant)
7. **Uranus** - `+128 pts` (Cyan icy planet)
8. **Saturn** - `+256 pts` (3D tilted ring depth effect)
9. **Jupiter** - `+512 pts` (Authentic ochre bands and Great Red Spot)
10. **Sun** - `+1024 pts + 5000 BONUS` (16-ray rotating plasma flares, corona aura, fanfare victory explosion)

---

## 🕳️ Sun Merge: Black Hole & Supernova Sequence

When two **Suns (Level 9) merge**, they trigger the game's ultimate cosmic event: the **Black Hole Sequence**!

1. **Singularity Awakening**: A photorealistic Black Hole emerges at the collision epicenter, featuring an Event Horizon void, rotating accretion disk with relativistic Doppler beaming, photon sphere, and gravitational lensing glow.
2. **Orbital Infall & Spaghettification**: All remaining planets on the board enter an elliptical orbital swirl, shrinking in size and emitting streaming plasma trails as they are drawn across the event horizon.
3. **Singularity Collapse**: Once all planets are ingested, the Black Hole contracts into an ultra-dense sub-pixel singularity with building tension audio and intensifying screen vibration.
4. **Supernova Detonation**: A full-screen white flash detonates 6 concentric rainbow shockwaves and 300+ glistening stardust firework particles with a triumphant 7-voice fanfare.
5. **Grand Super Bonus & Seamless Continuation**: Earn `+15,000 pts` (+ ingestion bonuses), leaving the board completely clear to continue your high-score run.

> 💡 **Debug / Test Mode (`?test`)**:  
> Append `?test` to the URL (e.g. `index.html?test`) to start with pre-placed planets and a Sun in your drop queue, allowing instant testing of the Black Hole merge sequence.

---

## ✨ Features

- **2D Physics Engine**: Powered by **Matter.js** for realistic gravity, rolling, friction, and bounce physics.
- **Black Hole & Supernova**: Epic multi-stage cosmic vortex swallowing all planets followed by a massive Supernova burst.
- **Combo System & Screen Shake**: Multi-hit merge combo multipliers and dynamic screen shake physics.
- **Custom HTML5 Canvas Renderer**: Dynamic lighting gradients, Saturn 3D ring layer ordering, Jupiter ochre cloud bands, animated Sun solar flare rotation, and Black Hole accretion vortex.
- **Synthesized Audio (Web Audio API)**: Real-time procedural audio synthesis without external assets (drop pop, rising pitch merge sounds, deep sub-bass gravitational drone, and Supernova fanfare).
- **Internationalization (i18n)**: Automatic language detection (Japanese/English) with an instant header toggle button (`EN / JA`).
- **Responsive & Touch Support**: Fully responsive UI supporting desktop mouse dragging/clicking and mobile touch gestures (`touch-action: none`).
- **Interactive Evolution Preview Modal**: Displays live animated mini-canvas previews of all 10 celestial bodies.
- **High Score Persistence**: Automatically saves your best score in browser `localStorage`.
- **GitHub Actions Deployment**: Automated deployment to GitHub Pages upon pushing version tags (`v*`).

---

## 📁 File Structure

```text
planet-game/
├── index.html       # HTML structure, Matter.js CDN, modals, Gtag setup
├── style.css        # Cosmic space dark theme, glassmorphism UI, grid styles
├── script.js        # Matter.js physics engine, Black Hole, canvas renderer, Web Audio synth
├── config.js        # Analytics configuration (GTM_ID) - gitignored
├── .github/
│   └── workflows/
│       └── deploy.yml # GitHub Pages automated deployment workflow
├── README.md        # English README
├── README.ja.md     # Japanese README
└── .gitignore
```

