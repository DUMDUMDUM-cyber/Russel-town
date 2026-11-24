// Dua permainan baru:
//  1. Puzzle Besar (Toko Mainan): papan 7×4. Ketuk potongan untuk memutarnya sampai jalan dari kiri ke kanan tersambung;
//     lalu kereta / mobil / perahu berjalan. Tema bergantian, tiap tingkat makin banyak potongan yang perlu diputar.
//  2. Balap Robot (Bengkel Robot): robot Russel lomba lari dengan 2 robot lain. Jawab benar → robot Russel melesat.
//     Pertanyaan singkat: berhitung, tambah sederhana, warna, benda.

// ================= KATA BARU =================
Object.assign(WORDS, {
  bigpuzzle: ['大拼图', 'dà pīn tú', 'puzzle besar'],
  connectpath: ['把路连起来', 'bǎ lù lián qǐ lái', 'sambungkan jalannya'],
  turnit: ['转一转', 'zhuàn yi zhuàn', 'putar-putar'],
  connected: ['连上了！', 'lián shàng le', 'tersambung!'],
  rail: ['铁轨', 'tiě guǐ', 'rel kereta'],
  road: ['马路', 'mǎ lù', 'jalan raya'],
  boatgo: ['小船出发了！', 'xiǎo chuán chū fā le', 'perahunya berangkat!'],
  nextlevel: ['下一关', 'xià yì guān', 'tingkat berikutnya'],
  robotrace: ['机器人赛跑', 'jī qì rén sài pǎo', 'balap lari robot'],
  racetrack: ['跑道', 'pǎo dào', 'lintasan lari'],
  readygo: ['预备——跑！', 'yù bèi —— pǎo', 'siap… lari!'],
  whichis: ['哪个是', 'nǎ ge shì', 'yang mana'],
  addup: ['一共几个？', 'yí gòng jǐ ge', 'semuanya ada berapa?'],
  runfast: ['跑得快！', 'pǎo de kuài', 'larinya cepat!'],
  firstplace: ['第一名！', 'dì yī míng', 'juara satu!'],
  secondplace: ['第二名', 'dì èr míng', 'juara dua'],
});
Object.assign(WORDS_EN, {
  bigpuzzle: 'big puzzle', connectpath: 'Connect the path', turnit: 'Turn it', connected: 'Connected!', rail: 'train track', road: 'road',
  boatgo: 'The boat sets off!', nextlevel: 'next level', robotrace: 'robot race', racetrack: 'race track', readygo: 'Ready, set, go!',
  whichis: 'Which one is', addup: 'How many altogether?', runfast: 'So fast!', firstplace: 'First place!', secondplace: 'second place',
});
Object.assign(WORDS_JA, {
  bigpuzzle: ['おおきな パズル', 'ōkina pazuru'], connectpath: ['みちを つなげよう', 'michi o tsunageyō'], turnit: ['まわしてね', 'mawashite ne'],
  connected: ['つながった！', 'tsunagatta!'], rail: ['せんろ', 'senro'], road: ['どうろ', 'dōro'], boatgo: ['ふねが しゅっぱつ！', 'fune ga shuppatsu!'],
  nextlevel: ['つぎの ステージ', 'tsugi no sutēji'], robotrace: ['ロボット かけっこ', 'robotto kakekko'], racetrack: ['トラック', 'torakku'],
  readygo: ['よーい、どん！', 'yōi, don!'], whichis: ['どれが', 'dore ga'], addup: ['ぜんぶで いくつ？', 'zenbu de ikutsu?'], runfast: ['はやい！', 'hayai!'],
  firstplace: ['いっとうしょう！', 'ittōshō!'], secondplace: ['にとうしょう', 'nitōshō'],
});

// ================= 1. PUZZLE BESAR =================
const PZ_W = 280, PZ_H = 160, PZ_T = 40, PZ_C = 7, PZ_R = 4;
const PZ_V = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // U, kanan, bawah, kiri
// jalan: sel awal (selalu kolom 0) + langkah sampai kolom 6
const PZ_LEVELS = [
  { theme: 'train', start: [0, 1], moves: 'EEESEEE', mix: 3 },
  { theme: 'road', start: [0, 0], moves: 'ESSEEENEE', mix: 4 },
  { theme: 'river', start: [0, 3], moves: 'EENNEESSEE', mix: 5 },
  { theme: 'train', start: [0, 0], moves: 'EESSSEENNNEE', mix: 6 },
  { theme: 'road', start: [0, 2], moves: 'ENNEESSSEENE', mix: 7 },
  { theme: 'river', start: [0, 1], moves: 'ESSEENNNEESSE', mix: 8 },
];
const PZ_THEME = {
  train: { ground: ['#8fd06a', '#87c862'], deco: ['tree', 'flower', 'cow', 'sheep', 'house', 'horse'], word: 'rail', go: [{ k: 'traingo' }, { k: 'choochoo' }] },
  road: { ground: ['#a3d47e', '#9acc76'], deco: ['house', 'tree', 'flower', 'dog', 'cat', 'balloon'], word: 'road', go: [{ k: 'drive' }, { k: 'beep' }] },
  river: { ground: ['#a8d98c', '#9fd184'], deco: ['duck', 'tree', 'flower', 'rabbit', 'bird', 'chicken'], word: 'river', go: [{ k: 'boatgo' }] },
};
const PZ = { cv: $('pz-cv'), src: document.createElement('canvas'), lv: 0, tiles: [], path: [], theme: 'train', state: 'play', veh: 0, idle: 0, flash: 0, chain: 0, pts: null };
PZ.src.width = PZ_W; PZ.src.height = PZ_H;
PZ.ctx = PZ.cv.getContext('2d'); PZ.sctx = PZ.src.getContext('2d');
PANELS.puzzle = $('p-puzzle');
PANELS.puzzle.addEventListener('pointerdown', e => { if (e.target === PANELS.puzzle) closePanel(); });

