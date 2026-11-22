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
