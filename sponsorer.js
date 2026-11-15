/* Sponsorlisten for reinertsengruppen.no.
   Legg inn én linje per sponsor under. Den vises automatisk i båndet på forsiden og på sponsorsiden.
   Er listen tom, skjules båndet og sponsorsiden sier at vi ikke har sponsorer ennå.

   Felter:
     navn  – navnet på sponsoren (vises alltid, også for skjermlesere)
     logo  – bilde i mappen bilder/sponsorer/, for eksempel '/bilder/sponsorer/navn.png' (kan stå tomt)
     tekst – kort tekst om sponsoren (vises på sponsorsiden)
     url   – nettsiden deres, må starte med https://
     tema  – hva sponsoren hører til, for eksempel 'diabetes' (brukes senere på hjelpemiddelsidene)

   Eksempel (fjern // foran linjen for å bruke den):
   //  { navn: 'Navn på sponsor', logo: '/bilder/sponsorer/navn.png', tekst: 'Kort tekst om sponsoren.', url: 'https://eksempel.no', tema: '' },
*/
window.RG_SPONSORER = [
];
