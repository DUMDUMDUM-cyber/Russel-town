// Gambar tambahan: akuarium, laptop, pantai, dan barang yang bisa masuk tas.

function drawAquarium(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y + 1, 22);
  px(c, x - 22, y - 12, 44, 12, '#7d5230'); px(c, x - 22, y - 12, 44, 1, '#a8743c'); px(c, x - 18, y - 9, 16, 7, '#8a5a35'); px(c, x + 2, y - 9, 16, 7, '#8a5a35');
  px(c, x - 21, y - 38, 42, 26, '#cfe8f5'); px(c, x - 20, y - 34, 40, 21, '#4fa0cf'); px(c, x - 20, y - 34, 40, 2, '#8fd0f2');
  for (let i = 0; i < 40; i += 3) px(c, x - 20 + i, y - 15 + (i % 2), 3, 2, i % 6 ? '#e9c86a' : '#c9a24a');
  for (const [px0, h] of [[-15, 12], [-10, 8], [12, 14], [16, 9]]) for (let k = 0; k < h; k++) px(c, x + px0 + Math.round(Math.sin(t * 2 + k * 0.6) * 1), y - 14 - k, 1, 1, k % 2 ? '#3f8a3a' : '#58a84a');
  const fish = [['#f08a32', 0, -28], ['#f4cf3a', 2.1, -22], ['#e2483d', 4.2, -18]];
  fish.forEach(([col, ph, fy]) => {
    const fx = Math.round(Math.sin(t * 0.7 + ph) * 13), dir = Math.cos(t * 0.7 + ph) > 0 ? 1 : -1;
    flip(c, x + fx, dir, () => {
      px(c, -2, y + fy - 1, 5, 3, col); px(c, -4, y + fy - 2, 2, 5, col); px(c, 1, y + fy - 1, 1, 1, '#2a1d18');
    });
  });
  for (let i = 0; i < 4; i++) { const by = y - 15 - ((t * 12 + i * 6) % 20); px(c, x + 8 + (i % 2) * 2, by, 1, 1, '#e3f5fc'); }
  px(c, x - 21, y - 38, 42, 1, '#ffffff'); px(c, x - 21, y - 38, 1, 26, '#ffffff');
}

function drawLaptop(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  px(c, x, y - 11, 16, 11, '#3a3f4a'); px(c, x + 1, y - 10, 14, 8, '#8fd0f2');
  const blink = Math.floor(t * 2) % 4 === 0;
  px(c, x + 4, y - 8, 2, blink ? 1 : 2, '#2a1d18'); px(c, x + 10, y - 8, 2, blink ? 1 : 2, '#2a1d18'); px(c, x + 5, y - 5, 6, 1, '#2a1d18');
  px(c, x - 2, y, 20, 3, '#c8ccd4'); px(c, x - 2, y + 2, 20, 1, '#9aa0aa'); px(c, x + 5, y + 1, 6, 1, '#e8eaee');
}

