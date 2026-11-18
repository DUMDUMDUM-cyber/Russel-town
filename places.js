// Tempat baru untuk merakit: Jalan Baru (proyek bangunan + pintu ke Bengkel Mobil, Tukang Kayu, Toko Mainan) dan Bandara.
// Manusia salju dibuat di Pertanian saat musim dingin. Permainan merakitnya ada di build.js.

Object.assign(LOOKS, {
  mechanic: { skin: '#efbf94', hair: '#2a1d18', style: 'cap', cap: '#3f6fd0', capD: '#2a4f9e', shirt: '#4f7fd6', shirtD: '#2f5bab', pants: '#3f5f9a', shoes: '#2a2a2a' },
  carpenter: { skin: '#e9b48a', hair: '#5a3a22', hairL: '#7a5a3a', style: 'dad', shirt: '#58845a', shirtD: '#3f6a42', apron: '#c08a52', pants: '#6a5040', shoes: '#3a2a20' },
  builder: { skin: '#f3c6a0', hair: '#3a2418', style: 'cap', cap: '#ffffff', capD: '#d6dee6', shirt: '#f08a32', shirtD: '#bd5e1c', pants: '#3f4a6a', shoes: '#5a3a22' },
  pilot: { skin: '#f6c9a3', hair: '#3a2418', style: 'cap', cap: '#2a3450', capD: '#1a2238', shirt: '#ffffff', shirtD: '#cfd8e0', tie: '#2a3450', pants: '#2a3450', shoes: '#1a1a20' },
  shopkeeper: { skin: '#ffd2b0', hair: '#7a3a2a', hairL: '#9a5a3a', style: 'bob', shirt: '#f39ac0', shirtD: '#cc6a95', apron: '#fff2a8', pants: '#4a4a52', shoes: '#8a4a3a' },
});
Object.assign(VOICE_ROLE, {
  mechanic: { pitch: 0.85, m: 1 }, carpenter: { pitch: 0.72, rate: 0.95, m: 1 }, builder: { pitch: 0.8, m: 1 }, pilot: { pitch: 0.95 }, shopkeeper: { pitch: 1.12 },
});

