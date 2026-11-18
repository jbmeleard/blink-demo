import{html as r,icon as n}from"../ui.js";import{openSettings as l}from"./settings.js";function p(e){document.body.classList.add("page-home");const s=r(`
    <main class="home">
      <header class="home-top">
        <span class="brand">${t(36)}<span>BLINK</span></span>
        <button class="icon-btn" data-settings aria-label="Réglages">${n("settings",20)}</button>
      </header>
      <div class="home-eye">
        <span class="blink-eye">${t(132,{pupil:!0})}</span>
      </div>
      <section class="home-body">
        <h1 class="home-title">Un autre <em>regard</em> sur le patrimoine.</h1>
        <p class="home-lede">Scannez les QR codes posés sur les monuments et remontez le temps, là où l’histoire s’est passée.</p>
      </section>
      <nav class="home-actions" aria-label="Actions">
        <a class="btn btn-primary btn-xl" href="#/scan">${n("scan",20)} Scanner un QR code</a>
        <a class="btn btn-soft btn-xl" href="#/carte">${n("map",20)} Explorer la carte</a>
        <button class="btn btn-ghost" disabled title="Disponible dans une prochaine version">Mon compte <span class="soon">bientôt</span></button>
      </nav>
    </main>`);s.querySelector("[data-settings]").addEventListener("click",l),e.appendChild(s)}function t(e=36,{pupil:s=!1}={}){const o=Math.round(e*72/120),a=e>=100?2.6:7;return`<svg class="logo" width="${e}" height="${o}" viewBox="0 0 120 72" fill="none" stroke="currentColor" stroke-width="${a}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 36 C30 6 90 6 114 36 C90 66 30 66 6 36 Z"/><circle cx="60" cy="36" r="${s?17:16}"/>${s?'<circle cx="60" cy="36" r="5" fill="currentColor"/>':""}
  </svg>`}export{t as logo,p as mountHome};
