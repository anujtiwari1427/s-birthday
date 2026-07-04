/* ============================================================
   SEHER'S BIRTHDAY WEBSITE - JAVASCRIPT
   ============================================================ */

// ────────────────────────────────────────────────────────────
// 1. CONFETTI SYSTEM
// ────────────────────────────────────────────────────────────
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiActive = true;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const confettiColors = [
  '#ff4d7d', '#ff8fab', '#ffb3c6', '#ffd6e0',
  '#f5c842', '#c77dff', '#9b5de5', '#ffffff',
  '#ff6b9d', '#ffd93d', '#c9184a'
];

function createConfettiParticle() {
  return {
    x: Math.random() * confettiCanvas.width,
    y: -20,
    size: Math.random() * 10 + 5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    speedX: (Math.random() - 0.5) * 4,
    speedY: Math.random() * 4 + 2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 8,
    shape: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=star
    opacity: 1,
  };
}

function drawConfettiParticle(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  if (p.shape === 0) {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.shape === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Heart shape
    ctx.beginPath();
    ctx.moveTo(0, -p.size / 4);
    ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 4, 0, p.size / 2);
    ctx.bezierCurveTo(-p.size, -p.size / 4, -p.size / 2, -p.size, 0, -p.size / 4);
    ctx.fill();
  }
  ctx.restore();
}

let confettiTimer = 0;
function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiTimer++;

  // Spawn new particles (burst on first load)
  if (confettiActive && confettiTimer < 300) {
    for (let i = 0; i < 5; i++) {
      confettiParticles.push(createConfettiParticle());
    }
  } else if (confettiActive && confettiTimer % 8 === 0) {
    // Steady trickle
    confettiParticles.push(createConfettiParticle());
  }

  confettiParticles.forEach((p, i) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    p.speedX += (Math.random() - 0.5) * 0.1; // slight drift

    if (p.y > confettiCanvas.height + 20) {
      p.opacity -= 0.1;
    }

    if (p.opacity <= 0) {
      confettiParticles.splice(i, 1);
    } else {
      drawConfettiParticle(p);
    }
  });

  requestAnimationFrame(animateConfetti);
}
animateConfetti();

// ────────────────────────────────────────────────────────────
// 2. FLOATING BALLOONS
// ────────────────────────────────────────────────────────────
const balloonColors = [
  '#ff4d7d', '#ff8fab', '#c77dff', '#ffd93d',
  '#9b5de5', '#ff6b9d', '#c9184a', '#f5c842',
  '#ffb3c6', '#7b2ff7'
];

function createBalloon() {
  const container = document.getElementById('balloonsContainer');
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  const size = Math.random() * 40 + 50;
  const duration = Math.random() * 10 + 12;
  const startX = Math.random() * 100;

  balloon.style.cssText = `
    left: ${startX}%;
    width: ${size}px;
    height: ${size * 1.25}px;
    background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.4), ${color} 60%);
    box-shadow: inset -4px -6px 12px rgba(0,0,0,0.2), 0 0 20px ${color}55;
    animation-duration: ${duration}s;
    animation-delay: ${Math.random() * 5}s;
  `;
  container.appendChild(balloon);

  // Remove after animation ends
  setTimeout(() => {
    if (balloon.parentNode) balloon.parentNode.removeChild(balloon);
  }, (duration + 5) * 1000);
}

// Spawn balloons continuously
function spawnBalloons() {
  createBalloon();
  setTimeout(spawnBalloons, Math.random() * 1500 + 800);
}

// Initial burst
for (let i = 0; i < 8; i++) {
  setTimeout(createBalloon, i * 300);
}
spawnBalloons();

// ────────────────────────────────────────────────────────────
// 3. CURSOR SPARKLES (mouse trail)
// ────────────────────────────────────────────────────────────
const sparkleEmojis = ['✨', '⭐', '🌟', '💖', '🌸', '💫', '🎀'];
let lastSparkleTime = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkleTime < 100) return;
  lastSparkleTime = now;

  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
  sparkle.style.cssText = `
    left: ${e.clientX - 10}px;
    top: ${e.clientY - 10}px;
    font-size: ${Math.random() * 14 + 12}px;
  `;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);
});

