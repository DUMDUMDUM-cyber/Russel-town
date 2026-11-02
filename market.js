// Memasak bersama Ibu, pasar desa (jual & beli dengan koin), dan kamar Russel yang bisa dihias.

// ================= HIASAN KAMAR (gambar) =================
function drawDecor(c, x, y, k, t) {
  x = Math.round(x); y = Math.round(y);
  if (k === 'bear') {
    disc(c, x, y - 5, 5, '#a8743c'); disc(c, x, y - 13, 5, '#a8743c'); disc(c, x - 4, y - 17, 2, '#8a5a35'); disc(c, x + 4, y - 17, 2, '#8a5a35');
    oval(c, x, y - 11, 3, 2, '#e8c49a'); px(c, x - 2, y - 15, 1, 2, '#2a1d18'); px(c, x + 2, y - 15, 1, 2, '#2a1d18'); px(c, x, y - 12, 1, 1, '#2a1d18');
    disc(c, x - 5, y - 2, 2, '#8a5a35'); disc(c, x + 5, y - 2, 2, '#8a5a35'); px(c, x - 3, y - 8, 6, 1, '#e2483d');
  } else if (k === 'toytrain') {
    px(c, x - 9, y - 8, 14, 6, '#d9483b'); px(c, x - 9, y - 12, 6, 5, '#a8352b'); px(c, x - 8, y - 11, 3, 2, '#fff2c8'); px(c, x + 2, y - 11, 2, 3, '#3a3a3a');
    disc(c, x - 6, y - 2, 2, '#2a2a2e'); disc(c, x + 2, y - 2, 2, '#2a2a2e');
  } else if (k === 'toyrobot') {
    const b = Math.floor(t * 6) % 2;
    px(c, x - 3, y - 2, 2, 2, '#4a4a52'); px(c, x + 1, y - 2, 2, 2, '#4a4a52');
    px(c, x - 4, y - 8 - b, 8, 6, '#c9d4e0'); px(c, x - 2, y - 6 - b, 4, 2, '#4f86e0');
    px(c, x - 4, y - 14 - b, 8, 6, '#e8eef2'); px(c, x - 3, y - 13 - b, 6, 3, '#2a3a4a'); px(c, x - 2, y - 12 - b, 1, 1, '#7cf0c4'); px(c, x + 1, y - 12 - b, 1, 1, '#7cf0c4');
    px(c, x, y - 17 - b, 1, 3, '#7d8a98'); px(c, x, y - 18 - b, 1, 1, '#e2483d');
  } else if (k === 'lamp') {
    px(c, x - 7, y - 10, 14, 10, '#a8743c'); px(c, x - 8, y - 11, 16, 2, '#d39b5f'); px(c, x, y - 18, 1, 7, '#5a3a22');
    for (let r = 0; r < 6; r++) px(c, x - 3 - r, y - 25 + r, 7 + r * 2, 1, '#ffd84a');
  } else if (k === 'rug') {
    oval(c, x, y - 5, 26, 7, '#c9473a'); oval(c, x, y - 5, 22, 5, '#f4cf3a'); oval(c, x, y - 5, 17, 3, '#4f86e0');
  } else if (k === 'painting') {
    px(c, x - 11, y - 17, 22, 17, PAL.woodD); px(c, x - 9, y - 15, 18, 13, '#8fd0f2');
    for (let r = 0; r < 6; r++) px(c, x - 3 - r, y - 9 + r, r * 2 + 1, 1, '#58a84a');
    px(c, x - 9, y - 4, 18, 2, '#7cc85a'); disc(c, x + 5, y - 12, 2, '#ffd84a');
  } else if (k === 'potplant') {
    px(c, x - 5, y - 8, 10, 8, '#c9673a'); px(c, x - 6, y - 9, 12, 2, '#e08a5a');
    disc(c, x, y - 15, 5, '#4a9a3a'); disc(c, x - 4, y - 12, 3, '#58a84a'); disc(c, x + 4, y - 12, 3, '#3f8a3a'); px(c, x - 1, y - 18, 2, 2, '#7cc85a');
  }
}

