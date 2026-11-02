// Gambar untuk kejutan harian, bunga matahari, kostum, trik Dòudou, dan hari raya.

// ---------- Kejutan harian ----------
function drawPanda(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 9);
  const K = '#2a2a2e', Wt = '#fbf8f0', chew = Math.sin(t * 6) > 0 ? 1 : 0;
  oval(c, x, y - 7, 8, 6, Wt); px(c, x - 8, y - 3, 5, 3, K); px(c, x + 3, y - 3, 5, 3, K);
  px(c, x - 9, y - 10, 4, 6, K); px(c, x + 5, y - 10, 4, 6, K);
  px(c, x + 6, y - 20, 1, 14, '#58a84a'); px(c, x + 6, y - 14, 1, 1, '#3d7f33'); px(c, x + 7, y - 21, 3, 2, '#7cc85a');
  disc(c, x, y - 17, 6, Wt);
  disc(c, x - 5, y - 23, 2, K); disc(c, x + 5, y - 23, 2, K);
  px(c, x - 4, y - 19, 3, 3, K); px(c, x + 1, y - 19, 3, 3, K); px(c, x - 3, y - 18, 1, 1, '#ffffff'); px(c, x + 2, y - 18, 1, 1, '#ffffff');
  px(c, x - 1, y - 15, 2, 1, K); px(c, x - 1, y - 13 + chew, 2, 1, '#e2483d');
  px(c, x - 6, y - 15, 2, 1, '#f7a0a0'); px(c, x + 4, y - 15, 2, 1, '#f7a0a0');
}
function drawRainbow(c, cx, cy, r) {
  c.save(); c.globalAlpha = 0.7; c.lineWidth = 2;
  ['#e2483d', '#f08a32', '#f4cf3a', '#58a84a', '#4f86e0', '#8f62c9'].forEach((k, i) => {
    c.beginPath(); c.arc(cx, cy, r - i * 2, Math.PI, Math.PI * 2); c.strokeStyle = k; c.stroke();
  });
  c.restore();
}
function drawBalloons(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  [['#e2483d', -6, -30], ['#4f86e0', 0, -36], ['#f4cf3a', 6, -31], ['#f39ac0', -2, -24], ['#58a84a', 5, -24]].forEach(([k, dx, dy], i) => {
    const bx = x + dx + Math.round(Math.sin(t * 1.5 + i) * 1.5), by = y + dy;
    for (let s = 0; s < -dy - 5; s++) px(c, Math.round(x + (bx - x) * (1 - s / (-dy))), y - s, 1, 1, '#c9c6c0');
    oval(c, bx, by, 3, 4, k); px(c, bx - 1, by - 2, 1, 2, '#ffffff'); px(c, bx, by + 4, 1, 1, k);
  });
  px(c, x - 1, y - 2, 3, 2, '#7d5230');
}
function drawKite(c, x, y, t) {
  x = Math.round(x + Math.sin(t * 0.8) * 4); y = Math.round(y + Math.sin(t * 1.3) * 2);
  for (let r = 0; r < 8; r++) { px(c, x - r, y - 8 + r, r * 2 + 1, 1, r % 2 ? '#e2483d' : '#f4cf3a'); px(c, x - (7 - r), y + r, (7 - r) * 2 + 1, 1, r % 2 ? '#f4cf3a' : '#e2483d'); }
  px(c, x, y - 8, 1, 16, '#7d5230'); px(c, x - 7, y, 15, 1, '#7d5230');
  for (let k = 0; k < 14; k++) px(c, x + Math.round(Math.sin(t * 4 + k * 0.6) * 2), y + 8 + k, 1, 1, '#4f86e0');
  for (let k = 0; k < 4; k++) px(c, x - 1 + Math.round(Math.sin(t * 4 + k * 2) * 2), y + 10 + k * 3, 3, 1, ['#e2483d', '#58a84a', '#f4cf3a', '#8f62c9'][k]);
  for (let k = 0; k < 70; k += 2) px(c, x - Math.round(k * 0.6), y + 8 + k, 1, 1, 'rgba(255,255,255,0.7)');
}
function drawHotAirBalloon(c, x, y, t) {
  x = Math.round(x); y = Math.round(y + Math.sin(t) * 2);
  oval(c, x, y - 22, 14, 16, '#e2483d');
  for (let i = -10; i <= 10; i += 7) for (let dy = -36; dy < -8; dy++) { const w = Math.floor(14 * Math.sqrt(Math.max(0, 1 - Math.pow((dy + 22) / 16, 2)))); if (Math.abs(i) < w - 1) px(c, x + Math.round(i * w / 14), y + dy, 2, 1, '#f4cf3a'); }
  px(c, x - 6, y - 7, 12, 2, '#a8352b');
  px(c, x - 5, y - 5, 1, 7, '#7d5230'); px(c, x + 4, y - 5, 1, 7, '#7d5230');
  px(c, x - 5, y + 2, 10, 6, '#a8743c'); px(c, x - 5, y + 2, 10, 1, '#d39b5f');
  px(c, x - 2, y - 1, 5, 4, '#f6c9a3'); px(c, x - 2, y - 2, 5, 2, '#3a2a20');
  if (Math.floor(t * 6) % 3 === 0) px(c, x - 1, y - 9, 2, 2, '#ffd84a');
}
function drawGoldfish(c, x, y, t) {
  const dir = Math.cos(t * 0.9) > 0 ? 1 : -1, fx = Math.round(x + Math.sin(t * 0.9) * 10);
  flip(c, fx, dir, () => {
    px(c, -3, y - 2, 7, 4, '#f4b23a'); px(c, -2, y - 3, 5, 1, '#ffd84a'); px(c, -6, y - 3, 3, 6, '#f08a32');
    px(c, 2, y - 1, 1, 1, '#2a1d18'); px(c, 0, y + 2, 2, 1, '#f08a32');
  });
  if (Math.floor(t * 3) % 2) { px(c, fx + 5, y - 6, 1, 1, '#ffffff'); px(c, fx - 6, y - 5, 1, 1, '#fff2a8'); }
}

