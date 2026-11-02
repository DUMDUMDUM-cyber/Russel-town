// Tempat: Pertanian, Rumah, Desa (file ini) + Sekolah, Kantor Ayah, Pegunungan (scenes2.js).
// Objek: { x, y, hit, go, draw(c,t), update(dt), tap(), arrive(), flat, top, hidden }

function rand(a, b) { return a + Math.random() * (b - a); }
function colorFlowerWord(ci) {
  const k = FLOWER_COLORS[ci][0], w = WORDS[k];
  const c = colorJa(k);
  return langCard(w[0] + '的花', w[1] + ' de huā', 'bunga ' + w[2], WORDS_EN[k] + ' flower', [c[0] + 'はな', c[1] + 'hana']);
}
const greetNow = () => (G.night ? 'goodevening' : 'goodmorning');

// Hewan menerima barang: makanan dimakan, yang lain ditolak
function animalReceive(sound) {
  return function (type) {
    if (ITEMS[type].food) { say([{ k: type }, { k: sound }]); fx('heart', this.x, this.y - 18, 3); sfx('eat'); }
    else say([{ k: 'cannoteat' }]);
  };
}

// Barang di tanah yang bisa diambil ke tas. respawn = detik sampai muncul lagi (0 = hilang)
function pickup(type, x, y, o = {}) {
  return {
    x, y, type, flat: true, gone: 0,
    get hidden() { return this.gone > 0; },
    get hit() { return [this.x - 8, this.y - 12, 16, 14]; }, get go() { return [this.x, this.y + 3]; },
    draw(c) { drawItem(c, this.x, this.y, this.type); },
    update(dt) { if (this.gone > 0) this.gone -= dt; },
    tap() { say([{ k: this.type }]); },
    arrive() {
      if (!bagAdd(this.type, this.x, this.y)) return;
      if (o.respawn) this.gone = o.respawn; else removeObj(this);
    },
  };
}

// Orang: bisa diam atau berjalan mengikuti path; diketuk → percakapan berikutnya.
// lines: [[{k, zh?, by:'me'|'np'}...], ...] atau fungsi yang mengembalikannya
function npc(look, x, y, dir, extra) {
  const base = {
    x, y, look, dir, mood: 'happy', act: null, actT: 0, actDur: 0, frame: 0, ft: 0, li: 0, talkT: 0, wait: 0, pi: 0, sp: 16, bob: 0,
    get hit() { const L = LOOKS[this.look], h = L.kid ? 25 : L.teen ? 28 : 31; return [this.x - 9, this.y - h, 18, h]; },
    get go() { return this._go || [this.x + (G.boy.x < this.x ? -15 : 15), this.y + 2]; },
    set go(v) { this._go = v; },
    draw(c) { drawPerson(c, this.x, this.y, { look: this.look, dir: this.dir, mood: this.mood, act: this.act, actT: this.actT, frame: this.frame, bob: this.bob }); },
    update(dt) {
      if (this.act) { this.actT += dt; if (this.actT > this.actDur) this.act = null; }
      if (this.talkT > 0) { this.talkT -= dt; this.frame = 0; return; }
      if (!this.path) return;
      if (this.wait > 0) { this.wait -= dt; this.frame = 0; return; }
      const [tx, ty] = this.path[this.pi], dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
      if (d < 1) { this.pi = (this.pi + 1) % this.path.length; this.wait = rand(0.6, 2.4); return; }
      const st = Math.min(d, this.sp * dt);
      this.x += dx / d * st; this.y += dy / d * st;
      this.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      this.ft += dt; this.frame = [1, 0, 2, 0][Math.floor(this.ft * 7) % 4];
    },
    tap() { talk(this); },
    receive(type) {
      this.talkT = 5; this.dir = G.boy.x < this.x ? 'left' : 'right';
      // kopi hanya untuk orang dewasa: anak-anak menolak dan kopinya kembali ke tas
      if (type === 'coffee' && (LOOKS[this.look].kid || LOOKS[this.look].teen)) { doAct(this, 'wave', 1.4); bagAdd('coffee', this.x, this.y - 20, true); say([{ k: 'coffeeadult', by: this }]); return; }
      doAct(this, type === 'coffee' ? 'eat' : 'wave', 1.4); fx('heart', this.x, this.y - 34, 3);
      const list = [{ k: type === 'coffee' ? 'pleasedrink' : 'giveyou', by: 'me' }, { k: 'thanks', by: 'np' }];
      if (type === 'wildflower' || type === 'shell' || type === 'starfish') list.push({ k: 'pretty', by: 'np' });
      list.push({ k: 'welcome', by: 'me' });
      say(list.map(it => Object.assign({}, it, { by: it.by === 'me' ? G.boy : this })));
    },
  };
  // salin getter apa adanya (Object.assign akan menjalankannya terlalu dini)
  Object.defineProperties(base, Object.getOwnPropertyDescriptors(extra || {}));
  return base;
}
function talk(p, after) {
  p.talkT = 6;
  p.dir = Math.abs(G.boy.x - p.x) < 6 ? 'down' : (G.boy.x < p.x ? 'left' : 'right');
  doAct(p, 'wave', 1.4);
  const L = typeof p.lines === 'function' ? p.lines() : p.lines;
  const d = L[p.li % L.length]; p.li++;
  say(d.map(it => Object.assign({}, it, { by: it.by === 'me' ? G.boy : it.by === 'np' ? p : null })), after);
}

const SCENES = {};

