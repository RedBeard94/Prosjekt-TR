/* © 2026 Reinertsengruppen · Thomas Reinertsen · reinertsengruppen.no · Alle rettigheter forbeholdt. */
/* Enkel versjon av Diabetes-sidene: bytter til enklere tekst, uten å endre verktøyene. Slås på med #enkel i adressen. */
(function () {
  'use strict';
  var main = document.querySelector('main');
  if (!main) return;
  var parts = location.pathname.replace(/index\.html$/, '').split('/').filter(Boolean);
  var key = parts[parts.length - 1];
  var BACK = '../enkel/index.html';

  function on() { return location.hash === '#enkel' || location.hash === '#barn'; }

  /* ---------- Bare tilbake-lenken på «Mat og blodsukker» (har egen bryter) ---------- */
  var back = main.querySelector('a.back');
  var backOrig = null;
  function setBack(enkel) {
    if (!back) return;
    var tn = null, i, n;
    for (i = back.childNodes.length - 1; i >= 0; i--) { n = back.childNodes[i]; if (n.nodeType === 3 && n.nodeValue.trim()) { tn = n; break; } }
    if (!backOrig) backOrig = { href: back.getAttribute('href'), text: tn ? tn.nodeValue : null };
    back.setAttribute('href', enkel ? BACK : backOrig.href);
    if (tn && backOrig.text != null) tn.nodeValue = enkel ? 'Tilbake' : backOrig.text;
  }
  if (key === 'mat-og-blodsukker') {
    var upd = function () { setBack(on() || (document.getElementById('m-kid') && document.getElementById('m-kid').getAttribute('aria-pressed') === 'true')); };
    ['m-kid', 'm-adult'].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.addEventListener('click', function () { setTimeout(upd, 0); });
    });
    upd();
    return;
  }

  /* ---------- Tekster i enkel versjon ---------- */
  var R = {};
  R.tallerken = {
    txt: [
      ['.lead', 'Finn ut hvor mye karbohydrat det er i maten. Søk opp maten, legg den på tallerkenen, og se summen.'],
      ['main > p[style*="fff7e0"]', '<b>Husk:</b> Dette hjelper deg å finne ut av det. Det er ikke fasit. Sjekk med en voksen eller diabetesteamet.'],
      ['.layout > .panel h2', 'Legg til mat', 0],
      ['.layout > .panel h2', 'På tallerkenen', 1],
      ['#ownGram', 'Skriv inn gram selv'],
      ['#warn', '<b>Oi, det er mye!</b> Sjekk at du har skrevet riktig tall. Spør en voksen om hjelp.']
    ]
  };
  R.innstillinger = {
    txt: [
      ['h1', 'Mine tall og <em>sjekkliste.</em>'],
      ['.lead', 'Her kan du skrive ned tallene dine, og gå gjennom fire spørsmål før du trykker OK på pumpen.'],
      ['main > p[style*="fff7e0"]', '<b>Husk:</b> Denne siden regner ikke ut insulin. Spør en voksen om hjelp.'],
      ['section.panel > h2', 'Tallene mine', 0],
      ['section.panel > h2', 'Sjekk dette før du trykker OK', 1],
      ['section.panel > p.small', 'Tallene har du fått av diabetesteamet. Be en voksen hjelpe deg å skrive dem inn.', 0],
      ['section.panel > p.small', 'Fire spørsmål å svare på før du trykker OK på pumpen.', 1],
      ['.warn', 'Denne siden regner ikke ut insulin. Skriv bare inn tallene fra teamet, og sjekk dem mot pumpen.'],
      ['#checks .chk:nth-child(1) b', 'Går tallet opp eller ned?'],
      ['#checks .chk:nth-child(1) .d', 'En pil betyr at tallet er på vei opp eller ned.'],
      ['#checks .chk:nth-child(2) b', 'Har du insulin igjen fra før?'],
      ['#checks .chk:nth-child(2) .d', 'Pumpen trekker det fra. Sjekk at det stemmer.'],
      ['#checks .chk:nth-child(3) b', 'Hva skal du spise, og når?'],
      ['#checks .chk:nth-child(3) .d', 'Er maten klar, eller skal den vente litt?'],
      ['#checks .chk:nth-child(4) b', 'Stemmer karbohydratene?'],
      ['#checks .chk:nth-child(4) .d', 'Bruk Tallerkenen. Er du usikker, spør en voksen.']
    ],
    labels: {
      'f-karb': ['Hvor mye karbohydrat én enhet tar', 'gram per enhet'],
      'f-korr': ['Hvor mye én enhet senker blodsukkeret', 'mmol/L per enhet'],
      'f-mal': ['Tallet pumpen prøver å nå', 'mmol/L'],
      'f-varig': ['Hvor lenge insulinet virker', 'timer']
    }
  };
  var ARR = [
    ['To piler opp', 'Tallet går opp aller fortest.'], ['En pil opp', 'Tallet går opp fort.'],
    ['Pil skrått opp', 'Tallet går sakte opp.'], ['Pil rett frem', 'Tallet er omtrent likt.'],
    ['Pil skrått ned', 'Tallet går sakte ned.'], ['En pil ned', 'Tallet går ned fort.'],
    ['To piler ned', 'Tallet går ned aller fortest.']
  ];
  R.trendpiler = {
    txt: [
      ['h1', 'Pilene og <em>pumpen.</em>'],
      ['.lead', 'Hva pilene på sensoren betyr, og hvordan pumpen kan hjelpe deg selv.'],
      ['main > p[style*="fff7e0"]', '<b>Husk:</b> Skjermen din kan se litt annerledes ut enn tegningene her.'],
      ['section.panel > h2', 'Det du ser på skjermen', 0],
      ['.legend li > div', '<b>Tallet</b><span class="d">Det er blodsukkeret ditt akkurat nå.</span>', 0],
      ['.legend li > div', '<b>Pilen</b><span class="d">Den viser om tallet går opp eller ned, og hvor fort.</span>', 1],
      ['.legend li > div', '<b>Streken</b><span class="d">Den viser hvordan tallet har vært de siste timene.</span>', 2],
      ['section.panel > h2', 'Hva pilene betyr', 1],
      ['section.panel > p.small', 'Sju piler, fra raskest opp til raskest ned. To piler betyr fortere enn én pil.',0],
      ['.note', 'Hva du skal gjøre ved hver pil, har du lært av diabetesteamet. Spør en voksen hvis du er usikker.', 0]
    ].concat(ARR.map(function (a, i) { return ['.arrows li > div', '<b>' + a[0] + '</b><span>' + a[1] + '</span>', i]; })),
    hide: [['main > .grid', 1]],
    add: {
      after: ['main > .grid', 0],
      html: '<section class="panel"><h2>Pumpen kan hjelpe deg</h2>' +
        '<p class="small" style="margin:0">Pumpen ser hva tallet trolig blir om en halv time. Så hjelper den til.</p>' +
        '<ul class="e-list"><li><b>Tallet går mot å bli høyt</b><span>Pumpen kan gi litt mer insulin.</span></li>' +
        '<li><b>Tallet går mot å bli lavt</b><span>Pumpen gir mindre insulin, eller stopper det.</span></li>' +
        '<li><b>Tallet er greit</b><span>Pumpen gjør det den vanligvis gjør.</span></li></ul>' +
        '<p>Noen pumper passer bare på at tallet ikke blir for lavt. De stopper insulinet, og starter det igjen når tallet går opp.</p>' +
        '<div class="note"><b>Pumpen kan ikke stoppe alt.</b> Si fra til en voksen hvis du blir dårlig eller er redd. Akutt: ring 113.</div></section>'
    }
  };
  R.tallene = {
    txt: [
      ['h1', 'Tallene i <em>pumpen.</em>'],
      ['.lead', 'Pumpen bruker fire tall når den regner ut insulin. Her ser du hva de betyr.'],
      ['section.panel > p.small', 'Det er diabetesteamet som bestemmer tallene dine. Du skal aldri endre dem selv. Tallene her er bare et eksempel.', 0],
      ['section.panel > p.small', 'Eksempel: Du skal spise 60 gram karbohydrat, og blodsukkeret er 10.', 1],
      ['#h1a', 'De fire tallene'],
      ['#h1b', 'Slik finner pumpen dosen'],
      ['.tal b', 'Hvor mye karbohydrat én enhet tar', 0],
      ['.tal .d', 'Én enhet insulin tar 10 gram karbohydrat i maten.', 0],
      ['.tal b', 'Hvor mye én enhet senker blodsukkeret', 1],
      ['.tal .d', 'Én enhet senker blodsukkeret med 2.', 1],
      ['.tal b', 'Tallet pumpen prøver å nå', 2],
      ['.tal .d', 'Tallet pumpen sikter mot når den skal rette opp blodsukkeret.', 2],
      ['.tal b', 'Hvor lenge insulinet virker', 3],
      ['.tal .d', 'Pumpen trekker fra insulin som er igjen fra før.', 3],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>Maten</b><span class="d">60 gram. Én enhet tar 10 gram. Da blir det 6 enheter.</span>', 0],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>Tallet er for høyt</b><span class="d">10 er 4 over 6. Én enhet senker med 2. Da blir det 2 enheter.</span>', 1],
      ['[aria-labelledby="h1b"] .steps li > div', '<b>Legge sammen</b><span class="d">6 og 2 blir 8 enheter. Har du insulin igjen fra før, trekker pumpen det fra.</span>', 2],
      ['[aria-labelledby="h1b"] .note', '<b>Du trenger ikke regne selv.</b> Pumpen gjør det når du legger inn karbohydrater og blodsukker. Du skal bare sjekke at tallene du legger inn stemmer.'],
      ['[aria-labelledby="h1c"] .big', 'Diabetesteamet ser på hvor mye insulin du bruker, og hvordan blodsukkeret ditt går. Når du vokser, trenger kroppen noe annet. Da endrer teamet tallene.'],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'Bare diabetesteamet og de voksne endrer tallene.', 0],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'Skriv ned tallene dine i «Mine tall og sjekkliste», så er de lette å finne.', 1],
      ['[aria-labelledby="h1d"] .steps li > span:last-child', 'Er du usikker på et tall på pumpen, spør en voksen.', 2]
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

  function pick(sel, idx) { return main.querySelectorAll(sel)[idx || 0]; }

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
    if (cfg.add) {
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
  bar.className = 'e-mode'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Velg versjon');
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
})();
