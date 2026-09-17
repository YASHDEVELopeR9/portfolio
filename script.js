/**
 * MINECRAFT PLAYER PROFILE - INTERACTIVE ENGINE
 * Features:
 * - Web Audio API procedural sound synthesizer (authentic Minecraft clicks, XP chimes, chest creaks)
 * - Canvas Cherry Blossom Petal physics with wind & mouse interaction
 * - 9-Slot Hotbar with 1-9 keyboard binds, slot selector glider, and lore tooltips
 * - Native Dialog modal with tabbed quest log and skill enchantments
 * - Day/Night ambience toggle & CRT scanlines toggle
 * - Interactive vitals (hearts, XP level gain)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (No external audio files required)
  // =========================================================================
  let audioCtx = null;
  let sfxEnabled = true;

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

  // Minecraft wooden button / UI click
  function playClickSound(pitch = 1.0) {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 * pitch, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.07);
  }

  // Hotbar item selection switch pop
  function playPopSound(slotNum = 1) {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const baseFreq = 420 + slotNum * 35;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  // Minecraft XP Orb Pickup Chime
  function playXpChime() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const freqs = [880, 1174, 1320, 1760];
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);
  }

  // Chest Open Creak
  function playChestSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(165, audioCtx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.23);
  }

  // Level Up / Fanfare
  function playLevelUpSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.32);
    });
  }

  // Damage Hit Sound
  function playDamageSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  }

  // Authentic Minecraft Villager Murmur ("Hrrr!")
  function playVillagerHrrr() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const filter = audioCtx.createBiquadFilter();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(125, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(95, audioCtx.currentTime + 0.28);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, audioCtx.currentTime);
    filter.Q.setValueAtTime(4.0, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.29);
  }

  // Villager Trade Agreement ("Hrrr!" chirp + emerald levelup chime)
  function playVillagerTradeYes() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    playVillagerHrrr();

    setTimeout(() => {
      if (!audioCtx) return;
      const chimeFreqs = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
      chimeFreqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startTime = audioCtx.currentTime + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    }, 120);
  }

  // --- MINECRAFT EMOTE SOUND SYNTHESIZERS ---
  function playJumpSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(420, audioCtx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.26, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.23);
  }

  function playSwordSweepSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, audioCtx.currentTime + 0.26);
    gain.gain.setValueAtTime(0.24, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.27);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.28);
  }

  function playClapSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + Math.random() * 40, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.28, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.07);
      }, i * 160);
    }
  }

  function playDiscoBeat() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const chords = [
      [261.63, 329.63, 392.00],
      [293.66, 369.99, 440.00],
      [329.63, 392.00, 493.88],
      [392.00, 493.88, 587.33]
    ];
    chords.forEach((chord, barIdx) => {
      setTimeout(() => {
        if (!audioCtx) return;
        chord.forEach((freq, noteIdx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const t = audioCtx.currentTime + noteIdx * 0.05;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t);
          osc.stop(t + 0.36);
        });
      }, barIdx * 350);
    });
  }

  // Enchantment Table Magical Resonance Chime
  function playEnchantSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const chords = [587.33, 880.00, 1174.66, 1760.00]; // D5, A5, D6, A6
    chords.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const startTime = audioCtx.currentTime + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, startTime + 0.4);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.46);
    });
  }

  // Book & Quill Page Flip / Paper Flutter
  function playPageFlipSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const bufferSize = audioCtx.sampleRate * 0.08;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.5, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (_) {
      playClickSound(1.5);
    }
  }

  // Emerald Pickup / Clink
  function playEmeraldClinkSound() {
    if (!sfxEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2800, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.13);
  }

  // =========================================================================
  // 2. CHERRY BLOSSOM PETALS PARTICLE SIMULATION (Canvas)
  // =========================================================================
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    updateSelectorPosition();
  });

  const isMobileDevice = window.innerWidth <= 868 || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  let petalCount = isMobileDevice ? 8 : 45;
  let petals = [];
  let mouse = { x: width / 2, y: height / 2, moved: false };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.moved = true;
  });

  const petalColors = [
    'rgba(255, 183, 197, 0.85)',
    'rgba(255, 192, 203, 0.8)',
    'rgba(255, 160, 185, 0.9)',
    'rgba(248, 200, 220, 0.75)',
    'rgba(255, 214, 224, 0.85)'
  ];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() * (width + 200) - 200;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1.4 + 0.8;
      this.speedX = Math.random() * 1.8 + 0.6;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 2;
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationOffset = Math.random() * Math.PI * 2;
      this.aspectRatio = Math.random() * 0.4 + 0.6;
    }

    update(time) {
      // Natural falling and wind sway
      this.y += this.speedY;
      const sway = Math.sin(time * this.oscillationSpeed + this.oscillationOffset) * 1.2;
      this.x += this.speedX + sway;
      this.rotation += this.rotSpeed;

      // Mouse draft effect
      if (mouse.moved) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          this.x += (dx / dist) * force * 4;
          this.y += (dy / dist) * force * 3;
        }
      }

      // Recycle when off-screen
      if (this.y > height + 20 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      // Pixel-style rounded petal polygon
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const w = this.size;
      const h = this.size * this.aspectRatio;

      ctx.moveTo(0, -h / 2);
      ctx.bezierCurveTo(w / 2, -h / 2, w / 2, h / 2, 0, h / 2);
      ctx.bezierCurveTo(-w / 2, h / 2, -w / 2, -h / 2, 0, -h / 2);
      ctx.fill();

      // Subtle center vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -h / 3);
      ctx.lineTo(0, h / 3);
      ctx.stroke();

      ctx.restore();
    }
  }

  function initPetals() {
    petals = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }
  }
  initPetals();

  let animFrameId;
  let lastPetalTime = 0;
  const petalInterval = isMobileDevice ? (1000 / 30) : 0;
  function animatePetals(time = 0) {
    animFrameId = requestAnimationFrame(animatePetals);
    if (isMobileDevice && time) {
      if (time - lastPetalTime < petalInterval) return;
      lastPetalTime = time;
    }
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update(time);
      petals[i].draw();
    }
  }
  requestAnimationFrame(animatePetals);

  // =========================================================================
  // 3. HOTBAR & ITEM SYSTEM
  // =========================================================================
  const hotbarSlots = document.querySelectorAll('.hotbar-slot');
  const hotbarSelector = document.getElementById('hotbar-selector');
  const tooltip = document.getElementById('mc-tooltip');
  const tooltipTitle = document.getElementById('tooltip-title');
  const tooltipLore = document.getElementById('tooltip-lore');
  const tooltipAction = document.getElementById('tooltip-action');

  let activeSlot = 2; // Default to Slot 2 (Charles's Head)

  function updateSelectorPosition() {
    const activeEl = document.querySelector(`.hotbar-slot[data-slot="${activeSlot}"]`);
    if (activeEl && hotbarSelector) {
      const rect = activeEl.getBoundingClientRect();
      const parentRect = activeEl.parentElement.getBoundingClientRect();
      const offsetLeft = rect.left - parentRect.left;
      hotbarSelector.style.transform = `translateX(${offsetLeft - 4}px)`;
    }
  }

  // Position selector on load
  setTimeout(updateSelectorPosition, 50);

  function selectSlot(slotNum, triggerAction = false) {
    const targetSlot = document.querySelector(`.hotbar-slot[data-slot="${slotNum}"]`);
    if (!targetSlot) return;

    activeSlot = slotNum;
    hotbarSlots.forEach((slot) => slot.classList.remove('active'));
    targetSlot.classList.add('active');
    updateSelectorPosition();
    playPopSound(slotNum);

    // Show tooltip briefly
    showTooltipForElement(targetSlot);

    if (triggerAction) {
      handleSlotAction(slotNum, targetSlot);
    }
  }

  function showTooltipForElement(el) {
    const name = el.dataset.name || 'Item';
    const rarity = el.dataset.rarity || 'common';
    const lore = el.dataset.lore || '';
    const key = el.dataset.key || '';

    tooltipTitle.textContent = name;
    tooltipTitle.className = `tooltip-title ${rarity}`;
    tooltipLore.textContent = lore;
    tooltipAction.textContent = `[Slot ${key} - Press ${key} or Click to trigger]`;

    const rect = el.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth || 220;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.top - 70;

    // Viewport bounds clamp
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.classList.add('visible');
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  // Hover & click listeners for hotbar
  hotbarSlots.forEach((slot) => {
    const slotNum = parseInt(slot.dataset.slot, 10);

    slot.addEventListener('mouseenter', () => {
      showTooltipForElement(slot);
    });

    slot.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    slot.addEventListener('click', () => {
      selectSlot(slotNum, true);
    });
  });

  // Keyboard navigation 1-9 & ESC Game Menu
  window.addEventListener('keydown', (e) => {
    // If typing inside an input, textarea or select, ignore hotbar keys
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'Escape') {
      const openDialog = [
        villagerTradeDialog,
        enchantmentDialog,
        chestDialog,
        bookDialog,
        pauseMenuDialog,
        journeyDialog,
        lightboxDialog,
        settingsDialog,
        hireDialog
      ].find((d) => d && d.open);

      if (openDialog) {
        closeAllGameDialogs();
        playClickSound(0.8);
      } else {
        openPauseMenu();
      }
      return;
    }

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      selectSlot(num, true);
    }
  });

  // =========================================================================
  // VIEW MODE SWITCHER: MINECRAFT GAME MENU (Screenshot 2) & PLAYER PROFILE (Screenshot 1)
  // =========================================================================
  const tabGameMenu = document.getElementById('tab-gamemenu');
  const tabProfile = document.getElementById('tab-profile');
  const menuView = document.getElementById('minecraft-title-menu');
  const profileView = document.getElementById('player-profile-card');
  const btnSwitchToMenu = document.getElementById('btn-switch-to-menu');

  function switchToView(viewName) {
    if (viewName === 'profile') {
      if (menuView) menuView.style.display = 'none';
      if (profileView) {
        profileView.style.display = 'block';
        profileView.style.animation = 'mcMenuFadeIn 0.25s ease-out';
      }
      if (tabProfile) tabProfile.classList.add('active');
      if (tabGameMenu) tabGameMenu.classList.remove('active');
    } else {
      if (profileView) profileView.style.display = 'none';
      if (menuView) {
        menuView.style.display = 'flex';
        menuView.style.animation = 'mcMenuFadeIn 0.25s ease-out';
      }
      if (tabGameMenu) tabGameMenu.classList.add('active');
      if (tabProfile) tabProfile.classList.remove('active');
    }
  }

  if (tabGameMenu) {
    tabGameMenu.addEventListener('click', () => {
      playClickSound(1.0);
      switchToView('gamemenu');
    });
  }

  if (tabProfile) {
    tabProfile.addEventListener('click', () => {
      playClickSound(1.1);
      switchToView('profile');
    });
  }

  if (btnSwitchToMenu) {
    btnSwitchToMenu.addEventListener('click', () => {
      playClickSound(0.9);
      switchToView('gamemenu');
    });
  }

  // Title Menu Buttons (Screenshot 2)
  const btnMenuEnterWorld = document.getElementById('btn-menu-enter-world');
  const btnMenuBuilds = document.getElementById('btn-menu-builds');
  const btnMenuTrades = document.getElementById('btn-menu-trades');
  const btnMenuContact = document.getElementById('btn-menu-contact');
  const btnMenuTheEnd = document.getElementById('btn-menu-the-end');
  const btnMenuHire = document.getElementById('btn-menu-hire');

  if (btnMenuEnterWorld) {
    btnMenuEnterWorld.addEventListener('click', () => {
      playXpChime();
      switchToView('profile');
      showToast('World Entered!', "Welcome to Yash Vishwakarma's Realm & Character Sheet", 'assets/icons/player-head.svg');
      
      // Spawn extra cherry blossom petals celebration
      for (let i = 0; i < 24; i++) {
        const p = new Petal();
        p.x = window.innerWidth / 3 + (Math.random() - 0.5) * 400;
        p.y = window.innerHeight / 2;
        p.speedY = -Math.random() * 5 - 2;
        p.speedX = (Math.random() - 0.5) * 8;
        petals.push(p);
      }
    });
  }

  if (btnMenuBuilds) {
    btnMenuBuilds.addEventListener('click', () => {
      playClickSound(1.0);
      openChestDialog();
    });
  }

  if (btnMenuTrades) {
    btnMenuTrades.addEventListener('click', () => {
      playClickSound(1.0);
      openTradeDialog();
    });
  }

  if (btnMenuContact) {
    btnMenuContact.addEventListener('click', () => {
      playClickSound(1.0);
      openBookDialog();
    });
  }

  if (btnMenuTheEnd) {
    btnMenuTheEnd.addEventListener('click', () => {
      playClickSound(1.2);
      openJourneyModal('certificates');
    });
  }

  if (btnMenuHire) {
    btnMenuHire.addEventListener('click', () => {
      openHireDialog();
    });
  }

  // Slot Actions (Full Video Game Navigation)
  function handleSlotAction(slotNum, el) {
    switch (slotNum) {
      case 1: // Grass Block (Overworld 3D View / Title Menu)
        closeAllGameDialogs();
        switchToView('gamemenu');
        showToast('Overworld View Active', '3D Cherry Grove avatar in focus! Drag to turn.', 'assets/icons/grass-block.svg');
        // Spawn burst of petals
        for (let i = 0; i < 20; i++) {
          const p = new Petal();
          p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 300;
          p.y = window.innerHeight - 120;
          p.speedY = -Math.random() * 4 - 2;
          p.speedX = (Math.random() - 0.5) * 6;
          petals.push(p);
        }
        break;

      case 2: // Player Head (Player Profile Sheet)
        closeAllGameDialogs();
        switchToView('profile');
        const card = document.getElementById('player-profile-card');
        if (card) {
          card.style.transform = 'scale(1.03) translateY(-4px)';
          setTimeout(() => {
            card.style.transform = 'scale(1) translateY(0)';
          }, 300);
        }
        showToast('Player Character Sheet', 'Yash Vishwakarma • Web & Python Builder', 'assets/icons/player-head.svg');
        break;

      case 3: // Enchanted Book (Enchantment Table)
        openEnchantDialog();
        showToast('Enchantment Table', 'Select and inspect coding masteries & powers!', 'assets/icons/enchanted-book.svg');
        break;

      case 4: // Chest (Ender Chest Project Storage)
        openChestDialog();
        showToast('Ender Chest Opened', '27-slot creation inventory & projects loaded.', 'assets/icons/chest.svg');
        break;

      case 5: // Clock (Chrono Compass & Time)
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        showToast('Chrono Compass', `World Time: ${timeString} | Dewas, MP Base`, 'assets/icons/clock.svg');
        if (btnTime) btnTime.click();
        break;

      case 6: // Nether Star (Advancements & Certificates)
        closeAllGameDialogs();
        openJourneyModal('certificates');
        playLevelUpSound();
        showToast('Advancement Made!', 'Official Certificates & Badges Unlocked!', 'assets/icons/nether-star.svg');
        break;

      case 7: // Emerald (Villager Trades - Buy Services with Emeralds!)
        openTradeDialog();
        showToast('Villager Trades Available', 'Buy Web, Python, WordPress & AI services with Emeralds!', 'assets/icons/emerald.svg');
        break;

      case 8: // Book & Quill (Send Message / Dispatch)
        openBookDialog();
        showToast('Book & Quill', 'Sign & send a direct quest requisition to Yash.', 'assets/icons/book-quill.svg');
        break;

      case 9: // Ender Pearl (Quantum Teleport / Resume)
        closeAllGameDialogs();
        openLightbox('assets/certificates/resume_yash_vishwakarma.jpg', 'Official Resume - Yash Vishwakarma');
        playPopSound(9);
        showToast('Quantum Ender Pearl', 'Teleported to Official Resume!', 'assets/icons/ender-pearl.svg');
        break;
    }
  }

  // =========================================================================
  // 4. TOAST NOTIFICATION SYSTEM ("Advancement Made!")
  // =========================================================================
  const toast = document.getElementById('advancement-toast');
  const toastSubtitle = document.getElementById('toast-subtitle');
  const toastTitle = document.getElementById('toast-title');
  const toastIcon = document.getElementById('toast-icon');
  let toastTimer = null;

  function hideToast() {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.classList.remove('show');
  }

  function showToast(subtitle, title, iconSrc) {
    if (!toast) return;
    clearTimeout(toastTimer);

    toastSubtitle.textContent = subtitle;
    toastTitle.textContent = title;
    if (iconSrc) toastIcon.src = iconSrc;

    toast.classList.remove('show');
    void toast.offsetWidth; // Trigger CSS reflow so animation re-triggers cleanly

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      hideToast();
    }, 2800);
  }

  if (toast) {
    toast.addEventListener('click', hideToast);
  }

  // =========================================================================
  // 5. JOURNEY DIALOG & MODAL CONTROLLER
  // =========================================================================
  const journeyDialog = document.getElementById('journey-dialog');
  const btnViewJourney = document.getElementById('btn-view-journey');
  const btnDialogClose = document.getElementById('btn-dialog-close');
  const btnDialogDone = document.getElementById('btn-dialog-done');
  const tabBtns = document.querySelectorAll('.dialog-tabs .tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  function openJourneyModal(defaultTab = 'quests') {
    if (!journeyDialog) return;
    initAudio();
    playChestSound();
    switchTab(defaultTab);
    journeyDialog.showModal();
  }

  function closeJourneyModal() {
    if (!journeyDialog) return;
    playClickSound(0.8);
    journeyDialog.close();
  }

  function switchTab(tabId) {
    tabBtns.forEach((b) => {
      if (b.dataset.tab === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    tabContents.forEach((c) => {
      if (c.id === `tab-${tabId}`) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  if (btnViewJourney) {
    btnViewJourney.addEventListener('click', () => {
      openJourneyModal('quests');
    });
  }

  if (btnDialogClose) {
    btnDialogClose.addEventListener('click', closeJourneyModal);
  }

  if (btnDialogDone) {
    btnDialogDone.addEventListener('click', closeJourneyModal);
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playClickSound(1.1);
      switchTab(btn.dataset.tab);
    });
  });

  // Close dialog on outside backdrop click
  if (journeyDialog) {
    journeyDialog.addEventListener('click', (e) => {
      const rect = journeyDialog.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) {
        closeJourneyModal();
      }
    });
  }

  // =========================================================================
  // 5B. MINECRAFT GAME SCREENS (Villager Trades, Enchantment, Chest, Book, Pause)
  // =========================================================================
  const villagerTradeDialog = document.getElementById('villager-trade-dialog');
  const enchantmentDialog = document.getElementById('enchantment-dialog');
  const chestDialog = document.getElementById('chest-dialog');
  const bookDialog = document.getElementById('book-dialog');
  const pauseMenuDialog = document.getElementById('pause-menu-dialog');
  const hireDialog = document.getElementById('hire-dialog');
  const emoteWheelDialog = document.getElementById('emote-wheel-dialog');

  function closeAllGameDialogs() {
    [journeyDialog, lightboxDialog, settingsDialog, villagerTradeDialog, enchantmentDialog, chestDialog, bookDialog, pauseMenuDialog, hireDialog, emoteWheelDialog].forEach((d) => {
      if (d && d.open) {
        d.close();
      }
    });
  }

  function openHireDialog() {
    initAudio();
    closeAllGameDialogs();
    playClickSound(1.2);
    if (hireDialog) {
      hireDialog.showModal();
      hireDialog.focus();
    }
  }

  function openTradeDialog() {
    initAudio();
    closeAllGameDialogs();
    if (villagerTradeDialog) {
      villagerTradeDialog.showModal();
      playVillagerHrrr();
    }
  }

  function openEnchantDialog() {
    initAudio();
    closeAllGameDialogs();
    if (enchantmentDialog) {
      enchantmentDialog.showModal();
      playEnchantSound();
    }
  }

  function openChestDialog() {
    initAudio();
    closeAllGameDialogs();
    if (chestDialog) {
      chestDialog.showModal();
      playChestSound();
    }
  }

  function openBookDialog() {
    initAudio();
    closeAllGameDialogs();
    if (bookDialog) {
      bookDialog.showModal();
      playPageFlipSound();
    }
  }

  function openPauseMenu() {
    initAudio();
    closeAllGameDialogs();
    if (pauseMenuDialog) {
      pauseMenuDialog.showModal();
      playClickSound(1.0);
    }
  }

  // Generic backdrop click handler for native dialogs
  function setupBackdropClose(dialogEl, onClose) {
    if (!dialogEl) return;
    dialogEl.addEventListener('click', (e) => {
      const rect = dialogEl.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) {
        dialogEl.close();
        if (onClose) onClose();
      }
    });
  }

  // --- DIRECT EMAIL DISPATCHER VIA FORMSUBMIT AJAX & GMAIL WEB FALLBACK ---
  const YASH_EMAIL = 'yashvishwakarma968@gmail.com';

  async function dispatchDirectEmail(payload, subject, plainBody) {
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${YASH_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...payload,
          _subject: subject || 'New Quest Requisition - Minecraft Portfolio',
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await res.json().catch(() => ({ success: 'true' }));
      const isActivationNeeded = data.message && typeof data.message === 'string' && data.message.toLowerCase().includes('activation');
      const isSuccess = data.success === 'true' || data.success === true || (res.ok && !isActivationNeeded);

      return {
        success: isSuccess,
        needsActivation: isActivationNeeded,
        message: data.message || 'Delivered',
        subject: subject,
        body: plainBody
      };
    } catch (err) {
      console.warn('FormSubmit network error, fallback available:', err);
      return {
        success: false,
        needsActivation: false,
        error: err,
        subject: subject,
        body: plainBody
      };
    }
  }

  // --- 1. VILLAGER TRADE SYSTEM ---
  let playerEmeralds = 64;
  let currentSelectedTrade = {
    id: 'webapp',
    cost: 16,
    name: 'Custom Web Application',
    desc: 'Complete custom responsive frontend website with HTML5, modern CSS3, animations, and dynamic JavaScript.',
    rarity: 'RARE REQUISITION'
  };

  const emeraldCountEl = document.getElementById('player-emerald-count');
  const btnMineEmerald = document.getElementById('btn-mine-emerald');
  const tradeCostBadge = document.getElementById('trade-cost-badge');
  const btnTradeCostLabel = document.getElementById('btn-trade-cost-label');
  const tradeServiceTitle = document.getElementById('trade-service-title');
  const tradeServiceDesc = document.getElementById('trade-service-desc');
  const tradeServiceRarity = document.getElementById('trade-service-rarity');
  const btnExecuteTrade = document.getElementById('btn-execute-trade');
  const tradeOfferItems = document.querySelectorAll('.trade-offer-item');
  const btnTradeClose = document.getElementById('btn-trade-close');

  function updateEmeraldDisplay() {
    if (emeraldCountEl) emeraldCountEl.textContent = playerEmeralds;
    if (btnTradeCostLabel) btnTradeCostLabel.textContent = currentSelectedTrade.cost;
    if (tradeCostBadge) tradeCostBadge.textContent = currentSelectedTrade.cost;
  }

  tradeOfferItems.forEach((item) => {
    item.addEventListener('click', () => {
      tradeOfferItems.forEach((it) => it.classList.remove('active'));
      item.classList.add('active');

      const costNum = parseInt(item.dataset.cost, 10);
      currentSelectedTrade = {
        id: item.dataset.tradeId,
        cost: costNum,
        name: item.dataset.name,
        desc: item.dataset.desc,
        rarity: costNum >= 24 ? 'EPIC REQUISITION' : (costNum >= 12 ? 'RARE REQUISITION' : 'COMMON REQUISITION')
      };

      if (tradeServiceTitle) tradeServiceTitle.textContent = currentSelectedTrade.name;
      if (tradeServiceDesc) tradeServiceDesc.textContent = currentSelectedTrade.desc;
      if (tradeServiceRarity) tradeServiceRarity.textContent = currentSelectedTrade.rarity;
      updateEmeraldDisplay();
      playVillagerHrrr();
    });
  });

  if (btnMineEmerald) {
    btnMineEmerald.addEventListener('click', (e) => {
      e.stopPropagation();
      playerEmeralds += 5;
      updateEmeraldDisplay();
      playEmeraldClinkSound();
      showToast('+5 Emeralds Mined! ⛏️', `Emerald Pouch: ${playerEmeralds} Emeralds`, 'assets/icons/emerald.svg');
    });
  }

  if (btnExecuteTrade) {
    btnExecuteTrade.addEventListener('click', () => {
      initAudio();
      if (playerEmeralds < currentSelectedTrade.cost) {
        playDamageSound();
        showToast('Not Enough Emeralds!', `Needs ${currentSelectedTrade.cost} Emeralds. Click +5 ⛏️ to mine more!`, 'assets/icons/emerald.svg');
        return;
      }

      playerEmeralds -= currentSelectedTrade.cost;
      updateEmeraldDisplay();
      playVillagerTradeYes();

      // Grant XP for trading
      currentXpPercent += 20;
      if (currentXpPercent >= 100) {
        currentXpPercent = 15;
        currentLevel += 1;
        if (levelDisplay) levelDisplay.textContent = currentLevel;
        playLevelUpSound();
      }
      if (xpProgress) xpProgress.style.width = `${currentXpPercent}%`;

      showToast('Trade Completed! 💚', `You commissioned: ${currentSelectedTrade.name}!`, 'assets/icons/emerald.svg');

      // Dispatch Requisition / Hiring Mail to yashvishwakarma968@gmail.com
      const subject = `[Hire Quest Commission] ${currentSelectedTrade.name} - Yash Vishwakarma`;
      const body =
        `Greetings Yash,\n\nI want to hire you for the following project from your Minecraft Portfolio:\n\nService: ${currentSelectedTrade.name}\nScope: ${currentSelectedTrade.desc}\nInvestment: ${currentSelectedTrade.cost} Emeralds\n\nClient Status: Ready to collaborate on timeline and start date!\n\nBest regards.`;

      dispatchDirectEmail({
        commission_service: currentSelectedTrade.name,
        scope_details: currentSelectedTrade.desc,
        investment_emeralds: currentSelectedTrade.cost,
        source: 'Villager Trading Post Requisition'
      }, subject, body);
    });
  }

  if (btnTradeClose) {
    btnTradeClose.addEventListener('click', () => {
      playClickSound(0.8);
      villagerTradeDialog.close();
    });
  }
  setupBackdropClose(villagerTradeDialog, () => playClickSound(0.8));

  // --- 2. ENCHANTMENT TABLE SYSTEM ---
  const enchantTierRows = document.querySelectorAll('.enchant-tier-row');
  const enchCardTitle = document.getElementById('ench-card-title');
  const enchCardDesc = document.getElementById('ench-card-desc');
  const btnEnchantClose = document.getElementById('btn-enchant-close');
  const enchantPlayerXp = document.getElementById('enchant-player-xp');

  enchantTierRows.forEach((row) => {
    row.addEventListener('click', () => {
      enchantTierRows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');

      const skill = row.dataset.skill || 'Coding Mastery';
      const lore = row.dataset.lore || '';

      if (enchCardTitle) enchCardTitle.textContent = skill;
      if (enchCardDesc) enchCardDesc.textContent = lore;
      if (enchantPlayerXp) enchantPlayerXp.textContent = currentLevel;

      playEnchantSound();
      showToast('Power Enchanted! ✨', skill, 'assets/icons/enchanted-book.svg');
    });
  });

  if (btnEnchantClose) {
    btnEnchantClose.addEventListener('click', () => {
      playClickSound(0.8);
      enchantmentDialog.close();
    });
  }
  setupBackdropClose(enchantmentDialog, () => playClickSound(0.8));

  // --- 3. ENDER CHEST PROJECT INVENTORY ---
  const chestSlots = document.querySelectorAll('.chest-slot.filled');
  const drawerItemTitle = document.getElementById('drawer-item-title');
  const drawerItemBadge = document.getElementById('drawer-item-badge');
  const drawerItemDesc = document.getElementById('drawer-item-desc');
  const drawerTechTag = document.getElementById('drawer-tech-tag');
  const btnChestAction = document.getElementById('btn-chest-action');
  const btnChestClose = document.getElementById('btn-chest-close');
  let currentChestLink = 'https://yashdeveloper9.github.io/portfolio/';

  chestSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      chestSlots.forEach((s) => s.classList.remove('active'));
      slot.classList.add('active');

      const name = slot.dataset.name || 'Artifact';
      const rarity = (slot.dataset.rarity || 'common').toUpperCase();
      const tech = slot.dataset.tech || '';
      const desc = slot.dataset.desc || '';
      currentChestLink = slot.dataset.link || '#';

      if (drawerItemTitle) drawerItemTitle.textContent = name;
      if (drawerItemBadge) drawerItemBadge.textContent = `${rarity} ARTIFACT`;
      if (drawerItemDesc) drawerItemDesc.textContent = desc;
      if (drawerTechTag) drawerTechTag.textContent = `Tech: ${tech}`;

      playChestSound();
    });
  });

  if (btnChestAction) {
    btnChestAction.addEventListener('click', () => {
      if (currentChestLink.includes('.jpg') || currentChestLink.includes('.png')) {
        openLightbox(currentChestLink, drawerItemTitle ? drawerItemTitle.textContent : 'Artifact');
      } else if (currentChestLink !== '#') {
        window.open(currentChestLink, '_blank');
      } else {
        showToast('Artifact Inspected', drawerItemTitle ? drawerItemTitle.textContent : 'Chest Item', 'assets/icons/chest.svg');
      }
    });
  }

  if (btnChestClose) {
    btnChestClose.addEventListener('click', () => {
      playClickSound(0.8);
      chestDialog.close();
    });
  }
  setupBackdropClose(chestDialog, () => playClickSound(0.8));

  // --- 4. BOOK & QUILL CONTACT PARCHMENT ---
  const btnBookClose = document.getElementById('btn-book-close');
  const btnBookSign = document.getElementById('btn-book-sign');
  const btnBookReset = document.getElementById('btn-book-reset');
  const bookSenderName = document.getElementById('book-sender-name');
  const bookSenderEmail = document.getElementById('book-sender-email');
  const bookServiceType = document.getElementById('book-service-type');
  const bookMessage = document.getElementById('book-message');

  if (btnBookClose) {
    btnBookClose.addEventListener('click', () => {
      playPageFlipSound();
      bookDialog.close();
    });
  }
  setupBackdropClose(bookDialog, () => playPageFlipSound());

  if (btnBookReset) {
    btnBookReset.addEventListener('click', () => {
      if (bookSenderName) bookSenderName.value = '';
      if (bookSenderEmail) bookSenderEmail.value = '';
      if (bookMessage) bookMessage.value = '';
      playPageFlipSound();
    });
  }

  if (btnBookSign) {
    btnBookSign.addEventListener('click', async () => {
      const name = bookSenderName ? bookSenderName.value.trim() : '';
      const email = bookSenderEmail ? bookSenderEmail.value.trim() : '';
      const type = bookServiceType ? bookServiceType.value : 'Inquiry';
      const msg = bookMessage ? bookMessage.value.trim() : '';

      if (!name || !email) {
        playDamageSound();
        showToast('Sign Required', 'Please enter your Name and Contact details on Page 1!', 'assets/icons/book-quill.svg');
        if (bookSenderName) bookSenderName.focus();
        return;
      }

      btnBookSign.disabled = true;
      const btnInner = btnBookSign.querySelector('.mc-btn-inner');
      if (btnInner) btnInner.textContent = '⏳ Sending to Gmail...';

      const subject = `[Hire / Quest Dispatch: ${type}] from ${name}`;
      const plainBody =
        `Dear Yash,\n\n` +
        `Sender Name: ${name}\n` +
        `Contact Details: ${email}\n` +
        `Requisition Type: ${type}\n\n` +
        `Project Brief & Requirements:\n${msg || 'I am interested in hiring you for a web development / Python automation project.'}\n\n` +
        `-- Dispatched via Minecraft Portfolio Book & Quill to ${YASH_EMAIL}`;

      const result = await dispatchDirectEmail({
        sender_name: name,
        sender_contact: email,
        requisition_type: type,
        message: msg || 'No additional message provided.'
      }, subject, plainBody);

      playLevelUpSound();
      if (result.success) {
        if (btnInner) btnInner.textContent = '✅ Sent to Yash!';
        showToast('Dispatch Delivered! 📜', `Sent straight to ${YASH_EMAIL}!`, 'assets/icons/book-quill.svg');
      } else if (result.needsActivation) {
        if (btnInner) btnInner.textContent = '📧 Check Gmail';
        showToast('Check Gmail to Activate 📧', 'Click "Activate Form" in your email to enable automatic forwarding.', 'assets/icons/book-quill.svg');
      } else {
        if (btnInner) btnInner.textContent = '🚀 Opening Gmail...';
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${YASH_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
        const win = window.open(gmailWebUrl, '_blank');
        if (!win) {
          window.location.href = `mailto:${YASH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
        }
      }

      setTimeout(() => {
        btnBookSign.disabled = false;
        if (btnInner) btnInner.textContent = '🖋️ Sign & Send';
        if (result.success) {
          bookDialog.close();
        }
      }, 2500);
    });
  }

  // --- 4b. HIRE FOR THE QUEST CONTRACT SYSTEM ---
  const btnHireClose = document.getElementById('btn-hire-close');
  const btnCancelHire = document.getElementById('btn-cancel-hire');
  const btnSubmitHire = document.getElementById('btn-submit-hire');
  const hireRoleTags = document.querySelectorAll('#hire-role-tags .hire-tag');
  const hireSalaryTags = document.querySelectorAll('#hire-salary-tags .hire-tag');
  const hireRoleInput = document.getElementById('hire-role');
  const hireSalaryInput = document.getElementById('hire-salary');

  function closeHireDialog() {
    if (hireDialog && hireDialog.open) {
      playClickSound(0.8);
      hireDialog.close();
    }
  }

  if (btnHireClose) btnHireClose.addEventListener('click', closeHireDialog);
  if (btnCancelHire) btnCancelHire.addEventListener('click', closeHireDialog);
  setupBackdropClose(hireDialog, () => playClickSound(0.8));

  // Quick tag chips for Role
  hireRoleTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      playClickSound(1.1);
      const val = tag.getAttribute('data-val');
      if (hireRoleInput) {
        hireRoleInput.value = val;
        hireRoleInput.focus();
      }
    });
  });

  // Quick tag chips for Salary / Budget
  hireSalaryTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      playClickSound(1.1);
      const val = tag.getAttribute('data-val');
      if (hireSalaryInput) {
        hireSalaryInput.value = val;
        hireSalaryInput.focus();
      }
    });
  });

  const hireStatusFeedback = document.getElementById('hire-status-feedback');

  if (btnSubmitHire) {
    btnSubmitHire.addEventListener('click', async () => {
      const nameInput = document.getElementById('hire-name');
      const contactInput = document.getElementById('hire-contact');
      const roleInput = document.getElementById('hire-role');
      const salaryInput = document.getElementById('hire-salary');
      const msgInput = document.getElementById('hire-message');

      const name = nameInput?.value.trim();
      const contact = contactInput?.value.trim();
      const role = roleInput?.value.trim();
      const salary = salaryInput?.value.trim();
      const msg = msgInput?.value.trim();

      if (!name || !contact || !role || !salary) {
        playDamageSound();
        showToast('Missing Details', 'Please enter Name, Contact, Role, and Salary!', 'assets/icons/heart-empty.svg');
        return;
      }

      btnSubmitHire.disabled = true;
      const btnInner = btnSubmitHire.querySelector('.mc-btn-inner');
      if (btnInner) btnInner.textContent = '⏳ DISPATCHING TO GMAIL...';
      if (hireStatusFeedback) {
        hireStatusFeedback.style.display = 'block';
        hireStatusFeedback.innerHTML = `⏳ Transmitting quest contract directly to <strong>${YASH_EMAIL}</strong>...`;
      }

      const subject = `⚔️ [QUEST HIRE OFFER: ${role}] from ${name} (Budget: ${salary})`;
      const plainBody = 
        `=========================================\n` +
        `⚔️ QUEST HIRE OFFER FOR YASH VISHWAKARMA\n` +
        `=========================================\n\n` +
        `👤 Recruiter / Company Name: ${name}\n` +
        `📞 Contact Number / Email: ${contact}\n` +
        `💼 Role of Job / Position: ${role}\n` +
        `💰 Offered Salary / Budget: ${salary}\n\n` +
        `📝 Job Description / Requirements:\n${msg || 'We want to hire you for an upcoming role/project. Please reply with your availability.'}\n\n` +
        `-----------------------------------------\n` +
        `📍 Dispatched via Minecraft Portfolio Quest Contract\n` +
        `Direct Inbox: ${YASH_EMAIL}`;

      const payload = {
        recruiter_name: name,
        contact_number_or_email: contact,
        role_of_job: role,
        offered_salary_budget: salary,
        message_requirements: msg || 'No additional message provided.'
      };

      const result = await dispatchDirectEmail(payload, subject, plainBody);

      if (result.success) {
        playLevelUpSound();
        playXpChime();
        for (let i = 0; i < 32; i++) {
          const p = new Petal();
          p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 400;
          p.y = window.innerHeight / 2;
          p.speedY = -Math.random() * 5 - 2;
          p.speedX = (Math.random() - 0.5) * 8;
          petals.push(p);
        }
        if (btnInner) btnInner.textContent = '✅ DELIVERED TO YASH GMAIL!';
        if (hireStatusFeedback) {
          hireStatusFeedback.innerHTML = `✅ <strong>Offer Delivered!</strong> Quest contract successfully dispatched to <strong>${YASH_EMAIL}</strong>.`;
        }
        showToast('Offer Delivered! ⚔️', `Directly sent to ${YASH_EMAIL}!`, 'assets/icons/emerald.svg');

        setTimeout(() => {
          closeHireDialog();
          btnSubmitHire.disabled = false;
          if (btnInner) btnInner.textContent = '⚔️ SIGN & SEND HIRE OFFER';
          if (hireStatusFeedback) hireStatusFeedback.style.display = 'none';
          if (nameInput) nameInput.value = '';
          if (contactInput) contactInput.value = '';
          if (roleInput) roleInput.value = '';
          if (salaryInput) salaryInput.value = '';
          if (msgInput) msgInput.value = '';
        }, 3000);
      } else if (result.needsActivation) {
        playLevelUpSound();
        if (btnInner) btnInner.textContent = '📧 ACTIVATION SENT TO GMAIL';
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${YASH_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
        if (hireStatusFeedback) {
          hireStatusFeedback.innerHTML = 
            `📧 <strong>Activation Email Sent:</strong> FormSubmit sent an activation link to <strong>${YASH_EMAIL}</strong>.<br>` +
            `Please check your Gmail inbox (or Spam / Updates) and click <em>"Activate Form"</em> once.<br><br>` +
            `<a href="${gmailWebUrl}" target="_blank" rel="noopener">⚡ Click Here to Also Open Pre-filled in Gmail Web</a>`;
        }
        showToast('Check Gmail! 📧', 'Click "Activate Form" in your email to enable automatic forwarding.', 'assets/icons/book-quill.svg');
        btnSubmitHire.disabled = false;
      } else {
        if (btnInner) btnInner.textContent = '🚀 OPENING GMAIL...';
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${YASH_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
        const mailtoUrl = `mailto:${YASH_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainBody)}`;
        if (hireStatusFeedback) {
          hireStatusFeedback.innerHTML = `⚡ Opening direct email client to send to <strong>${YASH_EMAIL}</strong>...`;
        }
        const win = window.open(gmailWebUrl, '_blank');
        if (!win) {
          window.location.href = mailtoUrl;
        }
        setTimeout(() => {
          btnSubmitHire.disabled = false;
          if (btnInner) btnInner.textContent = '⚔️ SIGN & SEND HIRE OFFER';
          closeHireDialog();
        }, 2500);
      }
    });
  }

  const btnProfileHire = document.getElementById('btn-profile-hire');
  if (btnProfileHire) {
    btnProfileHire.addEventListener('click', openHireDialog);
  }

  const btnMobileHire = document.getElementById('btn-mobile-hire');
  if (btnMobileHire) {
    btnMobileHire.addEventListener('click', openHireDialog);
  }

  const btnTradeOpenHire = document.getElementById('btn-trade-open-hire');
  if (btnTradeOpenHire) {
    btnTradeOpenHire.addEventListener('click', () => {
      if (currentSelectedTrade && hireRoleInput) {
        hireRoleInput.value = currentSelectedTrade.name;
      }
      openHireDialog();
    });
  }

  const btnPauseHire = document.getElementById('btn-pause-hire');
  if (btnPauseHire) {
    btnPauseHire.addEventListener('click', openHireDialog);
  }

  // --- 5. MINECRAFT PAUSE MENU ---
  const btnPauseResume = document.getElementById('btn-pause-resume');
  const btnPauseTrades = document.getElementById('btn-pause-trades');
  const btnPauseEnchant = document.getElementById('btn-pause-enchant');
  const btnPauseChest = document.getElementById('btn-pause-chest');
  const btnPauseAdvancements = document.getElementById('btn-pause-advancements');
  const btnPauseContact = document.getElementById('btn-pause-contact');
  const btnPauseOptions = document.getElementById('btn-pause-options');
  const btnHeaderTrades = document.getElementById('btn-trades');
  const btnHeaderPause = document.getElementById('btn-pause-menu');

  if (btnPauseResume) {
    btnPauseResume.addEventListener('click', () => {
      playClickSound(1.0);
      pauseMenuDialog.close();
    });
  }
  if (btnPauseTrades) {
    btnPauseTrades.addEventListener('click', openTradeDialog);
  }
  if (btnPauseEnchant) {
    btnPauseEnchant.addEventListener('click', openEnchantDialog);
  }
  if (btnPauseChest) {
    btnPauseChest.addEventListener('click', openChestDialog);
  }
  if (btnPauseAdvancements) {
    btnPauseAdvancements.addEventListener('click', () => {
      closeAllGameDialogs();
      openJourneyModal('certificates');
    });
  }
  if (btnPauseContact) {
    btnPauseContact.addEventListener('click', openBookDialog);
  }
  if (btnPauseOptions) {
    btnPauseOptions.addEventListener('click', () => {
      closeAllGameDialogs();
      if (settingsDialog) settingsDialog.showModal();
    });
  }

  if (btnHeaderTrades) {
    btnHeaderTrades.addEventListener('click', openTradeDialog);
  }
  if (btnHeaderPause) {
    btnHeaderPause.addEventListener('click', openPauseMenu);
  }
  setupBackdropClose(pauseMenuDialog, () => playClickSound(0.8));

  // --- 5C. MINECRAFT EMOTE RADIAL WHEEL SYSTEM ---
  const btnOpenEmotes = document.getElementById('btn-open-emotes');
  const btnCloseWheel = document.getElementById('btn-close-wheel');
  const hubEmoteTitle = document.getElementById('hub-emote-title');
  const emoteSliceBtns = document.querySelectorAll('.emote-slice-btn');
  const emoteWheelWedges = document.querySelectorAll('.wheel-wedge');

  const emoteDisplayNames = {
    point: 'Adventure Point',
    cheer: 'Victory Cheer',
    disco: 'Disco Groove',
    bow: "Hero's Bow",
    clap: 'Applause',
    flip: '360° Backflip',
    wave: 'Friendly Wave',
    tornado: 'Tornado Spin'
  };

  function highlightEmote(emoteKey) {
    if (hubEmoteTitle && emoteKey && emoteDisplayNames[emoteKey]) {
      hubEmoteTitle.textContent = emoteDisplayNames[emoteKey];
    }
    emoteSliceBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.emote === emoteKey);
    });
    emoteWheelWedges.forEach((wedge) => {
      wedge.classList.toggle('active', wedge.dataset.emote === emoteKey);
    });
  }

  function unhighlightEmote() {
    if (hubEmoteTitle) hubEmoteTitle.textContent = 'SELECT EMOTE';
    emoteSliceBtns.forEach((btn) => btn.classList.remove('active'));
    emoteWheelWedges.forEach((wedge) => wedge.classList.remove('active'));
  }

  function openEmoteWheel() {
    initAudio();
    closeAllGameDialogs();
    if (emoteWheelDialog) {
      unhighlightEmote();
      emoteWheelDialog.showModal();
      playPopSound(5);
    }
  }

  function closeEmoteWheel() {
    if (emoteWheelDialog && emoteWheelDialog.open) {
      playClickSound(0.8);
      emoteWheelDialog.close();
    }
  }

  if (btnOpenEmotes) {
    btnOpenEmotes.addEventListener('click', (e) => {
      e.stopPropagation();
      openEmoteWheel();
    });
  }

  if (btnCloseWheel) {
    btnCloseWheel.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEmoteWheel();
    });
  }

  setupBackdropClose(emoteWheelDialog, () => playClickSound(0.8));

  // Connect slice buttons
  emoteSliceBtns.forEach((btn) => {
    const emoteKey = btn.dataset.emote;
    btn.addEventListener('mouseenter', () => highlightEmote(emoteKey));
    btn.addEventListener('mouseleave', unhighlightEmote);
    btn.addEventListener('focus', () => highlightEmote(emoteKey));
    btn.addEventListener('blur', unhighlightEmote);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEmoteWheel();
      triggerEmote(emoteKey);
    });
  });

  // Connect SVG wedges
  emoteWheelWedges.forEach((wedge) => {
    const emoteKey = wedge.dataset.emote;
    wedge.addEventListener('mouseenter', () => highlightEmote(emoteKey));
    wedge.addEventListener('mouseleave', unhighlightEmote);
    wedge.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEmoteWheel();
      triggerEmote(emoteKey);
    });
  });

  function spawnParticleBurst(count = 24) {
    if (typeof Petal === 'undefined' || !petals) return;
    for (let i = 0; i < count; i++) {
      const p = new Petal();
      p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 280;
      p.y = window.innerHeight * 0.45 + (Math.random() - 0.5) * 180;
      p.speedY = -Math.random() * 5 - 1.5;
      p.speedX = (Math.random() - 0.5) * 7;
      petals.push(p);
    }
  }

  function triggerEmote(emoteKey) {
    initAudio();
    let duration = 2200;

    switch (emoteKey) {
      case 'flip':
        duration = 1800;
        playJumpSound();
        showToast('360° Backflip 🤸', 'Yash executes an acrobatic Minecraft flip!', 'assets/icons/player-head.svg');
        spawnParticleBurst(25);
        break;

      case 'wave':
        duration = 2200;
        playXpChime();
        showToast('Friendly Wave 👋', 'Yash waves enthusiastically to you!', 'assets/icons/player-head.svg');
        break;

      case 'cheer':
        duration = 2400;
        playLevelUpSound();
        showToast('Victory Cheer 🎉', 'Quest celebration! Advancement achieved!', 'assets/icons/nether-star.svg');
        spawnParticleBurst(30);
        break;

      case 'disco':
        duration = 2500;
        playDiscoBeat();
        showToast('Disco Groove 🕺', 'Minecraft retro rhythm dance activated!', 'assets/icons/player-head.svg');
        break;

      case 'bow':
        duration = 2200;
        playClickSound(1.2);
        showToast("Hero's Bow 🙇", 'A respectful bow for the brave traveler.', 'assets/icons/player-head.svg');
        break;

      case 'point':
        duration = 2000;
        playClickSound(1.4);
        showToast('Adventure Point 👉', 'Onward! Great quests and code await ahead.', 'assets/icons/compass.svg');
        break;

      case 'tornado':
        duration = 2000;
        playSwordSweepSound();
        showToast('Tornado Spin 🌪️', 'Cyclone whirlwind spin unleashed!', 'assets/icons/diamond-sword.svg');
        spawnParticleBurst(25);
        break;

      case 'clap':
        duration = 2200;
        playClapSound();
        showToast('Applause 👏', 'Bravo! A round of applause for your visit!', 'assets/icons/player-head.svg');
        break;

      default:
        duration = 2000;
        showToast('Minecraft Emote 🎭', 'Emote performed!', 'assets/icons/player-head.svg');
        break;
    }

    activeEmote = {
      key: emoteKey,
      timer: 0.001,
      duration: duration
    };
  }
  window.triggerEmote = triggerEmote;
  window.triggerEmoteTest = triggerEmote;

  // =========================================================================
  // 6. VITALS & XP BAR INTERACTION
  // =========================================================================
  const hearts = document.querySelectorAll('.mc-heart');
  let currentHp = 20;

  hearts.forEach((heart, idx) => {
    heart.addEventListener('click', () => {
      playDamageSound();
      heart.classList.add('damaged');
      setTimeout(() => heart.classList.remove('damaged'), 400);

      // Toggle heart between full and empty
      const img = heart.querySelector('img');
      if (img.src.includes('heart.svg')) {
        img.src = 'assets/icons/heart-empty.svg';
        showToast('Damage Taken', 'Ouch! Quick, eat some bread!', 'assets/icons/heart-empty.svg');
      } else {
        img.src = 'assets/icons/heart.svg';
        playXpChime();
      }
    });
  });

  // Level 38 badge click
  const levelBadge = document.getElementById('xp-level-badge');
  const levelDisplay = document.getElementById('level-display');
  const xpProgress = document.getElementById('xp-progress');
  let currentLevel = 38;
  let currentXpPercent = 78;

  if (levelBadge) {
    levelBadge.addEventListener('click', () => {
      playXpChime();
      currentXpPercent += 15;
      if (currentXpPercent >= 100) {
        currentXpPercent = 12;
        currentLevel += 1;
        levelDisplay.textContent = currentLevel;
        playLevelUpSound();
        showToast('Level Up!', `You are now Level ${currentLevel}!`, 'assets/icons/nether-star.svg');
      }
      xpProgress.style.width = `${currentXpPercent}%`;
    });
  }

  // =========================================================================
  // 7. HEADER UTILITIES (Sound, Day/Night, Settings)
  // =========================================================================
  const btnSound = document.getElementById('btn-sound');
  const soundIcon = document.getElementById('sound-icon');
  const btnTime = document.getElementById('btn-time');
  const timeIcon = document.getElementById('time-icon');
  const dayCounter = document.getElementById('day-counter');
  let isNight = false;

  if (btnSound) {
    btnSound.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      soundIcon.textContent = sfxEnabled ? '🔊' : '🔇';
      btnSound.querySelector('.btn-text').textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
      if (sfxEnabled) playClickSound(1.2);
    });
  }

  if (btnTime) {
    btnTime.addEventListener('click', () => {
      isNight = !isNight;
      document.body.classList.toggle('theme-night', isNight);
      timeIcon.textContent = isNight ? '☀️' : '🌙';
      btnTime.querySelector('.btn-text').textContent = isNight ? 'DAY' : 'NIGHT';
      dayCounter.textContent = isNight ? 'NIGHT: 8' : 'DAY: 8';
      playClickSound(1.0);
      showToast(
        isNight ? 'Nightfall' : 'Sunrise',
        isNight ? 'Monsters spawn in darkness... Stay illuminated!' : 'A pleasant morning in the Cherry Grove.',
        'assets/icons/clock.svg'
      );
    });
  }

  // Settings Dialog
  const settingsDialog = document.getElementById('settings-dialog');
  const btnSettings = document.getElementById('btn-settings');
  const btnSettingsClose = document.getElementById('btn-settings-close');
  const btnSettingsSave = document.getElementById('btn-settings-save');
  const sliderParticles = document.getElementById('slider-particles');
  const particlesVal = document.getElementById('particles-val');
  const toggleCrt = document.getElementById('toggle-crt');
  const toggleSfx = document.getElementById('toggle-sfx');

  if (btnSettings) {
    btnSettings.addEventListener('click', () => {
      initAudio();
      playClickSound(1.0);
      settingsDialog.showModal();
    });
  }

  if (btnSettingsClose) {
    btnSettingsClose.addEventListener('click', () => {
      playClickSound(0.8);
      settingsDialog.close();
    });
  }

  if (btnSettingsSave) {
    btnSettingsSave.addEventListener('click', () => {
      playClickSound(1.1);
      settingsDialog.close();
    });
  }

  if (sliderParticles && particlesVal) {
    sliderParticles.addEventListener('input', (e) => {
      petalCount = parseInt(e.target.value, 10);
      particlesVal.textContent = `${petalCount} petals`;
      initPetals();
    });
  }

  if (toggleCrt) {
    toggleCrt.addEventListener('change', (e) => {
      document.body.classList.toggle('no-crt', !e.target.checked);
    });
  }

  if (toggleSfx) {
    toggleSfx.addEventListener('change', (e) => {
      sfxEnabled = e.target.checked;
      soundIcon.textContent = sfxEnabled ? '🔊' : '🔇';
      btnSound.querySelector('.btn-text').textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    });
  }

  // =========================================================================
  // =========================================================================
  // 8. CHARACTER ZONE INTERACTION (Click opens Minecraft Emote Wheel)
  // =========================================================================
  const characterZone = document.getElementById('character-zone');
  if (characterZone) {
    characterZone.addEventListener('click', (e) => {
      // If clicking inside control bar or buttons, don't interfere
      if (e.target.closest('.model-control-bar') || e.target.closest('button')) return;
      openEmoteWheel();
    });
  }

  // Courier Pigeon / Contact button
  const btnOpenContact = document.getElementById('btn-open-contact');
  if (btnOpenContact) {
    btnOpenContact.addEventListener('click', () => {
      const email = 'yashvishwakarma968@gmail.com';
      window.location.href = `mailto:${email}?subject=Hiring%20/%20Project%20Inquiry%20for%20Yash%20Vishwakarma`;
      showToast('Signal Dispatched', 'Opening mail client to hire Yash Vishwakarma...', 'assets/icons/book-quill.svg');
    });
  }

  // =========================================================================
  // 9. THREE.JS 3D PLAYER MODEL ENGINE (WebGL + GLTFLoader + OrbitControls)
  // =========================================================================
  let threeScene, threeCamera, threeRenderer;
  let modelMeshGroup = null;
  let modelPivot = null;
  let activeEmote = null;
  const characterNodes = {
    root: null,
    torso: null,
    chest: null,
    head: null,
    upperArmL: null,
    forearmL: null,
    leftArm: null,
    upperArmR: null,
    forearmR: null,
    rightArm: null,
    upperLegL: null,
    lowerLegL: null,
    leftLeg: null,
    upperLegR: null,
    lowerLegR: null,
    rightLeg: null
  };
  let fitCameraToModel = () => {};
  let currentModelMaterial = 'colored'; // Default to the colorful PBR model!
  let is3DModeActive = true;
  const originalMeshMaterials = new Map();

  // Gamer Theme Loading Screen System
  const gamerLoadingScreen = document.getElementById('gamer-loading-screen');
  const gamerProgressBar = document.getElementById('gamer-progress-bar');
  const gamerProgressStatus = document.getElementById('gamer-progress-status');
  const gamerProgressPercent = document.getElementById('gamer-progress-percent');
  let currentLoadPercent = 12;

  function updateGamerProgress(percent, statusText) {
    currentLoadPercent = Math.max(currentLoadPercent, Math.min(100, Math.round(percent)));
    if (gamerProgressBar) gamerProgressBar.style.width = `${currentLoadPercent}%`;
    if (gamerProgressPercent) gamerProgressPercent.textContent = `${currentLoadPercent}%`;
    if (gamerProgressStatus && statusText) gamerProgressStatus.textContent = statusText;
  }

  function finishGamerLoading() {
    updateGamerProgress(100, 'CHERRY GROVE REALM READY!');
    setTimeout(() => {
      if (gamerLoadingScreen && !gamerLoadingScreen.classList.contains('hidden')) {
        gamerLoadingScreen.classList.add('hidden');
        setTimeout(() => {
          gamerLoadingScreen.style.display = 'none';
        }, 550);
        playLevelUpSound();
        showToast('Survival Guide V1.0.0', 'Welcome Yash! 3D Articulated Avatar & Emotes Ready.', 'assets/icons/player-head.svg');
      }
    }, 300);
  }

  // Safety timer to guarantee dismiss
  setTimeout(finishGamerLoading, 6500);

  // Pointer & Cursor Movement State (Strictly Left & Right, Zero Zoom)
  let isDragging = false;
  let lastPointerX = 0;
  let currentVelocityY = 0;
  let dragRotation = 0;
  let targetCursorAngle = 0;
  let autoSpinEnabled = false;
  const autoSpinSpeed = 0.007;
  let optimalCamDist = 3.0;

  const threeCanvas = document.getElementById('three-canvas');
  const modelLoading = document.getElementById('model-loading');
  const btnToggle3D = document.getElementById('btn-toggle-3d');
  const btnMatColored = document.getElementById('btn-mat-colored');
  const btnMatTitanium = document.getElementById('btn-mat-titanium');
  const btnMatCyan = document.getElementById('btn-mat-cyan');
  const btnMatGold = document.getElementById('btn-mat-gold');
  const btnToggleRotate = document.getElementById('btn-toggle-rotate');
  const btnResetCam = document.getElementById('btn-reset-cam');

  // Alternative materials palette (Distinct, vibrant Minecraft styles)
  const materials = {
    titanium: new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.32,
      metalness: 0.82,
      side: THREE.DoubleSide
    }),
    cyan: new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      roughness: 0.18,
      metalness: 0.68,
      emissive: 0x006688,
      emissiveIntensity: 0.45,
      side: THREE.DoubleSide
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xffbb00,
      roughness: 0.22,
      metalness: 0.88,
      emissive: 0x774400,
      emissiveIntensity: 0.38,
      side: THREE.DoubleSide
    })
  };

  // =========================================================================
  // AUTHENTIC MINECRAFT BEDROCK PLAYER MODEL & EMOTE ENGINE
  // =========================================================================
  function buildMinecraftPlayer() {
    if (typeof THREE === 'undefined') return null;

    function makePixelTex(w, h, drawFn) {
      if (typeof document === 'undefined') return null;
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      drawFn(ctx, w, h);
      const tex = new THREE.CanvasTexture(c);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // Color Palette
    const H = '#1a0f0a'; // Curly hair base
    const C = '#2e1910'; // Hair curl highlight
    const S = '#e5a672'; // Warm skin tone
    const W = '#ffffff'; // Sclera white
    const P = '#2b1810'; // Eye pupil
    const B = '#1a0f0a'; // Beard and mustache
    const N = '#ce8b58'; // Nose shadow
    const M = '#964e42'; // Smile accent

    const faceGrid = [
      [H,H,H,H,H,H,H,H,H,H,H,H,H,H,H,H],
      [H,H,C,C,H,H,C,C,H,H,C,C,H,H,H,H],
      [H,H,H,H,H,H,H,H,H,H,H,H,H,H,H,H],
      [H,H,H,S,S,H,H,H,H,H,S,S,H,H,H,H],
      [H,S,S,S,S,S,S,S,S,S,S,S,S,S,S,H],
      [H,S,B,B,B,S,S,S,S,B,B,B,S,S,S,H],
      [H,S,W,P,P,S,S,S,S,P,P,W,S,S,S,H],
      [H,S,W,P,P,S,S,S,S,P,P,W,S,S,S,H],
      [H,S,S,S,S,S,N,N,S,S,S,S,S,S,S,H],
      [H,S,S,B,B,B,B,B,B,B,B,S,S,S,S,H],
      [H,S,S,S,M,M,M,M,M,M,S,S,S,S,S,H],
      [H,B,B,B,B,B,B,B,B,B,B,B,B,B,B,H],
      [H,B,B,B,B,B,B,B,B,B,B,B,B,B,B,H],
      [H,B,B,B,B,B,B,B,B,B,B,B,B,B,B,H],
      [H,H,B,B,B,B,B,B,B,B,B,B,B,B,H,H],
      [H,H,H,B,B,B,B,B,B,B,B,B,H,H,H,H]
    ];

    // 1. Face Texture (16x16 pixel-perfect Minecraft art)
    const faceTex = makePixelTex(16, 16, (ctx) => {
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          ctx.fillStyle = faceGrid[y][x];
          ctx.fillRect(x, y, 1, 1);
        }
      }
    });

    // 2. Hair Solid / Curly Textures (Sides, Top, Back)
    const hairTex = makePixelTex(16, 16, (ctx) => {
      ctx.fillStyle = H; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = C;
      for (let y = 0; y < 16; y += 4) {
        for (let x = 0; x < 16; x += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
        }
      }
    });

    // 3. Brown Plaid Flannel Shirt Texture (Torso)
    const plaidTex = makePixelTex(16, 16, (ctx) => {
      ctx.fillStyle = '#5c2e1f'; ctx.fillRect(0, 0, 16, 16);
      ctx.fillStyle = '#7c442c';
      ctx.fillRect(3, 0, 2, 16); ctx.fillRect(11, 0, 2, 16);
      ctx.fillRect(0, 3, 16, 2); ctx.fillRect(0, 11, 16, 2);
      ctx.fillStyle = '#3a1c12';
      ctx.fillRect(3, 3, 2, 2); ctx.fillRect(11, 3, 2, 2);
      ctx.fillRect(3, 11, 2, 2); ctx.fillRect(11, 11, 2, 2);
      // Center button placket
      ctx.fillStyle = '#26130c';
      ctx.fillRect(7, 0, 2, 16);
      ctx.fillStyle = '#f0ede6';
      ctx.fillRect(7, 4, 2, 1); ctx.fillRect(7, 9, 2, 1); ctx.fillRect(7, 14, 2, 1);
    });

    // 4. Plaid Arm Sleeves Texture
    const plaidArmTex = makePixelTex(8, 16, (ctx) => {
      ctx.fillStyle = '#5c2e1f'; ctx.fillRect(0, 0, 8, 16);
      ctx.fillStyle = '#7c442c';
      ctx.fillRect(2, 0, 2, 16); ctx.fillRect(0, 4, 8, 2); ctx.fillRect(0, 12, 8, 2);
      ctx.fillStyle = '#3a1c12';
      ctx.fillRect(2, 4, 2, 2); ctx.fillRect(2, 12, 2, 2);
    });

    // 5. Jeans Denim Texture
    const jeansTex = makePixelTex(8, 16, (ctx) => {
      ctx.fillStyle = '#3d5e82'; ctx.fillRect(0, 0, 8, 16);
      ctx.fillStyle = '#2c435e';
      ctx.fillRect(0, 0, 8, 2); // Belt line
      ctx.fillStyle = '#4e739c';
      ctx.fillRect(1, 4, 6, 8); // Faded denim knee
      ctx.fillStyle = '#2c435e';
      ctx.fillRect(7, 0, 1, 16); // Seam stitch
    });

    // 6. Two-Tone Skate Sneakers Texture
    const shoeTex = makePixelTex(8, 8, (ctx) => {
      ctx.fillStyle = '#22262e'; ctx.fillRect(0, 0, 8, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 5, 8, 3); // White vulcanized sole
      ctx.fillRect(2, 1, 4, 2); // White laces
    });

    const matFace = [
      new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: S, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: hairTex, roughness: 0.8 })
    ];

    const matShirtTorso = [
      new THREE.MeshStandardMaterial({ map: plaidArmTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: plaidArmTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: plaidTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: '#2c435e', roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: plaidTex, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ map: plaidTex, roughness: 0.8 })
    ];

    const matPlaidArm = new THREE.MeshStandardMaterial({ map: plaidArmTex, roughness: 0.8 });
    const matSkin = new THREE.MeshStandardMaterial({ color: S, roughness: 0.8 });
    const matJeans = new THREE.MeshStandardMaterial({ map: jeansTex, roughness: 0.85 });
    const matShoe = new THREE.MeshStandardMaterial({ map: shoeTex, roughness: 0.7 });
    const matGlasses = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.2, metalness: 0.85 });
    const matWatch = new THREE.MeshStandardMaterial({ color: 0xd0d3d8, roughness: 0.25, metalness: 0.85 });
    const matBraceR = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.5 });
    const matBraceB = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.5 });

    // Mathematical standard Minecraft unit: 1 pixel = 0.052 units (Total height = 32 * 0.052 = 1.664 units)
    const U = 0.052;

    function createBox(w, h, d, mat) {
      const geom = new THREE.BoxGeometry(w * U, h * U, d * U);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.material) {
        originalMeshMaterials.set(mesh.uuid, mesh.material);
      }
      return mesh;
    }

    const playerRoot = new THREE.Group();
    playerRoot.name = 'root';
    playerRoot.position.set(0, -0.82, 0);

    // HIPS / LOWER WAIST
    const hips = new THREE.Group();
    hips.name = 'hips';
    hips.position.set(0, 12 * U, 0);
    playerRoot.add(hips);

    // TORSO / CHEST (8 wide, 12 tall, 4 deep)
    const torso = new THREE.Group();
    torso.name = 'torso';
    torso.position.set(0, 0, 0);
    hips.add(torso);

    const torsoMesh = createBox(8, 12, 4, matShirtTorso);
    torsoMesh.name = 'torsoMesh';
    torsoMesh.position.set(0, 6 * U, 0);
    torso.add(torsoMesh);

    // Collar sunglasses clipped to shirt collar
    const glasses = createBox(4, 2, 0.8, matGlasses);
    glasses.name = 'glasses';
    glasses.position.set(0, 10 * U, 2.3 * U);
    torso.add(glasses);

    // HEAD (8 wide, 8 tall, 8 deep, pivots at top of torso: Y = 12 * U)
    const head = new THREE.Group();
    head.name = 'head';
    head.position.set(0, 12 * U, 0);
    torso.add(head);

    const headMesh = createBox(8, 8, 8, matFace);
    headMesh.name = 'headMesh';
    headMesh.position.set(0, 4 * U, 0);
    head.add(headMesh);

    // 3D Curly Hair layers on head
    const hairTop = createBox(8.4, 1.8, 8.4, new THREE.MeshStandardMaterial({ color: '#1c1008', roughness: 0.85 }));
    hairTop.position.set(0, 7.3 * U, 0);
    head.add(hairTop);

    const hairBack = createBox(8.2, 6.0, 1.2, new THREE.MeshStandardMaterial({ color: '#1c1008', roughness: 0.85 }));
    hairBack.position.set(0, 4.0 * U, -4.1 * U);
    head.add(hairBack);

    // RIGHT ARM (Shoulder pivot at X = +6 * U, Y = 11 * U)
    const rightArm = new THREE.Group();
    rightArm.name = 'rightArm';
    rightArm.position.set(6 * U, 11 * U, 0);
    torso.add(rightArm);

    const rightUpperArm = createBox(4, 6, 4, matPlaidArm);
    rightUpperArm.name = 'rightUpperArm';
    rightUpperArm.position.set(0, -3 * U, 0);
    rightArm.add(rightUpperArm);

    const rightForearm = new THREE.Group();
    rightForearm.name = 'rightForearm';
    rightForearm.position.set(0, -6 * U, 0);
    rightArm.add(rightForearm);

    const rightForearmMesh = createBox(4, 6, 4, matSkin);
    rightForearmMesh.name = 'rightForearmMesh';
    rightForearmMesh.position.set(0, -3 * U, 0);
    rightForearm.add(rightForearmMesh);

    const watch = createBox(4.4, 1.2, 4.4, matWatch);
    watch.name = 'watch';
    watch.position.set(0, -4.5 * U, 0);
    rightForearm.add(watch);

    // LEFT ARM (Shoulder pivot at X = -6 * U, Y = 11 * U)
    const leftArm = new THREE.Group();
    leftArm.name = 'leftArm';
    leftArm.position.set(-6 * U, 11 * U, 0);
    torso.add(leftArm);

    const leftUpperArm = createBox(4, 6, 4, matPlaidArm);
    leftUpperArm.name = 'leftUpperArm';
    leftUpperArm.position.set(0, -3 * U, 0);
    leftArm.add(leftUpperArm);

    const leftForearm = new THREE.Group();
    leftForearm.name = 'leftForearm';
    leftForearm.position.set(0, -6 * U, 0);
    leftArm.add(leftForearm);

    const leftForearmMesh = createBox(4, 6, 4, matSkin);
    leftForearmMesh.name = 'leftForearmMesh';
    leftForearmMesh.position.set(0, -3 * U, 0);
    leftForearm.add(leftForearmMesh);

    const braceR = createBox(4.3, 0.7, 4.3, matBraceR);
    braceR.name = 'braceR';
    braceR.position.set(0, -4.2 * U, 0);
    leftForearm.add(braceR);

    const braceB = createBox(4.3, 0.7, 4.3, matBraceB);
    braceB.name = 'braceB';
    braceB.position.set(0, -5.0 * U, 0);
    leftForearm.add(braceB);

    // RIGHT LEG (Hip pivot at X = +2 * U, Y = 0 relative to hips)
    const rightLeg = new THREE.Group();
    rightLeg.name = 'rightLeg';
    rightLeg.position.set(2 * U, 0, 0);
    hips.add(rightLeg);

    const rightUpperLeg = createBox(4, 6, 4, matJeans);
    rightUpperLeg.name = 'rightUpperLeg';
    rightUpperLeg.position.set(0, -3 * U, 0);
    rightLeg.add(rightUpperLeg);

    const rightLowerLeg = new THREE.Group();
    rightLowerLeg.name = 'rightLowerLeg';
    rightLowerLeg.position.set(0, -6 * U, 0);
    rightLeg.add(rightLowerLeg);

    const rightLowerLegMesh = createBox(4, 4, 4, matJeans);
    rightLowerLegMesh.name = 'rightLowerLegMesh';
    rightLowerLegMesh.position.set(0, -2 * U, 0);
    rightLowerLeg.add(rightLowerLegMesh);

    const rightShoeMesh = createBox(4, 2, 4.2, matShoe);
    rightShoeMesh.name = 'rightShoeMesh';
    rightShoeMesh.position.set(0, -5 * U, 0.1 * U);
    rightLowerLeg.add(rightShoeMesh);

    // LEFT LEG (Hip pivot at X = -2 * U, Y = 0 relative to hips)
    const leftLeg = new THREE.Group();
    leftLeg.name = 'leftLeg';
    leftLeg.position.set(-2 * U, 0, 0);
    hips.add(leftLeg);

    const leftUpperLeg = createBox(4, 6, 4, matJeans);
    leftUpperLeg.name = 'leftUpperLeg';
    leftUpperLeg.position.set(0, -3 * U, 0);
    leftLeg.add(leftUpperLeg);

    const leftLowerLeg = new THREE.Group();
    leftLowerLeg.name = 'leftLowerLeg';
    leftLowerLeg.position.set(0, -6 * U, 0);
    leftLeg.add(leftLowerLeg);

    const leftLowerLegMesh = createBox(4, 4, 4, matJeans);
    leftLowerLegMesh.name = 'leftLowerLegMesh';
    leftLowerLegMesh.position.set(0, -2 * U, 0);
    leftLowerLeg.add(leftLowerLegMesh);

    const leftShoeMesh = createBox(4, 2, 4.2, matShoe);
    leftShoeMesh.name = 'leftShoeMesh';
    leftShoeMesh.position.set(0, -5 * U, 0.1 * U);
    leftLowerLeg.add(leftShoeMesh);

    // Register node references for emote articulation
    characterNodes.root = playerRoot;
    characterNodes.torso = torso;
    characterNodes.chest = torso;
    characterNodes.head = head;
    characterNodes.armRight = rightArm;
    characterNodes.upperArmR = rightArm;
    characterNodes.rightArm = rightArm;
    characterNodes.forearmRight = rightForearm;
    characterNodes.forearmR = rightForearm;
    characterNodes.armLeft = leftArm;
    characterNodes.upperArmL = leftArm;
    characterNodes.leftArm = leftArm;
    characterNodes.forearmLeft = leftForearm;
    characterNodes.forearmL = leftForearm;
    characterNodes.legRight = rightLeg;
    characterNodes.upperLegR = rightLeg;
    characterNodes.rightLeg = rightLeg;
    characterNodes.forelegRight = rightLowerLeg;
    characterNodes.lowerLegR = rightLowerLeg;
    characterNodes.legLeft = leftLeg;
    characterNodes.upperLegL = leftLeg;
    characterNodes.leftLeg = leftLeg;
    characterNodes.forelegLeft = leftLowerLeg;
    characterNodes.lowerLegL = leftLowerLeg;

    return playerRoot;
  }

  function initThreeViewer() {
    if (!threeCanvas || typeof THREE === 'undefined') return;

    const container = document.getElementById('model-3d-wrapper') || threeCanvas.parentElement;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 500;

    // 1. Scene
    threeScene = new THREE.Scene();

    // 2. Camera (38 deg FOV for natural perspective without distortion)
    threeCamera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    threeCamera.position.set(0, 0.05, 3.1);

    const isMobile = window.innerWidth <= 868 || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);

    // 3. Renderer with transparent background (Optimized for mobile GPUs)
    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: !isMobile,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp'
    });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    if (!isMobile) {
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.05;
    }

    // 4. Fixed Eye-Level Camera & Zero-Zoom Fitting
    fitCameraToModel = function() {
      if (!threeCamera || !container) return;
      const rect = container.getBoundingClientRect();
      const currentW = rect.width || width || 400;
      const currentH = rect.height || height || 500;
      const aspect = currentW / currentH;
      threeCamera.aspect = aspect;
      threeCamera.updateProjectionMatrix();
      if (threeRenderer) {
        threeRenderer.setSize(currentW, currentH);
      }

      const fovRad = (threeCamera.fov * Math.PI) / 360;
      const targetHeight = 1.65;
      const fitFraction = 0.74;
      const distY = (targetHeight / 2) / (Math.tan(fovRad) * fitFraction);

      const targetWidth = 0.85;
      const distX = (targetWidth / 2) / (Math.tan(fovRad) * Math.max(aspect, 0.35) * 0.78);

      optimalCamDist = Math.max(distY, distX, 2.85);

      threeCamera.position.set(0, 0.05, optimalCamDist);
      threeCamera.lookAt(0, 0.05, 0);
    };
    fitCameraToModel();

    // 5. Balanced Lighting (Rich, saturated Minecraft colors)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    threeScene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6ea, 1.1);
    sunLight.position.set(3, 5, 3.5);
    threeScene.add(sunLight);

    const frontFillLight = new THREE.DirectionalLight(0xffffff, 0.65);
    frontFillLight.position.set(0, 1.5, 3.5);
    threeScene.add(frontFillLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 0.9);
    cyanRimLight.position.set(-3, 2, -2);
    threeScene.add(cyanRimLight);

    window.update3DLighting = function(isNightMode) {
      if (isNightMode) {
        ambientLight.color.setHex(0x334466);
        ambientLight.intensity = 0.55;
        sunLight.color.setHex(0x5588cc);
        sunLight.intensity = 0.65;
        cyanRimLight.intensity = 1.8;
        frontFillLight.intensity = 0.45;
      } else {
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.75;
        sunLight.color.setHex(0xfff6ea);
        sunLight.intensity = 1.1;
        cyanRimLight.intensity = 0.9;
        frontFillLight.intensity = 0.65;
      }
    };

    // 6. Build and Mount Authentic Minecraft Character (Matching Reference Image Perfectly)
    function setupModelScene(gltf) {
      modelMeshGroup = gltf.scene;
      modelMeshGroup.traverse((child) => {
        if (child.isMesh) {
          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }
          child.frustumCulled = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.roughness = 0.6;
            child.material.metalness = 0.15;
            child.material.needsUpdate = true;
            originalMeshMaterials.set(child.uuid, child.material);
          }
        }
      });

      characterNodes.head = modelMeshGroup.getObjectByName('head');
      characterNodes.upperArmL = modelMeshGroup.getObjectByName('upperArmL') || modelMeshGroup.getObjectByName('left_arm');
      characterNodes.forearmL = modelMeshGroup.getObjectByName('forearmL');
      characterNodes.leftArm = characterNodes.upperArmL;
      characterNodes.armLeft = characterNodes.upperArmL;

      characterNodes.upperArmR = modelMeshGroup.getObjectByName('upperArmR') || modelMeshGroup.getObjectByName('right_arm');
      characterNodes.forearmR = modelMeshGroup.getObjectByName('forearmR');
      characterNodes.rightArm = characterNodes.upperArmR;
      characterNodes.armRight = characterNodes.upperArmR;

      characterNodes.chest = modelMeshGroup.getObjectByName('chest') || modelMeshGroup.getObjectByName('torso');
      characterNodes.torso = characterNodes.chest;

      characterNodes.upperLegL = modelMeshGroup.getObjectByName('upperLegL') || modelMeshGroup.getObjectByName('left_leg');
      characterNodes.lowerLegL = modelMeshGroup.getObjectByName('lowerLegL');
      characterNodes.leftLeg = characterNodes.upperLegL;
      characterNodes.legLeft = characterNodes.upperLegL;

      characterNodes.upperLegR = modelMeshGroup.getObjectByName('upperLegR') || modelMeshGroup.getObjectByName('right_leg');
      characterNodes.lowerLegR = modelMeshGroup.getObjectByName('lowerLegR');
      characterNodes.rightLeg = characterNodes.upperLegR;
      characterNodes.legRight = characterNodes.upperLegR;

      characterNodes.root = modelMeshGroup.getObjectByName('root') || modelMeshGroup;

      const bbox = new THREE.Box3().setFromObject(modelMeshGroup);
      const center = bbox.getCenter(new THREE.Vector3());
      const size = bbox.getSize(new THREE.Vector3());

      modelMeshGroup.position.set(-center.x, -center.y, -center.z);

      const modelWrapper = new THREE.Group();
      modelWrapper.add(modelMeshGroup);
      modelWrapper.rotation.y = -Math.PI / 2; // Face forward (+Z)

      const baseHeight = size.y || 1.0;
      const targetScale = 1.65 / baseHeight;
      modelWrapper.scale.set(targetScale, targetScale, targetScale);

      if (modelPivot) {
        threeScene.remove(modelPivot);
      }
      modelPivot = new THREE.Group();
      modelPivot.add(modelWrapper);
      threeScene.add(modelPivot);

      fitCameraToModel();
      threeRenderer.render(threeScene, threeCamera);

      if (modelLoading) {
        modelLoading.classList.add('loaded');
      }
      updateGamerProgress(100, 'CHERRY GROVE MINECRAFT AVATAR READY (100%)');
      finishGamerLoading();
    }

    function fallbackProcedural() {
      modelMeshGroup = buildMinecraftPlayer();
      if (modelMeshGroup) {
        if (modelPivot) {
          threeScene.remove(modelPivot);
        }
        modelPivot = new THREE.Group();
        modelPivot.add(modelMeshGroup);
        threeScene.add(modelPivot);

        fitCameraToModel();
        threeRenderer.render(threeScene, threeCamera);

        if (modelLoading) {
          modelLoading.classList.add('loaded');
        }
        updateGamerProgress(100, 'CHERRY GROVE MINECRAFT AVATAR READY (100%)');
        setTimeout(finishGamerLoading, 250);
      }
    }

    // Optional manual GLB loader for user file selection or drag-and-drop
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();

      const candidatePaths = [
        'assets/character_articulated.glb',
        'assets/character.glb',
        'colored 3d.glb',
        'assets/colored 3d.glb'
      ];

      function tryLoadCandidate(idx) {
        if (idx >= candidatePaths.length) {
          console.warn('All GLB candidate paths failed, using procedural fallback');
          fallbackProcedural();
          return;
        }

        const path = candidatePaths[idx];
        loader.load(
          path,
          (gltf) => {
            setupModelScene(gltf);
          },
          (xhr) => {
            if (xhr.lengthComputable) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              updateGamerProgress(percent, `LOADING CHERRY GROVE AVATAR (${percent}%)...`);
              if (modelLoading) {
                const span = modelLoading.querySelector('span');
                if (span) span.textContent = `Loading Colored 3D Mesh (${percent}%)...`;
              }
            }
          },
          (err) => {
            console.warn(`Could not load model from ${path}, trying next fallback...`, err);
            tryLoadCandidate(idx + 1);
          }
        );
      }

      function loadModelFromFile(file) {
        if (!file) return;
        if (modelLoading) {
          modelLoading.classList.remove('loaded');
          const span = modelLoading.querySelector('span');
          if (span) span.textContent = `Parsing ${file.name}...`;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
          const contents = event.target.result;
          loader.parse(
            contents,
            '',
            (gltf) => {
              setupModelScene(gltf);
            },
            (err) => {
              console.error('Error parsing GLB file:', err);
              if (modelLoading) {
                modelLoading.innerHTML = '<span>Could not parse 3D file</span>';
              }
            }
          );
        };
        reader.readAsArrayBuffer(file);
      }

      // Drag & drop support on canvas container
      if (container) {
        container.addEventListener('dragover', (e) => e.preventDefault());
        container.addEventListener('drop', (e) => {
          e.preventDefault();
          const file = e.dataTransfer && e.dataTransfer.files[0];
          if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
            loadModelFromFile(file);
          }
        });
      }

      tryLoadCandidate(0);
    } else {
      fallbackProcedural();
    }

    // 7. Cursor Movement & Drag Interaction (Move from cursor horizontally, Zero Zoom)
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;

    function onCanvasPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target !== threeCanvas) return;
      isDragging = true;
      lastPointerX = e.clientX;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartTime = Date.now();
      currentVelocityY = 0;
      if (threeCanvas) threeCanvas.style.cursor = 'grabbing';
      try { threeCanvas.setPointerCapture(e.pointerId); } catch (_) {}
    }

    function onPointerMove(e) {
      // 1) Update cursor angle so character turns left/right following cursor
      const normX = (e.clientX / window.innerWidth) - 0.5; // -0.5 (left) to +0.5 (right)
      targetCursorAngle = normX * 1.6; // ~45 deg left or right

      // 2) If dragging on canvas, add direct spin rotation
      if (isDragging && modelPivot) {
        const deltaX = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        const delta = deltaX * 0.009;
        dragRotation += delta;
        currentVelocityY = delta;
      }
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      if (threeCanvas) {
        threeCanvas.style.cursor = 'grab';
        try { threeCanvas.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      // Quick tap or click detection: if cursor moved less than 10px in < 450ms, open Minecraft Emote Wheel!
      const dist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      const elapsed = Date.now() - pointerStartTime;
      if (dist < 10 && elapsed < 450) {
        openEmoteWheel();
      }
    }

    // Attach drag listener directly to canvas only (so top buttons are never blocked)
    if (threeCanvas) {
      threeCanvas.addEventListener('pointerdown', onCanvasPointerDown);
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Completely block all mousewheel & pinch zooming on canvas
    const preventZoom = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (threeCanvas) {
      threeCanvas.addEventListener('wheel', preventZoom, { passive: false });
    }

    // Keyboard turning: ArrowLeft, ArrowRight, A, D and 'B' key for Minecraft Emote Wheel
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        openEmoteWheel();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dragRotation -= 0.12;
        currentVelocityY = -0.05;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dragRotation += 0.12;
        currentVelocityY = 0.05;
      }
    });

    // 8. Authentic Minecraft Bedrock Emote Engine & Animation Loop
    function resetCharacterPose() {
      const cn = characterNodes;
      if (cn.torso) cn.torso.rotation.set(0, 0, 0);
      if (cn.chest) cn.chest.rotation.set(0, 0, 0);
      if (cn.head) cn.head.rotation.set(0, 0, 0);
      const armR = cn.armRight || cn.upperArmR || cn.rightArm;
      const armL = cn.armLeft || cn.upperArmL || cn.leftArm;
      const forearmR = cn.forearmRight || cn.forearmR;
      const forearmL = cn.forearmLeft || cn.forearmL;
      const legR = cn.legRight || cn.upperLegR || cn.rightLeg;
      const legL = cn.legLeft || cn.upperLegL || cn.leftLeg;
      const forelegR = cn.forelegRight || cn.lowerLegR;
      const forelegL = cn.forelegLeft || cn.lowerLegL;

      if (armR) armR.rotation.set(0, 0, 0);
      if (armL) armL.rotation.set(0, 0, 0);
      if (forearmR) forearmR.rotation.set(0, 0, 0);
      if (forearmL) forearmL.rotation.set(0, 0, 0);
      if (legR) legR.rotation.set(0, 0, 0);
      if (legL) legL.rotation.set(0, 0, 0);
      if (forelegR) forelegR.rotation.set(0, 0, 0);
      if (forelegL) forelegL.rotation.set(0, 0, 0);

      if (modelPivot) {
        modelPivot.position.set(0, 0, 0);
        modelPivot.rotation.x = 0;
        modelPivot.rotation.z = 0;
        modelPivot.scale.set(1, 1, 1);
      }
    }

    function applyArticulatedEmote(key, emoteTime, duration) {
      const cn = characterNodes;
      const armR = cn.armRight || cn.upperArmR || cn.rightArm;
      const armL = cn.armLeft || cn.upperArmL || cn.leftArm;
      const forearmR = cn.forearmRight || cn.forearmR;
      const forearmL = cn.forearmLeft || cn.forearmL;
      const legR = cn.legRight || cn.upperLegR || cn.rightLeg;
      const legL = cn.legLeft || cn.upperLegL || cn.leftLeg;
      const torso = cn.torso || cn.chest;
      const head = cn.head;

      // Clean animation envelope: 180ms ease-in, sustain action, 220ms ease-out
      const blendIn = Math.min(1.0, emoteTime / 0.18);
      const blendOut = Math.min(1.0, (duration - emoteTime) / 0.22);
      const env = Math.max(0, Math.min(blendIn, blendOut));

      resetCharacterPose();

      switch (key) {
        case 'wave': {
          // Official Minecraft Bedrock "The Wave" Emote
          const waveCycle = Math.sin(emoteTime * 14) * 0.38; // 4.5 Hz wave oscillation
          if (armR) {
            armR.rotation.x = -2.1 * env; // Point high in air (~120 deg)
            armR.rotation.z = (0.42 + waveCycle) * env; // Wave left and right
          }
          if (forearmR) {
            forearmR.rotation.x = -0.32 * env;
          }
          if (head) {
            head.rotation.z = -0.16 * env; // Warm head tilt
            head.rotation.x = -0.06 * env;
          }
          if (armL) {
            armL.rotation.x = 0.10 * env;
          }
          if (modelPivot) {
            modelPivot.position.y = Math.abs(Math.sin(emoteTime * 7)) * 0.03 * env;
          }
          break;
        }

        case 'cheer': {
          // Official Minecraft Bedrock "Victory Cheer" Emote
          const jumpPhase = Math.sin(emoteTime * 12);
          const pump = Math.sin(emoteTime * 16) * 0.15;

          if (armR) {
            armR.rotation.z = (2.82 + pump) * env; // High 'V' outward & up
            armR.rotation.x = -0.35 * env;
          }
          if (armL) {
            armL.rotation.z = (-2.82 - pump) * env; // High 'V' outward & up
            armL.rotation.x = -0.35 * env;
          }
          if (head) {
            head.rotation.x = -0.35 * env; // Look up at triumph
          }
          const hop = Math.max(0, jumpPhase) * 0.32 * env;
          if (modelPivot) {
            modelPivot.position.y = hop;
          }
          if (legR && legL && hop > 0.05) {
            legR.rotation.x = 0.25 * env;
            legL.rotation.x = -0.25 * env;
          }
          break;
        }

        case 'clap': {
          // Official Minecraft Bedrock "Simple Clap" Emote
          const clapBeat = Math.sin(emoteTime * 22); // 7 Hz applause tempo
          const clapOpen = Math.max(0, clapBeat) * 0.28;

          if (armR) {
            armR.rotation.x = -1.55 * env; // Horizontal forward
            armR.rotation.z = (-0.30 - clapOpen) * env;
          }
          if (armL) {
            armL.rotation.x = -1.55 * env; // Horizontal forward
            armL.rotation.z = (0.30 + clapOpen) * env;
          }
          if (head) {
            head.rotation.x = Math.max(0, clapBeat) * 0.12 * env;
          }
          if (modelPivot) {
            modelPivot.position.y = Math.max(0, clapBeat) * 0.02 * env;
          }
          break;
        }

        case 'point': {
          // Official Minecraft Bedrock "Over There!" Emote
          if (armR) {
            armR.rotation.x = -1.45 * env;
            armR.rotation.z = 0.28 * env;
          }
          if (head) {
            head.rotation.y = -0.35 * env;
            head.rotation.x = 0.06 * env;
          }
          if (torso) {
            torso.rotation.y = -0.15 * env;
          }
          if (armL) {
            armL.rotation.x = 0.25 * env;
          }
          break;
        }

        case 'bow': {
          // Official Minecraft Bedrock "Hero's Bow" Emote
          const bowEase = Math.sin(Math.min(1.0, emoteTime / duration) * Math.PI);
          if (torso) torso.rotation.x = 0.55 * bowEase;
          if (head) head.rotation.x = 0.35 * bowEase;
          if (armR) armR.rotation.x = 0.35 * bowEase;
          if (armL) armL.rotation.x = 0.35 * bowEase;
          if (modelPivot) {
            modelPivot.position.y = -0.04 * bowEase;
            modelPivot.rotation.x = 0.15 * bowEase;
          }
          break;
        }

        case 'disco': {
          // Official Minecraft Bedrock "Simple Dance / Foot Groove" Emote
          const step = Math.sin(emoteTime * 10);
          const cosStep = Math.cos(emoteTime * 10);

          if (torso) {
            torso.rotation.z = step * 0.15 * env;
            torso.rotation.y = cosStep * 0.12 * env;
          }
          if (head) {
            head.rotation.z = -step * 0.18 * env;
            head.rotation.x = Math.abs(cosStep) * 0.12 * env;
          }
          if (armR) armR.rotation.x = step * 0.95 * env;
          if (armL) armL.rotation.x = -step * 0.95 * env;
          if (forearmR) forearmR.rotation.x = -0.35 * env;
          if (forearmL) forearmL.rotation.x = -0.35 * env;
          if (legR) legR.rotation.x = -step * 0.65 * env;
          if (legL) legL.rotation.x = step * 0.65 * env;
          if (modelPivot) {
            modelPivot.position.y = Math.abs(cosStep) * 0.06 * env;
            modelPivot.rotation.z = step * 0.08 * env;
          }
          break;
        }

        case 'tornado': {
          // Whirlwind Spin Emote (720° pirouette with airplane arms)
          if (armR) armR.rotation.z = 1.55 * env;
          if (armL) armL.rotation.z = -1.55 * env;
          const spinProgress = Math.min(1.0, emoteTime / duration);
          if (modelPivot) {
            modelPivot.rotation.y = dragRotation + spinProgress * Math.PI * 4;
            modelPivot.position.y = Math.sin(spinProgress * Math.PI) * 0.35;
          }
          break;
        }

        case 'flip': {
          // 360° Acrobatic Flip Emote
          const p = Math.min(1.0, emoteTime / duration);
          if (p < 0.22) {
            const t = p / 0.22;
            if (modelPivot) modelPivot.position.y = -0.15 * Math.sin(t * Math.PI * 0.5);
            if (armR && armL) armR.rotation.x = armL.rotation.x = 0.7 * t;
            if (legR && legL) legR.rotation.x = legL.rotation.x = -0.4 * t;
          } else if (p < 0.80) {
            const t = (p - 0.22) / 0.58;
            if (modelPivot) {
              modelPivot.position.y = Math.sin(t * Math.PI) * 0.9;
              modelPivot.rotation.x = -Math.PI * 2 * t;
            }
            if (armR && armL) armR.rotation.x = armL.rotation.x = -2.0;
            if (legR && legL) legR.rotation.x = legL.rotation.x = 1.0;
          } else {
            const t = (p - 0.80) / 0.20;
            if (modelPivot) {
              modelPivot.rotation.x = 0;
              modelPivot.position.y = -0.08 * (1 - t) * Math.sin(t * Math.PI);
            }
          }
          break;
        }
      }
    }

    function updateActiveEmote(dtSec) {
      if (!activeEmote) return;
      activeEmote.timer += dtSec;
      const durationSec = activeEmote.duration * 0.001;
      applyArticulatedEmote(activeEmote.key, activeEmote.timer, durationSec);
      if (activeEmote.timer >= durationSec) {
        activeEmote = null;
        resetCharacterPose();
      }
    }

    let lastFrameSec = 0;
    function renderThree(timestamp = 0) {
      requestAnimationFrame(renderThree);
      const nowSec = timestamp * 0.001;
      const dt = lastFrameSec ? Math.min(0.08, Math.max(0.001, nowSec - lastFrameSec)) : 0.016;
      lastFrameSec = nowSec;

      if (isMobile && timestamp) {
        if (timestamp - lastRenderTime < mobileFrameInterval) return;
        lastRenderTime = timestamp;
      }

      try {
        if (threeScene) {
          if (activeEmote) {
            // Smoothly auto-center character to face front during emotes
            dragRotation += (0 - dragRotation) * 0.12;
            if (modelPivot && activeEmote.key !== 'tornado') {
              modelPivot.rotation.y += (0 - modelPivot.rotation.y) * 0.12;
            }
            updateActiveEmote(dt);
          } else {
            // Natural Minecraft idle breathing & arm sway
            const idleTime = timestamp * 0.0022;
            if (modelPivot) {
              modelPivot.position.y = Math.sin(idleTime) * 0.008;
            }
            if (characterNodes.head) {
              characterNodes.head.rotation.x = Math.sin(idleTime + 0.6) * 0.025;
            }
            const leftArmNode = characterNodes.armLeft || characterNodes.upperArmL || characterNodes.leftArm;
            if (leftArmNode) {
              leftArmNode.rotation.x = Math.sin(idleTime) * 0.04;
            }
            const rightArmNode = characterNodes.armRight || characterNodes.upperArmR || characterNodes.rightArm;
            if (rightArmNode) {
              rightArmNode.rotation.x = -Math.sin(idleTime) * 0.04;
            }

            // Turntable controls
            if (isDragging && modelPivot) {
              modelPivot.rotation.y = dragRotation;
            } else if (modelPivot) {
              if (Math.abs(currentVelocityY) > 0.0002) {
                dragRotation += currentVelocityY;
                modelPivot.rotation.y = dragRotation;
                currentVelocityY *= 0.90;
              } else if (autoSpinEnabled) {
                dragRotation += autoSpinSpeed;
                modelPivot.rotation.y = dragRotation;
              } else {
                // In Minecraft menu: Steve's head looks towards mouse cursor, body stays facing front
                const targetY = dragRotation + targetCursorAngle * 0.35;
                modelPivot.rotation.y += (targetY - modelPivot.rotation.y) * 0.08;
                if (characterNodes.head) {
                  characterNodes.head.rotation.y += (targetCursorAngle * 0.65 - characterNodes.head.rotation.y) * 0.10;
                }
              }
            }
          }
        }

        threeCamera.position.set(0, 0.05, optimalCamDist);
        threeCamera.lookAt(0, 0.05, 0);
        threeRenderer.render(threeScene, threeCamera);
      } catch (err) {
        console.warn('Render loop frame error:', err);
      }
    }
    renderThree();

    // Resize Handler
    window.addEventListener('resize', () => {
      if (!container || !threeRenderer || !threeCamera) return;
      const newRect = container.getBoundingClientRect();
      const newW = newRect.width || 400;
      const newH = newRect.height || 500;
      threeCamera.aspect = newW / newH;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(newW, newH);
      fitCameraToModel();
    });
  }

  // Set Material Helper (Colors, Dark, Cyan, Gold)
  function setModelMaterial(matKey) {
    currentModelMaterial = matKey;
    playClickSound(1.2);

    [btnMatColored, btnMatTitanium, btnMatCyan, btnMatGold].forEach((b) => b && b.classList.remove('active'));
    if (matKey === 'colored' && btnMatColored) btnMatColored.classList.add('active');
    if (matKey === 'titanium' && btnMatTitanium) btnMatTitanium.classList.add('active');
    if (matKey === 'cyan' && btnMatCyan) btnMatCyan.classList.add('active');
    if (matKey === 'gold' && btnMatGold) btnMatGold.classList.add('active');

    if (modelMeshGroup) {
      modelMeshGroup.traverse((child) => {
        if (child.isMesh) {
          if (matKey === 'colored') {
            const orig = originalMeshMaterials.get(child.uuid);
            if (orig) {
              child.material = orig;
              orig.needsUpdate = true;
            }
          } else if (materials[matKey]) {
            const m = materials[matKey].clone();
            m.side = THREE.DoubleSide;
            m.needsUpdate = true;
            child.material = m;
          }
        }
      });
      if (threeRenderer && threeScene && threeCamera) {
        threeRenderer.render(threeScene, threeCamera);
      }
    }
  }

  // Material Button Listeners (Colors, Dark, Cyan, Gold)
  if (btnMatColored) {
    btnMatColored.addEventListener('click', (e) => {
      e.stopPropagation();
      setModelMaterial('colored');
    });
  }
  if (btnMatTitanium) {
    btnMatTitanium.addEventListener('click', (e) => {
      e.stopPropagation();
      setModelMaterial('titanium');
    });
  }
  if (btnMatCyan) {
    btnMatCyan.addEventListener('click', (e) => {
      e.stopPropagation();
      setModelMaterial('cyan');
    });
  }
  if (btnMatGold) {
    btnMatGold.addEventListener('click', (e) => {
      e.stopPropagation();
      setModelMaterial('gold');
    });
  }

  // Auto-Spin Toggle Button
  if (btnToggleRotate) {
    btnToggleRotate.addEventListener('click', (e) => {
      e.stopPropagation();
      autoSpinEnabled = !autoSpinEnabled;
      playClickSound(1.0);
      btnToggleRotate.classList.toggle('active', autoSpinEnabled);
    });
  }

  // Reset Camera & Rotation Button
  if (btnResetCam) {
    btnResetCam.addEventListener('click', (e) => {
      e.stopPropagation();
      playClickSound(0.9);
      dragRotation = 0;
      targetCursorAngle = 0;
      currentVelocityY = 0;
      if (modelPivot) {
        modelPivot.rotation.set(0, 0, 0);
      }
      fitCameraToModel();
    });
  }

  // 3D Mode Toggle Button in Header
  if (btnToggle3D) {
    btnToggle3D.addEventListener('click', () => {
      is3DModeActive = !is3DModeActive;
      playClickSound(1.1);
      document.body.classList.toggle('mode-2d-only', !is3DModeActive);
      btnToggle3D.classList.toggle('active', is3DModeActive);
      btnToggle3D.querySelector('.btn-text').textContent = is3DModeActive ? '3D: ON' : '3D: OFF';
      showToast(
        is3DModeActive ? '3D Viewport Enabled' : '2D Scene Viewport',
        is3DModeActive ? 'Interactive 3D Player Mesh active.' : 'Switched to classic scenic background.',
        'assets/icons/player-head.svg'
      );
    });
  }

  // Initialize Three.js Viewport
  setTimeout(initThreeViewer, 100);

  // Sync Day/Night lighting with 3D scene
  if (btnTime) {
    btnTime.addEventListener('click', () => {
      if (window.update3DLighting) {
        window.update3DLighting(document.body.classList.contains('theme-night'));
      }
    });
  }

  // =========================================================================
  // 10. INTERACTIVE LIGHTBOX FOR CERTIFICATES & RESUME
  // =========================================================================
  const lightboxDialog = document.getElementById('lightbox-dialog');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxOpenNew = document.getElementById('lightbox-open-new');
  const btnLightboxClose = document.getElementById('btn-lightbox-close');
  const btnLightboxDone = document.getElementById('btn-lightbox-done');
  const certCards = document.querySelectorAll('.cert-card');
  const btnInspectResume = document.getElementById('btn-inspect-resume');

  function openLightbox(imgSrc, title) {
    if (!lightboxDialog) return;
    initAudio();
    playPopSound(4);
    lightboxImg.src = imgSrc;
    lightboxTitle.textContent = title || 'DOCUMENT INSPECTION';
    if (lightboxOpenNew) lightboxOpenNew.href = imgSrc;
    lightboxDialog.showModal();
  }

  function closeLightbox() {
    if (!lightboxDialog) return;
    playClickSound(0.8);
    lightboxDialog.close();
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.dataset.img;
      const title = card.dataset.title;
      if (src) openLightbox(src, title);
    });
  });

  if (btnInspectResume) {
    btnInspectResume.addEventListener('click', () => {
      openLightbox('assets/certificates/resume_yash_vishwakarma.jpg', 'Official Resume - Yash Vishwakarma');
    });
  }

  if (btnLightboxClose) btnLightboxClose.addEventListener('click', closeLightbox);
  if (btnLightboxDone) btnLightboxDone.addEventListener('click', closeLightbox);

  if (lightboxDialog) {
    lightboxDialog.addEventListener('click', (e) => {
      const rect = lightboxDialog.getBoundingClientRect();
      const inDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inDialog) {
        closeLightbox();
      }
    });
  }

  // Initial welcome toast
  setTimeout(() => {
    showToast('Survival Guide V1.0.0', 'Welcome to Yash’s Profile! Colored 3D Model & Hotbar [1-9] active.', 'assets/icons/player-head.svg');
  }, 1200);
});