// potongan jalan (terbuka atas-bawah / atas-kanan), dibuat sekali per tema lalu diputar saat digambar
const PZ_ART = {};
function pzPiece(theme, curve) {
  const key = theme + (curve ? 'C' : 'S');
  if (PZ_ART[key]) return PZ_ART[key];
  const cv = document.createElement('canvas'); cv.width = cv.height = PZ_T;
  const c = cv.getContext('2d'), r = rng(theme.length * 7 + (curve ? 3 : 1));
  for (let y = 0; y < PZ_T; y++) for (let x = 0; x < PZ_T; x++) {
    // d = jarak ke garis tengah jalan (−20…20), s = jarak sepanjang jalan
    let d, s;
    if (!curve) { d = x + 0.5 - 20; s = y + 0.5; }
    else { const dx = x + 0.5 - 40, dy = y + 0.5, rr = Math.hypot(dx, dy); d = rr - 20; s = Math.atan2(dy, -dx) * 20; }
    const ad = Math.abs(d);
    let col = null;
    if (theme === 'train') {
      if (ad < 11) col = r() < 0.3 ? '#a89a82' : '#b9ab92';
      if (ad < 10 && ((s % 7) + 7) % 7 < 3) col = '#8a5a35';
      if (ad >= 5.5 && ad < 7.5) col = ad < 6.5 ? '#c9d2dc' : '#7d8a98';
    } else if (theme === 'road') {
      if (ad < 12) col = r() < 0.25 ? '#676b74' : '#6f737c';
      if (ad >= 10.5 && ad < 11.8) col = '#e8e4d8';
      if (ad < 1.2 && ((s % 10) + 10) % 10 < 5) col = '#f4cf3a';
    } else {
      if (ad < 13) col = '#d8b880';
      if (ad < 11) col = '#5fb0e8';
      if (ad < 9 && (((s + Math.round(d) * 3) % 9) + 9) % 9 < 1) col = '#a8dcf8';
    }
    if (col) { c.fillStyle = col; c.fillRect(x, y, 1, 1); }
  }
  return (PZ_ART[key] = cv);
}
const pzOpen = t => t.kind === 'straight' ? [t.rot % 4, (t.rot + 2) % 4] : [t.rot % 4, (t.rot + 1) % 4];
const pzOk = t => { const o = pzOpen(t); return o.includes(t.need[0]) && o.includes(t.need[1]); };

function pzLevel(n) {
  const L = PZ_LEVELS[n % PZ_LEVELS.length], round = Math.floor(n / PZ_LEVELS.length), flipY = round % 2 === 1;
  const r = rng(1000 + n * 17);
  const cells = [[L.start[0], flipY ? PZ_R - 1 - L.start[1] : L.start[1]]];
  for (const m of L.moves) { const [x, y] = cells[cells.length - 1], d = 'NESW'.indexOf(m), dy = PZ_V[d][1] * (flipY ? -1 : 1); cells.push([x + PZ_V[d][0], y + dy]); }
  const dirTo = (a, b) => PZ_V.findIndex(v => v[0] === b[0] - a[0] && v[1] === b[1] - a[1]);
  PZ.theme = L.theme; PZ.tiles = []; PZ.path = [];
  const at = {};
  cells.forEach((p, i) => {
    const a = i === 0 ? 3 : dirTo(p, cells[i - 1]), b = i === cells.length - 1 ? 1 : dirTo(p, cells[i + 1]);
    const straight = (a + 2) % 4 === b, kind = straight ? 'straight' : 'curve';
    let rot = straight ? a % 2 : [0, 1, 2, 3].find(k => [k, (k + 1) % 4].includes(a) && [k, (k + 1) % 4].includes(b));
    const t = { c: p[0], r: p[1], kind, rot, vis: rot, need: [a, b], fixed: i === 0 || i === cells.length - 1, end: i === 0 ? 'start' : i === cells.length - 1 ? 'end' : null, lock: false, i };
    PZ.tiles.push(t); PZ.path.push(t); at[p[0] + ',' + p[1]] = t;
  });
  // acak putaran: makin tinggi tingkat, makin banyak potongan
  const mids = PZ.path.filter(t => !t.fixed), mix = Math.min(mids.length, round > 0 ? mids.length : L.mix);
  shuffledR(mids, r).slice(0, mix).forEach(t => {
    const wrong = t.kind === 'straight' ? [t.rot + 1] : [1, 2, 3].map(k => t.rot + k);
    t.rot = wrong[Math.floor(r() * wrong.length)] % 4; t.vis = t.rot; t.mix = true;
  });
  // hiasan di sel kosong
  const T = PZ_THEME[L.theme];
  for (let y = 0; y < PZ_R; y++) for (let x = 0; x < PZ_C; x++) {
    if (at[x + ',' + y]) continue;
    PZ.tiles.push({ c: x, r: y, kind: 'deco', deco: r() < 0.55 ? T.deco[Math.floor(r() * T.deco.length)] : null });
  }
  PZ.state = 'play'; PZ.veh = 20; PZ.idle = 0; PZ.flash = 0; PZ.chain = 0;
  PZ.pts = pzPoints();
  pzCheck(true);
}
function shuffledR(a, r) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

