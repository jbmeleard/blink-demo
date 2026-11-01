import{loadData as T,getSetting as P,getPosition as B,onPosition as J,startWatching as I,distance as R,formatDistance as O,isOnSite as C,onSettingChange as W}from"../store.js";import{loadVisits as A,loadLiaison as X,getProgress as h,startVisit as Y,markArrived as z,advance as N,walkMinutes as j,formatDuration as F,walkedDistance as Z,getActiveVisitId as Q,stopVisit as _}from"../visits.js";import{html as k,icon as o,esc as p,toast as G}from"../ui.js";import{createBaseMap as K}from"../basemap.js";import{drawVisit as U}from"../visit-map.js";import{renderStory as ee}from"../story/engine.js";const E=i=>i<1e3?`${Math.round(i/10)*10} m`:`${(i/1e3).toFixed(1).replace(".",",")} km`;function te(i){const r=h(i.id);r&&(r.index<i.steps.length-1&&i.liaisons[r.index]?location.hash=`#/visite/${i.id}/liaison/${r.index}`:location.hash=N(i)?`#/visite/${i.id}/guide`:`#/visite/${i.id}/fin`)}function ie(i,r){return i.steps.map(($,d)=>`<i class="${d<r?"done":d===r?"current":""}"></i>`).join("")}async function de(i,r){const[{byId:$},d]=await Promise.all([A(),T()]),e=$[r.id];if(!e){location.hash="#/visites";return}let t=h(e.id);(!t||t.finishedAt||Q()!==e.id)&&(t=Y(e.id)),document.body.classList.add("page-guide");const c=k(`
    <main class="guide">
      <div class="guide-map"></div>
      <header class="guide-top">
        <a class="icon-btn raised" href="#/visite/${e.id}" aria-label="Détail de la visite">${o("back")}</a>
        <div class="guide-title">
          <div><strong>${p(e.title)}</strong><small></small></div>
          <div class="guide-progress"></div>
        </div>
        <button class="icon-btn raised" data-locate aria-label="Me localiser">${o("locate")}</button>
      </header>
      <aside class="guide-card"></aside>
    </main>`);i.appendChild(c);const l=c.querySelector(".guide-card"),s=K(c.querySelector(".guide-map")).setView([e.pois[0].lat,e.pois[0].lng],16);let u=null,a=null,b=-1;function S(){const n=e.pois[t.index];return t.arrived||!P("demo")&&C(n)}function V(){const n=e.pois[t.index],m=[[n.lat,n.lng]],x=e.legs[t.index-1]||e.legs[0];x&&m.push(...x.path);const v=B();v&&!P("demo")&&R(v,n)<3e3&&m.push([v.lat,v.lng]);const w=Math.min(l.offsetHeight+70,innerHeight*.62);s.fitBounds(L.latLngBounds(m),{paddingTopLeft:[40,120],paddingBottomRight:[40,w],maxZoom:18,animate:!1})}function f(){const n=e.pois[t.index],m=d.typoById[n.typology],x=e.steps.length;c.querySelector(".guide-title small").textContent=`Étape ${t.index+1} sur ${x}`,c.querySelector(".guide-progress").innerHTML=ie(e,t.index),u&&u.remove(),u=U(s,e,{current:t.index});const v=e.legs[t.index-1],w=B(),H=P("demo");let M;if(w&&!H){const D=R(w,n);M=`${O(D)} · ${Math.max(1,Math.round(D/1.2/60))} min à pied`}else v?M=`${E(v.distance)} · ${j(v)} min à pied`:M="Point de départ de la visite";const q=S();l.className=`guide-card ${q?"arrived":""}`,l.innerHTML=`
      <div class="guide-step">
        <img src="${n.cover}" alt="">
        <div>
          <p class="guide-kicker">${q?`${o("check",14)} Vous êtes arrivé`:`Étape ${t.index+1} · ${p(m.label)}`}</p>
          <h2>${p(n.title)}</h2>
          <p class="guide-meta">${q?"Le contenu de cette étape est débloqué.":`${o("walk",14)} ${M}`}</p>
        </div>
      </div>
      <div class="guide-actions">
        ${q?`<a class="btn btn-primary" href="#/poi/${n.id}?src=visit">Découvrir le contenu ${o("arrow",18)}</a>
             <button class="btn btn-link" data-skip>Passer cette étape</button>`:`${H?`<button class="btn btn-primary" data-arrive>${o("pin",18)} Je suis arrivé</button>`:`<p class="guide-hint">${o("pin",16)} Le contenu s’ouvrira à votre arrivée, ou en scannant le QR code du lieu.</p>`}
             <a class="btn btn-soft" href="#/scan">${o("scan",18)} Scanner le QR code</a>`}
      </div>`,l.querySelector("[data-arrive]")?.addEventListener("click",()=>{z(e.id),t=h(e.id),f()}),l.querySelector("[data-skip]")?.addEventListener("click",()=>te(e)),b!==t.index&&(b=t.index,requestAnimationFrame(V))}const y=J(n=>{const m=[n.lat,n.lng];a?a.setLatLng(m):a=L.marker(m,{icon:L.divIcon({className:"me-marker",html:"<span></span>",iconSize:[18,18]}),interactive:!1}).addTo(s),!t.arrived&&!P("demo")&&C(e.pois[t.index])&&(z(e.id),t=h(e.id),navigator.vibrate?.([60,40,60]),G(`Vous êtes arrivé : ${e.pois[t.index].title}`)),f()});I().catch(()=>{});const g=W(()=>f());return c.querySelector("[data-locate]").addEventListener("click",async()=>{try{const n=await I();s.flyTo([n.lat,n.lng],17)}catch{G("Position indisponible. Autorisez la géolocalisation dans votre navigateur.")}}),setTimeout(()=>{s.invalidateSize(),f()},0),()=>{y(),g(),s.remove()}}async function le(i,r){const[{byId:$},d]=await Promise.all([A(),T()]),e=$[r.id],t=Number(r.n),c=e?.liaisons[t];if(!e||!c){location.hash="#/visites";return}const l=await X(c),s=e.pois[t+1],u=e.legs[t];document.body.classList.add("page-story","theme-light","page-liaison");const a=k(`
    <header class="story-bar solid">
      <a class="icon-btn" href="#/visite/${e.id}/guide" aria-label="Retour au guidage">${o("back")}</a>
      <span class="story-bar-title">${p(e.title)} · en chemin<i class="story-progress"></i></span>
    </header>`),b=k('<article class="story"></article>'),S=k(`
    <aside class="visit-bar">
      <img src="${s.cover}" alt="">
      <span><small>Prochaine étape · ${E(u.distance)} · ${j(u)} min</small><strong>${p(s.title)}</strong></span>
      <button class="btn btn-primary" data-next>Reprendre ${o("arrow",16)}</button>
    </aside>`);i.append(a,b,S);const V=ee(b,l,{poi:s,data:d});S.querySelector("[data-next]").addEventListener("click",()=>{const g=h(e.id);g&&g.index===t&&N(e),location.hash=`#/visite/${e.id}/guide`});const f=a.querySelector(".story-progress"),y=()=>{const g=document.documentElement.scrollHeight-innerHeight;f.style.transform=`scaleX(${g>0?scrollY/g:0})`};return addEventListener("scroll",y,{passive:!0}),y(),()=>{removeEventListener("scroll",y),V()}}async function pe(i,r){const{byId:$,visits:d}=await A(),e=$[r.id],t=e&&h(e.id);if(!e||!t){location.hash="#/visites";return}Q()===e.id&&_(),document.body.classList.add("page-visit-end");const c=Math.max(1,Math.round(((t.finishedAt||Date.now())-t.startedAt)/6e4)),l=e.steps.filter(a=>t.seen.includes(a)).length,s=d.find(a=>a.id!==e.id&&!h(a.id)?.finishedAt)||d.find(a=>a.id!==e.id),u=k(`
    <main class="visit-end">
      <div class="end-badge">${o("check",34)}</div>
      <p class="visit-author">Visite terminée</p>
      <h1>${p(e.title)}</h1>
      <p class="visit-sub">Merci d’avoir suivi ce parcours dans Saint-Pierre.</p>
      <div class="visit-stats">
        <span>${o("pin",18)}<b>${l}/${e.steps.length}</b><small>étapes vues</small></span>
        <span>${o("walk",18)}<b>${E(Z(e,t))}</b><small>parcourus</small></span>
        <span>${o("clock",18)}<b>${F(c)}</b><small>de visite</small></span>
      </div>
      <ol class="end-steps">${e.pois.map(a=>`
        <li class="${t.seen.includes(a.id)?"seen":""}">
          <img src="${a.cover}" alt=""><span>${p(a.title)}</span>${t.seen.includes(a.id)?o("check",16):""}
        </li>`).join("")}</ol>
      ${s?`
        <h2 class="end-next-title">Et ensuite ?</h2>
        <a class="visit-card compact" href="#/visite/${s.id}">
          <div class="visit-cover"><img src="${s.cover}" alt=""></div>
          <div class="visit-body"><h2>${p(s.title)}</h2><p class="visit-sub">${p(s.subtitle)}</p>
          <p class="visit-meta">${o("clock",15)} ${F(s.durationMin)}<i></i>${o("pin",15)} ${s.steps.length} étapes</p></div>
        </a>`:""}
      <div class="visit-actions">
        <a class="btn btn-soft" href="#/visite/${e.id}">Revoir le parcours</a>
        <a class="btn btn-link" href="#/visites">Toutes les visites</a>
      </div>
    </main>`);i.appendChild(u)}export{te as continueAfterStep,de as mountGuide,le as mountLiaison,pe as mountVisitEnd};
