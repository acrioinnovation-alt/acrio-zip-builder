'use strict';

/* Desafio Lógico 1.0 — banco inicial de 200 desafios gerados por regras verificáveis. */
const FAMILIES = [
  {id:'palitos',name:'Palitos de fósforo',short:'PALITOS',icon:'🔥',description:'Mova, retire e reposicione palitos para transformar figuras e corrigir equações.',color:'blue'},
  {id:'balancas',name:'Balanças e pesos',short:'BALANÇAS',icon:'⚖️',description:'Use dedução e equilíbrio para descobrir o peso desconhecido.',color:'cyan'},
  {id:'figuras',name:'Equações com figuras',short:'FIGURAS',icon:'🍎',description:'Descubra o valor de frutas, objetos e símbolos escondidos nas equações.',color:'green'},
  {id:'recipientes',name:'Recipientes e quantidades',short:'RECIPIENTES',icon:'🧪',description:'Faça transferências, compare volumes e encontre a quantidade exata.',color:'gold'},
  {id:'codigo',name:'Código secreto',short:'CÓDIGO SECRETO',icon:'🔐',description:'Decifre sequências, símbolos, cores e combinações secretas.',color:'blue'}
];
const LEVELS = [
  {id:1,name:'Fácil',hint:'Aquecimento para sua mente',range:'01–10'},
  {id:2,name:'Médio',hint:'Agora começa o raciocínio',range:'11–20'},
  {id:3,name:'Difícil',hint:'Desafios para pensar diferente',range:'21–30'},
  {id:4,name:'Especialista',hint:'Só para mentes persistentes',range:'31–40'}
];
const $ = id => document.getElementById(id);
const state = {family:null,level:1,phase:1,current:null,answered:false,sound:true,coins:0,completed:new Set()};
const STORE_KEY='acrio_desafio_logico_1_progress_v1';

