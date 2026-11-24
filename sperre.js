/* Spøkefull "ikke stjel"-melding for Reinertsengruppen.
   Vises når noen trykker snarveiene for "Vis sidekilde", "Lagre siden" eller utviklerverktøy,
   når noen markerer hele siden (Ctrl+A), eller kopierer mye tekst på én gang (over 300 tegn).
   Kopiering stoppes IKKE. Ved stor kopiering legges en kort opphavsrett-linje til sist i det som kopieres
   (den følger med når teksten limes inn, også i en AI-tjeneste). Meldingen er en skremsel, ikke en lås.
   Ingenting blir logget eller sendt noe sted.
   Høyreklikk, korte kopier og skrivefelt er ikke berørt (viktig for lesehjelp og mobil).
   Eieren kan slå den av i sin egen nettleser: åpne siden med ?ikke-sperre (på igjen: ?ikke-sperre=av). */
(function () {
  var FLAGG = 'rg-ikke-sperre';
  var GRENSE = 300;
  var LAPP = '\n\n---\nKopiert fra reinertsengruppen.no. Innholdet tilhører Reinertsengruppen og kan ikke brukes uten tillatelse. ' +
    'Det er stygt å stjele, og slapt å la en AI gjøre det for deg.';
  try {
    if (/[?&]ikke-sperre=av(&|$)/.test(location.search)) localStorage.removeItem(FLAGG);
    else if (/[?&]ikke-sperre(=|&|$)/.test(location.search)) localStorage.setItem(FLAGG, '1');
    if (localStorage.getItem(FLAGG)) return;
  } catch (e) {}

  var boks = null, forrigeFokus = null;

  var TEKSTER = {
    kilde: {
      tittel: 'Stopp! Det er stygt å stjele.',
      linje1: 'Du prøvde å kopiere siden vår.',
      ikon: '⚠️'
    },
    kopi: {
      tittel: 'Ser ut som du kopierer hele siden.',
      linje1: 'Innholdet tilhører Reinertsengruppen. Det er stygt å stjele.',
      ikon: '📋'
    }
  };

  function lukk() {
    if (!boks) return;
    if (boks.parentNode) boks.parentNode.removeChild(boks);
    boks = null;
    document.documentElement.style.overflow = '';
    if (forrigeFokus && forrigeFokus.focus) { try { forrigeFokus.focus({ preventScroll: true }); } catch (e) {} }
  }

  function lag(tekst, tag, stil) {
    var el = document.createElement(tag);
    el.textContent = tekst;
    el.style.cssText = stil;
    return el;
  }

  function vis(type) {
    if (boks) return;
    var t = TEKSTER[type] || TEKSTER.kilde;
    forrigeFokus = document.activeElement;
    boks = document.createElement('div');
    boks.setAttribute('role', 'alertdialog');
    boks.setAttribute('aria-modal', 'true');
    boks.setAttribute('aria-label', t.tittel);
    boks.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:#1a1a1a;color:#fff;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
      'padding:24px;gap:18px;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;overflow:auto;user-select:none;-webkit-user-select:none';
    boks.appendChild(lag(t.ikon, 'div', 'font-size:64px;line-height:1'));
    boks.appendChild(lag(t.tittel, 'h1', 'font-size:clamp(26px,6vw,44px);font-weight:600;margin:0;line-height:1.25;color:#fff'));
    boks.appendChild(lag(t.linje1, 'p', 'font-size:clamp(18px,4vw,24px);margin:0;line-height:1.6;color:#e8e8e8;max-width:30em'));
    boks.appendChild(lag('IP-adressen din er nå logget og sendt til Reinertsengruppen.', 'p', 'font-size:clamp(18px,4vw,24px);margin:0;line-height:1.6;color:#F09595;max-width:30em'));
    boks.appendChild(lag('Lag din egen side. Det er mye morsommere.', 'p', 'font-size:clamp(16px,3.5vw,20px);margin:0;line-height:1.6;color:#FAC775'));
    var knapp = lag('Beklager, jeg går tilbake', 'button', 'margin-top:8px;padding:14px 26px;font-size:18px;font-family:inherit;' +
      'background:transparent;color:#FAC775;border:2px solid #FAC775;border-radius:10px;cursor:pointer');
    knapp.type = 'button';
    knapp.addEventListener('click', lukk);
    boks.appendChild(knapp);
    document.documentElement.appendChild(boks);
    document.documentElement.style.overflow = 'hidden';
    try { knapp.focus({ preventScroll: true }); } catch (e) {}
  }

  function iSkrivefelt(el) {
    if (!el || !el.tagName) return false;
    var n = el.tagName.toLowerCase();
    return n === 'input' || n === 'textarea' || n === 'select' || el.isContentEditable === true;
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && boks) { lukk(); return; }
    var k = (e.key || '').toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey;

    var kilde =
      e.key === 'F12' ||
      (ctrl && !e.altKey && !e.shiftKey && (k === 'u' || k === 's')) ||
      (ctrl && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
      (e.metaKey && e.altKey && (k === 'u' || k === 'i' || k === 'j' || k === 'c' || e.code === 'KeyU' || e.code === 'KeyI' || e.code === 'KeyJ' || e.code === 'KeyC'));
    if (kilde) {
      e.preventDefault();
      e.stopPropagation();
      vis('kilde');
      return;
    }

    if (ctrl && !e.altKey && !e.shiftKey && k === 'a' && !iSkrivefelt(e.target)) {
      vis('kopi');
    }
  }, true);

  document.addEventListener('copy', function (e) {
    if (iSkrivefelt(e.target)) return;
    var valg = '';
    try { valg = String(window.getSelection ? window.getSelection() : ''); } catch (x) {}
    if (valg.length > GRENSE) {
      vis('kopi');
      try {
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', valg + LAPP);
          e.preventDefault();
        }
      } catch (x) {}
    }
  }, true);
})();
