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
let current = 0;
let storyRainTimer = null;
let storyImages = [];
let syncStoryRainState = () => {};

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
  slideTrack.style.transform = `translateX(-${offset}px)`;
  renderCarouselDots();
  syncStoryRainState();
};

const nextSlide = () => goToSlide(current + 1);
const prevSlide = () => goToSlide(current - 1);

prevBtn?.addEventListener('click', prevSlide);
nextBtn?.addEventListener('click', nextSlide);

let touchStartX = null;
slideTrack?.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
});
slideTrack?.addEventListener('touchend', (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 60) {
    if (dx < 0) nextSlide();
    else prevSlide();
  }
  touchStartX = null;
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowLeft') prevSlide();
  if (evt.key === 'ArrowRight') nextSlide();
});

window.addEventListener('resize', () => goToSlide(current));

renderCarouselDots();
goToSlide(0);

// Gate with password
(() => {
  const PASS = '552025';
  const KEY = 'birthday-pass';

  const unlock = () => {
    bodyEl.classList.remove('locked');
    lockScreen?.classList.add('hidden');
    lockError?.classList.add('hidden');
  };

  const cached = localStorage.getItem(KEY);
  if (cached === PASS) {
    unlock();
    return;
  }

  lockForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (lockInput?.value || '').trim();
    if (val === PASS) {
      localStorage.setItem(KEY, PASS);
      unlock();
    } else {
      lockError?.classList.remove('hidden');
    }
  });
})();

// PDF viewer (zoom + fullscreen) using PDF.js
const pdfUrl = 'assets/pdf/Chuc_mung_sinh_nhat_em_iu_Nguyen_Thi_Duyen_dam_nhat.pdf';
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfCanvasWrap = document.getElementById('pdf-canvas-wrap');
const zoomOutBtn = document.getElementById('pdf-zoom-out');
const zoomInBtn = document.getElementById('pdf-zoom-in');
const zoomLevelLabel = document.getElementById('pdf-zoom-level');
const fullscreenBtn = document.getElementById('pdf-fullscreen');
const pdfError = document.getElementById('pdf-error');
const pdfFallbackLink = document.getElementById('pdf-fallback-link');

if (pdfFallbackLink) pdfFallbackLink.href = pdfUrl;

const initPdf = async () => {
  if (!pdfCanvas) return;
  const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js không tải được');

  pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/js/pdf.worker.min.js';

  let pdfDoc = null;
  let scale = 0.65;
  const pageNum = 1;

  const renderPage = async () => {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const context = pdfCanvas.getContext('2d');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;
    pdfCanvas.style.width = `${viewport.width}px`;
    pdfCanvas.style.height = `${viewport.height}px`;
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
    if (!document.fullscreenElement) {
      el?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
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
    if (isStorySlide) startStoryRain();
    else stopStoryRain();
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