// titik-titik jalan untuk kendaraan (dari tepi kiri sampai tepi kanan)
function pzPoints() {
  const pts = [];
  PZ.path.forEach(t => {
    const cx = t.c * PZ_T + 20, cy = t.r * PZ_T + 20, [a, b] = t.need;
    const A = [cx + PZ_V[a][0] * 20, cy + PZ_V[a][1] * 20], B = [cx + PZ_V[b][0] * 20, cy + PZ_V[b][1] * 20];
    if ((a + 2) % 4 === b) { for (let k = 0; k < 8; k++) pts.push([A[0] + (B[0] - A[0]) * k / 8, A[1] + (B[1] - A[1]) * k / 8]); }
    else {
      const K = [cx + (PZ_V[a][0] + PZ_V[b][0]) * 20, cy + (PZ_V[a][1] + PZ_V[b][1]) * 20];
      let a0 = Math.atan2(A[1] - K[1], A[0] - K[0]), a1 = Math.atan2(B[1] - K[1], B[0] - K[0]);
      if (a1 - a0 > Math.PI) a1 -= Math.PI * 2; if (a0 - a1 > Math.PI) a1 += Math.PI * 2;
      for (let k = 0; k < 8; k++) { const q = a0 + (a1 - a0) * k / 8; pts.push([K[0] + Math.cos(q) * 20, K[1] + Math.sin(q) * 20]); }
    }
  });
  const last = PZ.path[PZ.path.length - 1];
  pts.push([last.c * PZ_T + 40, last.r * PZ_T + 20], [last.c * PZ_T + 80, last.r * PZ_T + 20]);
  const len = [0];
  for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, len, total: len[len.length - 1] };
}
function pzAt(s) {
  const { pts, len } = PZ.pts;
  s = Math.max(0, Math.min(len[len.length - 1], s));
  let i = 1; while (i < len.length - 1 && len[i] < s) i++;
  const k = (s - len[i - 1]) / Math.max(0.001, len[i] - len[i - 1]);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k, Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])];
}

