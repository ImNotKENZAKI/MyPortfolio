/* Presentation only: project data, navigation, and dialogs stay in portfolio.js. */
export function initPremiumDetails(){
  if(typeof document==='undefined'||!document.body)return {dispose(){}};
  const body=document.body;if(body.premiumDetails)return body.premiumDetails;
  const abort=new AbortController(),options={signal:abort.signal},animations=new Set(),seen=new WeakSet(),visible=new WeakMap(),pending=new Map();
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),fine=window.matchMedia('(hover: hover) and (pointer: fine)'),compact=window.matchMedia('(max-width:700px)');
  const stage=document.querySelector('#web-stage'),image=stage?.querySelector('#web-image'),media=image?.parentElement;
  const selectors=[...document.querySelectorAll('.web-project[data-project]')],proofs=[...document.querySelectorAll('#speaking figure>a')];
  const credentials=[...document.querySelectorAll('#credentials .credential-card')],actions=[...document.querySelectorAll('#contact .quick-cta>a,#contact .contact-card>em')],flows=[...document.querySelectorAll('[data-connected-flow]')];
  let enabled=null,frame=0,viewport=null,cover=null,sweep=null,meta=null,type=null,count=null,segments=[],thread=null,path=null,fullImageLink=null,wipeSerial=0;
  let lastSource=image?.getAttribute('src')||'',lastIndex=Number(stage?.dataset.project)||0;
  const listen=(node,event,handler,extra={})=>node?.addEventListener(event,handler,{...options,...extra});
  const add=(tag,className,parent)=>{const node=document.createElement(tag);node.className=className;parent?.append(node);return node;};
  function cancelWithin(root){for(const item of [...animations])if(item.node===root||root.contains(item.node)){item.animation.cancel();animations.delete(item);}}
  function play(node,frames,settings,complete){
    if(!enabled||document.hidden||typeof node?.animate!=='function'){complete?.();return;}
    const animation=node.animate(frames,settings),item={node,animation};animations.add(item);
    Promise.resolve(animation.finished).then(()=>{animations.delete(item);complete?.();},()=>{animations.delete(item);complete?.();});return animation;
  }
  function stopWipe(){wipeSerial++;if(cover){cover.hidden=true;sweep.hidden=true;cancelWithin(viewport);}}
  function projectMeta(index,project){
    if(!meta)return;count.textContent=String(index+1).padStart(2,'0')+' / '+String(selectors.length).padStart(2,'0');
    type.textContent=project?.type||selectors[index]?.querySelector('small')?.textContent||'WEBSITE PROJECT';
    segments.forEach((segment,i)=>segment.dataset.state=i===index?'current':i<index?'past':'next');
  }
  function projectChanged(event){
    const {index,project}=event.detail||{};if(!Number.isInteger(index)||index<0||index>=selectors.length)return;
    projectMeta(index,project);const source=image?.getAttribute('src')||'',previous=lastSource,changed=index!==lastIndex||source!==lastSource;
    if(fullImageLink){fullImageLink.href=source;fullImageLink.dataset.src=source;fullImageLink.dataset.title=(project?.name||'Website')+' — full screenshot';}
    lastSource=source;lastIndex=index;stopWipe();
    if(!changed||!enabled||!viewport||image.hidden||visible.get(viewport)===false||!previous||typeof cover.animate!=='function')return;
    // Replace the controller's generic arrival with a film wipe over the previous screenshot.
    stage.getAnimations?.().filter(animation=>animation.effect?.getKeyframes?.().some(key=>key.transform==='translateY(12px)')).forEach(animation=>animation.cancel());
    const serial=wipeSerial;cover.querySelector('img').src=previous;cover.hidden=false;sweep.hidden=false;
    play(cover,[{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 0 100%)'}],{duration:720,easing:'cubic-bezier(.65,0,.2,1)'},()=>{if(serial===wipeSerial){cover.hidden=true;sweep.hidden=true;}});
    play(sweep,[{transform:'translateX(-50%)',opacity:0},{transform:'translateX(-35%)',opacity:.8,offset:.15},{transform:'translateX(50%)',opacity:0}],{duration:720,easing:'cubic-bezier(.65,0,.2,1)'});
    const copy=stage.querySelector('.web-project-copy');if(copy){cancelWithin(copy);play(copy,[{clipPath:'inset(0 0 100% 0)',opacity:.75},{clipPath:'inset(0)',opacity:1}],{duration:520,delay:110,easing:'cubic-bezier(.2,.7,.2,1)'});}
  }
  if(media&&selectors.length){
    viewport=add('div','premium-web-viewport');media.insertBefore(viewport,image);viewport.append(image);
    cover=add('div','premium-web-curtain',viewport);cover.hidden=true;cover.setAttribute('aria-hidden','true');const previous=add('img','',cover);previous.alt='';previous.decoding='async';
    sweep=add('span','premium-web-sweep',viewport);sweep.hidden=true;sweep.setAttribute('aria-hidden','true');
    meta=add('div','premium-project-meta');stage.insertBefore(meta,media);count=add('span','premium-project-count',meta);type=add('span','premium-project-type',meta);
    const bars=add('span','premium-project-segments',meta);bars.setAttribute('aria-hidden','true');segments=selectors.map(()=>add('span','',bars));projectMeta(lastIndex);
    fullImageLink=add('a','premium-screenshot-link',stage);fullImageLink.textContent='View full screenshot ↗';fullImageLink.href=lastSource;fullImageLink.target='_blank';fullImageLink.rel='noopener';fullImageLink.dataset.modal='image';fullImageLink.dataset.src=lastSource;fullImageLink.dataset.title='Website — full screenshot';
  }
  proofs.forEach((proof,index)=>{proof.classList.add('premium-proof-frame');proof.dataset.premiumProof=String(index);});
  const proofGrid=document.querySelector('#speaking .speaking-proof-grid');
  if(proofGrid){
    thread=add('div','premium-speaking-thread');thread.setAttribute('aria-hidden','true');proofGrid.before(thread);
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 72');svg.setAttribute('preserveAspectRatio','none');
    path=document.createElementNS(ns,'path');path.setAttribute('d','M740 0V18Q740 34 724 34H196Q180 34 180 50V72 M740 34V72');path.setAttribute('pathLength','1');svg.append(path);thread.append(svg);
  }
  credentials.forEach(card=>card.classList.add('premium-credential'));actions.forEach(action=>action.classList.add('premium-contact-action'));
  function enter(node){
    if(seen.has(node))return;seen.add(node);if(!enabled)return;
    if(proofs.includes(node)){
      const index=proofs.indexOf(node),from=index===2?'inset(0 100% 0 0)':'inset(0 0 100% 0)';
      play(node,[{clipPath:from},{clipPath:'inset(0)'}],{duration:1150,delay:index===1?80:0,easing:'cubic-bezier(.22,.65,.15,1)'});
    }else if(node===thread)play(path,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1450,easing:'cubic-bezier(.3,.6,.2,1)'});
    else if(credentials.includes(node)){
      const index=credentials.indexOf(node),direction=index%2?-1:1;
      play(node,[{opacity:.76,filter:'blur(1.2px)',transform:`translateX(${direction*10}px)`},{opacity:1,filter:'blur(0)',transform:'translateX(0)'}],{duration:650,delay:index%3*70,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  }
  function flush(){frame=0;for(const [node,point]of pending){if(enabled&&!document.hidden&&visible.get(node)!==false){node.style.setProperty('--pd-x',point.x+'px');node.style.setProperty('--pd-y',point.y+'px');if(node===viewport){node.style.setProperty('--pd-pan-x',point.panX+'px');node.style.setProperty('--pd-pan-y',point.panY+'px');}}}pending.clear();}
  function resetPointer(node){pending.delete(node);node.classList.remove('premium-pointer-active');['--pd-x','--pd-y','--pd-pan-x','--pd-pan-y'].forEach(name=>node.style.removeProperty(name));}
  [viewport,...credentials].filter(Boolean).forEach(node=>{
    listen(node,'pointermove',event=>{
      if(!enabled||!fine.matches||event.pointerType==='touch'||document.hidden||visible.get(node)===false)return;
      const rect=node.getBoundingClientRect(),x=Math.max(0,Math.min(rect.width,event.clientX-rect.left)),y=Math.max(0,Math.min(rect.height,event.clientY-rect.top));
      node.classList.add('premium-pointer-active');pending.set(node,{x,y,panX:(x/Math.max(1,rect.width)-.5)*5,panY:(y/Math.max(1,rect.height)-.5)*5});if(!frame)frame=requestAnimationFrame(flush);
    },{passive:true});
    listen(node,'pointerleave',()=>resetPointer(node));
  });
  [...proofs,...credentials].forEach(node=>listen(node,'focusin',()=>{seen.add(node);cancelWithin(node);}));
  function configure(){
    const next=!reduce.matches&&!body.classList.contains('motion-paused');
    if(next!==enabled){enabled=next;body.classList.toggle('premium-details-motion',enabled);}
    path?.setAttribute('d',compact.matches?'M500 0V72':'M740 0V18Q740 34 724 34H196Q180 34 180 50V72 M740 34V72');
    if(!enabled||document.hidden){stopWipe();cancelWithin(body);cancelAnimationFrame(frame);frame=0;pending.clear();[viewport,...credentials].filter(Boolean).forEach(resetPointer);}
  }
  const targets=[viewport,...proofs,...credentials,thread,...flows].filter(Boolean);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>{
    visible.set(entry.target,entry.isIntersecting);
    if(flows.includes(entry.target))entry.target.classList.toggle('pd-in-view',entry.isIntersecting);
    if(entry.isIntersecting)enter(entry.target);else{cancelWithin(entry.target);resetPointer(entry.target);if(entry.target===viewport)stopWipe();}
  }),{threshold:.12}):null;
  const bodyObserver=new MutationObserver(configure);bodyObserver.observe(body,{attributes:true,attributeFilter:['class']});
  body.classList.add('premium-details-ready');configure();
  targets.forEach(node=>{const rect=node.getBoundingClientRect();visible.set(node,rect.bottom>0&&rect.top<innerHeight);if(observer)observer.observe(node);else{seen.add(node);if(flows.includes(node))node.classList.add('pd-in-view');}});
  listen(window,'portfolio:project',projectChanged);listen(window,'portfolio:motion',configure);listen(reduce,'change',configure);listen(compact,'change',configure);listen(document,'visibilitychange',configure);
  const api={dispose(){
    abort.abort();observer?.disconnect();bodyObserver.disconnect();stopWipe();cancelWithin(body);cancelAnimationFrame(frame);pending.clear();
    if(viewport){resetPointer(viewport);viewport.replaceWith(image);}meta?.remove();thread?.remove();fullImageLink?.remove();
    proofs.forEach(proof=>{proof.classList.remove('premium-proof-frame');delete proof.dataset.premiumProof;});
    credentials.forEach(card=>{card.classList.remove('premium-credential');resetPointer(card);});actions.forEach(action=>action.classList.remove('premium-contact-action'));
    flows.forEach(flow=>flow.classList.remove('pd-in-view'));
    body.classList.remove('premium-details-ready','premium-details-motion');delete body.premiumDetails;
  }};
  body.premiumDetails=api;return api;
}
