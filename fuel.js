'use strict';
// ---- Fuel (nutrition) — general guidance, not medical advice ----
const FOOD={
 breakfast:[
  {n:'Eggs, toast & fruit',d:'4 whole eggs scrambled, 2 slices whole-wheat toast, 1 banana',k:640,p:34,c:62,f:24,g:['Eggs ×4','Bread ×2 slices','Bananas ×1']},
  {n:'Oatmeal power bowl',d:'1 cup dry oats, 1 scoop whey, 1 tbsp peanut butter, 1 cup milk',k:690,p:48,c:80,f:20,g:['Oats ×1 cup','Whey ×1 scoop','Peanut butter ×1 tbsp','Milk ×1 cup']},
  {n:'Breakfast burritos',d:'2 tortillas, 3 eggs + 3 egg whites, ½ cup cheese, salsa',k:650,p:45,c:50,f:28,g:['Tortillas ×2','Eggs ×3','Egg whites ×3','Shredded cheese ×½ cup','Salsa']},
  {n:'Greek yogurt parfait + eggs',d:'1.5 cups Greek yogurt, ½ cup granola, berries, 2 hard-boiled eggs',k:620,p:50,c:62,f:18,g:['Greek yogurt ×1.5 cups','Granola ×½ cup','Berries ×1 cup','Eggs ×2']},
  {n:'Steak & eggs',d:'5 oz sirloin, 2 eggs, 1 cup diced hash-brown potatoes',k:680,p:50,c:40,f:34,g:['Sirloin ×5 oz','Eggs ×2','Potatoes ×1']},
  {n:'Pancakes & turkey sausage',d:'Protein pancake mix (1 cup), 3 turkey sausage links, syrup 1 tbsp',k:640,p:42,c:78,f:16,g:['Protein pancake mix ×1 cup','Turkey sausage ×3 links','Syrup']}],
 lunch:[
  {n:'Chicken & rice bowl',d:'6 oz grilled chicken breast, 1.5 cups cooked rice, 1 cup broccoli, 1 tbsp olive oil',k:720,p:55,c:75,f:20,g:['Chicken breast ×6 oz','Rice ×½ cup dry','Broccoli ×1 cup']},
  {n:'Turkey & cheese sandwiches',d:'2 sandwiches: 6 oz deli turkey, 2 slices cheese, whole-wheat bread, apple',k:700,p:52,c:78,f:20,g:['Deli turkey ×6 oz','Cheese slices ×2','Bread ×4 slices','Apples ×1']},
  {n:'Burrito bowl',d:'5 oz lean ground beef (93%), 1 cup rice, ½ cup black beans, salsa, ¼ cup cheese',k:740,p:50,c:80,f:22,g:['Ground beef 93% ×5 oz','Rice ×½ cup dry','Black beans ×½ cup','Salsa','Shredded cheese ×¼ cup']},
  {n:'Chicken wrap + chips',d:'2 large tortillas, 6 oz chicken, lettuce, ranch light, 1 oz baked chips',k:700,p:52,c:70,f:22,g:['Tortillas ×2','Chicken breast ×6 oz','Lettuce','Light ranch','Baked chips ×1 oz']},
  {n:'Cheeseburger & sweet potato',d:'Lean burger patty (5 oz) on bun w/ cheese, 1 medium baked sweet potato',k:730,p:45,c:72,f:28,g:['Ground beef 93% ×5 oz','Burger buns ×1','Cheese slices ×1','Sweet potatoes ×1']},
  {n:'Chicken pasta salad',d:'2 cups cooked pasta, 5 oz chicken, veggies, 2 tbsp Italian dressing',k:720,p:48,c:85,f:18,g:['Pasta ×4 oz dry','Chicken breast ×5 oz','Italian dressing','Mixed veggies ×1 cup']}],
 dinner:[
  {n:'Steak, potatoes & green beans',d:'7 oz sirloin, 10 oz potatoes (roasted), 1 cup green beans',k:760,p:55,c:65,f:28,g:['Sirloin ×7 oz','Potatoes ×2','Green beans ×1 cup']},
  {n:'Spaghetti & meat sauce',d:'2 cups cooked spaghetti, 5 oz lean ground beef in marinara, side salad',k:780,p:50,c:90,f:22,g:['Pasta ×4 oz dry','Ground beef 93% ×5 oz','Marinara ×1 cup','Salad mix']},
  {n:'BBQ chicken & rice',d:'7 oz chicken thighs (skinless) w/ BBQ sauce, 1.5 cups rice, corn',k:770,p:52,c:95,f:18,g:['Chicken thighs ×7 oz','BBQ sauce','Rice ×½ cup dry','Corn ×1 cup']},
  {n:'Tacos',d:'4 corn tortillas, 6 oz lean ground beef/turkey, cheese, lettuce, salsa, ½ cup rice',k:760,p:48,c:72,f:28,g:['Corn tortillas ×4','Ground beef 93% ×6 oz','Shredded cheese ×¼ cup','Lettuce','Salsa','Rice ×¼ cup dry']},
  {n:'Pork chops & mashed potatoes',d:'6 oz lean pork chop, 1.5 cups mashed potatoes, 1 cup broccoli',k:720,p:48,c:62,f:26,g:['Pork chops ×6 oz','Potatoes ×2','Broccoli ×1 cup']},
  {n:'Chicken alfredo (light)',d:'2 cups pasta, 6 oz chicken, ½ cup light alfredo, peas',k:790,p:56,c:88,f:22,g:['Pasta ×4 oz dry','Chicken breast ×6 oz','Light alfredo ×½ cup','Peas ×½ cup']},
  {n:'Meatloaf & baked potato',d:'6 oz lean meatloaf, 1 large baked potato, corn',k:760,p:46,c:80,f:26,g:['Ground beef 93% ×6 oz','Potatoes ×1 large','Corn ×1 cup']}],
 snack:[
  {n:'Protein shake + banana',d:'1 scoop whey in water/milk, 1 banana',k:250,p:27,c:30,f:3,g:['Whey ×1 scoop','Bananas ×1']},
  {n:'Greek yogurt & honey',d:'1 cup Greek yogurt, 1 tbsp honey',k:200,p:23,c:24,f:1,g:['Greek yogurt ×1 cup','Honey']},
  {n:'PB&J',d:'2 slices bread, 1 tbsp PB, 1 tbsp jelly',k:330,p:12,c:44,f:12,g:['Bread ×2 slices','Peanut butter ×1 tbsp','Jelly']},
  {n:'Beef jerky & apple',d:'2 oz jerky, 1 apple',k:240,p:22,c:32,f:2,g:['Beef jerky ×2 oz','Apples ×1']},
  {n:'Cottage cheese & fruit',d:'1 cup low-fat cottage cheese, ½ cup pineapple',k:220,p:26,c:20,f:3,g:['Cottage cheese ×1 cup','Pineapple ×½ cup']},
  {n:'Rice cakes & PB',d:'3 rice cakes, 1.5 tbsp peanut butter',k:250,p:8,c:24,f:13,g:['Rice cakes ×3','Peanut butter ×1.5 tbsp']},
  {n:'Hard-boiled eggs & string cheese',d:'2 eggs, 2 string cheese',k:300,p:26,c:2,f:20,g:['Eggs ×2','String cheese ×2']},
  {n:'Chocolate milk',d:'16 oz low-fat chocolate milk',k:320,p:16,c:52,f:5,g:['Chocolate milk ×16 oz']}]};