// ────────────────────────────────────────────────────────────
// 4. SCROLL REVEAL (data-aos)
// ────────────────────────────────────────────────────────────
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 120);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ────────────────────────────────────────────────────────────
// 5. ANIMATED COUNTERS
// ────────────────────────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ────────────────────────────────────────────────────────────
// 6. GALLERY LIGHTBOX
// ────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery-card img').forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Footer images lightbox
document.querySelectorAll('.footer-photo-strip img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// ────────────────────────────────────────────────────────────
// 7. BLOW CANDLES INTERACTION
// ────────────────────────────────────────────────────────────
function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  const btn = document.getElementById('blowBtn');
  const wishMsg = document.getElementById('wishMessage');

  // Blow out all flames
  flames.forEach((f, i) => {
    setTimeout(() => {
      f.style.animation = 'none';
      f.style.opacity = '0';
      f.style.transform = 'translateX(-50%) scale(0)';
      f.style.transition = 'all 0.3s ease';
      // Smoke effect
      f.style.background = 'rgba(255,255,255,0.1)';
    }, i * 150);
  });

  // Disable button
  setTimeout(() => {
    btn.style.opacity = '0.5';
    btn.style.cursor = 'default';
    btn.disabled = true;
    btn.textContent = '🕯️ Candles Blown!';

    // Show wish message
    wishMsg.classList.add('show');

    // Burst confetti
    for (let i = 0; i < 60; i++) {
      setTimeout(() => confettiParticles.push(createConfettiParticle()), i * 40);
    }
  }, flames.length * 150 + 300);
}

// ────────────────────────────────────────────────────────────
// 8. HERO PHOTO – PARALLAX ON SCROLL
// ────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroPhoto = document.querySelector('.hero-photo-frame');
  if (heroPhoto) {
    heroPhoto.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
});

