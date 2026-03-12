// Initialize medium zoom.
$(document).ready(function() {
  // Publication preview thumbnails are only 60px wide, so medium-zoom's
  // transform-based scaling produces blurry results.  Handle them with a
  // simple full-resolution overlay instead.
  document.querySelectorAll('.preview img[data-zoomable]').forEach(function(img) {
    img.removeAttribute('data-zoomable');
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      var bgColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--global-bg-color') + 'ee';

      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;opacity:0;transition:opacity 0.3s;';
      overlay.style.background = bgColor;

      var fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 4px 20px rgba(0,0,0,0.15);';
      overlay.appendChild(fullImg);

      var close = function() {
        overlay.style.opacity = '0';
        setTimeout(function() { overlay.remove(); }, 300);
      };
      overlay.addEventListener('click', close);
      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
      });

      document.body.appendChild(overlay);
      // Trigger fade-in on next frame
      requestAnimationFrame(function() { overlay.style.opacity = '1'; });
    });
  });

  // Medium zoom for all other zoomable images (blog posts, etc.)
  medium_zoom = mediumZoom('[data-zoomable]', {
    background: getComputedStyle(document.documentElement)
        .getPropertyValue('--global-bg-color') + 'ee',
    margin: 48,
  })
});
