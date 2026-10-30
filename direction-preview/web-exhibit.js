import {projects} from './projects.js';

const order=[0,5,6,7,1,2,3,4];
const clamp=value=>Math.max(0,Math.min(1,value));
let currentExhibit=null;

/* Real-time exhibition controls. All eight native gallery entries remain the
   readable fallback; only a successfully displayed scene closes their catalog. */
export function initWebExhibit(){
  if(typeof document==='undefined'||!document.body)return {dispose(){}};
  if(currentExhibit)return currentExhibit;
  const wrapper=document.querySelector('#web-projects [data-web-exhibit]');
  const host=wrapper?.querySelector('[data-exhibit-canvas]'),stage=wrapper?.querySelector('[data-exhibit-stage]');
  if(!wrapper||!host||!stage)return {dispose(){}};
  const find=selector=>wrapper.querySelector(selector);
  const title=find('[data-exhibit-title]'),type=find('[data-exhibit-type]'),description=find('[data-exhibit-description]');
  const count=find('[data-exhibit-count]'),live=find('[data-exhibit-live]'),open=find('[data-exhibit-open]');
  const previous=find('[data-exhibit-prev]'),next=find('[data-exhibit-next]');
  const catalog=find('[data-exhibit-catalog]')||wrapper.closest('#web-projects')?.querySelector('[data-exhibit-catalog]');
  const buttons=[...wrapper.querySelectorAll('button[data-exhibit-select]')];
  const captions=[type,title,description].filter(Boolean);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const abort=new AbortController(),options={signal:abort.signal};
  const listen=(node,event,handler,extra={})=>node?.addEventListener(event,handler,{...options,...extra});
  const beforeTabIndex=wrapper.getAttribute('tabindex'),beforeTouchAction=stage.style.touchAction;
  let selected=Number(buttons.find(button=>button.getAttribute('aria-pressed')==='true')?.dataset.exhibitSelect??0);
  if(!order.includes(selected))selected=0;
  let engine=null,loading=null,sceneReady=false,committed=false,failed=false,disposed=false,visible=false;
  let frame=0,metricsDirty=true,resizeDirty=true,scrollDirty=true,pointerDirty=false;
  let lastProgress=-1,lastPointerX=0,lastPointerY=0,pointerX=0,pointerY=0;
  let swipe=null,suppressClickUntil=0,captionAnimations=[];
  let metrics={left:0,top:0,width:1,height:1,documentTop:0};
  const isPaused=()=>reduced.matches||document.body.classList.contains('motion-paused')||document.documentElement.classList.contains('motion-paused');
  const usable=()=>visible&&!document.hidden&&!failed&&!disposed;
  const layoutEvent=()=>window.dispatchEvent(new CustomEvent('portfolio:layout',{detail:{source:'web-exhibit',state:wrapper.dataset.exhibitState}}));
  function cancelCaptions(){captionAnimations.forEach(animation=>animation.cancel());captionAnimations=[];}
  function renderSelection(animate=false){
    const project=projects[selected],position=order.indexOf(selected);
    cancelCaptions();
    if(title)title.textContent=project.name;
    if(type)type.textContent=project.type;
    if(description)description.textContent=project.description;
    if(count)count.textContent=String(position+1).padStart(2,'0')+' / '+String(order.length).padStart(2,'0');
    if(live){live.href=project.url;live.target='_blank';live.rel='noopener noreferrer';live.setAttribute('aria-label','Visit '+project.name+' live website');}
    if(open){
      open.href=project.image;open.dataset.modal='image';open.dataset.src=project.image;
      open.dataset.title=project.name;open.dataset.galleryOpen=String(selected);
      open.setAttribute('aria-label','Open '+project.name+' full website screenshot');
    }
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.exhibitSelect)===selected)));
    wrapper.dataset.exhibitSelected=String(selected);
    if(animate&&committed&&usable()&&!isPaused())captions.forEach(node=>{
      if(typeof node.animate==='function')captionAnimations.push(node.animate(
        [{opacity:.45,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],
        {duration:220,easing:'cubic-bezier(.2,.7,.2,1)'}
      ));
    });
  }
  function select(index){
    const value=Number(index);if(disposed||!Number.isInteger(value)||!order.includes(value)||value===selected)return;
    selected=value;renderSelection(true);engine?.setIndex(selected);
  }
  const step=direction=>select(order[(order.indexOf(selected)+direction+order.length)%order.length]);
  function readMetrics(){
    const rect=stage.getBoundingClientRect();
    metrics={left:rect.left,top:rect.top,width:Math.max(1,rect.width),height:Math.max(1,rect.height),documentTop:rect.top+scrollY};
    metricsDirty=false;scrollDirty=false;
  }
  function request(){if(!frame&&engine&&usable())frame=requestAnimationFrame(paint);}
  function paint(){
    frame=0;if(!engine||!usable())return;
    if(metricsDirty||scrollDirty)readMetrics();
    if(resizeDirty){resizeDirty=false;engine.resize();}
    const progress=clamp((innerHeight-metrics.top)/(innerHeight+metrics.height));
    if(Math.abs(progress-lastProgress)>.0001){lastProgress=progress;engine.setProgress(progress);}
    if(pointerDirty){
      pointerDirty=false;
      if(pointerX!==lastPointerX||pointerY!==lastPointerY){engine.setPointer(pointerX,pointerY);lastPointerX=pointerX;lastPointerY=pointerY;}
    }
  }
  function invalidate(){metricsDirty=true;resizeDirty=true;request();}
  function resetPointer(){
    pointerX=pointerY=0;pointerDirty=false;
    if(lastPointerX||lastPointerY)engine?.setPointer(0,0);
    lastPointerX=lastPointerY=0;
  }
  function commitReady(){
    if(committed||!sceneReady||!engine||!usable())return;
    committed=true;wrapper.classList.remove('exhibit-loading','exhibit-failed');wrapper.classList.add('exhibit-ready');
    wrapper.dataset.exhibitState='ready';wrapper.setAttribute('aria-busy','false');
    // Never hide a keyboard user's current catalog focus when the scene arrives.
    if(catalog&&!catalog.contains(document.activeElement))catalog.open=false;
    invalidate();layoutEvent();
  }
  function fail(error){
    if(failed||disposed)return;
    failed=true;sceneReady=false;committed=false;cancelAnimationFrame(frame);frame=0;cancelCaptions();
    wrapper.classList.remove('exhibit-ready','exhibit-loading');wrapper.classList.add('exhibit-failed');
    wrapper.dataset.exhibitState='fallback';wrapper.setAttribute('aria-busy','false');
    if(catalog)catalog.open=true;
    const previousEngine=engine;engine=null;
    try{previousEngine?.setVisible(false);previousEngine?.dispose();}catch{}
    if(error)console.warn('Opening the native website gallery.',error.message||'Exhibit unavailable.');
    layoutEvent();
  }
  function loadScene(){
    if(loading||engine||failed||disposed||document.hidden)return loading;
    wrapper.classList.add('exhibit-loading');wrapper.classList.remove('exhibit-failed');
    wrapper.dataset.exhibitState='loading';wrapper.setAttribute('aria-busy','true');
    loading=(async()=>{
      const {createWebExhibit}=await import('./web-exhibit-scene.js');
      if(disposed||failed)return;
      const created=await createWebExhibit(host,{
        paused:isPaused(),index:selected,
        onReady(){if(!disposed&&!failed){sceneReady=true;commitReady();}},
        onSelect:index=>select(index),onFailure:fail
      });
      if(disposed||failed){created?.dispose();return;}
      if(!created||typeof created.setIndex!=='function')throw new Error('The website exhibit could not initialize.');
      engine=created;lastProgress=-1;
      engine.setIndex(selected);engine.setPaused(isPaused());engine.setVisible(usable());
      commitReady();invalidate();
    })().catch(fail);
    return loading;
  }
  function setVisible(value){
    visible=value;engine?.setVisible(usable());
    if(visible){loadScene();commitReady();metricsDirty=true;scrollDirty=true;request();}
    else {cancelAnimationFrame(frame);frame=0;cancelCaptions();resetPointer();}
  }

  wrapper.dataset.exhibitState='idle';wrapper.setAttribute('aria-busy','false');
  if(!wrapper.hasAttribute('tabindex'))wrapper.tabIndex=0;
  stage.style.touchAction='pan-y pinch-zoom';
  if(count){count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');}
  buttons.forEach(button=>{
    const project=projects[Number(button.dataset.exhibitSelect)];
    if(project&&!button.hasAttribute('aria-label'))button.setAttribute('aria-label','Show '+project.name);
    listen(button,'click',()=>select(Number(button.dataset.exhibitSelect)));
  });
  listen(previous,'click',()=>step(-1));listen(next,'click',()=>step(1));
  listen(wrapper,'keydown',event=>{
    if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    if(document.querySelector('dialog[open]')||event.target.closest('a[href],input,textarea,select,[contenteditable]:not([contenteditable=false]),[role=textbox],dialog'))return;
    event.preventDefault();step(event.key==='ArrowRight'?1:-1);
    if(event.target.closest('[data-exhibit-select]'))buttons.find(button=>Number(button.dataset.exhibitSelect)===selected)?.focus({preventScroll:true});
  });
  listen(stage,'pointermove',event=>{
    if(!usable()||isPaused()||event.pointerType!=='mouse')return;
    pointerX=Number((clamp((event.clientX-metrics.left)/metrics.width)*2-1).toFixed(4));
    pointerY=Number((clamp((event.clientY-metrics.top)/metrics.height)*2-1).toFixed(4));
    pointerDirty=true;request();
  },{passive:true});
  listen(stage,'pointerleave',resetPointer);
  listen(stage,'pointerdown',event=>{
    if(event.isPrimary===false||event.pointerType==='mouse'||event.target.closest('a,button,input,textarea,select'))return;
    swipe={id:event.pointerId,x:event.clientX,y:event.clientY};
  },{passive:true});
  listen(window,'pointerup',event=>{
    const start=swipe;swipe=null;if(!start||event.pointerId!==start.id)return;
    const x=event.clientX-start.x,y=event.clientY-start.y;
    if(Math.abs(x)>50&&Math.abs(x)>Math.abs(y)*1.6){step(x<0?1:-1);suppressClickUntil=performance.now()+400;}
  },{passive:true});
  listen(window,'pointercancel',()=>{swipe=null;});
  listen(stage,'click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}},{capture:true});
  listen(catalog,'toggle',layoutEvent);
  listen(window,'resize',invalidate,{passive:true});
  listen(window,'portfolio:layout',invalidate);
  const motion=()=>{cancelCaptions();resetPointer();engine?.setPaused(isPaused());request();};
  listen(window,'portfolio:motion',motion);listen(reduced,'change',motion);
  listen(document,'visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(frame);frame=0;cancelCaptions();resetPointer();engine?.setVisible(false);}
    else {engine?.setPaused(isPaused());engine?.setVisible(visible);if(visible)loadScene();commitReady();invalidate();}
  });
  const visibilityObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:.01}):null;
  const loadObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){loadScene();loadObserver.disconnect();}
  },{rootMargin:'240px 0px'}):null;
  visibilityObserver?.observe(stage);loadObserver?.observe(stage);
  listen(window,'scroll',()=>{
    if(!visibilityObserver){const inView=metrics.documentTop<scrollY+innerHeight&&metrics.documentTop+metrics.height>scrollY;if(inView!==visible)setVisible(inView);}
    if(visible){scrollDirty=true;request();}
  },{passive:true});
  const sizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(invalidate):null;
  sizeObserver?.observe(stage);sizeObserver?.observe(host);
  document.fonts?.ready.then(()=>{if(!disposed)invalidate();});
  readMetrics();renderSelection();
  if(!visibilityObserver)setVisible(metrics.documentTop<scrollY+innerHeight&&metrics.documentTop+metrics.height>scrollY);
  const api={
    select,get index(){return selected;},
    dispose(){
      if(disposed)return;disposed=true;abort.abort();cancelAnimationFrame(frame);cancelCaptions();
      visibilityObserver?.disconnect();loadObserver?.disconnect();sizeObserver?.disconnect();
      engine?.dispose();engine=null;
      wrapper.classList.remove('exhibit-ready','exhibit-loading','exhibit-failed');
      delete wrapper.dataset.exhibitState;delete wrapper.dataset.exhibitSelected;wrapper.removeAttribute('aria-busy');
      if(beforeTabIndex===null)wrapper.removeAttribute('tabindex');else wrapper.setAttribute('tabindex',beforeTabIndex);
      stage.style.touchAction=beforeTouchAction;
      if(catalog)catalog.open=true;
      currentExhibit=null;
    }
  };
  currentExhibit=api;return api;
}