// ---------- Bunga matahari (tumbuh satu tahap per hari) ----------
function drawSunflowerPot(c, x, y, stage, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 8);
  px(c, x - 7, y - 9, 14, 9, '#c9673a'); px(c, x - 8, y - 10, 16, 2, '#e08a5a'); px(c, x - 6, y - 9, 12, 1, '#6b4226');
  const sw = Math.round(Math.sin(t * 1.5));
  if (stage === 1) { px(c, x - 1, y - 11, 3, 1, '#8a5a35'); px(c, x, y - 12, 1, 1, '#f0dcae'); }
  if (stage >= 2) px(c, x, y - 9 - [0, 0, 5, 14, 24, 30][stage], 2, [0, 0, 5, 14, 24, 30][stage], '#3f8a3a');
  if (stage === 2) { px(c, x - 3, y - 14, 3, 2, PAL.leafL); px(c, x + 2, y - 15, 3, 2, PAL.leafL); }
  if (stage >= 3) { oval(c, x - 4, y - 16, 4, 1, PAL.leaf); oval(c, x + 6, y - 20, 4, 1, PAL.leaf); }
  if (stage >= 4) { oval(c, x - 4, y - 26, 4, 1, PAL.leaf); }
  if (stage === 4) { disc(c, x + 1 + sw, y - 34, 3, '#58a84a'); px(c, x + sw, y - 37, 3, 1, '#f4cf3a'); }
  if (stage === 5) {
    const fx = x + 1 + sw, fy = y - 42;
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; disc(c, fx + Math.round(Math.cos(a) * 7), fy + Math.round(Math.sin(a) * 7), 2, '#f4cf3a'); }
    disc(c, fx, fy, 5, '#8a5a35'); disc(c, fx, fy, 3, '#6b4226');
    px(c, fx - 2, fy - 1, 1, 1, '#2a1d18'); px(c, fx + 2, fy - 1, 1, 1, '#2a1d18'); px(c, fx - 1, fy + 2, 3, 1, '#2a1d18');
  }
  // papan nama kecil
  px(c, x + 9, y - 10, 1, 10, PAL.woodD); px(c, x + 6, y - 14, 8, 5, PAL.wood);
  for (let i = 0; i < Math.max(1, stage); i++) px(c, x + 7 + i, y - 12, 1, 1, i < stage ? '#f4cf3a' : '#7d5230');
}

