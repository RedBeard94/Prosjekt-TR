/* Tallerkenen: lagrer sidene på enheten så de virker uten nett. Endre CACHE-navnet når filer endres. */
var CACHE='tallerkenen-v1';
var SHELL=['/hjelpemidler/diabetes/','/hjelpemidler/diabetes/tallerken/','/hjelpemidler/diabetes/manualer/','/hjelpemidler/diabetes/info/','/hjelpemidler/diabetes/mat-og-blodsukker/','/hjelpemidler/diabetes/manifest.webmanifest','/hjelpemidler/diabetes/icons/icon-192.png','/hjelpemidler/diabetes/icons/icon-512.png','/hjelpemidler/diabetes/icons/apple-touch-icon.png','/personvern/','/fonts/manrope-latin-200-normal.woff2','/fonts/manrope-latin-400-normal.woff2','/fonts/manrope-latin-600-normal.woff2','/fonts/manrope-latin-800-normal.woff2'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return Promise.all(SHELL.map(function(u){return c.add(u).catch(function(){});}));}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET')return;
  var u=new URL(r.url); if(u.origin!==location.origin)return;        /* Matvaretabellen o.l. håndteres av siden selv */
  var ok=u.pathname.indexOf('/hjelpemidler/diabetes/')===0||u.pathname.indexOf('/fonts/')===0||u.pathname==='/personvern/'; if(!ok)return;
  if(r.mode==='navigate'){                                          /* sider: nett først, så lagret kopi */
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});return res;}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('/hjelpemidler/diabetes/tallerken/');});}));
    return;
  }
  e.respondWith(caches.match(r).then(function(m){return m||fetch(r).then(function(res){if(res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});}return res;});}));
});
