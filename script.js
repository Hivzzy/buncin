/**
 * ============================================================
 * PIXEL ART RPG BUCIN - SCRIPT ENGINE
 * Full Frontend Interactive Experience
 * ============================================================
 */

// Default Configuration (Bisa diubah juga via tombol gear ⚙️ di web)
const DEFAULT_CONFIG = {
  myWhatsAppNumber: "6285189968899", // Nomor WhatsApp kamu
  defaultHisName: "Sayang",          // Default nama cowok / pacar
  soundEnabled: true
};

// State Manager
const state = {
  config: { ...DEFAULT_CONFIG },
  herName: "",
  hisName: "",
  loveScore: 100,
  loveDescription: "Banyaaak banget!",
  rejectionCount: 0,
  currentStep: 0,
  isTyping: false,
  typingTimeout: null,
  audioCtx: null
};

// ============================================================
// 1. WEB AUDIO API SYNTHESIZER (Retro 8-Bit Chiptune Sounds)
// ============================================================

function initAudio() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

// Suara blip retro saat huruf diketik
function playTypeBlip() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440 + Math.random() * 120, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.04);
  } catch (e) {}
}

// Suara Meow / Cute Pip
function playCutePip() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'sine';
    const now = state.audioCtx.currentTime;
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {}
}

// Suara Sedih saat tombol "Tidak" ditekan
function playSadSound() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'sawtooth';
    const now = state.audioCtx.currentTime;
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {}
}

// Jingle Kemenangan / Bahagia 8-Bit
function playVictoryJingle() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      const startTime = state.audioCtx.currentTime + (idx * 0.09);
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  } catch (e) {}
}

// ============================================================
// 2. CANVAS PARTICLE SYSTEM (Floating Pixel Hearts & Roses)
// ============================================================

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const PARTICLE_TYPES = ['❤️', '💖', '🌹', '🌸', '✨', '🐾'];

