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
        settingsDialog
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

  // Slot Actions (Full Video Game Navigation)
  function handleSlotAction(slotNum, el) {
    switch (slotNum) {
      case 1: // Grass Block (Overworld 3D View)
        closeAllGameDialogs();
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

  function closeAllGameDialogs() {
    [journeyDialog, lightboxDialog, settingsDialog, villagerTradeDialog, enchantmentDialog, chestDialog, bookDialog, pauseMenuDialog].forEach((d) => {
      if (d && d.open) {
        d.close();
      }
    });
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

      // Dispatch Requisition Mail
      const subject = encodeURIComponent(`[Quest Commission] ${currentSelectedTrade.name}`);
      const body = encodeURIComponent(
        `Greetings Yash,\n\nI just traded ${currentSelectedTrade.cost} Emeralds on your Minecraft portfolio to commission the following quest:\n\nService: ${currentSelectedTrade.name}\nScope: ${currentSelectedTrade.desc}\n\nClient Base: Ready to collaborate!\n\nBest regards.`
      );
      setTimeout(() => {
        window.location.href = `mailto:yashvishwakarma48@gmail.com?subject=${subject}&body=${body}`;
      }, 1200);
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
    btnBookSign.addEventListener('click', () => {
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

      playLevelUpSound();
      showToast('Dispatch Signed! 📜', `Sending message from ${name} to Yash...`, 'assets/icons/book-quill.svg');

      const subject = encodeURIComponent(`[Quest Dispatch: ${type}] from ${name}`);
      const body = encodeURIComponent(
        `Dear Yash,\n\nSender: ${name}\nContact: ${email}\nRequisition Type: ${type}\n\nMessage:\n${msg || 'I am interested in collaborating on a web/Python project.'}\n\n-- Dispatched via Minecraft Portfolio Book & Quill`
      );

      setTimeout(() => {
        window.location.href = `mailto:yashvishwakarma48@gmail.com?subject=${subject}&body=${body}`;
      }, 1000);
    });
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
  // 8. CHARACTER EASTER EGG & GREETING
  // =========================================================================
  const characterZone = document.getElementById('character-zone');
  const speechBubble = document.getElementById('char-speech-bubble');
  const greetings = [
    '"Hi! I’m Yash Vishwakarma — Web Developer, WordPress Designer & Python Coder!"',
    '"Check out my Kaggle & Google AI Agent certificates in the Journey Log!"',
    '"I craft responsive websites using HTML, CSS, JavaScript, Python & WordPress."',
    '"Tip: Press keys 1 through 9 to cycle my hotbar items!"',
    '"Drag me with your mouse in 3D or switch my armor materials above!"'
  ];
  let greetingIdx = 0;
  let bubbleTimeout = null;

  if (characterZone && speechBubble) {
    characterZone.addEventListener('click', () => {
      playPopSound(5);
      greetingIdx = (greetingIdx + 1) % greetings.length;
      speechBubble.querySelector('span').textContent = greetings[greetingIdx];
      speechBubble.classList.add('active');

      clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => {
        speechBubble.classList.remove('active');
      }, 4500);
    });
  }

  // Courier Pigeon / Contact button
  const btnOpenContact = document.getElementById('btn-open-contact');
  if (btnOpenContact) {
    btnOpenContact.addEventListener('click', () => {
      const email = 'yashvishwakarma48@gmail.com';
      window.location.href = `mailto:${email}?subject=Project%20Inquiry%20for%20Yash%20Vishwakarma`;
      showToast('Signal Dispatched', 'Opening mail client for Yash Vishwakarma...', 'assets/icons/book-quill.svg');
    });
  }

  // =========================================================================
  // 9. THREE.JS 3D PLAYER MODEL ENGINE (WebGL + GLTFLoader + OrbitControls)
  // =========================================================================
  let threeScene, threeCamera, threeRenderer;
  let modelMeshGroup = null;
  let modelPivot = null;
  let fitCameraToModel = () => {};
  let currentModelMaterial = 'colored'; // Default to the colorful PBR model!
  let is3DModeActive = true;
  const originalMeshMaterials = new Map();

  // Pointer & Cursor Movement State (Strictly Left & Right, Zero Zoom)
  let isDragging = false;
  let lastPointerX = 0;
  let currentVelocityY = 0;
  let dragRotation = 0;
  let targetCursorAngle = 0;
  let autoSpinEnabled = true;
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

    // 6. Load GLB Model (Supporting multiple paths & local file fallback)
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();

      function setupModelScene(gltf) {
        modelMeshGroup = gltf.scene;

        // Preserve original textures and avoid expensive normal recomputations
        modelMeshGroup.traverse((child) => {
          if (child.isMesh) {
            // Only compute normals if missing to save 724k vertex calculations
            if (!child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals();
            }
            child.frustumCulled = true;
            if (child.material) {
              // Enable GPU backface culling on mobile to cut fragment draw calls in half
              child.material.side = isMobile ? THREE.FrontSide : THREE.DoubleSide;
              child.material.roughness = 0.6;
              child.material.metalness = 0.15;
              child.material.transparent = false;
              child.material.opacity = 1.0;
              child.material.needsUpdate = true;
              if (child.material.map) {
                child.material.map.needsUpdate = true;
                if (child.material.map.image && typeof child.material.map.image.addEventListener === 'function') {
                  child.material.map.image.addEventListener('load', () => {
                    child.material.map.needsUpdate = true;
                    child.material.needsUpdate = true;
                  });
                }
              }
              originalMeshMaterials.set(child.uuid, child.material);
            }
          }
        });

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

        // Hide loading spinner
        if (modelLoading) {
          modelLoading.classList.add('loaded');
        }
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

      // Candidate paths to check in order
      const candidatePaths = [
        'assets/character.glb',
        'colored 3d.glb',
        'assets/colored 3d.glb',
        'assets/3d_model.glb'
      ];

      function tryLoadCandidate(idx) {
        if (idx >= candidatePaths.length) {
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
            if (xhr.lengthComputable && modelLoading) {
              const percent = Math.round((xhr.loaded / xhr.total) * 100);
              const span = modelLoading.querySelector('span');
              if (span) span.textContent = `Loading Colored 3D Mesh (${percent}%)...`;
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
    function onCanvasPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target !== threeCanvas) return;
      isDragging = true;
      lastPointerX = e.clientX;
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

    // 8. Animation Render Loop (Strictly moves horizontally from cursor/drag, Zero Zoom)
    let lastRenderTime = 0;
    const mobileFrameInterval = isMobile ? (1000 / 38) : 0;

    function renderThree(timestamp = 0) {
      requestAnimationFrame(renderThree);
      if (isMobile && timestamp) {
        if (timestamp - lastRenderTime < mobileFrameInterval) return;
        lastRenderTime = timestamp;
      }
      try {
        if (modelPivot) {
          // Strictly lock pitch and roll to 0
          modelPivot.rotation.x = 0;
          modelPivot.rotation.z = 0;

          if (isDragging) {
            modelPivot.rotation.y = dragRotation;
          } else {
            // Apply inertia if recently dragged/flicked
            if (Math.abs(currentVelocityY) > 0.0002) {
              dragRotation += currentVelocityY;
              modelPivot.rotation.y = dragRotation;
              currentVelocityY *= 0.90;
            } else if (autoSpinEnabled) {
              // Smooth continuous horizontal turntable spin
              dragRotation += autoSpinSpeed;
              modelPivot.rotation.y = dragRotation;
            } else {
              // Smoothly turn character left and right to face the cursor!
              const targetY = dragRotation + targetCursorAngle;
              modelPivot.rotation.y += (targetY - modelPivot.rotation.y) * 0.08;
            }
          }
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

