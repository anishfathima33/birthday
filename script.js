/* ===== MEET ME AT MARINA AGAIN — script.js ===== */

// ——————— GLOBAL STATE & AUDIO ———————
const bgMusic = new Audio('assets/music/Yaarumilla.mp3');
bgMusic.loop = true;
bgMusic.volume = 0; 

function startBgMusic() {
  bgMusic.play().then(() => {
    let vol = 0;
    const fadeInterval = setInterval(() => {
      vol += 0.05;
      if (vol >= 0.4) {
        bgMusic.volume = 0.4;
        clearInterval(fadeInterval);
      } else {
        bgMusic.volume = vol;
      }
    }, 200);
  }).catch(err => console.warn("Audio play blocked by browser:", err));
}

// ——————— CORE INITIALIZATION ———————
function initApp() {
  console.log("Initializing Universe...");
  
  // 1. Core Gates
  safeInit('Password Gate', initPasswordGate);
  safeInit('Music Gate', initMusicGate);
  
  // 2. Visual Effects
  safeInit('Cursor Glow', initCursorGlow);
  safeInit('Particles/Stars', initParticles);
  safeInit('Fireworks', initFireworksCanvas);
  
  // 3. Interactions
  safeInit('Moon Easter Egg', initMoonEgg);
  safeInit('Open When Boxes', initOpenWhenBoxes);
  safeInit('Quiz Game', initQuiz);
  safeInit('Final Gift', initFinalGift);
  
  // 4. Scroll & Reveal
  safeInit('Scroll Observers', initScrollObservers);
  
  // 5. Global Helpers
  safeInit('Come Meet Me Button', () => {
    const meetBtn = document.getElementById('btn-come-meet');
    if (meetBtn) {
      meetBtn.addEventListener('click', () => {
        document.getElementById('section-intro')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });
}

// Resilient DOM Loader
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Universal Error Boundary for Components
function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`Failed to initialize [${name}]:`, err);
  }
}

// ——————— COMPONENT DEFINITIONS ———————

function revealUniverse() {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('hidden')) {
    preloader.classList.add('hidden');
  }
}

// Trigger preloader removal
window.addEventListener('load', revealUniverse);
setTimeout(revealUniverse, 3500); // Fail-safe reveal

function initPasswordGate() {
  const gate = document.getElementById('password-gate');
  const input = document.getElementById('gate-input');
  const btn = document.getElementById('gate-submit');
  const feedback = document.getElementById('gate-feedback');
  if (!gate || !input || !btn) return;
  
  const checkPassword = () => {
    const val = input.value.trim();
    if (val === '1327') {
      feedback.textContent = "YAYYY 😭💖 You remembered our password mamaaaa 💙🖤😘";
      feedback.className = "gate-feedback show success";
      spawnGateParticles(true);
      spawnConfetti();
      
      setTimeout(() => {
        gate.classList.add('hidden');
        const musicGate = document.getElementById('music-gate');
        if (musicGate) musicGate.classList.remove('hidden');
      }, 2500);
    } else {
      feedback.textContent = "Aii mental mama 😤💢 Intha password unna ku nalla therium 😭 Correct ah poduuu 💙🖤";
      feedback.className = "gate-feedback show error";
      spawnGateParticles(false);
      input.value = '';
      input.focus();
    }
  };

  btn.addEventListener('click', checkPassword);
  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });
}

function initMusicGate() {
  const musicGate = document.getElementById('music-gate');
  const enterBtn = document.getElementById('music-enter-btn');
  if (!musicGate || !enterBtn) return;
  
  enterBtn.addEventListener('click', () => {
    startBgMusic();
    musicGate.classList.add('hidden');
    
    setTimeout(() => {
      musicGate.classList.add('gate-finished');
      document.getElementById('preloader')?.classList.add('gate-finished');
      document.getElementById('password-gate')?.classList.add('gate-finished');
      document.body.style.overflowY = 'auto';
    }, 1500);

    if (window.runFireworks) window.runFireworks();
  });
}

function initCursorGlow() {
  const cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow) return;
  
  document.documentElement.classList.add('has-custom-cursor');
  
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => {
    cursorGlow.style.width = '35px';
    cursorGlow.style.height = '35px';
  });
  document.addEventListener('mouseup', () => {
    cursorGlow.style.width = '20px';
    cursorGlow.style.height = '20px';
  });
}

