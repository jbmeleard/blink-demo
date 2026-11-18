import{html as i}from"../ui.js";import{logo as n}from"./home.js";const r="9ca22f47bd97ed781669d6d761c9f53f1d6a070cf175d7ea22785368f8c0db2f",d="blink.access";async function l(e){const a=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(e));return[...new Uint8Array(a)].map(t=>t.toString(16).padStart(2,"0")).join("")}function M(){try{return localStorage.getItem(d)===r}catch{return!1}}function c(){try{localStorage.setItem(d,r)}catch{}}const p=`
    <svg class="arrival-drawing" viewBox="0 0 390 300" preserveAspectRatio="xMidYMax meet" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M0 290 H390"/>
      <path d="M24 168 L29 30 H39 L44 168"/>
      <path d="M28 44 H40 M27 54 H41"/>
      <path d="M8 290 V168 L36 200 L36 168 L64 200 L64 168 L92 200 L92 168 L120 200"/>
      <path d="M8 200 H120"/>
      <path d="M16 238 H28 V252 H16 Z M44 238 H56 V252 H44 Z M72 238 H84 V252 H72 Z M100 238 H112 V252 H100 Z"/>
      <path d="M120 290 V130 H195"/>
      <path d="M117 130 H195"/>
      <path d="M134 144 H143 V157 H134 Z M156 144 H165 V157 H156 Z M176 144 H185 V157 H176 Z M134 174 H143 V187 H134 Z M156 174 H165 V187 H156 Z M176 174 H185 V187 H176 Z M134 204 H143 V217 H134 Z M156 204 H165 V217 H156 Z M176 204 H185 V217 H176 Z M134 234 H143 V247 H134 Z M156 234 H165 V247 H156 Z M176 234 H185 V247 H176 Z"/>
      <path d="M195 50 V290"/>
      <path d="M195 50 L203 120"/>
      <path d="M195 96 H200 M195 76 H198"/>
      <path d="M195 120 H320 L385 214"/>
      <path d="M195 214 H385"/>
      <path d="M377 214 V250"/>
      <path d="M195 250 H377"/>
      <path d="M221 250 V290 M247 250 V290 M273 250 V290 M299 250 V290 M325 250 V290 M351 250 V290 M377 250 V290"/>
      <path d="M195 259 L202 250 M221 259 L214 250 M221 259 L228 250 M247 259 L240 250 M247 259 L254 250 M273 259 L266 250 M273 259 L280 250 M299 259 L292 250 M299 259 L306 250 M325 259 L318 250 M325 259 L332 250 M351 259 L344 250 M351 259 L358 250 M377 259 L370 250"/>
      <path d="M221 222 V182 L232 160 L243 182 V222"/>
      <path d="M227 190 H237 V208 H227 Z"/>
      <path d="M232 160 V151"/>
      <path d="M261 222 V182 L272 160 L283 182 V222"/>
      <path d="M267 190 H277 V208 H267 Z"/>
      <path d="M272 160 V151"/>
      <path d="M301 222 V182 L312 160 L323 182 V222"/>
      <path d="M307 190 H317 V208 H307 Z"/>
      <path d="M312 160 V151"/>
      <path d="M340 160 L348 150 M356 186 L364 176" stroke-opacity="0.5"/>
    </svg>`;function L(){const e=M(),a=i(`
    <section class="arrival" role="dialog" aria-modal="true" aria-label="Bienvenue dans BLINK">
      <div class="arrival-body">
        <span class="blink-eye">${n(132,{pupil:!0})}</span>
        <div>
          <div class="arrival-name">BLINK</div>
          <p class="arrival-tagline">Un autre regard sur le patrimoine.</p>
        </div>
        <form class="arrival-form">
          ${e?"":`
          <input class="arrival-password" type="password" placeholder="Mot de passe" aria-label="Mot de passe" autocomplete="current-password" required>
          <p class="arrival-error" role="alert"></p>`}
          <button type="submit" class="arrival-enter">Entrer</button>
        </form>
      </div>
      ${p}
    </section>`);document.body.appendChild(a),document.body.classList.add("arrival-on");const t=a.querySelector(".arrival-password");return(t||a.querySelector(".arrival-enter")).focus(),new Promise(o=>{e&&o(),a.querySelector("form").addEventListener("submit",async s=>{if(s.preventDefault(),t){if(await l(t.value)!==r){a.querySelector(".arrival-error").textContent="Mot de passe incorrect",t.select();return}c(),o()}a.classList.add("leaving"),document.body.classList.remove("arrival-on"),setTimeout(()=>a.remove(),460)})})}export{L as showArrival};
