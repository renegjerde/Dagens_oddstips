# Dagens oddstips — MVP 0.2

Dette er en ny, separat prototype. Den gjenbruker ikke kode fra det tidligere oddstipsprosjektet.

## Nytt i v0.2
- Tilkobling til en tredjeparts Parse-integrasjon som oppgir Norsk Tipping fotball 1X2-prematchodds.
- Henting av turneringsoversikt og odds fra valgt turnering.
- Tilkobling til football-data.org for historiske, fullførte kamper innen valgt konkurranse/periode.
- Enkel lagstatistikkbasert Poisson-baseline og forventet verdi (EV).
- CSV-eksport og tydelig oppdiktet demo-modus.
- API-nøkler lagres ikke; de finnes kun i sidens minne mens siden er åpen.

## Slik kjører du
Åpne `index.html` i en moderne nettleser. Bruk HTTPS eller en lokal webserver hvis nettleseren/API-et krever det.

## Datakilder
- Odds: Parse-integrasjon dokumentert på https://parse.bot/marketplace/7caef9ed-2972-47a8-bc1c-571e0efd9bc2/norsk-tipping-no-api
  - Dette er IKKE Norsk Tippings offisielle API.
  - Krever egen Parse API-nøkkel i `X-API-Key`.
  - Dokumentert som forhåndsodds, 1X2. Sjekk dekning, kostnad, vilkår og responsformat før du stoler på det.
- Statistikk: https://www.football-data.org/
  - Krever egen token i `X-Auth-Token`.
  - Gratisnivået har begrenset konkurransedekning og begrensninger.
  - Vis attribusjonen «Data provided by football-data.org» hvis data brukes.

## Viktige begrensninger
- Nettleserens `fetch` kan bli blokkert av CORS eller leverandørens tilgangsregler. Dette er synliggjort som en tilkoblingsfeil; ingen omgåelse forsøkes.
- Ikke legg hemmelige API-nøkler inn på en offentlig publisert side. En produksjonsversjon bør ha en liten backend/proxy som beskytter nøkler og håndterer caching.
- Odds-integrasjonen og statistikk-API bruker forskjellige konkurransenavn og lagnavn. Automatisk lagmatching er omtrentlig. Denne prototypen analyserer bare kamper hvor begge lag matcher statistikk fra den valgte konkurransen.
- Statskilden kan ikke nødvendigvis dekke alle turneringer som oddsleverandøren tilbyr. Velg en relevant konkurranse i statistikkdelen.
- Poisson-modellen er en grov baseline og er ikke dokumentert lønnsom. Ingen innsats plasseres. Ingen tips bør behandles som sikre.
- Demo-kamper og demo-historikk er oppdiktet og må aldri forveksles med reelle odds.

## Neste steg
1. Test Parse API-nøkkel og se om turneringer/odds kan hentes fra nettleseren.
2. Test football-data.org-token og konkurransedekning.
3. Verifiser navn/ID-matching for lag og turneringer.
4. Flytt nøkler og datahenting til en backend hvis løsningen skal publiseres.
5. Lagre tidsstemplet odds og evaluer modellens kalibrering og historiske resultater før daglig bruk.
