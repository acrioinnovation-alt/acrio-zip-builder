const $=s=>document.querySelector(s);
let phaseData={};let phaseDataReady=false;let activePhase=1;let activeChallenge=null;let answerSubmitted=false;let orderSelection=[];
const state={region:0,progress:{completed:[],lives:5,coins:0,streak:0,dailyDone:[],hintsUsed:[],solutionsUsed:[]},settings:{language:"pt",music:true,effects:true,musicVolume:70,effectsVolume:80,largeText:false,highContrast:false,reduceMotion:false}};
const translations={
pt:{welcomeEyebrow:"SEU RACIOCÍNIO, SEU DESAFIO",welcomeTitle:"Pense. Descubra. Avance.",welcomeText:"Mil fases de lógica, observação e dedução.",lives:"Vidas",coins:"Moedas",completed:"Concluídas",journey:"SUA JORNADA",mapTitle:"Mapa das fases",legendDone:"Concluída",legendCurrent:"Disponível",legendLocked:"Bloqueada",dailyEyebrow:"DESAFIO ESPECIAL",dailyTitle:"Desafio diário",dailyText:"Uma missão por dia. Sem perder vidas.",dailyButton:"Ver desafio",offlineNote:"Seu progresso fica salvo neste aparelho. O jogo foi preparado para funcionar offline.",settingsEyebrow:"PERSONALIZE",settingsTitle:"Configurações",language:"Idioma",sound:"Áudio",music:"Música de fundo",effects:"Efeitos sonoros",musicVolume:"Volume da música",effectsVolume:"Volume dos efeitos",accessibility:"Acessibilidade",textSize:"Texto maior",contrast:"Alto contraste",reduceMotion:"Reduzir animações",settingsNote:"As preferências são salvas somente neste aparelho. O áudio e os anúncios serão conectados nas próximas etapas.",region:"Região",phase:"Fase",dailyUnavailable:"O desafio diário será adicionado junto com o primeiro pacote de perguntas validadas.",orderProgress:"Selecione os itens na ordem correta.",resetOrder:"Refazer ordem",submitSelection:"Confirmar seleção",notReady:"Esta fase ainda está em produção. O conteúdo será liberado depois de revisado.",questionType:"DESAFIO DE LÓGICA",numericPlaceholder:"Digite sua resposta",submitAnswer:"Confirmar resposta",emptyAnswer:"Digite um número antes de confirmar.",question:"Tenho ruas, mas não carros. Tenho cidades, mas não casas. Tenho rios, mas não água. O que sou?",answer1:"Um mapa",answer2:"Uma fotografia",answer3:"Um livro",correct:"Resposta correta! Você concluiu a fase.",wrong:"Não foi dessa vez. Uma vida foi descontada. A explicação não será exibida automaticamente.",noLives:"Você está sem vidas. Recupere uma vida assistindo a um anúncio quando a integração estiver disponível.",hint:"Dica",solution:"Ver solução",hintUnavailable:"A compra por moedas e os anúncios recompensados serão conectados na etapa de monetização.",solutionUnavailable:"A revelação da resposta e da explicação será liberada por moedas ou anúncio na etapa de monetização.",close:"Fechar",next:"Continuar",alreadyDone:"Fase já concluída. A recompensa não pode ser recebida novamente.",reward:"Você recebeu 10 moedas.",daily:"Desafio diário",regionName:"Região",regionRange:"Fases",current:"Atual",done:"Concluída",locked:"Bloqueada"},
en:{welcomeEyebrow:"YOUR MIND, YOUR CHALLENGE",welcomeTitle:"Think. Discover. Advance.",welcomeText:"A thousand stages of logic, observation and deduction.",lives:"Lives",coins:"Coins",completed:"Completed",journey:"YOUR JOURNEY",mapTitle:"Stage map",legendDone:"Completed",legendCurrent:"Available",legendLocked:"Locked",dailyEyebrow:"SPECIAL CHALLENGE",dailyTitle:"Daily challenge",dailyText:"One mission a day. No lives lost.",dailyButton:"View challenge",offlineNote:"Your progress is saved on this device. The game is prepared to work offline.",settingsEyebrow:"CUSTOMIZE",settingsTitle:"Settings",language:"Language",sound:"Audio",music:"Background music",effects:"Sound effects",musicVolume:"Music volume",effectsVolume:"Effects volume",accessibility:"Accessibility",textSize:"Larger text",contrast:"High contrast",reduceMotion:"Reduce animations",settingsNote:"Preferences are saved only on this device. Audio and ads will be connected in later steps.",region:"Region",phase:"Stage",dailyUnavailable:"The daily challenge will be added with the first pack of reviewed questions.",orderProgress:"Select the items in the correct order.",resetOrder:"Reset order",submitSelection:"Confirm selection",notReady:"This stage is still in production. Content will be released after review.",questionType:"LOGIC PUZZLE",numericPlaceholder:"Enter your answer",submitAnswer:"Submit answer",emptyAnswer:"Enter a number before submitting.",question:"I have streets, but no cars. I have cities, but no houses. I have rivers, but no water. What am I?",answer1:"A map",answer2:"A photograph",answer3:"A book",correct:"Correct! You completed the stage.",wrong:"Not this time. One life was deducted. The explanation will not appear automatically.",noLives:"You are out of lives. Recover one by watching an ad when integration is available.",hint:"Hint",solution:"Reveal solution",hintUnavailable:"Coin purchases and rewarded ads will be connected in the monetization stage.",solutionUnavailable:"The answer and explanation reveal will be available through coins or an ad in the monetization stage.",close:"Close",next:"Continue",alreadyDone:"Stage already completed. Its reward cannot be earned again.",reward:"You received 10 coins.",daily:"Daily challenge",regionName:"Region",regionRange:"Stages",current:"Current",done:"Completed",locked:"Locked"},
es:{welcomeEyebrow:"TU INGENIO, TU DESAFÍO",welcomeTitle:"Piensa. Descubre. Avanza.",welcomeText:"Mil niveles de lógica, observación y deducción.",lives:"Vidas",coins:"Monedas",completed:"Completadas",journey:"TU RECORRIDO",mapTitle:"Mapa de niveles",legendDone:"Completada",legendCurrent:"Disponible",legendLocked:"Bloqueada",dailyEyebrow:"DESAFÍO ESPECIAL",dailyTitle:"Desafío diario",dailyText:"Una misión al día. Sin perder vidas.",dailyButton:"Ver desafío",offlineNote:"Tu progreso se guarda en este dispositivo. El juego está preparado para funcionar sin conexión.",settingsEyebrow:"PERSONALIZA",settingsTitle:"Configuración",language:"Idioma",sound:"Audio",music:"Música de fondo",effects:"Efectos de sonido",musicVolume:"Volumen de música",effectsVolume:"Volumen de efectos",accessibility:"Accesibilidad",textSize:"Texto más grande",contrast:"Alto contraste",reduceMotion:"Reducir animaciones",settingsNote:"Las preferencias se guardan solo en este dispositivo. El audio y los anuncios se conectarán más adelante.",region:"Región",phase:"Nivel",dailyUnavailable:"El desafío diario se añadirá con el primer paquete de preguntas revisadas.",orderProgress:"Selecciona los elementos en el orden correcto.",resetOrder:"Rehacer orden",submitSelection:"Confirmar selección",notReady:"Este nivel todavía está en producción. El contenido se publicará después de revisarlo.",questionType:"RETO DE LÓGICA",numericPlaceholder:"Escribe tu respuesta",submitAnswer:"Confirmar respuesta",emptyAnswer:"Escribe un número antes de confirmar.",question:"Tengo calles, pero no coches. Tengo ciudades, pero no casas. Tengo ríos, pero no agua. ¿Qué soy?",answer1:"Un mapa",answer2:"Una fotografía",answer3:"Un libro",correct:"¡Correcto! Has completado el nivel.",wrong:"Esta vez no. Se descontó una vida. La explicación no aparecerá automáticamente.",noLives:"No tienes vidas. Recupera una viendo un anuncio cuando la integración esté disponible.",hint:"Pista",solution:"Ver solución",hintUnavailable:"Las compras con monedas y los anuncios recompensados se conectarán en la etapa de monetización.",solutionUnavailable:"La respuesta y su explicación estarán disponibles con monedas o un anuncio en la etapa de monetización.",close:"Cerrar",next:"Continuar",alreadyDone:"Nivel ya completado. No puedes volver a recibir la recompensa.",reward:"Has recibido 10 monedas.",daily:"Desafío diario",regionName:"Región",regionRange:"Niveles",current:"Actual",done:"Completada",locked:"Bloqueada"}
};
function t(k){return translations[state.settings.language][k]||translations.pt[k]||k}
function save(){localStorage.setItem("desafioLogico.save.v1",JSON.stringify(state.progress));localStorage.setItem("desafioLogico.settings.v1",JSON.stringify(state.settings))}
function load(){try{const p=JSON.parse(localStorage.getItem("desafioLogico.save.v1"));if(p)state.progress={...state.progress,...p}}catch{}try{const s=JSON.parse(localStorage.getItem("desafioLogico.settings.v1"));if(s)state.settings={...state.settings,...s}}catch{}}
function renderText(){document.documentElement.lang=state.settings.language==="pt"?"pt-BR":state.settings.language;document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));$("#lives-value").textContent=state.progress.lives;$("#coins-value").textContent=state.progress.coins;$("#progress-value").textContent=state.progress.completed.length+"/1000";const streakLabel=state.settings.language==="en"?"Daily streak: ":state.settings.language==="es"?"Racha diaria: ":"Sequência: ";const dayLabel=state.settings.language==="en"?" days":state.settings.language==="es"?" días":" dias";$("#daily-streak").textContent=streakLabel+(Number(state.progress.streak)||0)+dayLabel;document.body.classList.toggle("high-contrast",state.settings.highContrast);document.body.classList.toggle("large-text",state.settings.largeText);document.body.classList.toggle("reduce-motion",state.settings.reduceMotion)}
const regionEmojis=["🌱","🔎","🧠","🧩","🏛️","🗝️","🌌","⚙️","💎","🏆"];
function renderMap(){const tabs=$("#region-tabs");tabs.innerHTML="";for(let r=0;r<10;r++){const b=document.createElement("button");b.className="region-tab"+(r===state.region?" active":"");b.textContent=regionEmojis[r]+" "+(r+1);b.onclick=()=>{state.region=r;renderMap()};tabs.append(b)}const start=state.region*100+1,end=start+99;$("#region-count").textContent=(state.region+1)+"/10";$("#region-title").textContent=t("region")+" "+(state.region+1)+" "+regionEmojis[state.region];$("#region-subtitle").textContent=t("regionRange")+" "+start+"–"+end;const grid=$("#phase-grid");grid.innerHTML="";for(let n=start;n<=end;n++){const b=document.createElement("button");const done=state.progress.completed.includes(n);const hasContent=Boolean(phaseData[n]);const unlocked=hasContent&&(n===1||state.progress.completed.includes(n-1));b.className="phase-button"+(done?" done":unlocked?" available":"");b.textContent=done?"✓":unlocked?String(n):"🔒";b.disabled=!unlocked;b.setAttribute("aria-label",t("phase")+" "+n+(done?" — "+t("done"):unlocked?" — "+t("current"):" — "+t("locked")));if(unlocked)b.onclick=()=>openPhase(n);grid.append(b)}}
function showModal(html){$("#game-content").innerHTML=html;$("#game-dialog").showModal()}
async function loadPhaseData(){try{const response=await fetch("./data/phases.json");if(!response.ok)throw new Error("phase data unavailable");const pack=await response.json();phaseData=Object.fromEntries((pack.phases||[]).map(item=>[item.id,item]));phaseDataReady=true;renderMap();}catch(error){console.warn("Não foi possível carregar os desafios:",error);renderMap()}}
function openPhase(n){
if(state.progress.lives<=0){showModal("<p>"+t("noLives")+"</p>");return}
if(!phaseDataReady){showModal("<p>"+t("notReady")+"</p>");return}
if(state.progress.completed.includes(n)){showModal("<p>"+t("alreadyDone")+"</p>");return}
if(n!==1&&!state.progress.completed.includes(n-1)){showModal("<p>"+t("notReady")+"</p>");return}
const challenge=phaseData[n];
if(!challenge){showModal("<p>"+t("notReady")+"</p>");return}
activePhase=n;activeChallenge=challenge;answerSubmitted=false;orderSelection=[];
const lang=state.settings.language;const c=challenge.content[lang]||challenge.content.pt;
let interactionMarkup="";
if(challenge.interaction==="multi_select"){const options=(c.options||[]).map((option,index)=>'<label class="answer-option multi-option"><input type="checkbox" data-multi-answer="'+index+'"><span>'+option+'</span></label>').join("");interactionMarkup='<div class="answer-list">'+options+'</div><button class="primary-button" type="button" id="multi-submit">'+t("submitSelection")+'</button>';}else if(challenge.interaction==="order_items"){const items=(c.items||[]).map((item,index)=>'<button class="answer-option" type="button" data-order-item="'+index+'">'+item+'</button>').join("");interactionMarkup='<div class="answer-list" id="order-items">'+items+'</div><p class="small-note" id="order-progress">'+t("orderProgress")+'</p><button class="ghost-button" type="button" id="order-reset">'+t("resetOrder")+'</button>';}else if(challenge.interaction==="numeric_input"){
interactionMarkup='<div class="numeric-answer"><input id="numeric-answer" type="number" inputmode="numeric" autocomplete="off" aria-label="'+t("numericPlaceholder")+'" placeholder="'+t("numericPlaceholder")+'"><button class="primary-button" id="numeric-submit">'+t("submitAnswer")+'</button></div>';
}else{
const options=(c.options||[]).map((option,index)=>'<button class="answer-option" data-answer="'+index+'">'+option+'</button>').join("");
interactionMarkup='<div class="answer-list">'+options+'</div>';
}
showModal('<span class="question-type">'+t("questionType")+'</span><h3>'+c.title+'</h3><p class="question-text">'+c.question+'</p>'+interactionMarkup+'<div id="feedback"></div><div class="action-row"><button class="ghost-button" id="hint-btn">'+t("hint")+' · 5 🪙</button><button class="ghost-button" id="solution-btn">'+t("solution")+' · 15 🪙</button></div>');
document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>answer(Number(b.dataset.answer)));
if(challenge.interaction==="order_items"){document.querySelectorAll("[data-order-item]").forEach(b=>b.onclick=()=>selectOrderItem(Number(b.dataset.orderItem)));$("#order-reset").onclick=resetOrderSelection;}
if(challenge.interaction==="multi_select"){$("#multi-submit").onclick=submitMultiAnswer;}
if(challenge.interaction==="numeric_input"){
$("#numeric-submit").onclick=submitNumericAnswer;
$("#numeric-answer").addEventListener("keydown",e=>{if(e.key==="Enter")submitNumericAnswer()});
}
$("#hint-btn").onclick=()=>purchaseHint();
$("#solution-btn").onclick=()=>purchaseSolution();
}
function submitMultiAnswer(){if(answerSubmitted)return;const selected=[...document.querySelectorAll("[data-multi-answer]:checked")].map(input=>Number(input.dataset.multiAnswer)).sort((a,b)=>a-b);const expected=[...(activeChallenge.correctAnswers||[])].sort((a,b)=>a-b);const correct=selected.length===expected.length&&selected.every((value,index)=>value===expected[index]);const content=activeChallenge.content[state.settings.language]||activeChallenge.content.pt;answer(correct?content.answerIndex:-1)}
function resetOrderSelection(){if(answerSubmitted)return;orderSelection=[];document.querySelectorAll("[data-order-item]").forEach(b=>{b.disabled=false;b.classList.remove("selected")});$("#order-progress").textContent=t("orderProgress")}
function selectOrderItem(index){if(answerSubmitted||orderSelection.includes(index))return;orderSelection.push(index);const button=document.querySelector('[data-order-item="'+index+'"]');if(button){button.disabled=true;button.classList.add("selected")}const items=activeChallenge.content[state.settings.language]?.items||activeChallenge.content.pt.items;$("#order-progress").textContent=orderSelection.map((i,n)=>(n+1)+". "+items[i]).join("  →  ");if(orderSelection.length===activeChallenge.expectedOrder.length){const correct=orderSelection.every((value,i)=>value===activeChallenge.expectedOrder[i]);const content=activeChallenge.content[state.settings.language]||activeChallenge.content.pt;answer(correct?content.answerIndex:-1)}}
function submitNumericAnswer(){
const field=$("#numeric-answer");const raw=field.value.trim();
if(!raw){$("#feedback").innerHTML='<div class="feedback bad">'+t("emptyAnswer")+'</div>';field.focus();return}
const expected=String(activeChallenge.expectedAnswer??"").trim();
const content=activeChallenge.content[state.settings.language]||activeChallenge.content.pt;
answer(raw===expected?Number(content.answerIndex):-1);
}
function answer(choice){if(answerSubmitted||!activeChallenge)return;answerSubmitted=true;const feedback=$("#feedback");document.querySelectorAll("[data-answer],[data-order-item],[data-multi-answer],#multi-submit").forEach(b=>b.disabled=true);const numericSubmit=$("#numeric-submit");if(numericSubmit)numericSubmit.disabled=true;const numericField=$("#numeric-answer");if(numericField)numericField.disabled=true;const c=activeChallenge.content[state.settings.language]||activeChallenge.content.pt;if(choice===c.answerIndex){if(!state.progress.completed.includes(activePhase)){state.progress.completed.push(activePhase);state.progress.coins+=Number(10);save();renderText();renderMap()}feedback.innerHTML='<div class="feedback good">'+t("correct")+'<br>'+t("reward")+'</div><button class="primary-button" id="done-close">'+t("close")+'</button>';$("#done-close").onclick=()=>$("#game-dialog").close()}else{state.progress.lives=Math.max(0,state.progress.lives-1);save();renderText();feedback.innerHTML='<div class="feedback bad">'+(state.progress.lives===0?t("noLives"):t("wrong"))+'</div><button class="primary-button" id="retry-close">'+t("close")+'</button>';$("#retry-close").onclick=()=>$("#game-dialog").close()}}
function syncSettings(){const s=state.settings;$("#language-select").value=s.language;$("#music-toggle").checked=s.music;$("#effects-toggle").checked=s.effects;$("#music-volume").value=s.musicVolume;$("#effects-volume").value=s.effectsVolume;$("#large-text").checked=s.largeText;$("#high-contrast").checked=s.highContrast;$("#reduce-motion").checked=s.reduceMotion}
function bindSettings(){const map={"language-select":["language",v=>v],"music-toggle":["music",v=>v],"effects-toggle":["effects",v=>v],"music-volume":["musicVolume",Number],"effects-volume":["effectsVolume",Number],"large-text":["largeText",v=>v],"high-contrast":["highContrast",v=>v],"reduce-motion":["reduceMotion",v=>v]};for(const [id,[key,cast]] of Object.entries(map))$("#"+id).addEventListener("change",e=>{state.settings[key]=cast(e.target.type==="checkbox"?e.target.checked:e.target.value);save();renderText()})}
$("#settings-open").onclick=()=>{$("#settings-dialog").showModal();syncSettings()};$("#daily-open").onclick=()=>openDailyChallenge();
load();if(state.progress.dailyLastDate&&state.progress.dailyLastDate!==dayBefore(dateKey()))state.progress.streak=0;bindSettings();renderText();renderMap();loadPhaseData();if("serviceWorker"in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));


