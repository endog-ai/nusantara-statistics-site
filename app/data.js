// NusaStat data — Indonesia, real published figures.
// Sources: Badan Pusat Statistik (BPS), World Bank World Development
// Indicators, IMF, Bank Indonesia. Every value carries its year and source
// so a visitor can check it. Values are rounded; see the About page.

export const COUNTRY = {
  name: 'Indonesia',
  siteName: 'NusaStat',
  tagline: 'National Statistics of Indonesia',
  updated: '25 November 2026',
  landAreaKm2: 1904569,
  islands: 17508,
  provinces: 38,
  regenciesCities: 514,
};

// Headline indicators shown on the home page.
export const HEADLINE = [
  { key: 'population', label: 'Population', value: '283.5m', sub: 'mid-year 2024 · World Bank', href: '#/population' },
  { key: 'gdp', label: 'GDP', value: 'US$1,396bn', sub: 'current prices, 2024 · BPS', href: '#/economy' },
  { key: 'growth', label: 'GDP growth', value: '5.03%', sub: '2024, year on year · BPS', href: '#/economy' },
  { key: 'inflation', label: 'Inflation', value: '1.57%', sub: 'Dec 2024, year on year · BPS', href: '#/economy' },
  { key: 'unemployment', label: 'Unemployment', value: '4.91%', sub: 'Aug 2024 · BPS', href: '#/indicators' },
  { key: 'poverty', label: 'Poverty rate', value: '8.57%', sub: 'Sep 2024 · BPS', href: '#/indicators' },
];

// Yearly series, 2015–2024 unless noted.
export const SERIES = {
  population: [ // millions, mid-year (World Bank)
    { year: 2020, value: 274.0 }, { year: 2021, value: 276.4 }, { year: 2022, value: 278.7 },
    { year: 2023, value: 281.2 }, { year: 2024, value: 283.5 }, { year: 2025, value: 286.0 },
  ],
  gdpGrowth: [ // percent, real GDP growth (BPS)
    { year: 2015, value: 4.88 }, { year: 2016, value: 5.03 }, { year: 2017, value: 5.07 },
    { year: 2018, value: 5.17 }, { year: 2019, value: 5.02 }, { year: 2020, value: -2.07 },
    { year: 2021, value: 3.70 }, { year: 2022, value: 5.31 }, { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 },
  ],
  gdpNominal: [ // trillion rupiah, current prices (BPS)
    { year: 2015, value: 11526 }, { year: 2016, value: 12401 }, { year: 2017, value: 13588 },
    { year: 2018, value: 14839 }, { year: 2019, value: 15833 }, { year: 2020, value: 15443 },
    { year: 2021, value: 16977 }, { year: 2022, value: 19589 }, { year: 2023, value: 20892 },
    { year: 2024, value: 22139 },
  ],
  inflation: [ // percent, December year on year (BPS)
    { year: 2015, value: 3.35 }, { year: 2016, value: 3.02 }, { year: 2017, value: 3.61 },
    { year: 2018, value: 3.13 }, { year: 2019, value: 2.72 }, { year: 2020, value: 1.68 },
    { year: 2021, value: 1.87 }, { year: 2022, value: 5.51 }, { year: 2023, value: 2.61 },
    { year: 2024, value: 1.57 },
  ],
  unemployment: [ // percent, open unemployment rate (BPS)
    { year: 2015, value: 6.18 }, { year: 2016, value: 5.61 }, { year: 2017, value: 5.50 },
    { year: 2018, value: 5.34 }, { year: 2019, value: 5.28 }, { year: 2020, value: 7.07 },
    { year: 2021, value: 6.49 }, { year: 2022, value: 5.86 }, { year: 2023, value: 5.32 },
    { year: 2024, value: 4.91 },
  ],
  poverty: [ // percent of population (BPS)
    { year: 2015, value: 11.13 }, { year: 2016, value: 10.70 }, { year: 2017, value: 10.12 },
    { year: 2018, value: 9.66 }, { year: 2019, value: 9.22 }, { year: 2020, value: 10.19 },
    { year: 2021, value: 10.14 }, { year: 2022, value: 9.57 }, { year: 2023, value: 9.36 },
    { year: 2024, value: 8.57 },
  ],
  trade: [ // US$ billion (BPS)
    { year: 2020, exports: 163.2, imports: 141.6 },
    { year: 2021, exports: 231.6, imports: 196.2 },
    { year: 2022, exports: 291.9, imports: 237.4 },
    { year: 2023, exports: 258.8, imports: 221.9 },
    { year: 2024, exports: 264.7, imports: 233.7 },
  ],
};

