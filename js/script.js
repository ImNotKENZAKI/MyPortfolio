/* V72 dark default */
(function(){
  try {
    const savedTheme = localStorage.getItem('mds-theme') || localStorage.getItem('md-theme') || 'dark';
    document.body.classList.toggle('dark', savedTheme !== 'light');
    localStorage.setItem('mds-theme', savedTheme === 'light' ? 'light' : 'dark');
    localStorage.setItem('md-theme', savedTheme === 'light' ? 'light' : 'dark');
  } catch(e) {
    document.body.classList.add('dark');
  }
})();

/* V75 premium interaction polish */
(function(){
  const premiumTargets = document.querySelectorAll('.hero2-panel,.hero2-dashboard,.v73-dashboard,.intelligence-board,.intel-card,.v70-service-card,.impact-card,.cap-pill,.enterprise-card,.implementation-timeline article,.office-slide,.work-card,.v84-office-panel,.v84-founder-signal,.system-stack-card');

  premiumTargets.forEach(card => {
    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '18%');
    });
  });

  const hero = document.querySelector('.v73-hero');
  const visual = document.querySelector('.v73-product-visual');
  if(hero && visual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    hero.addEventListener('pointermove', e => {
      const x = (e.clientX / window.innerWidth - .5) * 12;
      const y = (e.clientY / window.innerHeight - .5) * 10;
      visual.style.setProperty('--hero-x', `${x}px`);
      visual.style.setProperty('--hero-y', `${y}px`);
    });
  }
})();