// ================= JALAN BARU =================
SCENES.newstreet = (() => {
  const S = {
    id: 'newstreet', place: 'newstreet', outdoor: true, walk: [6, 80, 314, 176], spawn: [296, 98],
    blocks: [[136, 146, 38, 8], [24, 150, 32, 8]], objs: [], lights: [[40, 84, 34], [160, 84, 34], [280, 84, 34]],
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 40; y++) { const k = y / 40; px(c, 0, y, W, 1, N ? `rgb(${24 + k * 26},${28 + k * 28},${70 + k * 40})` : `rgb(${150 + k * 60},${212 + k * 26},245)`); }
    if (N) { const r = rng(131); for (let i = 0; i < 30; i++) px(c, Math.floor(r() * W), Math.floor(r() * 30), 1, 1, '#ffffff'); }
    for (let x = 0; x < W; x += 2) { const h = 10 + Math.sin(x / 30) * 5 + Math.sin(x / 11) * 2; px(c, x, 40 - h, 2, h + 4, N ? '#3e5a48' : '#7cc85a'); }
    drawGrass(c, 0, 38, W, 142, 132, true);
    // trotoar & jalan
    drawTiles(c, 0, 74, W, 12, 12, ['#d4d0c8', '#cdc9c1', '#d9d5cd'], '#b4b0a8', 133);
    px(c, 0, 86, W, 2, '#9a968e');
    px(c, 0, 88, W, 20, '#6f737c'); groundPatches(c, 0, 88, W, 20, 134, '#676b74', 0.6);
    for (let x = 4; x < W; x += 24) px(c, x, 97, 12, 2, '#f4f0e0');
    px(c, 0, 108, W, 2, '#9a968e');
    // proyek bangunan: tanah & pagar pembatas
    px(c, 132, 114, 182, 62, '#c9a46a'); groundPatches(c, 132, 114, 182, 62, 135, '#b8925a', 0.55); groundPatches(c, 132, 114, 182, 62, 136, '#d8b880', 0.62);
    bgOutlined(c, cc => {
      // bengkel mobil
      px(cc, 8, 24, 94, 50, '#c9d4e0'); px(cc, 8, 24, 94, 3, '#e8eef2'); px(cc, 96, 27, 6, 47, '#a9b6c4');
      px(cc, 4, 18, 102, 7, '#3f6fd0'); px(cc, 4, 18, 102, 2, '#8fb4ee'); px(cc, 4, 24, 102, 1, '#2a4f9e');
      px(cc, 28, 38, 46, 36, '#7d8a98'); for (let y = 40; y < 74; y += 4) px(cc, 29, y, 44, 1, '#9aa8b8');
      px(cc, 80, 40, 12, 12, '#bfe3f2'); px(cc, 80, 46, 12, 1, '#a9b6c4'); px(cc, 12, 40, 12, 12, '#bfe3f2');
      disc(cc, 54, 30, 6, '#ffffff'); disc(cc, 54, 30, 4, '#2a2a2e'); disc(cc, 54, 30, 2, '#c9c9d2');
      // tukang kayu: pondok kayu
      drawPlanks(cc, 114, 30, 88, 44, ['#c08a52', '#b88250', '#c89458'], '#8a6440', 137, 6, 30);
      for (let k = 0; k < 12; k++) px(cc, 110 + k * 2, 30 - k, 96 - k * 4, 1, k % 3 ? '#8a5a35' : '#a8743c');
      px(cc, 146, 46, 22, 28, PAL.woodD); px(cc, 148, 48, 18, 26, PAL.wood); px(cc, 157, 48, 1, 26, PAL.woodD); px(cc, 162, 60, 2, 2, '#f4cf3a');
      px(cc, 122, 46, 16, 12, '#a8dcf5'); px(cc, 129, 46, 1, 12, PAL.woodD); px(cc, 176, 46, 16, 12, '#a8dcf5'); px(cc, 183, 46, 1, 12, PAL.woodD);
      px(cc, 136, 34, 42, 9, '#fff2c8'); px(cc, 136, 34, 42, 1, '#ffffff'); stSaw(cc, 152, 42); stHammer(cc, 168, 42);
      // toko mainan: dinding pastel, kanopi bergaris, etalase
      px(cc, 214, 26, 98, 48, '#fcd0e2'); px(cc, 214, 26, 98, 2, '#ffffff'); px(cc, 306, 28, 6, 46, '#f39ac0');
      for (let i = 0; i < 12; i++) px(cc, 210 + i * 9, 40, 9, 7, i % 2 ? '#ffffff' : '#e2483d');
      for (let i = 0; i < 12; i++) disc(cc, 214 + i * 9, 47, 4, i % 2 ? '#ffffff' : '#e2483d');
      px(cc, 220, 18, 86, 10, '#4f86e0'); px(cc, 220, 18, 86, 1, '#8fb4ee');
      for (const [k, x] of [['red', 236], ['yellow', 250], ['green', 264], ['blue', 278], ['orange', 292]]) brickAt(cc, x - 4, 20, 8, 6, RB_TONE[k]);
      px(cc, 220, 54, 28, 20, '#bfe3f2'); px(cc, 220, 54, 28, 1, '#ffffff'); drawToyTrain(cc, 236, 72, 1, 0);
      px(cc, 254, 50, 22, 24, '#f39ac0'); px(cc, 256, 52, 18, 22, '#ffe0ec'); px(cc, 264, 52, 1, 22, '#f39ac0'); px(cc, 270, 62, 2, 2, '#f4cf3a');
      px(cc, 280, 54, 26, 20, '#bfe3f2'); px(cc, 280, 54, 26, 1, '#ffffff'); disc(cc, 290, 68, 4, '#c08a52'); disc(cc, 288, 63, 2, '#c08a52'); disc(cc, 292, 63, 2, '#c08a52'); disc(cc, 300, 68, 3, '#e2483d');
      // papan & pagar proyek
      for (let x = 134; x < 312; x += 14) { if (x > 196 && x < 228) continue; px(cc, x, 112, 12, 3, '#ffffff'); for (let k = 0; k < 12; k += 4) px(cc, x + k, 112, 2, 3, '#f08a32'); px(cc, x + 1, 115, 1, 6, '#7d8a98'); px(cc, x + 10, 115, 1, 6, '#7d8a98'); }
      // bangku di taman
      px(cc, 80, 134, 30, 3, PAL.wood); px(cc, 80, 134, 30, 1, PAL.woodL); px(cc, 80, 128, 30, 3, PAL.wood); px(cc, 82, 137, 2, 5, PAL.woodD); px(cc, 106, 137, 2, 5, PAL.woodD);
    });
    // tiang lampu jalan
    for (const lx of [40, 160, 280]) { px(c, lx, 62, 2, 22, '#5f6c7a'); px(c, lx - 3, 60, 8, 3, '#3a3f4a'); px(c, lx - 2, 63, 6, 1, N ? '#ffd96a' : '#e8eef2'); }
  };

  // pohon taman; rumah burung buatan Russel tergantung di sini, lalu burung datang
  S.objs.push({ x: 40, y: 156, hit: [22, 112, 36, 46], go: [62, 158],
    draw(c, t) {
      drawTree(c, this.x, this.y, { r: 16 });
      const col = EX.made && EX.made.birdhouse;
      if (col !== undefined) {
        px(c, 47, 120, 1, 6, PAL.woodD);
        drawWoodThing(c, 48, 140, 'birdhouse', { color: col }, t);
        const hop = Math.floor(t * 2) % 5 === 0 ? 1 : 0;
        drawBird(c, 56, 124 - hop, t, '#4f86e0');
      }
    },
    tap() { const has = EX.made && EX.made.birdhouse !== undefined; say(has ? [{ k: 'birdhouse' }, { k: 'birdcome' }] : [{ k: 'tree' }]); if (has) sfx('chime'); } });

  // ekskavator: ketuk untuk mulai membangun
  S.objs.push({ x: 154, y: 154, hit: [132, 120, 46, 36], go: [160, 166], skin: 'fn:siteDigger',
    draw(c, t) {
      shadow(c, 154, 155, 22);
      ST_ART.excavator(c, 150, 155);
      if (Math.floor(t * 2) % 2) drawStar(c, 154, 112, '#ffd84a');
    },
    tap() { say([{ k: 'excavator' }]); },
    arrive() { G.boy.dir = 'left'; bdOpen('house'); } });
  // hasil bangunan Russel: rumah, menara, jembatan
  [['house', 206, 170], ['tower', 246, 170], ['bridge', 288, 170]].forEach(([k, x, y]) => S.objs.push({ x, y,
    get hidden() { return !(EX.built && k in EX.built); },
    get hit() { return [x - 18, y - (k === 'tower' ? 44 : 30), 36, k === 'tower' ? 46 : 32]; }, go: [x, y + 4],
    draw(c, t) { drawBuilt(c, x, y, k, { color: EX.built[k] }, t, { carT: t * 0.25 }); },
    tap() { say([{ k }, { k: 'builddone' }]); sfx('sparkle'); fx('spark', x, y - 30, 6); } }));
  // kerucut jalan
  [[186, 132], [298, 128], [120, 104]].forEach(([x, y]) => S.objs.push({ x, y, hit: [x - 6, y - 12, 12, 13], go: [x, y + 8], draw(c) { shadow(c, x, y, 5); ST_ART.cone(c, x, y + 1); }, tap() { say([{ k: 'cone' }]); } }));
  // mobil buatan Russel diparkir di jalan: ketuk untuk menyetir
  const myCar = { x: 70, y: 104, drv: 0, dir: 1,
    get hidden() { return !EX.car; },
    get hit() { return [this.x - 24, this.y - 26, 48, 27]; }, get go() { return [this.x + 28, this.y - 6]; },
    draw(c, t) { drawMyCar(c, this.x, this.y, EX.car, t, { moving: this.drv > 0, driver: this.drv > 0, beam: this.drv > 0 && G.night, dir: this.dir }); },
    update(dt) {
      if (this.drv <= 0) return;
      this.drv -= dt;
      this.x += dt * 80;
      if (this.x > W + 30) this.x = -30;
      if (this.drv <= 0 || (this.drv < 1.2 && this.x >= 70 && this.x < 80)) { this.drv = 0; this.x = 70; G.boy.hidden = false; G.boy.x = 98; G.boy.y = 100; G.boy.dir = 'left'; say([{ k: 'arrived' }]); }
    },
    tap() {
      sfx('chime');
      offerPics(this.x, this.y - 30, [
        picBtn('drive', 'take', () => { this.drv = 6; G.boy.hidden = true; sfx('horn'); say([{ k: 'drive', by: G.boy }, { k: 'beep' }]); }),
        picBtn('beep', 'give', () => { sfx('horn'); say([{ k: 'beep', by: G.boy }]); }),
      ]);
    } };
  S.objs.push(myCar);
  // truk pengangkut parkir
  S.objs.push({ x: 246, y: 106, hit: [226, 86, 40, 20], go: [246, 112], draw(c, t) { shadow(c, 246, 107, 16); truckArt(c, 246, 107, false, t); }, tap() { say([{ k: 'truck' }]); sfx('horn'); } });
  S.objs.push(npc('builder', 120, 150, 'right', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'builder', by: 'np' }, { k: 'whatbuild', by: 'np' }, { k: 'house', by: 'me' }],
      [{ k: 'hardhat', by: 'np' }, { k: 'a_ok', by: 'me' }],
      [{ k: 'crane', by: 'np' }, { k: 'brick', by: 'np' }],
    ],
  }));
  S.exits = [
    { hit: [28, 40, 46, 38], arrow: [51, 82, 'up'], go: [51, 80], to: 'garage', at: [160, 160] },
    { hit: [144, 44, 26, 34], arrow: [157, 82, 'up'], go: [157, 80], to: 'carpentry', at: [160, 160] },
    { hit: [252, 48, 26, 30], arrow: [265, 82, 'up'], go: [265, 80], to: 'toyshop', at: [160, 160] },
    { hit: [294, 86, 26, 22], arrow: [308, 98, 'right'], go: [314, 98], to: 'farm', at: [296, 150] },
    { hit: [0, 86, 26, 22], arrow: [12, 98, 'left'], go: [6, 98], to: 'airport', at: [296, 134] },
  ];
  S.enter = () => { myCar.drv = 0; myCar.x = 70; };
  return S;
})();

