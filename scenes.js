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
    drawPaths(c, [[50, 70, 16, 46, 3], [0, 114, W, 16, 4]]);
    // tanah kandang: rumput lebih muda, tanah terinjak dekat pintu dan tempat minum
    px(c, 198, 22, 108, 72, '#84c25f');
    groundPatches(c, 198, 22, 108, 72, 5, '#78b755', 0.55);
    groundPatches(c, 198, 22, 108, 72, 6, '#93cd6e', 0.62);
    oval(c, 249, 88, 20, 6, '#c9ad72'); oval(c, 249, 89, 14, 4, '#d8bd84');
    oval(c, 263, 40, 15, 4, '#c9ad72');
    const r = rng(5);
    for (let i = 0; i < 26; i++) px(c, 276 + Math.floor(r() * 28), 30 + Math.floor(r() * 18), 2, 1, r() < 0.5 ? '#d9b06a' : '#efd98e');
    bgOutlined(c, cc => {
      // jerami bertumpuk
      shadow(cc, 290, 41, 12);
      oval(cc, 290, 36, 12, 5, '#c9a24a'); oval(cc, 290, 34, 10, 5, '#e3c46a'); oval(cc, 289, 31, 7, 3, '#f0d684');
      [[282, 35], [287, 37], [293, 36], [297, 34], [285, 32], [291, 31]].forEach(([a, b]) => px(cc, a, b, 3, 1, '#b8903c'));
      [[284, 33], [290, 34], [295, 32], [288, 30]].forEach(([a, b]) => px(cc, a, b, 2, 1, '#fff0b0'));
      // tempat minum dari kayu
      shadow(cc, 263, 40, 13);
      px(cc, 251, 29, 24, 9, PAL.woodD); px(cc, 252, 30, 22, 5, PAL.water); px(cc, 252, 30, 22, 1, PAL.waterD);
      px(cc, 254, 32, 6, 1, PAL.waterL); px(cc, 265, 33, 4, 1, PAL.waterL);
      px(cc, 252, 35, 22, 2, PAL.wood); px(cc, 252, 35, 22, 1, PAL.woodL); px(cc, 260, 35, 1, 2, PAL.woodD); px(cc, 268, 35, 1, 2, PAL.woodD);
      px(cc, 253, 38, 2, 2, PAL.woodD); px(cc, 271, 38, 2, 2, PAL.woodD);
    });
    bgOutlined(c, cc => {
      drawFenceH(cc, 196, 24, 112); drawFenceV(cc, 196, 24, 70); drawFenceV(cc, 308, 24, 70);
      drawHouse(cc, 16, 6, 84, 66, { roof: '#d4553f', roofD: '#a23a2c', roofL: '#e8735a', door: 35, windows: [8, 62], chimney: true, flowerbox: true, night: G.night });
      drawBush(cc, 11, 74, null); drawBush(cc, 105, 74, '#f39ac0');
      // papan arah ke gunung
      shadow(cc, 23, 112, 6);
      px(cc, 22, 98, 3, 14, PAL.woodD); px(cc, 22, 98, 1, 14, PAL.wood);
      px(cc, 12, 90, 23, 10, PAL.woodD); px(cc, 13, 91, 21, 8, PAL.wood); px(cc, 13, 91, 21, 1, PAL.woodL);
      for (let k = 0; k < 4; k++) px(cc, 20 - k, 94 + k, k * 2 + 1, 1, k < 2 ? '#fbf8f0' : '#8a8fb0');
    });
    // rumput kecil di kaki pagar supaya pagar terasa tumbuh dari tanah
    for (const tx of [199, 208, 224, 268, 281, 297, 304]) { px(c, tx, 98, 1, 2, PAL.grassD); px(c, tx + 2, 98, 1, 2, PAL.grassD); px(c, tx + 1, 99, 1, 1, PAL.grassD); }
    drawBed(c, 98, 142, 86, 35, 6);
    drawBed(c, 8, 134, 68, 43, 8);
  };

  // pagar depan kandang; pintunya membawa Russel ke Rumah Hewan (tempat sendiri)
  S.blocks.push([236, 88, 26, 10]);
  const gate = { x: 249, y: 96, open: false, skin: 'fn:farmGate', draw(c) { drawFenceH(c, 196, 96, 38); drawFenceH(c, 262, 96, 46); drawGate(c, 237, 96, this.open); } };
  S.objs.push(gate);
  S.enter = () => { gate.open = false; };

  // sapi & domba digambar 1,5× lebih besar; jalur domba tidak menabrak sapi
  const cow = { x: 232, y: 68, dir: -1, hit: [210, 32, 46, 37], go: [232, 104],
    draw(c, t) { drawCowBig(c, this.x, this.y, this.dir, t); },
    tap() { say([{ k: 'cow' }, { k: 'moo', zh: '哞——' }]); fx('heart', this.x, this.y - 32, 2); } };
  const sheep = { x: 283, y: 72, dir: -1, t0: 0, get hit() { return [this.x - 18, this.y - 25, 36, 25]; }, go: [283, 104],
    draw(c, t) { drawSheepBig(c, this.x, this.y, this.dir, t); },
    update(dt) { this.t0 += dt; this.x = 283 + Math.round(Math.sin(this.t0 * 0.3) * 6); this.dir = Math.cos(this.t0 * 0.3) > 0 ? 1 : -1; },
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
    x: 214, y: 90, eggs: 2, timer: 0, hit: [202, 76, 26, 16], go: [214, 104], skin: 'fn:nest',
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
    hit: [130, 14, 40, 50], go: [150, 78], skin: 'fn:appleTree',
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

  S.objs.push({ x: 72, y: 98, skin: 'bg', draw(c, t) {
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
      flat: true, x: x + 9, y: y + 14, type, stage: i === 1 ? 4 : 0, wet: false, grow: 0, skin: 'fn:crop',
      // Russel berdiri di atas petak (kakinya di tepi atas), jadi petak yang ditanam tetap terlihat
      hit: [x - 1, y - 8, 20, 23], go: [x + 9, y - 4],
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
        G.boy.dir = 'down';
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
      x, y, hit: [x - 6, y - 16, 12, 17], go: [x, y + 5], ci: i, skin: 'fn:flower',
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
    // dinding bergaris lembut dan papan bawah berpanel
    px(c, 0, 0, W, 48, '#f1e2c4');
    for (let i = 4; i < W; i += 8) px(c, i, 0, 2, 38, '#e9d6b2');
    px(c, 0, 37, W, 11, '#c08a52'); px(c, 0, 37, W, 1, '#d9a56a'); px(c, 0, 38, W, 1, '#a8743c');
    for (let x = 4; x < W; x += 16) { px(c, x, 40, 13, 6, '#b47f48'); px(c, x, 40, 13, 1, '#9c6c3c'); px(c, x, 45, 13, 1, '#cf9a60'); }
    px(c, 0, 47, W, 1, '#8a5a35');
    drawPlanks(c, 0, 48, W, 132, ['#c99a63', '#c5955d', '#cfa26b'], '#b0844f', 14);
    px(c, 252, 48, 64, 40, '#dbe9f0');
    for (let x = 252; x < 316; x += 8) px(c, x, 48, 1, 40, '#bcd2de');
    for (let y = 48; y < 88; y += 8) px(c, 252, y, 64, 1, '#bcd2de');
    px(c, 252, 87, 64, 1, '#a9bfcc');
    wallFoot(c, 48);
    windowLight(c, 138, 56, 46, 26, 8);
    px(c, 0, 0, 4, H, '#8a5a35'); px(c, 316, 0, 4, H, '#8a5a35');
    px(c, 0, 176, 144, 4, '#8a5a35'); px(c, 176, 176, 144, 4, '#8a5a35');
    px(c, 146, 168, 28, 10, '#a8352b'); px(c, 147, 169, 26, 8, '#c9473a'); px(c, 149, 171, 22, 4, '#e2685a');
    // permadani bulat bertepi
    oval(c, 160, 141, 47, 17, 'rgba(50,30,15,0.2)');
    oval(c, 160, 140, 47, 17, '#a8352b'); oval(c, 160, 140, 46, 16, '#c9473a'); oval(c, 160, 140, 42, 13, '#e8735a'); oval(c, 160, 140, 32, 9, '#fff0c0'); oval(c, 160, 140, 30, 8, '#f4cf3a'); oval(c, 160, 140, 26, 6, '#e8735a');
    bgOutlined(c, cc => {
      // rak dinding dan toples
      px(cc, 36, 8, 76, 3, PAL.woodD); px(cc, 36, 8, 76, 1, PAL.woodL);
      [[42, '#e2483d'], [52, '#f4cf3a'], [62, '#58a84a'], [90, '#4f86e0'], [100, '#e2483d']].forEach(([x, k]) => { px(cc, x, 2, 6, 6, k); px(cc, x + 1, 1, 4, 1, '#fffaf0'); px(cc, x + 1, 3, 1, 4, 'rgba(255,255,255,0.45)'); px(cc, x + 4, 3, 2, 5, 'rgba(0,0,0,0.12)'); });
      // lemari dapur
      px(cc, 36, 30, 80, 24, '#a8743c');
      for (let x = 40; x < 112; x += 19) { px(cc, x, 33, 15, 18, '#b8844f'); px(cc, x, 33, 15, 1, '#d39b5f'); px(cc, x + 14, 33, 1, 18, '#94683a'); px(cc, x, 50, 15, 1, '#94683a'); px(cc, x + 11, 41, 2, 2, '#f4cf3a'); }
      px(cc, 34, 25, 84, 5, '#e8e2d6'); px(cc, 34, 25, 84, 1, '#ffffff'); px(cc, 34, 29, 84, 1, '#bdb7aa');
      // kompor dan panci bertutup
      px(cc, 50, 21, 26, 4, '#3a3a3a'); px(cc, 50, 21, 26, 1, '#55555c'); px(cc, 54, 24, 3, 1, '#e2483d'); px(cc, 69, 24, 3, 1, '#e2483d');
      px(cc, 55, 12, 16, 9, '#7d7d86'); px(cc, 55, 12, 3, 9, '#a0a0aa'); px(cc, 67, 12, 4, 9, '#62626a');
      px(cc, 52, 14, 3, 2, '#3a3a3a'); px(cc, 71, 14, 3, 2, '#3a3a3a');
      oval(cc, 63, 11, 9, 2, '#8e8e98'); px(cc, 57, 10, 8, 1, '#b4b4be'); px(cc, 62, 7, 3, 2, '#3a3a3a');
    });
    bgOutlined(c, cc => {
      // lemari pakaian
      shadowRect(cc, 211, 58, 36, 3);
      px(cc, 212, 4, 34, 54, PAL.woodD); px(cc, 214, 6, 14, 50, PAL.wood); px(cc, 230, 6, 14, 50, PAL.wood);
      for (const x of [216, 232]) { px(cc, x, 9, 10, 18, '#c08850'); px(cc, x, 9, 10, 1, PAL.woodL); px(cc, x, 31, 10, 22, '#c08850'); px(cc, x, 31, 10, 1, PAL.woodL); }
      px(cc, 225, 28, 2, 4, '#f4cf3a'); px(cc, 231, 28, 2, 4, '#f4cf3a');
      px(cc, 210, 2, 38, 3, PAL.woodL); px(cc, 210, 4, 38, 1, PAL.woodD);
      // cermin dan wastafel
      px(cc, 268, 4, 32, 30, '#a9a6a0'); px(cc, 268, 4, 32, 1, '#d6d3cc'); px(cc, 270, 6, 28, 26, '#cfe8f5');
      for (let k = 0; k < 9; k++) { px(cc, 273 + k, 16 - k, 2, 1, '#ffffff'); px(cc, 278 + k, 19 - k, 1, 1, '#ffffff'); }
      px(cc, 264, 40, 40, 6, '#fbf8f0'); px(cc, 264, 40, 40, 1, '#ffffff'); px(cc, 270, 42, 28, 3, '#cfe0ea'); px(cc, 270, 42, 28, 1, '#a9bfcc');
      px(cc, 264, 46, 40, 10, '#e8e2d6'); px(cc, 264, 55, 40, 1, '#bdb7aa'); px(cc, 283, 46, 2, 10, '#cfc9bc');
      px(cc, 282, 36, 3, 5, '#a9a6a0'); px(cc, 279, 36, 6, 1, '#a9a6a0'); px(cc, 278, 37, 2, 1, '#c9c6c0');
      // kursi berlengan
      shadow(cc, 41, 153, 19);
      px(cc, 24, 124, 34, 12, '#4f8a5a'); px(cc, 24, 124, 34, 1, '#6ea87a'); px(cc, 40, 125, 2, 10, '#437a4e');
      px(cc, 26, 134, 30, 16, '#5ea06a'); px(cc, 26, 134, 30, 2, '#7cbc88'); px(cc, 26, 148, 30, 2, '#4f8a5a');
      px(cc, 22, 130, 6, 22, '#3e6e48'); px(cc, 22, 130, 6, 2, '#5a8f66'); px(cc, 54, 130, 6, 22, '#3e6e48'); px(cc, 54, 130, 6, 2, '#5a8f66');
      px(cc, 24, 152, 3, 2, PAL.woodD); px(cc, 55, 152, 3, 2, PAL.woodD);
    });
  };

  S.objs.push({
    flat: true, y: 0, starI: 0, hit: [134, 4, 52, 32], go: [160, 64], skin: 'fn:homeWindow',
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
    flat: true, x: 37, y: 104, hit: [10, 48, 56, 58], go: [38, 112], skin: 'fn:bed',
    draw(c) {
      shadowRect(c, 9, 107, 57, 3);
      px(c, 9, 47, 56, 60, '#3a2616');
      px(c, 10, 48, 54, 10, PAL.woodD); px(c, 12, 50, 50, 6, PAL.wood); px(c, 12, 50, 50, 1, PAL.woodL);
      px(c, 12, 58, 50, 44, '#fbf8f0'); px(c, 18, 60, 38, 10, '#ffffff'); px(c, 18, 69, 38, 1, '#e3ddd0'); px(c, 18, 60, 38, 1, '#eef0ea'); px(c, 54, 61, 2, 8, '#ecebe2');
      if (G.boy.inBed) drawSleepyHead(c, 37, 59);
      for (let yy = 70; yy < 100; yy += 8) for (let xx = 12; xx < 62; xx += 10) { px(c, xx, yy, 10, 8, ((xx + yy) / 2) % 2 ? '#4f86e0' : '#7aa4ea'); }
      px(c, 12, 70, 50, 3, '#dfe9fa'); px(c, 12, 73, 50, 1, '#2f5bab');
      px(c, 56, 74, 6, 26, 'rgba(30,50,110,0.2)');
      px(c, 10, 100, 54, 6, PAL.woodD); px(c, 10, 100, 54, 1, PAL.wood);
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

  S.objs.push({ flat: true, y: 0, hit: [258, 30, 12, 16], go: [266, 64], skin: 'bg', draw(c) { px(c, 262, 36, 6, 6, '#4f86e0'); px(c, 263, 31, 1, 6, '#f4cf3a'); px(c, 265, 30, 1, 7, '#e2483d'); px(c, 263, 30, 1, 2, '#ffffff'); },
    tap() { sfx('tap'); }, arrive() { G.boy.dir = 'down'; doAct(G.boy, 'brush', 2.4); say([{ k: 'brush' }]); sfx('bubbles'); fx('bubble', G.boy.x + 2, G.boy.y - 18, 6); } });
  S.objs.push({ flat: true, y: 0, hit: [276, 34, 24, 14], go: [286, 64], draw() {},
    tap() { sfx('tap'); }, arrive() { G.boy.dir = 'down'; doAct(G.boy, 'wash', 2.2); say([{ k: 'wash' }]); sfx('water'); fx('bubble', G.boy.x, G.boy.y - 8, 8); } });
  S.objs.push({ flat: true, y: 0, hit: [266, 2, 36, 32], go: [284, 64], draw() {}, tap() { sfx('tap'); }, arrive() { openPanel('mirror', 'body'); } });
  S.objs.push({ flat: true, y: 0, hit: [210, 2, 38, 56], go: [229, 66], draw() {}, tap() { say([{ k: 'shirt' }]); }, arrive() { openPanel('mirror', 'clothes'); } });

  // meja makan besar; makanan digambar besar pada ukuran aslinya supaya jelas
  S.objs.push({ flat: true, y: 0, skin: 'bg', draw(c) {
    shadowRect(c, 105, 126, 126, 3);
    px(c, 132, 74, 16, 10, '#3a2616'); px(c, 133, 75, 14, 9, PAL.woodD); px(c, 133, 75, 14, 1, PAL.wood); px(c, 188, 74, 16, 10, '#3a2616'); px(c, 189, 75, 14, 9, PAL.woodD); px(c, 189, 75, 14, 1, PAL.wood);
    px(c, 106, 119, 6, 8, '#3a2616'); px(c, 224, 119, 6, 8, '#3a2616'); px(c, 107, 119, 4, 7, '#6b4226'); px(c, 225, 119, 4, 7, '#6b4226');
    px(c, 103, 83, 130, 37, '#3a2616');
    px(c, 104, 84, 128, 30, '#b97d45'); px(c, 104, 84, 128, 2, '#cf9358');
    for (let x = 104; x < 232; x += 32) px(c, x, 86, 1, 28, '#a86f3c');
    px(c, 104, 92, 128, 1, 'rgba(90,55,25,0.1)'); px(c, 104, 105, 128, 1, 'rgba(90,55,25,0.1)');
    px(c, 104, 114, 128, 5, '#a8743c'); px(c, 104, 114, 128, 1, '#8a5a35');
  } });
  [['rice', 126, 100], ['noodles', 154, 100], ['dumpling', 182, 100], ['bun', 210, 100], ['egg', 140, 113], ['milk', 168, 113], ['fish', 196, 113]].forEach(([f, x, y]) => {
    S.objs.push({
      x, y, flat: true, gone: 0, food: f, skin: 'fn:tableFood', get hit() { return this.gone > 0 ? [0, 0, 0, 0] : [x - 13, y - 22, 26, 24]; }, go: [x, 134],
      draw(c) { if (this.gone <= 0) drawOutlined(c, x, y, 1, (cc, ax, ay) => drawFoodBig(cc, ax, ay, f)); },
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
  S.objs.push({ y: 128, skin: 'bg', draw(c) { for (const x of [133, 189]) { px(c, x, 121, 14, 8, PAL.wood); px(c, x, 127, 14, 2, PAL.woodD); } } });

  // Keluarga: menyapa lalu bertanya
  const greet = (who, k) => [{ k, by: 'me' }, { k: greetNow(), by: 'np' }];
  const mom = npc('mom', 92, 76, 'down', { lines: () => [greet(mom, 'mom'), [{ k: 'q_eat', by: 'np' }, { k: 'a_eat', by: 'me' }], [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]] });
  const dad = npc('dad', 252, 112, 'left', { get hidden() { return !G.night; }, lines: () => [greet(dad, 'dad'), [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]] });
  const grandpa = npc('grandpa', 41, 148, 'down', { lines: () => [greet(grandpa, 'grandpa'), [{ k: 'q_name', by: 'np' }, { k: 'a_name', by: 'me' }], [{ k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }]] });
  const grandma = npc('grandma', 84, 162, 'left', { lines: () => [greet(grandma, 'grandma'), [{ k: 'q_hungry', by: 'np' }, { k: 'a_hungry', by: 'me' }], [{ k: 'q_apple', by: 'np' }, { k: 'a_like', by: 'me' }]] });
  [mom, dad, grandpa, grandma].forEach(p => S.objs.push(p));
  mom.go = [92, 90]; dad.go = [272, 116]; grandpa.go = [66, 158]; grandma.go = [102, 162];
  S.objs.push({ y: 164, skin: 'obj-benang', draw(c) { disc(c, 72, 160, 3, '#e2483d'); px(c, 71, 159, 3, 1, '#f39ac0'); px(c, 74, 158, 6, 1, '#e2483d'); } });

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
    bgOutlined(c, cc => {
      drawHouse(cc, 30, 4, 50, 36, { roof: '#4f86e0', roofD: '#2f5bab', roofL: '#7aa4ea', door: 18, windows: [3, 33], night: G.night });
      drawHouse(cc, 232, 4, 56, 36, { roof: '#58a84a', roofD: '#3d7f33', roofL: '#7cc85a', door: 22, windows: [4, 39], night: G.night });
    });
    // rel kereta tepat di sebelah jalan: kerikil, bantalan kayu, rel mengilap
    const rr = rng(23);
    px(c, 0, 44, W, 14, '#b8a88a');
    for (let i = 0; i < 220; i++) px(c, Math.floor(rr() * W), 44 + Math.floor(rr() * 14), 2, 1, rr() < 0.5 ? '#a8987a' : '#cdbda0');
    px(c, 0, 44, W, 1, '#9c8c70'); px(c, 0, 57, W, 1, '#9c8c70');
    for (let x = 0; x < W; x += 6) { px(c, x, 45, 4, 12, PAL.woodD); px(c, x, 45, 3, 1, PAL.wood); }
    for (const ry of [47, 53]) { px(c, 0, ry, W, 1, '#d6d9de'); px(c, 0, ry + 1, W, 1, '#7c8088'); px(c, 0, ry + 2, W, 1, 'rgba(40,30,20,0.25)'); }
    // jalan aspal dengan trotoar
    px(c, 0, 60, W, 54, '#8b8d94');
    groundPatches(c, 0, 60, W, 54, 22, '#868890', 0.55);
    for (let i = 0; i < 300; i++) px(c, Math.floor(rr() * W), 60 + Math.floor(rr() * 54), 1, 1, rr() < 0.5 ? '#7c7e86' : '#9a9ca4');
    px(c, 0, 58, W, 2, '#d7d7dc'); px(c, 0, 60, W, 2, 'rgba(30,30,40,0.2)');
    px(c, 0, 112, W, 2, 'rgba(30,30,40,0.14)'); px(c, 0, 114, W, 2, '#d7d7dc'); px(c, 0, 116, W, 1, '#a9a9b0');
    for (let x = 0; x < W; x += 20) { if (x > 136 && x < 176) continue; px(c, x, 86, 10, 2, '#f4f0e0'); }
    for (let y = 62; y < 112; y += 6) { px(c, 146, y, 28, 3, '#f4f0e0'); px(c, 146, y + 2, 28, 1, '#d9d5c6'); }
    drawPath(c, 0, 118, W, 18, 7);
    // tepi sungai dan air
    px(c, 0, 137, W, 5, '#d9bf86'); px(c, 0, 140, W, 2, '#c9a46a');
    for (let x = 3; x < W; x += 9) { px(c, x, 139, 3, 1, '#ecd8a8'); px(c, x + 5, 138, 2, 1, '#c9a46a'); }
    drawWater(c, 0, 142, W, 38, 25);
    px(c, 0, 142, W, 2, PAL.waterD); px(c, 0, 144, W, 1, 'rgba(40,90,130,0.3)');
    [[30, 160], [70, 172], [260, 166], [300, 152]].forEach(([x, y]) => { oval(c, x, y + 1, 6, 2, '#3f8fc4'); oval(c, x, y, 5, 2, '#4a9a3a'); px(c, x - 3, y - 1, 3, 1, '#7cc85a'); px(c, x + 3, y, 2, 1, '#2f7a2c'); });
    [[12, 140], [120, 140], [206, 140], [290, 140]].forEach(([x, y]) => { px(c, x, y - 7, 1, 7, PAL.leafD); px(c, x + 2, y - 9, 1, 9, PAL.leaf); px(c, x + 4, y - 6, 1, 6, PAL.leafD); px(c, x + 2, y - 12, 1, 3, '#8a5a35'); px(c, x + 2, y - 12, 1, 1, '#a87448'); });
    bgOutlined(c, cc => {
      // dermaga kecil ke arah pantai
      shadowRect(cc, 220, 154, 21, 3);
      px(cc, 219, 152, 3, 6, PAL.woodD); px(cc, 238, 152, 3, 6, PAL.woodD);
      px(cc, 220, 136, 20, 18, PAL.woodD);
      for (let y = 137; y < 154; y += 3) { px(cc, 221, y, 18, 2, PAL.wood); px(cc, 221, y, 18, 1, PAL.woodL); }
      // papan arah
      shadow(cc, 295, 116, 6);
      px(cc, 294, 102, 3, 14, PAL.woodD); px(cc, 294, 102, 1, 14, PAL.wood);
      px(cc, 284, 96, 23, 9, PAL.woodD); px(cc, 285, 97, 21, 7, PAL.wood); px(cc, 285, 97, 21, 1, PAL.woodL);
      px(cc, 288, 99, 3, 3, '#e2483d'); px(cc, 293, 100, 10, 1, '#5a3a22');
    });
  };

  // skin: gambar gaya baru (skin.js) — 'bg' = sudah ada di gambar latar, 'obj-…' = potongan desain
  S.objs.push({ x: 116, y: 40, skin: 'bg', draw(c) { drawTree(c, 116, 40, { r: 12 }); } });
  S.objs.push({ x: 190, y: 40, skin: 'bg', draw(c) { drawTree(c, 190, 40, { r: 13 }); } });
  S.objs.push({ y: 138, skin: 'bg', draw(c) { drawBush(c, 60, 137, '#f39ac0'); drawBush(c, 170, 137, '#ffffff'); } });
  [100, 240].forEach((x, i) => S.objs.push({ y: 117, skin: 'obj-lampu-jalan-' + (i + 1), draw(c) {
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
    skin(c, t) { skinGlints(c, t, 200, 158, [[150, 150], [240, 168], [120, 172], [270, 146]]); },
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