// GDP by sector, 2024, percent of GDP (BPS). The site computes "Other" so the bars sum to 100.
export const GDP_SECTORS = [
  { name: 'Manufacturing', share: 18.98 },
  { name: 'Wholesale & retail trade', share: 13.02 },
  { name: 'Agriculture, forestry & fishing', share: 12.53 },
  { name: 'Construction', share: 9.85 },
  { name: 'Mining & quarrying', share: 8.06 },
  { name: 'Information & communication', share: 4.41 },
  { name: 'Financial & insurance', share: 4.25 },
  { name: 'Transportation & storage', share: 4.09 },
  { name: 'Public administration', share: 3.44 },
  { name: 'Education', share: 3.13 },
];

// GDP by expenditure, 2024, percent of GDP (BPS, rounded).
export const GDP_EXPENDITURE = [
  { name: 'Household consumption', share: 54.0 },
  { name: 'Investment (gross fixed capital)', share: 29.5 },
  { name: 'Government consumption', share: 7.7 },
  { name: 'Exports of goods & services', share: 21.5 },
  { name: 'Imports of goods & services', share: -20.0 },
  { name: 'Changes in inventories & discrepancy', share: 7.3 },
];

// Age structure 2024, millions (BPS-based, rounded; totals 283.5m).
// male/female split is roughly 50.4 / 49.6 in every band.
export const AGE_BANDS = [
  { band: '0–4', total: 22.9 }, { band: '5–9', total: 23.5 }, { band: '10–14', total: 23.9 },
  { band: '15–19', total: 24.1 }, { band: '20–24', total: 24.4 }, { band: '25–29', total: 23.3 },
  { band: '30–34', total: 22.0 }, { band: '35–39', total: 21.4 }, { band: '40–44', total: 20.6 },
  { band: '45–49', total: 19.0 }, { band: '50–54', total: 16.6 }, { band: '55–59', total: 13.9 },
  { band: '60–64', total: 10.9 }, { band: '65–69', total: 7.9 }, { band: '70–74', total: 5.1 },
  { band: '75+', total: 4.0 },
];

// Largest provinces, mid-year 2024 (BPS, millions). Area in km².
export const PROVINCES = [
  { slug: 'west-java', name: 'West Java', capital: 'Bandung', population: 50.35, area: 35378 },
  { slug: 'east-java', name: 'East Java', capital: 'Surabaya', population: 41.81, area: 47803 },
  { slug: 'central-java', name: 'Central Java', capital: 'Semarang', population: 38.39, area: 32801 },
  { slug: 'north-sumatra', name: 'North Sumatra', capital: 'Medan', population: 15.59, area: 72981 },
  { slug: 'banten', name: 'Banten', capital: 'Serang', population: 12.43, area: 9663 },
  { slug: 'jakarta', name: 'Jakarta', capital: 'Jakarta', population: 10.56, area: 664 },
  { slug: 'south-sulawesi', name: 'South Sulawesi', capital: 'Makassar', population: 9.47, area: 46717 },
  { slug: 'lampung', name: 'Lampung', capital: 'Bandar Lampung', population: 9.44, area: 34624 },
  { slug: 'south-sumatra', name: 'South Sumatra', capital: 'Palembang', population: 8.94, area: 91592 },
  { slug: 'riau', name: 'Riau', capital: 'Pekanbaru', population: 7.01, area: 87024 },
  { slug: 'west-sumatra', name: 'West Sumatra', capital: 'Padang', population: 6.01, area: 42013 },
  { slug: 'west-kalimantan', name: 'West Kalimantan', capital: 'Pontianak', population: 5.85, area: 147307 },
  { slug: 'bali', name: 'Bali', capital: 'Denpasar', population: 4.34, area: 5780 },
  { slug: 'south-kalimantan', name: 'South Kalimantan', capital: 'Banjarbaru', population: 4.19, area: 38744 },
  { slug: 'east-kalimantan', name: 'East Kalimantan', capital: 'Samarinda', population: 4.05, area: 127268 },
];