// ================= BENGKEL MOBIL =================
function indoorFloor(c, top, tones, seam, seed) { drawTiles(c, 0, top, W, H - top, 16, tones, seam, seed); wallFoot(c, top); px(c, 0, 0, 4, H, '#5f6c7a'); px(c, 316, 0, 4, H, '#5f6c7a'); }
function doorMat(c) { px(c, 140, 172, 40, 8, '#6f7f92'); px(c, 142, 173, 36, 6, '#8497ab'); for (let x = 144; x < 178; x += 4) px(c, x, 174, 1, 4, '#6f7f92'); }
SCENES.garage = (() => {
  const S = { id: 'garage', place: 'garage', outdoor: false, walk: [8, 92, 312, 174], spawn: [160, 160], blocks: [[262, 104, 44, 10], [14, 140, 40, 10]], objs: [], lights: [[80, 60, 50], [240, 60, 50]] };
  S.bg = c => {
    px(c, 0, 0, W, 84, '#cfd9e2'); for (let x = 0; x < W; x += 20) { px(c, x, 0, 1, 80, '#bfcad4'); px(c, x + 1, 0, 1, 80, '#dfe7ee'); }
    px(c, 0, 78, W, 6, '#7d8a98'); px(c, 0, 78, W, 1, '#a9b6c4');
    indoorFloor(c, 84, ['#a7adb6', '#a2a8b1', '#adb3bc'], '#969ca6', 141);
    oval(c, 96, 150, 14, 4, 'rgba(40,40,50,0.18)'); oval(c, 228, 166, 10, 3, 'rgba(40,40,50,0.15)');
    doorMat(c);
    bgOutlined(c, cc => {
      cc.save(); cc.translate(0, 14);
      // pintu gulung besar di belakang
      px(cc, 118, 4, 84, 60, '#7d8a98'); for (let y = 6; y < 64; y += 4) px(cc, 120, y, 80, 1, '#9aa8b8'); px(cc, 116, 2, 88, 3, '#5f6c7a');
      // papan alat
      px(cc, 16, 10, 80, 34, '#8a6440'); px(cc, 17, 11, 78, 32, '#b08654');
      stHammer(cc, 30, 38); stWrench(cc, 48, 38); stDriver(cc, 64, 38); stScrew(cc, 82, 36);
      // rak ban
      px(cc, 226, 8, 84, 3, PAL.woodD); px(cc, 226, 34, 84, 3, PAL.woodD);
      for (let i = 0; i < 4; i++) { disc(cc, 238 + i * 20, 24, 9, '#2a2a2e'); disc(cc, 238 + i * 20, 24, 4, '#7d8a98'); }
      for (let i = 0; i < 4; i++) { disc(cc, 238 + i * 20, 50, 9, '#2a2a2e'); disc(cc, 238 + i * 20, 50, 4, '#c9c9d2'); }
      cc.restore();
    });
  };
  // pengangkat mobil: mobil Russel di atasnya (atau rangka kosong)
  S.objs.push({ x: 160, y: 130, hit: [112, 92, 96, 40], go: [160, 140], skin: 'fn:carLift',
    draw(c, t) {
      shadow(c, 160, 131, 46);
      px(c, 118, 98, 5, 33, '#f4cf3a'); px(c, 197, 98, 5, 33, '#f4cf3a'); px(c, 118, 98, 1, 33, '#fff2a8'); px(c, 197, 98, 1, 33, '#fff2a8');
      px(c, 114, 124, 92, 5, '#5f6c7a'); px(c, 114, 124, 92, 1, '#7d8a98'); for (let i = 0; i < 11; i++) px(c, 117 + i * 8, 126, 4, 1, i % 2 ? '#f4cf3a' : '#3a3f4a');
      if (EX.car) drawMyCar(c, 160, 124, EX.car, t, { noShadow: true });
      else { drawMyCar(c, 160, 124, { body: 'policecar', tires: 0, steer: false, light: false, color: 'gray' }, t, { noShadow: true }); }
      if (Math.floor(t * 2) % 2) drawStar(c, 160, EX.car ? 94 : 100, '#ffd84a');
    },
    tap() { say([{ k: EX.car ? 'mycar' : 'makecar' }]); },
    arrive() { G.boy.dir = 'up'; bdOpen('car'); } });
  // tumpukan ban
  S.objs.push({ x: 284, y: 114, hit: [266, 86, 36, 30], go: [284, 122],
    draw(c) { shadow(c, 284, 114, 14); for (let i = 0; i < 3; i++) { oval(c, 284, 110 - i * 7, 13, 5, '#2a2a2e'); oval(c, 284, 109 - i * 7, 6, 2, '#5a5a62'); } },
    tap() { say([{ k: 'tire' }]); sfx('bounce'); } });
  // kotak perkakas merah
  S.objs.push({ x: 34, y: 150, hit: [18, 132, 34, 20], go: [58, 154], draw(c) { shadow(c, 34, 150, 14); px(c, 20, 138, 28, 12, '#e2483d'); px(c, 20, 138, 28, 2, '#ff8a7a'); px(c, 20, 144, 28, 1, '#a8352b'); px(c, 28, 134, 12, 2, RB_K); px(c, 28, 134, 2, 5, RB_K); px(c, 38, 134, 2, 5, RB_K); }, tap() { say([{ k: 'wrench' }]); sfx('tap'); } });
  S.objs.push(npc('mechanic', 240, 140, 'left', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'mechanic', by: 'np' }, { k: 'makecar', by: 'np' }, { k: 'a_yes', by: 'me' }],
      [{ k: 'tire', by: 'np' }, { k: 'n4', by: 'np' }],
      [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }],
    ],
  }));
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'newstreet', at: [51, 86] }];
  return S;
})();

