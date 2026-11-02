// Gambar piksel: semua digambar dengan kotak-kotak kecil di kanvas 320x180, lalu diperbesar.

const PAL = {
  grass: '#6dbb4f', grassD: '#4f9a3c', grassL: '#93d36a', grassM: '#62b047', grassN: '#79c55a',
  path: '#e4c78f', pathD: '#c9a46a', pathL: '#f0dcae', pathM: '#dcbc82',
  soil: '#8a5a35', soilD: '#6b4226', soilWet: '#5a3820',
  wood: '#b27a45', woodD: '#7d5230', woodL: '#d39b5f',
  water: '#5fb3e0', waterD: '#3f8fc4', waterL: '#a8dcf5',
  ink: '#2a1d18', white: '#fffaf0', leaf: '#4a9a3a', leafD: '#2f7a2c', leafL: '#7cc85a',
  stone: '#a9a6a0', stoneD: '#7f7c78',
};

// PX = ukuran satu satuan gambar. Gambar dekat (panel) memakai PX > 1 supaya lengkungannya digambar ulang dengan halus, bukan diperbesar.
let PX = 1;
function px(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(Math.round(x * PX), Math.round(y * PX), Math.round(w * PX), Math.round(h * PX)); }
function disc(c, cx, cy, r, col) {
  c.fillStyle = col;
  const R = r * PX, X = cx * PX, Y = cy * PX;
  for (let dy = -R; dy <= R; dy++) { const w = Math.floor(Math.sqrt(R * R - dy * dy) + 0.35); c.fillRect(Math.round(X - w), Math.round(Y + dy), w * 2 + 1, 1); }
}
function oval(c, cx, cy, rx, ry, col) {
  c.fillStyle = col;
  const RX = rx * PX, RY = ry * PX, X = cx * PX, Y = cy * PX;
  for (let dy = -RY; dy <= RY; dy++) { const w = Math.floor(RX * Math.sqrt(Math.max(0, 1 - (dy * dy) / (RY * RY))) + 0.35); c.fillRect(Math.round(X - w), Math.round(Y + dy), w * 2 + 1, 1); }
}
// Bayangan bisa diarahkan ke kanvas utama agar tidak ikut diberi garis tepi
let SHADOW_TO = null;
function shadow(c, x, y, rx) {
  const t = SHADOW_TO || c, ry = rx < 9 ? 1 : rx < 18 ? 2 : 3, cx = Math.round(x), cy = Math.round(y) - 1;
  t.fillStyle = 'rgba(30,45,20,0.24)';
  for (let dy = -ry; dy <= ry; dy++) { const w = Math.round(rx * Math.sqrt(1 - (dy / (ry + 0.6)) ** 2)); t.fillRect(cx - w, cy + dy, w * 2 + 1, 1); }
}
function shadowRect(c, x, y, w, h) { const t = SHADOW_TO || c; t.fillStyle = 'rgba(30,45,20,0.2)'; t.fillRect(Math.round(x), Math.round(y), w, h); }
function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
// Gambar menghadap kanan dengan koordinat relatif; dir -1 = dibalik ke kiri
function flip(c, x, dir, fn) { c.save(); c.translate(Math.round(x) * PX, 0); if (dir < 0) c.scale(-1, 1); fn(); c.restore(); }

// ---------- Orang (gaya chibi: kepala besar, mata berkilau) ----------
const LOOKS = {
  me: { kid: 1, skin: '#ffd7b5', hair: '#4a2f1f', hairL: '#70503a', style: 'boy', shirt: '#d9483b', shirtD: '#a8352b', pants: '#3f6fb5', shoes: '#6b3e22' },
  dad: { skin: '#efbf94', hair: '#2d2119', hairL: '#4a3a2e', style: 'dad', shirt: '#ffffff', shirtD: '#cfd8e0', tie: '#4f86e0', pants: '#3a4a6a', shoes: '#3a2a20' },
  mom: { skin: '#ffd2b0', hair: '#5a321e', hairL: '#7a4a30', style: 'mom', shirt: '#e88aa2', shirtD: '#c2667f', apron: '#fff6e4', dress: 1, shoes: '#8a4a3a' },
  grandpa: { skin: '#ebbd96', hair: '#e8e4dc', style: 'grandpa', shirt: '#8a6a4a', shirtD: '#6a4f36', pants: '#4f4a44', shoes: '#2f2620' },
  grandma: { skin: '#f6caa6', hair: '#dcd8d0', hairL: '#ffffff', style: 'grandma', shirt: '#7d74b8', shirtD: '#5c5490', dress: 1, shoes: '#5a3a2a' },
  teacher: { skin: '#f8cca8', hair: '#2a1f1a', hairL: '#4a3a30', style: 'bob', shirt: '#4fa3a0', shirtD: '#367d7a', pants: '#3a4a6a', glasses: 1, shoes: '#3a2a20' },
  meimei: { kid: 1, skin: '#ffd9bd', hair: '#2f2018', hairL: '#4f3a2c', style: 'pigtails', shirt: '#f2a93b', shirtD: '#c9832a', dress: 1, shoes: '#d9483b', bow: '#e2483d' },
  lele: { kid: 1, skin: '#f0bc92', hair: '#1f1a16', hairL: '#3a3028', style: 'bowl', shirt: '#4a9fd6', shirtD: '#3277a8', pants: '#4a4a52', shoes: '#2f2620' },
  tiantian: { kid: 1, skin: '#f6cba6', hair: '#2a1d18', style: 'cap', cap: '#58a84a', capD: '#3d7f33', shirt: '#f4cf3a', shirtD: '#c9a21f', pants: '#4f6fb0', shoes: '#e2483d' },
  xiaoyu: { kid: 1, skin: '#ffdcc2', hair: '#3a2418', hairL: '#5a3a28', style: 'short', shirt: '#f39ac0', shirtD: '#cc6a95', dress: 1, shoes: '#ffffff', bow: '#58a84a' },
  uncle: { skin: '#e9b48a', hair: '#2a1d18', style: 'cap', cap: '#4f86e0', capD: '#2f5bab', shirt: '#7aa4ea', shirtD: '#4f86e0', pants: '#4a4a52', shoes: '#2f2620', bag: '#a8743c' },
  auntie: { skin: '#f6c9a3', hair: '#5a3422', hairL: '#7a4a32', style: 'grandma', shirt: '#58a84a', shirtD: '#3d7f33', dress: 1, shoes: '#8a4a3a', bag: '#e9c86a' },
  colleague: { skin: '#f3c6a0', hair: '#6a3a22', hairL: '#8a5a3a', style: 'bob', shirt: '#9b6bd6', shirtD: '#6c45a3', pants: '#3a3a4a', shoes: '#2a2a2a' },
  hiker: { skin: '#efbf94', hair: '#5a3a22', style: 'cap', cap: '#e2483d', capD: '#a8352b', shirt: '#f08a32', shirtD: '#bd5e1c', pants: '#6a5040', shoes: '#3a2a20', pack: '#4f8a5a' },
  rider: { skin: '#efbf94', hair: '#5a3a22', style: 'dad', shirt: '#e0a03a', shirtD: '#b67a22', pants: '#3a4a6a', shoes: '#3a2a20' },
};

function lookWith(o) {
  const L = Object.assign({}, LOOKS[o.look || 'me']);
  const of = o.outfit;
  if (of) {
    if (of.shirt) { L.shirt = of.shirt[1]; L.shirtD = of.shirt[2]; }
    if (of.pants) L.pants = of.pants;
    if (of.shoes === false) L.shoes = L.skin;
    if (of.costume && typeof COSTUMES !== 'undefined' && COSTUMES[of.costume]) {
      const k = COSTUMES[of.costume];
      if (k.shirt) { L.shirt = k.shirt[1]; L.shirtD = k.shirt[2]; }
      if (k.pants) L.pants = k.pants;
    }
  }
  return L;
}

