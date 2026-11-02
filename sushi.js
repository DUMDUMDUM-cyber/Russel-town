// Restoran sushi: sushi berputar di ban berjalan, piring yang dimakan dihitung, dan Russel bisa membuat sushi sendiri.

LOOKS.chef = { skin: '#f3c6a0', hair: '#2a1d18', style: 'cap', cap: '#ffffff', capD: '#d9dfe8', shirt: '#fbf8f0', shirtD: '#d9dfe8', pants: '#3a3a4a', shoes: '#2a2a2a' };

const SUSHI_KINDS = ['salmon', 'tuna', 'shrimp', 'eggsushi', 'cucumber'];
const SUSHI_PLATE = { salmon: '#4f86e0', tuna: '#e2483d', shrimp: '#f4cf3a', eggsushi: '#58a84a', cucumber: '#f39ac0' };
SUSHI_KINDS.forEach(k => { ITEMS[k] = { food: 1 }; });

// ================= GAMBAR SUSHI (x = tengah, y = bawah) =================
function drawSushi(c, x, y, k) {
  if (k === 'cucumber') {
    for (const dx of [-4, 4]) {
      disc(c, x + dx, y - 4, 4, '#1f3a2a'); disc(c, x + dx, y - 4, 3, '#fbfaf2'); disc(c, x + dx, y - 4, 1.5, '#58a84a'); px(c, x + dx - 3, y - 7, 2, 1, '#35574a');
    }
    return;
  }
  // nasi
  oval(c, x, y - 3, 6, 3, '#e4e0d0'); oval(c, x, y - 4, 6, 2, '#ffffff');
  if (k === 'salmon') { oval(c, x, y - 6, 7, 2, '#ec8456'); oval(c, x, y - 7, 6.5, 1.5, '#f59a6a'); for (const dx of [-4, -1, 2, 5]) px(c, x + dx, y - 8, 1, 3, '#ffd0b0'); }
  else if (k === 'tuna') { oval(c, x, y - 6, 7, 2, '#a8352b'); oval(c, x, y - 7, 6.5, 1.5, '#d9483b'); px(c, x - 4, y - 8, 4, 1, '#ff8a7a'); }
  else if (k === 'shrimp') {
    oval(c, x - 1, y - 6, 6, 2, '#e8805a'); oval(c, x - 1, y - 7, 5.5, 1.5, '#f7a27a');
    for (const dx of [-4, -1, 2]) px(c, x + dx, y - 8, 1, 3, '#fff2e8');
    px(c, x + 5, y - 8, 2, 2, '#e2483d'); px(c, x + 6, y - 9, 2, 1, '#e2483d'); px(c, x + 6, y - 6, 2, 1, '#e2483d');
  } else if (k === 'eggsushi') {
    px(c, x - 6, y - 8, 12, 3, '#f4cf3a'); px(c, x - 6, y - 8, 12, 1, '#fff2a8'); px(c, x - 6, y - 6, 12, 1, '#d9b02a');
    px(c, x - 1, y - 8, 3, 8, '#1f3a2a'); px(c, x, y - 8, 1, 8, '#35574a');
  }
}
const _drawItemBase3 = drawItem;
drawItem = function (c, x, y, type, big) {
  if (!SUSHI_KINDS.includes(type)) { _drawItemBase3(c, x, y, type, big); return; }
  x = Math.round(x); y = Math.round(y);
  oval(c, x, y - 1, 9, 2, SUSHI_PLATE[type]); oval(c, x, y - 2, 8, 1, '#ffffff');
  drawSushi(c, x, y - 2, type);
};