// ================= TUKANG KAYU =================
SCENES.carpentry = (() => {
  const S = { id: 'carpentry', place: 'carpentry', outdoor: false, walk: [8, 92, 312, 174], spawn: [160, 160], blocks: [[14, 128, 50, 12], [236, 98, 70, 8]], objs: [], lights: [[160, 60, 60], [60, 60, 40]] };
  S.bg = c => {
    drawPlanks(c, 0, 0, W, 84, ['#c08a52', '#b88250', '#c89458'], '#8a6440', 151, 8, 52);
    px(c, 0, 78, W, 6, '#7d5230'); px(c, 0, 78, W, 1, '#a8743c');
    drawPlanks(c, 0, 84, W, 96, ['#d9b27a', '#d2aa72', '#dfba84'], '#b08654', 152, 10, 60); wallFoot(c, 84);
    px(c, 0, 0, 4, H, '#7d5230'); px(c, 316, 0, 4, H, '#7d5230');
    // serbuk kayu di lantai
    const r = rng(153); for (let i = 0; i < 40; i++) px(c, 100 + Math.floor(r() * 120), 120 + Math.floor(r() * 40), 2, 1, '#f0d29a');
    doorMat(c);
    bgOutlined(c, cc => {
      cc.save(); cc.translate(0, 14);
      // papan alat
      px(cc, 90, 8, 100, 36, '#8a6440'); px(cc, 91, 9, 98, 34, '#a87a48');
      stSaw(cc, 110, 34); stHammer(cc, 132, 38); stDriver(cc, 150, 38); stWrench(cc, 168, 38);
      // rak hasil karya
      for (const y of [22, 50]) { px(cc, 230, y, 80, 3, PAL.woodD); px(cc, 230, y, 80, 1, PAL.woodL); }
      // jendela
      px(cc, 16, 8, 50, 34, PAL.woodD); px(cc, 18, 10, 46, 30, G.night ? '#2a3a6a' : '#a8dcf5'); px(cc, 40, 10, 2, 30, PAL.woodD); px(cc, 18, 24, 46, 2, PAL.woodD);
      cc.restore();
    });
  };
  // hasil karya di rak (tampil setelah dibuat)
  [['birdhouse', 250, 36], ['chair', 284, 36], ['woodboat', 266, 64]].forEach(([k, x, y]) => S.objs.push({ flat: true, y: 0,
    get hidden() { return !(EX.made && k in EX.made); }, hit: [x - 14, y - 28, 28, 30], go: [x, 104],
    draw(c, t) { drawWoodThing(c, x, y, k, { color: EX.made[k] }, t); },
    tap() { say([{ k }, { k: 'makedone' }]); sfx('chime'); } }));
  // tumpukan kayu
  S.objs.push({ x: 38, y: 140, hit: [14, 116, 50, 26], go: [72, 144], draw(c) { shadow(c, 38, 140, 24); for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) { const x = 18 + j * 14 + i * 7, y = 134 - i * 9; disc(c, x, y, 6, '#c08a52'); disc(c, x, y, 4, '#e8b878'); disc(c, x, y, 1, '#a8743c'); } }, tap() { say([{ k: 'wood' }]); sfx('tap'); } });
  // meja kerja: ketuk untuk bertukang
  S.objs.push({ x: 160, y: 128, hit: [112, 96, 96, 34], go: [160, 140], skin: 'fn:woodBench',
    draw(c, t) {
      shadow(c, 160, 129, 46);
      px(c, 116, 104, 88, 7, PAL.wood); px(c, 116, 104, 88, 2, PAL.woodL); px(c, 116, 110, 88, 1, PAL.woodD);
      px(c, 120, 111, 5, 18, PAL.woodD); px(c, 195, 111, 5, 18, PAL.woodD); px(c, 125, 120, 70, 2, PAL.woodD);
      px(c, 130, 99, 40, 5, '#e8b878'); px(c, 130, 99, 40, 1, '#f6d6a6'); stSaw(c, 178, 104);
      px(c, 196, 98, 6, 6, '#7d8a98'); px(c, 198, 96, 2, 2, '#9aa8b8');
      if (Math.floor(t * 2) % 2) drawStar(c, 160, 88, '#ffd84a');
    },
    tap() { say([{ k: 'woodwork' }]); },
    arrive() { G.boy.dir = 'up'; bdOpen('wood'); } });
  S.objs.push(npc('carpenter', 92, 120, 'right', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'carpenter', by: 'np' }, { k: 'whatmake', by: 'np' }, { k: 'birdhouse', by: 'me' }],
      [{ k: 'hammer', by: 'np' }, { k: 'nail', by: 'np' }],
      [{ k: 'wood', by: 'np' }, { k: 'saw', by: 'np' }],
    ],
  }));
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'newstreet', at: [157, 86] }];
  return S;
})();