// ---------- Kostum (digambar di atas baju & kepala) ----------
const COSTUMES = {
  tiger: { shirt: ['tiger', '#f08a32', '#c96a1c'], pants: '#f08a32', need: 15, word: 'tigersuit' },
  dragon: { shirt: ['dragon', '#58a84a', '#3d7f33'], pants: '#58a84a', need: 50, word: 'dragonsuit' },
  cowboy: { pants: '#3f5a8a', need: 30, word: 'cowboyhat' },
};
function costumeBody(c, x, bodyTop, bodyH, half, kind) {
  const K = '#2a1d18';
  if (kind === 'tiger') {
    px(c, x - half + 1, bodyTop + 1, 1, 3, K); px(c, x - 1, bodyTop + 2, 2, 1, K); px(c, x + half - 2, bodyTop + 1, 1, 3, K);
    px(c, x + half, bodyTop + bodyH - 2, 3, 1, '#f08a32'); px(c, x + half + 2, bodyTop + bodyH - 5, 1, 3, '#f08a32'); px(c, x + half + 2, bodyTop + bodyH - 6, 1, 1, K);
  }
  if (kind === 'dragon') {
    px(c, x - 2, bodyTop + 1, 4, bodyH - 2, '#f4cf3a'); px(c, x - 2, bodyTop + 3, 4, 1, '#e8b02a');
    px(c, x + half, bodyTop + bodyH - 2, 3, 1, '#58a84a'); px(c, x + half + 2, bodyTop + bodyH - 4, 2, 2, '#58a84a'); px(c, x + half + 3, bodyTop + bodyH - 5, 1, 1, '#f4cf3a');
  }
  if (kind === 'cowboy') {
    px(c, x - half, bodyTop, 2, bodyH - 1, '#8a5a35'); px(c, x + half - 2, bodyTop, 2, bodyH - 1, '#8a5a35');
    px(c, x - 2, bodyTop, 4, 2, '#e2483d'); px(c, x - 1, bodyTop + 2, 2, 1, '#e2483d');
  }
}
function costumeHead(c, x, ht, kind) {
  if (kind === 'tiger') {
    px(c, x - 6, ht - 2, 3, 3, '#f08a32'); px(c, x + 3, ht - 2, 3, 3, '#f08a32');
    px(c, x - 5, ht - 1, 1, 1, '#f7a0a0'); px(c, x + 4, ht - 1, 1, 1, '#f7a0a0');
    px(c, x - 1, ht, 2, 1, '#2a1d18'); px(c, x - 2, ht + 1, 1, 1, '#2a1d18'); px(c, x + 1, ht + 1, 1, 1, '#2a1d18');
  }
  if (kind === 'dragon') {
    px(c, x - 4, ht - 3, 2, 2, '#f4cf3a'); px(c, x - 1, ht - 4, 2, 3, '#f4cf3a'); px(c, x + 2, ht - 3, 2, 2, '#f4cf3a');
    px(c, x - 6, ht, 2, 2, '#58a84a'); px(c, x + 4, ht, 2, 2, '#58a84a');
  }
  if (kind === 'cowboy') {
    px(c, x - 10, ht + 1, 20, 2, '#8a5a35'); px(c, x - 11, ht, 2, 1, '#8a5a35'); px(c, x + 9, ht, 2, 1, '#8a5a35');
    px(c, x - 5, ht - 4, 10, 5, '#a8743c'); px(c, x - 1, ht - 4, 2, 1, '#8a5a35'); px(c, x - 5, ht, 10, 1, '#5a3a22');
  }
}

// ---------- Trik Dòudou ----------
function drawDogTrick(c, x, y, dir, f, state, t) {
  if (state === 'roll') {
    const ph = Math.floor(t * 8) % 4;
    if (ph === 1 || ph === 2) { c.save(); c.translate(0, Math.round(y - 7) * 2); c.scale(1, -1); drawDog(c, x, y, dir, 0, 'walk', t); c.restore(); }
    else drawDog(c, x, y, dir, 0, 'walk', t);
    return;
  }
  if (state === 'shake') {
    drawDog(c, x, y, dir, 0, 'sit', t);
    const up = Math.sin(t * 10) > 0 ? 1 : 0;
    px(c, Math.round(x) + (dir > 0 ? 6 : -8), Math.round(y) - 11 - up, 2, 5, '#d39552'); px(c, Math.round(x) + (dir > 0 ? 6 : -8), Math.round(y) - 12 - up, 3, 2, '#fbe8cc');
    return;
  }
  drawDog(c, x, y, dir, f, state, t);
}

