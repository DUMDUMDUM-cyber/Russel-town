// Stasiun roket: pakai helm, hitung mundur 10 sampai 1, terbang ke bulan, lalu pulang lagi.

LOOKS.astronaut = { skin: '#f3c6a0', hair: '#3a2418', style: 'cap', cap: '#e8eef2', capD: '#9aa8b8', shirt: '#f4f7fa', shirtD: '#c9d4e0', pants: '#e8eef2', shoes: '#7d8a98', pack: '#c9d4e0' };
ITEMS.moonrock = {};
const _drawItemBase5 = drawItem;
drawItem = function (c, x, y, type, big) {
  if (type !== 'moonrock') { _drawItemBase5(c, x, y, type, big); return; }
  x = Math.round(x); y = Math.round(y);
  oval(c, x, y - 3, 5, 3, '#7d8a98'); oval(c, x - 0.5, y - 3.5, 4.5, 2.5, '#b9c2cc'); disc(c, x - 2, y - 4, 1, '#8f99a6'); disc(c, x + 2, y - 3, 1, '#8f99a6'); px(c, x - 3, y - 6, 2, 1, '#e8eef2');
};

// x = tengah, y = dasar sirip; tinggi sekitar 84
function drawRocket(c, x, y, t, flame) {
  x = Math.round(x); y = Math.round(y);
  if (flame) for (let k = 0; k < 14; k++) { const w = Math.max(1, 6 - Math.floor(k / 3) + (Math.floor(t * 20 + k) % 2)); px(c, x - w, y - 4 + k, w * 2, 1, k < 4 ? '#fff2a8' : k < 9 ? '#ffd84a' : '#f08a32'); }
  px(c, x - 4, y - 8, 8, 5, '#5f6c7a'); px(c, x - 4, y - 8, 8, 1, '#a9b6c4');
  for (const s of [-1, 1]) for (let k = 0; k < 14; k++) { const w = Math.round(k * 0.6) + 1; px(c, s < 0 ? x - 6 - w : x + 6, y - 22 + k, w, 1, k > 11 ? '#a8352b' : '#e2483d'); }
  px(c, x - 7, y - 70, 14, 64, '#f4f7fa'); px(c, x - 7, y - 70, 2, 64, '#ffffff'); px(c, x + 3, y - 70, 4, 64, '#d6dee6'); px(c, x - 7, y - 7, 14, 1, '#a9b6c4');
  px(c, x - 7, y - 26, 14, 4, '#e2483d'); px(c, x - 7, y - 50, 14, 2, '#4f86e0');
  for (let k = 0; k < 16; k++) { const w = Math.round(7 * Math.sqrt(k / 16)); px(c, x - w, y - 86 + k, w * 2, 1, k < 3 ? '#a8352b' : '#e2483d'); }
  disc(c, x, y - 60, 4, '#7d8a98'); disc(c, x, y - 60, 3, '#8fd0f2'); px(c, x - 2, y - 62, 2, 1, '#ffffff');
  disc(c, x, y - 40, 2.5, '#7d8a98'); disc(c, x, y - 40, 1.5, '#8fd0f2');
}
// helm kaca di kepala Russel (dipakai di stasiun roket dan bulan)
function drawHelmet(c, x, y) {
  x = Math.round(x); y = Math.round(y);
  for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; px(c, x + Math.cos(a) * 10, y - 21 + Math.sin(a) * 10, 1, 1, '#e8eef2'); }
  px(c, x - 6, y - 28, 2, 3, 'rgba(255,255,255,0.8)'); px(c, x - 7, y - 25, 1, 3, 'rgba(255,255,255,0.6)');
  px(c, x - 6, y - 12, 12, 2, '#c9d4e0');
}
G.boy.helmet = false;

