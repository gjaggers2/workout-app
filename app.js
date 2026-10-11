'use strict';
let DOFF=0;
function now(){const q=new URLSearchParams(location.search).get('date')||localStorage.getItem('tacfit-date');return q?new Date(q+'T12:00'):new Date()}
const $=s=>document.querySelector(s),V=$('#view');
const K='tacfit-v1';
const def={unit:'lb',days:5,start:iso(monday(now())),orm:{squat:225,front:185,bench:185,press:115,deadlift:275,pushpress:145},prs:{},block:1,logs:[],draft:null};
let S=load();
function load(){try{const o=Object.assign({},def,JSON.parse(localStorage.getItem(K))||{});o.orm=Object.assign({},def.orm,o.orm);o.prs=o.prs||{};return o}catch(e){return JSON.parse(JSON.stringify(def))}}
function save(){localStorage.setItem(K,JSON.stringify(S))}
function iso(d){const z=new Date(d);z.setMinutes(z.getMinutes()-z.getTimezoneOffset());return z.toISOString().slice(0,10)}
function monday(d){d=new Date(d);const w=(d.getDay()+6)%7;d.setDate(d.getDate()-w);d.setHours(0,0,0,0);return d}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function rnd(x){const s=S.unit==='kg'?2.5:5;return Math.round(x/s)*s}
function e1rm(w,r){r=+r;w=+w;if(!w||!r)return 0;return r===1?w:w*(1+r/30)}

// ---- Program ----
const WEEKS=[
 {n:'Week 1 · Accumulate',main:{s:5,r:5,p:.70},acc:'3x10',bike:'8 x 20s ALL-OUT / 1:40 easy',run:'3 mi easy',tempo:'4 x 800m @ 5K pace / 2:00 jog',long:'4 mi steady',cond:'5 rounds: 15 cal bike, 10 burpees, 200m run'},
 {n:'Week 2 · Build',main:{s:5,r:4,p:.75},acc:'3x10',bike:'10 x 20s ALL-OUT / 1:40 easy',run:'3.5 mi easy',tempo:'5 x 800m @ 5K pace / 2:00 jog',long:'5 mi steady',cond:'6 rounds: 15 cal bike, 10 burpees, 200m run'},
 {n:'Week 3 · Intensify',main:{s:5,r:3,p:.82},acc:'4x8',bike:'6 x 30s ALL-OUT / 1:30 easy + 10 min Z2',run:'4 mi easy',tempo:'6 x 800m @ 5K pace / 1:45 jog',long:'6 mi steady',cond:'7 rounds: 15 cal bike, 10 burpees, 200m run'},
 {n:'Week 4 · Deload',main:{s:3,r:5,p:.60},acc:'2x10',bike:'5 x 20s hard / 2:00 easy',run:'2.5 mi easy',tempo:'3 x 800m @ 5K pace',long:'3 mi easy',cond:'3 rounds easy pace, focus on form'}];
function blockWeek(d=now()){const w=Math.floor((monday(d)-new Date(S.start+'T00:00'))/6048e5);return((w%4)+4)%4}
function M(lift,w,mod=0){const m=WEEKS[w].main,p=m.p+mod;return{name:cap(lift),lift,sets:m.s,reps:m.r,load:rnd(S.orm[lift]*p),pct:Math.round(p*100)}}
function A(name,w,note){return{name,sets:+WEEKS[w].acc.split('x')[0],reps:WEEKS[w].acc.split('x')[1],note}}
function cap(s){return s[0].toUpperCase()+s.slice(1)}
const DAYS={
 lower:w=>({title:'Lower Strength + Bike Intervals',tag:'STRENGTH',ex:[M('squat',w),A('Romanian Deadlift',w,'moderate, controlled'),A('Walking Lunge (DB)',w,'reps per leg'),A('Hanging Knee Raise',w)],cond:[{t:'bike',d:'Echo Bike: '+WEEKS[w].bike}]}),
 push:w=>({title:'Upper Push: Bench & Shoulders',tag:'STRENGTH',ex:[M('bench',w),{...M('press',w,-.1),name:'Overhead Press (volume)'},A('DB Incline Press',w),A('Pull-ups / Rack Rows',w,'balance pushing'),A('DB Lateral Raise',w),A('Face Pull / Band Pull-apart',w)],cond:[]}),
 run:w=>({title:'Run: Intervals',tag:'RUN',ex:[],cond:[{t:'run',d:'Warm-up 1 mi easy'},{t:'run',d:WEEKS[w].tempo},{t:'run',d:'Cool-down 0.5–1 mi'}],extra:'Mobility 10 min: hips, t-spine, ankles'}),
 full:w=>({title:'Full Body: Press & Pull',tag:'STRENGTH',ex:[M('press',w),{...M('pushpress',w,-.1),name:'Push Press',sets:3}, M('deadlift',w),{...M('front',w,-.1),name:'Front Squat'},A('Weighted Push-ups',w),A('Farmer Carry',w,'40m per set'),A('Plank',w,'seconds')],cond:[{t:'bike',d:'Echo Bike: 10 min Zone 2 flush'}]}),
 cond:w=>({title:'Conditioning + Long Run',tag:'ENGINE',ex:[],cond:[{t:'mix',d:WEEKS[w].cond},{t:'run',d:'Later or next AM — Long run: '+WEEKS[w].long}],extra:'Optional ruck substitute for long run'})};
