/* Skann strekkode på tallerkenen.
   - Kameraet leser strekkoden på telefonen din. Ingen bilder lagres eller sendes.
   - Varen slås opp i Reinertsengruppen sin mattabell (mattabell.js). Oppslaget skjer på enheten.
   - Finnes den ikke, kan du skrive inn tallet fra pakken. Da lagres det på telefonen din.
     Er postkassen slått på (adressen står i mattabell.js), sendes strekkode, navn og tall anonymt til oss for kontroll. */
(function () {
  'use strict';
  /* Adressen til postkassen settes i mattabell.js. Tom = ingenting sendes. */
  var POSTKASSE_URL = (window.RGMAT && window.RGMAT.base) || '';

  var EN = (document.documentElement.lang || 'no').slice(0, 2) === 'en';
  var T = EN ? {
    btn: 'Scan barcode', h: 'Scan barcode', hold: 'Hold the barcode in front of the camera.',
    man: 'Or type the barcode (the numbers under the lines)', go: 'Look up', cancel: 'Cancel',
    camErr: 'The camera does not work here. Type the barcode instead.',
    camWait: 'Starting the camera …', camOn: 'Looking for a barcode …',
    bad: 'The numbers do not look right. Check the barcode and try again.',
    tableErr: 'The food table could not be loaded now. You can type the numbers from the packet.',
    nfH: 'Did not find this item', nfP: 'The barcode %s is not in our food table.',
    read: 'Read the row «Carbohydrates» under «per 100 g» on the packet. Not the «per portion» number.',
    name: 'Name (for example «Oat crackers»)', p100: 'Carbohydrates per 100 g (grams)', gram: 'How much you weighed (grams)',
    warn: 'Check the number. Is it «per 100 g» from the packet? A high number may be a typing mistake.',
    send: 'The barcode, name and number are sent anonymously to us to be checked, so we can help others. Nothing about you is sent.',
    ok: 'Put on the plate', local: 'From My foods on this phone.', check: 'Still check against the packet.',
    gOk: 'Grams of carbs', carb: 'g carbs', nameFirst: 'Write a name.'
  } : {
    btn: 'Skann strekkode', h: 'Skann strekkode', hold: 'Hold strekkoden foran kameraet.',
    man: 'Eller skriv strekkoden (tallene under streken)', go: 'Slå opp', cancel: 'Avbryt',
    camErr: 'Kameraet virker ikke her. Skriv strekkoden i stedet.',
    camWait: 'Starter kameraet …', camOn: 'Leter etter en strekkode …',
    bad: 'Tallene ser ikke riktige ut. Sjekk strekkoden og prøv igjen.',
    tableErr: 'Mattabellen kunne ikke hentes nå. Du kan skrive inn tallene fra pakken.',
    nfH: 'Fant ikke denne varen', nfP: 'Strekkoden %s ligger ikke i mattabellen vår.',
    read: 'Les raden «Karbohydrater» under «per 100 g» på pakken. Ikke tallet «per porsjon».',
    name: 'Navn (for eksempel «Havrekjeks»)', p100: 'Karbohydrater per 100 g (gram)', gram: 'Så mye veide maten (gram)',
    warn: 'Sjekk tallet. Er det «per 100 g» fra pakken? Er det høyt, kan du ha skrevet feil.',
    send: 'Strekkoden, navnet og tallet sendes anonymt til oss for kontroll, så vi kan hjelpe andre. Ingenting om deg sendes.',
    ok: 'Legg på tallerkenen', local: 'Fra Mine matvarer på denne telefonen.', check: 'Sjekk likevel mot pakken.',
    gOk: 'Gram karbohydrat', carb: 'g karbo', nameFirst: 'Skriv et navn.'
  };

  var R = null, stream = null, timer = null, reader = null, stopped = true;

  function $(id) { return document.getElementById(id); }
  function ls(k, v) { return R.ls(k, v); }
  function nbv(v, d) { return R.nb(v, d); }

  /* ====== Enhets-ID (tilfeldig kode, ikke knyttet til deg) ====== */
  function enhetId() {
    var id = null;
    try { id = localStorage.getItem('tk_enhet'); } catch (e) { }
    if (id && /^[a-z0-9]{16,40}$/.test(id)) return id;
    var a = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(a);
    id = ''; for (var i = 0; i < a.length; i++) id += ('0' + a[i].toString(36)).slice(-2);
    id = id.replace(/[^a-z0-9]/g, 'a').slice(0, 24);
    if (id.length < 16) id = (id + 'abcdefghijklmnop').slice(0, 16);
    try { localStorage.setItem('tk_enhet', id); } catch (e) { }
    return id;
  }
  function sendInn(ean, navn, per100) {
    if (!POSTKASSE_URL) return;
    try {
      fetch(POSTKASSE_URL.replace(/\/$/, '') + '/innsending', {
        method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ean: ean, navn: navn, per100: per100, enhet: enhetId() })
      }).catch(function () { });
    } catch (e) { }
  }

  /* ====== Egne strekkoder lagret på denne telefonen ====== */
  function eanMap() { var m = ls('tk_ean'); return m && typeof m === 'object' && !Array.isArray(m) ? m : {}; }
  function eanSet(ean, id) { var m = eanMap(); m[ean] = id; ls('tk_ean', m); }

  /* ====== Kamera ====== */
  function stopCam() {
    stopped = true;
    if (timer) { clearTimeout(timer); timer = null; }
    try { if (reader && reader.reset) reader.reset(); } catch (e) { }
    reader = null;
    if (stream) { try { stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { } stream = null; }
    var v = $('scVid'); if (v) { try { v.srcObject = null; } catch (e) { } }
  }
  function closeAll() { stopCam(); R.closeSheet(); }

  function loadZxing(cb) {
    if (window.ZXing) { cb(); return; }
    var s = document.createElement('script');
    s.src = '/nyttig/diabetes/zxing.min.js'; s.onload = function () { cb(); }; s.onerror = function () { cb(new Error('zxing')); };
    document.head.appendChild(s);
  }

  function startCam(onCode) {
    var msg = $('scMsg');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { msg.textContent = T.camErr; return; }
    msg.textContent = T.camWait; stopped = false;
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } } }).then(function (s) {
      if (stopped) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
      stream = s;
      var v = $('scVid'); if (!v) { stopCam(); return; }
      v.srcObject = s; v.setAttribute('playsinline', ''); v.muted = true;
      var p = v.play(); if (p && p.catch) p.catch(function () { });
      msg.textContent = T.camOn;
      var det = null;
      if ('BarcodeDetector' in window) {
        try { det = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] }); } catch (e) { det = null; }
      }
      if (det) {
        var loop = function () {
          if (stopped) return;
          det.detect(v).then(function (r) {
            if (stopped) return;
            if (r && r.length && r[0].rawValue) { onCode(String(r[0].rawValue)); return; }
            timer = setTimeout(loop, 250);
          }).catch(function () { if (!stopped) timer = setTimeout(loop, 400); });
        };
        loop();
      } else {
        loadZxing(function (err) {
          if (err || stopped || !window.ZXing) { if (!stopped) msg.textContent = T.camErr; return; }
          try {
            var Z = window.ZXing, hints = new Map();
            hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8, Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E]);
            reader = new Z.BrowserMultiFormatReader(hints, 300);
            reader.decodeFromStream(s, v, function (res) { if (res && !stopped) onCode(res.getText()); });
          } catch (e) { msg.textContent = T.camErr; }
        });
      }
    }).catch(function () { msg.textContent = T.camErr; });
  }

  /* ====== Ark: skann ====== */
  function openScan() {
    R.sheet.innerHTML = '<h3>' + T.h + '</h3><p class="per">' + T.hold + '</p>' +
      '<video id="scVid" playsinline muted autoplay style="width:100%;max-height:260px;border-radius:14px;background:#111;object-fit:cover"></video>' +
      '<p class="per" id="scMsg" role="status" style="min-height:1.4em"></p>' +
      '<label class="field"><span>' + T.man + '</span><input id="scMan" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="14" autocomplete="off"></label>' +
      '<p class="per" id="scBad" role="alert" style="color:#b42318;font-weight:700" hidden>' + T.bad + '</p>' +
      '<div class="row2"><button class="btn" id="scGo" type="button">' + T.go + '</button><button class="btn ghost" id="scCn" type="button">' + T.cancel + '</button></div>';
    R.sbg.classList.add('on');
    $('scCn').addEventListener('click', closeAll);
    function fraTekst() {
      var c = ($('scMan').value || '').replace(/\D/g, '');
      if (!window.RGMAT.gtinOk(c)) { $('scBad').hidden = false; $('scMan').focus(); return; }
      slaaOpp(c);
    }
    $('scGo').addEventListener('click', fraTekst);
    $('scMan').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); fraTekst(); } });
    startCam(function (kode) {
      var c = String(kode).replace(/\D/g, '');
      if (!window.RGMAT.gtinOk(c)) { return; }
      slaaOpp(c);
    });
  }

  var opptatt = false;
  function slaaOpp(ean) {
    if (opptatt) return; opptatt = true;
    stopCam();
    /* 1. Dine egne varer på denne telefonen */
    var id = eanMap()[ean], eg = id ? R.mineGet(id) : null;
    if (eg) { opptatt = false; visFunnet(eg, T.local); return; }
    /* 2. Mattabellen */
    window.RGMAT.load().then(function () {
      opptatt = false;
      var f = window.RGMAT.find(ean);
      if (f) visFunnet(f, window.RGMAT.label() + '. ' + T.check); else visIkkeFunnet(ean, false);
    }).catch(function () { opptatt = false; visIkkeFunnet(ean, true); });
  }

  function visFunnet(food, kilde) {
    R.openAmount({ id: food.id, name: food.name, carbs: food.carbs, ports: [], mine: !!food.mine });
    var per = R.sheet.querySelector('.per');
    if (per) per.insertAdjacentHTML('afterend', '<p class="per" style="font-size:.85rem;color:#5b4a10;background:#fff7e0;border:1px solid #f0d98a;border-radius:10px;padding:8px 10px">' + R.esc(kilde.trim()) + '</p>');
  }

  function visIkkeFunnet(ean, tabellFeil) {
    R.sheet.innerHTML = '<h3>' + T.nfH + '</h3>' +
      '<p class="per">' + (tabellFeil ? R.esc(T.tableErr) : T.nfP.replace('%s', '<b>' + R.esc(ean) + '</b>')) + '</p>' +
      '<div class="per100">' + T.read + '</div>' +
      '<label class="field">' + T.name + '<input id="nfN" type="text" maxlength="40" autocomplete="off"></label>' +
      '<label class="field"><span>' + T.p100 + '</span><input id="nfP" type="number" inputmode="decimal" min="0" max="100" step="0.1" placeholder="62,5"></label>' +
      '<label class="field"><span>' + T.gram + '</span><input id="nfG" type="number" inputmode="decimal" min="0" max="3000" step="1"></label>' +
      '<div class="warn" id="nfW" hidden>' + T.warn + '</div>' +
      (POSTKASSE_URL ? '<p class="per" style="font-size:.85rem">' + T.send + '</p>' : '') +
      '<div class="res"><div class="n" id="rv">0<small>' + T.carb + '</small></div></div>' +
      '<div class="row2"><button class="btn" id="nfOk" type="button">' + T.ok + '</button><button class="btn ghost" id="nfCn" type="button">' + T.cancel + '</button></div>';
    R.sbg.classList.add('on');
    function vals() {
      var p = R.num($('nfP').value), g = R.num($('nfG').value);
      if (!isFinite(p) || p < 0 || p > 100) p = NaN;
      if (!isFinite(g) || g <= 0 || g > 3000) g = NaN;
      return { p: p, g: g };
    }
    function upd() {
      var v = vals(), r = (isFinite(v.p) && isFinite(v.g)) ? v.p * v.g / 100 : 0;
      $('rv').innerHTML = (r ? nbv(r, 1) : '0') + '<small>' + T.carb + '</small>';
      $('nfW').hidden = !(r > 60 || (isFinite(v.p) && v.p > 80));
    }
    Array.prototype.forEach.call(R.sheet.querySelectorAll('input'), function (i) { i.addEventListener('input', upd); });
    $('nfCn').addEventListener('click', closeAll);
    setTimeout(function () { var e = $('nfN'); if (e && e.isConnected) e.focus(); }, 60);
    $('nfOk').addEventListener('click', function () {
      var nm = ($('nfN').value || '').replace(/\s+/g, ' ').trim();
      if (!nm) { $('nfN').focus(); $('nfN').setAttribute('placeholder', T.nameFirst); return; }
      var v = vals();
      if (!isFinite(v.p)) { $('nfP').focus(); return; }
      if (!isFinite(v.g)) { $('nfG').focus(); return; }
      var id = R.mineAdd(nm, v.p);
      eanSet(ean, id);
      sendInn(ean, nm.slice(0, 60), Math.round(v.p * 10) / 10);
      R.addPlate({ id: id, name: nm.slice(0, 40), per100: v.p, grams: v.g });
    });
  }

  /* ====== Knapp og navnesøk ====== */
  function init() {
    R = window.RGT;
    var own = document.querySelector('.own');
    if (own && !$('scanBtn')) {
      var b = document.createElement('button');
      b.className = 'btn'; b.id = 'scanBtn'; b.type = 'button'; b.textContent = T.btn;
      own.insertBefore(b, own.firstChild);
      b.addEventListener('click', openScan);
    }
    /* Navnesøk i mattabellen: hentes første gang du trykker i søkefeltet */
    var q = $('q'), lastet = false;
    function hent() {
      if (lastet) return; lastet = true;
      window.RGMAT.load().then(function () { R.setTable(window.RGMAT.rows()); }).catch(function () { lastet = false; });
    }
    if (q) { q.addEventListener('focus', hent); q.addEventListener('input', hent); }
    /* Lenke fra «Søk mat»: tallerken?ean=... */
    try {
      var m = /[?&]ean=(\d{8,14})/.exec(location.search);
      if (m) {
        window.RGMAT.load().then(function () {
          R.setTable(window.RGMAT.rows()); lastet = true;
          var f = window.RGMAT.find(m[1]);
          if (f) { try { history.replaceState(null, '', location.pathname); } catch (e) { } visFunnet(f, window.RGMAT.label() + '. ' + T.check); }
        }).catch(function () { });
      }
    } catch (e) { }
  }
  if (window.RGT) init(); else document.addEventListener('rgt-klar', init);
})();