// ================= TOKO MAINAN =================
SCENES.toyshop = (() => {
  const S = { id: 'toyshop', place: 'toyshop', outdoor: false, walk: [8, 92, 312, 174], spawn: [160, 160], blocks: [[240, 106, 70, 12]], objs: [], lights: [[160, 60, 70]] };
  S.bg = c => {
    px(c, 0, 0, W, 84, '#ffe8f0'); for (let x = 0; x < W; x += 16) px(c, x, 0, 8, 84, '#fff2f6');
    px(c, 0, 78, W, 6, '#f39ac0'); px(c, 0, 78, W, 1, '#fcd0e2');
    indoorFloor(c, 84, ['#f6e6c8', '#f0deb8', '#faecd2'], '#e0c89a', 161);
    doorMat(c);
    bgOutlined(c, cc => {
      cc.save(); cc.translate(0, 14);
      for (const y of [26, 54]) { px(cc, 12, y, 120, 3, PAL.woodD); px(cc, 12, y, 120, 1, PAL.woodL); }
      cc.restore();
    });
  };
  // mainan di rak: ketuk untuk mendengar namanya
  const shelf = [['bear', 26, 40], ['toyrobot', 50, 40], ['ball', 74, 40], ['blocks', 100, 40], ['kite', 124, 40], ['toytrain', 34, 68], ['policecar', 72, 68], ['plane', 108, 68]];
  shelf.forEach(([k, x, y]) => S.objs.push({ flat: true, y: 0, hit: [x - 11, y - 22, 22, 24], go: [x, 100],
    draw(c) { if (k === 'policecar') drawMyCar(c, x, y, { body: 'policecar' }, 0, { noShadow: true }); else if (k === 'plane') drawMyPlane(c, x, y, { wing: 'twowing', tail: 1, prop: 1, color: 'yellow' }, 0, { noShadow: true }); else if (ST_ART[k]) ST_ART[k](c, x, y); },
    tap() { say([{ k }]); sfx('pop'); } }));
  // meja rel kereta besar: kereta mainan berjalan memutar
  S.objs.push({ x: 160, y: 140, hit: [110, 100, 100, 44], go: [160, 152], skin: 'fn:trackTable',
    draw(c, t) {
      shadow(c, 160, 141, 50);
      px(c, 112, 108, 96, 26, '#8a6440'); px(c, 112, 108, 96, 2, '#b08654'); px(c, 116, 134, 5, 8, PAL.woodD); px(c, 199, 134, 5, 8, PAL.woodD);
      px(c, 116, 111, 88, 20, '#9fd06a');
      oval(c, 160, 121, 36, 7, '#7d8a98'); oval(c, 160, 121, 33, 5, '#9fd06a'); oval(c, 160, 121, 30, 4, '#7d8a98'); oval(c, 160, 121, 28, 3, '#9fd06a');
      disc(c, 160, 120, 4, PAL.leafD); disc(c, 159, 119, 3, PAL.leaf);
      const a = t * 1.2, tx = 160 + Math.cos(a) * 31, ty = 121 + Math.sin(a) * 6;
      drawToyTrain(c, tx, ty + 2, -Math.sin(a) >= 0 ? 1 : -1, t);
      if (Math.floor(t * 2) % 2) drawStar(c, 160, 98, '#ffd84a');
    },
    tap() { say([{ k: 'toytrain' }, { k: 'choochoo' }]); },
    arrive() { G.boy.dir = 'up'; bdOpen('track'); } });
  // meja kasir
  S.objs.push({ x: 274, y: 118, hit: [240, 92, 70, 28], go: [250, 128], draw(c) { shadow(c, 274, 118, 34); px(c, 242, 100, 66, 18, '#f39ac0'); px(c, 242, 100, 66, 3, '#fcd0e2'); px(c, 290, 92, 12, 8, '#3a3f4a'); px(c, 292, 93, 8, 3, '#7cf0c4'); ST_ART.blocks(c, 258, 100); }, tap() { say([{ k: 'toyshop' }]); } });
  S.objs.push(npc('shopkeeper', 274, 98, 'down', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'shopkeeper', by: 'np' }, { k: 'buildtrack', by: 'np' }, { k: 'a_ok', by: 'me' }],
      [{ k: 'straight', by: 'np' }, { k: 'curve', by: 'np' }],
      [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }],
    ],
  }));
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'newstreet', at: [265, 86] }];
  return S;
})();