// ────────────────────────────────────────────────────────────
// 9. BIRTHDAY POPUP (on load after 1.5s)
// ────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    // Small toast notification
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #c9184a, #9b5de5);
        color: white;
        padding: 16px 24px;
        border-radius: 16px;
        font-family: Poppins, sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(201,24,74,0.4);
        z-index: 8000;
        border: 1px solid rgba(255,255,255,0.2);
        animation: toastIn 0.5s ease forwards;
        max-width: 280px;
        line-height: 1.5;
      ">
        🎉 Happy Birthday Seher! <br/>
        <span style="font-weight:300; font-size:0.8rem; opacity:0.85;">Wishing you the most amazing 19th! 🎂💖</span>
      </div>
    `;
    document.body.appendChild(toast);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes toastIn {
        from { transform: translateY(80px); opacity: 0; }
        to   { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      toast.firstElementChild.style.transition = 'all 0.5s ease';
      toast.firstElementChild.style.opacity = '0';
      toast.firstElementChild.style.transform = 'translateY(40px)';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }, 1500);
});

// ────────────────────────────────────────────────────────────
// 10. FLOATING STARS BACKGROUND
// ────────────────────────────────────────────────────────────
(function createStars() {
  const starsContainer = document.createElement('div');
  starsContainer.style.cssText = `
    position: fixed; inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  `;
  document.body.appendChild(starsContainer);

  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 4 + 2;
    const delay = Math.random() * 4;
    star.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#ffd6e0' : '#f5c842'};
      animation: starTwinkle ${duration}s ${delay}s ease-in-out infinite;
      opacity: 0;
    `;
    starsContainer.appendChild(star);
  }

  const starStyle = document.createElement('style');
  starStyle.textContent = `
    @keyframes starTwinkle {
      0%, 100% { opacity: 0; transform: scale(0.5); }
      50%       { opacity: 0.8; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(starStyle);
})();

console.log('%c🎂 Happy Birthday Seher! 🎂', 'font-size: 24px; color: #ff4d7d; font-weight: bold;');
console.log('%c✨ Wishing you an amazing 19th! ✨', 'font-size: 16px; color: #f5c842;');

// ────────────────────────────────────────────────────────────
// GAMES ZONE
// ────────────────────────────────────────────────────────────

/* ======== GAME 1: BALLOON POP ======== */
let balloonGameActive = false;
let balloonScoreVal = 0;
let balloonTimeLeft = 15;
let balloonInterval = null;
let balloonSpawnInterval = null;

const balloonEmojis = ['🎈', '🟣', '🔴', '🟡', '🔵', '🟠', '🟢', '💜', '❤️', '💛'];
const balloonColors = [
  'rgba(255,77,125,0.85)', 'rgba(155,93,229,0.85)', 'rgba(245,200,66,0.85)',
  'rgba(77,200,255,0.85)', 'rgba(255,140,0,0.85)', 'rgba(39,201,63,0.85)',
  'rgba(255,105,180,0.85)', 'rgba(100,149,237,0.85)',
];

function startBalloonGame() {
  if (balloonGameActive) return;
  balloonGameActive = true;
  balloonScoreVal = 0;
  balloonTimeLeft = 15;

  const arena = document.getElementById('balloonArena');
  const scoreEl = document.getElementById('balloonScore');
  const timerEl = document.getElementById('balloonTimer');
  const startBtn = document.getElementById('balloonStartBtn');

  arena.innerHTML = '';
  scoreEl.textContent = '0';
  timerEl.textContent = '15';
  startBtn.textContent = '🎉 Playing…';
  startBtn.disabled = true;

  // Spawn balloons
  balloonSpawnInterval = setInterval(() => {
    spawnBalloon(arena, scoreEl);
  }, 600);

  // Countdown timer
  balloonInterval = setInterval(() => {
    balloonTimeLeft--;
    timerEl.textContent = balloonTimeLeft;
    if (balloonTimeLeft <= 0) {
      endBalloonGame(arena, scoreEl, timerEl, startBtn);
    }
  }, 1000);
}

function spawnBalloon(arena, scoreEl) {
  if (!balloonGameActive) return;
  const balloon = document.createElement('div');
  balloon.className = 'balloon';
  balloon.style.left = Math.random() * (arena.clientWidth - 55) + 'px';
  balloon.style.top = Math.random() * (arena.clientHeight - 65) + 'px';
  balloon.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
  balloon.style.animationDelay = Math.random() * 2 + 's';
  balloon.style.animationDuration = (2 + Math.random() * 2) + 's';
  balloon.textContent = '🎈';

  balloon.addEventListener('click', () => {
    if (!balloonGameActive) return;
    balloonScoreVal++;
    scoreEl.textContent = balloonScoreVal;
    // Pop burst
    const burst = document.createElement('div');
    burst.className = 'balloon-pop-burst';
    burst.style.left = balloon.style.left;
    burst.style.top = balloon.style.top;
    burst.textContent = '✨';
    arena.appendChild(burst);
    setTimeout(() => burst.remove(), 500);
    balloon.remove();
  });

  arena.appendChild(balloon);
  // Auto remove after 3s
  setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, 3000);
}

function endBalloonGame(arena, scoreEl, timerEl, startBtn) {
  balloonGameActive = false;
  clearInterval(balloonInterval);
  clearInterval(balloonSpawnInterval);
  arena.innerHTML = '';
  timerEl.textContent = '0';

  let msg = balloonScoreVal >= 20 ? '🏆 Balloon Master!' :
            balloonScoreVal >= 10 ? '🎉 Great Popping!' :
            balloonScoreVal >= 5  ? '😊 Nice Try!' : '🎈 Keep Practicing!';

  const result = document.createElement('div');
  result.style.cssText = 'text-align:center;padding:20px;color:#f5c842;font-size:1.1rem;font-weight:600;';
  result.innerHTML = `${msg}<br><span style="font-size:0.9rem;color:rgba(255,255,255,0.6)">You popped ${balloonScoreVal} balloons!</span>`;
  arena.appendChild(result);

  startBtn.textContent = '🎈 Play Again!';
  startBtn.disabled = false;
}

/* ======== GAME 2: BIRTHDAY QUIZ ======== */
const quizData = [
  {
    q: '🎂 Which country first popularized birthday cakes with candles?',
    opts: ['Germany', 'France', 'England', 'Italy'],
    ans: 0
  },
  {
    q: '🎵 "Happy Birthday to You" is one of the most recognized songs in which language?',
    opts: ['French', 'Spanish', 'English', 'German'],
    ans: 2
  },
  {
    q: '🎈 What does blowing out ALL birthday candles in one breath traditionally mean?',
    opts: ['Bad luck', 'Your wish comes true', 'You get two wishes', 'Nothing special'],
    ans: 1
  },
  {
    q: '🌸 Seher is turning 19 in which month?',
    opts: ['June', 'August', 'July', 'May'],
    ans: 2
  },
  {
    q: '🎁 What is the traditional gift for a 19th birthday?',
    opts: ['Gold', 'Silver', 'Anything from the heart', 'Diamond'],
    ans: 2
  },
];

let quizIndex = 0;
let quizScore = 0;
let quizStarted = false;
let quizAnswered = false;

function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizStarted = true;
  quizAnswered = false;
  document.getElementById('quizResult').textContent = '';
  showQuestion();
}

function showQuestion() {
  const q = quizData[quizIndex];
  const progressEl = document.getElementById('quizProgress');
  const fillEl = document.getElementById('quizProgressFill');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const resultEl = document.getElementById('quizResult');

  progressEl.textContent = `Question ${quizIndex + 1} / ${quizData.length}`;
  fillEl.style.width = `${((quizIndex + 1) / quizData.length) * 100}%`;
  questionEl.textContent = q.q;
  resultEl.textContent = '';
  quizAnswered = false;

  optionsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.textContent = opt;
    btn.onclick = () => answerQuiz(i, btn);
    optionsEl.appendChild(btn);
  });
}

function answerQuiz(chosen, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  const q = quizData[quizIndex];
  const optionsEl = document.getElementById('quizOptions');
  const resultEl = document.getElementById('quizResult');
  const allBtns = optionsEl.querySelectorAll('.quiz-opt-btn');

  // Highlight answers
  allBtns.forEach((b, i) => {
    b.disabled = true;
    if (i === q.ans) b.classList.add('correct');
    else if (i === chosen && chosen !== q.ans) b.classList.add('wrong');
  });

  if (chosen === q.ans) {
    quizScore++;
    resultEl.textContent = '✅ Correct! +1 point';
    resultEl.style.color = '#27c93f';
  } else {
    resultEl.textContent = `❌ Oops! Correct: ${q.opts[q.ans]}`;
    resultEl.style.color = '#ff4d4d';
  }

  // Next question or finish
  setTimeout(() => {
    quizIndex++;
    if (quizIndex < quizData.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  }, 1400);
}

function finishQuiz() {
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const resultEl = document.getElementById('quizResult');
  const progressEl = document.getElementById('quizProgress');
  const fillEl = document.getElementById('quizProgressFill');

  fillEl.style.width = '100%';
  progressEl.textContent = 'Quiz Complete! 🎊';
  const perc = Math.round((quizScore / quizData.length) * 100);
  const medal = perc === 100 ? '🏆' : perc >= 60 ? '🥈' : '🥉';

  questionEl.textContent = `${medal} You scored ${quizScore} / ${quizData.length}!`;
  resultEl.textContent = perc === 100 ? '🌟 Perfect Score! You\'re a Birthday Expert!' :
                         perc >= 60  ? '🎉 Well done! Great birthday knowledge!' :
                                       '😊 Keep practicing! Birthdays are fun!';
  resultEl.style.color = '#f5c842';

  optionsEl.innerHTML = '';
  const retryBtn = document.createElement('button');
  retryBtn.className = 'quiz-opt-btn';
  retryBtn.style.textAlign = 'center';
  retryBtn.textContent = '🔄 Play Again';
  retryBtn.onclick = startQuiz;
  optionsEl.appendChild(retryBtn);
}

/* ======== GAME 3: SURPRISE GIFT ======== */
const surpriseMessages = [
  '🌸 Seher, you bring so much joy and light into everyone\'s life. Happy 19th Birthday, superstar! 🌟',
  '💫 May this year be your most adventurous, colorful, and joyful one yet! You deserve it all! 🎊',
  '🎀 True friendship is rare and precious — and you are one in a million, Seher! Cherish every moment! 💛',
  '✨ Nineteen years of being absolutely amazing. The world is so much better with you in it! 🌍💕',
  '🎂 May all your dreams take flight this year. Keep smiling, keep shining — the best is yet to come! 🚀',
  '🌺 Here\'s to new beginnings, wild adventures, and unforgettable memories! Happy Birthday, Seher! 🥳',
];

let giftClickCount = 0;
let giftOpened = false;

function shakeGift() {
  const giftBox = document.getElementById('giftBox');
  const giftHint = document.getElementById('giftHint');
  const giftReveal = document.getElementById('giftReveal');

  if (giftOpened) {
    // Reset
    giftOpened = false;
    giftClickCount = 0;
    giftBox.querySelector('.gift-lid').classList.remove('open');
    giftReveal.style.display = 'none';
    giftHint.textContent = '👆 Click the gift box!';
    return;
  }

  giftBox.classList.add('shaking');
  setTimeout(() => giftBox.classList.remove('shaking'), 500);
  giftClickCount++;

  if (giftClickCount === 1) {
    giftHint.textContent = '🎁 Click again to shake more...';
  } else if (giftClickCount === 2) {
    giftHint.textContent = '🤩 One more time...!';
  } else if (giftClickCount >= 3) {
    // Open the gift!
    giftOpened = true;
    giftBox.querySelector('.gift-lid').classList.add('open');
    const msg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    giftReveal.textContent = msg;
    giftReveal.style.display = 'block';
    giftHint.textContent = '🎁 Click again to get a new surprise!';
    // Launch mini confetti burst
    launchMiniBurst();
  }
}

function launchMiniBurst() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      if (typeof createConfettiParticle === 'function') {
        const p = createConfettiParticle();
        p.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        p.y = window.innerHeight / 2;
        p.speedX = (Math.random() - 0.5) * 10;
        p.speedY = -(Math.random() * 8 + 2);
        confettiParticles.push(p);
      }
    }, i * 20);
  }
}

