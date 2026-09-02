/* Traffic source: read UTMs on arrival, normalise to friendly names, remember for the session */
var BPC_SOURCE=(function(){
  function label(s,m,c){
    s=(s||'').toLowerCase();m=(m||'').toLowerCase();c=(c||'').toLowerCase();
    var ig=/^(ig|instagram)$/.test(s);
    var fb=/^(fb|facebook|meta)$/.test(s);
    var net=ig?'instagram':fb?'facebook':s;
    if(/link_in_bio|bio/.test(c)||/^bio$/.test(m))return net+' / bio';
    if(/^(paid|ad|ads|cpc|ppc|retargeting)$/.test(m))return net+' / ad';
    if(/^website$/.test(s))return 'website';
    if(/^(social|organic)$/.test(m))return net+' / organic';
    return m?net+' / '+m:net;
  }
  try{
    var q=new URLSearchParams(location.search);
    var s=q.get('utm_source');
    if(s){
      var l=label(s,q.get('utm_medium'),q.get('utm_content')||q.get('utm_campaign'));
      localStorage.setItem('bpc_source',l);
      localStorage.setItem('bpc_landing_url',location.origin+location.pathname+location.search.replace(/[?&](fbclid|gclid|_aem|igsh|msclkid)=[^&]*/g,'').replace(/^&/,'?'));
      return l;
    }
    var saved=localStorage.getItem('bpc_source');
    if(saved)return saved;
    var r=document.referrer||'';
    if(/brainperformancecoaching\.com/.test(r)&&!/^https?:\/\/assessment\./.test(r))return 'website';
    if(/instagram\.com/.test(r))return 'instagram / organic';
    if(/facebook\.com/.test(r))return 'facebook / organic';
    if(!r)return 'direct';
    return 'referral: '+r;
  }catch(e){return 'unknown';}
})();
/* 8D Landing — behaviour */
(function(){
var DIMS = [{"id":1,"name":"Focus & Attention","color":"#E63946","summary":"Direct and sustain mental concentration on what matters most — under pressure, fatigue and distraction.","detail":"Determines whether you execute your skills with precision from start to finish — or whether external factors, mistakes, or mental noise pull you away from your task."},{"id":2,"name":"Emotional Regulation","color":"#9B7DD4","summary":"Manage emotional responses so they support — rather than sabotage — performance.","detail":"Stay composed when frustration rises, recover quickly after setbacks, and prevent anxiety or anger from hijacking your execution in critical moments."},{"id":3,"name":"Confidence","color":"#E8B84B","summary":"Trust your preparation and capability regardless of opponent, conditions or recent results.","detail":"The difference between competing freely and decisively, and letting doubt, past failures, or comparison limit what you'll attempt."},{"id":4,"name":"Self-Talk","color":"#4A90D9","summary":"Use internal dialogue intentionally to keep yourself focused, composed and moving forward.","detail":"A mind that reinforces execution and resilience under pressure — versus one that spirals into criticism, catastrophizing or chaos when things get difficult."},{"id":5,"name":"Motivation","color":"#F5864B","summary":"Inner drive and commitment, independent of results, validation or rewards.","detail":"Push consistently through adversity, setbacks and the daily grind — rather than letting effort depend on circumstances, mood or others' expectations."},{"id":6,"name":"Self-Awareness","color":"#6B46C1","summary":"Recognise your mental patterns, emotional triggers and performance tendencies accurately.","detail":"Identify exactly what's working or limiting you mentally — rather than performing on autopilot or only seeing the gap in hindsight."},{"id":7,"name":"State Management","color":"#9DC63D","summary":"Deliberately enter and maintain the optimal mental and physical state for performance.","detail":"Compete in the zone consistently — instead of leaving your activation, focus and readiness to feel random, reactive or outside your control."},{"id":8,"name":"Visualisation","color":"#3DB5C4","summary":"Mentally rehearse performance using vivid, multi-sensory imagery.","detail":"Prime movement patterns, simulate pressure scenarios and pre-program responses — turning mental practice into a competitive advantage."}];

/* ─────────── 8D wheel (same as the main site) ─────────── */
var NS='http://www.w3.org/2000/svg',cx=240,cy=240,rO=142,rI=50,rL=rO+36,N=DIMS.length;
function el(t,a){var n=document.createElementNS(NS,t);for(var k in a){if(a[k]!=null)n.setAttribute(k,a[k]);}return n;}
function arc(i,r1,r0){
  var a0=i/N*Math.PI*2-Math.PI/2,a1=(i+1)/N*Math.PI*2-Math.PI/2;
  var x0=cx+r1*Math.cos(a0),y0=cy+r1*Math.sin(a0),x1=cx+r1*Math.cos(a1),y1=cy+r1*Math.sin(a1);
  var i0=cx+r0*Math.cos(a0),j0=cy+r0*Math.sin(a0),i1=cx+r0*Math.cos(a1),j1=cy+r0*Math.sin(a1);
  return 'M '+i0+' '+j0+' L '+x0+' '+y0+' A '+r1+' '+r1+' 0 0 1 '+x1+' '+y1+' L '+i1+' '+j1+' A '+r0+' '+r0+' 0 0 0 '+i0+' '+j0+' Z';
}
var stage=document.querySelector('[data-wheel]');
if(stage){
  var detail=document.querySelector('[data-wheel-detail]');
  var svg=el('svg',{viewBox:'0 0 480 480',role:'img','aria-label':'8-Dimension Method wheel'});
  var defs=el('defs');
  var f=el('filter',{id:'ws',x:'-20%',y:'-20%',width:'140%',height:'140%'});
  f.appendChild(el('feDropShadow',{dx:'0',dy:'6',stdDeviation:'6','flood-opacity':'0.18'}));
  defs.appendChild(f);
  DIMS.forEach(function(d,i){
    var g=el('radialGradient',{id:'sl'+i,cx:'50%',cy:'50%',r:'80%'});
    g.appendChild(el('stop',{offset:'0%','stop-color':d.color,'stop-opacity':'0.92'}));
    g.appendChild(el('stop',{offset:'100%','stop-color':d.color,'stop-opacity':'1'}));
    defs.appendChild(g);
  });
  svg.appendChild(defs);
  svg.appendChild(el('circle',{cx:cx,cy:cy,r:rO+4,fill:'none',stroke:'var(--line)','stroke-width':'1'}));
  var rotor=el('g',{filter:'url(#ws)','class':'wheel-rotor'}),paths=[],groups=[];
  DIMS.forEach(function(d,i){
    var g=el('g',{'class':'wheel-slice-g',tabindex:'0',role:'button','aria-label':d.name});
    var p=el('path',{d:arc(i,rO,rI),fill:'url(#sl'+i+')','class':'wheel-slice',stroke:'rgba(255,255,255,0.85)','stroke-width':'1.5'});
    g.appendChild(p);
    g.addEventListener('click',function(){paint(i);});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();paint(i);}});
    rotor.appendChild(g);paths.push(p);groups.push(g);
  });
  svg.appendChild(rotor);
  var labels=[];
  DIMS.forEach(function(d,i){
    var a=(i+.5)/N*Math.PI*2-Math.PI/2,x=cx+rL*Math.cos(a),y=cy+rL*Math.sin(a),c=Math.cos(a),an='middle';
    if(c>.25)an='start';else if(c<-.25)an='end';
    var g=el('g',{style:'cursor:pointer'});
    var t1=el('text',{x:x,y:y-6,'text-anchor':an,'dominant-baseline':'middle',style:'font-family:var(--font-mono);font-size:9px;font-weight:600;letter-spacing:0.18em;fill:var(--muted)'});
    t1.textContent='0'+(i+1);
    var t2=el('text',{x:x,y:y+8,'text-anchor':an,'dominant-baseline':'middle',style:'font-family:var(--font-display);font-size:14px;font-weight:600;fill:var(--ink)'});
    t2.textContent=d.name;
    g.appendChild(t1);g.appendChild(t2);
    g.addEventListener('click',function(){paint(i);});
    svg.appendChild(g);labels.push({num:t1,name:t2});
  });
  svg.appendChild(el('circle',{cx:cx,cy:cy,r:rI,fill:'var(--paper)',stroke:'var(--line)','stroke-width':'1'}));
  svg.appendChild(el('circle',{cx:cx,cy:cy,r:rI-6,fill:'none',stroke:'var(--brand)','stroke-width':'0.6','stroke-dasharray':'2 3',opacity:'0.5'}));
  var h1=el('text',{x:cx,y:cy-6,'text-anchor':'middle','dominant-baseline':'middle',fill:'var(--brand)',style:'font-family:var(--font-display);font-size:26px;font-weight:700'});
  h1.textContent='8D';svg.appendChild(h1);
  var h2=el('text',{x:cx,y:cy+14,'text-anchor':'middle','dominant-baseline':'middle',fill:'var(--muted)',style:'font-family:var(--font-mono);font-size:8px;letter-spacing:0.22em'});
  h2.textContent='METHOD';svg.appendChild(h2);
  stage.innerHTML='';stage.appendChild(svg);
  var dDot=detail&&detail.querySelector('.wheel-detail-dot'),
      dCap=detail&&detail.querySelector('.wheel-detail-cap'),
      dTit=detail&&detail.querySelector('.wheel-detail-title'),
      dTxt=detail?detail.querySelectorAll('.wheel-detail-text'):[];
  function paint(i){
    var d=DIMS[i];
    paths.forEach(function(p,k){p.setAttribute('d',arc(k,k===i?rO+6:rO,rI));});
    groups.forEach(function(g,k){g.classList.toggle('active',k===i);});
    labels.forEach(function(l,k){
      var on=k===i;
      l.num.style.fill=on?DIMS[k].color:'var(--muted)';
      l.name.style.fill=on?DIMS[k].color:'var(--ink)';
    });
    if(dDot)dDot.style.background=d.color;
    if(dCap)dCap.textContent='Dimension 0'+d.id;
    if(dTit)dTit.textContent=d.name;
    if(dTxt.length){dTxt[0].textContent=d.summary;if(dTxt[1])dTxt[1].textContent=d.detail;}
  }
  paint(0);
}

