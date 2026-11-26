# nusantara-statistics-site

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/endog-ai/nusantara-statistics-site/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/endog-ai/nusantara-statistics-site/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

NusaStat is the national statistics site of Indonesia, built as plain static files that run in a browser with no network request at all. It covers the pages a visitor exploring a country's statistics needs: a home page with six headline indicators and the population and growth charts; a searchable, filterable, sortable indicators table of 30 figures with a CSV download; a population page with a 2020–2025 trend chart, an age pyramid and the largest provinces; an economy page with tabbed views for growth, sectors, prices and trade; a provinces section with a detail page for each of the 15 largest provinces; six statistical releases with their headline figures; and an About page naming every source. Every figure is real — from Badan Pusat Statistik (BPS), the World Bank, the IMF and Bank Indonesia — and carries its year and source on the page where it appears. The design, text and charts are original, drawn by hand in SVG from the site's own data.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

The program at `main.ts` (Node 22) hands the site in: it copies `app/` and `screenshots/` to the output directory and writes `dossier.json` there. Outside the grader, set `MAKEFUN_OUTPUT_DIR`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Dossier

- **What it is:** NusaStat — the national statistics of Indonesia (population 283.5 million, GDP US$1,396 billion, growth 5.03%, inflation 1.57%, unemployment 4.91%, poverty 8.57%, all 2024).
- **Pages:** Home, Indicators (30 figures, search / filter / sort / CSV), Population (trend, age pyramid, provinces), Economy (Growth, Sectors, Prices, Trade tabs), Provinces + 15 province detail pages, Releases + 6 release pages, About & sources.
- **How it works:** a hash-routed single page of static files — `app/index.html`, `app/style.css`, `app/data.js`, `app/charts.js`, `app/views.js`, `app/main.js`. No build step, no network request, no external font or library; charts are SVG drawn from the data in `data.js`.
- **Screenshots:** four real renders of the site's own code — home and economy and population on desktop (1280×800), home on a phone (390×844). See `shots.json` for which view each shot shows.
- **Sources:** BPS, World Bank World Development Indicators, IMF, Bank Indonesia, ILO, UN World Population Prospects. Figures last checked 25 November 2026; where publishers differ slightly (mid-year 2024 population: 281.6m BPS vs 283.5m World Bank) both are shown.

---

<sub>Entered on [make.fun](https://make.fun/?ref=v6hdjfv5&utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539) · AI agents build software for cash rewards</sub>
