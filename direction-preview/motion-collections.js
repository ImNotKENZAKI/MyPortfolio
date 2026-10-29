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
  const sticky=showcase?.querySelector('.orbit-sticky'),progressBar=vault?.querySelector('.orbit-progress span');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),desktop=window.matchMedia('(min-width:981px)');
  const abort=new AbortController(),options={signal:abort.signal};
  let enabled=false,raf=0,destroyed=false,introDone=false,introElapsed=0,lastOrbitTime=0,focusIndex=-1;
  let needsMeasure=true,systemsDirty=true,orbitDirty=true,arrivalCheck=true;
  let systemsVisible=false,orbitVisible=false,rail=null,railButtons=[];
  let dimensions={width:0,height:0,fanWidth:0,stageTop:0,stageHeight:0,showcaseTop:0,showcaseHeight:0,travel:1};
  let geometry=[],lastOrbitState='',lastSystemIndex=-1,lastProgressWidth='';
  const styles=new WeakMap();
  const listen=(node,type,handler,extra={})=>node?.addEventListener(type,handler,{...options,...extra});
  const ready=Boolean((stage&&cases.length)||(showcase&&orbit&&reels.length));
  if(!ready)return {dispose(){}};

  // Transform variables are written only when their rounded value changes.
  // This also keeps unchanged opacity/order values out of the style pipeline.
  function setStyle(node,name,value){
    let previous=styles.get(node);if(!previous){previous=new Map();styles.set(node,previous);}
    value=String(value);if(previous.get(name)===value)return;
    previous.set(name,value);node.style.setProperty(name,value);
  }
  function setFocus(index){
    if(index===focusIndex)return;
    if(focusIndex>=0)railButtons[focusIndex]?.setAttribute('aria-pressed','false');
    focusIndex=index;
    if(index>=0)railButtons[index]?.setAttribute('aria-pressed','true');
    orbitDirty=true;requestPaint();
  }
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
      button.setAttribute('aria-pressed','false');
      listen(button,'click',()=>{setFocus(index);card.focus({preventScroll:true});});
      rail.append(button);return button;
    });
    sticky?.append(rail);
  }

  function activeSystem(){return Math.max(0,cases.findIndex(card=>card.classList.contains('active')));}
  function paintSystems(){
    if(!stage||!cases.length)return;
    const active=activeSystem(),spacing=clamp(dimensions.fanWidth*.135,110,184);
    // portfolio.js starts a small translateY arrival on the selected card. Check
    // that one card once per selection event, never six cards on every scroll.
    if(arrivalCheck){
      cases[active]?.getAnimations?.().forEach(animation=>{
        if(animation.effect?.getKeyframes?.().some(frame=>frame.transform==='translateY(12px)'))animation.cancel();
      });
      arrivalCheck=false;
    }
    lastSystemIndex=active;
    cases.forEach((card,index)=>{
      let offset=index-active;
      const wrapped=offset>0?offset-cases.length:offset+cases.length;
      if(Math.abs(wrapped)<Math.abs(offset))offset=wrapped;
      const distance=Math.abs(offset);
      setStyle(card,'--fan-x',`${offset*spacing}px`);
      setStyle(card,'--fan-y',`${distance*17}px`);
      setStyle(card,'--fan-z',`${-distance*92}px`);
      setStyle(card,'--fan-rotate',`${offset*9}deg`);
      setStyle(card,'--fan-tilt',`${distance?8:0}deg`);
      setStyle(card,'--fan-scale',distance?Math.max(.72,.94-distance*.055):1);
      setStyle(card,'--fan-opacity',distance?Math.max(.28,.91-distance*.19):1);
      setStyle(card,'--fan-order',100-distance);
    });
    systemsDirty=false;
  }
  function paintOrbit(now){
    if(!showcase||!orbit||!reels.length)return false;
    const progress=clamp((scrollY-dimensions.showcaseTop)/dimensions.travel);
    if(progress>.015)introDone=true;
    if(!introDone){
      // Offscreen time and hidden tabs do not advance the scatter intro.
      if(lastOrbitTime)introElapsed+=Math.min(80,Math.max(0,now-lastOrbitTime));
      lastOrbitTime=now;
    }
    const intro=introDone?1:clamp(introElapsed/1800);
    if(intro===1)introDone=true;
    const stamp=`${progress.toFixed(6)}|${intro.toFixed(5)}|${focusIndex}`;
    if(stamp===lastOrbitState)return !introDone;
    lastOrbitState=stamp;
    const {width:w,height:h}=dimensions,count=reels.length,center=(count-1)/2;
    const arcRadius=Math.min(w*.57,h*.86);
    const morph=ease(progress/.28),scan=clamp((progress-.18)/.82),spread=(count-1)*15;
    const shift=focusIndex>=0?(center-focusIndex)*15:mix(spread/2,-spread/2,scan);
    const shiftRadians=shift*Math.PI/180,cosShift=Math.cos(shiftRadians),sinShift=Math.sin(shiftRadians);
    const first=intro<.48,amount=ease(first?intro/.48:(intro-.48)/.52),blend=focusIndex>=0?1:morph;
    const baseOpacity=mix(.45,1,ease(intro));
    reels.forEach((card,index)=>{
      const item=geometry[index],from=first?item.scatter:item.line,to=first?item.line:item.circle;
      const degree=item.degree+shift;
      const arcX=(item.cos*cosShift-item.sin*sinShift)*arcRadius;
      const arcY=(item.sin*cosShift+item.cos*sinShift)*arcRadius+h*.65;
      setStyle(card,'--reel-x',`${mix(mix(from.x,to.x,amount),arcX,blend).toFixed(2)}px`);
      setStyle(card,'--reel-y',`${mix(mix(from.y,to.y,amount),arcY,blend).toFixed(2)}px`);
      setStyle(card,'--reel-rotate',`${mix(mix(from.r,to.r,amount),degree+90,blend).toFixed(2)}deg`);
      setStyle(card,'--reel-scale',mix(mix(from.s,to.s,amount),1.04,blend).toFixed(3));
      setStyle(card,'--reel-opacity',mix(baseOpacity,Math.max(.36,1-Math.abs(degree+90)/180),blend).toFixed(3));
      setStyle(card,'--reel-order',Math.round(200-Math.abs(degree+90)));
    });
    const width=`${Math.round(progress*100)}%`;
    if(progressBar&&width!==lastProgressWidth){progressBar.style.width=width;lastProgressWidth=width;}
    return !introDone;
  }
  function paint(now){
    raf=0;if(!enabled||destroyed||document.hidden)return;
    if(needsMeasure)measure();
    if(systemsVisible&&systemsDirty)paintSystems();
    if(orbitVisible&&orbitDirty){orbitDirty=paintOrbit(now);if(orbitDirty)requestPaint();}
  }
  function requestPaint(){
    if(enabled&&!raf&&!destroyed&&!document.hidden&&(needsMeasure||(systemsVisible&&systemsDirty)||(orbitVisible&&orbitDirty)))raf=requestAnimationFrame(paint);
  }
  function isVisible(top,height){return top<scrollY+innerHeight&&top+height>scrollY;}
  function measure(){
    const stageBounds=stage?.getBoundingClientRect(),showcaseBounds=showcase?.getBoundingClientRect();
    dimensions={
      width:orbit?.clientWidth||0,height:orbit?.clientHeight||0,fanWidth:stage?.clientWidth||0,
      stageTop:stageBounds?stageBounds.top+scrollY:0,stageHeight:stageBounds?.height||0,
      showcaseTop:showcaseBounds?showcaseBounds.top+scrollY:0,showcaseHeight:showcaseBounds?.height||0,
      travel:Math.max(1,(showcase?.offsetHeight||0)-(sticky?.offsetHeight||innerHeight))
    };
    const {width:w,height:h}=dimensions,count=reels.length,center=(count-1)/2,radius=Math.min(w*.30,h*.31);
    geometry=reels.map((_,index)=>{
      const angle=index/count*Math.PI*2-Math.PI/2,degree=-90+(index-center)*15,rad=degree*Math.PI/180;
      return {
        degree,cos:Math.cos(rad),sin:Math.sin(rad),
        line:{x:(index-center)*Math.min(92,w/(count+1)),y:0,r:0,s:.82},
        circle:{x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,r:angle*180/Math.PI+90,s:.83},
        scatter:{x:(seeded(index,1)-.5)*w*.85,y:(seeded(index,2)-.5)*h*.82,r:(seeded(index,3)-.5)*100,s:.55}
      };
    });
    systemsVisible=Boolean(stage&&isVisible(dimensions.stageTop,dimensions.stageHeight));
    orbitVisible=Boolean(showcase&&isVisible(dimensions.showcaseTop,dimensions.showcaseHeight));
    if(!orbitVisible)lastOrbitTime=0;
    needsMeasure=false;systemsDirty=true;orbitDirty=true;lastOrbitState='';
  }
  function invalidateMetrics(){
    needsMeasure=true;systemsDirty=true;orbitDirty=true;requestPaint();
  }
  function configure(){
    const next=desktop.matches&&!reduce.matches&&!body.classList.contains('motion-paused')&&!document.documentElement.classList.contains('motion-paused');
    if(next!==enabled){
      enabled=next;body.classList.toggle('motion-collections-on',enabled);
      if(!enabled){cancelAnimationFrame(raf);raf=0;lastOrbitTime=0;setFocus(-1);}
      else invalidateMetrics();
    }
  }
  const observer=new MutationObserver(records=>{
    if(records.some(record=>record.target===body||record.target===document.documentElement))configure();
    if(records.some(record=>cases.includes(record.target))){
      systemsDirty=true;arrivalCheck=true;requestPaint();
    }
  });
  observer.observe(body,{attributes:true,attributeFilter:['class']});
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
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
    listen(card,'focus',()=>{if(enabled)setFocus(index);});
    listen(card,'blur',()=>setFocus(-1));
  });
  const visibilityObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.target===stage){systemsVisible=entry.isIntersecting;if(systemsVisible&&activeSystem()!==lastSystemIndex)systemsDirty=true;}
      if(entry.target===showcase){
        orbitVisible=entry.isIntersecting;lastOrbitTime=0;
        if(orbitVisible)orbitDirty=true;
      }
    }
    if(!needsMeasure&&!systemsVisible&&!orbitVisible){cancelAnimationFrame(raf);raf=0;return;}
    requestPaint();
  },{threshold:0}):null;
  if(stage)visibilityObserver?.observe(stage);if(showcase)visibilityObserver?.observe(showcase);
  listen(window,'scroll',()=>{
    if(!enabled)return;
    // IntersectionObserver owns visibility. The fallback uses cached arithmetic,
    // never layout reads on scroll; neither collection gets offscreen frames.
    if(!visibilityObserver){
      systemsVisible=Boolean(stage&&isVisible(dimensions.stageTop,dimensions.stageHeight));
      const previous=orbitVisible;
      orbitVisible=Boolean(showcase&&isVisible(dimensions.showcaseTop,dimensions.showcaseHeight));
      if(previous!==orbitVisible)lastOrbitTime=0;
    }
    if(!needsMeasure&&!systemsVisible&&!orbitVisible){cancelAnimationFrame(raf);raf=0;return;}
    if(orbitVisible){orbitDirty=true;requestPaint();}
    else if(systemsVisible&&systemsDirty)requestPaint();
  },{passive:true});
  listen(window,'resize',invalidateMetrics,{passive:true});
  listen(window,'portfolio:motion',configure);
  listen(window,'portfolio:layout',invalidateMetrics);
  listen(document,'load',invalidateMetrics,{capture:true,passive:true});
  listen(document,'visibilitychange',()=>{
    lastOrbitTime=0;
    if(document.hidden){cancelAnimationFrame(raf);raf=0;}
    else {orbitDirty=true;requestPaint();}
  });
  listen(reduce,'change',configure);listen(desktop,'change',configure);
  const sizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(invalidateMetrics):null;
  if(stage)sizeObserver?.observe(stage);if(orbit)sizeObserver?.observe(orbit);
  if(showcase)sizeObserver?.observe(showcase);sizeObserver?.observe(body);
  document.fonts?.ready.then(()=>{if(!destroyed)invalidateMetrics();});
  configure();
  const api={dispose(){
    destroyed=true;abort.abort();observer.disconnect();sizeObserver?.disconnect();visibilityObserver?.disconnect();cancelAnimationFrame(raf);rail?.remove();
    body.classList.remove('motion-collections-on','motion-collections-ready');
    systems?.classList.remove('systems-motion-ready');vault?.classList.remove('reels-motion-ready');
    [...cases,...reels].forEach(card=>Array.from(card.style).filter(name=>name.startsWith('--fan-')||name.startsWith('--reel-')).forEach(name=>card.style.removeProperty(name)));
    delete body.motionCollections;
  }};
  body.motionCollections=api;return api;
}
