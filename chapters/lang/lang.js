const supportedLangs = ["uk", "en", "es"];
const defaultLang = "uk";

function detectBrowserLang(){
  const browserLang = navigator.language || navigator.userLanguage;
  const short = browserLang.slice(0,2);
  return supportedLangs.includes(short) ? short : null;
}

async function loadLanguage(lang){
  try{
    const response = await fetch(`../lang/${lang}.json`);

    // fallback if file not found
    if(!response.ok){
      throw new Error("Language file not found");
    }

    const data = await response.json();

    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      if(data[key]){
        el.textContent = data[key];
      }
    });

    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;

  }catch(err){
    console.error("Language load error:", err);

    // fallback to default if not already default
    if(lang !== defaultLang){
      loadLanguage(defaultLang);
    }
  }
}

// selector
const selector = document.getElementById("languageSelect");

// language decision logic
let langToUse = localStorage.getItem("lang");

if(!langToUse){
  const detected = detectBrowserLang();
  langToUse = detected || defaultLang;
}

// apply language
if(selector) selector.value = langToUse;
loadLanguage(langToUse);

// change language
if(selector){
  selector.addEventListener("change", e=>{
    loadLanguage(e.target.value);
  });
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const lang = btn.getAttribute("data-lang");
    loadLanguage(lang);

    // optional: update the select if you still have it
    if(selector) selector.value = lang;
  });
});