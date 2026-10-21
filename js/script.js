const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(()=>loader?.classList.add('hide'), 650));

// theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('kenzaki-theme');
if (savedTheme === 'light') { document.body.classList.add('light'); if(themeToggle) themeToggle.textContent='☀'; }
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.textContent = isLight ? '☀' : '☾';
  localStorage.setItem('kenzaki-theme', isLight ? 'light' : 'dark');
});

// Smooth scroll with Lenis when available
if (window.Lenis) {
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true, lerp: 0.075, wheelMultiplier: 0.82, touchMultiplier: 0.9 });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
}

// title rotator
const titles = ['Video Editor', 'AI Content Creator', 'GHL Automation Builder', 'Digital Systems Creator', 'VSL & Ads Editor'];
const rotatingTitle = document.getElementById('rotatingTitle');
let titleIndex = 0;
setInterval(() => {
  if(!rotatingTitle) return;
  titleIndex = (titleIndex + 1) % titles.length;
  if(window.gsap){
    gsap.to(rotatingTitle,{opacity:0,y:10,duration:.22,onComplete:()=>{
      rotatingTitle.textContent = titles[titleIndex];
      gsap.to(rotatingTitle,{opacity:1,y:0,duration:.32});
    }});
  } else rotatingTitle.textContent = titles[titleIndex];
}, 2200);

// GSAP reveal
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, { opacity:1, y:0, duration:.8, ease:'power3.out', delay:(i%3)*.04,
      scrollTrigger:{ trigger:el, start:'top 88%' } });
  });
  gsap.to('.hero-visual img', { y:-16, duration:2.8, ease:'sine.inOut', repeat:-1, yoyo:true });
  gsap.from('.metrics div', { opacity:0, y:18, stagger:.08, duration:.7, delay:.35, ease:'power3.out' });
} else {
  const io = new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='none'; io.unobserve(e.target); }}),{threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}



// V6.4.6 smoother page-to-page polish: subtle section lift + title breathing.
if (window.gsap && window.ScrollTrigger) {
  gsap.utils.toArray('.section').forEach((section) => {
    const head = section.querySelector('.section-head');
    if (head) {
      gsap.fromTo(head,
        { opacity: 0.85, y: 22, filter: 'blur(3px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 78%', once: true }
        }
      );
    }
  });

  gsap.utils.toArray('.case-card,.vault-card,.service-card,.credential-card,.info-card,.contact-card').forEach((card) => {
    gsap.fromTo(card,
      { opacity: 0.92, y: 18 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 92%', once: true }
      }
    );
  });
}


// V6 horizontal pinned showcases: scroll down moves cards horizontally first.
if (window.gsap && window.ScrollTrigger && window.innerWidth > 760) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('[data-pin-section]').forEach((section) => {
    const track = section.querySelector('.pin-track');
    if (!track) return;

    const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth + 56);

    gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 10%',
        end: () => `+=${getDistance() + window.innerHeight * 0.35}`,
        pin: true,
        scrub: 1.15,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
  });
}

// active nav — stronger section detection, including sticky Services gallery
const links = [...document.querySelectorAll('.nav-pill a[href^="#"]')];
const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
function updateActiveNav(){
  const probe = window.scrollY + Math.min(window.innerHeight * 0.42, 360);
  let current = sections[0]?.id || 'home';
  sections.forEach(s=>{
    const top = s.offsetTop;
    const bottom = top + s.offsetHeight;
    if(probe >= top && probe < bottom) current = s.id;
  });
  // sticky services sometimes spans visually beyond normal offsets, so prioritize it while its gallery is on screen
  const services = document.getElementById('services');
  if(services){
    const r = services.getBoundingClientRect();
    if(r.top <= window.innerHeight * .45 && r.bottom >= window.innerHeight * .35) current = 'services';
  }
  links.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+current));
}
window.addEventListener('scroll', updateActiveNav, {passive:true});
window.addEventListener('resize', updateActiveNav);
updateActiveNav();
links.forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.navbar nav')?.classList.remove('open');
  setTimeout(updateActiveNav, 120);
}));

// spotlight on interactive cards
const spotSelector = '.timeline-item,.info-card,.feature-card,.vault-card,.credential-card,.service-rail article,.contact-links a';
for (const card of document.querySelectorAll(spotSelector)) {
  card.addEventListener('pointermove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX-r.left}px`);
    card.style.setProperty('--my', `${e.clientY-r.top}px`);
  });
}



// V6.5.4 Glow Credentials Vault — mouse reactive border spotlight, optimized and scoped only to credentials.
(function initGlowCredentials(){
  const cards = Array.from(document.querySelectorAll('[data-glow-card]'));
  if(!cards.length) return;
  const colorMap = {
    blue:{base:220, spread:160}, purple:{base:280, spread:170}, green:{base:145, spread:130}, red:{base:0, spread:150}, orange:{base:32, spread:145}
  };
  cards.forEach(card => {
    const c = colorMap[card.dataset.glowColor] || colorMap.blue;
    card.style.setProperty('--base', c.base);
    card.style.setProperty('--spread', c.spread);
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--x', x.toFixed(1));
      card.style.setProperty('--y', y.toFixed(1));
      card.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(3));
      card.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(3));
    }, {passive:true});
  });
})();

