(function(){
  "use strict";
  const form=document.getElementById("kt-intake-form");
  if(!form)return;
  const $=id=>document.getElementById(id);
  const VERSION="2026-11-26-v1";
  let startedAt=Date.now();
  let key=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():null;
  let sending=false;
  const feedback=$("kt-intake-feedback");
  const button=$("kt-intake-submit");
  const success=$("kt-intake-success");
  const error=msg=>{feedback.textContent=msg;feedback.classList.add("visible")};
  const clear=()=>{feedback.textContent="";feedback.classList.remove("visible");$("kt-services-error").textContent=""};
  function digits(text){
    const v=text.trim();
    if(!/^\+?[\d\s().-]+$/.test(v))return "";
    const n=v.replace(/\D/g,"");
    return n.length>=8&&n.length<=16?n:"";
  }
  function officialNumber(){
    const link=document.querySelector(".contact-cta");
    if(!link)return null;
    try{
      const url=new URL(link.href);
      if(url.hostname!=="wa.me")return null;
      const n=url.pathname.replace(/\D/g,"");
      return /^\d{8,16}$/.test(n)?n:null;
    }catch{return null;}
  }
  function buildMessage(data,reference){
    return [
      "Hola, soy "+data.fullName+". Acabo de completar una solicitud en la web de KadmonTech.",
      "",
      "Mi negocio/proyecto: "+(data.businessName||"No especificado")+".",
      "",
      "Me interesan: "+data.services.join(", ")+".",
      "",
      "Necesito: "+(data.description||"Prefiero contarlo en nuestra conversación")+".",
      "",
      "Me gustaría comenzar: "+(data.timing||"No especificado")+".",
      "",
      "Referencia de solicitud: "+reference+".",
      "",
      "Quisiera conversar sobre cómo podemos avanzar."
    ].join("\n");
  }
  form.addEventListener("change",clear);
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(sending)return;
    clear();
    const data={
      idempotencyKey:key,
      startedAt,
      fullName:$("kt-full-name").value.trim(),
      businessName:$("kt-business").value.trim(),
      whatsapp:$("kt-whatsapp").value.trim(),
      services:[...form.querySelectorAll('input[name="services"]:checked')].map(x=>x.value),
      description:$("kt-description").value.trim(),
      timing:$("kt-timing").value,
      consent:$("kt-consent").checked,
      policyVersion:VERSION,
      website:$("kt-website").value
    };
    if(!form.checkValidity()){form.reportValidity();return}
    if(data.fullName.length<2){error("Ingresá tu nombre y apellido.");$("kt-full-name").focus();return}
    if(!digits(data.whatsapp)){error("Ingresá un teléfono con código de país (8 a 16 dígitos).");$("kt-whatsapp").focus();return}
    if(data.services.length===0){$("kt-services-error").textContent="Elegí al menos un servicio.";form.querySelector('input[name="services"]').focus();return}
    if(!data.consent){error("Aceptá la política de privacidad.");$("kt-consent").focus();return}
    if(!key){error("Tu navegador no permite crear una referencia segura. Probá actualizarlo.");return}
    sending=true;button.disabled=true;button.querySelector("span").textContent="Registrando tu solicitud…";
    try{
      const response=await fetch("/api/solicitudes",{
        method:"POST",credentials:"same-origin",cache:"no-store",
        headers:{"Content-Type":"application/json"},body:JSON.stringify(data)
      });
      let json={};
      try{json=await response.json()}catch{}
      if(!response.ok||!json.ok||!json.id)throw Error(json.error||"No pudimos registrar la solicitud. Reintentá sin perder tus datos.");
      const reference=json.reference||json.id;
      $("kt-intake-reference").textContent="Referencia: "+reference;
      const wa=officialNumber(),link=$("kt-intake-open-whatsapp");
      if(wa){
        link.href="https://wa.me/"+wa+"?text="+encodeURIComponent(buildMessage(data,reference));
        link.hidden=false;
      }else{
        link.hidden=true;
      }
      $("kt-intake-form-wrap").hidden=true;
      success.classList.add("visible");
      success.focus();
      if(wa){try{window.open(link.href,"_blank","noopener,noreferrer")}catch{}}
    }catch(ex){
      error(ex.message||"No se pudo registrar la solicitud. Intentá de nuevo.");
    }finally{
      sending=false;
      button.disabled=false;
      button.querySelector("span").textContent="Enviar mi solicitud";
    }
  });
  $("kt-intake-again").addEventListener("click",()=>{
    form.reset();
    key=crypto.randomUUID();
    startedAt=Date.now();
    clear();
    $("kt-intake-form-wrap").hidden=false;
    success.classList.remove("visible");
    $("kt-full-name").focus();
  });
})();