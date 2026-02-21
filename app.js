// Carousel for sections
const slideTrack = document.getElementById('slides');
const slideEls = Array.from(document.querySelectorAll('.slide'));
const dotsNav = document.getElementById('carousel-dots');
const prevBtn = document.getElementById('carousel-prev');
const nextBtn = document.getElementById('carousel-next');
const storyRain = document.getElementById('story-rain');
const lockScreen = document.getElementById('lock-screen');
const lockForm = document.getElementById('lock-form');
const lockInput = document.getElementById('lock-input');
const lockError = document.getElementById('lock-error');
const bodyEl = document.body;
const musicBtn = document.getElementById('music-toggle');
const musicEl = document.getElementById('bg-music');
const ctaVideo = document.getElementById('cta-video');
const ctaPdf = document.getElementById('cta-pdf');
const wordsContainer = document.getElementById('falling-words');
const confettiCanvas = document.getElementById('confetti');
const wishTexts = Array.from(document.querySelectorAll('.wish__text'));
const heroBackdrop = document.querySelector('.hero__backdrop-name');
let current = 0;
let storyRainTimer = null;
let storyImages = [];
let syncStoryRainState = () => {};
let musicAutoStarted = false;
let wordsTimer = null;
let typedSet = new WeakSet();

function makeBurst() {
  const burst = document.createElement('div');
  burst.className = 'burst';
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  burst.style.setProperty('--bx', `${x}%`);
  burst.style.setProperty('--by', `${y}%`);
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 650);
}

const renderCarouselDots = () => {
  dotsNav.innerHTML = '';
  slideEls.forEach((_, idx) => {
    const dot = document.createElement('button');
    if (idx === current) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsNav.appendChild(dot);
  });
};

const goToSlide = (idx) => {
  current = (idx + slideEls.length) % slideEls.length;
  const gap = parseFloat(getComputedStyle(slideTrack).columnGap || '0');
  const width = slideEls[0]?.getBoundingClientRect().width || 0;
  const offset = current * (width + gap);
  slideTrack.style.transition = 'transform 320ms ease';
  slideTrack.style.transform = `translateX(-${offset}px)`;
  renderCarouselDots();
  syncStoryRainState();
  typeInSlide(slideEls[current]);
  makeBurst();
};

const nextSlide = () => goToSlide(current + 1);
const prevSlide = () => goToSlide(current - 1);

prevBtn?.addEventListener('click', prevSlide);
nextBtn?.addEventListener('click', nextSlide);

let touchStartX = null;
let touchStartY = null;
const touchOptions = { passive: false, capture: true };
const handlePointerStart = (x, y) => {
  touchStartX = x;
  touchStartY = y;
};
const handlePointerMove = (x, y, evt) => {
  if (touchStartX === null || touchStartY === null) return;
  const dx = x - touchStartX;
  const dy = y - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
    evt.preventDefault(); // ưu tiên swipe ngang
  }
};
const handlePointerEnd = (x, y) => {
  if (touchStartX === null || touchStartY === null) return;
  const dx = x - touchStartX;
  const dy = y - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 25) {
    if (dx < 0) nextSlide();
    else prevSlide();
  }
  touchStartX = null;
  touchStartY = null;
};

const pointerTargets = [slideTrack, document];
pointerTargets.forEach((target) => {
  target?.addEventListener(
    'pointerdown',
    (e) => {
      if (e.pointerType !== 'touch') return;
      handlePointerStart(e.clientX, e.clientY);
    },
    touchOptions,
  );
  target?.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'touch') return;
      handlePointerMove(e.clientX, e.clientY, e);
    },
    touchOptions,
  );
  target?.addEventListener(
    'pointerup',
    (e) => {
      if (e.pointerType !== 'touch') return;
      handlePointerEnd(e.clientX, e.clientY);
    },
    touchOptions,
  );
  target?.addEventListener(
    'pointercancel',
    () => {
      touchStartX = null;
      touchStartY = null;
    },
    touchOptions,
  );
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowLeft') prevSlide();
  if (evt.key === 'ArrowRight') nextSlide();
});