// ================= JENDELA PELUNCURAN =================
const LA = { step: 'helmet', n: 10, fly: 0, t: 0, cv: $('launch-cv'), src: document.createElement('canvas') };
LA.src.width = 160; LA.src.height = 110;
LA.sctx = LA.src.getContext('2d', { willReadFrequently: true });
LA.ctx = LA.cv.getContext('2d');
PANELS.launch = $('p-launch');
PANELS.launch.addEventListener('pointerdown', e => { if (e.target === PANELS.launch) closePanel(); });
function laTile(k, onClick, html) {
  const w = word(k), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn big'; b.setAttribute('aria-label', w.id);
  b.innerHTML = (html || `<img src="${stickerCanvas(k)}" alt="">`) + `<span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', onClick);
  return b;
}
function laRender() {
  const box = $('launch-opts'); box.innerHTML = '';
  const order = ['helmet', 'count', 'fly'], at = order.indexOf(LA.step);
  $('launch-steps').innerHTML = order.map((s, i) => `<span class="fstar${i < at ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  if (LA.step === 'helmet') box.appendChild(laTile('helmet', laHelmet));
  else if (LA.step === 'count') box.appendChild(laTile('n' + LA.n, laCount, `<span class="numbig">${LA.n}</span>`));
  else box.appendChild(laTile('space', () => say([{ k: 'space' }])));
}
function laHelmet() { if (LA.step !== 'helmet') return; G.boy.helmet = true; LA.step = 'count'; LA.n = 10; sfx('pop'); laRender(); say([{ k: 'helmet' }, { k: 'countdown' }, { k: 'n10' }]); }
function laCount() {
  if (LA.step !== 'count') return;
  LA.n--; sfx('tap');
  if (LA.n > 0) { laRender(); say([{ k: 'n' + LA.n }]); return; }
  LA.step = 'fly'; LA.fly = 0; laRender(); sfx('whoosh');
  say([{ k: 'blastoff' }, { k: 'rocket' }, { k: 'space' }]);
}
function laOpen() { LA.step = G.boy.helmet ? 'count' : 'helmet'; LA.n = 10; LA.fly = 0; LA.done = false; laRender(); say(G.boy.helmet ? [{ k: 'countdown' }, { k: 'n10' }] : [{ k: 'rocket' }, { k: 'helmet' }]); }
PANEL_HOOK.launch = dt => {
  const c = LA.sctx, t = G.t; LA.t += dt;
  if (LA.step === 'fly') LA.fly += dt;
  const f = LA.fly, up = Math.max(0, f - 0.6) ** 2 * 26, dark = Math.min(1, Math.max(0, (f - 1.2) / 1.6));
  // langit menggelap saat roket naik ke luar angkasa
  for (let y = 0; y < 110; y += 2) { const k = y / 110, mix = (a, b) => Math.round(a + (b - a) * dark); px(c, 0, y, 160, 2, `rgb(${mix(150 + k * 60, 14)},${mix(212 + k * 26, 18)},${mix(245, 44)})`); }
  if (dark > 0.3) for (let i = 0; i < 30; i++) px(c, (i * 53) % 160, (i * 37 + Math.floor(f * 30)) % 110, 1, 1, '#ffffff');
  const gy = 96 + up;
  if (gy < 120) {
    px(c, 0, gy, 160, 20, '#a9a6a0'); px(c, 0, gy, 160, 2, '#c9c6c0');
    px(c, 96, gy - 76, 6, 76, '#c9473a'); for (let y = gy - 74; y < gy; y += 8) for (let k = 0; k < 6; k++) px(c, 96 + k, y + k, 1, 1, '#a8352b');
    px(c, 88, gy - 60, 8, 3, '#c9473a');
    if (LA.step !== 'fly') drawPerson(c, 44, gy, { look: 'me', dir: 'right', mood: 'happy', outfit: effOutfit(), noShadow: true });
    if (LA.step !== 'fly' && G.boy.helmet) drawHelmet(c, 44, gy);
  }
  if (LA.step === 'fly' && f > 0.3) for (let i = 0; i < 10; i++) { const k = (f * 2 + i * 0.1) % 1; disc(c, 76 + Math.sin(i * 2.3) * 20 * k, gy - 2 + up * 0 + k * 6, 3 + k * 6, `rgba(230,230,235,${0.8 - k * 0.6})`); }
  drawRocket(c, 76, 96 - up + (LA.step === 'fly' && f < 0.6 ? Math.round(Math.sin(f * 60)) : 0), t, LA.step === 'fly');
  if (LA.step === 'count' && Math.floor(t * 2) % 2) drawStar(c, 120, 30, '#ffd84a');
  if (LA.step === 'fly' && f > 4.2 && !LA.done) {
    LA.done = true; closePanel();
    fadeTo(() => { enterScene('moon', [150, 150]); G.boy.dir = 'down'; }, () => say([{ k: 'moon' }, { k: 'arrived' }, { k: 'earth' }]));
  }
  LA.ctx.drawImage(upscale4(LA.src), 0, 0);
};
LA.cv.addEventListener('pointerdown', () => { if (LA.step === 'helmet') laHelmet(); else if (LA.step === 'count') laCount(); else say([{ k: 'space' }]); });
$('launch-title').innerHTML = rubyHTML(word('rocket').zh, word('rocket').py);
$('launch-title').addEventListener('click', () => say([{ k: 'rocket' }]));