// ================= PERTANIAN =================
SCENES.farm = (() => {
  const S = {
    id: 'farm', place: 'farm', outdoor: true, walk: [6, 30, 314, 176], spawn: [84, 100],
    // rumah, batang pohon, pagar kandang (atas, kiri, kanan, bawah kiri, bawah kanan) + pintu (dihapus saat terbuka)
    blocks: [[12, 0, 92, 72], [144, 50, 12, 12], [190, 0, 126, 26], [190, 0, 10, 100], [304, 0, 14, 100], [190, 88, 48, 10], [260, 88, 58, 10]], objs: [],
    lights: [[31, 49, 24], [85, 49, 24], [75, 84, 26]],
  };
  S.bg = c => {
    drawGrass(c, 0, 0, W, H, 11, true);
    drawPath(c, 50, 70, 16, 46, 3); drawPath(c, 0, 114, W, 16, 4);
    px(c, 198, 22, 108, 72, '#7fbf5a');
    const r = rng(5);
    for (let i = 0; i < 40; i++) px(c, 200 + Math.floor(r() * 104), 26 + Math.floor(r() * 64), 2, 1, '#d9b06a');
    oval(c, 290, 34, 10, 6, '#e3c46a'); oval(c, 290, 32, 8, 4, '#f0d684'); px(c, 284, 30, 6, 1, '#c9a24a');
    px(c, 252, 30, 22, 7, PAL.woodD); px(c, 253, 31, 20, 4, PAL.water); px(c, 254, 31, 6, 1, PAL.waterL);
    drawFenceH(c, 196, 24, 112); drawFenceV(c, 196, 24, 70); drawFenceV(c, 308, 24, 70);
    drawHouse(c, 16, 6, 84, 66, { roof: '#d4553f', roofD: '#a23a2c', roofL: '#e8735a', door: 35, windows: [8, 62], chimney: true, night: G.night });
    px(c, 98, 142, 86, 35, '#8a6440'); px(c, 98, 142, 86, 2, '#6b4a2e');
    for (let i = 98; i < 184; i += 6) { px(c, i, 140, 5, 3, PAL.stone); px(c, i, 140, 5, 1, '#c9c6c0'); }
    px(c, 8, 134, 68, 43, '#9a7048');
    for (let i = 8; i < 76; i += 6) px(c, i, 132, 5, 3, PAL.stone);
    // papan arah ke gunung
    px(c, 22, 98, 2, 14, PAL.woodD); px(c, 12, 92, 22, 8, PAL.wood); px(c, 12, 99, 22, 1, PAL.woodD);
    for (let k = 0; k < 4; k++) px(c, 16 + k, 97 - k, 7 - k * 2 + 1, 1, '#8a8fb0');
  };

  // pagar depan kandang; pintunya membawa Russel ke Rumah Hewan (tempat sendiri)
  S.blocks.push([236, 88, 26, 10]);
  const gate = { x: 249, y: 96, open: false, draw(c) { drawFenceH(c, 196, 96, 38); drawFenceH(c, 262, 96, 46); drawGate(c, 237, 96, this.open); } };
  S.objs.push(gate);
  S.enter = () => { gate.open = false; };

  // sapi & domba digambar 1,5× lebih besar
  const cow = { x: 236, y: 68, dir: -1, hit: [214, 36, 44, 33], go: [236, 104],
    draw(c, t) { drawCowBig(c, this.x, this.y, this.dir, t); },
    tap() { say([{ k: 'cow' }, { k: 'moo', zh: '哞——' }]); fx('heart', this.x, this.y - 32, 2); } };
  const sheep = { x: 278, y: 58, dir: -1, t0: 0, get hit() { return [this.x - 15, this.y - 24, 30, 24]; }, go: [278, 104],
    draw(c, t) { drawSheepBig(c, this.x, this.y, this.dir, t); },
    update(dt) { this.t0 += dt; this.x = 278 + Math.round(Math.sin(this.t0 * 0.3) * 8); this.dir = Math.cos(this.t0 * 0.3) > 0 ? 1 : -1; },
    tap() { say([{ k: 'sheep' }, { k: 'baa', zh: '咩——' }]); fx('heart', this.x, this.y - 26, 2); } };
  cow.receive = animalReceive('moo'); sheep.receive = animalReceive('baa');
  S.objs.push(cow, sheep);

  for (let i = 0; i < 3; i++) {
    S.objs.push({
      x: 218 + i * 28, y: 70 + i * 6, dir: 1, f: 0, peck: false, tx: 230, ty: 76, wait: i, ft: 0,
      get hit() { return [this.x - 6, this.y - 13, 12, 13]; }, get go() { return [this.x, 104]; },
      draw(c) { drawChicken(c, this.x, this.y, this.dir, this.f, this.peck); },
      update(dt) {
        if (this.wait > 0) { this.wait -= dt; this.f = 0; return; }
        const dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy);
        if (d < 1) { this.tx = rand(206, 300); this.ty = rand(56, 90); this.wait = rand(0.8, 3); this.peck = Math.random() < 0.5; return; }
        this.peck = false; this.dir = dx > 0 ? 1 : -1;
        this.x += dx / d * 14 * dt; this.y += dy / d * 14 * dt;
        this.ft += dt; this.f = Math.floor(this.ft * 8) % 2 ? 1 : 0;
      },
      tap() { say([{ k: 'chicken' }, { k: 'cluck' }]); this.wait = 1.5; this.peck = false; fx('note', this.x, this.y - 14, 1); },
      receive: animalReceive('cluck'),
    });
  }

  S.objs.push({
    x: 214, y: 90, eggs: 2, timer: 0, hit: [202, 76, 26, 16], go: [214, 104],
    draw(c) {
      oval(c, this.x, this.y - 3, 9, 4, '#c9a24a'); oval(c, this.x, this.y - 4, 7, 2, '#e3c46a');
      for (let i = 0; i < this.eggs; i++) drawFood(c, this.x - 4 + i * 4, this.y - 3, 'eggraw');
    },
    update(dt) { this.timer += dt; if (this.timer > 6 && this.eggs < 3) { this.eggs++; this.timer = 0; } },
    tap() { say([{ k: this.eggs ? 'egg' : 'chicken' }]); },
    arrive() {
      if (!this.eggs) { say([{ k: 'chicken' }, { k: 'cluck' }]); return; }
      if (!bagAdd('egg', this.x, this.y - 6, true)) return;
      this.eggs--; this.timer = 0;
      G.eggCount = G.eggCount % 10 + 1;
      sayCount(G.eggCount, 'egg', '个', 'gè');
      sfx('egg');
    },
  });

  const tree = {
    x: 150, y: 62, apples: [[-8, -6], [6, -9], [10, 3], [-4, 5], [1, -2]], has: [1, 1, 1, 1, 1], shake: 0, regrow: 0,
    hit: [130, 14, 40, 50], go: [150, 78],
    draw(c, t) {
      const s = this.shake > 0 ? Math.round(Math.sin(t * 50)) : 0;
      drawTree(c, this.x, this.y, { r: 18, shake: s, apples: this.apples.filter((a, i) => this.has[i]) });
    },
    update(dt) {
      if (this.shake > 0) this.shake -= dt;
      this.regrow += dt;
      if (this.regrow > 10) { this.regrow = 0; const i = this.has.indexOf(0); if (i >= 0) this.has[i] = 1; }
    },
    tap() { say([{ k: 'appletree' }]); },
    arrive() {
      this.shake = 0.6; sfx('shake');
      const i = this.has.indexOf(1);
      if (i < 0) return;
      this.has[i] = 0; this.regrow = 0;
      const a = this.apples[i];
      S.objs.push(fallingApple(this.x + a[0], 36 + a[1], this.x + Math.round(rand(-18, 18)), Math.round(rand(80, 90))));
    },
  };
  S.objs.push(tree);
  function fallingApple(x, y0, tx, ty) {
    return {
      x, y: ty, fy: y0, tx, flat: true,
      get hit() { return [this.x - 6, this.y - 8, 12, 10]; }, get go() { return [this.x, this.y + 4]; },
      draw(c) { drawApple(c, Math.round(this.x), Math.round(this.fy)); },
      update(dt) {
        if (this.fy < this.y - 3) { this.fy += 110 * dt; this.x += (this.tx - this.x) * dt * 3; if (this.fy >= this.y - 3) { this.fy = this.y - 3; sfx('bounce'); } }
      },
      tap() { say([{ k: 'apple' }]); },
      arrive() {
        if (!bagAdd('apple', this.x, this.y - 6, true)) return;
        removeObj(this);
        G.appleCount = G.appleCount % 10 + 1;
        sayCount(G.appleCount, 'apple', '个', 'gè');
        sfx('harvest');
      },
    };
  }

  S.objs.push({ x: 72, y: 98, draw(c, t) {
    px(c, 71, 76, 2, 22, '#5a3a22'); px(c, 71, 76, 8, 2, '#5a3a22');
    const sw = Math.sin(t * 1.5) > 0.7 ? 1 : 0;
    px(c, 75 + sw, 78, 1, 2, '#5a3a22'); oval(c, 75 + sw, 84, 3, 4, '#e2483d'); px(c, 73 + sw, 80, 5, 1, '#f4cf3a'); px(c, 73 + sw, 88, 5, 1, '#f4cf3a');
    px(c, 75 + sw, 89, 1, 3, '#f4cf3a'); px(c, 74 + sw, 82, 1, 3, '#ff8a7a');
  } });

  S.objs.push({
    x: 112, y: 82, awake: 0, zt: 0, hit: [100, 70, 24, 14], go: [112, 92],
    draw(c, t) { drawCat(c, this.x, this.y, t); },
    update(dt) { if (this.awake > 0) this.awake -= dt; else { this.zt += dt; if (this.zt > 1.6) { this.zt = 0; fx('z', this.x + 7, this.y - 10, 1); } } },
    tap() { this.awake = 3; say([{ k: 'cat' }, { k: 'meow' }]); fx('heart', this.x + 6, this.y - 12, 2); },
    receive: animalReceive('meow'),
  });

  const CROPS = ['carrot', 'tomato', 'watermelon', 'corn', 'carrot', 'watermelon'];
  CROPS.forEach((type, i) => {
    const x = 12 + (i % 3) * 22, y = 138 + Math.floor(i / 3) * 20;
    S.objs.push({
      flat: true, x: x + 9, y: y + 14, type, stage: i === 1 ? 4 : 0, wet: false, grow: 0,
      hit: [x - 1, y - 8, 20, 23], go: [x + 9, y + 16],
      draw(c, t) { drawPlot(c, x, y, 18, 14, this.wet); drawCrop(c, x + 9, y + 12, this.type, this.stage, t); },
      update(dt) {
        if (!this.wet) return;
        this.grow += dt;
        if (this.grow > 1.8) {
          this.wet = false;
          if (this.stage === 1) { this.stage = 2; say([{ k: 'sprout' }]); }
          else if (this.stage === 2) { this.stage = 4; say([{ k: this.type }]); }
          sfx('grow'); fx('spark', x + 9, y + 2, 4);
        }
      },
      tap() { sfx('tap'); },
      arrive() {
        if (this.stage === 0) { this.stage = 1; say([{ k: 'seed' }]); sfx('plant'); doAct(G.boy, 'wash', 0.7); fx('dust', x + 9, y + 8, 3); }
        else if (this.stage === 1 || this.stage === 2) {
          if (this.wet) { say([{ k: this.stage === 1 ? 'seed' : 'sprout' }]); return; }
          this.wet = true; this.grow = 0; say([{ k: 'watering' }]); sfx('water'); doAct(G.boy, 'wash', 1.2); fx('drop', x + 9, y + 2, 8);
        } else if (this.stage === 4) {
          sfx('harvest'); this.stage = 0;
          if (!bagAdd(this.type, x + 9, y + 4)) fx('item', x + 9, y + 4, 1, this.type);
        }
      },
    });
  });

  FLOWER_COLORS.forEach((col, i) => {
    const x = 106 + i * 11, y = 158 + (i % 2) * 12;
    S.objs.push({
      x, y, hit: [x - 6, y - 16, 12, 17], go: [x, y + 5],
      draw(c, t) { drawFlower(c, this.x, this.y, col, t); },
      tap() { const p = colorFlowerWord(i); say([{ card: p, zh: p.zh }]); },
      arrive() { openPanel('flower', i); },
    });
  });

  S.objs.push({
    x: 140, y: 140, t0: 0, flee: 0, top: true, col: '#f39ac0',
    get hidden() { return G.night || G.weather === 'rain' || G.weather === 'snow'; },
    get hit() { return [this.x - 7, this.y - 7, 14, 14]; },
    draw(c, t) { drawButterfly(c, Math.round(this.x), Math.round(this.y), t, this.col); },
    update(dt) {
      this.t0 += dt * (this.flee > 0 ? 3 : 1); if (this.flee > 0) this.flee -= dt;
      this.x = 140 + Math.sin(this.t0 * 0.7) * 36 + Math.sin(this.t0 * 2.1) * 6;
      this.y = 140 + Math.sin(this.t0 * 1.1) * 12 + Math.cos(this.t0 * 2.7) * 4;
    },
    tap() { this.flee = 1.5; say([{ k: 'butterfly' }]); fx('spark', this.x, this.y, 3); },
  });

  // tetangga lewat di jalan halaman, menanyakan Dòudou
  S.objs.push(npc('uncle', 130, 122, 'right', { path: [[130, 122], [276, 122]], sp: 13,
    lines: [[{ k: 'uncle', zh: '叔叔好！', by: 'me' }, { k: 'q_dog', by: 'np' }, { k: 'a_dog', by: 'me' }]] }));

  S.exits = [
    { hit: [44, 46, 28, 30], arrow: [58, 84, 'up'], go: [58, 76], to: 'home', at: [160, 164] },
    { hit: [292, 100, 28, 40], arrow: [308, 122, 'right'], go: [314, 122], to: 'village', at: [16, 126] },
    { hit: [0, 104, 26, 36], arrow: [12, 122, 'left'], go: [6, 122], to: 'mountain', at: [300, 140] },
    { hit: [232, 76, 34, 26], arrow: [249, 107, 'up'], go: [249, 104], to: 'barn', at: [160, 164],
      leave() { gate.open = true; say([{ k: 'opengate' }, { k: 'barn' }]); } },
  ];
  return S;
})();