function loadProgress(){
  try{const saved=JSON.parse(localStorage.getItem(STORE_KEY)||'{}');state.coins=Number(saved.coins)||0;state.completed=new Set(Array.isArray(saved.completed)?saved.completed:[]);}catch(_){}
  updateProgress();
}
function saveProgress(){try{localStorage.setItem(STORE_KEY,JSON.stringify({coins:state.coins,completed:[...state.completed]}));}catch(_){}updateProgress();}
function keyFor(family,phase){return family+'-'+phase;}
function hash(n,salt){return (n*9301+49297+salt*233)%233280;}
function pick(seed,arr){return arr[hash(seed,arr.length)%arr.length];}
function uniqueOptions(correct,wrong){const opts=[String(correct),...wrong.map(String).filter(x=>String(x)!==String(correct))];return [...new Set(opts)].slice(0,4).sort((a,b)=>((a.length*7+a.charCodeAt(0))%13)-((b.length*7+b.charCodeAt(0))%13));}
function makeChallenge(family,phase){
  const level=Math.ceil(phase/10),within=(phase-1)%10+1,seed=phase+level*17;
  const difficulty=['','Fácil','Médio','Difícil','Especialista'][level];
  if(family==='palitos'){
    const a=8+(hash(seed,3)%9),b=2+(hash(seed,7)%Math.max(2,a-2)),c=a-b;
    const equation=a+' + '+b+' = '+c;
    return {title:'Uma igualdade impossível?',instruction:'A equação foi montada com palitos. Retire o palito vertical do sinal de adição para transformá-lo em subtração. Qual igualdade ficará correta?',visual:'<div class="puzzle-equation"><span class="match">'+a+'</span> <span class="match">+</span> <span class="match">'+b+'</span> <span class="match">=</span> <span class="match">'+c+'</span></div><div class="puzzle-note">🟡 Imagine cada traço como um palito de fósforo.</div>',answer:a+' − '+b+' = '+c,options:uniqueOptions(a+' − '+b+' = '+c,[a+' + '+b+' = '+c,a+' − '+c+' = '+b,b+' − '+a+' = '+c]),hint:'Ao retirar o traço vertical do sinal +, ele se transforma em −.',explanation:'Correto! '+a+' − '+b+' = '+c+'. O sinal de adição perdeu o palito vertical e virou subtração.'};
  }
  if(family==='balancas'){
    const x=3+(hash(seed,5)%18),add=2+(hash(seed,9)%12),total=x+add;
    const wrong=[x+1,x+2,Math.max(1,x-2)];
    return {title:'Encontre o peso escondido',instruction:'A balança está em equilíbrio. Se um lado tem um peso desconhecido e mais '+add+' kg, e o outro lado tem '+total+' kg, quanto vale o peso desconhecido?',visual:'<div class="puzzle-tile">⚖️</div><div class="puzzle-equation"><span class="unknown">?</span> + '+add+' kg <span class="match">＝</span> '+total+' kg</div><div class="puzzle-note">Os dois lados têm exatamente o mesmo peso.</div>',answer:x+' kg',options:uniqueOptions(x+' kg',wrong.map(v=>v+' kg')),hint:'Retire '+add+' kg dos dois lados da igualdade.',explanation:'Isso mesmo! '+total+' − '+add+' = '+x+' kg. O peso desconhecido é '+x+' kg.'};
  }
  if(family==='figuras'){
    const apple=2+(hash(seed,4)%8),pear=1+(hash(seed,8)%7),star=apple+pear;
    const ask=['🍎 + 🍎 = '+(apple*2)+'\n🍎 + 🍐 = '+(apple+pear)+'\n🍐 + ⭐ = '+(pear+star)+'\n⭐ = ?','🍎 + 🍐 = '+(apple+pear)+'\n🍎 = '+apple+'\n🍐 = ?'][phase%2];
    const answer=phase%2?pear:star;
    return {title:'O valor das figuras',instruction:'Cada figura representa sempre o mesmo número. Observe as equações e descubra o valor que falta.',visual:'<div class="puzzle-equation" style="white-space:pre-line">'+ask+'</div><div class="puzzle-note">🍎 Maçã　 🍐 Pera　 ⭐ Estrela</div>',answer:String(answer),options:uniqueOptions(answer,[answer+1,Math.max(0,answer-1),answer+3]),hint:'Use a primeira equação para descobrir o valor da maçã e depois substitua na próxima.',explanation:'Boa! As figuras mantêm o mesmo valor em todas as linhas. O resultado correto é '+answer+'.'};
  }
  if(family==='recipientes'){
    const big=5+(hash(seed,2)%8),small=2+(hash(seed,6)%Math.max(2,big-2)),target=big-small;
    return {title:'Meça a quantidade certa',instruction:'Você tem um recipiente com '+big+' litros e outro com '+small+' litros. Ao transferir a quantidade do menor para completar a comparação, qual é a diferença entre os volumes?',visual:'<div class="puzzle-tile" style="font-size:35px">🧪</div><div class="puzzle-equation">'+big+' L <span class="unknown">−</span> '+small+' L <span class="match">＝</span> <span class="unknown">?</span></div><div class="puzzle-note">Recipiente A: '+big+' litros　|　Recipiente B: '+small+' litros</div>',answer:target+' litros',options:uniqueOptions(target+' litros',[target+1+' litros',Math.max(1,target-1)+' litros',big+small+' litros']),hint:'Compare os volumes e subtraia a quantidade menor da maior.',explanation:'Exato! '+big+' − '+small+' = '+target+' litros de diferença.'};
  }
  const start=2+(hash(seed,3)%8),step=1+(hash(seed,7)%5),seq=[start,start+step,start+step*2,start+step*3,'?'],answer=start+step*4;
  const colors=['🔴','🔵','🟡','🟢','🟣'];const color=colors[hash(seed,11)%colors.length];
  const isColor=phase%3===0;
  return {title:'Decifre o código',instruction:isColor?'Observe o padrão de cores e escolha o próximo símbolo.':'Descubra a regra da sequência numérica e encontre o próximo número.',visual:isColor?'<div class="puzzle-equation" style="font-size:38px">'+[0,1,2,3].map(i=>colors[(i+phase)%colors.length]).join('　')+'　<span class="unknown">?</span></div><div class="puzzle-note">O padrão se repete sempre na mesma ordem.</div>':'<div class="puzzle-equation">'+seq.join('　·　')+'</div><div class="puzzle-note">Encontre a regra que conecta cada número.</div>',answer:isColor?colors[(4+phase)%colors.length]:String(answer),options:isColor?uniqueOptions(colors[(4+phase)%colors.length],[...colors].filter(c=>c!==colors[(4+phase)%colors.length]).slice(0,3)):uniqueOptions(answer,[answer+step,answer-1,answer+2]),hint:isColor?'As cores seguem uma ordem circular. Depois da última, o padrão recomeça.':'Observe quanto cada número aumenta em relação ao anterior.',explanation:isColor?'Você identificou a repetição do padrão de cores.':'Muito bem! A sequência aumenta de '+step+' em '+step+'. O próximo número é '+answer+'.'};
}
function getChallenges(family){return Array.from({length:40},(_,i)=>makeChallenge(family,i+1));}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));$(id).classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function renderFamilies(){
  $('familyGrid').innerHTML=FAMILIES.map(f=>'<button class="family-card" data-family="'+f.id+'"><span class="family-count">40 FASES</span><span class="family-icon">'+f.icon+'</span><h3>'+f.name+'</h3><p>'+f.description+'</p></button>').join('');
  document.querySelectorAll('[data-family]').forEach(btn=>btn.addEventListener('click',()=>openFamily(btn.dataset.family)));
}
function openFamily(id){state.family=FAMILIES.find(f=>f.id===id);$('levelEyebrow').textContent=state.family.short;$('familyTitle').textContent=state.family.name;$('familyDescription').textContent=state.family.description;renderLevels();showScreen('levelsScreen');}
function renderLevels(){
  $('levelGrid').innerHTML=LEVELS.map(l=>{const done=Array.from({length:10},(_,i)=>state.completed.has(keyFor(state.family.id,(l.id-1)*10+i+1))).filter(Boolean).length;return '<button class="level-card" data-level="'+l.id+'"><span class="level-index">0'+l.id+'</span><h3>'+l.name+'</h3><p>'+l.hint+'</p><div class="level-foot"><span>10 desafios</span><b>'+done+'/10</b></div></button>';}).join('');
  document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>openLevel(Number(btn.dataset.level))));
}
function openLevel(level){state.level=level;$('phaseEyebrow').textContent=state.family.name.toUpperCase();$('phaseTitle').textContent=LEVELS[level-1].name+' — fases';renderPhases();showScreen('phasesScreen');}
function renderPhases(){
  const start=(state.level-1)*10+1;
  $('phaseGrid').innerHTML=Array.from({length:10},(_,i)=>{const phase=start+i,done=state.completed.has(keyFor(state.family.id,phase));return '<button class="phase-button '+(done?'done':'')+'" data-phase="'+phase+'">'+String(i+1).padStart(2,'0')+(done?' ✓':'')+'</button>';}).join('');
  document.querySelectorAll('[data-phase]').forEach(btn=>btn.addEventListener('click',()=>startChallenge(Number(btn.dataset.phase))));
}
function startChallenge(phase){state.phase=phase;state.current=makeChallenge(state.family.id,phase);state.answered=false;renderChallenge();showScreen('gameScreen');}
function renderChallenge(){
  const c=state.current,level=Math.ceil(state.phase/10),within=(state.phase-1)%10+1;
  $('gameFamilyName').textContent=state.family.short;$('gamePhaseNumber').textContent='FASE '+String(within).padStart(2,'0')+'/10';
  $('gameProgressBar').style.width=(within*10)+'%';$('challengeLevel').textContent=LEVELS[level-1].name.toUpperCase();$('challengeNumber').textContent='DESAFIO '+String(state.phase).padStart(2,'0')+'/40';
  $('challengeTitle').textContent=c.title;$('challengeInstruction').textContent=c.instruction;$('puzzleStage').innerHTML=c.visual;
  $('answerArea').innerHTML=c.options.map((o,i)=>'<button class="answer-option" data-answer="'+i+'">'+o+'</button>').join('');
  $('feedback').textContent='';$('feedback').className='feedback';$('nextButton').disabled=true;
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>checkAnswer(btn,btn.textContent)));
}
function checkAnswer(btn,value){
  if(state.answered)return;state.answered=true;
  const correct=String(value)===String(state.current.answer);
  if(correct){document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(String(b.textContent)===String(state.current.answer))b.classList.add('correct');});btn.classList.add('correct');$('feedback').textContent='✓ '+state.current.explanation;$('feedback').className='feedback good';const phaseKey=keyFor(state.family.id,state.phase);if(!state.completed.has(phaseKey)){state.coins+=10;state.completed.add(phaseKey);}saveProgress();$('nextButton').disabled=false;$('nextButton').textContent=state.phase===40?'CONCLUIR FAMÍLIA →':'PRÓXIMO DESAFIO →';}
  else{btn.classList.add('wrong');btn.disabled=true;state.answered=false;$('feedback').textContent='Ainda não. Tente outra alternativa!';$('feedback').className='feedback bad';$('nextButton').disabled=true;}
  $('coinCount').textContent=state.coins;
}
function nextChallenge(){
  if(state.phase===40){$('completeMessage').textContent='Você concluiu as 40 fases de '+state.family.name+'. Continue explorando as outras famílias!';showScreen('completeScreen');return;}
  const next=state.phase+1;
  if(Math.ceil(next/10)!==state.level){state.level=Math.ceil(next/10);renderLevels();}
  startChallenge(next);
}
function showHint(){if(!state.current)return;$('feedback').textContent='💡 Dica: '+state.current.hint;$('feedback').className='feedback';}
function updateProgress(){
  const count=state.completed.size;$('overallProgress').textContent=count+' de 200 concluídos';$('overallBar').style.width=(count/200*100)+'%';$('coinCount').textContent=state.coins;
}
$('startButton').addEventListener('click',()=>document.querySelector('.section-heading').scrollIntoView({behavior:'smooth'}));
$('homeBrand').addEventListener('click',e=>{e.preventDefault();showScreen('homeScreen');});
$('backHome').addEventListener('click',()=>showScreen('homeScreen'));
$('backLevels').addEventListener('click',()=>{renderLevels();showScreen('levelsScreen');});
$('backPhases').addEventListener('click',()=>{renderPhases();showScreen('phasesScreen');});
$('nextButton').addEventListener('click',nextChallenge);
$('hintButton').addEventListener('click',showHint);
$('continueButton').addEventListener('click',()=>{renderLevels();showScreen('levelsScreen');});
$('completeHome').addEventListener('click',()=>showScreen('homeScreen'));
$('soundToggle').addEventListener('click',()=>{state.sound=!state.sound;$('soundToggle').textContent=state.sound?'♫':'♪';$('soundToggle').style.color=state.sound?'#f4f8ff':'#718aa6';});
loadProgress();renderFamilies();