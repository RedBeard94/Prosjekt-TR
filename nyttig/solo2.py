import re
SG='https://www.accu-chek.no/document/accu-chek-solo-ifupdf/download?inline'
def edit(f,fn):
    s=open(f,encoding='utf-8').read(); s2=fn(s); assert s2!=s,f; open(f,'w',encoding='utf-8').write(s2); print('ok',f)
# TALLENE
no_t='''<section class="panel" data-pump="solo" hidden aria-label="Slik heter tallene på Accu-Chek Solo">
      <h2>Slik heter tallene på Accu-Chek Solo</h2>
      <p class="small" style="margin:0">Solo bruker andre navn enn eksemplene på denne siden. Her ser du hva som er hva.</p>
      <ul style="margin:12px 0 0;padding-left:20px"><li style="margin:6px 0"><b>Karbohydratforhold</b> <span class="small">(enheter per gram, for eksempel 1,00 U : 10 g). På siden her: Karbohydratforhold.</span></li><li style="margin:6px 0"><b>Insulinfølsomhet</b> <span class="small">(enheter og mmol/L, for eksempel 1,00 U : 2,2 mmol/L). På siden her: Korreksjonsfaktor.</span></li><li style="margin:6px 0"><b>Målområde</b> <span class="small">(nedre og øvre grense i mmol/L). Midtpunktet brukes som målverdi. På siden her: Målverdi.</span></li><li style="margin:6px 0"><b>Virketid</b> <span class="small">(timer og minutter). På siden her: Insulinvarighet.</span></li></ul>
      <div class="note">Solo har også <b>Måltidsstigning</b>, <b>Matbitgrense</b> og <b>Forsinkelsestid</b>, og du kan lage opptil 8 tidsperioder i døgnet. Bolusråd må settes opp først, og du kan slå det av. Hvilke tall som gjelder for deg, bestemmer diabetesteamet.</div>
      <p class="small" style="margin:12px 0 0">Kilde: <a href="%s" target="_blank" rel="noopener">Accu-Chek Solo, bruksanvisning (norsk)</a>.</p>
    </section>
    '''%SG
en_t='''<section class="panel" data-pump="solo" hidden aria-label="What the numbers are called on Accu-Chek Solo">
      <h2>What the numbers are called on Accu-Chek Solo</h2>
      <p class="small" style="margin:0">Solo uses other names than the examples on this page. Here is what is what.</p>
      <ul style="margin:12px 0 0;padding-left:20px"><li style="margin:6px 0"><b>Karbohydratforhold (carb ratio)</b> <span class="small">(units per gram, for example 1.00 U : 10 g). On this page: Carb ratio.</span></li><li style="margin:6px 0"><b>Insulinfølsomhet (insulin sensitivity)</b> <span class="small">(units and mmol/L, for example 1.00 U : 2.2 mmol/L). On this page: Correction factor.</span></li><li style="margin:6px 0"><b>Målområde (target range)</b> <span class="small">(lower and upper limit in mmol/L). The midpoint is used as the target. On this page: Target.</span></li><li style="margin:6px 0"><b>Virketid (action time)</b> <span class="small">(hours and minutes). On this page: Insulin duration.</span></li></ul>
      <div class="note">Solo also has <b>Måltidsstigning</b> (meal rise), <b>Matbitgrense</b> (snack limit) and <b>Forsinkelsestid</b> (delay time), and you can make up to 8 time periods in a day. Bolus advice must be set up first, and you can turn it off. Which numbers apply to you is decided by your diabetes team.</div>
      <p class="small" style="margin:12px 0 0">Source: <a href="%s" target="_blank" rel="noopener">Accu-Chek Solo, user guide (Norwegian)</a>.</p>
    </section>
    '''%SG
def tal(new):
    def f(s):
        m=re.search(r'<section class="panel" data-pump="o5" data-sen="libre" hidden aria-label="[^"]*">.*?</section>\s*',s,re.S)
        assert m
        return s[:m.end()]+new+s[m.end():]
    return f
edit('tallene/index.html',tal(no_t)); edit('en/tallene/index.html',tal(en_t))
# INNSTILLINGER
def inn(note,lab):
    def f(s):
        for fid,key in(('f-korr',lab[0]),('f-mal',lab[1]),('f-varig',lab[2])):
            a='<label class="field" for="%s" data-lab-o5='%fid
            assert s.count(a)==1,(fid)
            s=s.replace(a,'<label class="field" for="%s" data-lab-solo="%s" data-lab-o5='%(fid,key))
        m=re.search(r'<div class="note" data-pump="o5" data-sen="libre" hidden[^>]*>.*?</div>',s,re.S)
        assert m
        return s[:m.end()]+'\n      '+note+s[m.end():]
    return f
no_n='<div class="note" data-pump="solo" hidden style="margin-top:14px"><b>På Accu-Chek Solo</b> heter feltene over noe annet: Korreksjonsfaktor heter Insulinfølsomhet, Målverdi heter Målområde (nedre og øvre grense), og Insulinvarighet heter Virketid. Solo er ikke koblet til sensoren. Verdien fra sensoren legger du inn selv, og den gjelder bare i 15 minutter for bolusråd. Kilde: <a href="%s" target="_blank" rel="noopener">Accu-Chek Solo, bruksanvisning (norsk)</a>.</div>'%SG
en_n='<div class="note" data-pump="solo" hidden style="margin-top:14px"><b>On Accu-Chek Solo</b> the fields above are called something else: Correction factor is called Insulinfølsomhet, Target is called Målområde (lower and upper limit), and Insulin duration is called Virketid. Solo is not connected to the sensor. You enter the sensor value yourself, and it counts for bolus advice for only 15 minutes. Source: <a href="%s" target="_blank" rel="noopener">Accu-Chek Solo, user guide (Norwegian)</a>.</div>'%SG
edit('innstillinger/index.html',inn(no_n,('Insulinfølsomhet','Målområde','Virketid')))
edit('en/innstillinger/index.html',inn(en_n,('Insulinfølsomhet','Målområde','Virketid')))