// ================= RUMAH =================
SCENES.home = (() => {
  const S = {
    id: 'home', place: 'home', outdoor: false, walk: [8, 58, 312, 174], spawn: [160, 160],
    blocks: [[8, 44, 58, 62], [34, 40, 84, 16], [210, 40, 38, 18], [260, 40, 44, 18], [102, 82, 132, 40], [24, 128, 34, 26]],
    objs: [], lights: [[160, 70, 110], [160, 20, 40]],
  };
  S.bg = c => {
    px(c, 0, 0, W, 48, '#f1e2c4');
    for (let i = 4; i < W; i += 8) px(c, i, 0, 2, 38, '#e9d6b2');
    px(c, 0, 38, W, 10, '#c08a52'); px(c, 0, 37, W, 2, '#a8743c'); px(c, 0, 47, W, 1, '#8a5a35');
    px(c, 0, 48, W, 132, '#c99a63');
    for (let r = 0, y = 48; y < H; y += 8, r++) {
      px(c, 0, y + 7, W, 1, '#b0844f');
      for (let x = (r % 2) * 24; x < W; x += 48) px(c, x, y, 1, 7, '#b0844f');
    }
    px(c, 252, 48, 64, 40, '#dbe9f0');
    for (let x = 252; x < 316; x += 8) px(c, x, 48, 1, 40, '#bcd2de');
    for (let y = 48; y < 88; y += 8) px(c, 252, y, 64, 1, '#bcd2de');
    px(c, 0, 0, 4, H, '#8a5a35'); px(c, 316, 0, 4, H, '#8a5a35');
    px(c, 0, 176, 144, 4, '#8a5a35'); px(c, 176, 176, 144, 4, '#8a5a35');
    px(c, 146, 168, 28, 10, '#c9473a'); px(c, 148, 170, 24, 6, '#e2685a');
    oval(c, 160, 140, 46, 16, '#c9473a'); oval(c, 160, 140, 42, 13, '#e8735a'); oval(c, 160, 140, 30, 8, '#f4cf3a'); oval(c, 160, 140, 26, 6, '#e8735a');
    px(c, 36, 8, 76, 3, PAL.woodD);
    [[42, '#e2483d'], [52, '#f4cf3a'], [62, '#58a84a'], [90, '#4f86e0'], [100, '#e2483d']].forEach(([x, k]) => { px(c, x, 2, 6, 6, k); px(c, x + 1, 1, 4, 1, '#fffaf0'); });
    px(c, 36, 26, 80, 4, '#e8e2d6'); px(c, 36, 30, 80, 24, '#a8743c'); px(c, 36, 30, 80, 1, '#8a5a35');
    for (let x = 40; x < 112; x += 19) { px(c, x, 34, 15, 16, '#b8844f'); px(c, x + 11, 41, 2, 2, '#f4cf3a'); }
    px(c, 52, 22, 22, 5, '#3a3a3a'); oval(c, 63, 21, 8, 3, '#5a5a62'); px(c, 55, 17, 16, 4, '#6a6a72');
    px(c, 212, 4, 34, 54, PAL.woodD); px(c, 214, 6, 30, 50, PAL.wood);
    px(c, 228, 6, 2, 50, PAL.woodD); px(c, 224, 28, 2, 4, '#f4cf3a'); px(c, 232, 28, 2, 4, '#f4cf3a');
    px(c, 210, 2, 38, 3, PAL.woodL);
    px(c, 268, 4, 32, 30, '#c9c6c0'); px(c, 270, 6, 28, 26, '#cfe8f5'); px(c, 274, 8, 2, 8, '#ffffff'); px(c, 277, 8, 1, 5, '#ffffff');
    px(c, 264, 40, 40, 6, '#fbf8f0'); px(c, 270, 42, 28, 3, '#cfe0ea'); px(c, 264, 46, 40, 10, '#e8e2d6'); px(c, 282, 36, 3, 5, '#a9a6a0');
    px(c, 24, 124, 34, 10, '#4f8a5a'); px(c, 22, 130, 6, 22, '#3e6e48'); px(c, 54, 130, 6, 22, '#3e6e48'); px(c, 26, 134, 30, 16, '#5ea06a');
  };

  S.objs.push({
    flat: true, y: 0, starI: 0, hit: [134, 4, 52, 32], go: [160, 64],
    draw(c, t) {
      const x = 136, y = 6;
      px(c, x - 2, y - 2, 52, 32, PAL.woodD);
      const sky = G.night ? '#26305e' : G.weather === 'rain' ? '#8a9aaa' : G.weather === 'cloud' ? '#a9c4d8' : G.weather === 'snow' ? '#c9d6e2' : '#8fd0f2';
      px(c, x, y, 48, 28, sky);
      if (G.night) { disc(c, x + 34, y + 9, 5, '#fff2c0'); disc(c, x + 36, y + 8, 4, sky); [[6, 5], [14, 15], [22, 6], [9, 22], [28, 20], [42, 22]].forEach(([a, b], i) => px(c, x + a, y + b, 1, 1, (Math.floor(t * 2 + i) % 3) ? '#ffffff' : '#fff2a8')); }
      else if (G.weather === 'sun' || G.weather === 'wind') { disc(c, x + 12, y + 9, 5, '#ffd84a'); disc(c, x + 12, y + 9, 3, '#fff2a8'); }
      if (!G.night && G.weather !== 'sun') { oval(c, x + 30 + Math.round(Math.sin(t * 0.3) * 4), y + 9, 9, 3, '#f4f7fa'); oval(c, x + 14, y + 16, 7, 2, '#eef2f6'); }
      if (G.weather === 'rain') for (let i = 0; i < 8; i++) px(c, x + ((i * 7 + Math.floor(t * 40)) % 46), y + ((i * 11 + Math.floor(t * 60)) % 26), 1, 2, '#d8eefa');
      if (G.weather === 'snow') for (let i = 0; i < 8; i++) px(c, x + ((i * 9 + Math.floor(t * 8)) % 46), y + ((i * 13 + Math.floor(t * 14)) % 26), 1, 1, '#ffffff');
      if (G.weather === 'wind') for (let i = 0; i < 3; i++) px(c, x + ((i * 17 + Math.floor(t * 50)) % 46), y + 6 + i * 7, 2, 1, PAL.leaf);
      px(c, x + 23, y, 2, 28, PAL.woodD); px(c, x, y + 13, 48, 2, PAL.woodD);
      px(c, x - 4, y + 28, 56, 3, PAL.wood);
    },
    tap() {
      if (G.night) { this.starI++; say([{ k: this.starI % 2 ? 'moon' : 'star' }]); }
      else say([{ k: { sun: 'sun', cloud: 'cloudy', rain: 'rain', wind: 'windy', snow: 'snow' }[G.weather] }]);
    },
  });

  // Tidur: urutan diatur oleh waktu (bukan oleh suara), jadi Russel selalu bangun lagi
  const bed = {
    flat: true, x: 37, y: 104, hit: [10, 48, 56, 58], go: [38, 112],
    draw(c) {
      px(c, 10, 48, 54, 10, PAL.woodD); px(c, 12, 50, 50, 6, PAL.wood);
      px(c, 12, 58, 50, 44, '#fbf8f0'); px(c, 18, 60, 38, 10, '#ffffff'); px(c, 18, 69, 38, 1, '#e3ddd0');
      if (G.boy.inBed) drawSleepyHead(c, 37, 59);
      for (let yy = 70; yy < 100; yy += 8) for (let xx = 12; xx < 62; xx += 10) px(c, xx, yy, 10, 8, ((xx + yy) / 2) % 2 ? '#4f86e0' : '#7aa4ea');
      px(c, 12, 70, 50, 1, '#2f5bab'); px(c, 10, 100, 54, 6, PAL.woodD);
    },
    tap() { sfx('tap'); },
    arrive() {
      if (G.boy.inBed) return;
      G.boy.inBed = true; G.boy.hidden = true; G.sleepT = 0; G.sleepStep = 0;
      sfx('yawn');
      say([{ k: 'sleepy' }, { k: 'sleep' }, { k: 'goodnight', by: mom }]);
    },
  };
  S.objs.push(bed);
  S.update = dt => {
    if (!G.boy.inBed) return;
    G.sleepT += dt;
    if (G.sleepStep === 0 && G.sleepT > 3) { G.sleepStep = 1; fadeTo(() => setNight(true, true)); }
    if (G.sleepStep === 1 && G.sleepT > 4) { if (Math.random() < dt * 2) fx('z', 44, 56, 1); }
    if (G.sleepStep === 1 && G.sleepT > 7) {
      G.sleepStep = 2;
      fadeTo(() => {
        setNight(false, true);
        Object.assign(G.boy, { inBed: false, hidden: false, x: 38, y: 116, dir: 'down', moving: false });
      }, () => {
        sfx('chime'); doAct(G.boy, 'wave', 1.4);
        say([{ k: 'wakeup' }, { k: 'goodmorning', by: G.boy }, { k: 'goodmorning', zh: '早上好，' + CHILD + '！', by: mom }]);
      });
    }
  };

  S.objs.push({ flat: true, y: 0, st: 0, draw() {}, update(dt) { this.st += dt; if (this.st > 0.5) { this.st = 0; fx('steam', 63, 16, 1); } } });

  S.objs.push({ flat: true, y: 0, hit: [258, 30, 12, 16], go: [266, 64], draw(c) { px(c, 262, 36, 6, 6, '#4f86e0'); px(c, 263, 31, 1, 6, '#f4cf3a'); px(c, 265, 30, 1, 7, '#e2483d'); px(c, 263, 30, 1, 2, '#ffffff'); },
    tap() { sfx('tap'); }, arrive() { G.boy.dir = 'down'; doAct(G.boy, 'brush', 2.4); say([{ k: 'brush' }]); sfx('bubbles'); fx('bubble', G.boy.x + 2, G.boy.y - 18, 6); } });
  S.objs.push({ flat: true, y: 0, hit: [276, 34, 24, 14], go: [286, 64], draw() {},
    tap() { sfx('tap'); }, arrive() { G.boy.dir = 'down'; doAct(G.boy, 'wash', 2.2); say([{ k: 'wash' }]); sfx('water'); fx('bubble', G.boy.x, G.boy.y - 8, 8); } });
  S.objs.push({ flat: true, y: 0, hit: [266, 2, 36, 32], go: [284, 64], draw() {}, tap() { sfx('tap'); }, arrive() { openPanel('mirror', 'body'); } });
  S.objs.push({ flat: true, y: 0, hit: [210, 2, 38, 56], go: [229, 66], draw() {}, tap() { say([{ k: 'shirt' }]); }, arrive() { openPanel('mirror', 'clothes'); } });

  // meja makan besar; makanan digambar 2× dengan garis tepi supaya jelas
  S.objs.push({ flat: true, y: 0, draw(c) {
    px(c, 132, 74, 16, 10, '#6b4226'); px(c, 133, 75, 14, 9, PAL.woodD); px(c, 188, 74, 16, 10, '#6b4226'); px(c, 189, 75, 14, 9, PAL.woodD);
    px(c, 103, 83, 130, 37, '#6b4226');
    px(c, 104, 84, 128, 30, '#b97d45'); px(c, 104, 84, 128, 2, '#cf9358');
    for (let x = 104; x < 232; x += 32) px(c, x, 86, 1, 28, '#a86f3c');
    px(c, 104, 114, 128, 5, '#a8743c');
    px(c, 107, 119, 4, 7, '#6b4226'); px(c, 225, 119, 4, 7, '#6b4226');
  } });
  [['rice', 126, 100], ['noodles', 154, 100], ['dumpling', 182, 100], ['bun', 210, 100], ['egg', 140, 113], ['milk', 168, 113], ['fish', 196, 113]].forEach(([f, x, y]) => {
    S.objs.push({
      x, y, flat: true, gone: 0, get hit() { return this.gone > 0 ? [0, 0, 0, 0] : [x - 13, y - 22, 26, 24]; }, go: [x, 134],
      draw(c) { if (this.gone <= 0) drawOutlined(c, x, y, 2, (cc, ax, ay) => drawFood(cc, ax, ay, f)); },
      update(dt) { if (this.gone > 0) this.gone -= dt; },
      tap() { say([{ k: f }]); },
      // sampai di meja: pilih makan di tempat atau masukkan ke tas
      arrive() {
        if (this.gone > 0) return;
        G.boy.dir = 'down';
        offerChoice(x, y - 26, [
          { act: 'eat', fn: () => {
            if (this.gone > 0) return;
            doAct(G.boy, 'eat', 1.4); sfx('eat'); this.gone = 9;
            G.eatCount++;
            const items = [{ k: f }, { k: 'yummy', by: G.boy }];
            if (G.eatCount % 2 === 1) items.push({ k: 'thanks', zh: '谢谢妈妈！', by: G.boy }, { k: 'welcome', by: mom });
            say(items); fx('heart', x, y - 24, 2);
          } },
          { act: 'take', fn: () => { if (this.gone <= 0 && bagAdd(f, x, y - 8)) this.gone = 9; } },
        ]);
      },
    });
  });
  S.objs.push({ y: 128, draw(c) { for (const x of [133, 189]) { px(c, x, 121, 14, 8, PAL.wood); px(c, x, 127, 14, 2, PAL.woodD); } } });

  // Keluarga: menyapa lalu bertanya
  const greet = (who, k) => [{ k, by: 'me' }, { k: greetNow(), by: 'np' }];
  const mom = npc('mom', 92, 76, 'down', { lines: () => [greet(mom, 'mom'), [{ k: 'q_eat', by: 'np' }, { k: 'a_eat', by: 'me' }], [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]] });
  const dad = npc('dad', 252, 112, 'left', { get hidden() { return !G.night; }, lines: () => [greet(dad, 'dad'), [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]] });
  const grandpa = npc('grandpa', 41, 148, 'down', { lines: () => [greet(grandpa, 'grandpa'), [{ k: 'q_name', by: 'np' }, { k: 'a_name', by: 'me' }], [{ k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }]] });
  const grandma = npc('grandma', 84, 162, 'left', { lines: () => [greet(grandma, 'grandma'), [{ k: 'q_hungry', by: 'np' }, { k: 'a_hungry', by: 'me' }], [{ k: 'q_apple', by: 'np' }, { k: 'a_like', by: 'me' }]] });
  [mom, dad, grandpa, grandma].forEach(p => S.objs.push(p));
  mom.go = [92, 90]; dad.go = [272, 116]; grandpa.go = [66, 158]; grandma.go = [102, 162];
  S.objs.push({ y: 164, draw(c) { disc(c, 72, 160, 3, '#e2483d'); px(c, 71, 159, 3, 1, '#f39ac0'); px(c, 74, 158, 6, 1, '#e2483d'); } });

  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'farm', at: [78, 96] }];
  return S;
})();