// ================= MEMBUAT SUSHI (jendela) =================
const SU = { step: 'rice', n: 0, kind: null, drop: 0, flash: 0, t: 0, cv: $('su-cv'), src: document.createElement('canvas') };
SU.src.width = 160; SU.src.height = 110;
SU.sctx = SU.src.getContext('2d', { willReadFrequently: true });
SU.ctx = SU.cv.getContext('2d');
PANELS.sushi = $('p-sushi');
PANELS.sushi.addEventListener('pointerdown', e => { if (e.target === PANELS.sushi) closePanel(); });
function suOption(k, onClick, big) {
  const w = word(k), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn' + (big ? ' big' : ''); b.setAttribute('aria-label', w.id);
  b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', onClick);
  return b;
}
function suRender() {
  const box = $('su-opts'); box.innerHTML = ''; box.className = 'proc';
  const order = ['rice', 'top', 'serve'], at = SU.step === 'done' ? 3 : order.indexOf(SU.step);
  $('su-steps').innerHTML = order.map((s, i) => `<span class="fstar${i < at ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('su-steps').setAttribute('aria-label', 'Langkah ' + Math.min(at + 1, 3) + ' dari 3');
  if (SU.step === 'rice') box.appendChild(suOption('rice', suRice, true));
  else if (SU.step === 'top') { box.classList.add('su-grid'); SUSHI_KINDS.forEach(k => box.appendChild(suOption(k, () => suTop(k)))); }
  else if (SU.step === 'serve') box.appendChild(suOption('plate', suServe, true));
  else { box.appendChild(suOption('letseat', suEat)); box.appendChild(suOption('makesushi', suStart)); }
}
function suStart() { SU.step = 'rice'; SU.n = 0; SU.kind = null; SU.drop = 0; suRender(); sfx('pop'); say([{ k: 'makesushi' }, { k: 'rice' }]); }
function suRice() {
  if (SU.step !== 'rice') return;
  SU.n++; SU.flash = 0.25; sfx('pop');
  if (SU.n < 2) { say([{ k: 'rice' }]); return; }
  SU.step = 'top'; suRender(); say([{ k: 'q_sushi', by: sushiChef }]);
}
function suTop(k) {
  if (SU.step !== 'top') return;
  SU.kind = k; SU.drop = 1; SU.step = 'serve'; sfx('tap'); suRender();
  say(k === 'eggsushi' || k === 'cucumber' ? [{ k }, { k: 'seaweed' }, { k: 'plate' }] : [{ k }, { k: 'plate' }]);
}
function suServe() {
  if (SU.step !== 'serve') return;
  SU.step = 'done'; SU.t = 0; sfx('sparkle'); suRender();
  const full = !bagAdd(SU.kind, G.boy.x, G.boy.y - 20, true);
  addCoins(1, G.boy.x, G.boy.y - 30);
  say(full ? [{ k: 'bagfull' }, { k: SU.kind }] : [{ k: SU.kind }, { k: 'great' }, { k: 'bag' }]);
}
function suEat() {
  const k = SU.kind; closePanel();
  if (G.bag.includes(k)) eatItem(k); else { doAct(G.boy, 'eat', 1.4); sfx('eat'); say([{ k }, { k: 'yummy', by: G.boy }]); }
}
function suOpen() { suStart(); }
PANEL_HOOK.sushi = dt => {
  const c = SU.sctx, t = G.t;
  SU.drop = Math.max(0, SU.drop - dt * 2.4); SU.flash = Math.max(0, SU.flash - dt); SU.t += dt;
  // dinding kayu, tirai, meja, tikar bambu
  drawPlanks(c, 0, 0, 160, 66, ['#d9b98a', '#d4b284', '#dec090'], '#b8966a', 84, 11, 50);
  px(c, 34, 0, 92, 14, '#2f4a7a'); for (let x = 34; x < 126; x += 18) { px(c, x, 8, 1, 6, '#1f3258'); }
  px(c, 34, 0, 92, 2, '#1f3258');
  for (let i = 0; i < 3; i++) { const lx = 56 + i * 24; px(c, lx - 3, 5, 7, 3, '#ffffff'); px(c, lx + 3, 4, 2, 5, '#ffffff'); px(c, lx - 2, 6, 1, 1, '#2f4a7a'); }
  disc(c, 16, 26, 8, '#a8352b'); disc(c, 16, 26, 7, '#e2483d'); px(c, 9, 24, 15, 1, '#a8352b'); px(c, 9, 28, 15, 1, '#a8352b'); px(c, 14, 16, 4, 2, RB_K); px(c, 14, 34, 4, 2, RB_K);
  disc(c, 144, 26, 8, '#a8352b'); disc(c, 144, 26, 7, '#e2483d'); px(c, 137, 24, 15, 1, '#a8352b'); px(c, 137, 28, 15, 1, '#a8352b'); px(c, 142, 16, 4, 2, RB_K); px(c, 142, 34, 4, 2, RB_K);
  px(c, 0, 64, 160, 2, 'rgba(60,35,20,0.25)');
  px(c, 0, 66, 160, 44, '#a87c50'); px(c, 0, 66, 160, 3, '#c49868'); for (const [x, y, w] of [[8, 76, 28], [120, 80, 30], [40, 100, 34], [100, 104, 24]]) px(c, x, y, w, 1, '#8a6238');
  // tikar bambu
  px(c, 36, 74, 88, 30, '#6f8a3a'); for (let x = 37; x < 124; x += 3) px(c, x, 74, 2, 30, '#a8c060'); px(c, 36, 74, 88, 2, '#5a7030'); px(c, 36, 102, 88, 2, '#5a7030');
  oval(c, 80, 92, 25, 6, 'rgba(30,40,10,0.28)');
  // sushi besar di atas tikar
  if (SU.step === 'rice') {
    if (SU.n === 0) { for (const [a, b] of [[-8, -2], [0, -4], [8, -2], [-4, -7], [4, -7]]) { disc(c, 80 + a, 88 + b, 5, '#e4e0d0'); disc(c, 80 + a, 87 + b, 4, '#ffffff'); } }
    else { oval(c, 80, 86, 20, 8, '#e4e0d0'); oval(c, 80, 84, 19, 7, '#ffffff'); }
    if (Math.floor(t * 2.5) % 2) drawStar(c, 110, 74, '#ffd84a');
  } else if (SU.step === 'top') {
    oval(c, 80, 86, 22, 9, '#e4e0d0'); oval(c, 80, 83, 22, 8, '#ffffff'); for (const [a, b] of [[-12, 84], [-3, 81], [8, 85], [14, 81]]) px(c, 80 + a, b, 3, 1, '#ece8da');
  } else {
    const dy = Math.round(-SU.drop * SU.drop * 50);
    if (SU.kind === 'cucumber' || SU.step === 'done') {
      if (SU.step === 'done') { oval(c, 80, 92, 34, 7, '#d9dfe8'); oval(c, 80, 90, 34, 6, SUSHI_PLATE[SU.kind]); oval(c, 80, 89, 30, 5, '#ffffff'); }
      drawBig(c, 80, 88 + (SU.step === 'done' ? 0 : dy), 3, (cc, ax, ay) => drawSushi(cc, ax, ay, SU.kind));
    } else {
      drawBig(c, 80, 90, 3, (cc, ax, ay) => { oval(cc, ax, ay - 3, 6, 3, '#e4e0d0'); oval(cc, ax, ay - 4, 6, 2, '#ffffff'); });
      drawBig(c, 80, 90 + dy, 3, (cc, ax, ay) => drawSushi(cc, ax, ay, SU.kind));
    }
    if (SU.step === 'serve' && Math.floor(t * 2.5) % 2) drawStar(c, 118, 74, '#ffd84a');
    if (SU.step === 'done') for (let i = 0; i < 6; i++) { const a = t * 2 + i * 1.05; drawStar(c, Math.round(80 + Math.cos(a) * 52), Math.round(62 + Math.sin(a) * 26), i % 2 ? '#ffd84a' : '#fff2a8'); }
  }
  // sumpit di tepi meja
  px(c, 130, 80, 2, 26, '#7d5230'); px(c, 134, 80, 2, 26, '#a8743c');
  SU.ctx.drawImage(upscale4(SU.src), 0, 0);
};
SU.cv.addEventListener('pointerdown', () => {
  if (SU.step === 'rice') suRice();
  else if (SU.step === 'serve') suServe();
  else if (SU.step === 'top') say([{ k: 'q_sushi' }]);
  else say([{ k: SU.kind }]);
});
$('su-title').innerHTML = rubyHTML(word('makesushi').zh, word('makesushi').py);
$('su-title').addEventListener('click', () => say([{ k: 'makesushi' }]));

// ================= TEMPAT: RESTORAN SUSHI =================
let sushiChef = null;
SCENES.sushibar = (() => {
  const S = {
    id: 'sushibar', place: 'sushibar', outdoor: false, walk: [8, 120, 312, 174], spawn: [18, 152],
    blocks: [[236, 146, 56, 12]], objs: [], lights: [[60, 42, 36], [160, 42, 40], [270, 42, 36]], plates: 0,
  };
  const COUNTER = [24, 296];
  S.bg = c => {
    // dinding kayu, papan bawah, lantai kayu gelap
    drawPlanks(c, 0, 0, W, 112, ['#d9b98a', '#d4b284', '#dec090'], '#b8966a', 81, 11, 56);
    px(c, 0, 62, W, 50, '#8a6238'); px(c, 0, 62, W, 1, '#a87c50');
    for (let x = 6; x < W; x += 22) { px(c, x, 66, 16, 42, '#94683f'); px(c, x, 66, 16, 1, '#7d5230'); px(c, x, 107, 16, 1, '#a87c50'); }
    drawPlanks(c, 0, 112, W, 68, ['#a87c50', '#a27648', '#ae8458'], '#8a6238', 82);
    wallFoot(c, 112);
    px(c, 0, 0, 4, H, '#6b4a2e'); px(c, 316, 0, 4, H, '#6b4a2e'); px(c, 0, 176, W, 4, '#6b4a2e');
    px(c, 0, 136, 4, 32, '#3a2616'); px(c, 4, 140, 14, 24, '#2f4a7a'); px(c, 5, 141, 12, 22, '#4f6f9f'); for (let y = 143; y < 162; y += 4) px(c, 6, y, 10, 1, '#2f4a7a');
    bgOutlined(c, cc => {
      // tirai noren di belakang koki
      px(cc, 112, 30, 96, 2, RB_K);
      for (let i = 0; i < 4; i++) { const nx = 114 + i * 23; px(cc, nx, 32, 22, 20, '#2f4a7a'); px(cc, nx, 32, 22, 2, '#1f3258'); px(cc, nx + 21, 34, 1, 18, '#1f3258'); }
      for (const [fx, col] of [[125, '#ffffff'], [148, '#f59a6a'], [171, '#ffffff'], [194, '#f59a6a']]) { px(cc, fx - 4, 40, 8, 4, col); px(cc, fx + 4, 39, 2, 6, col); px(cc, fx - 3, 41, 1, 1, RB_K); }
      // lampion
      for (const x of [44, 80]) { px(cc, x, 28, 1, 4, RB_K); disc(cc, x, 40, 8, '#a8352b'); disc(cc, x - 0.5, 39.5, 7, '#e2483d'); px(cc, x - 7, 37, 14, 1, '#a8352b'); px(cc, x - 7, 42, 14, 1, '#a8352b'); px(cc, x - 3, 31, 7, 2, RB_K); px(cc, x - 3, 48, 7, 2, RB_K); px(cc, x - 4, 35, 3, 1, '#ff9a8a'); }
      // kertas menu bergambar sushi
      px(cc, 222, 32, 18, 24, '#fff6d8'); px(cc, 222, 32, 18, 2, '#e2483d'); drawSushi(cc, 231, 45, 'salmon'); drawSushi(cc, 231, 54, 'tuna');
    });
  };
  // akuarium di dinding
  S.objs.push({ x: 272, y: 72, hit: [248, 28, 48, 46], go: [272, 122], draw(c, t) { drawAquarium(c, 272, 72, t); }, tap() { say([{ k: 'fish' }]); sfx('bubbles'); } });

  sushiChef = npc('chef', 160, 84, 'down', {
    go: [160, 122],
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'q_sushi', by: 'np' }, { k: 'salmon', by: 'me' }],
      [{ k: 'chef', by: 'me' }, { k: 'q_hungry', by: 'np' }, { k: 'a_hungry', by: 'me' }],
      [{ k: 'letseat', by: 'me' }, { k: 'welcome', by: 'np' }],
    ],
  });
  S.objs.push(sushiChef);

  // meja dengan ban berjalan (digambar di depan koki, menutupi kakinya)
  S.objs.push({ y: 100, hit: [COUNTER[0], 96, COUNTER[1] - COUNTER[0], 18], go: null,
    draw(c, t) {
      const [a, b] = COUNTER, w = b - a;
      px(c, a, 76, w, 3, PAL.woodL); px(c, a, 79, w, 5, PAL.wood);
      px(c, a, 84, w, 12, RB_K); px(c, a, 84, w, 1, '#70768a'); px(c, a, 95, w, 1, '#20242e');
      const off = Math.floor(t * 12) % 10;
      for (let x = a + off; x < b; x += 10) px(c, x, 85, 1, 10, '#54596a');
      px(c, a, 96, w, 18, PAL.wood); px(c, a, 96, w, 2, PAL.woodL); px(c, a, 112, w, 2, PAL.woodD);
      for (let x = a + 6; x + 24 < b; x += 34) { px(c, x, 99, 24, 11, '#a06c3c'); px(c, x, 99, 24, 1, PAL.woodD); px(c, x + 23, 99, 1, 11, PAL.woodL); }
      // tumpukan piring yang sudah dimakan
      const px0 = a + 16;
      for (let i = 0; i < S.plates; i++) { px(c, px0 - 7, 82 - i * 2, 14, 2, '#ffffff'); px(c, px0 - 7, 83 - i * 2, 14, 1, ['#4f86e0', '#e2483d', '#f4cf3a', '#58a84a', '#f39ac0'][i % 5]); }
      // teko teh
      px(c, b - 22, 71, 11, 8, '#58745a'); px(c, b - 22, 71, 11, 1, '#7c9a7e'); px(c, b - 25, 73, 3, 2, '#58745a'); px(c, b - 11, 72, 2, 4, '#3f5a42'); px(c, b - 19, 69, 5, 2, '#3f5a42');
      px(c, a + 44, 80, 1, 3, RB_K); for (const x of [a + 34, a + 37]) px(c, x, 78, 1, 6, '#a8743c');
    },
    tap() { if (S.plates) sayCount(S.plates, 'plate', '个', 'gè'); else say([{ k: 'sushi' }]); } });

  // piring sushi di ban berjalan
  const released = p => { p.hold = false; p.holdT = 0; };
  for (let i = 0; i < 6; i++) {
    S.objs.push({
      kind: SUSHI_KINDS[i % 5], x: COUNTER[0] + 34 + i * 44, y: 101, gone: 0, hold: false, holdT: 0,
      get hidden() { return this.gone > 0; },
      get hit() { return [this.x - 12, 78, 24, 18]; },
      get go() { return [Math.max(16, Math.min(304, this.x)), 122]; },
      draw(c) { drawItem(c, this.x, 94, this.kind); },
      update(dt) {
        if (this.gone > 0) { this.gone -= dt; if (this.gone <= 0) { this.x = COUNTER[0] + 2; this.kind = SUSHI_KINDS[Math.floor(Math.random() * 5)]; } return; }
        if (this.hold) { this.holdT -= dt; if (this.holdT <= 0) released(this); return; }
        this.x += 11 * dt;
        if (this.x > COUNTER[1] - 6) this.x = COUNTER[0] + 6;
      },
      tap() { this.hold = true; this.holdT = 8; say([{ k: this.kind }]); },
      arrive() {
        G.boy.dir = 'up';
        offerChoice(this.x, 72, [
          { act: 'eat', fn: () => {
            if (this.gone > 0) return;
            this.gone = 5; released(this);
            doAct(G.boy, 'eat', 1.4); sfx('eat'); fx('heart', this.x, 84, 2);
            S.plates = S.plates % 10 + 1;
            const n = S.plates, card = countWord(n, 'plate', '个', 'gè');
            say([{ k: 'letseat', by: G.boy }, { k: this.kind }, { k: 'yummy', by: G.boy }, { card, zh: card.zh }]);
          } },
          { act: 'take', fn: () => { if (this.gone <= 0 && bagAdd(this.kind, this.x, 86)) { this.gone = 5; released(this); } } },
        ]);
      },
    });
  }

  // bangku tinggi di depan meja
  const SEATS = [66, 118, 202, 252];
  SEATS.forEach(x => S.objs.push({ y: 121, x, hit: [x - 8, 108, 16, 14], go: [x, 124],
    draw(c) {
      shadow(c, x, 121, 7);
      px(c, x - 1, 112, 3, 9, RB_MD); px(c, x - 4, 120, 9, 1, RB_MD);
      oval(c, x, 111, 7, 2, '#a8352b'); oval(c, x, 110, 7, 2, '#e2483d');
    },
    tap() { say([{ k: 'chair' }]); },
    arrive() {
      const b = G.boy; if (b.ride) return;
      b.dir = 'up';
      b.ride = () => { b.x = x; b.y = 112; b.frame = 0; };
      b.rideEnd = () => { b.x = x; b.y = 124; };
      say([{ k: 'sitdown' }, { k: 'q_sushi', by: sushiChef }]);
    } }));
  const guest = npc('auntie', 118, 112, 'up', { go: [118, 124], lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_apple', by: 'np' }, { k: 'a_like', by: 'me' }], [{ k: 'yummy', by: 'np' }]] });
  S.objs.push(guest);

  // meja kecil untuk membuat sushi
  S.objs.push({ x: 264, y: 158, hit: [234, 128, 60, 32], go: [264, 164],
    draw(c, t) {
      shadow(c, 264, 158, 30);
      px(c, 238, 148, 3, 10, PAL.woodD); px(c, 287, 148, 3, 10, PAL.woodD);
      px(c, 236, 141, 56, 7, PAL.wood); px(c, 236, 141, 56, 2, PAL.woodL); px(c, 236, 147, 56, 1, PAL.woodD);
      px(c, 246, 137, 24, 5, '#6f8a3a'); for (let x = 247; x < 270; x += 3) px(c, x, 137, 2, 5, '#a8c060');
      oval(c, 280, 139, 7, 2, '#c5d2e0'); oval(c, 280, 138, 6, 2, '#ffffff'); drawSushi(c, 258, 141, 'tuna');
      if (Math.floor(t * 2) % 2) drawStar(c, 264, 128, '#ffd84a');
    },
    tap() { say([{ k: 'makesushi' }]); },
    arrive() { G.boy.dir = 'up'; openPanel('sushi'); suOpen(); } });

  // robot pelayan: memberi teh
  S.objs.push({ x: 120, y: 150, dir: 1, t0: 0, wait: 0,
    get hit() { return [this.x - 9, this.y - 22, 18, 23]; }, get go() { return [this.x + (G.boy.x < this.x ? -16 : 16), this.y + 1]; },
    draw(c, t) {
      const x = Math.round(this.x), y = Math.round(this.y);
      shadow(c, x, y, 7);
      disc(c, x - 4, y - 2, 2, RB_K); disc(c, x + 4, y - 2, 2, RB_K);
      px(c, x - 6, y - 12, 12, 9, '#e8eef2'); px(c, x - 6, y - 12, 12, 1, '#ffffff'); px(c, x + 3, y - 11, 3, 8, '#c9d4e0');
      px(c, x - 4, y - 10, 8, 4, RB_SCREEN); px(c, x - 3, y - 9, 2, 2, RB_EYE); px(c, x + 1, y - 9, 2, 2, RB_EYE);
      px(c, x - 9, y - 15, 18, 2, '#a8743c'); px(c, x - 9, y - 15, 18, 1, '#d39b5f'); px(c, x - 1, y - 13, 2, 1, RB_MD);
      px(c, x - 5, y - 19, 5, 4, '#ffffff'); px(c, x - 5, y - 19, 5, 1, '#8fb45a'); px(c, x + 2, y - 19, 4, 4, '#58745a');
      px(c, x, y - 24, 1, 3, RB_MD); px(c, x, y - 25, 1, 1, Math.floor(t * 2) % 2 ? '#e2483d' : '#ff9a8a');
    },
    update(dt) {
      if (this.wait > 0) { this.wait -= dt; return; }
      this.t0 += dt * 0.32;
      const nx = 130 + Math.sin(this.t0) * 72;
      this.dir = nx > this.x ? 1 : -1; this.x = nx; this.y = 152 + Math.sin(this.t0 * 2.1) * 12;
    },
    tap() { this.wait = 6; sfx('chime'); say([{ k: 'robot' }]); },
    arrive() { const b = G.boy; b.dir = this.x < b.x ? 'left' : 'right'; doAct(b, 'eat', 1.2); sfx('water'); fx('heart', b.x, b.y - 30, 2); say([{ k: 'tea' }, { k: 'yummy', by: b }, { k: 'thanks', by: b }]); } });

  S.enter = () => { S.plates = 0; };
  S.exits = [{ hit: [0, 134, 24, 36], arrow: [12, 152, 'left'], go: [6, 152], to: 'beach', at: [296, 118] }];
  return S;
})();

// ================= PONDOK DI PANTAI & JALAN MASUK =================
(function beachDoor() {
  const B = SCENES.beach, baseBg = B.bg;
  B.bg = c => {
    baseBg(c);
    bgOutlined(c, cc => {
      shadow(cc, 302, 116, 18);
      px(cc, 288, 92, 32, 24, '#e8d8b4'); for (let y = 96; y < 116; y += 4) px(cc, 288, y, 32, 1, '#d4c098');
      for (const x of [290, 316]) px(cc, x, 112, 3, 6, PAL.woodD);
      px(cc, 284, 84, 36, 9, '#2f4a7a'); for (let y = 86; y < 93; y += 3) px(cc, 284, y, 36, 1, '#1f3258'); px(cc, 284, 84, 36, 1, '#4f6f9f');
      for (let i = 0; i < 3; i++) { px(cc, 292 + i * 9, 93, 8, 10, '#e2483d'); px(cc, 292 + i * 9, 93, 8, 1, '#a8352b'); }
      px(cc, 294, 97, 4, 2, '#ffffff'); px(cc, 298, 96, 1, 4, '#ffffff'); px(cc, 303, 97, 4, 2, '#ffffff'); px(cc, 307, 96, 1, 4, '#ffffff');
      px(cc, 292, 103, 26, 13, '#3a2a20'); px(cc, 292, 103, 26, 2, '#20150f');
    });
  };
  B.exits.push({ hit: [288, 92, 32, 40], arrow: [306, 122, 'right'], go: [314, 118], to: 'sushibar', at: [18, 152] });
})();

// ================= GAMBAR STIKER =================
const stSushi = k => (c, x, y) => drawItem(c, x, y, k);
Object.assign(ST_ART, {
  sushibar: (c, x, y) => { drawHouse(c, x - 16, y - 28, 32, 26, { roof: '#2f4a7a', roofD: '#1f3258', roofL: '#4f6f9f', wall: '#e8d8b4', wallD: '#d4c098' }); for (let i = 0; i < 3; i++) { px(c, x - 12 + i * 8, y - 15, 7, 8, '#e2483d'); } },
  sushi: (c, x, y) => { drawItem(c, x - 8, y, 'salmon'); drawItem(c, x + 8, y, 'tuna'); },
  chef: (c, x, y) => drawPerson(c, x, y, { look: 'chef', dir: 'down', mood: 'happy', noShadow: true }),
  salmon: stSushi('salmon'), tuna: stSushi('tuna'), shrimp: stSushi('shrimp'), eggsushi: stSushi('eggsushi'), cucumber: stSushi('cucumber'),
  seaweed: (c, x, y) => { px(c, x - 9, y - 14, 18, 14, '#1f3a2a'); px(c, x - 9, y - 14, 18, 2, '#35574a'); for (const [a, b] of [[-6, -10], [1, -8], [5, -4], [-4, -4]]) px(c, x + a, y + b, 3, 1, '#35574a'); },
  chopsticks: (c, x, y) => { for (let k = 0; k < 18; k++) { px(c, x - 8 + Math.round(k * 0.7), y - k, 2, 1, '#a8743c'); px(c, x - 3 + Math.round(k * 0.7), y - k, 2, 1, '#7d5230'); } },
  plate: (c, x, y) => { oval(c, x, y - 3, 12, 3, '#4f86e0'); oval(c, x, y - 4, 11, 2, '#ffffff'); },
  tea: (c, x, y) => { px(c, x - 5, y - 10, 10, 10, '#58745a'); px(c, x - 5, y - 10, 10, 2, '#8fb45a'); px(c, x - 3, y - 7, 2, 5, '#7c9a7e'); px(c, x - 1, y - 14, 1, 3, '#c9c6c0'); px(c, x + 2, y - 15, 1, 3, '#c9c6c0'); },
  makesushi: (c, x, y) => { px(c, x - 12, y - 3, 24, 3, '#6f8a3a'); drawSushi(c, x, y - 3, 'salmon'); drawHeart(c, x + 10, y - 14); },
  q_sushi: (c, x, y) => { drawItem(c, x - 5, y, 'salmon'); px(c, x + 8, y - 16, 6, 2, '#4f86e0'); px(c, x + 12, y - 15, 2, 5, '#4f86e0'); px(c, x + 9, y - 11, 4, 2, '#4f86e0'); px(c, x + 9, y - 7, 3, 2, '#4f86e0'); },
  letseat: (c, x, y) => { drawItem(c, x - 2, y, 'tuna'); for (let k = 0; k < 14; k++) { px(c, x + 2 + Math.round(k * 0.7), y - 8 - k, 1, 1, '#a8743c'); px(c, x + 5 + Math.round(k * 0.7), y - 8 - k, 1, 1, '#7d5230'); } },
});