// weekday 0=Sun..6=Sat
const SCHED={5:{1:'lower',2:'push',3:'run',4:'full',5:'cond'},4:{1:'lower',2:'push',4:'full',6:'cond'}};
function dayPlan(date){if(S.subs&&S.subs[iso(date)]){const o=dayPlan2(date);return{title:'Jiu-Jitsu Session',tag:'BJJ',key:'bjj',week:blockWeek(date),ex:[],cond:[{t:'bjj',d:'Substituted for: '+(o?o.title:'rest day')+'. Lifts carry their last targets forward.'}],sub:true}}return dayPlan2(date)}
function dayPlan2(date){const wd=date.getDay(),k=SCHED[S.days][wd];if(!k)return null;const w=blockWeek(date),p=DAYS[k](w);p.key=k;p.week=w;
 if(S.days==4&&k==='full'){p.cond=[{t:'run',d:'Run intervals: '+WEEKS[w].tempo}];p.title+=' + Run'}autoreg(p,date);return p}

// ---- Render ----
function header(){const w=blockWeek();$('#blockinfo').innerHTML=`Block ${S.block||1} · ${WEEKS[w].n}<br>${S.days}-day · ${S.unit}`}
function planCard(p,date){if(!p)return`<div class="card"><b>REST / RECOVERY</b><p class="mut">Walk, mobility, sleep. Optional 20–30 min easy Echo Bike Zone 2.</p></div>`;
 return`<div class="card"><span class="tag">${p.tag}</span><span class="tag">${WEEKS[p.week].n.split(' · ')[1]}</span><h3 style="margin:8px 0">${p.title}</h3>
 ${p.ex.map(e=>`<div class="ex"><div><b>${esc(e.name)}</b><small>${e.sets} x ${e.reps}${e.note?' · '+esc(e.note):''}</small>${e.last?`<small style="display:block">Last week: ${esc(e.last)}</small><small style="display:block;color:#9bb06b">🎯 Target: ${esc(e.target)}</small>`:''}</div><div class="ld">${e.load?e.load+' '+S.unit+'<br><small>'+e.pct+'% 1RM</small>':''}</div></div>`).join('')}
 ${p.cond.map(c=>`<div class="ex"><div><b>${c.t==='bjj'?'🥋 Jiu-Jitsu':c.t==='bike'?'🚴 Echo Bike':c.t==='run'?'🏃 Run':'🔥 Conditioning'}</b><small>${esc(c.d)}</small></div></div>`).join('')}
 ${cmpHTML(p)}${p.extra?`<p class="mut">${p.extra}</p>`:''}</div>`}