// ---------- Pantai ----------
function drawPalm(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x + 4, y, 10);
  for (let i = 0; i < 30; i++) { const ox = Math.round(Math.sin(i / 12) * 6); px(c, x + ox - 2, y - i, 4, 1, i % 4 === 0 ? '#8a5a35' : '#a8743c'); }
  const tx = x + 5, ty = y - 30, sw = Math.round(Math.sin(t * 1.5) * 1);
  for (const [dx, dy] of [[-1, 0], [1, 0], [-1, 0.6], [1, 0.6], [0, -1]]) for (let k = 0; k < 14; k++) {
    const fx = tx + Math.round(dx * k), fy = ty + Math.round(dy * k + (dx ? k * k / 30 : 0)) + (dx ? sw : 0);
    px(c, fx - 1, fy, 3, 2, k % 3 ? '#4a9a3a' : '#2f7a2c');
  }
  disc(c, tx - 2, ty + 3, 2, '#7d5230'); disc(c, tx + 2, ty + 4, 2, '#6b4226');
}
function drawParasol(c, x, y) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y + 1, 16);
  px(c, x, y - 30, 1, 30, '#e8e2d6');
  for (let dy = -8; dy <= 0; dy++) {
    const w = Math.floor(17 * Math.sqrt(1 - (dy * dy) / 64));
    for (let i = -w; i <= w; i++) px(c, x + i, y - 30 + dy, 1, 1, Math.floor((i + 20) / 6) % 2 ? '#ffffff' : '#e2483d');
  }
  px(c, x - 1, y - 40, 3, 2, '#e2483d');
}
function drawSandcastle(c, x, y, lvl) {
  x = Math.round(x); y = Math.round(y);
  const S = '#e3c47a', D = '#c9a24a';
  oval(c, x, y - 2, 14, 3, D);
  if (lvl >= 1) { px(c, x - 12, y - 8, 24, 7, S); px(c, x - 12, y - 2, 24, 1, D); }
  if (lvl >= 2) { px(c, x - 6, y - 18, 12, 10, S); for (let i = -6; i < 6; i += 4) px(c, x + i, y - 20, 2, 2, S); px(c, x - 1, y - 13, 2, 3, D); }
  if (lvl >= 3) { px(c, x - 12, y - 14, 5, 6, S); px(c, x + 7, y - 14, 5, 6, S); px(c, x, y - 28, 1, 8, '#7d5230'); px(c, x + 1, y - 28, 5, 3, '#e2483d'); }
}
function drawCrab(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 6);
  const leg = Math.floor(t * 10) % 2;
  for (let i = -1; i <= 1; i++) { px(c, x - 7, y - 3 + i * 2 + (leg && i === 0 ? 1 : 0), 3, 1, '#c9372e'); px(c, x + 5, y - 3 + i * 2 + (!leg && i === 0 ? 1 : 0), 3, 1, '#c9372e'); }
  oval(c, x, y - 4, 5, 3, '#e2483d'); px(c, x - 3, y - 6, 2, 1, '#f08a7a');
  px(c, x - 9, y - 9, 3, 3, '#e2483d'); px(c, x - 8, y - 10, 1, 1, '#e2483d'); px(c, x + 7, y - 9, 3, 3, '#e2483d'); px(c, x + 9, y - 10, 1, 1, '#e2483d');
  px(c, x - 2, y - 9, 1, 2, '#c9372e'); px(c, x + 2, y - 9, 1, 2, '#c9372e');
  px(c, x - 3, y - 11, 2, 2, '#ffffff'); px(c, x + 2, y - 11, 2, 2, '#ffffff'); px(c, x - 2, y - 11, 1, 1, '#2a1d18'); px(c, x + 2, y - 11, 1, 1, '#2a1d18');
}
function drawSeagull(c, x, y, t, flying) {
  x = Math.round(x); y = Math.round(y);
  if (flying) {
    const up = Math.sin(t * 8) > 0;
    px(c, x - 2, y - 1, 5, 2, '#ffffff'); px(c, x + 3, y - 1, 2, 1, '#f4b23a');
    if (up) { px(c, x - 7, y - 4, 5, 1, '#c9ccd2'); px(c, x + 3, y - 4, 5, 1, '#c9ccd2'); px(c, x - 3, y - 3, 2, 2, '#c9ccd2'); px(c, x + 2, y - 3, 2, 2, '#c9ccd2'); }
    else { px(c, x - 7, y + 1, 6, 1, '#c9ccd2'); px(c, x + 2, y + 1, 6, 1, '#c9ccd2'); }
    return;
  }
  shadow(c, x, y, 4);
  px(c, x - 4, y - 7, 7, 4, '#ffffff'); px(c, x - 4, y - 6, 5, 2, '#c9ccd2'); px(c, x + 1, y - 10, 4, 4, '#ffffff');
  px(c, x + 5, y - 8, 2, 1, '#f4b23a'); px(c, x + 3, y - 9, 1, 1, '#2a1d18'); px(c, x - 1, y - 3, 1, 3, '#f4b23a'); px(c, x + 1, y - 3, 1, 3, '#f4b23a');
}