const SLOTS=[['b','Breakfast','breakfast'],['s1','Snack 1 · mid-morning','snack'],['l','Lunch','lunch'],['s2','Snack 2 · pre-workout / afternoon','snack'],['d','Dinner','dinner'],['s3','Snack 3 · post-workout / evening','snack']];
function F(){S.fuel=S.fuel||{};const f=S.fuel;f.wt=f.wt||170;f.ht=f.ht||66;if(!f.bd)f.bd='1987-11-12';delete f.age;f.ppl=f.ppl||1;f.swaps=f.swaps||{};f.log=f.log||{};return f}
function ageOf(bd){const t=now(),b=new Date(bd+'T12:00');let a=t.getFullYear()-b.getFullYear();if(t.getMonth()<b.getMonth()||(t.getMonth()==b.getMonth()&&t.getDate()<b.getDate()))a--;return a}
function fuelTargets(){const f=F(),age=ageOf(f.bd),kg=f.wt/2.2046,cm=f.ht*2.54,bmr=10*kg+6.25*cm-5*age+5,tdee=bmr*1.55;
 const tr=f.trK||Math.round(tdee*1.08/50)*50,re=f.reK||Math.round(tdee*.93/50)*50,p=Math.round(f.wt*f.ppl);
 const mk=(k,fat)=>({k,p,f:fat,c:Math.round((k-p*4-fat*9)/4)});return{age,bmr:Math.round(bmr),tdee:Math.round(tdee),train:mk(tr,Math.round(f.wt*.4)),rest:mk(re,Math.round(f.wt*.45))}}
