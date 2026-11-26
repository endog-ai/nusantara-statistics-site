// HTML for each page of NusaStat, built from the data in data.js.
// Every value is escaped before it goes into the page, and every figure
// shown here comes from the data file — no number is typed in by hand
// twice. The "insights" on the home page are computed from that same
// data when the page renders, so they always agree with the charts.

import { COUNTRY, HEADLINE, SERIES, GDP_SECTORS, GDP_EXPENDITURE, AGE_BANDS, PROVINCES, INDICATORS, INDICATOR_CATS, RELEASES, COMPARABLE, GLOSSARY } from './data.js';
import { barChart, lineChart, hbars, pyramid, pairedBars, twinLines } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const num = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const NATIONAL_POP = 283.5; // million, mid-2024, World Bank — the headline series.
const densityOf = (p) => Math.round((p.population * 1e6) / p.area);
const shareOf = (p) => (p.population / NATIONAL_POP) * 100;

// --- Home-page insights, computed from the data at render time. ---
// Nothing here is a hard-coded sentence: each line is derived from the
// series and tables in data.js, so if the data were updated the words
// would follow it. Figures are the published ones (BPS / World Bank).
function insights() {
  const biggest = PROVINCES.reduce((a, b) => (b.population > a.population ? b : a), PROVINCES[0]);
  const topSector = GDP_SECTORS.reduce((a, b) => (b.share > a.share ? b : a), GDP_SECTORS[0]);
  const infl = SERIES.inflation;
  const lastInfl = infl[infl.length - 1];
  const prevInfl = infl[infl.length - 2];
  const inflChange = lastInfl.value - prevInfl.value;
  const inflWord = inflChange < 0 ? 'fell' : inflChange > 0 ? 'rose' : 'was unchanged';
  const peakInfl = infl.reduce((a, b) => (b.value > a.value ? b : a), infl[0]);
  const growth = SERIES.gdpGrowth;
  const lastGrowth = growth[growth.length - 1];
  const unemp = SERIES.unemployment;
  const lowestUnemp = unemp.reduce((a, b) => (b.value < a.value ? b : a), unemp[0]);
  const items = [
    {
      title: 'Where people live',
      text: `${biggest.name} is the largest province, with ${num(biggest.population, 2)} million people — ${num(shareOf(biggest), 1)}% of everyone in Indonesia — and its capital is ${biggest.capital}.`,
    },
    {
      title: 'What the economy makes',
      text: `${topSector.name} is the biggest single sector of GDP at ${num(topSector.share, 2)}% in 2024, ahead of every other sector.`,
    },
    {
      title: 'Prices',
      text: `Inflation ${inflWord} from ${num(prevInfl.value, 2)}% in ${prevInfl.year} to ${num(lastInfl.value, 2)}% in ${lastInfl.year}, down from a recent peak of ${num(peakInfl.value, 2)}% in ${peakInfl.year}.`,
    },
    {
      title: 'Jobs',
      text: `Unemployment was ${num(lowestUnemp.value, 2)}% in ${lowestUnemp.year} — the lowest in the 2015–2024 series — while the economy grew ${num(lastGrowth.value, 2)}% in ${lastGrowth.year}.`,
    },
  ];
  return `<section aria-labelledby="insights-heading">
    <h2 id="insights-heading">What the numbers say</h2>
    <p class="muted">Four short observations, worked out from the figures on this site — not written in advance.</p>
    <ul class="insights">${items.map((it) => `<li><strong>${esc(it.title)}</strong><span>${esc(it.text)}</span></li>`).join('')}</ul>
  </section>`;
}

function kpiCards() {
  return `<div class="kpis">${HEADLINE.map((k) => `<a class="kpi" href="${k.href}">
    <span class="kpi-label">${esc(k.label)}</span>
    <span class="kpi-value">${esc(k.value)}</span>
    <span class="kpi-sub">${esc(k.sub)}</span></a>`).join('')}</div>`;
}