// ---------- Barang ----------
const ITEMS = {
  apple: { food: 1 }, egg: { food: 1 }, carrot: { food: 1 }, tomato: { food: 1 }, watermelon: { food: 1 }, corn: { food: 1 },
  bun: { food: 1 }, milk: { food: 1 }, rice: { food: 1 }, noodles: { food: 1 }, dumpling: { food: 1 }, fish: { food: 1 },
  shell: {}, starfish: {}, mushroom: { warn: 1 }, wildflower: {}, pencil: {}, crayon: {}, wool: {},
};

// Penghalus piksel Scale2x (EPX): s = sumber w×h, d = tujuan (2w)×(2h)
function epx(s, d, w, h) {
  const w2 = w * 2;
  for (let y = 0; y < h; y++) {
    const row = y * w, ru = (y > 0 ? y - 1 : y) * w, rd = (y < h - 1 ? y + 1 : y) * w, o0 = y * 2 * w2, o1 = o0 + w2;
    for (let x = 0; x < w; x++) {
      const P = s[row + x], A = s[ru + x], D = s[rd + x], C = s[row + (x > 0 ? x - 1 : x)], B = s[row + (x < w - 1 ? x + 1 : x)];
      let e0 = P, e1 = P, e2 = P, e3 = P;
      if (A !== D && C !== B) { if (C === A) e0 = A; if (A === B) e1 = B; if (D === C) e2 = C; if (B === D) e3 = D; }
      const o = x * 2;
      d[o0 + o] = e0; d[o0 + o + 1] = e1; d[o1 + o] = e2; d[o1 + o + 1] = e3;
    }
  }
}
function scale2xCanvas(src) {
  const w = src.width, h = src.height, out = document.createElement('canvas');
  out.width = w * 2; out.height = h * 2;
  const oc = out.getContext('2d'), img = oc.createImageData(w * 2, h * 2);
  epx(new Uint32Array(src.getContext('2d').getImageData(0, 0, w, h).data.buffer), new Uint32Array(img.data.buffer), w, h);
  oc.putImageData(img, 0, 0);
  return out;
}
// 4× lebih banyak piksel dengan tepi yang tetap rapi
function upscale4(src) { return scale2xCanvas(scale2xCanvas(src)); }
function upscale8(src) { return scale2xCanvas(upscale4(src)); }

// ---------- Kendaraan besar ----------
function drawDragonBoat(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  const bob = Math.sin(t * 2) > 0 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy + bob, w, h, k);
    const G1 = '#58a84a', G2 = '#3d7f33', G3 = '#7cc85a', Y = '#f4cf3a';
    P(-36, -1, 76, 1, PAL.waterL);
    P(-30, -7, 62, 1, Y); P(-30, -6, 62, 4, '#a8352b'); P(-28, -2, 58, 2, '#7d2a22');
    for (let i = -28; i < 30; i += 4) { P(i, -5, 2, 1, G1); P(i + 2, -4, 2, 1, G2); }
    // ekor naga
    P(-34, -10, 5, 4, G1); P(-37, -15, 4, 6, G1); P(-40, -19, 5, 4, G3); P(-37, -20, 2, 2, Y); P(-41, -16, 2, 2, Y);
    // leher & kepala naga
    P(28, -12, 5, 7, G1); P(31, -17, 5, 6, G1); P(31, -22, 10, 7, G1); P(32, -22, 8, 1, G3);
    P(40, -20, 4, 4, G3); P(43, -19, 1, 1, '#2a1d18');
    P(34, -21, 3, 3, '#ffffff'); P(35, -20, 2, 2, '#2a1d18');
    P(32, -25, 1, 3, Y); P(36, -26, 1, 4, Y); P(29, -23, 2, 8, '#f08a32');
    P(38, -16, 5, 1, '#e2483d'); P(44, -17, 3, 1, Y); P(44, -21, 3, 1, Y);
    // pendayung kecil
    [-20, -8, 4, 16].forEach((rx, i) => {
      P(rx - 2, -12, 5, 5, '#f6c9a3'); P(rx - 2, -13, 5, 2, i % 2 ? '#5a321e' : '#2a1d18'); P(rx - 2, -8, 5, 2, i % 2 ? '#f4cf3a' : '#e2483d');
      const sw = Math.sin(t * 6 + i) > 0 ? 1 : -1;
      P(rx + 2, -9, 1, 6, '#7d5230'); P(rx + 2 + sw, -3, 2, 3, '#7d5230');
    });
    P(-30, -13, 5, 6, '#e2483d'); P(-30, -14, 5, 1, Y);
  });
}
function drawBigPlane(c, x, y, dir) {
  x = Math.round(x); y = Math.round(y);
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    for (let k = 0; k < 26; k++) {
      const sx = -4 - Math.round(k * 0.45), w = 15 - Math.round(k * 0.3);
      P(sx, -4 - k, w, 1, '#e8e2d6'); P(sx, 4 + k, w, 1, '#e8e2d6');
    }
    P(-16, -30, 6, 2, '#e2483d'); P(-16, 29, 6, 2, '#e2483d');
    P(-1, -16, 8, 3, '#c9ccd2'); P(-1, 14, 8, 3, '#c9ccd2'); P(7, -16, 1, 3, '#7d8a98'); P(7, 14, 1, 3, '#7d8a98');
    for (let k = 0; k < 10; k++) { const sx = -33 - Math.round(k * 0.4); P(sx, -3 - k, 7, 1, '#e8e2d6'); P(sx, 3 + k, 7, 1, '#e8e2d6'); }
    P(-34, -4, 70, 9, '#fbf8f0'); P(36, -3, 3, 7, '#fbf8f0'); P(39, -2, 2, 5, '#e8e2d6');
    P(30, -3, 5, 7, '#4f86e0'); P(31, -2, 2, 2, '#bfe3f2');
    P(-32, 2, 64, 1, '#4f86e0'); P(-36, -1, 9, 3, '#e2483d');
    for (let i = -26; i < 26; i += 5) P(i, -3, 2, 1, '#9fb8cc');
  });
}

