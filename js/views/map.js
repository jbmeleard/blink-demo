import{loadData as ae,getPosition as O,onPosition as ie,startWatching as Q,distance as H,formatDistance as Y,isOnSite as le,onSettingChange as ne,getSetting as T,setSetting as _}from"../store.js";import{html as K,icon as d,esc as p,toast as q}from"../ui.js";import{createBaseMap as oe}from"../basemap.js";const j=E=>String(E||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();async function pe(E,x){const c=await ae();document.body.classList.add("page-map");const s={typos:new Set,kid:!1,ruins:!1,inView:!1,query:"",selected:null,mode:"map"},y=K(`
    <main class="mapview">
      <div id="map" class="map" aria-label="Carte des points d’intérêt"></div>

      <div class="map-top">
        <div class="searchbar">
          <a class="icon-btn" href="#/" aria-label="Accueil">${d("back")}</a>
          <label class="search-field">
            ${d("search",18)}
            <input type="search" placeholder="Ville, lieu, thème…" aria-label="Rechercher" autocomplete="off">
          </label>
          <button class="icon-btn filter-btn" aria-label="Filtres">${d("filter")}<span class="dot" hidden></span></button>
        </div>
        <div class="chips" role="group" aria-label="Typologies"></div>
        <div class="search-results" hidden></div>
      </div>

      <button type="button" class="demo-toggle"></button>

      <div class="map-fabs">
        <button class="fab" data-locate aria-label="Me localiser">${d("locate")}</button>
        <button class="fab" data-mode aria-label="Afficher la liste">${d("list")}</button>
      </div>


      <section class="listview" hidden aria-label="Liste des lieux">
        <header class="list-head"><h2>Lieux</h2><span class="list-sort"></span></header>
        <ol class="list"></ol>
      </section>

      <aside class="preview" aria-live="polite"></aside>
    </main>`);E.appendChild(y);const r=e=>y.querySelector(e),m=r(".search-field input"),f=r(".search-results"),g=r(".preview"),W=r(".listview"),o=oe(r("#map")).setView(c.city.center,c.city.zoom),h=c.cities||[c.city],M=e=>c.pois.filter(t=>(t.city||h[0].id)===e.id),G=e=>h.reduce((t,i)=>{const a=H(e,{lat:i.center[0],lng:i.center[1]});return!t||a<t.d?{city:i,d:a}:t},null),b=new Map;for(const e of c.pois){const t=c.typoById[e.typology],i=L.marker([e.lat,e.lng],{icon:L.divIcon({className:"poi-marker",html:`<span class="pin" style="--c:${t.color}"><span>${e.id%100}</span></span><span class="pin-label">${p(e.title)}</span>`,iconSize:[26,38],iconAnchor:[13,38]}),keyboard:!0,title:e.title}).addTo(o);i.on("click",()=>u(e.id,{pan:!1})),b.set(e.id,i)}const J=11,B=L.latLngBounds([[42.2,-5.2],[51.2,8.4]]),z=e=>{const t=M(e).map(i=>[i.lat,i.lng]);t.length>1?o.flyToBounds(L.latLngBounds(t),{padding:[60,60],maxZoom:17}):o.flyTo(e.center,e.zoom||15)},U=(e=!0)=>e?o.flyToBounds(B):o.fitBounds(B,{animate:!1});for(const e of h){const t=M(e).length;L.marker(e.center,{icon:L.divIcon({className:"city-marker",html:`<span class="city-dot"></span><span class="city-label"><strong>${p(e.name)}</strong><small>${t} lieu${t>1?"x":""}</small></span>`,iconSize:[14,14],iconAnchor:[7,7]}),keyboard:!0,title:e.name}).addTo(o).on("click",()=>z(e))}const F=h.filter(e=>!B.contains(e.center));F.length&&(y.insertAdjacentHTML("beforeend",`<nav class="map-elsewhere" aria-label="Outre-mer">${F.map((e,t)=>`
      <button type="button" data-city="${t}">${d("pin",16)}<span><strong>${p(e.name)}</strong><small>${p(e.region||"")}</small></span></button>`).join("")}</nav>`),r(".map-elsewhere").addEventListener("click",e=>{const t=e.target.closest("[data-city]");t&&z(F[+t.dataset.city])})),U(!1);const P=()=>{r("#map").classList.toggle("show-labels",o.getZoom()>=17),y.classList.toggle("zoomed-out",o.getZoom()<J)};o.on("zoomend",P),P(),o.on("click",()=>u(null)),o.on("moveend",()=>{(s.inView||s.mode==="list")&&w()});let I=null,N=null;const X=ie(e=>{const t=[e.lat,e.lng];I?(I.setLatLng(t),N.setLatLng(t).setRadius(e.accuracy)):(N=L.circle(t,{radius:e.accuracy,className:"me-accuracy",interactive:!1}).addTo(o),I=L.marker(t,{icon:L.divIcon({className:"me-marker",html:"<span></span>",iconSize:[18,18]}),interactive:!1}).addTo(o)),s.selected&&k(),s.mode==="list"&&w()});Q().catch(()=>{}),r("[data-locate]").addEventListener("click",async()=>{try{const e=await Q(),t=G(e);t.d>2e4&&q(`Vous êtes loin des lieux BLINK (le plus proche : ${t.city.name}). Activez le mode démo pour explorer les contenus.`),o.flyTo([e.lat,e.lng],17)}catch{q("Position indisponible. Autorisez la géolocalisation dans votre navigateur.")}});const v=r(".chips");v.innerHTML=c.typologies.map(e=>`<button class="chip" data-typo="${e.id}" style="--c:${e.color}">${p(e.label)}</button>`).join(""),v.addEventListener("click",e=>{const t=e.target.closest("[data-typo]");if(!t)return;const i=t.dataset.typo;s.typos.has(i)?s.typos.delete(i):s.typos.add(i),t.classList.toggle("on",s.typos.has(i)),$()}),r(".filter-btn").addEventListener("click",ee);function V(e){return!(s.typos.size&&!s.typos.has(e.typology)||s.kid&&!e.tags.includes("enfant")||s.ruins&&!e.tags.includes("1902"))}function C(){let e=c.pois.filter(V);if(s.inView){const t=o.getBounds();e=e.filter(i=>t.contains([i.lat,i.lng]))}return e}function $(){for(const e of c.pois){const t=b.get(e.id).getElement();t&&t.classList.toggle("dimmed",!V(e))}r(".filter-btn .dot").hidden=!(s.kid||s.ruins||s.inView),s.selected&&!V(c.poiById[s.selected])&&u(null),w()}function ee(){const e=K(`
      <div class="sheet-backdrop">
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="filters-title">
          <div class="sheet-grip"></div>
          <div class="sheet-head"><h2 id="filters-title">Filtres</h2><button class="icon-btn" data-close aria-label="Fermer">${d("close")}</button></div>
          <h3 class="sheet-sub">Typologie</h3>
          <div class="chips wrap">${c.typologies.map(a=>`<button class="chip ${s.typos.has(a.id)?"on":""}" data-typo="${a.id}" style="--c:${a.color}">${p(a.label)}</button>`).join("")}</div>
          <h3 class="sheet-sub">Affiner</h3>
          <label class="switch-row"><span><strong>Adapté aux enfants</strong></span><input type="checkbox" class="switch" data-k="kid" ${s.kid?"checked":""}></label>
          <label class="switch-row"><span><strong>Vestiges de 1902</strong><small>Lieux marqués par l’éruption de la montagne Pelée.</small></span><input type="checkbox" class="switch" data-k="ruins" ${s.ruins?"checked":""}></label>
          <label class="switch-row"><span><strong>Zone affichée uniquement</strong><small>Limite la liste et la recherche à la partie visible de la carte.</small></span><input type="checkbox" class="switch" data-k="inView" ${s.inView?"checked":""}></label>
          <div class="sheet-actions">
            <button class="btn btn-ghost-dark" data-reset>Réinitialiser</button>
            <button class="btn btn-primary" data-close>Voir <span data-count></span> lieux</button>
          </div>
        </div>
      </div>`),t=()=>{e.querySelector("[data-count]").textContent=C().length},i=()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),250)};e.addEventListener("click",a=>{if(a.target===e||a.target.closest("[data-close]"))return i();const l=a.target.closest("[data-typo]");if(l){const n=l.dataset.typo;s.typos.has(n)?s.typos.delete(n):s.typos.add(n),l.classList.toggle("on"),v.querySelector(`[data-typo="${n}"]`).classList.toggle("on",s.typos.has(n)),$(),t()}a.target.closest("[data-reset]")&&(s.typos.clear(),s.kid=s.ruins=s.inView=!1,e.querySelectorAll(".chip").forEach(n=>n.classList.remove("on")),e.querySelectorAll(".switch").forEach(n=>{n.checked=!1}),v.querySelectorAll(".chip").forEach(n=>n.classList.remove("on")),$(),t())}),e.addEventListener("change",a=>{const l=a.target.dataset.k;l&&(s[l]=a.target.checked,$(),t())}),document.body.appendChild(e),t(),requestAnimationFrame(()=>e.classList.add("open"))}function te(e){const t=j(e).trim();if(!t)return[];const i=[];for(const a of h){const l=j(`${a.name} ${a.region||""}`);t.split(/\s+/).every(n=>l.includes(n))&&i.push({kind:"city",city:a,label:`${a.name}, ${a.region||""}`,sub:`${M(a).length} lieux`})}for(const a of C()){const l=c.typoById[a.typology],n=j([a.title,a.fullTitle,l.label,a.address,a.excerpt].join(" "));t.split(/\s+/).every(S=>n.includes(S))&&i.push({kind:"poi",poi:a,label:a.title,sub:l.label})}return i}function R(){const e=te(s.query);if(!s.query.trim()){f.hidden=!0;return}f.hidden=!1,f.innerHTML=e.length?e.map((t,i)=>`<button class="result" data-i="${i}">
          <span class="result-ic">${d(t.kind==="city"?"pin":"map",18)}</span>
          <span><strong>${p(t.label)}</strong><small>${p(t.sub)}</small></span></button>`).join(""):`<p class="result-empty">Aucun lieu ne correspond à « ${p(s.query)} ».</p>`,f.onclick=t=>{const i=t.target.closest("[data-i]");if(!i)return;const a=e[+i.dataset.i];m.blur(),f.hidden=!0,a.kind==="city"?(m.value=s.query="",u(null),z(a.city)):u(a.poi.id,{pan:!0})}}m.addEventListener("input",()=>{s.query=m.value,R()}),m.addEventListener("focus",()=>{s.query&&R()}),m.addEventListener("keydown",e=>{e.key==="Enter"&&f.querySelector(".result")?.click(),e.key==="Escape"&&(f.hidden=!0,m.blur())});function u(e,{pan:t=!1}={}){if(s.selected&&b.get(s.selected)?.getElement()?.classList.remove("selected"),s.selected=e,e){const i=c.poiById[e];b.get(i.id)?.getElement()?.classList.add("selected"),s.mode==="list"&&Z("map"),history.replaceState(null,"",`#/carte?poi=${e}`),k(),requestAnimationFrame(()=>{const a=t?Math.max(o.getZoom(),17):o.getZoom(),l=Math.min(g.offsetHeight,innerHeight*.72)/2,n=o.unproject(o.project([i.lat,i.lng],a).add([0,l]),a);t?o.flyTo(n,a,{duration:.6}):o.panTo(n,{duration:.4})})}else history.replaceState(null,"","#/carte"),k()}function k(){const e=s.selected&&c.poiById[s.selected];if(y.classList.toggle("has-preview",!!e),document.body.classList.toggle("preview-open",!!e),!e){g.classList.remove("open");return}const t=c.typoById[e.typology],i=O(),a=i?H(i,e):null,l=le(e);let n;T("demo")||l&&e.contentFromMap?n=`<a class="btn btn-primary" href="#/poi/${e.id}?src=map">Découvrir le contenu ${d("arrow",18)}</a>`:l?n=`<a class="btn btn-primary" href="#/scan">${d("scan",18)} Scanner le QR code du lieu</a>`:n=`<p class="access-hint">${d("lock",16)} Le contenu se débloque sur place, en scannant le QR code du lieu.</p>`,g.innerHTML=`
      <div class="preview-head">
        <div class="preview-media"><img src="${e.cover}" alt=""></div>
        <div class="preview-title">
          <span class="tag" style="--c:${t.color}">${p(t.label)}</span>
          <h2>${p(e.title)}</h2>
          ${a!=null?`<span class="preview-dist">À ${Y(a)}</span>`:""}
        </div>
        <button class="icon-btn preview-close" aria-label="Fermer l’aperçu">${d("close",18)}</button>
      </div>
      <div class="preview-body">
        <p class="preview-excerpt">${p(e.excerpt)}</p>
        <p class="preview-addr">${d("pin",14)} ${p(e.address)}</p>
        <div class="preview-actions">
          ${n}
          <a class="btn btn-soft" href="https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}" target="_blank" rel="noopener">${d("route",16)} Y aller</a>
        </div>
        ${T("demo")?"":'<button type="button" class="preview-demo" data-demo>Pas sur place ? Activer le mode démo</button>'}
      </div>`,g.querySelector(".preview-close").onclick=()=>u(null),g.querySelector("[data-demo]")?.addEventListener("click",()=>{_("demo",!0),q("Mode démo activé : tous les contenus sont ouverts.")}),requestAnimationFrame(()=>g.classList.add("open"))}function Z(e){s.mode=e,W.hidden=e!=="list",y.classList.toggle("list-mode",e==="list"),document.body.classList.toggle("list-open",e==="list");const t=r("[data-mode]");t.innerHTML=d(e==="list"?"map":"list"),t.setAttribute("aria-label",e==="list"?"Afficher la carte":"Afficher la liste"),e==="list"&&(u(null),w())}r("[data-mode]").addEventListener("click",()=>Z(s.mode==="list"?"map":"list"));function w(){if(s.mode!=="list")return;const e=O(),t=o.getCenter(),i=e||{lat:t.lat,lng:t.lng};r(".list-sort").textContent=e?"Triés par distance de vous":"Triés par distance du centre de la carte";const a=C().map(l=>({poi:l,d:H(i,l)})).sort((l,n)=>l.d-n.d);r(".list").innerHTML=a.length?a.map(({poi:l,d:n})=>{const S=c.typoById[l.typology];return`<li><button class="list-item" data-id="${l.id}">
          <img src="${l.cover}" alt="" loading="lazy">
          <span class="list-text">
            <span class="tag" style="--c:${S.color}">${p(S.label)}</span>
            <strong>${p(l.title)}</strong>
            <small>${p(l.excerpt)}</small>
          </span>
          <span class="list-dist">${Y(n)}</span>
        </button></li>`}).join(""):'<li class="result-empty">Aucun lieu avec ces filtres.</li>'}r(".list").addEventListener("click",e=>{const t=e.target.closest("[data-id]");t&&u(+t.dataset.id,{pan:!0})});const A=r(".demo-toggle"),D=()=>{const e=!!T("demo");A.classList.toggle("on",e),A.setAttribute("aria-pressed",String(e)),A.innerHTML=e?`${d("check",14)} Mode démo`:"Activer le mode démo"};A.addEventListener("click",()=>{const e=!T("demo");_("demo",e),q(e?"Mode démo activé : tous les contenus sont ouverts.":"Mode démo désactivé.")}),D();const se=ne(()=>{D(),k()});return setTimeout(()=>{if(o.invalidateSize(),x.poi&&c.poiById[x.poi]){const e=c.poiById[x.poi];o.setView([e.lat,e.lng],17,{animate:!1}),u(e.id,{pan:!0})}},0),()=>{X(),se(),o.remove(),document.querySelectorAll(".sheet-backdrop").forEach(e=>e.remove())}}export{pe as mountMap};