const R={
 today(){const t=now(),d=addDays(t,DOFF),ds=iso(d),past=ds<iso(t),isT=ds===iso(t),p=dayPlan(d),logs=S.logs.filter(l=>l.date===ds),sub=S.subs&&S.subs[ds];
  const nav=`<div style="display:flex;gap:8px;align-items:center;margin-top:6px"><button class="btn sec" style="width:64px;margin:0" onclick="DOFF--;go('today')" aria-label="Previous day">◀</button><div style="flex:1;text-align:center"><b>${d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}</b><div class="mut">${isT?'Today':past?'Past':'Upcoming'}</div></div><button class="btn sec" style="width:64px;margin:0" onclick="DOFF++;go('today')" aria-label="Next day">▶</button></div>${isT?'':`<button class="btn sec sm" onclick="DOFF=0;go('today')">Jump to Today</button>`}`;
  let body='';
  if(past&&logs.length)body=`<h2>Logged</h2>`+logs.map(logCard).join('')+`<h2>Planned</h2>`+planCard(p,d);
  else if(past)body=`<div class="card"><b>${p?'Not logged':'Rest day'}</b>${p?'<div class="mut">Planned workout below</div>':''}</div>`+planCard(p,d);
  else body=planCard(p,d)+(logs.length?`<div class="card"><b>✔ Logged:</b> ${logs.map(l=>esc(l.title)).join(', ')}</div>`:'');
  const subBtn=p||sub?(sub?`<button class="btn sec sm" onclick="setSub('${ds}',0)">↩ Undo Jiu-Jitsu substitution</button>`:`<button class="btn sec sm" onclick="setSub('${ds}',1)">🥋 Substitute: Jiu-Jitsu</button>`):'';
  V.innerHTML=(isT?rollCardHTML():'')+nav+body+`<button class="btn" onclick="startLog(${p?1:0},'${ds}')">${S.draft?'Resume Workout':p?(past?'Log This Day':'Start This Workout'):'Log Other Session'}</button>`+subBtn+(isT?weeklySummary():'')},
 plan(){const m=monday(now());let h='<h2>This week</h2>';for(let i=0;i<7;i++){const d=new Date(m);d.setDate(m.getDate()+i);h+=`<div class="mut" style="margin-top:10px">${d.toLocaleDateString(undefined,{weekday:'long'})}</div>`+planCard(dayPlan(d),d)}
  h+=`<h2>4-week block</h2><div class="card">${WEEKS.map((w,i)=>`<div class="pr"><span>${w.n}</span><span class="ld">${w.main.s}x${w.main.r} @ ${Math.round(w.main.p*100)}%</span></div>`).join('')}<p class="mut">Main lifts load from your 1RMs. After week 4, retest or bump 1RMs (+5–10 lb lower, +5 lb upper) in Settings and repeat.</p></div>`;V.innerHTML=h},
 log(){if(!S.draft)S.draft=blank(null);const D=S.draft;
  V.innerHTML=`<h2>Log session</h2><div class="card"><label>Date</label><input type="date" value="${D.date}" oninput="S.draft.date=this.value;save()">
  <label>Title</label><input value="${esc(D.title)}" oninput="S.draft.title=this.value;save()"></div>
  ${D.ex.map((e,i)=>`<div class="card"><div style="display:flex;gap:6px"><input value="${esc(e.name)}" placeholder="Exercise" oninput="S.draft.ex[${i}].name=this.value;save()"><button class="x" style="width:48px" onclick="S.draft.ex.splice(${i},1);go('log')">✕</button></div>
   ${e.last?`<div class="mut" style="margin-top:6px">Last week: ${esc(e.last)}</div>`:''}${e.target?`<div style="margin-top:4px;color:#9bb06b;font-size:14px">🎯 Target: ${esc(e.target)}</div>`:''}
   <div class="set mut"><span>#</span><span>${S.unit}</span><span>reps</span><span></span></div>
   ${e.sets.map((s,j)=>`<div class="set"><span class="mut">${j+1}</span><input inputmode="decimal" value="${s.w}" oninput="S.draft.ex[${i}].sets[${j}].w=this.value;save()"><input inputmode="numeric" value="${s.r}" oninput="S.draft.ex[${i}].sets[${j}].r=this.value;save()"><button class="x" onclick="S.draft.ex[${i}].sets.splice(${j},1);go('log')">✕</button></div>`).join('')}
   <button class="btn sec sm" onclick="addSet(${i})">+ Set</button></div>`).join('')}
  <button class="btn sec" onclick="S.draft.ex.push({name:'',sets:[{w:'',r:''}]});go('log')">+ Exercise</button>${D.bjj?`<h2>🥋 Jiu-Jitsu</h2><div class="card"><div class="row2"><div><label>Duration (min)</label><input inputmode="numeric" value="${D.bjj.min}" oninput="S.draft.bjj.min=this.value;save()"></div><div><label>Rounds</label><input inputmode="numeric" value="${D.bjj.rounds}" oninput="S.draft.bjj.rounds=this.value;save()"></div></div>
  <label>Type</label><div class="seg">${['gi','no-gi','drilling','open mat'].map(t=>`<button class="${D.bjj.type===t?'on':''}" onclick="S.draft.bjj.type='${t}';save();go('log')">${t}</button>`).join('')}</div>
  <label>Intensity (RPE ${D.bjj.rpe})</label><input type="range" min="1" max="10" value="${D.bjj.rpe}" style="min-height:44px" oninput="S.draft.bjj.rpe=this.value;this.previousElementSibling.textContent='Intensity (RPE '+this.value+')';save()"></div>`:`<button class="btn sec sm" onclick="S.draft.bjj={min:'60',type:'gi',rounds:'',rpe:'7'};go('log')">+ Add Jiu-Jitsu</button>`}
  <h2>🏃 Run</h2><div class="card">${D.cmp&&D.cmp.runLast?`<div class="mut">Last week: ${D.cmp.runLast}</div><div style="color:#9bb06b;font-size:14px">🎯 Beat: ${D.cmp.runTarget}</div>`:''}<div class="row"><div><label>Distance (${S.unit==='kg'?'km':'mi'})</label><input inputmode="decimal" value="${D.run.dist}" oninput="S.draft.run.dist=this.value;save();pace()"></div><div><label>Time (mm:ss)</label><input value="${D.run.time}" placeholder="24:30" oninput="S.draft.run.time=this.value;save();pace()"></div><div><label>Pace</label><input id="pace" readonly></div></div></div>
  <h2>🚴 Echo Bike</h2><div class="card">${D.cmp&&D.cmp.bikeLast?`<div class="mut">Last week: ${D.cmp.bikeLast}</div><div style="color:#9bb06b;font-size:14px">🎯 Beat: ${D.cmp.bikeTarget}</div>`:''}<div class="row"><div><label>Calories</label><input inputmode="numeric" value="${D.bike.cal}" oninput="S.draft.bike.cal=this.value;save()"></div><div><label>Time (mm:ss)</label><input value="${D.bike.time}" oninput="S.draft.bike.time=this.value;save()"></div><div><label>Intervals</label><input inputmode="numeric" value="${D.bike.intervals}" oninput="S.draft.bike.intervals=this.value;save()"></div></div></div>
  <h2>Notes</h2><textarea oninput="S.draft.notes=this.value;save()" placeholder="RPE, how it felt...">${esc(D.notes)}</textarea>
  <button class="btn" onclick="finish()">Save Workout</button><button class="btn del sm" onclick="if(confirm('Discard this draft?')){S.draft=null;save();go('today')}">Discard</button>`;pace()},
 history(){const logs=[...S.logs].sort((a,b)=>b.date.localeCompare(a.date));
  const lifts=['squat','front','bench','press','deadlift','pushpress'];let h='<h2>Est. 1RM trend (Epley)</h2>';
  lifts.forEach(l=>{const pts=trend(l);const best=Math.max(0,...pts.map(p=>p.v));h+=`<div class="card"><div class="pr" style="border:0"><b>${BOARD.find(b=>b[0]===l)[1]}</b><span class="ld">${best?Math.round(best)+' '+S.unit:'—'}</span></div>${spark(pts)}</div>`});
  const pr=prs();h+=`<h2>PRs</h2><div class="card">${pr.length?pr.map(p=>`<div class="pr"><span>${esc(p[0])}</span><span class="ld">${p[1]}</span></div>`).join(''):'<span class="mut">Log workouts to see PRs.</span>'}</div>`;
  h+=`<h2>History (${logs.length})</h2>`+(logs.map(l=>logCard(l)).join('')||'<p class="mut">No workouts yet.</p>');V.innerHTML=h},
 settings(){V.innerHTML=`<h2>1-Rep Maxes (${S.unit})</h2><div class="card"><div class="row2">${Object.keys(S.orm).map(k=>`<div><label>${BOARD.find(b=>b[0]===k)[1]}</label><input inputmode="decimal" value="${S.orm[k]}" onchange="S.orm.${k}=+this.value||0;save();header()"></div>`).join('')}</div>
  <button class="btn sec sm" onclick="fromLogs()">Update from best est. 1RM in logs</button></div>
  <h2>Units</h2><div class="seg">${['lb','kg'].map(u=>`<button class="${S.unit===u?'on':''}" onclick="setUnit('${u}')">${u}</button>`).join('')}</div>
  <h2>Days per week</h2><div class="seg">${[4,5].map(n=>`<button class="${S.days==n?'on':''}" onclick="S.days=${n};save();header();go('settings')">${n} days</button>`).join('')}</div>
  <p class="mut">5-day: Mon Lower · Tue Push · Wed Run · Thu Full · Fri Conditioning. 4-day: Mon · Tue · Thu (+run intervals) · Sat.</p>
  <h2>Block</h2><div class="card"><label>Block start (week 1 Monday)</label><input type="date" value="${S.start}" onchange="S.start=iso(monday(new Date(this.value+'T00:00')));save();header()">
  <button class="btn sec sm" onclick="S.start=iso(monday(now()));S.block=(S.block||1)+1;save();header();go('settings');toast('Block restarted')">Start new block this week</button></div>
  <h2>Backup</h2><div class="card"><button class="btn" onclick="exportData()">Export JSON</button><button class="btn sec" onclick="$('#imp').click()">Import JSON</button><input type="file" id="imp" accept="application/json,.json" hidden onchange="importData(this.files[0])">
  <button class="btn del sm" onclick="if(confirm('Erase ALL data?')){localStorage.removeItem(K);S=load();header();go('settings')}">Reset all data</button></div>
  <p class="mut">Install: iPhone Safari → Share → Add to Home Screen. Android Chrome → menu → Install app. Works offline; data stays on this device — export backups regularly.</p>`}};


