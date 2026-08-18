const siteConfig = {
  featuredThemeId: "neve",
  loaderDownloadUrl: "/.netlify/functions/loader-download",
  themes: [
    { id:"neve", name:"Neve Theme", description:"Inspired by the legendary Neve 88RS console. Warm, classic and timeless.", price:25, salePrice:null, badge:"NEW", paypalUrl:"#", image:"assets/neve-1.png" },
    { id:"api", name:"API Vision Theme", description:"Modern API console look for LUNA. Clean, bold and powerful.", price:25, salePrice:null, badge:null, paypalUrl:"#", image:"assets/api-1.png" }
  ]
};
function euro(value){ return `€${Number(value).toFixed(0)}`; }
function themeCard(theme){
  const sale=theme.salePrice!==null&&theme.salePrice<theme.price;
  const badge=sale?`<span class="badge sale">SALE</span>`:(theme.badge?`<span class="badge">${theme.badge}</span>`:"");
  const price=sale?`<div class="price"><s>${euro(theme.price)}</s>${euro(theme.salePrice)}</div>`:`<div class="price">${euro(theme.price)}</div>`;
  const image=theme.image?`<a class="theme-image-link" href="#${theme.id}-gallery"><img src="${theme.image}" alt="${theme.name} screenshot"></a>`:`<span>ADD REAL ${theme.name.toUpperCase()} SCREENSHOT</span>`;
  return `<article class="theme-card" id="theme-${theme.id}">${badge}<div class="theme-image">${image}</div><h3>${theme.name}</h3><p class="desc">${theme.description}</p><div class="tags"><span> LUNA macOS</span><span>All supported versions</span><span>Theme Loader</span></div><div class="price-row">${price}<a class="btn primary buy-btn buy-theme" href="#contact" data-theme="${theme.name}">GET THEME</a></div><p class="theme-note">Contact us to arrange purchase and secure digital delivery.</p></article>`;
}
const grid=document.getElementById("themeGrid"); grid.innerHTML=siteConfig.themes.map(themeCard).join("");
const featured=siteConfig.themes.find(t=>t.id===siteConfig.featuredThemeId); if(featured) document.getElementById("featuredName").textContent=featured.name.toUpperCase();
document.getElementById("loaderDownload").href=siteConfig.loaderDownloadUrl;
document.querySelectorAll(".thumb").forEach(button=>button.addEventListener("click",()=>{document.getElementById("galleryMainImage").src=button.dataset.src;document.querySelectorAll(".thumb").forEach(b=>b.classList.remove("active"));button.classList.add("active")}));
document.querySelectorAll(".api-thumb").forEach(button=>button.addEventListener("click",()=>{document.getElementById("apiGalleryMainImage").src=button.dataset.src;document.querySelectorAll(".api-thumb").forEach(b=>b.classList.remove("active"));button.classList.add("active")}));
window.addEventListener("hashchange",()=>{const hash=location.hash;if(!/^#[A-Za-z][\w:-]*$/.test(hash))return;const el=document.querySelector(hash);if(!el)return;el.animate([{boxShadow:"0 0 0 rgba(38,167,255,0)"},{boxShadow:"0 0 42px rgba(38,167,255,.13)"},{boxShadow:"0 0 0 rgba(38,167,255,0)"}],{duration:900,easing:"ease-out"})});
function wirePurchaseButtons(){document.querySelectorAll(".buy-theme").forEach(button=>button.addEventListener("click",()=>{const theme=button.dataset.theme;const select=document.getElementById("purchaseTheme");if(theme&&select)select.value=theme}))} wirePurchaseButtons();

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".buy-theme").forEach(button=>{button.textContent="GET THEME";button.setAttribute("aria-label",`Get ${button.dataset.theme||"theme"}`)});
  const supportLink=document.querySelector('#support .text-link'); if(supportLink) supportLink.textContent="CONTACT / GET THEME →";
  const contact=document.getElementById("contact");
  if(contact){
    const eyebrow=contact.querySelector(".contact-copy .eyebrow"); if(eyebrow) eyebrow.textContent="GET A THEME / CONTACT";
    const heading=contact.querySelector(".contact-copy h2"); if(heading) heading.textContent="Choose a theme and send us a request.";
    const intro=contact.querySelector(".contact-copy > p"); if(intro) intro.textContent="Send your request and we will reply with the details needed to complete your order. Payment is arranged directly after contact.";
    const points=contact.querySelectorAll(".contact-points span");
    if(points[0]) points[0].innerHTML='Theme price: <strong>€25</strong>';
    if(points[1]) points[1].textContent="Secure digital delivery";
    if(points[2]) points[2].textContent="Payment arranged after contact";
  }
  const form=document.getElementById("purchaseForm"),status=document.getElementById("formStatus"),success=document.getElementById("formSuccess"); if(!form)return;
  const requestType=document.getElementById("requestType");
  if(requestType&&requestType.options[0]){requestType.options[0].textContent="Get a theme";requestType.options[0].value="Theme request"}
  document.querySelectorAll(".buy-theme").forEach(button=>button.addEventListener("click",()=>{const theme=button.dataset.theme,select=document.getElementById("purchaseTheme"),type=document.getElementById("requestType");if(theme&&select)select.value=theme;if(type)type.value="Theme request"}));
  form.addEventListener("submit",async event=>{event.preventDefault();const endpoint=form.getAttribute("action")||"";if(endpoint.includes("YOUR_FORM_ID")){status.textContent="Secure form endpoint has not been activated yet. Add your Formspree Form ID before testing email delivery.";status.classList.add("active");return}const submitButton=form.querySelector('button[type="submit"]'),originalText=submitButton.textContent;submitButton.disabled=true;submitButton.textContent="SENDING…";status.textContent="Sending your request…";status.classList.add("active");try{const response=await fetch(endpoint,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Form service returned an error.");form.reset();form.hidden=true;success.hidden=false;status.textContent=""}catch(error){status.textContent="Message could not be sent. Please try again."}finally{submitButton.disabled=false;submitButton.textContent=originalText}});
});

document.addEventListener("DOMContentLoaded",()=>{
 const galleries={neve:[["assets/neve-1.png","Neve Theme — Full Mixer"],["assets/neve-2.png","Neve Theme — Timeline"],["assets/neve-3.png","Neve Theme — Mixer Detail"],["assets/neve-4.png","Neve Theme — Transport Detail"]],api:[["assets/api-1.png","API Vision Theme — Full Mixer"],["assets/api-2.png","API Vision Theme — Timeline"],["assets/api-3.png","API Vision Theme — Mixer Detail"],["assets/api-4.png","API Vision Theme — Transport Detail"]]};
 const lightbox=document.getElementById("imageLightbox"),image=document.getElementById("lightboxImage"),caption=document.getElementById("lightboxCaption"),counter=document.getElementById("lightboxCounter"),close=lightbox.querySelector(".lightbox-close"),prev=lightbox.querySelector(".lightbox-prev"),next=lightbox.querySelector(".lightbox-next");let galleryName="neve",index=0;
 const overlay=`<span class="gallery-zoom-control" aria-hidden="true"><span class="gallery-zoom-text">FULLSCREEN</span><span class="gallery-zoom-bubble"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"></circle><path d="M15 15L21 21"></path><path d="M10 7V13"></path><path d="M7 10H13"></path></svg></span></span>`;
 function render(){const items=galleries[galleryName];image.src=items[index][0];caption.textContent=items[index][1];counter.textContent=`${index+1} / ${items.length}`}
 function openViewer(name,src){galleryName=name;const items=galleries[name],found=items.findIndex(([path])=>path===src);index=found>=0?found:0;render();lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false");document.body.classList.add("lightbox-active");document.body.classList.toggle("neve-lightbox",name==="neve");document.body.classList.toggle("api-lightbox",name==="api")}
 function closeViewer(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");document.body.classList.remove("lightbox-active","neve-lightbox","api-lightbox")}
 function move(delta){const items=galleries[galleryName];index=(index+delta+items.length)%items.length;render()}
 document.querySelectorAll(".gallery-main").forEach(button=>{const img=button.querySelector("img");if(!img)return;const section=button.closest(".theme-detail"),name=(section&&section.id==="api-gallery")?"api":"neve";button.classList.add("zoomable-main");button.dataset.gallery=name;if(!button.querySelector(".gallery-zoom-control"))button.insertAdjacentHTML("afterbegin",overlay);button.addEventListener("click",event=>{event.preventDefault();openViewer(name,img.getAttribute("src"))})});
 close.addEventListener("click",closeViewer);prev.addEventListener("click",()=>move(-1));next.addEventListener("click",()=>move(1));lightbox.addEventListener("click",event=>{if(event.target===lightbox)closeViewer()});document.addEventListener("keydown",event=>{if(!lightbox.classList.contains("open"))return;if(event.key==="Escape")closeViewer();if(event.key==="ArrowLeft")move(-1);if(event.key==="ArrowRight")move(1)});let startX=null;lightbox.addEventListener("touchstart",event=>{startX=event.changedTouches[0].screenX},{passive:true});lightbox.addEventListener("touchend",event=>{if(startX===null)return;const dx=event.changedTouches[0].screenX-startX;if(Math.abs(dx)>50)move(dx>0?-1:1);startX=null},{passive:true});
});

(function setupNetlifyIdentity(){
  const widgetScript=document.createElement("script");
  widgetScript.src="https://identity.netlify.com/v1/netlify-identity-widget.js";
  widgetScript.async=false;
  widgetScript.onload=()=>{
    if(!window.netlifyIdentity)return;
    const identity=window.netlifyIdentity;
    const accountButton=document.querySelector(".account-btn");
    const panel=document.createElement("div");
    panel.className="account-modal";
    panel.setAttribute("aria-hidden","true");
    panel.innerHTML=`<div class="account-backdrop" data-account-close></div><section class="account-panel" role="dialog" aria-modal="true" aria-label="My account"><button class="account-close" type="button" data-account-close aria-label="Close">×</button><span class="eyebrow">LUNA THEMES ACCOUNT</span><h2>My Account</h2><div class="account-user"><span class="account-avatar">L</span><div><small>SIGNED IN AS</small><strong id="accountEmail">—</strong></div></div><div class="account-library"><div class="account-section-head"><div><small>YOUR LIBRARY</small><h3>Your Themes</h3></div><span class="account-status">ACCOUNT ACTIVE</span></div><div id="accountThemes" class="account-themes"></div></div><div class="account-actions"><a href="#themes" class="btn ghost" data-account-close>EXPLORE THEMES</a><button type="button" class="btn account-logout" id="accountLogout">LOG OUT</button></div></section>`;
    document.body.appendChild(panel);
    const emailEl=panel.querySelector("#accountEmail");
    const themesEl=panel.querySelector("#accountThemes");
    const logoutButton=panel.querySelector("#accountLogout");
    function userRoles(user){return (user&&user.app_metadata&&Array.isArray(user.app_metadata.roles))?user.app_metadata.roles.map(r=>String(r).toLowerCase()):[]}
    function renderLibrary(user){
      const roles=userRoles(user);
      const owned=siteConfig.themes.filter(theme=>roles.includes(theme.id)||roles.includes(`theme-${theme.id}`)||roles.includes(theme.name.toLowerCase()));
      if(!owned.length){themesEl.innerHTML=`<div class="account-empty"><strong>No themes assigned yet.</strong><p>Your themes will appear here after your order is confirmed.</p><a href="#contact" data-account-close>GET A THEME / CONTACT →</a></div>`;return}
      themesEl.innerHTML=owned.map(theme=>`<article class="account-theme"><img src="${theme.image}" alt="${theme.name}"><div><small>OWNED THEME</small><strong>${theme.name}</strong><span>Ready for secure delivery</span></div><button class="btn primary account-download" type="button" data-download-theme="${theme.id}">DOWNLOAD</button></article>`).join("");
      themesEl.querySelectorAll("[data-download-theme]").forEach(button=>button.addEventListener("click",()=>downloadTheme(button.dataset.downloadTheme,button)));
    }
    async function downloadTheme(themeId,button){
      const user=identity.currentUser(); if(!user){identity.open("login");return}
      const original=button.textContent;button.disabled=true;button.textContent="PREPARING…";
      try{
        const token=await user.jwt();
        const response=await fetch(`/.netlify/functions/theme-download?theme=${encodeURIComponent(themeId)}`,{headers:{Authorization:`Bearer ${token}`}});
        if(!response.ok)throw new Error(await response.text()||"Download failed.");
        const blob=await response.blob();const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`LUNA-${themeId.toUpperCase()}-Theme.zip`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
        button.textContent="DOWNLOADED";setTimeout(()=>{button.textContent=original;button.disabled=false},1800);return;
      }catch(error){alert(error.message||"Theme could not be downloaded.")}
      button.textContent=original;button.disabled=false;
    }
    function openAccount(){
      const user=identity.currentUser(); if(!user){identity.open("login");return}
      emailEl.textContent=user.email||"LUNA Themes customer"; renderLibrary(user);
      panel.classList.add("open");panel.setAttribute("aria-hidden","false");document.body.classList.add("account-open");
    }
    function closeAccount(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true");document.body.classList.remove("account-open")}
    function refreshAccountButton(){
      if(!accountButton)return; const user=identity.currentUser();
      accountButton.textContent="MY ACCOUNT";
      accountButton.setAttribute("aria-label",user?`Open account for ${user.email||"customer"}`:"Log in to your account");
    }
    panel.querySelectorAll("[data-account-close]").forEach(el=>el.addEventListener("click",closeAccount));
    logoutButton.addEventListener("click",async()=>{closeAccount();await identity.logout()});
    document.addEventListener("keydown",event=>{if(event.key==="Escape"&&panel.classList.contains("open"))closeAccount()});
    identity.on("init",refreshAccountButton);
    identity.on("login",()=>{refreshAccountButton();identity.close();openAccount()});
    identity.on("logout",()=>{refreshAccountButton();closeAccount()});
    identity.on("error",error=>console.error("Netlify Identity:",error));
    if(accountButton){accountButton.href="#";accountButton.addEventListener("click",event=>{event.preventDefault();openAccount()})}
    identity.init({container:null});
    refreshAccountButton();
  };
  document.head.appendChild(widgetScript);
})();
