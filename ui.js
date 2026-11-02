// Jendela: Peta, Bunga (lihat / tanam / cari), Cermin, Berhitung, Orang Tua.

const PANELS = { flower: $('p-flower'), mirror: $('p-mirror'), count: $('p-count'), parent: $('p-parent'), map: $('p-map'), bag: $('p-bag') };
function openPanel(name, arg) {
  closePanel(true);
  G.panel = name; PANELS[name].hidden = false; sfx('pop');
  if (name === 'bag') bagOpen();
  if (name === 'piano') pianoOpen();
  if (name === 'drum') drumOpen();
  if (name === 'flower') flowerOpen(arg);
  if (name === 'mirror') mirrorOpen(arg);
  if (name === 'count') countMode(CT.mode);
  if (name === 'parent') { syncParentSettings(); const st = Talk.status(); $('voice-status').textContent = st.text; $('voice-status').classList.toggle('warn', !st.ok); }
}
function closePanel(silent) {
  if (!G.panel) return;
  PANELS[G.panel].hidden = true; G.panel = null;
  if (!silent) sfx('tap');
}
document.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closePanel()));
Object.values(PANELS).forEach(p => p.addEventListener('pointerdown', e => { if (e.target === p) closePanel(); }));
window.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

const PANEL_HOOK = {}; // gambar per bingkai untuk jendela tambahan (masak, kamar)
function panelFrame(dt) {
  if (PANEL_HOOK[G.panel]) PANEL_HOOK[G.panel](dt);
  if (G.panel === 'flower') flowerDraw(dt);
  if (G.panel === 'mirror') mirrorDraw(dt);
  if (G.panel === 'count') countDraw(dt);
  if (G.panel === 'map') { PX = 2; try { drawMap(MP.ctx, { classroom: 'school', barn: 'farm', trainride: 'station', moon: 'rocketbase' }[G.scene.id] || G.scene.id, G.t); if (window.mapExtra) mapExtra(MP.ctx, G.t); } finally { PX = 1; } }
}
function cvPoint(c, e) { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * c.width, (e.clientY - r.top) / r.height * c.height]; }
function tile(key, opts = {}) {
  const w = word(key), b = document.createElement('button');
  b.className = 'tile'; b.type = 'button';
  b.innerHTML = `<span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.setAttribute('aria-label', w.id);
  if (opts.icon) iconInto(b, 16, opts.icon);
  if (opts.pressed != null) b.setAttribute('aria-pressed', opts.pressed ? 'true' : 'false');
  b.addEventListener('click', opts.onClick);
  return b;
}

// ---------- Peta (hanya menunjukkan lokasi; ketuk = dengar nama tempat) ----------
const MP = { cv: $('map-cv') };
MP.ctx = MP.cv.getContext('2d');
function goPlace(key) {
  sfx('tap');
  say([{ k: key }]);
  document.querySelectorAll('.map-label').forEach(b => b.classList.toggle('on', b.dataset.key === key));
}
(function mapLabels() {
  const box = $('map-labels');
  Object.entries(MAP_SPOTS).forEach(([key, [x, y]]) => {
    const w = word(key), b = document.createElement('button');
    b.type = 'button'; b.className = 'map-label';
    b.style.left = (x / 160 * 100) + '%'; b.style.top = ((y + 6) / 90 * 100) + '%';
    b.innerHTML = rubyHTML(w.zh, w.py); b.dataset.key = key;
    b.setAttribute('aria-label', w.id);
    b.addEventListener('click', () => goPlace(key));
    box.appendChild(b);
  });
})();
MP.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(MP.cv, e).map(v => v / 2);
  let best = null, bd = 18;
  for (const [key, [sx, sy]] of Object.entries(MAP_SPOTS)) { const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = key; } }
  if (best) goPlace(best);
});

// ---------- Tas ----------
const BG = { sel: -1 };
function bagOpen() { BG.sel = G.bag.length ? 0 : -1; bagRender(); }
function bagRender() {
  const g = $('bag-grid'); g.innerHTML = '';
  for (let i = 0; i < BAG_MAX; i++) {
    const type = G.bag[i], b = document.createElement('button');
    b.type = 'button'; b.className = 'slot';
    if (type) {
      const w = word(type), cvs = document.createElement('canvas');
      cvs.width = 32; cvs.height = 32;
      drawBig(cvs.getContext('2d', { willReadFrequently: true }), 16, 29, 2, (cc, x, y) => drawItem(cc, x, y, type, true));
      b.innerHTML = `<span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`; b.prepend(upscale4(cvs));
      b.setAttribute('aria-label', w.id); b.setAttribute('aria-pressed', i === BG.sel ? 'true' : 'false');
      b.addEventListener('click', () => { BG.sel = i; sfx('tap'); say([{ k: type }]); bagRender(); });
    } else { b.disabled = true; b.classList.add('empty'); b.setAttribute('aria-label', 'Kosong'); }
    g.appendChild(b);
  }
  $('bag-actions').hidden = BG.sel < 0;
  $('bag-empty').hidden = G.bag.length > 0;
}
$('bag-title').addEventListener('click', () => say([{ k: 'bag' }]));
document.querySelectorAll('#p-bag [data-act]').forEach(b => b.addEventListener('click', () => {
  const type = G.bag[BG.sel]; if (!type) return;
  closePanel(true);
  if (b.dataset.act === 'eat') eatItem(type);
  if (b.dataset.act === 'give') startGive(type);
  if (b.dataset.act === 'throw') throwItem(type);
}));

// ---------- Bunga: lihat / tanam / cari ----------
// Bunga digambar dengan satuan 48x56 dan PX = 2 (96x112), lalu dihaluskan 4× (384x448)
const FL = { ci: 0, hl: null, hlT: 0, mode: 'look', stage: 6, target: null, stars: 0, miss: 0, detail: null, cv: $('flower-cv'), src: document.createElement('canvas') };
FL.src.width = 96; FL.src.height = 112;
FL.sctx = FL.src.getContext('2d', { willReadFrequently: true });
FL.ctx = FL.cv.getContext('2d');
const DETAIL_PARTS = ['petal', 'pistil', 'leaf', 'stem', 'root'];
function flowerDetail(part) {
  FL.detail = part;
  $('flower-back').hidden = !part;
  $('flower-parts').querySelectorAll('.tile').forEach((t, i) => t.setAttribute('aria-pressed', DETAIL_PARTS[i] === part ? 'true' : 'false'));
}
const GROW = ['seed', 'root', 'stem', 'leaf', 'petal', 'pistil'];
const PLANT_CARD = () => langCard('种花', 'zhòng huā', 'menanam bunga', "Let's plant a flower", ['はなを うえよう', 'hana o ueyō']);
function flowerSay(part) {
  const ck = FLOWER_COLORS[FL.ci][0];
  FL.hl = part; FL.hlT = 1.8; sfx('tap');
  if (part === 'petal') say([{ k: 'petal' }, { k: ck }]);
  else if (part === 'leaf') say([{ k: 'leaf' }, { k: 'green' }]);
  else if (part === 'flower') { const p = colorFlowerWord(FL.ci); say([{ card: p, zh: p.zh }]); }
  else say([{ k: part }]);
  // mode lihat: bagian yang diketuk dibuka dalam tampilan sendiri
  if (FL.mode === 'look' && DETAIL_PARTS.includes(part)) flowerDetail(part);
}
function flowerAsk() {
  const opts = ['petal', 'pistil', 'leaf', 'stem', 'root'].filter(p => p !== FL.target);
  FL.target = opts[Math.floor(Math.random() * opts.length)]; FL.miss = 0; FL.hl = null;
  const w = WORDS[FL.target];
  say([{ card: langCard(w[0] + '在哪里？', w[1] + ' zài nǎ lǐ', 'Di mana ' + w[2] + '?', 'Where is the ' + WORDS_EN[FL.target] + '?',
    [WORDS_JA[FL.target][0] + 'は どこ？', WORDS_JA[FL.target][1] + ' wa doko?']) }]);
}
function drawStars() {
  $('flower-stars').innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="fstar${i < FL.stars ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('flower-stars').setAttribute('aria-label', FL.stars + ' dari 5 bintang');
}
function flowerMode(m) {
  FL.mode = m; FL.hl = null; flowerDetail(null);
  document.querySelectorAll('#p-flower [data-mode]').forEach(b => b.setAttribute('aria-selected', b.dataset.mode === m ? 'true' : 'false'));
  $('flower-parts').hidden = m !== 'look';
  $('flower-stars').hidden = m !== 'find';
  $('swatches').hidden = m === 'find' || m === 'process';
  procMode(m);
  if (m === 'look') FL.stage = 6;
  if (m === 'grow') { FL.stage = 0; say([{ card: PLANT_CARD() }]); }
  if (m === 'find') { FL.stage = 6; FL.stars = 0; FL.target = null; drawStars(); flowerAsk(); }
}
function flowerOpen(ci) {
  FL.ci = ci || 0;
  const sw = $('swatches'); sw.innerHTML = '';
  FLOWER_COLORS.forEach((col, i) => {
    const b = document.createElement('button');
    b.className = 'swatch'; b.type = 'button'; b.style.setProperty('--sw', col[1]);
    b.setAttribute('aria-label', 'Warna ' + WORDS[col[0]][2]);
    b.setAttribute('aria-pressed', i === FL.ci ? 'true' : 'false');
    b.addEventListener('click', () => {
      FL.ci = i; sfx('pop');
      sw.querySelectorAll('.swatch').forEach((s, j) => s.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
      say([{ k: col[0] }]);
    });
    sw.appendChild(b);
  });
  const pr = $('flower-parts'); pr.innerHTML = '';
  ['petal', 'pistil', 'leaf', 'stem', 'root'].forEach(k => pr.appendChild(tile(k, { onClick: () => flowerSay(k) })));
  flowerMode('look');
}
function flowerDraw(dt) {
  if (FL.hlT > 0) { FL.hlT -= dt; if (FL.hlT <= 0 && !(FL.mode === 'find' && FL.miss >= 2)) FL.hl = null; }
  const c = FL.sctx;
  PX = 2;
  try {
    if (FL.mode === 'process') procDraw(c, dt);
    else if (FL.detail) drawFlowerDetail(c, FL.detail, FLOWER_COLORS[FL.ci], G.t);
    else drawBigFlower(c, FLOWER_COLORS[FL.ci], FL.hl, G.t, FL.stage);
    if (!FL.detail && FL.mode === 'grow' && FL.stage < 6) {
      const b = Math.round(Math.abs(Math.sin(G.t * 4)) * 2);
      px(c, 36, 36 - b, 8, 3, '#4f86e0'); px(c, 42, 33 - b, 2, 3, '#4f86e0'); px(c, 35, 39 - b, 1, 1, '#8fd0f2'); px(c, 37, 41 - b, 1, 1, '#8fd0f2');
    }
  } finally { PX = 1; }
  FL.ctx.drawImage(upscale4(FL.src), 0, 0);
}
function partAt(x, y) {
  const d = Math.hypot(x - 24, y - 15);
  if (d < 4.6) return 'pistil';
  if (d < 13.5 && y < 27) return 'petal';
  if ((x >= 10 && x <= 24 && y >= 28 && y <= 34) || (x >= 24 && x <= 38 && y >= 24 && y <= 30)) return 'leaf';
  if (x >= 20 && x <= 27 && y >= 19 && y <= 41) return 'stem';
  if (y >= 41) return 'root';
  return 'flower';
}
FL.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(FL.cv, e).map(v => v / 8);
  if (FL.mode === 'process') { procNext(); return; }
  if (FL.detail) { flowerSay(FL.detail); return; }
  if (FL.mode === 'grow') {
    if (FL.stage >= 6) { FL.ci = (FL.ci + 1) % FLOWER_COLORS.length; FL.stage = 0; sfx('pop'); say([{ card: PLANT_CARD() }]); return; }
    FL.stage++; sfx(FL.stage === 1 ? 'plant' : 'grow');
    const part = GROW[FL.stage - 1]; FL.hl = part; FL.hlT = 1.2;
    const list = [{ k: part }];
    if (FL.stage === 6) { list.push({ k: 'flower' }, { k: 'pretty' }); setTimeout(() => sfx('sparkle'), 300); }
    say(list);
    return;
  }
  const part = partAt(x, y);
  if (FL.mode === 'look') { flowerSay(part); return; }
  // cari
  if (part === FL.target) {
    FL.hl = part; FL.hlT = 1.2; FL.stars++; drawStars(); sfx('sparkle');
    const done = FL.stars >= 5;
    say(done ? [{ k: 'right' }, { k: 'great' }] : [{ k: 'right' }, { k: part }]);
    setTimeout(() => { if (G.panel !== 'flower' || FL.mode !== 'find') return; if (done) { FL.stars = 0; drawStars(); } flowerAsk(); }, done ? 3200 : 2200);
  } else {
    FL.miss++; sfx('tap');
    say([{ k: 'tryagain' }]);
    if (FL.miss >= 2) { FL.hl = FL.target; FL.hlT = 99; }
  }
});
$('flower-title').addEventListener('click', () => { flowerDetail(null); flowerSay('flower'); });
$('flower-back').addEventListener('click', () => { sfx('tap'); flowerDetail(null); say([{ k: 'back' }]); });
document.querySelectorAll('#p-flower [data-mode]').forEach(b => b.addEventListener('click', () => { sfx('tap'); flowerMode(b.dataset.mode); }));

// ---------- Cermin ----------
// Cermin digambar di 40x40 lalu dihaluskan 4× (160x160) supaya lebih detail
const MI = { tab: 'body', hl: null, hlT: 0, cv: $('mirror-cv'), src: document.createElement('canvas') };
MI.src.width = 40; MI.src.height = 40;
MI.sctx = MI.src.getContext('2d', { willReadFrequently: true });
MI.ctx = MI.cv.getContext('2d');
const HOT = [
  ['nose', [[18, 25, 4, 2]]], ['eyes', [[15, 23, 10, 3]]], ['mouth', [[16, 27, 8, 3]]],
  ['ears', [[12, 23, 3, 5], [25, 23, 3, 5]]], ['hand', [[11, 30, 5, 6], [24, 30, 5, 6]]],
  ['tummy', [[16, 30, 8, 5]]], ['foot', [[15, 35, 10, 4]]], ['hair', [[13, 13, 14, 8]]], ['head', [[13, 13, 14, 17]]],
];
function mirrorOutfit() {
  const o = G.outfit;
  return { hat: o.hat, shoes: o.shoes, shirt: SHIRT_COLORS[o.shirt], pants: PANTS[o.pants][1], scarf: o.scarf, costume: o.costume };
}
function mirrorDraw(dt) {
  const c = MI.sctx;
  px(c, 0, 0, 40, 40, '#dff1fb'); px(c, 0, 36, 40, 4, '#cfe6f2');
  for (let i = 0; i < 10; i++) px(c, 2 + i, 12 - i, 1, 1, '#f4fbff');
  drawPerson(c, 20, 38, { look: 'me', dir: 'down', mood: G.mood, outfit: mirrorOutfit(), nose: true, umbrella: G.outfit.umbrella });
  MI.ctx.drawImage(upscale8(MI.src), 0, 0);
  if (MI.hlT > 0) {
    MI.hlT -= dt;
    if (Math.floor(G.t * 6) % 2 === 0) {
      const h = HOT.find(x => x[0] === MI.hl);
      if (h) { MI.ctx.fillStyle = 'rgba(255,232,110,0.55)'; h[1].forEach(r => MI.ctx.fillRect(r[0] * 8, r[1] * 8, r[2] * 8, r[3] * 8)); }
    }
  }
}
function bodySay(k) { MI.hl = k; MI.hlT = 1.8; sfx('tap'); say([{ k }]); }
MI.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(MI.cv, e).map(v => v / 8);
  const h = HOT.find(([, rs]) => rs.some(r => x >= r[0] && x < r[0] + r[2] && y >= r[1] && y < r[1] + r[3]));
  if (h) { if (MI.tab !== 'body') mirrorTab('body'); bodySay(h[0]); }
});
const CLOTH_ICONS = {
  hat: x => { px(x, 1, 9, 14, 2, '#e9c86a'); px(x, 4, 5, 8, 5, '#e9c86a'); px(x, 4, 8, 8, 1, '#c9473a'); px(x, 2, 11, 12, 1, '#c9a24a'); },
  shirt: x => { const s = SHIRT_COLORS[G.outfit.shirt]; px(x, 4, 3, 8, 11, s[1]); px(x, 1, 3, 3, 5, s[1]); px(x, 12, 3, 3, 5, s[1]); px(x, 6, 3, 4, 1, s[2]); px(x, 4, 13, 8, 1, s[2]); },
  pants: x => { const p = PANTS[G.outfit.pants][1]; px(x, 4, 2, 8, 4, p); px(x, 4, 6, 3, 8, p); px(x, 9, 6, 3, 8, p); px(x, 4, 2, 8, 1, '#5a3a22'); },
  shoes: x => { px(x, 1, 9, 6, 4, '#8a5030'); px(x, 1, 7, 3, 2, '#8a5030'); px(x, 9, 9, 6, 4, '#8a5030'); px(x, 9, 7, 3, 2, '#8a5030'); px(x, 1, 12, 6, 1, '#4a2a18'); px(x, 9, 12, 6, 1, '#4a2a18'); },
  scarf: x => { px(x, 2, 4, 12, 4, '#d64a4a'); px(x, 9, 8, 3, 6, '#b83a3a'); px(x, 2, 5, 12, 1, '#f08a7a'); },
  umbrella: x => { for (let dy = -5; dy <= 0; dy++) { const w = Math.floor(7 * Math.sqrt(1 - dy * dy / 25)); px(x, 8 - w, 7 + dy, w * 2 + 1, 1, '#e2483d'); } px(x, 8, 7, 1, 7, '#5a3a22'); px(x, 6, 13, 2, 1, '#5a3a22'); },
};
function faceIcon(mood) { return x => drawHead(x, 8, 3, LOOKS.me, 'down', { mood }); }
function mirrorTab(tab) {
  MI.tab = tab;
  document.querySelectorAll('#p-mirror [data-tab]').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab ? 'true' : 'false'));
  const g = $('mirror-grid'); g.innerHTML = '';
  if (tab === 'body') ['head', 'hair', 'eyes', 'ears', 'nose', 'mouth', 'hand', 'tummy', 'foot'].forEach(k => g.appendChild(tile(k, { onClick: () => bodySay(k) })));
  if (tab === 'clothes') {
    const o = G.outfit;
    const toggle = k => () => { o[k] = !o[k]; sfx('pop'); say([{ k }]); save(); mirrorTab('clothes'); };
    const colorSay = (key, base, py, id, enBase) => {
      const w = WORDS[key], c = colorJa(key), jb = WORDS_JA[enBase === 'shirt' ? 'shirt' : 'pants'];
      return { card: langCard(w[0] + '的' + base, w[1] + ' de ' + py, id + ' ' + w[2], WORDS_EN[key] + ' ' + enBase, [c[0] + jb[0], c[1] + jb[1]]) };
    };
    g.appendChild(tile('hat', { icon: CLOTH_ICONS.hat, pressed: o.hat, onClick: toggle('hat') }));
    g.appendChild(tile('shirt', { icon: CLOTH_ICONS.shirt, onClick: () => { o.shirt = (o.shirt + 1) % SHIRT_COLORS.length; sfx('pop'); say([colorSay(SHIRT_COLORS[o.shirt][0], '衣服', 'yī fu', 'baju', 'shirt')]); save(); mirrorTab('clothes'); } }));
    g.appendChild(tile('pants', { icon: CLOTH_ICONS.pants, onClick: () => { o.pants = (o.pants + 1) % PANTS.length; sfx('pop'); say([colorSay(PANTS[o.pants][0], '裤子', 'kù zi', 'celana', 'pants')]); save(); mirrorTab('clothes'); } }));
    g.appendChild(tile('shoes', { icon: CLOTH_ICONS.shoes, pressed: o.shoes, onClick: toggle('shoes') }));
    g.appendChild(tile('scarf', { icon: CLOTH_ICONS.scarf, pressed: o.scarf, onClick: toggle('scarf') }));
    g.appendChild(tile('umbrella', { icon: CLOTH_ICONS.umbrella, pressed: o.umbrella, onClick: toggle('umbrella') }));
    if (window.costumeTiles) costumeTiles(g);
  }
  if (tab === 'feel') ['happy', 'sad', 'angry', 'scared', 'sleepy'].forEach(k => g.appendChild(tile(k, {
    icon: faceIcon(k), pressed: G.mood === k,
    onClick: () => { G.mood = k; G.moodT = 25; sfx(k === 'sleepy' ? 'yawn' : 'pop'); say([{ k }]); mirrorTab('feel'); },
  })));
}
function mirrorOpen(tab) { MI.hl = null; mirrorTab(tab || 'body'); }
document.querySelectorAll('#p-mirror [data-tab]').forEach(b => b.addEventListener('click', () => { sfx('tap'); mirrorTab(b.dataset.tab); }));

// ---------- Berhitung (gambar besar bergaris tepi) ----------
const CT = { cv: $('count-cv'), items: [], n: 0, type: null, mode: 'tap', stars: 0, done: false };
CT.ctx = CT.cv.getContext('2d');
const COUNT_TYPES = [
  { d: 'apple', k: 'apple', m: '个', mp: 'gè', s: 3 }, { d: 'bigegg', k: 'egg', m: '个', mp: 'gè', s: 3 },
  { d: 'duck', k: 'duck', m: '只', mp: 'zhī', s: 2 }, { d: 'star', k: 'star', m: '颗', mp: 'kē', s: 3 },
  { d: 'carrot', k: 'carrot', m: '根', mp: 'gēn', s: 3 }, { d: 'flower', k: 'flower', m: '朵', mp: 'duǒ', s: 2 },
  { d: 'car', k: 'car', m: '辆', mp: 'liàng', s: 2 }, { d: 'tomato', k: 'tomato', m: '个', mp: 'gè', s: 3 },
];
function countNew() {
  const N = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 5) : 6 + Math.floor(Math.random() * 5);
  let t; do { t = COUNT_TYPES[Math.floor(Math.random() * COUNT_TYPES.length)]; } while (t === CT.type);
  CT.type = t; CT.n = 0; CT.items = [];
  const per = N > 5 ? Math.ceil(N / 2) : N;
  for (let i = 0; i < N; i++) {
    const row = i < per ? 0 : 1, idx = row ? i - per : i, cnt = row ? N - per : per;
    CT.items.push({ x: 80 - (cnt - 1) * 15 + idx * 30, y: N > 5 ? (row ? 74 : 38) : 58, n: 0, b: 0 });
  }
  $('count-badges').innerHTML = '';
  $('count-next').classList.remove('ready');
  CT.done = false;
  if (CT.mode === 'quiz') { quizChoices(); say([{ k: 'howmany' }]); }
  else say([{ k: 'count' }, { k: 'q_count' }]);
}

// Mini game "有几个？": hitung gambarnya, lalu pilih angka yang benar dari tiga pilihan
function drawCountStars() {
  $('count-stars').innerHTML = [0, 1, 2, 3, 4].map(i => `<span class="fstar${i < CT.stars ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('count-stars').setAttribute('aria-label', CT.stars + ' dari 5 bintang');
}
// angka di tombol: hanzi + pinyin, kata English, atau kana + romaji
const numHTML = v => LANG === 'en' ? `<span class="en">${NUM_EN[v]}</span>` : LANG === 'ja' ? rubyHTML(NUM_JA[v][0], NUM_JA[v][1]) : rubyHTML(NUM_ZH[v], NUM_PY[v]);
function quizChoices() {
  const N = CT.items.length, opts = new Set([N]);
  while (opts.size < 3) opts.add(Math.max(1, Math.min(10, N + Math.floor(Math.random() * 5) - 2)));
  const box = $('count-choices'); box.innerHTML = '';
  [...opts].sort((a, b) => a - b).forEach(v => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'num big';
    b.innerHTML = `${numHTML(v)}<small>${v}</small>`;
    b.setAttribute('aria-label', 'Jawab ' + v);
    b.addEventListener('click', () => answerCount(v, b));
    box.appendChild(b);
  });
}
function answerCount(v, b) {
  if (CT.done) return;
  if (v !== CT.items.length) { sfx('tap'); b.classList.add('wrong'); say([{ k: 'n' + v }, { k: 'countagain' }]); return; }
  CT.done = true; CT.stars++; drawCountStars(); b.classList.add('right'); sfx('sparkle');
  $('count-next').classList.add('ready');
  const cw = countWord(v, CT.type.k, CT.type.m, CT.type.mp), fin = CT.stars >= 5;
  say(fin ? [{ k: 'right' }, { card: cw, zh: cw.zh }, { k: 'great' }] : [{ k: 'right' }, { card: cw, zh: cw.zh }]);
  setTimeout(() => {
    if (G.panel !== 'count' || CT.mode !== 'quiz') return;
    if (fin) { CT.stars = 0; drawCountStars(); }
    countNew();
  }, fin ? 3600 : 2600);
}
function countMode(m) {
  CT.mode = m;
  document.querySelectorAll('#p-count [data-cmode]').forEach(b => b.setAttribute('aria-selected', b.dataset.cmode === m ? 'true' : 'false'));
  $('numrow').hidden = m !== 'tap';
  $('count-quiz').hidden = m !== 'quiz';
  if (m === 'quiz') { CT.stars = 0; drawCountStars(); }
  countNew();
}
document.querySelectorAll('#p-count [data-cmode]').forEach(b => b.addEventListener('click', () => { sfx('tap'); countMode(b.dataset.cmode); }));
function countDraw(dt) {
  const c = CT.ctx;
  px(c, 0, 0, 160, 80, '#dff0f8');
  for (let y = 44; y < 80; y += 36) px(c, 0, y, 160, 1, '#cfe4ef');
  for (const it of CT.items) {
    if (it.b > 0) it.b -= dt;
    const bo = it.b > 0 ? Math.round(Math.sin(it.b / 0.35 * Math.PI) * 5) : 0;
    oval(c, it.x, it.y - 1, 12, 3, it.n ? '#bfe3a0' : '#efe4cc');
    drawBig(c, it.x, it.y - bo, CT.type.s, (cc, x, y) => drawFood(cc, x, y, CT.type.d));
  }
}
CT.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(CT.cv, e);
  let best = null, bd = 17;
  for (const it of CT.items) { const d = Math.hypot(it.x - x, it.y - 13 - y); if (d < bd) { bd = d; best = it; } }
  if (!best) return;
  best.b = 0.35;
  if (best.n) { sfx('tap'); say([{ k: 'n' + best.n }]); return; }
  best.n = ++CT.n; sfx('pop');
  const bg = document.createElement('span');
  bg.className = 'badge'; bg.textContent = LANG !== 'zh' ? best.n : NUM_ZH[best.n];
  bg.style.left = ((best.x + 13) / 160 * 100) + '%'; bg.style.top = ((best.y - 6) / 80 * 100) + '%';
  $('count-badges').appendChild(bg);
  if (CT.n === CT.items.length && CT.mode === 'quiz') say([{ k: 'n' + CT.n }, { k: 'howmany' }]);
  else if (CT.n === CT.items.length) {
    const cw = countWord(CT.n, CT.type.k, CT.type.m, CT.type.mp);
    say([{ k: 'n' + CT.n }, { card: cw, zh: cw.zh }, { k: 'great' }]);
    sfx('sparkle'); $('count-next').classList.add('ready');
  } else say([{ k: 'n' + CT.n }]);
});
$('count-next').addEventListener('click', () => { sfx('pop'); countNew(); });
$('count-title').addEventListener('click', () => say([{ k: 'count' }]));
(function numRow() {
  const r = $('numrow');
  for (let i = 1; i <= 10; i++) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'num';
    b.innerHTML = `${numHTML(i)}<small>${i}</small>`;
    b.setAttribute('aria-label', 'Angka ' + i);
    b.addEventListener('click', () => { sfx('tap'); say([{ k: 'n' + i }]); });
    r.appendChild(b);
  }
})();

