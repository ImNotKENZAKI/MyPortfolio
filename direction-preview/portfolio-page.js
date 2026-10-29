import {getMotionState,roleTitles} from './portfolio.js';
import {initMotionSequences} from './motion-sequences.js';
import {initMotionCollections} from './motion-collections.js';

const host=document.querySelector('#hero-scene'),hero=document.querySelector('.hero-sticky'),art=document.querySelector('.hero-art');
let engine=null,visible=true,scheduled=0,roleTimer=0,roleIndex=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),phone=matchMedia('(max-width:700px)');
const paused=()=>{const value=getMotionState();return reduced.matches||(typeof value==='boolean'?value:Boolean(value?.paused));};
const clamp=value=>Math.min(1,Math.max(0,value));
function update(){scheduled=0;const rect=hero.getBoundingClientRect();const progress=clamp(-rect.top/Math.max(1,hero.offsetHeight*.8));engine?.setProgress(phone.matches?0:progress);const range=document.documentElement.scrollHeight-innerHeight;document.querySelector('.page-progress').style.width=(range>0?clamp(scrollY/range)*100:0)+'%';document.querySelector('.site-nav')?.classList.toggle('is-scrolled',scrollY>30);}
function request(){if(!scheduled)scheduled=requestAnimationFrame(update);}
function roles(){clearInterval(roleTimer);roleTimer=0;if(paused()||!visible||document.hidden)return;roleTimer=setInterval(()=>{const node=document.querySelector('#rotatingTitle');if(!node)return;roleIndex=(roleIndex+1)%roleTitles.length;const animation=node.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-8px)'}],{duration:180,easing:'ease-in'});animation.finished.then(()=>{if(node.previousSibling?.nodeType===Node.TEXT_NODE)node.previousSibling.textContent=roleTitles[roleIndex].startsWith('AI ')?'I’m an ':'I’m a ';node.textContent=roleTitles[roleIndex];node.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});}).catch(()=>{});},3200);}
function initialize(){initMotionSequences();initMotionCollections();roles();if(!paused()){
 document.querySelectorAll('.headline-line>span').forEach((word,index)=>word.animate([{opacity:0,transform:'translateY(105%) rotate(3deg)'},{opacity:1,transform:'translateY(0) rotate(0)'}],{duration:1050,delay:150+index*150,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
 document.querySelector('.hero-portrait')?.animate([{opacity:0,transform:'translateY(35px) scale(1.035)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1300,delay:150,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
}}
if(document.body.classList.contains('js-ready'))initialize();else window.addEventListener('portfolio:ready',initialize,{once:true});
if(host){
 import('./kinetic-scene.js').then(async({createKineticScene})=>{engine=await createKineticScene(host,{paused:paused(),onReady(){art.classList.add('is-ready');host.dataset.state='ready';},onFailure(){art.classList.remove('is-ready');host.dataset.state='fallback';}});engine?.setVisible(visible);request();}).catch(()=>{host.dataset.state='fallback';});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;engine?.setVisible(visible);roles();},{rootMargin:'80px'}).observe(hero);
 hero.addEventListener('pointermove',event=>{if(paused()||event.pointerType!=='mouse')return;const rect=hero.getBoundingClientRect();engine?.setPointer((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1);},{passive:true});
 hero.addEventListener('pointerleave',()=>engine?.setPointer(0,0));
}
addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
addEventListener('portfolio:motion',()=>{engine?.setPaused(paused());if(paused())document.getAnimations().filter(animation=>animation.effect?.target?.closest?.('#home')).forEach(animation=>{try{animation.finish();}catch{}});roles();request();});
document.addEventListener('visibilitychange',roles);reduced.addEventListener('change',roles);
const showreel=document.querySelector('#portfolio-showreel');if(showreel)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&document.pictureInPictureElement!==showreel)showreel.pause();},{threshold:.05}).observe(showreel);
request();
