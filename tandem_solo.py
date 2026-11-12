import re
TG='https://assets.ctfassets.net/k5s5iz8jouwn/2VHePZuhnd2E5GaPOKnz16/617bab8f8d876a8d9ae741cd14cf2770/technical-user-guide-tandem-mobi-control-iq-7-10-4-no-AW1020277.pdf'
SG='https://www.accu-chek.no/document/accu-chek-solo-ifupdf/download?inline'
L={
'no':dict(
 okT="<b>Siden passer Tandem t:slim X2 med FreeStyle Libre 3 Plus.</b> Pilene og Control-IQ+ er forklart etter Abbotts og Tandems norske veiledninger.",
 okS="<b>Siden passer Accu-Chek Solo med %s.</b> Solo har ingen automatikk, og du legger sensorverdien inn selv.",
 sen={'g7':'Dexcom G7','g6':'Dexcom G6','libre':'FreeStyle Libre 3 Plus'},
 oldT="Målområdet er 3,9 til 10 mmol/L. Pumpen går etter hva verdien ventes å bli, ikke bare hva den er nå.",
 newT="Uten aktivitet prøver pumpen å holde verdien mellom 6,25 og 8,9 mmol/L. Pumpen går etter hva verdien ventes å bli, ikke bare hva den er nå.",
 span_old='data-pump="tslim ypso dash solo"', span_new='data-pump="ypso dash"',
 tip_h="Control-IQ+ i Tandem t:slim X2", tip_lead="Tallene her står i Tandems norske veiledning for Control-IQ+ (versjon 7.10). Pumpen ser 30 minutter frem.",
 s1="Automatisk korreksjonsbolus", d1="Når verdien ventes å bli 10 mmol/L eller mer, og pumpen allerede øker eller gir mest mulig insulin, kan den gi en korreksjonsbolus. Mål er 6,1 mmol/L. Maks 6 enheter, og høyst én gang per 60 minutter. Pumpen lager ingen lyd eller vibrasjon når den starter.",
 s2="Søvn og trening", d2="Du må selv sette opp en søvnplan eller slå på søvn eller trening. Under søvn er målområdet 6,25 til 6,7, og det gis ingen automatisk korreksjonsbolus. Under trening er det 7,8 til 8,9, og insulinet stoppes når verdien ventes under 4,4.",
 s3="Uten sensorverdier", d3="Etter 20 minutter uten sensorverdi går pumpen tilbake til basalen i din personlige profil.",
 tn="Insulinvarigheten er fast på 5 timer når Control-IQ+ er på. Tandem skriver at Control-IQ+ ikke skal brukes under 2 år, ved under 5 enheter insulin i døgnet eller under 9 kg. Hva som passer deg, bestemmer diabetesteamet. Kilde: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Tandem t:slim X2 med Control-IQ+, teknisk brukerveiledning (norsk)</a>."%TG,
 libreT="Med Tandem t:slim X2 starter du Libre 3 Plus-sensoren i Tandem t:slim-appen. Sensoren kan bare være koblet til én enhet om gangen, så den må ikke være koblet til Libre-appen eller leseren først. Oppstarten tar 1 time uten sensorverdier. Pumpen bruker ikke pilen når den regner ut en bolus. Kilde: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Tandems norske veiledning</a>."%TG,
 sh="Accu-Chek Solo: du legger verdien inn selv", slead="Solo har ingen automatikk og er ikke koblet til sensoren. Du leser sensoren i sensorens egen app eller leser.",
 t1="Les sensoren", e1="Se tallet og pilen i sensorens app eller leser. Pilene er forklart over for din sensor.",
 t2="Legg inn verdien i Solo", e2="I Solo velger du Måling og legger inn glukoseverdien for hånd. Verdien fra sensoren gjelder for bolusråd i bare 15 minutter.",
 t3="Sjekk med fingerstikk", e3="Stemmer ikke tallet med hvordan du har det, må du ta blodsukkermåling med fingerstikk.",
 sn="Er verdien under advarselsgrensen for lavt blodsukker, gir Solo ikke bolusråd, men anbefaler karbohydrater. Pumpen justerer ikke insulinet selv. Hva du gjør ved hver pil, bestemmer diabetesteamet. Kilde: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Accu-Chek Solo, bruksanvisning (norsk)</a>."%SG,
),
'en':dict(
 okT="<b>This page fits Tandem t:slim X2 with FreeStyle Libre 3 Plus.</b> The arrows and Control-IQ+ are explained from the Norwegian guides from Abbott and Tandem.",
 okS="<b>This page fits Accu-Chek Solo with %s.</b> Solo has no automation, and you enter the sensor value yourself.",
 sen={'g7':'Dexcom G7','g6':'Dexcom G6','libre':'FreeStyle Libre 3 Plus'},
 oldT="The target range is 3.9 to 10 mmol/L. The pump goes by what the value is expected to be, not just what it is now.",
 newT="With no activity on, the pump tries to keep the value between 6.25 and 8.9 mmol/L. The pump goes by what the value is expected to be, not just what it is now.",
 span_old='data-pump="tslim ypso dash solo"', span_new='data-pump="ypso dash"',
 tip_h="Control-IQ+ in Tandem t:slim X2", tip_lead="The numbers here come from Tandem's Norwegian guide for Control-IQ+ (version 7.10). The pump looks 30 minutes ahead.",
 s1="Automatic correction bolus", d1="When the value is expected to be 10 mmol/L or more, and the pump is already increasing or giving maximum insulin, it can give a correction bolus. The target is 6.1 mmol/L. Maximum 6 units, and at most once every 60 minutes. The pump makes no sound or vibration when it starts.",
 s2="Sleep and exercise", d2="You set up a sleep schedule or switch sleep or exercise on yourself. During sleep the target range is 6.25 to 6.7, and no automatic correction bolus is given. During exercise it is 7.8 to 8.9, and insulin is stopped when the value is expected to go below 4.4.",
 s3="Without sensor values", d3="After 20 minutes without a sensor value, the pump goes back to the basal in your personal profile.",
 tn="The insulin duration is fixed at 5 hours when Control-IQ+ is on. Tandem writes that Control-IQ+ should not be used under 2 years, under 5 units of insulin a day or under 9 kg. What suits you is decided by your diabetes team. Source: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Tandem t:slim X2 with Control-IQ+, technical user guide (Norwegian)</a>."%TG,
 libreT="With Tandem t:slim X2 you start the Libre 3 Plus sensor in the Tandem t:slim app. The sensor can only be connected to one device at a time, so it must not be connected to the Libre app or reader first. Start-up takes 1 hour with no sensor values. The pump does not use the arrow when it calculates a bolus. Source: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Tandem's Norwegian guide</a>."%TG,
 sh="Accu-Chek Solo: you enter the value yourself", slead="Solo has no automation and is not connected to the sensor. You read the sensor in the sensor's own app or reader.",
 t1="Read the sensor", e1="Look at the number and arrow in the sensor's app or reader. The arrows are explained above for your sensor.",
 t2="Enter the value in Solo", e2="In Solo you choose Measure and enter the glucose value by hand. A sensor value counts for a bolus advice for only 15 minutes.",
 t3="Check with a fingerstick", e3="If the number does not match how you feel, take a blood glucose test with a fingerstick.",
 sn="If the value is below the low-glucose warning limit, Solo gives no bolus advice but recommends carbohydrates. The pump does not adjust insulin by itself. What you do at each arrow is decided by your diabetes team. Source: <a href=\"%s\" target=\"_blank\" rel=\"noopener\">Accu-Chek Solo, user guide (Norwegian)</a>."%SG,
)}
def steps(d,pairs):
    o='<ol class="steps">'
    for i,(t,x) in enumerate(pairs,1):
        o+='<li><span class="num" aria-hidden="true">%d</span><div><b>%s</b><span class="d">%s</span></div></li>'%(i,t,x)
    return o+'</ol>'
