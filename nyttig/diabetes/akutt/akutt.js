/* © 2026 Reinertsengruppen · Akutt: valg, Ring 113, viktige personer og 15-minutters klokke. Ingenting sendes noe sted. */
(function(){
'use strict';
var EN=document.documentElement.lang==='en',ENK=document.documentElement.getAttribute('data-enkel')==='1';
var T=EN?{sek:'Ringing by itself in',s:'seconds',ring:'Call',lagt:'Add important people',lagtD:'Save up to two numbers in My profile.',start:'Start',stopp:'Stop',ute:'Time is up. Measure again.',tom:'Add',tomD:'number',prof:'../profil/index.html'}
          :{sek:'Ringer selv om',s:'sekunder',ring:'Ring',lagt:'Legg til viktige personer',lagtD:'Lagre opptil to numre i Min profil.',start:'Start',stopp:'Stopp',ute:'Tiden er ute. Mål igjen.',tom:'Legg til',tomD:'nummer',prof:'../profil/index.html'};
function $(i){return document.getElementById(i)}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
var TLF='<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1z"/>';
function tlf(c){return '<svg viewBox="0 0 24 24" fill="'+c+'" aria-hidden="true">'+TLF+'</svg>'}
var PLUS='<svg viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

/* ---- Viktige personer (samme lagring som Min profil) ---- */
function vip(){var l=null;try{l=JSON.parse(localStorage.getItem('rg-vip-liste')||'null')}catch(e){}
 if(!Array.isArray(l)){var o=null;try{o=JSON.parse(localStorage.getItem('rg-vip')||'null')}catch(e){}l=[o&&o.t?o:null]}
 return l.filter(function(v){return v&&v.t&&String(v.t).replace(/[^\d+]/g,'')}).slice(0,2)}
(function(){var box=$('vip');if(!box)return;var l=vip(),h='';
 if(ENK){
  l.forEach(function(v){var nr=String(v.t).replace(/[^\d+]/g,'');h+='<a class="app" href="tel:'+esc(nr)+'"><span class="icon" style="background:linear-gradient(160deg,#4ade80,#16a34a)">'+tlf('#fff')+'</span><span class="lb">'+esc(v.n||T.ring)+'</span></a>'});
  if(l.length<2)h+='<a class="app tom" href="'+T.prof+'"><span class="icon">'+PLUS+'</span><span class="lb">'+T.tom+'<small>'+T.tomD+'</small></span></a>';
 }else{
  l.forEach(function(v){var nr=String(v.t).replace(/[^\d+]/g,'');h+='<a class="row" href="tel:'+esc(nr)+'"><span class="ic" style="background:#dcfce7">'+tlf('#16a34a')+'</span><span class="tx"><b>'+T.ring+' '+esc(v.n||'')+'</b><span>'+esc(v.t)+'</span></span><span class="ch" aria-hidden="true">›</span></a>'});
  if(!l.length)h='<a class="row ny" href="'+T.prof+'"><span class="ic" style="background:#f1f5f9">'+PLUS+'</span><span class="tx"><b>'+T.lagt+'</b><span>'+T.lagtD+'</span></span><span class="ch" aria-hidden="true">›</span></a>';
 }
 box.innerHTML=h;})();

/* ---- Valg: ett åpent om gangen ---- */
var V=[].slice.call(document.querySelectorAll('.ak .v'));
V.forEach(function(b){b.addEventListener('click',function(){var open=b.getAttribute('aria-expanded')==='true';
 if(ENK&&open)return;
 V.forEach(function(x){x.setAttribute('aria-expanded','false');var p=$(x.getAttribute('aria-controls'));if(p)p.hidden=true});
 if(!open){b.setAttribute('aria-expanded','true');var p=$(b.getAttribute('aria-controls'));p.hidden=false;
  try{var r=(ENK?p:b).getBoundingClientRect();if(r.top<60||r.top>innerHeight*.6)(ENK?p:b).scrollIntoView({behavior:'smooth',block:'start'})}catch(e){}}});});

/* ---- Ring 113: ett trykk, så «Ring nå», ellers ringer den selv etter 5 sekunder ---- */
var ov=$('ov'),cnt=$('cnt'),ci=0,left=0,sist=null;
function slutt(ring){clearInterval(ci);ci=0;ov.hidden=true;document.documentElement.style.overflow='';if(ring)location.href='tel:113';else if(sist)try{sist.focus()}catch(e){}}
function start(){sist=document.activeElement;left=5;cnt.textContent=left;ov.hidden=false;document.documentElement.style.overflow='hidden';$('nu').focus();clearInterval(ci);
 ci=setInterval(function(){left--;if(left<=0)slutt(true);else cnt.textContent=left},1000)}
$('ring').addEventListener('click',start);$('nu').addEventListener('click',function(){slutt(true)});$('av').addEventListener('click',function(){slutt(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!ov.hidden)slutt(false)});
document.addEventListener('visibilitychange',function(){if(document.hidden&&!ov.hidden){clearInterval(ci);ci=0;ov.hidden=true;document.documentElement.style.overflow=''}});

/* ---- 15-minutters klokke (overlever at siden lastes på nytt) ---- */
var K='rg-ak-klokke',tid=$('tid'),txt=$('tidt'),bt=$('tst'),boks=$('tim'),ti=0,ac=null,t0=txt?txt.textContent:'';
function les(){try{return +localStorage.getItem(K)||0}catch(e){return 0}}
function sett(v){try{if(v)localStorage.setItem(K,String(v));else localStorage.removeItem(K)}catch(e){}}
function pip(){try{navigator.vibrate&&navigator.vibrate([400,200,400,200,600])}catch(e){}
 try{if(ac){[0,0.45,0.9].forEach(function(d){var o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;g.gain.value=0.25;o.connect(g);g.connect(ac.destination);o.start(ac.currentTime+d);o.stop(ac.currentTime+d+0.3)})}}catch(e){}}
function vis(){var slutt=les();if(!slutt){tid.textContent='15:00';txt.textContent=t0;bt.textContent=T.start;bt.classList.remove('stopp');boks.classList.remove('ute');return}
 var s=Math.round((slutt-Date.now())/1000);
 if(s<=0){clearInterval(ti);ti=0;sett(0);tid.textContent='0:00';txt.textContent=T.ute;bt.textContent=T.start;bt.classList.remove('stopp');boks.classList.add('ute');pip();return}
 tid.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');bt.textContent=T.stopp;bt.classList.add('stopp');boks.classList.remove('ute')}
if(bt){bt.addEventListener('click',function(){
  if(les()){sett(0);clearInterval(ti);ti=0;vis();return}
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)()}catch(e){}
  sett(Date.now()+15*60*1000);vis();clearInterval(ti);ti=setInterval(vis,1000)});
 if(les()){if(les()<Date.now()-30*60*1000)sett(0);else{vis();ti=setInterval(vis,1000)}}}
})();
