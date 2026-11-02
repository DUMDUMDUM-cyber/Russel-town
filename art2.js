// Gambar tambahan: pegunungan, kantor Ayah, peta, dan benda bergaris tepi.

// ---------- Hewan gunung ----------
function drawRabbit(c, x, y, dir, t, hop) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 5);
  const h = hop ? Math.round(Math.abs(Math.sin(t * 10)) * 4) : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, hh, k) => px(c, dx, y + dy - h, w, hh, k);
    P(-5, -6, 8, 5, '#fbf8f0'); P(-4, -7, 6, 1, '#fbf8f0'); P(-6, -6, 2, 2, '#ffffff');
    P(-3, -2, 2, 2, '#efe8da'); P(2, -2, 2, 2, '#efe8da');
    P(1, -11, 6, 6, '#fbf8f0'); P(2, -12, 4, 1, '#fbf8f0');
    P(2, -18, 2, 6, '#fbf8f0'); P(5, -17, 2, 5, '#fbf8f0'); P(2, -17, 1, 4, '#f7b0c0'); P(5, -16, 1, 3, '#f7b0c0');
    P(4, -9, 2, 2, '#2a1d18'); P(4, -9, 1, 1, '#ffffff'); P(6, -7, 1, 1, '#f39ab0'); P(3, -7, 1, 1, '#f7a0a0');
  });
}
function drawSquirrel(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  const B = '#b8703a', D = '#8a4f26', Lt = '#f3d8b0';
  const fl = Math.sin(t * 6) > 0 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    P(-8, -14 - fl, 5, 10, D); P(-9, -16 - fl, 5, 5, B); P(-7, -13 - fl, 2, 7, B);
    P(-3, -8, 6, 6, B); P(-1, -6, 3, 4, Lt);
    P(0, -13, 6, 5, B); P(1, -14, 2, 1, D); P(4, -14, 1, 1, D);
    P(3, -12, 2, 2, '#2a1d18'); P(3, -12, 1, 1, '#ffffff'); P(5, -10, 1, 1, '#2a1d18');
    P(2, -6, 2, 2, '#a8743c');
  });
}
function drawBird(c, x, y, t, col) {
  x = Math.round(x); y = Math.round(y);
  const up = Math.sin(t * 16) > 0;
  px(c, x - 2, y - 2, 5, 4, col); px(c, x + 2, y - 3, 3, 3, col);
  px(c, x + 3, y - 2, 1, 1, '#2a1d18'); px(c, x + 5, y - 2, 2, 1, '#f4b23a');
  if (up) { px(c, x - 3, y - 5, 4, 3, col); } else { px(c, x - 3, y + 1, 4, 2, col); }
  px(c, x - 4, y - 1, 2, 1, col);
}
function drawMushroom(c, x, y) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 4);
  px(c, x - 1, y - 4, 3, 4, '#f6ecd6');
  px(c, x - 4, y - 7, 9, 3, '#e2483d'); px(c, x - 3, y - 8, 7, 1, '#e2483d'); px(c, x - 1, y - 9, 3, 1, '#e2483d');
  px(c, x - 2, y - 7, 1, 1, '#ffffff'); px(c, x + 2, y - 8, 1, 1, '#ffffff'); px(c, x, y - 6, 1, 1, '#ffffff');
  px(c, x - 4, y - 4, 9, 1, '#a8352b');
}
function drawRock(c, x, y, r) {
  shadow(c, x, y, r + 1);
  oval(c, x, y - r + 1, r, Math.max(2, r - 2), '#8f8c86'); oval(c, x - 1, y - r, r - 1, Math.max(1, r - 3), '#b4b0a8');
  px(c, x - Math.round(r / 2), y - r - 1, 2, 1, '#d6d2ca');
}
function drawPine(c, x, y, h) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 7);
  px(c, x - 1, y - 6, 3, 6, '#7d5230');
  for (let i = 0; i < 3; i++) {
    const ty = y - 6 - i * Math.round(h / 4), w = 9 - i * 2;
    for (let r = 0; r < 8; r++) px(c, x - Math.round(w * r / 8), ty - r, Math.round(w * r / 8) * 2 + 1, 1, r < 2 ? PAL.leafD : '#3f8a3a');
  }
  px(c, x - 2, y - 6 - h, 1, 1, PAL.leafL);
}
function drawWaterfall(c, x, y, w, h, t) {
  px(c, x, y, w, h, '#8fd0f2');
  for (let i = 0; i < w; i += 2) {
    const off = Math.floor((t * 40 + i * 7) % 8);
    for (let j = off; j < h; j += 8) px(c, x + i, y + j, 1, 3, '#e3f5fc');
  }
  for (let i = 0; i < 6; i++) disc(c, x + 2 + ((i * 5 + Math.floor(t * 9)) % w), y + h + 1, 2, '#ffffff');
}