// x,y = titik kaki. o: {look, dir, frame, mood, outfit, act, actT, bob, umbrella, nose}
function drawPerson(c, x, y, o) {
  const L = lookWith(o);
  x = Math.round(x); y = Math.round(y);
  // teen = kakak: sedikit lebih tinggi dari anak kecil
  const kid = !!(L.kid || L.teen), legH = L.teen ? 5 : kid ? 3 : 6, bodyH = L.teen ? 6 : kid ? 5 : 8, half = kid ? 4 : 5, bw = half * 2;
  const dir = o.dir || 'down', side = dir === 'left' || dir === 'right', f = o.frame || 0, t = o.actT || 0;
  if (!o.noShadow) shadow(c, x, y, kid ? 5 : 6);
  y -= Math.round(o.bob || 0);
  const legTop = y - legH, bodyTop = legTop - bodyH, ht = bodyTop - 11;

  if (L.pack && dir === 'up') px(c, x - 4, bodyTop - 1, 8, bodyH + 1, L.pack);
  // Kaki
  const pants = L.dress ? L.skin : L.pants;
  const kick = o.act === 'kick' && t < 0.35;
  const lU = f === 1 ? 1 : 0, rU = (f === 2 || kick) ? 1 : 0;
  const lx = kid ? x - 3 : x - 4, rx = x + 1, lw = kid ? 2 : 3, sw = kid ? 1 : 0;
  px(c, lx, legTop, lw, legH - 1 - lU, pants); px(c, lx - sw, y - 1 - lU, lw + sw, 1, L.shoes);
  if (kick) { px(c, rx + 1, legTop, lw, legH - 2, pants); px(c, rx + 2, y - 3, 3, 1, L.shoes); }
  else { px(c, rx, legTop, lw, legH - 1 - rU, pants); px(c, rx, y - 1 - rU, lw + sw, 1, L.shoes); }
  if (L.dress) { px(c, x - half - 1, legTop - 1, bw + 2, legH - 1, L.shirt); px(c, x - half - 1, legTop + legH - 3, bw + 2, 1, L.shirtD); }

  // Badan
  px(c, x - half, bodyTop, bw, bodyH, L.shirt);
  px(c, x - half, bodyTop + bodyH - 1, bw, 1, L.shirtD);
  px(c, x - 2, bodyTop, 4, 1, L.shirtD);
  if (L.tie && !side && dir !== 'up') { px(c, x - 1, bodyTop + 1, 2, bodyH - 3, L.tie); }
  if (L.apron) px(c, x - 3, bodyTop + 2, 6, bodyH + legH - 3, L.apron);
  if (L.pack && side) px(c, dir === 'right' ? x - half - 2 : x + half, bodyTop, 2, bodyH - 1, L.pack);
  if (L.bag && !side && dir !== 'up') { px(c, x - half - 3, bodyTop + bodyH - 2, 4, 4, L.bag); px(c, x - half - 2, bodyTop + 1, 1, bodyH - 3, L.bag); }
  if (o.outfit && o.outfit.scarf) { px(c, x - half, bodyTop, bw, 2, '#d64a4a'); px(c, x + 1, bodyTop + 2, 2, 3, '#b83a3a'); }
  if (o.outfit && o.outfit.costume && dir !== 'up') costumeBody(c, x, bodyTop, bodyH, half, o.outfit.costume);

  // Lengan
  const armH = bodyH - 2;
  const arm = (ax, ay, h) => { px(c, ax, ay, 2, h, L.shirt); px(c, ax, ay + h, 2, 1, L.skin); };
  if (side) {
    const s = f === 1 ? 1 : f === 2 ? -1 : 0;
    arm(x - 1 + s, bodyTop + 1, armH);
  } else if (o.act === 'wash') {
    px(c, x - half - 1, bodyTop + 1, 2, armH - 1, L.shirt); px(c, x + half - 1, bodyTop + 1, 2, armH - 1, L.shirt);
    px(c, x - 2 + (Math.sin(t * 20) > 0 ? 1 : 0), bodyTop + bodyH - 2, 4, 2, L.skin);
  } else if (o.act === 'rope') {
    const up = Math.sin(t * 9) > 0;
    arm(x - half - 2, bodyTop + (up ? 0 : 1), armH); arm(x + half, bodyTop + (up ? 0 : 1), armH);
  } else {
    arm(x - half - 2, bodyTop + 1, armH);
    if (o.act === 'wave') {
      const wg = Math.sin(t * 14) > 0 ? 1 : 0;
      px(c, x + half + wg, bodyTop - 3, 2, 4, L.shirt); px(c, x + half + wg, bodyTop - 5, 2, 2, L.skin);
    } else if (o.act === 'eat' || o.act === 'brush') {
      px(c, x + half - 1, bodyTop + 1, 2, 2, L.shirt);
    } else if (o.umbrella) {
      px(c, x + half, bodyTop + 1, 2, 2, L.shirt); px(c, x + half, bodyTop + 3, 2, 1, L.skin);
    } else arm(x + half, bodyTop + 1, armH);
  }

  drawHead(c, x, ht, L, dir, o);

  if (o.act === 'eat') {
    const up = Math.sin(t * 12) > 0 ? 0 : 1;
    px(c, x + 1, ht + 9 + up, 2, 2, L.skin); px(c, x - 1, ht + 8 + up, 2, 2, '#fffaf0');
  }
  if (o.act === 'brush') {
    const m = Math.sin(t * 22) > 0 ? 1 : 0;
    px(c, x - 2 + m, ht + 9, 5, 1, '#5fb3e0'); px(c, x - 2 + m, ht + 8, 1, 1, '#ffffff'); px(c, x + 3 + m, ht + 9, 2, 2, L.skin);
  }
  if (o.umbrella) {
    const ux = x + half + 1;
    px(c, ux, ht - 6, 1, bodyTop - ht + 9, '#5a3a22');
    for (let dy = -6; dy <= 0; dy++) {
      const w = Math.floor(12 * Math.sqrt(1 - (dy * dy) / 36) + 0.35);
      px(c, ux - w, ht - 6 + dy, w * 2 + 1, 1, dy === 0 ? '#a8352b' : '#e2483d');
    }
    for (let i = -10; i <= 10; i += 5) px(c, ux + i, ht - 8, 2, 2, '#f4cf3a');
    px(c, ux - 1, ht - 13, 2, 1, '#5a3a22');
  }
}

function headShape(c, x, ht, col) {
  px(c, x - 4, ht, 8, 1, col); px(c, x - 5, ht + 1, 10, 1, col); px(c, x - 6, ht + 2, 12, 7, col);
  px(c, x - 5, ht + 9, 10, 1, col); px(c, x - 4, ht + 10, 8, 1, col);
}

function drawHead(c, x, ht, L, dir, o) {
  const side = dir === 'left' || dir === 'right', fx = dir === 'left' ? -1 : 1, mood = o.mood || 'happy';
  const H = L.hair, HL = L.hairL || L.hair, s = L.style, E = '#2a1d18', M = '#9a3a2a', B = '#f7a0a0';
  headShape(c, x, ht, L.skin);
  const top = () => { px(c, x - 4, ht - 1, 8, 1, H); px(c, x - 5, ht, 10, 1, H); px(c, x - 6, ht + 1, 12, 2, H); px(c, x - 3, ht, 3, 1, HL); };
  const capOn = () => { px(c, x - 5, ht - 1, 10, 1, L.cap); px(c, x - 6, ht, 12, 3, L.cap); px(c, x - 1, ht - 1, 2, 1, L.capD); px(c, x - 4, ht, 2, 1, 'rgba(255,255,255,0.35)'); };

  if (dir === 'up') {
    if (s === 'grandpa') px(c, x - 6, ht + 3, 12, 5, H);
    else if (s === 'cap') { px(c, x - 6, ht + 3, 12, 5, H); capOn(); px(c, x - 4, ht + 3, 8, 1, L.capD); }
    else { px(c, x - 5, ht - 1, 10, 1, H); px(c, x - 6, ht, 12, 8, H); px(c, x - 5, ht + 8, 10, 1, H); }
    if (s === 'mom') px(c, x - 7, ht + 2, 14, 12, H);
    if (s === 'bob' || s === 'short') px(c, x - 7, ht + 2, 14, s === 'bob' ? 8 : 6, H);
    if (s === 'grandma') px(c, x - 2, ht - 4, 4, 3, H);
    if (s === 'pigtails') { px(c, x - 9, ht + 3, 3, 5, H); px(c, x + 6, ht + 3, 3, 5, H); }
    if (s === 'boy') { px(c, x, ht - 3, 1, 2, H); px(c, x + 1, ht - 4, 1, 1, H); }
    hat(c, x, ht, o);
    return;
  }

  // Telinga
  if (!side) { px(c, x - 7, ht + 5, 1, 3, L.skin); px(c, x + 6, ht + 5, 1, 3, L.skin); }
  // Mata besar berkilau
  // tampak samping digambar ¾: dua mata bergeser ke arah hadap
  const eyes = side ? (fx > 0 ? [x - 2, x + 3] : [x - 5, x]) : [x - 4, x + 2];
  if (mood === 'sleepy') eyes.forEach(e => px(c, e, ht + 7, 2, 1, E));
  else eyes.forEach(e => { px(c, e, ht + 5, 2, 3, E); px(c, e, ht + 5, 1, 1, '#ffffff'); });
  // Pipi & mulut
  if (side) {
    px(c, fx > 0 ? x - 4 : x - 6, ht + 8, 2, 1, B); px(c, fx > 0 ? x + 4 : x + 2, ht + 8, 2, 1, B);
    px(c, fx > 0 ? x : x - 2, ht + 9, 2, 1, M);
    if (mood === 'happy') { px(c, fx > 0 ? x - 1 : x - 3, ht + 8, 1, 1, M); px(c, fx > 0 ? x + 2 : x, ht + 8, 1, 1, M); }
  } else {
    px(c, x - 5, ht + 8, 2, 1, B); px(c, x + 3, ht + 8, 2, 1, B);
    if (o.nose) px(c, x - 1, ht + 7, 2, 1, '#e8a882');
    if (mood === 'happy') { px(c, x - 1, ht + 9, 2, 1, M); px(c, x - 2, ht + 8, 1, 1, M); px(c, x + 1, ht + 8, 1, 1, M); }
    else if (mood === 'sad') { px(c, x - 1, ht + 8, 2, 1, M); px(c, x - 2, ht + 9, 1, 1, M); px(c, x + 1, ht + 9, 1, 1, M); px(c, x + 4, ht + 8, 1, 2, '#7cc4f0'); }
    else if (mood === 'angry') { px(c, x - 2, ht + 9, 4, 1, M); px(c, x - 6, ht + 7, 2, 1, '#ef7a6a'); px(c, x + 4, ht + 7, 2, 1, '#ef7a6a'); }
    else if (mood === 'scared') { px(c, x - 1, ht + 8, 2, 2, M); px(c, x + 5, ht + 1, 1, 2, '#7cc4f0'); }
    else if (mood === 'sleepy') px(c, x - 1, ht + 9, 1, 1, M);
  }

  // Rambut
  const back = fx > 0 ? x - 6 : x + 3;
  if (s === 'boy') {
    top(); px(c, x - 6, ht + 3, 4, 1, H); px(c, x - 1, ht + 3, 3, 1, H); px(c, x + 3, ht + 3, 3, 1, H);
    px(c, x - 6, ht + 4, 1, 2, H); px(c, x + 5, ht + 4, 1, 2, H); px(c, x, ht - 3, 1, 2, H); px(c, x + 1, ht - 4, 1, 1, H);
    if (side) px(c, back, ht + 3, 3, 4, H);
  }
  if (s === 'bowl') { top(); px(c, x - 6, ht + 3, 12, 1, H); px(c, x - 6, ht + 4, 2, 2, H); px(c, x + 4, ht + 4, 2, 2, H); if (side) px(c, back, ht + 3, 3, 4, H); }
  if (s === 'dad') { top(); px(c, x - 6, ht + 3, 2, 2, H); px(c, x + 4, ht + 3, 2, 2, H); px(c, x + 1, ht + 3, 3, 1, H); if (side) px(c, back, ht + 3, 3, 3, H); }
  if (s === 'mom' || s === 'bob' || s === 'short') {
    const len = s === 'mom' ? 12 : s === 'bob' ? 8 : 6;
    top(); px(c, x - 6, ht + 3, 5, 1, H); px(c, x + 1, ht + 3, 5, 1, H);
    if (side) px(c, fx > 0 ? x - 7 : x + 3, ht + 2, 4, len, H);
    else { px(c, x - 7, ht + 2, 2, len, H); px(c, x + 5, ht + 2, 2, len, H); }
    if (s === 'short') px(c, x + 3, ht, 2, 2, L.bow);
  }
  if (s === 'grandpa') { px(c, x - 6, ht + 3, 1, 4, H); px(c, x + 5, ht + 3, 1, 4, H); if (!side) px(c, x - 2, ht + 8, 4, 1, H); px(c, x - 2, ht + 1, 2, 1, '#fff2e0'); }
  if (s === 'grandma') { top(); px(c, x - 2, ht - 4, 4, 3, H); px(c, x - 6, ht + 3, 1, 3, H); px(c, x + 5, ht + 3, 1, 3, H); }
  if (s === 'pigtails') {
    top(); px(c, x - 6, ht + 3, 5, 1, H); px(c, x + 1, ht + 3, 5, 1, H);
    px(c, x - 9, ht + 3, 3, 5, H); px(c, x + 6, ht + 3, 3, 5, H);
    px(c, x - 8, ht + 2, 2, 2, L.bow); px(c, x + 6, ht + 2, 2, 2, L.bow);
  }
  if (s === 'cap') {
    px(c, x - 6, ht + 3, 1, 3, H); px(c, x + 5, ht + 3, 1, 3, H);
    capOn();
    if (side) px(c, fx > 0 ? x : x - 8, ht + 3, 8, 1, L.capD); else px(c, x - 7, ht + 3, 14, 1, L.capD);
  }
  // Alis (sesudah rambut supaya terlihat)
  if (!side) {
    if (mood === 'sad') { px(c, x - 5, ht + 4, 1, 1, H); px(c, x - 4, ht + 3, 2, 1, H); px(c, x + 4, ht + 4, 1, 1, H); px(c, x + 2, ht + 3, 2, 1, H); }
    if (mood === 'angry') { px(c, x - 5, ht + 3, 2, 1, H); px(c, x - 3, ht + 4, 1, 1, H); px(c, x + 3, ht + 3, 2, 1, H); px(c, x + 2, ht + 4, 1, 1, H); }
    if (mood === 'scared') { px(c, x - 4, ht + 3, 2, 1, H); px(c, x + 2, ht + 3, 2, 1, H); }
  }
  if (L.glasses && !side) {
    const G = '#3a2a20';
    for (const e of [x - 5, x + 1]) { px(c, e, ht + 4, 4, 1, G); px(c, e, ht + 8, 4, 1, G); px(c, e, ht + 4, 1, 5, G); px(c, e + 3, ht + 4, 1, 5, G); }
    px(c, x - 1, ht + 5, 2, 1, G);
  }
  hat(c, x, ht, o);
}