function initParticles() {
  const particlesCanvas = document.getElementById('particles-canvas');
  if (!particlesCanvas) return;
  const pCtx = particlesCanvas.getContext('2d');
  let stars = [];

  const resize = () => {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.01,
      msg: null
    });
  }
  const starMsgs = ["You are my moonlight 🌙", "Every star reminds me of you ✨", "Chennai nights miss you", "Distance means nothing when you mean everything", "My heart beats in your timezone", "You're my favorite notification 💌", "I smile because of you", "Love looks like us"];
  for (let i = 0; i < 8; i++) { if(stars[i*15]) stars[i*15].msg = starMsgs[i]; }

  function draw() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1 || s.a < 0.1) s.da *= -1;
      pCtx.beginPath();
      pCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(232,230,240,${s.a})`;
      pCtx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  particlesCanvas.addEventListener('click', e => {
    const rect = particlesCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const s of stars) {
      if (s.msg && Math.hypot(s.x - mx, s.y - my) < 20) {
        showStarMessage(s.msg, e.clientX, e.clientY);
        break;
      }
    }
  });
}

function showStarMessage(msg, x, y) {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', left: x + 'px', top: y + 'px',
    color: '#ff6b9d', fontSize: '.9rem', fontStyle: 'italic',
    pointerEvents: 'none', zIndex: '9999', transform: 'translate(-50%,-100%)',
    opacity: '1', transition: 'all 2s', whiteSpace: 'nowrap',
    textShadow: '0 0 10px rgba(255,107,157,.5)'
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '0';
    el.style.top = (y - 60) + 'px';
  });
  setTimeout(() => el.remove(), 2200);
}

function initMoonEgg() {
  const moon = document.getElementById('moon');
  const moonMsg = document.getElementById('moon-message');
  if (moon && moonMsg) {
    moon.addEventListener('click', () => {
      moonMsg.classList.toggle('show');
    });
  }
}

function initFireworksCanvas() {
  const fwCanvas = document.getElementById('fireworks-canvas');
  if (!fwCanvas) return;
  const fwCtx = fwCanvas.getContext('2d');
  let fireworks = [], fwParticles = [], fwRunning = false;

  const resize = () => {
    fwCanvas.width = fwCanvas.parentElement.offsetWidth;
    fwCanvas.height = fwCanvas.parentElement.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Firework {
    constructor(x, y) {
      this.x = x; this.y = fwCanvas.height;
      this.tx = x; this.ty = y;
      this.speed = 3 + Math.random() * 2;
      this.done = false;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 8) this.trail.shift();
      const dy = this.ty - this.y;
      this.y += dy * 0.05;
      if (Math.abs(dy) < 5) { this.done = true; this.explode(); }
    }
    explode() {
      const colors = ['#ff6b9d', '#f0c27f', '#4fc3f7', '#ff4081', '#e8e6f0', '#ffab40'];
      for (let i = 0; i < 40; i++) {
        const angle = (Math.PI * 2 / 40) * i;
        const speed = 2 + Math.random() * 3;
        fwParticles.push({
          x: this.x, y: this.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 60 + Math.random() * 30,
          color: colors[Math.floor(Math.random() * colors.length)],
          r: 2 + Math.random() * 2
        });
      }
    }
    draw() {
      for (let i = 0; i < this.trail.length; i++) {
        const a = i / this.trail.length;
        fwCtx.beginPath();
        fwCtx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
        fwCtx.fillStyle = `rgba(255,107,157,${a})`;
        fwCtx.fill();
      }
    }
  }

  window.runFireworks = function() {
    fwRunning = true;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        fireworks.push(new Firework(
          100 + Math.random() * (fwCanvas.width - 200),
          50 + Math.random() * (fwCanvas.height * 0.4)
        ));
      }, i * 500);
    }
    animate();
    setTimeout(() => { fwRunning = false; }, 8000);
  };

  function animate() {
    if (!fwRunning && fireworks.length === 0 && fwParticles.length === 0) return;
    fwCtx.fillStyle = 'rgba(10,10,15,0.15)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    fireworks = fireworks.filter(fw => {
      fw.update();
      fw.draw();
      return !fw.done;
    });

    fwParticles = fwParticles.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life--;
      const a = p.life / 90;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2);
      fwCtx.globalAlpha = a;
      fwCtx.fillStyle = p.color;
      fwCtx.fill();
      fwCtx.globalAlpha = 1;
      return p.life > 0;
    });

    if (fwRunning && Math.random() < 0.03) {
      fireworks.push(new Firework(100 + Math.random() * (fwCanvas.width - 200), 50 + Math.random() * (fwCanvas.height * 0.4)));
    }
    requestAnimationFrame(animate);
  }
}

function initOpenWhenBoxes() {
  const cards = document.querySelectorAll('.openwhen-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('show');
    });
  });
  
  document.querySelectorAll('.modal-close').forEach(close => {
    close.addEventListener('click', () => {
      close.closest('.modal-overlay')?.classList.remove('show');
    });
  });
  
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('show');
    }
  });
}

function initQuiz() {
    const quizData = [
      { 
        q: "Who gets angry first? 😤", 
        opts: ["You 🙄", "Me 😅", "Both at the same time 😂", "Nobody 😇"], 
        correct: 0,
        correctMsg: "Yes 💖 I get angry first… but you know me very well 😌❤️",
        wrongMsg: "No, you know me so well 😤💔"
      },
      { 
        q: "Who proposed first? 💕", 
        opts: ["You 🥺", "Me 💌", "Both ✨", "Nobody yet 🙈"], 
        correct: 1,
        correctMsg: "Yes 🥰 you remember our memories 💞 it was me who proposed first ❤️",
        wrongMsg: "No 😤 you forgot our beautiful moment 💔"
      },
      { 
        q: "What is our favorite food together? 🍽️", 
        opts: ["Fried Rice", "Noodles", "Pepper Chicken", "S.S. Biryani"], 
        correct: 3,
        correctMsg: "Yes 😍 we shared that beautiful day together 🍛✨ beach + biryani = perfect memory 💖🌊",
        wrongMsg: "No 😡 how can you forget our special food memory 💔"
      },
      { 
        q: "Who loves more? 🥺", 
        opts: ["You", "I", "Equal 💕", "Trick question 😏"], 
        correct: 2,
        correctMsg: "Yes ❤️ love is always equal 💞 you and me = perfect balance 🥰✨",
        wrongMsg: "Think again… real love is always equal ❤️🥺"
      }
    ];
    
    const qContainer = document.getElementById('quiz-container');
    if (!qContainer) return;
    
    qContainer.innerHTML = ''; 
    
    quizData.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'quiz-question';
      card.innerHTML = `
        <h4>${q.q}</h4>
        <div class="quiz-options"></div>
        <div class="quiz-msg"></div>
      `;
      
      const optsContainer = card.querySelector('.quiz-options');
      const msgEl = card.querySelector('.quiz-msg');
      
      q.opts.forEach((opt, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt;
        
        btn.addEventListener('click', function() {
          const allBtns = optsContainer.querySelectorAll('.quiz-opt');
          allBtns.forEach(b => b.style.pointerEvents = 'none');
          
          msgEl.classList.remove('correct', 'wrong');
          
          if (oIdx === q.correct) {
            this.classList.add('correct');
            msgEl.textContent = q.correctMsg;
            msgEl.classList.add('show', 'correct');
          } else {
            this.classList.add('wrong');
            allBtns[q.correct].classList.add('correct');
            msgEl.textContent = q.wrongMsg;
            msgEl.classList.add('show', 'wrong');
          }
          
          checkQuizCompletion();
        });
        optsContainer.appendChild(btn);
      });
      qContainer.appendChild(card);
    });
}

function checkQuizCompletion() {
    const totalQuestions = document.querySelectorAll('.quiz-question').length;
    const answeredQuestions = document.querySelectorAll('.quiz-msg.show').length;
    if (totalQuestions === answeredQuestions && totalQuestions > 0) {
        const result = document.getElementById('quiz-result');
        if (result) {
            result.style.opacity = '1';
            result.style.transform = 'translateY(0)';
            result.setAttribute('aria-hidden', 'false');
        }
    }
}

function initScrollObservers() {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (id === 'section-intro' && !window.introTyped) {
        window.introTyped = true;
        typeWriter(document.getElementById('typing-intro'), () => {
          document.getElementById('intro-question')?.classList.add('show');
        });
      }
      if (id === 'section-letter' && !window.letterTyped) {
        window.letterTyped = true;
        typeWriter(document.getElementById('typing-letter'), () => {
          document.getElementById('letter-signature')?.classList.add('show');
        });
        initScrapbookEffects();
      }
      if (id === 'section-20') spawnConfetti20();
      if (id === 'section-ending') { startFloatingHearts(); spawnSunsetClouds(); }
      if (id === 'section-prayers') initSpiritualParticles();
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = '1';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll, .polaroid-card, .timeline-item, .prayer-line, .future-card, .future-line, .goodbye-line, .twenty-texts p').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 1s ease, transform 1s ease';
    fadeObserver.observe(el);
  });
}

function typeWriter(container, callback) {
  if (!container) { if (callback) callback(); return; }
  const lines = container.querySelectorAll('.typed-line');
  let lineIdx = 0;

  function typeLine() {
    if (lineIdx >= lines.length) { if (callback) callback(); return; }
    const line = lines[lineIdx];
    const text = line.getAttribute('data-text') || line.textContent;
    let charIdx = 0;
    line.innerHTML = '<span class="cursor-blink">|</span>';

    function typeChar() {
      if (charIdx < text.length) {
        line.innerHTML = text.substring(0, charIdx + 1) + '<span class="cursor-blink">|</span>';
        charIdx++;
        setTimeout(typeChar, 40 + Math.random() * 30);
      } else {
        line.innerHTML = text;
        lineIdx++;
        setTimeout(typeLine, 600);
      }
    }
    typeChar();
  }
  typeLine();
}

function initScrapbookEffects() { initDustParticles(); initFairyLights(); initRosePetals(); }
function initDustParticles() {
  const c = document.getElementById('dust-container'); if (!c) return;
  for (let i = 0; i < 20; i++) {
    const d = document.createElement('div'); d.className = 'dust';
    d.style.left = Math.random()*100+'%'; d.style.top = Math.random()*100+'%';
    c.appendChild(d);
  }
}
function initFairyLights() {
  const c = document.getElementById('fairy-lights'); if (!c) return;
  for (let i = 0; i < 20; i++) {
    const l = document.createElement('div'); l.className = 'fairy-light';
    l.style.left = Math.random()*100+'%'; l.style.top = Math.random()*100+'%';
    c.appendChild(l);
  }
}
function initRosePetals() {
  const c = document.getElementById('section-letter'); if (!c) return;
  setInterval(() => {
    const p = document.createElement('div'); p.className = 'rose-petal';
    p.style.left = Math.random()*100+'%'; p.style.top = '-20px';
    c.appendChild(p); setTimeout(() => p.remove(), 10000);
  }, 2000);
}

function spawnConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#ff6b9d', '#f0c27f', '#4fc3f7', '#ff4081', '#e8e6f0'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (5 + Math.random() * 10) + 'px';
    piece.style.height = (5 + Math.random() * 10) + 'px';
    piece.style.animationDuration = (2 + Math.random() * 3) + 's';
    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 8000);
}

function spawnConfetti20() {
  const container = document.getElementById('confetti-20');
  if (!container) return;
  const colors = ['#ff6b9d', '#f0c27f', '#4fc3f7'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(piece);
  }
  setTimeout(() => container.innerHTML = '', 7000);
}

function startFloatingHearts() {
  const container = document.getElementById('floating-hearts');
  if (!container) return;
  setInterval(() => {
    const heart = document.createElement('span');
    heart.className = 'float-heart';
    heart.textContent = '❤️';
    heart.style.left = Math.random() * 100 + '%';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
  }, 500);
}

function spawnSunsetClouds() {
  const container = document.getElementById('clouds-container');
  if (!container) return;
  for (let i = 0; i < 5; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    c.style.left = Math.random() * 100 + '%';
    c.style.top = Math.random() * 100 + '%';
    container.appendChild(c);
  }
}

function spawnGateParticles(success) {
  const gate = document.getElementById('password-gate');
  if (!gate) return;
  const emojis = success ? ['❤️', '✨'] : ['😤', '💢'];
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'gate-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + '%';
    gate.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}

function initSpiritualParticles() {
  const container = document.getElementById('spiritual-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const s = document.createElement('div');
    s.className = 'spirit-star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    container.appendChild(s);
  }
}

function initFinalGift() {
  const finalGiftBtn = document.getElementById('btn-final-gift');
  if (finalGiftBtn) {
    finalGiftBtn.addEventListener('click', () => {
      document.getElementById('gift-reveal')?.classList.add('show');
      spawnConfetti();
    });
  }
}
