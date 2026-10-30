
// These three records are copied from the original portfolio, including terms.
const serviceDetails = [
    {
      image:'../images/project-vsl.jpg', tag:'Editing System', kicker:'01 / Creative Execution', title:'Video Editing',
      text:'I build retention-focused editing systems for ads, reels, talking-head videos, B-roll edits, VSLs, and podcast clips — designed to hold attention and make the message easier to understand.',
      tools:['Filmora','CapCut','Premiere Pro','DaVinci Resolve']
    },
    {
      image:'../images/project-ai-video.jpg', tag:'AI Creative Engine', kicker:'02 / AI Production', title:'AI Content Creation',
      text:'I create AI-assisted content workflows for visuals, avatars, voiceovers, transitions, and creative variations that help brands test more ideas faster.',
      tools:['Kling','Higgsfield','Flux','Gemini','ElevenLabs']
    },
    {
      image:'../images/project-ghl.jpg', tag:'GHL System', kicker:'03 / CRM + Funnel Build', title:'GoHighLevel Setup',
      text:'I set up client-ready GoHighLevel systems with funnels, forms, calendars, pipelines, tags, opportunities, and CRM structures that support lead capture and follow-up.',
      tools:['GoHighLevel','Funnels','Pipelines','Forms','Calendars']
    },
    {
      image:'../images/founder-tracker-workflow.png', tag:'Operations System', kicker:'04 / Business Operations', title:'Automation Workflows',
      text:'I design automation workflows, reporting trackers, lead-routing logic, and SOP support systems that reduce repetitive tasks and improve operational visibility.',
      tools:['Make','n8n','Google Sheets','Automation','SOPs']
    },
    {
      image:'../images/project-web.jpg', tag:'Website + Funnel', kicker:'05 / Digital Experience', title:'Web & Funnel Design',
      text:'I build modern website and funnel pages focused on trust, clean presentation, lead capture, responsive design, and clear calls-to-action.',
      tools:['HTML','CSS','JavaScript','GHL Pages','Responsive Design']
    },
    {
      image:'../images/project-social.jpg', tag:'Publishing System', kicker:'06 / Distribution System', title:'Content Operations',
      text:'I help organize content machines for repurposing, scheduling, asset management, posting workflows, and performance-based content iteration.',
      tools:['Content Calendar','Reels','Shorts','Posting Workflow','Analytics']
    }
  ];
const websitePackages = [
    {
      tier: 'Basic Website',
      price: '₱5,000 – ₱8,000',
      tag: 'Personal & Portfolio',
      icon: '🌱',
      desc: 'Best for simple personal websites, portfolios, freelancers, and small service pages.',
      includes: [
        '1-page responsive website',
        'Home / introduction section',
        'About section',
        'Services, skills, or business info section',
        'Portfolio / works / showcase section',
        'Contact information section',
        'Social media links',
        'Mobile-friendly layout',
        'Clean professional design',
        '1 round of revision',
      ]
    },
    {
      tier: 'Standard Website',
      price: '₱8,000 – ₱15,000',
      tag: 'Small Business & Freelancers',
      icon: '🚀',
      desc: 'Best for small businesses, freelancers, professionals, and service providers.',
      includes: [
        'Multi-section website or up to 3 pages',
        'Home page',
        'About page or section',
        'Services section',
        'Portfolio / projects / business showcase',
        'Contact section',
        'Social media links',
        'Mobile and tablet responsive design',
        'Custom styling based on your brand',
        'Basic SEO setup',
        '2 rounds of revisions',
      ]
    },
    {
      tier: 'Premium Website',
      price: '₱15,000 – ₱25,000',
      tag: 'Modern & Premium',
      icon: '💎',
      desc: 'Best for businesses and professionals who want a more premium and modern website.',
      includes: [
        'Custom premium website design',
        'Up to 5 pages',
        'Strong hero section',
        'About / company profile section',
        'Services page or section',
        'Portfolio / project / case study section',
        'Testimonials or achievements section',
        'Contact form or inquiry section',
        'Basic animations and smooth scrolling',
        'Mobile, tablet, and desktop responsive design',
        'Basic SEO optimization',
        'Deployment support',
        '2 rounds of revisions',
      ]
    },
    {
      tier: 'Business / Pro Website',
      price: '₱25,000+',
      tag: 'Full Business Solution',
      icon: '⚡',
      desc: 'Best for businesses, agencies, consultants, coaches, and service providers who need advanced features.',
      includes: [
        'Premium custom website design',
        'Multiple pages depending on business needs',
        'Service pages',
        'Landing page or lead generation structure',
        'Contact form / lead inquiry form',
        'Booking or appointment section',
        'Analytics setup',
        'Basic automation or integration support',
        'SEO-ready structure',
        'Mobile, tablet, and desktop optimization',
        'Deployment support',
        '2 to 3 rounds of revisions',
      ]
    }
  ];