function hat(c, x, ht, o) {
  if (o.outfit && o.outfit.costume) { costumeHead(c, x, ht, o.outfit.costume); return; }
  if (!o.outfit || !o.outfit.hat) return;
  px(c, x - 9, ht + 2, 18, 2, '#e9c86a'); px(c, x - 8, ht + 3, 16, 1, '#c9a24a');
  px(c, x - 6, ht - 3, 12, 5, '#e9c86a'); px(c, x - 5, ht - 4, 10, 1, '#e9c86a');
  px(c, x - 6, ht, 12, 1, '#c9473a');
}

// Russel tidur di kasur (hanya kepala di bantal)
function drawSleepyHead(c, x, ht) {
  drawHead(c, x, ht, LOOKS.me, 'down', { mood: 'sleepy' });
}

// ---------- Hewan ----------
function drawDog(c, x, y, dir, f, state, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 7);
  const B = '#d39552', D = '#9a6332', Lt = '#fbe8cc', K = '#2a1d18';
  const wag = Math.sin(t * (state === 'happy' ? 30 : 12)) > 0 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    const head = (hx, hy) => {
      P(hx, hy + 1, 10, 7, B); P(hx + 1, hy, 8, 1, B); P(hx + 1, hy + 8, 8, 1, B);
      P(hx + 6, hy + 4, 5, 4, Lt); P(hx + 10, hy + 4, 1, 1, K);
      P(hx - 1, hy + 1, 2, 5, D); P(hx + 7, hy - 1, 2, 2, D);
      P(hx + 6, hy + 2, 2, 2, K); P(hx + 6, hy + 2, 1, 1, '#ffffff');
      P(hx + 4, hy + 5, 2, 1, '#f39a9a');
      if (state === 'happy') P(hx + 8, hy + 7, 2, 2, '#ef7a8a');
    };
    if (state === 'sit') {
      P(-7, -6 - wag, 2, 2, B);
      P(-5, -9, 8, 7, B); P(-3, -7, 4, 5, Lt); P(-6, -3, 5, 3, B); P(1, -4, 2, 4, B);
      head(0, -17);
      P(1, -9, 5, 1, '#d9483b'); P(3, -8, 1, 1, '#f4cf3a');
      return;
    }
    const hop = state === 'happy' ? (Math.sin(t * 20) > 0 ? 2 : 0) : 0;
    const Q = (dx, dy, w, h, col) => P(dx, dy - hop, w, h, col);
    Q(-9, -11 + wag, 2, 3, B);
    Q(-7, -9, 12, 5, B); Q(-5, -5, 8, 1, Lt);
    const a = f === 1 ? 1 : 0, b = f === 2 ? 1 : 0;
    Q(-6, -4, 2, 3 - a, D); Q(-3, -4, 2, 3 - b, B); Q(1, -4, 2, 3 - b, D); Q(3, -4, 2, 3 - a, B);
    c.save(); c.translate(0, -hop); head(1, -17); c.restore();
    Q(2, -8, 4, 1, '#d9483b'); Q(4, -7, 1, 1, '#f4cf3a');
  });
}

function drawCat(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 7);
  const O = '#ee9a4a', D = '#c8732c', K = '#2a1d18';
  const br = Math.sin(t * 2) > 0 ? 1 : 0;
  oval(c, x, y - 4, 7, 3 + br, O);
  px(c, x - 4, y - 6 - br, 1, 3, D); px(c, x - 1, y - 7 - br, 1, 3, D); px(c, x + 2, y - 6 - br, 1, 3, D);
  px(c, x - 8, y - 3, 6, 2, O); px(c, x - 9, y - 4, 2, 2, D);
  oval(c, x + 6, y - 5, 4, 3, O);
  px(c, x + 3, y - 10, 2, 3, O); px(c, x + 8, y - 10, 2, 3, O); px(c, x + 4, y - 9, 1, 1, '#f7a0a0'); px(c, x + 8, y - 9, 1, 1, '#f7a0a0');
  px(c, x + 4, y - 5, 2, 1, K); px(c, x + 7, y - 5, 2, 1, K); px(c, x + 6, y - 4, 1, 1, '#f7a0a0');
}

function drawChicken(c, x, y, dir, f, peck) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 4);
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    P(-1, -2, 1, 2, '#e8a23a'); P(1, -2 + (f === 1 ? -1 : 0), 1, 2, '#e8a23a');
    P(-4, -8, 2, 3, '#e9e4d8');
    P(-3, -7, 6, 5, '#fbf8f0'); P(-2, -4, 4, 1, '#e9e4d8'); P(-2, -6, 3, 1, '#e9e4d8');
    const hy = peck ? 3 : 0;
    P(0, -11 + hy, 4, 4, '#fbf8f0'); P(1, -12 + hy, 2, 1, '#e2483d');
    P(4, -9 + hy, 1, 1, '#f4b23a'); P(3, -7 + hy, 1, 1, '#e2483d'); P(2, -10 + hy, 1, 2, '#2a1d18'); P(1, -8 + hy, 1, 1, '#f7a0a0');
  });
}

