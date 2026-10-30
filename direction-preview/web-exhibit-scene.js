import * as THREE from './vendor/three.module.min.js';
import {projects} from './projects.js';

const ORDER=[0,5,6,7,1,2,3,4],clamp=THREE.MathUtils.clamp;

// Native screenshots are mounted on real, individually framed display panels.
export async function createWebExhibit(host,{paused=false,index=0,onReady,onSelect,onFailure}={}) {
  if(!host)return null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(39,1,.1,90);
  const geometries=new Set(),materials=new Set(),textures=new Set(),panels=[],clickTargets=[],hits=[];
  const raycaster=new THREE.Raycaster(),rayPointer=new THREE.Vector2(),look=new THREE.Vector3();
  let renderer,observer,intersection,raf=0,disposed=false,failed=false,ready=false,visible=true,intersecting=true,phone=false;
  let width=0,height=0,dpr=0,last=0,frames=0,lastReport=-Infinity,selection=ORDER.includes(Number(index))?Number(index):0;
  let pause=Boolean(paused),inputProgress=0,progress=pause||reduced.matches?1:0,progressGoal=progress;
  let pointerX=0,pointerY=0,easedX=0,easedY=0,down=null,selectionClock=0,drift=0,driftGoal=0,dollyShift=0,dollyGoal=0;
  const still=()=>pause||reduced.matches;
  const geometry=g=>(geometries.add(g),g),material=m=>(materials.add(m),m);
  function mesh(g,m,parent=scene){const object=new THREE.Mesh(g,m);parent.add(object);return object;}
  function data(key,value){if(host.dataset[key]!==value)host.dataset[key]=value;}
  function fail(error){if(disposed||failed)return;failed=true;cancelAnimationFrame(raf);raf=0;if(renderer)renderer.domElement.hidden=true;data('renderer','fallback');data('loop','stopped');onFailure?.(error);}
  function discardGeometry(g){geometries.delete(g);g.dispose();}
  function frameGeometry(w,h){
    const r=.09,s=new THREE.Shape(),x=-w/2,y=-h/2;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
    const g=geometry(new THREE.ExtrudeGeometry(s,{depth:.095,bevelEnabled:true,bevelThickness:.018,bevelSize:.018,bevelSegments:2,curveSegments:4,steps:1}));g.translate(0,0,-.0475);return g;
  }
  function offsetFor(position,selected){let offset=position-selected;if(offset>4)offset-=8;if(offset< -3)offset+=8;return offset;}
  function layout(offset){
    const distance=Math.abs(offset),sign=Math.sign(offset);
    return {x:sign*(distance===0?0:4.55+(distance-1)*3.25),z:distance===0?1.05:-.85-(distance-1)*2.25,
      angle:-sign*Math.min(.62,.38+Math.max(0,distance-1)*.13),scale:distance===0?1.4:Math.max(.69,.94-Math.max(0,distance-1)*.105),y:2.73+Math.sin(offset*1.2)*.09};
  }
  function applyPanel(panel){
    const p=panel.pose;panel.root.position.set(p.x,0,p.z);panel.root.rotation.y=p.angle;panel.mount.position.y=p.y;panel.mount.scale.setScalar(p.scale);
    const stemHeight=Math.max(.13,p.y-panel.nativeHeight*p.scale/2-.15);panel.stem.scale.y=stemHeight;panel.stem.position.y=.12+stemHeight/2;
    panel.foot.scale.x=1.3*p.scale;panel.shadow.scale.set(3.2*p.scale,1.15*p.scale,1);panel.root.visible=Math.abs(panel.offset)<3.1||panel.moving;
  }
  function mountTexture(panel,texture){
    const ratio=texture.image.width/texture.image.height;
    if(Number.isFinite(ratio)&&ratio>0&&Math.abs(ratio-panel.ratio)>.0001){panel.ratio=ratio;panel.nativeHeight=4.6/ratio;discardGeometry(panel.frame.geometry);panel.frame.geometry=frameGeometry(4.78,panel.nativeHeight+.18);panel.screen.scale.set(4.6,panel.nativeHeight,1);applyPanel(panel);}
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    panel.screen.material.color.set('#ffffff');panel.screen.material.map=texture;panel.screen.material.needsUpdate=true;panel.loaded=true;request();
  }
  function loadPanel(panel){
    if(panel.loading||panel.loaded||panel.broken)return;panel.loading=true;
    new THREE.TextureLoader().load(new URL(projects[panel.index].image,import.meta.url).href,texture=>{
      if(disposed||failed){texture.dispose();return;}textures.add(texture);mountTexture(panel,texture);
    },undefined,()=>{panel.broken=true;if(panel.index===selection)fail(new Error('The selected project screenshot could not load.'));});
  }
  function loadVisible(){const position=ORDER.indexOf(selection);for(const panel of panels)if(Math.abs(offsetFor(panel.position,position))<=2)loadPanel(panel);}
  function arrange(next,immediate=false){
    const selected=ORDER.indexOf(next);selection=next;selectionClock=0;driftGoal=Math.sin(selected*.67)*.16;dollyGoal=Math.sin(selected*.49)*.17;
    if(immediate||still()){drift=driftGoal;dollyShift=dollyGoal;}
    for(const panel of panels){
      const offset=offsetFor(panel.position,selected),target=layout(offset),wrapped=Math.abs(offset-panel.offset)>4;
      panel.start.x=panel.pose.x;panel.start.z=panel.pose.z;panel.start.angle=panel.pose.angle;panel.start.scale=panel.pose.scale;panel.start.y=panel.pose.y;
      panel.offset=offset;panel.target=target;panel.delay=Math.abs(offset)*.035;panel.duration=offset===0?.82:.73;panel.moving=!immediate&&!wrapped&&!still();
      if(!panel.moving){Object.assign(panel.pose,target);applyPanel(panel);}else panel.root.visible=true;
    }
    loadVisible();request();
  }
  try {
    renderer=new THREE.WebGLRenderer({alpha:false,antialias:true,powerPreference:'high-performance'});renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.setClearColor('#f2efe8',1);
    renderer.debug.onShaderError=(gl,program)=>fail(new Error('The exhibit material could not compile: '+gl.getProgramInfoLog(program)));
    renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.tabIndex=-1;
    Object.assign(renderer.domElement.style,{display:'block',width:'100%',height:'100%',touchAction:'pan-y'});host.append(renderer.domElement);data('renderer','loading');
    scene.background=new THREE.Color('#f2efe8');scene.fog=new THREE.Fog('#f2efe8',22,55);
    scene.add(new THREE.HemisphereLight('#ffffff','#b6c5c7',3.1));
    const key=new THREE.DirectionalLight('#fff6e8',3.4);key.position.set(-6,12,10);scene.add(key);
    const rim=new THREE.DirectionalLight('#b9e4e7',1.4);rim.position.set(8,5,-5);scene.add(rim);
    const frameMaterial=material(new THREE.MeshStandardMaterial({color:'#26373e',metalness:.42,roughness:.28}));
    const stemMaterial=material(new THREE.MeshStandardMaterial({color:'#8b989b',metalness:.58,roughness:.35}));
    const porcelain=material(new THREE.MeshStandardMaterial({color:'#e5e6de',metalness:.12,roughness:.45}));
    const floorMaterial=material(new THREE.MeshStandardMaterial({color:'#e8e5dc',roughness:.88,metalness:0}));
    const accentMaterial=material(new THREE.MeshBasicMaterial({color:'#74aeb0',transparent:true,opacity:.5}));
    const planeGeometry=geometry(new THREE.PlaneGeometry(1,1)),boxGeometry=geometry(new THREE.BoxGeometry(1,1,1));
    const floor=mesh(geometry(new THREE.PlaneGeometry(85,90)),floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.z=-15;
    const grid=new THREE.GridHelper(48,32,'#bac8c3','#ced4cb');grid.position.set(0,.004,-10);grid.material.transparent=true;grid.material.opacity=.23;scene.add(grid);geometries.add(grid.geometry);materials.add(grid.material);
    const path=[];for(let n=0;n<=48;n++){const x=-19+n/48*38;path.push(new THREE.Vector3(x,.018,-.35-x*x*.026+Math.sin(x*.34)*.23));}
    mesh(geometry(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(path),96,.012,4,false)),accentMaterial);
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d');
    const gradient=ctx.createRadialGradient(64,64,7,64,64,61);gradient.addColorStop(0,'rgba(22,37,39,.27)');gradient.addColorStop(.45,'rgba(22,37,39,.12)');gradient.addColorStop(1,'rgba(22,37,39,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const shadowTexture=new THREE.CanvasTexture(shadowCanvas);textures.add(shadowTexture);const shadowMaterial=material(new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,toneMapped:false}));
    for(let position=0;position<ORDER.length;position++){
      const original=ORDER[position],ratio=original===0?1086/817:1265/712,nativeHeight=4.6/ratio,root=new THREE.Group(),mount=new THREE.Group();scene.add(root);root.add(mount);
      const frame=mesh(frameGeometry(4.78,nativeHeight+.18),frameMaterial,mount);
      const screen=mesh(planeGeometry,material(new THREE.MeshBasicMaterial({color:'#dce4e0',toneMapped:false})),mount);screen.scale.set(4.6,nativeHeight,1);screen.position.z=.071;screen.userData.projectIndex=original;clickTargets.push(screen);
      const stem=mesh(boxGeometry,stemMaterial,root);stem.scale.set(.065,1,.085);stem.position.z=-.035;
      const foot=mesh(boxGeometry,porcelain,root);foot.scale.set(1.3,.09,.52);foot.position.y=.065;
      const footEdge=mesh(boxGeometry,accentMaterial,root);footEdge.scale.set(.72,.012,.018);footEdge.position.set(0,.113,.269);
      const shadow=mesh(planeGeometry,shadowMaterial,root);shadow.rotation.x=-Math.PI/2;shadow.position.y=.009;shadow.position.z=.08;
      panels.push({index:original,position,ratio,nativeHeight,root,mount,frame,screen,stem,foot,shadow,pose:{x:0,z:0,angle:0,scale:1,y:2.73},start:{},target:null,offset:position-ORDER.indexOf(selection),moving:false,loaded:false,loading:false,broken:false});
    }
  } catch(error){fail(error);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer?.dispose();renderer?.domElement.remove();return null;}
  function request(){if(!raf&&!disposed&&!failed&&visible&&intersecting&&!document.hidden){last=0;raf=requestAnimationFrame(render);}}
  function report(now,settled,force=false){
    if(!settled&&!force&&now-lastReport<200)return;lastReport=now;data('frame',String(frames));data('project',String(selection));data('loop',settled?'sleeping':'active');
  }
  function suspend(){cancelAnimationFrame(raf);raf=0;last=0;if(frames)report(performance.now(),false,true);data('loop','suspended');}
  function resize(){
    if(disposed||failed)return;const bounds=host.getBoundingClientRect(),w=Math.max(1,Math.round(bounds.width)),h=Math.max(1,Math.round(bounds.height)),small=w<650;
    const ratio=Math.min(devicePixelRatio||1,small?1:1.25,Math.sqrt((small?800000:1400000)/(w*h)));
    if(w===width&&h===height&&ratio===dpr&&phone===small)return;width=w;height=h;dpr=ratio;phone=small;
    renderer.setDrawingBufferSize(width,height,dpr);camera.aspect=width/height;camera.fov=phone?41:39;camera.updateProjectionMatrix();request();
  }
  function render(now){
    raf=0;if(disposed||failed||!visible||!intersecting||document.hidden)return;
    const interval=phone?1000/30:1000/60,delta=last?now-last:interval;if(last&&delta<interval-1){raf=requestAnimationFrame(render);return;}last=now;
    const dt=Math.min(delta,60)*.001,stopped=still(),weight=1-Math.exp(-dt*8);selectionClock+=dt;
    progress=stopped?1:progress+(progressGoal-progress)*weight;easedX=stopped?0:easedX+(pointerX-easedX)*weight;easedY=stopped?0:easedY+(pointerY-easedY)*weight;
    drift=stopped?driftGoal:drift+(driftGoal-drift)*weight;dollyShift=stopped?dollyGoal:dollyShift+(dollyGoal-dollyShift)*weight;
    if(Math.abs(progressGoal-progress)<.0004)progress=progressGoal;if(Math.abs(pointerX-easedX)<.0008)easedX=pointerX;if(Math.abs(pointerY-easedY)<.0008)easedY=pointerY;
    if(Math.abs(driftGoal-drift)<.0004)drift=driftGoal;if(Math.abs(dollyGoal-dollyShift)<.0004)dollyShift=dollyGoal;
    let moving=false;
    for(const panel of panels)if(panel.moving){
      const t=stopped?1:clamp((selectionClock-panel.delay)/panel.duration,0,1),e=1-Math.pow(1-t,3),s=panel.start,target=panel.target,p=panel.pose;
      p.x=s.x+(target.x-s.x)*e;p.z=s.z+(target.z-s.z)*e;p.angle=s.angle+(target.angle-s.angle)*e;p.scale=s.scale+(target.scale-s.scale)*e;p.y=s.y+(target.y-s.y)*e;
      panel.moving=t<1;moving||=panel.moving;applyPanel(panel);
    }
    const dolly=phone?12.8:10.35,viewWidth=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*dolly*camera.aspect;
    const distance=dolly*Math.max(1,(phone?9.1:13.8)/viewWidth),settledProgress=progress*progress*(3-2*progress);
    camera.position.set(easedX*.22+drift,phone?4.25:4.32+(1-settledProgress)*.32,distance+dollyShift+(1-settledProgress)*(phone?.55:1.15));look.set(easedX*.06,2.68+easedY*.07,-.05);camera.lookAt(look);
    const pending=moving||progress!==progressGoal||drift!==driftGoal||dollyShift!==dollyGoal||(!stopped&&(easedX!==pointerX||easedY!==pointerY));
    try{renderer.render(scene,camera);if(failed)return;frames++;report(now,!pending);
      if(!ready&&panels[ORDER.indexOf(selection)].loaded){ready=true;data('renderer','ready');onReady?.({renderer:'webgl',project:selection});}
    }catch(error){fail(error);return;}
    if(pending)raf=requestAnimationFrame(render);else last=0;
  }
  function setIndex(value){const next=Number(value);if(!ORDER.includes(next)||next===selection)return;arrange(next);}
  function setProgress(value){inputProgress=clamp(Number(value)||0,0,1);const next=still()?1:inputProgress;if(next===progressGoal)return;progressGoal=next;request();}
  function setPointer(x,y){if(still())return;const a=clamp(Number(x)||0,-1,1),b=clamp(Number(y)||0,-1,1);if(Math.abs(a-pointerX)<.0001&&Math.abs(b-pointerY)<.0001)return;pointerX=a;pointerY=b;request();}
  function applyPause(){last=0;pointerX=pointerY=easedX=easedY=0;progressGoal=still()?1:inputProgress;if(still()){progress=1;for(const panel of panels){Object.assign(panel.pose,panel.target);panel.moving=false;applyPanel(panel);}}request();}
  function setPaused(value){value=Boolean(value);if(pause===value)return;pause=value;applyPause();}
  function setVisible(value){value=Boolean(value);if(visible===value)return;visible=value;if(!visible)suspend();else request();}
  function visibility(){if(document.hidden)suspend();else request();}
  function lost(event){event.preventDefault();fail(new Error('The exhibition 3D context was lost.'));}
  function pointerDown(event){if(event.button!==0&&event.pointerType!=='touch')return;down={id:event.pointerId,x:event.clientX,y:event.clientY,at:event.timeStamp};}
  function pointerUp(event){
    const start=down;down=null;if(!start||start.id!==event.pointerId||Math.hypot(event.clientX-start.x,event.clientY-start.y)>6||event.timeStamp-start.at>700)return;
    const bounds=host.getBoundingClientRect();rayPointer.set((event.clientX-bounds.left)/bounds.width*2-1,-(event.clientY-bounds.top)/bounds.height*2+1);raycaster.setFromCamera(rayPointer,camera);hits.length=0;raycaster.intersectObjects(clickTargets,false,hits);
    const hit=hits.find(result=>result.object.parent.parent.visible);if(!hit)return;const original=hit.object.userData.projectIndex;setIndex(original);onSelect?.(original);
  }
  function pointerCancel(){down=null;}
  function pointerLeave(){down=null;setPointer(0,0);}
  renderer.domElement.addEventListener('webglcontextlost',lost);host.addEventListener('pointerdown',pointerDown);host.addEventListener('pointerup',pointerUp);host.addEventListener('pointercancel',pointerCancel);host.addEventListener('pointerleave',pointerLeave);
  document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',applyPause);
  observer=new ResizeObserver(resize);observer.observe(host);
  if('IntersectionObserver'in window){intersection=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;if(!intersecting)suspend();else request();},{rootMargin:'90px'});intersection.observe(host);}
  arrange(selection,true);resize();
  return {setIndex,setProgress,setPointer,setVisible,setPaused,resize,
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer?.disconnect();intersection?.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',applyPause);renderer.domElement.removeEventListener('webglcontextlost',lost);host.removeEventListener('pointerdown',pointerDown);host.removeEventListener('pointerup',pointerUp);host.removeEventListener('pointercancel',pointerCancel);host.removeEventListener('pointerleave',pointerLeave);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();data('loop','disposed');}
  };
}
