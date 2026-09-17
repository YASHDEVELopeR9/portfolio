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
    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    let duration = 1600;

    switch (emoteKey) {
      case 'flip':
        duration = 1400;
        playJumpSound();
        showToast('360° Backflip 🤸', 'Yash executes an acrobatic Minecraft flip!', 'assets/icons/player-head.svg');
        spawnParticleBurst(25);
        break;

      case 'wave':
        duration = 1800;
        playXpChime();
        showToast('Friendly Wave 👋', 'Yash waves enthusiastically to you!', 'assets/icons/player-head.svg');
        break;

      case 'cheer':
        duration = 2000;
        playLevelUpSound();
        showToast('Victory Cheer 🎉', 'Quest celebration! Advancement achieved!', 'assets/icons/nether-star.svg');
        spawnParticleBurst(30);
        break;

      case 'disco':
        duration = 2400;
        playDiscoBeat();
        showToast('Disco Groove 🕺', 'Minecraft retro rhythm dance activated!', 'assets/icons/player-head.svg');
        break;

      case 'bow':
        duration = 1600;
        playClickSound(1.2);
        showToast("Hero's Bow 🙇", 'A respectful bow for the brave traveler.', 'assets/icons/player-head.svg');
        break;

      case 'point':
        duration = 1600;
        playClickSound(1.4);
        showToast('Adventure Point 👉', 'Onward! Great quests and code await ahead.', 'assets/icons/compass.svg');
        break;

      case 'tornado':
        duration = 1500;
        playSwordSweepSound();
        showToast('Tornado Spin 🌪️', 'Cyclone whirlwind spin unleashed!', 'assets/icons/diamond-sword.svg');
        spawnParticleBurst(25);
        break;

      case 'clap':
        duration = 1800;
        playClapSound();
        showToast('Applause 👏', 'Bravo! A round of applause for your visit!', 'assets/icons/player-head.svg');
        break;

      default:
        showToast('Minecraft Emote 🎭', 'Emote performed!', 'assets/icons/player-head.svg');
        break;
    }

    activeEmote = {
      key: emoteKey,
      startTime: now,
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
  // VOXEL CHARACTER BUILDER & RIG ENGINE (build_voxel_character.py specification)
  // =========================================================================
  function buildVoxelCharacter() {
    if (typeof THREE === 'undefined') return null;

    function createFaceTexture() {
      if (typeof document === 'undefined') return null;
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      const ctx = c.getContext('2d');
      // Skin tone
      ctx.fillStyle = '#f0b887';
      ctx.fillRect(0, 0, 32, 32);

      // Curly hair fringe & bangs
      ctx.fillStyle = '#2e1a12';
      ctx.fillRect(0, 0, 32, 8);
      ctx.fillRect(2, 8, 4, 3);
      ctx.fillRect(9, 8, 5, 2);
      ctx.fillRect(17, 8, 5, 3);
      ctx.fillRect(25, 8, 5, 2);

      // Sideburns
      ctx.fillRect(0, 8, 3, 14);
      ctx.fillRect(29, 8, 3, 14);

      // Eyebrows
      ctx.fillStyle = '#22130d';
      ctx.fillRect(5, 11, 7, 2);
      ctx.fillRect(20, 11, 7, 2);

      // Eyes (white sclera + dark pupil + specular shine)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(5, 13, 7, 5);
      ctx.fillRect(20, 13, 7, 5);
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(8, 13, 4, 5);
      ctx.fillRect(20, 13, 4, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 13, 2, 2);
      ctx.fillRect(20, 13, 2, 2);

      // Nose accent
      ctx.fillStyle = '#dc9e6e';
      ctx.fillRect(14, 18, 4, 3);

      // Beard & mustache
      ctx.fillStyle = '#2e1a12';
      ctx.fillRect(0, 24, 32, 8);
      ctx.fillRect(3, 21, 5, 3);
      ctx.fillRect(24, 21, 5, 3);
      ctx.fillRect(10, 21, 12, 3); // mustache

      // Friendly smile / mouth
      ctx.fillStyle = '#9e4e3e';
      ctx.fillRect(13, 25, 6, 2);

      const tex = new THREE.CanvasTexture(c);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      return tex;
    }

    function createPlaidTexture() {
      if (typeof document === 'undefined') return null;
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      const ctx = c.getContext('2d');
      // Brown shirt base
      ctx.fillStyle = '#5c2e24';
      ctx.fillRect(0, 0, 32, 32);

      // Dark brown grid
      ctx.fillStyle = '#3a1c15';
      ctx.fillRect(6, 0, 4, 32);
      ctx.fillRect(22, 0, 4, 32);
      ctx.fillRect(0, 6, 32, 4);
      ctx.fillRect(0, 22, 32, 4);

      // Warm tan grid lines
      ctx.fillStyle = '#825239';
      ctx.fillRect(14, 0, 2, 32);
      ctx.fillRect(30, 0, 2, 32);
      ctx.fillRect(0, 14, 32, 2);
      ctx.fillRect(0, 30, 32, 2);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      return tex;
    }

    function createJeansTexture() {
      if (typeof document === 'undefined') return null;
      const c = document.createElement('canvas');
      c.width = 32; c.height = 32;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#9eb8dc';
      ctx.fillRect(0, 0, 32, 32);

      // Denim weave
      ctx.fillStyle = '#88a4cb';
      for (let x = 0; x < 32; x += 4) {
        for (let y = 0; y < 32; y += 4) {
          if ((x + y) % 8 === 0) ctx.fillRect(x, y, 2, 2);
        }
      }
      // Seam line
      ctx.fillStyle = '#6f8ab2';
      ctx.fillRect(15, 0, 2, 32);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      return tex;
    }

    const faceTex = createFaceTexture();
    const plaidTex = createPlaidTexture();
    const jeansTex = createJeansTexture();

    // Materials from build_voxel_character.py
    const MAT_SKIN = new THREE.MeshStandardMaterial({ color: 0xf0b887, roughness: 0.65, metalness: 0.05 });
    const MAT_HAIR = new THREE.MeshStandardMaterial({ color: 0x2e1a12, roughness: 0.85, metalness: 0.05 });
    const MAT_SHIRT = new THREE.MeshStandardMaterial({
      color: 0x5c2e24,
      map: plaidTex || null,
      roughness: 0.70,
      metalness: 0.05
    });
    const MAT_PANTS = new THREE.MeshStandardMaterial({
      color: 0x9eb8dc,
      map: jeansTex || null,
      roughness: 0.75,
      metalness: 0.05
    });
    const MAT_SHOE_D = new THREE.MeshStandardMaterial({ color: 0x33476b, roughness: 0.60, metalness: 0.10 });
    const MAT_SHOE_L = new THREE.MeshStandardMaterial({ color: 0xe6e6e0, roughness: 0.50, metalness: 0.10 });
    const MAT_GLASSES = new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: 0.20, metalness: 0.85 });
    const MAT_WATCH = new THREE.MeshStandardMaterial({ color: 0x8c8f94, roughness: 0.25, metalness: 0.90 });
    const MAT_BRACE_R = new THREE.MeshStandardMaterial({ color: 0xbf1a1a, roughness: 0.50, metalness: 0.15 });
    const MAT_BRACE_B = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.50, metalness: 0.20 });

    const MAT_HEAD_FACE = faceTex ? [
      MAT_SKIN, // +X
      MAT_SKIN, // -X
      MAT_HAIR, // +Y
      MAT_SKIN, // -Y
      new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.65 }), // +Z Face!
      MAT_HAIR  // -Z Back of head
    ] : MAT_SKIN;

    function makeBlock(w, h, d, mat, x, y, z) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    }

    // Hierarchical Bones Rig matching build_voxel_character.py
    const charRoot = new THREE.Group();
    charRoot.name = 'root';
    charRoot.position.set(0, -0.05, 0); // centered vertical pivot

    // Hips block
    const hipsMesh = makeBlock(0.42, 0.20, 0.26, MAT_PANTS, 0, 0.03, 0);
    hipsMesh.name = 'hips';
    charRoot.add(hipsMesh);

    // Chest / Torso Joint (at 1.30 -> relative to root 0.95: +0.35)
    const chestJoint = new THREE.Group();
    chestJoint.name = 'chest';
    chestJoint.position.set(0, 0.35, 0);
    charRoot.add(chestJoint);

    const chestMesh = makeBlock(0.46, 0.42, 0.28, MAT_SHIRT, 0, 0, 0);
    chestMesh.name = 'chestMesh';
    chestJoint.add(chestMesh);

    // Sunglasses on collar
    const glassesMesh = makeBlock(0.20, 0.10, 0.05, MAT_GLASSES, 0, 0.08, 0.155);
    glassesMesh.name = 'glasses';
    chestJoint.add(glassesMesh);

    // Head Joint (at 1.53 -> relative to chest 1.30: +0.23)
    const headJoint = new THREE.Group();
    headJoint.name = 'head';
    headJoint.position.set(0, 0.23, 0);
    chestJoint.add(headJoint);

    const neckMesh = makeBlock(0.16, 0.08, 0.16, MAT_SKIN, 0, 0, 0);
    neckMesh.name = 'neck';
    headJoint.add(neckMesh);

    const headMesh = makeBlock(0.34, 0.32, 0.32, MAT_HEAD_FACE, 0, 0.20, 0);
    headMesh.name = 'headMesh';
    headJoint.add(headMesh);

    const hairTopMesh = makeBlock(0.36, 0.16, 0.34, MAT_HAIR, 0, 0.40, 0.01);
    hairTopMesh.name = 'hairTop';
    headJoint.add(hairTopMesh);

    const hairBackMesh = makeBlock(0.34, 0.30, 0.10, MAT_HAIR, 0, 0.25, -0.12);
    hairBackMesh.name = 'hairBack';
    headJoint.add(hairBackMesh);

    const beardMesh = makeBlock(0.30, 0.14, 0.10, MAT_HAIR, 0, 0.09, 0.13);
    beardMesh.name = 'beard';
    headJoint.add(beardMesh);

    // Left Arm (Shoulder at -0.32, 1.51 -> relative to chest: -0.32, +0.21, 0)
    const upperArmL = new THREE.Group();
    upperArmL.name = 'upperArmL';
    upperArmL.position.set(-0.32, 0.21, 0);
    chestJoint.add(upperArmL);

    const upperArmLMesh = makeBlock(0.16, 0.38, 0.16, MAT_SHIRT, 0, -0.19, 0);
    upperArmLMesh.name = 'upperArmLMesh';
    upperArmL.add(upperArmLMesh);

    // Left Forearm / Elbow Joint (-0.38 relative to shoulder)
    const forearmL = new THREE.Group();
    forearmL.name = 'forearmL';
    forearmL.position.set(0, -0.38, 0);
    upperArmL.add(forearmL);

    const forearmLMesh = makeBlock(0.15, 0.34, 0.15, MAT_SKIN, 0, -0.15, 0);
    forearmLMesh.name = 'forearmLMesh';
    forearmL.add(forearmLMesh);

    const handLMesh = makeBlock(0.15, 0.14, 0.10, MAT_SKIN, 0, -0.35, 0);
    handLMesh.name = 'handLMesh';
    forearmL.add(handLMesh);

    const braceRedMesh = makeBlock(0.165, 0.03, 0.165, MAT_BRACE_R, 0, -0.30, 0);
    braceRedMesh.name = 'braceRed';
    forearmL.add(braceRedMesh);

    const braceBlkMesh = makeBlock(0.165, 0.03, 0.165, MAT_BRACE_B, 0, -0.34, 0);
    braceBlkMesh.name = 'braceBlk';
    forearmL.add(braceBlkMesh);

    // Right Arm (Shoulder at 0.32, 1.51 -> relative to chest: +0.32, +0.21, 0)
    const upperArmR = new THREE.Group();
    upperArmR.name = 'upperArmR';
    upperArmR.position.set(0.32, 0.21, 0);
    chestJoint.add(upperArmR);

    const upperArmRMesh = makeBlock(0.16, 0.38, 0.16, MAT_SHIRT, 0, -0.19, 0);
    upperArmRMesh.name = 'upperArmRMesh';
    upperArmR.add(upperArmRMesh);

    // Right Forearm / Elbow Joint (-0.38 relative to shoulder)
    const forearmR = new THREE.Group();
    forearmR.name = 'forearmR';
    forearmR.position.set(0, -0.38, 0);
    upperArmR.add(forearmR);

    const forearmRMesh = makeBlock(0.15, 0.34, 0.15, MAT_SKIN, 0, -0.15, 0);
    forearmRMesh.name = 'forearmRMesh';
    forearmR.add(forearmRMesh);

    const handRMesh = makeBlock(0.15, 0.14, 0.10, MAT_SKIN, 0, -0.35, 0);
    handRMesh.name = 'handRMesh';
    forearmR.add(handRMesh);

    const watchMesh = makeBlock(0.175, 0.06, 0.175, MAT_WATCH, 0, -0.31, 0);
    watchMesh.name = 'watch';
    forearmR.add(watchMesh);

    // Left Leg (Hip at -0.14, 0.95 -> relative to root: -0.14, 0, 0)
    const upperLegL = new THREE.Group();
    upperLegL.name = 'upperLegL';
    upperLegL.position.set(-0.14, 0, 0);
    charRoot.add(upperLegL);

    const upperLegLMesh = makeBlock(0.24, 0.40, 0.24, MAT_PANTS, 0, -0.20, 0);
    upperLegLMesh.name = 'upperLegLMesh';
    upperLegL.add(upperLegLMesh);

    // Left Knee Joint (-0.40 from hip)
    const lowerLegL = new THREE.Group();
    lowerLegL.name = 'lowerLegL';
    lowerLegL.position.set(0, -0.40, 0);
    upperLegL.add(lowerLegL);

    const lowerLegLMesh = makeBlock(0.22, 0.45, 0.22, MAT_PANTS, 0, -0.225, 0);
    lowerLegLMesh.name = 'lowerLegLMesh';
    lowerLegL.add(lowerLegLMesh);

    const footLMesh = makeBlock(0.24, 0.12, 0.34, MAT_SHOE_D, 0, -0.49, 0.05);
    footLMesh.name = 'footLMesh';
    lowerLegL.add(footLMesh);

    const soleLMesh = makeBlock(0.24, 0.04, 0.34, MAT_SHOE_L, 0, -0.55, 0.05);
    soleLMesh.name = 'soleLMesh';
    lowerLegL.add(soleLMesh);

    // Right Leg (Hip at 0.14, 0.95 -> relative to root: +0.14, 0, 0)
    const upperLegR = new THREE.Group();
    upperLegR.name = 'upperLegR';
    upperLegR.position.set(0.14, 0, 0);
    charRoot.add(upperLegR);

    const upperLegRMesh = makeBlock(0.24, 0.40, 0.24, MAT_PANTS, 0, -0.20, 0);
    upperLegRMesh.name = 'upperLegRMesh';
    upperLegR.add(upperLegRMesh);

    // Right Knee Joint (-0.40 from hip)
    const lowerLegR = new THREE.Group();
    lowerLegR.name = 'lowerLegR';
    lowerLegR.position.set(0, -0.40, 0);
    upperLegR.add(lowerLegR);

    const lowerLegRMesh = makeBlock(0.22, 0.45, 0.22, MAT_PANTS, 0, -0.225, 0);
    lowerLegRMesh.name = 'lowerLegRMesh';
    lowerLegR.add(lowerLegRMesh);

    const footRMesh = makeBlock(0.24, 0.12, 0.34, MAT_SHOE_D, 0, -0.49, 0.05);
    footRMesh.name = 'footRMesh';
    lowerLegR.add(footRMesh);

    const soleRMesh = makeBlock(0.24, 0.04, 0.34, MAT_SHOE_L, 0, -0.55, 0.05);
    soleRMesh.name = 'soleRMesh';
    lowerLegR.add(soleRMesh);

    // Register nodes
    characterNodes.root = charRoot;
    characterNodes.torso = chestJoint;
    characterNodes.chest = chestJoint;
    characterNodes.head = headJoint;
    characterNodes.upperArmL = upperArmL;
    characterNodes.forearmL = forearmL;
    characterNodes.leftArm = upperArmL;
    characterNodes.upperArmR = upperArmR;
    characterNodes.forearmR = forearmR;
    characterNodes.rightArm = upperArmR;
    characterNodes.upperLegL = upperLegL;
    characterNodes.lowerLegL = lowerLegL;
    characterNodes.leftLeg = upperLegL;
    characterNodes.upperLegR = upperLegR;
    characterNodes.lowerLegR = lowerLegR;
    characterNodes.rightLeg = upperLegR;

    const voxelModelGroup = new THREE.Group();
    voxelModelGroup.name = 'voxelCharacter';
    voxelModelGroup.add(charRoot);

    const targetScale = 1.65 / 2.03;
    voxelModelGroup.scale.set(targetScale, targetScale, targetScale);

    return voxelModelGroup;
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
      antialias: !isMobile, // Disable heavy MSAA on mobile for buttery smooth 60fps
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp'
    });
    threeRenderer.setSize(width, height);
    // Clamp DPR to 1.0 on mobile to prevent 3x overdraw lag; 1.5 max on desktop
    threeRenderer.setPixelRatio(isMobile ? 1.0 : Math.min(window.devicePixelRatio, 1.5));
    if (!isMobile) {
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      threeRenderer.toneMappingExposure = 1.15;
    }

    // 4. Fixed Eye-Level Camera & Zero-Zoom Fitting (Camera distance is locked, NO zoom in/out)
    fitCameraToModel = function() {
      if (!threeCamera) return;
      const aspect = threeCamera.aspect || (width / height) || 1.0;
      const fovRad = (threeCamera.fov * Math.PI) / 360;

      // Target model height is 1.65 units, comfortably centered at (0, 0, 0)
      const targetHeight = 1.65;
      const fitFraction = 0.74;
      const distY = (targetHeight / 2) / (Math.tan(fovRad) * fitFraction);

      const targetWidth = 0.85;
      const distX = (targetWidth / 2) / (Math.tan(fovRad) * Math.max(aspect, 0.35) * 0.78);

      optimalCamDist = Math.max(distY, distX, 2.85);

      threeCamera.position.set(0, 0.0, optimalCamDist);
      threeCamera.lookAt(0, 0, 0);
    };
    fitCameraToModel();

    // 5. Lighting (Matching Cherry Grove biome)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    threeScene.add(ambientLight);

    // Sun directional light (warm golden daylight from top right)
    const sunLight = new THREE.DirectionalLight(0xfff6ea, 1.4);
    sunLight.position.set(4, 6, 4);
    threeScene.add(sunLight);

    // Front soft fill light
    const frontFillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    frontFillLight.position.set(0, 2, 4);
    threeScene.add(frontFillLight);

    // Neon cyan rim light (gaming accent from left)
    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    cyanRimLight.position.set(-4, 2, -2);
    threeScene.add(cyanRimLight);

    // Day / Night Lighting sync hook
    window.update3DLighting = function(isNightMode) {
      if (isNightMode) {
        ambientLight.color.setHex(0x334466);
        ambientLight.intensity = 0.6;
        sunLight.color.setHex(0x5588cc);
        sunLight.intensity = 0.7;
        cyanRimLight.intensity = 2.2;
        frontFillLight.intensity = 0.5;
      } else {
        ambientLight.color.setHex(0xffffff);
        ambientLight.intensity = 0.9;
        sunLight.color.setHex(0xfff6ea);
        sunLight.intensity = 1.4;
        cyanRimLight.intensity = 1.2;
        frontFillLight.intensity = 0.8;
      }
    };

    // 6. Build and Mount Voxel Character Rig (build_voxel_character.py specification)
    modelMeshGroup = buildVoxelCharacter();
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
      updateGamerProgress(100, 'CHERRY GROVE VOXEL RIG READY (100%)');
      setTimeout(finishGamerLoading, 250);
    }

    // Optional GLB Loader for external files or drag-and-drop
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();

      function setupModelScene(gltf) {
        modelMeshGroup = gltf.scene;

        // Preserve original textures and avoid expensive normal recomputations
        modelMeshGroup.traverse((child) => {
          if (child.isMesh) {
            if (!child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals();
            }
            child.frustumCulled = true;
            if (child.material) {
              child.material.side = isMobile ? THREE.FrontSide : THREE.DoubleSide;
              child.material.roughness = 0.6;
              child.material.metalness = 0.15;
              child.material.transparent = false;
              child.material.opacity = 1.0;
              child.material.needsUpdate = true;
              originalMeshMaterials.set(child.uuid, child.material);
            }
          }
        });

        // Cache articulated body parts with robust fallbacks
        characterNodes.head = modelMeshGroup.getObjectByName('head');
        characterNodes.upperArmL = modelMeshGroup.getObjectByName('upperArmL') || modelMeshGroup.getObjectByName('left_arm');
        characterNodes.forearmL = modelMeshGroup.getObjectByName('forearmL');
        characterNodes.leftArm = characterNodes.upperArmL;
        characterNodes.upperArmR = modelMeshGroup.getObjectByName('upperArmR') || modelMeshGroup.getObjectByName('right_arm');
        characterNodes.forearmR = modelMeshGroup.getObjectByName('forearmR');
        characterNodes.rightArm = characterNodes.upperArmR;
        characterNodes.chest = modelMeshGroup.getObjectByName('chest') || modelMeshGroup.getObjectByName('torso');
        characterNodes.torso = characterNodes.chest;
        characterNodes.upperLegL = modelMeshGroup.getObjectByName('upperLegL') || modelMeshGroup.getObjectByName('left_leg');
        characterNodes.lowerLegL = modelMeshGroup.getObjectByName('lowerLegL');
        characterNodes.leftLeg = characterNodes.upperLegL;
        characterNodes.upperLegR = modelMeshGroup.getObjectByName('upperLegR') || modelMeshGroup.getObjectByName('right_leg');
        characterNodes.lowerLegR = modelMeshGroup.getObjectByName('lowerLegR');
        characterNodes.rightLeg = characterNodes.upperLegR;
        characterNodes.root = modelMeshGroup.getObjectByName('root') || modelMeshGroup;

        // Center and normalize model mesh
        const bbox = new THREE.Box3().setFromObject(modelMeshGroup);
        const center = bbox.getCenter(new THREE.Vector3());
        const size = bbox.getSize(new THREE.Vector3());

        // Re-center model geometry so pivot is at geometric origin (0, 0, 0)
        modelMeshGroup.position.set(-center.x, -center.y, -center.z);

        // Scale model so height is standardized to 1.65 units
        const baseHeight = size.y || 1.0;
        const targetScale = 1.65 / baseHeight;
        modelMeshGroup.scale.set(targetScale, targetScale, targetScale);

        // Container group for rotation & mouse sway
        if (modelPivot) {
          threeScene.remove(modelPivot);
        }
        modelPivot = new THREE.Group();
        modelPivot.add(modelMeshGroup);
        threeScene.add(modelPivot);

        // Perfectly frame model in viewport
        fitCameraToModel();

        // Render immediate initial frame
        threeRenderer.render(threeScene, threeCamera);

        // Dismiss loading screen and spinner
        if (modelLoading) {
          modelLoading.classList.add('loaded');
        }
        finishGamerLoading();
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

      // Candidate paths to check in order (prioritize articulated character model)
      const candidatePaths = [
        'assets/character_articulated.glb',
        'assets/character.glb',
        'colored 3d.glb',
        'assets/colored 3d.glb',
        'assets/3d_model.glb'
      ];

      function tryLoadCandidate(idx) {
        if (idx >= candidatePaths.length) {
          finishGamerLoading();
          if (modelLoading) {
            modelLoading.innerHTML = `
              <span>Load "colored 3d.glb"</span>
              <label class="mc-btn btn-sm" style="margin-top:6px; cursor:pointer;">
                <span class="mc-btn-inner">Select 3D File</span>
                <input type="file" id="local-model-input" accept=".glb,.gltf" style="display:none;">
              </label>
            `;
            const input = document.getElementById('local-model-input');
            if (input) {
              input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) loadModelFromFile(file);
              });
            }
          }
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
          (error) => {
            console.warn(`Could not load model from ${path}, trying next fallback...`, error);
            tryLoadCandidate(idx + 1);
          }
        );
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

      // Check if embedded model data is present (100% offline & local file:/// support without CORS)
      if (typeof window.MODEL_DATA_BASE64 === 'string' && window.MODEL_DATA_BASE64.length > 1000) {
        if (modelLoading) {
          const span = modelLoading.querySelector('span');
          if (span) span.textContent = 'Rendering Colored 3D Mesh...';
        }
        try {
          const bin = window.atob(window.MODEL_DATA_BASE64);
          const len = bin.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          loader.parse(
            bytes.buffer,
            '',
            (gltf) => {
              setupModelScene(gltf);
            },
            (err) => {
              console.warn('Could not parse embedded model data, falling back to candidate files:', err);
              tryLoadCandidate(0);
            }
          );
          return;
        } catch (err) {
          console.warn('Embedded model decoding error:', err);
          tryLoadCandidate(0);
          return;
        }
      }

      tryLoadCandidate(0);
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

    // Keyboard turning: ArrowLeft, ArrowRight, A, D
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dragRotation -= 0.12;
        currentVelocityY = -0.05;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dragRotation += 0.12;
        currentVelocityY = 0.05;
      }
    });

    // 8. Animation Render Loop (Procedural Emotes + Cursor/Drag Turntable, Zero Zoom)
    let lastRenderTime = 0;
    const mobileFrameInterval = isMobile ? (1000 / 38) : 0;

    function applyArticulatedEmote(key, p) {
      const cn = characterNodes;
      const upperArmR = cn.upperArmR || cn.rightArm;
      const forearmR = cn.forearmR;
      const upperArmL = cn.upperArmL || cn.leftArm;
      const forearmL = cn.forearmL;
      const upperLegR = cn.upperLegR || cn.rightLeg;
      const lowerLegR = cn.lowerLegR;
      const upperLegL = cn.upperLegL || cn.leftLeg;
      const lowerLegL = cn.lowerLegL;
      const chest = cn.chest || cn.torso;
      const head = cn.head;

      switch (key) {
        case 'wave': {
          // Wave from build_voxel_character.py Wave action:
          // Right arm raises high forward and outward (-140 deg), forearm waves back and forth at elbow
          const raise = Math.sin(p * Math.PI);
          if (upperArmR) {
            upperArmR.rotation.x = -1.95 * raise;
            upperArmR.rotation.z = 0.35 * raise;
            upperArmR.rotation.y = 0.20 * raise;
          }
          if (forearmR) {
            forearmR.rotation.x = -0.55 * raise;
            forearmR.rotation.z = Math.sin(p * Math.PI * 14) * 0.48 * raise;
          }
          if (head) {
            head.rotation.z = Math.sin(p * Math.PI * 6) * 0.16 * raise;
            head.rotation.y = 0.12 * raise;
          }
          if (upperArmL) {
            upperArmL.rotation.x = 0.12 * raise;
          }
          break;
        }

        case 'cheer': {
          // Victory Cheer: BOTH arms shoot straight up in the air in a triumphant V!
          const jumpProgress = Math.sin(p * Math.PI);
          const hopBeat = Math.sin(p * Math.PI * 6);
          if (upperArmL) {
            upperArmL.rotation.z = -2.35 * jumpProgress;
            upperArmL.rotation.x = -0.45 * jumpProgress;
          }
          if (forearmL) {
            forearmL.rotation.z = -0.30 * jumpProgress;
            forearmL.rotation.x = -0.20 * jumpProgress;
          }
          if (upperArmR) {
            upperArmR.rotation.z = 2.35 * jumpProgress;
            upperArmR.rotation.x = -0.45 * jumpProgress;
          }
          if (forearmR) {
            forearmR.rotation.z = 0.30 * jumpProgress;
            forearmR.rotation.x = -0.20 * jumpProgress;
          }
          if (head) {
            head.rotation.x = -0.45 * jumpProgress; // look up in celebration!
          }
          if (upperLegL && lowerLegL && upperLegR && lowerLegR) {
            const legBend = Math.max(0, -hopBeat) * 0.35 * jumpProgress;
            upperLegL.rotation.x = -legBend;
            lowerLegL.rotation.x = legBend * 1.5;
            upperLegR.rotation.x = -legBend;
            lowerLegR.rotation.x = legBend * 1.5;
          }
          break;
        }

        case 'bow': {
          // Hero's Bow: Torso bends forward at waist (42 degrees), head bows respectfully, arms fold back
          const bowProgress = Math.sin(p * Math.PI);
          if (chest) {
            chest.rotation.x = 0.72 * bowProgress;
          }
          if (head) {
            head.rotation.x = 0.38 * bowProgress;
          }
          if (upperArmL && upperArmR) {
            upperArmL.rotation.x = 0.45 * bowProgress;
            upperArmR.rotation.x = 0.45 * bowProgress;
          }
          if (forearmL && forearmR) {
            forearmL.rotation.x = -0.20 * bowProgress;
            forearmR.rotation.x = -0.20 * bowProgress;
          }
          break;
        }

        case 'point': {
          // Adventure Point & Thumbs Up from build_voxel_character.py ThumbsUp action:
          // Right arm extends forward (-95 deg), forearm bends upright 90° with thumb up!
          const pointProgress = Math.sin(p * Math.PI);
          if (upperArmR) {
            upperArmR.rotation.x = -1.65 * pointProgress;
            upperArmR.rotation.y = 0.15 * pointProgress;
            upperArmR.rotation.z = 0.10 * pointProgress;
          }
          if (forearmR) {
            forearmR.rotation.x = -1.45 * pointProgress;
          }
          if (upperArmL) {
            upperArmL.rotation.x = 0.25 * pointProgress; // hand on hip
            upperArmL.rotation.z = -0.45 * pointProgress;
          }
          if (forearmL) {
            forearmL.rotation.x = -0.65 * pointProgress;
          }
          if (head) {
            head.rotation.y = -0.25 * pointProgress;
            head.rotation.x = 0.12 * pointProgress;
          }
          break;
        }

        case 'clap': {
          // Applause: Both arms swing forward and clap together rhythmically in front of the chest!
          const clapProgress = Math.sin(p * Math.PI);
          const clapBeat = Math.sin(p * Math.PI * 14);
          if (upperArmL) {
            upperArmL.rotation.x = -1.15 * clapProgress;
            upperArmL.rotation.z = -0.45 * clapProgress;
          }
          if (forearmL) {
            forearmL.rotation.x = -0.40 * clapProgress;
            forearmL.rotation.y = (0.55 + clapBeat * 0.28) * clapProgress;
          }
          if (upperArmR) {
            upperArmR.rotation.x = -1.15 * clapProgress;
            upperArmR.rotation.z = 0.45 * clapProgress;
          }
          if (forearmR) {
            forearmR.rotation.x = -0.40 * clapProgress;
            forearmR.rotation.y = (-0.55 - clapBeat * 0.28) * clapProgress;
          }
          if (head) {
            head.rotation.x = Math.abs(Math.sin(p * Math.PI * 7)) * 0.12 * clapProgress;
          }
          break;
        }

        case 'disco': {
          // Dance from build_voxel_character.py Dance action:
          // Alternating arm swing, chest twist, root twist, leg steps!
          const discoProgress = Math.sin(p * Math.PI);
          const beat = Math.sin(p * Math.PI * 6);
          const cosBeat = Math.cos(p * Math.PI * 6);
          if (upperArmL) {
            upperArmL.rotation.x = (-beat * 0.9) * discoProgress;
            upperArmL.rotation.z = (-0.5 - Math.abs(beat) * 0.45) * discoProgress;
          }
          if (forearmL) {
            forearmL.rotation.x = (-0.6 - Math.abs(beat) * 0.5) * discoProgress;
          }
          if (upperArmR) {
            upperArmR.rotation.x = (beat * 0.9) * discoProgress;
            upperArmR.rotation.z = (0.5 + Math.abs(cosBeat) * 0.45) * discoProgress;
          }
          if (forearmR) {
            forearmR.rotation.x = (-0.6 - Math.abs(cosBeat) * 0.5) * discoProgress;
          }
          if (chest) {
            chest.rotation.y = (beat * 0.32) * discoProgress;
          }
          if (head) {
            head.rotation.z = (beat * 0.18) * discoProgress;
            head.rotation.y = (-beat * 0.25) * discoProgress;
          }
          if (upperLegL && lowerLegL && upperLegR && lowerLegR) {
            upperLegL.rotation.x = (-beat * 0.4) * discoProgress;
            lowerLegL.rotation.x = (Math.max(0, beat) * 0.6) * discoProgress;
            upperLegR.rotation.x = (beat * 0.4) * discoProgress;
            lowerLegR.rotation.x = (Math.max(0, -beat) * 0.6) * discoProgress;
          }
          break;
        }

        case 'tornado': {
          // Tornado Spin: Arms spread wide like wings, body whirls in a 1080 cyclone
          const spinProgress = Math.sin(p * Math.PI);
          if (upperArmL) {
            upperArmL.rotation.z = -1.50 * spinProgress;
          }
          if (upperArmR) {
            upperArmR.rotation.z = 1.50 * spinProgress;
          }
          if (forearmL && forearmR) {
            forearmL.rotation.set(0, 0, 0);
            forearmR.rotation.set(0, 0, 0);
          }
          if (head) {
            head.rotation.y = Math.sin(p * Math.PI * 10) * 0.25;
          }
          break;
        }

        case 'flip': {
          // Jump & 360° Backflip from build_voxel_character.py Jump action:
          // Crouch with bent knees and arms back, launch, somersault tuck, landing cushion
          if (p < 0.2) {
            const t = p / 0.2;
            if (upperLegL && upperLegR) {
              upperLegL.rotation.x = -0.65 * t;
              upperLegR.rotation.x = -0.65 * t;
            }
            if (lowerLegL && lowerLegR) {
              lowerLegL.rotation.x = 1.10 * t; // knees bend backward!
              lowerLegR.rotation.x = 1.10 * t;
            }
            if (upperArmL && upperArmR) {
              upperArmL.rotation.x = 0.75 * t; // arms swing back
              upperArmR.rotation.x = 0.75 * t;
            }
            if (chest) {
              chest.rotation.x = 0.25 * t;
            }
          } else if (p < 0.85) {
            if (upperLegL && upperLegR) {
              upperLegL.rotation.x = 0.85;
              upperLegR.rotation.x = 0.85;
            }
            if (lowerLegL && lowerLegR) {
              lowerLegL.rotation.x = -0.85;
              lowerLegR.rotation.x = -0.85;
            }
            if (upperArmL && upperArmR) {
              upperArmL.rotation.x = -1.50;
              upperArmR.rotation.x = -1.50;
            }
            if (forearmL && forearmR) {
              forearmL.rotation.x = -1.40;
              forearmR.rotation.x = -1.40;
            }
          } else {
            const t = (p - 0.85) / 0.15;
            if (upperLegL && upperLegR) {
              upperLegL.rotation.x = -0.25 * (1 - t);
              upperLegR.rotation.x = -0.25 * (1 - t);
            }
            if (lowerLegL && lowerLegR) {
              lowerLegL.rotation.x = 0.35 * (1 - t);
              lowerLegR.rotation.x = 0.35 * (1 - t);
            }
            if (upperArmL && upperArmR) {
              upperArmL.rotation.z = -0.45 * (1 - t);
              upperArmR.rotation.z = 0.45 * (1 - t);
            }
          }
          break;
        }
      }
    }

    function updateActiveEmote(now) {
      if (!activeEmote) {
        return {
          posX: 0, posY: 0, posZ: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          scaleX: 1, scaleY: 1, scaleZ: 1
        };
      }

      const elapsed = now - activeEmote.startTime;
      const p = Math.min(1.0, elapsed / activeEmote.duration);

      // Apply articulated transformations to limbs
      applyArticulatedEmote(activeEmote.key, p);

      let posX = 0, posY = 0, posZ = 0;
      let rotX = 0, rotY = 0, rotZ = 0;
      let scaleX = 1, scaleY = 1, scaleZ = 1;

      switch (activeEmote.key) {
        case 'flip': {
          if (p < 0.2) {
            const t = p / 0.2;
            posY = -0.16 * Math.sin(t * Math.PI * 0.5);
            scaleY = 1.0 - 0.18 * Math.sin(t * Math.PI * 0.5);
            scaleX = scaleZ = 1.0 + 0.08 * Math.sin(t * Math.PI * 0.5);
          } else if (p < 0.85) {
            const t = (p - 0.2) / 0.65;
            posY = Math.sin(t * Math.PI) * 0.95;
            rotX = -Math.PI * 2 * t;
            scaleY = 1.08;
            scaleX = scaleZ = 0.94;
          } else {
            const t = (p - 0.85) / 0.15;
            posY = -0.09 * (1 - t) * Math.sin(t * Math.PI);
            scaleY = 1.0 - 0.14 * Math.sin(t * Math.PI);
            scaleX = scaleZ = 1.0 + 0.06 * Math.sin(t * Math.PI);
          }
          break;
        }

        case 'wave': {
          rotZ = Math.sin(p * Math.PI * 6) * 0.08 * Math.sin(p * Math.PI);
          posY = Math.abs(Math.sin(p * Math.PI * 3)) * 0.10 * Math.sin(p * Math.PI);
          break;
        }

        case 'cheer': {
          posY = Math.abs(Math.sin(p * Math.PI * 5)) * 0.44 * Math.sin(p * Math.PI);
          rotZ = Math.sin(p * Math.PI * 8) * 0.08 * Math.sin(p * Math.PI);
          scaleY = 1.0 + (Math.sin(p * Math.PI * 5) * 0.10) * Math.sin(p * Math.PI);
          scaleX = scaleZ = 1.0 - (Math.sin(p * Math.PI * 5) * 0.05) * Math.sin(p * Math.PI);
          break;
        }

        case 'disco': {
          posX = Math.sin(p * Math.PI * 6) * 0.18 * Math.sin(p * Math.PI);
          posY = Math.abs(Math.cos(p * Math.PI * 6)) * 0.12 * Math.sin(p * Math.PI);
          rotZ = Math.sin(p * Math.PI * 6) * 0.12 * Math.sin(p * Math.PI);
          rotY = Math.sin(p * Math.PI * 3) * 0.25 * Math.sin(p * Math.PI);
          break;
        }

        case 'bow': {
          posY = -0.10 * Math.sin(p * Math.PI);
          posZ = -0.05 * Math.sin(p * Math.PI);
          break;
        }

        case 'point': {
          posZ = 0.20 * Math.sin(p * Math.PI);
          posY = 0.04 * Math.sin(p * Math.PI);
          break;
        }

        case 'tornado': {
          rotY = p * Math.PI * 6; // 3 full 360 degree whirlwind spins
          posY = Math.sin(p * Math.PI) * 0.35;
          scaleY = 1.0 + Math.sin(p * Math.PI) * 0.12;
          scaleX = scaleZ = 1.0 - Math.sin(p * Math.PI) * 0.06;
          break;
        }

        case 'clap': {
          const pulse = Math.sin(p * Math.PI * 14);
          scaleY = 1.0 + pulse * 0.04 * Math.sin(p * Math.PI);
          scaleX = scaleZ = 1.0 - pulse * 0.02 * Math.sin(p * Math.PI);
          posY = Math.abs(pulse) * 0.03 * Math.sin(p * Math.PI);
          break;
        }
      }

      if (p >= 1.0) {
        activeEmote = null;
      }

      return {
        posX, posY, posZ,
        rotX, rotY, rotZ,
        scaleX, scaleY, scaleZ
      };
    }

    function renderThree(timestamp = 0) {
      requestAnimationFrame(renderThree);
      if (isMobile && timestamp) {
        if (timestamp - lastRenderTime < mobileFrameInterval) return;
        lastRenderTime = timestamp;
      }
      try {
        if (modelPivot) {
          // Reset articulated joints to neutral pose
          if (characterNodes.chest) characterNodes.chest.rotation.set(0, 0, 0);
          if (characterNodes.torso) characterNodes.torso.rotation.set(0, 0, 0);
          if (characterNodes.head) characterNodes.head.rotation.set(0, 0, 0);
          if (characterNodes.upperArmL) characterNodes.upperArmL.rotation.set(0, 0, 0);
          if (characterNodes.forearmL) characterNodes.forearmL.rotation.set(0, 0, 0);
          if (characterNodes.leftArm) characterNodes.leftArm.rotation.set(0, 0, 0);
          if (characterNodes.upperArmR) characterNodes.upperArmR.rotation.set(0, 0, 0);
          if (characterNodes.forearmR) characterNodes.forearmR.rotation.set(0, 0, 0);
          if (characterNodes.rightArm) characterNodes.rightArm.rotation.set(0, 0, 0);
          if (characterNodes.upperLegL) characterNodes.upperLegL.rotation.set(0, 0, 0);
          if (characterNodes.lowerLegL) characterNodes.lowerLegL.rotation.set(0, 0, 0);
          if (characterNodes.leftLeg) characterNodes.leftLeg.rotation.set(0, 0, 0);
          if (characterNodes.upperLegR) characterNodes.upperLegR.rotation.set(0, 0, 0);
          if (characterNodes.lowerLegR) characterNodes.lowerLegR.rotation.set(0, 0, 0);
          if (characterNodes.rightLeg) characterNodes.rightLeg.rotation.set(0, 0, 0);

          if (!activeEmote) {
            // Subtle natural Minecraft idle breathing & arm sway from build_voxel_character.py Idle action
            const idleTime = timestamp * 0.0022;
            const chestNode = characterNodes.chest || characterNodes.torso;
            if (chestNode) {
              chestNode.rotation.x = Math.sin(idleTime) * 0.026;
            }
            if (characterNodes.head) {
              characterNodes.head.rotation.x = Math.sin(idleTime + 0.6) * 0.025;
              characterNodes.head.rotation.y = Math.sin(idleTime * 0.5) * 0.04;
            }
            const leftArmNode = characterNodes.upperArmL || characterNodes.leftArm;
            if (leftArmNode) {
              leftArmNode.rotation.x = Math.sin(idleTime) * 0.06;
            }
            const rightArmNode = characterNodes.upperArmR || characterNodes.rightArm;
            if (rightArmNode) {
              rightArmNode.rotation.x = -Math.sin(idleTime) * 0.06;
            }
          }

          const et = updateActiveEmote(timestamp);

          if (isDragging) {
            modelPivot.rotation.y = dragRotation;
          } else {
            // Apply inertia if recently dragged/flicked
            if (Math.abs(currentVelocityY) > 0.0002) {
              dragRotation += currentVelocityY;
              modelPivot.rotation.y = dragRotation;
              currentVelocityY *= 0.90;
            } else if (autoSpinEnabled && !activeEmote) {
              // Smooth continuous horizontal turntable spin (paused during emote)
              dragRotation += autoSpinSpeed;
              modelPivot.rotation.y = dragRotation;
            } else if (!activeEmote) {
              // Smoothly turn character left and right to face the cursor!
              const targetY = dragRotation + targetCursorAngle;
              modelPivot.rotation.y += (targetY - modelPivot.rotation.y) * 0.08;
            }
          }

          // Apply Emote procedural transforms
          modelPivot.position.set(et.posX, et.posY, et.posZ);
          modelPivot.rotation.x = et.rotX;
          modelPivot.rotation.y += et.rotY;
          modelPivot.rotation.z = et.rotZ;
          modelPivot.scale.set(et.scaleX, et.scaleY, et.scaleZ);
        }

        // Camera stays permanently locked at optimal distance (Zero Zoom)
        threeCamera.position.set(0, 0, optimalCamDist);
        threeCamera.lookAt(0, 0, 0);

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

