'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let savedPaused = false;
  try { savedPaused = localStorage.getItem('kenzaki-v2-motion') === 'paused'; } catch {}
  let paused = reduced.matches || savedPaused;
  const motionSwitch = $('#motion-switch');
  const hero = $('.hero'), sculpture = $('.kinetic-sculpture'), portrait = $('.portrait');
  const sceneCards = $$('.scene-card'), light = $('.cursor-light');
  const chapter = $('.motion-chapter'), stage = $('.chapter-stage'), cases = $$('.depth-card');
  const caseNames = ['Mary Digi Solutions','SRG Advisors','Insurance & CPA'];
  let currentCase = 0, caseProgress = 0, metrics = {}, dirty = true;
  let pointerX = 0, pointerY = 0, easedX = 0, easedY = 0, pointerInside = false;
  let mouseX = 0, mouseY = 0, trail = [], renderId = 0, lastRender = 0, elapsed = 0;
  let heroVisible = true, chapterVisible = false;
  const canvas = $('#signal-canvas'), ctx = canvas.getContext('2d');
  let width = 0, height = 0, pixelRatio = 1;
  function measure() {
    const rect = hero.getBoundingClientRect();
    width = rect.width; height = rect.height;
    pixelRatio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio); canvas.height = Math.round(height * pixelRatio);
    ctx?.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    const chapterRect = chapter.getBoundingClientRect();
    metrics = {chapterTop:chapterRect.top + scrollY, chapterRange:Math.max(1,chapterRect.height-innerHeight), mobile:innerWidth<=600, heroHeight:rect.height};
    dirty = true; update();
  }
  function updateCase(progress) {
    caseProgress = Math.max(0,Math.min(1,progress));
    const index = Math.round(caseProgress * 2);
    if(index !== currentCase || dirty) {
      currentCase=index;
      $('#case-index').textContent=String(index+1).padStart(2,'0')+' / 03';
      $('#case-name').textContent=caseNames[index];
      $('#case-prev').disabled=index===0; $('#case-next').disabled=index===2;
      cases.forEach((card,i)=>{card.inert=i!==index;card.setAttribute('aria-hidden',String(i!==index));});
    }
    const spread=metrics.mobile?290:430;
    cases.forEach((card,i)=>{
      const offset=i-caseProgress*2;
      const distance=Math.abs(offset);
      const x=offset*spread, y=distance*(metrics.mobile?14:25);
      const z=-distance*(metrics.mobile?165:230);
      const rotateY=-offset*(metrics.mobile?20:27), rotateZ=offset*2.5;
      card.style.transform='translate3d('+x+'px,'+y+'px,'+z+'px) rotateY('+rotateY+'deg) rotateZ('+rotateZ+'deg) scale('+(1-distance*.065)+')';
      card.style.opacity=String(Math.max(.12,1-distance*.38));
      card.style.zIndex=String(10-Math.round(distance*3));
      card.style.filter='brightness('+Math.max(.4,1-distance*.23)+')';
    });
    $('.chapter-progress>span').style.width=((caseProgress*2+1)/3*100)+'%';
  }
  function update() {
    $('.navigation').classList.toggle('is-scrolled',scrollY>60);
    const max=document.documentElement.scrollHeight-innerHeight;
    $('.reading-line').style.transform='scaleX('+(max>0?Math.min(1,scrollY/max):0)+')';
    if(!paused)updateCase((scrollY-(metrics.chapterTop||0))/(metrics.chapterRange||1));
    else updateCase(currentCase/2);
    dirty=false;
  }
  function changeCase(direction) {
    const next=Math.max(0,Math.min(2,currentCase+direction));
    if(paused){currentCase=next;dirty=true;updateCase(next/2);}
    else scrollTo({top:metrics.chapterTop + metrics.chapterRange * next / 2,behavior:'smooth'});
  }
  $('#case-prev').addEventListener('click',()=>changeCase(-1));
  $('#case-next').addEventListener('click',()=>changeCase(1));
  document.addEventListener('keydown',event=>{
    if(!chapterVisible||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.target.closest?.('input'))return;
    if(event.key==='ArrowRight'){event.preventDefault();changeCase(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();changeCase(-1);}
  });
  function drawSignals(time=0) {
    if(!ctx||!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const t=time*.00023;
    const gradient=ctx.createLinearGradient(width*.12,0,width,0);
    gradient.addColorStop(0,'rgba(59,115,170,0)');
    gradient.addColorStop(.3,'rgba(75,157,215,.13)');
    gradient.addColorStop(.7,'rgba(139,214,248,.2)');
    gradient.addColorStop(1,'rgba(55,126,196,0)');
    for(let line=0;line<27;line++){
      ctx.beginPath();
      for(let step=0;step<=64;step++){
        const u=step/64;
        const x=width*(.12+u*.94);
        const bell=Math.sin(u*Math.PI);
        const y=height*(.75-u*.36) + Math.sin(u*7.6+t+line*.045)*height*.065*bell + (line-13)*height*.004 + easedY*15*bell;
        step?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      ctx.strokeStyle=gradient;ctx.lineWidth=.45;ctx.stroke();
    }
    for(let n=0;n<27;n++){
      const x=(n*139.19)%width;
      const y=(n*227.67)%height;
      const alpha=.06+(Math.sin(t*.8+n)+1)*.055;
      ctx.fillStyle='rgba(150,199,236,'+alpha+')';ctx.fillRect(x,y,n%6===0?2:1,n%6===0?2:1);
    }
    if(trail.length>1){
      for(let n=1;n<trail.length;n++){
        const alpha=n/trail.length*.5;
        ctx.beginPath();ctx.moveTo(trail[n-1].x,trail[n-1].y);ctx.lineTo(trail[n].x,trail[n].y);
        ctx.strokeStyle='rgba(109,208,255,'+alpha+')';ctx.lineWidth=n/trail.length*1.4;ctx.shadowColor='#5fc9ff';ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
      }
      if(!pointerInside||time-trail[trail.length-1].at>120)trail.shift();
    }
  }
  function frame(now) {
    renderId=0;
    if(paused||document.hidden)return;
    if(!lastRender)lastRender=now;
    const delta=now-lastRender;
    if(delta>=30){
      elapsed+=Math.min(delta,80);lastRender=now;
      easedX+=(pointerX-easedX)*.065; easedY+=(pointerY-easedY)*.065;
      if(heroVisible){
        const t=elapsed*.001;
        const entrance=Math.min(1,elapsed/1500);
        sculpture.style.transform='translate3d('+(easedX*16)+'px,'+(Math.sin(t*.45)*13+easedY*9)+'px,0) rotateZ('+(-9+Math.sin(t*.22)*5+easedX*3)+'deg) rotateY('+(easedX*12)+'deg) rotateX('+(-easedY*5)+'deg)';
        portrait.style.transform='translate3d('+(easedX*-10*entrance)+'px,'+(easedY*-5)+'px,30px) rotateY('+(easedX*-2.5)+'deg)';
        sceneCards[0].style.transform='translate3d('+(easedX*-23)+'px,'+(easedY*-12)+'px,55px) rotate(4deg)';
        sceneCards[1].style.transform='translate3d('+(easedX*27)+'px,'+(easedY*18)+'px,70px) rotate(-5deg)';
        drawSignals(elapsed);
      }
      if(dirty)update();
    }
    if(heroVisible||chapterVisible||dirty)renderId=requestAnimationFrame(frame);
  }
  function startFrame(){
    if(renderId)cancelAnimationFrame(renderId);renderId=0;lastRender=0;
    if(!paused&&!document.hidden&&(heroVisible||chapterVisible||dirty))renderId=requestAnimationFrame(frame);
  }
  function applyMotion(){
    document.documentElement.classList.toggle('motion-paused',paused);
    motionSwitch.setAttribute('aria-pressed',String(paused));
    motionSwitch.setAttribute('aria-label',paused?'Resume motion':'Pause motion');
    $('.motion-label').textContent=paused?'MOTION PAUSED':'MOTION ON';
    motionSwitch.disabled=reduced.matches;
    motionSwitch.title=reduced.matches?'Reduced motion follows your device setting':paused?'Resume motion':'Pause motion';
    if(paused){pointerX=0;pointerY=0;sculpture.style.transform='rotate(-9deg)';portrait.style.transform='none';light.style.opacity='0';drawSignals(0);}
    dirty=true;measure();startFrame();
  }
  motionSwitch.addEventListener('click',()=>{
    paused=!paused;savedPaused=paused;
    try{localStorage.setItem('kenzaki-v2-motion',paused?'paused':'playing');}catch{}
    applyMotion();
  });
  reduced.addEventListener('change',()=>{paused=reduced.matches||savedPaused;applyMotion();});
  hero.addEventListener('pointermove',event=>{
    if(paused||event.pointerType==='touch')return;
    const box=hero.getBoundingClientRect();
    pointerX=(event.clientX-box.left)/box.width-.5;
    pointerY=(event.clientY-box.top)/box.height-.5;
    pointerInside=true;mouseX=event.clientX-box.left;mouseY=event.clientY-box.top;
    trail.push({x:mouseX,y:mouseY,at:elapsed});if(trail.length>20)trail.shift();
    light.style.opacity='1';light.style.transform='translate3d('+event.clientX+'px,'+event.clientY+'px,0)';
    startFrame();
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;pointerInside=false;light.style.opacity='0';});
  $$('.magnetic').forEach(element=>{
    element.addEventListener('pointermove',event=>{
      if(paused||event.pointerType==='touch')return;
      const r=element.getBoundingClientRect();
      element.style.transform='translate('+((event.clientX-r.left-r.width/2)*.16)+'px,'+((event.clientY-r.top-r.height/2)*.2)+'px)';
    });
    element.addEventListener('pointerleave',()=>element.style.transform='');
  });
  const labels={'kinetic-k':'A / Kinetic K','nexus-k':'B / Nexus K','signature-k':'C / Signature K'};
  $$('input[name="logo-direction"]').forEach(input=>input.addEventListener('change',()=>{
    if(!input.checked)return;
    $$('[data-brand-mark]').forEach(mark=>mark.src='assets/'+input.value+'.svg');
    $$('.logo-option').forEach(option=>option.classList.toggle('selected',option.contains(input)));
    $('#brand-status').textContent='Previewing '+labels[input.value];
  }));
  $$('.logo-option').forEach(option=>{
    option.addEventListener('pointermove',event=>{if(paused||event.pointerType==='touch')return;const r=option.getBoundingClientRect();option.style.setProperty('--lx',(event.clientX-r.left)/r.width*100+'%');option.style.setProperty('--ly',(event.clientY-r.top)/r.height*100+'%');});
    option.addEventListener('pointerleave',()=>{option.style.removeProperty('--lx');option.style.removeProperty('--ly');});
  });
  const roles=['Video Editor','AI Content Creator','Website Developer','Automation Builder','Cybersecurity Speaker'];
  let roleIndex=0,roleTimer=0;
  setInterval(()=>{
    if(paused||document.hidden||!heroVisible)return;
    roleIndex=(roleIndex+1)%roles.length;
    $('.hero-role').classList.add('is-changing');
    clearTimeout(roleTimer);
    roleTimer=setTimeout(()=>{$('#current-role').textContent=roles[roleIndex];$('.role-counter').textContent=String(roleIndex+1).padStart(2,'0')+' / 05';$('.hero-role').classList.remove('is-changing');},210);
  },3500);
  const updateClock=()=>$('#local-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Manila',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
  updateClock();setInterval(updateClock,60000);
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;startFrame();}).observe(hero);
    new IntersectionObserver(entries=>{chapterVisible=entries[0].isIntersecting;startFrame();},{rootMargin:'100px'}).observe(chapter);
  }
  addEventListener('scroll',()=>{dirty=true;if(paused)requestAnimationFrame(update);else startFrame();},{passive:true});
  addEventListener('resize',measure);
  document.addEventListener('visibilitychange',startFrame);
  $('#kinetic-sculpture').addEventListener('error',event=>{event.currentTarget.hidden=true;});
  applyMotion();
})();
