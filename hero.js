/* Velger forsidebildet etter sesong og tid på døgnet (Kristiansand).
   Sesonger:  jul = 1.–23. desember · julaften = 24. desember · vinter = 25. desember–31. mars · høst = oktober og november · sommer = resten.
   Natt:      fra 30 minutter etter solnedgang til 30 minutter før soloppgang (regnes ut for Kristiansand).
   Test:      legg til ?tema=jul og/eller ?tid=natt bak adressen. Temaer: sommer, host, vinter, jul, julaften. Tid: dag, natt. */
(function () {
  'use strict';

  var BILDER = {
    sommer: { dag: 'bilder/kyst-sommer-dag.jpg', natt: 'bilder/kyst-sommer-natt.jpg' },
    host:   { dag: 'bilder/kyst-host-dag.jpg',   natt: 'bilder/kyst-sommer-natt.jpg' },
    vinter: { dag: 'bilder/kyst-vinter-dag.jpg', natt: 'bilder/kyst-vinter-natt.jpg' },
    jul:      { dag: 'bilder/kyst-jul-dag.jpg', natt: 'bilder/kyst-jul-natt.jpg' },
    julaften: { dag: 'bilder/kyst-jul-dag.jpg', natt: 'bilder/kyst-julaften-natt.jpg' }
  };
  var LYS_TEKST = { natt: true };   // mørke bilder (natt) får lys tekst; dagbildene får mørk tekst

  var LAT = 58.15, LON = 8.0;       // Kristiansand
  var override = { tema: null, tid: null };

  function oslo(d) {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Oslo', month: 'numeric', day: 'numeric' })
        .formatToParts(d).forEach(function (x) { p[x.type] = +x.value; });
      return { m: p.month, d: p.day };
    } catch (e) { return { m: d.getMonth() + 1, d: d.getDate() }; }
  }

  function sesong(d) {
    var o = oslo(d);
    if (o.m === 12 && o.d === 24) return 'julaften';
    if (o.m === 12 && o.d < 24) return 'jul';
    if (o.m === 12 || o.m <= 3) return 'vinter';
    if (o.m === 10 || o.m === 11) return 'host';
    return 'sommer';
  }

  // Soloppgang og solnedgang i minutter etter midnatt UTC (forenklet NOAA-formel)
  function sol(d) {
    var rad = Math.PI / 180;
    var n = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5);
    var g = 2 * Math.PI / 365 * (n - 1);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var c = Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(dec)) - Math.tan(LAT * rad) * Math.tan(dec);
    c = Math.max(-1, Math.min(1, c));
    var ha = Math.acos(c) / rad;
    return { opp: 720 - 4 * (LON + ha) - eq, ned: 720 - 4 * (LON - ha) - eq };
  }

  function erNatt(d) {
    var s = sol(d);
    var min = d.getUTCHours() * 60 + d.getUTCMinutes();
    return min > s.ned + 30 || min < s.opp - 30;
  }

  function velg() {
    var d = new Date();
    var tema = override.tema || sesong(d);
    var tid = override.tid || (erNatt(d) ? 'natt' : 'dag');
    if (!BILDER[tema]) tema = 'sommer';
    if (tid !== 'natt') tid = 'dag';
    return { tema: tema, tid: tid, src: BILDER[tema][tid], lys: !!LYS_TEKST[tid] };
  }

  var hero = document.querySelector('.hero');
  var img = document.getElementById('heroimg');
  var naa = null;

  function bruk(v, forst) {
    if (!img || !hero) return;
    if (naa === v.src && hero.classList.contains('lys') === v.lys) return;
    naa = v.src;
    if (forst) {
      img.src = v.src;
      hero.classList.toggle('lys', v.lys);
      return;
    }
    img.style.opacity = '0';
    setTimeout(function () {
      img.onload = function () { img.style.opacity = '1'; img.onload = null; };
      img.src = v.src;
      hero.classList.toggle('lys', v.lys);
    }, 600);
  }

  // Test via adressen: ?tema=jul&tid=natt
  try {
    var q = new URLSearchParams(location.search);
    if (q.get('tema')) override.tema = q.get('tema');
    if (q.get('tid')) override.tid = q.get('tid');
  } catch (e) {}

  bruk(velg(), true);
  setInterval(function () { bruk(velg(), false); }, 600000); // sjekk hvert tiende minutt

  // Brukes bare av testbryteren i forhåndsvisningen
  window.RG_HERO = {
    sett: function (tema, tid) { override.tema = tema || null; override.tid = tid || null; bruk(velg(), false); return velg(); },
    naa: velg
  };
})();
