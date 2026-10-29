import {projects} from './projects.js';

let currentGallery=null;

/* The core opens/closes the native dialog; this adds browsing to gallery images only. */
export function initWebsiteGallery(){
  if(typeof document==='undefined'||!document.body)return {dispose(){}};
  if(currentGallery)return currentGallery;
  const dialog=document.querySelector('#portfolio-dialog');
  const entries=[...document.querySelectorAll('.web-gallery-item[data-project]')].map(item=>({item,index:Number(item.dataset.project),trigger:item.querySelector('[data-gallery-open]')})).filter(entry=>entry.trigger&&projects[entry.index]);
  if(!dialog||!entries.length)return {dispose(){}};
  const abort=new AbortController(),options={signal:abort.signal};
  let position=-1,footer=null,caption=null,counter=null,live=null,preview=null,descriptionBefore=null,probe=null,pointer=null;
  const listen=(node,event,callback)=>node.addEventListener(event,callback,options);
  const element=(tag,className,text)=>{const node=document.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
  const wrap=value=>(value+entries.length)%entries.length;
  function reset(){
    if(position<0)return;position=-1;pointer=null;footer?.remove();caption?.remove();footer=caption=counter=live=preview=null;
    dialog.classList.remove('website-gallery-dialog');
    if(descriptionBefore===null)dialog.removeAttribute('aria-describedby');else dialog.setAttribute('aria-describedby',descriptionBefore);
    descriptionBefore=null;probe?.removeAttribute('src');probe=null;
  }
  function preloadNeighbor(direction){
    if(!dialog.open||position<0||entries.length<2||typeof Image!=='function')return;
    if(!probe){probe=new Image();probe.decoding='async';}
    probe.src=projects[entries[wrap(position+direction)].index].image;
  }
  function render(next,direction=1){
    if(!dialog.open||!preview){reset();return;}
    position=wrap(next);const project=projects[entries[position].index];
    dialog.querySelector('.dialog-title').textContent=project.name;
    const source=new URL(project.image,document.baseURI).href;
    if(preview.src!==source)preview.src=project.image;
    preview.alt=project.name+' website screenshot';preview.decoding='async';
    caption.textContent=project.description;counter.textContent=String(position+1).padStart(2,'0')+' / '+String(entries.length).padStart(2,'0');
    live.href=project.url;live.setAttribute('aria-label','Visit '+project.name+' live website');
    footer.querySelector('[data-gallery-prev]').setAttribute('aria-label','Previous website: '+projects[entries[wrap(position-1)].index].name);
    footer.querySelector('[data-gallery-next]').setAttribute('aria-label','Next website: '+projects[entries[wrap(position+1)].index].name);
    preloadNeighbor(direction);
  }
  function augment(index){
    if(!dialog.open||!dialog.classList.contains('image-dialog'))return;
    const body=dialog.querySelector('.dialog-body'),image=body?.querySelector('img'),title=dialog.querySelector('.dialog-title');
    if(!body||!image||!title)return;reset();position=index;preview=image;descriptionBefore=dialog.getAttribute('aria-describedby');
    dialog.classList.add('website-gallery-dialog');caption=element('p','gallery-lightbox-caption');caption.id='website-gallery-description';body.append(caption);dialog.setAttribute('aria-describedby',caption.id);
    footer=element('div','gallery-lightbox-footer');const navigation=element('div','gallery-lightbox-nav');navigation.setAttribute('role','group');navigation.setAttribute('aria-label','Browse website screenshots');
    const previous=element('button','gallery-lightbox-button','←'),next=element('button','gallery-lightbox-button','→');previous.type=next.type='button';previous.dataset.galleryPrev='';next.dataset.galleryNext='';
    counter=element('span','gallery-lightbox-count');counter.setAttribute('aria-live','polite');counter.setAttribute('aria-atomic','true');
    live=element('a','gallery-lightbox-live','Visit live site ↗');live.target='_blank';live.rel='noopener noreferrer';navigation.append(previous,counter,next);footer.append(navigation,live);dialog.append(footer);
    render(index);
  }
  listen(document,'click',event=>{
    const trigger=event.target.closest?.('[data-gallery-open]');
    if(trigger){const index=entries.findIndex(entry=>entry.trigger===trigger);if(index>=0){augment(index);return;}}
    if(position>=0&&(event.target.closest?.('[data-modal],[data-close-dialog],[data-close-modal]')||!dialog.open))reset();
  });
  listen(dialog,'keydown',event=>{
    if(position<0||event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||!dialog.open)return;
    if(event.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();render(position+(event.key==='ArrowRight'?1:-1),event.key==='ArrowRight'?1:-1);}
  });
  listen(dialog,'click',event=>{
    if(position<0)return;const direction=event.target.closest?.('[data-gallery-prev]')?-1:event.target.closest?.('[data-gallery-next]')?1:0;
    if(direction)render(position+direction,direction);
  });
  listen(dialog,'pointerdown',event=>{
    if(position>=0&&event.isPrimary!==false&&event.pointerType!=='mouse'&&event.target.closest?.('.dialog-body img'))pointer={id:event.pointerId,x:event.clientX,y:event.clientY};
  });
  listen(dialog,'pointerup',event=>{
    const start=pointer;pointer=null;if(position<0||!start||event.pointerId!==start.id)return;
    const x=event.clientX-start.x,y=event.clientY-start.y;
    if(Math.abs(x)>65&&Math.abs(x)>Math.abs(y)*1.6)render(position+(x<0?1:-1),x<0?1:-1);
  });
  listen(dialog,'pointercancel',()=>{pointer=null;});listen(dialog,'close',reset);listen(dialog,'cancel',reset);
  const api={dispose(){abort.abort();reset();currentGallery=null;}};currentGallery=api;return api;
}