class Particle {
  constructor(x, y, isBurst = false) {
    this.x = x !== undefined ? x : Math.random() * canvas.width;
    this.y = y !== undefined ? y : (isBurst ? canvas.height / 2 : -20);
    this.char = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
    this.size = Math.floor(Math.random() * 12) + 14;
    this.speedY = isBurst ? (Math.random() * 8 - 4) : (Math.random() * 1.5 + 0.8);
    this.speedX = isBurst ? (Math.random() * 8 - 4) : (Math.sin(Math.random() * 10) * 0.8);
    this.opacity = 1;
    this.fade = isBurst ? 0.015 : 0.003;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    this.opacity -= this.fade;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.font = `${this.size}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
  }
}

function spawnParticles() {
  if (particles.length < 35 && Math.random() < 0.25) {
    particles.push(new Particle());
  }
}

function burstLoveParticles(count = 40) {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(centerX, centerY, true));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnParticles();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].opacity <= 0 || particles[i].y > canvas.height + 30) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
// 3. KARAKTER RPG (MIMI THE LOVE CAT) & TYPEWRITER ENGINE
// ============================================================

const charBox = document.getElementById('characterSprite');
const charMoodLabel = document.getElementById('characterMood');
const typewriterEl = document.getElementById('typewriterText');
const cursorEl = document.getElementById('blinkingCursor');

function setCharacterMood(mood, textLabel) {
  charBox.className = 'character-box ' + mood;
  if (textLabel) {
    charMoodLabel.textContent = textLabel;
  }
}

function typeDialogue(text, onComplete) {
  if (state.typingTimeout) {
    clearTimeout(state.typingTimeout);
  }
  
  state.isTyping = true;
  typewriterEl.textContent = "";
  cursorEl.style.display = "none";
  setCharacterMood('talking', 'Mimi sedang bicara... 💬');

  let charIndex = 0;
  
  function typeChar() {
    if (charIndex < text.length) {
      typewriterEl.textContent += text[charIndex];
      // Hanya bunyikan blip sesekali agar nyaman didengar
      if (charIndex % 2 === 0) {
        playTypeBlip();
      }
      charIndex++;
      state.typingTimeout = setTimeout(typeChar, 35);
    } else {
      state.isTyping = false;
      cursorEl.style.display = "inline-block";
      // Kembalikan mood ke normal jika bukan sedang crying/happy
      if (charBox.classList.contains('talking')) {
        setCharacterMood('normal', 'Mimi The Love Cat 💕');
      }
      if (onComplete) onComplete();
    }
  }
  typeChar();
}

// Klik dialogue box untuk mempercepat teks
document.querySelector('.dialogue-content').addEventListener('click', () => {
  if (state.isTyping) {
    // Biarkan selesai otomatis lebih cepat
    clearTimeout(state.typingTimeout);
    state.typingTimeout = null;
    const currentStepConfig = STEPS[state.currentStep];
    if (currentStepConfig) {
      typewriterEl.textContent = currentStepConfig.getText();
      state.isTyping = false;
      cursorEl.style.display = "inline-block";
      if (charBox.classList.contains('talking')) {
        setCharacterMood('normal', 'Mimi The Love Cat 💕');
      }
    }
  }
});

// ============================================================
// 4. FLOW & QUEST DEFINITIONS
// ============================================================

const STEPS = [
  {
    stepId: 'step0',
    getText: () => "Halo bidadari manis! ✨ Mimi si Kucing Cinta diutus untuk membawakan sebuah Quest Cinta spesial. Siap memulai?",
    onEnter: () => {
      setCharacterMood('normal', 'Mimi The Love Cat 💕');
    }
  },
  {
    stepId: 'step1',
    getText: () => "Pertama-tama, boleh Mimi tahu siapa nama putri paling cantik yang sedang tersenyum ini? 🥰",
    onEnter: () => {
      setCharacterMood('normal', 'Menunggu namamu... ✨');
      setTimeout(() => document.getElementById('inputHerName').focus(), 400);
    }
  },
  {
    stepId: 'step2',
    getText: () => `Wah, nama "${state.herName}" indah banget secantik orangnya! 🌸 Nah, siapa nama pangeran / pacar kamu yang paling beruntung di dunia itu?`,
    onEnter: () => {
      setCharacterMood('normal', 'Siapakah dia? 🐱');
      const input = document.getElementById('inputHisName');
      if (!input.value && state.config.defaultHisName) {
        input.value = state.config.defaultHisName;
      }
      setTimeout(() => input.focus(), 400);
    }
  },
  {
    stepId: 'step3',
    getText: () => `Mimi mau tanya pertanyaan paling penting di alam semesta: Apakah kamu SANGAT mencintai ${state.hisName}?`,
    onEnter: () => {
      state.rejectionCount = 0;
      resetLoveButtons();
      setCharacterMood('normal', 'Pilihlah dengan jujur! 💖');
    }
  },
  {
    stepId: 'step4',
    getText: () => `HIHIHI Mimi udah tahu pasti jawabannya IYA BANGET! 😻 Sekarang buktikan seberapa besar rasa cinta kamu ke ${state.hisName}?`,
    onEnter: () => {
      setCharacterMood('happy', 'Mimi sangat bahagia! 😻🎉');
      updateSliderDesc(document.getElementById('loveSlider').value);
    }
  },
  {
    stepId: 'step5',
    getText: () => `HOREEE! 🎉 Semua quest cinta berhasil diselesaikan dengan skor sempurna! Tapi ada satu quest rahasia terakhir nih...`,
    onEnter: () => {
      setCharacterMood('happy', 'QUEST COMPLETED! 🏆✨');
      playVictoryJingle();
      burstLoveParticles(50);
      setupFinalStep();
    }
  }
];

function goToStep(stepIndex) {
  state.currentStep = stepIndex;

  // Sembunyikan semua step view
  document.querySelectorAll('.step-view').forEach(view => {
    view.classList.remove('active');
  });

  const stepObj = STEPS[stepIndex];
  if (!stepObj) return;

  const activeView = document.getElementById(stepObj.stepId);
  if (activeView) {
    activeView.classList.add('active');
  }

  // Type dialog & jalankan handler onEnter
  stepObj.onEnter();
  typeDialogue(stepObj.getText());
}

// ============================================================
// 5. INTERACTIVE BUTTON BEHAVIORS (IYA vs TIDAK & MEMBESAR)
// ============================================================

const btnYesLove = document.getElementById('btnYesLove');
const btnNoLove = document.getElementById('btnNoLove');
const rejectionFeedback = document.getElementById('rejectionFeedback');

const REJECTION_DIALOGUES = [
  "Ehh kok mau klik nggak?! Mimi kaget tau! 😿💔",
  "Hwaaa... jangan bohong dong! Mimi sedih nih! 😭",
  "Tombol IYA-nya udah makin raksasa tuh, klik yang itu aja! 👉👈",
  "Nggak bisa klik ini pokoknya! Mimi sita tombolnya! 😾",
  "Ayo ngaku aja, kamu pasti cinta banget kan? Jangan gengsi! 💖",
  "Tombol 'Tidak' sudah menyerah dan kabur! Klik IYA sekarang! 🏃💨"
];

function resetLoveButtons() {
  btnYesLove.style.transform = 'scale(1)';
  btnYesLove.style.fontSize = '10px';
  btnYesLove.style.padding = '12px 16px';
  btnNoLove.style.transform = 'scale(1)';
  btnNoLove.style.position = 'relative';
  btnNoLove.style.left = '0px';
  btnNoLove.style.top = '0px';
  btnNoLove.style.opacity = '1';
  btnNoLove.style.display = 'inline-block';
  rejectionFeedback.textContent = '';
}

function handleRejectionInteraction() {
  state.rejectionCount++;
  playSadSound();
  setCharacterMood('crying', 'Mimi nangis tersedu-sedu... 😿');

  // Skala perbesaran tombol Yes dan pengecilan tombol No
  const yesScale = 1 + (state.rejectionCount * 0.25);
  const noScale = Math.max(0.2, 1 - (state.rejectionCount * 0.18));

  btnYesLove.style.transform = `scale(${yesScale})`;
  btnNoLove.style.transform = `scale(${noScale})`;

  // Tampilkan feedback lucu
  const textIdx = Math.min(state.rejectionCount - 1, REJECTION_DIALOGUES.length - 1);
  rejectionFeedback.textContent = REJECTION_DIALOGUES[textIdx];

  // Efek getar pada karakter & layar
  if (navigator.vibrate) {
    try { navigator.vibrate(50); } catch (e) {}
  }

  // Jika sudah ditekan berkali-kali, tombol No kabur ke posisi acak
  if (state.rejectionCount >= 3) {
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 60;
    btnNoLove.style.position = 'relative';
    btnNoLove.style.left = `${randomX}px`;
    btnNoLove.style.top = `${randomY}px`;
  }

  // Jika sudah terlalu banyak, hilangkan tombol tidak sepenuhnya
  if (state.rejectionCount >= 6) {
    btnNoLove.style.display = 'none';
    rejectionFeedback.textContent = "Tombol 'Tidak' resmi menghilang! Sekarang hanya ada CINTA! 🥰";
  }
}

// Tombol Tidak merespon klik dan hover di desktop/HP
btnNoLove.addEventListener('click', (e) => {
  e.preventDefault();
  handleRejectionInteraction();
});

btnNoLove.addEventListener('mouseenter', () => {
  if (state.rejectionCount >= 2) {
    handleRejectionInteraction();
  }
});

// Tombol Iya ditekan
btnYesLove.addEventListener('click', () => {
  playCutePip();
  playVictoryJingle();
  burstLoveParticles(35);
  setCharacterMood('happy', 'Mimi sangat gembira! 😻✨');
  
  btnYesLove.style.transform = 'scale(1.15)';
  rejectionFeedback.textContent = "YAAAY! Mimi tahu kamu cinta bangeeet! 💕";

  setTimeout(() => {
    goToStep(4);
  }, 1000);
});

// ============================================================
// 6. LOVE METER / SLIDER
// ============================================================

const loveSlider = document.getElementById('loveSlider');
const meterValText = document.getElementById('meterValText');
const meterDescBadge = document.getElementById('meterDescBadge');
const btnMaxLove = document.getElementById('btnMaxLove');

function updateSliderDesc(val) {
  state.loveScore = parseInt(val, 10);
  playTypeBlip();

  if (state.loveScore < 300) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Banyaaak dan tulus! 💖";
    meterDescBadge.textContent = `"${state.loveDescription}"`;
  } else if (state.loveScore < 600) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Sebesar Galaksi Bima Sakti! 🌌✨";
    meterDescBadge.textContent = `"${state.loveDescription}"`;
  } else if (state.loveScore < 950) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Sampai ke Pluto & balik lagi! 🚀💕";
    meterDescBadge.textContent = `"${state.loveDescription}"`;
  } else {
    meterValText.textContent = `∞% (MAX!)`;
    state.loveDescription = "TAK TERHINGGA SAMPAI AKHIR WAKTU!! 💥❤️‍🔥";
    meterDescBadge.textContent = `"${state.loveDescription}"`;
  }
}

loveSlider.addEventListener('input', (e) => {
  updateSliderDesc(e.target.value);
});

btnMaxLove.addEventListener('click', () => {
  loveSlider.value = 1000;
  updateSliderDesc(1000);
  playVictoryJingle();
  burstLoveParticles(25);
});

// ============================================================
// 7. STEP TRANSITIONS & VALIDATION
// ============================================================

// Step 0 -> Step 1
document.getElementById('btnStartGame').addEventListener('click', () => {
  initAudio();
  playCutePip();
  burstLoveParticles(15);
  goToStep(1);
});

// Step 1 -> Step 2
document.getElementById('btnStep1Next').addEventListener('click', () => {
  initAudio();
  const input = document.getElementById('inputHerName');
  const val = input.value.trim();
  if (!val) {
    alert("Ketik nama kamu dulu yaa, bidadari cantik! 🌸");
    input.focus();
    return;
  }
  state.herName = val;
  playCutePip();
  goToStep(2);
});

// Izinkan enter key pada input Step 1
document.getElementById('inputHerName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('btnStep1Next').click();
  }
});

// Step 2 -> Step 3
document.getElementById('btnStep2Next').addEventListener('click', () => {
  initAudio();
  const input = document.getElementById('inputHisName');
  const val = input.value.trim();
  if (!val) {
    alert("Ketik nama pacar kamu dulu yaa! 💕");
    input.focus();
    return;
  }
  state.hisName = val;
  playCutePip();
  goToStep(3);
});

// Izinkan enter key pada input Step 2
document.getElementById('inputHisName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('btnStep2Next').click();
  }
});

// Step 4 -> Step 5
document.getElementById('btnStep4Next').addEventListener('click', () => {
  initAudio();
  playCutePip();
  goToStep(5);
});

// ============================================================
// 8. FINAL STEP & WHATSAPP REDIRECTION
// ============================================================

function setupFinalStep() {
  const summaryEl = document.getElementById('finalLoveSummary');
  summaryEl.innerHTML = `
    <strong>${state.herName}</strong> & <strong>${state.hisName}</strong><br/>
    Resmi dinobatkan sebagai pasangan paling bucin & serasi di semesta alam! 💖<br/>
    <span style="font-size: 16px; color: #ff1493;">Tingkat Cinta: ${state.loveDescription}</span>
  `;

  const questDesc = document.getElementById('papQuestDesc');
  questDesc.innerHTML = `
    Kirimkan Pap paling manis & lucu yang disukai <strong>${state.hisName}</strong> sekarang juga lewat WhatsApp! 💕📸
  `;
}

// Tombol Kirim Pap ke WhatsApp
document.getElementById('btnSendPap').addEventListener('click', () => {
  initAudio();
  playVictoryJingle();
  burstLoveParticles(40);

  let phone = state.config.myWhatsAppNumber.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  
  const textMessage = 
`Halo ${state.hisName} sayang! 🥰💖

Aku baru aja beresin game Quest Cinta bareng Mimi si Kucing Pixel! 🌸🐱

Hasil Jawabanku:
✨ Aku SANGAT mencintai kamu! 💖
✨ Skor Cinta: ${meterValText.textContent} (${state.loveDescription})

Sesuai quest terakhir yang disuruh Mimi, ini PAP spesial paling manis buat kamu... 📸💕👇`;

  const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(textMessage)}`;
  
  // Buka WhatsApp di tab baru
  window.open(waUrl, '_blank');
});