/* V92 Hero 2.0 focused interactions */
(function(){
  const hero = document.querySelector('.hero2');
  if(!hero) return;

  const visual = hero.querySelector('.hero2-visual');
  const leads = hero.querySelector('[data-hero2-leads]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(visual && !reducedMotion && window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove', e => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - .5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - .5) * 10;
      visual.style.setProperty('--hero2-shift-x', `${x}px`);
      visual.style.setProperty('--hero2-shift-y', `${y}px`);
    });

    hero.addEventListener('pointerleave', () => {
      visual.style.setProperty('--hero2-shift-x', '0px');
      visual.style.setProperty('--hero2-shift-y', '0px');
    });
  }

  if(leads && !reducedMotion){
    const start = 96;
    const end = 127;
    const duration = 1300;
    const begin = performance.now();

    function tick(now){
      const progress = Math.min(1, (now - begin) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      leads.textContent = `+${Math.round(start + (end - start) * eased)} Leads`;
      if(progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
})();
/* V70 default dark mode */
(function(){
  try {
    if (!localStorage.getItem('mds-theme')) {
      document.body.classList.add('dark');
      localStorage.setItem('mds-theme','dark');
    }
  } catch(e) {
    document.body.classList.add('dark');
  }
})();
const body=document.body;
const hamburger=document.querySelector('.hamburger');
const nav=document.querySelector('.nav-menu');
const navPill=document.querySelector('.nav-pill');
const links=[...document.querySelectorAll('.nav-menu a')];
const theme=document.querySelector('.theme-toggle');
const pageTransition=document.querySelector('.page-transition');

// Dark remains the default, but visitors can switch themes.
try{
  const savedTheme = localStorage.getItem('mds-theme') || localStorage.getItem('md-theme') || 'dark';
  body.classList.toggle('dark', savedTheme !== 'light');
  localStorage.setItem('mds-theme', savedTheme === 'light' ? 'light' : 'dark');
  localStorage.setItem('md-theme', savedTheme === 'light' ? 'light' : 'dark');
}catch(e){body.classList.add('dark')}
const updateThemeToggleLabel=()=>theme?.setAttribute('aria-label',body.classList.contains('dark')?'Switch to light mode':'Switch to dark mode');
updateThemeToggleLabel();
theme?.addEventListener('click',()=>{
  const next=body.classList.contains('dark')?'light':'dark';
  body.classList.toggle('dark',next==='dark');
  try{localStorage.setItem('mds-theme',next);localStorage.setItem('md-theme',next)}catch(e){}
  updateThemeToggleLabel();
});
hamburger?.addEventListener('click',()=>{hamburger.classList.toggle('active');nav.classList.toggle('open')});
links.forEach(a=>a.addEventListener('click',e=>{hamburger?.classList.remove('active');nav?.classList.remove('open');const href=a.getAttribute('href');if(href&&href.endsWith('.html')&&!location.pathname.endsWith(href)){e.preventDefault();pageTransition?.classList.add('active');setTimeout(()=>location.href=href,360)}}));
function movePill(el){if(!navPill||!el||innerWidth<980)return;const n=nav.getBoundingClientRect(),r=el.getBoundingClientRect();navPill.style.width=r.width+'px';navPill.style.transform=`translateX(${r.left-n.left}px)`}
const active=document.querySelector('.nav-menu a.active')||links[0];setTimeout(()=>movePill(active),120);links.forEach(l=>l.addEventListener('mouseenter',()=>movePill(l)));nav?.addEventListener('mouseleave',()=>movePill(active));window.addEventListener('resize',()=>movePill(active));
const revealTargets=document.querySelectorAll('.reveal,.stagger');
const revealImmediately=!('IntersectionObserver' in window)||window.matchMedia('(max-width:760px)').matches||window.matchMedia('(prefers-reduced-motion:reduce)').matches;
if(revealImmediately){
  revealTargets.forEach(el=>el.classList.add('show'));
}else{
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('show');
    io.unobserve(entry.target);
  }),{threshold:.16});
  revealTargets.forEach(el=>io.observe(el));
}
// counters
const counters=document.querySelectorAll('[data-count]');
if('IntersectionObserver' in window){
  const co=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count);let v=0,step=Math.max(1,Math.ceil(target/55));const timer=setInterval(()=>{v+=step;if(v>=target){v=target;clearInterval(timer)}el.textContent=target===24?`${v}/7`:`${v}+`},24);co.unobserve(el)})},{threshold:.7});
  counters.forEach(c=>co.observe(c));
}else{
  counters.forEach(el=>{const target=Number(el.dataset.count);el.textContent=target===24?`${target}/7`:`${target}+`;});
}
// tilt
Array.from(document.querySelectorAll('.card,.founder-card,.case')).forEach(card=>{card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-6px)`});card.addEventListener('mouseleave',()=>card.style.transform='')});
// tech canvas
const canvas=document.getElementById('techCanvas');if(canvas){const ctx=canvas.getContext('2d');let w,h,p=[];function resize(){w=canvas.width=innerWidth*devicePixelRatio;h=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';const count=Math.min(76,Math.floor(innerWidth/20));p=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.22*devicePixelRatio,vy:(Math.random()-.5)*.22*devicePixelRatio,r:(Math.random()*1.6+.7)*devicePixelRatio}))}function draw(){ctx.clearRect(0,0,w,h);const dark=body.classList.contains('dark');ctx.fillStyle=dark?'rgba(125,211,252,.55)':'rgba(14,165,233,.34)';ctx.strokeStyle=dark?'rgba(125,211,252,.13)':'rgba(14,165,233,.11)';for(const a of p){a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>w)a.vx*=-1;if(a.y<0||a.y>h)a.vy*=-1;ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,Math.PI*2);ctx.fill()}for(let i=0;i<p.length;i++){for(let j=i+1;j<p.length;j++){const a=p[i],b=p[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<132*devicePixelRatio){ctx.globalAlpha=1-d/(132*devicePixelRatio);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}ctx.globalAlpha=1;requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()}


/* Founder card mouse-follow glow */
document.querySelectorAll('.founder-card').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});

/* Founder grayscale-to-color cursor reveal */
document.querySelectorAll('.founder-card').forEach(card=>{
  const img = card.querySelector('img');
  if(img){ card.style.setProperty('--founder-img', `url("${img.getAttribute('src')}")`); }
  card.addEventListener('mousemove', e=>{
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.setProperty('--mx','50%');
    card.style.setProperty('--my','32%');
  });
});


/* Mary Digi V4.2 polish: gradient title accents + stronger founder color reveal */
(function(){
  const targets = document.querySelectorAll('.page-hero h1, .section-heading h2');
  targets.forEach(title => {
    if (title.querySelector('.title-gradient,.gradient-text')) return;
    const text = title.textContent.trim();
    const words = text.split(/\s+/);
    if (words.length < 3) return;
    const lastCount = Math.min(2, words.length - 1);
    const normal = words.slice(0, -lastCount).join(' ');
    const accent = words.slice(-lastCount).join(' ');
    title.innerHTML = `${normal} <span class="title-gradient">${accent}</span>`;
  });

  document.querySelectorAll('.founder-card').forEach(card=>{
    const img = card.querySelector('img');
    if(img){
      card.style.setProperty('--founder-img', `url("${img.getAttribute('src')}")`);
    }
    card.addEventListener('mousemove', e=>{
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','34%');
    });
  });
})();


/* V4.3 Founder spotlight: keeps B&W default and reveals vivid color/scale on hover */
document.querySelectorAll('.founder-card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '34%');
  });
});


/* V4.4 Founder profile spotlight + grayscale-to-color reveal tracking */
document.querySelectorAll('.founder-profile').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '28%');
  });
});


/* V4.6 pointer tracking for premium founder and infographic cards */
document.querySelectorAll('.founder-profile, .founder-infographic div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '22%');
  });
});

/* V4.7 cinematic title/paragraph motion */
(function(){
  const titleTargets = document.querySelectorAll('.section-heading h2, .page-hero h1');
  titleTargets.forEach(title => {
    if(title.dataset.mdMotion === 'ready') return;
    const raw = title.textContent.replace(/\s+/g,' ').trim();
    if(!raw) return;
    const words = raw.split(' ');
    const accentStart = Math.max(words.length - Math.min(2, Math.max(1, words.length - 1)), 0);
    title.innerHTML = words.map((word, index) => {
      const safe = word.replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const accent = index >= accentStart ? ' md-accent' : '';
      return `<span class="md-word${accent}" style="--d:${index}">${safe}</span>`;
    }).join(' ');
    title.classList.add('md-motion-title');
    title.dataset.mdMotion = 'ready';
  });

  document.querySelectorAll('.section-heading p, .page-hero p').forEach(p => {
    p.classList.add('md-text-fade');
  });

  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('md-text-visible');
        textObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.22});

  document.querySelectorAll('.md-motion-title, .md-text-fade').forEach(el => textObserver.observe(el));
})();

/* Final stability pass: founder pointer tracking for the clean card design */
document.querySelectorAll('.founder-profile, .founder-infographic div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '22%');
  });
});


/* V47.1 title + premium polish safety */
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('no-js');

  // Add a clean class to major headings without changing content/layout.
  document.querySelectorAll('.section-heading h2, .page-hero h1, .cta h2').forEach((title) => {
    title.classList.add('premium-heading');
  });

  // Smooth reveal for impact cards if they are added after base observers.
  const impactCards = document.querySelectorAll('.impact-card');
  if (impactCards.length) {
    const impactObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          impactObserver.unobserve(entry.target);
        }
      });
    }, {threshold:.2});
    impactCards.forEach(card => impactObserver.observe(card));
  }
});


/* Mary Digi V48 founder hierarchy pointer tracking + clean title reveal safety */
document.querySelectorAll('.founder-hierarchy-grid .founder-profile, .founder-system-map div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '24%');
  });
});


/* === V76 stable appointment modal handler === */
(function(){
  const appointmentModal = document.getElementById('appointmentModal');

  function openModal(modal){
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function closeModals(){
    document.querySelectorAll('.md-modal.open').forEach(m=>{
      m.classList.remove('open');
      m.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.v76-service-modal,.v75-service-modal,.v74-service-modal,.v73-service-modal').forEach(m=>m.remove());
    document.body.style.overflow='';
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', function(e){
    const btn = e.target.closest('.js-appointment');
    if(!btn) return;
    e.preventDefault();
    closeModals();
    setTimeout(() => openModal(appointmentModal), 20);
  }, true);

  document.addEventListener('click', function(e){
    const close = e.target.closest('[data-close-modal]');
    if(close){
      e.preventDefault();
      closeModals();
    }
  }, true);

  document.addEventListener('click', function(e){
    const card = e.target.closest('.appointment-card');
    if(!card) return;

    const href = card.getAttribute('href') || '';
    if(href.startsWith('#')){
      e.preventDefault();
      closeModals();
      const target = document.querySelector(href);
      setTimeout(() => target?.scrollIntoView({behavior:'smooth', block:'start'}), 50);
    }
  }, true);

  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModals(); });
})();


/* === V53 Portfolio project modal + testimonial fade === */
(function(){
  const videoModal = document.getElementById('videoModal');
  const videoTitle = document.getElementById('videoModalTitle');
  const videoLink = document.getElementById('videoExternalLink');
  const openModal = (modal) => { 
    if(!modal) return; 
    modal.classList.add('open'); 
    modal.setAttribute('aria-hidden','false'); 
    document.body.style.overflow='hidden'; 
  };
  const closeVideo = () => { 
    if(videoModal){ 
      videoModal.classList.remove('open'); 
      videoModal.setAttribute('aria-hidden','true'); 
      document.body.style.overflow=''; 
    } 
  };
  document.querySelectorAll('.work-card').forEach(card => {
    const open = () => {
      const url = card.dataset.url || card.dataset.video;
      if(!url || !videoLink) return;
      const title = card.dataset.title || card.querySelector('h3')?.textContent || 'Project Preview';
      const platform = card.dataset.platform || (url.includes('loom') ? 'Loom' : 'YouTube');
      if(videoTitle) videoTitle.textContent = title;
      videoLink.href = url;
      videoLink.textContent = platform === 'Loom' ? 'Open Loom Walkthrough' : 'Watch on YouTube';
      openModal(videoModal);
    };
    card.querySelectorAll('.play-btn,.video-open').forEach(btn => btn.addEventListener('click', open));
  });
  videoModal?.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeVideo));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeVideo(); });

  const testimonials = [...document.querySelectorAll('.testimonial-card')];
  if(testimonials.length > 1){
    let i = 0;
    setInterval(() => {
      testimonials[i].classList.remove('active');
      i = (i + 1) % testimonials.length;
      testimonials[i].classList.add('active');
    }, 4200);
  }
})();











/* === V76 stable functional fixes === */
(function(){
  // Dark is default on first visit, but light mode is allowed.
  function applyTheme(theme){
    document.body.classList.toggle('dark', theme !== 'light');
  }

  try{
    const saved = localStorage.getItem('mds-theme');
    if(!saved){
      localStorage.setItem('mds-theme','dark');
      applyTheme('dark');
    }else{
      applyTheme(saved);
    }
  }catch(e){
    applyTheme('dark');
  }

  document.addEventListener('click', function(e){
    const toggle = e.target.closest('.theme-toggle');
    if(!toggle) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const isDark = document.body.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    try{ localStorage.setItem('mds-theme', next); }catch(err){}
    applyTheme(next);
  }, true);

  // Single service modal. Also makes Book Appointment inside modal work.
  document.addEventListener("click", function(e){
    const btn = e.target.closest(".v70-service-btn, .learn-more");
    if(!btn) return;

    const card = btn.closest(".v70-service-card, .service-card");
    if(!card) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    document.querySelectorAll(".v76-service-modal,.v75-service-modal,.v74-service-modal,.v73-service-modal").forEach(m => m.remove());

    const title = card.dataset.serviceTitle || card.querySelector("h3")?.textContent || "Service Details";
    const description = card.dataset.serviceDescription || card.querySelector("p")?.textContent || "";
    const bullets = Array.from(card.querySelectorAll("li")).map(li => `<li>${li.textContent}</li>`).join("");

    const overlay = document.createElement("div");
    overlay.className = "v76-service-modal active";
    overlay.innerHTML = `
      <div class="v76-service-modal-card">
        <button class="v76-service-modal-close" type="button" aria-label="Close modal">×</button>
        <span class="eyebrow">Service Details</span>
        <h3>${title}</h3>
        <p>${description}</p>
        ${bullets ? `<ul>${bullets}</ul>` : ""}
        <div class="v76-modal-actions">
          <button class="btn btn-large js-appointment" type="button">Book an Appointment</button>
          <a class="btn glass" href="contact.html#inquiry">Send Inquiry</a>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
  }, true);

  document.addEventListener("click", function(e){
    if(e.target.closest(".v76-service-modal-close") || e.target.classList.contains("v76-service-modal")){
      e.preventDefault();
      document.querySelectorAll(".v76-service-modal").forEach(m => m.remove());
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
  }, true);

})();