// ================= BANDARA =================
SCENES.airport = (() => {
  const S = {
    id: 'airport', place: 'airport', outdoor: true, walk: [8, 92, 312, 174], spawn: [296, 134],
    blocks: [[14, 92, 44, 12], [210, 92, 104, 14]], objs: [], lights: [[36, 80, 40], [262, 90, 50]],
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 70; y++) { const k = y / 70; px(c, 0, y, W, 1, N ? `rgb(${24 + k * 26},${28 + k * 28},${70 + k * 40})` : `rgb(${140 + k * 70},${206 + k * 30},250)`); }
    if (N) { const r = rng(171); for (let i = 0; i < 40; i++) px(c, Math.floor(r() * W), Math.floor(r() * 60), 1, 1, '#ffffff'); }
    for (let x = 0; x < W; x += 2) { const h = 8 + Math.sin(x / 40) * 4; px(c, x, 70 - h, 2, h + 4, N ? '#3e5a48' : '#8fcf6a'); }
    drawGrass(c, 0, 70, W, 110, 172, false);
    // landasan
    px(c, 0, 132, W, 30, '#6f737c'); groundPatches(c, 0, 132, W, 30, 173, '#676b74', 0.6);
    px(c, 0, 132, W, 2, '#f4f0e0'); px(c, 0, 160, W, 2, '#f4f0e0');
    for (let x = 6; x < W; x += 30) px(c, x, 146, 16, 2, '#f4f0e0');
    px(c, 0, 96, W, 36, '#a9adb4'); groundPatches(c, 0, 96, W, 36, 174, '#a2a6ad', 0.6);
    for (let x = 0; x < W; x += 20) px(c, x, 96, 1, 36, '#9a9ea6');
    for (let x = 0; x < W; x += 8) { px(c, x, 131, 3, 1, N ? '#ffd96a' : '#f4cf3a'); px(c, x, 162, 3, 1, N ? '#7ab4ff' : '#c9d4e0'); }
    bgOutlined(c, cc => {
      // menara kontrol
      px(cc, 28, 30, 16, 72, '#e8eef2'); px(cc, 28, 30, 4, 72, '#ffffff'); px(cc, 40, 30, 4, 72, '#c9d4e0');
      px(cc, 18, 14, 36, 16, '#2a3a4a'); px(cc, 20, 16, 32, 10, N ? '#ffd96a' : '#7cf0c4'); for (let x = 26; x < 52; x += 8) px(cc, x, 16, 1, 10, '#2a3a4a');
      px(cc, 16, 10, 40, 4, '#e2483d'); px(cc, 35, 2, 2, 8, '#7d8a98'); disc(cc, 36, 2, 1, '#e2483d');
      px(cc, 32, 86, 8, 16, '#5f6c7a');
      // hanggar melengkung
      for (let k = 0; k < 30; k++) { const w = Math.round(Math.sqrt(1 - ((29 - k) / 30) ** 2) * 52); px(cc, 262 - w, 42 + k * 2, w * 2, 2, k % 3 ? '#dfe6ee' : '#c9d4e0'); }
      px(cc, 210, 100, 104, 4, '#9aa8b8');
      px(cc, 232, 56, 60, 44, '#5f6c7a'); px(cc, 234, 58, 56, 42, N ? '#3a4458' : '#7d8a98'); for (let y = 60; y < 100; y += 6) px(cc, 234, y, 56, 1, '#6a7686');
      px(cc, 246, 46, 32, 8, '#4f86e0'); px(cc, 246, 46, 32, 1, '#8fb4ee');
      // kantong angin
      px(cc, 180, 64, 2, 32, '#7d8a98');
    });
  };
  // kantong angin bergoyang
  S.objs.push({ flat: true, y: 0, hit: [176, 60, 30, 16], go: [184, 104], draw(c, t) { const w = Math.round(Math.sin(t * 3) * 1); for (let i = 0; i < 4; i++) px(c, 182 + i * 5, 64 + w * (i > 1 ? 1 : 0), 5, 6 - i, i % 2 ? '#ffffff' : '#f08a32'); }, tap() { say([{ k: 'windy' }]); } });
  S.objs.push({ flat: true, y: 0, hit: [16, 8, 42, 94], go: [36, 110], draw() {}, tap() { say([{ k: 'controltower' }]); } });
  // hanggar: ketuk untuk merakit pesawat
  S.objs.push({ flat: true, y: 0, hit: [226, 44, 72, 58], go: [262, 112], skin: 'fn:hangarDoor',
    draw(c, t) {
      if (!EX.plane) drawMyPlane(c, 262, 98, { wing: null, wheels: 0 }, t, { noShadow: true });
      if (Math.floor(t * 2) % 2) drawStar(c, 262, 36, '#ffd84a');
    },
    tap() { say([{ k: 'hangar' }, { k: 'makeplane' }]); },
    arrive() { G.boy.dir = 'up'; bdOpen('plane'); } });
  // pesawat buatan Russel: ketuk untuk terbang
  const myPlane = { x: 140, y: 126, fly: 0,
    get hidden() { return !EX.plane; },
    get hit() { return [this.x - 26, this.y - 28, 52, 30]; }, get go() { return [this.x - 34, this.y - 4]; },
    draw(c, t) { const up = this.fly > 0 ? Math.max(0, (2.2 - this.fly)) * 40 : 0; drawMyPlane(c, this.x, this.y - up, Object.assign({ tail: 1, prop: 1 }, EX.plane), t, { spin: this.fly > 0, pilot: this.fly > 0, noShadow: this.fly > 0 }); },
    update(dt) {
      if (this.fly <= 0) return;
      this.fly -= dt; this.x += dt * (60 + (2.6 - this.fly) * 50);
      if (this.fly <= 0) { this.x = 140; G.boy.hidden = false; bdOpen('plane', 'fly'); }
    },
    tap() {
      sfx('chime');
      offerPics(this.x, this.y - 30, [
        picBtn('fly', 'take', () => { this.fly = 2.6; G.boy.hidden = true; sfx('whoosh'); say([{ k: 'fly', by: G.boy }]); }),
        picBtn('myplane', 'give', () => say([{ k: 'myplane', by: G.boy }])),
      ]);
    } };
  S.objs.push(myPlane);
  // pesawat besar lewat di langit
  S.objs.push({ top: true, y: 999, k: 0, wait: 4, hidden: false,
    get hit() { return this.wait > 0 ? null : [this.k - 40, 8, 80, 30]; }, go: null,
    draw(c) { if (this.wait <= 0) drawBigPlane(c, this.k, 24, 1); },
    update(dt) { if (this.wait > 0) { this.wait -= dt; this.k = -60; return; } this.k += dt * 40; if (this.k > W + 60) this.wait = 9; },
    tap() { say([{ k: 'plane' }]); sfx('whoosh'); } });
  S.objs.push(npc('pilot', 200, 116, 'down', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'pilot', by: 'np' }, { k: 'makeplane', by: 'np' }, { k: 'a_yes', by: 'me' }],
      [{ k: 'runway', by: 'np' }, { k: 'fly', by: 'me' }],
      [{ k: 'q_where', by: 'np' }, { k: 'mountain', by: 'me' }],
    ],
  }));
  S.enter = () => { myPlane.fly = 0; myPlane.x = 140; };
  S.exits = [{ hit: [294, 108, 26, 40], arrow: [308, 126, 'right'], go: [314, 126], to: 'newstreet', at: [18, 98] }];
  return S;
})();

