const h={angle:30,face:.28,faceOpacity:.55,lineWidth:1.4,bloom:{strength:.35,radius:.25,threshold:.85},grid:{opacity:.35,cells:40}},M={gray:.28,opacity:.55,warmHeight:7.5,floorWarm:.25,faceCool:[1,1,1],faceWarm:[1,1,1],faceGain:.3,lineCool:[1,1,1],lineWarm:[1,1,1],lineBase:1,lineGain:0,axes:[1.08,1.15],extend:12,sky:[[.0055,.0055,.0065],[.0022,.0022,.0026],[.0012,.0012,.0014]],haze:[.006,.006,.0065],glow:[1,1,1],glowGain:.012},U=16445786;function X(){const a=navigator.deviceMemory||8,P=navigator.hardwareConcurrency||8;return a<=3||P<=4}async function Z(a,P="wireframe"){const z=P==="siponto",[{LineSegments2:V},{LineSegmentsGeometry:b},{LineMaterial:_}]=await Promise.all([import("three/addons/lines/LineSegments2.js"),import("three/addons/lines/LineSegmentsGeometry.js"),import("three/addons/lines/LineMaterial.js")]),O=new Set,k=new a.Color(16777215),B=new a.Color(U);let G=[1,1];const $=[],C={uFloor:{value:-1e5},uCenter:{value:new a.Vector2},uAxes:{value:new a.Vector2(1e5,1e5)},uExtend:{value:M.extend}},v=e=>`vec3(${e.map(t=>t.toFixed(4)).join(", ")})`;function A(e){const t=M,n=new a.MeshBasicMaterial({color:16777215,transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,clippingPlanes:e});return n.onBeforeCompile=r=>{Object.assign(r.uniforms,C),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWPos;
varying vec3 vWNorm;`).replace("#include <project_vertex>",`#include <project_vertex>
          vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vWNorm = normalize(mat3(modelMatrix) * normal);`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
          varying vec3 vWPos;
          varying vec3 vWNorm;
          uniform float uFloor;
          uniform vec2 uCenter;
          uniform vec2 uAxes;
          uniform float uExtend;`).replace("#include <color_fragment>",`#include <color_fragment>
          {
            // Sous le niveau du sol (épaisseur de la dalle du parvis) : rien, pour ne pas dessiner de bord.
            if (vWPos.y < uFloor - 0.01) discard;
            vec3 n = normalize(vWNorm);
            float h = clamp(1.0 - (vWPos.y - uFloor) / ${t.warmHeight.toFixed(2)}, 0.0, 1.0);
            float vert = pow(clamp(1.0 - abs(n.y), 0.0, 1.0), 2.0) * ${(1-t.floorWarm).toFixed(2)} + ${t.floorWarm.toFixed(2)};
            float wf = pow(h, 2.2) * vert;
            vec3 col = mix(${v(t.faceCool)}, ${v(t.faceWarm)}, wf) * (${t.gray.toFixed(2)} + wf * ${t.faceGain.toFixed(2)});
            vec2 d = vWPos.xz - uCenter;
            float rin = length(d / uAxes) - 1.0;
            float rout = 1.0 - length(d / (uAxes + uExtend));
            float k = clamp(rin / max(rin + rout, 1e-4), 0.0, 1.0);
            diffuseColor.rgb *= col;
            diffuseColor.a *= ${t.opacity.toFixed(2)} * (1.0 - smoothstep(0.0, 1.0, k));
          }`)},n.customProgramCacheKey=()=>"blink-siponto-faces",n.userData={transparent:!0,opacity:1},n}function D(e){const t=M,n=new a.Vector3,r=new a.Vector3;for(const{line:i,positions:o}of $){i.updateWorldMatrix(!0,!1);const c=[],s=[],f=l=>{const x=Math.min(1,Math.max(0,1-(l.y-e)/t.warmHeight))**2.2,y=t.lineBase+x*t.lineGain;for(let u=0;u<3;u++)s.push((t.lineCool[u]+(t.lineWarm[u]-t.lineCool[u])*x)*y)};for(let l=0;l<o.length;l+=6)if(n.set(o[l],o[l+1],o[l+2]).applyMatrix4(i.matrixWorld),r.set(o[l+3],o[l+4],o[l+5]).applyMatrix4(i.matrixWorld),!(n.y<e+.02&&r.y<e+.02)){for(let p=0;p<6;p++)c.push(o[l+p]);f(n),f(r)}if(i.geometry.dispose(),!c.length){i.visible=!1;continue}const g=new b().setPositions(c);g.setColors(s),i.geometry=g,i.material.vertexColors=!0,i.material.needsUpdate=!0}$.length=0}function L(){const e=M,t=new a.ShaderMaterial({vertexShader:`varying vec3 vDir;
        void main() {
          vDir = position;
          vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
          gl_Position = p.xyww;
        }`,fragmentShader:`varying vec3 vDir;
        void main() {
          float h = normalize(vDir).y;
          float t = clamp((h + 0.02) / 0.72, 0.0, 1.0);
          vec3 col = t < 0.25 ? mix(${v(e.sky[0])}, ${v(e.sky[1])}, t / 0.25) : mix(${v(e.sky[1])}, ${v(e.sky[2])}, (t - 0.25) / 0.75);
          col += ${v(e.haze)} * exp(-abs(h) * 14.0);
          col = mix(${v(e.sky[0])}, col, smoothstep(-0.02, 0.03, h));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,depthWrite:!1,depthTest:!1,side:a.BackSide}),n=new a.Mesh(new a.SphereGeometry(1,32,16),t);return n.name="ciel",n.frustumCulled=!1,n.renderOrder=-10,n}function j(e,t,n){const r=M,i=new a.ShaderMaterial({uniforms:{uMin:{value:new a.Vector2(e.x0,e.z0)},uMax:{value:new a.Vector2(e.x1,e.z1)},uFar:{value:n}},vertexShader:`varying vec3 vW;
        void main() {
          vW = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0);
        }`,fragmentShader:`uniform vec2 uMin;
        uniform vec2 uMax;
        uniform float uFar;
        varying vec3 vW;
        void main() {
          vec2 c = (uMin + uMax) * 0.5, hs = (uMax - uMin) * 0.5;
          vec2 e = abs(vW.xz - c) - hs;
          float d = max(length(max(e, 0.0)) + min(max(e.x, e.y), 0.0), 0.0);
          float glow = exp(-d / 3.0) + 0.7 / (1.0 + (d / 12.0) * (d / 12.0));
          vec3 col = ${v(r.sky[0])} + glow * ${r.glowGain.toFixed(3)} * ${v(r.glow)};
          float fog = smoothstep(70.0, uFar * 0.95, length(vW - cameraPosition));
          gl_FragColor = vec4(mix(col, ${v(r.sky[0])}, fog), 1.0);
          #include <colorspace_fragment>
        }`,depthWrite:!1}),o=new a.Mesh(new a.PlaneGeometry(1200,1200),i);return o.rotation.x=-Math.PI/2,o.position.set((e.x0+e.x1)/2,t-.5,(e.z0+e.z1)/2),o.name="sol",o.renderOrder=-5,o}function I(e,t,n){const{x0:r,x1:i,z0:o,z1:c}=e,[s,f,g,l]=[n.x0,n.x1,n.z0,n.z1],p=[[s,g,f,o],[s,c,f,l],[s,o,r,c],[i,o,f,c]],x=[];for(const[W,w,m,d]of p)x.push(W,t,w,m,t,d,m,t,w,W,t,w,W,t,d,m,t,d);const y=new a.BufferGeometry;y.setAttribute("position",new a.Float32BufferAttribute(x,3)),y.computeVertexNormals();const u=new a.Mesh(y,A([]));return u.name="esplanade",u}function N(e,t){const n=e.min.y<0&&e.min.y>-1?0:e.min.y,r={x0:1/0,x1:-1/0,z0:1/0,z1:-1/0},i=new a.Vector3;return t?.updateMatrixWorld(!0),t?.traverse(o=>{if(!o.isMesh||o.isLineSegments2||!o.geometry?.attributes.position)return;const c=o.geometry.attributes.position;for(let s=0;s<c.count;s++)i.fromBufferAttribute(c,s).applyMatrix4(o.matrixWorld),!(i.y>n-.05)&&(r.x0=Math.min(r.x0,i.x),r.x1=Math.max(r.x1,i.x),r.z0=Math.min(r.z0,i.z),r.z1=Math.max(r.z1,i.z))}),Number.isFinite(r.x0)||Object.assign(r,{x0:e.min.x,x1:e.max.x,z0:e.min.z,z1:e.max.z}),{floorY:n,rect:r}}return{background:z?null:new a.Color(0),faceMaterial(e=[]){if(z)return A(e);const t=new a.MeshBasicMaterial({color:new a.Color().setRGB(h.face,h.face,h.face,a.LinearSRGBColorSpace),transparent:!0,opacity:h.faceOpacity,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,clippingPlanes:e});return t.userData={transparent:!0,opacity:h.faceOpacity},t},addEdges(e,t=[]){const n=new a.EdgesGeometry(e.geometry,h.angle),r=new b().fromEdgesGeometry(n),i=n.attributes.position.array;n.dispose();const o=new _({color:16777215,linewidth:h.lineWidth,clippingPlanes:t});o.resolution.set(...G),o.userData={transparent:!1,opacity:1},O.add(o);const c=new V(r,o);return c.name=`${e.name}_aretes`,e.add(c),e.userData.edges=c,z&&$.push({line:c,positions:i}),c},tint(e,t,n){e.material.color.copy(k).lerp(B,Math.min(1,t)),z&&n&&n.color.copy(k).lerp(B,Math.min(1,t))},decor(e,t=200,n=null,r=null){if(!z)return this.grid(e);const i=M,o=N(e,r?null:n),c=o.floorY,s=r||o.rect,f=(s.x0+s.x1)/2,g=(s.z0+s.z1)/2,l=(s.x1-s.x0)/2*i.axes[0],p=(s.z1-s.z0)/2*i.axes[1];C.uFloor.value=c,C.uCenter.value.set(f,g),C.uAxes.value.set(l,p),D(c);const x=i.extend+1,y={x0:f-l-x,x1:f+l+x,z0:g-p-x,z1:g+p+x},u=new a.Group;return u.name="decor",u.add(L(),j(s,c,t),I(s,c,y)),u},grid(e){const t=e.getSize(new a.Vector3),n=e.getCenter(new a.Vector3),r=Math.max(t.x,t.z),i=h.grid.cells,o=r/20,c=i*o,s=e.min.y-r*.004,f=r*.35,g=c,l=(m,d)=>{const F=Math.hypot(m,d),S=Math.min(1,Math.max(0,(F-f)/(g-f)));return h.grid.opacity*(1-S)*(1-S)},p=[],x=[],y=(m,d,F,S)=>{p.push(n.x+m,s,n.z+d,n.x+F,s,n.z+S),x.push(1,1,1,l(m,d),1,1,1,l(F,S))};for(let m=-i;m<=i;m++)for(let d=-i;d<i;d++)y(m*o,d*o,m*o,(d+1)*o),y(d*o,m*o,(d+1)*o,m*o);const u=new a.BufferGeometry;u.setAttribute("position",new a.Float32BufferAttribute(p,3)),u.setAttribute("color",new a.Float32BufferAttribute(x,4));const W=new a.LineBasicMaterial({vertexColors:!0,transparent:!0,depthWrite:!1}),w=new a.LineSegments(u,W);return w.name="grille",w.renderOrder=-1,w},async composer(e,t,n){if(X())return null;const[{EffectComposer:r},{RenderPass:i},{UnrealBloomPass:o},{OutputPass:c}]=await Promise.all([import("three/addons/postprocessing/EffectComposer.js"),import("three/addons/postprocessing/RenderPass.js"),import("three/addons/postprocessing/UnrealBloomPass.js"),import("three/addons/postprocessing/OutputPass.js")]),s=new r(e);s.addPass(new i(t,n));const{strength:f,radius:g,threshold:l}=h.bloom;return s.addPass(new o(new a.Vector2(256,256),f,g,l)),s.addPass(new c),s},resize(e,t,n,r){G=[e,t];for(const i of O)i.resolution.set(e,t);n&&(n.setPixelRatio(r),n.setSize(e,t))}}}export{M as SIPONTO,h as WIRE,Z as loadWire};
