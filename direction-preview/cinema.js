import {projects} from './projects.js';
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const experience=$('.experience'),shell=$('.cinema-shell'),motionButton=$('#motion-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let engine=null,range=1,top=0,activePanel='intro',activeProject=-1,visible=true,fallback=false;
let savedPaused=false;try{savedPaused=localStorage.getItem('kenzaki-v2-motion')==='paused';}catch{}
let paused=reduced.matches||savedPaused;
const chapters={entrance:0,work:.30,speaking:.86};
const labels={intro:'A DIFFERENT DIMENSION.',passage:'CREATIVE INSTINCT. TECHNICAL DEPTH.',work:'IDEAS, MADE TANGIBLE.',speaking:'MAKE IT MATTER.'};
function syncPanels(progress) {
  const panel=progress<.16?'intro':progress<.275?'passage':progress<.79?'work':'speaking';
  if(panel!==activePanel||!shell.dataset.chapter) {
    activePanel=panel;shell.dataset.chapter=panel;
    $$('.scene-panel').forEach(el=>{const active=el.dataset.panel===panel;el.classList.toggle('is-active',active);el.inert=!active;el.setAttribute('aria-hidden',String(!active));});
    $$('.chapter-rail a').forEach((el,i)=>el.classList.toggle('active',i===(panel==='work'?1:panel==='speaking'?2:0)));
    $('#chapter-caption').textContent=labels[panel];
    const prompt=$('#scroll-prompt');prompt.href=panel==='speaking'?'#about':panel==='work'?'#speaking':'#work';
    $('.scroll-copy').textContent=panel==='speaking'?'MEET THE CREATOR':panel==='work'?'SCROLL THROUGH THE GALLERY':'SCROLL TO STEP INSIDE';
  }
  const index=Math.max(0,Math.min(7,Math.round((progress-.30)/.06)));
  if(index!==activeProject) {
    activeProject=index;const project=projects[index];
    $('#project-count').textContent=String(index+1).padStart(2,'0')+' — 08';
    $('#project-type').textContent=project.type;
    const title=$('#work-title');title.replaceChildren(document.createTextNode(project.title[0]),document.createElement('br'));
    const em=document.createElement('em');em.textContent=project.title[1];title.append(em);
    $('#project-description').textContent=project.description;
    $('#visit-project').href=project.url;$('#visit-project').setAttribute('aria-label','Explore '+project.name+' live site');
    $('#project-prev').disabled=index===0;$('#project-next').disabled=index===7;
    $$('#project-dots button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    shell.dataset.project=String(index+1);
  }
}
function progress(){return Math.max(0,Math.min(1,(scrollY-top)/range));}
function measure(preserve=false){const prior=progress(),inside=scrollY>=top&&scrollY<=top+range;top=experience.getBoundingClientRect().top+scrollY;range=Math.max(1,experience.offsetHeight-shell.offsetHeight);$('#work').style.top=chapters.work*range+'px';$('#speaking').style.top=chapters.speaking*range+'px';engine?.resize();if(preserve&&inside)scrollTo({top:top+range*prior,behavior:'instant'});onScroll();}
function onScroll(){const p=progress();$('.navigation').classList.toggle('is-scrolled',scrollY>50);if(engine)engine.setProgress(p);else syncPanels(p);}
function jumpTo(value,behavior=paused?'auto':'smooth'){scrollTo({top:top+range*value,behavior});}
function jumpProject(index){jumpTo(.30+Math.max(0,Math.min(7,index))*.06);}
projects.forEach((project,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Show '+project.name);button.setAttribute('aria-pressed',String(i===0));button.addEventListener('click',()=>jumpProject(i));$('#project-dots').append(button);});
$('#project-prev').addEventListener('click',()=>jumpProject(activeProject-1));$('#project-next').addEventListener('click',()=>jumpProject(activeProject+1));
document.addEventListener('keydown',event=>{if(activePanel!=='work'||$('#speaking-video').open||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('input,textarea,[contenteditable]'))return;if(event.key==='ArrowRight'){event.preventDefault();jumpProject(activeProject+1);}if(event.key==='ArrowLeft'){event.preventDefault();jumpProject(activeProject-1);}});
$$('a[href^="#"]').forEach(anchor=>anchor.addEventListener('click',event=>{
  const id=anchor.getAttribute('href').slice(1);
  if(!(id in chapters))return;event.preventDefault();
  history.replaceState(null,'','#'+id);
  if(fallback){const target=id==='work'?$('.fallback-projects'):id==='speaking'?$('.fallback-proof'):experience;target.scrollIntoView({behavior:paused?'auto':'smooth'});}
  else jumpTo(chapters[id]);
}));
function applyMotion(){document.documentElement.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Resume motion':'Pause motion');$('.motion-label').textContent=paused?'Motion paused':'Motion on';motionButton.disabled=reduced.matches;engine?.setPaused(paused);}
motionButton.addEventListener('click',()=>{savedPaused=!paused;paused=savedPaused;try{localStorage.setItem('kenzaki-v2-motion',paused?'paused':'playing');}catch{}applyMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches||savedPaused;applyMotion();});
shell.addEventListener('pointermove',event=>{if(paused||event.pointerType==='touch')return;const r=shell.getBoundingClientRect();engine?.setPointer((event.clientX-r.left)/r.width-.5,(event.clientY-r.top)/r.height-.5);},{passive:true});
shell.addEventListener('pointerleave',()=>engine?.setPointer(0,0));
addEventListener('scroll',onScroll,{passive:true});let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>measure(true),120);});
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;engine?.setVisible(visible);}).observe(experience);
const updateClock=()=>$('#local-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());updateClock();setInterval(updateClock,60000);
const dialog=$('#speaking-video'),video=dialog.querySelector('video');let overflowBefore='';
function openVideo(){overflowBefore=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();video.play().catch(()=>{});}
$('#watch-speaking').addEventListener('click',openVideo);$('.close-video').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{video.pause();document.documentElement.style.overflow=overflowBefore;});
// A readable gallery remains available if the device cannot render the 3D world.
const fallbackGallery=document.createElement('section');fallbackGallery.className='fallback-projects';fallbackGallery.setAttribute('aria-label','Selected work gallery');
projects.forEach(project=>{const article=document.createElement('article'),img=document.createElement('img'),heading=document.createElement('h3'),p=document.createElement('p'),a=document.createElement('a');img.src=project.image;img.alt=project.name+' website';img.loading='lazy';heading.textContent=project.name;p.textContent=project.description;a.href=project.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Visit the live site ↗';article.append(img,heading,p,a);fallbackGallery.append(article);});
const proof=document.createElement('article');proof.className='fallback-proof';proof.innerHTML='<img src="../images/speaking-community.webp" alt="Cybersecurity awareness event with DTI and community participants" loading="lazy"><h3>Cybersecurity awareness speaker</h3><p>Training on Cashless Society and Cybersecurity Awareness. DTI / Negosyo Center Roxas-LGU · October 2, 2026.</p><a href="../images/speaking-certificate.webp" target="_blank" rel="noopener">View the certificate ↗</a>';fallbackGallery.append(proof);experience.after(fallbackGallery);
function useFallback(){if(fallback)return;fallback=true;engine?.setVisible(false);document.body.classList.add('no-webgl');document.body.dataset.renderer='fallback';syncPanels(0);measure();}
syncPanels(0);applyMotion();measure();
try {
  const {createExperience}=await import('./scene.js');
  engine=await createExperience($('#scene'),{onFrame:syncPanels,onLoad:value=>$('#load-progress').style.width=Math.round(value*100)+'%',onFailure:useFallback});
  engine.setPaused(paused);engine.setVisible(visible);measure();
  const hash=location.hash.slice(1);if(hash in chapters)jumpTo(chapters[hash],'auto');
} catch(error){console.warn('Opening the standard gallery.',error.message);useFallback();}