// ================= PERTANIAN: jalan ke Jalan Baru + manusia salju musim dingin =================
(function farmAdditions() {
  const F = SCENES.farm, baseBg = F.bg;
  F.bg = c => {
    baseBg(c);
    drawPath(c, 290, 150, 24, 30, 181);
    bgOutlined(c, cc => {
      shadow(cc, 312, 148, 5);
      px(cc, 311, 132, 2, 16, PAL.woodD); px(cc, 300, 122, 18, 11, PAL.woodD); px(cc, 301, 123, 16, 9, PAL.wood); px(cc, 301, 123, 16, 1, PAL.woodL);
      px(cc, 305, 125, 2, 6, '#f4cf3a'); px(cc, 308, 127, 4, 4, '#f08a32');
    });
  };
  F.exits.push({ hit: [288, 156, 32, 24], arrow: [302, 168, 'down'], go: [302, 176], to: 'newstreet', at: [296, 98] });
  F.objs.push({ x: 100, y: 112, get hidden() { return EX.season !== 'winter'; },
    get hit() { return EX.snowman ? [86, 74, 28, 40] : [84, 98, 32, 16]; }, go: [82, 120],
    draw(c, t) {
      if (EX.snowman) drawSnowman(c, this.x, this.y, null, t);
      else { shadow(c, 100, 112, 14); oval(c, 100, 109, 14, 5, '#dfe8f0'); oval(c, 99, 108, 12, 4, '#ffffff'); disc(c, 106, 106, 3, '#ffffff'); if (Math.floor(t * 2) % 2) drawStar(c, 100, 94, '#ffd84a'); }
    },
    tap() { say([{ k: EX.snowman ? 'snowman' : 'makesnowman' }]); },
    arrive() { G.boy.dir = 'right'; bdOpen('snow'); } });
})();