// Full indicator explorer table.
export const INDICATORS = [
  { name: 'Population', cat: 'Population', value: '283.5 million', year: 2024, source: 'World Bank' },
  { name: 'Population growth', cat: 'Population', value: '0.80% per year', year: 2024, source: 'World Bank' },
  { name: 'Population density', cat: 'Population', value: '149 per km²', year: 2024, source: 'World Bank / BPS' },
  { name: 'Urban population', cat: 'Population', value: '59.0% of total', year: 2024, source: 'World Bank' },
  { name: 'Median age', cat: 'Population', value: '30.5 years', year: 2024, source: 'UN World Population Prospects' },
  { name: 'Life expectancy at birth', cat: 'Population', value: '74.2 years', year: 2024, source: 'BPS' },
  { name: 'Total fertility rate', cat: 'Population', value: '2.0 children per woman', year: 2024, source: 'BPS' },
  { name: 'GDP, current prices', cat: 'Economy', value: 'US$1,396 billion', year: 2024, source: 'BPS' },
  { name: 'GDP per capita', cat: 'Economy', value: 'US$4,958', year: 2024, source: 'BPS' },
  { name: 'GDP, purchasing power parity', cat: 'Economy', value: 'US$4,102 billion', year: 2024, source: 'World Bank' },
  { name: 'Real GDP growth', cat: 'Economy', value: '5.03%', year: 2024, source: 'BPS' },
  { name: 'GNI per capita, Atlas method', cat: 'Economy', value: 'US$4,910', year: 2024, source: 'World Bank' },
  { name: 'Consumer price inflation, December', cat: 'Prices', value: '1.57% y-o-y', year: 2024, source: 'BPS' },
  { name: 'Consumer price inflation, annual average', cat: 'Prices', value: '2.3%', year: 2024, source: 'IMF' },
  { name: 'Policy rate (BI Rate)', cat: 'Prices', value: '6.00%', year: 'end-2024', source: 'Bank Indonesia' },
  { name: 'Exchange rate, rupiah per US$', cat: 'Prices', value: 'Rp 15,752', year: '2024 avg', source: 'Bank Indonesia' },
  { name: 'Open unemployment rate', cat: 'Labour', value: '4.91%', year: 'Aug 2024', source: 'BPS' },
  { name: 'Labour force', cat: 'Labour', value: '152.1 million', year: 'Aug 2024', source: 'BPS' },
  { name: 'Youth unemployment rate (15–24)', cat: 'Labour', value: '13.1%', year: 2024, source: 'ILO' },
  { name: 'Poverty rate', cat: 'Society', value: '8.57%', year: 'Sep 2024', source: 'BPS' },
  { name: 'People in poverty', cat: 'Society', value: '24.06 million', year: 'Sep 2024', source: 'BPS' },
  { name: 'Human Development Index', cat: 'Society', value: '75.02', year: 2024, source: 'BPS' },
  { name: 'Gini ratio', cat: 'Society', value: '0.379', year: 'Mar 2024', source: 'BPS' },
  { name: 'Mean years of schooling', cat: 'Society', value: '9.0 years', year: 2024, source: 'BPS' },
  { name: 'Literacy rate (15+)', cat: 'Society', value: '96.9%', year: 2024, source: 'BPS' },
  { name: 'Exports of goods', cat: 'Trade', value: 'US$264.7 billion', year: 2024, source: 'BPS' },
  { name: 'Imports of goods', cat: 'Trade', value: 'US$233.7 billion', year: 2024, source: 'BPS' },
  { name: 'Trade balance', cat: 'Trade', value: 'US$31.0 billion surplus', year: 2024, source: 'BPS' },
  { name: 'Current account balance', cat: 'Trade', value: '−US$8.5 billion (−0.6% of GDP)', year: 2024, source: 'Bank Indonesia' },
  { name: 'Foreign exchange reserves', cat: 'Trade', value: 'US$155.7 billion', year: 'end-2024', source: 'Bank Indonesia' },
];

