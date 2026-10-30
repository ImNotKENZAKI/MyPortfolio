import * as THREE from './vendor/three.module.min.js';
import {Reflector} from './vendor/Reflector.js';

// The sculpture, light, camera and contact reflection are real scene geometry.
// Generated texture candidates supply base colour, not a pre-rendered backdrop.
export async function createHeroScene(host,{onReady,onFailure,onFrame,paused=false}={}) {
  if(!host)throw new TypeError('A hero scene host is required.');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false,failed=false,visible=true,raf=0,lastTime=0,lastRender=0,renderCount=0;
  let requestedPause=Boolean(paused),isPaused=requestedPause||reduce.matches;
  let targetProgress=0,progress=isPaused?1:0,width=1,height=1,quality=1,slowFrames=0;
  let pointerX=0,pointerY=0,currentPointerX=0,currentPointerY=0;
  const textures=new Set(),geometries=new Set(),materials=new Set();
  let renderer,environmentTarget,mirror,resizeObserver;
  const clamp=THREE.MathUtils.clamp;
  const fail=error=>{
    if(disposed||failed)return;
    failed=true;cancelAnimationFrame(raf);raf=0;host.dataset.renderer='fallback';
    if(renderer?.domElement)renderer.domElement.style.visibility='hidden';
    onFailure?.(error instanceof Error?error:new Error('The 3D scene is unavailable.'));
  };
  try {
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.08;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
    renderer.debug.onShaderError=()=>fail(new Error('The hero material could not be rendered.'));
    renderer.domElement.setAttribute('aria-hidden','true');
    renderer.domElement.setAttribute('role','presentation');
    renderer.domElement.tabIndex=-1;
    Object.assign(renderer.domElement.style,{position:'absolute',inset:'0',width:'100%',height:'100%',display:'block',pointerEvents:'none',zIndex:'1'});
    host.append(renderer.domElement);
  } catch(error) {fail(error);throw error;}

  const scene=new THREE.Scene();scene.background=new THREE.Color('#0a141e');
  scene.fog=new THREE.Fog('#0a141e',26,58);
  const camera=new THREE.PerspectiveCamera(38,1,.08,85);
  const trackGeometry=geometry=>{geometries.add(geometry);return geometry;};
  const trackMaterial=material=>{materials.add(material);return material;};
  const trackTexture=texture=>{textures.add(texture);return texture;};
  function mesh(geometry,material,parent=scene){const object=new THREE.Mesh(trackGeometry(geometry),material);parent.add(object);return object;}
  function box(w,h,d,material,x=0,y=0,z=0,parent=scene){const object=mesh(new THREE.BoxGeometry(w,h,d),material,parent);object.position.set(x,y,z);return object;}
  function textureCanvas(kind){
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const context=canvas.getContext('2d',{alpha:false});
    if(!context)throw new Error('A material canvas could not be created.');
    const data=context.createImageData(512,512);let seed=kind==='stone'?7187:5107;
    const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    const lines=Array.from({length:512},()=>random());
    for(let y=0;y<512;y++)for(let x=0;x<512;x++){
      let v;
      if(kind==='metal')v=185+lines[(x+y)%512]*25+(random()-.5)*6;
      else if(kind==='roughness')v=140+lines[(x+y)%512]*35+(random()-.5)*9;
      else if(kind==='stone')v=95+random()*28+Math.sin(x*.17)*Math.sin(y*.13)*8;
      else v=128+(random()-.5)*20+lines[(x+y)%512]*10;
      const i=(y*512+x)*4;data.data[i]=data.data[i+1]=data.data[i+2]=Math.round(v);data.data[i+3]=255;
    }
    context.putImageData(data,0,0);
    const texture=trackTexture(new THREE.CanvasTexture(canvas));
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
    if(kind==='metal'||kind==='stone')texture.colorSpace=THREE.SRGBColorSpace;
    return texture;
  }
  let metalColour,stoneColour,roughness,grain;
  try {metalColour=textureCanvas('metal');stoneColour=textureCanvas('stone');roughness=textureCanvas('roughness');grain=textureCanvas('grain');}
  catch(error){fail(error);renderer.dispose();renderer.domElement.remove();throw error;}

  const silver=trackMaterial(new THREE.MeshPhysicalMaterial({
    color:'#e1e8ec',map:metalColour,metalness:.96,roughness:.46,roughnessMap:roughness,
    bumpMap:grain,bumpScale:.009,anisotropy:.54,anisotropyRotation:Math.PI/4,
    clearcoat:.22,clearcoatRoughness:.3,envMapIntensity:1.3
  }));
  const silverEdge=trackMaterial(new THREE.MeshPhysicalMaterial({color:'#8fabbc',metalness:.96,roughness:.25,clearcoat:.18,envMapIntensity:1.35}));
  const cyan=trackMaterial(new THREE.MeshPhysicalMaterial({color:'#5cd6f2',metalness:.66,roughness:.26,emissive:'#11718a',emissiveIntensity:.32,envMapIntensity:1.1}));
  const basalt=trackMaterial(new THREE.MeshStandardMaterial({color:'#59636d',map:stoneColour,bumpMap:grain,bumpScale:.065,roughness:.86,metalness:.06}));
  const wallMaterial=trackMaterial(new THREE.MeshStandardMaterial({color:'#35444f',map:stoneColour,bumpMap:grain,bumpScale:.035,roughness:.91,metalness:.04,side:THREE.DoubleSide}));
  const warmLine=trackMaterial(new THREE.MeshBasicMaterial({color:new THREE.Color('#f3c890').multiplyScalar(1.25),toneMapped:true}));

  // Large soft reflection sources make metal readable without a script CDN/HDR.
  const environment=new THREE.Scene();
  const envGeometry=[],envMaterials=[];
  function envPlane(w,h,color,intensity,x,y,z,target){
    const geometry=new THREE.PlaneGeometry(w,h),material=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide});
    const plane=new THREE.Mesh(geometry,material);plane.position.set(x,y,z);plane.lookAt(...target);environment.add(plane);envGeometry.push(geometry);envMaterials.push(material);
  }
  const envShellGeometry=new THREE.BoxGeometry(65,45,65),envShellMaterial=new THREE.MeshBasicMaterial({color:'#22333f',side:THREE.BackSide});
  environment.add(new THREE.Mesh(envShellGeometry,envShellMaterial));envGeometry.push(envShellGeometry);envMaterials.push(envShellMaterial);
  envPlane(6,14,'#dbefff',3.8,-9,7,7,[0,4,0]);
  envPlane(4,17,'#ffdcaa',4.1,10,7,-3,[0,4,0]);
  envPlane(11,7,'#eaf6ff',3.0,-1,16,0,[0,0,0]);
  envPlane(2.5,10,'#effbff',2.0,2,6,12,[0,4,0]);
  try {
    const pmrem=new THREE.PMREMGenerator(renderer);
    environmentTarget=pmrem.fromScene(environment,.045,.1,90);
    scene.environment=environmentTarget.texture;scene.environmentIntensity=1.05;pmrem.dispose();
  } catch(error){envGeometry.forEach(g=>g.dispose());envMaterials.forEach(m=>m.dispose());fail(error);renderer.dispose();renderer.domElement.remove();throw error;}
  envGeometry.forEach(g=>g.dispose());envMaterials.forEach(m=>m.dispose());
  scene.add(new THREE.HemisphereLight('#bdd9ee','#332b24',.75));
  const key=new THREE.SpotLight('#ffe1b7',1120,38,.62,.78,2);
  key.position.set(-5.5,11,7);key.target.position.set(0,3.2,0);key.castShadow=true;
  key.shadow.camera.near=.5;key.shadow.camera.far=35;key.shadow.bias=-.00022;key.shadow.normalBias=.035;
  key.shadow.mapSize.set(1024,1024);scene.add(key,key.target);
  const rim=new THREE.SpotLight('#81d7f4',920,34,.64,.85,2);rim.position.set(7,7,-4.5);rim.target.position.set(0,3.6,0);scene.add(rim,rim.target);
  const front=new THREE.DirectionalLight('#d5e9f6',.82);front.position.set(4,7,12);scene.add(front);

  // One quiet curved architectural surface; no corridor or repeated exhibits.
  const wall=mesh(new THREE.CylinderGeometry(11.8,11.8,12,100,1,true,Math.PI*.59,Math.PI*.82),wallMaterial);
  wall.position.set(0,6,1.2);wall.receiveShadow=true;
  const points=Array.from({length:75},(_,i)=>{const a=Math.PI*.59+(Math.PI*.82)*i/74;return new THREE.Vector3(11.7*Math.sin(a),.08,1.2+11.7*Math.cos(a));});
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.013,4,false),warmLine);

  const slabShape=new THREE.Shape();
  [[-4.55,-1.86],[-3.95,-2.12],[3.9,-2.06],[4.57,-1.48],[4.68,1.42],[4.02,1.93],[-4.12,1.82],[-4.64,1.12]].forEach(([x,y],i)=>i?slabShape.lineTo(x,y):slabShape.moveTo(x,y));
  slabShape.closePath();
  const slabGeometry=new THREE.ExtrudeGeometry(slabShape,{depth:.62,bevelEnabled:true,bevelSegments:2,bevelSize:.055,bevelThickness:.055,steps:1});
  const uv=slabGeometry.attributes.uv;
  for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*.25,uv.getY(i)*.25);
  slabGeometry.rotateX(-Math.PI/2);
  const slab=mesh(slabGeometry,basalt);slab.position.y=.12;slab.receiveShadow=true;slab.castShadow=true;
  const monogram=new THREE.Group();monogram.position.set(0,3.72,0);monogram.rotation.y=-.16;scene.add(monogram);
  function extrude(points,material,depth=15,bevel=.68){
    const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x-50,50-y):shape.moveTo(x-50,50-y));shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:4,steps:1});
    const pos=geometry.attributes.position,tex=geometry.attributes.uv;
    for(let i=0;i<tex.count;i++)tex.setXY(i,(pos.getX(i)+50)/74,(pos.getY(i)+50)/74);
    geometry.translate(0,0,-depth/2);geometry.scale(.073,.073,.073);
    const object=mesh(geometry,material,monogram);object.castShadow=true;object.receiveShadow=true;return object;
  }
  // Exact selected vector paths, with physical depth and a restrained bevel.
  extrude([[14,18],[35,10],[35,82],[14,90]],[silver,silverEdge]);
  extrude([[43,45],[72,12],[95,12],[62,49],[96,84],[70,84],[43,56]],[silver,silverEdge]);
  extrude([[45,26],[60,10],[68,10],[53,26]],cyan,10,.30);
  extrude([[4,47],[23,47],[23,50],[4,50]],cyan,10,.22);

  // A blurred, low-strength real planar reflection anchors the sculpture.
  const floorShader={...Reflector.ReflectorShader,
    vertexShader:Reflector.ReflectorShader.vertexShader.replace('varying vec4 vUv;','varying vec4 vUv; varying vec2 vFloor;').replace('vUv = textureMatrix * vec4( position, 1.0 );','vUv = textureMatrix * vec4( position, 1.0 ); vFloor = position.xy;'),
    fragmentShader:Reflector.ReflectorShader.fragmentShader.replace('varying vec4 vUv;','varying vec4 vUv; varying vec2 vFloor;').replace('vec4 base = texture2DProj( tDiffuse, vUv );',`vec2 uv = vUv.xy/vUv.w; vec2 d = vec2(0.0048); vec4 base = texture2D(tDiffuse,uv)*0.36;
      base += (texture2D(tDiffuse,uv+vec2(d.x,0.0))+texture2D(tDiffuse,uv-vec2(d.x,0.0))+texture2D(tDiffuse,uv+vec2(0.0,d.y))+texture2D(tDiffuse,uv-vec2(0.0,d.y)))*0.16;`)
      .replace('gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',`float grain = fract(sin(dot(vFloor,vec2(37.2,91.7)))*3124.7); float strength = 0.23*exp(-length(vFloor)*0.035);
      gl_FragColor = vec4(mix(color,base.rgb,strength)*(0.965+grain*0.045),1.0);`)
  };
  try {
    const reflectionGeometry=trackGeometry(new THREE.PlaneGeometry(38,45));
    mirror=new Reflector(reflectionGeometry,{color:'#111c25',textureWidth:768,textureHeight:768,clipBias:.002,multisample:0,shader:floorShader});
    mirror.rotation.x=-Math.PI/2;scene.add(mirror);
  } catch(error){fail(error);throw error;}
  const shadow=mesh(new THREE.PlaneGeometry(30,30),trackMaterial(new THREE.ShadowMaterial({color:'#010407',opacity:.30,depthWrite:false})));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.008;shadow.receiveShadow=true;

  // The first valid frame needs no downloaded texture. Base-colour candidates
  // enhance it progressively; missing files do not gate content or interaction.
  const loader=new THREE.TextureLoader();
  function loadCandidate(url,assign){
    loader.load(url,texture=>{
      if(disposed){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
      texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());trackTexture(texture);assign(texture);requestFrame();
    },undefined,()=>{if(!disposed)host.dataset.materialFallback='procedural';});
  }
  loadCandidate(new URL('./assets/cinematic/brushed-metal-basecolor-v1.webp',import.meta.url).href,texture=>{silver.map=texture;silver.needsUpdate=true;});
  loadCandidate(new URL('./assets/cinematic/graphite-basalt-basecolor-v1.webp',import.meta.url).href,texture=>{basalt.map=texture;wallMaterial.map=texture;basalt.needsUpdate=wallMaterial.needsUpdate=true;});

  const macro=new THREE.Vector3(),middle=new THREE.Vector3(),wide=new THREE.Vector3();
  const lookMacro=new THREE.Vector3(.3,3.95,.35),lookMiddle=new THREE.Vector3(0,3.48,0),lookWide=new THREE.Vector3(0,3.15,0);
  const position=new THREE.Vector3(),look=new THREE.Vector3();
  let phone=false,settledDistance=16;
  function resize(){
    if(disposed||failed)return;
    const rect=host.getBoundingClientRect();width=Math.max(1,Math.round(rect.width));height=Math.max(1,Math.round(rect.height));
    phone=matchMedia('(max-width: 700px)').matches||width<490;
    const dpr=Math.min(devicePixelRatio||1,phone?1.25:1.5)*quality;
    renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.fov=phone?40:38;camera.updateProjectionMatrix();
    const tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
    settledDistance=Math.max(12.8,7.2/(2*tangent*.82),9.25/(2*tangent*camera.aspect*.90));
    const angle=phone ? .22 : .28;
    wide.set(Math.sin(angle)*settledDistance,5.05,Math.cos(angle)*settledDistance);
    middle.set(wide.x*.5,4.65,Math.max(7,wide.z*.63));
    macro.set(1.65,4.22,4.7);
    const shadowSize=phone?512:1024;
    if(key.shadow.mapSize.x!==shadowSize){key.shadow.map?.dispose();key.shadow.map=null;key.shadow.mapSize.set(shadowSize,shadowSize);}
    renderer.shadowMap.needsUpdate=true;
    const target=mirror.getRenderTarget(),size=phone?384:Math.round(768*quality);if(target.width!==size)target.setSize(size,size);
    lastTime=lastRender=0;requestFrame();
  }
  function updateCamera(value){
    const first=value<.44;
    const local=first?value/.44:(value-.44)/.56;
    const eased=local*local*(3-2*local);
    position.lerpVectors(first?macro:middle,first?middle:wide,eased);
    look.lerpVectors(first?lookMacro:lookMiddle,first?lookMiddle:lookWide,eased);
    if(value>.965&&!isPaused){position.x+=currentPointerX*.14;position.y+=currentPointerY*.07;}
    camera.position.copy(position);camera.lookAt(look);
  }
  function frame(now){
    raf=0;if(disposed||failed||!visible||document.hidden)return;
    const frameTime=1000/(phone?30:60);
    if(lastRender&&now-lastRender<frameTime-1){raf=requestAnimationFrame(frame);return;}
    const delta=lastTime?Math.min((now-lastTime)/1000,.08):1/60;lastTime=lastRender=now;
    const goal=isPaused?1:targetProgress;
    progress=isPaused?1:THREE.MathUtils.damp(progress,goal,10,delta);
    if(Math.abs(progress-goal)<.00012)progress=goal;
    const allowPointer=!isPaused&&progress>.965;
    currentPointerX=THREE.MathUtils.damp(currentPointerX,allowPointer?pointerX:0,12,delta);
    currentPointerY=THREE.MathUtils.damp(currentPointerY,allowPointer?pointerY:0,12,delta);
    if(Math.abs(currentPointerX-(allowPointer?pointerX:0))<.0005)currentPointerX=allowPointer?pointerX:0;
    if(Math.abs(currentPointerY-(allowPointer?pointerY:0))<.0005)currentPointerY=allowPointer?pointerY:0;
    updateCamera(progress);
    const start=performance.now();
    try {renderer.render(scene,camera);}catch(error){fail(error);return;}
    if(failed)return;
    const renderTime=performance.now()-start;renderCount++;
    if(renderCount>3&&renderTime>(phone?31:24))slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
    if(slowFrames>18&&quality>.72){quality=Math.max(.7,quality-.15);slowFrames=0;resize();}
    host.dataset.renderer='ready';host.dataset.progress=progress.toFixed(3);
    host.dataset.camera=camera.position.toArray().map(v=>v.toFixed(2)).join(',');host.dataset.frame=String(renderCount);
    if(renderCount===1)onReady?.({renderer:'webgl',scene:'kinetic-sculpture'});
    onFrame?.(progress);
    // A settled still frame consumes no continuous render loop.
    if(progress!==goal||currentPointerX!==(allowPointer?pointerX:0)||currentPointerY!==(allowPointer?pointerY:0))requestFrame();
  }
  function requestFrame(){if(!raf&&!disposed&&!failed&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
  function setPointer(x,y){pointerX=clamp(Number(x)||0,-1,1);pointerY=clamp(Number(y)||0,-1,1);if(progress>.965&&!isPaused)requestFrame();}
  const onMove=event=>{if(event.pointerType==='touch')return;const r=host.getBoundingClientRect();setPointer((event.clientX-r.left)/r.width*2-1,(event.clientY-r.top)/r.height*2-1);};
  const onLeave=()=>setPointer(0,0);
  const onVisibility=()=>{cancelAnimationFrame(raf);raf=0;lastTime=lastRender=0;if(!document.hidden)requestFrame();};
  const onReduced=()=>{isPaused=requestedPause||reduce.matches;lastTime=0;requestFrame();};
  const onLost=event=>{event.preventDefault();fail(new Error('The 3D graphics context was lost.'));};
  host.addEventListener('pointermove',onMove,{passive:true});host.addEventListener('pointerleave',onLeave,{passive:true});
  renderer.domElement.addEventListener('webglcontextlost',onLost);
  document.addEventListener('visibilitychange',onVisibility);reduce.addEventListener('change',onReduced);
  if(typeof ResizeObserver!=='undefined'){resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);}
  resize();
  return {
    setProgress(value){targetProgress=clamp(Number(value)||0,0,1);requestFrame();},
    setPaused(value){requestedPause=Boolean(value);isPaused=requestedPause||reduce.matches;lastTime=0;requestFrame();},
    setPointer,
    setVisible(value){visible=Boolean(value);if(!visible){cancelAnimationFrame(raf);raf=0;lastTime=lastRender=0;}else requestFrame();},
    resize,
    dispose(){
      if(disposed)return;disposed=true;cancelAnimationFrame(raf);resizeObserver?.disconnect();
      host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerleave',onLeave);
      renderer.domElement.removeEventListener('webglcontextlost',onLost);document.removeEventListener('visibilitychange',onVisibility);reduce.removeEventListener('change',onReduced);
      textures.forEach(texture=>texture.dispose());geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());
      mirror.material.dispose();mirror.getRenderTarget().dispose();key.shadow.map?.dispose();environmentTarget?.dispose();
      renderer.dispose();renderer.domElement.remove();
    }
  };
}
