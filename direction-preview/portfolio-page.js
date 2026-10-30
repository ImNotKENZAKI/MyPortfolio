import {getMotionState,roleTitles} from './portfolio.js';
import {initMotionSequences} from './motion-sequences.js';
import {initMotionCollections} from './motion-collections.js';
import {initPremiumDetails} from './premium-details.js';
import {initWebsiteGallery} from './website-gallery.js';
import {initWebExhibit} from './web-exhibit.js';

const host=document.querySelector('#hero-scene'),hero=document.querySelector('.hero-sticky'),art=document.querySelector('.hero-art'),heroScroll=document.querySelector('.hero-scroll'),filmFrame=document.querySelector('.showreel-player');
const pageProgress=document.querySelector('.page-progress'),navigation=document.querySelector('.site-nav'),roleNode=document.querySelector('#rotatingTitle'),portrait=document.querySelector('.hero-portrait');
let engine=null,visible=true,scheduled=0,roleTimer=0,roleIndex=0;
let filmVisible=false,layoutDirty=true,heroTop=0,travelRange=1,pageRange=0;
let lastCameraProgress=null,lastHeroTravel='',lastPageProgress='',lastFilmApproach='',lastNavScrolled=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),cinematic=matchMedia('(min-width:850px) and (min-height:650px)');
const paused=()=>{const value=getMotionState();return reduced.matches||(typeof value==='boolean'?value:Boolean(value?.paused));};
const clamp=value=>Math.min(1,Math.max(0,value));
function measureLayout(){
 heroTop=heroScroll?heroScroll.getBoundingClientRect().top+scrollY:0;
 travelRange=Math.max(1,(heroScroll?.offsetHeight||0)-(hero?.offsetHeight||0));
 pageRange=Math.max(0,document.documentElement.scrollHeight-innerHeight);
 layoutDirty=false;
}
function update(){
 scheduled=0;if(document.hidden)return;
 if(layoutDirty)measureLayout();
 const isPaused=paused(),progress=cinematic.matches&&!isPaused?clamp((scrollY-heroTop)/travelRange):0;
 // The clamped endpoint is still sent once on exit. Further offscreen scrolls
 // do not touch the hero or wake its renderer; reverse scrolling uses the same range.
 if(engine&&progress!==lastCameraProgress){engine.setProgress(progress);lastCameraProgress=progress;}
 const travel=progress.toFixed(4);
 if(hero&&travel!==lastHeroTravel){hero.style.setProperty('--hero-travel',travel);lastHeroTravel=travel;}
 if(filmFrame&&filmVisible){
  // The film is sticky and rotates with this value: its visible screen position
  // is intentionally measured only while it can be seen.
  const approach=isPaused?1:clamp((innerHeight*.92-filmFrame.getBoundingClientRect().top)/(innerHeight*.84));
  const value=String(approach);
  if(value!==lastFilmApproach){filmFrame.style.setProperty('--video-approach',value);lastFilmApproach=value;}
 }
 const pageValue=(pageRange>0?clamp(scrollY/pageRange):0).toFixed(5);
 if(pageProgress&&pageValue!==lastPageProgress){pageProgress.style.transform=`scaleX(${pageValue})`;lastPageProgress=pageValue;}
 const scrolled=scrollY>30;
 if(navigation&&scrolled!==lastNavScrolled){navigation.classList.toggle('is-scrolled',scrolled);lastNavScrolled=scrolled;}
}
function request(){if(!scheduled&&!document.hidden)scheduled=requestAnimationFrame(update);}
function invalidateLayout(){layoutDirty=true;request();}
function roles(){clearInterval(roleTimer);roleTimer=0;if(paused()||!visible||document.hidden||!roleNode)return;roleTimer=setInterval(()=>{const node=roleNode;roleIndex=(roleIndex+1)%roleTitles.length;const animation=node.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-8px)'}],{duration:180,easing:'ease-in'});animation.finished.then(()=>{if(node.previousSibling?.nodeType===Node.TEXT_NODE)node.previousSibling.textContent=roleTitles[roleIndex].startsWith('AI ')?'I’m an ':'I’m a ';node.textContent=roleTitles[roleIndex];node.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});}).catch(()=>{});},3200);}
function initialize(){initMotionSequences();initMotionCollections();initPremiumDetails();initWebsiteGallery();initWebExhibit();roles();invalidateLayout();if(!paused()){
 document.querySelectorAll('.headline-line>span').forEach((word,index)=>word.animate([{opacity:0,transform:'translateY(105%) rotate(3deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:1050,delay:150+index*150,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
 portrait?.animate([{opacity:0,transform:'translateY(35px) scale(1.035)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1300,delay:150,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
}}
if(document.body.classList.contains('js-ready'))initialize();else window.addEventListener('portfolio:ready',initialize,{once:true});
if(host){
 import('./kinetic-scene.js').then(async({createKineticScene})=>{engine=await createKineticScene(host,{paused:paused(),onReady(){art.classList.add('is-ready');host.dataset.state='ready';},onFailure(){art.classList.remove('is-ready');host.dataset.state='fallback';}});lastCameraProgress=null;engine?.setVisible(visible);request();}).catch(()=>{host.dataset.state='fallback';});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;engine?.setVisible(visible);roles();},{rootMargin:'80px'}).observe(hero);
 hero.addEventListener('pointermove',event=>{if(paused()||event.pointerType!=='mouse')return;const rect=hero.getBoundingClientRect();engine?.setPointer((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1);},{passive:true});
 hero.addEventListener('pointerleave',()=>engine?.setPointer(0,0));
}
addEventListener('scroll',request,{passive:true});addEventListener('resize',invalidateLayout,{passive:true});
addEventListener('portfolio:layout',invalidateLayout);
addEventListener('portfolio:motion',()=>{engine?.setPaused(paused());if(paused())document.getAnimations().filter(animation=>animation.effect?.target?.closest?.('#home')).forEach(animation=>{try{animation.finish();}catch{}});roles();invalidateLayout();});
document.addEventListener('visibilitychange',()=>{roles();if(document.hidden){cancelAnimationFrame(scheduled);scheduled=0;}else invalidateLayout();});
reduced.addEventListener('change',()=>{roles();invalidateLayout();});cinematic.addEventListener('change',invalidateLayout);
const layoutObserver=typeof ResizeObserver==='function'?new ResizeObserver(invalidateLayout):null;
for(const node of [document.body,heroScroll,hero])if(node)layoutObserver?.observe(node);
document.fonts?.ready.then(invalidateLayout);
const showreel=document.querySelector('#portfolio-showreel');if(showreel){new IntersectionObserver(entries=>{filmVisible=entries[0].isIntersecting;request();},{threshold:.02,rootMargin:'80px'}).observe(filmFrame||showreel);new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&document.pictureInPictureElement!==showreel)showreel.pause();},{threshold:.05}).observe(showreel);showreel.addEventListener('play',()=>filmFrame?.classList.add('is-playing'));showreel.addEventListener('pause',()=>filmFrame?.classList.remove('is-playing'));showreel.addEventListener('ended',()=>filmFrame?.classList.remove('is-playing'));}
request();
