import{loadData as _,getPosition as C,onPosition as G,startWatching as H,distance as q,formatDistance as P,isOnSite as J,onSettingChange as K}from"../store.js";import{html as j,icon as d,esc as p,toast as R}from"../ui.js";import{createBaseMap as U}from"../basemap.js";const M=S=>String(S||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();async function se(S,A){const o=await _();document.body.classList.add("page-map");const s={typos:new Set,kid:!1,ruins:!1,inView:!1,query:"",selected:null,mode:"map"},h=j(`
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

      <div class="map-fabs">
        <button class="fab" data-locate aria-label="Me localiser">${d("locate")}</button>
        <button class="fab" data-mode aria-label="Afficher la liste">${d("list")}</button>
      </div>


      <section class="listview" hidden aria-label="Liste des lieux">
        <header class="list-head"><h2>Lieux</h2><span class="list-sort"></span></header>
        <ol class="list"></ol>
      </section>

      <aside class="preview" aria-live="polite"></aside>
    </main>`);S.appendChild(h);const r=e=>h.querySelector(e),m=r(".search-field input"),f=r(".search-results"),y=r(".preview"),D=r(".listview"),c=U(r("#map")).setView(o.city.center,o.city.zoom),g=new Map;for(const e of o.pois){const t=o.typoById[e.typology],i=L.marker([e.lat,e.lng],{icon:L.divIcon({className:"poi-marker",html:`<span class="pin" style="--c:${t.color}"><span>${e.id-100}</span></span><span class="pin-label">${p(e.title)}</span>`,iconSize:[26,38],iconAnchor:[13,38]}),keyboard:!0,title:e.title}).addTo(c);i.on("click",()=>u(e.id,{pan:!1})),g.set(e.id,i)}const N=o.pois.filter(e=>q(e,{lat:o.city.center[0],lng:o.city.center[1]})<5e4),V=()=>c.fitBounds(L.latLngBounds(N.map(e=>[e.lat,e.lng])),{padding:[60,60]});V();const z=()=>r("#map").classList.toggle("show-labels",c.getZoom()>=17);c.on("zoomend",z),z(),c.on("click",()=>u(null)),c.on("moveend",()=>{(s.inView||s.mode==="list")&&w()});let x=null,F=null;const Z=G(e=>{const t=[e.lat,e.lng];x?(x.setLatLng(t),F.setLatLng(t).setRadius(e.accuracy)):(F=L.circle(t,{radius:e.accuracy,className:"me-accuracy",interactive:!1}).addTo(c),x=L.marker(t,{icon:L.divIcon({className:"me-marker",html:"<span></span>",iconSize:[18,18]}),interactive:!1}).addTo(c)),s.selected&&$(),s.mode==="list"&&w()});H().catch(()=>{}),r("[data-locate]").addEventListener("click",async()=>{try{const e=await H(),t=o.city.center;q(e,{lat:t[0],lng:t[1]})>2e4&&R("Vous êtes loin de Saint-Pierre. Activez le mode démo pour explorer les contenus."),c.flyTo([e.lat,e.lng],17)}catch{R("Position indisponible. Autorisez la géolocalisation dans votre navigateur.")}});const b=r(".chips");b.innerHTML=o.typologies.map(e=>`<button class="chip" data-typo="${e.id}" style="--c:${e.color}">${p(e.label)}</button>`).join(""),b.addEventListener("click",e=>{const t=e.target.closest("[data-typo]");if(!t)return;const i=t.dataset.typo;s.typos.has(i)?s.typos.delete(i):s.typos.add(i),t.classList.toggle("on",s.typos.has(i)),v()}),r(".filter-btn").addEventListener("click",Q);function E(e){return!(s.typos.size&&!s.typos.has(e.typology)||s.kid&&!e.tags.includes("enfant")||s.ruins&&!e.tags.includes("1902"))}function T(){let e=o.pois.filter(E);if(s.inView){const t=c.getBounds();e=e.filter(i=>t.contains([i.lat,i.lng]))}return e}function v(){for(const e of o.pois){const t=g.get(e.id).getElement();t&&t.classList.toggle("dimmed",!E(e))}r(".filter-btn .dot").hidden=!(s.kid||s.ruins||s.inView),s.selected&&!E(o.poiById[s.selected])&&u(null),w()}function Q(){const e=j(`
      <div class="sheet-backdrop">
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="filters-title">
          <div class="sheet-grip"></div>
          <div class="sheet-head"><h2 id="filters-title">Filtres</h2><button class="icon-btn" data-close aria-label="Fermer">${d("close")}</button></div>
          <h3 class="sheet-sub">Typologie</h3>
          <div class="chips wrap">${o.typologies.map(l=>`<button class="chip ${s.typos.has(l.id)?"on":""}" data-typo="${l.id}" style="--c:${l.color}">${p(l.label)}</button>`).join("")}</div>
          <h3 class="sheet-sub">Affiner</h3>
          <label class="switch-row"><span><strong>Adapté aux enfants</strong></span><input type="checkbox" class="switch" data-k="kid" ${s.kid?"checked":""}></label>
          <label class="switch-row"><span><strong>Vestiges de 1902</strong><small>Lieux marqués par l’éruption de la montagne Pelée.</small></span><input type="checkbox" class="switch" data-k="ruins" ${s.ruins?"checked":""}></label>
          <label class="switch-row"><span><strong>Zone affichée uniquement</strong><small>Limite la liste et la recherche à la partie visible de la carte.</small></span><input type="checkbox" class="switch" data-k="inView" ${s.inView?"checked":""}></label>
          <div class="sheet-actions">
            <button class="btn btn-ghost-dark" data-reset>Réinitialiser</button>
            <button class="btn btn-primary" data-close>Voir <span data-count></span> lieux</button>
          </div>
        </div>
      </div>`),t=()=>{e.querySelector("[data-count]").textContent=T().length},i=()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),250)};e.addEventListener("click",l=>{if(l.target===e||l.target.closest("[data-close]"))return i();const a=l.target.closest("[data-typo]");if(a){const n=a.dataset.typo;s.typos.has(n)?s.typos.delete(n):s.typos.add(n),a.classList.toggle("on"),b.querySelector(`[data-typo="${n}"]`).classList.toggle("on",s.typos.has(n)),v(),t()}l.target.closest("[data-reset]")&&(s.typos.clear(),s.kid=s.ruins=s.inView=!1,e.querySelectorAll(".chip").forEach(n=>n.classList.remove("on")),e.querySelectorAll(".switch").forEach(n=>{n.checked=!1}),b.querySelectorAll(".chip").forEach(n=>n.classList.remove("on")),v(),t())}),e.addEventListener("change",l=>{const a=l.target.dataset.k;a&&(s[a]=l.target.checked,v(),t())}),document.body.appendChild(e),t(),requestAnimationFrame(()=>e.classList.add("open"))}function O(e){const t=M(e).trim();if(!t)return[];const i=[],l=M(`${o.city.name} ${o.city.region}`);(l.includes(t)||t.split(/\s+/).every(a=>l.includes(a)))&&i.push({kind:"city",label:`${o.city.name}, ${o.city.region}`,sub:`${o.pois.length} lieux`});for(const a of T()){const n=o.typoById[a.typology],k=M([a.title,a.fullTitle,n.label,a.address,a.excerpt].join(" "));t.split(/\s+/).every(Y=>k.includes(Y))&&i.push({kind:"poi",poi:a,label:a.title,sub:n.label})}return i}function I(){const e=O(s.query);if(!s.query.trim()){f.hidden=!0;return}f.hidden=!1,f.innerHTML=e.length?e.map((t,i)=>`<button class="result" data-i="${i}">
          <span class="result-ic">${d(t.kind==="city"?"pin":"map",18)}</span>
          <span><strong>${p(t.label)}</strong><small>${p(t.sub)}</small></span></button>`).join(""):`<p class="result-empty">Aucun lieu ne correspond à « ${p(s.query)} ».</p>`,f.onclick=t=>{const i=t.target.closest("[data-i]");if(!i)return;const l=e[+i.dataset.i];m.blur(),f.hidden=!0,l.kind==="city"?(m.value=s.query="",u(null),V(),B("list")):u(l.poi.id,{pan:!0})}}m.addEventListener("input",()=>{s.query=m.value,I()}),m.addEventListener("focus",()=>{s.query&&I()}),m.addEventListener("keydown",e=>{e.key==="Enter"&&f.querySelector(".result")?.click(),e.key==="Escape"&&(f.hidden=!0,m.blur())});function u(e,{pan:t=!1}={}){if(s.selected&&g.get(s.selected)?.getElement()?.classList.remove("selected"),s.selected=e,e){const i=o.poiById[e];g.get(i.id)?.getElement()?.classList.add("selected"),s.mode==="list"&&B("map"),history.replaceState(null,"",`#/carte?poi=${e}`),$(),requestAnimationFrame(()=>{const l=t?Math.max(c.getZoom(),17):c.getZoom(),a=Math.min(y.offsetHeight,innerHeight*.72)/2,n=c.unproject(c.project([i.lat,i.lng],l).add([0,a]),l);t?c.flyTo(n,l,{duration:.6}):c.panTo(n,{duration:.4})})}else history.replaceState(null,"","#/carte"),$()}function $(){const e=s.selected&&o.poiById[s.selected];if(h.classList.toggle("has-preview",!!e),document.body.classList.toggle("preview-open",!!e),!e){y.classList.remove("open");return}const t=o.typoById[e.typology],i=C(),l=i?q(i,e):null,a=J(e);let n;a&&e.contentFromMap?n=`<a class="btn btn-primary" href="#/poi/${e.id}?src=map">Découvrir le contenu ${d("arrow",18)}</a>`:a?n=`<a class="btn btn-primary" href="#/scan">${d("scan",18)} Scanner le QR code du lieu</a>`:n=`<p class="access-hint">${d("lock",16)} Le contenu se débloque sur place, en scannant le QR code du lieu.</p>`,y.innerHTML=`
      <div class="preview-head">
        <div class="preview-media"><img src="${e.cover}" alt=""></div>
        <div class="preview-title">
          <span class="tag" style="--c:${t.color}">${p(t.label)}</span>
          <h2>${p(e.title)}</h2>
          ${l!=null?`<span class="preview-dist">À ${P(l)}</span>`:""}
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
      </div>`,y.querySelector(".preview-close").onclick=()=>u(null),requestAnimationFrame(()=>y.classList.add("open"))}function B(e){s.mode=e,D.hidden=e!=="list",h.classList.toggle("list-mode",e==="list"),document.body.classList.toggle("list-open",e==="list");const t=r("[data-mode]");t.innerHTML=d(e==="list"?"map":"list"),t.setAttribute("aria-label",e==="list"?"Afficher la carte":"Afficher la liste"),e==="list"&&(u(null),w())}r("[data-mode]").addEventListener("click",()=>B(s.mode==="list"?"map":"list"));function w(){if(s.mode!=="list")return;const e=C(),t=c.getCenter(),i=e||{lat:t.lat,lng:t.lng};r(".list-sort").textContent=e?"Triés par distance de vous":"Triés par distance du centre de la carte";const l=T().map(a=>({poi:a,d:q(i,a)})).sort((a,n)=>a.d-n.d);r(".list").innerHTML=l.length?l.map(({poi:a,d:n})=>{const k=o.typoById[a.typology];return`<li><button class="list-item" data-id="${a.id}">
          <img src="${a.cover}" alt="" loading="lazy">
          <span class="list-text">
            <span class="tag" style="--c:${k.color}">${p(k.label)}</span>
            <strong>${p(a.title)}</strong>
            <small>${p(a.excerpt)}</small>
          </span>
          <span class="list-dist">${P(n)}</span>
        </button></li>`}).join(""):'<li class="result-empty">Aucun lieu avec ces filtres.</li>'}r(".list").addEventListener("click",e=>{const t=e.target.closest("[data-id]");t&&u(+t.dataset.id,{pan:!0})});const W=K(()=>$());return setTimeout(()=>{if(c.invalidateSize(),A.poi&&o.poiById[A.poi]){const e=o.poiById[A.poi];c.setView([e.lat,e.lng],17,{animate:!1}),u(e.id,{pan:!0})}},0),()=>{Z(),W(),c.remove(),document.querySelectorAll(".sheet-backdrop").forEach(e=>e.remove())}}export{se as mountMap};
