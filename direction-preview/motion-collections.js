/* Collection motion only. portfolio.js remains the source of selection and dialogs. */
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const mix=(from,to,amount)=>from+(to-from)*amount;
const ease=value=>1-Math.pow(1-clamp(value),3);
const seeded=(index,salt)=>{const value=Math.sin((index+1)*127.1+salt*311.7)*43758.5453;return value-Math.floor(value);};

export function initMotionCollections(){
  if(typeof document==='undefined'||!document.body)return {dispose(){}};
  if(document.body.motionCollections)return document.body.motionCollections;
  const body=document.body,systems=document.querySelector('#systems'),stage=systems?.querySelector('.systems-card-stage');
  const cases=stage?[...stage.querySelectorAll('.system-stack-card')]:[];
  const vault=document.querySelector('#vault'),showcase=vault?.querySelector('.orbit-showcase');
  const orbit=vault?.querySelector('#reelsOrbit'),reels=orbit?[...orbit.querySelectorAll('.orbit-card')]:[];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),desktop=window.matchMedia('(min-width:981px)');
  const abort=new AbortController(),options={signal:abort.signal};
  let enabled=false,raf=0,destroyed=false,introStart=null,introDone=false,focusIndex=-1,progress=0;
  let dimensions={width:0,height:0,fanWidth:0},rail=null,railButtons=[];
  const listen=(node,type,handler,extra={})=>node?.addEventListener(type,handler,{...options,...extra});
  const ready=Boolean((stage&&cases.length)||(showcase&&orbit&&reels.length));
  if(!ready)return {dispose(){}};
  body.classList.add('motion-collections-ready');
  if(stage&&cases.length)systems.classList.add('systems-motion-ready');
  if(showcase&&orbit&&reels.length){
    vault.classList.add('reels-motion-ready');
    rail=document.createElement('div');rail.className='motion-reel-index';
    rail.setAttribute('role','group');rail.setAttribute('aria-label','Choose a video in the moving collection');
    railButtons=reels.map((card,index)=>{
      const button=document.createElement('button');button.type='button';
      button.textContent=card.dataset.title||card.querySelector('h3')?.textContent||`Video ${index+1}`;
      button.setAttribute('aria-label',`Show ${button.textContent}`);
      if(!card.id)card.id=`motion-reel-${index}`;
      button.setAttribute('aria-controls',card.id);
      listen(button,'click',()=>{focusIndex=index;card.focus({preventScroll:true});requestPaint();});
      rail.append(button);return button;
    });
    showcase.querySelector('.orbit-sticky')?.append(rail);
  }

  function activeSystem(){return Math.max(0,cases.findIndex(card=>card.classList.contains('active')));}
  function paintSystems(){
    if(!stage||!cases.length)return;
    const active=activeSystem(),spacing=clamp(dimensions.fanWidth*.135,110,184);
    cases.forEach((card,index)=>{
      // The old controller's small arrival animation must not replace the fan transform.
      card.getAnimations?.().filter(animation=>animation.effect?.getKeyframes?.().some(frame=>frame.transform==='translateY(12px)')).forEach(animation=>animation.cancel());
      let offset=index-active;
      const wrapped=offset>0?offset-cases.length:offset+cases.length;
      if(Math.abs(wrapped)<Math.abs(offset))offset=wrapped;
      const distance=Math.abs(offset);
      card.style.setProperty('--fan-x',`${offset*spacing}px`);
      card.style.setProperty('--fan-y',`${distance*17}px`);
      card.style.setProperty('--fan-z',`${-distance*92}px`);
      card.style.setProperty('--fan-rotate',`${offset*9}deg`);
      card.style.setProperty('--fan-tilt',`${distance?8:0}deg`);
      card.style.setProperty('--fan-scale',distance?Math.max(.72,.94-distance*.055):1);
      card.style.setProperty('--fan-opacity',distance?Math.max(.28,.91-distance*.19):1);
      card.style.setProperty('--fan-order',100-distance);
    });
  }
  function paintOrbit(now){
    if(!showcase||!orbit||!reels.length)return false;
    const bounds=showcase.getBoundingClientRect(),sticky=showcase.querySelector('.orbit-sticky');
    progress=clamp(-bounds.top/Math.max(1,showcase.offsetHeight-(sticky?.offsetHeight||innerHeight)));
    const visible=bounds.top<innerHeight&&bounds.bottom>0;
    if(progress>.015){introDone=true;introStart=null;}
    if(visible&&introStart===null&&!introDone)introStart=now;
    const intro=introDone?1:introStart===null?0:clamp((now-introStart)/1800);
    if(intro===1)introDone=true;
    const {width:w,height:h}=dimensions,count=reels.length,center=(count-1)/2;
    const radius=Math.min(w*.30,h*.31),arcRadius=Math.min(w*.57,h*.86);
    const morph=ease(progress/.28),scan=clamp((progress-.18)/.82),spread=(count-1)*15;
    const shift=focusIndex>=0?(center-focusIndex)*15:mix(spread/2,-spread/2,scan);
    reels.forEach((card,index)=>{
      const line={x:(index-center)*Math.min(92,w/(count+1)),y:0,r:0,s:.82};
      const angle=index/count*Math.PI*2-Math.PI/2;
      const circle={x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,r:angle*180/Math.PI+90,s:.83};
      const scatter={x:(seeded(index,1)-.5)*w*.85,y:(seeded(index,2)-.5)*h*.82,r:(seeded(index,3)-.5)*100,s:.55};
      const first=intro<.48,amount=ease(first?intro/.48:(intro-.48)/.52);
      const from=first?scatter:line,to=first?line:circle;
      const degree=-90+(index-center)*15+shift,rad=degree*Math.PI/180;
      const arc={x:Math.cos(rad)*arcRadius,y:Math.sin(rad)*arcRadius+h*.65,r:degree+90,s:1.04};
      const blend=focusIndex>=0?1:morph,base=Object.fromEntries(['x','y','r','s'].map(key=>[key,mix(from[key],to[key],amount)]));
      const values={x:mix(base.x,arc.x,blend),y:mix(base.y,arc.y,blend),r:mix(base.r,arc.r,blend),s:mix(base.s,arc.s,blend)};
      card.style.setProperty('--reel-x',`${values.x.toFixed(2)}px`);
      card.style.setProperty('--reel-y',`${values.y.toFixed(2)}px`);
      card.style.setProperty('--reel-rotate',`${values.r.toFixed(2)}deg`);
      card.style.setProperty('--reel-scale',values.s.toFixed(3));
      card.style.setProperty('--reel-opacity',mix(mix(.45,1,ease(intro)),Math.max(.36,1-Math.abs(degree+90)/180),blend).toFixed(3));
      card.style.setProperty('--reel-order',Math.round(200-Math.abs(degree+90)));
      railButtons[index]?.setAttribute('aria-pressed',String(index===focusIndex));
    });
    const bar=vault.querySelector('.orbit-progress span');if(bar)bar.style.width=`${Math.round(progress*100)}%`;
    return visible&&introStart!==null&&!introDone;
  }
  function paint(now){
    raf=0;if(!enabled||destroyed||document.hidden)return;
    paintSystems();if(paintOrbit(now))requestPaint();
  }
  function requestPaint(){if(enabled&&!raf&&!destroyed&&!document.hidden)raf=requestAnimationFrame(paint);}
  function measure(){
    dimensions={width:orbit?.clientWidth||0,height:orbit?.clientHeight||0,fanWidth:stage?.clientWidth||0};requestPaint();
  }
  function configure(){
    const next=desktop.matches&&!reduce.matches&&!body.classList.contains('motion-paused');
    if(next!==enabled){
      enabled=next;body.classList.toggle('motion-collections-on',enabled);
      if(!enabled){cancelAnimationFrame(raf);raf=0;focusIndex=-1;}
    }
    measure();
  }
  const observer=new MutationObserver(records=>{
    if(records.some(record=>record.target===body))configure();else requestPaint();
  });
  observer.observe(body,{attributes:true,attributeFilter:['class']});
  cases.forEach(card=>observer.observe(card,{attributes:true,attributeFilter:['class']}));
  listen(stage,'keydown',event=>{
    if(!enabled||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();systems.querySelector(event.key==='ArrowLeft'?'[data-stack-prev]':'[data-stack-next]')?.click();
    if(event.target.closest('.system-stack-card'))cases[activeSystem()]?.focus({preventScroll:true});
  });
  cases.forEach((card,index)=>listen(card,'focus',()=>{
    if(enabled&&!card.classList.contains('active'))systems.querySelectorAll('#systemsStackDots button')[index]?.click();
  }));
  reels.forEach((card,index)=>{
    listen(card,'focus',()=>{if(enabled){focusIndex=index;requestPaint();}});
    listen(card,'blur',()=>{focusIndex=-1;requestPaint();});
  });
  listen(window,'scroll',requestPaint,{passive:true});listen(window,'resize',measure,{passive:true});
  listen(window,'portfolio:motion',configure);listen(document,'visibilitychange',requestPaint);
  listen(reduce,'change',configure);listen(desktop,'change',configure);
  const sizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  if(stage)sizeObserver?.observe(stage);if(orbit)sizeObserver?.observe(orbit);
  configure();
  const api={dispose(){
    destroyed=true;abort.abort();observer.disconnect();sizeObserver?.disconnect();cancelAnimationFrame(raf);rail?.remove();
    body.classList.remove('motion-collections-on','motion-collections-ready');
    systems?.classList.remove('systems-motion-ready');vault?.classList.remove('reels-motion-ready');
    [...cases,...reels].forEach(card=>Array.from(card.style).filter(name=>name.startsWith('--fan-')||name.startsWith('--reel-')).forEach(name=>card.style.removeProperty(name)));
    delete body.motionCollections;
  }};
  body.motionCollections=api;return api;
}
