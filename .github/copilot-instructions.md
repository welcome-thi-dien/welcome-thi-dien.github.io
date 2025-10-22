# GitHub Copilot Instructions for Photo Booth App

## Project Overview

This is a web-based Photo Booth application that allows users to capture photos using their device camera with real-time filters and decorative overlays. The app is built with vanilla HTML, CSS, and JavaScript (no frameworks).

## Tech Stack

- **HTML5**: Semantic markup with video and canvas elements
- **CSS3**: Modern styling with gradients, animations, and responsive grid layouts
- **JavaScript (ES6+)**: Camera API integration, image manipulation, and DOM handling
- **MediaDevices API**: For camera access and stream management

## Project Structure

```
/
├── index.html          # Main HTML structure
├── script.js           # Core JavaScript logic for camera and image processing
├── style.css           # Styling and responsive design
├── .github/
│   └── copilot-instructions.md
├── image/              # Static image assets
├── img/                # Additional image resources
└── Giá vàng hôm nay - Bảng giá vàng nhẫn, vàng miếng, vàng 9999, 24K, 18K_files/
```

## Key Features

1. **Camera Access**: Uses MediaDevices API to access front/back camera
2. **Extended Filters**: 24+ CSS filters including basic (grayscale, sepia, blur) and advanced combinations (vintage, drama, tropical, retro)
3. **Rich Decorative Overlays**: 16+ canvas-based overlays including 9 frame styles (gold, pink, white, gradient, diamond, art, floral, circular, angular) and 7 emoji effects (hearts, stars, sparkles, confetti, flowers, butterflies, snowflakes)
4. **Image Preview Modal**: Click any gallery image to open full-screen preview with download and delete options
5. **Camera Minimize/Maximize Toggle**: Manual button to minimize camera to corner or maximize to full size without layout shifts
6. **Image Capture**: Converts video frames to images with filters and overlays
7. **Gallery Upload**: Upload images from device gallery and apply filters/overlays
8. **Auto Mode**: Automated photo session - captures 10 photos with 10-second countdown between each
9. **Batch Download**: Download all captured images at once
10. **Enhanced Gallery**: Beautiful card-based layout with hover effects and smooth animations
11. **Camera Switching**: Toggle between front and back cameras
12. **Premium UI/UX**: Gradient buttons, smooth animations, custom scrollbar, and modern glass-morphism design
13. **Fully Responsive**: Mobile-first approach with adaptive layouts and tablet optimization

## Code Style Guidelines

### JavaScript

- Use `const` and `let` (avoid `var`)
- Use arrow functions for callbacks
- Use async/await for asynchronous operations
- Add error handling for camera access
- Use descriptive variable names in Vietnamese for UI text
- Follow existing naming conventions (camelCase for variables/functions)

### HTML

- Use semantic HTML5 elements
- Include proper `lang="vi"` for Vietnamese content
- Keep accessibility in mind (proper ARIA labels when needed)
- Use Vietnamese language for all user-facing text

### CSS

- Use modern CSS features (Grid, Flexbox)
- Follow BEM-like naming for complex components
- Use CSS animations for smooth transitions
- Maintain gradient theme: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Ensure responsive design with media queries

## Important Patterns & Conventions

### Camera Management

```javascript
// Always stop existing streams before starting new ones
if (currentStream) {
  currentStream.getTracks().forEach((track) => track.stop());
}

// Use facingMode for camera switching
const constraints = {
  video: {
    facingMode: facingMode, // 'user' or 'environment'
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
};
```

### Canvas Image Processing

```javascript
// Flip horizontally for front camera
if (facingMode === 'user') {
  context.save();
  context.scale(-1, 1);
  context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  context.restore();
}
```

### Event Handling

- Use event delegation where appropriate
- Add visual feedback for user interactions (transforms, animations)
- Always check permissions before accessing camera

## Common Tasks

### Adding New Filters

1. Add a new button in the `.filters-grid` section in `index.html`
2. Set appropriate `data-filter` attribute with CSS filter value (can combine multiple filters)
3. The existing event listener will handle the filter application automatically
4. Examples of filter combinations:
   - `brightness(110%) saturate(130%) contrast(110%)` for warm tone
   - `grayscale(100%) contrast(150%)` for classic black and white
   - `saturate(200%) hue-rotate(50deg)` for tropical effect