/* ─────────── 6-step qualifying form ─────────── */
var TOTAL=6,cur=1,data={};
var bar=document.getElementById('tfBar'),count=document.getElementById('tfCount');
function prog(){
  if(bar)bar.style.width=(cur/TOTAL*100)+'%';
  if(count)count.textContent=cur+' / '+TOTAL;
}
function goTo(n){
  var steps=document.querySelectorAll('.tf-step');
  if(n<1||n>TOTAL)return;
  try{window.dispatchEvent(new CustomEvent('bpc:step',{detail:n}));}catch(e){}
  steps.forEach(function(s){s.classList.remove('is-active');});
  var to=document.querySelector('.tf-step[data-step="'+n+'"]');
  if(to){to.classList.add('is-active');var inp=to.querySelector('input');if(inp)setTimeout(function(){inp.focus();},60);}
  cur=n;prog();
}
function err(msg){
  var e=document.querySelector('.tf-step[data-step="'+cur+'"] .tf-err');
  if(!e)return;
  if(msg){e.textContent=msg;e.classList.add('show');}else{e.classList.remove('show');}
}
function next(){
  var s=document.querySelector('.tf-step[data-step="'+cur+'"]');
  var inp=s.querySelector('input');
  if(inp){
    var v=inp.value.trim();
    if(!v){err('Please fill this in to continue.');return;}
    if(inp.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)){err('That email doesn\'t look right.');return;}
    data[inp.name]=v;
  }
  err('');
  if(cur===3){var cc=document.getElementById('tfCC');if(cc)data.phone=cc.value+' '+(data.phone||'');}
  goTo(cur+1);
}
function prev(){err('');goTo(cur-1);}
function pick(btn,key,isLast){
  var box=btn.closest('.tf-opts');
  box.querySelectorAll('.tf-opt').forEach(function(o){o.classList.remove('selected');});
  btn.classList.add('selected');
  data[key]=btn.dataset.val;
  err('');
  if(!isLast)setTimeout(function(){goTo(cur+1);},220);
}
async function submit(){
  var btn=document.getElementById('tfSubmit');
  if(!data.challenge||!data.duration){err('Please pick an option.');return;}
  btn.classList.add('tf-submitting');
  btn.textContent='Sending…';
  try{
    await fetch('https://formspree.io/f/xreoynwo',{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(Object.assign({_subject:'New 8D lead ('+BPC_SOURCE+') — '+(data.name||'')},data,{source:BPC_SOURCE,landing_url:(function(){try{return localStorage.getItem('bpc_landing_url')||location.href}catch(e){return location.href}})()}))
    });
  }catch(e){}
  try{if(typeof gtag==='function')gtag('event','form_submit',{source:BPC_SOURCE});}catch(e){}
  try{if(typeof fbq==='function')fbq('track','Lead',{content_name:'8D Assessment',source:BPC_SOURCE});}catch(e){}
  try{
    localStorage.setItem('bpc_completed','true');
    localStorage.setItem('bpc_name',data.name||'');
  }catch(e){}
  try{if(typeof gtag==='function')gtag('event','booking_redirect',{source:BPC_SOURCE});}catch(e){}
  try{if(typeof fbq==='function')fbq('track','Schedule',{source:BPC_SOURCE});}catch(e){}
  window.location.href='https://cal.com/iaiacolella-braincoach/discovery?name='+encodeURIComponent(data.name||'')+'&email='+encodeURIComponent(data.email||'')+'&utm_source='+encodeURIComponent(BPC_SOURCE);
}