// helm digambar di atas Russel di stasiun roket dan bulan
const helmetObj = { top: true, get hidden() { return !G.boy.helmet || G.boy.hidden; }, draw(c) { drawHelmet(c, G.boy.x, G.boy.y - Math.round(G.boy.jumpH || 0)); } };

// ================= TEMPAT: STASIUN ROKET =================
SCENES.rocketbase = (() => {
  const S = {
    id: 'rocketbase', place: 'rocketbase', outdoor: true, walk: [8, 70, 312, 174], spawn: [180, 80],
    blocks: [[18, 96, 80, 10], [200, 108, 56, 12], [270, 150, 30, 10]], objs: [], lights: [[58, 80, 40], [228, 90, 60]],
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 62; y++) { const k = y / 62; px(c, 0, y, W, 1, N ? `rgb(${24 + k * 26},${28 + k * 28},${70 + k * 40})` : `rgb(${150 + k * 60},${212 + k * 26},${245})`); }
    if (N) { const r = rng(97); for (let i = 0; i < 40; i++) px(c, Math.floor(r() * W), Math.floor(r() * 50), 1, 1, '#ffffff'); }
    for (let x = 0; x < W; x += 2) { const h = 14 + Math.sin(x / 26) * 8 + Math.sin(x / 9) * 2; px(c, x, 60 - h, 2, h + 4, N ? '#3e4368' : '#9da2c2'); if (h > 18) px(c, x, 60 - h, 2, 3, '#f4f7fa'); }
    drawGrass(c, 0, 58, W, 122, 98, true);
    // landasan beton
    px(c, 0, 66, W, 110, '#b4b1aa'); groundPatches(c, 0, 66, W, 110, 99, '#aaa79f', 0.55);
    drawTiles(c, 180, 92, 100, 44, 20, ['#c9c6c0', '#c2bfb9', '#cfccc6'], '#a9a6a0', 100);
    for (let i = 0; i < 100; i += 8) { px(c, 180 + i, 136, 4, 2, '#f4cf3a'); px(c, 184 + i, 136, 4, 2, RB_K); }
    px(c, 0, 64, W, 2, '#8f8c86'); wallFoot(c, 66);
    px(c, 0, 176, W, 4, '#8f8c86');
    bgOutlined(c, cc => {
      // gedung kendali dengan antena parabola
      shadowRect(cc, 18, 100, 82, 3);
      px(cc, 18, 62, 80, 38, '#e8eef2'); px(cc, 18, 62, 80, 2, '#ffffff'); px(cc, 90, 64, 8, 36, '#c9d4e0');
      px(cc, 24, 70, 50, 14, '#2a3448'); for (let i = 0; i < 6; i++) px(cc, 27 + i * 8, 73, 5, 2, ['#7cf0c4', '#ffd84a', '#e2483d'][i % 3]); px(cc, 27, 78, 44, 1, '#4f86e0');
      px(cc, 78, 74, 10, 26, '#5f6c7a'); px(cc, 78, 74, 10, 1, '#7d8a98'); px(cc, 86, 86, 1, 2, '#f4cf3a');
      px(cc, 40, 52, 2, 10, RB_MD); oval(cc, 41, 50, 9, 4, '#e8eef2'); oval(cc, 41, 49, 7, 2, '#c9d4e0'); px(cc, 41, 44, 1, 6, RB_MD); disc(cc, 41, 43, 1, '#e2483d');
      // menara peluncuran
      for (let y = 22; y < 116; y += 2) px(cc, 248, y, 6, 2, y % 8 < 4 ? '#c9473a' : '#a8352b');
      for (let y = 26; y < 112; y += 12) for (let k = 0; k < 6; k++) px(cc, 248 + k, y + k, 1, 1, '#e8735a');
      px(cc, 236, 40, 12, 3, '#c9473a'); px(cc, 236, 64, 12, 3, '#c9473a');
    });
  };
  // roket besar di landasan
  const rocketObj = { x: 228, y: 118, hit: [212, 28, 34, 92], go: [228, 128], skin: 'obj-roket',
    draw(c, t) { shadow(c, 228, 118, 16); px(c, 212, 114, 32, 5, '#7d8a98'); px(c, 212, 114, 32, 1, '#a9b6c4'); drawRocket(c, 228, 114, t, false); },
    tap() { say([{ k: 'rocket' }]); },
    arrive() { G.boy.dir = 'up'; openPanel('launch'); laOpen(); } };
  S.objs.push(rocketObj);
  // papan hitung mundur di gedung
  S.objs.push({ flat: true, y: 0, hit: [22, 66, 56, 22], go: [50, 112], draw() {}, tap() { say([{ k: 'countdown' }]); } });
  // astronot
  S.objs.push(npc('astronaut', 140, 112, 'down', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'astronaut', by: 'np' }, { k: 'q_where', by: 'np' }, { k: 'moon', by: 'me' }],
      [{ k: 'helmet', by: 'np' }, { k: 'a_ok', by: 'me' }],
    ],
  }));
  // kendaraan penjelajah kecil
  S.objs.push({ x: 120, y: 150, t0: 0, dir: 1, skin: 'fn:rover',
    get hit() { return [this.x - 12, this.y - 16, 24, 17]; }, get go() { return [this.x + (G.boy.x < this.x ? -18 : 18), this.y + 1]; },
    draw(c, t) {
      const x = Math.round(this.x), y = Math.round(this.y);
      shadow(c, x, y, 11);
      for (const dx of [-8, 0, 8]) { disc(c, x + dx, y - 3, 3, RB_K); disc(c, x + dx, y - 3, 1, RB_ML); }
      px(c, x - 10, y - 10, 20, 5, '#f4f7fa'); px(c, x - 10, y - 10, 20, 1, '#ffffff'); px(c, x + 6, y - 9, 4, 4, '#c9d4e0');
      px(c, x - 6, y - 15, 10, 5, '#4f86e0'); px(c, x - 5, y - 14, 3, 2, '#bfe3f2'); px(c, x + 6 * this.dir, y - 18, 1, 8, RB_MD); disc(c, x + 6 * this.dir, y - 19, 1, Math.floor(t * 3) % 2 ? '#e2483d' : '#ff9a8a');
    },
    update(dt) { this.t0 += dt * 0.25; const nx = 120 + Math.sin(this.t0) * 50; this.dir = nx > this.x ? 1 : -1; this.x = nx; },
    tap() { sfx('chime'); say([{ k: 'robot' }]); } });
  S.objs.push(helmetObj);
  S.enter = () => { G.boy.helmet = false; };
  S.exits = [{ hit: [166, 64, 30, 22], arrow: [180, 76, 'up'], go: [180, 70], to: 'mountain', at: [192, 166] }];
  return S;
})();

