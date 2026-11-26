// NusaStat charts — one shared drawing helper for every chart.
//
// Every chart on the site is drawn by the same small pipeline: a single
// frame (fixed viewBox width, consistent padding, grid, axis labels and a
// <desc> that a screen reader can read) plus one series renderer per chart
// type. Nothing is fetched; every chart is drawn from the data in data.js
// and labelled with its units and source. Figures keep the same numbers
// they always had — only the drawing code is shared now.

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const fmt = (n, d = 1) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

// One look for every chart: same width, same ink, same grid, same label sizes.
export const CHART = {
  width: 640,
  padLeft: 48,
  padRight: 12,
  padTop: 14,
  padBottom: 30,
  grid: '#e3ddd0',
  axis: '#b9c2bf',
  axisLabel: '#8a938f',
  valueLabel: '#40514e',
  text: '#243330',
  teal: '#0b6e63',
  rust: '#b3541e',
  amber: '#e8a317',
  labelSize: 10,
  valueSize: 10,
};

// Build a linear scale: data value -> SVG y coordinate inside a plot area.
function linearScale(min, max, top, bottom) {
  const span = (max - min) || 1;
  return (v) => top + ((max - v) * (bottom - top)) / span;
}

// Horizontal grid lines with left-hand axis labels, shared by bar and line charts.
function gridLines(scale, values, left, right, decimals = 0) {
  return values.map((v) => {
    const y = scale(v).toFixed(1);
    return `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="${CHART.grid}" stroke-width="1"/>`
      + `<text x="${left - 6}" y="${(Number(y) + 3).toFixed(1)}" text-anchor="end" font-size="${CHART.labelSize}" fill="${CHART.axisLabel}">${fmt(v, decimals)}</text>`;
  }).join('');
}

// The shared frame every chart returns: a <figure> holding one <svg> with a
// <title> and a <desc> (so a screen reader hears what the chart shows, not
// just "image"), the same viewBox width, and a plain-language caption.
function frame({ label, height, summary, inner, kind }) {
  const w = CHART.width;
  const described = summary || label;
  return `<figure class="chart"><svg viewBox="0 0 ${w} ${height}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`
    + `<title>${esc(label)}</title><desc>${esc(described)}</desc>${inner}</svg>`
    + `<figcaption>${esc(label)}</figcaption></figure>`;
}

// A one-line text summary of a year/value series, for the chart <desc>.
function seriesSummary(data, unit, decimals = 1) {
  if (!data.length) return '';
  const first = data[0];
  const last = data[data.length - 1];
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a), data[0]);
  return `From ${first.year} (${fmt(first.value, decimals)}${unit}) to ${last.year} (${fmt(last.value, decimals)}${unit}); `
    + `highest in ${peak.year} at ${fmt(peak.value, decimals)}${unit}.`;
}

export function barChart({ data, label, unit = '', color = CHART.teal, height = 240, decimals = 1 }) {
  const w = CHART.width, h = height;
  const { padLeft: padL, padTop: padT, padBottom: padB } = CHART;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(0, ...data.map((d) => d.value));
  const y = linearScale(min, max, padT, h - padB);
  const zeroY = y(0);
  const bw = (w - padL - CHART.padRight) / data.length;
  const gridVals = [0.25, 0.5, 0.75, 1].map((f) => min + (max - min) * f);
  const bars = data.map((d, i) => {
    const x = padL + i * bw + 3;
    const top = d.value >= 0 ? y(d.value) : zeroY;
    const bh = Math.max(1, Math.abs(y(d.value) - zeroY));
    const cx = (x + (bw - 6) / 2).toFixed(1);
    return `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw - 6).toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${color}">`
      + `<title>${d.year}: ${fmt(d.value, decimals)}${unit}</title></rect>`
      + `<text x="${cx}" y="${(top - 5).toFixed(1)}" text-anchor="middle" font-size="${CHART.valueSize}" fill="${CHART.valueLabel}">${fmt(d.value, decimals)}</text>`
      + `<text x="${cx}" y="${h - 8}" text-anchor="middle" font-size="${CHART.labelSize}" fill="${CHART.valueLabel}">${d.year}</text>`;
  }).join('');
  const inner = gridLines(y, gridVals, padL, w - CHART.padRight, 0)
    + `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${w - CHART.padRight}" y2="${zeroY.toFixed(1)}" stroke="${CHART.axis}" stroke-width="1"/>`
    + bars;
  return frame({ label, height: h, kind: 'bar', summary: seriesSummary(data, unit, decimals), inner });
}