document.querySelectorAll('[data-tf-next]').forEach(function(b){b.addEventListener('click',next);});
document.querySelectorAll('[data-tf-back]').forEach(function(b){b.addEventListener('click',prev);});
document.querySelectorAll('.tf-opt').forEach(function(b){
  b.addEventListener('click',function(){pick(b,b.dataset.key,b.dataset.key==='duration');});
});
var sub=document.getElementById('tfSubmit');
if(sub)sub.addEventListener('click',submit);
document.querySelectorAll('.tf-in').forEach(function(i){
  i.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();next();}});
});
prog();

/* Returning visitor */
(function(){
  var done=false,name='';
  try{done=localStorage.getItem('bpc_completed')==='true';name=(localStorage.getItem('bpc_name')||'').split(' ')[0];}catch(e){}
  if(!done)return;
  var wrap=document.querySelector('.tf-wrap');
  if(!wrap)return;
  wrap.innerHTML='<div class="tf-done">'
    +'<h3>'+(name?'Welcome back, '+name+'.':'Welcome back.')+'</h3>'
    +'<p>You have already sent your details. Book your call — you will get the 8D Assessment right after.</p>'
    +'<a class="btn btn-accent btn-lg" href="https://cal.com/iaiacolella-braincoach/discovery">Book your call <span class="arrow">&rarr;</span></a>'
    +'<br><button class="tf-reset" type="button">Start over with different details</button></div>';
  wrap.querySelector('.tf-reset').addEventListener('click',function(){
    try{localStorage.removeItem('bpc_completed');localStorage.removeItem('bpc_name');}catch(e){}
    window.location.reload();
  });
})();
})();