export const INDICATOR_CATS = ['All', 'Population', 'Economy', 'Prices', 'Labour', 'Society', 'Trade'];

// Statistical releases. Dates and contents follow the real BPS release calendar.
export const RELEASES = [
  {
    slug: 'gdp-q4-2024', date: '5 Feb 2025', title: 'Economic Growth, Q4 2024',
    summary: 'The economy grew 5.02% year on year in the fourth quarter, taking full-year 2024 growth to 5.03%. Household consumption rose 4.94% and investment 6.61% over the year; manufacturing, the largest sector, grew 4.68%.',
    rows: [['Real GDP growth, Q4 2024', '5.02% y-o-y'], ['Real GDP growth, full-year 2024', '5.03%'], ['Nominal GDP, 2024', 'Rp 22,139 trillion'], ['GDP per capita, 2024', 'US$4,958'], ['Household consumption growth', '4.94%'], ['Investment growth', '6.61%']],
  },
  {
    slug: 'inflation-dec-2024', date: '2 Jan 2025', title: 'Consumer Prices, December 2024',
    summary: 'Consumer prices rose 1.57% over the year to December 2024, the lowest December reading in the series. Food prices eased after the harvest, while administered prices were flat; core inflation was 2.26%.',
    rows: [['CPI inflation, Dec 2024 y-o-y', '1.57%'], ['Core inflation', '2.26%'], ['Volatile food inflation', '0.34%'], ['Administered prices inflation', '1.52%'], ['Annual average inflation, 2024', '2.3%']],
  },
  {
    slug: 'labour-aug-2024', date: '5 Nov 2024', title: 'Labour Force, August 2024',
    summary: 'The open unemployment rate fell to 4.91% in August 2024, down from 5.32% a year earlier. The labour force reached 152.11 million people; 144.64 million were working, 57.94% of them in the informal sector.',
    rows: [['Open unemployment rate', '4.91%'], ['Labour force', '152.11 million'], ['Employed', '144.64 million'], ['Informal employment share', '57.94%'], ['Labour force participation', '70.63%']],
  },
  {
    slug: 'poverty-sep-2024', date: '15 Jan 2025', title: 'Poverty, September 2024',
    summary: 'The poverty rate fell to 8.57% in September 2024, or 24.06 million people — the lowest since the series began. Urban poverty was 7.04% and rural poverty 11.34%; the poverty line stood at Rp 595,242 per person per month.',
    rows: [['Poverty rate', '8.57%'], ['People in poverty', '24.06 million'], ['Urban poverty rate', '7.04%'], ['Rural poverty rate', '11.34%'], ['Poverty line', 'Rp 595,242 / person / month']],
  },
  {
    slug: 'trade-dec-2024', date: '15 Jan 2025', title: 'Foreign Trade, December 2024',
    summary: 'Exports reached US$264.70 billion in 2024 and imports US$233.66 billion, leaving a surplus of US$31.04 billion — the fifth straight annual surplus. China, the United States and Japan were the largest export markets.',
    rows: [['Exports, 2024', 'US$264.70 billion'], ['Imports, 2024', 'US$233.66 billion'], ['Trade balance, 2024', 'US$31.04 billion surplus'], ['Exports, Dec 2024', 'US$23.46 billion'], ['Imports, Dec 2024', 'US$20.24 billion']],
  },
  {
    slug: 'population-mid-2024', date: '30 Jun 2024', title: 'Population, Mid-Year 2024',
    summary: 'The mid-year population is estimated at 281.6 million people (BPS) — 283.5 million on the World Bank series — growing about 0.8% a year. Java holds 55.9% of all residents on 6.6% of the land; Jakarta is the densest province at about 15,900 people per km².',
    rows: [['Population, mid-2024 (BPS)', '281.6 million'], ['Population, mid-2024 (World Bank)', '283.5 million'], ['Annual growth', '0.8%'], ['Share living on Java', '55.9%'], ['Densest province', 'Jakarta, ~15,900 / km²']],
  },
];

