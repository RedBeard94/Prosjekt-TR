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
