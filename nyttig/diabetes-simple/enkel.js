/* © 2026 Reinertsengruppen · Thomas Reinertsen · reinertsengruppen.no · Alle rettigheter forbeholdt. */
/* Enkel versjon av Diabetes-sidene: bytter til enklere tekst, uten å endre verktøyene. Slås på med #enkel i adressen. */
(function () {
  'use strict';
  var main = document.querySelector('main');
  var parts0 = location.pathname;
  if (!main && !/mat-og-blodsukker/.test(parts0)) return;
  main = main || document.body;
  var parts = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
  var key = parts[parts.length - 1];
  var FORCE = document.documentElement.getAttribute('data-enkel') === '1';
  if (!FORCE) return; /* Enkel versjon finnes bare i egen app (diabetes-enkel) */
  var BACK = FORCE ? '../index.html' : '../../diabetes-enkel/index.html';


  /* ---------- Samme utseende som enkel-forsiden (kun i enkel-appen) ---------- */
  var ICONS = {"tallerken": "<span class=\"icon\" style=\"background:linear-gradient(160deg,#60a5fa,#2563eb)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"4.5\"/></svg></span>", "innstillinger": "<span class=\"icon\" style=\"background:linear-gradient(160deg,#818cf8,#4f46e5)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6\"/></svg></span>", "trendpiler": "<span class=\"icon\" style=\"background:linear-gradient(160deg,#f472b6,#be185d)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M4 16l5-5 4 3 7-8M15 6h5v5\"/></svg></span>", "tallene": "<span class=\"icon\" style=\"background:linear-gradient(160deg,#34d399,#059669)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 7h14M5 12h14M5 17h14M9 4v16\"/></svg></span>", "mat-og-blodsukker": "<span class=\"icon\" style=\"background:linear-gradient(160deg,#fb923c,#c2410c)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 20h18M4 16c3 0 3-9 6-9s2 9 5 9 3-6 5-6\"/></svg></span>"};
  function shell() {
    var st = document.createElement('style');
    st.textContent = 'body{background:radial-gradient(circle at 15% 10%,#c7d9ff 0,transparent 45%),radial-gradient(circle at 90% 30%,#ffd9c2 0,transparent 40%),radial-gradient(circle at 30% 95%,#cdeedd 0,transparent 45%),#eef3fb!important}' +
      'body>header{display:none!important}main .back{display:none!important}' +
      '.apptop{padding:14px 16px 0;max-width:1040px;margin:0 auto}' +
      '.apptop a{display:inline-flex;align-items:center;gap:6px;min-height:48px;padding:0 20px 0 12px;border-radius:999px;background:rgba(255,255,255,.75);border:1px solid #fff;font-weight:800;font-size:1.05rem;color:#2563eb;text-decoration:none;box-shadow:0 2px 8px rgba(15,23,42,.1)}' +
      '.apptop a:focus-visible{outline:3px solid #7c3aed;outline-offset:3px}' +
      '.hero{display:flex;justify-content:center;margin:6px 0 4px}' +
      '.hero .icon{position:relative;overflow:hidden;width:92px;aspect-ratio:1;border-radius:22%;display:grid;place-items:center;box-shadow:0 4px 12px rgba(15,23,42,.22),inset 0 1px 0 rgba(255,255,255,.35)}.hero .icon svg{width:52%;height:52%}' +
      'main h1,main .lead{text-align:center}' +
      '.cardx{background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.8);border-radius:34px;padding:14px;box-shadow:0 14px 40px rgba(15,23,42,.12);margin-top:14px}' +
      '.hjelp{margin-top:14px;background:#fff7e0;border:1px solid #f1d98a;border-radius:16px;padding:12px 14px;color:#5b4300;font-size:.95rem;line-height:1.4;text-align:center}';
    document.head.appendChild(st);
    var m = document.querySelector('main'); if (!m) return;
    var top = document.createElement('div'); top.className = 'apptop';
    top.innerHTML = '<a href="../index.html"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>Back</a>';
    m.parentNode.insertBefore(top, m);
    var h1 = m.querySelector('h1');
    if (h1 && ICONS[key]) { var hero = document.createElement('div'); hero.className = 'hero'; hero.setAttribute('aria-hidden', 'true'); hero.innerHTML = ICONS[key]; h1.parentNode.insertBefore(hero, h1); }
    var lead = m.querySelector('.lead');
    if (lead) {
      var card = document.createElement('div'); card.className = 'cardx';
      var n = lead.nextElementSibling, arr = [];
      while (n) { arr.push(n); n = n.nextElementSibling; }
      lead.after(card); arr.forEach(function (x) { card.appendChild(x); });
      var hj = document.createElement('p'); hj.className = 'hjelp';
      hj.innerHTML = '<b>This is only a tool.</b> It is not the final answer. Always ask an adult or your diabetes team.';
      card.appendChild(hj);
    }
  }

  function on() { return FORCE || location.hash === '#enkel' || location.hash === '#barn'; }

  /* ---------- Bare tilbake-lenken på «Mat og blodsukker» (har egen bryter) ---------- */
  /* To tilbake-lenker: «.back» i innholdet, og «.apptilbake» i toppmenyen når appen er installert på telefonen */
  var backs = [].slice.call(document.querySelectorAll('a.back, a.apptilbake')).map(function (a) { return { a: a, o: null }; });
  function setBack(enkel) {
    backs.forEach(function (b) {
      var a = b.a, tn = null, i, n;
      for (i = a.childNodes.length - 1; i >= 0; i--) { n = a.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) { tn = n; break; } }
      if (!b.o) b.o = { href: a.getAttribute('href'), text: tn ? tn.nodeValue : null };
      a.setAttribute('href', enkel ? BACK : b.o.href);
      if (tn && b.o.text != null) tn.nodeValue = enkel ? 'Back' : b.o.text;
    });
  }
  if (key === 'mat-og-blodsukker') {
    var upd = function () { setBack(on() || (document.getElementById('m-kid') && document.getElementById('m-kid').getAttribute('aria-pressed') === 'true')); };
    ['m-kid', 'm-adult'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', function () { setTimeout(upd, 0); });
    });
    window.addEventListener('hashchange', upd);
    upd();
    if (FORCE) shell();
    return;
  }

  /* ---------- Tekster i enkel versjon ---------- */
  var R = {};
  R.tallerken = {
    txt: [
      ['.lead', 'Find out how many grams of carbohydrate are in your food. Search for the food, put it on the plate, and see the total.'],
      ['main > p[style*="fff7e0"]', '<b>Remember:</b> This helps you work it out. It is not the final answer. Check with an adult or your diabetes team.'],
      ['.layout > .panel h2', 'Add food', 0],
      ['.layout > .panel h2', 'On the plate', 1],
      ['#ownGram', 'Type in grams yourself']
    ]
  };
  R.innstillinger = {
    txt: [
      ['h1', 'My numbers <em>and checklist.</em>'],
      ['.lead', 'Here you can write down your numbers and go through four questions before you press OK on the pump.'],
      ['main > p[style*="fff7e0"]', '<b>Remember:</b> This page does not work out insulin. Ask an adult for help.'],
      ['section.panel > h2', 'My numbers', 0],
      ['section.panel > h2', 'Check this before you press OK', 1],
      ['section.panel > p.small', 'You got these numbers from your diabetes team. Ask an adult to help you type them in.', 0],
      ['section.panel > p.small', 'Four questions to answer before you press OK on the pump.', 1],
      ['.warn', 'This page does not work out insulin. Only type in the numbers from your team, and check them against the pump.'],
      ['#checks .chk:nth-child(1) b', 'Is the number going up or down?'],
      ['#checks .chk:nth-child(1) .d', 'An arrow means the number is going up or down.'],
      ['#checks .chk:nth-child(2) b', 'Do you have insulin left from before?'],
      ['#checks .chk:nth-child(2) .d', 'The pump subtracts it. Check that it is right.'],
      ['#checks .chk:nth-child(3) b', 'What will you eat, and when?'],
      ['#checks .chk:nth-child(3) .d', 'Is the food ready, or should it wait a bit?'],
      ['#checks .chk:nth-child(4) b', 'Are the carbohydrates right?'],
      ['#checks .chk:nth-child(4) .d', 'Use the Plate. If you are not sure, ask an adult.']
    ],
    labels: {
      'f-karb': ['How many grams of carbohydrate one unit covers', 'grams per unit'],
      'f-korr': ['How much one unit lowers blood sugar', 'mmol/L per unit'],
      'f-mal': ['The number the pump aims for', 'mmol/L'],
      'f-varig': ['How long the insulin works', 'hours']
    }
  };
  var ARR = [
    ['Two arrows up', 'The number is going up very fast.'], ['One arrow up', 'The number is going up fast.'],
    ['Arrow slanting up', 'The number is going up slowly.'], ['Arrow straight across', 'The number is about the same.'],
    ['Arrow slanting down', 'The number is going down slowly.'], ['One arrow down', 'The number is going down fast.'],
    ['Two arrows down', 'The number is going down very fast.']
  ];
  R.trendpiler = {
    txt: [
      ['h1', 'The arrows <em>and the pump.</em>'],
      ['.lead', 'What the arrows on the sensor mean, and how the pump can help you.'],
      ['main > p[style*="fff7e0"]', '<b>Remember:</b> Your screen may look a little different from the pictures here.'],
      ['section.panel > h2', 'What you see on the screen', 0],
      ['.legend li > div', '<b>The number</b><span class="d">This is your blood sugar right now.</span>', 0],
      ['.legend li > div', '<b>The arrow</b><span class="d">It shows if the number is going up or down, and how fast.</span>', 1],
      ['.legend li > div', '<b>The line</b><span class="d">It shows how the number has been over the last few hours.</span>', 2],
      ['section.panel > h2', 'What the arrows mean', 1],
      ['section.panel > p.small', 'Seven arrows, from fastest up to fastest down. Two arrows mean faster than one arrow.',0],
      ['.note', 'You have learned what to do for each arrow from your diabetes team. Ask an adult if you are not sure.', 0]
].concat(ARR.map(function (a, i) { return ['.arrows li > div', '<b>' + a[0] + '</b><span>' + a[1] + '</span>', i]; })).concat([
      ['[data-sen="simplera"] > h2', 'What the arrows mean'],
      ['[data-sen="simplera"] > p.small', 'Up to three arrows, up or down. More arrows mean faster.'],
      ['[data-sen="simplera"] > .note', 'You have learned what to do for each arrow from your diabetes team. Ask an adult if you are not sure.'],
      ['[data-sen="libre"] > h2', 'What the arrows mean'],
      ['[data-sen="libre"] > p.small', 'Five arrows, from fastest up to fastest down.'],
      ['[data-sen="libre"] > .note', 'You have learned what to do for each arrow from your diabetes team. Ask an adult if you are not sure.'],
      ['[data-sen="simplera"] .arrows li > div','<b>Three arrows up</b><span>The number is going up very fast.</span>',0],['[data-sen="simplera"] .arrows li > div','<b>Two arrows up</b><span>The number is going up fast.</span>',1],['[data-sen="simplera"] .arrows li > div','<b>One arrow up</b><span>The number is going up slowly.</span>',2],['[data-sen="simplera"] .arrows li > div','<b>No arrow</b><span>The number is changing slowly.</span>',3],['[data-sen="simplera"] .arrows li > div','<b>One arrow down</b><span>The number is going down slowly.</span>',4],['[data-sen="simplera"] .arrows li > div','<b>Two arrows down</b><span>The number is going down fast.</span>',5],['[data-sen="simplera"] .arrows li > div','<b>Three arrows down</b><span>The number is going down very fast.</span>',6],
      ['[data-sen="libre"] .arrows li > div','<b>Arrow up</b><span>The number is going up fast.</span>',0],['[data-sen="libre"] .arrows li > div','<b>Arrow slanting up</b><span>The number is going up slowly.</span>',1],['[data-sen="libre"] .arrows li > div','<b>Arrow straight across</b><span>The number is changing slowly.</span>',2],['[data-sen="libre"] .arrows li > div','<b>Arrow slanting down</b><span>The number is going down slowly.</span>',3],['[data-sen="libre"] .arrows li > div','<b>Arrow down</b><span>The number is going down fast.</span>',4],
    ]),
    hide: [['main > .grid', 1], ['main > .grid[data-pump="mm"]', 0]],
    add: {
      after: ['main > .grid', 0],
      html: '<section class="panel"><h2>The pump can help you</h2>' +
        '<p class="small" style="margin:0">The pump sees what the number will probably be in half an hour. Then it helps.</p>' +
        '<ul class="e-list"><li><b>The number is heading high</b><span>The pump can give a little more insulin.</span></li>' +
        '<li><b>The number is heading low</b><span>The pump gives less insulin, or stops it.</span></li>' +
        '<li><b>The number is fine</b><span>The pump does what it usually does.</span></li></ul>' +
        '<p>Some pumps only make sure the number does not get too low. They stop the insulin, and start it again when the number goes up.</p>' +
        '<div class="note"><b>The pump cannot stop everything.</b> Tell an adult if you feel unwell or scared. Emergency: call 113.</div></section>'
    }
  };
  R.tallene = {
    txt: [
      ['h1', 'The numbers <em>in the pump.</em>'],
      ['.lead', 'The pump uses four numbers when it works out insulin. Here you can see what they mean.'],
      ['section.panel > p.small', 'Your diabetes team decides your numbers. You should never change them yourself. The numbers here are only an example.', 0],
      ['section.panel > p.small', 'Example: You are going to eat 60 grams of carbohydrate, and your blood sugar is 10.', 1],
      ['#h1a', 'The four numbers'],
      ['#h1b', 'How the pump finds the dose'],
      ['.tal b', 'How many grams of carbohydrate one unit covers', 0],
      ['.tal .d', 'One unit of insulin covers 10 grams of carbohydrate in food.', 0],
      ['.tal b', 'How much one unit lowers blood sugar', 1],
      ['.tal .d', 'One unit lowers blood sugar by 2.', 1],
      ['.tal b', 'The number the pump aims for', 2],
      ['.tal .d', 'The number the pump aims at when it corrects your blood sugar.', 2],
      ['.tal b', 'How long the insulin works', 3],
      ['.tal .d', 'The pump subtracts insulin that is left from before.', 3],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>The food</b><span class="d">60 grams. One unit covers 10 grams. That makes 6 units.</span>', 0],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>The number is too high</b><span class="d">10 is 4 above 6. One unit lowers by 2. That makes 2 units.</span>', 1],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>Add together</b><span class="d">6 and 2 make 8 units. If you have insulin left from before, the pump subtracts it.</span>', 2],
      ['[aria-labelledby="h1b"] .note', '<b>You do not need to calculate yourself.</b> The pump does it when you enter carbohydrates and blood sugar. You only need to check that the numbers you enter are right.'],
      ['[aria-labelledby="h1c"] .big', 'Your diabetes team looks at how much insulin you use, and how your blood sugar goes. When you grow, your body needs something different. Then the team changes the numbers.'],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'Only your diabetes team and the adults change the numbers.', 0],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'Write down your numbers in “My numbers and checklist”, so they are easy to find.', 1],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'If you are not sure about a number on the pump, ask an adult.', 2]
    ],
    hide: [['[aria-labelledby="h1c"] .rule', 0], ['[aria-labelledby="h1c"] .note', 0], ['[aria-labelledby="h1c"] .warn', 0], ['[aria-labelledby="h1c"] p.small', 0]]
  };
  var cfg = R[key];
  if (!cfg) return;

  /* ---------- Stil ---------- */
  var st = document.createElement('style');
  st.textContent =
    '.e-mode{display:inline-flex;background:#e6efff;border-radius:999px;padding:4px;margin:12px 0 4px}' +
    '.e-mode button{font:inherit;font-weight:800;font-size:.95rem;border:0;background:transparent;color:#5b6b82;padding:8px 18px;border-radius:999px;cursor:pointer;min-height:40px}' +
    '.e-mode button[aria-pressed=true]{background:#fff;color:#2563eb;box-shadow:0 1px 4px rgba(0,0,0,.18)}' +
    '.e-mode button:focus-visible{outline:3px solid #7c3aed;outline-offset:2px}' +
    '.e-hide{display:none!important}' +
    '.e-list{list-style:none;margin:10px 0;padding:0}.e-list li{padding:10px 0;border-top:1px solid rgba(15,23,42,.08)}.e-list li:first-child{border-top:0}.e-list b{display:block}' +
    'body.enkel .btn,body.enkel .chip{min-height:48px}body.enkel .lead{font-size:1.15rem}' +
    'body.enkel .layout{display:flex!important;flex-direction:column;align-items:stretch!important;gap:14px}' +
    'body.enkel .layout>.stk{order:0;position:sticky;top:8px;z-index:9;display:flex;align-items:center;gap:14px;background:#fff;border:1px solid #dbe5f5;border-radius:20px;padding:8px 14px;box-shadow:0 6px 18px rgba(15,23,42,.14)}' +
    'body.enkel .stk .plate{margin:0;flex:none}body.enkel .stk .plate svg{width:84px;height:auto}body.enkel .stk .total{text-align:left}' +
    'body.enkel .layout>.e-p2{order:1}body.enkel .layout>.e-p1{order:2}';
  document.head.appendChild(st);

  /* ---------- Bytte ---------- */
  var saved = [];   /* [element, originalInnerHTML] */
  var hidden = [];
  var added = null;
  var labelSaved = [];

  function pick(sel, idx) {
    var l = main.querySelectorAll(sel);
    if (!/data-(sen|pump)/.test(sel)) l = Array.prototype.filter.call(l, function (x) { return !x.closest('[data-sen="libre"],[data-sen="simplera"],[data-pump="mm"]'); });
    return l[idx || 0];
  }

  function apply() {
    cfg.txt.forEach(function (r) {
      var el = pick(r[0], r[2]);
      if (!el) return;
      saved.push([el, el.innerHTML]);
      el.innerHTML = r[1];
    });
    if (cfg.labels) Object.keys(cfg.labels).forEach(function (id) {
      var inp = document.getElementById(id), lab = inp && inp.closest('label');
      if (!lab) return;
      var small = lab.querySelector('small'), tn = null, i;
      for (i = 0; i < lab.childNodes.length; i++) { if (lab.childNodes[i].nodeType === 3 && lab.childNodes[i].nodeValue.trim()) { tn = lab.childNodes[i]; break; } }
      labelSaved.push([tn, tn && tn.nodeValue, small, small && small.textContent]);
      if (tn) tn.nodeValue = cfg.labels[id][0];
      if (small) small.textContent = cfg.labels[id][1];
    });
    (cfg.hide || []).forEach(function (h) { var el = pick(h[0], h[1]); if (el) { el.classList.add('e-hide'); hidden.push(el); } });
    var ES = ''; try { ES = localStorage.getItem('mn_sen') || ''; } catch (x) { }
    if (cfg.add && ES !== 'libre') {
      var after = pick(cfg.add.after[0], cfg.add.after[1]);
      if (after) { added = document.createElement('div'); added.className = after.className; added.innerHTML = cfg.add.html; after.parentNode.insertBefore(added, after.nextSibling); }
    }
    if (key === 'tallerken') plateUp();
    setBack(true);
  }
  function revert() {
    while (saved.length) { var s = saved.pop(); s[0].innerHTML = s[1]; }
    while (labelSaved.length) { var l = labelSaved.pop(); if (l[0]) l[0].nodeValue = l[1]; if (l[2]) l[2].textContent = l[3]; }
    while (hidden.length) hidden.pop().classList.remove('e-hide');
    if (added) { added.remove(); added = null; }
    if (key === 'tallerken') plateDown();
    setBack(false);
    if (window.utRelabel) window.utRelabel();
  }

  /* Tallerkenen: tallerken og sum øverst, og de blir stående når man blar */
  var stk = null, p2 = null, p1 = null, plate = null, total = null, h2b = null;
  function plateUp() {
    var lay = main.querySelector('.layout');
    if (!lay) return;
    p1 = lay.children[0]; p2 = lay.children[1];
    plate = p2 && p2.querySelector('.plate'); total = p2 && p2.querySelector('.total');
    if (!plate || !total) return;
    p1.classList.add('e-p1'); p2.classList.add('e-p2');
    stk = document.createElement('div'); stk.className = 'stk';
    stk.appendChild(plate); stk.appendChild(total);
    lay.insertBefore(stk, lay.firstChild);
    placeStk();
    window.addEventListener('resize', placeStk);
  }
  /* Stripen skal stå rett under sidens egen toppmeny, som også blir stående */
  function placeStk() {
    if (!stk) return;
    var h = document.querySelector('body > header'), top = 0;
    if (h && /sticky|fixed/.test(getComputedStyle(h).position)) top = h.offsetHeight;
    stk.style.top = (top + 6) + 'px';
  }
  function plateDown() {
    if (!stk || !p2) return;
    var h2 = p2.querySelector('h2');
    if (h2) { h2.after(plate); plate.after(total); } else { p2.insertBefore(total, p2.firstChild); p2.insertBefore(plate, p2.firstChild); }
    window.removeEventListener('resize', placeStk);
    stk.remove(); stk = null;
    p1.classList.remove('e-p1'); p2.classList.remove('e-p2');
  }

  /* ---------- Bryter: Vanlig / Enkel ---------- */
  var lead = main.querySelector('.lead');
  var bar = document.createElement('div');
  bar.className = 'e-mode'; if (FORCE) bar.style.display = 'none'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Velg versjon');
  bar.innerHTML = '<button type="button" id="e-vanlig" aria-pressed="true">Vanlig</button><button type="button" id="e-enkel" aria-pressed="false">Enkel</button>';
  if (lead) lead.parentNode.insertBefore(bar, lead.nextSibling); else main.insertBefore(bar, main.firstChild);
  var bV = bar.querySelector('#e-vanlig'), bE = bar.querySelector('#e-enkel'), cur = false;

  function set(enkel, fromUser) {
    if (enkel === cur) return;
    cur = enkel;
    if (enkel) apply(); else revert();
    document.body.classList.toggle('enkel', enkel);
    bV.setAttribute('aria-pressed', enkel ? 'false' : 'true');
    bE.setAttribute('aria-pressed', enkel ? 'true' : 'false');
    if (fromUser) { try { history.replaceState(null, '', enkel ? '#enkel' : location.pathname + location.search); } catch (e) {} }
  }
  bV.addEventListener('click', function () { set(false, true); });
  bE.addEventListener('click', function () { set(true, true); });
  window.addEventListener('hashchange', function () { set(on(), false); });
  set(on(), false);
  if (FORCE) shell();
})();
