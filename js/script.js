/* Content comes from the supplied portfolio, project links, and speaker evidence. */
'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const web = (id, title, url, description, brand, headline, art = 'srg-art') => ({id, title, url, description, category:'web', label:'Website development', brand, headline, art, tools:['Responsive development','Landing pages','User experience']});
const video = (id, title, videoId, description, category = 'video', label = 'Video editing') => ({id,title,videoId,description,category,label,tools:category === 'ai' ? ['AI creative production','Video editing','Storytelling'] : ['Video editing','Pacing','Sound & captions']});
const projects = [
  web('mds','Mary Digi Solutions','https://marydigisolutions.com/','The business website I developed for Mary Digi Solutions. Service presentation, project showcases, and inquiry pathways brought into one responsive experience.','MARY DIGI SOLUTIONS','Business systems. Built to connect.','mds-art'),
  web('srg','SRG Advisors — Review','https://review.srgadvisors.com/','A dedicated review landing page, built around clear messaging and a structured path to the next step.','SRG ADVISORS','A clearer path to your next decision.'),
  video('chip','Chip Wilson — Founder Story','QcLnIjk2Dn8','Documentary-style storytelling with voiceover, B-roll, and considered pacing.'),
  video('lona','LONA Bag — Product Creative','aTporYmDW9U','AI-assisted e-commerce creative with product-focused visuals and a polished ad format.','ai','AI product creative'),
  {id:'founder',title:'Founder Daily Report Automation',category:'systems',label:'GHL + Google Sheets',description:'A connected reporting flow for daily founder updates, opportunity records, and Google Sheets tracking.',image:'images/founder-tracker-workflow.png',tools:['GoHighLevel','Google Sheets','Opportunity workflows']},
  web('cpa','CPA — Industry Landing Page','https://cpa.marydigisolutions.com/','A focused landing page for the CPA audience, with clear service messaging and a direct next step.','MARY DIGI / CPA','Clarity for your growing practice.','landing-art'),
  web('realestate','Real Estate — Industry Landing Page','https://realestate.marydigisolutions.com/','An audience-specific web experience for real estate, presenting the offer through a focused landing page.','MARY DIGI / REAL ESTATE','Make your next connection count.','landing-art'),
  web('healthcare','Healthcare — Industry Landing Page','https://healthcare.marydigisolutions.com/','A healthcare-focused landing page designed to organize service content and guide visitors toward an inquiry.','MARY DIGI / HEALTHCARE','A more connected experience.','landing-art'),
  web('str','SRG — STR Advisory Review','https://review.srgadvisors.com/str-advisory-review.html','A dedicated advisory review page with offer-specific content and a focused visitor journey.','SRG ADVISORS','STR advisory. A focused review.'),
  web('second','SRG — Second Opinion','https://review.srgadvisors.com/second-opinion.html','A purpose-built landing page for the second-opinion offer, with a clear structure and next step.','SRG ADVISORS','A fresh perspective. A clearer next step.'),
  web('strategy','SRG — Strategy Journey','https://review.srgadvisors.com/strategy','A strategy landing page, supported by my work on multi-step lead capture, qualification forms, and CRM routing.','SRG ADVISORS','Your strategy starts with clarity.'),
  video('cic','CIC Pro — Hearing Aids','R1LLIn18NC8','A product video built around benefits, clear messaging, and a direct-response editing structure.'),
  video('german','Fußwohl — German Market VSL','WfJOJ65yrT8','A commercial-style sales video combining product framing, pacing, and a clear call to action.'),
  video('ai-vsl','AI-Powered VSL','W-hJTS_-Ztc','AI-assisted video production shaped into a sales-focused edit.','ai','AI-assisted sales video'),
  video('mds-video','Mary Digi Solutions — Video','Lv1jWaATdIY','A brand-focused video bringing creative production and digital services together.'),
  video('victoria','Victoria — AI Transition','5h0JCng6r0s','AI model transition content built around visual transformation and short-form pacing.','ai','AI short-form'),
  video('willow','Willow — AI Cosplay','IDkR2tnQ6Ds','Character-driven AI content with stylized transformations and creative editing.','ai','AI character content'),
  video('gta','GTA V — Character Showcase','pA5lpp6oPe4','A gaming-focused character showcase with cinematic movement and transitions.'),
  video('gaming','Game Highlight Reel','AXy5y6aLhsw','Fast cuts and dynamic visual energy built around gameplay highlights.'),
  video('japan','Tranquil Japan 4K','8WpufLL-5Wo','A travel edit with ambient pacing, scenic composition, and a calm visual flow.'),
  video('philippines','Beautiful Philippines','lknvpxGdW_0','Landscape-driven travel content with a clean, cinematic presentation.'),
  {id:'ghl',title:'GoHighLevel Funnel Map',category:'systems',label:'CRM + funnel architecture',description:'A visual map of lead capture, forms, booking, pipeline stages, and follow-up logic.',image:'images/project-ghl.jpg',tools:['GoHighLevel','Forms & calendars','CRM pipelines']},
  {id:'email',title:'Email Campaign Automation',category:'systems',label:'GHL campaign workflows',description:'Scheduled email sequences, contact-tag triggers, and workflow setup for ongoing outreach. Campaign structure and routing supported by hands-on GoHighLevel work.',tools:['Email sequences','Contact tags','Workflow timing']}
];
projects.find(project => project.id === 'mds').screenshot = 'images/mds-website.jpg';
projects.find(project => project.id === 'srg').screenshot = 'images/srg-review.jpg';
const webScreenshots = {cpa:'cpa-landing',realestate:'realestate-landing',healthcare:'healthcare-landing',str:'srg-str',second:'srg-second-opinion',strategy:'srg-strategy'};
Object.entries(webScreenshots).forEach(([id,image])=>{projects.find(project=>project.id===id).screenshot='images/'+image+'.jpg';});
$('#all-count').textContent = projects.length;
let selectedFilter = 'all', expanded = false;
const grid = $('#project-grid'), more = $('#more-projects');
const mockup = p => '<div class="project-media web-art '+escapeHTML(p.art)+'"><div class="browser-mock"><div class="mock-browserbar"><i></i><i></i><i></i><span>'+escapeHTML(new URL(p.url).hostname)+'</span></div><div class="mock-body"><span class="mock-brand">'+escapeHTML(p.brand)+'</span><span class="mock-nav"></span><h4>'+escapeHTML(p.headline)+'</h4><p></p><p></p><span class="mock-cta"></span><div class="mock-shape"></div></div></div><span class="project-chip">WEB DEVELOPMENT</span></div>';
function projectMedia(p, index) {
  if(p.category === 'web') {
    if(p.screenshot) return '<div class="project-media"><img src="'+p.screenshot+'" alt="'+escapeHTML(p.title)+' website screenshot" loading="lazy" width="960" height="600"><span class="project-chip">WEB DEVELOPMENT</span><span class="project-number">'+String(index+1).padStart(2,'0')+' / WEB</span></div>';
    return mockup(p);
  }
  if(p.videoId) return '<div class="project-media"><img src="https://i.ytimg.com/vi/'+p.videoId+'/hqdefault.jpg" alt="'+escapeHTML(p.title)+' video thumbnail" loading="lazy" width="480" height="360"><span class="project-chip">'+escapeHTML(p.label).toUpperCase()+'</span><span class="project-number">'+String(index+1).padStart(2,'0')+' / SELECTED WORK</span><span class="play-badge" aria-hidden="true">▶</span></div>';
  return '<div class="project-media system-art"><div class="mini-flow"><span><b>↳</b> '+(p.id==='email'?'CONTACT TAG':'DAILY REPORT')+'</span><i></i><span><b>◇</b> '+(p.id==='email'?'WORKFLOW + TIMING':'OPPORTUNITY UPDATE')+'</span><i></i><span><b>▦</b> '+(p.id==='email'?'EMAIL SEQUENCE':'REPORTING + TRACKING')+'</span></div><span class="project-chip">AUTOMATION SYSTEM</span></div>';
}
function renderProjects() {
  const matching = projects.filter(p => selectedFilter === 'all' || p.category === selectedFilter);
  const shown = expanded ? matching : matching.slice(0,6);
  grid.innerHTML = shown.map((p,index) => '<article class="project-card" style="animation-delay:'+Math.min(index*35,175)+'ms"><button class="project-button" data-project="'+p.id+'" aria-label="Explore '+escapeHTML(p.title)+'">'+projectMedia(p,index)+'<div class="project-meta"><div><span class="project-category">'+escapeHTML(p.label)+'</span><h3>'+escapeHTML(p.title)+'</h3></div><span aria-hidden="true">↗</span></div></button><p class="project-description">'+escapeHTML(p.description)+'</p></article>').join('');
  $('#project-status').textContent = 'Showing '+shown.length+' of '+matching.length+' projects';
  more.hidden = matching.length <= 6;
  more.innerHTML = expanded ? 'Show featured only <span aria-hidden="true">↑</span>' : 'More from the archive <span aria-hidden="true">↓</span>';
  $$('img', grid).forEach(img => img.addEventListener('error', () => {img.src='images/kenzaki-icon.svg';img.classList.add('thumbnail-fallback');img.alt='KENZAKI — preview unavailable. Open the project to watch.';}, {once:true}));
}
$$('.filter').forEach(button => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter; expanded = false;
  $$('.filter').forEach(filter => {const active = filter === button;filter.classList.toggle('active',active);filter.setAttribute('aria-pressed',String(active));});
  renderProjects();
}));
more.addEventListener('click', () => { expanded = !expanded; renderProjects();if(!expanded) $('#work').scrollIntoView({behavior:motionPaused?'instant':'smooth'}); });
const dialog = $('#project-dialog'), dialogContent = $('#dialog-content');
let dialogTrigger = null;
function showDialog(title, category, html) {
  dialogTrigger = document.activeElement;
  $('#dialog-title').textContent = title;
  $('#dialog-category').textContent = category;
  dialogContent.innerHTML = html;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
  $('.dialog-close').focus();
}
function showProject(id) {
  const p = projects.find(project => project.id === id);
  if(!p) return;
  let media = '', links = '';
  if(p.videoId) {
    media = '<iframe class="video-frame" src="https://www.youtube-nocookie.com/embed/'+p.videoId+'?rel=0" title="'+escapeHTML(p.title)+' video preview" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    links = '<a class="button button-primary" href="https://www.youtube.com/watch?v='+p.videoId+'" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>';
  } else if(p.category === 'web') {
    media = p.screenshot ? '<img class="dialog-image" src="'+p.screenshot+'" alt="'+escapeHTML(p.title)+' screenshot">' : mockup(p);
    links = '<a class="button button-primary" href="'+escapeHTML(p.url)+'" target="_blank" rel="noopener noreferrer">Visit live website ↗</a>';
  } else if(p.image) media = '<img class="dialog-image" src="'+p.image+'" alt="'+escapeHTML(p.title)+' workflow diagram">';
  links += '<a class="button button-outline" href="mailto:jjmanalo.va@gmail.com?subject='+encodeURIComponent('Project inquiry: '+p.title)+'">Discuss a similar project ↗</a>';
  const note = p.videoId ? 'If the embedded player is unavailable, use “Watch on YouTube” to open the original video.' : p.category === 'web' && !p.screenshot ? 'The graphic above is a visual representation. Open the live website to explore the actual project.' : '';
  showDialog(p.title,p.label,media+'<p class="dialog-description">'+escapeHTML(p.description)+'</p><div class="tags dialog-tags">'+p.tools.map(tool=>'<span>'+escapeHTML(tool)+'</span>').join('')+'</div><div class="dialog-links">'+links+'</div>'+(note?'<p class="dialog-note">'+note+'</p>':''));
}
grid.addEventListener('click', event => {const button=event.target.closest('[data-project]');if(button)showProject(button.dataset.project);});
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click', event => {if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{dialogContent.innerHTML='';document.body.style.overflow='';dialogTrigger?.focus();});
$('#workflow-proof').addEventListener('click',()=>showProject('founder'));
const steps = [
  ['01 / INPUT','Start with a clear update.','A submitted daily report becomes the starting point for a connected reporting workflow.'],
  ['02 / ORGANIZE','Keep the work in context.','Opportunity records bring reporting activity into GoHighLevel, keeping updates connected to the operating workflow.'],
  ['03 / SYNC','Make progress easier to see.','Google Sheets tracking provides a central place to review daily updates and reporting status.']
];
$$('[data-step]').forEach(button=>button.addEventListener('click',()=>{
  $$('[data-step]').forEach(node=>{const active=node===button;node.classList.toggle('active',active);node.setAttribute('aria-pressed',String(active));});
  const step=steps[Number(button.dataset.step)];
  $('#step-count').textContent=step[0];$('#step-title').textContent=step[1];$('#step-description').textContent=step[2];
}));
$$('[data-proof]').forEach(button=>button.addEventListener('click',()=>{
  showDialog(button.dataset.title,'CYBERSECURITY SPEAKING · OCTOBER 2, 2026','<img class="dialog-image" src="'+button.dataset.proof+'" alt="'+escapeHTML(button.dataset.title)+'"><p class="dialog-description">Training on Cashless Society and Cybersecurity Awareness. DTI / Negosyo Center Roxas-LGU. October 2, 2026, Roxas, Oriental Mindoro.</p>');
}));
const details=$$('.service-list details');
details.forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open) details.forEach(other=>{if(other!==detail)other.open=false;});
}));
const menu=$('#main-nav'),menuToggle=$('#menu-toggle');
function closeMenu(){menu.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menu.classList.toggle('is-open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
$$('a',menu).forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();}});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
matchMedia('(min-width:641px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
async function copyText(value, status, success) {
  try {await navigator.clipboard.writeText(value);status.textContent=success;}
  catch {status.textContent='Copy this: '+value;}
}
$('#copy-email').addEventListener('click',()=>copyText('jjmanalo.va@gmail.com',$('#copy-status'),'Email copied.'));
$('#copy-discord').addEventListener('click',()=>copyText('kenzaki5885',$('#copy-status'),'Discord username copied.'));
$('#year').textContent=new Date().getFullYear();
const updateTime=()=>{$('#manila-time').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());};
updateTime();setInterval(updateTime,60000);
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let savedMotion=false;
try{savedMotion=localStorage.getItem('kenzaki-motion')==='paused';}catch{}
let motionPaused=reducedMotion.matches||savedMotion;
const motionToggle=$('#motion-toggle');
function applyMotion(){
  document.documentElement.classList.toggle('motion-paused',motionPaused);
  motionToggle.setAttribute('aria-pressed',String(motionPaused));
  motionToggle.setAttribute('aria-label',motionPaused?'Resume animations':'Pause animations');
  motionToggle.title=reducedMotion.matches?'Reduced motion is enabled on your device':motionPaused?'Resume animations':'Pause animations';
  motionToggle.innerHTML='<span aria-hidden="true">'+(motionPaused?'▷':'Ⅱ')+'</span>';
  motionToggle.disabled=reducedMotion.matches;
  syncOrbit();
}
motionToggle.addEventListener('click',()=>{motionPaused=!motionPaused;savedMotion=motionPaused;try{localStorage.setItem('kenzaki-motion',motionPaused?'paused':'playing');}catch{}applyMotion();});
reducedMotion.addEventListener('change',()=>{motionPaused=reducedMotion.matches||savedMotion;applyMotion();});
if('IntersectionObserver' in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('is-pending');entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal').forEach(el=>{if(!motionPaused)el.classList.add('is-pending');revealObserver.observe(el);});
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('a',menu).forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}}),{rootMargin:'-15% 0px -55% 0px'});
  $$('main section[id]').forEach(section=>navObserver.observe(section));
}
let scrollScheduled=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('.scroll-progress').style.transform='scaleX('+(max>0?scrollY/max:0)+')';scrollScheduled=false;}
addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});
addEventListener('resize',updateProgress);
const canvas=$('#orbit-canvas'),context=canvas.getContext('2d');
let orbitFrame=0,orbitVisible=true,orbitWidth=0,orbitHeight=0,lastFrame=0,orbitTime=0;
function drawOrbit(time=0){
  if(!context)return;
  const w=orbitWidth,h=orbitHeight;context.clearRect(0,0,w,h);
  const cx=w*.54,cy=h*.47,r=Math.min(w*.4,h*.34),t=time*.00014;
  for(let ring=0;ring<5;ring++){
    context.beginPath();
    for(let i=0;i<=120;i++){
      const a=i/120*Math.PI*2,tilt=.35+ring*.16;
      const x=Math.cos(a)*r,y=Math.sin(a)*r*Math.cos(tilt*2.2),z=Math.sin(a)*r*Math.sin(tilt*2.2);
      const px=cx+x*Math.cos(t+ring*.4)-y*Math.sin(t+ring*.4),py=cy+(x*Math.sin(t+ring*.4)+y*Math.cos(t+ring*.4))*.8+z*.12;
      i?context.lineTo(px,py):context.moveTo(px,py);
    }
    context.strokeStyle='rgba(65,128,247,'+(.16+ring*.025)+')';context.lineWidth=.65;context.stroke();
    const a=t*1.7+ring*1.25,px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r*.62;
    context.beginPath();context.arc(px,py,ring===2?3:1.7,0,Math.PI*2);context.fillStyle=ring===2?'#a6d7ff':'#518de8';context.shadowBlur=12;context.shadowColor='#367fff';context.fill();context.shadowBlur=0;
  }
  for(let i=0;i<22;i++){const x=((i*83.13)%w),y=((i*167.17)%h);context.fillStyle='rgba(139,175,239,'+(.12+(Math.sin(t*3+i)+1)*.12)+')';context.fillRect(x,y,1,1);}
}
function orbitTick(time){
  orbitFrame=0;
  if(!lastFrame)lastFrame=time;
  if(time-lastFrame>=32){orbitTime+=Math.min(time-lastFrame,80);drawOrbit(orbitTime);lastFrame=time;}
  if(!motionPaused&&orbitVisible&&!document.hidden)orbitFrame=requestAnimationFrame(orbitTick);
}
function syncOrbit(){
  if(orbitFrame)cancelAnimationFrame(orbitFrame);
  orbitFrame=0;lastFrame=0;
  if(!motionPaused&&orbitVisible&&!document.hidden)orbitFrame=requestAnimationFrame(orbitTick);
  else drawOrbit(orbitTime);
}
function resizeOrbit(){
  const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);orbitWidth=box.width;orbitHeight=box.height;
  canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);context?.setTransform(dpr,0,0,dpr,0,0);drawOrbit(orbitTime);
}
new ResizeObserver(resizeOrbit).observe(canvas);
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{orbitVisible=entries[0].isIntersecting;syncOrbit();}).observe(canvas);
document.addEventListener('visibilitychange',syncOrbit);
applyMotion();renderProjects();updateProgress();
