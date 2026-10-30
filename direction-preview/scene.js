import * as THREE from './vendor/three.module.min.js';
import {Reflector} from './vendor/Reflector.js';
import {projects} from './projects.js';

// A single architectural world. Native scrolling moves a real perspective camera
// through it; the original portfolio remains a separate, complete document.
export async function createExperience(host,{onFrame,onLoad,onFailure}) {
  const mobile=()=>innerWidth<=600;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile()?1.1:1.5));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  renderer.shadowMap.enabled=!mobile();renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#0b1318');
  scene.fog=new THREE.FogExp2('#0b1318',.013);
  const camera=new THREE.PerspectiveCamera(43,1,.1,220);
  const matte=new THREE.MeshStandardMaterial({color:'#172329',roughness:.68,metalness:.35});
  const darkMetal=new THREE.MeshStandardMaterial({color:'#24383f',roughness:.28,metalness:.9});
  const warm=new THREE.MeshBasicMaterial({color:new THREE.Color('#ffdfad').multiplyScalar(2.8)});
  const cool=new THREE.MeshBasicMaterial({color:new THREE.Color('#9bdded').multiplyScalar(2.2)});
  const accent=new THREE.MeshBasicMaterial({color:'#77cbe8',toneMapped:false});
  function box(w,h,d,material,x=0,y=0,z=0,parent=scene) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function plane(w,h,material,x=0,y=0,z=0,parent=scene) {
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }
  function cylinder(r,h,material,y,z=0) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,96),material);mesh.position.set(0,y,z);mesh.receiveShadow=true;scene.add(mesh);return mesh;
  }
  // Softbox environment generates actual metal reflections without an external HDR.
  const environment=new THREE.Scene();
  environment.add(new THREE.Mesh(new THREE.BoxGeometry(100,60,100),new THREE.MeshBasicMaterial({color:'#253238',side:THREE.BackSide})));
  for(const [x,y,z,w,h,color,intensity,ry,rx] of [
    [-18,12,6,13,22,'#c4e9ff',4,Math.PI/2,0],
    [12,16,-8,10,30,'#ffdc9b',5,-Math.PI/2,0],
    [0,25,0,25,14,'#ffffff',5,0,Math.PI/2],
    [-2,6,28,18,4,'#efffff',3,Math.PI,0]
  ]) {const p=plane(w,h,new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide}),x,y,z,environment);p.rotation.set(rx,ry,0);}
  const pmrem=new THREE.PMREMGenerator(renderer);const envTarget=pmrem.fromScene(environment,.04,.1,150);
  scene.environment=envTarget.texture;scene.environmentIntensity=1;
  environment.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#bbd8ed','#30281c',1.3));
  const key=new THREE.SpotLight('#ffdcab',2200,80,.55,.8,2);key.position.set(-6,14,9);key.target.position.set(0,4,0);key.castShadow=!mobile();key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0003;scene.add(key,key.target);
  const fill=new THREE.PointLight('#a8e0f5',800,40,2);fill.position.set(9,7,-2);scene.add(fill);
  const front=new THREE.DirectionalLight('#e2f1f4',2.1);front.position.set(8,12,16);scene.add(front);

  box(90,.25,180,matte,0,-.16,-45);
  const floorShader={...Reflector.ReflectorShader,fragmentShader:Reflector.ReflectorShader.fragmentShader.replace(
    'vec4 base = texture2DProj( tDiffuse, vUv );',
    'vec2 uv=vUv.xy/vUv.w; vec2 d=vec2(0.0028); vec4 base=texture2D(tDiffuse,uv)*0.36; base+=(texture2D(tDiffuse,uv+vec2(d.x,0.0))+texture2D(tDiffuse,uv-vec2(d.x,0.0))+texture2D(tDiffuse,uv+vec2(0.0,d.y))+texture2D(tDiffuse,uv-vec2(0.0,d.y)))*0.16;'
  )};
  const mirror=new Reflector(new THREE.PlaneGeometry(75,170),{color:'#34454c',textureWidth:mobile()?512:1024,textureHeight:mobile()?512:1024,clipBias:.003,multisample:mobile()?0:2,shader:floorShader});
  mirror.rotation.x=-Math.PI/2;mirror.position.set(0,.001,-45);scene.add(mirror);
  // An architectural perimeter keeps the world grounded as the camera travels.
  box(.5,16,160,matte,-15,8,-45);box(.5,16,160,matte,15,8,-45);
  box(30,.3,160,matte,0,15.5,-45);
  for(let i=0;i<9;i++) {
    const z=6-i*14;
    box(.34,14,.4,darkMetal,-12,7,z);box(.34,14,.4,darkMetal,12,7,z);box(24.4,.34,.4,darkMetal,0,14,z);
    box(.035,13.5,.05,i%2?cool:warm,-11.79,7,z+.24);box(.035,13.5,.05,i%2?warm:cool,11.79,7,z+.24);
    box(23.6,.035,.05,i%2?warm:cool,0,13.78,z+.24);
    box(23,.018,.012,new THREE.MeshBasicMaterial({color:'#2c454c'}),0,.025,z);
    const light=new THREE.PointLight(i%2?'#8ccfe8':'#f5cf94',130,24,2);light.position.set(i%2?9:-9,8,z);scene.add(light);
  }
  box(.025,.015,125,warm,-3.5,.025,-48);box(.025,.015,125,cool,3.5,.025,-48);
  const plinth=cylinder(4.9,.28,darkMetal,.15);const plinthTop=cylinder(4.55,.7,matte,.64);
  const plinthRim=new THREE.Mesh(new THREE.TorusGeometry(4.55,.025,8,128),warm);plinthRim.rotation.x=Math.PI/2;plinthRim.position.y=1.005;scene.add(plinthRim);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(6.05,.035,12,160),warm);ring.position.set(0,6.5,-3);scene.add(ring);
  const halo=new THREE.Mesh(new THREE.TorusGeometry(6.05,.18,12,128),new THREE.MeshBasicMaterial({color:'#d9b983',transparent:true,opacity:.06,depthWrite:false,blending:THREE.AdditiveBlending}));halo.position.copy(ring.position);scene.add(halo);
  const monogram=new THREE.Group();monogram.position.set(0,4.9,0);monogram.rotation.y=.22;scene.add(monogram);
  const chrome=new THREE.MeshPhysicalMaterial({color:'#dbe4e5',metalness:.96,roughness:.2,clearcoat:1,clearcoatRoughness:.17,envMapIntensity:1.4});
  const sideMetal=new THREE.MeshStandardMaterial({color:'#1b3540',metalness:.92,roughness:.23,envMapIntensity:1.25});
  const kParts=[];
  function extrude(points,material) {
    const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x-50,50-y):shape.moveTo(x-50,50-y));shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:18,bevelEnabled:true,bevelThickness:.9,bevelSize:.85,bevelSegments:3,steps:1});geo.translate(0,0,-9);geo.scale(.085,.085,.085);
    const mesh=new THREE.Mesh(geo,material);mesh.castShadow=true;mesh.receiveShadow=true;monogram.add(mesh);kParts.push(mesh);return mesh;
  }
  extrude([[14,18],[35,10],[35,82],[14,90]],[chrome,sideMetal]);
  extrude([[43,45],[72,12],[95,12],[62,49],[96,84],[70,84],[43,56]],[chrome,sideMetal]);
  extrude([[45,26],[60,10],[68,10],[53,26]],accent);
  extrude([[4,47],[23,47],[23,50],[4,50]],accent);
  // Restrained airborne dust and physical light volumes create scale, not a particle wallpaper.
  const beamMat=new THREE.MeshBasicMaterial({color:'#ffe4bd',transparent:true,opacity:.018,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  const beam=new THREE.Mesh(new THREE.ConeGeometry(6,14,48,1,true),beamMat);beam.position.set(-2,7,0);scene.add(beam);
  const count=mobile()?240:520,positions=new Float32Array(count*3);
  let seed=871;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*32;positions[i*3+1]=.6+random()*14;positions[i*3+2]=20-random()*130;}
  const dustGeometry=new THREE.BufferGeometry();dustGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const dust=new THREE.Points(dustGeometry,new THREE.PointsMaterial({color:'#d6e8dc',size:.022,transparent:true,opacity:.45,depthWrite:false}));scene.add(dust);

  const manager=new THREE.LoadingManager();manager.onProgress=(_,loaded,total)=>onLoad?.(loaded/total);manager.onError=url=>console.warn('Gallery image unavailable:',url);
  const loader=new THREE.TextureLoader(manager);const textures=[];
  function screen(image,w,h,x,y,z,ry=0,label='') {
    const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=ry;scene.add(group);
    const frame=box(w+.26,h+.26,.24,darkMetal,0,0,0,group);frame.castShadow=true;
    const texture=loader.load(image,t=>{
      t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
      const aspect=t.image.width/t.image.height,target=w/h;
      if(aspect>target){t.repeat.x=target/aspect;t.offset.x=(1-t.repeat.x)/2;}
      else {t.repeat.y=aspect/target;t.offset.y=1-t.repeat.y;}
      requestFrame();
    });textures.push(texture);
    const face=plane(w,h,new THREE.MeshBasicMaterial({map:texture,toneMapped:false}),0,0,.132,group);
    box(w+.1,.025,.035,warm,0,-h/2-.15,.14,group);
    if(label) {
      const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#0a151b';ctx.fillRect(0,0,1024,96);ctx.fillStyle='#aec2c1';ctx.font='22px monospace';ctx.fillText(label,25,58);
      const titleTexture=new THREE.CanvasTexture(canvas);titleTexture.colorSpace=THREE.SRGBColorSpace;textures.push(titleTexture);plane(w,.7,new THREE.MeshBasicMaterial({map:titleTexture,toneMapped:false}),0,-h/2-.63,.1,group);
    }
    return {group,face,frame};
  }
  const screens=projects.map((project,i)=>{
    const side=i%2===0?-1:1,z=-18-Math.floor(i/2)*14;
    return screen(project.image,10.8,6.25,side*6.4,5.65,z,side*-.19,String(i+1).padStart(2,'0')+' / '+project.name.toUpperCase());
  });
  const speaker=screen('../images/speaking-community.webp',12,9,2,5.8,-86,-.06,'DTI / ROXAS-LGU — CYBERSECURITY AWARENESS / 02 OCT 2026');
  const certificate=screen('../images/speaking-certificate.webp',6,4.5,10,5,-86,-.5,'CERTIFICATE OF APPRECIATION');
  const speakerLight=new THREE.PointLight('#f1d2a4',700,28,2);speakerLight.position.set(-4,9,-79);scene.add(speakerLight);
  cylinder(4.2,.35,darkMetal,.2,-86);

  let width=1,height=1,progress=0,targetProgress=0,paused=false,inView=true,raf=0,last=0,elapsed=0,rendered=0;
  let pointerX=0,pointerY=0,px=0,py=0,lastStamp=-1;
  let positionCurve,lookCurve,keys;
  function buildPath() {
    const m=mobile();
    keys=[
      {t:0,p:m?[9,7.4,25]:[11,6.8,18],l:m?[0,1.5,0]:[-4,4,0]},
      {t:.14,p:m?[6,7,20]:[7,5.8,12],l:m?[0,2,0]:[-2,4,0]},
      {t:.23,p:[8,5.4,2],l:[0,4,-12]},
      ...projects.map((_,i)=>{const s=i%2===0?-1:1,z=-18-Math.floor(i/2)*14;return{t:.30+i*.06,p:m?[s*.7,8,z+27]:[s*1.1,6,z+14],l:[s*6.4,m?3.4:5.7,z]};}),
      {t:.81,p:m?[4,9,-52]:[5,6.8,-65],l:m?[2,1.5,-86]:[-1,5.8,-86]},
      {t:.9,p:m?[2,8,-53]:[4,6.4,-69],l:m?[2,1.5,-86]:[-2,5.8,-86]},
      {t:1,p:m?[4,8,-52]:[8,7.6,-66],l:m?[2,1.5,-86]:[0,6,-86]}
    ];
    positionCurve=new THREE.CatmullRomCurve3(keys.map(k=>new THREE.Vector3(...k.p)),false,'centripetal');
    lookCurve=new THREE.CatmullRomCurve3(keys.map(k=>new THREE.Vector3(...k.l)),false,'centripetal');
  }
  function curvePosition(p) {
    let i=0;while(i<keys.length-2&&p>keys[i+1].t)i++;
    return (i+THREE.MathUtils.clamp((p-keys[i].t)/(keys[i+1].t-keys[i].t),0,1))/(keys.length-1);
  }
  function resize() {
    const rect=host.getBoundingClientRect();width=rect.width;height=rect.height;
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile()?1.1:1.5));renderer.setSize(width,height,false);
    camera.aspect=width/height;camera.fov=mobile()?52:43;camera.updateProjectionMatrix();buildPath();requestFrame();
  }
  function frame(now) {
    raf=0;if(document.hidden||!inView)return;
    const fps=mobile()?30:45;if(!paused&&now-lastStamp<1000/fps){raf=requestAnimationFrame(frame);return;}lastStamp=now;
    const delta=last?Math.min(now-last,80):16;last=now;
    if(!paused)elapsed+=delta;
    progress=paused?targetProgress:THREE.MathUtils.damp(progress,targetProgress,5.6,delta*.001);
    if(Math.abs(progress-targetProgress)<.00005)progress=targetProgress;
    px=THREE.MathUtils.damp(px,paused?0:pointerX,4,delta*.001);py=THREE.MathUtils.damp(py,paused?0:pointerY,4,delta*.001);
    const u=curvePosition(progress),position=positionCurve.getPoint(u),look=lookCurve.getPoint(u),t=elapsed*.001;
    position.x+=px*(mobile()?0:.8);position.y+=py*(mobile()?0:.3)+(paused?0:Math.sin(t*.25)*.025);
    camera.position.copy(position);camera.lookAt(look);
    monogram.visible=progress<.28;
    for(const object of [plinth,plinthTop,plinthRim,ring,halo,beam])object.visible=!mobile()||progress<.275;
    const split=THREE.MathUtils.smoothstep(progress,.12,.24);
    kParts.forEach((part,i)=>{part.position.x=split*[-.8,1.4,.7,-1][i];part.position.z=split*[.4,-.3,.9,.6][i];part.rotation.y=split*[.05,-.12,.2,-.1][i];});
    monogram.position.y=4.9+(paused?0:Math.sin(t*.65)*.075);monogram.rotation.y=.22+(paused?0:Math.sin(t*.18)*.07)+split*.3;
    dust.rotation.y=paused?0:Math.sin(t*.02)*.01;
    const selected=Math.max(0,Math.min(7,Math.round((progress-.30)/.06)));
    screens.forEach((s,i)=>{
      // The phone camera needs more distance to frame a wide screen. Hide other
      // exhibits there so a nearer wall cannot block the current exhibit.
      s.group.visible=!mobile()||(progress>=.275&&progress<.79&&i===selected);
      const active=Math.max(0,1-Math.abs(progress-(.30+i*.06))/.09);s.face.material.color.setScalar(.28+active*.72);
    });
    certificate.group.visible=!mobile();
    renderer.render(scene,camera);rendered++;
    if(rendered===1)document.body.dataset.renderer='ready';
    if(rendered%15===0){host.dataset.camera=camera.position.toArray().map(v=>v.toFixed(2)).join(',');host.dataset.frame=String(rendered);}
    onFrame?.(progress);
    if(!paused||progress!==targetProgress)raf=requestAnimationFrame(frame);
  }
  function requestFrame(){if(!raf&&!document.hidden&&inView)raf=requestAnimationFrame(frame);}
  host.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);onFailure?.();},true);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();if(raf)cancelAnimationFrame(raf);onFailure?.();});
  document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden){cancelAnimationFrame(raf);raf=0;}else requestFrame();});
  resize();renderer.render(scene,camera);requestFrame();
  return {
    setProgress(value){targetProgress=THREE.MathUtils.clamp(value,0,1);requestFrame();},
    setPaused(value){paused=value;last=0;requestFrame();},
    setPointer(x,y){pointerX=x;pointerY=y;requestFrame();},
    setVisible(value){inView=value;if(!value){cancelAnimationFrame(raf);raf=0;last=0;}else requestFrame();},
    resize,
    dispose(){cancelAnimationFrame(raf);textures.forEach(t=>t.dispose());envTarget.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());});mirror.getRenderTarget().dispose();renderer.dispose();}
  };
}