/* === V77 dark mode only === */
(function(){
  function forceDarkOnly(){
    document.body.classList.add("dark");
    try { localStorage.setItem("mds-theme", "dark"); } catch(e){}
    document.querySelectorAll(".theme-toggle").forEach(btn => {
      btn.setAttribute("aria-hidden", "true");
      btn.setAttribute("tabindex", "-1");
      btn.style.display = "none";
    });
  }

  forceDarkOnly();
  document.addEventListener("DOMContentLoaded", forceDarkOnly);

  document.addEventListener("click", function(e){
    const toggle = e.target.closest(".theme-toggle");
    if(toggle){
      e.preventDefault();
      e.stopImmediatePropagation();
      forceDarkOnly();
      return false;
    }
  }, true);
})();


/* V78 service card compatibility */
document.addEventListener("click", function(e){
  const btn = e.target.closest(".v78-learn");
  if(!btn) return;
  const card = btn.closest(".v78-service-card");
  if(!card) return;
  // Existing .learn-more handler will process this. This block only prevents dead click layers.
}, true);


/* V78 premium portfolio metadata */
(function(){
  const projects = {
    "Dynamic Motion Graphics": {
      tags: ["JavaScript", "Motion", "Responsive", "Brand Systems"],
      metric: "Executive-ready visual storytelling"
    },
    "German Client VSL": {
      tags: ["Funnels", "Conversion Copy", "Video Sales Letter", "Automation Ready"],
      metric: "Built for offer clarity and action"
    },
    "CIC Pro Hearing Aid": {
      tags: ["Product Video", "Responsive", "Trust Assets", "Conversion Flow"],
      metric: "Benefit-led product presentation"
    },
    "Clinic Funnels PH - Patient Booking Funnel": {
      tags: ["Clinic Funnel", "PH Market", "Lead Capture", "Booking Automation"],
      metric: "Connects the clinic offer, lead form, and strategy-call path"
    },
    "Fußwohl® Leather Shoes": {
      tags: ["Premium Product", "Funnels", "Brand System", "Content Workflow"],
      metric: "High-trust product showcase"
    },
    "How I Built This Website": {
      tags: ["HTML/CSS", "JavaScript", "GoHighLevel", "Business Systems"],
      metric: "10-page CRM-ready website build"
    },
    "A Wellness Website Build": {
      tags: ["Website", "Responsive", "Brand Direction", "Booking Path"],
      metric: "Structured for trust and inquiry"
    }
  };

  function findProject(card){
    const title = card.dataset.title || card.querySelector("h3")?.textContent?.trim() || "";
    const url = card.dataset.url || "";
    if(url.includes("QcLnIjk2Dn8")) return projects["Dynamic Motion Graphics"];
    if(url.includes("aTporYmDW9U")) return projects["German Client VSL"];
    if(url.includes("R1LLIn18NC8")) return projects["CIC Pro Hearing Aid"];
    if(url.includes("WfJOJ65yrT8")) return projects["Fußwohl® Leather Shoes"];
    if(url.includes("en8lbkQVhxY")) return projects["Clinic Funnels PH - Patient Booking Funnel"];
    if(url.includes("4d20b047c8024a799dba6dd3b06a3ac6")) return projects["How I Built This Website"];
    if(url.includes("caa94c965beb4c2ca2e639cea0022e95")) return projects["A Wellness Website Build"];
    return projects[title] || Object.entries(projects).find(([name]) => title.includes(name.split(" ")[0]))?.[1];
  }

  document.querySelectorAll(".work-card").forEach(card => {
    if(card.querySelector(".tech-tags")) return;
    const data = findProject(card);
    if(!data) return;

    const copy = card.querySelector(".work-copy");
    const button = copy?.querySelector(".project-btn,.video-open");
    if(!copy || !button) return;

    const result = document.createElement("div");
    result.className = "project-result";
    result.innerHTML = `<span>Showcase Outcome</span><strong>${data.metric}</strong>`;

    const tags = document.createElement("div");
    tags.className = "tech-tags";
    tags.innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");

    copy.insertBefore(result, button);
    copy.insertBefore(tags, button);
  });
})();