function doy(d){return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)}
function mealFor(d,slot,cat){const ds=iso(d),sw=(F().swaps[ds]||{})[slot]||0,L=FOOD[cat],off={b:0,s1:1,l:0,s2:3,d:0,s3:0}[slot];return{i:(doy(d)*(slot==='s1'?3:1)+off+sw)%L.length,L}}
function dayMenu(d){const tr=!!dayPlan(d),out=[];SLOTS.forEach(([s,n,cat])=>{if(!tr&&s==='s2')return;let m=mealFor(d,s,cat);if(tr&&s==='s3'&&!F().swaps[iso(d)]?.s3)m={i:0,L:FOOD.snack};out.push({s,n,cat,m:m.L[m.i]})});return{tr,out}}
let FOFF=0;
R.fuel=function(){const f=F(),t=now(),d=addDays(t,FOFF),ds=iso(d),T=fuelTargets(),p=dayPlan(d),{tr,out}=dayMenu(d),tg=tr?T.train:T.rest;
 const sum=out.reduce((a,x)=>({k:a.k+x.m.k,p:a.p+x.m.p,c:a.c+x.m.c,f:a.f+x.m.f}),{k:0,p:0,c:0,f:0}),sc=tg.k/sum.k;
 const lg=f.log[ds]=f.log[ds]||{eat:{},water:0,bw:''};lg.skip=lg.skip||{};const sk=x=>lg.skipDay||lg.skip[x.s];const ate=out.filter(x=>lg.eat[x.s]&&!sk(x)).reduce((a,x)=>a+x.m.k*sc,0);
 const time=p?(p.key==='bjj'?'BJJ':'Training')+` day — ${esc(p.title)}`:'Rest day';
 V.innerHTML=`<div style="display:flex;gap:8px;align-items:center"><button class="btn sec" style="width:64px;margin:0" onclick="FOFF--;go('fuel')" aria-label="Previous day">◀</button><div style="flex:1;text-align:center"><b>${d.toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'})}</b><div class="mut">${time}</div></div><button class="btn sec" style="width:64px;margin:0" onclick="FOFF++;go('fuel')" aria-label="Next day">▶</button></div>${FOFF?`<button class="btn sec sm" onclick="FOFF=0;go('fuel')">Jump to Today</button>`:''}
 <div class="card" style="margin-top:12px"><span class="tag">${tr?'TRAINING DAY':'REST DAY'}</span><div class="row" style="text-align:center;margin-top:8px">
 <div><div class="ld" style="font-size:22px">${tg.k}</div><small class="mut">kcal</small></div><div><div class="ld" style="font-size:22px">${tg.p}g</div><small class="mut">protein</small></div><div><div class="ld" style="font-size:22px">${tg.c}g</div><small class="mut">carbs · ${tg.f}g fat</small></div></div>
 <div class="mut" style="margin-top:8px">Eaten so far: ~${Math.round(ate)} kcal (${Math.round(ate/tg.k*100)}%) · Portions below scaled ×${sc.toFixed(2)} to hit target</div></div>
 ${p?`<div class="card"><b>⏱ Workout fueling</b><div class="mut">Pre: Snack 2 (carbs + some protein) 60–90 min before; water 16 oz. Avoid heavy fat/fiber right before.<br>Post: Snack 3 shake + carbs within ~1–2 h, then a normal meal. Long run/hard bike or BJJ: add ~500 ml water per hour + pinch of salt.</div></div>`:''}
 <h2>Meals</h2>${lg.skipDay?`<div class="card" style="border-color:#d9a441"><b>Day plan skipped</b></div>`:''}<button class="btn sec sm" onclick="fuelSkipDay('${ds}')">${lg.skipDay?'↩ Restore day plan':'Skip whole day plan'}</button>${out.map(x=>`<div class="card" style="${sk(x)?'opacity:.45':''}"><div style="display:flex;justify-content:space-between;gap:8px"><div><div class="mut">${x.n}${sk(x)?' · SKIPPED':''}</div><b>${esc(x.m.n)}</b></div>
 <button class="seg" style="all:unset"><span class="tag" style="padding:12px 14px;font-size:15px;cursor:pointer" onclick="fuelEat('${ds}','${x.s}')">${lg.eat[x.s]?'✅':'⬜'}</span></button></div>
 <div class="mut" style="margin:6px 0">${esc(x.m.d)}</div><small>≈ ${Math.round(x.m.k*sc)} kcal · P ${Math.round(x.m.p*sc)} · C ${Math.round(x.m.c*sc)} · F ${Math.round(x.m.f*sc)}</small>
 <div class="row2"><button class="btn sec sm" onclick="fuelSwap('${ds}','${x.s}')">⇄ Swap</button><button class="btn sec sm" onclick="fuelSkip('${ds}','${x.s}')">${lg.skip[x.s]?'↩ Unskip':'⨯ Skip'}</button></div></div>`).join('')}
 <h2>Daily check-in</h2><div class="card"><label>Water (cups of 8 oz) — goal ${tr?14:12}</label><div style="display:flex;gap:8px;align-items:center"><button class="btn sec" style="width:64px;margin:0" onclick="fuelWater('${ds}',-1)">−</button><b style="flex:1;text-align:center;font-size:24px">${lg.water}</b><button class="btn" style="width:64px;margin:0" onclick="fuelWater('${ds}',1)">+</button></div>
 <label>Bodyweight (lb)</label><input inputmode="decimal" value="${lg.bw}" placeholder="${f.wt}" onchange="F().log['${ds}'].bw=this.value;save()">
 ${bwTrend()}</div>
 <h2>This week's menu</h2><div class="card">${[0,1,2,3,4,5,6].map(i=>{const dd=addDays(monday(d),i),m=dayMenu(dd);return`<div class="pr"><span class="mut">${dd.toLocaleDateString(undefined,{weekday:'short'})}${m.tr?' 💪':''}</span><span style="text-align:right;font-size:13px">${m.out.filter(x=>x.cat!=='snack').map(x=>esc(x.m.n)).join(' · ')}</span></div>`}).join('')}</div>
 <h2>Grocery list (this week)</h2><div class="card">${grocery(d)}</div>
 <h2>Targets & settings</h2><div class="card"><div class="row"><div><label>Weight lb</label><input inputmode="decimal" value="${f.wt}" onchange="F().wt=+this.value||170;save();go('fuel')"></div><div><label>Height in</label><input inputmode="decimal" value="${f.ht}" onchange="F().ht=+this.value||66;save();go('fuel')"></div><div><label>Birthdate (age ${T.age})</label><input type="date" value="${f.bd}" onchange="F().bd=this.value||'1987-11-12';save();go('fuel')"></div></div>
 <div class="row"><div><label>Train kcal</label><input inputmode="numeric" value="${T.train.k}" onchange="F().trK=+this.value||0;save();go('fuel')"></div><div><label>Rest kcal</label><input inputmode="numeric" value="${T.rest.k}" onchange="F().reK=+this.value||0;save();go('fuel')"></div><div><label>Protein g/lb</label><input inputmode="decimal" value="${f.ppl}" onchange="F().ppl=+this.value||1;save();go('fuel')"></div></div>
 <button class="btn sec sm" onclick="delete F().trK;delete F().reK;F().ppl=1;save();go('fuel')">Reset to calculated targets</button>
 <p class="mut">Estimate: BMR ≈ ${T.bmr} kcal (Mifflin-St Jeor) × 1.55 activity ≈ ${T.tdee} kcal maintenance. Training days ≈ +8%, rest days ≈ −7% (weekly avg ≈ maintenance + small surplus for lean gain). Protein ≈ 1 g/lb; fat ≈ 0.4–0.45 g/lb; carbs fill the rest (higher on training days). These are approximations — adjust by ~150–200 kcal if 2-week average bodyweight drifts more than ~1 lb from goal.</p>
 <p class="mut">⚠️ General guidance only, not medical or dietetic advice. No fish/seafood included. Consult a professional for medical conditions or allergies.</p></div>`};
