// Restores the original portfolio's scroll signatures without changing its data,
// dialogs, or reading order. Content stays visible when enhancement is unavailable.
let running = null;

export function initMotionSequences() {
  if (running) return running;
  const body = document.body;
  if (!body) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1000px) and (min-height: 700px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const removers = [];
  let frame = 0, enabled = false, wide = false, disposed = false, layoutDirty = true;
  let pointerVisible = false, pointerX = innerWidth / 2, pointerY = innerHeight / 2;
  let glowX = pointerX, glowY = pointerY;
  const clamp = (v, low = 0, high = 1) => Math.min(high, Math.max(low, v));
  const listen = (target, event, callback, options) => {
    target?.addEventListener(event, callback, options);
    removers.push(() => target?.removeEventListener(event, callback, options));
  };
  const flow = document.querySelector('[data-flow-art]');
  const flowCards = [...(flow?.querySelectorAll('[data-flow-section]') || [])];
  const pin = document.querySelector('#featured .featured-pin');
  const track = pin?.querySelector('.featured-track');
  const cases = [...(track?.querySelectorAll('.case-card') || [])];
  const services = document.querySelector('#services');
  const tiles = [...(services?.querySelectorAll('.build-tile[data-build]') || [])];
  let range = null, featureTravel = 0, featureHeight = 0, pinTop = 114;
  let maxHorizontal = 0, expectedLeft = 0, featureEnabled = false;

  if (pin && track && cases.length > 1) {
    range = document.createElement('div');
    range.className = 'motion-featured-range';
    pin.before(range);
    range.append(pin);
  }
  const glow = document.createElement('div');
  glow.className = 'motion-pointer-glow';
  glow.setAttribute('aria-hidden', 'true');
  body.append(glow);

  function request() {
    if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function paused() {
    return reduced.matches || body.classList.contains('motion-paused') ||
      document.documentElement.classList.contains('motion-paused');
  }
  function measure() {
    if (disposed) return;
    layoutDirty = true;
    enabled = !paused();
    wide = enabled && desktop.matches;
    body.classList.toggle('motion-sequences-on', enabled);
    body.dataset.motionSequenceLayout = wide ? 'desktop' : 'reading';
    const nav = document.querySelector('.site-nav,.navigation,.navbar');
    pinTop = Math.round((nav?.getBoundingClientRect().height || 94) + 18);
    if (flow) {
      flow.dataset.msStack = wide ? 'on' : 'off';
      flow.style.setProperty('--ms-stack-top', pinTop + 'px');
      flow.style.setProperty('--ms-story-height', Math.min(480, Math.max(330, innerHeight - pinTop - 70)) + 'px');
      flowCards.forEach((card, i) => {
        card.style.setProperty('--ms-story-layer', String(i + 1));
        if (!wide) card.style.removeProperty('--ms-flow-enter');
      });
    }
    featureEnabled = false;
    if (range && track) {
      range.dataset.msFeatured = wide ? 'on' : 'off';
      range.style.setProperty('--ms-pin-top', pinTop + 'px');
      featureHeight = pin.getBoundingClientRect().height;
      maxHorizontal = Math.max(0, track.scrollWidth - track.clientWidth);
      // Do not pin a tall case on a short display. The existing swipe gallery
      // remains fully usable there, without scaling down or cutting off copy.
      featureEnabled = wide && featureHeight + pinTop + 24 <= innerHeight && maxHorizontal > 8;
      range.dataset.msFeatured = featureEnabled ? 'on' : 'off';
      featureTravel = featureEnabled ? Math.round(innerHeight * 1.1) : 0;
      if (featureEnabled) range.style.height = featureHeight + featureTravel + 'px';
      else range.style.removeProperty('height');
    }
    if (!enabled) {
      glow.style.opacity = '0';
      document.querySelectorAll('[data-ms-magnet]').forEach(resetMagnet);
    }
    request();
  }

  function paint() {
    frame = 0;
    if (disposed || document.hidden) return;
    const updateLayout = layoutDirty;
    layoutDirty = false;
    if (updateLayout && wide && flow) {
      const flowBounds = flow.getBoundingClientRect();
      if (flowBounds.bottom > 0 && flowBounds.top < innerHeight) {
        flowCards.forEach((card, index) => {
          const top = card.getBoundingClientRect().top;
          const arrive = index === 0 ? 1 : clamp((innerHeight - top) / (innerHeight * .68));
          card.style.setProperty('--ms-flow-enter', (1 - arrive).toFixed(4));
        });
      }
    }
    if (updateLayout && featureEnabled && range && track) {
      const r = range.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = clamp((pinTop - r.top) / featureTravel);
        expectedLeft = p * maxHorizontal;
        if (Math.abs(track.scrollLeft - expectedLeft) > .5) track.scrollLeft = expectedLeft;
        range.style.setProperty('--ms-featured-progress', String(p));
      }
    }
    if (updateLayout && wide && services && tiles.length) {
      const bounds = services.getBoundingClientRect();
      if (bounds.top < innerHeight * .7 && bounds.bottom > innerHeight * .3) {
        const readingLine = innerHeight * .43;
        let current = tiles[0];
        for (const tile of tiles) if (tile.getBoundingClientRect().top <= readingLine) current = tile;
        if (!current.classList.contains('active')) {
          // portfolio.js owns the service data and listens to this existing
          // mouse pointer entry. Do not move keyboard focus or open a dialog.
          const event = typeof PointerEvent === 'function'
            ? new PointerEvent('pointerenter', {pointerType: 'mouse'})
            : new Event('pointerenter');
          if (!('pointerType' in event)) Object.defineProperty(event, 'pointerType', {value: 'mouse'});
          current.dispatchEvent(event);
        }
      }
    }
    const showGlow = enabled && finePointer.matches && pointerVisible;
    glow.style.opacity = showGlow ? '1' : '0';
    if (showGlow) {
      glowX += (pointerX - glowX) * .16;
      glowY += (pointerY - glowY) * .16;
      glow.style.transform = `translate3d(${glowX}px,${glowY}px,0)`;
      if (Math.abs(pointerX - glowX) + Math.abs(pointerY - glowY) > .6) request();
    }
  }

  if (range && track) {
    listen(range, 'click', event => {
      if (!featureEnabled) return;
      const button = event.target.closest('[data-featured-prev],[data-featured-next]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      // Handle the click before portfolio.js's native horizontal button handler,
      // so the same selection also advances the vertical pinned sequence.
      const bounds = track.getBoundingClientRect();
      const offsets = cases.map(card => card.getBoundingClientRect().left - bounds.left + track.scrollLeft);
      let nearest = 0;
      offsets.forEach((left, index) => {
        if (Math.abs(left - track.scrollLeft) < Math.abs(offsets[nearest] - track.scrollLeft)) nearest = index;
      });
      const index = clamp(nearest + (button.hasAttribute('data-featured-next') ? 1 : -1), 0, cases.length - 1);
      const targetLeft = clamp(offsets[index], 0, maxHorizontal);
      const start = range.getBoundingClientRect().top + scrollY - pinTop;
      scrollTo({top: start + featureTravel * targetLeft / maxHorizontal, behavior: 'smooth'});
    }, true);
    listen(track, 'scroll', () => {
      if (!featureEnabled || Math.abs(track.scrollLeft - expectedLeft) < 2) return;
      const r = range.getBoundingClientRect();
      if (r.top > pinTop + 2 || r.bottom < pinTop + featureHeight - 2) return;
      // Horizontal trackpad/swipe and keyboard focus retain their native action.
      // Bring document progress to that same position rather than snapping back.
      expectedLeft = track.scrollLeft;
      scrollTo({top: r.top + scrollY - pinTop + featureTravel * clamp(expectedLeft / maxHorizontal), behavior: 'instant'});
    }, {passive: true});
  }

  // Split only text nodes, preserving the existing heading's line spans, links,
  // and accessible text. Unenhanced and reduced-motion headings stay visible.
  const headings = [...document.querySelectorAll('.section-head h2,.story-copy h2')];
  const insertedWords = [];
  headings.forEach(heading => {
    if (heading.dataset.msWords) return;
    heading.dataset.msWords = 'true';
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word.trim()) {fragment.append(document.createTextNode(word)); return;}
        const span = document.createElement('span');
        span.className = 'motion-word';
        span.textContent = word;
        span.style.setProperty('--ms-word-index', String(Math.min(index++, 10)));
        insertedWords.push(span);fragment.append(span);
      });
      node.replaceWith(fragment);
    });
  });
  let headingObserver = null;
  if ('IntersectionObserver' in window) {
    headingObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.msRevealed = 'true';
      headingObserver.unobserve(entry.target);
    }), {threshold: .15, rootMargin: '0px 0px -8% 0px'});
    headings.forEach(heading => headingObserver.observe(heading));
  }

  function resetMagnet(node) {
    node.style.removeProperty('--ms-magnet-x');
    node.style.removeProperty('--ms-magnet-y');
  }
  const magnets = [...document.querySelectorAll('a.magnetic,button.magnetic')];
  magnets.forEach(node => {
    node.dataset.msMagnet = 'true';
    listen(node, 'pointermove', event => {
      if (!enabled || !finePointer.matches || event.pointerType === 'touch') return;
      const r = node.getBoundingClientRect();
      node.style.setProperty('--ms-magnet-x', clamp((event.clientX - r.left - r.width / 2) * .13, -8, 8) + 'px');
      node.style.setProperty('--ms-magnet-y', clamp((event.clientY - r.top - r.height / 2) * .13, -5, 5) + 'px');
    }, {passive: true});
    listen(node, 'pointerleave', () => resetMagnet(node));
    listen(node, 'blur', () => resetMagnet(node));
  });
  listen(window, 'pointermove', event => {
    if (!enabled || !finePointer.matches || event.pointerType === 'touch') return;
    pointerVisible = true;pointerX = event.clientX;pointerY = event.clientY;request();
  }, {passive: true});
  listen(document.documentElement, 'pointerleave', () => {pointerVisible = false;request();});
  listen(window, 'scroll', () => {layoutDirty = true;request();}, {passive: true});
  listen(window, 'resize', measure, {passive: true});
  listen(window, 'portfolio:motion', measure);
  listen(document, 'visibilitychange', () => {
    if (document.hidden) {cancelAnimationFrame(frame);frame = 0;}
    else {layoutDirty = true;request();}
  });
  for (const query of [reduced, desktop, finePointer]) listen(query, 'change', measure);
  const motionObserver = new MutationObserver(() => {
    if (enabled === paused()) measure();
  });
  motionObserver.observe(body, {attributes: true, attributeFilter: ['class']});
  motionObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  // Image/font sizing can alter the natural gallery height. Re-measure only
  // its visible shell; the range itself is never observed (avoids resize loops).
  const sizeObserver = typeof ResizeObserver === 'function' && pin ? new ResizeObserver(measure) : null;
  sizeObserver?.observe(pin);
  document.fonts?.ready.then(() => {if (!disposed) measure();});
  measure();

  running = function cleanup() {
    disposed = true;cancelAnimationFrame(frame);removers.forEach(remove => remove());
    motionObserver.disconnect();headingObserver?.disconnect();sizeObserver?.disconnect();glow.remove();
    body.classList.remove('motion-sequences-on');delete body.dataset.motionSequenceLayout;
    if (flow) {
      delete flow.dataset.msStack;flow.style.removeProperty('--ms-stack-top');flow.style.removeProperty('--ms-story-height');
      flowCards.forEach(card => {card.style.removeProperty('--ms-story-layer');card.style.removeProperty('--ms-flow-enter');});
    }
    if (range?.parentNode) {range.before(pin);range.remove();}
    headings.forEach(heading => {delete heading.dataset.msWords;delete heading.dataset.msRevealed;});
    insertedWords.forEach(word => word.replaceWith(document.createTextNode(word.textContent)));
    magnets.forEach(node => {resetMagnet(node);delete node.dataset.msMagnet;});
    running = null;
  };
  return running;
}