// rantai dari kiri: potongan yang sudah benar dikunci berurutan
function pzCheck(quiet) {
  let n = 0;
  while (n < PZ.path.length && pzOk(PZ.path[n])) n++;
  const fresh = PZ.path.slice(0, n).filter(t => !t.lock);
  fresh.forEach(t => { t.lock = true; t.glow = 1; });
  PZ.chain = n;
  if (quiet) return;
  if (n === PZ.path.length) {
    PZ.state = 'go'; PZ.flash = 1.2;
    sfx('sparkle'); say([{ k: 'connected' }].concat(PZ_THEME[PZ.theme].go));
  } else if (fresh.some(t => !t.fixed)) {
    sfx('chime');
    const last = fresh[fresh.length - 1];
    say([{ k: last.kind === 'straight' ? 'straight' : 'curve' }]);
  }
}
function pzTap(x, y) {
  PZ.idle = 0;
  if (PZ.state === 'done') { pzNext(); return; }
  if (PZ.state !== 'play') return;
  const t = PZ.tiles.find(q => q.c === Math.floor(x / PZ_T) && q.r === Math.floor(y / PZ_T));
  if (!t) return;
  if (t.kind === 'deco') { if (t.deco) { sfx('pop'); say([{ k: t.deco }]); t.hop = 1; } return; }
  if (t.lock || t.fixed) { sfx('tap'); say([{ k: t.end ? 'station' : t.kind === 'straight' ? 'straight' : 'curve' }]); t.hop = 0.6; return; }
  t.rot = (t.rot + 1) % 4; t.spin = 1; sfx('tap');
  pzCheck(false);
}
function pzNext() {
  PZ.lv++; EX.puzLv = PZ.lv; exSave();
  pzLevel(PZ.lv); pzHead();
  say([{ k: 'nextlevel' }, { k: PZ_THEME[PZ.theme].word }, { k: 'connectpath' }]);
}
function pzHead() {
  const w = word('bigpuzzle'); $('pz-title').innerHTML = rubyHTML(w.zh, w.py);
  const k = PZ.lv % PZ_LEVELS.length;
  $('pz-lv').innerHTML = PZ_LEVELS.map((_, i) => `<span class="fstar${i < k ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('pz-lv').setAttribute('aria-label', 'Tingkat ' + (PZ.lv + 1));
  $('pz-next').hidden = PZ.state !== 'done';
}
function pzStart() {
  PZ.lv = EX.puzLv || 0;
  openPanel('puzzle');
  pzLevel(PZ.lv); pzHead();
  say([{ k: 'bigpuzzle' }, { k: PZ_THEME[PZ.theme].word }, { k: 'connectpath' }]);
}
PZ.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(PZ.cv, e).map(v => v / (PZ.cv.width / PZ_W));
  pzTap(x, y);
});
$('pz-title').addEventListener('click', () => say([{ k: 'connectpath' }]));
$('pz-next').addEventListener('click', () => { sfx('tap'); pzNext(); });

// kendaraan, digambar menghadap kanan lalu diputar mengikuti jalan
function pzVehicle(c, x, y, ang, draw) {
  c.save(); c.translate(Math.round(x), Math.round(y)); c.rotate(ang); draw(c); c.restore();
}
const PZ_VEH = {
  engine: c => { px(c, -9, -5, 14, 10, '#e2483d'); px(c, -9, -5, 14, 2, '#ff8a7a'); px(c, -9, -7, 7, 14, '#a8352b'); px(c, -8, -4, 5, 8, '#bfe3f2'); px(c, 3, -2, 4, 4, '#3a3f4a'); px(c, 7, -3, 2, 6, '#f4cf3a'); },
  wagon: col => c => { px(c, -7, -5, 14, 10, col[0]); px(c, -7, -5, 14, 2, col[2]); px(c, -7, 3, 14, 2, col[1]); px(c, -4, -3, 3, 6, '#fff2c8'); px(c, 1, -3, 3, 6, '#fff2c8'); px(c, -9, -1, 2, 2, '#3a3f4a'); },
  car: c => { const T = bdTone((EX.car || {}).color) || ['#4f86e0', '#2f5bab', '#8fb4ee']; px(c, -8, -5, 16, 10, T[0]); px(c, -8, -5, 16, 2, T[2]); px(c, -3, -4, 7, 8, '#bfe3f2'); px(c, -1, -4, 2, 8, T[0]); px(c, -9, -6, 3, 2, '#2a2a2e'); px(c, 5, -6, 3, 2, '#2a2a2e'); px(c, -9, 4, 3, 2, '#2a2a2e'); px(c, 5, 4, 3, 2, '#2a2a2e'); px(c, 7, -3, 1, 2, '#fff2a8'); px(c, 7, 1, 1, 2, '#fff2a8'); },
  boat: c => { px(c, -9, -4, 16, 8, '#c08a52'); px(c, 7, -3, 2, 6, '#c08a52'); px(c, -8, -3, 14, 6, '#e8b878'); px(c, -2, -1, 2, 2, '#5a3a22'); px(c, -1, -9, 1, 8, '#5a3a22'); px(c, 0, -9, 6, 6, '#ffffff'); px(c, 0, -9, 6, 1, '#e2483d'); },
};

PANEL_HOOK.puzzle = dt => {
  const c = PZ.sctx, t = G.t, T = PZ_THEME[PZ.theme];
  if (!PZ.pts) return;
  PZ.flash = Math.max(0, PZ.flash - dt); PZ.idle += dt;
  // tanah per sel (kotak-kotak samar supaya sel terlihat)
  PZ.tiles.forEach(q => {
    const x = q.c * PZ_T, y = q.r * PZ_T;
    px(c, x, y, PZ_T, PZ_T, T.ground[(q.c + q.r) % 2]);
    const rr = rng(q.c * 31 + q.r * 7 + 3);
    for (let i = 0; i < 6; i++) px(c, x + Math.floor(rr() * 38), y + Math.floor(rr() * 38), 2, 1, 'rgba(60,110,40,0.25)');
  });
  // potongan jalan
  const next = PZ.path[PZ.chain];
  PZ.path.forEach(q => {
    q.spin = Math.max(0, (q.spin || 0) - dt * 6); q.glow = Math.max(0, (q.glow || 0) - dt * 1.5); q.hop = Math.max(0, (q.hop || 0) - dt * 3);
    const x = q.c * PZ_T, y = q.r * PZ_T, ang = (q.rot - q.spin) * Math.PI / 2;
    c.save(); c.translate(x + 20, y + 20); c.rotate(ang); c.drawImage(pzPiece(PZ.theme, q.kind === 'curve'), -20, -20); c.restore();
    // bingkai: potongan yang bisa diputar diberi sudut putih; yang terkunci berkilau sebentar
    if (!q.lock && !q.fixed) { const k = '#ffffff'; px(c, x + 1, y + 1, 4, 1, k); px(c, x + 1, y + 1, 1, 4, k); px(c, x + 35, y + 1, 4, 1, k); px(c, x + 38, y + 1, 1, 4, k); px(c, x + 1, y + 38, 4, 1, k); px(c, x + 1, y + 35, 1, 4, k); px(c, x + 35, y + 38, 4, 1, k); px(c, x + 38, y + 35, 1, 4, k); }
    if (q.glow > 0) { c.fillStyle = `rgba(255,242,168,${(q.glow * 0.55).toFixed(2)})`; c.fillRect(x, y, PZ_T, PZ_T); }
    // petunjuk: setelah lama diam, potongan berikutnya berkedip kuning
    if (PZ.state === 'play' && q === next && !q.fixed && PZ.idle > 6 && Math.floor(t * 3) % 2) { c.strokeStyle = '#ffd84a'; c.lineWidth = 2; c.strokeRect(x + 1, y + 1, PZ_T - 2, PZ_T - 2); }
  });
  if (PZ.state === 'play' && PZ.idle > 12) { PZ.idle = 6.01; say([{ k: 'turnit' }]); }
  // hiasan
  PZ.tiles.forEach(q => {
    if (q.kind !== 'deco' || !q.deco || !ST_ART[q.deco]) return;
    q.hop = Math.max(0, (q.hop || 0) - dt * 3);
    const keep = PX; PX = 0.75;
    try { ST_ART[q.deco](c, (q.c * PZ_T + 20) / 0.75, (q.r * PZ_T + 37 - Math.round(Math.sin(q.hop * Math.PI) * 5)) / 0.75); } catch (e) {} finally { PX = keep; }
  });
  // stasiun / rumah / dermaga di ujung kiri dan kanan
  [PZ.path[0], PZ.path[PZ.path.length - 1]].forEach((q, i) => {
    const x = q.c * PZ_T + (i ? 22 : 2), y = q.r * PZ_T + 2;
    px(c, x, y, 16, 9, PZ.theme === 'river' ? '#c08a52' : i ? '#4f86e0' : '#e2483d'); px(c, x - 1, y, 18, 2, '#ffffff');
    px(c, x + 3, y + 3, 4, 4, '#fff2c8'); px(c, x + 9, y + 3, 4, 4, '#fff2c8');
    if (i) { px(c, x + 15, y - 8, 1, 9, '#5a3a22'); for (let k = 0; k < 3; k++) for (let j = 0; j < 2; j++) px(c, x + 16 + k * 2, y - 8 + j * 2, 2, 2, (k + j) % 2 ? '#2a2a2e' : '#ffffff'); }
  });
  // kendaraan
  if (PZ.state === 'go') {
    PZ.veh += dt * 46;
    if (PZ.veh >= PZ.pts.total) { PZ.state = 'done'; PZ.flash = 1.4; addCoins(2, G.boy.x, G.boy.y - 30); say([{ k: 'arrived' }, { k: 'great' }]); pzHead(); }
  }
  if (PZ.state !== 'done') {
    const parts = PZ.theme === 'train' ? [[0, PZ_VEH.engine], [-17, PZ_VEH.wagon(RB_TONE.blue)], [-33, PZ_VEH.wagon(RB_TONE.yellow)]]
      : PZ.theme === 'road' ? [[0, PZ_VEH.car]] : [[0, PZ_VEH.boat]];
    const bob = PZ.state === 'go' ? 0 : Math.sin(t * 3) * 0.6;
    parts.forEach(([off, fn]) => { const s = PZ.veh + off; if (s < 0) return; const [x, y, a] = pzAt(s); pzVehicle(c, x, y + bob, a, fn); });
    if (PZ.state === 'go' && PZ.theme === 'train' && Math.floor(t * 6) % 2) { const [x, y] = pzAt(PZ.veh + 4); disc(c, x, y - 10, 2, 'rgba(255,255,255,0.85)'); }
  }
  if (PZ.flash > 0) for (let i = 0; i < 10; i++) { const a = t * 2 + i * 0.63; drawStar(c, Math.round(140 + Math.cos(a) * 110), Math.round(80 + Math.sin(a) * 60), i % 2 ? '#ffd84a' : '#fff2a8'); }
  if (PZ.state === 'done') { disc(c, 140, 80, 22, 'rgba(255,255,255,0.75)'); for (let i = 0; i < 5; i++) drawStar(c, 124 + i * 8, 80 + (i % 2 ? -4 : 2), '#f4cf3a'); }
  PZ.ctx.drawImage(upscale4(PZ.src), 0, 0);
};

// ================= 2. BALAP ROBOT =================
const RACE_RIVALS = [
  { leg: 'rwheel', body: 'rbround', arm: 'raball', head: 'rhround', color: 'pink' },
  { leg: 'rtrack', body: 'rbtall', arm: 'raclaw', head: 'rhears', color: 'green' },
];
const RACE_ME = () => EX.robot || { leg: 'rleg', body: 'rbbox', arm: 'rabig', head: 'rhbox', color: 'blue' };
const RACE_OBJS = ['apple', 'banana', 'star', 'fish', 'ball', 'duck', 'flower', 'carrot'];
const RACE_MW = { apple: ['个', 'gè'], banana: ['根', 'gēn'], star: ['颗', 'kē'], fish: ['条', 'tiáo'], ball: ['个', 'gè'], duck: ['只', 'zhī'], flower: ['朵', 'duǒ'], carrot: ['根', 'gēn'] };
const RACE_COLORS = { red: '#e2483d', blue: '#4f86e0', yellow: '#f4cf3a', green: '#58a84a', orange: '#f08a32', pink: '#f39ac0', purple: '#9b6bd6' };
const RACE_THINGS = ['apple', 'banana', 'car', 'dog', 'cat', 'fish', 'ball', 'house', 'tree', 'bus', 'plane', 'duck', 'flower', 'book', 'hat', 'sun'];
const pickR = a => a[Math.floor(Math.random() * a.length)];
// 3 pilihan acak termasuk jawaban
const raceOpts = (ans, pool) => shuffled([ans].concat(shuffled(pool.filter(k => k !== ans)).slice(0, 2)));

function raceQuestions() {
  // selalu ada hitungan, penjumlahan, warna, dan benda; dua sisanya acak
  const types = ['count', 'add', 'color', 'thing', pickR(['count', 'add']), pickR(['color', 'thing'])];
  const nums = [1, 2, 3, 4, 5, 6].map(n => 'n' + n);
  return shuffled(types).map((type, i) => {
    if (type === 'count') {
      const n = 1 + Math.floor(Math.random() * 5), obj = pickR(RACE_OBJS), mw = RACE_MW[obj];
      return { type, n, obj, ask: 'howmany', askList: () => [{ k: obj }, { k: 'howmany' }], opts: raceOpts('n' + n, nums), answer: 'n' + n,
        sayList: () => { const cw = countWord(n, obj, mw[0], mw[1]); return [{ card: cw, zh: cw.zh }]; } };
    }
    if (type === 'add') {
      const a = 1 + Math.floor(Math.random() * 3), b = 1 + Math.floor(Math.random() * (5 - a)), obj = pickR(RACE_OBJS), mw = RACE_MW[obj];
      return { type, a, b, obj, ask: 'addup', opts: raceOpts('n' + (a + b), nums), answer: 'n' + (a + b),
        sayList: () => { const cw = countWord(a + b, obj, mw[0], mw[1]); return [{ card: cw, zh: cw.zh }]; } };
    }
    if (type === 'color') {
      const col = pickR(Object.keys(RACE_COLORS)), thing = pickR(['balloon', 'ball', 'hat']);
      return { type, col, thing, ask: 'whatcolor', opts: raceOpts(col, Object.keys(RACE_COLORS)), answer: col };
    }
    const k = pickR(RACE_THINGS);
    return { type: 'thing', ask: 'whichis', askList: () => [{ k: 'whichis' }, { k }], opts: raceOpts(k, RACE_THINGS), answer: k };
  });
}

BUILD.race = {
  title: 'robotrace', doneWord: 'runfast',
  steps(S) {
    S.pos = [0, 0, 0]; S.goal = [0, 0, 0]; S.raw = [0, 0, 0]; S.trip = 0; S.winner = -1;
    // robot lain: jawaban benar Russel tidak pernah membuat mereka finis (maks 0.96); hanya banyak salah yang bisa
    const rival = (i, add) => { S.raw[i] += add; S.goal[i] = S.raw[i] >= 1.12 ? 1 : Math.min(0.96, S.raw[i]); };
    const qs = raceQuestions();
    return qs.map((q, i) => Object.assign(q, {
      key: 'q' + i, sfx: 'chime',
      miss(S, k) {
        // salah: robot Russel tersandung, robot lain maju. Banyak salah → robot lain bisa sampai finis duluan
        S.shake = 0.5; S.trip = 0.8; sfx('bounce');
        rival(1, 0.09); rival(2, 0.07);
        say([{ k }, { k: 'notthis' }].concat(bdAsk(S, S.steps[S.step])));
      },
      then(S) {
        // robot Russel maju 1/6; dua robot lain maju sedikit (acak)
        S.goal[0] = Math.min(1, S.goal[0] + 1 / 6);
        rival(1, 0.1 + Math.random() * 0.04); rival(2, 0.08 + Math.random() * 0.04);
      },
    }));
  },
  update(dt, S) {
    if (!S.pos) return;
    S.trip = Math.max(0, S.trip - dt);
    for (let i = 0; i < 3; i++) { const d = S.goal[i] - S.pos[i]; S.pos[i] += Math.sign(d) * Math.min(Math.abs(d), dt * (i ? 0.12 : 0.2)); }
    if (S.winner < 0) { const w = [1, 2].find(i => S.pos[i] >= 0.995); if (w != null) { S.winner = w; sfx('chime'); } }
  },
  draw(c, t, S) {
    if (!S.pos) return;
    // langit, penonton, lintasan (tiga jalur: belakang di atas, robot Russel paling depan)
    bdSky(c, [150, 212, 245], [214, 238, 250], 26);
    for (let x = 0; x < 160; x += 6) { const col = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a', '#f39ac0'][(x / 6) % 5]; disc(c, x + 3, 21 - (Math.floor(t * 4 + x) % 7 === 0 ? 1 : 0), 2, col); px(c, x + 2, 22, 3, 3, col); }
    px(c, 0, 25, 160, 3, '#7d8a98');
    px(c, 0, 28, 160, 82, '#d9744a'); groundPatches(c, 0, 28, 160, 82, 77, '#cc6a42', 0.6);
    // jalur: depth 0 = depan (bawah). Garis start/finis miring sedikit supaya robot tidak bertumpuk
    const LANE = [{ y: 106, top: 88, d: 0 }, { y: 62, top: 28, d: 2 }, { y: 84, top: 66, d: 1 }];
    const lx = (i, p) => 14 + LANE[i].d * 15 + p * 102;
    for (const y of [66, 88]) px(c, 0, y, 160, 1, '#fff2e8');
    LANE.forEach((L, i) => {
      const bot = i === 0 ? 110 : L.top === 28 ? 66 : 88;
      const sx = lx(i, 0) - 4, fx = lx(i, 1) + 5;
      px(c, sx, L.top, 2, bot - L.top, '#ffffff');
      for (let y = L.top, r = 0; y < bot; y += 3, r++) for (let k = 0; k < 2; k++) px(c, fx + k * 3, y, 3, Math.min(3, bot - y), (r + k) % 2 ? '#2a2a2e' : '#ffffff');
    });
    // papan pertanyaan di langit
    const q = !S.done && S.steps[S.step];
    if (q) {
      px(c, 38, 0, 84, 26, '#5a3a22'); px(c, 40, 1, 80, 23, '#fff8e8');
      // gambar stiker berukuran asli (± 14 piksel), alasnya di y
      const mini = (k, x, y) => { if (!ST_ART[k]) return; const keep = PX; PX = 1; try { ST_ART[k](c, Math.round(x), y); } catch (e) {} finally { PX = keep; } };
      if (q.type === 'count') for (let i = 0; i < q.n; i++) mini(q.obj, 80 + (i - (q.n - 1) / 2) * (q.n >= 5 ? 15 : 18), 22);
      else if (q.type === 'add') {
        // a benda + b benda, seluruhnya di tengah papan
        const gap = 12, sp = 10, span = (q.a - 1) * gap + 2 * sp + (q.b - 1) * gap, x0 = 80 - span / 2;
        for (let i = 0; i < q.a; i++) mini(q.obj, x0 + i * gap, 22);
        const pc = Math.round(x0 + (q.a - 1) * gap + sp);
        px(c, pc - 3, 12, 7, 2, '#3a3f4a'); px(c, pc - 1, 9, 2, 8, '#3a3f4a');
        for (let i = 0; i < q.b; i++) mini(q.obj, x0 + (q.a - 1) * gap + 2 * sp + i * gap, 22);
      } else if (q.type === 'color') {
        const col = RACE_COLORS[q.col];
        if (q.thing === 'balloon') { oval(c, 80, 10, 7, 8, col); px(c, 77, 5, 2, 3, 'rgba(255,255,255,0.6)'); px(c, 80, 18, 1, 5, '#5a3a22'); }
        else if (q.thing === 'ball') { disc(c, 80, 12, 9, col); px(c, 76, 6, 3, 2, 'rgba(255,255,255,0.6)'); }
        else { px(c, 70, 17, 20, 3, col); px(c, 74, 6, 12, 12, col); px(c, 74, 14, 12, 2, '#ffffff'); }
      } else { disc(c, 80, 12, 9, '#4f86e0'); px(c, 78, 6, 5, 2, '#ffffff'); px(c, 82, 7, 2, 4, '#ffffff'); px(c, 79, 11, 3, 2, '#ffffff'); px(c, 79, 13, 2, 2, '#ffffff'); px(c, 79, 17, 2, 2, '#ffffff'); }
    }
    // tiga robot: jalur belakang dulu
    const cfgs = [RACE_ME()].concat(RACE_RIVALS.filter(r => r.color !== RACE_ME().color).slice(0, 2));
    while (cfgs.length < 3) cfgs.push(Object.assign({}, RACE_RIVALS[0], { color: 'orange' }));
    [1, 2, 0].forEach(i => {
      const x = Math.round(lx(i, S.pos[i])), y = LANE[i].y, moving = Math.abs(S.goal[i] - S.pos[i]) > 0.002;
      const tripping = i === 0 && S.trip > 0;
      drawMyRobot(c, x + (tripping ? Math.round(Math.sin(t * 30) * 1.5) : 0), y, cfgs[i], t, { dir: 1, moving, awake: true, act: S.done && S.winner === i ? 'jump' : tripping ? 'spin' : null, actT: t });
      if (moving) for (let k = 0; k < 3; k++) px(c, x - 13 - k * 4, y - 8 - k * 4, 4, 1, 'rgba(255,255,255,0.85)');
    });
    // bintang kecil di atas robot Russel
    drawStar(c, Math.round(lx(0, S.pos[0])), LANE[0].y - rbHeight(cfgs[0]) - 5, '#ffd84a');
    // selesai: piala besar di langit (emas = juara satu, perak = juara dua)
    if (S.done) {
      const first = S.winner === 0, A = first ? '#f4cf3a' : '#c9d2dc', B = first ? '#c9a21f' : '#8e9cae', L = first ? '#fff2a8' : '#eef2f6';
      px(c, 70, 1, 20, 13, A); px(c, 66, 3, 4, 7, A); px(c, 90, 3, 4, 7, A); px(c, 67, 4, 2, 4, '#bfe3f2'); px(c, 91, 4, 2, 4, '#bfe3f2');
      px(c, 73, 3, 3, 8, L); px(c, 78, 14, 4, 5, B); px(c, 73, 19, 14, 3, B); px(c, 70, 22, 20, 3, '#8a5a35');
      // angka 1 atau 2 di piala
      if (first) { px(c, 79, 4, 2, 8, B); px(c, 78, 5, 1, 1, B); }
      else { px(c, 77, 4, 6, 1, B); px(c, 82, 5, 1, 3, B); px(c, 77, 8, 6, 1, B); px(c, 77, 9, 1, 3, B); px(c, 77, 11, 6, 1, B); }
    }
  },
  finish(S) {
    // Russel menang bila tidak ada robot lain yang sampai lebih dulu
    S.goal[0] = 1;
    const first = S.goal[1] < 1 && S.goal[2] < 1;
    S.winner = first ? 0 : S.goal[1] >= 1 ? 1 : 2;
    EX.raceRuns = (EX.raceRuns || 0) + 1; if (first) EX.raceWins = (EX.raceWins || 0) + 1; exSave();
    return [{ k: 'runfast' }, { k: first ? 'firstplace' : 'secondplace' }, { k: 'great' }];
  },
  tapDone(S) { S.flash = 0.6; sfx('sparkle'); say([{ k: 'myrobot' }, { k: 'runfast' }]); },
  doneOpts: S => [['again', bdReset]],
};

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  bigpuzzle: (c, x, y) => { const cols = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a']; for (let i = 0; i < 4; i++) { const ax = x - 14 + (i % 2) * 14, ay = y - 30 + Math.floor(i / 2) * 14; px(c, ax, ay, 13, 13, cols[i]); px(c, ax, ay, 13, 2, 'rgba(255,255,255,0.4)'); } disc(c, x, y - 23, 3, '#4f86e0'); disc(c, x - 7, y - 16, 3, '#f4cf3a'); },
  connectpath: (c, x, y) => { px(c, x - 18, y - 16, 14, 8, '#6f737c'); px(c, x + 4, y - 16, 14, 8, '#6f737c'); px(c, x - 4, y - 16, 8, 8, '#f4cf3a'); drawStar(c, x, y - 24, '#f4cf3a'); },
  turnit: (c, x, y) => { for (let a = 0; a < 5.2; a += 0.25) px(c, Math.round(x + Math.cos(a) * 12), Math.round(y - 16 + Math.sin(a) * 12), 3, 3, '#4f86e0'); px(c, x + 10, y - 26, 6, 3, '#4f86e0'); px(c, x + 13, y - 29, 3, 6, '#4f86e0'); },
  connected: (c, x, y) => { px(c, x - 18, y - 14, 36, 8, '#b9ab92'); px(c, x - 18, y - 13, 36, 2, '#7d8a98'); px(c, x - 18, y - 9, 36, 2, '#7d8a98'); drawStar(c, x, y - 24, '#f4cf3a'); },
  rail: (c, x, y) => { px(c, x - 18, y - 16, 36, 12, '#b9ab92'); for (let k = -16; k < 18; k += 6) px(c, x + k, y - 16, 3, 12, '#8a5a35'); px(c, x - 18, y - 14, 36, 2, '#7d8a98'); px(c, x - 18, y - 8, 36, 2, '#7d8a98'); },
  road: (c, x, y) => { px(c, x - 18, y - 18, 36, 14, '#6f737c'); for (let k = -16; k < 18; k += 10) px(c, x + k, y - 12, 5, 2, '#f4cf3a'); px(c, x - 18, y - 18, 36, 1, '#e8e4d8'); px(c, x - 18, y - 5, 36, 1, '#e8e4d8'); },
  boatgo: (c, x, y) => { px(c, x - 18, y - 6, 36, 6, '#5fb0e8'); px(c, x - 10, y - 12, 20, 6, '#c08a52'); px(c, x, y - 26, 1, 14, '#5a3a22'); px(c, x + 1, y - 26, 8, 10, '#ffffff'); },
  nextlevel: (c, x, y) => { for (let i = 0; i < 3; i++) drawStar(c, x - 12 + i * 12, y - 10 - i * 6, '#f4cf3a'); px(c, x + 8, y - 30, 8, 3, '#58a84a'); px(c, x + 13, y - 33, 3, 9, '#58a84a'); },
  robotrace: (c, x, y) => { drawMyRobot(c, x - 4, y, RACE_ME(), 0, { dir: 1, awake: true, noShadow: true }); for (let k = 0; k < 3; k++) px(c, x - 20, y - 20 + k * 5, 6, 1, '#4f86e0'); },
  racetrack: (c, x, y) => { px(c, x - 18, y - 22, 36, 22, '#d9744a'); for (const yy of [-15, -8]) px(c, x - 18, y + yy, 36, 1, '#fff2e8'); for (let yy = -22; yy < 0; yy += 4) { px(c, x + 12, y + yy, 3, 2, '#2a2a2e'); px(c, x + 15, y + yy + 2, 3, 2, '#2a2a2e'); } },
  readygo: (c, x, y) => { px(c, x - 1, y - 30, 2, 30, '#5a3a22'); for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) px(c, x + 1 + k * 4, y - 30 + j * 4, 4, 4, (k + j) % 2 ? '#2a2a2e' : '#ffffff'); },
  whichis: (c, x, y) => ST_ART.whereis ? ST_ART.whereis(c, x, y) : drawStar(c, x, y - 10, '#4f86e0'),
  addup: (c, x, y) => { disc(c, x - 12, y - 14, 5, '#e2483d'); px(c, x - 4, y - 15, 8, 2, '#3a3f4a'); px(c, x - 1, y - 18, 2, 8, '#3a3f4a'); disc(c, x + 10, y - 14, 5, '#e2483d'); disc(c, x + 10, y - 26, 5, '#e2483d'); },
  runfast: (c, x, y) => { drawMyRobot(c, x + 2, y, RACE_ME(), 0, { dir: 1, awake: true, noShadow: true, moving: true }); for (let k = 0; k < 4; k++) px(c, x - 22, y - 26 + k * 6, 8, 1, '#8fb4ee'); },
  firstplace: (c, x, y) => { px(c, x - 9, y - 30, 18, 12, '#f4cf3a'); px(c, x - 13, y - 28, 4, 7, '#f4cf3a'); px(c, x + 9, y - 28, 4, 7, '#f4cf3a'); px(c, x - 2, y - 18, 4, 8, '#c9a21f'); px(c, x - 8, y - 10, 16, 4, '#c9a21f'); px(c, x - 12, y - 6, 24, 6, '#8a5a35'); px(c, x - 1, y - 28, 2, 8, '#c9a21f'); px(c, x - 6, y - 28, 3, 5, '#fff2a8'); },
  secondplace: (c, x, y) => { disc(c, x, y - 14, 10, '#c9d2dc'); disc(c, x, y - 14, 7, '#e8eef2'); px(c, x - 2, y - 18, 4, 2, '#7d8a98'); px(c, x + 1, y - 17, 2, 3, '#7d8a98'); px(c, x - 2, y - 14, 4, 2, '#7d8a98'); px(c, x - 2, y - 12, 2, 2, '#7d8a98'); px(c, x - 2, y - 11, 5, 2, '#7d8a98'); px(c, x - 8, y - 32, 6, 10, '#e2483d'); px(c, x + 2, y - 32, 6, 10, '#4f86e0'); },
});

// ================= TEMPAT =================
// Toko Mainan: tikar puzzle besar di lantai kiri
SCENES.toyshop.objs.push({ x: 72, y: 150, flat: true, hit: [32, 116, 80, 38], go: [72, 162],
  draw(c, t) {
    shadowRect(c, 34, 150, 78, 3);
    const cols = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a'];
    for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) { const x = 34 + i * 19, y = 118 + j * 16; px(c, x, y, 18, 15, cols[(i + j) % 4]); px(c, x, y, 18, 2, 'rgba(255,255,255,0.35)'); px(c, x, y + 14, 18, 1, 'rgba(0,0,0,0.18)'); }
    // potongan rel & jalan kecil di atas tikar
    px(c, 40, 123, 12, 5, '#b9ab92'); px(c, 40, 124, 12, 1, '#7d8a98'); px(c, 40, 126, 12, 1, '#7d8a98');
    px(c, 78, 140, 12, 5, '#6f737c'); px(c, 82, 142, 4, 1, '#f4cf3a');
    const sp = Math.floor(t * 1.5) % 4; px(c, 60, 122, 8, 8, '#fff8e8'); px(c, 60 + (sp % 2) * 4, 122 + Math.floor(sp / 2) * 4, 4, 4, '#58a84a');
    if (Math.floor(t * 2) % 2) drawStar(c, 72, 110, '#ffd84a');
  },
  tap() { say([{ k: 'bigpuzzle' }]); },
  arrive() { G.boy.dir = 'up'; pzStart(); } });

// Bengkel Robot: lintasan lari kecil di kanan bawah
SCENES.workshop.objs.push({ x: 240, y: 146, flat: true, hit: [210, 112, 60, 36], go: [240, 154],
  draw(c, t) {
    shadowRect(c, 212, 145, 56, 3);
    px(c, 212, 120, 56, 26, '#d9744a'); px(c, 212, 120, 56, 1, '#f09a72');
    for (const y of [128, 137]) px(c, 212, y, 56, 1, '#fff2e8');
    for (let y = 120; y < 146; y += 3) { px(c, 260, y, 3, 3, (y / 3) % 2 ? '#2a2a2e' : '#ffffff'); px(c, 263, y, 3, 3, (y / 3) % 2 ? '#ffffff' : '#2a2a2e'); }
    px(c, 216, 120, 1, 26, '#ffffff');
    // dua robot kecil siap lomba
    const b = Math.floor(t * 4) % 2;
    px(c, 222, 124 - b, 6, 5, RB_TONE.pink[0]); px(c, 223, 125 - b, 4, 2, RB_SCREEN); px(c, 223, 129, 1, 2, RB_K); px(c, 226, 129, 1, 2, RB_K);
    px(c, 222, 133 + b - 1, 6, 5, RB_TONE.green[0]); px(c, 223, 134 + b - 1, 4, 2, RB_SCREEN); px(c, 223, 138, 1, 2, RB_K); px(c, 226, 138, 1, 2, RB_K);
    if (Math.floor(t * 2) % 2) drawStar(c, 238, 113, '#ffd84a');
  },
  tap() { say([{ k: 'racetrack' }, { k: 'robotrace' }]); },
  arrive() { G.boy.dir = 'right'; bdOpen('race'); } });

// ================= TEMA DI MENU ORANG TUA =================
THEMES.push(
  { name: 'Puzzle besar', where: 'Toko Mainan (Jalan Baru, pintu kanan): ketuk tikar puzzle warna-warni di lantai kiri. Ketuk potongan bersudut putih untuk memutarnya sampai jalan tersambung dari kiri ke kanan; potongan yang benar terkunci dan disebut 直的 (lurus) atau 弯的 (belok). Lalu kereta, mobil, atau perahu berjalan. Tingkat berikutnya makin banyak potongan; setelah 6 tingkat papan dibalik dan semua potongan diacak. Kalau lama diam, potongan berikutnya berkedip.', words: ['bigpuzzle', 'connectpath', 'turnit', 'connected', 'straight', 'curve', 'rail', 'road', 'river', 'traingo', 'drive', 'boatgo', 'arrived', 'nextlevel', 'station'] },
  { name: 'Balap robot', where: 'Bengkel Robot: ketuk lintasan lari oranye di kanan bawah. Robot Russel (hasil rakitannya; kalau belum ada, robot biru) lomba dengan 2 robot. Jawab 6 pertanyaan: berapa banyak, tambah sederhana, warna apa, mana bendanya. Jawaban benar membuat robot Russel melesat; salah membuat robotnya tersandung dan robot lain maju sedikit.', words: ['robotrace', 'racetrack', 'readygo', 'howmany', 'addup', 'whatcolor', 'whichis', 'runfast', 'firstplace', 'secondplace', 'myrobot'] },
);