// Series a visitor can put side by side on the Compare page. Every entry
// points at a series that already lives in SERIES above, so no figure is
// repeated here — the title, unit and source are the only new words.
export const COMPARABLE = [
  { key: 'population', title: 'Population', unit: 'million people', source: 'World Bank', about: 'How many people lived in Indonesia in each year.' },
  { key: 'gdpGrowth', title: 'Real GDP growth', unit: '% per year', source: 'BPS', about: 'How much faster the economy produced goods and services than the year before.' },
  { key: 'gdpNominal', title: 'Nominal GDP', unit: 'trillion rupiah', source: 'BPS', about: 'The size of the whole economy in current rupiah, before adjusting for prices.' },
  { key: 'inflation', title: 'Inflation (December)', unit: '% per year', source: 'BPS', about: 'How much more expensive everyday goods and services were than a December earlier.' },
  { key: 'unemployment', title: 'Unemployment rate', unit: '% of the labour force', source: 'BPS', about: 'The share of people who want work and are looking for it, but do not have a job.' },
  { key: 'poverty', title: 'Poverty rate', unit: '% of the population', source: 'BPS', about: 'The share of people living below the official poverty line.' },
];

// Plain-language glossary. Each entry is written for someone who has never
// studied economics: what the term means in everyday words, then why the
// number is worth watching. No new figures are introduced here — the
// explanations stand on their own and point back to the site's tables.
export const GLOSSARY = [
  {
    term: 'Gross domestic product (GDP)',
    meaning: 'The total value of everything a country makes in a year — all the rice grown, clothes sewn, meals served, rides given and services provided, added together. It is the headline size of an economy.',
    why: 'When GDP grows, the country is producing more than it did before; when it shrinks, production is falling. It is the first number people ask for when they want to know how big an economy is.',
  },
  {
    term: 'GDP per capita',
    meaning: 'GDP divided by the number of people who live in the country — roughly, the average share of what the economy produces for each person. It is an average, not what any one person actually earns.',
    why: 'It lets you compare living standards between countries of very different sizes, and see whether ordinary people are, on average, getting richer as the economy grows.',
  },
  {
    term: 'Real GDP growth',
    meaning: 'How much more the economy produced this year than last year, after taking price rises out of the picture. "Real" means the comparison is about the amount of goods and services, not about prices going up.',
    why: 'It is the simplest answer to "is the economy doing well?" — steady growth near five percent a year has been Indonesia’s normal pace in recent years.',
  },
  {
    term: 'Inflation',
    meaning: 'How much more expensive things have become over a year. If inflation is two percent, something that cost Rp 100,000 a year ago costs about Rp 102,000 now.',
    why: 'It decides whether wages and savings keep their value. Low, steady inflation means prices are predictable; high inflation quietly makes everyone’s money worth less.',
  },
  {
    term: 'Consumer price index (CPI)',
    meaning: 'A basket of the goods and services a typical household buys — food, housing, transport, clothing and more — priced every month. Inflation is simply how much that basket’s price has moved since a year earlier.',
    why: 'It is the measuring stick behind the inflation figure, and it is also what the central bank watches when it sets interest rates.',
  },
  {
    term: 'Unemployment rate',
    meaning: 'The share of people who are able and willing to work, and are actively looking for a job, but do not have one. People who are studying, retired or not looking for work are not counted here.',
    why: 'It shows whether the economy is creating enough jobs for the people who want them — a low rate usually means work is easier to find.',
  },
  {
    term: 'Labour force',
    meaning: 'Everyone of working age who is either working or looking for work. It is the pool of people the economy draws its workers from.',
    why: 'Its size shapes everything else: a growing labour force means more people need jobs, and more people able to produce, earn and spend.',
  },
  {
    term: 'Poverty rate',
    meaning: 'The share of people whose spending falls below the poverty line — the amount of money judged to be the minimum for a decent basic life, covering food and other essentials.',
    why: 'It is the most direct measure of whether growth is reaching the poorest people. A falling rate means fewer families are living below that line.',
  },
  {
    term: 'Poverty line',
    meaning: 'A monthly amount of money per person, set by the statistics office, that marks the boundary between poor and not poor. Anyone spending less than that amount is counted as living in poverty.',
    why: 'Without a line there is no way to count poverty at all — the line turns a vague idea into a number that can be tracked year after year.',
  },
  {
    term: 'Gini ratio',
    meaning: 'A single number, from zero to one, that sums up how evenly income or spending is spread. Zero would mean everyone has exactly the same; one would mean a single person has everything.',
    why: 'Growth can lift the average while leaving many behind, so the Gini shows whether prosperity is shared or concentrated at the top.',
  },
  {
    term: 'Human Development Index (HDI)',
    meaning: 'A score that combines three things — how long people live, how much schooling they get, and how much they can afford — into one number that describes how well people are doing, not just how much money the country makes.',
    why: 'It reminds us that a rich economy and a good life are not the same thing: health and education matter as much as income.',
  },
  {
    term: 'Trade balance',
    meaning: 'Exports minus imports over a year. If the country sells more abroad than it buys from abroad, the balance is a surplus; if it buys more than it sells, it is a deficit.',
    why: 'A surplus brings foreign currency into the country, which helps pay for imports and steadies the exchange rate. Indonesia has run a surplus for five years in a row.',
  },
  {
    term: 'Current account balance',
    meaning: 'A wider version of the trade balance that also counts money flowing in and out for services, wages and investment income — the country’s full bill with the rest of the world.',
    why: 'Even with a goods surplus, a country can run a current-account deficit if it pays a lot abroad for services and investment returns, so this is the fuller picture.',
  },
  {
    term: 'Policy rate (BI Rate)',
    meaning: 'The interest rate set by Bank Indonesia, the central bank. It is the rate that shapes what banks charge each other, and from there what households and businesses pay to borrow.',
    why: 'It is the central bank’s main lever: raising it cools spending and prices, lowering it makes borrowing cheaper and encourages activity.',
  },
  {
    term: 'Purchasing power parity (PPP)',
    meaning: 'A way of comparing economies by what money actually buys in each place, instead of by the exchange rate. A meal that costs little in Jakarta and a lot in Tokyo counts the same under PPP.',
    why: 'Exchange rates move with markets, so PPP gives a fairer sense of how big an economy really is in everyday terms — by this measure Indonesia’s economy is among the world’s largest.',
  },
  {
    term: 'Median age',
    meaning: 'The age that splits the population in half: half the people are younger than it, half are older. It is a better picture of how young or old a country is than the average, which a few very old people can pull up.',
    why: 'A low median age means a young country with many workers and students ahead of it; a high one means an ageing country with more retirees to support.',
  },
];