// ================= MEMASAK =================
const COOK = {
  tomatoegg: { ing: ['tomato', 'egg'], steps: ['washveg', 'cut', 'stir', 'boil', 'serve'] },
  carrotsoup: { ing: ['carrot', 'water'], steps: ['washveg', 'cut', 'boil', 'stir', 'serve'] },
  applejuice: { ing: ['apple'], steps: ['washveg', 'cut', 'stir', 'serve'] },
};
const COOK_TAPS = { washveg: 2, cut: 3, stir: 3, boil: 1, serve: 1 };
const CK = { rec: null, i: 0, n: 0, wait: 0, flash: 0, done: 0, cv: $('cook-cv'), src: document.createElement('canvas') };
CK.src.width = 160; CK.src.height = 110;
CK.sctx = CK.src.getContext('2d', { willReadFrequently: true });
CK.ctx = CK.cv.getContext('2d');
PANELS.cook = $('p-cook');
PANELS.cook.addEventListener('pointerdown', e => { if (e.target === PANELS.cook) closePanel(); });
const bigItem = (c, x, y, k, s = 3) => drawBig(c, x, y, s, (cc, ax, ay) => drawItem(cc, ax, ay, k, true));
function cookSteps() {
  const steps = CK.rec ? COOK[CK.rec].steps : [];
  $('cook-steps').innerHTML = steps.map((k, i) => `<span class="fstar${i <= CK.i ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  document.querySelectorAll('#cook-recipes [data-rec]').forEach(b => b.setAttribute('aria-pressed', b.dataset.rec === CK.rec ? 'true' : 'false'));
}
function cookStart(rec) {
  CK.rec = rec; CK.i = 0; CK.n = 0; CK.wait = 0; CK.done = 0;
  COOK[rec].ing.forEach(k => { if (G.bag.includes(k)) bagTake(k); }); // bahan dari tas dipakai; kalau tidak ada, Ibu punya persediaan
  cookSteps(); sfx('pop');
  say([{ k: rec }, { k: COOK[rec].steps[0] }]);
}
function cookOpen() {
  CK.rec = null; CK.done = 0; cookSteps();
  say([{ k: 'cook', by: momHome }]);
}
function cookNext() {
  CK.i++; CK.n = 0; cookSteps();
  say([{ k: COOK[CK.rec].steps[CK.i] }]);
}
function cookTap() {
  if (!CK.rec || CK.wait > 0 || CK.done > 0) return;
  const step = COOK[CK.rec].steps[CK.i];
  CK.n++; CK.flash = 0.3;
  sfx(step === 'washveg' ? 'water' : step === 'cut' ? 'tap' : step === 'stir' ? 'pop' : 'tap');
  if (CK.n < COOK_TAPS[step]) return;
  if (step === 'boil') { CK.wait = 1.8; sfx('bubbles'); return; }
  if (step === 'serve') {
    CK.done = 2.6; sfx('sparkle');
    const full = !bagAdd(CK.rec, G.boy.x, G.boy.y - 20, true);
    addCoins(1, G.boy.x, G.boy.y - 30);
    say(full ? [{ k: 'bagfull' }, { k: CK.rec }] : [{ k: CK.rec }, { k: 'great' }, { k: 'bag' }]);
    return;
  }
  cookNext();
}
PANEL_HOOK.cook = dt => {
  const c = CK.sctx, t = G.t;
  CK.flash = Math.max(0, CK.flash - dt);
  // dapur: dinding ubin, jendela bertirai, rak, dan meja kayu
  px(c, 0, 0, 160, 74, '#f6ecd6');
  for (let y = 0; y < 74; y += 12) { px(c, 0, y, 160, 1, '#e6d8bc'); for (let x = (y / 12 % 2) * 6; x < 160; x += 12) px(c, x, y, 1, 12, '#e6d8bc'); }
  px(c, 12, 6, 38, 30, PAL.woodD); px(c, 14, 8, 34, 26, G.night ? '#26305e' : '#8fd0f2');
  if (!G.night) { px(c, 14, 28, 34, 6, '#7cc85a'); disc(c, 40, 15, 3, '#ffd84a'); oval(c, 24, 14, 5, 1, '#ffffff'); }
  px(c, 30, 8, 2, 26, PAL.woodD); px(c, 14, 20, 34, 2, PAL.woodD); px(c, 10, 36, 42, 2, PAL.woodL);
  px(c, 12, 5, 9, 16, '#e8735a'); px(c, 41, 5, 9, 16, '#e8735a'); for (const x of [14, 18, 43, 47]) px(c, x, 5, 1, 16, '#c9473a'); px(c, 10, 4, 42, 2, PAL.woodD);
  px(c, 104, 22, 48, 3, PAL.woodD); px(c, 104, 22, 48, 1, PAL.woodL);
  [[110, '#e2483d'], [122, '#f4cf3a'], [134, '#58a84a'], [146, '#4f86e0']].forEach(([x, k]) => { px(c, x - 3, 13, 7, 9, k); px(c, x - 2, 11, 5, 2, '#fff6e0'); px(c, x - 2, 14, 1, 6, 'rgba(255,255,255,0.45)'); px(c, x + 2, 14, 2, 8, 'rgba(0,0,0,0.1)'); });
  px(c, 0, 72, 160, 2, 'rgba(60,35,20,0.2)');
  px(c, 0, 74, 160, 36, '#b27a45'); px(c, 0, 74, 160, 3, '#d39b5f'); px(c, 0, 77, 160, 1, '#94683a');
  for (const [x, y, w] of [[8, 84, 26], [46, 92, 34], [96, 86, 22], [126, 96, 24], [18, 100, 30], [80, 101, 20]]) px(c, x, y, w, 1, '#a06c3c');
  px(c, 0, 106, 160, 4, '#7d5230');
  const pot = (x, y, col) => {
    oval(c, x, y + 1, 30, 3, 'rgba(50,30,15,0.25)');
    px(c, x - 24, y - 20, 48, 20, '#7d8a98'); px(c, x - 24, y - 1, 48, 1, '#5f6c7a'); px(c, x - 22, y, 44, 1, '#5f6c7a');
    px(c, x - 24, y - 15, 6, 14, '#a9b6c4'); px(c, x + 16, y - 15, 8, 14, '#67747f');
    px(c, x - 25, y - 21, 50, 3, '#c6d0da'); px(c, x - 22, y - 19, 44, 5, col); px(c, x - 22, y - 19, 44, 1, 'rgba(255,255,255,0.35)');
    px(c, x - 30, y - 16, 6, 3, '#4a4a52'); px(c, x - 30, y - 16, 6, 1, '#6a6a72'); px(c, x + 24, y - 16, 6, 3, '#4a4a52'); px(c, x + 24, y - 16, 6, 1, '#6a6a72');
  };
  if (!CK.rec) {
    drawPerson(c, 80, 96, { look: 'mom', dir: 'down', mood: 'happy', act: 'wave', actT: t, noShadow: true });
    pot(120, 96, '#f6d35a');
  } else {
    const r = COOK[CK.rec], step = r.steps[CK.i], A = r.ing[0], B = r.ing[1] || r.ing[0];
    if (CK.done > 0) {
      CK.done -= dt;
      oval(c, 80, 92, 34, 8, '#ffffff'); oval(c, 80, 91, 28, 5, '#e8eef2');
      bigItem(c, 80, 92, CK.rec, 4);
      for (let i = 0; i < 6; i++) { const a = t * 2 + i; drawStar(c, Math.round(80 + Math.cos(a) * 46), Math.round(50 + Math.sin(a) * 24), '#ffd84a'); }
      if (CK.done <= 0) { CK.rec = null; cookSteps(); }
    } else if (step === 'washveg') {
      oval(c, 80, 96, 34, 9, '#a9b6c4'); oval(c, 80, 94, 30, 7, '#5fb3e0');
      bigItem(c, 66, 88 - (CK.flash > 0 ? 6 : 0), A); bigItem(c, 96, 88, B);
      px(c, 76, 26, 8, 6, '#7d8a98'); px(c, 80, 32, 2, 4, '#7d8a98');
      for (let i = 0; i < 8; i++) px(c, 78 + (i % 3) * 2, 38 + ((t * 70 + i * 7) % 44), 1, 3, '#7cc4f0');
      if (CK.flash > 0) for (let i = 0; i < 5; i++) disc(c, 58 + i * 11, 80 - i % 2 * 6, 1, '#cfefff');
    } else if (step === 'cut') {
      px(c, 40, 86, 80, 12, '#d9b98a'); px(c, 40, 86, 80, 2, '#ead2a8'); px(c, 40, 96, 80, 2, '#a8865a');
      if (CK.n === 0) bigItem(c, 72, 90, A);
      else for (let i = 0; i <= CK.n; i++) bigItem(c, 50 + i * 20, 90, A, 2);
      const ky = CK.flash > 0 ? 62 : 44, kx = 62 + CK.n * 20;
      px(c, kx, ky, 3, 26, '#dfe6ee'); px(c, kx + 3, ky + 2, 1, 22, '#a9b6c4'); px(c, kx - 1, ky - 12, 5, 12, '#5a3a22');
    } else if (step === 'stir' || step === 'boil') {
      const boil = step === 'boil';
      if (boil) { px(c, 44, 96, 72, 10, '#3a3f4a'); const fl = CK.wait > 0 ? 8 : 4; for (let i = 0; i < 8; i++) px(c, 50 + i * 8, 96 - Math.floor(((t * 12 + i * 3) % fl)), 3, 3, i % 2 ? '#f08a32' : '#ffd84a'); }
      pot(80, boil ? 94 : 100, CK.rec === 'carrotsoup' ? '#f08a32' : CK.rec === 'applejuice' ? '#f4c23a' : '#f6d35a');
      const py = boil ? 80 : 86, turn = t * 2 + CK.n * 2;
      for (let i = 0; i < 6; i++) { const a = turn + i * 1.05; const kind = i % 2 ? A : B; if (kind === 'egg') px(c, Math.round(80 + Math.cos(a) * 16), py + Math.round(Math.sin(a) * 2), 3, 2, '#fff2a8'); else px(c, Math.round(80 + Math.cos(a) * 16), py + Math.round(Math.sin(a) * 2), 3, 2, kind === 'tomato' ? '#e2483d' : kind === 'carrot' ? '#d8701e' : kind === 'apple' ? '#ff9a8a' : '#ffffff'); }
      if (!boil) { const sx = Math.round(80 + Math.cos(turn) * 12); px(c, sx, 50, 3, 36, '#a8743c'); oval(c, sx + 1, 86, 3, 2, '#7d5230'); }
      if (boil) for (let i = 0; i < 6; i++) px(c, 62 + i * 7, 74 - Math.floor((t * 14 + i * 5) % 22), 1, 3, 'rgba(255,255,255,0.8)');
      if (CK.wait > 0) { CK.wait -= dt; if (CK.wait <= 0) cookNext(); }
    } else {
      oval(c, 80, 94, 28, 7, '#ffffff'); oval(c, 80, 93, 23, 4, '#e8eef2');
      bigItem(c, 80, 94, CK.rec);
    }
    // tanda "ketuk di sini"
    if (!CK.wait && CK.done <= 0 && Math.floor(t * 2) % 2) { for (let i = 0; i < 4; i++) { px(c, 138, 50 + i, 8 - i * 2 + 1, 1, '#ffd84a'); } px(c, 141, 42, 3, 8, '#ffd84a'); }
  }
  CK.ctx.drawImage(upscale4(CK.src), 0, 0);
};
CK.cv.addEventListener('pointerdown', cookTap);
(function cookUI() {
  $('cook-title').innerHTML = rubyHTML(word('cook').zh, word('cook').py);
  $('cook-title').addEventListener('click', () => say([{ k: 'cook' }]));
})();
// tombol resep dibuat setelah stiker tersedia (di bagian bawah file)

// ================= PASAR DESA =================
const GOODS = [{ k: 'bun', p: 1 }, { k: 'apple', p: 1 }, { k: 'watermelon', p: 2 }, { k: 'potplant', p: 3, d: 1 }, { k: 'painting', p: 3, d: 1 },
  { k: 'lamp', p: 4, d: 1 }, { k: 'rug', p: 4, d: 1 }, { k: 'bear', p: 5, d: 1 }, { k: 'toytrain', p: 5, d: 1 }, { k: 'toyrobot', p: 6, d: 1 }];
const SELL_PRICE = k => (['wool', 'shell', 'starfish', 'wildflower', 'tomatoegg', 'carrotsoup', 'applejuice'].includes(k) ? 2 : 1);
const SH = { tab: 'buy', sel: null, paid: 0 };
PANELS.shop = $('p-shop');
PANELS.shop.addEventListener('pointerdown', e => { if (e.target === PANELS.shop) closePanel(); });
const coinImg = () => `<img class="shop-coin" src="${stickerCanvas('coin')}" alt="">`;
function shopRender() {
  $('shop-coins').innerHTML = coinImg() + `<b>${EX.coins}</b>`;
  document.querySelectorAll('#p-shop [data-stab2]').forEach(b => b.setAttribute('aria-selected', b.dataset.stab2 === SH.tab ? 'true' : 'false'));
  const g = $('shop-grid'); g.innerHTML = '';
  if (SH.tab === 'buy') GOODS.forEach(item => {
    const owned = item.d && EX.room.owned.includes(item.k), b = document.createElement('button');
    b.type = 'button'; b.className = 'shop-item' + (owned ? ' owned' : ''); b.setAttribute('aria-pressed', SH.sel === item ? 'true' : 'false');
    b.setAttribute('aria-label', word(item.k).id + ', ' + item.p + ' koin' + (owned ? ', sudah punya' : ''));
    b.innerHTML = `<img src="${stickerCanvas(item.k)}" alt=""><small>${owned ? '✓' : item.p}</small>`;
    b.disabled = !!owned;
    b.addEventListener('click', () => shopPick(item));
    g.appendChild(b);
  });
  else {
    if (!G.bag.length) g.innerHTML = `<p class="shop-empty">${rubyHTML(word('bag').zh, word('bag').py)} <small>Tasnya masih kosong. Ambil hasil kebun dulu.</small></p>`;
    G.bag.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'shop-item'; b.setAttribute('aria-label', word(k).id + ', dijual ' + SELL_PRICE(k) + ' koin');
      b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><small>+${SELL_PRICE(k)}</small>`;
      b.addEventListener('click', () => shopSell(k));
      g.appendChild(b);
    });
  }
  const d = $('shop-detail');
  if (SH.tab !== 'buy' || !SH.sel) { d.hidden = true; return; }
  d.hidden = false;
  $('shop-pic').src = stickerCanvas(SH.sel.k);
  $('shop-slots').innerHTML = Array.from({ length: SH.sel.p }, (_, i) => `<span class="shop-slot${i < SH.paid ? ' on' : ''}">${i < SH.paid ? coinImg() : ''}</span>`).join('');
  $('shop-pay').disabled = EX.coins < SH.sel.p;
}
function shopTab(tab) { SH.tab = tab; SH.sel = null; SH.paid = 0; sfx('tap'); shopRender(); say([{ k: tab }]); }
function shopPick(item) {
  SH.sel = item; SH.paid = 0; sfx('tap'); shopRender();
  const cw = countWord(item.p, 'coin', '个', 'gè');
  const list = [{ k: item.k }, { k: 'howmuch', by: null }, { card: cw, zh: cw.zh }];
  if (EX.coins < item.p) list.push({ k: 'nocoins' });
  say(list);
}
function shopPay() {
  const it = SH.sel;
  if (!it || EX.coins < it.p || SH.paid >= it.p) return;
  SH.paid++; sfx('pop'); say([{ k: 'n' + SH.paid }]);
  Snd.tone(1100 + SH.paid * 90, 0.12, { gain: 0.08, type: 'triangle' });
  if (SH.paid < it.p) { shopRender(); return; }
  setTimeout(() => {
    if (G.panel !== 'shop' || SH.sel !== it) return;
    if (!it.d && G.bag.length >= BAG_MAX) { say([{ k: 'bagfull' }]); SH.paid = 0; shopRender(); return; }
    EX.coins -= it.p;
    if (it.d) EX.room.owned.push(it.k); else bagAdd(it.k, G.boy.x, G.boy.y - 20, true);
    exSave(); SH.sel = null; SH.paid = 0; sfx('sparkle'); shopRender();
    say(it.d ? [{ k: 'thanks', by: G.boy }, { k: it.k }, { k: 'room' }] : [{ k: 'thanks', by: G.boy }, { k: it.k }]);
  }, 500);
}
function shopSell(k) {
  bagTake(k); const n = SELL_PRICE(k);
  addCoins(n, G.boy.x, G.boy.y - 30); sfx('pop'); shopRender();
  const cw = countWord(n, 'coin', '个', 'gè');
  say([{ k: 'sell' }, { k }, { card: cw, zh: cw.zh }]);
}
function shopOpen() { SH.tab = 'buy'; SH.sel = null; SH.paid = 0; shopRender(); say([{ k: 'market' }]); }
(function shopUI() {
  $('shop-title').innerHTML = rubyHTML(word('market').zh, word('market').py);
  $('shop-title').addEventListener('click', () => say([{ k: 'market' }]));
  $('shop-tabs').innerHTML = ['buy', 'sell'].map(k => `<button type="button" role="tab" data-stab2="${k}" aria-label="${word(k).id}">${rubyHTML(word(k).zh, word(k).py)}</button>`).join('');
  document.querySelectorAll('#p-shop [data-stab2]').forEach(b => b.addEventListener('click', () => shopTab(b.dataset.stab2)));
  $('shop-pay').addEventListener('click', shopPay);
})();
const VILLAGE = SCENES.village;
VILLAGE.blocks.push([184, 108, 32, 10]);
VILLAGE.objs.push({ x: 200, y: 118, hit: [183, 86, 34, 32], go: [200, 125],
  draw(c) {
    shadow(c, 200, 118, 18);
    px(c, 185, 96, 2, 22, PAL.woodD); px(c, 213, 96, 2, 22, PAL.woodD);
    px(c, 184, 106, 32, 12, PAL.wood); px(c, 184, 106, 32, 2, PAL.woodL);
    for (let i = 0; i < 8; i++) px(c, 182 + i * 5, 90, 5, 8, i % 2 ? '#fffaf0' : '#e2483d');
    px(c, 182, 97, 40, 1, '#a8352b');
    disc(c, 191, 103, 2, '#e2483d'); disc(c, 196, 103, 2, '#f08a32'); disc(c, 201, 103, 2, '#58a84a'); px(c, 205, 101, 6, 4, '#f4cf3a'); drawItem(c, 208, 105, 'coin');
  },
  tap() { say([{ k: 'market' }]); },
  arrive() { openPanel('shop'); shopOpen(); } });

