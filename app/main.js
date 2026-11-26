// NusaStat router and interactions. Hash routing, so every page has a link
// and the site works from static files with no server and no network.
//
// Keyboard and focus behaviour lives here, not in the markup: tabs move
// with the arrow keys (plus Home / End), filter chips and sort buttons are
// plain <button>s, the province comparison re-renders in place, and moving
// to a new page puts keyboard focus on the main content so a screen-reader
// user lands on the new heading instead of the top of the old page.

import { home, indicators, population, economy, provinces, province, releases, release, about, missing, compareHtml, compareIndicators, glossary, duoResult } from './views.js';
import { INDICATORS, PROVINCES, COMPARABLE } from './data.js';

const app = document.getElementById('app');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});
// Escape closes the phone menu and returns focus to its button.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  let html;
  if (parts.length === 0) html = home();
  else if (parts[0] === 'indicators') html = indicators();
  else if (parts[0] === 'population') html = population();
  else if (parts[0] === 'economy') html = economy();
  else if (parts[0] === 'provinces') html = provinces();
  else if (parts[0] === 'province') html = province(parts[1] || '');
  else if (parts[0] === 'releases') html = releases();
  else if (parts[0] === 'release') html = release(parts[1] || '');
  else if (parts[0] === 'about') html = about();
  else if (parts[0] === 'compare') html = compareIndicators();
  else if (parts[0] === 'glossary') html = glossary();
  else html = missing();
  app.innerHTML = html;
  document.querySelectorAll('#nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    a.setAttribute('aria-current', href === '#/' && parts.length === 0 ? 'page' : href === `#/${parts[0]}` ? 'page' : 'false');
    a.classList.toggle('current', href === '#/' ? parts.length === 0 : href === `#/${parts[0]}`);
  });
  // Land keyboard focus on the new page's heading, then scroll to top.
  const heading = app.querySelector('h1');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
  wirePage(parts[0]);
}

function wirePage(page) {
  if (page === 'indicators') wireIndicators();
  if (page === 'economy') wireTabs();
  if (page === 'provinces') wireCompare();
  if (page === 'compare') wireDuo();
  if (page === 'glossary') wireGloss();
}

// --- Indicators explorer: search, topic filter, sorting, CSV download. ---
let indState = { q: '', cat: 'All', sort: 'name', dir: 1 };

function indRows() {
  const rows = INDICATORS.filter((r) => (indState.cat === 'All' || r.cat === indState.cat)
    && (!indState.q || (r.name + ' ' + r.value + ' ' + r.source).toLowerCase().includes(indState.q)));
  const key = indState.sort;
  return [...rows].sort((a, b) => String(a[key]).localeCompare(String(b[key]), 'en', { numeric: true }) * indState.dir);
}

function renderIndTable() {
  const body = document.getElementById('ind-body');
  const count = document.getElementById('ind-count');
  if (!body) return;
  const rows = indRows();
  body.innerHTML = rows.map((r) => `<tr><td>${esc(r.name)}</td><td>${esc(r.cat)}</td><td>${esc(r.value)}</td><td>${esc(r.year)}</td><td>${esc(r.source)}</td></tr>`).join('')
    || `<tr><td colspan="5">No indicators match. Try a different search or topic.</td></tr>`;
  if (count) count.textContent = `${rows.length} indicator${rows.length === 1 ? '' : 's'}${indState.q || indState.cat !== 'All' ? ' matching' : ''}`;
  // Announce the sort direction on the sorted column's button.
  document.querySelectorAll('#ind-table .sort').forEach((b) => {
    if (b.dataset.sort === indState.sort) b.setAttribute('aria-sort', indState.dir === 1 ? 'ascending' : 'descending');
    else b.removeAttribute('aria-sort');
  });
}

