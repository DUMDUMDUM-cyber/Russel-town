// Kebun binatang: gajah, jerapah, singa, monyet, penguin, panda. Ketuk untuk nama dan suaranya, dekati untuk memberi makan.

LOOKS.zookeeper = { skin: '#e9b48a', hair: '#2a1d18', style: 'cap', cap: '#c9a46a', capD: '#a07c48', shirt: '#58845a', shirtD: '#3f6a42', pants: '#7d6a4a', shoes: '#3a2a20', pack: '#a8743c' };
VOICE_ROLE.zookeeper = { pitch: 0.95, m: 1 };

// ================= GAMBAR HEWAN (x = tengah, y = kaki) =================
function drawElephant(c, x, y, dir, t, spray) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 18);
  const G1 = '#a9b0bc', G2 = '#8f96a3', G3 = '#c6ccd6', sw = Math.round(Math.sin(t * 1.5) * 1.5), ear = Math.sin(t * 2) > 0.6 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    P(-12, -10, 5, 10, G2); P(2, -10, 5, 10, G2);
    oval(c, -2, y - 20, 16, 10, G2); oval(c, -3, y - 21, 15, 9, G1); oval(c, -6, y - 25, 8, 3, G3);
    P(-16, -11, 6, 11, G1); P(5, -11, 6, 11, G1); P(-16, -2, 6, 2, G3); P(5, -2, 6, 2, G3);
    P(-18, -24, 1, 8, G2); P(-19, -17, 2, 2, '#5a6070');
    disc(c, 15, y - 26, 8, G1); disc(c, 14, y - 28, 5, G3);
    oval(c, 8 - ear, y - 26, 5 + ear, 8, G2); oval(c, 8 - ear, y - 26, 3 + ear, 6, '#e8b8c0');
    P(17, -29, 2, 2, '#2a1d18'); P(17, -29, 1, 1, '#ffffff');
    P(19, -20, 4, 1, '#fff6e0');
    for (let k = 0; k < 16; k++) { const tx = 21 + Math.round(Math.sin(k / 5 + t * 1.5) * 1.5) + (k > 12 ? k - 12 : 0) + sw * (k / 16); P(tx, -24 + k, 3, 1, k % 3 ? G1 : G2); }
    if (spray) for (let k = 0; k < 6; k++) disc(c, 28 + k * 3, y - 6 - k * 4 + (Math.floor(t * 10 + k) % 2), 1, '#8fd0f2');
  });
}
function drawGiraffe(c, x, y, dir, t) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 12);
  const Y1 = '#f4cf3a', Y2 = '#d9b02a', B = '#a8642a', nod = Math.sin(t * 0.8) > 0.7 ? 1 : 0;
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    for (const lx of [-9, -5, 4, 8]) { P(lx, -18, 2, 18, lx === -5 || lx === 8 ? Y2 : Y1); P(lx, -2, 2, 2, '#5a3a22'); }
    oval(c, 0, y - 22, 12, 6, Y2); oval(c, -1, y - 23, 11, 5, Y1);
    for (let k = 0; k < 26; k++) P(6 + Math.round(k * 0.3), -26 - k, 5, 1, k % 2 ? Y1 : Y2);
    for (let k = 0; k < 24; k += 3) P(5 + Math.round(k * 0.3), -27 - k, 2, 1, B);
    P(12 + nod, -56, 9, 5, Y1); P(18 + nod, -54, 4, 3, Y2); P(15 + nod, -55, 2, 2, '#2a1d18');
    P(13 + nod, -60, 1, 4, B); P(16 + nod, -60, 1, 4, B); P(13 + nod, -61, 2, 1, '#5a3a22'); P(16 + nod, -61, 2, 1, '#5a3a22');
    P(-12, -24, 1, 9, Y2); P(-13, -16, 2, 2, '#5a3a22');
    for (const [a, b, r] of [[-6, -23, 2], [0, -25, 2], [5, -22, 2], [-2, -20, 1.5], [-9, -21, 1.5]]) disc(c, a, y + b, r, B);
  });
}
function drawLion(c, x, y, dir, t, roar) {
  x = Math.round(x); y = Math.round(y);
  shadow(c, x, y, 13);
  const T = '#e8b860', T2 = '#c99a4a', M = '#b8642a', M2 = '#8a4a1c';
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    P(-9, -8, 3, 8, T2); P(5, -8, 3, 8, T2); P(-11, -9, 3, 9, T); P(3, -9, 3, 9, T);
    oval(c, -3, y - 12, 11, 6, T2); oval(c, -4, y - 13, 10, 5, T);
    for (let k = 0; k < 9; k++) P(-14 - Math.round(k / 3), -14 - Math.round(Math.sin(k / 3 + t * 2) * 2), 1, 1, T2);
    disc(c, -17, y - 15, 2, M2);
    disc(c, 8, y - 18, 9, M2); disc(c, 8, y - 19, 8, M);
    for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; disc(c, 8 + Math.cos(a) * 8, y - 18 + Math.sin(a) * 8, 2, k % 2 ? M : M2); }
    disc(c, 10, y - 18, 5, T); px(c, 10, y - 21, 2, 2, '#2a1d18'); px(c, 13, y - 21, 2, 2, '#2a1d18'); px(c, 12, y - 18, 2, 2, '#6b3a22');
    if (roar) { px(c, 10, y - 16, 5, 3, '#8a2a2a'); px(c, 10, y - 16, 5, 1, '#ffffff'); } else px(c, 11, y - 15, 3, 1, '#6b3a22');
  });
}
function drawMonkey(c, x, y, t) {
  x = Math.round(x); y = Math.round(y);
  const Bn = '#8a5a35', L = '#e8c49a', sw = Math.round(Math.sin(t * 2) * 3);
  // menggantung di dahan: x,y = tangan di dahan
  px(c, x - 4, y, 2, 6, Bn); px(c, x + 2, y, 2, 6, Bn);
  const bx = x + sw;
  disc(c, bx, y + 10, 5, Bn); oval(c, bx, y + 11, 3, 3, L);
  disc(c, bx, y + 3, 4, Bn); oval(c, bx, y + 4, 3, 2, L); px(c, bx - 2, y + 2, 1, 1, '#2a1d18'); px(c, bx + 1, y + 2, 1, 1, '#2a1d18');
  disc(c, bx - 5, y + 2, 2, Bn); disc(c, bx + 5, y + 2, 2, Bn); disc(c, bx - 5, y + 2, 1, L); disc(c, bx + 5, y + 2, 1, L);
  px(c, bx - 4, y + 14, 2, 4, Bn); px(c, bx + 2, y + 14, 2, 4, Bn);
  for (let k = 0; k < 8; k++) px(c, bx + 4 + Math.round(k * 0.6), y + 12 + Math.round(Math.sin(k / 2) * 2), 1, 1, Bn);
}
function drawPenguin(c, x, y, dir, t, swim) {
  x = Math.round(x); y = Math.round(y);
  if (swim) { oval(c, x, y - 1, 5, 2, '#2a2a32'); px(c, x + dir * 4, y - 3, 3, 2, '#2a2a32'); px(c, x + dir * 6, y - 2, 2, 1, '#f08a32'); px(c, x - 2, y - 2, 4, 1, '#ffffff'); return; }
  shadow(c, x, y, 4);
  const w = Math.floor(t * 4) % 2;
  oval(c, x, y - 6, 4, 6, '#2a2a32'); oval(c, x + dir, y - 5, 3, 4.5, '#ffffff');
  px(c, x - 3 + w, y - 1, 2, 1, '#f08a32'); px(c, x + 1 - w, y - 1, 2, 1, '#f08a32');
  px(c, x + dir * 3, y - 10, 2, 1, '#f08a32'); px(c, x + dir, y - 11, 1, 1, '#ffffff');
  px(c, x - 4, y - 7, 1, 3, '#2a2a32'); px(c, x + 4, y - 7, 1, 3, '#2a2a32');
}
function drawFoodBit(c, x, y, k) {
  if (k === 'banana') { for (let i = 0; i < 6; i++) px(c, x - 3 + i, y - 2 - Math.round(Math.sin(i / 2) * 2), 2, 2, '#f4cf3a'); px(c, x - 4, y - 2, 1, 1, '#5a3a22'); }
  else if (k === 'grass') { for (let i = 0; i < 5; i++) px(c, x - 4 + i * 2, y - 4 - (i % 2), 1, 4 + (i % 2), '#58a84a'); }
  else if (k === 'leaf') { oval(c, x, y - 2, 3, 2, '#58a84a'); px(c, x - 3, y - 2, 6, 1, '#3d7f33'); }
  else if (k === 'bamboo') { px(c, x - 1, y - 8, 2, 8, '#7cc85a'); px(c, x - 1, y - 5, 2, 1, '#3d7f33'); oval(c, x + 2, y - 8, 2, 1, '#58a84a'); }
  else if (k === 'fish') { oval(c, x, y - 2, 3, 1, '#8fb8d8'); px(c, x + 3, y - 3, 1, 3, '#8fb8d8'); px(c, x - 2, y - 3, 1, 1, '#2a1d18'); }
}

