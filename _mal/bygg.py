#!/usr/bin/env python3
"""Setter inn logo, meny og bunn på sidene i det nye designet.

Bruk (fra mappen som inneholder _mal/):   python3 _mal/bygg.py
Delene ligger i _mal/delar/. Rediger en del, kjør skriptet, og alle sidene blir like.
Skriptet er trygt å kjøre flere ganger: det bytter bare ut det som ligger mellom markørene
<!--rg:logo-->...<!--/rg:logo-->, <!--rg:meny-->...<!--/rg:meny--> og <!--rg:bunn-->...<!--/rg:bunn-->.
Rører ikke diabetes-sidene.
"""
import os, re, sys

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
DELAR = os.path.join(HER, "delar")

# side: (bunn-del, valgt side i menyen, bredde-del)
# bredde=True: sidene med smal midtkolonne får samme bredde som forsiden (bare PC, fra 900 px).
SIDER = {
    "index.html":                        ("bunn-forside", None,     False),
    "nyttig/index.html":                 ("bunn-under",   None,     True),
    "nyttig/apper/index.html":           ("bunn-under",   "apper",  True),
    "nyttig/hjelpemidler/index.html":    ("bunn-under",   "hjelp",  True),
    "nyttig/fyret/index.html":           ("bunn-under",   "apper",  True),
    "nyttig/fyret/flekkeroya/index.html":("bunn-under",   "apper",  True),
    "sponsorer/index.html":              ("bunn-sponsor", None,     False),
    # Eldre design: får bare samme logo og meny (bunnen beholdes, None).
    "personvern/index.html":             (None,           None,     False),
    "personvern/en/index.html":          (None,           None,     False),
    "opphavsrett/index.html":            (None,           None,     False),
}
# Sider som ikke har det nye designet, og trenger menystilen i tillegg.
ELDRE = {"personvern/index.html", "personvern/en/index.html", "opphavsrett/index.html"}

def les(navn):
    with open(os.path.join(DELAR, navn + ".html"), encoding="utf-8") as f:
        return f.read()

def bytt(s, navn, regex, innhold):
    start, slutt = "<!--rg:%s-->" % navn, "<!--/rg:%s-->" % navn
    blokk = start + innhold + slutt
    m = re.search(re.escape(start) + r".*?" + re.escape(slutt), s, flags=re.S)
    if m:
        return s[:m.start()] + blokk + s[m.end():]
    ms = list(re.finditer(regex, s, flags=re.S))
    if len(ms) != 1:
        sys.exit("Fant %d treff for '%s' (forventet 1)" % (len(ms), navn))
    m = ms[0]
    return s[:m.start()] + blokk + s[m.end():]

def bygg(side, bunn, valgt, bredde):
    dybde = side.count("/")
    r = "../" * dybde
    forside = side == "index.html"
    om = "#om" if forside else r + "index.html#om"
    kontakt = "#kontakt" if forside else r + "index.html#kontakt"
    cur = ' aria-current="page"'
    engelsk = side.startswith("personvern/en/")
    meny = (les("meny-en" if engelsk else "meny").replace("{R}", r).replace("{OM}", om).replace("{KONTAKT}", kontakt)
            .replace("{CUR_APPER}", cur if valgt == "apper" else "")
            .replace("{CUR_HJELP}", cur if valgt == "hjelp" else ""))
    sti = os.path.join(ROT, side)
    with open(sti, encoding="utf-8") as f:
        s = f.read()
    s = bytt(s, "logo",  r'<a class="brand"[^>]*><svg.*?</svg></a>', les("logo").replace("{R}", r))
    s = bytt(s, "meny",  r'<nav(?: aria-label="Hovedmeny")?>.*?</nav>', meny)
    if bunn:
        s = bytt(s, "bunn",  r'<footer.*?</footer>', les(bunn).replace("{R}", r))
    if side in ELDRE:
        blokk = "<!--rg:menystil-->" + les("meny-stil") + "<!--/rg:menystil-->"
        m = re.search(r"<!--rg:menystil-->.*?<!--/rg:menystil-->", s, flags=re.S)
        if m:
            s = s[:m.start()] + blokk + s[m.end():]
        else:
            if s.count("</head>") != 1:
                sys.exit("Fant ikke </head> i " + side)
            s = s.replace("</head>", blokk + "\n</head>")
    if bredde:
        blokk = "<!--rg:bredde-->" + les("bredde") + "<!--/rg:bredde-->"
        m = re.search(r"<!--rg:bredde-->.*?<!--/rg:bredde-->", s, flags=re.S)
        if m:
            s = s[:m.start()] + blokk + s[m.end():]
        else:
            if s.count("</head>") != 1:
                sys.exit("Fant ikke </head> i " + side)
            s = s.replace("</head>", blokk + "\n</head>")
    with open(sti, "w", encoding="utf-8", newline="") as f:
        f.write(s)
    print("ok", side)

if __name__ == "__main__":
    for side, (bunn, valgt, bredde) in SIDER.items():
        bygg(side, bunn, valgt, bredde)