// lightweight premium tilt
// Premium hover without lag: only major cards get a very light tilt.
for (const el of document.querySelectorAll('.feature-card,.info-card')) {
  let rafId = null;
  el.addEventListener('pointermove', (e) => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(1000px) rotateX(${-y*1.4}deg) rotateY(${x*1.8}deg) translateY(-6px)`;
      rafId = null;
    });
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; if(rafId) cancelAnimationFrame(rafId); rafId=null; });
}

// Swiper video vault
if(window.Swiper){
  new Swiper('.videoSwiper', {
    slidesPerView: 1.05,
    spaceBetween: 22,
    speed: 520,
    grabCursor: true,
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: { 720:{slidesPerView:2.1}, 1100:{slidesPerView:3.1} }
  });
}

// Modal system
const modal = document.getElementById('previewModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
function openModal({title, body}){
  modalTitle.textContent = title || 'Preview';
  modalBody.innerHTML = body;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  modal.setAttribute('aria-hidden','true');
  modalBody.innerHTML = '';
}
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click', closeModal));
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

document.querySelectorAll('[data-modal]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    const type = el.dataset.modal;
    const title = el.dataset.title || el.textContent.trim();
    if(type === 'youtube'){
      const id = el.dataset.src;
      openModal({title, body:`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`});
    } else if(type === 'video'){
      const src = el.dataset.src;
      const external = el.dataset.type === 'external';
      if(external){
        openModal({title, body:`<div class="modal-link-card"><p>This preview is available through an external portfolio link.</p><a class="btn primary" href="${src}" target="_blank" rel="noopener">Open Preview <i class='bx bx-right-arrow-alt'></i></a></div>`});
      } else {
        openModal({title, body:`<video src="${src}" controls autoplay></video>`});
      }
    } else if(type === 'system'){
      const image = el.dataset.image || el.querySelector('img')?.src || '';
      const tools = (el.dataset.tools || '').split('•').map(t=>t.trim()).filter(Boolean);
      const result = el.dataset.result || '';
      openModal({title, body:`<div class="modal-system-card"><img src="${image}" alt="${title}"><div class="modal-system-copy"><span>System Case Study</span><h4>${title}</h4><p>${result}</p><div class="modal-system-tools">${tools.map(t=>`<em>${t}</em>`).join('')}</div><div class="modal-system-result"><p>Built to make the workflow clearer, faster to manage, and easier to scale for real business operations.</p></div></div></div>`});
    } else if(type === 'image'){
      openModal({title, body:`<img src="${el.dataset.src}" alt="${title}">`});
    } else if(type === 'link'){
      const url = el.dataset.url;
      openModal({title, body:`<div class="modal-link-card"><p>Open this item to view related samples, credentials, or project proof.</p><a class="btn primary" href="${url}" target="_blank" rel="noopener">Open Item <i class='bx bx-right-arrow-alt'></i></a></div>`});
    } else if(type === 'webdesign'){
      const modal = document.getElementById('previewModal');
      const modalLabel = modal?.querySelector('.modal-label');
      if(modalLabel) modalLabel.textContent = 'Service Packages';
      openModal({title:'Website Design & Development', body: window.__buildWebDesignModal ? window.__buildWebDesignModal() : ''});
      modal?.classList.add('wd-modal-mode');
      // Accordion behavior — attach after modal body is populated
      setTimeout(() => {
        document.querySelectorAll('[data-wd-accordion]').forEach(item => {
          item.querySelector('.wd-accordion-head')?.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('[data-wd-accordion]').forEach(i => {
              i.classList.remove('open');
              i.querySelector('.wd-accordion-head')?.setAttribute('aria-expanded','false');
            });
            if(!isOpen){ item.classList.add('open'); item.querySelector('.wd-accordion-head')?.setAttribute('aria-expanded','true'); }
          });
        });
      }, 50);
    }
  });
});

// particle background - light and smooth
const canvas = document.getElementById('particle-canvas');
const ctx = canvas?.getContext('2d');
let W,H,particles=[];
function resize(){
  if(!canvas) return;
  W=canvas.width=innerWidth; H=canvas.height=innerHeight;
  particles = Array.from({length: Math.min(18, Math.floor(W/70))},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.6+.4}));
}
resize(); addEventListener('resize', resize);
function draw(){
  if(!ctx) return;
  ctx.clearRect(0,0,W,H);
  particles.forEach((p,i)=>{
    p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(99,231,255,.55)'; ctx.fill();
    for(let j=i+1;j<particles.length;j++){
      const q=particles[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.hypot(dx,dy);
      if(d<90){ ctx.strokeStyle=`rgba(99,231,255,${(1-d/90)*.06})`; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke(); }
    }
  });
  requestAnimationFrame(draw);
}
draw();


// Staggered testimonials inspired by the supplied React component, converted to lightweight JS.
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
let testimonialIndex = 0;
function paintTestimonials(){
  if(!testimonialCards.length) return;
  testimonialCards.forEach((card, idx) => {
    card.classList.remove('active','next','prev-card');
    const diff = (idx - testimonialIndex + testimonialCards.length) % testimonialCards.length;
    if(diff === 0) card.classList.add('active');
    else if(diff === 1) card.classList.add('next');
    else if(diff === testimonialCards.length - 1) card.classList.add('prev-card');
    else card.style.opacity = '0';
    if(diff === 0 || diff === 1 || diff === testimonialCards.length - 1) card.style.opacity = '';
  });
}
document.querySelector('.testimonial-nav.next-btn')?.addEventListener('click', () => { testimonialIndex = (testimonialIndex + 1) % testimonialCards.length; paintTestimonials(); });
document.querySelector('.testimonial-nav.prev')?.addEventListener('click', () => { testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length; paintTestimonials(); });
testimonialCards.forEach((card, idx) => card.addEventListener('click', () => { testimonialIndex = idx; paintTestimonials(); }));
paintTestimonials();

// V6.4 FlowArt-inspired journey section (vanilla GSAP conversion)
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopFlow = window.innerWidth > 900;
  const flow = document.querySelector('[data-flow-art]');
  if (flow && !reduceMotion && isDesktopFlow) {
    const flowSections = gsap.utils.toArray('[data-flow-art] [data-flow-section]');
    flowSections.forEach((section, i) => {
      const inner = section.querySelector('.flow-art-container');
      if (!inner) return;
      gsap.set(section, { zIndex: i + 1 });
      if (i > 0) {
        gsap.set(inner, { rotation: 8, y: 50, opacity: 0.9, transformOrigin: 'bottom left' });
        gsap.to(inner, {
          rotation: 0,
          y: 0,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 32%',
            scrub: 1.15
          }
        });
      }
      if (i < flowSections.length - 1) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1
        });
      }
    });
    setTimeout(() => ScrollTrigger.refresh(), 350);
  }
}


// V6.4.6 Hero-only interactive mouse light trails — more visible, still optimized.
(function initHeroTrails(){
  const canvas = document.getElementById('hero-trail-canvas');
  const hero = document.querySelector('.hero');
  if(!canvas || !hero) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth > 900;
  if(reduceMotion || !isDesktop) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if(!ctx) return;

  let rect, width = 0, height = 0, raf = null;
  let active = true;
  let userControlled = false;
  const pointer = { x: 0, y: 0 };
  let idlePhase = 0;

  const settings = {
    trails: 26,
    nodes: 28,
    friction: 0.57,
    dampening: 0.032,
    tension: 0.985,
    lineWidth: 5.2,
    alpha: 0.074
  };

  function resize(){
    rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(!pointer.x && !pointer.y){ pointer.x = width * .54; pointer.y = height * .42; }
  }

  function Node(x=0,y=0){ this.x=x; this.y=y; this.vx=0; this.vy=0; }
  function Line(spring){
    this.spring = spring;
    this.friction = settings.friction + Math.random()*0.025 - 0.012;
    this.nodes = Array.from({length: settings.nodes}, () => new Node(pointer.x, pointer.y));
  }
  Line.prototype.update = function(){
    let spring = this.spring;
    let node = this.nodes[0];
    node.vx += (pointer.x - node.x) * spring;
    node.vy += (pointer.y - node.y) * spring;
    for(let i=0;i<this.nodes.length;i++){
      node = this.nodes[i];
      if(i>0){
        const prev = this.nodes[i-1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * settings.dampening;
        node.vy += prev.vy * settings.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= settings.tension;
    }
  };
  Line.prototype.draw = function(index){
    const nodes = this.nodes;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    for(let i=1;i<nodes.length-2;i++){
      const n=nodes[i], next=nodes[i+1];
      ctx.quadraticCurveTo(n.x, n.y, (n.x+next.x)/2, (n.y+next.y)/2);
    }
    const a = nodes[nodes.length-2], b = nodes[nodes.length-1];
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    const hue = 188 + index * 1.7;
    const alpha = Math.max(0.018, settings.alpha - index * 0.00145);
    ctx.strokeStyle = `hsla(${hue}, 100%, 63%, ${alpha})`;
    ctx.lineWidth = Math.max(1.15, settings.lineWidth - index * 0.09);
    ctx.stroke();
  };

  let lines=[];
  function resetLines(){
    lines = Array.from({length:settings.trails},(_,i)=>new Line(0.31 + (i/settings.trails)*0.034));
  }

  function autoPointer(){
    if(userControlled) return;
    idlePhase += 0.0065;
    const cx = width * 0.50, cy = height * 0.45;
    pointer.x = cx + Math.cos(idlePhase) * Math.min(width * 0.17, 150);
    pointer.y = cy + Math.sin(idlePhase * 1.35) * Math.min(height * 0.12, 90);
  }

  function draw(){
    if(!active){ raf=null; return; }
    autoPointer();
    ctx.globalCompositeOperation='source-over';
    ctx.clearRect(0,0,width,height);
    ctx.globalCompositeOperation='lighter';
    ctx.shadowColor = 'rgba(99,231,255,.28)';
    ctx.shadowBlur = 18;
    lines.forEach((line,i)=>{ line.update(); line.draw(i); });
    ctx.shadowBlur = 0;
    raf = requestAnimationFrame(draw);
  }

  function setPointer(e){
    rect = hero.getBoundingClientRect();
    const touch = e.touches && e.touches[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    pointer.x = clientX - rect.left;
    pointer.y = clientY - rect.top;
    if(pointer.x < 0 || pointer.y < 0 || pointer.x > rect.width || pointer.y > rect.height) return;
    userControlled = true;
    if(!active){ active = true; resetLines(); }
    if(!raf) raf = requestAnimationFrame(draw);
    clearTimeout(setPointer.idleTimer);
    setPointer.idleTimer = setTimeout(()=>{ userControlled = false; }, 1800);
  }

  function stop(){ userControlled=false; }
  resize();
  resetLines();
  if(!raf) raf = requestAnimationFrame(draw);
  hero.addEventListener('mousemove', setPointer, {passive:true});
  hero.addEventListener('touchmove', setPointer, {passive:true});
  hero.addEventListener('mouseenter', setPointer, {passive:true});
  hero.addEventListener('mouseleave', stop);
  window.addEventListener('resize', () => { resize(); resetLines(); }, {passive:true});
})();


// V6.5 no-feature-left-behind: Hero trails, Featured Work, Netflix Vault, Journey Cards, Services, Credentials, Contact Hub are all preserved.

/* V6.6 Navigation — hamburger fix + backdrop + scroll progress + reveal upgrades */
(() => {
  /* --- Scroll progress bar --- */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, {passive: true});

  /* --- Nav backdrop --- */
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  document.body.appendChild(backdrop);

  /* --- Hamburger menu --- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.navbar .nav-pill');
  if (!navToggle || !navMenu) return;
  const navLinks = [...navMenu.querySelectorAll('a')];

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    backdrop.classList.remove('visible');
  };
  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    /* slight delay so display:block kicks in before opacity transition */
    requestAnimationFrame(() => backdrop.classList.add('visible'));
  };

  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

})();

// V6.5.3 Services sticky gallery — vertical scroll friendly, no extra horizontal fatigue.
(function initBuildGallery(){
  const gallery = document.getElementById('buildGallery');
  if(!gallery) return;
  const tiles = Array.from(gallery.querySelectorAll('.build-tile'));
  const image = document.getElementById('buildPreviewImage');
  const tag = document.getElementById('buildPreviewTag');
  const kicker = document.getElementById('buildPreviewKicker');
  const title = document.getElementById('buildPreviewTitle');
  const text = document.getElementById('buildPreviewText');
  const tools = document.getElementById('buildPreviewTools');

  const data = [
    {
      image:'images/project-vsl.jpg', tag:'Editing System', kicker:'01 / Creative Execution', title:'Video Editing',
      text:'I build retention-focused editing systems for ads, reels, talking-head videos, B-roll edits, VSLs, and podcast clips — designed to hold attention and make the message easier to understand.',
      tools:['Filmora','CapCut','Premiere Pro','DaVinci Resolve']
    },
    {
      image:'images/project-ai-video.jpg', tag:'AI Creative Engine', kicker:'02 / AI Production', title:'AI Content Creation',
      text:'I create AI-assisted content workflows for visuals, avatars, voiceovers, transitions, and creative variations that help brands test more ideas faster.',
      tools:['Kling','Higgsfield','Flux','Gemini','ElevenLabs']
    },
    {
      image:'images/project-ghl.jpg', tag:'GHL System', kicker:'03 / CRM + Funnel Build', title:'GoHighLevel Setup',
      text:'I set up client-ready GoHighLevel systems with funnels, forms, calendars, pipelines, tags, opportunities, and CRM structures that support lead capture and follow-up.',
      tools:['GoHighLevel','Funnels','Pipelines','Forms','Calendars']
    },
    {
      image:'images/founder-tracker-workflow.png', tag:'Operations System', kicker:'04 / Business Operations', title:'Automation Workflows',
      text:'I design automation workflows, reporting trackers, lead-routing logic, and SOP support systems that reduce repetitive tasks and improve operational visibility.',
      tools:['Make','n8n','Google Sheets','Automation','SOPs']
    },
    {
      image:'images/project-web.jpg', tag:'Website + Funnel', kicker:'05 / Digital Experience', title:'Web & Funnel Design',
      text:'I build modern website and funnel pages focused on trust, clean presentation, lead capture, responsive design, and clear calls-to-action.',
      tools:['HTML','CSS','JavaScript','GHL Pages','Responsive Design']
    },
    {
      image:'images/project-social.jpg', tag:'Publishing System', kicker:'06 / Distribution System', title:'Content Operations',
      text:'I help organize content machines for repurposing, scheduling, asset management, posting workflows, and performance-based content iteration.',
      tools:['Content Calendar','Reels','Shorts','Posting Workflow','Analytics']
    }
  ];

  function setActive(index){
    const item = data[index];
    if(!item) return;
    tiles.forEach(t => t.classList.toggle('active', Number(t.dataset.build) === index));
    if(window.gsap){
      gsap.to([image, title, text], {opacity:0, y:10, duration:.16, ease:'power1.out', onComplete:()=>{
        image.src = item.image;
        image.alt = item.title + ' preview';
        tag.textContent = item.tag;
        kicker.textContent = item.kicker;
        title.textContent = item.title;
        text.textContent = item.text;
        tools.innerHTML = item.tools.map(tool => `<em>${tool}</em>`).join('');
        gsap.to([image, title, text], {opacity:1, y:0, duration:.42, stagger:.035, ease:'power3.out'});
      }});
    } else {
      image.src = item.image; tag.textContent = item.tag; kicker.textContent = item.kicker; title.textContent = item.title; text.textContent = item.text; tools.innerHTML = item.tools.map(tool => `<em>${tool}</em>`).join('');
    }
  }

  tiles.forEach(tile => {
    tile.addEventListener('mouseenter', () => setActive(Number(tile.dataset.build)));
    tile.addEventListener('focus', () => setActive(Number(tile.dataset.build)));
    tile.addEventListener('click', () => setActive(Number(tile.dataset.build)));
  });

  if(window.gsap && window.ScrollTrigger && window.innerWidth > 1080){
    const triggers = tiles.map((tile) => ScrollTrigger.create({
      trigger: tile,
      start: 'top 62%',
      end: 'bottom 42%',
      onEnter: () => setActive(Number(tile.dataset.build)),
      onEnterBack: () => setActive(Number(tile.dataset.build))
    }));
    setTimeout(()=>ScrollTrigger.refresh(), 300);
  }
})();

// V6.5.5 Interactive Reels Universe — creative orbit gallery replacing Netflix rows.
(function initReelsUniverse(){
  const section = document.getElementById('vault');
  const stage = document.getElementById('reelsOrbit');
  if(!section || !stage) return;
  const cards = Array.from(stage.querySelectorAll('[data-orbit-card]'));
  const progressBar = section.querySelector('.orbit-progress span');
  if(!cards.length) return;

  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.innerWidth <= 780) return;

  const scatter = cards.map((_, i) => ({
    x:(Math.random()-.5)*900,
    y:(Math.random()-.5)*520,
    r:(Math.random()-.5)*90,
    s:.62,
    o:0
  }));

  let introPhase = 0;
  function ease(t){ return 1 - Math.pow(1-t, 3); }
  function lerp(a,b,t){ return a*(1-t)+b*t; }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }

  function paint(progress=0){
    const rect = stage.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const total = cards.length;
    const isSmall = w < 920;
    const circleRadius = Math.min(w,h) * (isSmall ? .27 : .31);
    const arcRadius = Math.min(w * .64, h * .98);
    const arcCenterY = h * .86;
    const spread = isSmall ? 118 : 132;
    const start = -90 - spread/2;
    const step = spread / (total - 1);
    const morph = ease(clamp(progress/.34,0,1));
    const shuffle = ease(clamp((progress-.28)/.72,0,1));
    const shift = -shuffle * spread * .74;

    cards.forEach((card, i) => {
      const lineSpacing = isSmall ? 92 : 112;
      const lineX = (i - (total-1)/2) * lineSpacing;
      const line = {x:lineX, y:0, r:0, s:.88, o:1};
      const angle = (i/total) * Math.PI * 2 - Math.PI/2;
      const circle = {x:Math.cos(angle)*circleRadius, y:Math.sin(angle)*circleRadius + h*.04, r:(angle*180/Math.PI)+90, s:.86, o:1};
      const deg = start + i*step + shift;
      const rad = deg * Math.PI/180;
      const arc = {x:Math.cos(rad)*arcRadius, y:Math.sin(rad)*arcRadius + arcCenterY, r:deg+90, s:isSmall?1.20:1.34, o:1};

      const base = introPhase < .5 ? {
        x:lerp(scatter[i].x,line.x,ease(introPhase*2)),
        y:lerp(scatter[i].y,line.y,ease(introPhase*2)),
        r:lerp(scatter[i].r,line.r,ease(introPhase*2)),
        s:lerp(scatter[i].s,line.s,ease(introPhase*2)),
        o:lerp(scatter[i].o,line.o,ease(introPhase*2))
      } : {
        x:lerp(line.x,circle.x,ease((introPhase-.5)*2)),
        y:lerp(line.y,circle.y,ease((introPhase-.5)*2)),
        r:lerp(line.r,circle.r,ease((introPhase-.5)*2)),
        s:lerp(line.s,circle.s,ease((introPhase-.5)*2)),
        o:1
      };

      const x = lerp(base.x, arc.x, morph);
      const y = lerp(base.y, arc.y, morph);
      const r = lerp(base.r, arc.r, morph);
      const s = lerp(base.s, arc.s, morph);
      const opacity = lerp(base.o, Math.max(.38, 1 - Math.abs(deg + 90) / 165), morph);
      card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${s})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(Math.round(1000 - Math.abs(deg + 90)));
    });
    if(progressBar) progressBar.style.width = `${Math.round(progress*100)}%`;
  }

  let raf = null;
  function updateFromScroll(){
    const r = section.getBoundingClientRect();
    const max = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = clamp(-r.top / max, 0, 1);
    paint(progress);
    raf = null;
  }
  function requestPaint(){ if(!raf) raf = requestAnimationFrame(updateFromScroll); }

  function runIntro(){
    const start = performance.now();
    function tick(now){
      introPhase = clamp((now-start)/1600,0,1);
      paint(0);
      if(introPhase < 1) requestAnimationFrame(tick); else requestPaint();
    }
    requestAnimationFrame(tick);
  }

  let started = false;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !started){ started = true; runIntro(); }
    });
  },{threshold:.25});
  io.observe(section);
  window.addEventListener('scroll', requestPaint, {passive:true});
  window.addEventListener('resize', requestPaint, {passive:true});
  requestPaint();
})();


// V6.5.6 Systems Galaxy Showcase — lightweight CSS/JS version inspired by the uploaded 3D stellar gallery.
(function initSystemsGalaxy(){
  const shell = document.getElementById('systemsGalaxy');
  if(!shell) return;
  const cards = Array.from(shell.querySelectorAll('.system-orbit-card'));
  if(!cards.length) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let rotation = 0;
  let targetRotation = 0;
  let raf = null;
  let paused = false;

  function layout(){
    const rect = shell.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if(window.innerWidth <= 980){
      cards.forEach(card=>{ card.style.transform=''; card.style.opacity=''; });
      return;
    }
    const count = cards.length;
    const rx = Math.min(w * .36, 430);
    const ry = Math.min(h * .28, 220);
    cards.forEach((card,i)=>{
      const angle = ((i / count) * Math.PI * 2) + rotation;
      const x = Math.cos(angle) * rx;
      const y = Math.sin(angle) * ry;
      const depth = (Math.sin(angle) + 1) / 2;
      const scale = .82 + depth * .28;
      const opacity = .52 + depth * .48;
      const z = Math.round(100 + depth * 80);
      const tilt = Math.cos(angle) * -8;
      card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${tilt}deg) scale(${scale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(z);
    });
  }

  function tick(){
    if(!reduced && !paused){ targetRotation += 0.0022; }
    rotation += (targetRotation - rotation) * 0.08;
    layout();
    raf = requestAnimationFrame(tick);
  }

  cards.forEach((card,i)=>{
    card.addEventListener('mouseenter',()=>{
      paused = true;
      targetRotation = -((i / cards.length) * Math.PI * 2) + Math.PI / 2;
    });
    card.addEventListener('mouseleave',()=>{ paused = false; });
    card.addEventListener('focus',()=>{
      paused = true;
      targetRotation = -((i / cards.length) * Math.PI * 2) + Math.PI / 2;
    });
    card.addEventListener('blur',()=>{ paused = false; });
  });

  window.addEventListener('resize', layout, {passive:true});
  layout();
  if(!reduced && window.innerWidth > 980) tick();
})();


// V6.5.7 Systems Card Stack — professional replacement for the previous galaxy layout.
(function initSystemsCardStack(){
  const wrap = document.getElementById('systemsStack');
  if(!wrap) return;
  const stage = wrap.querySelector('.systems-card-stage');
  const cards = Array.from(wrap.querySelectorAll('.system-stack-card'));
  const prev = wrap.querySelector('[data-stack-prev]');
  const next = wrap.querySelector('[data-stack-next]');
  const dotsWrap = wrap.querySelector('#systemsStackDots');
  if(!stage || !cards.length) return;

  let active = 0;
  const maxVisible = 5;
  const maxOffset = Math.floor(maxVisible / 2);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(dotsWrap){
    cards.forEach((_,i)=>{
      const dot = document.createElement('button');
      dot.className = 'stack-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to system ${i+1}`);
      dot.addEventListener('click',()=>setActive(i));
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.stack-dot')) : [];

  function wrapIndex(n){ return ((n % cards.length) + cards.length) % cards.length; }
  function signedOffset(i){
    const raw = i - active;
    const alt = raw > 0 ? raw - cards.length : raw + cards.length;
    return Math.abs(alt) < Math.abs(raw) ? alt : raw;
  }

  function layout(){
    const mobile = window.innerWidth <= 980;
    cards.forEach((card,i)=>{
      card.classList.toggle('is-active', i === active);
      if(mobile){
        card.style.transform = '';
        card.style.opacity = '';
        card.style.zIndex = '';
        return;
      }
      const off = signedOffset(i);
      const abs = Math.abs(off);
      const visible = abs <= maxOffset;
      const spacing = Math.min(260, Math.max(190, stage.clientWidth * 0.19));
      const x = off * spacing;
      const y = abs * 15;
      const rot = off * 10;
      const scale = off === 0 ? 1.03 : Math.max(.78, .94 - abs * .05);
      const opacity = visible ? (off === 0 ? 1 : Math.max(.38, 1 - abs * .22)) : 0;
      const z = 100 - abs;
      card.style.transform = `translate3d(${x}px, ${y}px, ${-abs * 90}px) rotateZ(${rot}deg) rotateX(${off===0?0:8}deg) scale(${scale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(z);
      card.style.pointerEvents = visible ? 'auto' : 'none';
    });
    dots.forEach((d,i)=>d.classList.toggle('is-active',i===active));
  }
  function setActive(i){ active = wrapIndex(i); layout(); }
  if(prev) prev.addEventListener('click',()=>setActive(active-1));
  if(next) next.addEventListener('click',()=>setActive(active+1));
  stage.addEventListener('keydown',(e)=>{ if(e.key==='ArrowLeft') setActive(active-1); if(e.key==='ArrowRight') setActive(active+1); });
  cards.forEach((card,i)=>{
    card.addEventListener('mouseenter',()=>{ if(window.innerWidth > 980) setActive(i); });
    card.addEventListener('focus',()=>setActive(i));
  });
  let startX = 0;
  stage.addEventListener('pointerdown',e=>{ startX = e.clientX; });
  stage.addEventListener('pointerup',e=>{
    const delta = e.clientX - startX;
    if(Math.abs(delta) > 60){ setActive(active + (delta < 0 ? 1 : -1)); }
  });
  window.addEventListener('resize', layout, {passive:true});
  layout();
})();

/* ============================================================
   V7.0 — DOCK NAV (magnification) + SCROLL EFFECTS + POLISH
   ============================================================ */

/* --- Magnetic buttons: pull toward cursor when nearby --- */
(() => {
  if (window.innerWidth < 981) return; // desktop-only, avoid touch jank
  const magnets = document.querySelectorAll('.magnetic');
  const STRENGTH = 0.35;
  const RADIUS = 90;

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(relX, relY);
      if (dist < RADIUS * 2.2) {
        btn.style.transform = `translate(${relX * STRENGTH}px, ${relY * STRENGTH}px)`;
      }
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* --- Cursor spotlight: subtle radial glow following the cursor --- */
(() => {
  if (window.innerWidth < 981) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const spotlight = document.createElement('div');
  spotlight.id = 'cursor-spotlight';
  document.body.appendChild(spotlight);

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let curX = mouseX, curY = mouseY;

  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

  function animateSpotlight(){
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;
    spotlight.style.transform = `translate(${curX}px, ${curY}px)`;
    requestAnimationFrame(animateSpotlight);
  }
  animateSpotlight();
})();

/* --- Scroll parallax: background glows drift at different speeds --- */
(() => {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layers = document.querySelectorAll('.hero::after, .reels-universe::before');
  // Pseudo-elements can't be selected by JS directly; instead parallax real elements:
  const parallaxTargets = [
    { el: document.querySelector('.page-glow'), speed: 0.12 },
    { el: document.querySelector('.orbit'), speed: -0.06 },
  ].filter(t => t.el);

  function onScroll(){
    const y = window.scrollY;
    parallaxTargets.forEach(({ el, speed }) => {
      el.style.transform = (el.style.transform || '').includes('translateX(-50%)')
        ? `translateX(-50%) translateY(${y * speed}px)`
        : `translateY(${y * speed}px)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* --- Staggered word reveal for big section headings --- */
(() => {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const headings = document.querySelectorAll('.section-head h2, .split-head h2');
  headings.forEach(h => {
    if (h.dataset.wordSplit) return; // avoid double-processing
    h.dataset.wordSplit = '1';
    const text = h.textContent;
    h.innerHTML = '';
    text.split(/(\s+)/).forEach(part => {
      if (part.trim() === '') { h.appendChild(document.createTextNode(part)); return; }
      const span = document.createElement('span');
      span.className = 'word-reveal';
      span.textContent = part;
      h.appendChild(span);
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.word-reveal');
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('in'), i * 45);
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  headings.forEach(h => io.observe(h));
})();

/* ============================================================
   WEB DESIGN SERVICE MODAL — Accordion Pricing
   ============================================================ */
(() => {
  const WD_PACKAGES = [
    {
      tier: 'Basic Website',
      price: '₱5,000 – ₱8,000',
      tag: 'Personal & Portfolio',
      icon: '🌱',
      desc: 'Best for simple personal websites, portfolios, freelancers, and small service pages.',
      includes: [
        '1-page responsive website',
        'Home / introduction section',
        'About section',
        'Services, skills, or business info section',
        'Portfolio / works / showcase section',
        'Contact information section',
        'Social media links',
        'Mobile-friendly layout',
        'Clean professional design',
        '1 round of revision',
      ]
    },
    {
      tier: 'Standard Website',
      price: '₱8,000 – ₱15,000',
      tag: 'Small Business & Freelancers',
      icon: '🚀',
      desc: 'Best for small businesses, freelancers, professionals, and service providers.',
      includes: [
        'Multi-section website or up to 3 pages',
        'Home page',
        'About page or section',
        'Services section',
        'Portfolio / projects / business showcase',
        'Contact section',
        'Social media links',
        'Mobile and tablet responsive design',
        'Custom styling based on your brand',
        'Basic SEO setup',
        '2 rounds of revisions',
      ]
    },
    {
      tier: 'Premium Website',
      price: '₱15,000 – ₱25,000',
      tag: 'Modern & Premium',
      icon: '💎',
      desc: 'Best for businesses and professionals who want a more premium and modern website.',
      includes: [
        'Custom premium website design',
        'Up to 5 pages',
        'Strong hero section',
        'About / company profile section',
        'Services page or section',
        'Portfolio / project / case study section',
        'Testimonials or achievements section',
        'Contact form or inquiry section',
        'Basic animations and smooth scrolling',
        'Mobile, tablet, and desktop responsive design',
        'Basic SEO optimization',
        'Deployment support',
        '2 rounds of revisions',
      ]
    },
    {
      tier: 'Business / Pro Website',
      price: '₱25,000+',
      tag: 'Full Business Solution',
      icon: '⚡',
      desc: 'Best for businesses, agencies, consultants, coaches, and service providers who need advanced features.',
      includes: [
        'Premium custom website design',
        'Multiple pages depending on business needs',
        'Service pages',
        'Landing page or lead generation structure',
        'Contact form / lead inquiry form',
        'Booking or appointment section',
        'Analytics setup',
        'Basic automation or integration support',
        'SEO-ready structure',
        'Mobile, tablet, and desktop optimization',
        'Deployment support',
        '2 to 3 rounds of revisions',
      ]
    }
  ];

  const ADDONS = [
    'Domain and hosting setup', 'Website maintenance', 'Additional pages',
    'Copywriting assistance', 'Logo or branding support', 'Booking calendar setup',
    'Contact form automation', 'Google Analytics setup', 'Monthly website updates',
    'Business email setup', 'Website redesign',
  ];

  function buildWebDesignModal() {
    const packagesHTML = WD_PACKAGES.map((pkg, i) => `
      <div class="wd-accordion-item ${i === 0 ? 'open' : ''}" data-wd-accordion>
        <button class="wd-accordion-head" aria-expanded="${i === 0 ? 'true' : 'false'}">
          <span class="wd-acc-icon">${pkg.icon}</span>
          <span class="wd-acc-info">
            <span class="wd-acc-tier">${pkg.tier}</span>
            <span class="wd-acc-tag">${pkg.tag}</span>
          </span>
          <span class="wd-acc-price">${pkg.price}</span>
          <span class="wd-acc-chevron">›</span>
        </button>
        <div class="wd-accordion-body">
          <p class="wd-acc-desc">${pkg.desc}</p>
          <ul class="wd-include-list">
            ${pkg.includes.map(item => `<li><span class="wd-check">✓</span>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');

    const addonsHTML = ADDONS.map(a => `<span class="wd-addon-tag">${a}</span>`).join('');

    return `
      <div class="wd-modal-inner">
        <div class="wd-hero">
          <span class="wd-eyebrow">Professional Service</span>
          <h2 class="wd-title">Website Design & Development</h2>
          <p class="wd-subtitle">Your website is your digital first impression. I build clean, responsive, and professional websites that make your brand look credible online.</p>
        </div>

        <div class="wd-accordion">
          ${packagesHTML}
        </div>

        <div class="wd-extras">
          <div class="wd-addons-block">
            <h4>Optional Add-ons</h4>
            <div class="wd-addons-wrap">${addonsHTML}</div>
          </div>
          <div class="wd-terms-block">
            <div class="wd-term-row">
              <span class="wd-term-icon">🔧</span>
              <div><strong>Maintenance</strong><span>Starts at ₱1,000/month for minor updates, fixes, and basic support.</span></div>
            </div>
            <div class="wd-term-row">
              <span class="wd-term-icon">💳</span>
              <div><strong>Payment Terms</strong><span>50% down payment to start. Remaining 50% before final turnover.</span></div>
            </div>
            <div class="wd-term-row">
              <span class="wd-term-icon">⚠️</span>
              <div><strong>Note</strong><span>Domain, hosting, paid tools, premium plugins, and third-party subscriptions are not included.</span></div>
            </div>
          </div>
        </div>

        <a href="mailto:jjmanalo.va@gmail.com?subject=Website%20Package%20Inquiry" class="wd-cta-btn">
          Message Me Today <span>→</span>
        </a>
      </div>
    `;
  }

  // Register globally so the existing modal handler can call it
  window.__buildWebDesignModal = buildWebDesignModal;

  // Clean up wd-modal-mode class when modal closes
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('previewModal')?.classList.remove('wd-modal-mode');
    });
  });
})();
