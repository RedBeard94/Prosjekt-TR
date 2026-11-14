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