// ---------- Teman sekelas ----------
Object.assign(LOOKS, {
  kid1: { kid: 1, skin: '#ffd9bd', hair: '#4a2c1c', hairL: '#6a4430', style: 'short', shirt: '#58a84a', shirtD: '#3d7f33', dress: 1, shoes: '#ffffff', bow: '#f4cf3a' },
  kid2: { kid: 1, skin: '#e9b48a', hair: '#2a1d18', hairL: '#4a3a30', style: 'bowl', shirt: '#f08a32', shirtD: '#bd5e1c', pants: '#3f6fb5', shoes: '#2f2620' },
  kid3: { kid: 1, skin: '#ffd2b0', hair: '#3a2418', hairL: '#5a3a28', style: 'pigtails', shirt: '#9b6bd6', shirtD: '#6c45a3', dress: 1, shoes: '#e2483d', bow: '#f39ac0' },
  kid4: { kid: 1, skin: '#f6cba6', hair: '#5a321e', hairL: '#7a4a30', style: 'boy', shirt: '#3fa0b8', shirtD: '#2a7a8a', pants: '#4a4a52', shoes: '#6b3e22' },
});

// ---------- Kereta (3 jenis, besar) — x = ujung depan, y = rel ----------
const TRAIN_LEN = { steam: 226, bullet: 210, freight: 226 };
function drawTrain(c, x, y, type, t) {
  x = Math.round(x); y = Math.round(y);
  const P = (dx, dy, w, h, k) => px(c, x + dx, y + dy, w, h, k);
  const spin = Math.floor(t * 12) % 2;
  const wheel = (dx, r) => { disc(c, x + dx, y - r, r, '#2a2a2e'); disc(c, x + dx, y - r, Math.max(1, r - 2), '#7d8a98'); px(c, x + dx - (spin ? 1 : 0), y - r, 1, 1, '#e9e9ef'); };
  const head = (dx, dy, hair) => { P(dx, dy + 1, 5, 4, '#f6c9a3'); P(dx, dy, 5, 2, hair); P(dx + 1, dy + 3, 1, 1, '#2a1d18'); P(dx + 3, dy + 3, 1, 1, '#2a1d18'); };
  const hairs = ['#2a1d18', '#5a321e', '#e8e4dc', '#3a2418', '#7a4a30'];
  if (type === 'steam') {
    P(-6, -12, 6, 5, '#4a4a52'); P(-3, -7, 3, 3, '#4a4a52');
    P(-46, -32, 42, 20, '#d9483b'); P(-46, -32, 42, 2, '#ef7a6a'); P(-36, -32, 2, 20, '#f4cf3a'); P(-22, -32, 2, 20, '#f4cf3a');
    P(-6, -32, 3, 20, '#4a4a52'); P(-5, -27, 3, 4, '#fff2a8');
    P(-18, -44, 8, 12, '#2a2a2e'); P(-20, -46, 12, 3, '#3a3a3a'); P(-32, -37, 8, 5, '#f4cf3a');
    P(-68, -46, 22, 36, '#a8352b'); P(-70, -48, 26, 3, '#2a2a2e'); P(-64, -42, 13, 11, '#fff2c8'); head(-60, -40, '#2a1d18');
    P(-68, -12, 66, 3, '#2a2a2e');
    wheel(-56, 7); wheel(-38, 7); wheel(-20, 7); wheel(-6, 4);
    P(-98, -32, 28, 22, '#3a3a3a'); P(-96, -36, 24, 4, '#1f1a16'); wheel(-92, 4); wheel(-76, 4);
    [['#58a84a', '#3d7f33'], ['#4f86e0', '#2f5bab']].forEach(([k1, k2], n) => {
      const bx = -164 - n * 64;
      P(bx, -40, 60, 30, k1); P(bx - 1, -42, 62, 3, '#4a4a52'); P(bx, -14, 60, 2, k2);
      for (let i = 0; i < 4; i++) { P(bx + 5 + i * 14, -35, 10, 10, '#fff2c8'); if ((i + n) % 3 !== 1) head(bx + 7 + i * 14, -33, hairs[(i + n * 2) % 5]); }
      wheel(bx + 10, 4); wheel(bx + 50, 4); P(bx + 60, -14, 6, 2, '#2a2a2e');
    });
  } else if (type === 'bullet') {
    for (let r = 0; r < 30; r++) P(-70, -36 + r, 40 + Math.round(r * 1.1), 1, r < 2 ? '#e8eef2' : '#fbfbfb');
    P(-66, -30, 30, 6, '#2f4a7a'); for (let r = 0; r < 6; r++) P(-36, -30 + r, 4 + r, 1, '#2f4a7a');
    P(-70, -14, 64, 3, '#4f86e0'); P(-70, -9, 66, 3, '#9aa0aa'); P(-4, -12, 3, 2, '#fff2a8');
    wheel(-58, 3); wheel(-48, 3); wheel(-24, 3);
    for (let n = 0; n < 2; n++) {
      const bx = -142 - n * 72;
      P(bx, -36, 70, 27, '#fbfbfb'); P(bx, -36, 70, 2, '#e8eef2'); P(bx + 3, -30, 64, 6, '#2f4a7a');
      for (let i = 0; i < 6; i++) { P(bx + 13 + i * 10, -30, 1, 6, '#fbfbfb'); if (i % 2 === n % 2) head(bx + 6 + i * 10, -30, hairs[(i + n) % 5]); }
      P(bx, -14, 70, 3, '#4f86e0'); P(bx, -9, 70, 3, '#9aa0aa');
      if (n === 0) { P(bx + 30, -42, 1, 6, '#4a4a52'); P(bx + 26, -43, 9, 1, '#4a4a52'); }
      wheel(bx + 8, 3); wheel(bx + 16, 3); wheel(bx + 54, 3); wheel(bx + 62, 3);
    }
  } else {
    P(-52, -38, 48, 28, '#f4b23a'); P(-52, -38, 48, 2, '#ffd08a'); P(-52, -46, 20, 8, '#e09a22'); P(-48, -44, 12, 5, '#bfe3f2'); head(-46, -44, '#5a321e');
    for (let i = 0; i < 4; i++) { P(-6, -34 + i * 6, 4, 3, i % 2 ? '#2a2a2e' : '#f4cf3a'); }
    P(-4, -30, 2, 3, '#fff2a8'); P(-52, -12, 50, 3, '#2a2a2e');
    wheel(-44, 5); wheel(-30, 5); wheel(-14, 5);
    ['#e2483d', '#4f86e0', '#58a84a'].forEach((k, n) => {
      const bx = -112 - n * 58;
      P(bx, -12, 56, 4, '#4a4a52'); P(bx + 2, -36, 52, 24, k);
      for (let i = 4; i < 52; i += 5) P(bx + 2 + i, -36, 1, 24, 'rgba(0,0,0,0.18)');
      P(bx + 2, -36, 52, 2, 'rgba(255,255,255,0.3)');
      wheel(bx + 8, 4); wheel(bx + 48, 4); P(bx + 56, -12, 4, 2, '#2a2a2e');
    });
  }
}