// ---------- Kantor ----------
function drawDesk(c, x, y, screen, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y + 1, 22);
  px(c, x - 20, y - 14, 40, 9, '#d9b98a'); px(c, x - 20, y - 14, 40, 1, '#ead2a8');
  px(c, x - 20, y - 5, 40, 5, '#a8865a'); px(c, x - 18, y - 4, 10, 3, '#b8966a'); px(c, x - 9, y - 3, 3, 1, '#7d5f3a');
  // monitor di sisi kanan meja supaya wajah orang di belakangnya terlihat (null = tanpa monitor)
  const m = x + 8;
  if (screen !== null) {
  px(c, m - 8, y - 28, 16, 12, '#3a3f4a'); px(c, m - 7, y - 27, 14, 9, screen ? '#7cc4f0' : '#2a3038');
  if (screen) {
    px(c, m - 6, y - 21, 12, 3, '#58a84a');
    const fx = m - 6 + Math.floor(t * 4) % 10;
    px(c, fx, y - 25, 3, 2, '#f08a32'); px(c, fx - 1, y - 24, 1, 1, '#f08a32'); px(c, m + 3, y - 26, 2, 2, '#ffd84a');
  }
  px(c, m - 1, y - 16, 2, 2, '#3a3f4a'); px(c, m - 4, y - 14, 8, 1, '#3a3f4a');
  px(c, x - 9, y - 12, 12, 3, '#e8e8ec'); px(c, x - 8, y - 11, 10, 1, '#c8c8d0');
  }
  // buku & cangkir
  px(c, x - 18, y - 13, 6, 2, '#e2483d'); px(c, x - 18, y - 15, 6, 2, '#4f86e0');
  px(c, x + 15, y - 14, 3, 3, '#ffffff'); px(c, x + 18, y - 13, 1, 1, '#ffffff');
}
function drawPhone(c, x, y, ring, t) {
  const sh = ring && Math.sin(t * 40) > 0 ? 1 : 0;
  px(c, x - 3 + sh, y - 3, 7, 3, '#e2483d'); px(c, x - 4 + sh, y - 5, 9, 2, '#c9372e'); px(c, x - 1 + sh, y - 2, 3, 1, '#ffffff');
}
function drawBookshelf(c, x, y, w, h) {
  px(c, x, y, w, h, '#8a5a35'); px(c, x + 2, y + 2, w - 4, h - 4, '#6b4226');
  const cols = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a', '#9b6bd6', '#f08a32'];
  for (let sy = y + 2; sy < y + h - 4; sy += 11) {
    px(c, x + 2, sy + 9, w - 4, 2, '#8a5a35');
    for (let bx = x + 3, i = 0; bx < x + w - 5; bx += 4, i++) px(c, bx, sy + 2 + (i % 3 === 0 ? 1 : 0), 3, 7 - (i % 3 === 0 ? 1 : 0), cols[(i + sy) % cols.length]);
  }
}
function drawClock(c, x, y, t) {
  disc(c, x, y, 7, '#3a3f4a'); disc(c, x, y, 6, '#ffffff');
  for (let i = 0; i < 12; i += 3) { const a = i / 12 * Math.PI * 2; px(c, x + Math.round(Math.sin(a) * 5), y - Math.round(Math.cos(a) * 5), 1, 1, '#3a3f4a'); }
  const a = t * 0.5;
  for (let r = 0; r < 5; r++) px(c, x + Math.round(Math.sin(a) * r), y - Math.round(Math.cos(a) * r), 1, 1, '#e2483d');
  px(c, x, y - 3, 1, 3, '#2a1d18'); px(c, x, y, 3, 1, '#2a1d18');
}
function drawPlantPot(c, x, y) {
  shadow(c, x, y, 5);
  px(c, x - 4, y - 7, 8, 7, '#c9673a'); px(c, x - 5, y - 8, 10, 2, '#e08a5a');
  disc(c, x - 3, y - 12, 3, PAL.leaf); disc(c, x + 3, y - 13, 3, PAL.leaf); disc(c, x, y - 16, 4, PAL.leafD); disc(c, x - 1, y - 17, 2, PAL.leafL);
}
function drawCooler(c, x, y) {
  shadow(c, x, y, 5);
  px(c, x - 5, y - 16, 10, 16, '#e8eef2'); px(c, x - 5, y - 16, 10, 1, '#ffffff'); px(c, x - 2, y - 11, 4, 2, '#4f86e0');
  px(c, x - 4, y - 27, 8, 11, '#8fd0f2'); px(c, x - 3, y - 26, 2, 8, '#d8f0fc'); px(c, x - 3, y - 28, 6, 1, '#4f86e0');
}
function drawCity(c, x, y, w, h, night) {
  px(c, x, y, w, h, night ? '#26305e' : '#9fd4f2');
  const r = rng(x * 7 + 3);
  for (let bx = x; bx < x + w; ) {
    const bw = 8 + Math.floor(r() * 10), bh = 8 + Math.floor(r() * (h - 8));
    px(c, bx, y + h - bh, Math.min(bw, x + w - bx), bh, night ? '#3a4470' : '#c9d4e0');
    for (let wy = y + h - bh + 2; wy < y + h - 2; wy += 4) for (let wx = bx + 2; wx < Math.min(bx + bw, x + w) - 2; wx += 4) px(c, wx, wy, 2, 2, night ? (r() < 0.6 ? '#ffd96a' : '#2a3050') : '#e8f2fa');
    bx += bw + 1;
  }
}

