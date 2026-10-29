/* Presentation only: project data, navigation, and dialogs stay in portfolio.js. */
export function initPremiumDetails(){
  if(typeof document==='undefined'||!document.body)return {dispose(){}};
  const body=document.body;if(body.premiumDetails)return body.premiumDetails;
  const abort=new AbortController(),options={signal:abort.signal},animations=new Set(),seen=new WeakSet(),visible=new WeakMap(),pending=new Map();
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),fine=window.matchMedia('(hover: hover) and (pointer: fine)'),compact=window.matchMedia('(max-width:700px)');
  const proofs=[...document.querySelectorAll('#speaking figure>a')];
  const credentials=[...document.querySelectorAll('#credentials .credential-card')],actions=[...document.querySelectorAll('#contact .quick-cta>a,#contact .contact-card>em')],flows=[...document.querySelectorAll('[data-connected-flow]')];
  let enabled=null,frame=0,thread=null,path=null;
  const listen=(node,event,handler,extra={})=>node?.addEventListener(event,handler,{...options,...extra});
  const add=(tag,className,parent)=>{const node=document.createElement(tag);node.className=className;parent?.append(node);return node;};
  function cancelWithin(root){for(const item of [...animations])if(item.node===root||root.contains(item.node)){item.animation.cancel();animations.delete(item);}}
  function play(node,frames,settings,complete){
    if(!enabled||document.hidden||typeof node?.animate!=='function'){complete?.();return;}
    const animation=node.animate(frames,settings),item={node,animation};animations.add(item);
    Promise.resolve(animation.finished).then(()=>{animations.delete(item);complete?.();},()=>{animations.delete(item);complete?.();});return animation;
  }
  proofs.forEach((proof,index)=>{proof.classList.add('premium-proof-frame');proof.dataset.premiumProof=String(index);});
  const proofGrid=document.querySelector('#speaking .speaking-proof-grid');
  if(proofGrid){
    thread=add('div','premium-speaking-thread');thread.setAttribute('aria-hidden','true');proofGrid.before(thread);
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 1000 72');svg.setAttribute('preserveAspectRatio','none');
    path=document.createElementNS(ns,'path');path.setAttribute('d','M740 0V18Q740 34 724 34H196Q180 34 180 50V72 M740 34V72');path.setAttribute('pathLength','1');svg.append(path);thread.append(svg);
  }
  credentials.forEach(card=>card.classList.add('premium-credential'));actions.forEach(action=>action.classList.add('premium-contact-action'));
  const offerText=[
    'Video ads, VSLs and AI-assisted content with clear hooks, pacing and sound.',
    'Websites and landing pages that present your offer and give visitors a clear next step.',
    'GoHighLevel funnels, forms, calendars and follow-up workflows that organize inquiries.'
  ];
  const flowStates=flows.map(flow=>{
    const buttons=[...flow.querySelectorAll('button[data-flow-step]')],detail=flow.querySelector('.connected-work-detail');
    const saved={flow,buttons,detail,step:flow.getAttribute('data-flow-step'),text:detail?.textContent,pressed:buttons.map(button=>button.getAttribute('aria-pressed'))};
    function select(index,animate=false){
      if(!Number.isInteger(index)||index<0||index>=offerText.length||!buttons.length)return;
      flow.dataset.flowStep=String(index);buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.flowStep)===index)));
      if(detail)detail.textContent=offerText[index];
      const connector=flow.querySelector('.flow-connector');
      if(animate&&enabled&&visible.get(flow)===true&&connector){
        cancelWithin(connector);connector.getAnimations?.().forEach(animation=>animation.cancel());
        play(connector,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1000,easing:'cubic-bezier(.25,.6,.25,1)'});
      }
    }
    buttons.forEach(button=>listen(button,'click',()=>select(Number(button.dataset.flowStep),true)));select(0);return saved;
  });
  function enter(node){
    if(seen.has(node))return;seen.add(node);if(!enabled)return;
    if(proofs.includes(node)){
      const index=proofs.indexOf(node),from=index===2?'inset(0 100% 0 0)':'inset(0 0 100% 0)';
      play(node,[{clipPath:from},{clipPath:'inset(0)'}],{duration:1150,delay:index===1?80:0,easing:'cubic-bezier(.22,.65,.15,1)'});
    }else if(node===thread)play(path,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1450,easing:'cubic-bezier(.3,.6,.2,1)'});
    else if(credentials.includes(node)){
      const index=credentials.indexOf(node),direction=index%2?-1:1;
      play(node,[{opacity:.76,transform:`translateX(${direction*10}px)`},{opacity:1,transform:'translateX(0)'}],{duration:650,delay:index%3*70,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
  }
  function flush(){frame=0;for(const [node,point]of pending){if(enabled&&!document.hidden&&visible.get(node)!==false){node.style.setProperty('--pd-x',point.x+'px');node.style.setProperty('--pd-y',point.y+'px');}}pending.clear();}
  function resetPointer(node){pending.delete(node);node.classList.remove('premium-pointer-active');['--pd-x','--pd-y','--pd-pan-x','--pd-pan-y'].forEach(name=>node.style.removeProperty(name));}
  credentials.forEach(node=>{
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
    if(!enabled||document.hidden){cancelWithin(body);cancelAnimationFrame(frame);frame=0;pending.clear();credentials.forEach(resetPointer);}
  }
  const targets=[...proofs,...credentials,thread,...flows].filter(Boolean);
  const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>entries.forEach(entry=>{
    visible.set(entry.target,entry.isIntersecting);
    if(flows.includes(entry.target))entry.target.classList.toggle('pd-in-view',entry.isIntersecting);
    if(entry.isIntersecting)enter(entry.target);else{cancelWithin(entry.target);resetPointer(entry.target);}
  }),{threshold:.12}):null;
  const bodyObserver=new MutationObserver(configure);bodyObserver.observe(body,{attributes:true,attributeFilter:['class']});
  body.classList.add('premium-details-ready');configure();
  targets.forEach(node=>{const rect=node.getBoundingClientRect();visible.set(node,rect.bottom>0&&rect.top<innerHeight);if(observer)observer.observe(node);else{seen.add(node);if(flows.includes(node))node.classList.add('pd-in-view');}});
  listen(window,'portfolio:motion',configure);listen(reduce,'change',configure);listen(compact,'change',configure);listen(document,'visibilitychange',configure);
  const api={dispose(){
    abort.abort();observer?.disconnect();bodyObserver.disconnect();cancelWithin(body);cancelAnimationFrame(frame);pending.clear();
    thread?.remove();
    proofs.forEach(proof=>{proof.classList.remove('premium-proof-frame');delete proof.dataset.premiumProof;});
    credentials.forEach(card=>{card.classList.remove('premium-credential');resetPointer(card);});actions.forEach(action=>action.classList.remove('premium-contact-action'));
    flows.forEach(flow=>flow.classList.remove('pd-in-view'));
    flowStates.forEach(saved=>{
      if(saved.step===null)saved.flow.removeAttribute('data-flow-step');else saved.flow.setAttribute('data-flow-step',saved.step);
      saved.buttons.forEach((button,index)=>{if(saved.pressed[index]===null)button.removeAttribute('aria-pressed');else button.setAttribute('aria-pressed',saved.pressed[index]);});if(saved.detail)saved.detail.textContent=saved.text;
    });
    body.classList.remove('premium-details-ready','premium-details-motion');delete body.premiumDetails;
  }};
  body.premiumDetails=api;return api;
}
