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

// active nav
const links = [...document.querySelectorAll('nav a')];
const sections = links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
window.addEventListener('scroll',()=>{
  let current = sections[0]?.id;
  sections.forEach(s=>{ if(scrollY >= s.offsetTop - 180) current = s.id; });
  links.forEach(a=>a.classList.toggle('active', a.getAttribute('href') === '#'+current));
});
links.forEach(a=>a.addEventListener('click',()=>document.querySelector('.navbar nav')?.classList.remove('open')));

// spotlight on interactive cards
const spotSelector = '.timeline-item,.info-card,.feature-card,.vault-card,.credential-card,.service-rail article,.contact-links a';
for (const card of document.querySelectorAll(spotSelector)) {
  card.addEventListener('pointermove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX-r.left}px`);
    card.style.setProperty('--my', `${e.clientY-r.top}px`);
  });
}

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
        openModal({title, body:`<div class="modal-link-card"><p>This project is hosted externally. Click below to open the video sample.</p><a class="btn primary" href="${src}" target="_blank" rel="noopener">Open External Preview <i class='bx bx-right-arrow-alt'></i></a></div>`});
      } else {
        openModal({title, body:`<video src="${src}" controls autoplay></video>`});
      }
    } else if(type === 'image'){
      openModal({title, body:`<img src="${el.dataset.src}" alt="${title}">`});
    } else if(type === 'link'){
      const url = el.dataset.url;
      openModal({title, body:`<div class="modal-link-card"><p>This link contains proof, samples, or credentials connected to my portfolio.</p><a class="btn primary" href="${url}" target="_blank" rel="noopener">Open Link <i class='bx bx-right-arrow-alt'></i></a></div>`});
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

/* V6.5.2 Navigation polish only */
(() => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.navbar .nav-pill');
  const navLinks = [...document.querySelectorAll('.navbar .nav-pill a')];
  if (!navToggle || !navMenu) return;

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };
  const openMenu = () => {
    navMenu.classList.add('open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };
  navToggle.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
})();
