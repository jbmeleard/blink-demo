import{html as w,esc as d,clamp as $,lerp as H,smooth as P,loadImage as U,icon as Y}from"../ui.js";import{distance as ot,formatDistance as rt}from"../store.js";import{createEruption as lt,drawCover as ct}from"./eruption.js";function yt(t,i,e){const a=[],s=[];for(const r of i.blocks){const u=ht[r.type];if(!u){console.warn("Bloc inconnu",r.type);continue}const h=u(r,e);t.appendChild(h.el),h.update&&a.push(h.update),h.destroy&&s.push(h.destroy)}const l=new IntersectionObserver(r=>{for(const u of r)u.isIntersecting&&(u.target.classList.add("in"),l.unobserve(u.target))},{rootMargin:"0px 0px -12% 0px"});t.querySelectorAll(".reveal").forEach(r=>l.observe(r));let f=!1;const o=()=>{f=!1;const r=innerHeight;for(const u of a)u(r)},p=()=>{f||(f=!0,requestAnimationFrame(o))};return addEventListener("scroll",p,{passive:!0}),addEventListener("resize",p),p(),()=>{removeEventListener("scroll",p),removeEventListener("resize",p),l.disconnect(),s.forEach(r=>r())}}function Q(t,i){const e=t.getBoundingClientRect(),a=e.height-i;return{p:a>0?$(-e.top/a,0,1):0,near:e.bottom>-i&&e.top<i*2}}function st(t,i){if(!t.length)return 0;const e=t[0].getBoundingClientRect(),a=e.height||i,s=(i/2-(e.top+a/2))/a;return $(s,0,t.length-1)}function dt(t,i,{yaw:e,pitch:a,zoom:s}){if(Math.abs(e)<.001&&Math.abs(a)<.001&&Math.abs(s-1)<.001)return t;const l=t.map((r,u)=>r-i[u]),f=Math.hypot(...l)*s,o=Math.atan2(l[0],l[2])+e,p=$(Math.acos($(l[1]/(f/s),-1,1))-a,.08,Math.PI-.08);return[i[0]+f*Math.sin(p)*Math.sin(o),i[1]+f*Math.cos(p),i[2]+f*Math.sin(p)*Math.cos(o)]}async function pt(t,i){const{OrbitControls:e}=await import("three/addons/controls/OrbitControls.js"),a=new e(t.camera,t.renderer.domElement);a.enableZoom=!1;const s=document.createElement("pre");s.className="model-debug",i.parentElement.appendChild(s),i.parentElement.style.pointerEvents="auto",i.style.pointerEvents="auto";const l=o=>o.toArray().map(p=>+p.toFixed(2)),f=()=>{s.textContent=JSON.stringify({pos:l(t.camera.position),look:l(a.target)}),t.render()};return window.blinkScene={...t,controls:a},a.addEventListener("change",f),f(),{controls:a,show:f}}const nt=['<path d="M4 112 C60 6 160 6 216 112"/><path d="M30 112 C74 36 146 36 190 112"/><path d="M56 112 C88 66 132 66 164 112"/>','<path d="M4 8 C60 114 160 114 216 8"/><path d="M30 8 C74 84 146 84 190 8"/><path d="M56 8 C88 54 132 54 164 8"/>','<path d="M4 112 C60 6 160 6 216 112"/><path d="M30 112 C74 36 146 36 190 112"/><path d="M56 112 C88 66 132 66 164 112"/><circle cx="110" cy="104" r="8" fill="currentColor" stroke="none"/>'],ut=t=>`<svg class="eyelids" width="64" height="34" viewBox="0 0 220 120" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" aria-hidden="true">${nt[t%nt.length]}</svg>`,tt=t=>t.map(i=>`<div class="step"><div class="card">${i.html}</div></div>`).join(""),ht={hero(t){if(t.variant==="article")return{el:w(`
        <header class="b-hero-article">
          <figure><img src="${t.image}" alt=""><figcaption>${d(t.credit||"")}</figcaption></figure>
          <div class="hero-text">
            <p class="kicker">${d(t.kicker||"")}</p>
            <h1>${d(t.title)}</h1>
            ${t.subtitle?`<p class="hero-sub">${d(t.subtitle)}</p>`:""}
          </div>
        </header>`)};const[i,e]=t.focus||[.5,.5],a=w(`
      <section class="b-hero">
        <div class="hero-media"><img src="${t.image}" alt="" style="object-position:${i*100}% ${e*100}%"></div>
        <div class="hero-shade ${t.shade==="strong"?"strong":""}"></div>
        <div class="hero-text">
          <p class="kicker">${d(t.kicker||"")}</p>
          <h1>${d(t.title)}</h1>
          ${t.subtitle?`<p class="hero-sub">${d(t.subtitle)}</p>`:""}
        </div>
        ${t.credit?`<p class="hero-credit">${d(t.credit)}</p>`:""}
        <span class="scroll-cue" aria-hidden="true">Faites défiler<i></i></span>
      </section>`),s=a.querySelector("img"),l=a.querySelector(".hero-text"),f=a.querySelector(".scroll-cue");return{el:a,update(o){const p=a.getBoundingClientRect();if(p.bottom<0)return;const r=$(-p.top/o,0,1);s.style.transform=`translate3d(0, ${r*18}%, 0) scale(${1.04+r*.12})`,l.style.opacity=String(1-P($(r*1.6,0,1))),l.style.transform=`translate3d(0, ${-r*60}px, 0)`,f.style.opacity=String(1-$(r*5,0,1))}}},text(t){return{el:w(`<div class="b-text prose reveal ${t.dropcap?"dropcap":""}">${t.html}</div>`)}},chapter(t,i){const e=i.chapters=(i.chapters||0)+1;return{el:w(`<section class="b-chapter reveal">${ut(e-1)}<p class="kicker">${d(t.kicker||"")}</p><h2>${d(t.title)}</h2></section>`)}},timeline(t){const i=w(`
      <section class="b-timeline">
        <div class="tl-line"><i></i></div>
        <ol>${t.items.map(s=>`<li class="reveal"><span class="tl-year">${d(s.year)}</span><p>${d(s.text)}</p></li>`).join("")}</ol>
      </section>`),e=i.querySelector(".tl-line i"),a=[...i.querySelectorAll("li")];return{el:i,update(s){const l=i.getBoundingClientRect();if(l.bottom<-s||l.top>s*2)return;const f=$((s*.55-l.top)/l.height,0,1);e.style.transform=`scaleY(${f})`;for(const o of a){const p=o.getBoundingClientRect();o.classList.toggle("passed",p.top<s*.55)}}}},scrolly(t){const i=t.steps.flatMap((c,y)=>(c.marks||[]).map(m=>({...m,step:y}))),e=w(`
      <section class="b-scrolly">
        <div class="sticky">
          <div class="stage">
            <img class="backdrop" src="${t.image}" alt="" aria-hidden="true">
            <img class="pan" src="${t.image}" alt="">
            <div class="marks">${i.map(c=>`<span class="mark" data-step="${c.step}"><b></b><em>${d(c.label)}</em></span>`).join("")}</div>
          </div>
        </div>
        <div class="steps">${tt(t.steps)}</div>
      </section>`),a=e.querySelector(".stage"),s=e.querySelector(".pan"),l=[...e.querySelectorAll(".mark")],f=[...e.querySelectorAll(".step")];let o=0,p=0,r=!0;const u=()=>{o=s.naturalWidth,p=s.naturalHeight,s.style.width=`${o}px`,s.style.height=`${p}px`,r=!0,h(innerHeight)};s.complete&&s.naturalWidth?requestAnimationFrame(u):s.addEventListener("load",u,{once:!0});function h(c){const y=e.getBoundingClientRect();if(!o||!r&&(y.bottom<-c||y.top>c*2))return;r=!1;const m=a.clientWidth,g=a.clientHeight,v=st(f,c),M=Math.floor(v),C=Math.min(M+1,t.steps.length-1),S=P(v-M),L=t.steps[M].view||{x:.5,y:.5,scale:1},b=t.steps[C].view||L,k=H(L.x,b.x,S),X=H(L.y,b.y,S),O=H(L.scale,b.scale,S),T=Math.min(m/o,g/p)*O,A=o*T,z=p*T,N=A>m?$(m/2-k*A,m-A,0):(m-A)/2,V=z>g?$(g/2-X*z,g-z,0):(g-z)/2;s.style.transform=`translate3d(${N}px, ${V}px, 0) scale(${T})`;for(const W of l){const Z=+W.dataset.step,n=i[l.indexOf(W)],x=$(1-Math.abs(v-Z)*2.4,0,1);W.style.opacity=String(x),W.style.transform=`translate3d(${N+n.x*A}px, ${V+n.y*z}px, 0)`}}return{el:e,update:h}},sequence(t){const i=w(`
      <section class="b-sequence">
        <div class="sticky ${t.fit==="contain"?"contain":""}"><canvas></canvas><div class="seq-loading">Chargement…</div>${t.labels?'<span class="seq-year"></span>':""}${t.credit?`<p class="seq-credit">${d(t.credit)}</p>`:""}</div>
        <div class="steps">${tt(t.steps||[])}</div>
      </section>`),e=i.querySelector("canvas"),a=i.querySelector(".seq-year");let s=null,l=-1;const f=()=>{const r=Math.min(devicePixelRatio||1,1.75);e.width=Math.round(e.clientWidth*r),e.height=Math.round(e.clientHeight*r),l=-1};(async()=>{if(t.frames){const r=await Promise.all(t.frames.map(U)),u=e.getContext("2d"),h=(c,y)=>{if(u.globalAlpha=y,t.fit==="contain"){const m=Math.min(e.width/c.naturalWidth,e.height/c.naturalHeight),g=Math.max(e.width/c.naturalWidth,e.height/c.naturalHeight),v=Math.min(g,m*(t.zoom||1)),M=c.naturalWidth*v,C=c.naturalHeight*v;u.drawImage(c,(e.width-M)/2,(e.height-C)/2,M,C)}else ct(u,c,e.width,e.height,t.focus||[.5,.5],1);u.globalAlpha=1};s=c=>{const y=c*(r.length-1);if(t.fit==="contain"&&u.clearRect(0,0,e.width,e.height),t.crossfade){const m=Math.floor(y);h(r[m],1),m<r.length-1&&h(r[m+1],P($((y-m-.35)/.3,0,1)))}else h(r[Math.round(y)],1);if(t.labels){const m=t.labels[Math.min(t.labels.length-1,Math.round(y*(t.labels.length-1)/(r.length-1)))];a.textContent!==m&&(a.textContent=m)}}}else if(t.generator==="eruption"){const[r,u]=await Promise.all([U(t.from),U(t.to)]);s=lt(e,r,u,{fromFocus:t.fromFocus,toFocus:t.toFocus})}i.querySelector(".seq-loading").remove(),f(),p(innerHeight)})();const o=()=>f();addEventListener("resize",o);function p(r){if(!s)return;const{p:u,near:h}=Q(i,r);!h&&l>=0||Math.abs(u-l)<5e-4||(l=u,s(u))}return{el:i,update:p,destroy:()=>removeEventListener("resize",o)}},model(t){const i=t.steps.flatMap((n,x)=>(n.marks||[]).map(E=>({...E,step:x}))),e=w(`
      <section class="b-model">
        <div class="sticky">
          <div class="model-stage"></div>
          <div class="marks">${i.map(n=>`<span class="mark" data-step="${n.step}"><b></b><em>${d(n.label)}</em></span>`).join("")}</div>
          <div class="model-loading"><span>Chargement de la 3D</span><i><b></b></i></div>
          ${t.credit?`<p class="seq-credit">${d(t.credit)}</p>`:""}
          <p class="model-hint" hidden>${matchMedia("(pointer: coarse)").matches?"Deux doigts pour faire pivoter la 3D":"Cliquez-glissez pour faire pivoter la 3D"}</p>
        </div>
        <div class="steps">${tt(t.steps)}</div>
      </section>`),a=e.querySelector(".model-stage"),s=e.querySelector(".sticky"),l=e.querySelector(".model-hint"),f=e.querySelector(".model-loading"),o=[...e.querySelectorAll(".mark")],p=[...e.querySelectorAll(".step")],r=[...new Set(t.steps.flatMap(n=>[...n.highlight||[],...n.hide||[]]))],u=location.search.includes("debug3d");let h=null,c=!1,y=null,m=-1;const g={yaw:0,pitch:0,zoom:1};let v=!1;const M=async()=>{c=!0;try{const{createModel:n}=await import("./model3d.js");if(h=await n(a,{src:t.src,groups:r,onLost:C},x=>{f.querySelector("b").style.transform=`scaleX(${x})`}),!e.isConnected){h.dispose(),h=null;return}f.remove(),u?y=await pt(h,a):l.hidden=!1,m=-1,b(innerHeight,!0)}catch(n){console.error(n),C()}};function C(){h=null,f.remove(),e.querySelector(".marks").hidden=!0,t.fallback&&(a.innerHTML=`<img class="model-fallback" src="${t.fallback}" alt="">`)}const S=(n,x)=>(n||[]).includes(x)?1:0,L=setTimeout(()=>{!c&&e.isConnected&&M()},1500);function b(n,x){const E=e.getBoundingClientRect();if(!c&&E.top<n*3&&E.bottom>-n&&M(),!h||!x&&(E.bottom<-n||E.top>n*2))return;const F=st(p,n);if(!x&&Math.abs(F-m)<.001)return;m=F;const G=Math.floor(F),it=Math.min(G+1,t.steps.length-1),I=P($((F-G-.15)/.7,0,1)),R=t.steps[G],D=t.steps[it],et=(q,K)=>q.map((J,B)=>H(J,K[B],I)),j={pos:et(R.view.pos,D.view.pos),look:et(R.view.look,D.view.look),fov:H(R.view.fov||45,D.view.fov||45,I),build:H(R.build??1,D.build??1,I),highlight:{},hide:{}};for(const q of r)j.highlight[q]=H(S(R.highlight,q),S(D.highlight,q),I),j.hide[q]=H(S(R.hide,q),S(D.hide,q),I);!v&&!x&&(g.yaw*=.8,g.pitch*=.8,g.zoom=1+(g.zoom-1)*.8),j.pos=dt(j.pos,j.look,g),h.set(j),y&&(y.controls.target.set(...j.look),y.show()),h.render(),o.forEach((q,K)=>{const J=i[K],B=h.project(J.at),at=B?$(1-Math.abs(F-J.step)*2.4,0,1):0;q.style.opacity=String(at),B&&(q.style.transform=`translate3d(${B[0]}px, ${B[1]}px, 0)`,q.classList.toggle("flip",B[0]>innerWidth*.55))})}let k=null;const X=(n,x,E=1)=>({x:n,y:x,d:E,yaw:g.yaw,pitch:g.pitch,zoom:g.zoom}),O=(n,x,E=k.d)=>{g.yaw=k.yaw-(n-k.x)*.008,g.pitch=$(k.pitch+(x-k.y)*.006,-1.2,1.2),g.zoom=$(k.zoom*k.d/E,.5,1.8),l.classList.add("used"),b(innerHeight,!0)},_=n=>[(n[0].clientX+n[1].clientX)/2,(n[0].clientY+n[1].clientY)/2,Math.hypot(n[0].clientX-n[1].clientX,n[0].clientY-n[1].clientY)||1],T=n=>{!h||n.touches.length!==2||(n.preventDefault(),k=X(..._(n.touches)),v=!0)},A=n=>{!k||n.touches.length!==2||(n.preventDefault(),O(..._(n.touches)))},z=n=>{n.touches.length<2&&(k=null,v=!1)},N=n=>{!h||n.pointerType!=="mouse"||n.button!==0||(k=X(n.clientX,n.clientY),v=!0,s.setPointerCapture(n.pointerId),s.classList.add("grabbing"))},V=n=>{k&&n.pointerType==="mouse"&&O(n.clientX,n.clientY)},W=n=>{n.pointerType!=="mouse"||!k||(k=null,v=!1,s.classList.remove("grabbing"))};u||(s.addEventListener("touchstart",T,{passive:!1}),s.addEventListener("touchmove",A,{passive:!1}),s.addEventListener("touchend",z),s.addEventListener("touchcancel",z),s.addEventListener("pointerdown",N),s.addEventListener("pointermove",V),s.addEventListener("pointerup",W),s.addEventListener("pointercancel",W));const Z=()=>{h&&(h.resize(),b(innerHeight,!0))};return addEventListener("resize",Z),{el:e,update:b,destroy:()=>{clearTimeout(L),removeEventListener("resize",Z),h?.dispose()}}},compare(t){const i=t.split?t.image:t.before,e=t.split?t.image:t.after,a=w(`
      <section class="b-compare">
        <div class="sticky">
          <div class="stage">
            <div class="cmp-frame">
              <div class="cmp cmp-before" style="background-image:url('${i}')"></div>
              <div class="cmp cmp-after" style="background-image:url('${e}')"></div>
              <div class="cmp-line"><span>${Y("arrow",16)}</span></div>
              ${(t.marks||[]).map(c=>`<span class="mark wide ${c.x>.55?"flip":""}" style="left:${c.x*100}%;top:${c.y*100}%"><b></b><em>${d(c.label)}</em></span>`).join("")}
            </div>
            <span class="cmp-label l">${d(t.beforeLabel||"Avant")}</span>
            <span class="cmp-label r">${d(t.afterLabel||"Après")}</span>
            ${t.caption?`<p class="cmp-caption">${d(t.caption)}</p>`:""}
            ${t.credit?`<p class="seq-credit">${d(t.credit)}</p>`:""}
          </div>
        </div>
      </section>`),s=a.querySelector(".cmp-frame"),l=a.querySelector(".cmp-after"),f=a.querySelector(".cmp-line"),o=a.querySelectorAll(".cmp-label"),p=[...a.querySelectorAll(".cmp-frame .mark")];t.split&&(a.querySelector(".cmp-before").classList.add("half-left"),l.classList.add("half-right"));let r=0;U(i).then(c=>{r=(t.split?c.naturalWidth/2:c.naturalWidth)/c.naturalHeight,u(),h(innerHeight,!0)});function u(){if(!r)return;const c=s.parentElement,y=c.clientWidth*.92,m=c.clientHeight*.78,g=Math.min(y,m*r);s.style.width=`${g}px`,s.style.height=`${g/r}px`}addEventListener("resize",u);function h(c,y){const{p:m,near:g}=Q(a,c);if(!g&&!y)return;const v=P($((m-.12)/.7,0,1)),M=(1-v)*100;l.style.clipPath=`inset(0 0 0 ${M}%)`,f.style.left=`${M}%`,f.style.opacity=v>.995||v<.005?"0":"1",o[0].style.opacity=String(1-v),o[1].style.opacity=String(v),p.forEach((C,S)=>{const L=.25+S/p.length*.6;C.style.opacity=String(P($((v-L)/.15,0,1)))})}return{el:a,update:h,destroy:()=>removeEventListener("resize",u)}},gallery(t){if(t.variant==="grid")return{el:w(`<div class="b-grid">${t.items.map(a=>`
          <figure class="reveal"><img src="${a.image}" alt="" loading="lazy"><figcaption>${d(a.caption||"")}</figcaption></figure>`).join("")}</div>`)};const i=w(`
      <section class="b-gallery" style="--n:${t.items.length}">
        <div class="sticky">
          ${t.title?`<h3 class="gal-title">${d(t.title)}</h3>`:""}
          <div class="track">${t.items.map((a,s)=>`
            <figure><img src="${a.image}" alt="" loading="lazy"><figcaption><b>${String(s+1).padStart(2,"0")}</b> ${d(a.caption||"")}</figcaption></figure>`).join("")}</div>
        </div>
      </section>`),e=i.querySelector(".track");return{el:i,update(a){const{p:s,near:l}=Q(i,a);if(!l)return;const f=e.scrollWidth-e.parentElement.clientWidth;e.style.transform=`translate3d(${-P(s)*Math.max(0,f)}px, 0, 0)`}}},figure(t){return{el:w(`<figure class="b-figure reveal ${t.size||""}"><img src="${t.image}" alt="" loading="lazy">${t.caption?`<figcaption>${d(t.caption)}</figcaption>`:""}</figure>`)}},quote(t){return{el:w(`<blockquote class="b-quote reveal"><p>${d(t.text)}</p>${t.cite?`<cite>${d(t.cite)}</cite>`:""}</blockquote>`)}},outro(t){return{el:w(`<section class="b-outro reveal"><div class="outro-box">
        <svg width="72" height="44" viewBox="0 0 120 72" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 36 C30 6 90 6 114 36 C90 66 30 66 6 36 Z"/><circle cx="60" cy="36" r="17"/><circle cx="60" cy="36" r="5" fill="currentColor"/></svg>
        <h3>${d(t.title)}</h3>${t.text?`<p>${d(t.text)}</p>`:""}
      </div></section>`)}},note(t){return{el:w(`<aside class="b-note">${t.html}</aside>`)}},info(t,{poi:i,data:e,visits:a=[]}){const s=e.typoById[i.typology],l=e.pois.filter(o=>o.id!==i.id).map(o=>({p:o,d:ot(i,o)})).filter(({d:o})=>o<3e4).sort((o,p)=>o.d-p.d).slice(0,3);return{el:w(`
      <section class="b-info">
        <div class="info-card">
          <p class="kicker" style="--c:${s.color}"><i></i>${d(s.label)}</p>
          <h3>${d(i.fullTitle||i.title)}</h3>
          <p class="info-addr">${Y("pin",16)} ${d(i.address)}</p>
          <a class="btn btn-primary" href="#/carte?poi=${i.id}">${Y("map",18)} Voir sur la carte</a>
        </div>
        ${a.length?`<h4>Ce lieu fait partie de</h4>
        <ul class="nearby in-visits">${a.map(o=>`
          <li><a href="#/visite/${o.id}"><img src="${o.cover}" alt="" loading="lazy">
            <span><strong>${d(o.title)}</strong><small>Visite · ${o.steps.length} étapes</small></span>${Y("arrow",18)}</a></li>`).join("")}</ul>`:""}
        ${l.length?"<h4>À proximité</h4>":""}
        <ul class="nearby">${l.map(({p:o,d:p})=>`
          <li><a href="#/carte?poi=${o.id}"><img src="${o.cover}" alt="" loading="lazy">
            <span><strong>${d(o.title)}</strong><small>${rt(p)} à pied</small></span>${Y("arrow",18)}</a></li>`).join("")}</ul>
        ${t.sources?.length?`<h4>Sources</h4><ul class="sources">${t.sources.map(o=>`<li><a href="${d(o.url)}" target="_blank" rel="noopener">${d(o.label)}</a></li>`).join("")}</ul>`:""}
      </section>`)}}};export{yt as renderStory};
