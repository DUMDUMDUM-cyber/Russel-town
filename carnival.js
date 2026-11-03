// Karnaval: bianglala, komidi putar, balon, memancing bebek, makanan, dan kembang api saat malam.

['cottoncandy', 'popcorn'].forEach(k => { ITEMS[k] = { food: 1 }; });
const _drawItemBase4 = drawItem;
drawItem = function (c, x, y, type, big) {
  x = Math.round(x); y = Math.round(y);
  if (type === 'cottoncandy') {
    px(c, x, y - 7, 1, 7, '#e8e2d6');
    disc(c, x, y - 11, 5, '#e88ab4'); disc(c, x - 3, y - 12, 3, '#f8b8d4'); disc(c, x + 3, y - 12, 3, '#f8b8d4'); disc(c, x, y - 14, 3, '#fcd0e2'); px(c, x - 2, y - 15, 2, 1, '#ffffff');
  } else if (type === 'popcorn') {
    for (const [a, b] of [[-3, -11], [0, -12], [3, -11], [-1, -9], [2, -9], [-3, -8], [3, -8]]) { disc(c, x + a, y + b, 2, '#fff2c8'); px(c, x + a, y + b, 1, 1, '#f4cf3a'); }
    px(c, x - 5, y - 8, 10, 8, '#e2483d'); for (let i = -4; i < 5; i += 3) px(c, x + i, y - 8, 1, 8, '#ffffff'); px(c, x - 5, y - 1, 10, 1, '#a8352b');
  } else _drawItemBase4(c, x, y, type, big);
};

// ================= GAMBAR WAHANA =================
function drawHorse(c, x, y, dir, col, colD) {
  flip(c, x, dir, () => {
    const P = (dx, dy, w, h, k) => px(c, dx, y + dy, w, h, k);
    P(-7, -7, 2, 7, colD); P(4, -7, 2, 7, colD); P(-5, -7, 2, 7, col); P(2, -7, 2, 7, col);
    P(-8, -13, 15, 7, col); P(-8, -13, 15, 1, '#ffffff'); P(-8, -7, 15, 1, colD);
    P(4, -18, 4, 6, col); P(5, -22, 7, 5, col); P(11, -20, 2, 3, col); P(5, -24, 2, 2, col);
    P(9, -21, 1, 1, RB_K); P(11, -18, 1, 1, colD);
    P(2, -22, 3, 7, '#f4cf3a'); P(-11, -13, 3, 2, '#f4cf3a'); P(-12, -11, 2, 5, '#f4cf3a');
    P(-3, -14, 6, 2, '#e2483d'); P(-3, -12, 6, 1, '#f4cf3a');
  });
}