function fuelEat(ds,s){const l=F().log[ds];l.eat[s]=!l.eat[s];save();go('fuel')}
function fuelWater(ds,n){const l=F().log[ds];l.water=Math.max(0,l.water+n);save();go('fuel')}
function fuelSwap(ds,s){const f=F();f.swaps[ds]=f.swaps[ds]||{};f.swaps[ds][s]=(f.swaps[ds][s]||0)+1;if(s==='s3')f.swaps[ds][s]=f.swaps[ds][s]||1;save();go('fuel')}
function bwTrend(){const e=Object.entries(F().log).filter(([d,l])=>+l.bw).sort().slice(-14);if(e.length<2)return'';const a=+e[0][1].bw,b=+e[e.length-1][1].bw;return`<div class="mut" style="margin-top:6px">Last ${e.length} weigh-ins: ${a} → ${b} lb (${b-a>=0?'+':''}${(b-a).toFixed(1)})</div>`}
function grocery(d){const m={};for(let i=0;i<7;i++){const dd=addDays(monday(d),i);dayMenu(dd).out.forEach(x=>x.m.g.forEach(g=>{const[k,q]=g.split(' ×');const r=q?q.match(/^([\d.½¼]+)\s*(.*)$/):null;const n=r?parseFloat(r[1].replace('½','.5').replace('¼','.25'))||({'½':.5,'¼':.25}[r[1]]):0;
 m[k]=m[k]||{n:0,u:r?r[2]:''};m[k].n+=n}))}
 return Object.keys(m).sort().map(k=>`<div class="pr"><span>${esc(k)}</span><span class="mut">${m[k].n?+m[k].n.toFixed(1)+' '+esc(m[k].u):'as needed'}</span></div>`).join('')+'<p class="mut">Totals are before portion scaling — buy ~10–20% extra on proteins/carbs.</p>'}

function fuelSkip(ds,s){const l=F().log[ds];l.skip=l.skip||{};l.skip[s]=!l.skip[s];save();go('fuel')}
function fuelSkipDay(ds){const l=F().log[ds];l.skipDay=!l.skipDay;save();go('fuel')}
