import{getSetting as o,setSetting as r}from"../store.js";import{html as n,icon as s}from"../ui.js";function c(){const e=n(`
    <div class="sheet-backdrop">
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div class="sheet-grip"></div>
        <div class="sheet-head">
          <h2 id="settings-title">Réglages</h2>
          <button class="icon-btn" data-close aria-label="Fermer">${s("close")}</button>
        </div>
        <label class="switch-row">
          <span>
            <strong>Mode démo</strong>
            <small>Simule votre présence sur place pour ouvrir tous les contenus sans être à Saint-Pierre.</small>
          </span>
          <input type="checkbox" class="switch" ${o("demo")?"checked":""}>
        </label>
        <a class="row-link" href="qr.html" target="_blank" rel="noopener">
          ${s("qr")}
          <span><strong>QR codes à imprimer</strong><small>Une planche avec le QR code de chaque POI.</small></span>
          ${s("arrow",18)}
        </a>
        <p class="sheet-foot">BLINK · prototype de démonstration · données de Saint-Pierre (Martinique)</p>
      </div>
    </div>`),a=()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),250)};return e.addEventListener("click",t=>{(t.target===e||t.target.closest("[data-close]"))&&a()}),e.querySelector(".switch").addEventListener("change",t=>r("demo",t.target.checked)),document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("open")),a}export{c as openSettings};
