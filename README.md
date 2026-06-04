# Konferencijos programa

Statinis konferencijos aplikacijos prototipas lietuvių kalba.

## Funkcijos

- Dalyvis mato konferencijos programą, pranešimų aprašymus ir pranešėjus.
- Dalyvis gali užduoti klausimą pranešėjui prieš pranešimą arba po jo.
- Dalyvis mato partnerių sąrašą ir informaciją, kurie partneriai turi stendus konferencijoje.
- Dalyvis gali rezervuoti partnerio susitikimo laiką 10 minučių fragmentais ir pasirinkti kelis fragmentus.
- Dalyvis gali užduoti klausimus partneriams.
- Pranešėjas mato jam užduotus klausimus ir atsakymus.
- Partneris mato laiko rezervacijas, gali į jas atsakyti, taip pat mato klausimus.
- Moderatorius mato visus klausimus ir atsakymus vienoje vietoje.

## Kaip pamatyti aplikaciją, jei esate naujas programuotojas

Ši aplikacija yra paprastas statinis puslapis. Tai reiškia, kad nėra prisijungimų, serverio ar duomenų bazės. Yra tik trys svarbiausi failai:

- `index.html` – pagrindinis puslapis, kurį atidaro naršyklė.
- `styles.css` – spalvos, išdėstymas ir dizainas.
- `app.js` – mygtukų, klausimų ir rezervacijų veikimas naršyklėje.

### Svarbiausias dalykas

Negalite stebuklingai atidaryti `index.html` iš mano kompiuterio ar iš šios kūrimo aplinkos. Kad jį pamatytumėte savo naršyklėje, reikia vieno iš šių dviejų dalykų:

1. atsisiųsti projekto failus į savo kompiuterį ir atidaryti `index.html`; arba
2. įkelti projektą į hostingą, kad jis turėtų viešą interneto nuorodą.

### 1 būdas: atidaryti savo kompiuteryje

Tai paprasčiausias būdas, jei turite projekto failus.

1. Atsisiųskite arba nukopijuokite visą projektą į savo kompiuterį.
2. Atidarykite projekto aplanką.
3. Suraskite failą `index.html`.
4. Du kartus paspauskite `index.html`.
5. Jis turėtų atsidaryti jūsų naršyklėje, pvz. Chrome, Edge, Firefox arba Safari.

Jei matote puslapį su konferencijos programa, partneriais ir klausimų formomis – viskas veikia.

### 2 būdas: paleisti lokalų serverį

Šis būdas šiek tiek panašesnis į tikrą svetainės paleidimą, bet vis dar veikia tik jūsų kompiuteryje.

1. Atidarykite terminalą projekto aplanke.
2. Paleiskite komandą:

```bash
python3 -m http.server 8000
```

3. Naršyklėje atidarykite:

```text
http://localhost:8000
```

`localhost` reiškia „mano kompiuteris“. Kiti žmonės šios nuorodos nematys, nes ji veikia tik pas jus.

## Ar galima atidaryti be atsisiuntimo?

Taip, bet tik tada, jei projektas yra kažkur hostinamas. Kitaip tariant, failai turi būti įkelti į internetą ir gauti viešą nuorodą, pvz.:

```text
https://jusu-vardas.github.io/konferencijos-programa/
```

Kol tokios viešos nuorodos nėra, naršyklė neturi iš kur paimti `index.html`, `styles.css` ir `app.js` failų.

## Ar galiu aš ją hostinti už jus?

Iš šios aplinkos negaliu sukurti ilgalaikės viešos hostingo nuorodos. Galiu paruošti failus ir instrukcijas, bet realų hostingą reikia padaryti jūsų paskyroje, pvz. GitHub, Netlify, Vercel arba Cloudflare Pages.

Kadangi projektas susideda tik iš `index.html`, `styles.css` ir `app.js`, jį galima hostinti bet kurioje statinių puslapių platformoje:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- bet kuriame paprastame web serveryje, kuris gali pateikti statinius failus

### Paprasčiausias hostingo variantas: GitHub Pages

Jei projektas yra GitHub repozitorijoje:

1. Atidarykite repozitoriją GitHub svetainėje.
2. Eikite į **Settings**.
3. Kairėje pasirinkite **Pages**.
4. Prie **Branch** pasirinkite šaką, kurioje yra šie failai, pvz. `main`.
5. Pasirinkite aplanką `/root`, jei `index.html` yra pagrindiniame projekto aplanke.
6. Paspauskite **Save**.
7. Po kelių minučių GitHub parodys viešą nuorodą.

Tada tą nuorodą galėsite siųsti kitiems žmonėms.