function drawCow(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 11);
  const Wc = '#fbf8f0', K = '#2f2a28';
  const chew = Math.sin(t * 5) > 0 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    [-9, -5, 2, 5].forEach((lx, i) => { P(lx, -5, 2, 5, i % 2 ? '#e9e4d8' : Wc); P(lx, -1, 2, 1, K); });
    P(-11, -13, 1, 6, K); P(-12, -8, 2, 2, K);
    P(-10, -13, 18, 8, Wc); P(-10, -6, 18, 1, '#e3ddd0');
    P(-7, -12, 4, 3, K); P(-1, -10, 5, 3, K); P(3, -13, 3, 2, K); P(-9, -8, 2, 2, K);
    P(-3, -5, 4, 1, '#f3a6b0');
    P(6, -18, 8, 8, Wc); P(7, -12 + chew, 7, 3, '#f3a6b0'); P(9, -11 + chew, 1, 1, '#c96a7a'); P(12, -11 + chew, 1, 1, '#c96a7a');
    P(7, -19, 1, 1, '#efe2b8'); P(12, -19, 1, 1, '#efe2b8'); P(5, -17, 1, 2, K);
    P(10, -16, 2, 2, K); P(10, -16, 1, 1, '#ffffff'); P(7, -18, 2, 2, K);
    P(5, -10, 2, 2, '#e9c84a');
  });
}

// shorn = sudah dicukur: badan lebih kecil & merah muda
function drawSheep(c, x, y, dir, t, shorn) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 8);
  const Wl = shorn ? '#f8e0d2' : '#f5f1e6', Wd = shorn ? '#e8c6b2' : '#ddd6c6', K = '#3a3230', s = shorn ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    [-6, -3, 2, 4].forEach(lx => P(lx, -4, 1, 4, K));
    disc(c, -5, y - 8 + s, 4 - s, Wd); disc(c, 0, y - 9 + s, 5 - s, Wd); disc(c, 3, y - 8 + s, 4 - s, Wd);
    disc(c, -4, y - 9 + s, 3 - s, Wl); disc(c, 0, y - 10 + s, 4 - s, Wl); disc(c, 3, y - 9 + s, 3 - s, Wl);
    const nod = Math.sin(t * 1.5) > 0.6 ? 1 : 0;
    P(5, -12 + nod, 5, 5, K); P(4, -11 + nod, 1, 2, K); P(7, -11 + nod, 2, 2, '#ffffff'); P(8, -10 + nod, 1, 1, K);
    disc(c, 6, y - 13 + nod, 2, Wl);
  });
}

function drawDuck(c, x, y, dir, t, swim) {
  x = Math.round(x); y = Math.round(y);
  if (!swim) shadow(c, x, y, 4);
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, col) => px(c, dx, y + dy, w, h, col);
    const bob = swim && Math.sin(t * 3) > 0 ? 1 : 0;
    if (swim) { P(-6, -1, 12, 1, PAL.waterL); }
    if (!swim) { P(-1, -2, 1, 2, '#f08a32'); P(1, -2, 1, 2, '#f08a32'); }
    P(-5, -6 + bob, 9, 4, '#fbf8f0'); P(-6, -7 + bob, 2, 2, '#fbf8f0'); P(-3, -5 + bob, 5, 1, '#e7e1d2');
    P(1, -11 + bob, 5, 5, '#fbf8f0'); P(6, -8 + bob, 2, 1, '#f08a32'); P(3, -10 + bob, 1, 2, '#2a1d18'); P(4, -8 + bob, 1, 1, '#f7a0a0');
  });
}

function drawButterfly(c, x, y, t, col) {
  const w = Math.sin(t * 18) > 0 ? 2 : 1;
  px(c, x - w - 1, y - 2, w + 1, 2, col); px(c, x + 1, y - 2, w + 1, 2, col);
  px(c, x - w, y, w, 1, col); px(c, x + 1, y, w, 1, col);
  px(c, x, y - 2, 1, 3, '#2a1d18');
}

// ---------- Tanaman ----------
function drawTree(c, x, y, o = {}) {
  x = Math.round(x + (o.shake || 0)); y = Math.round(y);
  const r = o.r || 16;
  shadow(c, x, y + 1, Math.round(r * 0.95));
  px(c, x - 3, y - 12, 6, 12, '#8a5a35'); px(c, x + 1, y - 12, 2, 12, '#6b4226'); px(c, x - 2, y - 12, 1, 9, '#a87448');
  px(c, x - 5, y - 2, 2, 2, '#8a5a35'); px(c, x + 3, y - 2, 2, 2, '#6b4226');
  const cy = y - 12 - r + 4, R = k => Math.max(1, Math.round(r * k));
  // daun bergerombol: tepi bergelombang, terang dari kiri atas, gelap di kanan bawah
  disc(c, x, cy + 2, R(0.86), PAL.leafD);
  [[-0.62, 0.22, 0.46], [0.64, 0.24, 0.46], [-0.34, -0.5, 0.5], [0.36, -0.5, 0.48], [0, 0.56, 0.5], [-0.72, -0.14, 0.3], [0.74, -0.14, 0.3]]
    .forEach(([a, b, k]) => disc(c, x + R(Math.abs(a)) * Math.sign(a), cy + 2 + R(Math.abs(b)) * Math.sign(b), R(k), PAL.leafD));
  [[-0.34, -0.26, 0.56], [0.26, -0.3, 0.48], [-0.56, 0.16, 0.34], [0.08, 0.14, 0.42], [0.58, 0.02, 0.26]]
    .forEach(([a, b, k]) => disc(c, x + R(Math.abs(a)) * Math.sign(a), cy + R(Math.abs(b)) * Math.sign(b), R(k), PAL.leaf));
  [[-0.46, -0.48, 0.26], [0.14, -0.56, 0.18], [-0.68, 0.02, 0.13], [-0.1, -0.12, 0.13]]
    .forEach(([a, b, k]) => disc(c, x + R(Math.abs(a)) * Math.sign(a), cy + R(Math.abs(b)) * Math.sign(b), R(k), PAL.leafL));
  if (r >= 12) [[-3, 4], [5, -4], [9, 4], [-10, 3], [2, 8], [-6, -9], [7, -10], [-1, -4]].forEach(([a, b], i) => px(c, x + a, cy + b, 2, 1, i % 3 ? PAL.leafD : PAL.leafL));
  if (o.apples) o.apples.forEach(a => drawApple(c, x + a[0], cy + a[1]));
}

function drawBush(c, x, y, col) {
  shadow(c, x, y, 7);
  disc(c, x - 3, y - 5, 4, PAL.leafD); disc(c, x + 3, y - 5, 4, PAL.leafD); disc(c, x, y - 7, 5, PAL.leaf);
  disc(c, x - 2, y - 9, 2, PAL.leafL);
  if (col) { px(c, x - 4, y - 7, 1, 1, col); px(c, x + 2, y - 9, 1, 1, col); px(c, x + 4, y - 5, 1, 1, col); }
}

function drawFlower(c, x, y, col, t) {
  x = Math.round(x); y = Math.round(y);
  const sw = Math.sin(t * 2 + x) > 0.5 ? 1 : 0;
  px(c, x, y - 7, 1, 7, PAL.leafD);
  px(c, x - 3, y - 4, 3, 2, PAL.leaf); px(c, x + 1, y - 5, 3, 2, PAL.leaf);
  const hx = x + sw, hy = y - 10;
  px(c, hx - 2, hy - 1, 5, 3, col[1]); px(c, hx - 1, hy - 2, 3, 5, col[1]);
  px(c, hx - 1, hy - 1, 3, 3, col[2]);
  px(c, hx, hy, 1, 1, col[0] === 'yellow' ? '#8a5a35' : '#f4cf3a');
}

function drawPlot(c, x, y, w, h, wet) {
  const dark = wet ? '#4a2c18' : PAL.soilD, light = wet ? '#6e4a2c' : '#a87448';
  px(c, x, y, w, h, wet ? PAL.soilWet : PAL.soil);
  px(c, x, y, w, 1, light); px(c, x, y + h - 1, w, 1, dark);
  // alur tanah: gundukan terang di atas, cekungan gelap di bawah
  for (let i = 3; i < h - 1; i += 4) {
    px(c, x + 1, y + i, w - 2, 1, dark);
    for (let j = 1 + (i % 3); j < w - 2; j += 3) px(c, x + j, y + i - 2, 2, 1, light);
  }
}
// Petak berbingkai batu: tanahnya bertekstur dan bingkainya berbayang
function drawBed(c, x, y, w, h, seed) {
  shadowRect(c, x - 2, y + h + 1, w + 4, 2);
  px(c, x, y, w, h, '#946c44');
  groundPatches(c, x, y, w, h, seed, '#886240', 0.55);
  const r = rng(seed);
  for (let i = 0; i < w * h / 34; i++) px(c, x + Math.floor(r() * w), y + Math.floor(r() * h), r() < 0.5 ? 2 : 1, 1, r() < 0.55 ? '#7a5636' : '#ab8256');
  px(c, x, y, w, 2, 'rgba(50,30,15,0.3)');
  const stone = (sx, sy, sw, sh) => { px(c, sx, sy, sw, sh, PAL.stoneD); px(c, sx, sy, sw - 1, sh - 1, PAL.stone); px(c, sx, sy, sw - 2, 1, '#cfccc6'); };
  for (let i = -2; i < w; i += 6) { stone(x + i, y - 3, 6, 3); stone(x + i, y + h - 1, 6, 3); }
  for (let j = 0; j < h - 1; j += 5) { stone(x - 3, y + j, 3, 5); stone(x + w, y + j, 3, 5); }
}

