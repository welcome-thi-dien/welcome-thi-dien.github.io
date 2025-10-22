// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera-btn');
const uploadBtn = document.getElementById('upload-btn');
const autoModeBtn = document.getElementById('auto-mode-btn');
const fileInput = document.getElementById('file-input');
const gallery = document.getElementById('gallery');
const clearGalleryBtn = document.getElementById('clear-gallery');
const downloadAllBtn = document.getElementById('download-all-btn');
const overlay = document.getElementById('overlay');
const countdown = document.getElementById('countdown');
const autoProgress = document.getElementById('auto-progress');

// State
let currentStream = null;
let currentFilter = 'none';
let currentOverlay = 'none';
let facingMode = 'user'; // 'user' for front camera, 'environment' for back camera
let capturedImages = [];
let isAutoMode = false;
let autoModeInterval = null;
let autoModeCount = 0;

// Initialize Camera
async function initCamera() {
  try {
    // Stop any existing stream
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
    }

    const constraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;

    // Set canvas size to match video
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
  } catch (err) {
    console.error('Error accessing camera:', err);
    alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
  }
}

// Switch Camera
switchCameraBtn.addEventListener('click', () => {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  initCamera();
});

// Apply Filter
document.querySelectorAll('.filter-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    video.style.filter = currentFilter === 'none' ? '' : currentFilter;
  });
});

// Apply Overlay
document.querySelectorAll('.overlay-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.overlay-btn').forEach((b) => b.classList.remove('active'));
    e.target.classList.add('active');
    currentOverlay = e.target.dataset.overlay;

    // Remove all overlay classes
    overlay.className = 'overlay-frame';

    // Add new overlay class if not 'none'
    if (currentOverlay !== 'none') {
      overlay.classList.add(currentOverlay);
    }
  });
});

// Capture Image
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');

  // Flip horizontally for front camera
  if (facingMode === 'user') {
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();
  } else {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  // Apply filter
  if (currentFilter !== 'none') {
    context.filter = currentFilter;
    context.drawImage(canvas, 0, 0);
  }

  // Draw overlay
  if (currentOverlay !== 'none') {
    drawOverlay(context);
  }

  // Convert to image
  const imgData = canvas.toDataURL('image/png');

  // Add to gallery
  addToGallery(imgData);

  // Capture animation
  captureBtn.style.transform = 'scale(0.9)';
  setTimeout(() => {
    captureBtn.style.transform = 'scale(1)';
  }, 200);
});

