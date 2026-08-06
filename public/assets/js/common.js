
const menuButton=document.querySelector('.menu-button');
const nav=document.querySelector('.nav');
if(menuButton&&nav){
  menuButton.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded',String(open));
  });
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

document.querySelectorAll('.cast-card').forEach(card=>{
  const video=card.querySelector('video');
  if(!video) return;
  const play=()=>{ video.currentTime=0; video.play().catch(()=>{}); };
  const stop=()=>{ video.pause(); video.currentTime=0; };
  card.addEventListener('mouseenter',play);
  card.addEventListener('mouseleave',stop);
  card.addEventListener('focusin',play);
  card.addEventListener('focusout',stop);
  card.addEventListener('touchstart',()=>{ if(video.paused) play(); else stop(); },{passive:true});
});