// ---- Autoregulation: beat last week ----
const LOWER=['squat','front','deadlift'];
function prevLogs(key,date,test){const wk=monday(date);return S.logs.filter(l=>l.key===key&&new Date(l.date+'T00:00')<wk&&test(l)).sort((a,b)=>b.date.localeCompare(a.date))}
function setInfo(l,name){const e=l.ex.find(x=>x.name===name),ss=e.sets.filter(s=>+s.r>0),w=Math.max(0,...ss.map(s=>+s.w||0));
 const pr=+e.pr||0,ps=+e.ps||ss.length;return{w,reps:ss.map(s=>+s.r),hit:ss.length>=ps&&ss.every(s=>!pr||+s.r>=pr),date:l.date}}
function autoreg(p,date){const deload=p.week===3,kg=S.unit==='kg';
 p.ex.forEach(e=>{const L=prevLogs(p.key,date,l=>l.ex.some(x=>x.name===e.name&&x.sets.some(s=>+s.r>0)));if(!L.length)return;
  const a=setInfo(L[0],e.name);e.last=`${a.w?a.w+' '+S.unit+' × ':''}${a.reps.join('/')}${a.hit?' ✓':' ✗ missed'}`;
  const inc=e.lift&&LOWER.includes(e.lift)?(kg?5:10):(kg?2.5:5);
  if(!a.w){e.target=a.hit?`${a.reps.length} × ${Math.max(...a.reps)+1} (+1 rep)`:`repeat: hit ${e.sets} × ${e.reps}`;return}
  if(L[0].wk===3&&!deload&&e.load){e.target=`${e.load} ${S.unit} × ${e.reps} (new block, from max)`;return}
  if(deload&&e.load){e.target=`Deload: ${e.load} ${S.unit}`;return}
  let t,why;if(a.hit){t=a.w+inc;if(e.load&&e.load>t)t=e.load;why='▲ all reps hit'}
  else{const b=L[1]&&setInfo(L[1],e.name);if(b&&!b.hit&&b.w===a.w){t=rnd(a.w*.95);why='▼ missed twice, -5%'}else{t=a.w;why='= repeat, missed reps'}}
  e.load=t;if(e.lift)e.pct=Math.round(t/S.orm[e.lift]*100);e.target=`${t} ${S.unit} × ${e.reps} (${why})`});
 const u=kg?'km':'mi';
 if(p.cond.some(c=>c.t==='run')||p.key==='run'||p.key==='cond'){const L=prevLogs(p.key,date,l=>+l.run.dist&&secs(l.run.time));
  if(L.length){const r=L[0].run,ps=secs(r.time)/r.dist;p.runLast=`${r.dist} ${u} @ ${paceOf(r)}`;p.runTarget=`${r.dist} ${u} @ ≤ ${fmtT(ps-5)}/${u} (−5s) — or ${(+r.dist+.25).toFixed(2)} ${u} @ ${paceOf(r)}`}}
 if(p.cond.some(c=>c.t==='bike'||c.t==='mix')){const L=prevLogs(p.key,date,l=>+l.bike.cal);
  if(L.length){const b=L[0].bike;p.bikeLast=`${b.cal} cal${b.time?' / '+b.time:''}${b.intervals?' · '+b.intervals+' int':''}`;p.bikeTarget=`≥ ${+b.cal+Math.max(2,Math.round(b.cal*.05))} cal`}}}
