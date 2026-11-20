/* Simulador de anúncios para teste no navegador. Não exibe publicidade real. */
(function(){
 const $=s=>document.querySelector(s);
 let countdown=null;
 const rewardDialog=$("#reward-ad-dialog");
 const interstitialDialog=$("#interstitial-ad-dialog");
 function openReward(){
   if(!rewardDialog)return;
   const claim=$("#ad-claim"),label=$("#ad-countdown");
   claim.disabled=true;label.textContent="Aguarde 5 segundos…";
   rewardDialog.showModal();
   let seconds=5;
   clearInterval(countdown);
   countdown=setInterval(()=>{
     seconds--;
     if(seconds<=0){clearInterval(countdown);label.textContent="Anúncio de teste concluído. Você pode receber 1 vida.";claim.disabled=false;}
     else label.textContent="Aguarde "+seconds+" segundos…";
   },1000);
 }
 $("#reward-ad-open")?.addEventListener("click",openReward);
 $("#ad-cancel")?.addEventListener("click",()=>{clearInterval(countdown);rewardDialog.close()});
 $("#ad-claim")?.addEventListener("click",()=>{
   if($("#ad-claim").disabled)return;
   state.progress.lives=Math.min(5,Number(state.progress.lives||0)+1);
   save();renderText();rewardDialog.close();
   showModal("<div class='feedback good'>Vida de teste adicionada! Você pode continuar jogando.</div><button class='primary-button' id='reward-done'>Continuar</button>");
   $("#reward-done").onclick=()=>$("#game-dialog").close();
 });
 $("#interstitial-close")?.addEventListener("click",()=>interstitialDialog.close());
 const originalAnswer=window.answer;
 if(typeof originalAnswer==="function"){
   window.answer=function(choice){
     const challenge=activeChallenge;
     const correct=!!challenge&&choice===(challenge.content[state.settings.language]||challenge.content.pt).answerIndex;
     originalAnswer(choice);
     if(correct){
       const done=$("#done-close");
       if(done){
         const old=done.onclick;
         done.onclick=function(){if(old)old.call(this);interstitialDialog.showModal();};
       }
     }
   };
 }
})();