// ================= TEMA DI MENU ORANG TUA =================
THEMES.push(
  { name: 'Jalan Baru & proyek bangunan', where: 'Jalan ke bawah dari Pertanian (pojok kanan bawah). Ketuk ekskavator: pilih rumah, menara, atau jembatan, gali tanah, truk mengangkut, pasang batu bata sambil berhitung, lalu pilih warna. Bangunan jadi berdiri di proyek. Ada pintu ke Bengkel Mobil, Tukang Kayu, dan Toko Mainan.', words: ['newstreet', 'site', 'builder', 'whatbuild', 'house', 'tower', 'bridge', 'excavator', 'dig', 'truck', 'truckgo', 'crane', 'brick', 'putbrick', 'roof', 'flag', 'cardrive', 'builddone', 'cone', 'hardhat'] },
  { name: 'Bengkel mobil', where: 'Pintu kiri di Jalan Baru. Ketuk pengangkat mobil: pilih mobil polisi, pemadam kebakaran, atau es krim, pasang 4 roda sambil berhitung, setir, lampu, lalu warna. Mobilnya parkir di Jalan Baru; ketuk untuk menyetir.', words: ['garage', 'mechanic', 'makecar', 'pickcar', 'policecar', 'firetruck', 'icecreamtruck', 'tire', 'putwheels', 'steeringwheel', 'carlight', 'mycar', 'drive', 'beep'] },
  { name: 'Tukang kayu', where: 'Pintu tengah di Jalan Baru. Ketuk meja kerja: pilih rumah burung, kursi, atau perahu kayu, gergaji, pukul 4 paku, lalu cat. Hasilnya dipajang di rak; rumah burung digantung di pohon Jalan Baru dan burung datang.', words: ['carpentry', 'carpenter', 'woodwork', 'whatmake', 'birdhouse', 'chair', 'woodboat', 'wood', 'saw', 'nail', 'hammernail', 'hammer', 'paint', 'makedone', 'birdcome'] },
  { name: 'Toko mainan & rel kereta', where: 'Pintu kanan di Jalan Baru. Ketuk meja rel: pilih potongan rel yang cocok (lurus, belok, jembatan, terowongan) sampai stasiun tersambung, lalu kereta berjalan. Ada 3 papan yang bergantian. Mainan di rak bisa diketuk.', words: ['toyshop', 'shopkeeper', 'buildtrack', 'straight', 'curve', 'bridge', 'tunnel', 'whichone', 'tryother', 'traingo', 'choochoo', 'toytrain', 'bear', 'toyrobot', 'ball', 'blocks', 'kite'] },
  { name: 'Bandara', where: 'Jalan ke kiri dari Jalan Baru. Ketuk hanggar: pilih sayap, pasang ekor, baling-baling, 3 roda, lalu warna. Ketuk pesawatnya untuk terbang di atas desa; pemandangan di bawah disebutkan satu per satu.', words: ['airport', 'pilot', 'makeplane', 'pickwing', 'bigwing', 'smallwing', 'twowing', 'planetail', 'propeller', 'myplane', 'fly', 'land', 'lookdown', 'runway', 'controltower', 'hangar', 'plane'] },
  { name: 'Manusia salju', where: 'Saat musim dingin (tombol musim), tumpukan salju muncul di Pertanian di samping rumah. Gelindingkan bola salju besar, sedang, dan kecil, pasang hidung wortel, 3 kancing, topi, dan syal.', words: ['snowman', 'makesnowman', 'bigball', 'midball', 'smallball', 'big', 'small', 'putnose', 'carrot', 'coatbutton', 'puthat', 'putscarf', 'winter'] },
);
