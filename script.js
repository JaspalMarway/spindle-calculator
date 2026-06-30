const gapBtn=document.getElementById('gapBtn'),countBtn=document.getElementById('countBtn');
const gm=document.getElementById('gapMode'),cm=document.getElementById('countMode'),out=document.getElementById('out');
gapBtn.onclick=()=>{gm.style.display='block';cm.style.display='none';gapBtn.classList.add('active');countBtn.classList.remove('active');calc();}
countBtn.onclick=()=>{gm.style.display='none';cm.style.display='block';countBtn.classList.add('active');gapBtn.classList.remove('active');calc();}
document.querySelectorAll('input').forEach(i=>i.oninput=calc);
function calc(){
if(gm.style.display!='none'){
let L=+l1.value,W=+w1.value,G=+g1.value;if(!(L&&W&&G)){out.innerHTML='Enter values';return;}
let N=Math.ceil((L-G)/(W+G));
let gap=(L-N*W)/(N+1);
out.innerHTML=`<b>Spindles Required:</b> ${N}<br><b>Actual Gap:</b> ${gap.toFixed(2)} mm<br>${gap<=99?'✅ Complies':'❌ Over 99 mm'}`;
localStorage.setItem('vals',JSON.stringify({l:L,w:W,g:G}));
}else{
let L=+l2.value,W=+w2.value,N=+n2.value;if(!(L&&W&&N)){out.innerHTML='Enter values';return;}
let gap=(L-N*W)/(N+1);
out.innerHTML=`<b>Actual Gap:</b> ${gap.toFixed(2)} mm<br>${gap<=99?'✅ Complies':'❌ Over 99 mm'}`;
}}
let s=localStorage.getItem('vals');if(s){s=JSON.parse(s);l1.value=s.l;w1.value=s.w;g1.value=s.g;}calc();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js');}