// ---------- Orang tua ----------
function joinPy(py) {
  return py.split(' ').map((s, i) => (i > 0 && /^[aeoāáǎàēéěèōóǒò]/i.test(s) ? "'" : '') + s).join(py.split(' ').length > 4 ? ' ' : '');
}
(function buildParent() {
  const list = $('theme-list');
  THEMES.forEach((th, ti) => {
    const sec = document.createElement('section');
    sec.className = 'theme';
    sec.innerHTML = `<h3><span class="theme-no">${String(ti + 1).padStart(2, '0')}</span>${th.name}</h3><p>${th.where}</p><div class="chips"></div>`;
    const chips = sec.querySelector('.chips');
    th.words.forEach(k => {
      const w = word(k), b = document.createElement('button');
      b.type = 'button'; b.className = 'chip';
      b.innerHTML = `<span class="chip-zh">${w.zh}</span><span class="chip-py">${LANG === 'zh' ? joinPy(w.py) : w.py}</span><span class="chip-id">${w.id}</span>`;
      b.addEventListener('click', () => { Snd.init(); say([{ k }]); });
      chips.appendChild(b);
    });
    list.appendChild(sec);
  });
  $('word-total').textContent = Object.keys(WORDS).length;
})();
function syncParentSettings() { $('set-music').checked = Snd.on; $('set-id').checked = Talk.alsoId; $('set-hd').checked = G.hd; $('set-lang').value = LANG; }
// ganti bahasa: simpan lalu muat ulang supaya semua kata, tombol, lagu, dan cerita ikut berganti
$('set-lang').addEventListener('change', e => {
  LANG = ['en', 'ja'].includes(e.target.value) ? e.target.value : 'zh'; save();
  Talk.cancel(); location.reload();
});
$('set-hd').addEventListener('change', e => { G.hd = e.target.checked; save(); });
$('card-reset').addEventListener('click', () => { G.cardPos = null; placeCard(); save(); sfx('pop'); });
$('set-music').addEventListener('change', e => { Snd.init(); Snd.setMusic(e.target.checked); updateIcons(); save(); });
$('set-id').addEventListener('change', e => { Talk.alsoId = e.target.checked; save(); });
$('voice-test').addEventListener('click', () => { Snd.init(); Talk.pick(); $('voice-status').textContent = Talk.status().text; say([{ k: 'hello', zh: '你好！我是' + CHILD + '。' }]); });

const pb = $('btn-parent');
let lpTimer = null;
pb.addEventListener('pointerdown', () => { pb.classList.add('holding'); lpTimer = setTimeout(() => { pb.classList.remove('holding'); openPanel('parent'); }, 1000); });
['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => pb.addEventListener(ev, () => { clearTimeout(lpTimer); pb.classList.remove('holding'); }));
pb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel('parent'); } });
