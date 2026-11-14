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
const state = {family:null,level:1,phase:1,journey:1,current:null,answered:false,sound:true,coins:0,completed:new Set()};
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
function balanceScaleIllustration(){
  return '<svg class="balance-scale-art" viewBox="0 0 220 126" role="img" aria-label="Balança de dois pratos em equilíbrio">'+
    '<defs><linearGradient id="goldMetal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b2"/><stop offset=".42" stop-color="#d99b3c"/><stop offset="1" stop-color="#80501e"/></linearGradient><linearGradient id="woodBase" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f6c76d"/><stop offset="1" stop-color="#8d4c25"/></linearGradient></defs>'+
    '<ellipse cx="110" cy="116" rx="74" ry="7" fill="#020b18" opacity=".38"/>'+
    '<path d="M110 20 L110 101 M96 104 L124 104 L110 20" fill="url(#goldMetal)" stroke="#75491f" stroke-width="2"/>'+
    '<path d="M49 34 Q110 20 171 34" fill="none" stroke="url(#goldMetal)" stroke-width="9" stroke-linecap="round"/>'+
    '<circle cx="110" cy="31" r="9" fill="#ffe5a0" stroke="#9b6427" stroke-width="3"/>'+
    '<path d="M51 37 L39 77 M51 37 L63 77 M169 37 L157 77 M169 37 L181 77" stroke="#e9b85c" stroke-width="3"/>'+
    '<path d="M28 77 Q51 98 74 77 Z M146 77 Q169 98 192 77 Z" fill="url(#goldMetal)" stroke="#8b5b27" stroke-width="2"/>'+
    '<rect x="82" y="99" width="56" height="10" rx="5" fill="url(#woodBase)" stroke="#80501e" stroke-width="2"/>'+
    '<path d="M94 109 L126 109 L135 117 L85 117 Z" fill="url(#woodBase)" stroke="#80501e" stroke-width="2"/>'+
    '</svg>';
}
function balanceAnimalIllustration(id){
  const common='<defs><linearGradient id="fur" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff0d5"/><stop offset="1" stop-color="#c58a55"/></linearGradient><linearGradient id="feather" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#9ff0a7"/><stop offset="1" stop-color="#168d68"/></linearGradient></defs>';
  let body='';
  if(id==='cat') body='<path d="M42 49 L39 20 L61 35 Q80 27 99 35 L121 20 L118 51 Q130 69 121 91 Q111 111 80 111 Q49 111 39 91 Q30 69 42 49Z" fill="url(#fur)" stroke="#875a37" stroke-width="3"/><path d="M43 49 L42 29 L58 42 M117 49 L118 29 L102 42" fill="#d88975"/><path d="M52 72 Q65 62 75 72 M85 72 Q96 62 108 72" fill="none" stroke="#513b31" stroke-width="4" stroke-linecap="round"/><ellipse cx="63" cy="62" rx="5" ry="7" fill="#4b9a78"/><ellipse cx="98" cy="62" rx="5" ry="7" fill="#4b9a78"/><path d="M75 79 Q80 85 85 79 L80 75Z" fill="#c66d75"/><path d="M80 84 Q70 93 62 86 M80 84 Q90 93 98 86" fill="none" stroke="#704a39" stroke-width="2"/><path d="M43 79 L16 74 M44 86 L17 89 M117 79 L144 74 M116 86 L143 89" stroke="#8c6548" stroke-width="2" stroke-linecap="round"/>';
  else if(id==='dog') body='<path d="M45 43 Q28 27 25 57 Q23 85 46 84 L51 68 Q80 83 109 68 L114 84 Q137 85 135 57 Q132 27 115 43 Q96 28 80 31 Q61 28 45 43Z" fill="#a96836" stroke="#704321" stroke-width="3"/><ellipse cx="80" cy="70" rx="43" ry="39" fill="#d99a55" stroke="#704321" stroke-width="3"/><ellipse cx="63" cy="61" rx="5" ry="7" fill="#35271f"/><ellipse cx="97" cy="61" rx="5" ry="7" fill="#35271f"/><ellipse cx="80" cy="81" rx="15" ry="12" fill="#f5d7ad"/><ellipse cx="80" cy="75" rx="7" ry="5" fill="#35271f"/><path d="M70 88 Q80 96 90 88" fill="none" stroke="#704321" stroke-width="3" stroke-linecap="round"/><path d="M45 103 Q80 119 115 103" fill="none" stroke="#a96836" stroke-width="10" stroke-linecap="round"/>';
  else body='<path d="M80 23 Q109 18 119 49 Q131 82 96 103 Q68 115 53 91 Q36 65 58 37 Q67 26 80 23Z" fill="url(#feather)" stroke="#116c56" stroke-width="3"/><path d="M63 57 Q80 35 102 48 Q117 62 100 83 Q80 95 63 75Z" fill="#f2d65e"/><path d="M109 50 Q139 45 143 60 Q135 74 110 67Z" fill="#f08b39" stroke="#a95024" stroke-width="2"/><circle cx="103" cy="43" r="5" fill="#172b37"/><circle cx="104" cy="42" r="1.5" fill="#fff"/><path d="M73 94 L68 111 M88 96 L91 111 M62 111 L76 111 M85 111 L99 111" stroke="#e9ad45" stroke-width="4" stroke-linecap="round"/><path d="M55 71 Q34 76 29 97 Q49 94 66 83" fill="#247cba" stroke="#155b8a" stroke-width="2"/>';
  return '<svg class="balance-animal-art" viewBox="0 0 160 130" role="img" aria-label="'+({cat:'Gato',dog:'Cachorro',bird:'Papagaio'}[id])+' ilustrado">'+common+'<ellipse cx="80" cy="119" rx="43" ry="5" fill="#020b18" opacity=".3"/>'+body+'</svg>';
}
function balanceScaleMarkup(left,right,kg,index){
  return '<article class="balance-clue">'+
    '<div class="balance-clue-label">PISTA '+index+'</div>'+
    balanceScaleIllustration()+
    '<div class="balance-photo-equation">'+
      '<div class="balance-animal-card">'+balanceAnimalIllustration(left.id)+'<span>'+left.name+'</span></div>'+
      '<span class="balance-plus">+</span>'+
      '<div class="balance-animal-card">'+balanceAnimalIllustration(right.id)+'<span>'+right.name+'</span></div>'+
    '</div>'+
    '<div class="balance-total">Juntos pesam <strong>'+kg+' kg</strong></div>'+
    '</article>';
}
function makeChallenge(family,phase){
  const level=Math.ceil(phase/10),within=(phase-1)%10+1,seed=phase+level*17;
  const difficulty=['','Fácil','Médio','Difícil','Especialista'][level];
  if(family==='palitos'){
    const a=5+(hash(seed,3)%5),b=1+(hash(seed,7)%Math.max(1,a-1)),c=a-b;
    return {title:'Corrija a igualdade com um palito',instruction:'Os números e sinais são construídos com palitos de fósforo. Toque no palito vertical do sinal de adição para retirá-lo e transformar + em −. Não há alternativas escritas: resolva manipulando o palito.',visual:'',match:{a,b,c},answer:a+' − '+b+' = '+c,options:[],hint:'Toque no palito vertical do sinal + para transformá-lo em −.',explanation:'Você retirou o palito vertical e transformou o sinal + em −. A igualdade ficou correta.'};
  }
  if(family==='balancas'){
    // Três balanças independentes fornecem três equações que precisam ser cruzadas.
    const animals=[
      {id:'cat',name:'gato',emoji:'🐱'},
      {id:'dog',name:'cachorro',emoji:'🐶'},
      {id:'bird',name:'pássaro',emoji:'🐦'}
    ];
    const weights={
      cat:4+(hash(seed,5)%8),
      dog:3+(hash(seed,9)%7),
      bird:2+(hash(seed,13)%6)
    };
    const sums=[
      {a:'cat',b:'dog',kg:weights.cat+weights.dog},
      {a:'dog',b:'bird',kg:weights.dog+weights.bird},
      {a:'cat',b:'bird',kg:weights.cat+weights.bird}
    ];
    const target=animals[(phase-1)%3];
    const correct=weights[target.id];
    const animalById=id=>animals.find(a=>a.id===id);
    const scales=sums.map((s,i)=>balanceScaleMarkup(animalById(s.a),animalById(s.b),s.kg,i+1)).join('');
    const wrong=[correct+1,correct+2,Math.max(1,correct-2)];
    return {
      title:'O mistério das três balanças',
      instruction:'As três balanças estão em equilíbrio. Cada animal sempre tem o mesmo peso. Cruze as pistas das três balanças e descubra quanto pesa o '+target.name+'.',
      visual:'<div class="balance-puzzle"><div class="balance-clues">'+scales+'</div><div class="balance-question">Quanto pesa o <strong>'+target.emoji+' '+target.name+'</strong>?</div></div>',
      answer:correct+' kg',
      options:uniqueOptions(correct+' kg',wrong.map(v=>v+' kg')),
      hint:'Não tente resolver uma balança isoladamente. Use as duas primeiras para relacionar os pesos e a terceira para descobrir o animal pedido.',
      explanation:'Correto! Cruzando as três balanças, o '+target.name+' pesa '+correct+' kg. Cada uma das três igualdades é necessária para encontrar um único valor.'
    };
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
function familyForJourney(n){return FAMILIES[(n-1)%FAMILIES.length];}
function phaseForJourney(n){return Math.floor((n-1)/FAMILIES.length)+1;}
function firstUncompletedJourney(){for(let n=1;n<=200;n++){const f=familyForJourney(n);if(!state.completed.has(keyFor(f.id,phaseForJourney(n))))return n;}return 200;}
function startChallenge(n){state.journey=n;state.family=familyForJourney(n);state.phase=phaseForJourney(n);state.level=Math.min(4,Math.ceil(n/50));state.current=makeChallenge(state.family.id,state.phase);state.answered=false;renderChallenge();showScreen('gameScreen');}
function matchDigit(n){const map={0:'abcdef',1:'bc',2:'abged',3:'abgcd',4:'fgbc',5:'afgcd',6:'afgecd',7:'abc',8:'abcdefg',9:'abfgcd'};return '<span class="match-digit">'+[...'abcdefg'].map(seg=>'<i class="stick seg-'+seg+' '+(map[n]&&map[n].includes(seg)?'on':'')+'"></i>').join('')+'</span>';}
function matchstickVisual(m){return '<div class="match-equation">'+matchDigit(m.a)+'<span class="match-operator"><i class="stick horizontal on"></i><button class="stick vertical on" id="removeMatch" aria-label="Retirar palito vertical do sinal de adição"></button></span>'+matchDigit(m.b)+'<span class="match-equals"><i></i><i></i></span>'+matchDigit(m.c)+'</div><div class="puzzle-note">Toque no próprio palito vertical do sinal + para retirá-lo.</div>';}
function renderChallenge(){
  const c=state.current;
  $('gameFamilyName').textContent=state.family.short;
  $('gamePhaseNumber').textContent='FASE '+String(state.journey).padStart(3,'0')+'/200';
  $('gameProgressBar').style.width=(state.journey/200*100)+'%';
  $('challengeLevel').textContent=LEVELS[state.level-1].name.toUpperCase();
  $('challengeNumber').textContent='JORNADA '+String(state.journey).padStart(3,'0')+'/200';
  $('challengeTitle').textContent=c.title;$('challengeInstruction').textContent=c.instruction;
  $('puzzleStage').innerHTML=state.family.id==='palitos'?matchstickVisual(c.match):c.visual;
  $('answerArea').innerHTML=state.family.id==='palitos'?'':c.options.map((o,i)=>'<button class="answer-option" data-answer="'+i+'">'+o+'</button>').join('');
  $('feedback').textContent='';$('feedback').className='feedback';$('nextButton').disabled=true;
  document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>checkAnswer(btn,btn.textContent)));
  const match=$('removeMatch');if(match)match.addEventListener('click',checkMatchstick);
}
function checkMatchstick(){
  if(state.answered)return;state.answered=true;
  $('removeMatch').classList.remove('on');$('removeMatch').classList.add('removed');
  document.querySelector('.match-operator').classList.add('minus');
  const k=keyFor(state.family.id,state.phase);if(!state.completed.has(k)){state.coins+=10;state.completed.add(k);}
  saveProgress();$('feedback').textContent='✓ '+state.current.explanation;$('feedback').className='feedback good';
  $('nextButton').disabled=false;$('nextButton').textContent=state.journey===200?'CONCLUIR JORNADA →':'PRÓXIMO DESAFIO →';$('coinCount').textContent=state.coins;
}
function checkAnswer(btn,value){
  if(state.answered)return;state.answered=true;
  const correct=String(value)===String(state.current.answer);
  if(correct){document.querySelectorAll('[data-answer]').forEach(b=>{b.disabled=true;if(String(b.textContent)===String(state.current.answer))b.classList.add('correct');});btn.classList.add('correct');$('feedback').textContent='✓ '+state.current.explanation;$('feedback').className='feedback good';const phaseKey=keyFor(state.family.id,state.phase);if(!state.completed.has(phaseKey)){state.coins+=10;state.completed.add(phaseKey);}saveProgress();$('nextButton').disabled=false;$('nextButton').textContent=state.journey===200?'CONCLUIR JORNADA →':'PRÓXIMO DESAFIO →';}
  else{btn.classList.add('wrong');btn.disabled=true;state.answered=false;$('feedback').textContent='Ainda não. Tente outra alternativa!';$('feedback').className='feedback bad';$('nextButton').disabled=true;}
  $('coinCount').textContent=state.coins;
}
function nextChallenge(){if(state.journey>=200){$('completeMessage').textContent='Você concluiu os 200 desafios da jornada!';showScreen('completeScreen');return;}startChallenge(state.journey+1);}
function showHint(){if(!state.current)return;$('feedback').textContent='💡 Dica: '+state.current.hint;$('feedback').className='feedback';}
function updateProgress(){
  const count=state.completed.size;$('overallProgress').textContent=count+' de 200 concluídos';$('overallBar').style.width=(count/200*100)+'%';$('coinCount').textContent=state.coins;
}
$('startButton').addEventListener('click',()=>startChallenge(firstUncompletedJourney()));
$('homeBrand').addEventListener('click',e=>{e.preventDefault();showScreen('homeScreen');});
$('backPhases').addEventListener('click',()=>showScreen('homeScreen'));
$('nextButton').addEventListener('click',nextChallenge);
$('hintButton').addEventListener('click',showHint);
$('continueButton').addEventListener('click',()=>startChallenge(firstUncompletedJourney()));
$('completeHome').addEventListener('click',()=>showScreen('homeScreen'));
$('soundToggle').addEventListener('click',()=>{state.sound=!state.sound;$('soundToggle').textContent=state.sound?'♫':'♪';$('soundToggle').style.color=state.sound?'#f4f8ff':'#718aa6';});
loadProgress();