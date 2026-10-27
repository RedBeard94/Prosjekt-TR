/* Enkel, anonym besøkstelling for Reinertsengruppen.
   Sender bare: sidens adresse, gruppe (forside/hjelpemidler/apper), språk og om siden er åpnet som app.
   Ingen cookies, ingen IP-adresse lagres, ingen person kan gjenkjennes. Telles én gang per side per økt.
   Slå på: bytt ut adressen under med adressen til tellepunktet i portalen. Er den ikke byttet, gjør skriptet ingenting. */
(function () {
  var URL = 'https://reinertsengruppen-portal.thomas-756.workers.dev/telle';
  if (URL.indexOf('PLASSHOLDER') === 0) return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
  var p = location.pathname.replace(/index\.html$/, '');
  function grp() {
    if (p.indexOf('/nyttig/diabetes/') === 0 || p.indexOf('/nyttig/hjelpemidler/') === 0 || p.indexOf('/nyttig/hvem-ringer-jeg/') === 0 || p.indexOf('/nyttig/dagsplan/') === 0) return 'hjelpemidler';
    if (p.indexOf('/nyttig/apper/') === 0 || p.indexOf('/nyttig/fyret/') === 0) return 'apper';
    return 'forside';
  }
  function app() {
    try { return !!((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone); } catch (e) { return false; }
  }
  function send(type, sti) {
    var key = 'rg-t:' + type + ':' + sti;
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1'); } catch (e) {}
    var body = JSON.stringify({ t: type, sti: sti, grp: grp(), sprak: p.indexOf('/nyttig/diabetes/en/') === 0 ? 'en' : 'no', app: app() });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon(URL, new Blob([body], { type: 'text/plain' }));
      else fetch(URL, { method: 'POST', body: body, mode: 'no-cors', keepalive: true, credentials: 'omit' });
    } catch (e) {}
  }
  function visning() {
    var sti = p;
    if (p.indexOf('/nyttig/fyret/') === 0 && /^#\/[a-z0-9-]+/.test(location.hash)) sti = p + location.hash.split('?')[0];
    send('visning', sti);
  }
  visning();
  if (p === '/nyttig/fyret/') window.addEventListener('hashchange', visning);
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="mailto:"]');
    if (a && a.href.indexOf('Innspill') > -1) send('klikk', 'innspill');
  });
})();