/* V81 autoplay project previews */
(function(){
  function youtubeId(url){
    const short = url.match(/youtu\.be\/([^?&]+)/);
    const watch = url.match(/[?&]v=([^?&]+)/);
    return short?.[1] || watch?.[1] || "";
  }

  function loomId(url){
    return url.match(/loom\.com\/share\/([^?&]+)/)?.[1] || "";
  }

  document.querySelectorAll(".work-card").forEach(card => {
    const thumb = card.querySelector(".work-thumb");
    if(!thumb || thumb.querySelector("iframe")) return;

    const url = card.dataset.url || "";
    const title = card.dataset.title || card.querySelector("h3")?.textContent || "Project preview";
    let src = "";

    const yt = youtubeId(url);
    const loom = loomId(url);
    if(yt && location.protocol !== "file:"){
      src = `https://www.youtube.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&modestbranding=1&playsinline=1&rel=0`;
    }else if(loom){
      src = `https://www.loom.com/embed/${loom}?autoplay=1&muted=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
    }

    if(!src) return;

    const iframe = document.createElement("iframe");
    iframe.className = "work-autoplay";
    iframe.src = src;
    iframe.title = `${title} autoplay preview`;
    iframe.loading = "lazy";
    iframe.allow = "autoplay; encrypted-media; fullscreen; picture-in-picture";
    iframe.setAttribute("aria-hidden", "true");
    thumb.prepend(iframe);
    thumb.classList.add("has-autoplay");
  });
})();


/* V83 office command coverflow carousel */
(function(){
  const carousels = document.querySelectorAll("[data-office-carousel]");
  if(!carousels.length) return;

  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  carousels.forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll("[data-office-slide]"));
    const prev = carousel.querySelector("[data-office-prev]");
    const next = carousel.querySelector("[data-office-next]");
    const dotsWrap = carousel.querySelector("[data-office-dots]");
    if(!slides.length) return;

    let active = 0;
    let paused = false;
    const dots = slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show office view ${index + 1}`);
      dot.addEventListener("click", () => setActive(index));
      dotsWrap?.appendChild(dot);
      return dot;
    });

    function shortestOffset(index){
      let offset = index - active;
      const half = slides.length / 2;
      if(offset > half) offset -= slides.length;
      if(offset < -half) offset += slides.length;
      return offset;
    }

    function render(){
      slides.forEach((slide, index) => {
        const offset = shortestOffset(index);
        const abs = Math.abs(offset);
        const hidden = abs > 2;
        const x = offset * 270;
        const scale = Math.max(.78, 1 - abs * .09);
        const rotate = offset * -12;
        const y = abs === 0 ? -50 : -48 + abs * 1.5;

        slide.style.transform = `translate(-50%, ${y}%) translateX(${x}px) rotateY(${rotate}deg) scale(${scale})`;
        slide.style.opacity = hidden ? "0" : String(Math.max(.28, 1 - abs * .28));
        slide.style.zIndex = String(20 - abs);
        slide.style.pointerEvents = abs === 0 ? "auto" : "none";
        slide.classList.toggle("is-active", abs === 0);
      });

      dots.forEach((dot, index) => dot.classList.toggle("active", index === active));
    }

    function setActive(index){
      active = (index + slides.length) % slides.length;
      render();
    }

    prev?.addEventListener("click", () => setActive(active - 1));
    next?.addEventListener("click", () => setActive(active + 1));
    carousel.addEventListener("mouseenter", () => paused = true);
    carousel.addEventListener("mouseleave", () => paused = false);
    carousel.addEventListener("focusin", () => paused = true);
    carousel.addEventListener("focusout", () => paused = false);

    render();

    if(!reducedMotion){
      window.setInterval(() => {
        if(!paused && !document.hidden) setActive(active + 1);
      }, 1900);
    }
  });
})();


