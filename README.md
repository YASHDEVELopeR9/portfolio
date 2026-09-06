# 🌸 Minecraft 3D Player Profile & Portfolio | Yash Vishwakarma

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://pages.github.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black?logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5 / CSS3 / JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-orange.svg)](#technologies)

An interactive, Minecraft-themed 3D player profile and developer portfolio for **Yash Vishwakarma** (Web Developer, WordPress Designer & Python Builder). Features an interactive 3D PBR character mesh rendered via WebGL, procedural Web Audio SFX, Cherry Grove particle physics, and an authentic Minecraft GUI.

---

## 🎮 Features

- **🧊 Interactive 3D PBR Player Mesh**:
  - Rendered in real-time with **Three.js** WebGL engine and `GLTFLoader`.
  - Auto-centering and responsive camera framing so the character is fully visible (head to toe) on all screens.
  - **OrbitControls**: Drag to rotate, scroll to zoom, and right-click to pan.
  - **Armor & Material Switcher**: Live shader swap between **Original Colors**, **Dark Titanium**, **Diamond Cyan**, and **Netherite Gold**.
  - **Auto-Spin & Reset Controls**: 1-click camera reset and auto-rotation toggle.
  - Interactive greeting speech bubbles when clicking the player.

- **📜 Authentic Minecraft GUI & Profile Card**:
  - Beveled retro panels with pixel art typography (`Press Start 2P`, `Silkscreen`, `VT323`).
  - Custom pixel-art avatar matching the 3D character mesh.
  - Player stats (Class, Level, Spawn location in Dewas, MP, Online status).
  - Skill badges: **HTML5**, **CSS3**, **JavaScript**, **Python**, **WordPress**, **Bootstrap**.

- **🏆 Journey Log & Certificate Showcase**:
  - Modal with tabs for **Certificates & Badges**, **Skill Enchantments**, and **Courier Dispatch (Contact)**.
  - Built-in interactive **Lightbox preview** for high-resolution certificate and resume inspection:
    - *Google | Kaggle AI Agents Certification*
    - *Kaggle Python Coder*
    - *Kaggle Code Forker*
    - *Wardhan WordPress Designer Certificate*
    - *Yash Vishwakarma Developer Resume*

- **🌸 Atmospheric Cherry Grove Biome**:
  - Clean landscape background showcasing the scenic Cherry Blossom biome.
  - Procedural 2D canvas particle simulation of falling cherry petals with wind turbulence and mouse interaction.
  - **Day / Night Ambience Toggle**: Synchronizes background lighting, stars, and 3D WebGL scene lights.
  - Optional **CRT Scanline Overlay** toggle for retro arcade CRT nostalgia.

- **🔊 Procedural Web Audio API SFX**:
  - Authentic wooden button clicks, hotbar pop switches, and level-up XP pickup chimes generated purely via browser oscillators (zero external audio files required!).

- **🎒 9-Slot Interactive Hotbar**:
  - Number key shortcuts (`1` through `9`) to switch slots.
  - Custom SVG item icons (Grass Block, Nether Star, Ender Pearl, Emerald, Clock, Book & Quill, etc.).
  - Rich lore tooltips on hover.

---

## 📂 Repository Structure

```text
portfolio/
├── assets/
│   ├── certificates/
│   │   ├── cert_google_ai_agents.png       # Google | Kaggle AI Agents credential
│   │   ├── cert_python_coder.png          # Kaggle Python Coder credential
│   │   ├── cert_code_forker.png           # Kaggle Code Forker credential
│   │   ├── cert_wordpress_wardhan.jpg     # Wardhan WordPress certificate
│   │   └── resume_yash_vishwakarma.jpg    # Full Developer Resume
│   ├── icons/
│   │   ├── book-quill.svg, chest.svg, clock.svg, drumstick.svg,
│   │   ├── emerald.svg, enchanted-book.svg, ender-pearl.svg,
│   │   ├── grass-block.svg, heart.svg, nether-star.svg, player-head.svg ...
│   ├── character.glb                      # Full-color 3D PBR player model
│   ├── cherry_grove_bg.jpg                # Scenic Cherry Grove biome background
│   ├── logo.jpg                           # Square 3D character profile logo
│   └── player_avatar.jpg                  # Pixel-art player avatar
├── index.html                             # Semantic HTML5 Minecraft GUI layout
├── style.css                              # Authentically styled Minecraft retro CSS
├── script.js                              # WebGL 3D engine, Web Audio SFX & physics
├── LICENSE                                # MIT License
└── README.md                              # Documentation
```

---

## 🚀 Quick Start & Local Preview

No heavy frameworks or build dependencies required. Simply open `index.html` via a local web server (required for loading the `.glb` 3D model asset):

### Option 1: Python
```bash
python -m http.server 8080
```
Open your browser at: `http://localhost:8080`

### Option 2: VS Code Live Server
1. Install the **Live Server** extension in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Node.js (npx serve)
```bash
npx serve .
```

---

## 🌐 Deploy to GitHub Pages in 1 Minute

1. Push this repository to GitHub or upload the files.
2. On GitHub, navigate to your repository **Settings**.
3. In the left sidebar, click **Pages**.
4. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
5. Click **Save**.
6. Your 3D Minecraft Portfolio will be live at:
   `https://<your-username>.github.io/<repo-name>/`

---

## 🛠️ Built With

- **HTML5 & Modern CSS3**: Custom grid & flexbox, CSS variables, backdrop filters.
- **JavaScript (ES6+)**: Vanilla interactive logic and Web Audio API synthesis.
- **Three.js (r128)**: WebGL 3D character viewport, PBR shader materials, OrbitControls.
- **Canvas 2D API**: Realistic Cherry Blossom falling petal physics.

---

## 👤 Author

**Yash Vishwakarma**
- **Spawn / Location**: D2/64 Awas Nager, Dewas, (M.P) 455001, India
- **Email**: [yashvishwakarma48@gmail.com](mailto:yashvishwakarma48@gmail.com)
- **Phone**: +91 8103650250

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
