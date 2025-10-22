// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const switchCameraBtn = document.getElementById('switch-camera-btn');
const gallery = document.getElementById('gallery');
const clearGalleryBtn = document.getElementById('clear-gallery');
const overlay = document.getElementById('overlay');

// State
let currentStream = null;
let currentFilter = 'none';
let currentOverlay = 'none';
let facingMode = 'user'; // 'user' for front camera, 'environment' for back camera
let capturedImages = [];

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