function weekStats(mon){const end=new Date(mon);end.setDate(end.getDate()+7);const L=S.logs.filter(l=>{const d=new Date(l.date+'T00:00');return d>=mon&&d<end});
 let vol=0,e1=0,pace=0,cal=0,dist=0,bj=0,bm=0;L.forEach(l=>{l.ex.forEach(e=>e.sets.forEach(s=>{vol+=(+s.w||0)*(+s.r||0);if(liftOf(e))e1=Math.max(e1,e1rm(s.w,s.r))}));
  const sc=secs(l.run.time);if(+l.run.dist&&sc){const p=sc/l.run.dist;if(!pace||p<pace)pace=p;dist+=+l.run.dist}cal+=+l.bike.cal||0;if(l.bjj&&+l.bjj.min){bj++;bm+=+l.bjj.min}});return{n:L.length,vol,e1,pace,cal,dist,bj,bm}}
function weeklySummary(){const m=monday(now()),pm=new Date(m);pm.setDate(m.getDate()-7);const a=weekStats(m),b=weekStats(pm);
 const ar=(x,y,low)=>!x||!y?'':(low?x<y:x>y)?'<span style="color:#9bb06b">▲</span>':x===y?'=':'<span style="color:#d9a441">▼</span>';
 const row=(n,x,y,f,low)=>`<div class="pr"><span>${n}</span><span><span class="mut">${y?f(y):'—'} →</span> <b>${x?f(x):'—'}</b> ${ar(x,y,low)}</span></div>`;const u=S.unit==='kg'?'km':'mi';
 return`<h2>This week vs last</h2><div class="card">${row('Sessions',a.n,b.n,v=>v)}${row('Volume ('+S.unit+')',a.vol,b.vol,v=>Math.round(v).toLocaleString())}${row('Best e1RM (main lifts)',a.e1,b.e1,v=>Math.round(v)+' '+S.unit)}${row('Best run pace',a.pace,b.pace,v=>fmtT(v)+'/'+u,1)}${row('Run distance',a.dist,b.dist,v=>(+v).toFixed(2)+' '+u)}${row('Echo Bike cals',a.cal,b.cal,v=>v)}${row('BJJ sessions',a.bj,b.bj,v=>v)}${row('BJJ minutes',a.bm,b.bm,v=>v)}</div>`}
function cmpHTML(p){return(p.runLast?`<div class="ex"><div><b>🏃 Run — last week</b><small>${p.runLast}</small><small style="color:#9bb06b;display:block">🎯 Beat: ${p.runTarget}</small></div></div>`:'')+(p.bikeLast?`<div class="ex"><div><b>🚴 Bike — last week</b><small>${p.bikeLast}</small><small style="color:#9bb06b;display:block">🎯 Beat: ${p.bikeTarget}</small></div></div>`:'')}