/* Funnel events → GA4 */
function bpcTrack(name,params){
  try{if(typeof gtag==='function')gtag('event',name,Object.assign({source:BPC_SOURCE},params||{}));}catch(e){}
}
function bpcMeta(name,params){
  try{if(typeof fbq==='function')fbq('track',name,params||{});}catch(e){}
}
function bpcMetaCustom(name,params){
  try{if(typeof fbq==='function')fbq('trackCustom',name,Object.assign({source:BPC_SOURCE},params||{}));}catch(e){}
}
(function(){
  var seen={};
  document.addEventListener('DOMContentLoaded',function(){
    bpcTrack('landing_view');
    var vid=document.querySelector('.lp-video iframe,.lp-video-frame iframe');
    if(vid)vid.addEventListener('load',function(){bpcTrack('video_loaded');},{once:true});
    var q=document.getElementById('qualify');
    if(q&&'IntersectionObserver' in window){
      new IntersectionObserver(function(es,o){
        if(es[0].isIntersecting){bpcTrack('form_seen');bpcMetaCustom('FormSeen');o.disconnect();}
      },{threshold:.4}).observe(q);
    }
    document.querySelectorAll('a[href*="cal.com"]').forEach(function(a){
      a.addEventListener('click',function(){bpcTrack('booking_click',{placement:'link'});});
    });
  });
  var started=false;
  function markStart(){
    if(started)return;started=true;
    bpcTrack('form_start',{step:1});
    bpcMeta('InitiateCheckout',{content_name:'8D Assessment form'});
  }
  document.addEventListener('DOMContentLoaded',function(){
    var f=document.getElementById('qualify');
    if(!f)return;
    ['input','change','click'].forEach(function(ev){
      f.addEventListener(ev,function(e){
        if(e.target.closest('.tf-step,.tf-opt,input,select,textarea'))markStart();
      },{passive:true});
    });
  });
  window.addEventListener('bpc:step',function(e){
    var n=e.detail;
    if(n>1)markStart();
    if(!seen['s'+n]){seen['s'+n]=1;if(n>1)bpcTrack('form_step',{step:n});}
  });
})();
