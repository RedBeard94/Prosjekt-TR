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