### Adding New Overlays

1. Add a new button in the `.overlays-grid` section in `index.html`
2. Add corresponding case in the `drawOverlay()` function in `script.js`
3. Optionally add CSS classes in `style.css` for live preview on video

### Auto Mode Configuration

- Default: 10 photos with 10-second countdown between each
- To modify: Change constants in `startAutoMode()` and `takePhotoWithCountdown()` functions
- Countdown displays in center of video with pulse animation
- Progress shown as "Ảnh X/10" below controls
- Can be stopped mid-session by clicking button again

### Gallery Upload Feature

- Accepts images from device gallery via file input
- Applies currently selected filter and overlay to uploaded image
- Uses FileReader API to process uploaded files
- Maintains original image dimensions for processing

### Batch Download

- Downloads all gallery images sequentially
- Staggered by 200ms to prevent browser blocking
- Each file named with timestamp and index: `photo-booth-{timestamp}-{index}.png`

### Modifying Gallery Behavior

- Gallery items are stored in `capturedImages` array
- Each gallery item includes download and delete functionality
- Images are stored as base64 data URLs
- "Download All" button downloads entire collection

## Browser Compatibility

- Target modern browsers with MediaDevices API support
- Use `navigator.mediaDevices.getUserMedia()` (standard)
- Include fallbacks for older mobile browsers if needed

## Vietnamese Language

All user-facing text should be in Vietnamese:

- Button labels: "Chụp ảnh", "Đổi camera", "Tải xuống", "Xóa"
- Headings: "Bộ lọc", "Khung ảnh", "Gallery"
- Confirmations: "Bạn có chắc muốn xóa tất cả ảnh?"

## Performance Considerations

- Stop camera stream when page is hidden (battery saving)
- Use `requestAnimationFrame` for smooth animations if needed
- Optimize canvas operations for better performance
- Clean up event listeners when removing gallery items

## Security & Privacy

- Always request camera permission explicitly
- Show clear error messages when camera access is denied
- Don't store images on server (client-side only)
- Use HTTPS in production for camera access

## Testing Focus Areas

1. Camera access on different devices (desktop, mobile, iOS, Android)
2. Camera switching functionality
3. Filter and overlay rendering
4. Image download functionality
5. Responsive layout on various screen sizes
6. Memory management (gallery with many images)

## Current Advanced Features

### Extended Filter Set (24+ filters)

- Basic filters: Grayscale, Sepia, Blur variations, Brightness adjustments
- Color manipulations: Saturation, Hue rotation, Opacity, Invert
- Combined effects: Retro, Vintage, Drama, Vivid, Warm, Cold, Tropical
- All filters apply to both live camera and uploaded images

### Auto Photo Session

- Captures 10 photos automatically
- 10-second countdown between shots with animated display
- Visual progress indicator ("Ảnh X/10")
- Can be stopped at any time
- Countdown appears centered with pulse animation

### Gallery Upload & Management

- Upload photos from device gallery
- Apply filters/overlays to uploaded images
- Individual download per photo
- Batch download all photos
- Delete individual or all photos
- Responsive grid layout

## Future Enhancement Ideas

When suggesting improvements, consider:

- Video recording capability
- More advanced filters (face detection, beauty filters)
- Social media sharing integration
- Sticker/text overlay features
- Multiple photo collage mode
- Customizable auto mode settings (photo count, delay time)
- ZIP file download for batch export

## Debugging Tips

- Check browser console for camera permission errors
- Verify canvas dimensions match video dimensions
- Test on actual mobile devices (not just browser dev tools)
- Monitor memory usage when capturing many photos
- Check HTTPS requirement for camera access

## When Making Changes

1. **Always test camera functionality** after modifications
2. **Maintain Vietnamese language** for all UI text
3. **Test on mobile devices** as this is primarily a mobile-first app
4. **Preserve existing filter/overlay structure** when adding new ones
5. **Keep the gradient theme consistent** across new components
6. **Ensure responsive design** isn't broken by changes
7. **Add error handling** for any new asynchronous operations

## Dependencies

This project has **NO external dependencies** - keep it that way! Use vanilla JavaScript, CSS, and HTML only.