function wireIndicators() {
  indState = { q: '', cat: 'All', sort: 'name', dir: 1 };
  renderIndTable();
  const search = document.getElementById('ind-search');
  search.addEventListener('input', () => { indState.q = search.value.trim().toLowerCase(); renderIndTable(); });
  document.getElementById('ind-cats').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat]');
    if (!btn) return;
    indState.cat = btn.dataset.cat;
    document.querySelectorAll('#ind-cats .chip').forEach((c) => {
      const on = c === btn;
      c.classList.toggle('active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    renderIndTable();
  });
  document.getElementById('ind-table').addEventListener('click', (e) => {
    const btn = e.target.closest('button.sort');
    if (!btn) return;
    const key = btn.dataset.sort;
    if (indState.sort === key) indState.dir *= -1;
    else { indState.sort = key; indState.dir = 1; }
    document.querySelectorAll('#ind-table .sort').forEach((b) => b.classList.remove('sorted'));
    btn.classList.add('sorted');
    renderIndTable();
  });
  document.getElementById('ind-csv').addEventListener('click', () => {
    const rows = indRows();
    const csv = ['Indicator,Topic,Value,Year,Source',
      ...rows.map((r) => [r.name, r.cat, r.value, r.year, r.source].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nusastat-indicators.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    const note = document.getElementById('csv-note');
    if (note) note.textContent = `Downloaded ${rows.length} rows as nusastat-indicators.csv.`;
  });
}

// --- Economy tabs: click, plus arrow-key / Home / End navigation. ---
function selectTab(tab, { focus = false } = {}) {
  const tabs = [...document.querySelectorAll('.tab')];
  tabs.forEach((t) => {
    const on = t === tab;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  document.querySelectorAll('.tabpane').forEach((pane) => {
    pane.hidden = pane.dataset.pane !== tab.dataset.tab;
  });
  if (focus) tab.focus();
}

function wireTabs() {
  const tabs = [...document.querySelectorAll('.tab')];
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); selectTab(next, { focus: true }); }
    });
  });
}

// --- Province comparison: two pickers, one swap button, live result. ---
function wireCompare() {
  const aSel = document.getElementById('compare-a');
  const bSel = document.getElementById('compare-b');
  const result = document.getElementById('compare-result');
  const swap = document.getElementById('compare-swap');
  if (!aSel || !bSel || !result) return;
  // Default pair: the two largest provinces, in population order.
  aSel.value = 'west-java';
  bSel.value = 'east-java';
  const render = () => {
    // Never compare a province with itself: if the pickers match, move
    // the second picker to the next province in the list.
    if (aSel.value === bSel.value) {
      const idx = PROVINCES.findIndex((p) => p.slug === bSel.value);
      bSel.value = PROVINCES[(idx + 1) % PROVINCES.length].slug;
    }
    result.innerHTML = compareHtml(aSel.value, bSel.value);
  };
  aSel.addEventListener('change', render);
  bSel.addEventListener('change', render);
  if (swap) {
    swap.addEventListener('click', () => {
      const tmp = aSel.value;
      aSel.value = bSel.value;
      bSel.value = tmp;
      render();
      aSel.focus();
    });
  }
}

window.addEventListener('hashchange', route);
route();

// --- Indicator comparison: two pickers, one swap button, live result. ---
function wireDuo() {
  const aSel = document.getElementById('duo-a');
  const bSel = document.getElementById('duo-b');
  const result = document.getElementById('duo-result');
  const swap = document.getElementById('duo-swap');
  if (!aSel || !bSel || !result) return;
  // Opening pair: growth against inflation, the two numbers households feel first.
  aSel.value = 'gdpGrowth';
  bSel.value = 'inflation';
  const render = () => {
    // A series against itself says nothing: if the pickers agree, move the
    // second picker to the next indicator in the list.
    if (aSel.value === bSel.value) {
      const idx = COMPARABLE.findIndex((c) => c.key === bSel.value);
      bSel.value = COMPARABLE[(idx + 1) % COMPARABLE.length].key;
    }
    result.innerHTML = duoResult(aSel.value, bSel.value);
  };
  aSel.addEventListener('change', render);
  bSel.addEventListener('change', render);
  if (swap) {
    swap.addEventListener('click', () => {
      const tmp = aSel.value;
      aSel.value = bSel.value;
      bSel.value = tmp;
      render();
      aSel.focus();
    });
  }
}

// --- Glossary filter: one search box narrows the term list as you type. ---
function wireGloss() {
  const search = document.getElementById('gloss-search');
  const list = document.getElementById('gloss-list');
  const count = document.getElementById('gloss-count');
  const empty = document.getElementById('gloss-empty');
  if (!search || !list) return;
  const terms = [...list.querySelectorAll('.gloss-term')];
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    terms.forEach((t) => {
      const hit = !q || t.textContent.toLowerCase().includes(q);
      t.hidden = !hit;
      if (hit) shown += 1;
    });
    if (count) count.textContent = `${shown} term${shown === 1 ? '' : 's'}${q ? ' matching' : ''}`;
    if (empty) empty.hidden = shown !== 0;
  });
}