// Recursos funcionais: dicas, solução e desafio diário.
const HINT_COST=5;
const SOLUTION_COST=15;
function showNotice(message,kind="good"){
 const target=$("#feedback")||$("#game-content");
 const box=document.createElement("div");box.className="feedback "+kind;box.textContent=message;
 target.replaceChildren(box);
}
function purchaseHint(){
 if(!activeChallenge||answerSubmitted)return;
 if(!Array.isArray(state.progress.hintsUsed))state.progress.hintsUsed=[];
 const lang=state.settings.language,c=activeChallenge.content[lang]||activeChallenge.content.pt;
 if(state.progress.hintsUsed.includes(activePhase)){showNotice((lang==="en"?"Hint: ":lang==="es"?"Pista: ":"Dica: ")+c.hint);return;}
 if(state.progress.coins<HINT_COST){showNotice(lang==="en"?"Not enough coins. A hint costs 5 coins.":lang==="es"?"No tienes monedas suficientes. La pista cuesta 5 monedas.":"Moedas insuficientes. A dica custa 5 moedas.","bad");return;}
 state.progress.coins-=HINT_COST;state.progress.hintsUsed.push(activePhase);save();renderText();
 showNotice((lang==="en"?"Hint: ":lang==="es"?"Pista: ":"Dica: ")+c.hint);
}
function purchaseSolution(){
 if(!activeChallenge)return;
 if(!Array.isArray(state.progress.solutionsUsed))state.progress.solutionsUsed=[];
 const lang=state.settings.language,c=activeChallenge.content[lang]||activeChallenge.content.pt;
 const alreadyUnlocked=state.progress.solutionsUsed.includes(activePhase);
 if(!alreadyUnlocked&&state.progress.coins<SOLUTION_COST){showNotice(lang==="en"?"Not enough coins. The solution costs 15 coins.":lang==="es"?"No tienes monedas suficientes. La solución cuesta 15 monedas.":"Moedas insuficientes. A solução custa 15 moedas.","bad");return;}
 if(!alreadyUnlocked){state.progress.coins-=SOLUTION_COST;state.progress.solutionsUsed.push(activePhase);save();renderText();}
 let answerText="";
 if(activeChallenge.interaction==="numeric_input")answerText=String(activeChallenge.expectedAnswer);
 else if(activeChallenge.interaction==="order_items")answerText=(activeChallenge.expectedOrder||[]).map(i=>c.items[i]).join(" → ");
 else if(activeChallenge.interaction==="multi_select")answerText=(activeChallenge.correctAnswers||[]).map(i=>c.options[i]).join(", ");
 else answerText=c.options[c.answerIndex];
 const target=$("#feedback");const box=document.createElement("div");box.className="feedback good";
 const heading=document.createElement("strong");heading.textContent=(lang==="en"?"Answer: ":lang==="es"?"Respuesta: ":"Resposta: ")+answerText;
 const explanation=document.createElement("p");explanation.textContent=c.explanation;box.append(heading,explanation);target.replaceChildren(box);
}
function dateKey(date=new Date()){return date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0")}
function dayBefore(key){const d=new Date(key+"T12:00:00");d.setDate(d.getDate()-1);return dateKey(d)}
function openDailyChallenge(){
 if(!phaseDataReady||!phaseData||!Object.keys(phaseData).length){showModal("<p>"+t("notReady")+"</p>");return;}
 const today=dateKey();
 if(!Array.isArray(state.progress.dailyDone))state.progress.dailyDone=[];
 if(state.progress.dailyDone.includes(today)){
 const lang=state.settings.language;
 showModal("<h2>"+t("daily")+"</h2><p>"+(lang==="en"?"You have already completed today's challenge. Come back tomorrow!":lang==="es"?"Ya completaste el desafío de hoy. ¡Vuelve mañana!":"Você já concluiu o desafio de hoje. Volte amanhã!")+"</p>");
 return;
 }
 const ids=Object.keys(phaseData).map(Number).filter(id=>!phaseData[id].interaction||phaseData[id].interaction==="choice").sort((a,b)=>a-b);
 const dayNumber=Math.floor(new Date(today+"T12:00:00").getTime()/86400000);
 const challenge=phaseData[ids[((dayNumber%ids.length)+ids.length)%ids.length]];
 const lang=state.settings.language,c=challenge.content[lang]||challenge.content.pt;
 const opts=c.options||[];
 const markup=opts.map((o,i)=>'<button class="answer-option" data-daily-answer="'+i+'">'+o+'</button>').join("");
 showModal('<span class="question-type">'+t("daily")+'</span><h3>'+c.title+'</h3><p class="question-text">'+c.question+'</p><div class="answer-list">'+markup+'</div><div id="daily-feedback"></div>');
 document.querySelectorAll("[data-daily-answer]").forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll("[data-daily-answer]").forEach(b=>b.disabled=true);
  const correct=Number(btn.dataset.dailyAnswer)===c.answerIndex;
  const area=$("#daily-feedback");
  const box=document.createElement("div");box.className="feedback "+(correct?"good":"bad");
  if(correct){
   const yesterday=dayBefore(today);
   state.progress.streak=state.progress.dailyLastDate===yesterday?(Number(state.progress.streak)||0)+1:1;
   state.progress.coins+=15;
   if(state.progress.streak%7===0)state.progress.coins+=35;
   state.progress.dailyLastDate=today;
   state.progress.dailyDone.push(today);
   save();renderText();
   box.textContent=lang==="en"?"Correct! You earned 15 coins"+(state.progress.streak%7===0?" and a 35-coin streak bonus!":"")+".":lang==="es"?"¡Correcto! Ganaste 15 monedas"+(state.progress.streak%7===0?" y un bono de 35 monedas por racha!":"")+".":"Resposta correta! Você ganhou 15 moedas"+(state.progress.streak%7===0?" e mais 35 moedas pelo bônus de 7 dias!":".");
  }else{
   state.progress.dailyDone.push(today);state.progress.streak=0;save();
   box.textContent=lang==="en"?"Not quite. Today's challenge is used; no lives were lost.":lang==="es"?"No es correcto. El desafío de hoy ya fue utilizado; no perdiste vidas.":"Não foi dessa vez. O desafio de hoje foi utilizado; nenhuma vida foi perdida.";
  }
  area.replaceChildren(box);
 });
}