// ---------- Drum di ruang kelas ----------
function drawDrumKit(c, x, y, t, hit) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 18);
  const b = hit > 0 ? 1 : 0;
  // drum besar (tampak depan)
  disc(c, x - 4, y - 10, 10, '#a8352b'); disc(c, x - 4, y - 10, 8, '#f6efe0'); disc(c, x - 4, y - 10, 3, '#e2483d');
  px(c, x - 14, y - 11, 20, 1, '#f4cf3a');
  // drum kecil di kaki
  px(c, x + 10, y - 14, 1, 14, '#7d8a98'); oval(c, x + 10, y - 17 + b, 6, 2, '#f6efe0'); px(c, x + 4, y - 17 + b, 13, 4, '#4f86e0'); px(c, x + 4, y - 14 + b, 13, 1, '#2f5bab');
  // lonceng
  px(c, x - 16, y - 28, 1, 26, '#7d8a98'); oval(c, x - 16, y - 28 + (Math.sin(t * 3) > 0.9 ? 1 : 0), 6, 1, '#f4cf3a');
  // stik drum
  px(c, x + 2, y - 22 - b, 7, 1, '#c08a52'); px(c, x + 3, y - 25 - b, 7, 1, '#c08a52');
}

// ---------- Pintu kandang ----------
function drawGate(c, x, y, open) {
  if (!open) {
    for (const gx of [x + 2, x + 13]) {
      px(c, gx, y - 9, 10, 9, PAL.woodD); px(c, gx + 1, y - 8, 8, 7, PAL.wood);
      for (let k = 0; k < 7; k++) px(c, gx + 1 + k, y - 2 - k, 1, 1, PAL.woodD);
    }
    px(c, x + 12, y - 6, 1, 3, '#f4cf3a');
  } else {
    px(c, x + 2, y - 15, 3, 15, PAL.woodD); px(c, x + 3, y - 14, 1, 13, PAL.wood);
    px(c, x + 20, y - 15, 3, 15, PAL.woodD); px(c, x + 21, y - 14, 1, 13, PAL.wood);
  }
  px(c, x, y - 11, 2, 12, PAL.woodD); px(c, x + 23, y - 11, 2, 12, PAL.woodD);
}

