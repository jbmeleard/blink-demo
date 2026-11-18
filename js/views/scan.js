import{loadData as L}from"../store.js";import{html as S,icon as u,esc as A}from"../ui.js";function $(c){const o=String(c).match(/#\/poi\/(\d+)/)||String(c).match(/^(?:blink|grenouille):poi:(\d+)$/i);return o?o[1]:null}async function C(c){const o=await L();document.body.classList.add("page-scan");const n=S(`
    <main class="scan">
      <header class="scan-top">
        <a class="icon-btn" href="#/" aria-label="Retour">${u("back")}</a>
        <span>Scanner</span>
        <a class="icon-btn" href="#/carte" aria-label="Carte">${u("map")}</a>
      </header>
      <div class="scan-frame">
        <video class="scan-video" playsinline muted></video>
        <div class="viewfinder" aria-hidden="true"><i></i><i></i><i></i><i></i><b class="laser"></b></div>
      </div>
      <div class="scan-panel">
        <p class="scan-hint">Visez le QR code posé sur le monument</p>
        <p class="scan-sub">Le contenu s’ouvre dès que le code est reconnu.</p>
        <p class="scan-error" hidden></p>
        <button class="btn btn-soft scan-sim">${u("qr",18)} Pas de QR code ? Simuler un scan</button>
      </div>
    </main>`);c.appendChild(n);const t=n.querySelector("video"),f=n.querySelector(".scan-error");let d=null,m=0,r=!1,g=0;const v=document.createElement("canvas"),b=v.getContext("2d",{willReadFrequently:!0});let l=null;if("BarcodeDetector"in window)try{l=new window.BarcodeDetector({formats:["qr_code"]})}catch{l=null}function p(e){if(!r){if(!o.poiById[e]){h("Ce QR code ne correspond à aucun lieu BLINK.");return}r=!0,navigator.vibrate?.(60),n.classList.add("found"),sessionStorage.setItem(`grenouille.scanned.${e}`,"1"),setTimeout(()=>{location.hash=`#/poi/${e}?src=scan`},350)}}function h(e){f.textContent=e,f.hidden=!1}async function w(e){if(!r&&(m=requestAnimationFrame(w),!(e-g<140||t.readyState<2))){g=e;try{if(l){const s=await l.detect(t);for(const a of s){const i=$(a.rawValue);if(i)return p(i)}}else if(window.jsQR){const a=Math.round(t.videoHeight/t.videoWidth*480)||360;v.width=480,v.height=a,b.drawImage(t,0,0,480,a);const i=b.getImageData(0,0,480,a),y=window.jsQR(i.data,480,a,{inversionAttempts:"dontInvert"}),q=y&&$(y.data);q&&p(q)}}catch(s){console.warn(s)}}}async function k(){if(!navigator.mediaDevices?.getUserMedia){h("La caméra n’est pas disponible sur cet appareil ou cette connexion (HTTPS requis).");return}try{if(d=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:!1}),r){d.getTracks().forEach(e=>e.stop());return}t.srcObject=d,await t.play(),n.classList.add("live"),m=requestAnimationFrame(w)}catch(e){h(e&&e.name==="NotAllowedError"?"Accès à la caméra refusé. Autorisez-le dans les réglages du navigateur, ou simulez un scan.":"Impossible d’ouvrir la caméra. Vous pouvez simuler un scan.")}}return n.querySelector(".scan-sim").addEventListener("click",()=>{const e=S(`
      <div class="sheet-backdrop">
        <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sim-title">
          <div class="sheet-grip"></div>
          <div class="sheet-head"><h2 id="sim-title">Simuler un scan</h2><button class="icon-btn" data-close aria-label="Fermer">${u("close")}</button></div>
          <p class="sheet-text">Choisissez le QR code que vous auriez scanné sur place.</p>
          <div class="sim-list">${o.pois.map(a=>`
            <button class="sim-item" data-id="${a.id}">
              <img src="${a.cover}" alt="">
              <span><strong>${A(a.title)}</strong><small>QR n° ${a.id}${a.id===101?" · fiche animée":""}</small></span>
            </button>`).join("")}</div>
        </div>
      </div>`),s=()=>{e.classList.remove("open"),setTimeout(()=>e.remove(),250)};e.addEventListener("click",a=>{if(a.target===e||a.target.closest("[data-close]"))return s();const i=a.target.closest("[data-id]");i&&(s(),p(i.dataset.id))}),document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("open"))}),k(),()=>{r=!0,cancelAnimationFrame(m),d?.getTracks().forEach(e=>e.stop()),document.querySelectorAll(".sheet-backdrop").forEach(e=>e.remove())}}export{C as mountScan,$ as parsePayload};
