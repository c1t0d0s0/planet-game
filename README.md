# 🪐 PLANET MERGE (Celestial Body Merge Game)

A stunning, dark space-themed Suika Game (Watermelon Game) clone built with HTML5 Canvas, Vanilla CSS, JavaScript, and the **Matter.js** 2D physics engine. Players drop celestial bodies into a cosmic container and merge identical bodies to evolve them from the Moon all the way up to the radiant Sun!

[日本語版 README (README.ja.md)](README.ja.md)

---

## 🌟 Celestial Evolution Hierarchy

Merge 2 identical celestial bodies to evolve into the next level:

1. **Moon (月)** - `+2 pts` (Small slate cratered moon)
2. **Mercury (水星)** - `+4 pts` (Metallic gray rocky planet)
3. **Mars (火星)** - `+8 pts` (Rusty red planet)
4. **Venus (金星)** - `+16 pts` (Golden atmosphere planet)
5. **Earth (地球)** - `+32 pts` (Blue ocean with continents and atmosphere rim)
6. **Neptune (海王星)** - `+64 pts` (Deep indigo gas giant)
7. **Uranus (天王星)** - `+128 pts` (Cyan icy planet)
8. **Saturn (土星)** - `+256 pts` (3D tilted ring depth effect)
9. **Jupiter (木星)** - `+512 pts` (Authentic ochre bands and Great Red Spot)
10. **Sun (太陽)** - `+1024 pts + 5000 BONUS` (16-ray rotating plasma flares, corona aura, fanfare victory explosion)

---

## ✨ Features

- **2D Physics Engine**: Powered by **Matter.js** for realistic gravity, rolling, friction, and bounce physics.
- **Custom HTML5 Canvas Renderer**: Dynamic lighting gradients, Saturn 3D ring layer ordering, Jupiter ochre cloud bands, and animated Sun solar flare rotation.
- **Sound Effects**: Synthesized audio using **Web Audio API** (drop pop sound, rising pitch merge sounds, Sun fanfare chord, game over sound).
- **Responsive & Touch Support**: Fully responsive UI supporting desktop mouse dragging/clicking and mobile touch gestures (`touch-action: none`).
- **Interactive Evolution Preview Modal**: Displays live animated mini-canvas previews of all 10 celestial bodies.
- **High Score Persistence**: Automatically saves your best score in browser `localStorage`.
- **Google Tag Manager / Analytics Integration**: Dynamic Gtag loading from `config.js`.

---

## 📁 File Structure

```text
planet-game/
├── index.html       # HTML structure, Matter.js CDN, modals, Gtag setup
├── style.css        # Cosmic space dark theme, glassmorphism UI, grid styles
├── script.js        # Matter.js physics engine, canvas renderer, Web Audio synth
├── config.js        # Analytics configuration (GTM_ID)
└── .gitignore       # Excludes config.js and PROMPT.txt from Git
```

---

## 🚀 How to Run

Simply open `index.html` in any modern web browser, or launch a local HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.