// ================= TEMPAT: BULAN =================
SCENES.moon = (() => {
  const S = { id: 'moon', place: 'moon', outdoor: false, walk: [8, 100, 312, 174], spawn: [150, 150], blocks: [[250, 150, 30, 8]], objs: [], lights: [] };
  S.bg = c => {
    px(c, 0, 0, W, 96, '#0e1226');
    const r = rng(101); for (let i = 0; i < 90; i++) px(c, Math.floor(r() * W), Math.floor(r() * 92), 1, 1, r() < 0.2 ? '#fff2a8' : '#ffffff');
    // bukit bulan dan tanah berkawah
    for (let x = 0; x < W; x += 2) { const h = 6 + Math.sin(x / 22) * 4; px(c, x, 96 - h, 2, h, '#7d8494'); }
    px(c, 0, 94, W, 86, '#a9afbb'); groundPatches(c, 0, 94, W, 86, 102, '#9ca2ae', 0.52); groundPatches(c, 0, 94, W, 86, 103, '#b8bdc8', 0.62);
    [[40, 120, 16, 5], [110, 160, 22, 6], [200, 118, 12, 4], [286, 132, 18, 5], [60, 168, 10, 3], [170, 140, 9, 3]].forEach(([x, y, rx, ry]) => { oval(c, x, y, rx, ry, '#8f96a3'); oval(c, x + 1, y + 1, rx - 2, ry - 1, '#9ca2ae'); px(c, x - rx + 2, y - ry, rx, 1, '#c9ced8'); });
  };
  // bumi di langit
  S.objs.push({ flat: true, y: 0, hit: [32, 24, 44, 44], go: null, skin: 'obj-bumi',
    draw(c, t) {
      disc(c, 54, 46, 17, '#2f5bab'); disc(c, 53, 45, 16, '#4f86e0');
      for (const [a, b, rr] of [[-6, -6, 5], [5, 2, 6], [-3, 8, 3], [8, -8, 3]]) disc(c, 54 + a, 46 + b, rr, '#58a84a');
      oval(c, 50 + Math.round(Math.sin(t * 0.2) * 3), 40, 7, 1.5, '#ffffff'); oval(c, 58, 52, 6, 1.5, '#ffffff');
      px(c, 44, 36, 3, 1, '#bfe3f2');
    },
    tap() { say([{ k: 'earth' }]); sfx('chime'); } });
  // bendera
  S.objs.push({ x: 90, y: 118, hit: [84, 92, 22, 28], go: [98, 124], skin: 'obj-bendera',
    draw(c, t) { shadow(c, 90, 118, 4); px(c, 89, 94, 2, 24, RB_ML); const w = Math.round(Math.sin(t * 2)); px(c, 91, 95 + w * 0, 14, 9, '#f4cf3a'); px(c, 91, 95, 14, 1, '#fff2a8'); drawStar(c, 98, 100, '#e2483d'); },
    tap() { say([{ k: 'flag' }]); } });
  // roket mendarat: ketuk untuk pulang
  S.objs.push({ x: 266, y: 158, hit: [250, 66, 34, 94], go: [240, 160], skin: 'fn:moonRocket',
    draw(c, t) { shadow(c, 266, 158, 16); px(c, 254, 150, 3, 8, RB_MD); px(c, 276, 150, 3, 8, RB_MD); drawRocket(c, 266, 154, t, false); if (Math.floor(t * 2) % 2) drawArrow(c, 240, 136, 'right', t); },
    tap() { say([{ k: 'rocket' }, { k: 'gohome' }]); },
    arrive() {
      sfx('whoosh');
      fadeTo(() => { enterScene('rocketbase', [200, 132]); G.boy.helmet = true; G.boy.dir = 'down'; }, () => say([{ k: 'arrived' }, { k: 'rocketbase' }]));
    } });
  // kelinci bulan melompat
  S.objs.push({ x: 180, y: 120, t0: 0, dir: 1,
    get hit() { return [this.x - 9, this.y - 22, 18, 22]; }, get go() { return [this.x + (G.boy.x < this.x ? -14 : 14), this.y + 2]; },
    draw(c, t) { drawRabbit(c, this.x, this.y - Math.round(Math.abs(Math.sin(t * 2)) * 10), this.dir, t, true); },
    update(dt) { this.t0 += dt * 0.3; const nx = 180 + Math.sin(this.t0) * 60; this.dir = nx > this.x ? 1 : -1; this.x = nx; },
    tap() { say([{ k: 'rabbit' }]); fx('heart', this.x, this.y - 24, 2); } });
  // batu bulan untuk dibawa pulang
  [[60, 140], [140, 128], [210, 166], [300, 116]].forEach(([x, y]) => S.objs.push(pickup('moonrock', x, y, { respawn: 20 })));
  // bintang-bintang bisa diketuk
  S.objs.push({ flat: true, y: 0, hit: [90, 0, 230, 60], go: null, skin: 'fn:moonStars', draw(c, t) { for (const [a, b] of [[120, 20], [190, 12], [250, 30], [300, 16]]) if (Math.floor(t * 2 + a) % 3) drawStar(c, a, b, '#fff2a8'); }, tap() { say([{ k: 'star' }]); sfx('chime'); } });
  S.objs.push(helmetObj);
  // gravitasi rendah: Russel melompat tinggi saat berjalan
  let hopSaid = false;
  S.update = dt => {
    const b = G.boy;
    if (b.moving) { b.jumpH = Math.abs(Math.sin(G.t * 3)) * 10; if (!hopSaid && b.jumpH > 9) { hopSaid = true; say([{ k: 'jumphigh', by: b }]); } }
    else b.jumpH = Math.max(0, (b.jumpH || 0) - dt * 30);
  };
  S.enter = () => { G.boy.helmet = true; hopSaid = false; };
  S.exits = [];
  return S;
})();
WORDS.moon || console.warn('kata moon hilang');

