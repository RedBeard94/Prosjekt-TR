# Spørsmålsboten

Alt som hører til boten ligger i denne mappen: `nyttig/diabetes/sporsmal/`.

Filer:
- `index.html`: egen side med boten og alle spørsmålene som liste (ikke søkbar i Google, `noindex`).
- `bot.js`: boten og alle svarene.
- `bot.css`: utseendet.

## Slik tar du den i bruk på forsiden
Legg inn én linje i `nyttig/diabetes/index.html`, rett før `</body>`:

    <script src="/nyttig/diabetes/sporsmal/bot.js" defer></script>

## Slik fjerner du boten helt
1. Slett hele mappen `nyttig/diabetes/sporsmal/` på GitHub.
2. Hvis du la inn linjen over på forsiden: slett den linjen også.

## Advarselen «Ikke godkjent av helsepersonell ennå»
Står øverst i `bot.js` (`var NOTICE`). Gjør den tom først når diabetessykepleier eller lege har lest svarene, spesielt de som gjelder akutt, sykdom, alkohol, trening, skole og barnehage, og fingerstikk.

## Å huske
- Lenkene til manualer ligger kopiert i `bot.js` (`var MAN`). Flytter produsentene en fil, må lenken rettes her.
- Boten finner svar ved å lete etter nøkkelord. Den gir aldri doser og finner ikke på svar.

## Cat
Boten har fått et ansikt: Cat, en tegnet figur fra filmen om diabetes.
- `cat.webp`: Cat smiler (boblen, toppen av chatten og ved svarene).
- `cat-tenker.webp`: Cat tenker (vises et lite øyeblikk før svaret kommer, og på knappen «Spør Cat om diabetes» på forsiden i Diabetes enkel).
- Toppen av chatten sier «Svarbot. Cat er en tegnet figur.», så ingen tror at en ekte person svarer.
- Ved fare-ord (for eksempel bevisstløs eller kramper) kommer svaret med en gang, uten «Cat tenker».
- Vil du fjerne Cat: slett de to bildene og bytt `av(...)` i `bot.js` tilbake til 💬.

## Blodsukkertall (Cat spør om tallet)
- Skriver noen «jeg er høy», «lav», «stiger», «synker», «på vei opp/ned» eller «føling» uten tall, spør Cat om tallet.
- Med tall (for eksempel «jeg er på 14») svarer Cat med en gang: under 4 lavt, 4–10 vanlig mål, 10–14 litt høyt, 14 eller mer høyt, 18 eller mer veldig høyt. «HI» og «LO» fra sensoren forstås også.
- Kilder for grensene: NHI (lavt under 4, kontroller oftere over 14, kontakt ved to verdier over 18), Helsedirektoratet (mål 4–7 før mat og under 10 etter), SSHF (ketoner ved høyt over tid).
- Lavt tall gir svar med en gang (uten «Cat tenker»). Svarene gir aldri doser. Teksten ligger i `svarTall()` i `bot.js`.
- Disse svarene bør sjekkes av diabetessykepleier før merkingen tas bort.

## Småprat, ideer og kalkulator (Cat)
Alt ligger i `bot.js`, rett før `function ask`. Alt er ferdigskrevet. Ingen nett, ingen sporing.
- Rekkefølgen i `ask()`: meny, fare-ord, alvorlige ord, ja/nei til Cats eget spørsmål, kalkulator, noen faste fraser, blodsukkertall, de vanlige spørsmålene, småprat, «Jeg er usikker».
- De vanlige diabetessvarene er testet mot den gamle koden: ingen er endret. Småpraten (hei, takk, god dag, dårlig dag, vær osv.) kommer bare når boten ellers ikke fant noe svar, og ikke når meldingen er et spørsmål («hva», «hvordan» osv.).
- Faste fraser som kommer før de vanlige svarene: vits, hvordan har du det, hva heter du, terning, mynt, pumpelyder, «jeg kjeder meg», «sånn passe», lekser, været og navn/adresse/telefonnummer.
- Vitser (30), «hvordan har du det» (10), gode svar, pumpelyder og 10 ideer ligger som lister (`JOKES`, `HVORDAN`, `GOOD`, `PUMP`, `IDEER`). Cat blander dem og gjentar ikke før alle er brukt. Når alle 10 ideene er brukt, sier hun at hun er tom for ideer. «Nye ideer» starter på nytt.
- Navn og alder: Cat sier at det er en hemmelighet. Ingen alder, ingen navn.
- Vær: Cat roper på værgudene og sier at de ikke svarte. Ingen nettlenker, fordi ikke alle barn får bruke nett.
- Alvorlige ord (`SERS`, `SERW`): svaret kommer med en gang, uten «Cat tenker», uten vits og uten «Fant du ikke svaret?». Teksten (`SER`) nevner 116 111 (Alarmtelefonen for barn og unge), 116 123 (Mental Helse) og 113. Begge numrene er sjekket mot offentlige kilder 22. november 2026. Ordlisten blir aldri perfekt.
- Kalkulatoren (`calc`) regner + − × ÷ og parenteser, som en vanlig kalkulator. Står det enheter, insulin, dose, bolus, basal eller korreksjon i regnestykket, regner hun ikke, og sender til diabetesteamet. Siden har ingen doseberegner.
- Disse tekstene bør leses av diabetessykepleier før merkingen «Ikke godkjent av helsepersonell ennå» tas bort, særlig de alvorlige svarene og kalkulator-sperren.