// ---------- Robot & mesin kopi (kantor Ayah) ----------
// carry: true = kopi, 'milk' = susu; dance: melompat sambil mengangkat tangan bergantian
function drawRobot(c, x, y, dir, t, carry, moving, dance) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 7);
  const swing = Math.floor(t * 6) % 2;
  const bob = dance ? (swing ? 3 : 0) : moving && Math.floor(t * 8) % 2 ? 1 : 0, blink = Math.floor(t * 2) % 7 === 0;
  px(c, x - 5, y - 3 - bob, 4, 3 + bob, '#4a4a52'); px(c, x + 1, y - 3 - bob, 4, 3 + bob, '#4a4a52'); px(c, x - 5, y - 2, 4, 1, '#7d8a98'); px(c, x + 1, y - 2, 4, 1, '#7d8a98');
  const by = y - bob;
  px(c, x - 6, by - 14, 12, 11, '#c9d4e0'); px(c, x - 6, by - 14, 12, 1, '#e8eef2'); px(c, x - 6, by - 4, 12, 1, '#9aa8b8');
  px(c, x - 4, by - 12, 8, 5, '#4f86e0'); px(c, x - 3, by - 11, 2, 1, Math.floor(t * 3) % 2 ? '#8fe07a' : '#2f5bab'); px(c, x + 1, by - 11, 2, 1, Math.floor(t * 3) % 2 ? '#2f5bab' : '#ffd84a');
  if (carry) {
    px(c, x + dir * 5 - (dir < 0 ? 4 : 0), by - 11, 5, 2, '#9aa8b8');
    const cx = x + dir * 9 - (dir < 0 ? 4 : 0);
    px(c, cx, by - 15, 4, 4, '#ffffff'); px(c, cx, by - 15, 4, 1, carry === 'milk' ? '#dfe8f0' : '#7d5230'); px(c, cx + (dir > 0 ? 4 : -1), by - 14, 1, 2, '#ffffff');
    if (carry !== 'milk' && Math.floor(t * 4) % 2) px(c, cx + 1, by - 18, 1, 2, 'rgba(255,255,255,0.8)');
    px(c, x - dir * 6 - (dir > 0 ? 2 : 0), by - 12, 2, 6, '#9aa8b8');
  } else if (dance) {
    [[x - 8, swing], [x + 6, !swing]].forEach(([ax, up]) => {
      px(c, ax, by - (up ? 19 : 12), 2, up ? 7 : 6, '#9aa8b8'); px(c, ax, by - (up ? 20 : 6), 2, 1, '#4a4a52');
    });
  } else { px(c, x - 8, by - 12, 2, 6, '#9aa8b8'); px(c, x + 6, by - 12, 2, 6, '#9aa8b8'); px(c, x - 8, by - 6, 2, 1, '#4a4a52'); px(c, x + 6, by - 6, 2, 1, '#4a4a52'); }
  px(c, x - 6, by - 26, 12, 11, '#e8eef2'); px(c, x - 5, by - 27, 10, 1, '#e8eef2'); px(c, x - 6, by - 16, 12, 1, '#c9d4e0');
  px(c, x - 4, by - 24, 8, 6, '#2a3a4a');
  if (blink) { px(c, x - 3, by - 21, 2, 1, '#7cf0c4'); px(c, x + 1, by - 21, 2, 1, '#7cf0c4'); }
  else { px(c, x - 3 + (dir > 0 ? 1 : 0), by - 22, 2, 2, '#7cf0c4'); px(c, x + 1 + (dir > 0 ? 1 : 0), by - 22, 2, 2, '#7cf0c4'); }
  px(c, x - 1, by - 19, 2, 1, '#7cf0c4');
  px(c, x - 7, by - 23, 1, 3, '#9aa8b8'); px(c, x + 6, by - 23, 1, 3, '#9aa8b8');
  px(c, x, by - 31, 1, 4, '#7d8a98'); disc(c, x, by - 32, 1, Math.floor(t * 2) % 2 ? '#e2483d' : '#ff9a8a');
}
function drawCoffeeMachine(c, x, y, brewing, t, noCup) {
  x = Math.round(x); y = Math.round(y);
  px(c, x - 16, y - 14, 32, 14, '#d9b98a'); px(c, x - 16, y - 14, 32, 2, '#ead2a8'); px(c, x - 16, y - 2, 32, 2, '#a8865a');
  px(c, x - 9, y - 34, 16, 20, '#3a3f4a'); px(c, x - 9, y - 34, 16, 2, '#5a6070'); px(c, x - 6, y - 30, 10, 5, '#7d8a98');
  px(c, x - 5, y - 29, 2, 2, brewing ? '#8fe07a' : '#e2483d'); px(c, x - 2, y - 24, 4, 2, '#2a2a2e');
  if (!noCup) { px(c, x - 3, y - 19, 6, 5, '#ffffff'); px(c, x - 3, y - 19, 6, 1, '#7d5230'); }
  if (brewing) { if (Math.floor(t * 8) % 2) px(c, x - 1, y - 22, 1, 3, '#7d5230'); for (let k = 0; k < 2; k++) px(c, x - 2 + k * 3, y - 24 - ((t * 10 + k * 3) % 6), 1, 2, 'rgba(255,255,255,0.75)'); }
  px(c, x + 9, y - 22, 6, 8, '#7d5230'); px(c, x + 9, y - 22, 6, 2, '#a8743c');
}