window.addEventListener('resize', () => goToSlide(current));

ctaVideo?.addEventListener('click', () => goToSlide(slideEls.findIndex((s) => s.id === 'video')));
ctaPdf?.addEventListener('click', () => goToSlide(slideEls.findIndex((s) => s.id === 'pdf')));

// Typewriter for wish texts
const typeInSlide = (slide) => {
  if (!slide) return;
  slide.querySelectorAll('.wish__text').forEach((p) => {
    if (typedSet.has(p)) return;
    const full = p.textContent;
    p.textContent = '';
    let idx = 0;
    const step = () => {
      if (idx <= full.length) {
        p.textContent = full.slice(0, idx);
        idx += 2;
        requestAnimationFrame(step);
      } else {
        typedSet.add(p);
      }
    };
    step();
  });
};

renderCarouselDots();
goToSlide(0);

// Music toggle
(() => {
  if (!musicBtn || !musicEl) return;
  const updateLabel = (playing) => {
    musicBtn.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  };
  updateLabel(false);
  let playing = false;

  musicBtn.addEventListener('click', async () => {
    try {
      if (!playing) {
        await musicEl.play();
        playing = true;
      } else {
        musicEl.pause();
        playing = false;
      }
      updateLabel(playing);
    } catch (err) {
      musicBtn.textContent = 'Mở nhạc (không được)';
      console.error(err);
    }
  });
  // expose helpers
  window.__playMusic = async () => {
    try {
      await musicEl.play();
      playing = true;
      updateLabel(true);
    } catch (err) {
      console.error(err);
    }
  };
  window.__pauseMusic = () => {
    musicEl.pause();
    playing = false;
    updateLabel(false);
  };
})();

// Voice note control
const playVoiceNote = () => {};
const stopVoiceNote = () => {};

// Gate with password
(() => {
  const PASS = '552025';
  const BYPASS = '0964888301';
  const KEY = 'birthday-pass';
  const RELEASE = new Date('2026-02-25T00:00:00');
  const lockTimer = document.getElementById('lock-timer');

  const showTimer = () => {
    if (!lockTimer) return;
    const now = new Date();
    const diff = RELEASE - now;
    if (diff <= 0) {
      lockTimer.classList.add('hidden');
      return;
    }
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    lockTimer.textContent = `Chỉ mở sau 00:00 25/02/2026. Còn ${hours}h ${mins}m.`;
    lockTimer.classList.remove('hidden');
  };

  const canOpen = (val) => val === BYPASS || new Date() >= RELEASE;

  const unlock = () => {
    bodyEl.classList.remove('locked');
    lockScreen?.classList.add('hidden');
    lockError?.classList.add('hidden');
  };

  showTimer();

  const cached = localStorage.getItem(KEY);
  const openTimeReached = new Date() >= RELEASE;
  if (cached === BYPASS || (openTimeReached && cached === PASS)) {
    unlock();
    return;
  }

  lockForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (lockInput?.value || '').trim();
    if (!canOpen(val)) {
      showTimer();
      lockError?.classList.remove('hidden');
      lockError.textContent = 'Chưa đến 00:00 25/02/2026, chờ thêm nhé.';
      return;
    }
    if (val === PASS || val === BYPASS) {
      localStorage.setItem(KEY, val === PASS ? PASS : BYPASS);
      unlock();
    } else {
      lockError?.classList.remove('hidden');
      lockError.textContent = 'Sai mật khẩu.';
    }
  });

  // refresh countdown every minute
  setInterval(showTimer, 60000);
})();

// PDF viewer (zoom + fullscreen) using PDF.js
const pdfUrl = 'assets/pdf/Chuc_mung_sinh_nhat_em_iu_Nguyen_Thi_Duyen_dam_nhat.pdf';
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfCanvasWrap = document.getElementById('pdf-canvas-wrap');
const zoomOutBtn = document.getElementById('pdf-zoom-out');
const zoomInBtn = document.getElementById('pdf-zoom-in');
const zoomLevelLabel = document.getElementById('pdf-zoom-level');
const fullscreenBtn = document.getElementById('pdf-fullscreen');
const downloadBtn = document.getElementById('pdf-download');
const pdfError = document.getElementById('pdf-error');
const pdfFallbackLink = document.getElementById('pdf-fallback-link');

