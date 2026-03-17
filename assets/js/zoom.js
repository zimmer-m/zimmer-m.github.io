// Initialize medium zoom.
$(document).ready(function() {
  // Publication preview thumbnails are only 60px wide, so medium-zoom's
  // transform-based scaling produces blurry results.  Handle them with a
  // simple full-resolution overlay instead.
  document.querySelectorAll('.preview img[data-zoomable]').forEach(function(img) {
    img.removeAttribute('data-zoomable');
    img.style.cursor = 'zoom-in';

    // Hover preview: overlay a full-res image on top of the thumbnail and
    // scale it up in-place, replicating the old CSS transform effect but crisp.
    var hoverImg = null;
    var scaleFactor = 2.5;
    img.addEventListener('mouseenter', function() {
      var rect = img.getBoundingClientRect();
      var targetW = rect.width * scaleFactor;
      hoverImg = document.createElement('img');
      hoverImg.src = img.src;
      // Render at target (large) size, but start scaled down to thumbnail size
      var initialScale = 1 / scaleFactor;
      hoverImg.style.cssText =
        'position:fixed;pointer-events:none;border-radius:4px;' +
        'box-shadow:0 4px 15px rgba(0,0,0,0.15);z-index:10;' +
        'transform-origin:top left;' +
        'transform:scale(' + initialScale + ');' +
        'transition:transform 0.25s ease;' +
        'top:' + rect.top + 'px;left:' + rect.left + 'px;' +
        'width:' + targetW + 'px;height:auto;';
      document.body.appendChild(hoverImg);
      requestAnimationFrame(function() {
        if (hoverImg) hoverImg.style.transform = 'scale(1)';
      });
    });
    img.addEventListener('mouseleave', function() {
      if (hoverImg) { hoverImg.remove(); hoverImg = null; }
    });

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
