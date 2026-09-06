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

  let petalCount = 45;
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
  function animatePetals(time = 0) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update(time);
      petals[i].draw();
    }
    animFrameId = requestAnimationFrame(animatePetals);
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

  // Keyboard navigation 1-9
  window.addEventListener('keydown', (e) => {
    // If typing inside an input or dialog, ignore
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      selectSlot(num, true);
    }
  });

  // Slot Actions (Interactivity)
  function handleSlotAction(slotNum, el) {
    switch (slotNum) {
      case 1: // Grass Block
        showToast('Cherry Grove Spores', 'Assets and natural aesthetic energized!', 'assets/icons/grass-block.svg');
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

      case 2: // Player Head
        const card = document.getElementById('player-profile-card');
        if (card) {
          card.style.transform = 'scale(1.03) translateY(-4px)';
          setTimeout(() => {
            card.style.transform = 'scale(1) translateY(0)';
          }, 300);
        }
        showToast('Player Selected', 'Yash Vishwakarma - Web & Python Builder', 'assets/icons/player-head.svg');
        break;

      case 3: // Enchanted Book
        playXpChime();
        showToast('Advancement Made!', 'Enchanter: HTML, CSS, JS & Python', 'assets/icons/enchanted-book.svg');
        openJourneyModal('skills');
        break;

      case 4: // Chest
        playChestSound();
        openJourneyModal('quests');
        break;

      case 5: // Clock
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        showToast('Chrono Compass', `World Time: ${timeString} (Dewas, MP)`, 'assets/icons/clock.svg');
        break;

      case 6: // Nether Star
        playLevelUpSound();
        showToast('Advancement Made!', 'Credentials & Badges Unlocked!', 'assets/icons/nether-star.svg');
        openJourneyModal('certificates');
        break;

      case 7: // Emerald
        playClickSound(1.2);
        showToast('Hire Yash', 'Accepting IT, Web & Python Development Roles', 'assets/icons/emerald.svg');
        break;

      case 8: // Book & Quill
        playClickSound(0.9);
        openJourneyModal('teleport');
        break;

      case 9: // Ender Pearl
        playPopSound(9);
        showToast('Quantum Ender Pearl', 'Teleporting to Waypoints & Connections...', 'assets/icons/ender-pearl.svg');
        openJourneyModal('teleport');
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

  function showToast(subtitle, title, iconSrc) {
    if (!toast) return;
    clearTimeout(toastTimer);

    toastSubtitle.textContent = subtitle;
    toastTitle.textContent = title;
    if (iconSrc) toastIcon.src = iconSrc;

    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3600);
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
  let threeScene, threeCamera, threeRenderer, threeControls;
  let modelMeshGroup = null;
  let modelPivot = null;
  let fitCameraToModel = () => {};
  let currentModelMaterial = 'colored'; // Default to the colorful PBR model!
  let is3DModeActive = true;
  const originalMeshMaterials = new Map();

  const threeCanvas = document.getElementById('three-canvas');
  const modelLoading = document.getElementById('model-loading');
  const btnToggle3D = document.getElementById('btn-toggle-3d');
  const btnMatColored = document.getElementById('btn-mat-colored');
  const btnMatTitanium = document.getElementById('btn-mat-titanium');
  const btnMatCyan = document.getElementById('btn-mat-cyan');
  const btnMatGold = document.getElementById('btn-mat-gold');
  const btnToggleRotate = document.getElementById('btn-toggle-rotate');
  const btnResetCam = document.getElementById('btn-reset-cam');

  // Alternative materials palette
  const materials = {
    titanium: new THREE.MeshStandardMaterial({
      color: 0x22262e,
      roughness: 0.38,
      metalness: 0.35,
      flatShading: false
    }),
    cyan: new THREE.MeshStandardMaterial({
      color: 0x072a33,
      roughness: 0.22,
      metalness: 0.65,
      emissive: 0x00333d,
      emissiveIntensity: 0.4,
      flatShading: false
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0x3d2b07,
      roughness: 0.25,
      metalness: 0.78,
      emissive: 0x2b1c00,
      emissiveIntensity: 0.3,
      flatShading: false
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

    // 3. Renderer with transparent background
    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    threeRenderer.toneMappingExposure = 1.15;

    // 4. OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      threeControls = new THREE.OrbitControls(threeCamera, threeCanvas);
      threeControls.enableDamping = true;
      threeControls.dampingFactor = 0.05;
      threeControls.autoRotate = true;
      threeControls.autoRotateSpeed = 1.2;
      threeControls.minDistance = 1.4;
      threeControls.maxDistance = 5.2;
      threeControls.minPolarAngle = Math.PI * 0.12;
      threeControls.maxPolarAngle = Math.PI * 0.88;
      threeControls.target.set(0, 0, 0);
    }

    // Auto-Fit Camera Function to guarantee the character fits 100% on any screen
    fitCameraToModel = function() {
      if (!threeCamera || !threeControls) return;
      const aspect = threeCamera.aspect || (width / height) || 1.0;
      const fovRad = (threeCamera.fov * Math.PI) / 360;

      // Target model height is 1.65 units, comfortably centered at (0, 0, 0)
      // We want character to occupy ~74% of vertical canvas height
      const targetHeight = 1.65;
      const fitFraction = 0.74;
      const distY = (targetHeight / 2) / (Math.tan(fovRad) * fitFraction);

      // Also ensure width fits on narrow / portrait screens
      const targetWidth = 0.85;
      const distX = (targetWidth / 2) / (Math.tan(fovRad) * Math.max(aspect, 0.35) * 0.78);

      const optimalDist = Math.max(distY, distX, 2.85);

      threeCamera.position.set(0, 0.02, optimalDist);
      threeControls.target.set(0, 0, 0);
      threeControls.minDistance = Math.max(optimalDist * 0.45, 1.3);
      threeControls.maxDistance = optimalDist * 2.2;
      threeControls.update();
    };

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

        // Preserve original textures and compute smooth normals
        modelMeshGroup.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            if (child.material) {
              // Clone and configure original textured material
              const origMat = child.material.clone();
              origMat.roughness = 0.65;
              origMat.metalness = 0.15;
              if (origMat.map) origMat.map.flipY = false;
              originalMeshMaterials.set(child.uuid, origMat);
              child.material = origMat;
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

        // Hide loading spinner
        if (modelLoading) {
          modelLoading.classList.add('loaded');
        }

        showToast('Colored 3D Model Active', 'Yash’s textured 3D character is ready! Drag to orbit.', 'assets/icons/player-head.svg');
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

      tryLoadCandidate(0);
    }

    // 7. Mouse cursor subtle sway tracking
    let targetRotationY = 0;
    let targetRotationX = 0;

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      targetRotationY = normX * 0.35;
      targetRotationX = normY * 0.15;
    });

    // 8. Animation Render Loop
    function renderThree() {
      requestAnimationFrame(renderThree);

      if (threeControls) {
        threeControls.update();
      }

      // Smooth idle sway when not actively dragging
      if (modelPivot && (!threeControls || !threeControls.state || threeControls.state === -1)) {
        modelPivot.rotation.y += (targetRotationY - modelPivot.rotation.y) * 0.04;
        modelPivot.rotation.x += (targetRotationX - modelPivot.rotation.x) * 0.04;
      }

      threeRenderer.render(threeScene, threeCamera);
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

  // Set Material Helper
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
            if (orig) child.material = orig;
          } else {
            child.material = materials[matKey];
          }
        }
      });
    }
  }

  // Material Button Listeners
  if (btnMatColored) btnMatColored.addEventListener('click', () => setModelMaterial('colored'));
  if (btnMatTitanium) btnMatTitanium.addEventListener('click', () => setModelMaterial('titanium'));
  if (btnMatCyan) btnMatCyan.addEventListener('click', () => setModelMaterial('cyan'));
  if (btnMatGold) btnMatGold.addEventListener('click', () => setModelMaterial('gold'));

  // Auto-Spin Toggle
  if (btnToggleRotate) {
    btnToggleRotate.addEventListener('click', () => {
      playClickSound(1.0);
      if (threeControls) {
        threeControls.autoRotate = !threeControls.autoRotate;
        btnToggleRotate.classList.toggle('active', threeControls.autoRotate);
      }
    });
  }

  // Reset Camera View
  if (btnResetCam) {
    btnResetCam.addEventListener('click', () => {
      playClickSound(0.9);
      if (typeof fitCameraToModel === 'function') {
        fitCameraToModel();
      }
      if (modelPivot) {
        modelPivot.rotation.set(0, 0, 0);
      }
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

