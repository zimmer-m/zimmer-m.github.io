// Initialize medium zoom.
$(document).ready(function() {
  medium_zoom = mediumZoom('[data-zoomable]', {
    background: getComputedStyle(document.documentElement)
        .getPropertyValue('--global-bg-color') + 'ee',  // + 'ee' for trasparency.
    margin: 48,
    zoom: 0.8  // Zoom to 80% of the original full-zoom size
  })
});