function drawCrop(c, cx, by, type, stage, t) {
  cx = Math.round(cx); by = Math.round(by);
  if (stage === 1) { px(c, cx - 3, by - 4, 1, 1, '#f0dcae'); px(c, cx + 1, by - 5, 1, 1, '#f0dcae'); px(c, cx - 1, by - 3, 1, 1, '#f0dcae'); return; }
  if (stage === 2 || stage === 3) {
    px(c, cx, by - 6, 1, 4, PAL.leaf); px(c, cx - 2, by - 7, 2, 2, PAL.leafL); px(c, cx + 1, by - 8, 2, 2, PAL.leafL);
    if (stage === 3) { px(c, cx - 3, by - 9, 2, 2, PAL.leaf); px(c, cx + 2, by - 10, 2, 2, PAL.leaf); }
    return;
  }
  if (stage !== 4) return;
  const sw = Math.sin(t * 2 + cx) > 0.6 ? 1 : 0;
  if (type === 'carrot') {
    px(c, cx - 2, by - 5, 5, 3, '#f08a32'); px(c, cx - 1, by - 2, 3, 1, '#d8701e');
    px(c, cx - 3 + sw, by - 11, 2, 6, PAL.leaf); px(c, cx + sw, by - 13, 2, 8, PAL.leafD); px(c, cx + 2 + sw, by - 10, 2, 5, PAL.leaf);
  } else if (type === 'tomato') {
    px(c, cx, by - 14, 1, 13, PAL.leafD); px(c, cx - 4, by - 10, 4, 2, PAL.leaf); px(c, cx + 1, by - 12, 4, 2, PAL.leaf);
    disc(c, cx - 3, by - 6, 2, '#e2483d'); disc(c, cx + 3, by - 8, 2, '#e2483d'); disc(c, cx + 1, by - 3, 2, '#e2483d');
    px(c, cx - 4, by - 7, 1, 1, '#ff9a8a'); px(c, cx + 2, by - 9, 1, 1, '#ff9a8a');
  } else if (type === 'watermelon') {
    px(c, cx - 7, by - 3, 14, 1, PAL.leaf); px(c, cx + 4, by - 6, 3, 2, PAL.leaf);
    oval(c, cx - 1, by - 5, 6, 4, '#3f8a3a');
    for (let i = -5; i <= 4; i += 3) px(c, cx + i, by - 9, 1, 8, '#2a6a2a');
    px(c, cx - 4, by - 7, 2, 1, '#7cc85a');
  } else if (type === 'corn') {
    px(c, cx, by - 18, 2, 17, PAL.leaf); px(c, cx - 4 + sw, by - 12, 4, 1, PAL.leafD); px(c, cx + 2 + sw, by - 9, 4, 1, PAL.leafD);
    px(c, cx + 2, by - 16, 3, 6, '#f4cf3a'); px(c, cx + 2, by - 16, 1, 6, '#d9b02a'); px(c, cx + 2, by - 18, 2, 2, '#9ac85a');
  }
}

// ---------- Makanan & benda kecil (titik tengah-bawah) ----------
function drawApple(c, x, y) {
  disc(c, x, y, 2, '#e2483d'); px(c, x - 1, y - 1, 1, 1, '#ff9a8a'); px(c, x, y - 3, 1, 1, '#6b4226'); px(c, x + 1, y - 3, 1, 1, PAL.leaf);
}
function drawFood(c, x, y, type) {
  x = Math.round(x); y = Math.round(y);
  const bowl = band => { px(c, x - 5, y - 4, 10, 3, '#f3f6fa'); px(c, x - 4, y - 1, 8, 1, '#c5d2e0'); px(c, x - 5, y - 3, 10, 1, band); };
  switch (type) {
    case 'rice': bowl('#4f86e0'); oval(c, x, y - 5, 4, 2, '#ffffff'); px(c, x - 2, y - 6, 1, 1, '#eae6dc'); break;
    case 'noodles': bowl('#e2483d'); oval(c, x, y - 5, 4, 1, '#f2d27a'); px(c, x - 3, y - 6, 6, 1, '#e8bf5a'); px(c, x + 2, y - 12, 1, 8, '#a8743c'); px(c, x + 4, y - 12, 1, 8, '#a8743c'); break;
    case 'dumpling': oval(c, x, y - 2, 7, 2, '#f3f6fa'); [-4, 0, 4].forEach(d => { oval(c, x + d, y - 4, 2, 2, '#f6ecd6'); px(c, x + d - 1, y - 6, 3, 1, '#e3d3b0'); }); break;
    case 'bun': px(c, x - 5, y - 4, 10, 4, '#d9b06a'); px(c, x - 5, y - 2, 10, 1, '#b48a4a'); oval(c, x, y - 6, 4, 3, '#fbf6ea'); px(c, x, y - 8, 1, 1, '#e3d3b0'); break;
    case 'egg': oval(c, x, y - 2, 5, 1, '#f3f6fa'); oval(c, x, y - 5, 3, 4, '#f6ead2'); px(c, x - 1, y - 7, 1, 1, '#ffffff'); break;
    case 'milk': px(c, x - 2, y - 9, 5, 9, '#d8e8f0'); px(c, x - 2, y - 7, 5, 7, '#ffffff'); px(c, x + 1, y - 6, 1, 4, '#eef4f8'); break;
    case 'water': px(c, x - 2, y - 9, 5, 9, '#d8e8f0'); px(c, x - 2, y - 6, 5, 6, '#9fd3f2'); px(c, x - 1, y - 5, 1, 3, '#d8f0fc'); break;
    case 'fish': oval(c, x, y - 2, 7, 2, '#f3f6fa'); oval(c, x - 1, y - 4, 4, 2, '#f08a32'); px(c, x + 3, y - 6, 2, 4, '#f08a32'); px(c, x - 3, y - 5, 1, 1, '#2a1d18'); break;
    case 'apple': drawApple(c, x, y - 3); break;
    case 'carrot': px(c, x - 1, y - 7, 3, 6, '#f08a32'); px(c, x, y - 1, 1, 1, '#d8701e'); px(c, x - 1, y - 10, 1, 3, PAL.leaf); px(c, x + 1, y - 10, 1, 3, PAL.leafD); break;
    case 'tomato': disc(c, x, y - 3, 3, '#e2483d'); px(c, x - 1, y - 7, 3, 1, PAL.leaf); px(c, x - 2, y - 4, 1, 1, '#ff9a8a'); break;
    case 'watermelon': oval(c, x, y - 4, 5, 4, '#3f8a3a'); for (let i = -3; i <= 3; i += 3) px(c, x + i, y - 8, 1, 8, '#2a6a2a'); break;
    case 'corn': px(c, x - 1, y - 9, 3, 8, '#f4cf3a'); px(c, x - 1, y - 9, 1, 8, '#d9b02a'); px(c, x - 2, y - 3, 1, 3, PAL.leaf); px(c, x + 2, y - 4, 1, 4, PAL.leaf); break;
    case 'star': drawStar(c, x, y - 4, '#f4cf3a'); break;
    case 'flower': drawFlower(c, x, y, FLOWER_COLORS[3], 0); break;
    case 'duck': drawDuck(c, x, y, 1, 0, false); break;
    case 'car': drawVehicle(c, x, y + 1, 'minicar', 1, 0, '#e2483d'); break;
    case 'eggraw': oval(c, x, y - 3, 2, 3, '#f6ead2'); px(c, x - 1, y - 5, 1, 1, '#ffffff'); break;
    case 'bigegg': oval(c, x, y - 5, 3, 4, '#f3dfbf'); oval(c, x - 1, y - 6, 2, 3, '#fbf0dc'); px(c, x - 1, y - 8, 1, 2, '#ffffff'); break;
  }
}
function drawStar(c, x, y, col) {
  px(c, x, y - 3, 1, 2, col); px(c, x - 3, y - 1, 7, 1, col); px(c, x - 2, y, 5, 1, col); px(c, x - 1, y - 1, 3, 3, col); px(c, x - 2, y + 2, 1, 1, col); px(c, x + 2, y + 2, 1, 1, col);
}
function drawHeart(c, x, y, col = '#ef5a7a') {
  px(c, x - 2, y - 3, 2, 1, col); px(c, x + 1, y - 3, 2, 1, col); px(c, x - 3, y - 2, 7, 2, col); px(c, x - 2, y, 5, 1, col); px(c, x - 1, y + 1, 3, 1, col); px(c, x, y + 2, 1, 1, col);
}
function drawNote(c, x, y, col = '#4a3a8a') { px(c, x, y - 5, 1, 5, col); px(c, x - 2, y - 1, 3, 2, col); px(c, x + 1, y - 5, 2, 1, col); }
function drawZ(c, x, y, col = '#ffffff') { px(c, x - 2, y - 3, 4, 1, col); px(c, x, y - 2, 1, 1, col); px(c, x - 1, y - 1, 1, 1, col); px(c, x - 2, y, 4, 1, col); }

