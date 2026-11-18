import{loadData as M}from"../store.js";import{loadVisits as x,loadLiaison as E,formatDuration as T,walkMinutes as H,getProgress as V,getActiveVisitId as A,startVisit as B,isDownloaded as S,downloadVisit as P}from"../visits.js";import{html as q,icon as a,esc as l,toast as y}from"../ui.js";import{createBaseMap as j}from"../basemap.js";import{drawVisit as z}from"../visit-map.js";const w=i=>i<1e3?`${Math.round(i/10)*10} m`:`${(i/1e3).toFixed(1).replace(".",",")} km`,D=[{id:"all",label:"Toutes",test:()=>!0},{id:"short",label:"Moins de 30 min",test:i=>i.durationMin<30},{id:"mid",label:"30 min à 1 h",test:i=>i.durationMin>=30&&i.durationMin<=60},{id:"long",label:"Plus d’une heure",test:i=>i.durationMin>60}];function R(i){const r=V(i.id);return r?r.finishedAt?{text:"Terminée",ratio:1}:{text:`Étape ${r.index+1} sur ${i.steps.length}`,ratio:r.index/i.steps.length}:null}async function W(i){const[{visits:r},h]=await Promise.all([x(),M()]),g=Object.fromEntries((h.cities||[h.city]).map(e=>[e.id,e.name]));document.body.classList.add("page-visits");let s="all";const p=q(`
    <main class="visits">
      <header class="page-head">
        <h1>Visites</h1>
        <p>Des parcours conçus avec les villes et leurs musées, à suivre à pied.</p>
      </header>
      <div class="chips visits-filters" role="group" aria-label="Durée">
        ${D.map(e=>`<button class="chip ${e.id===s?"on":""}" data-f="${e.id}">${e.label}</button>`).join("")}
      </div>
      <ol class="visit-list"></ol>
    </main>`);i.appendChild(p);const c=p.querySelector(".visit-list"),u=A();function b(){const e=D.find(t=>t.id===s).test,o=r.filter(e);c.innerHTML=o.length?o.map(t=>{const n=R(t),v=[t.id===u&&n&&n.ratio<1?'<span class="tag live">En cours</span>':"",t.tags.includes("enfant")?'<span class="tag state">Adapté aux enfants</span>':"",t.liaisons.some(Boolean)?'<span class="tag state">Récit entre les étapes</span>':"",S(t.id)?`<span class="tag state">${a("check",12)} Hors ligne</span>`:""].join("");return`<li><a class="visit-card" href="#/visite/${t.id}">
        <div class="visit-cover"><img src="${t.cover}" alt="" loading="lazy"></div>
        <div class="visit-body">
          ${v?`<div class="visit-tags">${v}</div>`:""}
          <h2>${l(t.title)}</h2>
          <p class="visit-sub">${t.city&&g[t.city]?`${l(g[t.city])} · `:""}${l(t.subtitle)}</p>
          <p class="visit-meta">${a("clock",15)} ${T(t.durationMin)}<i></i>${a("walk",15)} ${w(t.distance)}<i></i>${a("pin",15)} ${t.steps.length} étapes</p>
          ${n&&n.ratio<1?`<div class="visit-progress"><b style="width:${Math.max(6,n.ratio*100)}%"></b></div>`:""}
        </div>
      </a></li>`}).join(""):'<li class="result-empty">Aucune visite de cette durée.</li>'}p.querySelector(".visits-filters").addEventListener("click",e=>{const o=e.target.closest("[data-f]");o&&(s=o.dataset.f,p.querySelectorAll(".visits-filters .chip").forEach(t=>t.classList.toggle("on",t===o)),b())}),b()}async function Z(i,r){const[{byId:h},g]=await Promise.all([x(),M()]),s=h[r.id];if(!s){location.hash="#/visites";return}document.body.classList.add("page-visit");const p=await Promise.all(s.liaisons.map(E)),c=q(`
    <main class="visit-detail">
      <a class="icon-btn raised visit-back" href="#/visites" aria-label="Toutes les visites">${a("back")}</a>
      <figure class="visit-hero"><img src="${s.cover}" alt=""></figure>
      <section class="visit-intro">
        <p class="visit-author">Par ${l(s.author)}</p>
        <h1>${l(s.title)}</h1>
        <p class="visit-sub">${l(s.subtitle)}</p>
        <div class="visit-stats">
          <span>${a("clock",18)}<b>${T(s.durationMin)}</b><small>durée</small></span>
          <span>${a("walk",18)}<b>${w(s.distance)}</b><small>à pied</small></span>
          <span>${a("pin",18)}<b>${s.steps.length}</b><small>étapes</small></span>
        </div>
        <p class="visit-excerpt">${l(s.excerpt)}</p>
      </section>
      <div class="visit-map" aria-label="Tracé de la visite"></div>
      <section class="visit-steps">
        <h2>Les étapes</h2>
        <ol class="vstep-list"></ol>
      </section>
      <div class="visit-actions">
        <button class="btn btn-primary btn-xl" data-start></button>
        <button class="btn btn-soft" data-download></button>
        <button class="btn btn-link" data-restart hidden>Recommencer depuis le début</button>
      </div>
    </main>`);i.appendChild(c),c.querySelector(".vstep-list").innerHTML=s.pois.map((d,m)=>{const $=g.typoById[d.typology],f=s.legs[m],k=p[m];return`<li class="vstep">
        <span class="vstep-num">${m+1}</span>
        <img src="${d.cover}" alt="" loading="lazy">
        <span class="vstep-text"><span class="tag" style="--c:${$.color}">${l($.label)}</span><strong>${l(d.title)}</strong></span>
      </li>
      ${f?`<li class="vstep-leg">${a("walk",14)} ${w(f.distance)} · ${H(f)} min${k?` <span class="vstep-liaison">· Récit : ${l(k.title)}</span>`:""}</li>`:""}`}).join("");const u=j(c.querySelector(".visit-map"),{dragging:!L.Browser.mobile,scrollWheelZoom:!1}),b=z(u,s);setTimeout(()=>{u.invalidateSize(),u.fitBounds(b.getBounds(),{padding:[30,30]})},0);const e=c.querySelector("[data-start]"),o=c.querySelector("[data-restart]"),t=V(s.id);t&&!t.finishedAt?(e.innerHTML=`${a("arrow",18)} Reprendre · étape ${t.index+1}/${s.steps.length}`,o.hidden=!1):e.innerHTML=`${a("flag",18)} Commencer la visite`,e.addEventListener("click",()=>{B(s.id),location.hash=`#/visite/${s.id}/guide`}),o.addEventListener("click",()=>{B(s.id,{restart:!0}),location.hash=`#/visite/${s.id}/guide`});const n=c.querySelector("[data-download]"),v=()=>{n.innerHTML=S(s.id)?`${a("check",18)} Disponible hors ligne`:`${a("download",18)} Télécharger pour le hors-ligne`};return v(),n.addEventListener("click",async()=>{if(!("caches"in window))return y("Le hors-ligne n’est pas disponible dans ce navigateur.");n.disabled=!0;try{const d=await P(s,(m,$)=>{n.innerHTML=`<span class="dl-bar"><b style="width:${m/$*100}%"></b></span> ${m}/${$}`});y(`Visite téléchargée : ${d} fichiers disponibles sans réseau.`)}catch(d){console.error(d),y("Le téléchargement a échoué. Vérifiez votre connexion.")}n.disabled=!1,v()}),()=>u.remove()}export{Z as mountVisit,W as mountVisits};