if (pdfFallbackLink) pdfFallbackLink.href = pdfUrl;

const initPdf = async () => {
  if (!pdfCanvas) return;
  const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js không tải được');

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/js/pdf.worker.min.js';

  let pdfDoc = null;
  let scale = 0.55;
  const pageNum = 1;

  const renderPage = async () => {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const context = pdfCanvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    pdfCanvas.width = viewport.width * ratio;
    pdfCanvas.height = viewport.height * ratio;
    pdfCanvas.style.width = `${viewport.width}px`;
    pdfCanvas.style.height = `${viewport.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.imageSmoothingEnabled = true;
    await page.render({ canvasContext: context, viewport }).promise;
    zoomLevelLabel.textContent = `${Math.round(scale * 100)}%`;
  };

  pdfDoc = await pdfjsLib.getDocument(pdfUrl).promise;
  await renderPage();

  zoomInBtn?.addEventListener('click', () => {
    scale = Math.min(scale + 0.1, 3);
    renderPage();
  });

  zoomOutBtn?.addEventListener('click', () => {
    scale = Math.max(scale - 0.1, 0.5);
    renderPage();
  });

  fullscreenBtn?.addEventListener('click', () => {
    const el = pdfCanvasWrap;
    const openFallback = () => window.open(pdfUrl, '_blank');
    if (!document.fullscreenElement && el) {
      const req = el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
      if (req && typeof req.then === 'function') {
        req.catch(openFallback);
      } else {
        openFallback();
      }
    } else {
      document.exitFullscreen?.();
    }
  });

  downloadBtn?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = pdfUrl.split('/').pop() || 'letter.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
};

initPdf().catch((err) => {
  if (pdfError) {
    pdfError.textContent = 'Không hiển thị được PDF, bấm để mở file trực tiếp.';
    pdfError.classList.remove('hidden');
  }
  console.error(err);
});

// Story images rain via manifest.json
if (storyRain) {
  const manifestUrl = 'assets/story-image/manifest.json';

  const clearStoryRain = () => {
    storyRain.querySelectorAll('.story-photo, .story-rain__empty').forEach((node) => node.remove());
  };

  const spawnStoryPhoto = () => {
    if (!storyImages.length) return;
    const src = storyImages[Math.floor(Math.random() * storyImages.length)];
    const img = document.createElement('img');
    const size = 90 + Math.random() * 150;
    const left = Math.random() * 40;
    const duration = 11 + Math.random() * 3; // 5–8s rơi chậm hơn
    const linger = 6 + Math.random() * 4; // ở lại thêm 6–10s
    const drift = -70 + Math.random() * 140;
    const rotateStart = -14 + Math.random() * 28;
    const rotateEnd = rotateStart + (-18 + Math.random() * 36);

    img.className = 'story-photo';
    img.src = src;
    img.alt = 'Khoanh khac ky niem';
    img.style.left = `${left}%`;
    img.style.setProperty('--photo-size', `${size}px`);
    img.style.setProperty('--photo-duration', `${duration}s`);
    img.style.setProperty('--photo-drift', `${drift}px`);
    img.style.setProperty('--photo-rotate-start', `${rotateStart}deg`);
    img.style.setProperty('--photo-rotate-end', `${rotateEnd}deg`);
    img.onerror = () => img.remove();
    storyRain.appendChild(img);
    setTimeout(() => img.remove(), (duration + linger) * 1000);
  };

  const startStoryRain = () => {
    if (storyRainTimer || !storyImages.length) return;
    for (let i = 0; i < 6; i++) spawnStoryPhoto();
    storyRainTimer = setInterval(spawnStoryPhoto, 520);
  };

  const stopStoryRain = () => {
    if (storyRainTimer) {
      clearInterval(storyRainTimer);
      storyRainTimer = null;
    }
    clearStoryRain();
  };

  syncStoryRainState = () => {
    const isStorySlide = slideEls[current]?.id === 'story';
    if (isStorySlide) {
      startStoryRain();
      startWords();
      launchConfetti();
      playVoiceNote();
      if (!musicAutoStarted && typeof window.__playMusic === 'function') {
        window.__playMusic();
        musicAutoStarted = true;
      }
    } else {
      stopStoryRain();
      stopWords();
      stopVoiceNote();
    }
  };

  const showEmpty = () => {
    clearStoryRain();
    const hint = document.createElement('p');
    hint.className = 'story-rain__empty';
    hint.textContent = 'Chua co anh trong manifest.json';
    storyRain.appendChild(hint);
  };

  (async () => {
    try {
      const res = await fetch(manifestUrl);
      if (!res.ok) throw new Error('Không đọc được manifest');
      const data = await res.json();
      const allow = /\.(jpe?g|png|gif|webp)$/i;
      storyImages = Array.isArray(data.images)
        ? data.images
            .filter((src) => typeof src === 'string' && src.trim().length > 0)
            .filter((src) => allow.test(src.split('?')[0]))
        : [];
      if (!storyImages.length) return showEmpty();
      syncStoryRainState();
    } catch (e) {
      console.error(e);
      showEmpty();
    }
  })();
}

// Falling words (for surprises)
const wordList = [
  'Happy birthday',
  'chúc mừng chúng ta có nhau',
  'iu em',
  'thương em',
  'wo ai ni',
  'sa rang hê',
  'miss u',
  'love u sooooo much',
  'em người iu sịn sịn',
  'anh rất iu em',
  'iu iu bbiu mùm thiu',
  'toàn mùi mùm em',
  'thiu éeeeeeeee',
  'thúi quắc',
  'Muahahahahahah'
];

const clearWords = () => {
  wordsContainer?.querySelectorAll('.falling-word').forEach((el) => el.remove());
};

const spawnWord = () => {
  if (!wordsContainer) return;
  const text = wordList[Math.floor(Math.random() * wordList.length)];
  const el = document.createElement('div');
  el.className = 'falling-word';
  el.textContent = text;
  const left = Math.random() * 88;
  const size = 14 + Math.random() * 10;
  const dur = 6 + Math.random() * 4;
  el.style.left = `${left}%`;
  el.style.fontSize = `${size}px`;
  el.style.setProperty('--word-dur', `${dur}s`);
  wordsContainer.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.5) * 1000);
};

const startWords = () => {
  if (!wordsContainer || wordsTimer) return;
  for (let i = 0; i < 6; i++) spawnWord();
  wordsTimer = setInterval(spawnWord, 700);
};

const stopWords = () => {
  if (wordsTimer) {
    clearInterval(wordsTimer);
    wordsTimer = null;
  }
  clearWords();
};

// Confetti
let confettiCtx = null;
let confettiActive = false;
const launchConfetti = () => {
  if (!confettiCanvas) return;
  const ctx = confettiCtx || (confettiCtx = confettiCanvas.getContext('2d'));
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -20,
    r: 2 + Math.random() * 3,
    c: `hsl(${Math.random() * 360},80%,65%)`,
    v: 2 + Math.random() * 3,
    w: -2 + Math.random() * 4
  }));
  confettiActive = true;
  const draw = () => {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p) => {
      p.y += p.v;
      p.x += p.w;
      if (p.y > confettiCanvas.height) p.y = -10;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
  setTimeout(() => {
    confettiActive = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 2200);
};

const resizeConfetti = () => {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
};
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

// Falling hearts
const heartsContainer = document.getElementById('falling-hearts');
if (heartsContainer) {
  const spawnHeart = () => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    const size = 14 + Math.random() * 10;
    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty('--dur', `${6 + Math.random() * 4}s`);
    heart.style.opacity = 0.6 + Math.random() * 0.4;
    heart.style.animationDelay = `${Math.random() * 1}s`;
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 11000);
  };

  setInterval(spawnHeart, 600);
  // Start with a few
  for (let i = 0; i < 6; i++) spawnHeart();
}