const websiteAddons = [
    'Domain and hosting setup', 'Website maintenance', 'Additional pages',
    'Copywriting assistance', 'Logo or branding support', 'Booking calendar setup',
    'Contact form automation', 'Google Analytics setup', 'Monthly website updates',
    'Business email setup', 'Website redesign',
  ];

const roleTitles=['Video Editor','AI Content Creator','GHL Automation Builder','Digital Systems Creator','VSL & Ads Editor'];
const readPreference=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const savePreference=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
const reducedQuery=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):null;
let savedPaused=(readPreference('kenzaki-motion')??readPreference('kenzaki-v2-motion'))==='paused';
let motionPaused=Boolean(reducedQuery?.matches)||savedPaused;
export const getMotionState=()=>motionPaused;
export {serviceDetails,websitePackages,websiteAddons,roleTitles};

function initializePortfolio(){
  const $=(selector,scope=document)=>scope.querySelector(selector);
  const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
  const body=document.body;
  body.classList.add('js-ready');

  function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
  function assetPath(value=''){return /^(?:images|media)\//.test(value)||value==='resume.pdf'?'../'+value:value;}
  function safeURL(value,{image=false}={}){
    if(!value)return null;
    try{const url=new URL(assetPath(value),document.baseURI);return (image?['http:','https:']:['http:','https:','mailto:']).includes(url.protocol)?url.href:null;}catch{return null;}
  }
  function link(text,url,className='text-link'){
    const a=element('a',className,text),href=safeURL(url);
    if(href){a.href=href;if(!href.startsWith('mailto:')){a.target='_blank';a.rel='noopener noreferrer';}}
    return a;
  }
  function image(src,alt,className){const img=element('img',className);img.alt=alt||'';const url=safeURL(src,{image:true});if(url)img.src=url;img.decoding='async';return img;}
  const enhancedActivations=new WeakSet();
  function makeActivatable(node,label){
    if(node.matches('a[href],button,input,select,textarea,summary')||enhancedActivations.has(node))return;
    enhancedActivations.add(node);
    node.setAttribute('role','button');if(!node.hasAttribute('tabindex'))node.tabIndex=0;
    if(label&&!node.hasAttribute('aria-label'))node.setAttribute('aria-label',label);
    node.addEventListener('keydown',event=>{
      if(event.target!==node||!['Enter',' '].includes(event.key))return;
      event.preventDefault();node.click();
    });
  }
  function animateSelection(node){
    if(!node||motionPaused||typeof node.animate!=='function')return;
    node.getAnimations?.().forEach(animation=>animation.cancel());
    node.animate([{opacity:.45,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.7,.2,1)'});
  }

  // Theme and motion apply to the complete reading experience, not just WebGL.
  const themeButton=$('#theme-toggle');
  function setTheme(theme,persist=false){
    const light=theme==='light';body.classList.toggle('light',light);body.dataset.theme=light?'light':'dark';document.documentElement.dataset.theme=body.dataset.theme;
    if(themeButton){themeButton.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');themeButton.setAttribute('aria-pressed',String(light));const label=$('[data-theme-label]',themeButton);if(label)label.textContent=light?'Dark mode':'Light mode';}
    if(persist)savePreference('kenzaki-theme',body.dataset.theme);
    window.dispatchEvent(new CustomEvent('portfolio:theme',{detail:{theme:body.dataset.theme}}));
  }
  setTheme(readPreference('kenzaki-theme')==='light'?'light':'dark');
  themeButton?.addEventListener('click',()=>setTheme(body.classList.contains('light')?'dark':'light',true));
  const motionButton=$('#motion-toggle');
  function setMotion(){
    motionPaused=Boolean(reducedQuery?.matches)||savedPaused;
    body.classList.toggle('motion-paused',motionPaused);document.documentElement.classList.toggle('motion-paused',motionPaused);document.documentElement.dataset.motion=motionPaused?'paused':'playing';
    if(motionButton){
      motionButton.setAttribute('aria-pressed',String(motionPaused));motionButton.setAttribute('aria-label',reducedQuery?.matches?'Motion reduced by your device setting':motionPaused?'Resume motion':'Pause motion');
      motionButton.disabled=Boolean(reducedQuery?.matches);
      const label=$('[data-motion-label],.motion-label',motionButton);if(label)label.textContent=reducedQuery?.matches?'Reduced motion':motionPaused?'Motion paused':'Motion on';
    }
    if(motionPaused)$$('.will-reveal').forEach(node=>{node.classList.remove('will-reveal');node.classList.add('is-visible');});
    window.dispatchEvent(new CustomEvent('portfolio:motion',{detail:{paused:motionPaused}}));
  }
  setMotion();
  motionButton?.addEventListener('click',()=>{if(reducedQuery?.matches)return;savedPaused=!savedPaused;savePreference('kenzaki-motion',savedPaused?'paused':'playing');setMotion();});
  reducedQuery?.addEventListener?.('change',setMotion);
  const roleList=$('.role-list');
  if(roleList&&!roleList.textContent.trim())roleTitles.forEach(role=>roleList.append(element(roleList.matches('ul,ol')?'li':'span','',role)));

  const navToggle=$('#nav-toggle'),nav=$('#main-nav'),backdrop=$('[data-nav-backdrop]');
  function closeMenu(){nav?.classList.remove('open');navToggle?.setAttribute('aria-expanded','false');navToggle?.setAttribute('aria-label','Open navigation');body.classList.remove('nav-open');backdrop?.classList.remove('visible');}
  function toggleMenu(){const open=!nav?.classList.contains('open');nav?.classList.toggle('open',open);navToggle?.setAttribute('aria-expanded',String(open));navToggle?.setAttribute('aria-label',open?'Close navigation':'Open navigation');body.classList.toggle('nav-open',open);backdrop?.classList.toggle('visible',open);}
  navToggle?.addEventListener('click',toggleMenu);backdrop?.addEventListener('click',closeMenu);
  nav?.addEventListener('click',event=>{if(event.target.closest('a[href]'))closeMenu();});
  addEventListener('resize',()=>{if(innerWidth>980)closeMenu();},{passive:true});

  // Native dialog supplies focus containment; every preview shares one cleanup.
  let dialog=$('#portfolio-dialog');
  if(!dialog){dialog=element('dialog','portfolio-dialog');dialog.id='portfolio-dialog';const close=element('button','dialog-close','Close ×');close.type='button';close.dataset.closeDialog='';close.setAttribute('aria-label','Close preview');dialog.append(close,element('h2','dialog-title'),element('div','dialog-body'));body.append(dialog);}
  dialog.classList.add('portfolio-dialog');
  let dialogTitle=$('.dialog-title',dialog),dialogBody=$('.dialog-body',dialog);
  if(!dialogTitle){dialogTitle=element('h2','dialog-title');dialog.prepend(dialogTitle);}
  if(!dialogBody){dialogBody=element('div','dialog-body');dialog.append(dialogBody);}
  if(!dialogTitle.id)dialogTitle.id='portfolio-dialog-title';dialog.setAttribute('aria-labelledby',dialogTitle.id);
  let returnFocus=null,wasOpen=false;
  function stopDialogMedia(){
    $$('video,audio',dialogBody).forEach(media=>{media.pause();media.removeAttribute('src');$$('source',media).forEach(source=>source.removeAttribute('src'));media.load?.();});
    $$('iframe',dialogBody).forEach(frame=>frame.removeAttribute('src'));
  }
  function cleanDialog(){
    stopDialogMedia();dialogBody.replaceChildren();body.classList.remove('dialog-open','modal-open');dialog.classList.remove('packages-dialog','system-dialog','video-dialog','image-dialog');
    if(wasOpen){wasOpen=false;const focus=returnFocus;returnFocus=null;if(focus?.isConnected)focus.focus({preventScroll:true});}
  }
  function closeDialog(){if(!dialog.open&&!wasOpen)return;stopDialogMedia();if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');cleanDialog();}
  function openDialog(title,content,trigger,kind=''){
    stopDialogMedia();dialogBody.replaceChildren(content);dialogTitle.textContent=title||'Project preview';dialog.className='portfolio-dialog'+(kind?' '+kind:'');returnFocus=trigger||document.activeElement;wasOpen=true;
    $$('video,audio').forEach(media=>{if(!dialog.contains(media))media.pause();});
    closeMenu();body.classList.add('dialog-open');
    if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else{dialog.setAttribute('open','');dialog.setAttribute('aria-modal','true');}
    const close=$('[data-close-dialog],[data-close-modal],.dialog-close',dialog);close?.focus({preventScroll:true});
  }
  dialog.addEventListener('close',cleanDialog);
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();if(dialog.open)closeDialog();}});

  function packageContent(){
    const wrapper=element('div','wd-modal-inner');
    const hero=element('div','wd-hero');hero.append(element('p','wd-eyebrow','Professional Service'),element('h3','wd-title','Website Design & Development'),element('p','wd-subtitle','Your website is your digital first impression. I build clean, responsive, and professional websites that make your brand look credible online.'));wrapper.append(hero);
    const accordion=element('div','wd-accordion');
    websitePackages.forEach((pkg,index)=>{
      const item=element('details','wd-accordion-item package-item');item.name='website-packages';item.open=index===0;
      const head=element('summary','wd-accordion-head'),info=element('span','wd-acc-info');
      info.append(element('span','wd-acc-tier',pkg.tier),element('span','wd-acc-tag',pkg.tag));head.append(element('span','wd-acc-icon',pkg.icon),info,element('span','wd-acc-price',pkg.price),element('span','wd-acc-chevron','›'));
      const content=element('div','wd-accordion-body');content.append(element('p','wd-acc-desc',pkg.desc));const list=element('ul','wd-include-list');pkg.includes.forEach(value=>{const li=element('li');li.append(element('span','wd-check','✓'),document.createTextNode(value));list.append(li);});content.append(list);item.append(head,content);accordion.append(item);
    });wrapper.append(accordion);
    const extras=element('div','wd-extras'),addons=element('div','wd-addons-block'),tags=element('div','wd-addons-wrap');addons.append(element('h4','','Optional Add-ons'));websiteAddons.forEach(value=>tags.append(element('span','wd-addon-tag',value)));addons.append(tags);extras.append(addons);
    const terms=element('div','wd-terms-block');
    for(const [title,text]of [['Maintenance','Starts at ₱1,000/month for minor updates, fixes, and basic support.'],['Payment Terms','50% down payment to start. Remaining 50% before final turnover.'],['Note','Domain, hosting, paid tools, premium plugins, and third-party subscriptions are not included.']]){
      const row=element('div','wd-term-row');row.append(element('strong','',title),element('p','',text));terms.append(row);
    }extras.append(terms);wrapper.append(extras,link('Message Me Today →','mailto:jjmanalo.va@gmail.com?subject=Website%20Package%20Inquiry','wd-cta-btn'));
    return wrapper;
  }
  function showPreview(trigger){
    const type=trigger.dataset.modal,title=trigger.dataset.title||$('h3,h4',trigger)?.textContent||'Project preview';
    let content=element('div','modal-content'),kind='';
    if(type==='youtube'){
      const id=trigger.dataset.src;if(!/^[a-zA-Z0-9_-]{6,20}$/.test(id||''))return;
      const iframe=element('iframe','project-player');iframe.title=title;iframe.src='https://www.youtube.com/embed/'+encodeURIComponent(id)+'?autoplay=1&controls=1&rel=0';iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';content.append(iframe);kind='video-dialog';
    }else if(type==='video'){
      const source=safeURL(trigger.dataset.src);if(!source)return;
      if(trigger.dataset.type==='external'){content.append(element('p','','This preview is available through an external portfolio link.'),link('Open Preview →',source,'btn primary'));}
      else{const video=element('video','project-player');video.src=source;video.controls=true;video.autoplay=true;video.playsInline=true;video.preload='metadata';const poster=safeURL(trigger.dataset.poster,{image:true});if(poster)video.poster=poster;content.append(video);kind='video-dialog';}
    }else if(type==='system'){
      content=element('div','modal-system-card');content.append(image(trigger.dataset.image||$('img',trigger)?.getAttribute('src'),title));
      const copy=element('div','modal-system-copy');copy.append(element('span','','System Case Study'),element('h3','',title),element('p','',trigger.dataset.result||''));
      const tags=element('div','modal-system-tools');(trigger.dataset.tools||'').split('•').map(value=>value.trim()).filter(Boolean).forEach(value=>tags.append(element('em','',value)));copy.append(tags);
      const result=element('div','modal-system-result');result.append(element('p','','Built to make the workflow clearer, faster to manage, and easier to scale for real business operations.'));copy.append(result);content.append(copy);kind='system-dialog';
    }else if(type==='image'){
      content.append(image(trigger.dataset.src,title,'proof-preview'));kind='image-dialog';
    }else if(type==='link'){
      const url=safeURL(trigger.dataset.url);if(!url)return;
      content=element('div','modal-link-card');content.append(element('p','','Open this item to view related samples, credentials, or project proof.'),link('Open Item →',url,'btn primary'));
    }else if(type==='webdesign'){content=packageContent();openDialog('Website Design & Development',content,trigger,'packages-dialog');return;}
    else return;
    openDialog(title,content,trigger,kind);
  }
  $$('[data-modal]').forEach(node=>makeActivatable(node,'Open '+(node.dataset.title||$('h3,h4',node)?.textContent||'preview')));
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-close-dialog],[data-close-modal]')){event.preventDefault();closeDialog();return;}
    const trigger=event.target.closest('[data-modal]');if(!trigger)return;
    const nestedLink=event.target.closest('a[href]');if(nestedLink&&nestedLink!==trigger)return;
    event.preventDefault();showPreview(trigger);
  });

  // Original six service records, with a single stable preview area.
  const buildTiles=$$('.build-tile[data-build]');let serviceAnimation=null;
  function selectService(index){
    const item=serviceDetails[index];if(!item)return;
    $('.build-preview-wrap')?.style.setProperty('--service-order',String(index*2+1));
    buildTiles.forEach(tile=>{const active=Number(tile.dataset.build)===index;tile.classList.toggle('active',active);tile.setAttribute('aria-pressed',String(active));});
    const img=$('#buildPreviewImage');if(img){img.src=assetPath(item.image);img.alt=item.title+' preview';}
    for(const [selector,value]of [['#buildPreviewTag',item.tag],['#buildPreviewKicker',item.kicker],['#buildPreviewTitle',item.title],['#buildPreviewText',item.text]]){const node=$(selector);if(node)node.textContent=value;}
    const tools=$('#buildPreviewTools');if(tools)tools.replaceChildren(...item.tools.map(value=>element('em','',value)));
    serviceAnimation?.cancel();const preview=$('.build-preview-card');if(preview&&!motionPaused&&typeof preview.animate==='function')serviceAnimation=preview.animate([{opacity:.45,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  buildTiles.forEach(tile=>{makeActivatable(tile,'Show '+($('h3',tile)?.textContent||'service'));tile.addEventListener('click',()=>selectService(Number(tile.dataset.build)));tile.addEventListener('focus',()=>selectService(Number(tile.dataset.build)));tile.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectService(Number(tile.dataset.build));});});

  const systems=$('#systems'),systemCards=$$('.system-stack-card'),systemDots=$('#systemsStackDots');let systemIndex=0;
  function selectSystem(index){
    if(!systemCards.length)return;systemIndex=(index+systemCards.length)%systemCards.length;
    systemCards.forEach((card,i)=>{card.classList.toggle('active',i===systemIndex);card.style.setProperty('--stack-offset',String(i-systemIndex));if(i===systemIndex)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});
    $$('button',systemDots||document.createElement('div')).forEach((button,i)=>button.setAttribute('aria-pressed',String(i===systemIndex)));
    if(systems)systems.dataset.activeIndex=String(systemIndex);animateSelection(systemCards[systemIndex]);
  }
  if(systemCards.length){
    systems?.classList.add('has-systems-controls');
    if(systemDots){systemDots.removeAttribute('aria-hidden');systemDots.setAttribute('role','group');systemDots.setAttribute('aria-label','Choose a system case');systemDots.replaceChildren(...systemCards.map((card,index)=>{if(!card.id)card.id='system-case-'+index;const title=card.dataset.title||$('h3',card)?.textContent||'System '+(index+1),button=element('button','system-select',title);button.type='button';button.setAttribute('aria-controls',card.id);button.addEventListener('click',()=>selectSystem(index));return button;}));}
    $('[data-stack-prev]')?.addEventListener('click',()=>selectSystem(systemIndex-1));$('[data-stack-next]')?.addEventListener('click',()=>selectSystem(systemIndex+1));selectSystem(0);
  }

  const featuredTrack=$('.featured-track'),featuredCards=$$('#featured .case-card');let featuredIndex=0;
  function moveFeatured(direction){
    if(!featuredTrack||!featuredCards.length)return;
    const bounds=featuredTrack.getBoundingClientRect();let nearest=0,distance=Infinity;featuredCards.forEach((card,index)=>{const d=Math.abs(card.getBoundingClientRect().left-bounds.left);if(d<distance){nearest=index;distance=d;}});
    featuredIndex=Math.max(0,Math.min(featuredCards.length-1,nearest+direction));const target=featuredCards[featuredIndex];const left=target.getBoundingClientRect().left-bounds.left+featuredTrack.scrollLeft;featuredTrack.scrollTo({left,behavior:motionPaused?'auto':'smooth'});
  }
  $('[data-featured-prev]')?.addEventListener('click',()=>moveFeatured(-1));$('[data-featured-next]')?.addEventListener('click',()=>moveFeatured(1));

  const reviews=$$('.testimonial-card');let reviewIndex=0;
  function selectReview(index){if(!reviews.length)return;reviewIndex=(index+reviews.length)%reviews.length;reviews.forEach((card,i)=>{const active=i===reviewIndex;card.classList.toggle('active',active);card.classList.toggle('next',i===(reviewIndex+1)%reviews.length);card.classList.toggle('prev-card',i===(reviewIndex+reviews.length-1)%reviews.length);if(active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');});}
  $('.testimonial-nav.next-btn')?.addEventListener('click',()=>selectReview(reviewIndex+1));$('.testimonial-nav.prev')?.addEventListener('click',()=>selectReview(reviewIndex-1));reviews.forEach((card,index)=>card.addEventListener('click',()=>selectReview(index)));selectReview(0);

  // The complete twelve-item collection remains in normal document flow.
  $$('.orbit-card').forEach((card,index)=>{card.style.setProperty('--reel-index',String(index));card.addEventListener('focus',()=>{const section=$('#vault');if(section)section.dataset.selectedReel=String(index);});});
  const showreel=$('#portfolio-showreel');
  $('[data-play-showreel]')?.addEventListener('click',()=>{if(!showreel)return;showreel.controls=true;showreel.play().catch(()=>{});showreel.focus({preventScroll:true});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){$$('video').forEach(video=>video.pause());}});

  if('IntersectionObserver' in window&&!motionPaused){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.remove('will-reveal');entry.target.classList.add('is-visible');observer.unobserve(entry.target);}),{rootMargin:'0px 0px -35px',threshold:.08});
    $$('.reveal').forEach(node=>{if(node.getBoundingClientRect().top>innerHeight){node.classList.add('will-reveal');observer.observe(node);}else node.classList.add('is-visible');});
  }else $$('.reveal').forEach(node=>node.classList.add('is-visible'));
  const header=$('.navigation,.site-header');
  const onScroll=()=>{header?.classList.toggle('is-scrolled',scrollY>35);const progress=$('[data-scroll-progress]');if(progress){const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?Math.max(0,Math.min(1,scrollY/range)):0)+')';}};
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  window.dispatchEvent(new CustomEvent('portfolio:ready',{detail:{paused:motionPaused,theme:body.dataset.theme}}));
}

if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializePortfolio,{once:true});else initializePortfolio();
}