// ---------- Hari raya ----------
function drawHangingLantern(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  const sw = Math.sin(t * 1.5 + x) > 0.6 ? 1 : 0;
  px(c, x + sw, y - 6, 1, 4, '#5a3a22'); oval(c, x + sw, y + 2, 4, 5, '#e2483d');
  px(c, x - 3 + sw, y - 3, 7, 1, '#f4cf3a'); px(c, x - 3 + sw, y + 7, 7, 1, '#f4cf3a'); px(c, x + sw, y + 8, 1, 3, '#f4cf3a');
  px(c, x - 1 + sw, y, 1, 4, '#ff8a7a');
}
function drawLionDance(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 16);
  const hop = Math.round(Math.abs(Math.sin(t * 4)) * 4), tilt = Math.sin(t * 2) > 0 ? 1 : -1;
  for (const lx of [-10, -5, 4, 9]) { px(c, x + lx, y - 6 + (lx % 2 ? 0 : -1), 2, 6, '#f4cf3a'); px(c, x + lx - 1, y - 1, 3, 1, '#2a1d18'); }
  px(c, x - 14, y - 16, 20, 10, '#e2483d'); for (let i = -14; i < 6; i += 3) px(c, x + i, y - 8, 2, 3, '#f4cf3a');
  px(c, x - 14, y - 16, 20, 2, '#f4cf3a');
  const hx = x + 8, hy = y - 22 - hop;
  px(c, hx - 6, hy - 6, 14, 14, '#e2483d'); px(c, hx - 7, hy - 7, 16, 3, '#f4cf3a'); px(c, hx - 7, hy + 6, 16, 2, '#ffffff');
  px(c, hx - 4, hy - 2, 4, 4, '#ffffff'); px(c, hx + 2, hy - 2, 4, 4, '#ffffff'); px(c, hx - 2 + tilt, hy, 2, 2, '#2a1d18'); px(c, hx + 3 + tilt, hy, 2, 2, '#2a1d18');
  px(c, hx - 1, hy + 3, 4, 2, '#58a84a'); px(c, hx + 1, hy - 9, 1, 3, '#f4cf3a'); disc(c, hx + 1, hy - 10, 1, '#58a84a');
}
function drawCake(c, x, y, lit, t) {
  x = Math.round(x); y = Math.round(y);
  oval(c, x, y - 1, 10, 2, '#e8eef2');
  px(c, x - 8, y - 8, 16, 7, '#f39ac0'); px(c, x - 8, y - 8, 16, 2, '#ffffff'); px(c, x - 5, y - 13, 10, 5, '#fbf0dc'); px(c, x - 5, y - 13, 10, 1, '#ffffff');
  for (const dx of [-6, -2, 2, 6]) px(c, x + dx, y - 6, 1, 1, '#e2483d');
  for (const dx of [-3, 0, 3]) { px(c, x + dx, y - 17, 1, 4, '#4f86e0'); if (lit) px(c, x + dx, y - 19 - (Math.floor(t * 8 + dx) % 2), 1, 2, '#ffd84a'); }
}
function drawFirework(c, x, y, k, col) {
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; px(c, Math.round(x + Math.cos(a) * k * 14), Math.round(y + Math.sin(a) * k * 14), 1, 1, col); }
  px(c, x, y, 1, 1, '#ffffff');
}

// barang baru: angpao & kue bulan
Object.assign(ITEMS, { redpacket: {}, mooncake: { food: 1 } });
const _drawItemBase = drawItem;
drawItem = function (c, x, y, type, big) {
  x = Math.round(x); y = Math.round(y);
  if (type === 'redpacket') { px(c, x - 3, y - 9, 7, 9, '#e2483d'); px(c, x - 3, y - 9, 7, 3, '#c9372e'); disc(c, x, y - 5, 1, '#f4cf3a'); return; }
  if (type === 'mooncake') { disc(c, x, y - 4, 4, '#c98a4b'); disc(c, x, y - 4, 2, '#e8b06a'); px(c, x - 1, y - 5, 3, 1, '#a8743c'); px(c, x, y - 6, 1, 3, '#a8743c'); return; }
  _drawItemBase(c, x, y, type, big);
};
