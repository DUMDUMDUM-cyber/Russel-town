// Salon potong rambut: cuci rambut, pilih gaya, gunting, keringkan. Gaya rambut Russel berubah di seluruh game.

LOOKS.hairdresser = { skin: '#f6c9a3', hair: '#7a3a2a', hairL: '#9a5a3a', style: 'bob', shirt: '#2a2a32', shirtD: '#1a1a20', apron: '#e88aa2', pants: '#2a2a32', shoes: '#1a1a20' };
const HAIR_STYLES = { hairspike: 'boy', hairbowl: 'bowl', hairneat: 'dad' };
if (G.outfit.hair && Object.values(HAIR_STYLES).includes(G.outfit.hair)) LOOKS.me.style = G.outfit.hair;

// ================= JENDELA POTONG RAMBUT =================
const HC = { step: 'wash', n: 0, style: null, t: 0, fx: 0, bits: [], cv: $('hc-cv'), src: document.createElement('canvas') };
HC.src.width = 160; HC.src.height = 110;
HC.sctx = HC.src.getContext('2d', { willReadFrequently: true });
HC.ctx = HC.cv.getContext('2d');
PANELS.haircut = $('p-haircut');
PANELS.haircut.addEventListener('pointerdown', e => { if (e.target === PANELS.haircut) closePanel(); });
const HC_ORDER = ['wash', 'style', 'cut', 'dry', 'done'];
function hcTile(k, onClick, big) {
  const w = word(k), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn' + (big ? ' big' : ''); b.setAttribute('aria-label', w.id);
  b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', onClick);
  return b;
}
function hcRender() {
  const box = $('hc-opts'); box.innerHTML = ''; box.className = 'proc';
  const at = HC_ORDER.indexOf(HC.step);
  $('hc-steps').innerHTML = HC_ORDER.slice(0, 4).map((s, i) => `<span class="fstar${i < at ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  if (HC.step === 'wash') box.appendChild(hcTile('washhair', hcAct, true));
  else if (HC.step === 'style') { box.classList.add('hc-grid'); Object.keys(HAIR_STYLES).forEach(k => box.appendChild(hcTile(k, () => hcStyle(k)))); }
  else if (HC.step === 'cut') box.appendChild(hcTile('scissors', hcAct, true));
  else if (HC.step === 'dry') box.appendChild(hcTile('blowdry', hcAct, true));
  else { box.appendChild(hcTile('handsome', () => { sfx('sparkle'); say([{ k: 'handsome', by: salonStylist }]); })); box.appendChild(hcTile('haircut', hcStart)); }
}
function hcStart() { HC.step = 'wash'; HC.n = 0; HC.style = null; HC.bits = []; hcRender(); sfx('pop'); say([{ k: 'haircut' }, { k: 'washhair', by: salonStylist }]); }
function hcAct() {
  HC.n++; HC.fx = 0.5;
  if (HC.step === 'wash') {
    sfx('water');
    if (HC.n < 3) { say([{ k: 'washhair' }]); return; }
    HC.step = 'style'; HC.n = 0; hcRender(); say([{ k: 'q_where', zh: '要什么发型？', by: salonStylist }]);
  } else if (HC.step === 'cut') {
    sfx('tap');
    for (let i = 0; i < 5; i++) HC.bits.push({ x: 18 + Math.random() * 18, y: 10 + Math.random() * 6, vy: 6 + Math.random() * 10, life: 1.6 });
    if (HC.n === 1) say([{ k: 'sitstill', by: salonStylist }]);
    if (HC.n < 4) return;
    LOOKS.me.style = HAIR_STYLES[HC.style]; G.outfit.hair = LOOKS.me.style; save();
    HC.step = 'dry'; HC.n = 0; hcRender(); say([{ k: HC.style }, { k: 'blowdry' }]);
  } else if (HC.step === 'dry') {
    sfx('whoosh');
    if (HC.n < 2) { say([{ k: 'blowdry' }]); return; }
    HC.step = 'done'; HC.t = 0; hcRender(); sfx('sparkle');
    addCoins(1, G.boy.x, G.boy.y - 30);
    say([{ k: 'handsome', by: salonStylist }, { k: 'thanks', by: G.boy }]);
  }
}
function hcStyle(k) { if (HC.step !== 'style') return; HC.style = k; HC.step = 'cut'; HC.n = 0; hcRender(); sfx('pop'); say([{ k }, { k: 'scissors' }]); }
function hcOpen() { hcStart(); }
PANEL_HOOK.haircut = dt => {
  const c = HC.sctx, t = G.t; HC.t += dt; HC.fx = Math.max(0, HC.fx - dt);
  // dinding salon, cermin berlampu
  px(c, 0, 0, 160, 110, '#f6e8ec'); for (let x = 0; x < 160; x += 12) px(c, x, 0, 6, 110, '#f2dfe5');
  px(c, 20, 6, 120, 92, '#c9a873'); px(c, 23, 9, 114, 86, '#dff1fb'); for (let k = 0; k < 14; k++) px(c, 30 + k, 30 - k, 2, 1, '#f4fbff');
  for (let x = 26; x < 136; x += 14) { disc(c, x, 6, 2, '#fff2a8'); disc(c, x, 6, 1, '#ffffff'); }
  // Russel duduk berkerudung jubah salon, digambar besar
  PX = 3;
  try {
    const L = Object.assign({}, LOOKS.me), cx = 27, by = 33;
    drawPerson(c, cx, by, { look: 'me', dir: 'down', mood: 'happy', outfit: effOutfit(), noShadow: true });
    // jubah
    px(c, cx - 9, by - 9, 18, 9, '#4f86e0'); px(c, cx - 9, by - 9, 18, 1, '#8fb4ee'); px(c, cx - 2, by - 10, 4, 1, '#ffffff');
    for (let i = -8; i < 9; i += 4) px(c, cx + i, by - 7, 1, 7, '#3f6fc4');
    if (HC.step === 'wash' || (HC.step === 'style' && HC.n === 0)) {
      // busa sampo di kepala
      for (const [a, b, r] of [[-5, -20, 2.5], [-1, -22, 3], [4, -21, 2.5], [-3, -18, 2], [3, -18, 2]]) disc(c, cx + a, by + b - (HC.step === 'wash' ? 0 : 0), r, '#ffffff');
      if (HC.fx > 0) for (let i = 0; i < 4; i++) disc(c, cx - 6 + i * 4, by - 26 - HC.fx * 6, 1, '#cfefff');
    }
    if (HC.step === 'cut') {
      // gunting bergerak di dekat kepala
      const sx = cx + 9, sy = by - 21 + Math.round(Math.sin(t * 4) * 2), op = Math.floor(t * 8) % 2;
      px(c, sx - 3, sy - op, 5, 1, '#a9b6c4'); px(c, sx - 3, sy + op, 5, 1, '#a9b6c4'); disc(c, sx + 3, sy - 1, 1, '#e2483d'); disc(c, sx + 3, sy + 1.5, 1, '#e2483d');
    }
    if (HC.step === 'dry') {
      const dx = cx + 10, dy = by - 22;
      px(c, dx, dy, 5, 3, '#e2483d'); px(c, dx + 3, dy + 3, 2, 4, '#a8352b'); px(c, dx - 1, dy + 1, 1, 1, '#ffffff');
      for (let i = 0; i < 3; i++) px(c, dx - 3 - ((t * 20 + i * 2) % 6), dy + i - 1, 2, 0.34, '#bfe3f2');
    }
  } finally { PX = 1; }
  // potongan rambut jatuh
  for (const b of HC.bits) { b.y += b.vy * dt; b.life -= dt; px(c, b.x * 3, b.y * 3 + 30, 3, 1, LOOKS.me.hair); }
  HC.bits = HC.bits.filter(b => b.life > 0);
  if (HC.step === 'done') for (let i = 0; i < 6; i++) { const a = t * 2 + i * 1.05; drawStar(c, Math.round(80 + Math.cos(a) * 46), Math.round(48 + Math.sin(a) * 30), i % 2 ? '#ffd84a' : '#fff2a8'); }
  if ((HC.step === 'wash' || HC.step === 'cut' || HC.step === 'dry') && Math.floor(t * 2.5) % 2) drawStar(c, 128, 20, '#ffd84a');
  HC.ctx.drawImage(upscale4(HC.src), 0, 0);
};
HC.cv.addEventListener('pointerdown', () => { if (HC.step === 'wash' || HC.step === 'cut' || HC.step === 'dry') hcAct(); else if (HC.step === 'style') say([{ k: 'haircut' }]); else say([{ k: 'handsome' }]); });
$('hc-title').innerHTML = rubyHTML(word('haircut').zh, word('haircut').py);
$('hc-title').addEventListener('click', () => say([{ k: 'haircut' }]));

// ================= TEMPAT: SALON =================
let salonStylist = null;
SCENES.salon = (() => {
  const S = { id: 'salon', place: 'salon', outdoor: false, walk: [8, 92, 312, 174], spawn: [160, 160], blocks: [[230, 140, 70, 10]], objs: [], lights: [[80, 50, 50], [220, 50, 50]] };
  S.bg = c => {
    px(c, 0, 0, W, 86, '#f6e8ec'); for (let x = 0; x < W; x += 12) px(c, x, 0, 6, 76, '#f2dfe5');
    px(c, 0, 76, W, 10, '#e8c4cf'); px(c, 0, 76, W, 1, '#ffffff'); px(c, 0, 85, W, 1, '#c99aa8');
    drawTiles(c, 0, 86, W, 94, 16, ['#ffffff', '#f2f2f2'], '#e2dede', 105);
    for (let y = 86; y < H; y += 16) for (let x = (Math.floor((y - 86) / 16) % 2) * 16; x < W; x += 32) { px(c, x, y, 16, 16, '#e3cdd5'); px(c, x, y, 16, 1, '#d4bcc5'); }
    wallFoot(c, 86);
    px(c, 0, 0, 4, H, '#c99aa8'); px(c, 316, 0, 4, H, '#c99aa8'); px(c, 0, 176, 144, 4, '#c99aa8'); px(c, 176, 176, 144, 4, '#c99aa8');
    px(c, 146, 168, 28, 10, '#a8352b'); px(c, 147, 169, 26, 8, '#c9473a'); px(c, 149, 171, 22, 4, '#e2685a');
    bgOutlined(c, cc => {
      // dua cermin berlampu
      for (const mx of [56, 136]) {
        px(cc, mx - 22, 26, 44, 46, '#c9a873'); px(cc, mx - 20, 28, 40, 42, '#dff1fb'); for (let k = 0; k < 12; k++) px(cc, mx - 14 + k, 46 - k, 2, 1, '#f4fbff');
        for (let x = mx - 18; x <= mx + 18; x += 9) { disc(cc, x, 26, 2, '#fff2a8'); }
        px(cc, mx - 22, 72, 44, 4, '#e8e2d6'); px(cc, mx - 18, 69, 6, 3, '#4f86e0'); px(cc, mx + 10, 68, 4, 4, '#e2483d'); px(cc, mx - 4, 70, 10, 2, '#2a2a32');
      }
      // wastafel keramas
      px(cc, 234, 52, 52, 26, '#e8e2d6'); px(cc, 234, 52, 52, 2, '#ffffff'); oval(cc, 260, 56, 18, 4, '#cfe0ea'); px(cc, 258, 44, 4, 10, '#a9a6a0'); px(cc, 256, 44, 10, 2, '#a9a6a0');
      // rak handuk
      px(cc, 292, 30, 22, 2, PAL.woodD); for (let i = 0; i < 3; i++) { px(cc, 293 + i * 7, 22, 6, 8, ['#f39ac0', '#ffffff', '#8fd0f2'][i]); px(cc, 293 + i * 7, 22, 6, 1, '#ffffff'); }
      // papan gunting
      px(cc, 186, 30, 30, 18, '#ffffff'); px(cc, 186, 30, 30, 2, '#e2483d'); px(cc, 193, 36, 16, 1, '#7d8a98'); px(cc, 193, 41, 16, 1, '#7d8a98'); disc(cc, 192, 36, 2, '#e2483d'); disc(cc, 192, 41, 2, '#e2483d');
    });
  };
  // tiang barbershop berputar
  S.objs.push({ x: 300, y: 104, skin: 'obj-tiang-salon', draw(c, t) {
    shadow(c, 300, 104, 5);
    px(c, 296, 66, 8, 36, '#ffffff'); px(c, 296, 66, 8, 2, '#c9d4e0'); px(c, 296, 100, 8, 3, '#a9a6a0');
    for (let y = 68; y < 100; y++) { const k = (y + Math.floor(t * 12)) % 8; px(c, 296 + (k % 8), y, 2, 1, k < 4 ? '#e2483d' : '#4f86e0'); }
    disc(c, 300, 65, 3, '#a9a6a0');
  }, hit: [292, 62, 16, 44], go: [290, 110], tap() { say([{ k: 'salon' }]); } });
  // kursi potong: Russel duduk lalu jendela potong rambut terbuka
  [56, 136].forEach((x, i) => S.objs.push({ x, y: 108, hit: [x - 12, 80, 24, 30], go: [x, 112], skin: 'near:obj-kursi-salon-',
    draw(c) {
      shadow(c, x, 108, 12);
      px(c, x - 1, 100, 3, 8, RB_MD); oval(c, x, 107, 8, 2, RB_MD);
      px(c, x - 9, 82, 18, 10, '#2a2a32'); px(c, x - 9, 82, 18, 2, '#4a4a52');
      px(c, x - 10, 92, 20, 7, '#2a2a32'); px(c, x - 10, 92, 20, 1, '#4a4a52'); px(c, x - 12, 88, 3, 6, '#4a4a52'); px(c, x + 9, 88, 3, 6, '#4a4a52');
    },
    tap() { say([{ k: 'chair' }, { k: 'haircut' }]); },
    arrive() { if (i === 1 && grandpaSit) { say([{ k: 'sitstill', by: salonStylist }]); return; } G.boy.dir = 'down'; openPanel('haircut'); hcOpen(); } }));
  salonStylist = npc('hairdresser', 96, 104, 'down', {
    go: [96, 116],
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'hairdresser', by: 'np' }, { k: 'haircut', by: 'np' }, { k: 'a_ok', by: 'me' }],
      [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }],
    ],
  });
  S.objs.push(salonStylist);
  // kakek sedang dipotong rambutnya di kursi kedua
  const grandpaSit = npc('grandpa', 136, 96, 'up', { go: [150, 112], lines: [[{ k: 'grandpa', by: 'me' }, { k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }], [{ k: 'handsome', by: 'me' }]] });
  S.objs.push(grandpaSit);
  // kursi tunggu dengan teman membaca
  S.objs.push({ x: 264, y: 150, hit: [232, 128, 66, 24], go: [264, 160], skin: 'obj-bangku-tunggu', draw(c) {
    shadow(c, 264, 150, 32);
    px(c, 232, 132, 64, 8, '#e88aa2'); px(c, 232, 132, 64, 1, '#f8b8cc'); px(c, 230, 140, 68, 5, '#c2667f'); px(c, 230, 140, 68, 1, '#e88aa2');
    for (const x of [234, 292]) px(c, x, 145, 3, 5, '#5a3a3a');
  }, tap() { say([{ k: 'chair' }]); } });
  S.objs.push(npc('kid3', 250, 140, 'down', { lines: [[{ k: 'hello', by: 'me' }, { k: 'q_play', by: 'np' }, { k: 'a_ok', by: 'me' }]] }));
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'village', at: [56, 66] }];
  return S;
})();

// ================= JALAN MASUK DARI DESA (rumah biru jadi salon) =================
(function villageSalon() {
  const V = SCENES.village, baseBg = V.bg;
  V.bg = c => {
    baseBg(c);
    px(c, 46, 44, 20, 16, '#a9a6a0'); px(c, 46, 44, 20, 1, '#c9c6c0'); for (let y = 47; y < 60; y += 4) px(c, 46, y, 20, 1, '#8f8c86');
    bgOutlined(c, cc => {
      px(cc, 82, 14, 4, 22, '#ffffff'); for (let k = 0; k < 6; k++) px(cc, 82, 15 + k * 3, 4, 2, k % 2 ? '#4f86e0' : '#e2483d'); disc(cc, 84, 13, 2, '#a9a6a0');
      px(cc, 36, 4, 18, 8, '#ffffff'); px(cc, 36, 4, 18, 1, '#e2483d'); px(cc, 40, 7, 9, 1, '#7d8a98'); px(cc, 40, 9, 9, 1, '#7d8a98'); disc(cc, 39, 7, 1, '#e2483d'); disc(cc, 39, 9, 1, '#e2483d');
    });
  };
  V.exits.push({ hit: [42, 38, 28, 28], arrow: [56, 68, 'up'], go: [56, 60], to: 'salon', at: [160, 160] });
})();

// ================= GAMBAR STIKER =================
const hairHead = st => (c, x, y) => drawHead(c, x, y - 12, Object.assign({}, LOOKS.me, { style: st }), 'down', { mood: 'happy' });
Object.assign(ST_ART, {
  salon: (c, x, y) => { px(c, x - 3, y - 26, 6, 26, '#ffffff'); for (let k = 0; k < 8; k++) px(c, x - 3, y - 25 + k * 3, 6, 2, k % 2 ? '#4f86e0' : '#e2483d'); disc(c, x, y - 27, 3, '#a9a6a0'); },
  hairdresser: (c, x, y) => drawPerson(c, x, y, { look: 'hairdresser', dir: 'down', mood: 'happy', noShadow: true }),
  haircut: (c, x, y) => { hairHead('boy')(c, x - 4, y); px(c, x + 6, y - 20, 6, 1, '#a9b6c4'); px(c, x + 6, y - 17, 6, 1, '#a9b6c4'); disc(c, x + 13, y - 20, 1, '#e2483d'); disc(c, x + 13, y - 17, 1, '#e2483d'); },
  washhair: (c, x, y) => { hairHead('boy')(c, x, y); for (const [a, b, r] of [[-5, -22, 3], [0, -24, 3], [5, -22, 3]]) disc(c, x + a, y + b, r, '#ffffff'); },
  scissors: (c, x, y) => { for (let k = 0; k < 12; k++) { px(c, x - 6 + k, y - 18 + k, 2, 1, '#a9b6c4'); px(c, x + 6 - k, y - 18 + k, 2, 1, '#c9d4e0'); } disc(c, x - 6, y - 4, 3, '#e2483d'); disc(c, x + 6, y - 4, 3, '#e2483d'); disc(c, x - 6, y - 4, 1, '#ffffff'); disc(c, x + 6, y - 4, 1, '#ffffff'); },
  blowdry: (c, x, y) => { px(c, x - 8, y - 18, 14, 7, '#e2483d'); px(c, x - 8, y - 18, 14, 1, '#ff8a7a'); px(c, x + 2, y - 11, 4, 10, '#a8352b'); px(c, x - 10, y - 16, 2, 3, '#7d8a98'); for (let i = 0; i < 3; i++) px(c, x - 18, y - 18 + i * 3, 6, 1, '#8fd0f2'); },
  sitstill: (c, x, y) => { drawPerson(c, x, y, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); px(c, x - 9, y - 9, 18, 9, '#4f86e0'); },
  handsome: (c, x, y) => { hairHead(LOOKS.me.style)(c, x, y); drawStar(c, x + 11, y - 22, '#ffd84a'); drawStar(c, x - 11, y - 16, '#ffd84a'); },
  hairspike: hairHead('boy'), hairbowl: hairHead('bowl'), hairneat: hairHead('dad'),
});
