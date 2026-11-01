import{loadData as k,loadStory as C,isOnSite as y,startWatching as f,getPosition as h,distance as w,formatDistance as q,setSetting as x,getSetting as $}from"../store.js";import{html as u,icon as l,esc as p,toast as E}from"../ui.js";import{renderStory as I}from"../story/engine.js";import{mountNarration as V}from"../story/narration.js";import{loadVisits as P,visitsForPoi as R,getActiveVisitId as g,getProgress as H,markSeen as A}from"../visits.js";import{continueAfterStep as B}from"./guide.js";async function G(a,t){const n=await k(),e=n.poiById[t.id];if(!e){a.appendChild(u(`<main class="gate"><div class="gate-card"><h1>Lieu introuvable</h1>
      <p>Ce QR code ne correspond à aucun lieu.</p><a class="btn btn-primary" href="#/carte">Voir la carte</a></div></main>`));return}let s=null;const i=["scan","qr","visit"].includes(t.src)||sessionStorage.getItem(`grenouille.scanned.${e.id}`),o=t.src==="map"&&e.contentFromMap,r=async()=>{if(a.innerHTML="",s?.(),s=null,!$("demo")&&!i&&!o)return S(a,e,n,"scan",r);if(!y(e)){if(!$("demo")&&!h()){a.appendChild(u('<main class="gate"><div class="gate-card"><div class="spinner"></div><p>Vérification de votre position…</p></div></main>'));try{await f()}catch{}a.innerHTML=""}if(!y(e))return S(a,e,n,"far",r)}const[c,d]=await Promise.all([C(e),R(e.id)]),m=t.src==="visit"&&g()?`#/visite/${g()}/guide`:`#/carte?poi=${e.id}`;s=M(a,e,n,c,d,m),await D(a,e)};return await r(),()=>s?.()}function S(a,t,n,e,s){document.body.classList.add("page-gate");const i=h(),o=i?w(i,t):null,r=e==="scan"?"Ce contenu s’ouvre en scannant le QR code posé sur le lieu.":o!=null?`Ce contenu se débloque sur place. Vous êtes à <strong>${q(o)}</strong> du lieu.`:"Ce contenu se débloque sur place. Nous n’avons pas pu déterminer votre position.",c=u(`
    <main class="gate">
      <a class="icon-btn raised gate-back" href="#/carte?poi=${t.id}" aria-label="Retour">${l("back")}</a>
      <div class="gate-card">
        <div class="gate-cover"><img src="${t.cover}" alt=""><span class="gate-ic">${l(e==="scan"?"qr":"lock",22)}</span></div>
        <span class="tag" style="--c:${n.typoById[t.typology].color}">${p(n.typoById[t.typology].label)}</span>
        <h1>${p(t.title)}</h1>
        <p>${r}</p>
        <div class="gate-actions">
          ${e==="scan"?`<a class="btn btn-primary" href="#/scan">${l("scan",18)} Scanner le QR code</a>`:`<button class="btn btn-primary" data-retry>${l("locate",18)} Vérifier ma position</button>`}
          <button class="btn btn-soft" data-demo>Activer le mode démo</button>
          <a class="btn btn-link" href="#/carte?poi=${t.id}">Voir le lieu sur la carte</a>
        </div>
        <p class="gate-note">Le mode démo simule votre présence sur place. Il sert aux présentations hors de Saint-Pierre.</p>
      </div>
    </main>`);c.querySelector("[data-demo]").addEventListener("click",()=>{x("demo",!0),s()}),c.querySelector("[data-retry]")?.addEventListener("click",async()=>{try{await f()}catch{}s()}),a.appendChild(c)}function M(a,t,n,e,s,i){document.body.classList.remove("page-gate"),document.body.classList.add("page-story",`theme-${e.theme||"light"}`);const o=u(`
    <header class="story-bar">
      <a class="icon-btn" href="${i}" aria-label="Retour">${l("back")}</a>
      <span class="story-bar-title">${p(t.title)}<i class="story-progress"></i></span>
      <button type="button" class="icon-btn" data-listen aria-label="Écouter le récit">${l("play",16)}</button>
    </header>`),r=u('<article class="story"></article>');a.append(o,r);const c=I(r,e,{poi:t,data:n,visits:s}),d=o.querySelector("[data-listen]"),m=t.audio?V(r,t.audio):null;t.audio?d.style.visibility="hidden":d.addEventListener("click",()=>E("Le récit audio arrive bientôt."));const L=o.querySelector(".story-progress"),b=()=>{const v=document.documentElement.scrollHeight-innerHeight;L.style.transform=`scaleX(${v>0?scrollY/v:0})`,o.classList.toggle("solid",scrollY>innerHeight*.6)};return addEventListener("scroll",b,{passive:!0}),b(),()=>{removeEventListener("scroll",b),m?.(),c()}}async function D(a,t){const n=g();if(!n)return;const{byId:e}=await P(),s=e[n],i=H(n);if(!s||!i||i.finishedAt)return;const o=s.steps.indexOf(t.id);if(o<0)return;const r=o===i.index;r&&A(s.id,t.id),document.body.classList.add("has-visit-bar");const c=i.index===s.steps.length-1,d=u(`
    <aside class="visit-bar">
      <span class="visit-bar-ic">${l("route",20)}</span>
      <span><small>${p(s.title)} · étape ${i.index+1}/${s.steps.length}</small>
        <strong>${r?c?"Dernière étape de la visite":`Ensuite : ${p(s.pois[i.index+1].title)}`:"Ce lieu fait partie de votre visite"}</strong></span>
      ${r?`<button class="btn btn-primary" data-continue>${c?"Terminer":"Continuer"} ${l("arrow",16)}</button>`:`<a class="btn btn-soft" href="#/visite/${s.id}/guide">Reprendre</a>`}
    </aside>`);d.querySelector("[data-continue]")?.addEventListener("click",()=>B(s)),a.appendChild(d)}export{G as mountPoi};
