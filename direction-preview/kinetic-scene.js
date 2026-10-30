import * as THREE from './vendor/three.module.min.js';

// Two genuinely volumetric, open metal ribbons. The portrait stays in the DOM above this canvas.
export async function createKineticScene(host,{onReady,onFailure,paused=false}={}) {
  if(!host)return null;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const geometries=new Set(),materials=new Set(),textures=new Set();
  let renderer,environmentTarget,observer,intersection,raf=0,disposed=false,failed=false,ready=false;
  let visible=true,intersecting=true,phone=false,width=1,height=1,goal=0,progress=0,last=0,assemblyTime=0,frameCount=0,lastDiagnostic=-Infinity;
  let bufferWidth=0,bufferHeight=0,pixelRatio=0;
  let pause=Boolean(paused),pointer={x:0,y:0},eased={x:0,y:0},centerX=0,centerY=0,distance=17;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,90),ribbons=new THREE.Group();
  const revealUniform={value:-.08},viewDirection=new THREE.Vector3(),viewRight=new THREE.Vector3(),viewUp=new THREE.Vector3(),lookTarget=new THREE.Vector3();
  scene.add(ribbons);
  const geometry=g=>(geometries.add(g),g),material=m=>(materials.add(m),m);
  const staticMotion=()=>pause||reduced.matches;
  function fail(error){if(disposed||failed)return;failed=true;cancelAnimationFrame(raf);raf=0;if(renderer)renderer.domElement.hidden=true;host.dataset.renderer='fallback';onFailure?.(error);}
  function assemblyMaterial(value){
    value.onBeforeCompile=shader=>{
      shader.uniforms.uFlowReveal=revealUniform;
      shader.vertexShader='attribute float flowT;\nattribute vec3 flowCenter;\nuniform float uFlowReveal;\nvarying float vFlowT;\nvarying float vFlowPresence;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvFlowT=flowT;\nvFlowPresence=smoothstep(flowT-.045,flowT+.015,uFlowReveal);\ntransformed=mix(flowCenter,transformed,vFlowPresence);');
      shader.fragmentShader='uniform float uFlowReveal;\nvarying float vFlowT;\nvarying float vFlowPresence;\n'+shader.fragmentShader;
      shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(vFlowPresence<.002)discard;');
      shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\nfloat assemblyEdge=max(0.,1.-abs(vFlowT-uFlowReveal+.018)/.065);\ntotalEmissiveRadiance+=vec3(.025,.15,.22)*assemblyEdge;');
    };
    value.customProgramCacheKey=()=> 'kinetic-curve-assembly-v1';return value;
  }
  try {
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;
    renderer.debug.onShaderError=(gl,program)=>fail(new Error('The kinetic material could not compile: '+gl.getProgramInfoLog(program)));
    renderer.domElement.setAttribute('aria-hidden','true');renderer.domElement.tabIndex=-1;
    Object.assign(renderer.domElement.style,{position:'absolute',inset:'0',width:'100%',height:'100%',display:'block',pointerEvents:'none'});
    host.append(renderer.domElement);
    const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
    const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);let seed=77431;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      const value=167+Math.sin((x+y*.19)*1.7)*14+(seed/4294967296-.5)*13,i=(y*256+x)*4;
      pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=value;pixels.data[i+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    const brush=new THREE.CanvasTexture(canvas);brush.wrapS=brush.wrapT=THREE.RepeatWrapping;brush.repeat.set(3,1);textures.add(brush);
    const chrome=assemblyMaterial(material(new THREE.MeshPhysicalMaterial({color:'#d3dce1',metalness:1,roughness:.32,roughnessMap:brush,bumpMap:brush,bumpScale:.009,clearcoat:.65,clearcoatRoughness:.16,envMapIntensity:1.25})));
    const underside=assemblyMaterial(material(new THREE.MeshPhysicalMaterial({color:'#7894a4',metalness:1,roughness:.26,roughnessMap:brush,bumpMap:brush,bumpScale:.007,clearcoat:.45,envMapIntensity:1.15})));
    const seam=assemblyMaterial(material(new THREE.MeshPhysicalMaterial({color:'#75d9f2',metalness:.7,roughness:.21,emissive:'#168db0',emissiveIntensity:.45,envMapIntensity:1.1})));
    const environment=new THREE.Scene();environment.background=new THREE.Color('#111b27');
    const roomGeometry=new THREE.BoxGeometry(45,35,45),roomMaterial=new THREE.MeshBasicMaterial({color:'#111b27',side:THREE.BackSide});
    environment.add(new THREE.Mesh(roomGeometry,roomMaterial));const lights=[];
    function softbox(w,h,x,y,z,color,intensity){
      const g=new THREE.PlaneGeometry(w,h),m=new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(intensity),side:THREE.DoubleSide});
      const panel=new THREE.Mesh(g,m);panel.position.set(x,y,z);panel.lookAt(0,0,0);environment.add(panel);lights.push([g,m]);
    }
    softbox(13,5,-5,9,6,'#fff5e9',5);softbox(3,16,10,1,5,'#edf8ff',4);
    softbox(9,3,-7,-5,6,'#dceaff',2.4);softbox(2,13,4,3,-8,'#76cdf4',4);
    softbox(1.6,12,-10,1,-4,'#c0ebff',2);softbox(8,2,1,-8,-6,'#496b85',1.7);
    const pmrem=new THREE.PMREMGenerator(renderer);environmentTarget=pmrem.fromScene(environment,.025,.1,100);scene.environment=environmentTarget.texture;
    pmrem.dispose();roomGeometry.dispose();roomMaterial.dispose();lights.forEach(([g,m])=>{g.dispose();m.dispose();});
    scene.add(new THREE.HemisphereLight('#e1f2ff','#17283d',1.2));
    const key=new THREE.DirectionalLight('#ffeddd',2.4);key.position.set(-5,7,10);scene.add(key);
    const rim=new THREE.DirectionalLight('#75c4ed',1.2);rim.position.set(8,2,-4);scene.add(rim);
    function foldedRibbon(points,maximumWidth,phase,delay){
      const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
      const count=160,sides=12,positions=[],uvs=[],surface=[[],[]],flow=[],centers=[],seamPositions=[],seamUV=[],seamFlow=[],seamCenters=[],seamIndices=[],seamSides=6;
      const frames=curve.computeFrenetFrames(count,false);
      for(let i=0;i<=count;i++){
        const u=i/count,p=curve.getPointAt(u),twist=phase+u*Math.PI*1.65+Math.sin(u*Math.PI*2)*.25;
        const n=frames.normals[i].clone().multiplyScalar(Math.cos(twist)).addScaledVector(frames.binormals[i],Math.sin(twist));
        const b=new THREE.Vector3().crossVectors(frames.tangents[i],n).normalize();
        const bladeWidth=maximumWidth*(.065+Math.pow(Math.sin(Math.PI*u),.55)*.935),thickness=.075+bladeWidth*.025;
        for(let j=0;j<sides;j++){
          const angle=j/sides*Math.PI*2,v=p.clone().addScaledVector(n,Math.cos(angle)*bladeWidth*.5).addScaledVector(b,Math.sin(angle)*thickness*.5);
          positions.push(v.x,v.y,v.z);uvs.push(u*4,j/sides);flow.push(u*.86+delay);centers.push(p.x,p.y,p.z);
        }
        const edge=p.clone().addScaledVector(n,bladeWidth*.5).addScaledVector(b,.012);
        for(let j=0;j<seamSides;j++){
          const angle=j/seamSides*Math.PI*2,v=edge.clone().addScaledVector(n,Math.cos(angle)*.012).addScaledVector(b,Math.sin(angle)*.012);
          seamPositions.push(v.x,v.y,v.z);seamUV.push(u*4,j/seamSides);seamFlow.push(u*.86+delay);seamCenters.push(p.x,p.y,p.z);
          if(i<count){const a=i*seamSides+j,b=i*seamSides+(j+1)%seamSides,c=(i+1)*seamSides+j,d=(i+1)*seamSides+(j+1)%seamSides;seamIndices.push(a,b,c,b,d,c);}
        }
      }
      const g=geometry(new THREE.BufferGeometry());
      for(let i=0;i<count;i++)for(let j=0;j<sides;j++){
        const a=i*sides+j,b=i*sides+(j+1)%sides,c=(i+1)*sides+j,d=(i+1)*sides+(j+1)%sides;
        surface[j<sides/2?0:1].push(a,b,c,b,d,c);
      }
      // Closed tips retain a physical silhouette even at grazing camera angles.
      for(let j=1;j<sides-1;j++)surface[1].push(0,j+1,j,count*sides,count*sides+j,count*sides+j+1);
      g.addGroup(0,surface[0].length,0);g.addGroup(surface[0].length,surface[1].length,1);
      g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setAttribute('flowT',new THREE.Float32BufferAttribute(flow,1));g.setAttribute('flowCenter',new THREE.Float32BufferAttribute(centers,3));g.setIndex([...surface[0],...surface[1]]);g.computeVertexNormals();
      const body=new THREE.Mesh(g,[chrome,underside]);ribbons.add(body);
      for(let j=1;j<seamSides-1;j++)seamIndices.push(0,j+1,j,count*seamSides,count*seamSides+j,count*seamSides+j+1);
      const seamGeometry=geometry(new THREE.BufferGeometry());seamGeometry.setAttribute('position',new THREE.Float32BufferAttribute(seamPositions,3));seamGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(seamUV,2));seamGeometry.setAttribute('flowT',new THREE.Float32BufferAttribute(seamFlow,1));seamGeometry.setAttribute('flowCenter',new THREE.Float32BufferAttribute(seamCenters,3));seamGeometry.setIndex(seamIndices);seamGeometry.computeVertexNormals();
      ribbons.add(new THREE.Mesh(seamGeometry,seam));
    }
    foldedRibbon([[-5,-1.4,-.4],[-4.2,.1,.3],[-2.3,1.15,-.6],[.25,1.05,-1.35],[2.5,.2,-.2],[3.3,-1.1,.9],[1.75,-2.15,1.15],[-.6,-2.35,.1],[-2.3,-1.85,-.55]],1.6,-.58,0);
    foldedRibbon([[.7,-2.8,-.75],[2.5,-2,-.65],[3.5,-.6,.15],[3.05,1.25,.6],[1.8,2.9,-.55],[2.5,3.9,-1.65]],1.4,.65,.12);
  } catch(error){fail(error);renderer?.dispose();renderer?.domElement.remove();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environmentTarget?.dispose();return null;}
  function resize(){
    if(disposed||failed)return;const rect=host.getBoundingClientRect();width=Math.max(1,Math.round(rect.width));height=Math.max(1,Math.round(rect.height));
    const previousPhone=phone;phone=innerWidth<=700;const dpr=Math.min(devicePixelRatio||1,phone?1:1.25,Math.sqrt((phone?1000000:1600000)/(width*height)));
    if(bufferWidth===width&&bufferHeight===height&&pixelRatio===dpr&&previousPhone===phone)return;
    bufferWidth=width;bufferHeight=height;pixelRatio=dpr;renderer.setDrawingBufferSize(width,height,dpr);
    camera.aspect=width/height;camera.fov=phone?38:36;camera.updateProjectionMatrix();
    distance=phone?Math.max(15.6,10/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect*.91)):17.2;
    const visibleHeight=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*distance;
    centerX=phone?0:visibleHeight*camera.aspect*.205;centerY=phone?-.25:-visibleHeight*.035;
    request();
  }
  function diagnostic(key,value){if(host.dataset[key]!==value)host.dataset[key]=value;}
  function report(now,assembly,settled,force=false){
    if(!settled&&!force&&now-lastDiagnostic<200)return;lastDiagnostic=now;
    diagnostic('reveal',assembly.toFixed(3));diagnostic('progress',progress.toFixed(3));diagnostic('frame',String(frameCount));
    diagnostic('camera',camera.position.x.toFixed(3)+','+camera.position.y.toFixed(3)+','+camera.position.z.toFixed(3));
    diagnostic('cameraRotation',camera.rotation.x.toFixed(3)+','+camera.rotation.y.toFixed(3)+','+camera.rotation.z.toFixed(3));
    diagnostic('drawCalls',String(renderer.info.render.calls));diagnostic('phase',assembly<1?'assembling':staticMotion()?'paused':settled?'settled':'moving');
    diagnostic('loop',settled?'sleeping':'active');diagnostic('pixelRatio',pixelRatio.toFixed(3));
  }
  function render(now){
    raf=0;if(disposed||failed||!visible||!intersecting||document.hidden)return;
    const interval=phone?1000/30:1000/60,delta=last?now-last:interval;
    if(last&&delta<interval-1){raf=requestAnimationFrame(render);return;}last=now;
    const stopped=staticMotion(),dt=Math.min(delta,80)*.001;if(!stopped){if(ready)assemblyTime=Math.min(1.45,assemblyTime+dt);}else assemblyTime=1.45;
    const assembly=assemblyTime/1.45,entrance=1-Math.pow(1-assembly,3);revealUniform.value=-.08+assembly*1.16;
    const weight=1-Math.exp(-dt*8);progress+=(goal-progress)*weight;
    eased.x+=(pointer.x-eased.x)*weight;eased.y+=(pointer.y-eased.y)*weight;
    if(Math.abs(goal-progress)<.00035)progress=goal;if(Math.abs(pointer.x-eased.x)<.0008)eased.x=pointer.x;if(Math.abs(pointer.y-eased.y)<.0008)eased.y=pointer.y;
    const px=stopped?0:eased.x,py=stopped?0:eased.y;
    const travel=progress*progress*(3-2*progress),yaw=-.035+travel*.40+px*.025-(1-entrance)*.09,pitch=-.015+travel*.10+py*.018;
    ribbons.position.set(0,0,0);ribbons.scale.setScalar(1+travel*.035);
    ribbons.rotation.set(-.12+py*.035+travel*.12,-.20+px*.065-travel*.12,-.16+travel*.12);
    viewDirection.set(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));viewRight.set(Math.cos(yaw),0,-Math.sin(yaw));viewUp.crossVectors(viewDirection,viewRight);
    lookTarget.copy(viewRight).multiplyScalar(-centerX+(phone?0:.65)*travel).addScaledVector(viewUp,-centerY-travel*.22);
    camera.position.copy(lookTarget).addScaledVector(viewDirection,distance-travel*1.05+(1-entrance)*.6);camera.lookAt(lookTarget);camera.rotateZ(-travel*.055+px*.006);
    const settling=progress!==goal||(!stopped&&(eased.x!==pointer.x||eased.y!==pointer.y)),pending=assembly<1||settling;
    try{renderer.render(scene,camera);if(failed)return;frameCount++;report(now,assembly,!pending);if(!ready){ready=true;host.dataset.renderer='ready';onReady?.({renderer:'webgl',scene:'folded-chrome-ribbons'});}}catch(error){fail(error);return;}
    if(pending)raf=requestAnimationFrame(render);else last=0;
  }
  function request(){if(!raf&&!disposed&&!failed&&visible&&intersecting&&!document.hidden){last=0;raf=requestAnimationFrame(render);}}
  function suspend(){cancelAnimationFrame(raf);raf=0;last=0;if(ready){const settled=assemblyTime>=1.45&&progress===goal&&(staticMotion()||(eased.x===pointer.x&&eased.y===pointer.y));report(performance.now(),assemblyTime/1.45,settled,true);diagnostic('loop','suspended');}}
  function resetPointer(){pointer.x=pointer.y=eased.x=eased.y=0;}
  function setPaused(value){value=Boolean(value);if(value===pause)return;pause=value;last=0;if(staticMotion()){resetPointer();progress=goal;assemblyTime=1.45;}request();}
  function setPointer(x,y){if(!staticMotion()){const nextX=THREE.MathUtils.clamp(Number(x)||0,-1,1),nextY=THREE.MathUtils.clamp(Number(y)||0,-1,1);if(Math.abs(nextX-pointer.x)<.0001&&Math.abs(nextY-pointer.y)<.0001)return;pointer.x=nextX;pointer.y=nextY;request();}}
  function visibility(){last=0;if(document.hidden)suspend();else request();}
  function lost(event){event.preventDefault();fail(new Error('The 3D context was lost.'));}
  function motionChanged(){last=0;if(staticMotion()){resetPointer();progress=goal;assemblyTime=1.45;}request();}
  renderer.domElement.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',motionChanged);
  observer=new ResizeObserver(resize);observer.observe(host);
  if('IntersectionObserver'in window){intersection=new IntersectionObserver(entries=>{intersecting=entries[0].isIntersecting;last=0;if(!intersecting)suspend();else request();},{rootMargin:'100px'});intersection.observe(host);}resize();
  return {
    setProgress(value){const next=THREE.MathUtils.clamp(Number(value)||0,0,1);if(next===goal)return;goal=next;if(staticMotion())progress=goal;request();},setPaused,setPointer,resize,
    setVisible(value){value=Boolean(value);if(visible===value)return;visible=value;last=0;if(!visible)suspend();else request();},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);observer?.disconnect();intersection?.disconnect();document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motionChanged);renderer.domElement.removeEventListener('webglcontextlost',lost);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());environmentTarget?.dispose();renderer.dispose();renderer.domElement.remove();}
  };
}
