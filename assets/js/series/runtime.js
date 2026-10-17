/*
 * Series runtime: mounts animated figures and wires up chapter chrome
 * (table of contents, code frames, quizzes). No dependencies.
 *
 * Authoring: <figure class="sx-fig" data-fig="name" data-kind="Animation"
 *                    data-title="short description">
 *              <figcaption>Optional caption.</figcaption>
 *            </figure>
 * Figures register with Series.register('name', (ctx) => { ... }).
 */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var registry = {};

  // ------------------------------------------------------------ helpers --

  function setAttrs(node, attrs) {
    if (!attrs) return node;
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') node.textContent = v;
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    return node;
  }

  function s(tag, attrs, parent) {
    var node = setAttrs(document.createElementNS(SVGNS, tag), attrs);
    if (parent) parent.appendChild(node);
    return node;
  }

  function h(tag, attrs, parent) {
    var node = setAttrs(document.createElement(tag), attrs);
    if (parent) parent.appendChild(node);
    return node;
  }

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  // Progress of a sub-interval [a, b] inside a step's 0..1 progress.
  function span(p, a, b) { return ease((p - a) / (b - a)); }

  function rng(seed) {
    var t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      var r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gauss(rand) {
    var u = 1 - rand(), v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function onVisible(node, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting); });
    }, { threshold: threshold || 0.35 }).observe(node);
  }

  // --------------------------------------------------- figure context --

  function Ctx(fig) {
    this.fig = fig;
    this.id = fig.getAttribute('data-fig');
    var caption = fig.querySelector(':scope > figcaption');
    var head = h('div', { class: 'sx-fig-head' });
    h('span', { class: 'sx-fig-kind', text: fig.getAttribute('data-kind') || 'Figure' }, head);
    if (fig.getAttribute('data-title')) h('span', { class: 'sx-fig-title', text: fig.getAttribute('data-title') }, head);
    this.stage = h('div', { class: 'sx-fig-stage' });
    fig.insertBefore(head, fig.firstChild);
    fig.insertBefore(this.stage, caption || null);
    this.tail = caption || null; // controls go before the caption
  }

  Ctx.prototype.add = function (node) {
    this.fig.insertBefore(node, this.tail);
    return node;
  };

  Ctx.prototype.svg = function (w, hgt, opts) {
    opts = opts || {};
    var node = s('svg', {
      viewBox: '0 ' + (opts.y0 || 0) + ' ' + w + ' ' + hgt,
      width: '100%',
      class: 'sx-svg',
      role: 'img',
      'aria-label': opts.label || this.fig.getAttribute('data-title') || this.id
    }, this.stage);
    node.style.maxWidth = w + 'px';
    node.style.minWidth = (opts.minWidth || 560) + 'px';
    return node;
  };

  Ctx.prototype.controls = function () {
    if (!this._controls) this._controls = this.add(h('div', { class: 'sx-controls' }));
    return this._controls;
  };

  Ctx.prototype.segmented = function (o) {
    var wrap = h('div', { class: 'sx-range' }, this.controls());
    if (o.label) h('span', { class: 'sx-label', text: o.label }, wrap);
    var seg = h('div', { class: 'sx-seg', role: 'group', 'aria-label': o.label || 'options' }, wrap);
    var buttons = o.options.map(function (opt) {
      return h('button', {
        type: 'button',
        text: opt.label,
        'aria-pressed': String(opt.value === o.value),
        onclick: function () { select(opt.value); }
      }, seg);
    });
    function select(v) {
      buttons.forEach(function (b, i) { b.setAttribute('aria-pressed', String(o.options[i].value === v)); });
      o.onChange(v);
    }
    return { select: select };
  };

  Ctx.prototype.slider = function (o) {
    var id = this.id + '-' + (o.id || 'range');
    var wrap = h('div', { class: 'sx-range' }, this.controls());
    h('label', { class: 'sx-label', for: id, text: o.label }, wrap);
    var input = h('input', { type: 'range', id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value }, wrap);
    var out = h('output', { for: id }, wrap);
    var fmt = o.format || String;
    function update() {
      var v = parseFloat(input.value);
      out.textContent = fmt(v);
      o.onInput(v);
    }
    input.addEventListener('input', update);
    out.textContent = fmt(parseFloat(input.value));
    return {
      input: input,
      set: function (v) { input.value = v; update(); },
      disable: function (flag) { input.disabled = flag; }
    };
  };

  Ctx.prototype.readouts = function (list) {
    var grid = this.add(h('div', { class: 'sx-readouts' }));
    var setters = {};
    list.forEach(function (r) {
      var cell = h('div', { class: 'sx-readout' }, grid);
      h('span', { class: 'sx-label', text: r.label }, cell);
      var b = h('b', { class: r.accent ? 'is-accent' : null, text: '–' }, cell);
      setters[r.key] = function (v) { b.textContent = v; };
    });
    return setters;
  };

  /*
   * Continuous animation while the figure is on screen.
   * draw(timeMs) is called every frame; with reduced motion it is drawn once
   * at opts.restTime.
   */
  Ctx.prototype.loop = function (draw, opts) {
    opts = opts || {};
    var running = false, raf = 0, t0 = 0, elapsed = opts.restTime || 0;
    function frame(now) {
      if (!running) return;
      draw(elapsed + (now - t0));
      raf = requestAnimationFrame(frame);
    }
    draw(elapsed);
    if (reducedMotion) return;
    onVisible(this.fig, function (vis) {
      if (vis && !running) { running = true; t0 = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!vis && running) { running = false; cancelAnimationFrame(raf); elapsed += performance.now() - t0; }
    }, 0.1);
  };

  /*
   * Step-through animation with play/pause, step buttons and a scrubber.
   * render(phase, i, p): i is the current step, p its eased progress (0..1);
   * phase(k) gives the progress of any step k (1 = done, 0 = not started).
   */
  Ctx.prototype.stepper = function (o) {
    var n = o.captions.length;
    var transition = o.transition || 1100;
    var dwell = o.dwell || 2600;
    var i = 0, e = transition, playing = false, userPaused = false, last = 0, raf = 0, visible = false;

    var cap = this.add(h('div', { class: 'sx-step-caption', 'aria-live': 'polite' }));
    var capN = h('span', { class: 'sx-step-n' }, cap);
    var capText = h('span', { class: 'sx-step-text' }, cap);

    var bar = this.controls();
    var btns = h('div', { class: 'sx-btns' }, bar);
    var bPrev = h('button', { type: 'button', class: 'sx-btn', 'aria-label': 'Previous step', text: '◀' }, btns);
    var bPlay = h('button', { type: 'button', class: 'sx-btn is-primary', text: '▶ play' }, btns);
    var bNext = h('button', { type: 'button', class: 'sx-btn', 'aria-label': 'Next step', text: '▶|' }, btns);
    var prog = h('div', { class: 'sx-progress' }, bar);
    var fills = o.captions.map(function (c, k) {
      var b = h('button', { type: 'button', 'aria-label': 'Go to step ' + (k + 1) }, prog);
      b.addEventListener('click', function () { userPaused = true; go(k, true); });
      return h('span', null, b);
    });

    function phase(k) { return k < i ? 1 : k > i ? 0 : ease(e / transition); }

    function paint() {
      o.render(phase, i, ease(e / transition));
      fills.forEach(function (f, k) {
        var frac = k < i ? 1 : k > i ? 0 : clamp(e / (transition + dwell), 0, 1);
        f.style.width = (frac * 100).toFixed(1) + '%';
      });
    }

    function setCaption() {
      capN.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      var fresh = capText.cloneNode(false);
      fresh.innerHTML = o.captions[i];
      cap.replaceChild(fresh, capText);
      capText = fresh;
    }

    function go(k, animate) {
      i = (k + n) % n;
      e = animate && !reducedMotion ? 0 : transition;
      setCaption();
      paint();
      if (animate && !playing) { last = performance.now(); raf = requestAnimationFrame(tweenOnly); }
    }

    function tweenOnly(now) {
      if (playing) return;
      e = Math.min(transition, e + (now - last));
      last = now;
      paint();
      if (e < transition) raf = requestAnimationFrame(tweenOnly);
    }

    function tick(now) {
      if (!playing) return;
      e += now - last;
      last = now;
      if (e >= transition + dwell) {
        if (i === n - 1 && o.loop === false) { pause(); e = transition + dwell; paint(); return; }
        i = (i + 1) % n;
        e = 0;
        setCaption();
      }
      paint();
      raf = requestAnimationFrame(tick);
    }

    function play() {
      if (playing) return;
      playing = true;
      bPlay.textContent = '❚❚ pause';
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function pause() {
      playing = false;
      bPlay.textContent = '▶ play';
      cancelAnimationFrame(raf);
    }

    bPlay.addEventListener('click', function () {
      if (playing) { userPaused = true; pause(); }
      else { userPaused = false; if (i === n - 1 && e >= transition + dwell) go(0, false); play(); }
    });
    bPrev.addEventListener('click', function () { userPaused = true; pause(); go(i - 1, true); });
    bNext.addEventListener('click', function () { userPaused = true; pause(); go(i + 1, true); });

    setCaption();
    paint();

    if (!reducedMotion && o.autoplay !== false) {
      onVisible(this.fig, function (vis) {
        visible = vis;
        if (vis && !userPaused) play();
        else if (!vis && playing) pause();
      });
    }
    return { go: go, play: play, pause: pause };
  };

  // ------------------------------------------------------ page chrome --

  function slugify(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function buildToc() {
    var toc = document.querySelector('.sx-toc ol');
    var body = document.querySelector('.sx-body');
    if (!toc || !body) return;
    var heads = Array.prototype.slice.call(body.querySelectorAll('h2'));
    if (heads.length < 2) {
      toc.closest('.sx-toc').hidden = true;
      return;
    }
    var links = heads.map(function (hd) {
      if (!hd.id) hd.id = slugify(hd.textContent);
      var sec = hd.closest('.sx-sec');
      var li = h('li', null, toc);
      var a = h('a', { href: '#' + hd.id }, li);
      var kind = hd.getAttribute('data-kind') || (sec && sec.getAttribute('data-kind'));
      if (kind) h('small', { text: kind }, a);
      a.appendChild(document.createTextNode(hd.textContent.trim()));
      return a;
    });
    if (!heads.length || !('IntersectionObserver' in window)) return;
    var active = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = heads.indexOf(en.target);
          if (active) active.classList.remove('is-active');
          active = links[idx];
          active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-80px 0px -65% 0px' });
    heads.forEach(function (hd) { obs.observe(hd); });
  }

  function frameCode() {
    var blocks = document.querySelectorAll('.sx-body div.highlighter-rouge, .sx-body div.codehilite, .sx-body > pre, .sx-sec > pre');
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.closest('.sx-codeframe')) return;
      var lang = (block.className.match(/language-(\w+)/) || [])[1] ||
        ((block.querySelector('code') || {}).className || '').replace(/.*language-(\w+).*/, '$1');
      var prev = block.previousElementSibling;
      var title = '';
      if (prev && prev.classList.contains('sx-codetitle')) { title = prev.textContent; prev.remove(); }
      var frame = h('div', { class: 'sx-codeframe' });
      block.parentNode.insertBefore(frame, block);
      var head = h('div', { class: 'sx-codeframe-head' }, frame);
      var langOk = lang && !/\s/.test(lang);
      if (title) h('span', { text: title }, head);
      if (langOk) h('span', { class: 'sx-lang', text: lang }, head);
      else if (!title) h('span', { class: 'sx-lang', text: 'code' }, head);
      var btn = h('button', { type: 'button', class: 'sx-btn', text: 'copy' }, head);
      frame.appendChild(block);
      btn.addEventListener('click', function () {
        var text = block.querySelector('pre').innerText;
        var done = function () { btn.textContent = 'copied'; setTimeout(function () { btn.textContent = 'copy'; }, 1400); };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { selectText(block); });
        else selectText(block);
      });
    });
  }

  function selectText(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function quizzes() {
    var all = Array.prototype.slice.call(document.querySelectorAll('.sx-quiz'));
    if (!all.length) return;
    var right = 0, answered = 0;
    var score = h('span', { class: 'sx-score' });
    var first = all[0];
    first.parentNode.insertBefore(score, first);
    function updateScore() { score.textContent = 'Score ' + right + ' / ' + all.length; }
    updateScore();
    all.forEach(function (q) {
      var answer = parseInt(q.getAttribute('data-answer'), 10) - 1;
      var why = q.querySelector('.sx-why');
      if (why) why.hidden = true;
      var items = Array.prototype.slice.call(q.querySelectorAll('ol > li'));
      var buttons = items.map(function (li, k) {
        var b = h('button', { type: 'button', class: 'sx-opt' });
        while (li.firstChild) b.appendChild(li.firstChild);
        li.appendChild(b);
        b.addEventListener('click', function () {
          buttons.forEach(function (x, j) {
            x.disabled = true;
            if (j === answer) x.classList.add('is-right');
          });
          if (k !== answer) b.classList.add('is-wrong');
          else right += 1;
          answered += 1;
          if (why) why.hidden = false;
          updateScore();
        });
        return b;
      });
    });
  }

  function sidebar() {
    var side = document.querySelector('details.sx-side');
    if (!side) return;
    var mq = window.matchMedia('(min-width: 992px)');
    function sync() { if (mq.matches) side.open = true; }
    sync();
    if (!mq.matches) side.open = false; // collapsed on phones until tapped
    if (mq.addEventListener) mq.addEventListener('change', sync);
    var cur = side.querySelector('[aria-current="page"]');
    if (cur && mq.matches) cur.scrollIntoView({ block: 'nearest' });
  }

  function mountFigures() {
    Array.prototype.forEach.call(document.querySelectorAll('figure.sx-fig[data-fig]'), function (fig) {
      var name = fig.getAttribute('data-fig');
      if (!registry[name] || fig.__sxMounted) return;
      fig.__sxMounted = true;
      try { registry[name](new Ctx(fig)); }
      catch (err) { if (window.console) console.error('[series] figure "' + name + '" failed', err); }
    });
  }

  function init() {
    buildToc();
    frameCode();
    quizzes();
    sidebar();
    mountFigures();
  }

  window.Series = {
    register: function (name, fn) { registry[name] = fn; },
    s: s, h: h, clamp: clamp, lerp: lerp, ease: ease, span: span, rng: rng, gauss: gauss,
    reducedMotion: reducedMotion
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else setTimeout(init, 0);
})();