// ---------- Kendaraan (ukuran sebanding dengan orang) ----------
function drawVehicle(c, x, y, type, dir, t, col) {
  x = Math.round(x); y = Math.round(y);
  const spin = Math.floor(t * 10) % 2;
  const wheel = (wx, r) => { disc(c, wx, y - r, r, '#2a2a2e'); disc(c, wx, y - r, Math.max(1, r - 3), '#9a9aa2'); px(c, wx - (spin ? 1 : 0), y - r, 1, 1, '#e9e9ef'); };
  const head = (hx, hy, hair) => { px(c, hx - 2, hy, 5, 4, '#f6c9a3'); px(c, hx - 2, hy - 1, 5, 2, hair); };
  if (type === 'minicar') {
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
      P(-12, -9, 24, 6, col); P(-7, -14, 13, 5, col); P(-6, -13, 5, 3, '#bfe3f2'); P(0, -13, 5, 3, '#bfe3f2');
      wheel(-7, 3); wheel(7, 3);
    });
  } else if (type === 'car') {
    shadow(c, x, y + 1, 22);
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
      P(-13, -24, 25, 10, col); P(-11, -25, 21, 1, col);
      P(-11, -22, 10, 7, '#bfe3f2'); P(1, -22, 10, 7, '#bfe3f2'); P(-11, -22, 3, 1, '#e8f6fc'); P(1, -22, 3, 1, '#e8f6fc');
      head(6, -20, '#3a2a20');
      P(-22, -15, 44, 10, col); P(-22, -15, 44, 1, 'rgba(255,255,255,0.35)'); P(-22, -6, 44, 1, 'rgba(0,0,0,0.25)');
      P(0, -14, 1, 8, 'rgba(0,0,0,0.2)'); P(3, -12, 3, 1, 'rgba(0,0,0,0.35)'); P(-8, -12, 3, 1, 'rgba(0,0,0,0.35)');
      P(19, -13, 3, 3, '#fff2a8'); P(-22, -13, 2, 3, '#ff6a5a');
      P(-23, -7, 4, 2, '#d0d0d8'); P(19, -7, 4, 2, '#d0d0d8');
      wheel(-12, 5); wheel(12, 5);
    });
  } else if (type === 'bus') {
    shadow(c, x, y + 1, 34);
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
      P(-35, -34, 70, 29, '#f4c23a'); P(-34, -35, 68, 1, '#f4c23a'); P(-35, -34, 70, 1, '#ffe08a');
      const hairs = ['#3a2a20', '#e8e4dc', '#5a321e', '#1f1a16', '#7a4a30'];
      for (let i = 0; i < 5; i++) { const wx = -32 + i * 11; P(wx, -30, 9, 9, '#bfe3f2'); if (i % 2 === 0 || i === 3) head(wx + 4, -26, hairs[i]); P(wx, -30, 9, 1, '#e8f6fc'); }
      P(25, -30, 9, 15, '#bfe3f2'); head(29, -26, '#2a1d18'); P(25, -30, 9, 1, '#e8f6fc');
      P(-35, -17, 70, 3, '#e2483d'); P(-35, -8, 70, 3, '#c99a1c');
      P(14, -20, 8, 15, '#e8b02a'); P(17, -20, 1, 15, '#c99a1c');
      P(32, -12, 3, 3, '#fff2a8'); P(-35, -12, 2, 3, '#ff6a5a');
      wheel(-22, 6); wheel(22, 6);
    });
  } else if (type === 'bike') {
    shadow(c, x, y + 1, 10);
    flip(c, x, dir, () => {
      const ring = wx => { for (let a = 0; a < 16; a++) px(c, wx + Math.round(Math.cos(a / 16 * 6.283) * 5), y - 5 + Math.round(Math.sin(a / 16 * 6.283) * 5), 1, 1, '#2a2a2e'); };
      ring(-8); ring(8);
      px(c, -8, y - 6, 16, 1, '#4f86e0'); px(c, -2, y - 11, 1, 6, '#4f86e0'); px(c, 6, y - 13, 1, 8, '#4f86e0'); px(c, 5, y - 13, 3, 1, '#2a2a2e');
      px(c, -4, y - 12, 4, 1, '#2a2a2e');
    });
    drawPerson(c, x - dir * 2, y - 10, { look: 'rider', dir: dir > 0 ? 'right' : 'left', frame: 1 + (Math.floor(t * 6) % 2), noShadow: true });
  } else if (type === 'train') {
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
      for (let k = 0; k < 2; k++) {
        const bx = -78 + k * 32;
        P(bx, -14, 29, 11, k ? '#4f86e0' : '#58a84a'); P(bx, -4, 29, 1, 'rgba(0,0,0,0.3)');
        for (let i = 3; i < 26; i += 8) P(bx + i, -12, 5, 4, '#fff2c8');
        wheel(bx + 6, 2); wheel(bx + 22, 2); P(bx + 29, -7, 3, 1, '#3a3a3a');
      }
      P(-14, -14, 24, 11, '#d9483b'); P(-14, -20, 10, 7, '#d9483b'); P(-12, -18, 6, 4, '#fff2c8');
      P(2, -19, 4, 5, '#3a3a3a'); P(10, -7, 3, 4, '#3a3a3a'); P(-14, -4, 24, 1, 'rgba(0,0,0,0.3)'); P(8, -12, 2, 2, '#fff2a8');
      wheel(-9, 3); wheel(0, 3); wheel(6, 2);
    });
  } else if (type === 'boat') {
    const bob = Math.sin(t * 2) > 0 ? 1 : 0;
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy + bob, w, h, k);
      P(-12, -1, 24, 1, PAL.waterL);
      P(-12, -5, 24, 2, '#a8743c'); P(-10, -3, 20, 2, '#7d5230'); P(-12, -6, 24, 1, '#d39b5f');
      P(0, -22, 1, 17, '#5a3a22');
      for (let i = 0; i < 14; i++) P(1, -21 + i, Math.round(i * 0.6) + 1, 1, '#fffaf0');
      for (let i = 0; i < 10; i++) P(-1 - Math.round(i * 0.5), -17 + i, Math.round(i * 0.5) + 1, 1, '#f3e9d6');
    });
  } else if (type === 'plane') {
    flip(c, x, dir, () => {
      const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
      P(-11, -1, 22, 3, '#fbf8f0'); P(9, 0, 3, 1, '#fbf8f0'); P(-2, -9, 5, 19, '#e8e2d6'); P(-11, -5, 3, 11, '#e8e2d6');
      P(-2, -9, 5, 1, '#e2483d'); P(-2, 9, 5, 1, '#e2483d'); P(7, 0, 2, 1, '#4f86e0');
    });
  }
}

// ---------- Bangunan & perabot ----------
function drawHouse(c, x, y, w, h, o) {
  const rh = Math.round(h * 0.46);
  shadow(c, x + w / 2, y + h + 2, w / 2 + 2);
  px(c, x, y + rh, w, h - rh, o.wall || '#f3e3c0');
  for (let i = y + rh + 4; i < y + h; i += 4) px(c, x, i, w, 1, o.wallD || '#e2cda2');
  px(c, x + w - 16, y + rh, 13, h - rh, 'rgba(110,70,40,0.09)');
  px(c, x, y + rh, w, 3, 'rgba(90,55,35,0.28)');
  px(c, x, y + rh, 3, h - rh, PAL.wood); px(c, x + w - 3, y + rh, 3, h - rh, PAL.woodD); px(c, x, y + rh, 1, h - rh, PAL.woodL);
  // fondasi batu
  px(c, x - 1, y + h - 3, w + 2, 3, PAL.stoneD);
  for (let j = 0; j < w; j += 6) { px(c, x + j, y + h - 3, 5, 2, PAL.stone); px(c, x + j, y + h - 3, 3, 1, '#c9c6c0'); }
  if (o.chimney) {
    px(c, x + w - 20, y - 8, 8, 14, PAL.stone); px(c, x + w - 21, y - 9, 10, 2, PAL.stoneD); px(c, x + w - 14, y - 7, 2, 13, PAL.stoneD);
    for (let k = 0; k < 3; k++) px(c, x + w - 20 + (k % 2) * 2, y - 5 + k * 3, 4, 1, PAL.stoneD);
  }
  // genteng berlapis: tiap baris punya tepi terang dan bayangan
  px(c, x - 4, y, w + 8, rh, o.roof);
  for (let r = 0, i = y; i < y + rh; i += 4, r++) {
    px(c, x - 4, i + 3, w + 8, 1, o.roofD);
    for (let j = x - 4 + (r % 2) * 4; j < x + w + 4; j += 8) { px(c, j, i, 1, 3, o.roofD); px(c, j + 1, i, 4, 1, o.roofL || o.roof); }
  }
  px(c, x + w - 18, y, 22, rh, 'rgba(70,20,20,0.12)');
  px(c, x - 4, y, w + 8, 1, o.roofL || o.roof); px(c, x - 5, y + rh - 2, w + 10, 2, o.roofD); px(c, x - 5, y + rh - 1, w + 10, 1, 'rgba(50,20,15,0.35)');
  if (o.door != null) {
    const dx = x + o.door;
    px(c, dx - 1, y + h - 21, 16, 19, PAL.woodD); px(c, dx, y + h - 20, 14, 18, PAL.wood);
    px(c, dx + 6, y + h - 20, 2, 18, PAL.woodD);
    for (const pn of [dx + 2, dx + 9]) { px(c, pn, y + h - 18, 3, 6, '#9c6a3a'); px(c, pn, y + h - 10, 3, 6, '#9c6a3a'); px(c, pn, y + h - 18, 3, 1, PAL.woodL); px(c, pn, y + h - 10, 3, 1, PAL.woodL); }
    px(c, dx + 5, y + h - 11, 1, 2, '#f4cf3a'); px(c, dx + 8, y + h - 11, 1, 2, '#f4cf3a');
    px(c, dx - 3, y + h - 2, 20, 3, PAL.stoneD); px(c, dx - 3, y + h - 2, 20, 1, '#c9c6c0');
  }
  (o.windows || []).forEach(wx => {
    drawWindow(c, x + wx, y + rh + 7, o.night);
    if (o.flowerbox) {
      const fy = y + rh + 18;
      px(c, x + wx - 1, fy + 1, 16, 3, PAL.woodD); px(c, x + wx, fy + 1, 14, 2, PAL.wood);
      px(c, x + wx - 1, fy - 1, 16, 2, PAL.leafD);
      for (let k = 0; k < 7; k++) px(c, x + wx + k * 2, fy - 2 + (k % 2), 1, 1, k % 3 === 0 ? '#f39ac0' : k % 3 === 1 ? '#f4cf3a' : '#ffffff');
    }
  });
}
function drawWindow(c, x, y, night) {
  px(c, x - 1, y - 1, 16, 13, PAL.woodD);
  px(c, x, y, 14, 11, night ? '#ffd96a' : '#a8dcf5');
  if (!night) { px(c, x, y + 8, 14, 3, '#8fcdea'); px(c, x + 1, y + 1, 3, 1, '#e3f5fc'); px(c, x + 1, y + 2, 1, 2, '#e3f5fc'); px(c, x + 9, y + 1, 2, 1, '#e3f5fc'); }
  px(c, x + 6, y, 2, 11, PAL.woodD); px(c, x, y + 5, 14, 1, PAL.woodD);
  px(c, x - 2, y + 11, 18, 2, PAL.wood); px(c, x - 2, y + 11, 18, 1, PAL.woodL);
}