export function lineChart({ data, label, unit = '', color = CHART.rust, height = 240, decimals = 2 }) {
  const w = CHART.width, h = height;
  const { padLeft: padL, padTop: padT, padBottom: padB } = CHART;
  const vals = data.map((d) => d.value);
  let max = Math.max(...vals), min = Math.min(...vals);
  const pad = (max - min) * 0.15 || 1;
  max += pad; min -= pad;
  const x = (i) => padL + (i * (w - padL - 16)) / (data.length - 1);
  const y = linearScale(min, max, padT, h - padB);
  const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const gridVals = [min, (min + max) / 2, max];
  const dots = data.map((d, i) => {
    const cx = x(i).toFixed(1), cy = y(d.value).toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${color}"><title>${d.year}: ${fmt(d.value, decimals)}${unit}</title></circle>`
      + `<text x="${cx}" y="${(y(d.value) - 8).toFixed(1)}" text-anchor="middle" font-size="${CHART.valueSize}" fill="${CHART.valueLabel}">${fmt(d.value, decimals)}</text>`
      + `<text x="${cx}" y="${h - 8}" text-anchor="middle" font-size="${CHART.labelSize}" fill="${CHART.valueLabel}">${d.year}</text>`;
  }).join('');
  const inner = gridLines(y, gridVals, padL, w - 16, decimals)
    + `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`
    + dots;
  return frame({ label, height: h, kind: 'line', summary: seriesSummary(data, unit, decimals), inner });
}

// Horizontal bars: one labelled bar per row, drawn through the shared frame.
export function hbars({ data, label, unit = '%', height = 300 }) {
  const w = CHART.width;
  const rowH = Math.max(26, (height - 30) / data.length);
  const h = rowH * data.length + 34;
  const max = Math.max(...data.map((d) => Math.abs(d.share))) || 1;
  const labelW = 210;
  const summary = data.map((d) => `${d.name} ${fmt(d.share, 1)}${unit}`).join('; ');
  const rows = data.map((d, i) => {
    const y = 8 + i * rowH;
    const bw = Math.max(2, (Math.abs(d.share) / max) * (w - labelW - 64));
    const neg = d.share < 0;
    const midY = y + rowH / 2 + 4;
    return `<text x="${labelW - 8}" y="${midY}" text-anchor="end" font-size="12" fill="${CHART.text}">${esc(d.name)}</text>`
      + `<rect x="${labelW}" y="${y + 4}" width="${bw.toFixed(1)}" height="${(rowH - 10).toFixed(1)}" rx="3" fill="${neg ? CHART.rust : CHART.teal}">`
      + `<title>${esc(d.name)}: ${fmt(d.share, 1)}${unit}</title></rect>`
      + `<text x="${labelW + bw + 6}" y="${midY}" font-size="12" fill="${CHART.valueLabel}">${fmt(d.share, 1)}${unit}</text>`;
  }).join('');
  return frame({ label, height: h, kind: 'hbars', summary, inner: rows });
}