// Mainkan Lagi Dari Awal
document.getElementById('btnRestartGame').addEventListener('click', () => {
  goToStep(0);
});

// ============================================================
// 9. SETTINGS MODAL & LOCAL STORAGE CONFIG
// ============================================================

const configModal = document.getElementById('configModal');
const btnConfigToggle = document.getElementById('configToggle');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const cfgWaNumber = document.getElementById('cfgWaNumber');
const cfgDefaultBoy = document.getElementById('cfgDefaultBoy');

function loadSavedConfig() {
  const saved = localStorage.getItem('pixel_bucin_cfg');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.config = { ...state.config, ...parsed };
    } catch (e) {}
  }
  cfgWaNumber.value = state.config.myWhatsAppNumber;
  cfgDefaultBoy.value = state.config.defaultHisName;
}

btnConfigToggle.addEventListener('click', () => {
  initAudio();
  configModal.classList.add('open');
});

btnCloseModal.addEventListener('click', () => {
  configModal.classList.remove('open');
});

btnSaveConfig.addEventListener('click', () => {
  let phone = cfgWaNumber.value.trim().replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  const boy = cfgDefaultBoy.value.trim();
  if (phone) {
    state.config.myWhatsAppNumber = phone;
    cfgWaNumber.value = phone;
  }
  if (boy) state.config.defaultHisName = boy;

  localStorage.setItem('pixel_bucin_cfg', JSON.stringify({
    myWhatsAppNumber: state.config.myWhatsAppNumber,
    defaultHisName: state.config.defaultHisName
  }));

  playCutePip();
  alert("Pengaturan nomor WA & nama berhasil disimpan! 💾✨");
  configModal.classList.remove('open');
});

// Close modal when clicking outside box
configModal.addEventListener('click', (e) => {
  if (e.target === configModal) {
    configModal.classList.remove('open');
  }
});

// Sound Toggle Button
const soundToggleBtn = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

soundToggleBtn.addEventListener('click', () => {
  initAudio();
  state.config.soundEnabled = !state.config.soundEnabled;
  soundIcon.textContent = state.config.soundEnabled ? '🔊' : '🔇';
  if (state.config.soundEnabled) {
    playCutePip();
  }
});

// ============================================================
// INITIALIZATION
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  goToStep(0);
});
