import{loadData as A,getSetting as V,getPosition as B,onPosition as J,startWatching as I,distance as R,formatDistance as O,isOnSite as C,onSettingChange as W}from"../store.js";import{loadVisits as E,loadLiaison as X,getProgress as b,startVisit as Y,markArrived as z,advance as N,walkMinutes as j,formatDuration as F,walkedDistance as Z,getActiveVisitId as Q,stopVisit as _}from"../visits.js";import{html as w,icon as n,esc as d,toast as G}from"../ui.js";import{createBaseMap as K}from"../basemap.js";import{drawVisit as U}from"../visit-map.js";import{renderStory as tt}from"../story/engine.js";const H=i=>i<1e3?`${Math.round(i/10)*10} m`:`${(i/1e3).toFixed(1).replace(".",",")} km`;function et(i){const o=b(i.id);o&&(o.index<i.steps.length-1&&i.liaisons[o.index]?location.hash=`#/visite/${i.id}/liaison/${o.index}`:location.hash=N(i)?`#/visite/${i.id}/guide`:`#/visite/${i.id}/fin`)}function it(i,o){return i.steps.map((y,m)=>`<i class="${m<o?"done":m===o?"current":""}"></i>`).join("")}async function lt(i,o){const[{byId:y},m]=await Promise.all([E(),A()]),t=y[o.id];if(!t){location.hash="#/visites";return}let e=b(t.id);(!e||e.finishedAt||Q()!==t.id)&&(e=Y(t.id)),document.body.classList.add("page-guide");const l=w(`
    <main class="guide">
      <div class="guide-map"></div>
      <header class="guide-top">
        <a class="icon-btn raised" href="#/visite/${t.id}" aria-label="Détail de la visite">${n("back")}</a>
        <div class="guide-title">
          <div><strong>${d(t.title)}</strong><small></small></div>
          <div class="guide-progress"></div>
        </div>
        <button class="icon-btn raised" data-locate aria-label="Me localiser">${n("locate")}</button>
      </header>
      <aside class="guide-card"></aside>
    </main>`);i.appendChild(l);const p=l.querySelector(".guide-card"),c=K(l.querySelector(".guide-map")).setView([t.pois[0].lat,t.pois[0].lng],16);let r=null,u=null,v=-1;function x(){const a=t.pois[e.index];return e.arrived||!V("demo")&&C(a)}function s(){const a=t.pois[e.index],h=[[a.lat,a.lng]],S=t.legs[e.index-1]||t.legs[0];S&&h.push(...S.path);const $=B();$&&!V("demo")&&R($,a)<3e3&&h.push([$.lat,$.lng]);const M=Math.min(p.offsetHeight+70,innerHeight*.62);c.fitBounds(L.latLngBounds(h),{paddingTopLeft:[40,120],paddingBottomRight:[40,M],maxZoom:18,animate:!1})}function g(){const a=t.pois[e.index],h=m.typoById[a.typology],S=t.steps.length;l.querySelector(".guide-title small").textContent=`Étape ${e.index+1} sur ${S}`,l.querySelector(".guide-progress").innerHTML=it(t,e.index),r&&r.remove(),r=U(c,t,{current:e.index});const $=t.legs[e.index-1],M=B(),D=V("demo");let q;if(M&&!D){const T=R(M,a);q=`${O(T)} · ${Math.max(1,Math.round(T/1.2/60))} min à pied`}else $?q=`${H($.distance)} · ${j($)} min à pied`:q="Point de départ de la visite";const P=x();p.className=`guide-card ${P?"arrived":""}`,p.innerHTML=`
      <div class="guide-step">
        <img src="${a.cover}" alt="">
        <div>
          <p class="guide-kicker">${P?`${n("check",14)} Vous êtes arrivé`:`Étape ${e.index+1} · ${d(h.label)}`}</p>
          <h2>${d(a.title)}</h2>
          <p class="guide-meta">${P?"Le contenu de cette étape est débloqué.":`${n("walk",14)} ${q}`}</p>
        </div>
      </div>
      <div class="guide-actions">
        ${P?`<a class="btn btn-primary" href="#/poi/${a.id}?src=visit">Découvrir le contenu ${n("arrow",18)}</a>
             <button class="btn btn-link" data-skip>Passer cette étape</button>`:`${D?`<button class="btn btn-primary" data-arrive>${n("pin",18)} Je suis arrivé</button>`:`<p class="guide-hint">${n("pin",16)} Le contenu s’ouvrira à votre arrivée, ou en scannant le QR code du lieu.</p>`}
             <a class="btn btn-soft" href="#/scan">${n("scan",18)} Scanner le QR code</a>`}
      </div>`,p.querySelector("[data-arrive]")?.addEventListener("click",()=>{z(t.id),e=b(t.id),g()}),p.querySelector("[data-skip]")?.addEventListener("click",()=>et(t)),v!==e.index&&(v=e.index,requestAnimationFrame(s))}const k=J(a=>{const h=[a.lat,a.lng];u?u.setLatLng(h):u=L.marker(h,{icon:L.divIcon({className:"me-marker",html:"<span></span>",iconSize:[18,18]}),interactive:!1}).addTo(c),!e.arrived&&!V("demo")&&C(t.pois[e.index])&&(z(t.id),e=b(t.id),navigator.vibrate?.([60,40,60]),G(`Vous êtes arrivé : ${t.pois[e.index].title}`)),g()});I().catch(()=>{});const f=W(()=>g());return l.querySelector("[data-locate]").addEventListener("click",async()=>{try{const a=await I();c.flyTo([a.lat,a.lng],17)}catch{G("Position indisponible. Autorisez la géolocalisation dans votre navigateur.")}}),setTimeout(()=>{c.invalidateSize(),g()},0),()=>{k(),f(),c.remove()}}async function dt(i,o){const[{byId:y},m]=await Promise.all([E(),A()]),t=y[o.id],e=Number(o.n),l=t?.liaisons[e];if(!t||!l){location.hash="#/visites";return}const p=await X(l),c=t.pois[e+1],r=t.legs[e];document.body.classList.add("page-story","theme-light","page-liaison");const u=w(`
    <header class="story-bar solid">
      <a class="icon-btn" href="#/visite/${t.id}/guide" aria-label="Retour au guidage">${n("back")}</a>
      <span class="story-bar-title">${d(t.title)} · en chemin<i class="story-progress"></i></span>
    </header>`),v=w('<article class="story"></article>'),x=w(`
    <aside class="visit-bar">
      <img src="${c.cover}" alt="">
      <span><small>Prochaine étape · ${H(r.distance)} · ${j(r)} min</small><strong>${d(c.title)}</strong></span>
      <button class="btn btn-primary" data-next>Reprendre ${n("arrow",16)}</button>
    </aside>`);i.append(u,v,x);const s=tt(v,p,{poi:c,data:m});x.querySelector("[data-next]").addEventListener("click",()=>{const f=b(t.id);f&&f.index===e&&N(t),location.hash=`#/visite/${t.id}/guide`});const g=u.querySelector(".story-progress"),k=()=>{const f=document.documentElement.scrollHeight-innerHeight;g.style.transform=`scaleX(${f>0?scrollY/f:0})`};return addEventListener("scroll",k,{passive:!0}),k(),()=>{removeEventListener("scroll",k),s()}}async function pt(i,o){const{byId:y,visits:m}=await E(),t=y[o.id],e=t&&b(t.id);if(!t||!e){location.hash="#/visites";return}Q()===t.id&&_(),document.body.classList.add("page-visit-end");const l=Math.max(1,Math.round(((e.finishedAt||Date.now())-e.startedAt)/6e4)),p=t.steps.filter(s=>e.seen.includes(s)).length,c=m.filter(s=>s.id!==t.id).sort((s,g)=>(g.city===t.city)-(s.city===t.city)),r=c.find(s=>!b(s.id)?.finishedAt)||c[0],u=await A(),v=(u.cities||[u.city]).find(s=>s.id===t.city),x=w(`
    <main class="visit-end">
      <div class="end-badge">${n("check",34)}</div>
      <p class="visit-author">Visite terminée</p>
      <h1>${d(t.title)}</h1>
      <p class="visit-sub">Merci d’avoir suivi ce parcours${v?` à ${d(v.name)}`:""}.</p>
      <div class="visit-stats">
        <span>${n("pin",18)}<b>${p}/${t.steps.length}</b><small>étapes vues</small></span>
        <span>${n("walk",18)}<b>${H(Z(t,e))}</b><small>parcourus</small></span>
        <span>${n("clock",18)}<b>${F(l)}</b><small>de visite</small></span>
      </div>
      <ol class="end-steps">${t.pois.map(s=>`
        <li class="${e.seen.includes(s.id)?"seen":""}">
          <img src="${s.cover}" alt=""><span>${d(s.title)}</span>${e.seen.includes(s.id)?n("check",16):""}
        </li>`).join("")}</ol>
      ${r?`
        <h2 class="end-next-title">Et ensuite ?</h2>
        <a class="visit-card compact" href="#/visite/${r.id}">
          <div class="visit-cover"><img src="${r.cover}" alt=""></div>
          <div class="visit-body"><h2>${d(r.title)}</h2><p class="visit-sub">${d(r.subtitle)}</p>
          <p class="visit-meta">${n("clock",15)} ${F(r.durationMin)}<i></i>${n("pin",15)} ${r.steps.length} étapes</p></div>
        </a>`:""}
      <div class="visit-actions">
        <a class="btn btn-soft" href="#/visite/${t.id}">Revoir le parcours</a>
        <a class="btn btn-link" href="#/visites">Toutes les visites</a>
      </div>
    </main>`);i.appendChild(x)}export{et as continueAfterStep,lt as mountGuide,dt as mountLiaison,pt as mountVisitEnd};
