// Empat musim: tombol di sebelah tombol cuaca. Rumput dan pohon berganti warna, bunga sakura, daun, atau salju beterbangan.

const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
if (!SEASONS.includes(EX.season)) EX.season = 'summer';
// warna daun pohon per musim (musim panas memakai warna asli)
const SEASON_TREE = {
  spring: { d: '#e88ab4', m: '#f6b4cf', l: '#fcd8e8' },
  autumn: { d: '#c9622a', m: '#e8873a', l: '#f4c23a' },
  winter: { d: '#b9c6d2', m: '#dfe8f0', l: '#ffffff' },
};
// hijau yang dipakai baju dan atap, jangan ikut berubah
const SEASON_KEEP = new Set(['#58a84a', '#3d7f33', '#7cc85a', '#4f8a5a', '#3f9a9a', '#2a7272', '#5cb8b8']);
const _seasonCache = {};
let SEASON_ON = false;
// ubah warna hijau alam menjadi warna musim
function seasonCol(col) {
  const s = EX.season;
  if (!SEASON_ON || s === 'summer' || typeof col !== 'string' || col[0] !== '#' || col.length !== 7 || SEASON_KEEP.has(col)) return col;
  const key = s + col;
  if (key in _seasonCache) return _seasonCache[key];
  const r = parseInt(col.slice(1, 3), 16), g = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
  let out = col;
  if (g > r + 20 && g > b + 20) {
    const hx = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    if (s === 'autumn') out = '#' + hx(g * 1.05) + hx(g * 0.8) + hx(b * 0.45);
    else if (s === 'winter') { const L = 0.3 * r + 0.59 * g + 0.11 * b, v = 196 + (L - 120) * 0.45; out = '#' + hx(v - 8) + hx(v) + hx(v + 12); }
    else out = '#' + hx(r * 1.08 + 10) + hx(g * 1.03 + 6) + hx(b + 6);
  }
  return (_seasonCache[key] = out);
}
// px, disc, oval, groundPatches memakai warna musim saat SEASON_ON
(function hookPrimitives() {
  const P = px, D = disc, O = oval, GP = groundPatches;
  px = (c, x, y, w, h, col) => P(c, x, y, w, h, SEASON_ON ? seasonCol(col) : col);
  disc = (c, cx, cy, r, col) => D(c, cx, cy, r, SEASON_ON ? seasonCol(col) : col);
  oval = (c, cx, cy, rx, ry, col) => O(c, cx, cy, rx, ry, SEASON_ON ? seasonCol(col) : col);
  groundPatches = (c, x, y, w, h, seed, col, level) => GP(c, x, y, w, h, seed, SEASON_ON ? seasonCol(col) : col, level);
})();
const withSeason = fn => function (...a) { const keep = SEASON_ON; SEASON_ON = true; try { return fn.apply(this, a); } finally { SEASON_ON = keep; } };
// latar tempat luar ruangan dan pemandangan dari jendela kereta
Object.values(SCENES).forEach(S => { if (S.outdoor) S.bg = withSeason(S.bg); });
rideView = withSeason(rideView);
// pohon dan semak: warna daun musim
(function hookTrees() {
  const T = drawTree, B = drawBush, Pn = drawPine;
  const swapLeaf = fn => function (...a) {
    const pal = SEASON_TREE[EX.season];
    if (!pal || PX !== 1) return fn.apply(this, a);
    const keep = [PAL.leafD, PAL.leaf, PAL.leafL];
    PAL.leafD = pal.d; PAL.leaf = pal.m; PAL.leafL = pal.l;
    try { return fn.apply(this, a); } finally { [PAL.leafD, PAL.leaf, PAL.leafL] = keep; }
  };
  drawTree = swapLeaf(T); drawBush = swapLeaf(B);
  drawPine = function (c, x, y, h) {
    Pn(c, x, y, h);
    if (EX.season !== 'winter' || PX !== 1) return;
    x = Math.round(x); y = Math.round(y);
    for (let i = 0; i < 3; i++) { const ty = y - 6 - i * Math.round(h / 4) - 7, w = 9 - i * 2; px(c, x - Math.round(w * 0.3), ty, Math.round(w * 0.6) + 1, 2, '#ffffff'); }
  };
})();

// ---------- Kelopak, daun, dan salju yang beterbangan ----------
const SEASON_PARTS = [];
for (let i = 0; i < 28; i++) SEASON_PARTS.push({ x: Math.random() * W, y: Math.random() * H, s: 8 + Math.random() * 12, p: Math.random() * 6, k: Math.random() });
const _drawWeatherBase = drawWeather;
drawWeather = function (c, dt) {
  _drawWeatherBase(c, dt);
  const s = EX.season;
  if (s === 'summer') return;
  const n = s === 'winter' ? 28 : s === 'spring' ? 20 : 16;
  for (let i = 0; i < n; i++) {
    const q = SEASON_PARTS[i];
    q.y += q.s * dt; q.x += Math.sin(G.t * 1.3 + q.p) * 12 * dt + (s === 'winter' ? 0 : 4 * dt);
    if (q.y > H) { q.y = -3; q.x = Math.random() * W; }
    if (q.x > W) q.x = 0;
    if (s === 'spring') { px(c, q.x, q.y, 2, 1, q.k < 0.5 ? '#f6b4cf' : '#fcd8e8'); px(c, q.x + 1, q.y + 1, 1, 1, '#e88ab4'); }
    else if (s === 'autumn') { const col = q.k < 0.33 ? '#e8873a' : q.k < 0.66 ? '#c9622a' : '#f4c23a', fl = Math.sin(G.t * 4 + q.p) > 0; px(c, q.x, q.y, fl ? 3 : 2, fl ? 1 : 2, col); }
    else px(c, q.x, q.y, q.k < 0.3 ? 2 : 1, q.k < 0.3 ? 2 : 1, '#ffffff');
  }
};
const _drawTintBase = drawTint;
drawTint = function (c) {
  if (G.scene && G.scene.outdoor && EX.season !== 'summer') {
    c.globalCompositeOperation = 'multiply';
    c.fillStyle = { spring: '#fff6fa', autumn: '#fff0dc', winter: '#eef3fa' }[EX.season];
    c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'source-over';
  }
  _drawTintBase(c);
};