function drawFenceH(c, x, y, len) {
  shadowRect(c, x, y + 1, len + 3, 2);
  for (let i = 0; i <= len; i += 8) { px(c, x + i, y - 9, 3, 10, PAL.woodD); px(c, x + i, y - 9, 2, 9, PAL.wood); px(c, x + i, y - 9, 2, 1, PAL.woodL); }
  px(c, x, y - 7, len + 3, 2, PAL.woodL); px(c, x, y - 3, len + 3, 2, PAL.woodL);
  px(c, x, y - 6, len + 3, 1, PAL.woodD); px(c, x, y - 2, len + 3, 1, PAL.woodD);
}
function drawFenceV(c, x, y, len) {
  px(c, x, y - 6, 2, len, PAL.woodL); px(c, x + 2, y - 6, 1, len, PAL.woodD);
  for (let i = 0; i <= len; i += 8) { px(c, x - 1, y + i - 9, 4, 10, PAL.woodD); px(c, x - 1, y + i - 9, 3, 9, PAL.wood); }
}

// Bercak lembut pada tanah (derau halus) supaya warnanya tidak rata
function groundPatches(c, x, y, w, h, seed, col, level) {
  const r = rng(seed), cell = 14, cols = Math.ceil(w / cell) + 2, rows = Math.ceil(h / cell) + 2, g = [];
  for (let i = 0; i < cols * rows; i++) g.push(r());
  const at = (i, j) => g[j * cols + i], sm = v => v * v * (3 - 2 * v);
  c.fillStyle = col;
  for (let py = 0; py < h; py += 2) for (let qx = 0; qx < w; qx += 2) {
    const fx = qx / cell, fy = py / cell, i = Math.floor(fx), j = Math.floor(fy), u = sm(fx - i), v = sm(fy - j);
    const n = (at(i, j) * (1 - u) + at(i + 1, j) * u) * (1 - v) + (at(i, j + 1) * (1 - u) + at(i + 1, j + 1) * u) * v;
    if (n > level) c.fillRect((x + qx) * PX, (y + py) * PX, 2 * PX, 2 * PX);
  }
}
function drawGrass(c, x, y, w, h, seed, flowers) {
  px(c, x, y, w, h, PAL.grass);
  groundPatches(c, x, y, w, h, seed + 1, PAL.grassM, 0.58);
  groundPatches(c, x, y, w, h, seed + 2, PAL.grassN, 0.6);
  const r = rng(seed), n = Math.floor(w * h / 130);
  for (let i = 0; i < n; i++) {
    const gx = x + Math.floor(r() * w), gy = y + Math.floor(r() * h);
    if (r() < 0.62) { px(c, gx, gy, 1, 2, PAL.grassD); px(c, gx + 2, gy, 1, 2, PAL.grassD); px(c, gx + 1, gy + 1, 1, 1, PAL.grassD); }
    else px(c, gx, gy, 2, 1, PAL.grassL);
  }
  if (!flowers) return;
  // bunga liar tumbuh bergerombol, bukan tersebar acak
  const groups = Math.floor(w * h / 3600);
  for (let i = 0; i < groups; i++) {
    const gx = x + Math.floor(r() * w), gy = y + Math.floor(r() * h), col = ['#ffffff', '#f7d64a', '#f6a8c8'][Math.floor(r() * 3)];
    for (let k = 0; k < 4; k++) {
      const fx = gx + Math.floor(r() * 13) - 6, fy = gy + Math.floor(r() * 9) - 4;
      px(c, fx, fy - 1, 1, 3, col); px(c, fx - 1, fy, 3, 1, col); px(c, fx, fy, 1, 1, col === '#f7d64a' ? '#c98a2a' : '#f4cf3a');
    }
  }
}
// Jalan tanah bertepi tidak lurus. Tepi digambar dulu, isi belakangan, supaya persimpangan bersih.
function pathEdge(c, x, y, w, h, seed) {
  const r = rng(seed);
  const side = (len, put) => { for (let i = 0; i < len;) { const n = 2 + Math.floor(r() * 5), e = Math.floor(r() * 3); put(i, Math.min(n, len - i), e); i += n; } };
  side(w, (i, n, e) => { px(c, x + i, y - e - 1, n, 1, PAL.pathD); px(c, x + i, y - e, n, e, PAL.path); });
  side(w, (i, n, e) => { px(c, x + i, y + h + e, n, 1, PAL.pathD); px(c, x + i, y + h, n, e, PAL.path); });
  side(h, (i, n, e) => { px(c, x - e - 1, y + i, 1, n, PAL.pathD); px(c, x - e, y + i, e, n, PAL.path); });
  side(h, (i, n, e) => { px(c, x + w + e, y + i, 1, n, PAL.pathD); px(c, x + w, y + i, e, n, PAL.path); });
}
function pathFill(c, x, y, w, h, seed) {
  px(c, x, y, w, h, PAL.path);
  groundPatches(c, x, y, w, h, seed + 3, PAL.pathM, 0.56);
  const r = rng(seed + 7);
  for (let i = 0; i < w * h / 60; i++) px(c, x + Math.floor(r() * w), y + Math.floor(r() * h), r() < 0.5 ? 2 : 1, 1, r() < 0.6 ? PAL.pathD : PAL.pathL);
  for (let i = 0; i < w * h / 700; i++) { const sx = x + Math.floor(r() * (w - 3)), sy = y + 1 + Math.floor(r() * (h - 3)); px(c, sx, sy, 3, 2, '#b89a68'); px(c, sx, sy, 2, 1, '#d8c49a'); }
}
function drawPaths(c, list) { list.forEach(p => pathEdge(c, ...p)); list.forEach(p => pathFill(c, ...p)); }
function drawPath(c, x, y, w, h, seed) { drawPaths(c, [[x, y, w, h, seed]]); }

// Benda di latar diberi garis tepi yang sama dengan benda berdiri (fn menggambar ke lapisan sementara)
let _bgL = null, _bgS = null;
function bgOutlined(c, fn) {
  if (!_bgL) { _bgL = document.createElement('canvas'); _bgL.width = W; _bgL.height = H; _bgS = document.createElement('canvas'); _bgS.width = W; _bgS.height = H; }
  const lc = _bgL.getContext('2d'), sc = _bgS.getContext('2d'), keep = SHADOW_TO;
  lc.clearRect(0, 0, W, H);
  SHADOW_TO = c; fn(lc); SHADOW_TO = keep;
  sc.globalCompositeOperation = 'source-over'; sc.clearRect(0, 0, W, H); sc.drawImage(_bgL, 0, 0);
  sc.globalCompositeOperation = 'source-in'; sc.fillStyle = 'rgba(46,30,20,0.85)'; sc.fillRect(0, 0, W, H);
  sc.globalCompositeOperation = 'source-over';
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.drawImage(_bgS, dx, dy);
  c.drawImage(_bgL, 0, 0);
}

// Benda dekat yang lebih besar: bentuknya digambar pada ukuran itu (s kali), garis tepinya tetap 1 piksel
const _bigBuf = {};
function drawBig(c, x, y, s, fn, col = '#3a2616') {
  const size = 48 * s;
  if (!_bigBuf[s]) { const o = document.createElement('canvas'), m = document.createElement('canvas'); o.width = o.height = m.width = m.height = size; _bigBuf[s] = [o, m]; }
  const [ob, mb] = _bigBuf[s], oc = ob.getContext('2d'), mc = mb.getContext('2d'), keepS = SHADOW_TO, keepP = PX;
  oc.clearRect(0, 0, size, size);
  SHADOW_TO = _trash; PX = s;
  try { fn(oc, 24, 40); } finally { PX = keepP; SHADOW_TO = keepS; }
  mc.globalCompositeOperation = 'source-over'; mc.clearRect(0, 0, size, size); mc.drawImage(ob, 0, 0);
  mc.globalCompositeOperation = 'source-in'; mc.fillStyle = col; mc.fillRect(0, 0, size, size);
  mc.globalCompositeOperation = 'source-over';
  const ox = Math.round(x) - 24 * s, oy = Math.round(y) - 40 * s;
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) c.drawImage(mb, ox + dx, oy + dy);
  c.drawImage(ob, ox, oy);
}