// ================= KAMAR RUSSEL =================
const DECOR = {
  rug: { at: [80, 80], flat: 1 }, painting: { at: [42, 34] }, lamp: { at: [136, 62] }, potplant: { at: [150, 80] },
  bear: { at: [24, 66] }, toytrain: { at: [80, 86], moves: 1 }, toyrobot: { at: [112, 74], moves: 1 },
};
const RM = { cv: $('room-cv'), src: document.createElement('canvas') };
RM.src.width = 160; RM.src.height = 90;
RM.sctx = RM.src.getContext('2d', { willReadFrequently: true });
RM.ctx = RM.cv.getContext('2d');
PANELS.room = $('p-room');
PANELS.room.addEventListener('pointerdown', e => { if (e.target === PANELS.room) closePanel(); });
const roomHas = k => EX.room.owned.includes(k) && !EX.room.off.includes(k);
function decorPos(k, t) {
  const [x, y] = DECOR[k].at;
  if (k === 'toytrain') return [80 + Math.sin(t * 0.8) * 46, y];
  if (k === 'toyrobot') return [112 + Math.sin(t * 0.5) * 16, y];
  return [x, y];
}
PANEL_HOOK.room = () => {
  const c = RM.sctx, t = G.t;
  // dinding bergaris, papan bawah, lantai papan
  px(c, 0, 0, 160, 58, '#cfe8f0'); for (let i = 6; i < 160; i += 12) { px(c, i, 0, 2, 48, '#c2e0ea'); }
  px(c, 0, 48, 160, 8, '#f4f7f2'); px(c, 0, 48, 160, 1, '#ffffff'); px(c, 0, 55, 160, 1, '#c9d2c8');
  px(c, 0, 56, 160, 2, '#a8865a');
  drawPlanks(c, 0, 58, 160, 32, ['#d9b06a', '#d3a862', '#dfb873'], '#c29a56', 3, 7, 34);
  px(c, 0, 58, 160, 2, 'rgba(50,30,15,0.18)');
  windowLight(c, 76, 60, 26, 22, 8);
  // jendela bertirai
  px(c, 72, 8, 32, 24, PAL.woodD); px(c, 74, 10, 28, 20, G.night ? '#26305e' : '#8fd0f2');
  if (!G.night) { px(c, 74, 25, 28, 5, '#7cc85a'); oval(c, 84, 14, 4, 1, '#ffffff'); }
  px(c, 87, 10, 2, 20, PAL.woodD); px(c, 74, 19, 28, 2, PAL.woodD); px(c, 70, 32, 36, 2, PAL.woodL);
  px(c, 70, 7, 8, 18, '#f39ac0'); px(c, 98, 7, 8, 18, '#f39ac0'); for (const x of [72, 75, 100, 103]) px(c, x, 7, 1, 18, '#e27aa4'); px(c, 68, 6, 40, 2, PAL.woodD);
  // tempat tidur
  px(c, 4, 44, 36, 8, PAL.woodD); px(c, 5, 45, 34, 1, PAL.woodL);
  px(c, 6, 50, 32, 18, '#fbf8f0'); px(c, 9, 50, 26, 5, '#ffffff'); px(c, 9, 54, 26, 1, '#e3ddd0');
  px(c, 6, 56, 32, 12, '#4f86e0'); px(c, 6, 56, 32, 2, '#dfe9fa');
  for (let y = 60; y < 68; y += 4) for (let x = 6 + (y % 8 ? 4 : 0); x < 38; x += 8) px(c, x, y, 4, 4, '#7aa4ea');
  px(c, 4, 66, 36, 4, PAL.woodD); px(c, 4, 66, 36, 1, PAL.wood);
  Object.keys(DECOR).filter(k => DECOR[k].flat && roomHas(k)).forEach(k => drawDecor(c, DECOR[k].at[0], DECOR[k].at[1], k, t));
  drawPerson(c, 76, 76, { look: 'me', dir: 'down', mood: 'happy', noShadow: true, frame: 0, outfit: effOutfit() });
  Object.keys(DECOR).filter(k => !DECOR[k].flat && roomHas(k)).forEach(k => { const [x, y] = decorPos(k, t); drawDecor(c, x, y, k, t); });
  RM.ctx.drawImage(upscale4(RM.src), 0, 0);
};
RM.cv.addEventListener('pointerdown', e => {
  const [x, y] = cvPoint(RM.cv, e).map(v => v / 4);
  let best = null, bd = 16;
  EX.room.owned.filter(roomHas).forEach(k => { const [dx, dy] = decorPos(k, G.t), d = Math.hypot(dx - x, dy - 6 - y); if (d < bd) { bd = d; best = k; } });
  sfx('tap');
  if (best) say([{ k: best }]); else if (Math.hypot(76 - x, 62 - y) < 16) say([{ k: 'me', zh: '你好！我是' + CHILD + '。' }]); else say([{ k: 'room' }]);
});
function roomRender() {
  const box = $('room-list'); box.innerHTML = '';
  if (!EX.room.owned.length) {
    const w = word('market');
    box.innerHTML = `<div class="tile proc-btn"><img src="${stickerCanvas('market')}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span></div><p class="shop-empty"><small>Belum ada hiasan. Beli di pasar desa dengan koin dari misi Ibu atau jual hasil kebun.</small></p>`;
    return;
  }
  EX.room.owned.forEach(k => {
    const w = word(k), b = document.createElement('button');
    b.type = 'button'; b.className = 'tile proc-btn'; b.setAttribute('aria-label', w.id); b.setAttribute('aria-pressed', roomHas(k) ? 'true' : 'false');
    b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
    b.addEventListener('click', () => {
      const off = EX.room.off, i = off.indexOf(k);
      if (i >= 0) off.splice(i, 1); else off.push(k);
      exSave(); sfx('pop'); say([{ k }]); roomRender();
    });
    box.appendChild(b);
  });
}
function roomOpen() { roomRender(); say([{ k: 'room' }]); }
$('room-title').innerHTML = rubyHTML(word('room').zh, word('room').py);
$('room-title').addEventListener('click', () => say([{ k: 'room' }]));