/* V85 scroll-driven systems stack */
(function(){
  const section = document.querySelector("[data-systems-scroll]");
  if(!section) return;
  const stage = section.querySelector("[data-stack-stage]");
  const cards = Array.from(section.querySelectorAll("[data-stack-card]"));
  const progressBar = section.querySelector("[data-stack-progress]");
  if(!stage || !cards.length) return;

  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  let ticking = false;

  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }

  function render(){
    const mobile = window.innerWidth <= 980;
    if(mobile || reduce){
      cards.forEach(card => {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.zIndex = "";
        card.classList.remove("is-active");
      });
      if(progressBar) progressBar.style.width = "100%";
      ticking = false;
      return;
    }

    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / travel, 0, 1);
    const active = progress * (cards.length - 1);

    cards.forEach((card, index) => {
      const offset = index - active;
      const abs = Math.abs(offset);
      const visible = abs < 2.65;
      const x = offset * Math.min(310, Math.max(230, stage.clientWidth * .28));
      const y = abs * 18;
      const z = -abs * 120;
      const rotate = offset * -9;
      const scale = Math.max(.72, 1 - abs * .08);
      const opacity = visible ? Math.max(.16, 1 - abs * .30) : 0;

      card.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${rotate}deg) rotateZ(${offset * 1.5}deg) scale(${scale})`;
      card.style.opacity = opacity.toFixed(3);
      card.style.zIndex = String(Math.round(100 - abs * 10));
      card.classList.toggle("is-active", abs < .5);
    });

    if(progressBar) progressBar.style.width = `${Math.round(progress * 100)}%`;
    ticking = false;
  }

  function requestRender(){
    if(!ticking){
      ticking = true;
      requestAnimationFrame(render);
    }
  }

  window.addEventListener("scroll", requestRender, { passive:true });
  window.addEventListener("resize", requestRender, { passive:true });
  render();
})();


/* V79 vanilla WebGL hero shader */
(function(){
  const canvas = document.getElementById("v79ShaderCanvas");
  if(!canvas) return;
  if(getComputedStyle(canvas).display === "none") return;

  const gl = canvas.getContext("webgl", { alpha:true, antialias:true, premultipliedAlpha:false });
  if(!gl){
    canvas.classList.add("shader-unavailable");
    return;
  }

  const vertexShader = `
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `;

  const fragmentShader = `
    #define TWO_PI 6.2831853072
    #define PI 3.14159265359

    precision highp float;
    uniform vec2 resolution;
    uniform float time;

    void main(void) {
      vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
      float t = time * 0.05;
      float lineWidth = 0.002;

      vec3 color = vec3(0.0);
      for(int j = 0; j < 3; j++){
        for(int i = 0; i < 5; i++){
          color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }
      }

      vec3 brand = vec3(color.r * 0.12, color.g * 0.38, (color.r + color.g + color.b) * 0.58);
      gl_FragColor = vec4(brand, 0.72);
    }
  `;

  function compile(type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vert = compile(gl.VERTEX_SHADER, vertexShader);
  const frag = compile(gl.FRAGMENT_SHADER, fragmentShader);
  if(!vert || !frag) return;

  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.warn(gl.getProgramInfoLog(program));
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "position");
  const time = gl.getUniformLocation(program, "time");
  const resolution = gl.getUniformLocation(program, "resolution");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animationId = 0;
  let tick = 1;

  function resize(){
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function render(){
    tick += reducedMotion ? 0 : 0.05;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1f(time, tick);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if(!reducedMotion) animationId = requestAnimationFrame(render);
  }

  resize();
  render();
  window.addEventListener("resize", resize);
  window.addEventListener("pagehide", () => cancelAnimationFrame(animationId));
})();


/* V79 ruler carousel, converted to plain DOM */
(function(){
  const root = document.querySelector("[data-ruler-carousel]");
  if(!root) return;

  const track = root.querySelector("[data-ruler-track]");
  const items = Array.from(root.querySelectorAll("[data-ruler-item]"));
  const current = root.querySelector("[data-ruler-current]");
  const total = root.querySelector("[data-ruler-total]");
  const prev = root.querySelector("[data-ruler-prev]");
  const next = root.querySelector("[data-ruler-next]");
  if(!track || !items.length) return;

  let active = 0;
  let paused = false;
  if(total) total.textContent = String(items.length);

  function setActive(index){
    active = (index + items.length) % items.length;
    items.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === active));

    const target = items[active];
    const windowRect = track.parentElement.getBoundingClientRect();
    const targetCenter = target.offsetLeft + target.offsetWidth / 2;
    track.style.transform = `translateX(${windowRect.width / 2 - targetCenter}px)`;
    if(current) current.textContent = String(active + 1);
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      paused = true;
      setActive(index);
      window.setTimeout(() => paused = false, 4500);
    });
  });

  prev?.addEventListener("click", () => { paused = true; setActive(active - 1); window.setTimeout(() => paused = false, 4500); });
  next?.addEventListener("click", () => { paused = true; setActive(active + 1); window.setTimeout(() => paused = false, 4500); });
  root.addEventListener("mouseenter", () => paused = true);
  root.addEventListener("mouseleave", () => paused = false);
  window.addEventListener("resize", () => setActive(active));

  setActive(0);
  window.setInterval(() => {
    if(!paused) setActive(active + 1);
  }, 3200);
})();


/* V80 brand-aligned interactive tubes cursor */
(function(){
  const hero = document.querySelector(".v73-hero");
  const canvas = document.getElementById("v80TubesCanvas");
  if(!hero || !canvas) return;

  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  const palettes = [
    ["#0ea5e9", "#2563eb", "#67e8f9"],
    ["#38bdf8", "#0f6fff", "#7dd3fc"],
    ["#1d4ed8", "#06b6d4", "#e0f2fe"]
  ];
  let paletteIndex = 0;
  let dpr = 1;
  let width = 1;
  let height = 1;
  let time = 0;
  const pointer = { x:.64, y:.45 };
  const target = { x:.64, y:.45 };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize(){
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawTube(index, color){
    const yBase = height * (.18 + index * .095);
    const xStart = -80;
    const xEnd = width + 80;
    const influenceX = pointer.x * width;
    const influenceY = pointer.y * height;
    const wave = Math.sin(time * .012 + index * .8) * 34;
    const cp1x = width * (.20 + index * .035);
    const cp2x = width * (.62 - index * .018);
    const cp1y = yBase + wave;
    const cp2y = influenceY + Math.cos(time * .010 + index) * 74;

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = color;
    ctx.shadowBlur = 18 + index * 3;
    ctx.globalAlpha = .095 - index * .006;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(.8, 2.2 - index * .12);
    ctx.beginPath();
    ctx.moveTo(xStart, yBase + index * 18);
    ctx.bezierCurveTo(cp1x, cp1y, influenceX + (index - 4) * 22, cp2y, xEnd, height * (.22 + index * .075));
    ctx.stroke();

    ctx.globalAlpha = .026;
    ctx.lineWidth = Math.max(.6, 4 - index * .22);
    ctx.beginPath();
    ctx.moveTo(xStart, yBase + index * 18 + 18);
    ctx.bezierCurveTo(cp1x + 38, cp1y + 42, cp2x, cp2y - 46, xEnd, height * (.28 + index * .07));
    ctx.stroke();
    ctx.restore();
  }

  function draw(){
    pointer.x += (target.x - pointer.x) * .055;
    pointer.y += (target.y - pointer.y) * .055;
    time += reducedMotion ? 0 : 1;

    ctx.clearRect(0, 0, width, height);
    const colors = palettes[paletteIndex];
    for(let i = 0; i < 9; i++) drawTube(i, colors[i % colors.length]);

    const glow = ctx.createRadialGradient(pointer.x * width, pointer.y * height, 0, pointer.x * width, pointer.y * height, width * .34);
    glow.addColorStop(0, "rgba(14,165,233,.08)");
    glow.addColorStop(.42, "rgba(37,99,235,.035)");
    glow.addColorStop(1, "rgba(2,8,23,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    if(!reducedMotion) requestAnimationFrame(draw);
  }

  hero.addEventListener("pointermove", e => {
    const rect = hero.getBoundingClientRect();
    target.x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    target.y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
  });

  hero.addEventListener("click", e => {
    if(e.target.closest("a,button")) return;
    paletteIndex = (paletteIndex + 1) % palettes.length;
  });

  resize();
  draw();
  window.addEventListener("resize", resize);
})();

document.addEventListener('DOMContentLoaded',()=>{
 const lead=document.querySelector('.v73-panel-title strong');
 if(lead){
 let n=118;
 const t=setInterval(()=>{
   n++;
   lead.textContent='+'+n+' Leads';
   if(n>=127) clearInterval(t);
 },120);
 }
 const hero=document.querySelector('.v73-hero');
 const dash=document.querySelector('.v73-dashboard');
 if(hero && dash){
 hero.addEventListener('mousemove',(e)=>{
  const r=hero.getBoundingClientRect();
  const x=(e.clientX-r.left-r.width/2)/r.width;
  const y=(e.clientY-r.top-r.height/2)/r.height;
  dash.style.transform=`perspective(1400px) rotateY(${x*8-7}deg) rotateX(${-y*5+3}deg)`;
 });
 }
});


/* V88 Hero premium interactions */
(function(){
  const hero = document.querySelector('.v73-hero');
  const dash = document.querySelector('.v73-dashboard');
  const grid = document.querySelector('.v78-animated-grid, .v73-grid-bg');
  const title = document.querySelector('.v88-title');
  const leads = Array.from(document.querySelectorAll('.v73-panel-title strong')).find(el => /Leads/i.test(el.textContent || ''));

  // Animated lead count on load
  if(leads && !leads.dataset.v88Animated){
    leads.dataset.v88Animated = 'true';
    let start = 96;
    const end = 127;
    const duration = 1400;
    const begin = performance.now();

    function tick(now){
      const progress = Math.min(1, (now - begin) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);
      leads.textContent = `+${value} Leads`;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Subtle parallax
  if(hero && dash && window.matchMedia('(pointer:fine)').matches){
    hero.addEventListener('mousemove', function(e){
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - .5);
      const y = ((e.clientY - rect.top) / rect.height - .5);

      dash.style.transform = `rotateY(${-5 + x * 3}deg) rotateX(${2.5 - y * 3}deg) translate3d(${x * 10}px, ${y * 8}px, 0)`;
      if(grid) grid.style.transform = `translate3d(${x * 8}px, ${y * 6}px, 0)`;
      if(title) title.style.transform = `translate3d(${x * -3}px, ${y * -2}px, 0)`;
    });

    hero.addEventListener('mouseleave', function(){
      dash.style.transform = '';
      if(grid) grid.style.transform = '';
      if(title) title.style.transform = '';
    });
  }
})();

/* V98 keep the direct GHL calendar fitted without an outer scrollbar */
(function(){
  const bookingFrame = document.querySelector('.calendar-embed-container iframe[src*="/widget/booking/"]');
  if(!bookingFrame) return;

  const applyCalendarHeight = value => {
    const requestedHeight = Number(value);
    if(!Number.isFinite(requestedHeight)) return;

    const fittedHeight = Math.min(1400, Math.max(820, Math.ceil(requestedHeight)));
    bookingFrame.style.setProperty('height', `${fittedHeight}px`, 'important');
  };

  window.addEventListener('message', event => {
    if(event.origin !== 'https://api.leadconnectorhq.com') return;
    if(!Array.isArray(event.data) || event.data[0] !== 'highlevel.setHeight') return;

    const payload = event.data[1];
    if(!payload || payload.id !== 'msgsndr-calendar') return;
    applyCalendarHeight(payload.height);
  });
})();
