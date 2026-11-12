/* Ditt utstyr: velg pumpe og sensor. Lagres bare på denne enheten (localStorage). Deles med Manualer. */
(function () {
  var EN = document.documentElement.lang === 'en';
  var T = EN ? {
    pump: 'Choose pump', sen: 'Choose sensor', other: 'Other / not sure',
    suit: 'Sensor that fits: ', mine: 'Your equipment: ', edit: 'Change', pick: 'Choose your equipment',
    none: 'You have not chosen a pump or sensor.', noneB: ' These pages are made for Tandem pump with Dexcom sensor, or MiniMed 780G with Simplera Sync, so they may be misleading for you. ',
    fitB: 'This page fits your equipment: ', fitA: '. Your screen may still look a little different.',
    warnA: 'You have chosen ', warnB: '. This page is made for Tandem pump with Dexcom sensor, or MiniMed 780G with Simplera Sync, so the arrows and names may look different for you. Find guides for your equipment under ',
    warnE: '. This page is made for Tandem pump with Dexcom sensor, or MiniMed 780G with Simplera Sync, so the arrows and names may look different for you.', frontWarn: ' The pages are made for Tandem pump with Dexcom sensor, or MiniMed 780G with Simplera Sync, so they may be misleading for you.', man: 'Manuals', oldB: 'Made for Dexcom sensor and Tandem pump.', oldA: ' If you have another pump, this may be misleading for you. ',
    soonTag: ' (coming soon)', soonH: 'Coming soon. ', soonA: 'We have not made the pages for ', soonB: ' yet. You can tap "Just look around", but the pages may be misleading for you.', soonE: 'You can continue to the simple version, but its pages are made for Tandem pump with Dexcom sensor, or MiniMed 780G with Simplera Sync, and may be misleading for you.', noOther: 'other equipment',
    home: '/nyttig/diabetes/en/?velg', manPath: '/nyttig/diabetes/en/manualer/',
    N: { dash: 'Omnipod DASH has no fixed sensor. Choose the one you use.', solo: 'Accu-Chek Solo has no fixed sensor in our list. Choose the one you use.', o5: 'Omnipod 5 can be used with Dexcom G6, Dexcom G7 and FreeStyle Libre 2 Plus.', tslim: 'Tandem t:slim X2 is used with Dexcom G7 and G6.', ypso: 'mylife YpsoPump is often used with FreeStyle Libre.', mm: 'MiniMed 780G is used with Simplera Sync (and Instinct or Guardian 4).' }
  } : {
    pump: 'Velg pumpe', sen: 'Velg sensor', other: 'Annen / vet ikke',
    suit: 'Sensor som passer: ', mine: 'Ditt utstyr: ', edit: 'Endre', pick: 'Velg utstyret ditt',
    none: 'Du har ikke valgt pumpe eller sensor.', noneB: ' Sidene er laget for Tandem-pumpe med Dexcom-sensor, eller MiniMed 780G med Simplera Sync, så de kan være misvisende for deg. ',
    fitB: 'Denne siden passer for utstyret ditt: ', fitA: '. Skjermen din kan likevel se litt annerledes ut.',
    warnA: 'Du har valgt ', warnB: '. Denne siden er laget for Tandem-pumpe med Dexcom-sensor, eller MiniMed 780G med Simplera Sync, så pilene og navnene kan se annerledes ut hos deg. Veiledning for ditt utstyr finner du under ',
    warnE: '. Denne siden er laget for Tandem-pumpe med Dexcom-sensor, eller MiniMed 780G med Simplera Sync, så pilene og navnene kan se annerledes ut hos deg.', frontWarn: ' Sidene er laget for Tandem-pumpe med Dexcom-sensor, eller MiniMed 780G med Simplera Sync, så de kan være misvisende for deg.', man: 'Manualer', oldB: 'Laget for Dexcom-sensor og Tandem-pumpe.', oldA: ' Har du en annen pumpe, kan det være misvisende for deg. ',
    soonTag: ' (kommer snart)', soonH: 'Kommer snart. ', soonA: 'Vi har ikke laget sidene for ', soonB: ' ennå. Du kan trykke «Bare se meg rundt», men sidene kan være misvisende for deg.', soonE: 'Du kan gå videre til enkel versjon, men sidene der er laget for Tandem-pumpe med Dexcom-sensor, eller MiniMed 780G med Simplera Sync, og kan være misvisende for deg.', noOther: 'annet utstyr',
    home: '/nyttig/diabetes/?velg', manPath: '/nyttig/diabetes/manualer/',
    N: { dash: 'Omnipod DASH har ingen fast sensor. Velg den du bruker.', solo: 'Accu-Chek Solo har ingen fast sensor i listen vår. Velg den du bruker.', o5: 'Omnipod 5 kan brukes med Dexcom G6, Dexcom G7 og FreeStyle Libre 2 Plus.', tslim: 'Tandem t:slim X2 brukes med Dexcom G7 og G6.', ypso: 'mylife YpsoPump brukes ofte med FreeStyle Libre.', mm: 'MiniMed 780G brukes med Simplera Sync (og Instinct eller Guardian 4).' }
  };
  var PUMPS = [['tslim', 'Tandem t:slim X2'], ['dash', 'Omnipod DASH'], ['o5', 'Omnipod 5'], ['ypso', 'mylife YpsoPump'], ['mm', 'Medtronic MiniMed 780G'], ['solo', 'Accu-Chek Solo']];
  var SENS = [['g7', 'Dexcom G7'], ['g6', 'Dexcom G6'], ['libre', 'FreeStyle Libre 3 Plus'], ['simplera', 'Simplera Sync']];
  /* Ferdig laget: legg til id her når sidene er klare for en pumpe eller sensor. */
  var SUP = { p: ['tslim', 'mm'], s: ['g7', 'g6', 'simplera'] };
  /* Pumpe og sensor som hører sammen i sidene våre. */
  var PAIRS = ['tslim+g7', 'tslim+g6', 'mm+simplera'];
  function pairOk(p, s) { return !p || !s || PAIRS.indexOf(p + '+' + s) > -1; }
  var PDEF = { g7: 'tslim', g6: 'tslim', simplera: 'mm' };
  var SUGG = { tslim: 'g7', o5: 'g7', ypso: 'libre', mm: 'simplera' };
  function $(i) { return document.getElementById(i); }
  function g(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  function st(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { } }
  function nm(a, v) { for (var i = 0; i < a.length; i++) if (a[i][0] === v) return a[i][1]; return ''; }
  function get() { var p = nm(PUMPS, g('mn_pump')) ? g('mn_pump') : '', s = nm(SENS, g('mn_sen')) ? g('mn_sen') : '', o = g('mn_other') ? '1' : ''; return { p: p, s: s, o: o }; }
  function names(c) { var t = []; if (c.p) t.push(nm(PUMPS, c.p)); if (c.s) t.push(nm(SENS, c.s)); if (c.o) t.push(T.other); return t; }
  function fitOf(c) { return (c.p === 'tslim' && (c.s === 'g7' || c.s === 'g6' || !c.s)) || (c.p === 'mm' && (c.s === 'simplera' || !c.s)) || (!c.p && !c.o && (c.s === 'g7' || c.s === 'g6' || c.s === 'simplera')); }
  function has(c) { return !!(c.p || c.s || c.o); }
  var root = document.documentElement;
  var ENK = root.hasAttribute('data-enkel') || /\/diabetes-(enkel|simple)\//.test(location.pathname);

  /* ---- Varsel på undersidene ---- */
  var ban = document.querySelector('p.pump');
  if (ban) {
    var c = get();
    var okx = ban.getAttribute('data-ok-' + c.p + '-' + c.s);
    if (okx) {
      ban.style.background = '#e6f7ee'; ban.style.borderColor = '#8fd3ae'; ban.style.color = '#0f5132';
      ban.innerHTML = okx;
    } else if (c.s === 'libre' && ban.getAttribute('data-libre')) {
      ban.style.background = '#e6f7ee'; ban.style.borderColor = '#8fd3ae'; ban.style.color = '#0f5132';
      ban.innerHTML = ban.getAttribute('data-libre');
    } else if (!has(c)) {
      ban.innerHTML = '<b>' + T.oldB + '</b>' + T.oldA + (ENK ? '' : '<a href="' + T.home + '">' + T.pick + '</a>.');
    } else {
      var n = names(c).join(EN ? ' and ' : ' og ');
      var fits = fitOf(c);
      if (fits) {
        ban.style.background = '#e6f7ee'; ban.style.borderColor = '#8fd3ae'; ban.style.color = '#0f5132';
        ban.innerHTML = '<b>' + T.fitB + '</b>' + n + T.fitA;
      } else {
        ban.innerHTML = ENK ? '<b>' + T.warnA + n + '.</b>' + T.warnE.slice(1) : '<b>' + T.warnA + n + '.</b>' + T.warnB.slice(1) + '<a href="' + T.manPath + '">' + T.man + '</a>. <a href="' + T.home + '">' + T.edit + '</a>';
      }
    }
  }

  /* ---- Forsiden i enkel versjon: vis valgt utstyr ---- */
  if (ENK && !ban) {
    var fold = document.querySelector('.folder');
    if (fold && fold.parentNode) {
      var c2 = get(), n2 = document.createElement('p');
      n2.style.cssText = 'margin:0 0 14px;border-radius:14px;padding:10px 12px;font-size:.9rem;line-height:1.4;';
      var fits2 = fitOf(c2);
      if (has(c2)) {
        n2.style.background = fits2 ? '#e6f7ee' : '#fff1ec'; n2.style.color = fits2 ? '#0f5132' : '#6b2a10'; if (!fits2) n2.style.border = '1.5px solid #f0a68a';
        n2.innerHTML = '<b>' + T.mine + '</b>' + names(c2).join(' + ') + '.' + (fits2 ? '' : T.frontWarn);
      } else {
        n2.style.background = '#fff1ec'; n2.style.border = '1.5px solid #f0a68a'; n2.style.color = '#6b2a10';
        n2.innerHTML = '<b>' + T.none + '</b>' + T.frontWarn;
      }
      fold.parentNode.insertBefore(n2, fold);
    }
  }

  /* ---- Vis og skjul deler av siden etter utstyr ----
     data-sen="g7 g6" / data-pump="tslim": vises bare for dette utstyret.
     data-for-mm="tekst" / data-for-libre="tekst": bytter innholdet når pumpen eller sensoren er den valgte. Uten valg vises Tandem og Dexcom. */
  (function () {
    var c = get(), S = c.s || (c.p && SUGG[c.p]) || '', P = c.p || PDEF[S] || '';
    if (!c.p && !c.s) { S = ''; P = ''; }
    function ok(v, a, d) { if (!a) return true; var l = a.split(' '); return v ? l.indexOf(v) > -1 : l.indexOf(d) > -1; }
    var els = document.querySelectorAll('[data-sen],[data-pump]');
    for (var i = 0; i < els.length; i++) {
      var e = els[i], show = ok(S, e.getAttribute('data-sen'), 'g7') && ok(P, e.getAttribute('data-pump'), 'tslim');
      e.hidden = !show; e.style.display = show ? '' : 'none';
    }
    function relabel() {
      if (P !== 'mm' || document.body.classList.contains('enkel')) return;
      var ls = document.querySelectorAll('[data-lab-mm]');
      for (var q = 0; q < ls.length; q++) for (var w = 0; w < ls[q].childNodes.length; w++) { var nd = ls[q].childNodes[w]; if (nd.nodeType === 3 && nd.nodeValue.trim()) { nd.nodeValue = ls[q].getAttribute('data-lab-mm'); break; } }
    }
    relabel(); window.utRelabel = relabel;
    var ks = [P, S];
    for (var k = 0; k < ks.length; k++) {
      if (!ks[k]) continue;
      var ms = document.querySelectorAll('[data-for-' + ks[k] + ']');
      for (var j = 0; j < ms.length; j++) ms[j].innerHTML = ms[j].getAttribute('data-for-' + ks[k]);
    }
  })();

  /* ---- Velkomst og forside ---- */
  var vk = $('velkommen'); if (!vk) return;
  var ps = $('ut-p'), ss = $('ut-s'), rec = $('ut-rec'), go = $('ut-go'), se = $('ut-se'), note = null;
  function fill(el, ph, a, kind) { var h = '<option value="">' + ph + '</option>'; for (var i = 0; i < a.length; i++) h += '<option value="' + a[i][0] + '">' + a[i][1] + (SUP[kind].indexOf(a[i][0]) < 0 ? T.soonTag : '') + '</option>'; el.innerHTML = h + '<option value="annen">' + T.other + '</option>'; }
  fill(ps, T.pump, PUMPS, 'p'); fill(ss, T.sen, SENS, 's');
  function ver() { var r = document.querySelector('input[name="ut-v"]:checked'); return r ? r.value : 'vanlig'; }
  function bad(kind, v) { return !!v && (v === 'annen' || SUP[kind].indexOf(v) < 0); }
  var soon = document.createElement('p'); soon.id = 'ut-soon'; soon.setAttribute('role', 'status'); soon.hidden = true;
  soon.style.cssText = 'margin:12px 0 0;font-size:.9rem;border-radius:12px;padding:8px 10px;line-height:1.4;';
  rec.parentNode.insertBefore(soon, rec.nextSibling);
  function chk() {
    var pb = bad('p', ps.value), sb = bad('s', ss.value), enk = ver() === 'enkel', nm2 = [];
    if (pb) nm2.push(ps.value === 'annen' ? T.noOther : nm(PUMPS, ps.value));
    if (sb) nm2.push(ss.value === 'annen' ? T.noOther : nm(SENS, ss.value));
    var pairBad = !pb && !sb && ps.value && ss.value && !pairOk(ps.value, ss.value);
    if (pairBad) nm2.push(nm(PUMPS, ps.value) + ' + ' + nm(SENS, ss.value));
    if (nm2.length && enk) { soon.hidden = false; soon.style.background = '#e8f1ff'; soon.style.color = '#1e3a8a'; soon.style.border = '0'; soon.innerHTML = T.soonE; }
    else if (nm2.length) { soon.hidden = false; soon.style.background = '#fff1ec'; soon.style.border = '1.5px solid #f0a68a'; soon.style.color = '#6b2a10'; soon.innerHTML = '<b>' + T.soonH + '</b>' + T.soonA + nm2.join(EN ? ' and ' : ' og ') + T.soonB; }
    else { soon.hidden = true; }
    go.disabled = !(ps.value || ss.value || enk) || ((pb || sb || pairBad) && !enk);
  }
  var rv = document.querySelectorAll('input[name="ut-v"]'); for (var ri = 0; ri < rv.length; ri++) rv[ri].addEventListener('change', chk);
  function recDraw() {
    var v = ps.value, t = '';
    if (SUGG[v]) t = '<b>' + T.suit + nm(SENS, SUGG[v]) + '.</b> ';
    if (T.N[v]) t += T.N[v] + ' ';
    if (t && v) t += EN ? 'You can change the sensor in the menu.' : 'Du kan bytte sensor i menyen.';
    rec.hidden = !t; rec.innerHTML = t;
  }
  ps.addEventListener('change', function () { var v = ps.value; if (SUGG[v]) ss.value = SUGG[v]; else if (v) ss.value = ''; recDraw(); chk(); });
  ss.addEventListener('change', chk);
  function preset() { var c = get(); var vv = g('mn_ver') === 'enkel' ? 'enkel' : 'vanlig'; for (var q = 0; q < rv.length; q++) rv[q].checked = rv[q].value === vv; ps.value = c.p || (c.o && !c.s ? 'annen' : ''); ss.value = c.s || ''; recDraw(); chk(); }
  function openVk() { preset(); root.className += ' vk'; window.scrollTo(0, 0); }
  function closeVk() { root.className = root.className.replace(/(^|\s)vk(?=\s|$)/g, ''); window.scrollTo(0, 0); drawNote(); }
  go.addEventListener('click', function () {
    st('mn_pump', ps.value && ps.value !== 'annen' ? ps.value : '');
    st('mn_sen', ss.value && ss.value !== 'annen' ? ss.value : '');
    st('mn_other', (ps.value === 'annen' || ss.value === 'annen') ? '1' : '');
    st('mn_ver', ver() === 'enkel' ? 'enkel' : '');
    try { sessionStorage.removeItem('mn_skip'); } catch (e) { }
    if (ver() === 'enkel') { var u = document.querySelector('input[name="ut-v"][value="enkel"]').getAttribute('data-url'); location.href = u; return; }
    try { if (/[?&]velg/.test(location.search)) history.replaceState(null, '', location.pathname); } catch (e) { }
    closeVk();
  });
  se.addEventListener('click', function () {
    try { sessionStorage.setItem('mn_skip', '1'); } catch (e) { }
    try { if (/[?&]velg/.test(location.search)) history.replaceState(null, '', location.pathname); } catch (e) { }
    closeVk();
  });
  function drawNote() {
    if (!note) { note = document.createElement('div'); note.id = 'utnote'; var ref = $('snar'); if (ref && ref.parentNode) ref.parentNode.insertBefore(note, ref); else return; }
    var c = get(), a;
    note.style.cssText = 'margin:0 0 14px;border-radius:14px;padding:10px 12px;font-size:.88rem;line-height:1.4;';
    if (has(c)) {
      note.style.background = '#e8f1ff'; note.style.color = '#1e3a8a';
      note.innerHTML = '<b>' + T.mine + '</b>' + names(c).join(' + ') + '. <a href="#" style="color:#2563eb;font-weight:800">' + T.edit + '</a>';
    } else {
      note.style.background = '#fff1ec'; note.style.border = '1.5px solid #f0a68a'; note.style.color = '#6b2a10';
      note.innerHTML = '<b>' + T.none + '</b>' + T.noneB + '<a href="#" style="color:#2563eb;font-weight:800">' + T.pick + '</a>';
    }
    a = note.querySelector('a'); a.onclick = function (e) { e.preventDefault(); openVk(); };
  }
  if (/(^|\s)vk(?=\s|$)/.test(root.className)) preset();
  drawNote();
})();
