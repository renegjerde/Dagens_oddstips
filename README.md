# Dagens oddstips — MVP v0.3

Ny, separat prototype for fotball og 1X2. Ingen tidligere prosjektkode er gjenbrukt.

## Hva er nytt
- Node.js-backend som videresender odds- og statistikkforespørsler.
- API-nøkler ligger server-side i `.env`, ikke i nettleseren.
- Enkle 60-sekunders cachede svar for å unngå unødvendige API-kall.
- Validering av parametere og tidsavbrudd på API-kall.
- Fortsatt støtte for Poisson-baseline, demo-data og CSV-eksport.

## Kjør lokalt
Krever Node.js 20.6 eller nyere.

1. Pakk ut `oddstips_mvp_v03.zip`.
2. Kopier `.env.example` til `.env`.
3. Legg inn egne nøkler i `.env`:
   - `PARSE_API_KEY` fra Parse sin Norsk Tipping-integrasjon.
   - `FOOTBALL_DATA_TOKEN` fra football-data.org.
4. Åpne terminal i prosjektmappen og kjør `npm install` (ingen eksterne pakker brukes, men kommandoen er ufarlig).
5. Kjør `npm start`.
6. Åpne `http://localhost:3000`.

Ikke åpne `index.html` direkte i filsystemet; den bruker `/api/...`-endepunkter på den lokale serveren.

## Datakilder og begrensninger
- Odds: Parse sin tredjepartsintegrasjon for Norsk Tipping Oddsen, ikke et offisielt Norsk Tipping API. https://parse.bot/marketplace/7caef9ed-2972-47a8-bc1c-571e0efd9bc2/norsk-tipping-no-api
- Statistikk: football-data.org API. https://www.football-data.org/documentation/api
- Tilgang, vilkår, konkurransedekning, kostnader og faktiske svar må verifiseres med brukerens nøkler.
- Den lokale serveren beskytter nøkler fra nettleseren, men er ikke en produksjonsserver for offentlig eksponering. Ikke åpne porten mot internett uten tilgangskontroll, HTTPS og rate limiting.
- Lagmatching er omtrentlig. Modellen analyserer kun lag som finnes i statistikkmaterialet som er lastet inn. Odds fra mange internasjonale turneringer kan ikke matches automatisk til en annen konkurranses historikk.
- Poisson-beregningen er en enkel baseline, ikke et dokumentert lønnsomt system. Den modellerer mål ut fra enkel gjennomsnittsstatistikk; den tar ikke høyde for alle relevante faktorer. Test kalibrering og historisk avkastning før du stoler på tips.
- Demo-data er oppdiktet.

## Feilsøking
- `/api/health` viser om begge nøkler er konfigurert.
- Hvis odds-kall feiler, kontroller Parse-nøkkel, API-tilgang, kreditter og leverandørens responsformat.
- Hvis statistikk-kall feiler, kontroller token og om konkurransen er tilgjengelig på abonnementet.