// ---------- Peta (kanvas 160x90) ----------
const MAP_SPOTS = {
  mountain: [26, 30], home: [64, 24], farm: [62, 56], village: [100, 44], school: [136, 20], office: [146, 50], beach: [124, 76],
};
function drawMap(c, cur, t) {
  px(c, 0, 0, 160, 90, '#8fd06a');
  groundPatches(c, 0, 0, 160, 90, 78, '#84c75f', 0.55);
  groundPatches(c, 0, 0, 160, 90, 79, '#9bd878', 0.6);
  const r = rng(77);
  for (let i = 0; i < 90; i++) px(c, Math.floor(r() * 160), Math.floor(r() * 90), 1.5, 0.5, r() < 0.5 ? '#74b854' : '#b4e692');
  // sungai bertepi pasir
  for (let y = 0; y < 90; y += 0.5) {
    const x = 112 + Math.sin(y / 14) * 6 - y * 0.5;
    px(c, x - 1, y, 8, 0.5, '#d9c48a'); px(c, x, y, 6, 0.5, PAL.water); px(c, x + 0.5, y, 0.5, 0.5, PAL.waterD); px(c, x + 2, y, 1, 0.5, PAL.waterL);
  }
  // jalan
  const S = MAP_SPOTS, roadLine = (a, b, w, col) => {
    const [x1, y1] = S[a], [x2, y2] = S[b], n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
    for (let i = 0; i <= n; i++) px(c, x1 + (x2 - x1) * i / n - w / 2, y1 + (y2 - y1) * i / n - w / 2, w, w, col);
  };
  const ROADS = [['mountain', 'farm'], ['home', 'farm'], ['farm', 'village'], ['village', 'school'], ['school', 'office'], ['village', 'beach']];
  // laut di pojok kanan bawah
  for (let y = 66; y < 90; y += 0.5) {
    const x0 = 166 - (y - 66) * 3;
    px(c, x0 - 4, y, 4, 0.5, '#f2dca0'); px(c, x0 - 0.5, y, 1, 0.5, '#ffffff');
    px(c, x0 + 0.5, y, 160 - x0, 0.5, (Math.floor(y) + Math.floor(t * 3)) % 5 ? '#4fa0cf' : '#8fd0f2');
  }
  ROADS.forEach(([a, b]) => roadLine(a, b, 4, '#c9a46a'));
  ROADS.forEach(([a, b]) => roadLine(a, b, 3, '#e8cf98'));
  // pohon kecil
  [[8, 62], [16, 72], [32, 78], [44, 68], [84, 16], [92, 6], [118, 8], [108, 28], [14, 52], [78, 74], [152, 30]].forEach(([a, b]) => {
    oval(c, a, b + 0.5, 3, 1, 'rgba(30,45,20,0.22)'); px(c, a - 0.5, b - 2, 1, 2, '#7d5230');
    disc(c, a, b - 4, 3, PAL.leafD); disc(c, a - 0.5, b - 4.5, 2.5, PAL.leaf); disc(c, a - 1, b - 5.5, 1, PAL.leafL);
  });
  const [bx, by] = S.beach;
  oval(c, bx, by + 4, 10, 3, '#f2dca0');
  for (let dy = -4; dy <= 0; dy++) { const w = Math.floor(7 * Math.sqrt(1 - dy * dy / 16)); for (let i = -w; i <= w; i++) px(c, bx - 4 + i, by - 6 + dy, 1, 1, Math.floor((i + 8) / 3) % 2 ? '#ffffff' : '#e2483d'); }
  px(c, bx - 4, by - 6, 1, 10, '#e8e2d6');
  for (let k = 0; k < 9; k++) px(c, bx + 6 + Math.round(k / 3), by + 3 - k, 2, 1, '#a8743c');
  for (const [dx, dy] of [[-4, 1], [4, 1], [-3, -2], [3, -2]]) px(c, bx + 9 + dx, by - 6 + dy, 3, 1, '#4a9a3a');
  // ikon tempat
  const [mx, my] = S.mountain;
  for (const [ox, h, col] of [[-8, 16, '#8a8fb0'], [6, 13, '#9da2c2'], [-1, 20, '#7a7fa2']]) {
    for (let k = 0; k < h; k += 0.5) { px(c, mx + ox - k, my + 6 - h + k, k * 2 + 0.5, 0.5, col); px(c, mx + ox, my + 6 - h + k, k + 0.5, 0.5, 'rgba(50,50,90,0.22)'); }
    for (let k = 0; k < 4; k += 0.5) { px(c, mx + ox - k, my + 6 - h + k, k * 2 + 0.5, 0.5, '#ffffff'); px(c, mx + ox, my + 6 - h + k, k + 0.5, 0.5, '#dfe6ef'); }
  }
  const [hx, hy] = S.home;
  px(c, hx - 7, hy - 2, 14, 8, '#f3e3c0'); for (let k = 0; k < 6; k++) px(c, hx - 9 + k, hy - 3 - k, 18 - k * 2, 1, '#d4553f'); px(c, hx - 1, hy + 2, 3, 4, PAL.wood);
  const [fx, fy] = S.farm;
  px(c, fx - 10, fy - 6, 20, 12, '#9a7048'); for (let k = -5; k < 6; k += 3) px(c, fx - 9, fy + k, 18, 1, '#6b4226');
  for (let k = -10; k <= 10; k += 4) px(c, fx + k, fy - 8, 1, 3, PAL.woodD); px(c, fx - 10, fy - 7, 21, 1, PAL.wood);
  const [vx, vy] = S.village;
  px(c, vx - 12, vy + 3, 24, 3, '#8b8d94');
  for (const [ox, rf] of [[-7, '#4f86e0'], [5, '#58a84a']]) { px(c, vx + ox - 4, vy - 3, 8, 6, '#f3e3c0'); px(c, vx + ox - 5, vy - 6, 10, 3, rf); }
  const [sx, sy] = S.school;
  px(c, sx - 11, sy - 2, 22, 9, '#fbefd0'); px(c, sx - 12, sy - 6, 24, 4, '#3f9a9a'); px(c, sx + 13, sy - 10, 1, 17, '#a9a6a0'); px(c, sx + 14, sy - 10, 5, 2, '#e2483d'); px(c, sx + 14, sy - 8, 5, 2, '#ffffff');
  px(c, sx - 1, sy + 2, 3, 5, PAL.wood);
  const [ox2, oy2] = S.office;
  px(c, ox2 - 6, oy2 - 14, 12, 20, '#a9b6c4'); px(c, ox2 + 6, oy2 - 8, 7, 14, '#c9d4e0');
  for (let wy = oy2 - 12; wy < oy2 + 4; wy += 3) { px(c, ox2 - 4, wy, 2, 2, '#e8f6fc'); px(c, ox2, wy, 2, 2, '#e8f6fc'); px(c, ox2 + 8, wy + 1, 2, 1, '#e8f6fc'); }
  // penanda posisi Russel
  if (S[cur]) {
    const [px0, py0] = S[cur], b = Math.round(Math.abs(Math.sin(t * 4)) * 3);
    headShape(c, px0, py0 - 22 - b, LOOKS.me.skin);
    drawHead(c, px0, py0 - 22 - b, LOOKS.me, 'down', { mood: 'happy' });
    px(c, px0 - 1, py0 - 11 - b, 3, 3, '#e2483d');
  }
}

// ---------- Benda besar bergaris tepi (papan hitung) ----------
const _oc = document.createElement('canvas'); _oc.width = 48; _oc.height = 48;
const _ox = _oc.getContext('2d');
const _sc = document.createElement('canvas'); _sc.width = 48; _sc.height = 48;
const _sx = _sc.getContext('2d');
const _trash = document.createElement('canvas').getContext('2d');
function drawOutlined(c, x, y, scale, fn, col = '#3a2616') {
  _ox.clearRect(0, 0, 48, 48);
  const keep = SHADOW_TO; SHADOW_TO = _trash; fn(_ox, 24, 40); SHADOW_TO = keep;
  _sx.globalCompositeOperation = 'source-over'; _sx.clearRect(0, 0, 48, 48); _sx.drawImage(_oc, 0, 0);
  _sx.globalCompositeOperation = 'source-in'; _sx.fillStyle = col; _sx.fillRect(0, 0, 48, 48);
  _sx.globalCompositeOperation = 'source-over';
  c.save(); c.imageSmoothingEnabled = false; c.translate(Math.round(x), Math.round(y)); c.scale(scale, scale);
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.drawImage(_sc, -24 + dx, -40 + dy);
  c.drawImage(_oc, -24, -40);
  c.restore();
}
