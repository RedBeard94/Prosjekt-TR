/* Min profil: viser, endrer, flytter og sletter det som er lagret på denne enheten (localStorage).
   Brukes av Diabetes og Diabetes enkel (norsk og engelsk). Ingenting sendes til noen server. */
(function () {
  'use strict';
  var EN = document.documentElement.lang === 'en';
  var ENKEL = document.documentElement.getAttribute('data-enkel') === '1';
  var T = EN ? {
    none: 'Not chosen', other: 'Other / not sure', pump: 'Pump', sen: 'Sensor',
    noEq: 'You have not chosen a pump or sensor.', rmEq: 'Remove choice', rmEqH: 'Remove the choice?', rmEqT: 'Pump and sensor will not be chosen. You can choose again whenever you like.', yesRm: 'Yes, remove',
    noP: 'No name', addP: '+ Add person ', edit: 'Edit', rm: 'Remove', rmPH: 'Remove ', rmPT: 'The number is removed from this phone.',
    perH: 'Edit person', perHn: 'Add person', perT: 'Write a short name, for example Mum. The number stays on this phone.', name: 'Name', tel: 'Phone number', save: 'Save', cancel: 'Cancel',
    errName: 'Write a name.', errTel: 'Write a phone number with digits only (at least 8).', saved: 'Saved', removed: 'Removed', noSave: 'Could not save. Check that the browser allows storage.',
    mt: 'My numbers', mtSaved: 'Numbers from your team are saved', nothing: 'Nothing saved', notes: 'Notes', notesSaved: 'Saved in “Useful information”', plate: 'Plate',
    nMine: ' own foods', nMeals: ' meals', nFavs: ' favourites', nRecent: ' recently used', del: 'Delete',
    delMtH: 'Delete My numbers?', delMtT: 'The numbers you entered from your team are removed.', delNoH: 'Delete the notes?', delNoT: 'The notes in “Useful information” are removed.',
    delTkH: 'Delete the Plate data?', delTkT: 'Favourites, recently used, own foods, meals and what is on the plate are removed.', yesDel: 'Yes, delete', no: 'No, keep', deleted: 'Deleted',
    mineN0: 'You have no own foods saved.', mineN: function (n) { return 'You have ' + n + ' own food' + (n === 1 ? '' : 's') + ' saved. Only these are removed.'; },
    mineNone: 'You have no own foods to delete', delMineH: 'Delete my foods?', delMineT: function (n) { return 'You have ' + n + ' own food' + (n === 1 ? '' : 's') + ' from packs and the food table. They are removed. Everything else stays: pump, sensor, numbers, My numbers, favourites and meals.'; }, minesDel: 'My foods are deleted',
    allH: 'Delete my profile?', allA: 'This is removed from this phone, in both Diabetes and Diabetes simple:', allAdult: 'Ask an adult first. ', allEnd: 'It cannot be undone. You will need to choose your pump and sensor again.',
    allEq: 'Pump and sensor', allPer: 'Important people and numbers', allMt: 'My numbers', allNo: 'Notes', allTk: 'Plate: own foods, meals, favourites, recently used and the plate', allCache: 'Saved food lists and choices in the app',
    hold: 'Hold for 10 seconds to delete', holding: 'Keep holding…', left: ' seconds left', released: 'Released. Nothing was deleted.', allDone: 'My profile is deleted',
    moveH: 'Move to a new phone', moveP: 'Choose what goes into the code.', mkCode: 'Make code', yourCode: 'Your code', yourCodeT: 'Scan it or type the code on the new phone. There, choose “I have a code”.',
    pick: 'Choose at least one thing', cEq: 'Pump and sensor', cPer: 'Important people and numbers', cMt: 'My numbers', cNo: 'Notes', cTk: 'Plate: own foods, meals, favourites and recently used',
    scanIt: 'Scan with the camera on the other phone.', qrBig: 'The code is too big for a QR. Use “Copy code” below.', code: 'Code', chars: ' characters', copy: 'Copy code', copied: 'The code is copied', share: 'Share', close: 'Close',
    warnP: '<b>Be careful:</b> The code contains your numbers and choices. Do not post it publicly. It is a snapshot. If you change something later, make a new code.',
    shareH: function (n) { return 'Share ' + n + ' foods'; }, shareT: 'Whoever gets the code can add the foods to their own list.', shareW: 'The code has only names and carbohydrates. The receiver sees a list and chooses what to add.', noShare: 'You have no own foods to share',
    haveH: 'I have a code', haveM: 'I have received a code', haveT: 'Paste the code here. If you scanned the QR code with the camera, the page opens by itself with the code.', read: 'Read the code',
    badCode: 'The code does not look right. Check that you pasted all of it.', noSupport: 'This browser cannot read the code. Use a newer version.', noFoods: 'Found no valid foods in the code.', nothingValid: 'Found nothing valid in the code.',
    foodsIn: function (n) { return n + ' foods in the code'; }, foodsT: 'Choose which ones to add. Your own foods are kept.', foodsW: 'These were made by someone else and are <b>not checked by health professionals</b>. Check the numbers before you use them.',
    per100: ' g carbohydrate per 100 ', addSel: 'Add selected', addedN: function (n, h) { return n + ' added' + (h ? ', ' + h + ' already existed' : ''); }, fullN: function (n) { return '. ' + n + ' did not fit (max 100).'; }, leadE: 'Here you see what is saved on this phone. Ask an adult to help you if you want to change or delete something.', delTE: 'Ask an adult first. Removes your profile and everything saved on this phone. It cannot be undone.',
    inCode: 'This is in the code', replaceW: 'This <b>replaces</b> what you have saved now on these points. It cannot be undone.', useCode: 'Use the code', moved: 'Done. Everything is moved over.',
    lPump: 'Pump: ', lSen: ', sensor: ', lEnkel: ' (simple version)', lPer: 'Important people: ', lMt: 'My numbers', lNo: 'Notes', lMine: ' own foods', lMeals: ' meals', lFavs: ' favourites',
    plateSet: 'Plate',
    yes: 'Yes', fromOther: 'From someone else. Not checked.'
  } : {
    none: 'Ikke valgt', other: 'Annen / vet ikke', pump: 'Pumpe', sen: 'Sensor',
    noEq: 'Du har ikke valgt pumpe eller sensor.', rmEq: 'Fjern valget', rmEqH: 'Fjerne valget?', rmEqT: 'Pumpe og sensor blir ikke valgt. Du kan velge på nytt når du vil.', yesRm: 'Ja, fjern',
    noP: 'Uten navn', addP: '+ Legg til person ', edit: 'Endre', rm: 'Fjern', rmPH: 'Fjerne ', rmPT: 'Nummeret fjernes fra denne telefonen.',
    perH: 'Endre person', perHn: 'Legg til person', perT: 'Skriv et kort navn, for eksempel Mamma. Nummeret blir bare på denne telefonen.', name: 'Navn', tel: 'Telefonnummer', save: 'Lagre', cancel: 'Avbryt',
    errName: 'Skriv et navn.', errTel: 'Skriv et telefonnummer med bare tall (minst 8).', saved: 'Lagret', removed: 'Fjernet', noSave: 'Kunne ikke lagre. Sjekk at nettleseren tillater lagring.',
    mt: 'Mine tall', mtSaved: 'Tall fra teamet er lagret', nothing: 'Ingenting lagret', notes: 'Notater', notesSaved: 'Lagret i «Nyttig informasjon»', plate: 'Tallerken',
    nMine: ' mine matvarer', nMeals: ' måltider', nFavs: ' favoritter', nRecent: ' sist brukt',
    del: 'Slett',
    delMtH: 'Slette Mine tall?', delMtT: 'Tallene du har skrevet inn fra teamet fjernes.', delNoH: 'Slette notatene?', delNoT: 'Notatene i «Nyttig informasjon» fjernes.',
    delTkH: 'Slette Tallerken-dataene?', delTkT: 'Favoritter, Sist brukt, Mine matvarer, måltider og det som ligger på tallerkenen fjernes.', yesDel: 'Ja, slett', no: 'Nei, behold', deleted: 'Slettet',
    mineN0: 'Du har ingen egne matvarer lagret.', mineN: function (n) { return 'Du har ' + n + ' egne matvarer lagret. Bare disse fjernes.'; },
    mineNone: 'Du har ingen egne matvarer å slette', delMineH: 'Slette mine matvarer?', delMineT: function (n) { return 'Du har ' + n + ' egne matvarer fra pakker og mattabellen. De fjernes. Alt annet beholdes: pumpe, sensor, numre, Mine tall, favoritter og måltider.'; }, minesDel: 'Mine matvarer er slettet',
    allH: 'Slette min profil?', allA: 'Dette fjernes fra denne telefonen, i både Diabetes og Diabetes enkel:', allAdult: 'Spør en voksen først. ', allEnd: 'Det kan ikke angres. Du må velge pumpe og sensor på nytt.',
    allEq: 'Pumpe og sensor', allPer: 'Viktige personer og numre', allMt: 'Mine tall', allNo: 'Notater', allTk: 'Tallerken: mine matvarer, måltider, favoritter, sist brukt og tallerkenen', allCache: 'Lagrede matlister og valg i appen',
    hold: 'Hold inne i 10 sek for å slette', holding: 'Hold… ikke slipp', left: ' sek igjen', released: 'Sluppet. Ingenting er slettet.', allDone: 'Min profil er slettet',
    moveH: 'Flytt til ny telefon', moveP: 'Velg hva som skal med i koden.', mkCode: 'Lag kode', yourCode: 'Din kode', yourCodeT: 'Skann den eller skriv inn koden på den nye telefonen. Der velger du «Jeg har en kode».',
    pick: 'Velg minst én ting', cEq: 'Pumpe og sensor', cPer: 'Viktige personer og numre', cMt: 'Mine tall', cNo: 'Notater', cTk: 'Tallerken: mine matvarer, måltider, favoritter og sist brukt',
    scanIt: 'Skann med kamera på den andre telefonen.', qrBig: 'Koden er for stor til en QR. Bruk «Kopier kode» under.', code: 'Kode', chars: ' tegn', copy: 'Kopier kode', copied: 'Koden er kopiert', share: 'Del', close: 'Lukk',
    warnP: '<b>Pass på:</b> Koden inneholder numrene og valgene dine. Ikke legg den ut offentlig. Den er et øyeblikksbilde. Endrer du noe senere, må du lage en ny kode.',
    shareH: function (n) { return 'Del ' + n + ' matvarer'; }, shareT: 'Den som får koden kan legge matvarene til sin egen liste.', shareW: 'Koden har bare navn og karbohydrater. Mottakeren ser en liste og velger selv hva som legges til.', noShare: 'Du har ingen egne matvarer å dele',
    haveH: 'Jeg har en kode', haveM: 'Jeg har fått en kode', haveT: 'Lim inn koden her. Har du skannet QR-koden med kameraet, åpner siden seg selv med koden.', read: 'Les koden',
    badCode: 'Koden ser ikke riktig ut. Sjekk at du limte inn hele koden.', noSupport: 'Denne nettleseren kan ikke lese koden. Bruk en nyere versjon.', noFoods: 'Fant ingen gyldige matvarer i koden.', nothingValid: 'Fant ingenting gyldig i koden.',
    foodsIn: function (n) { return n + ' matvarer i koden'; }, foodsT: 'Velg hvilke du vil legge til. Dine egne matvarer beholdes.', foodsW: 'Disse er laget av en annen og er <b>ikke sjekket av helsepersonell</b>. Se over tallene før du bruker dem.',
    per100: ' g karbohydrater per 100 ', addSel: 'Legg til valgte', addedN: function (n, h) { return n + ' lagt til' + (h ? ', ' + h + ' fantes fra før' : ''); }, fullN: function (n) { return '. ' + n + ' fikk ikke plass (maks 100).'; }, leadE: 'Her ser du hva som er lagret på denne telefonen. Be en voksen hjelpe deg hvis du skal endre eller slette noe.', delTE: 'Spør en voksen først. Fjerner profilen og alt som er lagret på denne telefonen. Det kan ikke angres.',
    inCode: 'Dette er i koden', replaceW: 'Dette <b>erstatter</b> det du har lagret nå på disse punktene. Det kan ikke angres.', useCode: 'Bruk koden', moved: 'Ferdig. Alt er flyttet over.',
    lPump: 'Pumpe: ', lSen: ', sensor: ', lEnkel: ' (enkel versjon)', lPer: 'Viktige personer: ', lMt: 'Mine tall', lNo: 'Notater', lMine: ' egne matvarer', lMeals: ' måltider', lFavs: ' favoritter',
    plateSet: 'Tallerken',
    yes: 'Ja', fromOther: 'Fra en annen. Ikke sjekket.'
  };
  var PUMPS = { tslim: 'Tandem t:slim X2', dash: 'Omnipod DASH', o5: 'Omnipod 5', ypso: 'mylife YpsoPump', ypsocam: EN ? 'mylife YpsoPump with CamAPS FX' : 'mylife YpsoPump med CamAPS FX', mm: 'Medtronic MiniMed 780G', solo: 'Accu-Chek Solo' };
  var SENS = { g7: 'Dexcom G7', g6: 'Dexcom G6', libre: 'FreeStyle Libre 3 Plus', simplera: 'Simplera Sync', instinct: 'Instinct', guardian: 'Guardian 4' };

  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function g(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { if (v === null || v === undefined || v === '') localStorage.removeItem(k); else localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function j(k) { try { return JSON.parse(g(k) || 'null'); } catch (e) { return null; } }
  function cnt(k) { var a = j(k); return Array.isArray(a) ? a.length : 0; }
  function fmt(t) { var d = String(t).replace(/\D/g, ''); return (d.length === 8 && String(t).indexOf('+') < 0) ? d.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3') : String(t); }

  /* ---------- Viktige personer (samme lagring som forsiden og enkel-forsiden) ---------- */
  function vip() {
    var l = j('rg-vip-liste');
    if (!Array.isArray(l)) { var o = j('rg-vip'); l = [o && o.t ? o : null, null]; }
    return [0, 1].map(function (i) { var v = l[i]; return v && v.t && String(v.t).replace(/[^\d+]/g, '') ? { n: String(v.n || ''), t: String(v.t) } : null; });
  }
  function vipSave(l) { return s('rg-vip-liste', JSON.stringify(l)); }
  function notes() { return { k1: g('mn_k1') || '', k2: g('mn_k2') || '' }; }
  function hasMt() { var m = j('rg-diabetes-innstillinger'); return !!(m && typeof m === 'object' && Object.keys(m).some(function (k) { return m[k]; })); }

  /* ---------- Toast og ark ---------- */
  var toastT = 0, lastFocus = null;
  function toast(t) { var e = $('ptoast'); e.textContent = t; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { e.classList.remove('on'); }, 2600); }
  function open(html) { lastFocus = document.activeElement; $('ark').innerHTML = html; $('sbg').classList.add('on'); var f = $('ark').querySelector('input,textarea,button'); if (f) { try { f.focus({ preventScroll: true }); } catch (e) { } } }
  function close() { $('sbg').classList.remove('on'); $('ark').innerHTML = ''; try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) { } }
  function ask(title, text, yes, fn) {
    open('<h3>' + esc(title) + '</h3><p class="per">' + text + '</p><div class="row2"><button class="btn danger" id="ja" type="button">' + esc(yes) + '</button><button class="btn ghost" id="nei" type="button">' + esc(T.no) + '</button></div>');
    $('nei').addEventListener('click', close); $('ja').addEventListener('click', fn);
  }

  /* ---------- Tegn siden ---------- */
  function draw() {
    var p = g('mn_pump'), se = g('mn_sen'), cam = g('mn_cam') === '1', oth = g('mn_other') === '1';
    var pn = PUMPS[cam && p === 'ypso' ? 'ypsocam' : p] || '', sn = SENS[se] || '';
    var h = '';
    if (pn || sn || oth) {
      h += '<div class="rad"><div><b>' + esc(pn || (oth ? T.other : T.none)) + '</b><span class="s">' + esc(T.pump) + '</span></div></div>';
      h += '<div class="rad"><div><b>' + esc(sn || (oth && !pn ? T.other : T.none)) + '</b><span class="s">' + esc(T.sen) + '</span></div></div>';
      h += '<button class="btn danger kort2" id="slUt" type="button">' + esc(T.rmEq) + '</button>';
    } else h += '<div class="rad tom">' + esc(T.noEq) + '</div>';
    $('utstyr').innerHTML = h;
    if ($('slUt')) $('slUt').addEventListener('click', function () {
      ask(T.rmEqH, esc(T.rmEqT), T.yesRm, function () { ['mn_pump', 'mn_sen', 'mn_cam', 'mn_other', 'mn_ver'].forEach(function (k) { s(k, null); }); close(); draw(); toast(T.removed); });
    });
    var v = vip();
    $('pers').innerHTML = [0, 1].map(function (i) {
      return v[i] ?
        '<div class="rad"><div><b>' + esc(v[i].n || T.noP) + '</b><span class="s">' + esc(fmt(v[i].t)) + '</span></div><div class="kn"><button class="btn ghost kort2" data-e="' + i + '" type="button">' + esc(T.edit) + '</button><button class="btn danger kort2" data-f="' + i + '" type="button">' + esc(T.rm) + '</button></div></div>' :
        '<button class="rad tom" data-e="' + i + '" type="button">' + esc(T.addP + (i + 1)) + '</button>';
    }).join('');
    var nt = notes(), hasNt = !!(nt.k1 || nt.k2), plateN = (j('tk_plate') || []).length, tkAny = cnt('tk_mine') || cnt('tk_meals') || cnt('tk_favs') || cnt('tk_recent') || plateN;
    var mine = cnt('tk_mine');
    $('tall').innerHTML =
      '<div class="rad"><div><b>' + esc(T.mt) + '</b><span class="s">' + esc(hasMt() ? T.mtSaved : T.nothing) + '</span></div>' + (hasMt() ? '<button class="btn danger kort2" data-s="mt" type="button">' + esc(T.del) + '</button>' : '') + '</div>' +
      '<div class="rad"><div><b>' + esc(T.notes) + '</b><span class="s">' + esc(hasNt ? T.notesSaved : T.nothing) + '</span></div>' + (hasNt ? '<button class="btn danger kort2" data-s="no" type="button">' + esc(T.del) + '</button>' : '') + '</div>' +
      '<div class="rad"><div><b>' + esc(T.plate) + '</b><span class="s">' + esc(tkAny ? [cnt('tk_mine') + T.nMine, cnt('tk_meals') + T.nMeals, cnt('tk_favs') + T.nFavs, cnt('tk_recent') + T.nRecent].join(', ') : T.nothing) + '</span></div>' + (tkAny ? '<button class="btn danger kort2" data-s="tk" type="button">' + esc(T.del) + '</button>' : '') + '</div>';
    $('mineT').textContent = mine ? T.mineN(mine) : T.mineN0;
  }
  $('pers').addEventListener('click', function (e) {
    var b = e.target.closest('[data-e]'); if (b) { editPerson(+b.getAttribute('data-e')); return; }
    var f = e.target.closest('[data-f]'); if (f) {
      var i = +f.getAttribute('data-f'), v = vip()[i]; if (!v) return;
      ask(T.rmPH + '«' + (v.n || '') + '»?', esc(T.rmPT), T.yesRm, function () { var l = vip(); l[i] = null; vipSave(l); close(); draw(); toast(T.removed); });
    }
  });
  function editPerson(i) {
    var cur = vip()[i], v = cur || { n: '', t: '' };
    open('<h3>' + esc(cur ? T.perH : T.perHn) + '</h3><p class="per">' + esc(T.perT) + '</p><label class="lbl" for="nn">' + esc(T.name) + '</label><input class="t" id="nn" maxlength="14" autocomplete="off" value="' + esc(v.n) + '"><label class="lbl" for="nt">' + esc(T.tel) + '</label><input class="t" id="nt" type="tel" inputmode="tel" maxlength="20" autocomplete="off" value="' + esc(v.t) + '"><div id="adv" role="alert"></div><div class="row2" style="margin-top:14px"><button class="btn ghost" id="av" type="button">' + esc(T.cancel) + '</button><button class="btn" id="ok" type="button">' + esc(T.save) + '</button></div>');
    $('av').addEventListener('click', close);
    $('ok').addEventListener('click', function () {
      var n = $('nn').value.trim(), t = $('nt').value.replace(/[^\d+ ]/g, '').trim(), d = t.replace(/\D/g, ''), a = $('adv');
      if (!n) { a.className = 'adv'; a.textContent = T.errName; $('nn').focus(); return; }
      if (d.length < 8 || !/^\+?[\d ]+$/.test(t)) { a.className = 'adv'; a.textContent = T.errTel; $('nt').focus(); return; }
      var l = vip(); l[i] = { n: n, t: fmt(t) };
      if (!vipSave(l)) { a.className = 'adv'; a.textContent = T.noSave; return; }
      close(); draw(); toast(T.saved);
    });
  }
  $('tall').addEventListener('click', function (e) {
    var b = e.target.closest('[data-s]'); if (!b) return; var w = b.getAttribute('data-s');
    if (w === 'mt') ask(T.delMtH, esc(T.delMtT), T.yesDel, function () { s('rg-diabetes-innstillinger', null); close(); draw(); toast(T.deleted); });
    else if (w === 'no') ask(T.delNoH, esc(T.delNoT), T.yesDel, function () { s('mn_k1', null); s('mn_k2', null); close(); draw(); toast(T.deleted); });
    else ask(T.delTkH, esc(T.delTkT), T.yesDel, function () { ['tk_mine', 'tk_meals', 'tk_favs', 'tk_recent', 'tk_plate', 'tk_ean', 'tk_enhet'].forEach(function (k) { s(k, null); }); close(); draw(); toast(T.deleted); });
  });
  $('slettMine').addEventListener('click', function () {
    var n = cnt('tk_mine'); if (!n) { toast(T.mineNone); return; }
    ask(T.delMineH, esc(T.delMineT(n)), T.yesDel, function () { s('tk_mine', null); close(); draw(); toast(T.minesDel); });
  });

  /* ---------- Bytt pumpe, sensor eller versjon: bruker velgeren som finnes fra før ---------- */
  $('bytt').setAttribute('href', '/nyttig/diabetes/' + (EN ? 'en/' : '') + '?velg&retur=' + encodeURIComponent(location.pathname));

  /* ---------- Slett min profil: 10 sekunder hold ---------- */
  function hold(b, ms, fn) {
    var t0 = 0, raf = 0, done = false, f = b.querySelector('.fyll'), tx = b.querySelector('.tx'), tel = $('tel'), orig = tx.textContent;
    function step() {
      var d = Date.now() - t0, p = Math.min(1, d / ms); f.style.width = (p * 100) + '%';
      tel.textContent = p < 1 ? Math.ceil((ms - d) / 1000) + T.left : '';
      if (p >= 1) { done = true; end(); fn(); return; } raf = requestAnimationFrame(step);
    }
    function start(e) { if (done || t0) return; if (e && e.preventDefault) e.preventDefault(); t0 = Date.now(); b.classList.add('gaar'); tx.textContent = T.holding; raf = requestAnimationFrame(step); }
    function end() { cancelAnimationFrame(raf); var was = t0; t0 = 0; f.style.width = '0'; b.classList.remove('gaar'); tx.textContent = orig; if (!done && was) tel.textContent = T.released; }
    b.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { b.addEventListener(n, function () { if (t0) end(); }); });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    b.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') start(e); });
    b.addEventListener('keyup', function (e) { if ((e.key === ' ' || e.key === 'Enter') && t0) end(); });
    b.addEventListener('click', function (e) { e.preventDefault(); });
  }
  $('slettAlt').addEventListener('click', function () {
    var l = [];
    if (g('mn_pump') || g('mn_sen') || g('mn_other')) l.push(T.allEq);
    if (vip().some(Boolean)) l.push(T.allPer);
    if (hasMt()) l.push(T.allMt);
    var nt = notes(); if (nt.k1 || nt.k2) l.push(T.allNo);
    l.push(T.allTk); l.push(T.allCache);
    open('<h3>' + esc(T.allH) + '</h3><p class="per">' + (ENKEL ? '<b>' + esc(T.allAdult) + '</b>' : '') + esc(T.allA) + '</p><ul class="liste">' + l.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul><p class="per">' + esc(T.allEnd) + '</p><div class="row2"><button class="btn danger hold" id="ja" type="button" aria-label="' + esc(T.hold) + '"><span class="fyll"></span><span class="tx">' + esc(T.hold) + '</span></button><button class="btn ghost" id="nei" type="button">' + esc(T.no) + '</button></div><p class="tel" id="tel" aria-live="polite"></p>');
    $('nei').addEventListener('click', close);
    hold($('ja'), 10000, function () {
      var ks = [];
      try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^(mn_|tk_|rg-vip|rg-diabetes-innstillinger)/.test(k)) ks.push(k); } } catch (e) { }
      ks.forEach(function (k) { s(k, null); });
      try { sessionStorage.removeItem('mn_skip'); } catch (e) { }
      close(); draw(); toast(T.allDone);
    });
  });

  /* ---------- Kode og QR ---------- */
  function b64e(u) { var r = '', i; for (i = 0; i < u.length; i += 8192) r += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(r).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64d(t) { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; var b = atob(t), u = new Uint8Array(b.length), i; for (i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function pack(obj, type) {
    var u = new TextEncoder().encode(JSON.stringify(obj));
    function out(f, bytes) { return 'RG1' + type + f + '.' + b64e(bytes); }
    if (window.CompressionStream) {
      try { var cs = new CompressionStream('deflate-raw'), w = cs.writable.getWriter(); w.write(u); w.close(); return new Response(cs.readable).arrayBuffer().then(function (ab) { return out('1', new Uint8Array(ab)); }); } catch (e) { }
    }
    return Promise.resolve(out('0', u));
  }
  function unpack(kode) {
    kode = String(kode || '').trim();
    var m = kode.match(/RG1([PM])([01])\.([A-Za-z0-9_-]+)/);
    if (!m || m[3].length > 60000) return Promise.reject(new Error('format'));
    var u; try { u = b64d(m[3]); } catch (e) { return Promise.reject(new Error('format')); }
    function parse(bytes) { if (bytes.length > 400000) throw new Error('format'); return { type: m[1], data: JSON.parse(new TextDecoder().decode(bytes)) }; }
    if (m[2] === '1') {
      if (!window.DecompressionStream) return Promise.reject(new Error('support'));
      var ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(u); w.close();
      return new Response(ds.readable).arrayBuffer().then(function (ab) { return parse(new Uint8Array(ab)); });
    }
    try { return Promise.resolve(parse(u)); } catch (e) { return Promise.reject(new Error('format')); }
  }
  /* Alt fra en kode regnes som utrygt til det er sjekket. */
  function tk(v, n) { return typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n) : ''; }
  function tt(v, a, b) { v = typeof v === 'number' ? v : parseFloat(String(v).replace(',', '.')); return isFinite(v) && v >= a && v <= b ? Math.round(v * 100) / 100 : null; }
  function rid(p) { return p + Math.random().toString(36).slice(2, 9); }
  function cleanFoods(a, max) {
    var r = []; if (!Array.isArray(a)) return r;
    a.slice(0, max).forEach(function (x) { if (!x || typeof x !== 'object') return; var n = tk(x.name, 40), c = tt(x.carbs, 0, 100); if (!n || c === null) return; r.push({ id: rid('m'), name: n, carbs: c, enh: x.enh === 'ml' ? 'ml' : 'g' }); });
    return r;
  }
  function clean(d) {
    var o = {}; if (!d || typeof d !== 'object') return o;
    if (d.u && typeof d.u === 'object') {
      var u = {}, ok = /^[a-z0-9_-]{1,24}$/;
      ['mn_pump', 'mn_sen'].forEach(function (k) { if (typeof d.u[k] === 'string' && ok.test(d.u[k])) u[k] = d.u[k]; });
      if (d.u.mn_other === '1') u.mn_other = '1'; if (d.u.mn_cam === '1') u.mn_cam = '1'; if (d.u.mn_ver === 'enkel') u.mn_ver = 'enkel';
      if (Object.keys(u).length) o.u = u;
    }
    if (Array.isArray(d.p)) {
      var p = [null, null];
      [0, 1].forEach(function (i) { var x = d.p[i]; if (x && typeof x === 'object') { var n = tk(x.n, 40), t = tk(x.t, 20), dd = t.replace(/[^\d+]/g, ''); if (n && /^\+?\d{3,18}$/.test(dd)) p[i] = { n: n, t: t }; } });
      if (p[0] || p[1]) o.p = p;
    }
    if (d.t && typeof d.t === 'object' && !Array.isArray(d.t)) {
      var t2 = {}, c = 0;
      Object.keys(d.t).slice(0, 40).forEach(function (k) { var v = d.t[k]; if (/^[\w-]{1,40}$/.test(k) && (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')) { t2[k] = typeof v === 'string' ? v.slice(0, 100) : v; c++; } });
      if (c) o.t = t2;
    }
    if (d.k && typeof d.k === 'object') { var k1 = tk(d.k.k1, 300), k2 = tk(d.k.k2, 500); if (k1 || k2) o.k = { k1: k1, k2: k2 }; }
    var mine = cleanFoods(d.mine, 100); if (mine.length) o.mine = mine;
    if (Array.isArray(d.meals)) {
      var ml = [];
      d.meals.slice(0, 30).forEach(function (m) {
        if (!m || typeof m !== 'object') return; var n = tk(m.name, 40), it = [];
        (Array.isArray(m.items) ? m.items : []).slice(0, 30).forEach(function (x) {
          if (!x || typeof x !== 'object') return; var nn = tk(x.name, 60), p100 = tt(x.per100, 0, 100), gr = tt(x.grams, 0, 3000);
          if (nn && p100 !== null && gr !== null && gr > 0) it.push({ id: tk(x.id, 40) || rid('x'), name: nn, per100: p100, grams: gr, src: /^(mt|pakke|gram|rg)$/.test(x.src) ? x.src : 'gram', enh: x.enh === 'ml' ? 'ml' : 'g' });
        });
        if (n && it.length) ml.push({ id: rid('ml'), name: n, items: it });
      });
      if (ml.length) o.meals = ml;
    }
    ['favs', 'recent'].forEach(function (k) { if (Array.isArray(d[k])) { var a = d[k].filter(function (x) { return typeof x === 'string' && /^[\w.:-]{1,40}$/.test(x); }).slice(0, 200); if (a.length) o[k] = a; } });
    return o;
  }
  function makeQR(text) { try { if (typeof qrcode !== 'function') return null; var q = qrcode(0, 'L'); q.addData(text, 'Byte'); q.make(); return q.createSvgTag({ cellSize: 4, margin: 4, scalable: true }); } catch (e) { return null; } }
  function baseUrl() { return /^https?:$/.test(location.protocol) ? location.origin + location.pathname : 'https://reinertsengruppen.no/nyttig/diabetes/' + (EN ? 'en/' : '') + 'profil/'; }
  function collect(v) {
    var d = {};
    if (v.u) { var u = {}; ['mn_pump', 'mn_sen', 'mn_cam', 'mn_other', 'mn_ver'].forEach(function (k) { var x = g(k); if (x) u[k] = x; }); d.u = u; }
    if (v.p) d.p = vip();
    if (v.t) d.t = j('rg-diabetes-innstillinger') || {};
    if (v.k) d.k = notes();
    if (v.m) { d.mine = j('tk_mine') || []; d.meals = j('tk_meals') || []; d.favs = j('tk_favs') || []; d.recent = j('tk_recent') || []; }
    return d;
  }
  function showCode(title, text, obj, type, warn) {
    pack(obj, type).then(function (kode) {
      var qr = makeQR(baseUrl() + '#k=' + kode);
      open('<h3>' + esc(title) + '</h3><p class="per">' + esc(text) + '</p>' + (qr ? '<div class="qr" role="img" aria-label="QR">' + qr + '</div><p class="per" style="text-align:center">' + esc(T.scanIt) + '</p>' : '<div class="adv">' + esc(T.qrBig) + '</div>') +
        '<label class="lbl" for="kt">' + esc(T.code) + ' (' + kode.length + esc(T.chars) + ')</label><textarea class="t kode" id="kt" readonly rows="4">' + esc(kode) + '</textarea><div class="row2" style="margin-top:10px"><button class="btn" id="kop" type="button">' + esc(T.copy) + '</button>' + (navigator.share ? '<button class="btn ghost" id="del" type="button">' + esc(T.share) + '</button>' : '') + '</div><div class="adv" style="margin-top:12px">' + warn + '</div><button class="btn ghost full" id="lk" type="button" style="margin-top:12px">' + esc(T.close) + '</button>');
      $('lk').addEventListener('click', close);
      $('kop').addEventListener('click', function () {
        var ta = $('kt'); ta.select();
        function ok() { toast(T.copied); }
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(kode).then(ok, function () { try { document.execCommand('copy'); ok(); } catch (e) { } }); else { document.execCommand('copy'); ok(); } } catch (e) { }
      });
      if ($('del')) $('del').addEventListener('click', function () { navigator.share({ title: T.yourCode, text: kode }).catch(function () { }); });
    });
  }
  $('lagP').addEventListener('click', function () {
    var rows = [['u', T.cEq], ['p', T.cPer], ['t', T.cMt], ['k', T.cNo], ['m', T.cTk]];
    open('<h3>' + esc(T.moveH) + '</h3><p class="per">' + esc(T.moveP) + '</p>' + rows.map(function (x) { return '<label class="valg"><input type="checkbox" id="v_' + x[0] + '" checked><span>' + esc(x[1]) + '</span></label>'; }).join('') + '<div class="row2" style="margin-top:14px"><button class="btn ghost" id="av" type="button">' + esc(T.cancel) + '</button><button class="btn" id="go" type="button">' + esc(T.mkCode) + '</button></div>');
    $('av').addEventListener('click', close);
    $('go').addEventListener('click', function () {
      var v = {}; rows.forEach(function (x) { v[x[0]] = $('v_' + x[0]).checked; });
      if (!rows.some(function (x) { return v[x[0]]; })) { toast(T.pick); return; }
      showCode(T.yourCode, T.yourCodeT, collect(v), 'P', T.warnP);
    });
  });
  $('lagM').addEventListener('click', function () {
    var mine = j('tk_mine') || []; if (!mine.length) { toast(T.noShare); return; }
    showCode(T.shareH(mine.length), T.shareT, { mine: mine.map(function (x) { return { name: x.name, carbs: x.carbs, enh: x.enh }; }) }, 'M', esc(T.shareW));
  });
  function codeDialog(title) {
    open('<h3>' + esc(title) + '</h3><p class="per">' + esc(T.haveT) + '</p><label class="lbl" for="kin">' + esc(T.code) + '</label><textarea class="t kode" id="kin" rows="4" placeholder="RG1…" autocomplete="off"></textarea><div id="adv" role="alert"></div><div class="row2" style="margin-top:12px"><button class="btn ghost" id="av" type="button">' + esc(T.cancel) + '</button><button class="btn" id="go" type="button">' + esc(T.read) + '</button></div>');
    $('av').addEventListener('click', close);
    $('go').addEventListener('click', function () { readCode($('kin').value, title); });
  }
  function bad(m, title) { var a = $('adv'); if (a) { a.className = 'adv'; a.textContent = m; } else { codeDialog(title); var b = $('adv'); b.className = 'adv'; b.textContent = m; } }
  function readCode(txt, title) {
    unpack(txt).then(function (r) {
      var d = clean(r.data);
      if (r.type === 'M') return foodsDialog(d, title);
      profileDialog(d, title);
    }, function (e) { bad(e && e.message === 'support' ? T.noSupport : T.badCode, title); });
  }
  function foodsDialog(d, title) {
    if (!d.mine || !d.mine.length) { bad(T.noFoods, title); return; }
    open('<h3>' + esc(T.foodsIn(d.mine.length)) + '</h3><p class="per">' + esc(T.foodsT) + '</p><div class="adv adv2">' + T.foodsW + '</div><div class="liste2">' + d.mine.map(function (x, i) { return '<label class="valg"><input type="checkbox" data-i="' + i + '" checked><span><b>' + esc(x.name) + '</b><br><small>' + x.carbs + esc(T.per100 + (x.enh === 'ml' ? 'ml' : 'g')) + '</small></span></label>'; }).join('') + '</div><div class="row2" style="margin-top:14px"><button class="btn ghost" id="av" type="button">' + esc(T.cancel) + '</button><button class="btn" id="go" type="button">' + esc(T.addSel) + '</button></div>');
    $('av').addEventListener('click', close);
    $('go').addEventListener('click', function () {
      var have = j('tk_mine'); if (!Array.isArray(have)) have = []; var nw = 0, skip = 0, full = 0;
      Array.prototype.forEach.call(document.querySelectorAll('.liste2 input:checked'), function (c) {
        var x = d.mine[+c.getAttribute('data-i')];
        if (have.some(function (h) { return h && h.name === x.name && +h.carbs === +x.carbs; })) { skip++; return; }
        if (have.length >= 100) { full++; return; }
        x.fra = 1; have.push(x); nw++;
      });
      if (!s('tk_mine', JSON.stringify(have))) { toast(T.noSave); return; }
      close(); draw(); toast(T.addedN(nw, skip) + (full ? T.fullN(full) : ''));
    });
  }
  function profileDialog(d, title) {
    var l = [];
    if (d.u) l.push(T.lPump + esc(PUMPS[d.u.mn_cam && d.u.mn_pump === 'ypso' ? 'ypsocam' : d.u.mn_pump] || T.none) + T.lSen + esc(SENS[d.u.mn_sen] || T.none) + (d.u.mn_ver === 'enkel' ? T.lEnkel : ''));
    if (d.p) l.push(T.lPer + d.p.filter(Boolean).map(function (x) { return esc(x.n); }).join(', '));
    if (d.t) l.push(T.lMt); if (d.k) l.push(T.lNo);
    if (d.mine) l.push(d.mine.length + T.lMine); if (d.meals) l.push(d.meals.length + T.lMeals); if (d.favs) l.push(d.favs.length + T.lFavs);
    if (!l.length) { bad(T.nothingValid, title); return; }
    open('<h3>' + esc(T.inCode) + '</h3><ul class="liste">' + l.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><div class="adv adv2">' + T.replaceW + '</div><div class="row2" style="margin-top:12px"><button class="btn ghost" id="av" type="button">' + esc(T.cancel) + '</button><button class="btn" id="go" type="button">' + esc(T.useCode) + '</button></div>');
    $('av').addEventListener('click', close);
    $('go').addEventListener('click', function () {
      var okAll = true;
      if (d.u) ['mn_pump', 'mn_sen', 'mn_cam', 'mn_other', 'mn_ver'].forEach(function (k) { okAll = s(k, d.u[k] || null) && okAll; });
      if (d.p) okAll = vipSave(d.p) && okAll;
      if (d.t) okAll = s('rg-diabetes-innstillinger', JSON.stringify(d.t)) && okAll;
      if (d.k) { okAll = s('mn_k1', d.k.k1 || null) && okAll; okAll = s('mn_k2', d.k.k2 || null) && okAll; }
      if (d.mine) okAll = s('tk_mine', JSON.stringify(d.mine)) && okAll;
      if (d.meals) okAll = s('tk_meals', JSON.stringify(d.meals)) && okAll;
      if (d.favs) okAll = s('tk_favs', JSON.stringify(d.favs)) && okAll;
      if (d.recent) okAll = s('tk_recent', JSON.stringify(d.recent)) && okAll;
      close(); draw(); toast(okAll ? T.moved : T.noSave);
    });
  }
  $('harP').addEventListener('click', function () { codeDialog(T.haveH); });
  $('harM').addEventListener('click', function () { codeDialog(T.haveM); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && $('sbg').classList.contains('on')) close(); });
  $('sbg').addEventListener('click', function (e) { if (e.target === $('sbg')) close(); });

  /* Siden åpnet fra en QR-kode: koden ligger i adressen etter #k=. Den fjernes fra adressen med en gang. */
  (function () {
    var m = (location.hash || '').match(/[#&]k=([^&]+)/); if (!m) return;
    var k = m[1]; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
    try { k = decodeURIComponent(k); } catch (e) { }
    readCode(k, T.haveH);
  })();

  if (ENKEL) { var ld = document.querySelector('.lead'), dt = $('slettT'); if (ld) ld.textContent = T.leadE; if (dt) dt.textContent = T.delTE; }
  window.rgProfil = { draw: draw, read: readCode };
  draw();
})();