// ================= JALAN MASUK DARI GUNUNG =================
(function mountainPath() {
  const M = SCENES.mountain, baseBg = M.bg;
  M.bg = c => {
    baseBg(c);
    drawPath(c, 182, 168, 20, 12, 104);
    bgOutlined(c, cc => {
      shadow(cc, 222, 172, 5);
      px(cc, 221, 156, 2, 16, PAL.woodD); px(cc, 214, 146, 17, 11, PAL.woodD); px(cc, 215, 147, 15, 9, PAL.wood); px(cc, 215, 147, 15, 1, PAL.woodL);
      px(cc, 221, 148, 3, 6, '#ffffff'); px(cc, 221, 148, 3, 1, '#e2483d'); px(cc, 219, 153, 2, 2, '#e2483d'); px(cc, 224, 153, 2, 2, '#e2483d');
    });
  };
  M.exits.push({ hit: [180, 162, 26, 18], arrow: [192, 170, 'down'], go: [192, 176], to: 'rocketbase', at: [180, 80] });
})();

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  rocketbase: (c, x, y) => { px(c, x - 16, y - 3, 32, 3, '#a9a6a0'); for (let k = 0; k < 30; k += 2) px(c, x + 10, y - 3 - k, 3, 2, '#c9473a'); drawRocket(c, x - 2, y - 3, 0, false); },
  rocket: (c, x, y) => drawRocket(c, x, y, 0, true),
  astronaut: (c, x, y) => drawPerson(c, x, y, { look: 'astronaut', dir: 'down', mood: 'happy', noShadow: true }),
  helmet: (c, x, y) => { drawPerson(c, x, y, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); drawHelmet(c, x, y); },
  countdown: (c, x, y) => { drawDigit(c, x - 10, y - 12, 3, '#e2483d'); drawDigit(c, x - 2, y - 12, 2, '#e2483d'); drawDigit(c, x + 6, y - 12, 1, '#e2483d'); px(c, x - 12, y - 4, 24, 2, '#7d8a98'); },
  blastoff: (c, x, y) => { drawRocket(c, x, y - 8, 0, true); },
  space: (c, x, y) => { px(c, x - 16, y - 24, 32, 24, '#0e1226'); for (const [a, b] of [[-12, -20], [8, -18], [-4, -8], [12, -6], [0, -14]]) px(c, x + a, y + b, 1, 1, '#ffffff'); disc(c, x + 6, y - 10, 4, '#e8eef2'); disc(c, x - 8, y - 14, 3, '#4f86e0'); },
  earth: (c, x, y) => { disc(c, x, y - 11, 10, '#2f5bab'); disc(c, x - 0.5, y - 11.5, 9, '#4f86e0'); disc(c, x - 3, y - 14, 3, '#58a84a'); disc(c, x + 4, y - 9, 4, '#58a84a'); oval(c, x - 2, y - 7, 4, 1, '#ffffff'); },
  moonrock: (c, x, y) => drawItem(c, x, y, 'moonrock'),
  jumphigh: (c, x, y) => { drawPerson(c, x, y - 10, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); drawArrow(c, x + 13, y - 18, 'up', 0); oval(c, x, y - 1, 8, 2, '#a9afbb'); },
  flag: (c, x, y) => { px(c, x - 8, y - 26, 2, 26, '#d6dee6'); px(c, x - 6, y - 25, 16, 10, '#f4cf3a'); drawStar(c, x + 2, y - 20, '#e2483d'); },
  gohome: (c, x, y) => { drawHouse(c, x - 12, y - 22, 24, 20, { roof: '#d4553f', roofD: '#a23a2c', roofL: '#e8735a', door: 8 }); drawHeart(c, x + 12, y - 24); },
});
