import {getMotionState} from './portfolio.js';
const host=document.querySelector('#hero-scene');
const art=document.querySelector('.hero-art');
const scrollArea=document.querySelector('.hero-scroll');
const sticky=document.querySelector('.hero-sticky');
let engine=null,visible=true,scheduled=0,failed=false;
const small=matchMedia('(max-width:700px)');
const clamp=v=>Math.min(1,Math.max(0,v));
function paused(){const value=getMotionState();return typeof value==='boolean'?value:Boolean(value?.paused);}
function update(){scheduled=0;const r=scrollArea.getBoundingClientRect();const range=Math.max(1,scrollArea.offsetHeight-sticky.offsetHeight);const p=small.matches||paused()?1:clamp(-r.top/range);engine?.setProgress(p);document.documentElement.style.setProperty('--hero-progress',String(p));const bar=document.querySelector('.page-progress');if(bar){const full=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.width=(clamp(scrollY/full)*100)+'%';}document.querySelector('.site-nav')?.classList.toggle('is-scrolled',scrollY>30);}
function request(){if(!scheduled)scheduled=requestAnimationFrame(update);}
function fallback(){failed=true;art.classList.remove('is-ready');host.dataset.state='fallback';}
if(host&&scrollArea&&sticky){
 addEventListener('scroll',request,{passive:true});
 addEventListener('resize',()=>{engine?.resize();request();},{passive:true});
 addEventListener('portfolio:motion',event=>{engine?.setPaused(Boolean(event.detail?.paused));request();});
 small.addEventListener('change',()=>{engine?.resize();request();});
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;engine?.setVisible(visible);},{rootMargin:'100px'}).observe(host);
 import('./cinematic-scene.js').then(async({createHeroScene})=>{
  engine=await createHeroScene(host,{paused:paused(),onReady(){if(!failed){art.classList.add('is-ready');host.dataset.state='ready';}},onFailure:fallback});
  engine?.setVisible(visible);request();
 }).catch(fallback);
 request();
}
// User-started media quiets when it leaves the page, while PiP remains intentional.
const showreel=document.querySelector('#portfolio-showreel');
if(showreel&&'IntersectionObserver'in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&document.pictureInPictureElement!==showreel)showreel.pause();},{threshold:.05}).observe(showreel);
