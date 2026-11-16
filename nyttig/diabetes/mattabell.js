/* Reinertsengruppen sin mattabell: den godkjente listen over varer, hentet fra vår egen postkasse.
   Brukes av tallerkenen og av «Søk mat». Strekkoden du skanner eller søker etter sendes aldri noe sted.
   Oppslaget skjer på enheten din, i listen som er lastet ned. */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || 'no').slice(0, 2) === 'en';
  /* Adressen til postkassen din i Cloudflare, for eksempel https://diabetes-postkasse.NAVN.workers.dev
     Tom = mattabellen er ikke slått på ennå. Adressen er ikke hemmelig. */
  var POSTKASSE_URL = 'https://diabetes-postkasse.diabetes.workers.dev';
  var BASE = POSTKASSE_URL.replace(/\/$/, '');
  var st = { p: null, rows: [], by: {} };

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function gtinOk(c) {
    if (!/^\d+$/.test(c) || [8, 12, 13, 14].indexOf(c.length) < 0) return false;
    var sum = 0, n = c.length;
    for (var i = 0; i < n - 1; i++) {
      var d = +c.charAt(n - 2 - i);
      sum += d * (i % 2 === 0 ? 3 : 1);
    }
    return ((10 - (sum % 10)) % 10) === +c.charAt(n - 1);
  }

  function load() {
    if (st.p) return st.p;
    if (!BASE) return Promise.reject(new Error('ingen postkasse'));
    st.p = fetch(BASE + '/mattabell.json').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (j) {
      var a = j && Array.isArray(j.rader) ? j.rader : [];
      var rows = [], by = {};
      for (var i = 0; i < a.length; i++) {
        var x = a[i];
        if (!x || typeof x[0] !== 'string' || typeof x[1] !== 'string' || typeof x[2] !== 'number') continue;
        if (!(x[2] >= 0 && x[2] <= 100) || !x[1] || x[1].length > 120) continue;
        var o = { id: 'rg' + x[0], code: x[0], name: x[1], carbs: x[2], src: 1, ports: [], s: norm(x[1]) };
        rows.push(o); by[x[0]] = o;
      }
      st.rows = rows; st.by = by;
      return st;
    }).catch(function (e) { st.p = null; throw e; });
    return st.p;
  }

  function find(ean) {
    var c = [ean];
    if (ean.length === 12) c.push('0' + ean);
    if (ean.length === 13 && ean.charAt(0) === '0') c.push(ean.slice(1));
    for (var i = 0; i < c.length; i++) if (st.by[c[i]]) return st.by[c[i]];
    return null;
  }

  function search(q, max) {
    q = norm(q).trim(); if (!q) return [];
    var ws = q.split(/\s+/), res = [];
    for (var k = 0; k < st.rows.length; k++) {
      var f = st.rows[k], ok = true, score = 0;
      for (var i = 0; i < ws.length; i++) {
        var ix = f.s.indexOf(ws[i]);
        if (ix < 0) { ok = false; break; }
        score += (ix === 0 ? 0 : (f.s.charAt(ix - 1) === ' ' ? 1 : 3));
      }
      if (ok) res.push([score + f.name.length / 100, f]);
    }
    res.sort(function (a, b) { return a[0] - b[0]; });
    return res.slice(0, max || 15).map(function (x) { return x[1]; });
  }

  function label() {
    return EN ? 'Checked by Reinertsengruppen' : 'Kontrollert av Reinertsengruppen';
  }

  window.RGMAT = { base: BASE, load: load, find: find, search: search, label: label, norm: norm, gtinOk: gtinOk, rows: function () { return st.rows; } };
})();