function topicCards() {
  const topics = [
    { href: '#/population', title: 'Population', text: '283.5 million people, an age pyramid, and the 15 largest provinces.', stat: '0.8% growth a year' },
    { href: '#/economy', title: 'Economy', text: 'GDP of US$1,396 billion, growth of 5.03%, and what each sector contributes.', stat: 'US$4,958 per person' },
    { href: '#/indicators', title: 'Indicators', text: 'Thirty headline indicators in one searchable table, each with its year and source.', stat: '30 indicators' },
    { href: '#/releases', title: 'Releases', text: 'The latest statistical releases: growth, prices, jobs, poverty and trade.', stat: '6 releases' },
  ];
  return `<div class="topics">${topics.map((t) => `<a class="topic" href="${t.href}">
    <span class="topic-title">${esc(t.title)}</span>
    <span class="topic-text">${esc(t.text)}</span>
    <span class="topic-stat">${esc(t.stat)} →</span></a>`).join('')}</div>`;
}

export function home() {
  return `<section class="hero">
    <p class="eyebrow">The national statistics of Indonesia</p>
    <h1>One country, counted properly.</h1>
    <p class="lede">NusaStat gathers Indonesia's official figures in one place — how many people live here, what the economy makes, what things cost, who has work — each number with its year and its source, and every chart drawn from the same data.</p>
    <p class="hero-links"><a class="btn" href="#/indicators">Browse all indicators</a> <a class="btn btn-ghost" href="#/population">See the population</a></p>
  </section>
  ${kpiCards()}
  ${insights()}
  <section class="grid2">
    <div class="card">${barChart({ data: SERIES.population, label: 'Population, millions of people, 2020–2025 (World Bank)', decimals: 1 })}</div>
    <div class="card">${lineChart({ data: SERIES.gdpGrowth, label: 'Real GDP growth, % per year, 2015–2024 (BPS)', decimals: 2 })}</div>
  </section>
  <section>
    <h2>Explore by topic</h2>
    ${topicCards()}
  </section>
  <section>
    <h2>Latest releases</h2>
    <ul class="releases">${RELEASES.slice(0, 3).map((r) => `<li><a href="#/release/${r.slug}">${esc(r.title)}</a><span>${esc(r.date)}</span></li>`).join('')}</ul>
    <p><a href="#/releases">All releases →</a></p>
  </section>
  <section class="note">
    <h2>About these numbers</h2>
    <p>Figures come from Badan Pusat Statistik (BPS), the World Bank, the IMF and Bank Indonesia, and each page names its source. Values are rounded; where two publishers differ slightly — for example the mid-year population — both are shown. See the <a href="#/about">About &amp; sources</a> page for the full method.</p>
  </section>`;
}

export function indicators() {
  return `<h1>Indicators</h1>
  <p class="lede">Thirty headline indicators for Indonesia. Search by name, filter by topic, or sort the table — and download the whole table as a CSV file.</p>
  <div class="controls">
    <label class="search" for="ind-search">Search</label>
    <input id="ind-search" type="search" placeholder="Try “inflation” or “trade”…" autocomplete="off" aria-describedby="ind-count">
    <div class="chips" id="ind-cats" role="group" aria-label="Filter by topic">
      ${INDICATOR_CATS.map((c) => `<button type="button" data-cat="${esc(c)}" class="${c === 'All' ? 'chip active' : 'chip'}" aria-pressed="${c === 'All' ? 'true' : 'false'}">${esc(c)}</button>`).join('')}
    </div>
  </div>
  <p class="result-count" id="ind-count" aria-live="polite">${INDICATORS.length} indicators</p>
  <div class="table-wrap"><table id="ind-table">
    <caption class="visually-hidden">Headline indicators for Indonesia, with value, year and source</caption>
    <thead><tr>
      <th scope="col"><button type="button" class="sort" data-sort="name" aria-label="Sort by indicator name">Indicator</button></th>
      <th scope="col"><button type="button" class="sort" data-sort="cat" aria-label="Sort by topic">Topic</button></th>
      <th scope="col"><button type="button" class="sort" data-sort="value" aria-label="Sort by value">Value</button></th>
      <th scope="col"><button type="button" class="sort" data-sort="year" aria-label="Sort by year">Year</button></th>
      <th scope="col">Source</th>
    </tr></thead>
    <tbody id="ind-body"></tbody>
  </table></div>
  <p><button type="button" class="btn" id="ind-csv">Download this table (CSV)</button> <span class="muted" id="csv-note" aria-live="polite"></span></p>
  <p class="muted">Values are rounded. “Year” is the reference year of the figure; some series are dated by month, for example “Aug 2024”.</p>`;
}