files={'diabetes/trendpiler/index.html':'no','diabetes-enkel/trendpiler/index.html':'no','diabetes/en/trendpiler/index.html':'en','diabetes-simple/trendpiler/index.html':'en'}
for f,lg in files.items():
    d=L[lg]; s=open(f,encoding='utf-8').read()
    def rep(a,b):
        global s
        assert s.count(a)==1,(f,a[:60],s.count(a))
        s=s.replace(a,b)
    # banner
    attrs=' data-ok-tslim-libre="%s"'%d['okT'].replace('"','&quot;')
    for k,v in d['sen'].items():
        attrs+=' data-ok-solo-%s="%s"'%(k,(d['okS']%v).replace('"','&quot;'))
    rep('<p class="pump" data-ok-o5-libre=','<p class="pump"'+attrs+' data-ok-o5-libre=')
    # grid split
    rep('<div class="grid" data-sen="g7 g6" data-pump="tslim">\n    <section class="panel" aria-label="Control-IQ">','<div class="grid" data-pump="tslim">\n    <section class="panel" data-sen="g7 g6 libre" aria-label="Control-IQ">')
    rep('<section class="panel" aria-label="Basal-IQ">','<section class="panel" data-sen="g7 g6" aria-label="Basal-IQ">')
    rep(d['oldT'],d['newT'])
    rep(d['span_old'],d['span_new'])
    # libre note for tslim after o5 note
    m=re.search(r'<div class="note" data-pump="o5" hidden style="margin-top:10px">.*?</div>',s,re.S)
    assert m,f
    s=s[:m.end()]+'<div class="note" data-pump="tslim" hidden style="margin-top:10px">'+d['libreT']+'</div>'+s[m.end():]
    # new panels before mm grid
    new=('<div class="grid" data-pump="tslim" hidden><section class="panel" aria-label="Control-IQ+"><h2>%s</h2><p class="small" style="margin:0">%s</p>'%(d['tip_h'],d['tip_lead'])
        +steps(d,[(d['s1'],d['d1']),(d['s2'],d['d2']),(d['s3'],d['d3'])])+'<div class="note">%s</div></section></div>\n'%d['tn']
        +'  <div class="grid" data-pump="solo" hidden><section class="panel" aria-label="Accu-Chek Solo"><h2>%s</h2><p class="small" style="margin:0">%s</p>'%(d['sh'],d['slead'])
        +steps(d,[(d['t1'],d['e1']),(d['t2'],d['e2']),(d['t3'],d['e3'])])+'<div class="note">%s</div></section></div>\n  '%d['sn'])
    rep('<div class="grid" data-pump="mm" data-sen="simplera" hidden>',new+'<div class="grid" data-pump="mm" data-sen="simplera" hidden>')
    open(f,'w',encoding='utf-8').write(s); print('ok',f)