// ---------- Lantai, dinding, air ----------
// Lantai papan: tiap papan sedikit beda warna, ada sambungan dan serat kayu
function drawPlanks(c, x, y, w, h, tones, seam, seed, rowH = 8, len = 44) {
  const r = rng(seed);
  for (let row = 0, py = y; py < y + h; py += rowH, row++) {
    for (let qx = x - (row % 2) * (len >> 1); qx < x + w; qx += len) {
      const sx = Math.max(x, qx), ex = Math.min(x + w, qx + len);
      px(c, sx, py, ex - sx, rowH - 1, tones[Math.floor(r() * tones.length)]);
      if (qx >= x) px(c, sx, py, 1, rowH - 1, seam);
      for (let g = 0; g < 2; g++) px(c, sx + 3 + Math.floor(r() * Math.max(1, ex - sx - 14)), py + 1 + Math.floor(r() * (rowH - 3)), 4 + Math.floor(r() * 8), 1, 'rgba(90,55,25,0.13)');
    }
    px(c, x, py + rowH - 1, w, 1, seam);
  }
}
// Lantai ubin: warnanya sedikit berbeda per ubin
function drawTiles(c, x, y, w, h, size, tones, seam, seed) {
  const r = rng(seed);
  for (let py = y; py < y + h; py += size) for (let qx = x; qx < x + w; qx += size) {
    px(c, qx, py, size, size, tones[Math.floor(r() * tones.length)]);
    px(c, qx, py, size, 1, seam); px(c, qx, py, 1, size, seam);
  }
}
// Cahaya jendela yang jatuh miring ke lantai (siang saja)
function windowLight(c, x, y, w, h, lean = 10) {
  if (G.night) return;
  for (let i = 0; i < h; i++) px(c, x + Math.round(i * lean / h), y + i, w, 1, 'rgba(255,244,205,0.2)');
}
// Bayangan lembut di kaki dinding
function wallFoot(c, y, x = 0, w = W) { px(c, x, y, w, 2, 'rgba(50,30,15,0.24)'); px(c, x, y + 2, w, 2, 'rgba(50,30,15,0.1)'); }
function drawWater(c, x, y, w, h, seed) {
  px(c, x, y, w, h, PAL.water);
  groundPatches(c, x, y, w, h, seed, '#55a9d9', 0.52);
  groundPatches(c, x, y, w, h, seed + 1, '#6cbce6', 0.62);
  const r = rng(seed + 2);
  for (let i = 0; i < w * h / 150; i++) px(c, x + Math.floor(r() * w), y + Math.floor(r() * h), 3 + Math.floor(r() * 7), 1, r() < 0.55 ? PAL.waterL : '#8fd0f2');
}

function drawArrow(c, x, y, dir, t) {
  const o = Math.round(Math.sin(t * 4));
  c.save(); c.globalAlpha = 0.88; c.translate(x + (dir === 'right' ? o : dir === 'left' ? -o : 0), y + (dir === 'down' ? o : dir === 'up' ? -o : 0));
  c.rotate({ right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[dir]);
  const A = (dx, dy, w, h, k) => { c.fillStyle = k; c.fillRect(dx, dy, w, h); };
  const E = '#6b4f33', F = '#ffe88a';
  A(-6, -3, 7, 6, E); A(1, -6, 2, 12, E); A(3, -4, 2, 8, E); A(5, -2, 2, 4, E);
  A(-5, -2, 7, 4, F); A(2, -4, 2, 8, F); A(4, -2, 1, 4, F);
  A(-5, -2, 7, 1, '#fff8d4');
  c.restore();
}

// Huruf angka kecil 3x5 untuk papan tulis
const DIGITS = { 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111' };
function drawDigit(c, x, y, d, col) {
  const s = DIGITS[d];
  for (let i = 0; i < 15; i++) if (s[i] === '1') px(c, x + (i % 3), y + Math.floor(i / 3), 1, 1, col);
}

// Bunga besar (kanvas 48x56). stage 0–6: tanah, biji, akar, batang, daun, kelopak, tengah bunga
function drawBigFlower(c, col, hl, t, stage = 6) {
  const blink = Math.floor(t * 6) % 2 === 0;
  const C = (part, base) => (hl === part && blink) ? '#fff7b0' : base;
  drawFlowerGround(c, (hl === 'root' && blink) ? '#9a6a45' : '#8a5a35');
  if (stage >= 1 && stage <= 2) { oval(c, 24, 44, 3, 2, C('seed', '#c9a24a')); oval(c, 23.5, 43.5, 1.5, 0.5, '#f0dcae'); }
  if (stage >= 2) {
    const R = C('root', '#f0dcae');
    // akar melengkung, makin ke bawah makin tipis
    [[24, 42, 19, 51, 1], [24, 42, 29, 51, -1], [24, 42, 22, 54, 0.4], [24, 42, 26, 54, -0.4], [21, 47, 16, 53, 0.6], [27, 47, 32, 53, -0.6]].forEach(([x0, y0, x1, y1, b], i) => {
      for (let u = 0; u <= 1; u += 0.05) px(c, x0 + (x1 - x0) * u + Math.sin(u * Math.PI) * b, y0 + (y1 - y0) * u, u < 0.4 && i < 4 ? 1 : 0.5, 0.5, R);
    });
  }
  if (stage >= 3) {
    px(c, 23, 20, 2, 21, C('stem', '#3f8a3a'));
    if (hl !== 'stem' || !blink) { px(c, 23, 20, 0.5, 21, '#58a84a'); px(c, 24.5, 20, 0.5, 21, '#2f6e26'); }
  }
  if (stage >= 4) {
    bigLeaf(c, 23, 32, 11, 30, 2.8, C('leaf', '#4a9a3a'), C('leaf', '#2f7a2c'), C('leaf', '#7cc85a'));
    bigLeaf(c, 25, 28, 37, 26, 2.8, C('leaf', '#4a9a3a'), C('leaf', '#2f7a2c'), C('leaf', '#7cc85a'));
  }
  if (stage >= 5) {
    const Pm = C('petal', col[1]), Pd = C('petal', col[2]);
    // kelopak: pangkal sempit, ujung membulat
    const petal = (a, grow, r, k, col2) => {
      for (let u = 0; u <= 1; u += 0.08) disc(c, 24 + Math.cos(a) * (2 + 8.5 * u), 15 + Math.sin(a) * (2 + 8.5 * u) - k, (1.2 + Math.sin(Math.pow(u, 1.4) * Math.PI * 0.74) * r) * grow, col2);
    };
    for (let i = 0; i < 6; i++) petal(i / 6 * Math.PI * 2 - Math.PI / 2, 1, 4.1, 0, Pd);
    for (let i = 0; i < 6; i++) petal(i / 6 * Math.PI * 2 - Math.PI / 2, 0.82, 4.1, 0.5, Pm);
    for (let i = 0; i < 6; i++) {
      const a = i / 6 * Math.PI * 2 - Math.PI / 2;
      for (let u = 0.3; u < 0.92; u += 0.05) px(c, 24 + Math.cos(a) * (2 + 10 * u), 15 + Math.sin(a) * (2 + 10 * u) - 0.5, 0.5, 0.5, Pd);
    }
  }
  if (stage >= 6) {
    disc(c, 24, 15, 4, C('pistil', col[0] === 'yellow' ? '#8a5a35' : '#f4cf3a'));
    disc(c, 24, 15, 2.5, C('pistil', col[0] === 'yellow' ? '#6b4226' : '#e9b02a'));
    for (let k = 0; k < 8; k++) px(c, 24 + Math.cos(k * 0.785) * 3.2, 15 + Math.sin(k * 0.785) * 3.2, 0.5, 0.5, '#fff2a8');
    px(c, 22.5, 13.5, 1, 0.5, '#ffffff');
  }
}
// Langit dan tanah di balik bunga besar
function drawFlowerGround(c, soil = '#8a5a35') {
  c.clearRect(0, 0, 48 * PX, 56 * PX);
  px(c, 0, 0, 48, 41, '#dff1fb'); px(c, 0, 0, 48, 10, '#d2ebf9'); px(c, 0, 10, 48, 8, '#d9eefa');
  oval(c, 8, 8, 6, 1.5, '#f4fbff'); oval(c, 11, 7, 3.5, 1.5, '#ffffff');
  px(c, 0, 41, 48, 15, soil); px(c, 0, 50, 48, 6, 'rgba(50,25,10,0.14)');
  for (let i = 0; i < 18; i++) px(c, (i * 13) % 46, 43.5 + (i * 7) % 12, 1.5, 0.5, i % 3 ? '#7a4c2c' : '#a0704a');
  [[6, 47], [40, 45], [34, 53], [12, 53]].forEach(([a, b]) => { oval(c, a, b, 1.5, 1, PAL.stoneD); oval(c, a - 0.5, b - 0.5, 1, 0.5, '#c9c6c0'); });
  px(c, 0, 40, 48, 2, PAL.grass); px(c, 0, 41.5, 48, 0.5, PAL.grassD);
  for (let i = 0; i < 16; i++) { px(c, 1 + i * 3, 39, 0.5, 1 + (i % 2), PAL.grass); px(c, 2 + i * 3, 39.5, 0.5, 1, PAL.grassD); }
}
// Daun runcing dari pangkal (x0,y0) ke ujung (x1,y1)
function bigLeaf(c, x0, y0, x1, y1, wid, col, dark, light) {
  for (let u = 0; u <= 1; u += 0.02) {
    const h = Math.sin(Math.pow(u, 0.75) * Math.PI) * wid, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
    px(c, x, y - h, 0.5, h * 2, col);
    px(c, x, y - h, 0.5, h * 0.7, light);
    px(c, x, y, 0.5, 0.5, dark);
  }
}