## Cat husker (samtale og kallenavn)
- Ligger i `bot.js`, øverst i blokken «Cat husker». Alt lagres bare i nettleserens lokale lagring på enheten, aldri på en server.
- Nøklene heter `mn_cat_samtale` og `mn_cat_kallenavn`. De starter med `mn_`, så «Slett min profil» i Min profil fjerner dem også (profil.js sletter alle nøkler som starter med `mn_`). Fjerner du `mn_` fra navnene, slutter den sletting å virke.
- Samtalen (maks 60 meldinger, tekst bare) slettes av seg selv 7 dager etter siste bruk (`DAGER`). Kallenavnet blir liggende til barnet sletter det.
- Slette: skriv «slett samtalen» (kallenavnet blir), «glem kallenavnet» eller «glem alt» (begge deler). Det er ingen knapp, med vilje.
- Lagres aldri: alvorlige meldinger (`SERS`/`SERW`), og meldinger med «jeg heter», adresse eller telefonnummer (`PRIVW`), og Cats svar på dem.
- Gamle meldinger vises litt lysere når Cat åpnes igjen, uten lenker og knapper (bare tekst).
- Kallenavn: «kall meg …» eller «kallenavn». Maks to ord, ingen tall. Cat ber om kallenavn, ikke ekte navn.
- Latter: «haha», «hehe», «lol», «kult», «morsomt», «den var god» og ler-ansikter gir et vennlig svar og tilbud om en ny vits.
- Personvern-siden har fått et avsnitt om dette. Teksten bør leses av noen som kjenner personvern for barn før merkingen «Ikke godkjent» fjernes.

## «Mente du», «Er du sikker?» og korte svar
- Variablene `LAST`, `ALT` og `LK` i `bot.js` husker hva Cat sa sist (qa, vits, vær, kalkulator eller småprat). De lagres ikke.
- «Vet ikke» eller «Ja» rett etter et svar med «Mente du noe annet?» viser det første forslaget, med teksten «Da viser jeg det jeg tror du mente:». «Nei» gir et vennlig svar. Svarene på spørsmålene er ikke endret.
- «Er du sikker?», «Sikker?» og «Sikker på at du ikke vet det?» svarer ut fra det Cat sa sist. Etter et diabetessvar sier Cat at hun ikke er lege. Hun skal aldri bekrefte et diabetessvar med «Helt sikker!».
- «Ja», «nei», «ok», «greit» og «vet ikke» uten sammenheng gir et vennlig svar (i `sent()`).
- Svaret på «Er noe mat forbudt?» starter ikke lenger med «Nei» (kunne leses som «du får ikke spise godteri»).

## Nye svar: insulinets historie og superkraft
- «Når ble insulin funnet?» (gruppe Om diabetes): årstall og navn er sjekket mot Nobelprisen, University of Toronto og Canadian Encyclopedia. Teksten nevner bevisst ikke dyreforsøk eller dødsfall.
- «Har jeg en superkraft?» (gruppe Støtte): bare en snill, kort tekst uten råd.
- Begge tekstene bør leses av diabetessykepleier før merkingen «Ikke godkjent av helsepersonell ennå» fjernes.
- Lista over spørsmål på `sporsmal/index.html` bygges fra `bot.js`, så den siden trenger ingen endring.

## Vitser (30 stk, nye 22. november)
- Lista `JOKES` i `bot.js` har 30 vitser. 23 er fra «40 barnevennlige diabetesvitser» (med «diabetikere» byttet til «folk med diabetes», og uten «søt»), og 7 er nye i en mer frekk stil for barn og ungdom.
- Bevisst tatt ut: vitser om godteri og snacks, «det ligger i genene», «gode tall» og «sukkerklump».
- Vits nr 11 (insulinpennen «stiller alltid opp når du trenger meg») kan leses som at insulin tas når som helst. Be diabetessykepleier vurdere den.
- Alle vitsene bør leses av diabetessykepleier før merkingen «Ikke godkjent av helsepersonell ennå» fjernes.