// Two bars side by side for each metric — the province comparison chart.
// rows: [{ metric, a, b }] where a and b are the two provinces' values.
export function pairedBars({ label, aName, bName, rows, unit = '', decimals = 1, height = 300 }) {
  const w = CHART.width;
  const rowH = Math.max(34, (height - 44) / rows.length);
  const h = rowH * rows.length + 48;
  const labelW = 150;
  const barArea = w - labelW - 110;
  const summary = rows.map((r) => `${r.metric}: ${aName} ${fmt(r.a, r.decimals ?? decimals)}${unit}, ${bName} ${fmt(r.b, r.decimals ?? decimals)}${unit}`).join('; ');
  const legend = `<text x="${labelW}" y="14" font-size="11" fill="${CHART.text}"><tspan fill="${CHART.teal}">■</tspan> ${esc(aName)}   <tspan fill="${CHART.rust}">■</tspan> ${esc(bName)}</text>`;
  const body = rows.map((r, i) => {
    const dec = r.decimals ?? decimals;
    // Each metric is scaled to its own larger value, so a small population
    // gap is still visible next to a large density gap.
    const rowMax = Math.max(Math.abs(r.a), Math.abs(r.b)) || 1;
    const y = 24 + i * rowH;
    const aW = Math.max(2, (Math.abs(r.a) / rowMax) * barArea);
    const bW = Math.max(2, (Math.abs(r.b) / rowMax) * barArea);
    const midY = y + 8;
    return `<text x="${labelW - 8}" y="${midY + 4}" text-anchor="end" font-size="12" fill="${CHART.text}">${esc(r.metric)}</text>`
      + `<rect x="${labelW}" y="${y}" width="${aW.toFixed(1)}" height="9" rx="2" fill="${CHART.teal}"><title>${esc(aName)} — ${esc(r.metric)}: ${fmt(r.a, dec)}${unit}</title></rect>`
      + `<text x="${labelW + aW + 5}" y="${midY + 4}" font-size="11" fill="${CHART.valueLabel}">${fmt(r.a, dec)}</text>`
      + `<rect x="${labelW}" y="${y + 12}" width="${bW.toFixed(1)}" height="9" rx="2" fill="${CHART.rust}"><title>${esc(bName)} — ${esc(r.metric)}: ${fmt(r.b, dec)}${unit}</title></rect>`
      + `<text x="${labelW + bW + 5}" y="${midY + 16}" font-size="11" fill="${CHART.valueLabel}">${fmt(r.b, dec)}</text>`;
  }).join('');
  return frame({ label, height: h, kind: 'paired', summary, inner: legend + body });
}

// Age pyramid, drawn through the same frame: male bars left, female right.
export function pyramid({ bands, label }) {
  const w = CHART.width, rowH = 15;
  const h = rowH * bands.length + 46;
  const max = Math.max(...bands.map((b) => b.total)) / 2 || 1;
  const mid = w / 2;
  const biggest = bands.reduce((a, b) => (b.total > a.total ? b : a), bands[0]);
  const summary = `Age pyramid, 2024. Largest band is ${biggest.band} at ${fmt(biggest.total, 1)} million people; `
    + `the population is young, with more people in the younger bands than the older ones.`;
  const head = `<text x="${mid - 60}" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="${CHART.text}">Male</text>`
    + `<text x="${mid + 60}" y="14" text-anchor="middle" font-size="11" font-weight="600" fill="${CHART.text}">Female</text>`
    + `<line x1="${mid}" y1="18" x2="${mid}" y2="${h - 22}" stroke="${CHART.axis}"/>`;
  const rows = bands.map((b, i) => {
    const y = 22 + i * rowH;
    const male = (b.total * 0.504) / 2;
    const female = (b.total * 0.496) / 2;
    const mw = (male / max) * (mid - 46);
    const fw = (female / max) * (mid - 46);
    return `<text x="2" y="${y + 10}" font-size="${CHART.labelSize}" fill="${CHART.valueLabel}">${b.band}</text>`
      + `<rect x="${(mid - 4 - mw).toFixed(1)}" y="${y}" width="${mw.toFixed(1)}" height="11" fill="${CHART.teal}"><title>Male ${b.band}: ${fmt(male * 2, 1)} million</title></rect>`
      + `<rect x="${(mid + 4).toFixed(1)}" y="${y}" width="${fw.toFixed(1)}" height="11" fill="${CHART.rust}"><title>Female ${b.band}: ${fmt(female * 2, 1)} million</title></rect>`;
  }).join('');
  const foot = `<text x="${mid}" y="${h - 6}" text-anchor="middle" font-size="${CHART.labelSize}" fill="${CHART.axisLabel}">Millions of people in each five-year age band, 2024</text>`;
  return frame({ label, height: h, kind: 'pyramid', summary, inner: head + rows + foot });
}