// ================= TEMPAT: KEBUN BINATANG =================
SCENES.zoo = (() => {
  const S = { id: 'zoo', place: 'zoo', outdoor: true, walk: [6, 112, 314, 138], spawn: [16, 126], blocks: [], objs: [], lights: [[60, 126, 40], [160, 126, 40], [260, 126, 40]] };
  S.bg = c => {
    drawGrass(c, 0, 0, W, H, 121, true);
    drawPath(c, 0, 114, W, 22, 122);
    // kandang atas: gajah (tanah), jerapah (sabana), singa (batu)
    px(c, 8, 36, 98, 74, '#c9ad72'); groundPatches(c, 8, 36, 98, 74, 123, '#bc9f62', 0.55);
    oval(c, 70, 70, 16, 5, PAL.waterD); oval(c, 70, 69, 15, 4, PAL.water); px(c, 62, 68, 6, 1, PAL.waterL);
    px(c, 112, 36, 92, 74, '#d9c27a'); groundPatches(c, 112, 36, 92, 74, 124, '#cdb46a', 0.55);
    px(c, 210, 36, 102, 74, '#b8a27a'); groundPatches(c, 210, 36, 102, 74, 125, '#aa9470', 0.55);
    // kandang bawah: monyet (rumput), kolam penguin (air & es), panda (rumput bambu)
    px(c, 8, 144, 92, 34, '#7cb05a'); px(c, 108, 144, 100, 34, '#e8f2fa'); px(c, 216, 144, 96, 34, '#7cb05a');
    drawWater(c, 116, 150, 84, 24, 126); px(c, 116, 150, 84, 1, PAL.waterD);
    for (const [a, b, w] of [[120, 146, 18], [176, 146, 22]]) { px(c, a, b, w, 6, '#ffffff'); px(c, a, b + 5, w, 1, '#c6d2de'); }
    bgOutlined(c, cc => {
      // pagar belakang kandang bawah
      for (const [a, b] of [[8, 100], [108, 208], [216, 312]]) { for (let x = a; x <= b; x += 8) px(cc, x, 140, 2, 6, PAL.woodD); px(cc, a, 141, b - a + 2, 2, PAL.wood); }
      // pohon akasia untuk jerapah
      px(cc, 186, 52, 3, 40, '#8a5a35'); oval(cc, 186, 50, 18, 5, '#4f9a3c'); oval(cc, 184, 47, 14, 3, '#7cc85a');
      // batu besar singa
      oval(cc, 286, 92, 22, 14, '#8f8c86'); oval(cc, 284, 88, 18, 10, '#a9a6a0'); px(cc, 272, 82, 14, 2, '#c9c6c0');
      // pohon dan dahan monyet
      px(cc, 30, 150, 5, 28, '#8a5a35'); px(cc, 30, 150, 50, 3, '#8a5a35'); px(cc, 30, 150, 50, 1, '#a87448'); disc(cc, 30, 146, 9, PAL.leaf); disc(cc, 26, 143, 5, PAL.leafL);
      // rumpun bambu panda
      for (const bx of [292, 298, 304, 228]) { for (let y = 146; y < 176; y += 6) { px(cc, bx, y, 3, 6, '#7cc85a'); px(cc, bx, y + 5, 3, 1, '#3d7f33'); } oval(cc, bx + 4, 148, 3, 1, '#58a84a'); }
      // papan nama di pintu masuk
      shadow(cc, 18, 112, 6);
      px(cc, 17, 96, 2, 16, PAL.woodD); px(cc, 6, 84, 26, 13, PAL.woodD); px(cc, 7, 85, 24, 11, PAL.wood); px(cc, 7, 85, 24, 1, PAL.woodL);
      disc(cc, 13, 90, 3, '#a9b0bc'); px(cc, 16, 90, 2, 4, '#a9b0bc'); px(cc, 22, 87, 2, 6, '#f4cf3a'); px(cc, 22, 86, 5, 2, '#f4cf3a');
    });
  };
  // pagar depan kandang atas (di depan hewan, di belakang Russel)
  S.objs.push({ y: 111, skin: 'obj-pagar-depan', draw(c) {
    shadowRect(c, 8, 112, 304, 2);
    for (const [a, b] of [[8, 106], [112, 204], [210, 312]]) { for (let x = a; x <= b; x += 8) { px(c, x, 100, 3, 12, PAL.woodD); px(c, x, 100, 2, 11, PAL.wood); } px(c, a, 102, b - a + 2, 2, PAL.woodL); px(c, a, 106, b - a + 2, 2, PAL.woodL); }
  } });

  // hewan: diketuk = nama & suara; didekati = diberi makan
  const feed = (o, food, extra) => {
    o.eatT = 2.5; o.food = food; sfx('eat'); fx('heart', o.x, o.y - o.h - 6, 3);
    say([{ k: 'feed', by: G.boy }, { k: o.k }, { k: food }, ...(extra || [])]);
  };
  // getter (hit, hx, swim) disalin apa adanya, bukan nilainya
  const animal = (o) => Object.defineProperties({ eatT: 0, food: null, t0: Math.random() * 6,
    get hit() { return [this.x - this.w, this.y - this.h, this.w * 2, this.h + 2]; },
    update(dt) { this.t0 += dt; if (this.eatT > 0) this.eatT -= dt; if (this.move) this.move(dt); },
    drawFood(c) { if (this.eatT > 0 && this.food) drawFoodBit(c, this.x + (this.mouth || [0, 0])[0] * (this.dir || 1), this.y + (this.mouth || [0, 0])[1], this.food); },
  }, Object.getOwnPropertyDescriptors(o));
  const elephant = animal({ k: 'elephant', x: 46, y: 96, dir: 1, w: 24, h: 38, mouth: [24, -8], spray: 0, go: [56, 118],
    draw(c, t) { drawElephant(c, this.x, this.y, this.dir, t, this.spray > 0); this.drawFood(c); },
    move(dt) { if (this.spray > 0) this.spray -= dt; this.x = 46 + Math.sin(this.t0 * 0.2) * 10; this.dir = Math.cos(this.t0 * 0.2) >= 0 ? 1 : -1; },
    tap() { say([{ k: 'elephant' }, { k: 'longnose' }]); this.spray = 1.5; sfx('splash'); },
    arrive() { G.boy.dir = 'up'; feed(this, 'grass', [{ k: 'big' }]); } });
  const giraffe = animal({ k: 'giraffe', x: 150, y: 100, dir: 1, w: 14, h: 62, mouth: [18, -54], go: [156, 118],
    draw(c, t) { drawGiraffe(c, this.x, this.y, this.dir, t); this.drawFood(c); },
    move() { this.x = 150 + Math.sin(this.t0 * 0.15) * 14; this.dir = Math.cos(this.t0 * 0.15) >= 0 ? 1 : -1; },
    tap() { say([{ k: 'giraffe' }, { k: 'tall' }]); },
    arrive() { G.boy.dir = 'up'; feed(this, 'leaf'); } });
  const lion = animal({ k: 'lion', x: 248, y: 96, dir: 1, w: 16, h: 28, roarT: 0, go: [248, 118],
    draw(c, t) { drawLion(c, this.x, this.y, this.dir, t, this.roarT > 0); },
    move(dt) { if (this.roarT > 0) this.roarT -= dt; this.x = 248 + Math.sin(this.t0 * 0.25) * 18; this.dir = Math.cos(this.t0 * 0.25) >= 0 ? 1 : -1; },
    tap() { this.roarT = 1.2; Snd.tone(130, 0.6, { to: 90, gain: 0.12, type: 'sawtooth' }); say([{ k: 'lion' }, { k: 'roar' }]); },
    arrive() { G.boy.dir = 'up'; this.roarT = 1.2; Snd.tone(130, 0.6, { to: 90, gain: 0.12, type: 'sawtooth' }); say([{ k: 'lion' }, { k: 'roar' }, { k: 'big' }]); } });
  // hewan di kandang bawah ada di depan Russel (lebih dekat ke layar)
  const monkey = animal({ k: 'monkey', x: 60, y: 168, w: 10, h: 22, mouth: [0, -14], go: [56, 134],
    draw(c, t) { drawMonkey(c, this.hx, 152, t); if (this.eatT > 0) drawFoodBit(c, this.hx + 6, 162, 'banana'); },
    get hx() { return 44 + Math.round((Math.sin(this.t0 * 0.6) + 1) * 14); },
    get hit() { return [this.hx - 8, 148, 16, 24]; },
    tap() { say([{ k: 'monkey' }]); Snd.tone(880, 0.08, { to: 1200, gain: 0.05 }); Snd.tone(880, 0.08, { to: 1200, gain: 0.05, when: 0.12 }); },
    arrive() { G.boy.dir = 'down'; feed(this, 'banana', [{ k: 'yummy' }]); } });
  const penguins = [0, 1, 2].map(i => animal({ k: 'penguin', x: 130 + i * 24, y: 152, dir: 1, w: 6, h: 12, go: [158, 134], i,
    get swim() { return Math.sin(this.t0 * 0.5 + i * 2) > 0.3; },
    draw(c, t) {
      const sw = this.swim, px0 = sw ? 140 + ((this.t0 * 10 + i * 30) % 54) : 128 + i * 26, py0 = sw ? 160 + i * 4 : 151;
      this.x = px0; this.y = py0; drawPenguin(c, px0, py0, sw ? 1 : (i % 2 ? -1 : 1), t, sw);
      if (this.eatT > 0) drawFoodBit(c, px0 + 4, py0 - 8, 'fish');
    },
    tap() { say([{ k: 'penguin' }, ...(this.swim ? [{ k: 'swim' }] : [])]); },
    arrive() { G.boy.dir = 'down'; feed(this, 'fish'); } }));
  const panda = animal({ k: 'panda', x: 262, y: 168, dir: 1, w: 12, h: 20, go: [262, 134],
    draw(c, t) { drawPanda(c, this.x, this.y, t); if (this.eatT > 0) drawFoodBit(c, this.x + 6, this.y - 8, 'bamboo'); },
    tap() { say([{ k: 'panda' }]); },
    arrive() { G.boy.dir = 'down'; feed(this, 'bamboo', [{ k: 'yummy' }]); } });
  [elephant, giraffe, lion].forEach(a => S.objs.push(a));
  [monkey, ...penguins, panda].forEach(a => { a.y = Math.max(a.y, 150); S.objs.push(a); });
  // penjaga kebun binatang berjalan di jalan setapak
  S.objs.push(npc('zookeeper', 120, 124, 'right', { path: [[60, 124], [260, 124]], sp: 11,
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'zookeeper', by: 'np' }, { k: 'q_animal', by: 'np' }, { k: 'panda', by: 'me' }],
      [{ k: 'feed', by: 'np' }, { k: 'a_ok', by: 'me' }],
    ] }));
  S.objs.push(npc('kid2', 210, 130, 'up', { lines: [[{ k: 'hello', by: 'me' }, { k: 'q_animal', by: 'np' }, { k: 'monkey', by: 'me' }]] }));
  S.exits = [{ hit: [0, 112, 24, 28], arrow: [12, 126, 'left'], go: [6, 126], to: 'carnival', at: [298, 126] }];
  return S;
})();
SCENES.carnival.exits.push({ hit: [294, 112, 26, 28], arrow: [308, 126, 'right'], go: [314, 126], to: 'zoo', at: [18, 126] });
// papan penunjuk kebun binatang di tepi kanan karnaval
(function carnivalZooSign() {
  const C = SCENES.carnival, base = C.bg;
  C.bg = c => {
    base(c);
    bgOutlined(c, cc => {
      px(cc, 307, 98, 2, 14, PAL.woodD); px(cc, 297, 86, 22, 13, PAL.woodD); px(cc, 298, 87, 20, 11, PAL.wood); px(cc, 298, 87, 20, 1, PAL.woodL);
      for (let k = 0; k < 5; k++) px(cc, 302 + Math.round(k * 0.4), 88 + k, 2, 1, '#f4cf3a');
      px(cc, 301, 88, 3, 2, '#f4cf3a'); px(cc, 302, 93, 6, 3, '#f4cf3a'); px(cc, 303, 96, 1, 1, '#d9b02a'); px(cc, 307, 96, 1, 1, '#d9b02a'); px(cc, 304, 94, 1, 1, '#a8642a');
      px(cc, 310, 92, 5, 1, '#fff6e0'); px(cc, 313, 91, 1, 3, '#fff6e0'); px(cc, 314, 92, 1, 1, '#fff6e0');
    });
  };
})();

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  zoo: (c, x, y) => { drawGiraffe(c, x - 8, y, 1, 0); drawPenguin(c, x + 12, y, -1, 0, false); },
  zookeeper: (c, x, y) => drawPerson(c, x, y, { look: 'zookeeper', dir: 'down', mood: 'happy', noShadow: true }),
  elephant: (c, x, y) => drawElephant(c, x - 3, y, 1, 0, false),
  giraffe: (c, x, y) => drawGiraffe(c, x - 4, y, 1, 0),
  lion: (c, x, y) => drawLion(c, x - 3, y, 1, 0, false),
  monkey: (c, x, y) => drawMonkey(c, x, y - 22, 0),
  penguin: (c, x, y) => drawPenguin(c, x, y, 1, 0, false),
  longnose: (c, x, y) => drawElephant(c, x - 4, y, 1, 0, true),
  tall: (c, x, y) => { drawGiraffe(c, x - 6, y, 1, 0); drawArrow(c, x + 16, y - 30, 'up', 0); },
  roar: (c, x, y) => drawLion(c, x - 3, y, 1, 0, true),
  banana: (c, x, y) => { for (let i = 0; i < 12; i++) px(c, x - 6 + i, y - 4 - Math.round(Math.sin(i / 3.8) * 6), 3, 3, i % 4 ? '#f4cf3a' : '#e8b83a'); px(c, x - 7, y - 4, 2, 2, '#5a3a22'); },
  grass: (c, x, y) => { for (let i = 0; i < 7; i++) px(c, x - 9 + i * 3, y - 8 - (i % 3) * 2, 2, 8 + (i % 3) * 2, i % 2 ? '#58a84a' : '#7cc85a'); },
  bamboo: (c, x, y) => { for (const dx of [-4, 3]) { px(c, x + dx, y - 22, 3, 22, '#7cc85a'); for (let k = 0; k < 22; k += 6) px(c, x + dx, y - 22 + k, 3, 1, '#3d7f33'); } oval(c, x + 8, y - 18, 4, 1, '#58a84a'); },
  feed: (c, x, y) => { drawMonkey(c, x - 4, y - 22, 0); drawFoodBit(c, x + 9, y - 6, 'banana'); },
  q_animal: (c, x, y) => { drawPenguin(c, x - 5, y, 1, 0, false); px(c, x + 6, y - 16, 6, 2, '#4f86e0'); px(c, x + 10, y - 15, 2, 5, '#4f86e0'); px(c, x + 7, y - 11, 4, 2, '#4f86e0'); px(c, x + 7, y - 7, 3, 2, '#4f86e0'); },
});
