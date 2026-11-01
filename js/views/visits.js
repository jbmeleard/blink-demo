import{loadData as D}from"../store.js";import{loadVisits as M,loadLiaison as H,formatDuration as x,walkMinutes as A,getProgress as T,getActiveVisitId as E,startVisit as V,isDownloaded as S,downloadVisit as P}from"../visits.js";import{html as q,icon as e,esc as l,toast as f}from"../ui.js";import{createBaseMap as j}from"../basemap.js";import{drawVisit as z}from"../visit-map.js";const y=i=>i<1e3?`${Math.round(i/10)*10} m`:`${(i/1e3).toFixed(1).replace(".",",")} km`,B=[{id:"all",label:"Toutes",test:()=>!0},{id:"short",label:"Moins de 30 min",test:i=>i.durationMin<30},{id:"mid",label:"30 min à 1 h",test:i=>i.durationMin>=30&&i.durationMin<=60},{id:"long",label:"Plus d’une heure",test:i=>i.durationMin>60}];function R(i){const o=T(i.id);return o?o.finishedAt?{text:"Terminée",ratio:1}:{text:`Étape ${o.index+1} sur ${i.steps.length}`,ratio:o.index/i.steps.length}:null}async function G(i){const{visits:o}=await M();document.body.classList.add("page-visits");let h="all";const p=q(`
    <main class="visits">
      <header class="page-head">
        <h1>Visites</h1>
        <p>Des parcours conçus par la Ville de Saint-Pierre, à suivre à pied.</p>
      </header>
      <div class="chips visits-filters" role="group" aria-label="Durée">
        ${B.map(a=>`<button class="chip ${a.id===h?"on":""}" data-f="${a.id}">${a.label}</button>`).join("")}
      </div>
      <ol class="visit-list"></ol>
    </main>`);i.appendChild(p);const s=p.querySelector(".visit-list"),$=E();function n(){const a=B.find(t=>t.id===h).test,r=o.filter(a);s.innerHTML=r.length?r.map(t=>{const c=R(t),u=[t.id===$&&c&&c.ratio<1?'<span class="tag live">En cours</span>':"",t.tags.includes("enfant")?'<span class="tag state">Adapté aux enfants</span>':"",t.liaisons.length?'<span class="tag state">Récit entre les étapes</span>':"",S(t.id)?`<span class="tag state">${e("check",12)} Hors ligne</span>`:""].join("");return`<li><a class="visit-card" href="#/visite/${t.id}">
        <div class="visit-cover"><img src="${t.cover}" alt="" loading="lazy"></div>
        <div class="visit-body">
          ${u?`<div class="visit-tags">${u}</div>`:""}
          <h2>${l(t.title)}</h2>
          <p class="visit-sub">${l(t.subtitle)}</p>
          <p class="visit-meta">${e("clock",15)} ${x(t.durationMin)}<i></i>${e("walk",15)} ${y(t.distance)}<i></i>${e("pin",15)} ${t.steps.length} étapes</p>
          ${c&&c.ratio<1?`<div class="visit-progress"><b style="width:${Math.max(6,c.ratio*100)}%"></b></div>`:""}
        </div>
      </a></li>`}).join(""):'<li class="result-empty">Aucune visite de cette durée.</li>'}p.querySelector(".visits-filters").addEventListener("click",a=>{const r=a.target.closest("[data-f]");r&&(h=r.dataset.f,p.querySelectorAll(".visits-filters .chip").forEach(t=>t.classList.toggle("on",t===r)),n())}),n()}async function J(i,o){const[{byId:h},p]=await Promise.all([M(),D()]),s=h[o.id];if(!s){location.hash="#/visites";return}document.body.classList.add("page-visit");const $=await Promise.all(s.liaisons.map(H)),n=q(`
    <main class="visit-detail">
      <a class="icon-btn raised visit-back" href="#/visites" aria-label="Toutes les visites">${e("back")}</a>
      <figure class="visit-hero"><img src="${s.cover}" alt=""></figure>
      <section class="visit-intro">
        <p class="visit-author">Par ${l(s.author)}</p>
        <h1>${l(s.title)}</h1>
        <p class="visit-sub">${l(s.subtitle)}</p>
        <div class="visit-stats">
          <span>${e("clock",18)}<b>${x(s.durationMin)}</b><small>durée</small></span>
          <span>${e("walk",18)}<b>${y(s.distance)}</b><small>à pied</small></span>
          <span>${e("pin",18)}<b>${s.steps.length}</b><small>étapes</small></span>
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
    </main>`);i.appendChild(n),n.querySelector(".vstep-list").innerHTML=s.pois.map((d,v)=>{const g=p.typoById[d.typology],b=s.legs[v],k=$[v];return`<li class="vstep">
        <span class="vstep-num">${v+1}</span>
        <img src="${d.cover}" alt="" loading="lazy">
        <span class="vstep-text"><span class="tag" style="--c:${g.color}">${l(g.label)}</span><strong>${l(d.title)}</strong></span>
      </li>
      ${b?`<li class="vstep-leg">${e("walk",14)} ${y(b.distance)} · ${A(b)} min${k?` <span class="vstep-liaison">· Récit : ${l(k.title)}</span>`:""}</li>`:""}`}).join("");const a=j(n.querySelector(".visit-map"),{dragging:!L.Browser.mobile,scrollWheelZoom:!1}),r=z(a,s);setTimeout(()=>{a.invalidateSize(),a.fitBounds(r.getBounds(),{padding:[30,30]})},0);const t=n.querySelector("[data-start]"),c=n.querySelector("[data-restart]"),u=T(s.id);u&&!u.finishedAt?(t.innerHTML=`${e("arrow",18)} Reprendre · étape ${u.index+1}/${s.steps.length}`,c.hidden=!1):t.innerHTML=`${e("flag",18)} Commencer la visite`,t.addEventListener("click",()=>{V(s.id),location.hash=`#/visite/${s.id}/guide`}),c.addEventListener("click",()=>{V(s.id,{restart:!0}),location.hash=`#/visite/${s.id}/guide`});const m=n.querySelector("[data-download]"),w=()=>{m.innerHTML=S(s.id)?`${e("check",18)} Disponible hors ligne`:`${e("download",18)} Télécharger pour le hors-ligne`};return w(),m.addEventListener("click",async()=>{if(!("caches"in window))return f("Le hors-ligne n’est pas disponible dans ce navigateur.");m.disabled=!0;try{const d=await P(s,(v,g)=>{m.innerHTML=`<span class="dl-bar"><b style="width:${v/g*100}%"></b></span> ${v}/${g}`});f(`Visite téléchargée : ${d} fichiers disponibles sans réseau.`)}catch(d){console.error(d),f("Le téléchargement a échoué. Vérifiez votre connexion.")}m.disabled=!1,w()}),()=>a.remove()}export{J as mountVisit,G as mountVisits};