// ================= DESA =================
SCENES.village = (() => {
  const S = {
    id: 'village', place: 'village', outdoor: true, walk: [6, 60, 314, 138], spawn: [16, 126],
    blocks: [[98, 108, 5, 10], [238, 108, 5, 10]], objs: [],
    lights: [[100, 100, 26], [240, 100, 26], [40, 33, 16], [243, 33, 16]],
    carT: 1, trainT: 6, planeT: 12,
  };
  S.bg = c => {
    drawGrass(c, 0, 0, W, H, 21, true);
    drawHouse(c, 30, 4, 50, 36, { roof: '#4f86e0', roofD: '#2f5bab', roofL: '#7aa4ea', door: 18, windows: [3, 33], night: G.night });
    drawHouse(c, 232, 4, 56, 36, { roof: '#58a84a', roofD: '#3d7f33', roofL: '#7cc85a', door: 22, windows: [4, 39], night: G.night });
    // rel kereta tepat di sebelah jalan
    px(c, 0, 44, W, 14, '#b8a88a');
    for (let x = 0; x < W; x += 6) px(c, x, 45, 3, 12, PAL.woodD);
    px(c, 0, 48, W, 1, '#8a8f98'); px(c, 0, 54, W, 1, '#8a8f98'); px(c, 0, 47, W, 1, '#c9ccd2'); px(c, 0, 53, W, 1, '#c9ccd2');
    px(c, 0, 60, W, 54, '#8b8d94'); px(c, 0, 59, W, 1, '#c9c9cf'); px(c, 0, 114, W, 2, '#c9c9cf');
    for (let x = 0; x < W; x += 20) px(c, x, 86, 10, 2, '#f4f0e0');
    for (let y = 62; y < 112; y += 6) px(c, 146, y, 28, 3, '#f4f0e0');
    drawPath(c, 0, 118, W, 18, 7);
    px(c, 0, 136, W, 6, '#d9bf86'); px(c, 0, 140, W, 2, '#c9a46a');
    px(c, 0, 142, W, 38, PAL.water);
    for (let y = 152; y < H; y += 10) px(c, 0, y, W, 1, PAL.waterD);
    [[30, 160], [70, 172], [260, 166], [300, 152]].forEach(([x, y]) => { oval(c, x, y, 5, 2, '#4a9a3a'); px(c, x - 1, y - 1, 2, 1, '#7cc85a'); });
    [[12, 140], [120, 140], [206, 140], [290, 140]].forEach(([x, y]) => { px(c, x, y - 7, 1, 7, PAL.leafD); px(c, x + 2, y - 9, 1, 9, PAL.leaf); px(c, x + 4, y - 6, 1, 6, PAL.leafD); px(c, x + 2, y - 11, 1, 3, '#8a5a35'); });
    // dermaga kecil ke arah pantai
    px(c, 220, 136, 20, 18, PAL.woodD); for (let y = 137; y < 154; y += 3) px(c, 221, y, 18, 2, PAL.wood);
    px(c, 219, 152, 3, 6, PAL.woodD); px(c, 238, 152, 3, 6, PAL.woodD);
    px(c, 294, 102, 2, 14, PAL.woodD); px(c, 284, 96, 22, 8, PAL.wood); px(c, 284, 103, 22, 1, PAL.woodD);
    px(c, 288, 98, 3, 3, '#e2483d'); px(c, 293, 99, 9, 1, '#5a3a22');
  };

  S.objs.push({ x: 116, y: 40, draw(c) { drawTree(c, 116, 40, { r: 12 }); } });
  S.objs.push({ x: 190, y: 40, draw(c) { drawTree(c, 190, 40, { r: 13 }); } });
  S.objs.push({ y: 138, draw(c) { drawBush(c, 60, 137, '#f39ac0'); drawBush(c, 170, 137, '#ffffff'); } });
  [100, 240].forEach(x => S.objs.push({ y: 117, draw(c) {
    px(c, x - 1, 92, 3, 25, '#4a4a52'); px(c, x - 3, 115, 7, 2, '#4a4a52');
    px(c, x - 3, 88, 7, 6, '#3a3a42'); px(c, x - 2, 89, 5, 4, G.night ? '#ffe28a' : '#e8eef2');
  } }));

  // Orang lewat
  S.objs.push(npc('uncle', 40, 126, 'right', { path: [[40, 126], [280, 126]], sp: 15,
    lines: [[{ k: 'uncle', zh: '叔叔好！', by: 'me' }, { k: 'q_where', by: 'np' }, { k: 'a_where', by: 'me' }], [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }]] }));
  S.objs.push(npc('auntie', 270, 132, 'left', { path: [[270, 132], [60, 132]], sp: 12,
    lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_apple', by: 'np' }, { k: 'a_like', by: 'me' }], [{ k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }]] }));

  for (let i = 0; i < 3; i++) {
    S.objs.push({
      x: 60 + i * 70, y: 154 + (i % 2) * 14, dir: i % 2 ? -1 : 1, sp: 6 + i * 2,
      get hit() { return [this.x - 8, this.y - 13, 16, 14]; }, get go() { return [this.x, 134]; },
      draw(c, t) { drawDuck(c, this.x, this.y, this.dir, t + i, true); },
      update(dt) { this.x += this.dir * this.sp * dt; if (this.x > 300) this.dir = -1; if (this.x < 20) this.dir = 1; },
      tap() { say([{ k: 'duck' }, { k: 'quack' }]); sfx('splash'); fx('splash', this.x, this.y - 2, 4); this.dir *= -1; },
    });
  }
  // perahu naga hijau
  S.objs.push({
    x: 200, y: 175, dir: -1,
    get hit() { return [this.x - 42, this.y - 28, 86, 30]; }, get go() { return [Math.max(20, Math.min(300, this.x)), 134]; },
    draw(c, t) { drawDragonBoat(c, this.x, this.y, this.dir, t); },
    update(dt) { this.x += this.dir * 6 * dt; if (this.x < 60) this.dir = 1; if (this.x > 260) this.dir = -1; },
    tap() { say([{ k: 'dragonboat' }, { k: 'dragon' }]); fx('splash', this.x, this.y - 2, 4); sfx('splash'); },
  });
  S.objs.push({
    flat: true, x: 200, y: 160, i: 0, get hidden() { return !G.night; }, hit: [186, 146, 28, 22], go: [200, 134],
    draw(c, t) { const w = Math.round(Math.sin(t * 2)); oval(c, 200 + w, 156, 5, 2, '#fff2c0'); px(c, 196 - w, 160, 8, 1, '#fff2c0'); px(c, 198 + w, 163, 4, 1, '#fff2c0');
      [[150, 150], [240, 168], [120, 172], [270, 146]].forEach(([a, b], k) => { if ((Math.floor(t * 2) + k) % 3) px(c, a, b, 1, 1, '#ffffff'); }); },
    tap() { this.i++; say([{ k: this.i % 2 ? 'moon' : 'star' }]); },
  });

  const CAR_COLS = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a', '#ffffff', '#f39ac0'];
  function vehicle(type, lane) {
    const dir = lane ? -1 : 1, len = type === 'bus' ? 36 : type === 'car' ? 23 : 12;
    return {
      type, dir, y: lane ? 110 : 84, x: dir > 0 ? -60 : W + 60, sp: { car: 40, bus: 28, bike: 22 }[type], col: CAR_COLS[Math.floor(Math.random() * CAR_COLS.length)], wait: false,
      get hit() { return type === 'bus' ? [this.x - 36, this.y - 36, 72, 37] : type === 'car' ? [this.x - 23, this.y - 26, 46, 27] : [this.x - 14, this.y - 31, 28, 31]; },
      draw(c, t) { drawVehicle(c, this.x, this.y, type, dir, this.wait ? 0 : t, this.col); },
      update(dt) {
        const b = G.boy, front = this.x + dir * len;
        this.wait = b.y > 58 && b.y < 118 && (b.x - front) * dir > -8 && (b.x - front) * dir < 24;
        if (!this.wait) this.x += dir * this.sp * dt;
        if (this.x < -90 || this.x > W + 90) S.objs.splice(S.objs.indexOf(this), 1);
      },
      tap() { say([{ k: type }]); sfx(type === 'bike' ? 'chime' : 'horn'); },
    };
  }
  // kereta uap, kereta cepat, atau kereta barang (bergantian)
  const TRAINS = ['steam', 'bullet', 'freight'], TRAIN_WORD = { steam: 'steamtrain', bullet: 'bullettrain', freight: 'freighttrain' };
  let trainN = Math.floor(Math.random() * 3);
  function train() {
    const type = TRAINS[trainN++ % 3], len = TRAIN_LEN[type], sp = type === 'bullet' ? 90 : 48;
    return {
      x: -10, y: 57,
      get hit() { return [this.x - len, this.y - 48, len + 4, 48]; },
      draw(c, t) { drawTrain(c, this.x, this.y, type, t); },
      update(dt) {
        this.x += sp * dt;
        if (type === 'steam' && Math.random() < dt * 5) fx('smoke', this.x - 14, this.y - 46, 1);
        if (this.x - len > W + 10) S.objs.splice(S.objs.indexOf(this), 1);
      },
      tap() { say([{ k: TRAIN_WORD[type] }, { k: 'train' }]); sfx('chime'); },
    };
  }
  function plane() {
    return {
      x: W + 50, y: 40, top: true,
      get hit() { return [this.x - 42, this.y - 30, 84, 60]; },
      draw(c) { oval(SHADOW_TO || c, Math.round(this.x) + 24, 128, 30, 4, 'rgba(30,45,20,0.15)'); drawBigPlane(c, this.x, this.y, -1); },
      update(dt) { this.x -= 34 * dt; if (this.x < -60) S.objs.splice(S.objs.indexOf(this), 1); },
      tap() { say([{ k: 'plane' }]); sfx('whoosh'); },
    };
  }
  S.update = dt => {
    S.carT -= dt; S.trainT -= dt; S.planeT -= dt;
    if (S.carT <= 0) { S.carT = rand(4, 8); const r = Math.random(); S.objs.push(vehicle(r < 0.5 ? 'car' : r < 0.78 ? 'bus' : 'bike', Math.random() < 0.5 ? 0 : 1)); }
    if (S.trainT <= 0) { S.trainT = rand(18, 28); S.objs.push(train()); }
    if (S.planeT <= 0) { S.planeT = rand(22, 34); S.objs.push(plane()); }
  };

  S.exits = [
    { hit: [0, 108, 26, 34], arrow: [12, 126, 'left'], go: [6, 126], to: 'farm', at: [304, 122] },
    { hit: [294, 108, 26, 34], arrow: [308, 126, 'right'], go: [314, 126], to: 'school', at: [16, 150] },
    { hit: [214, 128, 32, 14], arrow: [230, 133, 'down'], go: [230, 137], to: 'beach', at: [20, 140] },
  ];
  return S;
})();