// ---------- Tombol musim ----------
function drawSeasonIcon(x, s) {
  if (s === 'spring') { for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 - Math.PI / 2; disc(x, 8 + Math.round(Math.cos(a) * 4), 8 + Math.round(Math.sin(a) * 4), 3, '#f6b4cf'); } disc(x, 8, 8, 2, '#f4cf3a'); }
  else if (s === 'summer') { px(x, 7, 9, 2, 6, '#8a5a35'); disc(x, 8, 7, 5, '#4a9a3a'); disc(x, 6, 5, 2, '#7cc85a'); disc(x, 13, 3, 2, '#ffd84a'); }
  else if (s === 'autumn') { for (let k = 0; k < 6; k++) { px(x, 8 - k, 3 + k, k * 2 + 1, 1, '#e8873a'); } px(x, 3, 9, 11, 2, '#c9622a'); px(x, 7, 11, 2, 4, '#8a5a35'); px(x, 6, 6, 1, 3, '#f4c23a'); }
  else { disc(x, 8, 11, 4, '#ffffff'); disc(x, 8, 5, 3, '#ffffff'); px(x, 7, 5, 1, 1, '#2a1d18'); px(x, 9, 5, 1, 1, '#2a1d18'); px(x, 8, 6, 2, 1, '#f08a32'); px(x, 5, 1, 6, 2, '#e2483d'); }
}
const _updateIconsBase = updateIcons;
updateIcons = function () {
  _updateIconsBase();
  iconInto($('btn-season'), 16, x => drawSeasonIcon(x, EX.season));
  $('btn-season').setAttribute('aria-label', 'Ganti musim (sekarang ' + word(EX.season).id + ')');
};
function setSeason(s) {
  EX.season = s; exSave(); G.bgDirty = true; updateIcons();
  const list = [{ k: s }];
  if (s === 'winter' && G.scene && G.scene.outdoor && !G.outfit.scarf) list.push({ k: 'scarf' });
  say(list);
}
$('btn-season').addEventListener('click', () => { if (!G.started) return; sfx('pop'); setSeason(SEASONS[(SEASONS.indexOf(EX.season) + 1) % SEASONS.length]); });
updateIcons();

// ---------- Gambar stiker ----------
// stiker dibuat tanpa warna musim supaya selalu sama
(function stickerNoSeason() {
  const SC = stickerCanvas;
  stickerCanvas = function (k, gray) { const keep = EX.season; EX.season = 'summer'; try { return SC(k, gray); } finally { EX.season = keep; } };
})();
const stSeasonTree = s => (c, x, y) => { const keep = EX.season; EX.season = s; try { drawTree(c, x, y, { r: 10 }); } finally { EX.season = keep; } };
Object.assign(ST_ART, {
  season: (c, x, y) => { for (const [i, s] of SEASONS.entries()) { const p = SEASON_TREE[s] || { d: PAL.leafD, m: PAL.leaf }; disc(c, x - 12 + i * 8, y - 8, 4, p.d); disc(c, x - 12 + i * 8, y - 9, 3, p.m); } },
  spring: (c, x, y) => { stSeasonTree('spring')(c, x, y); for (const [a, b] of [[-12, -8], [11, -14], [8, -3]]) px(c, x + a, y + b, 2, 1, '#f6b4cf'); },
  summer: (c, x, y) => { stSeasonTree('summer')(c, x - 3, y); disc(c, x + 12, y - 26, 4, '#ffd84a'); },
  autumn: (c, x, y) => { stSeasonTree('autumn')(c, x, y); for (const [a, b] of [[-12, -4], [11, -8], [6, -1]]) px(c, x + a, y + b, 3, 1, '#e8873a'); },
  winter: (c, x, y) => { disc(c, x, y - 6, 7, '#ffffff'); disc(c, x, y - 16, 5, '#ffffff'); px(c, x - 2, y - 17, 1, 1, '#2a1d18'); px(c, x + 2, y - 17, 1, 1, '#2a1d18'); px(c, x, y - 15, 3, 1, '#f08a32'); px(c, x - 5, y - 23, 10, 2, '#e2483d'); px(c, x - 3, y - 26, 6, 3, '#e2483d'); px(c, x - 6, y - 11, 12, 2, '#4f86e0'); },
});