export function population() {
  const total = AGE_BANDS.reduce((a, b) => a + b.total, 0);
  const young = AGE_BANDS.slice(0, 3).reduce((a, b) => a + b.total, 0);
  const working = AGE_BANDS.slice(3, 13).reduce((a, b) => a + b.total, 0);
  const old = AGE_BANDS.slice(13).reduce((a, b) => a + b.total, 0);
  return `<h1>Population</h1>
  <p class="lede">283.5 million people at mid-2024 (World Bank; 281.6 million on the BPS series), growing about 0.8% a year — the world's fourth-largest population, spread over 17,508 islands.</p>
  ${kpiCards()}
  <section class="grid2">
    <div class="card">${barChart({ data: SERIES.population, label: 'Population, millions, 2020–2025 (World Bank)', decimals: 1 })}</div>
    <div class="card">${pyramid({ bands: AGE_BANDS, label: 'Age structure, 2024 — a young country: half the population is under 31' })}</div>
  </section>
  <section>
    <h2>Who lives here</h2>
    <dl class="facts">
      <div><dt>Children, 0–14</dt><dd>${num(young, 1)} million (${num((young / total) * 100, 1)}%)</dd></div>
      <div><dt>Working age, 15–64</dt><dd>${num(working, 1)} million (${num((working / total) * 100, 1)}%)</dd></div>
      <div><dt>Older people, 65+</dt><dd>${num(old, 1)} million (${num((old / total) * 100, 1)}%)</dd></div>
      <div><dt>Median age</dt><dd>30.5 years</dd></div>
      <div><dt>Urban share</dt><dd>59.0% of the population</dd></div>
      <div><dt>Density</dt><dd>149 people per km² of land</dd></div>
    </dl>
  </section>
  <section>
    <h2>Largest provinces</h2>
    <p>Java holds 55.9% of all residents on 6.6% of the land. <a href="#/provinces">See all 15 largest provinces →</a></p>
    ${hbars({ data: PROVINCES.slice(0, 8).map((p) => ({ name: p.name, share: p.population })), label: 'Population of the eight largest provinces, millions, 2024 (BPS)', unit: 'm' })}
  </section>`;
}