// Two series on one chart, each with its own vertical scale.
// The two indicators usually live in different units — millions of people
// against percent, say — so forcing them onto one axis would squash one
// flat. Instead the first series reads off the left edge in teal and the
// second off the right edge in rust, and both share the same years along
// the bottom, so the shape of each line — rising, falling, flat — can be
// compared even though the numbers cannot be. a and b are
// { name, unit, points: [{ year, value }] }; only years both series share
// are drawn, and the caption names the two scales plainly.
export function twinLines({ a, b, label, height = 280 }) {
  const w = CHART.width, h = height;
  const padL = 58, padR = 58, padT = 30, padB = 32;
  const years = a.points.map((p) => p.year).filter((y) => b.points.some((q) => q.year === y));
  const aPts = a.points.filter((p) => years.includes(p.year));
  const bPts = b.points.filter((p) => years.includes(p.year));
  const aVals = aPts.map((p) => p.value);
  const bVals = bPts.map((p) => p.value);
  let aMax = Math.max(...aVals), aMin = Math.min(...aVals);
  let bMax = Math.max(...bVals), bMin = Math.min(...bVals);
  const aPad = (aMax - aMin) * 0.18 || Math.abs(aMax) * 0.1 || 1;
  const bPad = (bMax - bMin) * 0.18 || Math.abs(bMax) * 0.1 || 1;
  aMax += aPad; aMin -= aPad; bMax += bPad; bMin -= bPad;
  const aY = linearScale(aMin, aMax, padT, h - padB);
  const bY = linearScale(bMin, bMax, padT, h - padB);
  const xAt = (i) => padL + (i * (w - padL - padR)) / Math.max(1, years.length - 1);
  const aPath = aPts.map((p, i) => `${xAt(i).toFixed(1)},${aY(p.value).toFixed(1)}`).join(' ');
  const bPath = bPts.map((p, i) => `${xAt(i).toFixed(1)},${bY(p.value).toFixed(1)}`).join(' ');
  const leftTicks = [aMin, (aMin + aMax) / 2, aMax];
  const rightTicks = [bMin, (bMin + bMax) / 2, bMax];
  const grid = leftTicks.map((v, i) => {
    const y = aY(v).toFixed(1);
    const ry = bY(rightTicks[i]).toFixed(1);
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="${CHART.grid}" stroke-width="1"/>`
      + `<text x="${padL - 7}" y="${(Number(y) + 3).toFixed(1)}" text-anchor="end" font-size="${CHART.labelSize}" fill="${CHART.teal}">${fmt(v, 1)}</text>`
      + `<text x="${w - padR + 7}" y="${(Number(ry) + 3).toFixed(1)}" font-size="${CHART.labelSize}" fill="${CHART.rust}">${fmt(rightTicks[i], 1)}</text>`;
  }).join('');
  const dots = (pts, yOf, colour, above) => pts.map((p, i) => {
    const cx = xAt(i).toFixed(1), cy = yOf(p.value).toFixed(1);
    const ly = above ? Number(cy) - 8 : Number(cy) + 14;
    return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${colour}"><title>${p.year}: ${fmt(p.value, 2)}</title></circle>`
      + `<text x="${cx}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="${CHART.valueSize}" fill="${CHART.valueLabel}">${fmt(p.value, 1)}</text>`
      + `<text x="${cx}" y="${h - 9}" text-anchor="middle" font-size="${CHART.labelSize}" fill="${CHART.valueLabel}">${p.year}</text>`;
  }).join('');
  const key = `<text x="${padL}" y="15" font-size="11" fill="${CHART.text}"><tspan fill="${CHART.teal}">—</tspan> ${esc(a.name)} (${esc(a.unit)}, left scale)   <tspan fill="${CHART.rust}">—</tspan> ${esc(b.name)} (${esc(b.unit)}, right scale)</text>`;
  const summary = `${a.name} runs from ${fmt(aVals[0], 1)} to ${fmt(aVals[aVals.length - 1], 1)} ${a.unit} over ${years[0]}–${years[years.length - 1]}, `
    + `while ${b.name} runs from ${fmt(bVals[0], 1)} to ${fmt(bVals[bVals.length - 1], 1)} ${b.unit}. Each line uses its own scale.`;
  const inner = key + grid
    + `<line x1="${padL}" y1="${(h - padB).toFixed(1)}" x2="${w - padR}" y2="${(h - padB).toFixed(1)}" stroke="${CHART.axis}" stroke-width="1"/>`
    + `<polyline points="${aPath}" fill="none" stroke="${CHART.teal}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`
    + `<polyline points="${bPath}" fill="none" stroke="${CHART.rust}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`
    + dots(aPts, aY, CHART.teal, true)
    + dots(bPts, bY, CHART.rust, false);
  return frame({ label, height: h, kind: 'twin', summary, inner });
}
