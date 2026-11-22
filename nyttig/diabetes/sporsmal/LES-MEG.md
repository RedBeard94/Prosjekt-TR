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

## Runde 22. november (kveld): småprat, trygghet og kallenavn
- Nye fraser: «Hvem kan jeg spørre/ringe?» (svar + «Vil du ha lenker?» med knappene Ja/Nei), «Hva kan du gjøre/hjelpe med?» (intro + meny), «Hva tenker du på i dag?», «Hva skal du i dag?», «Hatt en fin dag?», «Hva synes du om meg?», «Noen andre?», «Var ikke det jeg spurte om» (med lenke til tilbakemelding), «Var ikke akutt» (rolig svar), «Har du noen gøye ideer?».
- Negasjon: «Jeg har ikke hatt en fin dag», «ikke bra», «ikke så godt» osv. gir trøstesvaret, ikke «Supert!».
- Cat regner med tallord 0–20 («fem pluss fem») og forstår «Nytt kast» / «Kast igjen».
- Kallenavn: «Bytt kallenavn til …», «Kallenavnet mitt er …». Listen `BADW` i `bot.js` (ca. 40 ord) blokkerer grove ord, også med tall og gjentatte bokstaver. Legg til flere ord der ved behov. Meldinger med disse ordene lagres ikke. Sier barnet «Det var mitt ekte navn», glemmer Cat navnet og ber om et kallenavn. Ved nytt kallenavn minner Cat om å ikke bruke ekte navn.
- «Slett denne samtalen», «Tøm chatten», «Start på nytt» m.fl. sletter samtalen.
- Når Cat nettopp har sagt «Her bruker vi snille ord», svarer hun lekent på «Jo du er» / «Nei du» (6 svar), og tar pause etter tre runder. Cat sier aldri at noen er dumme, og bruker ikke ordene dum/teit/idiot i egne svar.
- «Jeg er dum»/«Jeg er teit» (om seg selv) gir et snilt svar. Lagres ikke.
- Tunge svar (lagres ikke, svarer uten pause): «Jeg vil ikke ha diabetes» og lignende, og «Jeg liker ikke diabetesteamet mitt» og lignende. Begge bør leses av diabetessykepleier eller psykolog før merkingen «Ikke godkjent av helsepersonell ennå» fjernes.
- Pumpa/sensoren funker ikke (utsagn, ikke spørsmål): Cat henviser til manualen (valgt pumpe/sensor i Min profil, ellers knapp til Manualer) og diabetesteamet. Ingen doseråd.
- Skole: «Læreren vil ikke gi meg pause» gir et mykt svar uten påstander om rettigheter, og knapp til Skole og barnehage. `rettigheter/index.html` har fått `id="skole"` på den overskriften. Svaret «Hva må skolen vite?» lenker dit.
- Ikke endret: diabetessvarene, QA-listen (111) og akutt-/farevarslene.

## Ros og «Visste du at?» (22. november, kveld)
- Ros: når barnet skriver at det har gjort noe selv (byttet/satt/tapet/festet sensor, pumpe, kanyle, tok blodsukkeret) eller «Gi meg en ros», «Ros meg», «Jeg er stolt av meg selv», svarer Cat med en av 5 roser (`ROS` i `bot.js`). Rosen gjelder innsatsen. Cat sier aldri at det ble gjort riktig. Meldinger med «ikke»/«aldri» utløser ikke ros.
- «Visste du at?» / «Fakta» / «Fortell et faktum»: 8 korte fakta (`FAKTA`), tilfeldig rekkefølge, «Vil du høre en til?» med ja/nei.
- Kilder for faktaene: Diabetesforbundet (type 1 skyldes ikke mat), NHI (bukspyttkjertelen og insulin, hjernen bruker glukose, kunstig bukspyttkjertel), Helsedirektoratet (pumpa gir insulin hver time hele døgnet), Abbott og Dexcom (sensoren måler under huden), sundhed.dk (insulin som nøkkel), lex.dk (insulin kan ikke tas som tablett), Dagbladet/Diabetesforbundet (over 25 000 med type 1 i Norge; Diabetesforbundet oppgir ca. 30 000 i 2019).
- Faktaene bør leses av diabetessykepleier før merkingen «Ikke godkjent av helsepersonell ennå» fjernes.

## Rettinger (22. november, sent)
- «Hva er kallenavnet mitt?», «Hva kaller du meg?», «Husker du kallenavnet mitt?», «Hvem er jeg?» svares nå (kallenavnet, eller hvordan en lager ett).
- Lagrede kallenavn og gamle meldinger med grove ord fjernes når siden åpnes (fra før ordfilteret kom).
- «Sikker?» etter et regnestykke har 3 lekne svar (`SIKKER`).
- «Hva skal du gjøre i morgen/i kveld/i helgen?» har 3 svar (`IMORGEN`). Før traff den reisesvaret ved en feil.

## Stor Cat-runde (23. november)
- Trygge svar uten råd: «Jeg har fått diabetes», «Er det farlig?», «Hjelp», «lagt inn for … men spiste bare …», «Jeg er på 10 og skal legge meg», sulten/tørst/trøtt, vondt i magen, «Ingen forstår meg», «Jeg skammer meg», «Alle ser på meg», «Vondt å stikke». Disse lagres ikke i samtalen.
- Nye lekne svar: «Bombesikker/100 %», 2–5 vitser (over 5 gir et morsomt svar), gåter (5 stk.), «Har du venner?» (navn gjentas ikke og lagres ikke), God natt/Sov godt, Elsker deg/Glad i deg, favorittfarge/-mat, hvor bor du, synge, danse, historie, bursdag, klokka/datoen.
- Bading, leir/gym/overnatting og «hvordan forklarer jeg diabetes til venner» har egne myke svar. Bading viser valgt manual eller knapp til Manualer.
- «Kan du glemme det også?» rett etter at samtalen er slettet, glemmer kallenavnet.
- «20 gang 6» regnes ut. «Hvor mange enheter trenger jeg?» har et mykere svar.
- «en voksen du stoler på» er byttet til «en du stoler på» overalt.
- Bør leses av diabetessykepleier/psykolog: NYDIAG, FARLIG, LAGTM, LEGGM, VENNM, bading-tekstene og «Jeg skammer meg»/«Ingen forstår meg».
- «Hvilken pumpe bruker jeg?» svarer: «Jeg har registrert at du bruker … Stemmer det?» (fra Min profil).
- sw.js er satt til diabetes-v92.