// ================= DI RUMAH: kompor & peti mainan =================
SCENES.home.objs.push({ flat: true, y: 0, hit: [50, 12, 28, 18], go: [63, 62], draw() {},
  tap() { say([{ k: 'cook' }]); }, arrive() { openPanel('cook'); cookOpen(); } });
SCENES.home.blocks.push([70, 98, 18, 6]);
SCENES.home.objs.push({ x: 79, y: 104, hit: [68, 86, 22, 19], go: [79, 113],
  draw(c) {
    shadow(c, 79, 104, 10);
    px(c, 70, 93, 18, 11, '#a8743c'); px(c, 69, 91, 20, 4, '#c08a52'); px(c, 69, 91, 20, 1, '#d9a56a'); px(c, 78, 94, 2, 3, '#f4cf3a');
    disc(c, 73, 90, 2, '#a8743c'); px(c, 82, 87, 3, 4, '#e2483d');
  },
  tap() { say([{ k: 'room' }]); }, arrive() { openPanel('room'); roomOpen(); } });

// ================= GAMBAR STIKER =================
const stPot = (c, x, y) => { px(c, x - 11, y - 9, 22, 9, '#7d8a98'); px(c, x - 11, y - 9, 22, 2, '#a9b6c4'); px(c, x - 14, y - 7, 3, 2, '#4a4a52'); px(c, x + 11, y - 7, 3, 2, '#4a4a52'); };
Object.assign(ST_ART, {
  bear: (c, x, y) => drawDecor(c, x, y, 'bear', 0), toytrain: (c, x, y) => drawDecor(c, x, y, 'toytrain', 0), toyrobot: (c, x, y) => drawDecor(c, x, y, 'toyrobot', 0),
  lamp: (c, x, y) => drawDecor(c, x, y, 'lamp', 0), rug: (c, x, y) => drawDecor(c, x, y, 'rug', 0), painting: (c, x, y) => drawDecor(c, x, y, 'painting', 0), potplant: (c, x, y) => drawDecor(c, x, y, 'potplant', 0),
  tomatoegg: (c, x, y) => drawItem(c, x, y, 'tomatoegg', true), carrotsoup: (c, x, y) => drawItem(c, x, y, 'carrotsoup', true), applejuice: (c, x, y) => drawItem(c, x, y, 'applejuice', true),
  coin: (c, x, y) => drawItem(c, x, y, 'coin'),
  cook: (c, x, y) => { stPot(c, x, y); for (let i = 0; i < 3; i++) px(c, x - 5 + i * 5, y - 15 - (i % 2) * 3, 1, 4, '#b8c8d8'); },
  washveg: (c, x, y) => { oval(c, x, y - 3, 10, 3, '#5fb3e0'); drawItem(c, x, y - 4, 'tomato'); for (const [a, b] of [[-8, -9], [8, -11]]) px(c, x + a, y + b, 1, 2, '#3f8fe0'); },
  cut: (c, x, y) => { px(c, x - 12, y - 4, 24, 4, '#d9b98a'); drawItem(c, x - 4, y - 3, 'carrot'); px(c, x + 6, y - 15, 2, 12, '#dfe6ee'); px(c, x + 6, y - 20, 2, 5, '#5a3a22'); },
  stir: (c, x, y) => { stPot(c, x, y); px(c, x + 3, y - 20, 2, 14, '#a8743c'); },
  boil: (c, x, y) => { stPot(c, x, y - 4); for (let i = 0; i < 5; i++) px(c, x - 10 + i * 5, y - 3 - (i % 2), 3, 3, i % 2 ? '#f08a32' : '#ffd84a'); },
  serve: (c, x, y) => { drawItem(c, x, y - 1, 'tomatoegg', true); drawHeart(c, x + 8, y - 11); },
  market: (c, x, y) => { px(c, x - 12, y - 18, 2, 18, '#7d5230'); px(c, x + 10, y - 18, 2, 18, '#7d5230'); px(c, x - 13, y - 8, 26, 8, '#b27a45'); for (let i = 0; i < 6; i++) px(c, x - 15 + i * 5, y - 23, 5, 6, i % 2 ? '#fffaf0' : '#e2483d'); disc(c, x - 5, y - 10, 2, '#e2483d'); disc(c, x + 2, y - 10, 2, '#58a84a'); },
  buy: (c, x, y) => { drawItem(c, x - 6, y, 'coin'); drawItem(c, x + 7, y, 'apple'); },
  sell: (c, x, y) => { drawItem(c, x - 6, y, 'apple'); drawItem(c, x + 7, y, 'coin'); },
  howmuch: (c, x, y) => { drawItem(c, x - 5, y, 'coin'); px(c, x + 6, y - 14, 5, 2, '#4f86e0'); px(c, x + 10, y - 13, 2, 4, '#4f86e0'); px(c, x + 7, y - 9, 3, 2, '#4f86e0'); px(c, x + 7, y - 5, 3, 2, '#4f86e0'); },
  nocoins: (c, x, y) => { drawItem(c, x, y, 'coin'); for (let k = -6; k <= 6; k++) { px(c, x + k, y - 5 + k, 1, 1, '#e2483d'); px(c, x + k, y - 5 - k, 1, 1, '#e2483d'); } },
  room: (c, x, y) => { px(c, x - 14, y - 22, 28, 22, '#cfe8f0'); px(c, x - 14, y - 5, 28, 5, '#d9b06a'); px(c, x - 12, y - 11, 14, 6, '#4f86e0'); px(c, x - 12, y - 13, 5, 3, '#fbf8f0'); px(c, x + 3, y - 20, 8, 7, '#8fd0f2'); drawDecor(c, x + 8, y, 'bear', 0); },
});
// tombol resep memakai gambar stiker di atas
Object.keys(COOK).forEach(rec => {
  const w = word(rec), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn'; b.dataset.rec = rec; b.setAttribute('aria-label', w.id);
  b.innerHTML = `<img src="${stickerCanvas(rec)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', () => { sfx('tap'); cookStart(rec); });
  $('cook-recipes').appendChild(b);
});
$('shop-pay').innerHTML = coinImg();