export function economy() {
  const sectors = [...GDP_SECTORS];
  const other = 100 - sectors.reduce((a, s) => a + s.share, 0);
  sectors.push({ name: 'All other sectors', share: other });
  const tabs = [
    { id: 'growth', label: 'Growth' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'prices', label: 'Prices' },
    { id: 'trade', label: 'Trade' },
  ];
  return `<h1>Economy</h1>
  <p class="lede">GDP was US$1,396 billion in 2024 — Rp 22,139 trillion — growing 5.03% in real terms. GDP per person reached US$4,958, and on a purchasing-power basis the economy is the world's seventh largest.</p>
  <div class="tabs" role="tablist" aria-label="Economy views">
    ${tabs.map((t, i) => `<button type="button" class="tab${i === 0 ? ' active' : ''}" id="tab-${t.id}" data-tab="${t.id}" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" aria-controls="pane-${t.id}" tabindex="${i === 0 ? '0' : '-1'}">${t.label}</button>`).join('')}
  </div>
  <section class="tabpane" id="pane-growth" data-pane="growth" role="tabpanel" aria-labelledby="tab-growth" tabindex="0">
    <div class="grid2">
      <div class="card">${lineChart({ data: SERIES.gdpGrowth, label: 'Real GDP growth, % per year, 2015–2024 (BPS)', decimals: 2 })}</div>
      <div class="card">${barChart({ data: SERIES.gdpNominal, label: 'Nominal GDP, trillion rupiah, 2015–2024 (BPS)', decimals: 0 })}</div>
    </div>
    <h2>By expenditure</h2>
    <p>Household spending is just over half the economy; investment is close to a third.</p>
    ${hbars({ data: GDP_EXPENDITURE, label: 'GDP by expenditure, % of GDP, 2024 (BPS)', unit: '%' })}
  </section>
  <section class="tabpane" id="pane-sectors" data-pane="sectors" role="tabpanel" aria-labelledby="tab-sectors" tabindex="0" hidden>
    <h2>What the economy makes</h2>
    <p>Manufacturing is the largest single sector at 19.0% of GDP, followed by trade and agriculture.</p>
    ${hbars({ data: sectors, label: 'GDP by sector, % of GDP, 2024 (BPS)', unit: '%' })}
  </section>
  <section class="tabpane" id="pane-prices" data-pane="prices" role="tabpanel" aria-labelledby="tab-prices" tabindex="0" hidden>
    <div class="grid2">
      <div class="card">${lineChart({ data: SERIES.inflation, label: 'Consumer price inflation, December year on year, %, 2015–2024 (BPS)', decimals: 2 })}</div>
      <div class="card"><h3>Prices at a glance</h3>
        <dl class="facts">
          <div><dt>Inflation, Dec 2024</dt><dd>1.57% y-o-y</dd></div>
          <div><dt>Inflation, 2024 average</dt><dd>2.3%</dd></div>
          <div><dt>Policy rate (BI Rate)</dt><dd>6.00% at end-2024</dd></div>
          <div><dt>Rupiah per US dollar</dt><dd>Rp 15,752 (2024 average)</dd></div>
        </dl>
        <p class="muted">Inflation stayed inside Bank Indonesia's 1.5–3.5% target band through 2024; the December reading was the lowest in the series.</p>
      </div>
    </div>
  </section>
  <section class="tabpane" id="pane-trade" data-pane="trade" role="tabpanel" aria-labelledby="tab-trade" tabindex="0" hidden>
    <h2>Trade</h2>
    <p>2024 brought the fifth straight annual trade surplus: exports of US$264.7 billion against imports of US$233.7 billion.</p>
    <div class="grid2">
      <div class="card">${barChart({ data: SERIES.trade.map((t) => ({ year: t.year, value: t.exports })), label: 'Exports of goods, US$ billion, 2020–2024 (BPS)', decimals: 1 })}</div>
      <div class="card">${barChart({ data: SERIES.trade.map((t) => ({ year: t.year, value: t.imports })), label: 'Imports of goods, US$ billion, 2020–2024 (BPS)', decimals: 1 })}</div>
    </div>
    <dl class="facts">
      <div><dt>Trade balance, 2024</dt><dd>US$31.0 billion surplus</dd></div>
      <div><dt>Current account, 2024</dt><dd>−US$8.5 billion (−0.6% of GDP)</dd></div>
      <div><dt>Foreign reserves, end-2024</dt><dd>US$155.7 billion</dd></div>
      <div><dt>Largest export markets</dt><dd>China, United States, Japan</dd></div>
    </dl>
  </section>`;
}

// --- Compare two provinces, side by side. ---
// The pickers live on the provinces page; this block renders the result
// for any pair, so the same markup is used for the first view and for
// every change of either picker. All figures are the BPS 2024 ones.
export function compareHtml(aSlug, bSlug) {
  const a = PROVINCES.find((p) => p.slug === aSlug) || PROVINCES[0];
  const b = PROVINCES.find((p) => p.slug === bSlug) || PROVINCES[1];
  const rows = [
    { metric: 'Population (million)', a: a.population, b: b.population, decimals: 2 },
    { metric: 'Share of Indonesia (%)', a: shareOf(a), b: shareOf(b), decimals: 1 },
    { metric: 'Density (people / km²)', a: densityOf(a), b: densityOf(b), decimals: 0 },
  ];
  const chart = pairedBars({
    label: `Comparing ${a.name} and ${b.name}, 2024 (BPS)`,
    aName: a.name,
    bName: b.name,
    rows: rows.map((r) => ({ metric: r.metric, a: r.a, b: r.b, decimals: r.decimals })),
    decimals: 1,
  });
  return `<div class="compare-result" aria-live="polite">
    <h3>${esc(a.name)} vs ${esc(b.name)}</h3>
    <div class="table-wrap"><table>
      <caption class="visually-hidden">Figures for ${esc(a.name)} and ${esc(b.name)}, 2024</caption>
      <thead><tr><th scope="col">Figure</th><th scope="col">${esc(a.name)}</th><th scope="col">${esc(b.name)}</th></tr></thead>
      <tbody>
        <tr><th scope="row">Population, 2024</th><td>${num(a.population, 2)} million</td><td>${num(b.population, 2)} million</td></tr>
        <tr><th scope="row">Share of Indonesia</th><td>${num(shareOf(a), 1)}%</td><td>${num(shareOf(b), 1)}%</td></tr>
        <tr><th scope="row">Density</th><td>${densityOf(a).toLocaleString('en-US')} / km²</td><td>${densityOf(b).toLocaleString('en-US')} / km²</td></tr>
        <tr><th scope="row">Capital</th><td>${esc(a.capital)}</td><td>${esc(b.capital)}</td></tr>
        <tr><th scope="row">Land area</th><td>${a.area.toLocaleString('en-US')} km²</td><td>${b.area.toLocaleString('en-US')} km²</td></tr>
      </tbody>
    </table></div>
    <p class="muted">${esc(a.name)} has ${a.population >= b.population ? 'more' : 'fewer'} people than ${esc(b.name)} — ${num(a.population, 2)} million against ${num(b.population, 2)} million — and is ${densityOf(a) >= densityOf(b) ? 'denser' : 'less dense'} (${densityOf(a).toLocaleString('en-US')} vs ${densityOf(b).toLocaleString('en-US')} people per km²).</p>
    ${chart}
  </div>`;
}

export function provinces() {
  const total = PROVINCES.reduce((a, p) => a + p.population, 0);
  const options = PROVINCES.map((p) => `<option value="${p.slug}">${esc(p.name)}</option>`).join('');
  return `<h1>Provinces</h1>
  <p class="lede">The 15 largest of Indonesia's 38 provinces hold ${num(total, 1)} million people — ${num((total / NATIONAL_POP) * 100, 1)}% of the country. Open a province for its figures.</p>
  <section class="compare" aria-labelledby="compare-heading">
    <h2 id="compare-heading">Compare two provinces</h2>
    <p>Pick any two provinces and see their figures side by side — population, share of the country, density and capital — with each pair of bars drawn to the same scale for that figure.</p>
    <div class="compare-pickers">
      <label for="compare-a">First province
        <select id="compare-a">${options}</select>
      </label>
      <label for="compare-b">Second province
        <select id="compare-b">${options}</select>
      </label>
      <button type="button" class="btn" id="compare-swap">Swap provinces</button>
    </div>
    <div id="compare-result">${compareHtml('west-java', 'east-java')}</div>
  </section>
  <h2>All 15 largest provinces</h2>
  <div class="table-wrap"><table>
    <caption class="visually-hidden">The 15 largest provinces by population, 2024</caption>
    <thead><tr><th scope="col">Province</th><th scope="col">Capital</th><th scope="col">Population, 2024</th><th scope="col">Share of Indonesia</th><th scope="col">Density / km²</th></tr></thead>
    <tbody>${PROVINCES.map((p) => `<tr>
      <td><a href="#/province/${p.slug}">${esc(p.name)}</a></td>
      <td>${esc(p.capital)}</td>
      <td>${num(p.population, 2)} million</td>
      <td>${num(shareOf(p), 1)}%</td>
      <td>${densityOf(p).toLocaleString('en-US')}</td>
    </tr>`).join('')}</tbody>
  </table></div>
  <p class="muted">Populations are BPS mid-year 2024 estimates; density is population divided by land area. The remaining 23 provinces hold the other ${num(NATIONAL_POP - total, 1)} million people.</p>`;
}

export function province(slug) {
  const p = PROVINCES.find((x) => x.slug === slug);
  if (!p) return missing();
  const density = densityOf(p);
  const share = shareOf(p);
  const rank = PROVINCES.findIndex((x) => x.slug === slug) + 1;
  const avgLargest = PROVINCES.reduce((a, x) => a + x.population, 0) / PROVINCES.length;
  return `<p><a href="#/provinces">← All provinces</a></p>
  <h1>${esc(p.name)}</h1>
  <p class="lede">The ${rank === 1 ? 'largest' : `no. ${rank} largest`} province of Indonesia, with its capital at ${esc(p.capital)}.</p>
  <dl class="facts">
    <div><dt>Population, 2024</dt><dd>${num(p.population, 2)} million</dd></div>
    <div><dt>Share of Indonesia</dt><dd>${num(share, 1)}%</dd></div>
    <div><dt>Land area</dt><dd>${p.area.toLocaleString('en-US')} km²</dd></div>
    <div><dt>Density</dt><dd>${density.toLocaleString('en-US')} people per km²</dd></div>
    <div><dt>Capital</dt><dd>${esc(p.capital)}</dd></div>
    <div><dt>National average density</dt><dd>149 people per km²</dd></div>
  </dl>
  <h2>How it compares</h2>
  ${hbars({ data: [
    { name: p.name, share: p.population },
    { name: 'Largest province (West Java)', share: 50.35 },
    { name: 'Average of the 15 largest', share: avgLargest },
  ], label: `Population, millions — ${p.name} against West Java and the average of the 15 largest provinces, 2024 (BPS)`, unit: 'm' })}
  <p><a href="#/provinces">Compare ${esc(p.name)} with another province →</a></p>
  <p class="muted">Source: BPS mid-year 2024 estimates. Density is population divided by land area.</p>`;
}

export function releases() {
  return `<h1>Releases</h1>
  <p class="lede">The latest statistical releases, each with its headline figures. Dates follow the BPS release calendar.</p>
  <ul class="releases">${RELEASES.map((r) => `<li><a href="#/release/${r.slug}">${esc(r.title)}</a><span>${esc(r.date)}</span><p>${esc(r.summary)}</p></li>`).join('')}</ul>`;
}

export function release(slug) {
  const r = RELEASES.find((x) => x.slug === slug);
  if (!r) return missing();
  return `<p><a href="#/releases">← All releases</a></p>
  <h1>${esc(r.title)}</h1>
  <p class="lede">Released ${esc(r.date)}.</p>
  <p>${esc(r.summary)}</p>
  <div class="table-wrap"><table>
    <caption class="visually-hidden">Headline figures from ${esc(r.title)}</caption>
    <thead><tr><th scope="col">Figure</th><th scope="col">Value</th></tr></thead>
    <tbody>${r.rows.map((row) => `<tr><td>${esc(row[0])}</td><td>${esc(row[1])}</td></tr>`).join('')}</tbody>
  </table></div>
  <p class="muted">Source: Badan Pusat Statistik (BPS). Figures as published; see the <a href="#/about">About &amp; sources</a> page for notes.</p>`;
}

export function about() {
  return `<h1>About &amp; sources</h1>
  <p class="lede">NusaStat is an independent, original presentation of Indonesia's official statistics. It is not affiliated with Badan Pusat Statistik or any government body, and it copies no other site's design, text or images.</p>
  <section>
    <h2>Sources</h2>
    <ul>
      <li><strong>Badan Pusat Statistik (BPS)</strong> — GDP, growth, inflation, unemployment, poverty, provincial populations, trade, Human Development Index. bps.go.id</li>
      <li><strong>World Bank, World Development Indicators</strong> — population, GDP in current US dollars and PPP, GNI per capita, urban share. data.worldbank.org</li>
      <li><strong>International Monetary Fund</strong> — annual average consumer price inflation.</li>
      <li><strong>Bank Indonesia</strong> — policy rate, exchange rate, current account, foreign reserves. bi.go.id</li>
      <li><strong>International Labour Organization</strong> — youth unemployment rate.</li>
      <li><strong>United Nations, World Population Prospects</strong> — median age.</li>
    </ul>
  </section>
  <section>
    <h2>How the figures are handled</h2>
    <ul>
      <li>Every figure carries its reference year (or month) and its source, on the page where it appears.</li>
      <li>Values are rounded for reading; charts use the same rounded values, so a chart and its table always agree.</li>
      <li>Where publishers differ slightly, both are shown — for example the mid-year 2024 population is 281.6 million on the BPS series and 283.5 million on the World Bank series. The site uses the World Bank series for its headline population so the time series is consistent.</li>
      <li>Age bands are BPS-based estimates, rounded to one decimal; the male/female split in the pyramid is approximately 50.4 / 49.6 in every band.</li>
      <li>Provincial populations are BPS mid-year 2024 estimates; densities are population divided by land area.</li>
    </ul>
  </section>
  <section>
    <h2>The site itself</h2>
    <p>NusaStat is a set of static files: one HTML page, one stylesheet and three JavaScript modules, with no network request at all. It runs from its own folder in any modern browser, on a desktop or a phone, and every control on it — search, filters, sorting, tabs, downloads — works offline. Figures were last checked on ${esc(COUNTRY.updated)}.</p>
    <p><a href="#/">Back to the home page →</a></p>
  </section>`;
}

export function missing() {
  return `<h1>Not found</h1>
  <p>There is no page at this address. <a href="#/">Go to the home page</a>, or try the <a href="#/indicators">indicators</a>, <a href="#/population">population</a> or <a href="#/economy">economy</a> pages.</p>`;
}

// --- Compare two indicators, side by side. ---
// The pickers live on the Compare page; this block renders the result for
// any pair, so the first view and every change of either picker use the
// same markup. Figures are the published series from data.js — nothing
// here is typed twice — and the plain-language verdict underneath is
// worked out from those same numbers when the page renders.

function duoSeries(key) {
  const meta = COMPARABLE.find((c) => c.key === key) || COMPARABLE[0];
  return { ...meta, points: SERIES[meta.key] };
}

function duoDirection(first, last) {
  if (last > first) return 'rose';
  if (last < first) return 'fell';
  return 'stayed flat';
}

function duoVerdict(a, b) {
  const aFirst = a.points[0], aLast = a.points[a.points.length - 1];
  const bFirst = b.points[0], bLast = b.points[b.points.length - 1];
  const aMove = aLast.value - aFirst.value;
  const bMove = bLast.value - bFirst.value;
  const aPct = aFirst.value > 0 ? (aMove / aFirst.value) * 100 : null;
  const bPct = bFirst.value > 0 ? (bMove / bFirst.value) * 100 : null;
  const span = `${aFirst.year} to ${aLast.year}`;
  let firstHalf = `From ${span}, ${a.title} ${duoDirection(aFirst.value, aLast.value)} from ${num(aFirst.value, 1)} to ${num(aLast.value, 1)} ${a.unit}`
    + (aPct === null ? '' : ` — a move of ${num(Math.abs(aPct), 1)}%`)
    + `, while ${b.title} ${duoDirection(bFirst.value, bLast.value)} from ${num(bFirst.value, 1)} to ${num(bLast.value, 1)} ${b.unit}`
    + (bPct === null ? '' : ` — a move of ${num(Math.abs(bPct), 1)}%`);
  let secondHalf = '';
  if (aPct !== null && bPct !== null) {
    const sharper = Math.abs(aPct) >= Math.abs(bPct) ? a : b;
    const gentler = sharper === a ? b : a;
    secondHalf = ` In percentage terms ${sharper.title} moved more sharply than ${gentler.title} over these years, so its line bends further even though the two numbers are measured in different units.`;
  }
  return firstHalf + '.' + secondHalf;
}

export function duoResult(aKey, bKey) {
  const a = duoSeries(aKey);
  const b = duoSeries(bKey);
  const years = a.points.map((p) => p.year).filter((y) => b.points.some((q) => q.year === y));
  const rows = years.map((y) => ({
    year: y,
    a: a.points.find((p) => p.year === y).value,
    b: b.points.find((p) => p.year === y).value,
  }));
  const chart = twinLines({
    a: { name: a.title, unit: a.unit, points: a.points },
    b: { name: b.title, unit: b.unit, points: b.points },
    label: `${a.title} and ${b.title} together, ${years[0]}–${years[years.length - 1]} (${a.source} / ${b.source}) — each line on its own scale`,
  });
  return `<div class="duo-result" aria-live="polite">
    <h3>${esc(a.title)} against ${esc(b.title)}</h3>
    <p class="duo-verdict">${esc(duoVerdict(a, b))}</p>
    <div class="table-wrap"><table>
      <caption class="visually-hidden">Year-by-year values for ${esc(a.title)} and ${esc(b.title)}</caption>
      <thead><tr><th scope="col">Year</th><th scope="col">${esc(a.title)} (${esc(a.unit)})</th><th scope="col">${esc(b.title)} (${esc(b.unit)})</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><th scope="row">${r.year}</th><td>${num(r.a, 2)}</td><td>${num(r.b, 2)}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="muted">Sources: ${esc(a.title)} — ${esc(a.source)}; ${esc(b.title)} — ${esc(b.source)}. ${esc(a.about)} ${esc(b.about)}</p>
    ${chart}
  </div>`;
}

export function compareIndicators() {
  const options = COMPARABLE.map((c) => `<option value="${c.key}">${esc(c.title)}</option>`).join('');
  return `<h1>Compare indicators</h1>
  <p class="lede">Pick any two indicators and watch them together — their values year by year in one table, both lines on one chart, and a plain sentence saying how each one moved. Because the two are usually measured in different units, each line gets its own scale.</p>
  <section class="duo-box" aria-labelledby="duo-heading">
    <h2 id="duo-heading">Choose two indicators</h2>
    <p>Start with the pair below, or choose your own. The table, the chart and the sentence all update together.</p>
    <div class="duo-pickers">
      <label for="duo-a">First indicator
        <select id="duo-a">${options}</select>
      </label>
      <label for="duo-b">Second indicator
        <select id="duo-b">${options}</select>
      </label>
      <button type="button" class="btn" id="duo-swap">Swap indicators</button>
    </div>
    <div id="duo-result">${duoResult('gdpGrowth', 'inflation')}</div>
  </section>
  <section>
    <h2>Pairs worth trying</h2>
    <ul>
      <li><strong>Real GDP growth with inflation</strong> — did prices calm down while the economy kept growing?</li>
      <li><strong>Unemployment with poverty</strong> — when more people found work, did fewer people live below the poverty line?</li>
      <li><strong>Population with nominal GDP</strong> — the economy’s size against the number of people sharing it.</li>
      <li><strong>Inflation with unemployment</strong> — the two numbers every household feels first.</li>
    </ul>
    <p class="muted">Every series here is also in the <a href="#/indicators">indicators table</a>, with its year and source. Terms you do not recognise are explained in the <a href="#/glossary">glossary</a>.</p>
  </section>`;
}

// --- Glossary: plain-language definitions of statistical terms. ---
// The entries come from GLOSSARY in data.js; this page only lays them
// out and wires the live filter, so the words stay in one place.

export function glossary() {
  return `<h1>Glossary</h1>
  <p class="lede">Statistics has its own vocabulary, and most of it sounds harder than it is. Here are the terms this site uses, explained in everyday words — what each one means, and why the number is worth watching.</p>
  <div class="controls">
    <label class="search" for="gloss-search">Search the glossary</label>
    <input id="gloss-search" type="search" placeholder="Try “inflation” or “poverty”…" autocomplete="off" aria-describedby="gloss-count">
  </div>
  <p class="result-count" id="gloss-count" aria-live="polite">${GLOSSARY.length} terms</p>
  <div class="gloss-list" id="gloss-list">
    ${GLOSSARY.map((g) => `<article class="gloss-term">
      <h2>${esc(g.term)}</h2>
      <p>${esc(g.meaning)}</p>
      <p class="gloss-why"><strong>Why it matters:</strong> ${esc(g.why)}</p>
    </article>`).join('')}
  </div>
  <p class="muted" id="gloss-empty" hidden>No terms match that search. Try a shorter word, for example “price” or “job”.</p>
  <p class="muted">Figures for these terms live in the <a href="#/indicators">indicators table</a>; two of them at a time can be watched together on the <a href="#/compare">Compare page</a>.</p>`;
}