// ================= TEMPAT: KARNAVAL =================
SCENES.carnival = (() => {
  const S = {
    id: 'carnival', place: 'carnival', outdoor: true, walk: [8, 68, 312, 174], spawn: [160, 80],
    blocks: [[50, 104, 44, 8], [198, 96, 92, 16], [94, 148, 54, 12], [186, 158, 42, 10], [262, 158, 42, 10]], objs: [],
    lights: [[72, 72, 56], [244, 72, 60], [160, 44, 30], [207, 150, 30], [283, 150, 30]],
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 64; y++) { const k = y / 64; px(c, 0, y, W, 1, N ? `rgb(${24 + k * 26},${28 + k * 28},${70 + k * 40})` : `rgb(${150 + k * 60},${212 + k * 26},${245})`); }
    if (N) { const r = rng(95); for (let i = 0; i < 40; i++) px(c, Math.floor(r() * W), Math.floor(r() * 50), 1, 1, '#ffffff'); }
    // bukit, rumput, dataran karnaval
    for (let x = 0; x < W; x += 2) { const h = 8 + Math.sin(x / 30) * 4; px(c, x, 62 - h, 2, h + 4, N ? '#34583e' : '#7cb878'); }
    drawGrass(c, 0, 58, W, 12, 93, false);
    drawPath(c, 0, 66, W, 114, 94);
    // serpihan kertas warna-warni di tanah
    const r2 = rng(96);
    for (let i = 0; i < 60; i++) px(c, Math.floor(r2() * W), 70 + Math.floor(r2() * 108), 2, 1, ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a', '#f39ac0'][i % 5]);
    bgOutlined(c, cc => {
      // tenda di belakang
      for (const [x, col] of [[104, '#e2483d'], [216, '#4f86e0']]) {
        for (let k = 0; k < 14; k++) px(cc, x - k, 40 + k, k * 2 + 1, 1, k % 4 < 2 ? col : '#fff6d8');
        px(cc, x - 14, 54, 29, 12, col); for (let i = -12; i < 14; i += 6) px(cc, x + i, 54, 3, 12, '#fff6d8'); px(cc, x - 3, 58, 6, 8, '#3a2a20'); px(cc, x, 34, 1, 6, RB_K); px(cc, x + 1, 34, 5, 3, '#f4cf3a');
      }
      // gerbang masuk
      for (const x of [136, 181]) { px(cc, x, 34, 5, 34, '#e2483d'); px(cc, x, 34, 2, 34, '#ff8a7a'); for (let y = 38; y < 68; y += 8) px(cc, x, y, 5, 3, '#fff6d8'); disc(cc, x + 2, 32, 3, '#f4cf3a'); }
      px(cc, 134, 28, 53, 10, '#4f86e0'); px(cc, 134, 28, 53, 2, '#8fb4ee'); px(cc, 134, 37, 53, 1, '#2f5bab');
      for (let i = 0; i < 6; i++) drawStar(cc, 140 + i * 8, 32, i % 2 ? '#ffd84a' : '#ffffff');
    });
    // bendera segitiga antar wahana
    for (let x = 96; x < 208; x += 8) { const y = 40 + Math.round(Math.sin((x - 96) / 112 * Math.PI) * 5); px(c, x, y - 1, 8, 1, RB_K); for (let k = 0; k < 4; k++) px(c, x + k, y + k, 7 - k * 2, 1, ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a'][Math.floor(x / 8) % 4]); }
  };

  // ---------- Bianglala ----------
  const CAB = ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a', '#f39ac0', '#f08a32', '#9b6bd6', '#3fa0b8'];
  const wheel = { x: 72, y: 112, a: 0, riding: false, cab: 0, rideA: 0, lastPh: 0, skin: 'fn:ferris',
    hit: [32, 30, 80, 82], go: [72, 120],
    pos(i) { const a = this.a + i / 8 * Math.PI * 2; return [72 + Math.cos(a) * 36, 70 + Math.sin(a) * 36]; },
    draw(c, t) {
      shadow(c, 72, 112, 26);
      // kaki penyangga
      for (let k = 0; k < 42; k++) { px(c, 72 - Math.round(k * 0.45) - 1, 70 + k, 3, 1, RB_MD); px(c, 72 + Math.round(k * 0.45) - 1, 70 + k, 3, 1, RB_MD); }
      px(c, 50, 110, 44, 3, '#5f6c7a'); px(c, 50, 110, 44, 1, RB_M);
      // jari-jari dan lingkaran
      for (let i = 0; i < 8; i++) { const [ex, ey] = this.pos(i); for (let k = 0; k <= 12; k++) px(c, 72 + (ex - 72) * k / 12, 70 + (ey - 70) * k / 12, 1, 1, RB_ML); }
      for (let k = 0; k < 64; k++) { const a = k / 64 * Math.PI * 2; px(c, 72 + Math.cos(a) * 36, 70 + Math.sin(a) * 36, 2, 1, '#e8eef2'); }
      disc(c, 72, 70, 4, RB_MD); disc(c, 72, 70, 2, '#f4cf3a');
      // kabin (tetap tegak), Russel duduk di salah satunya
      for (let i = 0; i < 8; i++) {
        const [ex, ey] = this.pos(i), cx = Math.round(ex), cy = Math.round(ey) + 2, col = CAB[i], ride = this.riding && this.cab === i;
        px(c, cx, cy - 2, 1, 2, RB_K);
        if (ride) drawPerson(c, cx, cy + 11, { look: 'me', dir: 'down', mood: 'happy', outfit: effOutfit(), noShadow: true, frame: 0 });
        else { px(c, cx - 6, cy, 12, 2, col); px(c, cx - 5, cy + 2, 10, 3, '#cfe8f5'); }
        px(c, cx - 6, cy + 5, 12, 5, col); px(c, cx - 6, cy + 5, 12, 1, '#ffffff'); px(c, cx - 6, cy + 9, 12, 1, 'rgba(0,0,0,0.25)');
      }
    },
    update(dt) {
      this.a += dt * (this.riding ? 0.45 : 0.22);
      if (!this.riding) return;
      const b = G.boy, [ex, ey] = this.pos(this.cab), ph = Math.sin(this.a + this.cab / 8 * Math.PI * 2);
      b.x = ex; b.y = ey + 13;
      this.rideA += dt * 0.45;
      // kata naik dan turun saat melewati puncak dan dasar
      const dir = Math.cos(this.a + this.cab / 8 * Math.PI * 2) * 1 > 0 ? 'godown' : 'goup';
      if (dir !== this.lastPh) { this.lastPh = dir; say([{ k: dir }]); }
      void ph;
      if (this.rideA >= Math.PI * 2 - 0.05) {
        this.riding = false; b.ride = null; b.hidden = false; b.x = 72; b.y = 122; b.dir = 'down';
        doAct(b, 'hop', 0.9); sfx('sparkle'); say([{ k: 'fun', by: b }]);
      }
    },
    tap() { say([{ k: 'ferriswheel' }]); },
    arrive() {
      if (this.riding) return;
      let best = 0, by = -1e9;
      for (let i = 0; i < 8; i++) { const [, ey] = this.pos(i); if (ey > by) { by = ey; best = i; } }
      const b = G.boy;
      this.cab = best; this.riding = true; this.rideA = 0; this.lastPh = '';
      b.hidden = true; b.ride = () => {}; sfx('whoosh');
    } };
  S.objs.push(wheel);

  // ---------- Komidi putar ----------
  const HORSES = [['#ffffff', '#c9d4e0'], ['#f6c9a3', '#c08a52'], ['#fcd0e2', '#e88ab4'], ['#bfe3f2', '#7aa4ea'], ['#fff2a8', '#d9b02a'], ['#c8e8a8', '#7cc85a']];
  const carousel = { x: 244, y: 110, a: 0, riding: false, horse: 0, rideA: 0, skin: 'fn:carousel',
    hit: [198, 36, 92, 76], go: [244, 120],
    pos(i) { const a = this.a + i / 6 * Math.PI * 2; return [244 + Math.cos(a) * 34, 96 + Math.sin(a) * 9, Math.sin(a), -Math.sin(a)]; },
    draw(c, t) {
      shadow(c, 244, 110, 44);
      // lantai berputar
      oval(c, 244, 102, 46, 11, '#a8352b'); oval(c, 244, 100, 46, 11, '#e2483d'); oval(c, 244, 99, 42, 9, '#fff6d8');
      for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2 + this.a; px(c, 244 + Math.round(Math.cos(a) * 44), 100 + Math.round(Math.sin(a) * 10), 3, 1, k % 2 ? '#f4cf3a' : '#ffffff'); }
      // tiang tengah
      px(c, 240, 52, 8, 46, '#f4cf3a'); px(c, 240, 52, 3, 46, '#fff2a8'); px(c, 246, 52, 2, 46, '#c9a21f');
      // kuda: yang di belakang digambar lebih dulu
      const order = [0, 1, 2, 3, 4, 5].map(i => [i, this.pos(i)]).sort((p, q) => p[1][2] - q[1][2]);
      for (const [i, [hx, hy, depth, moveDir]] of order) {
        const bob = Math.round(Math.sin(this.a * 3 + i * 2) * 2), dir = moveDir > 0 ? 1 : -1, x = Math.round(hx), y = Math.round(hy) + bob;
        px(c, x, 58, 1, y - 58 - 2, '#f4cf3a');
        drawHorse(c, x, y, dir, HORSES[i][0], HORSES[i][1]);
        if (this.riding && this.horse === i) drawPerson(c, x, y - 7, { look: 'me', dir: dir > 0 ? 'right' : 'left', mood: 'happy', outfit: effOutfit(), noShadow: true, frame: 0 });
        void depth;
      }
      // atap kerucut bergaris
      for (let k = 0; k < 20; k++) { const w = 6 + k * 2.3; for (let i = -7; i < 7; i++) px(c, 244 + i * w / 7, 36 + k, w / 7 + 1, 1, (i + 7 + Math.floor(this.a * 3)) % 2 ? '#e2483d' : '#fff6d8'); }
      px(c, 196, 56, 96, 3, '#f4cf3a'); for (let x = 198; x < 292; x += 8) { disc(c, x, 60, 1, G.night ? '#ffe28a' : '#ffffff'); }
      px(c, 243, 30, 2, 6, RB_K); px(c, 245, 30, 6, 3, '#58a84a');
    },
    update(dt) {
      this.a += dt * (this.riding ? 1 : 0.5);
      if (!this.riding) return;
      const b = G.boy, [hx, hy] = this.pos(this.horse);
      b.x = hx; b.y = hy - 6;
      this.rideA += dt;
      if (this.rideA > 12.6) {
        this.riding = false; b.ride = null; b.hidden = false; b.x = 244; b.y = 122; b.dir = 'down';
        doAct(b, 'hop', 0.9); sfx('sparkle'); say([{ k: 'fun', by: b }]);
      }
    },
    tap() { say([{ k: 'carousel' }]); },
    arrive() {
      if (this.riding) return;
      const b = G.boy; let best = 0, by = -1e9;
      for (let i = 0; i < 6; i++) { const p = this.pos(i); if (p[1] > by) { by = p[1]; best = i; } }
      this.horse = best; this.riding = true; this.rideA = 0;
      b.hidden = true; b.ride = () => {}; sfx('whoosh');
      say([{ k: 'horse' }, { k: 'carousel' }, { k: 'fun', by: b }]);
      [392, 494, 587, 494].forEach((f, i) => Snd.tone(f, 0.3, { gain: 0.05, when: i * 0.4, type: 'triangle' }));
    } };
  S.objs.push(carousel);

  // ---------- Penjual balon ----------
  const BALLOONS = { red: '#e2483d', yellow: '#f4cf3a', blue: '#4f86e0', green: '#58a84a', pink: '#f39ac0' };
  const seller = npc('auntie', 158, 120, 'down', { go: [158, 130], lines: [[{ k: 'hello', by: 'me' }]] });
  seller.draw = function (c, t) {
    for (const [dx, dy, k] of [[-8, -48, 'red'], [0, -54, 'yellow'], [8, -48, 'blue'], [-4, -40, 'green'], [5, -40, 'pink']]) {
      const sw = Math.round(Math.sin(t * 1.5 + dx) * 1), bx = this.x + 13 + dx + sw, by = this.y + dy;
      px(c, bx, by + 6, 1, 12, 'rgba(60,50,40,0.6)'); oval(c, bx, by, 4, 5, BALLOONS[k]); px(c, bx - 2, by - 3, 1, 2, '#ffffff');
    }
    px(c, this.x + 12, this.y - 26, 2, 22, PAL.woodD);
    drawPerson(c, this.x, this.y, { look: this.look, dir: this.dir, mood: this.mood, act: this.act, actT: this.actT, frame: this.frame });
  };
  seller.tap = function () {
    this.talkT = 5; doAct(this, 'wave', 1.2);
    say([{ k: 'balloon', by: this }, { k: 'whatcolor', by: this }]);
    offerPics(this.x, this.y - 58, Object.keys(BALLOONS).map(k => picBtn(k, 'take', () => {
      if (EX.coins > 0) { EX.coins--; exSave(); }
      G.boy.balloon = BALLOONS[k]; sfx('pop'); fx('heart', G.boy.x, G.boy.y - 30, 2);
      say([{ k }, { k: 'balloon' }, { k: 'thanks', by: G.boy }]);
    })));
  };
  S.objs.push(seller);
  // balon yang dipegang Russel
  S.objs.push({ top: true, skin: 'fn:heldBalloon', get hidden() { return !G.boy.balloon || G.boy.hidden; },
    draw(c, t) {
      const b = G.boy, sw = Math.round(Math.sin(t * 1.6) * 2), x = Math.round(b.x) + 7, y = Math.round(b.y) - 18;
      for (let k = 0; k < 16; k++) px(c, x + Math.round(sw * k / 16), y - k, 1, 1, 'rgba(60,50,40,0.6)');
      oval(c, x + sw, y - 22, 5, 6, G.boy.balloon); px(c, x + sw - 2, y - 25, 1, 2, '#ffffff'); px(c, x + sw, y - 16, 1, 1, G.boy.balloon);
    } });

  // ---------- Memancing bebek ----------
  S.objs.push({ x: 121, y: 158, hit: [92, 136, 58, 24], go: [121, 166], skin: 'obj-kolam-bebek',
    draw(c, t) {
      shadow(c, 121, 158, 28);
      oval(c, 121, 152, 28, 9, '#a8352b'); oval(c, 121, 150, 28, 9, '#e2483d'); oval(c, 121, 149, 25, 7, '#fff6d8');
      oval(c, 121, 150, 24, 6, PAL.waterD); oval(c, 121, 149, 23, 5, PAL.water);
      for (const [a, b] of [[-14, 148], [6, 151], [13, 147]]) px(c, 121 + a, b, 5, 1, PAL.waterL);
      px(c, 96, 134, 2, 18, PAL.woodD); px(c, 96, 134, 18, 2, PAL.woodD); px(c, 113, 136, 1, 6, RB_K); px(c, 112, 141, 3, 1, RB_MD);
    },
    tap() { say([{ k: 'hookduck' }]); } });
  const DK = { n: 0 };
  for (let i = 0; i < 4; i++) S.objs.push({ x: 121, y: 159, t0: i * 1.57, gone: 0, dir: 1,
    get hidden() { return this.gone > 0; },
    get px() { return 121 + Math.cos(this.t0) * 16; }, get py() { return 151 + Math.sin(this.t0) * 3; },
    get hit() { return [this.px - 8, this.py - 11, 16, 13]; }, get go() { return [Math.round(this.px), 166]; },
    draw(c, t) { drawDuck(c, this.px, this.py, Math.sin(this.t0) > 0 ? -1 : 1, t + i, true); },
    update(dt) { this.t0 += dt * 0.5; if (this.gone > 0) this.gone -= dt; },
    tap() { sfx('tap'); say([{ k: 'duck' }]); },
    arrive() {
      if (this.gone > 0) return;
      this.gone = 6; DK.n++; G.boy.dir = 'up'; doAct(G.boy, 'wave', 0.8); sfx('splash'); fx('splash', this.px, this.py, 4);
      if (DK.n >= 5) {
        DK.n = 0; addCoins(1, G.boy.x, G.boy.y - 30); sfx('sparkle');
        say([{ k: 'prize' }, { k: 'great' }]);
      } else sayCount(DK.n, 'duck', '只', 'zhī');
    } });

  // ---------- Kios makanan ----------
  const stall = (x, item, col) => ({ x, y: 168, gone: 0, hit: [x - 24, 130, 48, 38], go: [x, 174], skin: 'fn:carnivalStall',
    draw(c) {
      shadow(c, x, 168, 24);
      px(c, x - 20, 150, 40, 18, '#c08a52'); px(c, x - 20, 150, 40, 2, '#d9a56a'); px(c, x - 20, 167, 40, 1, PAL.woodD);
      for (const a of [-20, 18]) px(c, x + a, 134, 2, 18, PAL.woodD);
      for (let i = 0; i < 8; i++) { px(c, x - 23 + i * 6, 130, 6, 7, i % 2 ? '#fff6d8' : col); px(c, x - 23 + i * 6, 137, 6, 1, i % 2 ? '#d9cfae' : 'rgba(0,0,0,0.25)'); }
      if (this.gone <= 0) { drawItem(c, x - 8, 150, item); drawItem(c, x + 8, 150, item); } else drawItem(c, x + 8, 150, item);
    },
    update(dt) { if (this.gone > 0) this.gone -= dt; },
    tap() { say([{ k: item }]); },
    arrive() { G.boy.dir = 'up'; if (this.gone > 0) { say([{ k: item }]); return; } if (bagAdd(item, x, 145, true)) { this.gone = 6; sfx('pop'); say([{ k: item }, { k: 'bag' }]); } } });
  S.objs.push(stall(207, 'cottoncandy', '#f39ac0'), stall(283, 'popcorn', '#e2483d'));

  // ---------- Teman yang berjalan-jalan ----------
  S.objs.push(npc('kid1', 40, 140, 'right', { path: [[40, 140], [84, 134], [40, 160]], sp: 12, lines: [[{ k: 'hello', by: 'me' }, { k: 'q_play', by: 'np' }, { k: 'a_ok', by: 'me' }], [{ k: 'fun', by: 'np' }]] }));
  S.objs.push(npc('kid4', 180, 96, 'down', { path: [[180, 96], [180, 136], [150, 96]], sp: 10, lines: [[{ k: 'hello', by: 'me' }, { k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]] }));

  // ---------- Kembang api saat malam ----------
  const bursts = [];
  const fw = { top: true, y: 0, nextT: 1, i: 0, get hidden() { return !G.night; },
    hit: [100, 0, 120, 30],
    draw(c) {
      for (const b of bursts) {
        const r = b.t * 26, fade = Math.max(0, 1 - b.t);
        c.globalAlpha = fade;
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; px(c, b.x + Math.cos(a) * r, b.y + Math.sin(a) * r + b.t * b.t * 8, 2, 2, b.col); if (k % 2) px(c, b.x + Math.cos(a) * r * 0.6, b.y + Math.sin(a) * r * 0.6, 1, 1, '#ffffff'); }
        c.globalAlpha = 1;
      }
    },
    update(dt) {
      for (let i = bursts.length - 1; i >= 0; i--) { bursts[i].t += dt * 0.8; if (bursts[i].t > 1) bursts.splice(i, 1); }
      if (!G.night) return;
      this.nextT -= dt;
      if (this.nextT <= 0) { this.nextT = rand(1.2, 3); this.pop(); }
    },
    pop(x, y) { bursts.push({ x: x || rand(110, 210), y: y || rand(10, 34), t: 0, col: ['#ffd84a', '#ff8a7a', '#8fd0f2', '#c8e8a8', '#fcd0e2'][this.i++ % 5] }); sfx('pop'); },
    tap() { this.pop(); say([{ k: 'fireworks' }]); } };
  S.objs.push(fw);

  S.enter = () => { wheel.riding = false; carousel.riding = false; DK.n = 0; };
  S.exits = [{ hit: [140, 62, 40, 24], arrow: [160, 76, 'up'], go: [160, 68], to: 'school', at: [62, 160] }];
  return S;
})();

// ================= JALAN MASUK DARI SEKOLAH =================
(function schoolGate() {
  const Sc = SCENES.school, baseBg = Sc.bg;
  Sc.bg = c => {
    baseBg(c);
    // celah di pagar semak dan papan bergambar balon
    px(c, 50, 170, 24, 10, PAL.path); px(c, 50, 170, 24, 1, PAL.pathD);
    bgOutlined(c, cc => {
      shadow(cc, 80, 170, 5);
      px(cc, 79, 156, 2, 14, PAL.woodD); px(cc, 72, 146, 17, 11, PAL.woodD); px(cc, 73, 147, 15, 9, PAL.wood); px(cc, 73, 147, 15, 1, PAL.woodL);
      oval(cc, 78, 150, 2, 2, '#e2483d'); oval(cc, 83, 151, 2, 2, '#f4cf3a'); px(cc, 78, 153, 1, 2, RB_K); px(cc, 83, 153, 1, 2, RB_K);
    });
  };
  Sc.exits.push({ hit: [46, 158, 28, 22], arrow: [62, 168, 'down'], go: [62, 176], to: 'carnival', at: [160, 80] });
})();

// ================= GAMBAR STIKER =================
const stWheel = (c, x, y) => {
  for (let k = 0; k < 18; k++) { px(c, x - Math.round(k * 0.4), y - 18 + k, 2, 1, RB_MD); px(c, x + Math.round(k * 0.4), y - 18 + k, 2, 1, RB_MD); }
  for (let k = 0; k < 40; k++) { const a = k / 40 * 6.283; px(c, x + Math.cos(a) * 14, y - 20 + Math.sin(a) * 14, 1, 1, RB_ML); }
  for (let i = 0; i < 8; i++) { const a = i * 0.785; px(c, x + Math.round(Math.cos(a) * 14) - 3, y - 20 + Math.round(Math.sin(a) * 14) - 2, 6, 5, ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a'][i % 4]); }
  disc(c, x, y - 20, 2, '#f4cf3a');
};
Object.assign(ST_ART, {
  carnival: (c, x, y) => { stWheel(c, x - 6, y); px(c, x + 14, y - 26, 1, 14, 'rgba(60,50,40,0.6)'); oval(c, x + 14, y - 30, 4, 5, '#e2483d'); },
  ferriswheel: stWheel,
  carousel: (c, x, y) => {
    for (let k = 0; k < 12; k++) { const w = 4 + k * 1.7; for (let i = -4; i < 4; i++) px(c, x + i * w / 4, y - 36 + k, w / 4 + 1, 1, (i + 4) % 2 ? '#e2483d' : '#fff6d8'); }
    px(c, x - 1, y - 24, 2, 20, '#f4cf3a'); drawHorse(c, x - 8, y - 3, 1, '#ffffff', '#c9d4e0');
    oval(c, x, y - 2, 20, 3, '#e2483d');
  },
  horse: (c, x, y) => drawHorse(c, x, y, 1, '#f6c9a3', '#c08a52'),
  goup: (c, x, y) => { drawArrow(c, x, y - 12, 'up', 0); oval(c, x, y - 2, 9, 2, '#c9d4e0'); },
  godown: (c, x, y) => { drawArrow(c, x, y - 12, 'down', 0); oval(c, x, y - 2, 9, 2, '#c9d4e0'); },
  cottoncandy: (c, x, y) => drawItem(c, x, y, 'cottoncandy'),
  popcorn: (c, x, y) => drawItem(c, x, y, 'popcorn'),
  hookduck: (c, x, y) => { oval(c, x, y - 3, 14, 3, PAL.water); drawDuck(c, x - 2, y - 2, 1, 0, true); px(c, x + 12, y - 22, 1, 18, PAL.woodD); },
  prize: (c, x, y) => { px(c, x - 9, y - 12, 18, 12, '#e2483d'); px(c, x - 2, y - 12, 4, 12, '#f4cf3a'); px(c, x - 11, y - 15, 22, 4, '#ff8a7a'); px(c, x - 2, y - 15, 4, 4, '#f4cf3a'); disc(c, x - 4, y - 18, 2, '#f4cf3a'); disc(c, x + 4, y - 18, 2, '#f4cf3a'); },
  whatcolor: (c, x, y) => { [[-8, -7, '#e2483d'], [0, -11, '#f4cf3a'], [8, -7, '#4f86e0']].forEach(([a, b, k]) => disc(c, x + a, y + b, 4, k)); },
});