// Draw Overlay on Canvas
function drawOverlay(context) {
  const width = canvas.width;
  const height = canvas.height;

  switch (currentOverlay) {
    case 'frame1':
      context.strokeStyle = 'rgba(255, 215, 0, 0.8)';
      context.lineWidth = 40;
      context.strokeRect(20, 20, width - 40, height - 40);
      break;
    case 'frame2':
      context.strokeStyle = 'rgba(255, 105, 180, 0.8)';
      context.lineWidth = 30;
      context.strokeRect(15, 15, width - 30, height - 30);
      context.strokeRect(25, 25, width - 50, height - 50);
      break;
    case 'frame3':
      context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      context.lineWidth = 20;
      context.strokeRect(10, 10, width - 20, height - 20);
      break;
    case 'frame4':
      // Gradient frame
      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
      gradient.addColorStop(0.33, 'rgba(78, 205, 196, 0.8)');
      gradient.addColorStop(0.66, 'rgba(69, 183, 209, 0.8)');
      gradient.addColorStop(1, 'rgba(247, 183, 49, 0.8)');
      context.strokeStyle = gradient;
      context.lineWidth = 35;
      context.strokeRect(20, 20, width - 40, height - 40);
      break;
    case 'frame5':
      // Diamond frame
      context.strokeStyle = 'rgba(100, 200, 255, 0.8)';
      context.lineWidth = 25;
      context.strokeRect(15, 15, width - 30, height - 30);
      context.strokeStyle = 'rgba(150, 220, 255, 0.6)';
      context.lineWidth = 15;
      context.strokeRect(25, 25, width - 50, height - 50);
      break;
    case 'frame6':
      // Art frame
      context.strokeStyle = 'rgba(150, 100, 200, 0.7)';
      context.lineWidth = 35;
      context.strokeRect(20, 20, width - 40, height - 40);
      context.strokeRect(30, 30, width - 60, height - 60);
      break;
    case 'frame7':
      // Floral frame
      context.strokeStyle = 'rgba(255, 182, 193, 0.8)';
      context.lineWidth = 30;
      context.strokeRect(15, 15, width - 30, height - 30);
      break;
    case 'frame8':
      // Circular frame
      context.strokeStyle = 'rgba(255, 140, 0, 0.8)';
      context.lineWidth = 25;
      context.beginPath();
      context.arc(width / 2, height / 2, Math.min(width, height) / 2 - 30, 0, Math.PI * 2);
      context.stroke();
      break;
    case 'frame9':
      // Angular frame
      context.strokeStyle = 'rgba(50, 50, 50, 0.9)';
      context.lineWidth = 25;
      context.strokeRect(10, 10, width - 20, height - 20);
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      context.lineWidth = 5;
      context.strokeRect(20, 20, width - 40, height - 40);
      break;
    case 'hearts':
      context.font = '60px Arial';
      const hearts = '❤️ ❤️ ❤️ ❤️ ❤️';
      context.fillText(hearts, width / 2 - 150, 80);
      break;
    case 'stars':
      context.font = '60px Arial';
      const stars = '⭐ ⭐ ⭐ ⭐ ⭐';
      context.fillText(stars, width / 2 - 150, 80);
      break;
    case 'sparkles':
      context.font = '50px Arial';
      const sparkles = '✨ ✨ ✨ ✨ ✨ ✨';
      context.fillText(sparkles, width / 2 - 160, 60);
      context.fillText(sparkles, width / 2 - 160, height - 30);
      break;
    case 'confetti':
      context.font = '45px Arial';
      const confetti = '🎉 🎊 🎈 🎁 🎉 🎊';
      context.fillText(confetti, width / 2 - 140, 60);
      break;
    case 'flowers':
      context.font = '50px Arial';
      const flowers = '🌺 🌸 🌼 🌻 🌺 🌸';
      context.fillText(flowers, width / 2 - 160, 70);
      const flowers2 = '🌻 🌼 🌸 🌺 🌻 🌼';
      context.fillText(flowers2, width / 2 - 160, height - 30);
      break;
    case 'butterflies':
      context.font = '55px Arial';
      const butterflies = '🦋 🦋 🦋 🦋 🦋';
      context.fillText(butterflies, width / 2 - 140, 80);
      break;
    case 'snowflakes':
      context.font = '50px Arial';
      const snow = '❄️ ❄️ ❄️ ❄️ ❄️ ❄️';
      context.fillText(snow, width / 2 - 160, 60);
      context.fillText(snow, width / 2 - 160, height - 30);
      break;
  }
}

// Add Image to Gallery
function addToGallery(imgData) {
  capturedImages.push(imgData);

  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';

  const img = document.createElement('img');
  img.src = imgData;

  const controls = document.createElement('div');
  controls.className = 'gallery-item-controls';

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-btn';
  downloadBtn.textContent = '⬇️ Tải xuống';
  downloadBtn.onclick = () => downloadImage(imgData);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '🗑️ Xóa';
  deleteBtn.onclick = () => {
    galleryItem.remove();
    capturedImages = capturedImages.filter((img) => img !== imgData);
  };

  controls.appendChild(downloadBtn);
  controls.appendChild(deleteBtn);
  galleryItem.appendChild(img);
  galleryItem.appendChild(controls);

  gallery.prepend(galleryItem);
}