// ---- Block rollover ----
function addDays(d,n){d=new Date(d);d.setDate(d.getDate()+n);return d}
function inRange(l,a,b){const d=new Date(l.date+'T00:00');return d>=a&&d<b}
function blockPerf(a,b){let pace=0,cal=0;S.logs.filter(l=>inRange(l,a,b)).forEach(l=>{const sc=secs(l.run.time);if(+l.run.dist&&sc){const p=sc/l.run.dist;if(!pace||p<pace)pace=p}cal=Math.max(cal,+l.bike.cal||0)});return{pace,cal}}
function checkRollover(){if(S.noRollUntil===iso(monday(now())))return;let st=new Date(S.start+'T00:00'),end=addDays(st,28);const t=now();if(t<end)return;
 const undo=JSON.stringify({orm:S.orm,prs:S.prs,start:S.start,block:S.block||1});const N=S.block||1;
 let ns=end;if(monday(t)>addDays(end,6))ns=monday(t);
 const ch=[];Object.keys(S.orm).forEach(k=>{const old=+S.orm[k]||0;let best=old;
  S.logs.filter(l=>inRange(l,st,end)).forEach(l=>l.ex.forEach(e=>{if(liftOf(e)!==k)return;e.sets.forEach(x=>{best=Math.max(best,Math.floor(e1rm(x.w,x.r)/(S.unit==='kg'?2.5:5))*(S.unit==='kg'?2.5:5))})}));
  (S.prs[k]||[]).filter(x=>!x.auto&&new Date(x.date+'T00:00')>=st).forEach(x=>best=Math.max(best,+x.v));
  if(best>old){S.orm[k]=best;(S.prs[k]=S.prs[k]||[]).push({v:best,date:iso(ns),auto:`auto (block ${N})`})}ch.push([k,old,S.orm[k]])});
 const cur=blockPerf(st,end),prev=blockPerf(addDays(st,-28),st);
 S.rollCard={block:N,ch,cur,prev};S.rollUndo=undo;S.block=N+1;S.start=iso(ns);save();checkRollover()}
function rollCardHTML(){const c=S.rollCard;if(!c)return'';const u=S.unit==='kg'?'km':'mi';
 return`<div class="card" style="border-color:#9bb06b"><h3 style="margin:0 0 6px;color:#9bb06b">🎖 Block ${c.block} complete</h3><div class="mut">New maxes for Block ${c.block+1}:</div>
 ${c.ch.map(([k,o,n])=>`<div class="pr"><span>${BOARD.find(b=>b[0]===k)[1]}</span><span>${o} → <b>${n}</b> ${n>o?'<span style="color:#9bb06b">▲</span>':'='}</span></div>`).join('')}
 <div class="pr"><span>Best run pace</span><span>${c.prev.pace?fmtT(c.prev.pace):'—'} → <b>${c.cur.pace?fmtT(c.cur.pace)+'/'+u:'—'}</b></span></div>
 <div class="pr"><span>Best bike session</span><span>${c.prev.cal||'—'} → <b>${c.cur.cal||'—'} cal</b></span></div>
 <div class="row2"><button class="btn sm" onclick="S.rollCard=null;S.rollUndo=null;save();go('today')">Got it</button><button class="btn del sm" onclick="undoRoll()">Undo rollover</button></div></div>`}
function undoRoll(){if(!S.rollUndo||!confirm('Undo block rollover and restore previous maxes?'))return;const u=JSON.parse(S.rollUndo);Object.assign(S,u);S.rollCard=null;S.rollUndo=null;S.noRollUntil=iso(monday(now()));save();header();go('today')}
function logCard(l){return `<div class="card"><div class="mut">${l.date}</div><b>${esc(l.title)}</b>
   ${l.ex.filter(e=>e.name).map(e=>`<div class="mut">${esc(e.name)}: ${e.sets.filter(s=>s.r).map(s=>(s.w||'BW')+'×'+s.r).join(', ')}</div>`).join('')}
   ${l.run.dist?`<div class="mut">Run: ${l.run.dist} ${S.unit==='kg'?'km':'mi'} in ${esc(l.run.time)} (${paceOf(l.run)})</div>`:''}
   ${l.bike.cal||l.bike.time?`<div class="mut">Bike: ${l.bike.cal||0} cal, ${esc(l.bike.time)} ${l.bike.intervals?'· '+l.bike.intervals+' intervals':''}</div>`:''}
   ${l.bjj&&+l.bjj.min?`<div class="mut">🥋 BJJ: ${esc(l.bjj.min)} min · ${esc(l.bjj.type)}${l.bjj.rounds?' · '+esc(l.bjj.rounds)+' rounds':''} · RPE ${esc(l.bjj.rpe)}</div>`:''}
   ${l.notes?`<div style="margin-top:6px">📝 ${esc(l.notes)}</div>`:''}
   <div class="row2"><button class="btn sec sm" onclick="editLog('${l.id}')">Edit</button><button class="btn del sm" onclick="delLog('${l.id}')">Delete</button></div></div>`}