// ---------- Detail bagian bunga (kanvas 48x56) ----------
function drawFlowerDetail(c, part, col, t) {
  c.clearRect(0, 0, 48 * PX, 56 * PX);
  if (part === 'root') {
    for (let y = 0; y < 56; y++) px(c, 0, y, 48, 1, y < 4 ? PAL.grass : (y % 9 === 0 ? '#7a4c2c' : '#8a5a35'));
    for (let i = 0; i < 14; i++) px(c, (i * 17) % 46, 8 + (i * 11) % 46, 2, 1, '#6b4226');
    [[8, 20], [38, 14], [12, 44], [40, 40]].forEach(([a, b]) => { oval(c, a, b, 2, 1, PAL.stone); px(c, a - 1, b - 1, 1, 1, '#c9c6c0'); });
    px(c, 22, 0, 4, 4, '#3f8a3a');
    const R = '#f0dcae', Rd = '#d9c08a';
    const branch = (x0, y0, a, len, d) => {
      let x = x0, y = y0;
      for (let i = 0; i < len; i++) { x += Math.cos(a); y += Math.sin(a); a += Math.sin(i * 0.7 + d) * 0.08; px(c, Math.round(x), Math.round(y), d > 2 ? 2 : 1, 1, i % 4 ? R : Rd); }
      if (d > 0) { branch(x, y, a - 0.6, len * 0.6, d - 1); branch(x, y, a + 0.6, len * 0.6, d - 1); }
    };
    branch(24, 3, Math.PI / 2, 18, 3);
    for (let k = 0; k < 4; k++) { const yy = 50 - ((t * 10 + k * 13) % 44); px(c, 14 + k * 7, Math.round(yy), 1, 2, '#8fd0f2'); }
    return;
  }
  px(c, 0, 0, 48, 56, '#dff1fb');
  for (let i = 0; i < 5; i++) px(c, 4 + i * 9, 50 - (i % 2) * 3, 4, 1, '#f4fbff');
  if (part === 'leaf') {
    for (let x = 4; x <= 44; x += 0.5) {
      const k = (x - 4) / 40, h = Math.sin(Math.PI * k) * 15;
      px(c, x, 28 - h, 0.5, h * 2 + 1, '#58a84a'); px(c, x, 28 - h, 0.5, Math.max(1, h * 0.55), '#7cc85a');
      px(c, x, 28 - h, 0.5, 0.5, '#2f6e26'); px(c, x, 28 + h + 0.5, 0.5, 0.5, '#2f6e26');
    }
    px(c, 0, 28, 6, 2, '#3d7f33'); px(c, 4, 28, 40, 1, '#3d7f33');
    for (let i = 9; i < 40; i += 6) for (let k = 0; k < 7; k += 0.5) {
      const lim = Math.sin(Math.PI * (i + k - 4) / 40) * 15 - 2;
      if (k < lim) { px(c, i + k, 27 - k, 0.5, 0.5, '#3d7f33'); px(c, i + k, 29 + k, 0.5, 0.5, '#3d7f33'); }
    }
    disc(c, 30, 19, 2, '#cfefff'); px(c, 29, 18, 1, 1, '#ffffff');
  } else if (part === 'stem') {
    px(c, 21, 0, 6, 56, '#3f8a3a'); px(c, 22, 0, 2, 56, '#58a84a'); px(c, 26, 0, 1, 56, '#2f6e26');
    for (const ny of [16, 38]) px(c, 20, ny, 8, 2, '#2f6e26');
    oval(c, 13, 14, 7, 2, '#58a84a'); px(c, 6, 14, 14, 1, '#3d7f33');
    oval(c, 35, 36, 7, 2, '#58a84a'); px(c, 28, 36, 14, 1, '#3d7f33');
    for (let i = 2; i < 56; i += 5) { px(c, 20, i, 1, 1, '#7cc85a'); px(c, 27, i + 2, 1, 1, '#7cc85a'); }
    for (let k = 0; k < 4; k++) { const yy = 54 - ((t * 14 + k * 14) % 56); px(c, 23, Math.round(yy), 1, 3, '#8fd0f2'); }
  } else if (part === 'petal') {
    for (let y = 4; y <= 52; y += 0.5) {
      const k = (y - 4) / 48, w = Math.pow(Math.sin(Math.PI * Math.min(1, k * 1.15)), 0.7) * 17 * (1 - k * 0.55);
      if (w <= 0) continue;
      px(c, 24 - w, y, w * 2 + 1, 0.5, col[1]); px(c, 24 - w, y, 1, 0.5, col[2]); px(c, 24 + w, y, 1, 0.5, col[2]);
      if (y > 8 && y < 30) px(c, 24 - w * 0.6, y, 2, 0.5, 'rgba(255,255,255,0.75)');
    }
    for (const a of [-0.5, -0.25, 0, 0.25, 0.5]) for (let r = 0; r < 34; r += 0.5) {
      const vx = Math.sin(a) * r, vy = 50 - Math.cos(a) * r, k = (vy - 4) / 48;
      if (Math.abs(vx) < Math.pow(Math.sin(Math.PI * Math.min(1, k * 1.15)), 0.7) * 17 * (1 - k * 0.55) - 1) px(c, 24 + vx, vy, 0.5, 0.5, col[2]); // urat tidak keluar dari kelopak
    }
  } else if (part === 'pistil') {
    const center = col[0] === 'yellow' ? '#8a5a35' : '#f4cf3a';
    for (let k = 0; k < 16; k++) {
      const a = k / 16 * Math.PI * 2;
      for (let r = 10; r < 19; r++) px(c, 24 + Math.round(Math.cos(a) * r), 28 + Math.round(Math.sin(a) * r), 1, 1, '#e8c86a');
      disc(c, 24 + Math.round(Math.cos(a) * 19), 28 + Math.round(Math.sin(a) * 19), 1, '#f4b23a');
    }
    disc(c, 24, 28, 10, center); disc(c, 24, 28, 7, col[0] === 'yellow' ? '#6b4226' : '#e9b02a');
    for (let k = 0; k < 20; k++) px(c, 24 + Math.round(Math.cos(k * 2.4) * (k % 7)), 28 + Math.round(Math.sin(k * 2.4) * (k % 7)), 1, 1, '#fff2a8');
    const bx = 24 + Math.round(Math.cos(t * 1.4) * 20), by = 10 + Math.round(Math.sin(t * 2.8) * 4);
    px(c, bx - 2, by - 3, 3, 2, '#ffffff'); px(c, bx + 1, by - 3, 3, 2, '#ffffff');
    px(c, bx - 2, by - 1, 5, 3, '#f4cf3a'); px(c, bx - 1, by - 1, 1, 3, '#2a1d18'); px(c, bx + 1, by - 1, 1, 3, '#2a1d18'); px(c, bx + 3, by, 1, 1, '#2a1d18');
  }
}
function drawItem(c, x, y, type, big) {
  x = Math.round(x); y = Math.round(y);
  switch (type) {
    case 'egg': drawFood(c, x, y, big ? 'bigegg' : 'eggraw'); break;
    case 'shell':
      px(c, x - 3, y - 3, 7, 2, '#f7b8c8'); px(c, x - 2, y - 5, 5, 2, '#f7b8c8'); px(c, x - 1, y - 6, 3, 1, '#f7b8c8');
      px(c, x - 1, y - 5, 1, 4, '#e08aa0'); px(c, x + 1, y - 5, 1, 4, '#e08aa0'); px(c, x - 1, y - 1, 3, 1, '#e08aa0'); break;
    case 'starfish':
      px(c, x - 1, y - 5, 3, 3, '#f08a32'); px(c, x, y - 8, 1, 3, '#f08a32'); px(c, x - 4, y - 5, 3, 1, '#f08a32'); px(c, x + 2, y - 5, 3, 1, '#f08a32');
      px(c, x - 2, y - 2, 1, 2, '#f08a32'); px(c, x + 2, y - 2, 1, 2, '#f08a32'); px(c, x, y - 4, 1, 1, '#ffd08a'); break;
    case 'mushroom': drawMushroom(c, x, y); break;
    case 'wildflower': drawFlower(c, x, y, FLOWER_COLORS[3], 0); break;
    case 'pencil':
      for (let i = 0; i < 9; i++) px(c, x - 4 + i, y - 2 - i, 2, 2, i < 1 ? '#3a2a20' : i < 2 ? '#f0d8a8' : i > 7 ? '#f39ac0' : '#f4cf3a');
      break;
    case 'wool':
      disc(c, x - 2, y - 3, 3, '#ddd6c6'); disc(c, x + 2, y - 3, 3, '#ddd6c6'); disc(c, x, y - 5, 3, '#ddd6c6');
      disc(c, x - 2, y - 4, 2, '#fbf8f0'); disc(c, x + 2, y - 4, 2, '#fbf8f0'); disc(c, x, y - 6, 2, '#ffffff');
      break;
    case 'crayon':
      for (let i = 0; i < 7; i++) px(c, x - 3 + i, y - 2 - i, 2, 2, i < 1 ? '#a8352b' : (i > 1 && i < 5) ? '#f4cf3a' : '#e2483d');
      break;
    default: drawFood(c, x, y, type);
  }
}
