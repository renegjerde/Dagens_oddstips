# Dagens oddstips — MVP 0.1

Fresh-start prototype. No previous project code has been reused.

## What works
- Imports a CSV containing upcoming football matches, Norsk Tipping 1X2 decimal odds, and home/away goals-for/goals-against averages.
- Estimates home/draw/away probabilities with a deliberately simple independent Poisson goals model.
- Calculates estimated expected value (`probability × decimal odds − 1`), ranks matches, and exports analysis as CSV.
- Includes clearly labeled fictional demo data to test the interface.

## CSV format
Required headers (comma-separated):

`date,league,home,away,odds_home,odds_draw,odds_away,home_gf,home_ga,away_gf,away_ga`

- `odds_home`, `odds_draw`, `odds_away`: current decimal 1X2 odds.
- `home_gf`, `home_ga`: home team's average goals scored/conceded per home match.
- `away_gf`, `away_ga`: away team's average goals scored/conceded per away match.
- Dates/league names are labels; this prototype does not validate event identity or kickoff time.

## Run
Open `index.html` in a modern browser. It is a static app; no install, server, account or API key required for this CSV-based MVP.

## Known limitations / next steps
- No live API integration yet. Research has not confirmed a public, official Norsk Tipping developer API for Oddsen. A third-party wrapper is advertised but must be tested for uptime, terms, coverage, freshness, and cost before adoption.
- Stats source must be chosen and its competition coverage verified. football-data.org documents match/competition APIs but free access is limited by tier and competition.
- The Poisson model is a baseline only: it does not adjust for team strength across leagues, injuries, lineups, red cards, correlated goals, odds margin, or recency weighting. It should not be treated as a proven profitable betting system.
- Before live use: build a data adapter, validate event matching, store timestamped odds, backtest on historical data, evaluate calibration and closing-line movement, and only then consider daily automated refresh.