const BOARD=[['squat','Back Squat','w'],['front','Front Squat','w'],['bench','Bench Press','w'],['press','Overhead Press','w'],['deadlift','Deadlift','w'],['pushpress','Push Press','w'],
 ['mile','1-Mile Run','t'],['run2','2-Mile Run','t'],['bike1','Echo Bike 1-min Max Cal','c'],['bike10','Echo Bike 10-min Cal','c']];
function prVal(k,v,t){return t==='w'?v+' '+S.unit:t==='t'?fmtT(v):v+' cal'}
function fmtT(s){return Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0')}
function prCurrent(k,t){if(t==='w')return S.orm[k];const h=S.prs[k]||[];if(!h.length)return null;return t==='t'?Math.min(...h.map(x=>x.v)):Math.max(...h.map(x=>x.v))}
R.board=function(){V.innerHTML=`<h2>Max Lifts · PR Board</h2><p class="mut" style="margin-top:0">Lift maxes drive all % loads in the plan.</p>`+BOARD.map(([k,n,t])=>{const c=prCurrent(k,t),h=(S.prs[k]||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
 return`<div class="card"><div class="pr" style="border:0;padding:0"><b>${n}</b><span class="ld" style="font-size:22px">${c!=null&&c!==''?prVal(k,c,t):'—'}</span></div>
 <details><summary class="mut" style="padding:10px 0;min-height:44px">Log new PR / history (${h.length})</summary>
 <div class="row2"><div><label>${t==='w'?S.unit:t==='t'?'Time mm:ss':'Calories'}</label><input id="pv_${k}" inputmode="${t==='t'?'text':'decimal'}"></div><div><label>Date</label><input type="date" id="pd_${k}" value="${iso(now())}"></div></div>
 <button class="btn sm" onclick="addPR('${k}','${t}')">Save PR</button>
 ${h.map((x,i)=>`<div class="pr"><span class="mut">${x.date}</span><span>${prVal(k,x.v,t)}${x.auto?' <span class="tag">'+esc(x.auto)+'</span>':''} <button class="x" style="min-height:32px;width:36px" onclick="delPR('${k}','${x.date}',${x.v})">✕</button></span></div>`).join('')}</details></div>`}).join('')};
function addPR(k,t){const raw=$('#pv_'+k).value.trim(),date=$('#pd_'+k).value||iso(now());const v=t==='t'?secs(raw):+raw;if(!v)return alert('Enter a value');
 (S.prs[k]=S.prs[k]||[]).push({v,date});if(t==='w'){const h=S.prs[k].slice().sort((a,b)=>a.date.localeCompare(b.date));S.orm[k]=h[h.length-1].v}save();header();toast('PR saved — plan updated');go('board')}
function delPR(k,d,v){if(!confirm('Delete this entry?'))return;const h=S.prs[k],i=h.findIndex(x=>x.date===d&&x.v===v);h.splice(i,1);const b=BOARD.find(x=>x[0]===k);if(b[2]==='w'&&h.length){S.orm[k]=h.slice().sort((a,b)=>a.date.localeCompare(b.date)).pop().v}save();go('board')}
function go(v){S.view=v;document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));R[v]();scrollTo(0,0)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{DOFF=0;if(typeof FOFF!=='undefined')FOFF=0;go(b.dataset.v)});

// ---- Logging ----
function blank(p,ds){const d=ds?new Date(ds+'T12:00'):now();return{id:Date.now().toString(36),wk:p?p.week:null,date:iso(d),title:p?p.title:'Training session',key:p?.key||null,
 cmp:p?{runLast:p.runLast,runTarget:p.runTarget,bikeLast:p.bikeLast,bikeTarget:p.bikeTarget}:{},ex:p?p.ex.map(e=>({name:e.name,lift:e.lift||null,ps:e.sets,pr:+e.reps||0,last:e.last||'',target:`${e.sets}x${e.reps}${e.load?' @ '+e.load+' '+S.unit:''}`+(e.target?' — '+e.target:''),sets:Array.from({length:e.sets},()=>({w:e.load||'',r:/^\d+$/.test(e.reps)||typeof e.reps==='number'?e.reps:''}))})):[],
 bjj:p&&p.key==='bjj'?{min:'60',type:'gi',rounds:'',rpe:'7'}:null,run:{dist:'',time:''},bike:{cal:'',time:'',intervals:''},notes:p&&p.key==='bjj'?'':p?p.cond.map(c=>c.d).join(' | '):''}}
