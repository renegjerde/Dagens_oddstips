# Dagens oddstips — MVP v0.4

Versjon 0.4 forbedrer tilkoblingsfeil og støtter frontend på GitHub Pages med separat backend-URL.

## Viktig: GitHub Pages kjører ikke Node.js
Hvis du publiserer `index.html` på `renegjerde.github.io`, er det bare statiske filer som blir servert. Node-serveren i `server.js` kjører ikke på GitHub Pages. Derfor gir `/api/odds/tournaments` 404 når frontend prøver å kontakte en API-rute på GitHub Pages.

## Lokal kjøring
1. Installer Node.js 20.6 eller nyere.
2. Kopier `.env.example` til `.env` og legg inn `PARSE_API_KEY` og `FOOTBALL_DATA_TOKEN`.
3. Kjør `npm start` i denne mappen.
4. Åpne http://localhost:3000. Backend-URL-feltet kan stå tomt.

## Publisering
1. Host `server.js` på en Node-kompatibel tjeneste (for eksempel Render eller Railway) og sett miljøvariablene i hostens private settings.
2. Bruk HTTPS og sett tilgangskontroll/rate limiting før offentlig bruk.
3. Åpne frontend på GitHub Pages og fyll inn backendens offentlige HTTPS-URL i «Backend URL».
4. Backend må tillate CORS fra GitHub Pages-origin. Den medfølgende serveren er et lokalt utgangspunkt og trenger CORS-konfigurasjon før separat frontend kan kalle den fra nettleseren.

## API-kilder
- Odds: Parse sin uoffisielle Norsk Tipping-integrasjon.
- Statistikk: football-data.org.

## Begrensninger
- API-tilgang og responsformat må verifiseres med gyldige nøkler.
- Kampmatching og Poisson-modellen er foreløpige; ingen lønnsomhet er dokumentert.
- Ikke legg API-nøkler i frontend eller i et offentlig GitHub-repository.
