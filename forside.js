/* Oppførsel for forsiden og sponsorsiden: toppmeny, sponsorbånd, sponsorliste og kontaktskjema. */
(function () {
  'use strict';

  /* ---------- Toppmeny: gjennomsiktig øverst, tettere når man blar. Viser hvor man er. ---------- */
  var top = document.querySelector('.top');
  var ids = ['om', 'apper', 'hjelpemidler', 'sponsor', 'kontakt'];
  function s() {
    if (!top) return;
    top.classList.toggle('scrolled', window.scrollY > 24);
    var cur = null;
    ids.forEach(function (i) {
      var e = document.getElementById(i);
      if (e && e.getBoundingClientRect().top < 160) cur = i;
    });
    document.querySelectorAll('.top nav a').forEach(function (a) {
      var h = a.getAttribute('href') || '';
      if (cur && h === '#' + cur) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', s, { passive: true });
  s();

  /* ---------- Sponsorer ---------- */
  var liste = (window.RG_SPONSORER || []).filter(function (x) {
    return x && x.navn;
  });
  function trygg(url) {
    return typeof url === 'string' && /^https:\/\//.test(url) ? url : '';
  }
  function el(tag, cls, tekst) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (tekst) e.textContent = tekst;
    return e;
  }
  function logo(x) {
    if (!x.logo) return null;
    var i = document.createElement('img');
    i.src = x.logo;
    i.alt = '';
    i.loading = 'lazy';
    return i;
  }

  // Rullende bånd på forsiden
  var band = document.getElementById('band');
  var track = document.getElementById('track');
  if (band && track) {
    if (!liste.length) {
      band.hidden = true;
    } else {
      band.hidden = false;
      var rep = Math.max(1, Math.ceil(8 / liste.length));
      for (var g = 0; g < 2; g++) {
        var grp = el('div', 'grp');
        if (g === 1) grp.setAttribute('aria-hidden', 'true');
        for (var r = 0; r < rep; r++) {
          liste.forEach(function (x) {
            var u = trygg(x.url);
            var a = el(u ? 'a' : 'span', 'sp');
            if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener sponsored'; }
            if (g === 1) a.tabIndex = -1;
            var l = logo(x);
            if (l) a.appendChild(l);
            a.appendChild(el('b', '', x.navn));
            grp.appendChild(a);
          });
        }
        track.appendChild(grp);
      }
    }
  }

  // Pause-knapp for båndet (rullende tekst kan være tungt å lese)
  var pb = document.getElementById('pause');
  if (pb && band) {
    pb.addEventListener('click', function () {
      var p = band.classList.toggle('paused');
      pb.textContent = p ? 'Spill av' : 'Pause';
      pb.setAttribute('aria-pressed', p ? 'true' : 'false');
    });
  }

  // Sponsorsiden
  var grid = document.getElementById('sgrid');
  var tom = document.getElementById('tom');
  if (grid) {
    if (!liste.length) {
      if (tom) tom.hidden = false;
    } else {
      liste.forEach(function (x) {
        var c = el('div', 'scard');
        var l = logo(x);
        if (l) c.appendChild(l);
        c.appendChild(el('b', '', x.navn));
        if (x.tekst) c.appendChild(el('span', '', x.tekst));
        var u = trygg(x.url);
        if (u) {
          var a = el('a', '', 'Besøk nettside →');
          a.href = u; a.target = '_blank'; a.rel = 'noopener sponsored';
          c.appendChild(a);
        }
        grid.appendChild(c);
      });
    }
  }

  /* ---------- «Ta kontakt om sponsing» velger Sponsing i skjemaet ---------- */
  var gjelder = document.getElementById('gjelder');
  function sponsingValgt() {
    if (location.hash === '#kontakt-sponsing' && gjelder) {
      gjelder.value = 'Sponsing';
      var k = document.getElementById('kontakt');
      if (k) k.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', sponsingValgt);
  /* Virker også når man trykker på knappen flere ganger (da endres ikke adressen) */
  document.querySelectorAll('a[href="#kontakt-sponsing"]').forEach(function (a) {
    a.addEventListener('click', function () { if (location.hash === '#kontakt-sponsing') sponsingValgt(); });
  });
  sponsingValgt();

  /* ---------- Besøkstall på hjelpemidlene ----------
     Ruten viser «Kristiansand» til tallet er hentet og har nådd grensen.
     TALL_URL: adressen til det åpne tellepunktet i portalen (settes inn når det er bygget). Tom = ruten forblir som den er.
     Svaret skal være JSON, for eksempel {"hjelpemidler": 12480}. */
  var TALL_URL = '';
  var GRENSE = 500;
  var rute = document.getElementById('tallrute');
  if (rute && TALL_URL) {
    fetch(TALL_URL, { credentials: 'omit' }).then(function (r) { return r.json(); }).then(function (j) {
      var n = Number(j && j.hjelpemidler);
      if (n >= GRENSE) {
        rute.querySelector('b').textContent = n.toLocaleString('nb-NO');
        rute.querySelector('span').textContent = 'besøk på hjelpemidlene våre. Vi er stolte av hvert eneste ett.';
      }
    }).catch(function () {});
  }

  /* ---------- Kontaktskjema ---------- */
  var cf = document.getElementById('cf');
  if (cf) {
    // Web3Forms-nøkkel (samme som i den gamle index.html).
    var KEY = 'd6619d9b-97f3-4521-8e77-37a56a1978e1';
    var btn = document.getElementById('send');
    var st = document.getElementById('st');
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target;
      if (f.botcheck.checked) return;
      if (KEY.indexOf('LIM_INN') === 0) {
        st.textContent = 'Skjemaet er ikke koblet til ennå.';
        return;
      }
      btn.disabled = true;
      st.textContent = 'Sender …';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: 'Henvendelse via nettsiden: ' + f.gjelder.value,
          from_name: 'Reinertsengruppen.no',
          name: f.navn.value,
          email: f.epost.value,
          message: 'Gjelder: ' + f.gjelder.value + '\n\n' + f.melding.value,
          botcheck: ''
        })
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.success) throw new Error('feil');
        f.reset();
        st.textContent = 'Takk! Meldingen er sendt.';
      }).catch(function () {
        st.textContent = 'Klarte ikke å sende meldingen. Prøv igjen om litt.';
      }).then(function () { btn.disabled = false; });
    });
  }
})();