function setSub(ds,on){S.subs=S.subs||{};if(on)S.subs[ds]='bjj';else delete S.subs[ds];save();toast(on?'Swapped for Jiu-Jitsu':'Substitution undone');go('today')}
function startLog(has,ds){if(!S.draft){const d=ds?new Date(ds+'T12:00'):now();S.draft=blank(has?dayPlan(d):null,ds)}save();go('log')}
function addSet(i){const s=S.draft.ex[i].sets,l=s[s.length-1]||{w:'',r:''};s.push({...l});save();go('log')}
function secs(t){if(!t)return 0;const p=String(t).split(':').map(Number);return p.reduce((a,b)=>a*60+b,0)}
function paceOf(r){const s=secs(r.time),d=+r.dist;if(!s||!d)return'—';const p=s/d;return`${Math.floor(p/60)}:${String(Math.round(p%60)).padStart(2,'0')}/${S.unit==='kg'?'km':'mi'}`}
function pace(){const e=$('#pace');if(e)e.value=paceOf(S.draft.run)}
function finish(){const D=S.draft;D.ex=D.ex.filter(e=>e.name).map(e=>({...e,sets:e.sets.filter(s=>s.r!=='')}));
 const i=S.logs.findIndex(l=>l.id===D.id);if(i>=0)S.logs[i]=D;else S.logs.push(D);S.draft=null;save();toast('Workout saved 💪');go('history')}
function editLog(id){S.draft=JSON.parse(JSON.stringify(S.logs.find(l=>l.id===id)));save();go('log')}
function delLog(id){if(confirm('Delete this workout?')){S.logs=S.logs.filter(l=>l.id!==id);save();go('history')}}
function liftOf(e){if(e.lift)return e.lift;const n=e.name.toLowerCase();if(/volume/.test(n))return null;if(/front/.test(n))return'front';if(/push press/.test(n))return'pushpress';
 if(/squat/.test(n))return'squat';if(/bench/.test(n))return'bench';if(/^deadlift|conventional/.test(n))return'deadlift';if(/overhead|ohp|^press|military/.test(n))return'press';return null}
function trend(l){const m={};S.logs.forEach(g=>g.ex.forEach(e=>{if(liftOf(e)!==l)return;e.sets.forEach(s=>{const v=e1rm(s.w,s.r);if(v>(m[g.date]||0))m[g.date]=v})}));return Object.keys(m).sort().map(d=>({d,v:m[d]}))}
function spark(p){if(p.length<1)return'<div class="mut">No data yet</div>';const vs=p.map(x=>x.v),mn=Math.min(...vs)*.97,mx=Math.max(...vs)*1.01,W=300,H=100;
 const pts=p.map((x,i)=>[p.length==1?W/2:i*W/(p.length-1),H-(x.v-mn)/(mx-mn||1)*(H-10)-5]);
 return`<svg viewBox="-6 0 312 110"><polyline fill="none" stroke="#9bb06b" stroke-width="3" points="${pts.map(q=>q.join(',')).join(' ')}"/>${pts.map(q=>`<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#c9d6a3"/>`).join('')}</svg><div class="mut">${p[0].d} → ${p[p.length-1].d}</div>`}
function prs(){const o={};S.logs.forEach(g=>{g.ex.forEach(e=>e.sets.forEach(s=>{const w=+s.w;if(!w)return;const k=e.name.trim();if(!o[k]||w>o[k].w||(w==o[k].w&&+s.r>o[k].r))o[k]={w,r:+s.r}}));
 if(+g.run.dist&&secs(g.run.time)){const p=secs(g.run.time)/g.run.dist;if(!o._run||p<o._run.p)o._run={p,r:g.run}}
 if(+g.bike.cal){if(!o._bike||+g.bike.cal>o._bike.c)o._bike={c:+g.bike.cal,t:g.bike.time}}});
 const out=Object.entries(o).filter(([k])=>k[0]!=='_').map(([k,v])=>[k,`${v.w} ${S.unit} × ${v.r}`]);
 if(o._run)out.push(['Fastest run pace',paceOf(o._run.r)+` (${o._run.r.dist})`]);if(o._bike)out.push(['Most bike cals (session)',o._bike.c+' cal'+(o._bike.t?' / '+o._bike.t:'')]);return out}
function fromLogs(){Object.keys(S.orm).forEach(l=>{const b=Math.max(0,...trend(l).map(p=>p.v));if(b>S.orm[l])S.orm[l]=rnd(b)});save();go('settings');toast('1RMs updated')}
function setUnit(u){if(u===S.unit)return;if(confirm('Convert 1RMs to '+u+'? (logged history keeps original numbers)')){const f=u==='kg'?1/2.2046:2.2046;S.unit=u;Object.keys(S.orm).forEach(k=>S.orm[k]=rnd(S.orm[k]*f))}else S.unit=u;save();header();go('settings')}
function exportData(){const b=new Blob([JSON.stringify({app:'tacfit',v:1,exported:now().toISOString(),data:{...S,view:undefined}},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`tacfit-backup-${iso(now())}.json`;document.body.appendChild(a);a.click();a.remove()}
function importData(f){if(!f)return;f.text().then(t=>{const j=JSON.parse(t),d=j.data||j;if(!Array.isArray(d.logs))throw 0;if(!confirm(`Import ${d.logs.length} workouts? This replaces current data.`))return;S=Object.assign({},def,d);save();header();go('today');toast('Backup restored')}).catch(()=>alert('Invalid backup file'))}

addEventListener('DOMContentLoaded',()=>{checkRollover();header();go(S.rollCard?'today':'board')});
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