// Download Image
function downloadImage(imgData) {
  const link = document.createElement('a');
  link.href = imgData;
  link.download = `photo-booth-${Date.now()}.png`;
  link.click();
}

// Clear Gallery
clearGalleryBtn.addEventListener('click', () => {
  if (confirm('Bạn có chắc muốn xóa tất cả ảnh?')) {
    gallery.innerHTML = '';
    capturedImages = [];
  }
});

// Upload Image from Gallery
uploadBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        // Apply filter
        if (currentFilter !== 'none') {
          context.filter = currentFilter;
          context.drawImage(canvas, 0, 0);
        }

        // Draw overlay
        if (currentOverlay !== 'none') {
          drawOverlay(context);
        }

        // Convert to image
        const imgData = canvas.toDataURL('image/png');
        addToGallery(imgData);

        // Reset canvas size to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
  fileInput.value = ''; // Reset input
});

// Auto Mode - Take 10 photos with 10 second countdown
autoModeBtn.addEventListener('click', () => {
  if (isAutoMode) {
    stopAutoMode();
  } else {
    startAutoMode();
  }
});

function startAutoMode() {
  isAutoMode = true;
  autoModeCount = 0;
  autoModeBtn.textContent = '⏹️ Dừng tự động';
  autoModeBtn.classList.add('active-auto');
  captureBtn.disabled = true;

  updateAutoProgress();
  takePhotoWithCountdown();
}

function stopAutoMode() {
  isAutoMode = false;
  autoModeCount = 0;
  autoModeBtn.textContent = '🤖 Chế độ tự động';
  autoModeBtn.classList.remove('active-auto');
  captureBtn.disabled = false;
  countdown.textContent = '';
  countdown.style.display = 'none';
  autoProgress.textContent = '';

  if (autoModeInterval) {
    clearInterval(autoModeInterval);
    autoModeInterval = null;
  }
}

function takePhotoWithCountdown() {
  if (!isAutoMode || autoModeCount >= 10) {
    if (autoModeCount >= 10) {
      alert('Đã chụp xong 10 ảnh!');
    }
    stopAutoMode();
    return;
  }

  let timeLeft = 10;
  countdown.style.display = 'block';
  countdown.textContent = timeLeft;

  autoModeInterval = setInterval(() => {
    timeLeft--;
    countdown.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(autoModeInterval);
      countdown.textContent = '📸';

      // Take photo
      setTimeout(() => {
        capturePhoto();
        autoModeCount++;
        updateAutoProgress();

        // Wait 1 second before next countdown
        setTimeout(() => {
          if (isAutoMode) {
            takePhotoWithCountdown();
          }
        }, 1000);
      }, 500);
    }
  }, 1000);
}

function updateAutoProgress() {
  autoProgress.textContent = `Ảnh ${autoModeCount}/10`;
}

function capturePhoto() {
  const context = canvas.getContext('2d');

  // Flip horizontally for front camera
  if (facingMode === 'user') {
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();
  } else {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  // Apply filter
  if (currentFilter !== 'none') {
    context.filter = currentFilter;
    context.drawImage(canvas, 0, 0);
  }

  // Draw overlay
  if (currentOverlay !== 'none') {
    drawOverlay(context);
  }

  // Convert to image
  const imgData = canvas.toDataURL('image/png');

  // Add to gallery
  addToGallery(imgData);
}

// Download All Images as ZIP (using individual downloads)
downloadAllBtn.addEventListener('click', async () => {
  if (capturedImages.length === 0) {
    alert('Không có ảnh nào để tải xuống!');
    return;
  }

  if (confirm(`Tải xuống ${capturedImages.length} ảnh?`)) {
    capturedImages.forEach((imgData, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `photo-booth-${Date.now()}-${index + 1}.png`;
        link.click();
      }, index * 200); // Stagger downloads
    });
  }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', initCamera);

// Stop camera when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden && currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  } else if (!document.hidden) {
    initCamera();
  }
});
