/* © 2026 Reinertsengruppen · Thomas Reinertsen · reinertsengruppen.no · Alle rettigheter forbeholdt. */
/* Matvaretabellen (Mattilsynet): en kopi av karbohydrattallene ligger på vår egen side (matvaretabellen.json).
   Søket skjer på enheten din. Ingenting sendes til Mattilsynet eller til oss.
   Kilde: Matvaretabellen 2026. Mattilsynet. www.matvaretabellen.no (NLOD 2.0). Mattilsynet står ikke bak denne siden.
   Her ligger også valget «Hvor skal jeg lete?» (begge / bare Matvaretabellen / bare Reinertsengruppen),
   som huskes på telefonen under navnet mn_kilde og brukes av Søk mat, Tallerken og Cat. */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || 'no').slice(0, 2) === 'en';
  var URL_ = '/nyttig/diabetes/matvaretabellen.json';
  var KEY = 'mn_kilde', VALG = ['begge', 'mvt', 'rg'];
  var T = EN ? {
    h: 'Where should I look?', b: 'Both tables', m: 'Only Matvaretabellen', r: 'Only Reinertsengruppen',
    note: 'Your choice is saved on this phone.', per: 'g carbs per 100 g',
    src: 'Source: Matvaretabellen 2026. Mattilsynet.', add: 'Add to the plate →',
    none: 'Nothing found in Matvaretabellen. Try another word.', err: 'Matvaretabellen could not be loaded right now.',
    mh: 'Matvaretabellen (Mattilsynet)', ms: 'Official numbers from the Norwegian Food Safety Authority. They are averages, so always check the packet if you have it.'
  } : {
    h: 'Hvor skal jeg lete?', b: 'Begge tabellene', m: 'Bare Matvaretabellen', r: 'Bare Reinertsengruppen',
    note: 'Valget huskes på denne telefonen.', per: 'g karbo per 100 g',
    src: 'Kilde: Matvaretabellen 2026. Mattilsynet.', add: 'Legg på tallerkenen →',
    none: 'Fant ingenting i Matvaretabellen. Prøv et annet ord.', err: 'Matvaretabellen kunne ikke hentes nå.',
    mh: 'Matvaretabellen (Mattilsynet)', ms: 'Offisielle tall fra Mattilsynet. Tallene er gjennomsnitt, så sjekk alltid pakken hvis du har den.'
  };
  var st = { p: null, rows: [] };

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nb(v) { return Number(v).toLocaleString(EN ? 'en-GB' : 'nb-NO', { maximumFractionDigits: 1 }); }

  function kilde() { var v = null; try { v = localStorage.getItem(KEY); } catch (e) { } return VALG.indexOf(v) >= 0 ? v : 'begge'; }
  function setKilde(v) {
    if (VALG.indexOf(v) < 0) return;
    try { localStorage.setItem(KEY, v); } catch (e) { }
    try { document.dispatchEvent(new CustomEvent('kilde-endret', { detail: v })); } catch (e) { }
  }

  /* Leser filen. Hver rad: [id, navn, engelsk navn, karbo per 100 g, [[porsjon, gram]...], søkeord] */
  function load() {
    if (st.p) return st.p;
    st.p = fetch(URL_).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); }).then(function (j) {
      var a = j && Array.isArray(j.f) ? j.f : [], rows = [];
      for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if (!x || typeof x[1] !== 'string' || typeof x[3] !== 'number' || !(x[3] >= 0 && x[3] <= 100)) continue;
        var name = EN && x[2] ? x[2] : x[1];
        rows.push({ id: String(x[0]), name: name, carbs: x[3], ports: Array.isArray(x[4]) ? x[4].map(function (p) { return { n: String(p[0]), g: +p[1] }; }) : [], s: norm(name + ' ' + (x[5] || '')) });
      }
      st.rows = rows; return rows;
    }).catch(function (e) { st.p = null; throw e; });
    return st.p;
  }

  function search(q, max) {
    q = norm(q).trim(); if (!q) return [];
    var ws = q.split(/\s+/), res = [];
    for (var k = 0; k < st.rows.length; k++) {
      var f = st.rows[k], ok = true, score = 0;
      for (var i = 0; i < ws.length; i++) {
        var ix = f.s.indexOf(ws[i]);
        if (ix < 0) { ok = false; break; }
        var after = f.s.charAt(ix + ws[i].length);
        score += (ix === 0 ? 0 : (/[ ,(]/.test(f.s.charAt(ix - 1)) ? 1 : 3)) + (/[a-z0-9æøå]/.test(after) ? 1 : 0);
      }
      if (ok) res.push([score + f.name.length / 100 + (/t[oø]rket|hermetisk|syltet|kake|pai|chips|juice|gr[oø]t|dried|canned|jam|jelly|juice|pie|cake/.test(f.s) ? 0.4 : 0), f]);
    }
    res.sort(function (a, b) { return a[0] - b[0]; });
    return res.slice(0, max || 15).map(function (x) { return x[1]; });
  }

  /* Knappene «Hvor skal jeg lete?» */
  function css() {
    if (document.getElementById('kv-css')) return;
    var s = document.createElement('style'); s.id = 'kv-css';
    s.textContent = '.kv{margin:10px 0 4px}.kv p{margin:0 0 6px;font-weight:700}.kv .kvb{display:flex;flex-wrap:wrap;gap:6px}' +
      '.kv button{font:inherit;font-size:15px;padding:8px 12px;border-radius:999px;border:1.5px solid #c9d6ea;background:#fff;color:#0f172a;cursor:pointer;min-height:40px}' +
      '.kv button[aria-pressed="true"]{background:#2563eb;border-color:#2563eb;color:#fff;font-weight:700}' +
      '.kv small{display:block;color:#5b6b82;margin-top:6px}';
    document.head.appendChild(s);
  }
  function valg(el) {
    if (!el) return; css();
    el.className = (el.className ? el.className + ' ' : '') + 'kv';
    el.innerHTML = '<p id="kvh">' + esc(T.h) + '</p><div class="kvb" role="group" aria-labelledby="kvh">' +
      [['begge', T.b], ['mvt', T.m], ['rg', T.r]].map(function (o) { return '<button type="button" data-kv="' + o[0] + '">' + esc(o[1]) + '</button>'; }).join('') +
      '</div><small>' + esc(T.note) + '</small>';
    function mark() { var v = kilde(); Array.prototype.forEach.call(el.querySelectorAll('[data-kv]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-kv') === v)); }); }
    el.addEventListener('click', function (e) { var b = e.target.closest ? e.target.closest('[data-kv]') : null; if (b) setKilde(b.getAttribute('data-kv')); });
    document.addEventListener('kilde-endret', mark); mark();
  }

  /* Søk mat: kortet for Matvaretabellen, og vis/skjul kortene etter valget */
  function sokMat() {
    var q = document.getElementById('q'), card = document.getElementById('mvt'), ul = document.getElementById('mvtList'), msg = document.getElementById('mvtMsg'), rgm = document.getElementById('rgm');
    if (!q || !card || !ul) return;
    var h = card.querySelector('h2'), sub = card.querySelector('.sub');
    if (h) h.textContent = T.mh; if (sub) sub.textContent = T.ms;
    var ok = false;
    function draw() {
      var v = q.value.trim();
      if (!ok) return;
      if (!v) { ul.innerHTML = ''; msg.textContent = ''; return; }
      var r = search(v, 8);
      ul.innerHTML = r.map(function (f) {
        return '<li style="border-top:1px solid #e3eaf5;padding:10px 0"><b>' + esc(f.name) + '</b><br><span>' + nb(f.carbs) + ' ' + esc(T.per) + '</span><br><small style="color:#5b6b82">' + esc(T.src) + '</small><br><a href="../tallerken/index.html?mt=' + encodeURIComponent(f.id) + '" style="font-weight:800">' + esc(T.add) + '</a></li>';
      }).join('');
      msg.textContent = r.length ? '' : T.none;
    }
    function hent() { if (ok) return; load().then(function () { ok = true; draw(); }).catch(function () { msg.textContent = T.err; }); }
    function vis() {
      var v = kilde();
      card.hidden = v === 'rg';
      if (rgm && (window.RGMAT && RGMAT.base)) rgm.hidden = v === 'mvt';
    }
    q.addEventListener('focus', hent);
    q.addEventListener('input', function () { hent(); draw(); });
    document.addEventListener('kilde-endret', vis); vis();
    if (q.value) hent();
  }

  window.MVT = { load: load, search: search, rows: function () { return st.rows; }, kilde: kilde, setKilde: setKilde, valg: valg, norm: norm, kildeTekst: T.src };

  function start() { valg(document.getElementById('kvalg')); sokMat(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
