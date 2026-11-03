// Gereja: tarik tali lonceng, duduk dan berdoa, nyalakan lilin, bernyanyi bersama paduan suara anak.

LOOKS.pastor = { skin: '#efbf94', hair: '#3a2a20', hairL: '#5a4a3a', style: 'dad', shirt: '#2a2a32', shirtD: '#1a1a20', tie: '#ffffff', pants: '#2a2a32', shoes: '#1a1a20' };
VOICE_ROLE.pastor = { pitch: 0.8, rate: 0.92, m: 1 };

// lonceng gereja: dua nada rendah yang lembut
function churchBell() {
  if (!Snd.ctx) return;
  [[392, 0], [294, 0.9], [392, 1.8], [294, 2.7]].forEach(([f, w]) => { Snd.tone(f, 1.6, { gain: 0.09, when: w, type: 'sine' }); Snd.tone(f * 2.01, 1.2, { gain: 0.03, when: w, type: 'sine' }); });
}
// organ: progresi akor yang tenang, dibuat sendiri (bukan lagu yang sudah ada)
function churchOrgan() {
  if (!Snd.ctx) return;
  const chords = [[262, 330, 392], [349, 440, 523], [392, 494, 587], [262, 330, 392]];
  chords.forEach((ch, i) => ch.forEach(f => Snd.tone(f, 1.5, { gain: 0.035, when: i * 1.3, type: 'triangle' })));
  [523, 587, 659, 587, 523, 494, 523].forEach((f, i) => Snd.tone(f, 0.6, { gain: 0.04, when: i * 0.72, type: 'sine' }));
}

SCENES.church = (() => {
  const S = { id: 'church', place: 'church', outdoor: false, walk: [8, 96, 312, 174], spawn: [160, 160], blocks: [], objs: [], lights: [[160, 60, 70], [40, 60, 40], [280, 60, 40]] };
  S.bg = c => {
    // dinding batu krem, lantai papan, karpet merah di lorong tengah
    px(c, 0, 0, W, 84, '#efe6d6');
    for (let y = 4, r = 0; y < 80; y += 8, r++) { px(c, 0, y, W, 1, '#e2d6c0'); for (let x = (r % 2) * 12; x < W; x += 24) px(c, x, y - 7, 1, 7, '#e2d6c0'); }
    px(c, 0, 78, W, 6, '#c9a873'); px(c, 0, 78, W, 1, '#e3c48c');
    drawPlanks(c, 0, 84, W, 96, ['#c08a52', '#b88450', '#c8925a'], '#9c6c3c', 111);
    wallFoot(c, 84);
    px(c, 142, 84, 36, 96, '#a8352b'); px(c, 144, 84, 32, 96, '#c9473a'); for (let y = 88; y < H; y += 12) px(c, 146, y, 28, 1, '#d9605a');
    // cahaya warna-warni dari kaca patri
    if (!G.night) for (const [x, cols] of [[30, ['rgba(226,72,61,0.12)', 'rgba(79,134,224,0.12)']], [262, ['rgba(244,207,58,0.12)', 'rgba(88,168,74,0.12)']]]) {
      for (let i = 0; i < 34; i++) { px(c, x + Math.round(i * 0.5), 84 + i, 14, 1, cols[0]); px(c, x + 14 + Math.round(i * 0.5), 84 + i, 14, 1, cols[1]); }
    }
    px(c, 0, 0, 4, H, '#9c8c70'); px(c, 316, 0, 4, H, '#9c8c70'); px(c, 0, 176, 144, 4, '#9c8c70'); px(c, 176, 176, 144, 4, '#9c8c70');
    bgOutlined(c, cc => {
      // jendela kaca patri melengkung
      for (const wx of [40, 280]) {
        px(cc, wx - 12, 34, 24, 40, '#7d6a5a'); disc(cc, wx, 34, 12, '#7d6a5a');
        const panes = ['#e2483d', '#4f86e0', '#f4cf3a', '#58a84a', '#9b6bd6', '#f08a32'];
        for (let i = 0; i < 6; i++) px(cc, wx - 10 + (i % 3) * 7, 40 + Math.floor(i / 3) * 16, 6, 15, panes[(i + wx) % 6]);
        disc(cc, wx, 34, 10, '#4f86e0'); disc(cc, wx, 34, 5, '#f4cf3a'); px(cc, wx - 1, 26, 2, 47, '#5a4a3a'); px(cc, wx - 10, 55, 20, 1, '#5a4a3a');
      }
      // panggung, meja altar, salib kayu
      px(cc, 110, 70, 100, 12, '#b88450'); px(cc, 110, 70, 100, 2, '#d9a56a'); px(cc, 110, 81, 100, 1, '#8a5a35');
      px(cc, 140, 56, 40, 14, '#a87444'); px(cc, 138, 54, 44, 4, '#fbf8f0'); px(cc, 138, 54, 44, 1, '#ffffff'); px(cc, 156, 58, 8, 12, '#f4cf3a');
      px(cc, 158, 22, 5, 30, PAL.woodD); px(cc, 158, 22, 2, 30, PAL.wood); px(cc, 149, 30, 23, 5, PAL.woodD); px(cc, 149, 30, 23, 2, PAL.wood);
      // pipa organ di dinding kiri
      for (let i = 0; i < 7; i++) { const h = 22 + Math.abs(3 - i) * -3 + 12; px(cc, 76 + i * 4, 72 - h, 3, h, '#c9c6c0'); px(cc, 76 + i * 4, 72 - h, 1, h, '#ffffff'); px(cc, 76 + i * 4, 72 - h, 3, 2, '#7d7c78'); }
    });
  };

  // tali lonceng di dekat pintu
  S.objs.push({ x: 22, y: 160, pull: 0, hit: [12, 92, 22, 70], go: [34, 160], skin: 'fn:bellRope',
    draw(c, t) {
      const d = Math.round(Math.sin(this.pull * 12) * 3 * Math.min(1, this.pull));
      px(c, 21, 0, 2, 140 + d, '#c9a873'); px(c, 22, 0, 1, 140 + d, '#e3c48c');
      oval(c, 22, 144 + d, 3, 5, '#e2483d'); px(c, 21, 148 + d, 3, 4, '#a8352b');
    },
    update(dt) { if (this.pull > 0) this.pull -= dt; },
    tap() { say([{ k: 'churchbell' }]); },
    arrive() { G.boy.dir = 'left'; doAct(G.boy, 'wave', 1.2); this.pull = 1.4; churchBell(); say([{ k: 'churchbell' }, { k: 'dingdong' }]); } });

  // tempat lilin
  const candles = { x: 222, y: 92, lit: false, hit: [210, 66, 24, 28], go: [222, 102], skin: 'fn:candles',
    draw(c, t) {
      shadow(c, 222, 92, 8);
      px(c, 221, 80, 3, 12, PAL.woodD); px(c, 212, 78, 21, 3, PAL.woodD); px(c, 212, 78, 21, 1, PAL.wood);
      for (const dx of [-6, 0, 6]) {
        const h = dx ? 7 : 9;
        px(c, 222 + dx - 1, 78 - h, 3, h, '#fbf8f0'); px(c, 222 + dx - 1, 78 - h, 1, h, '#ffffff');
        if (this.lit) { const f = Math.floor(t * 8 + dx) % 2; px(c, 222 + dx, 78 - h - 4 + f, 1, 3, '#ffd84a'); px(c, 222 + dx, 78 - h - 2, 1, 1, '#f08a32'); }
        else px(c, 222 + dx, 78 - h - 1, 1, 1, '#3a2a20');
      }
    },
    tap() { say([{ k: 'candle' }]); },
    arrive() { G.boy.dir = 'up'; this.lit = !this.lit; sfx(this.lit ? 'sparkle' : 'tap'); say([{ k: 'candle' }]); } };
  S.objs.push(candles);

  // organ dan paduan suara anak
  const choir = [npc('kid1', 246, 86, 'down', { lines: [[{ k: 'hello', by: 'me' }, { k: 'sing', by: 'np' }]] }), npc('kid4', 262, 88, 'down', { lines: [[{ k: 'hello', by: 'me' }, { k: 'sing', by: 'np' }]] }), npc('kid3', 278, 86, 'down', { lines: [[{ k: 'hello', by: 'me' }, { k: 'quiet', by: 'np' }]] })];
  choir.forEach(k => S.objs.push(k));
  S.objs.push({ x: 92, y: 96, hit: [72, 72, 40, 26], go: [92, 104], skin: 'obj-organ',
    draw(c) {
      shadow(c, 92, 96, 18);
      px(c, 74, 78, 36, 18, PAL.woodD); px(c, 74, 78, 36, 2, PAL.wood); px(c, 76, 84, 32, 4, '#ffffff'); for (let k = 0; k < 8; k++) px(c, 77 + k * 4, 84, 1, 4, '#c9c6c0');
      for (const k of [0, 1, 3, 4, 5, 7]) px(c, 78 + k * 4, 84, 2, 2, '#2a1d18');
      px(c, 76, 94, 3, 2, PAL.woodD); px(c, 105, 94, 3, 2, PAL.woodD);
    },
    tap() { say([{ k: 'sing' }]); },
    arrive() {
      G.boy.dir = 'up'; doAct(G.boy, 'wash', 2.5); churchOrgan(); fx('note', 92, 70, 4);
      choir.forEach((k, i) => setTimeout(() => { doAct(k, 'wave', 3); fx('note', k.x, k.y - 30, 2); }, i * 300));
      say([{ k: 'sing', zh: '我们一起唱！', by: G.boy }]);
    } });

  // pendeta di depan altar
  const pastor = npc('pastor', 160, 80, 'down', {
    go: [160, 100],
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'godlovesyou', by: 'np' }, { k: 'thanks', by: 'me' }],
      [{ k: 'pastor', by: 'me' }, { k: 'quiet', by: 'np' }],
      [{ k: 'pray', by: 'np' }, { k: 'amen', by: 'me' }],
    ],
  });
  S.objs.push(pastor);

  // bangku panjang: yang duduk menghadap altar, terlihat kepala dan bahunya
  const PEWS = [[40, 120], [180, 120], [40, 142], [180, 142], [40, 164], [180, 164]];
  PEWS.forEach(([px0, py], i) => S.objs.push({ x: px0 + 50, y: py, hit: [px0, py - 16, 100, 18], go: [px0 + 50, py + 6], skin: 'near:obj-bangku-',
    draw(c) {
      shadowRect(c, px0, py + 1, 100, 2);
      px(c, px0, py - 14, 100, 8, PAL.woodD); px(c, px0, py - 14, 100, 2, PAL.wood); px(c, px0 + 1, py - 12, 98, 1, '#c08a52');
      px(c, px0, py - 6, 100, 6, '#8a5a35'); px(c, px0, py - 6, 100, 1, PAL.wood);
      for (const dx of [2, 96]) px(c, px0 + dx, py - 16, 3, 16, PAL.woodD);
    },
    tap() { say([{ k: 'chair' }]); },
    arrive() {
      const b = G.boy; if (b.ride) return;
      const sx = Math.max(px0 + 12, Math.min(px0 + 88, b.x));
      b.dir = 'up';
      b.ride = () => { b.x = sx; b.y = py - 7; b.frame = 0; };
      b.rideEnd = () => { b.x = sx; b.y = py + 6; };
      fx('heart', sx, py - 34, 2);
      say([{ k: 'sitdown' }, { k: 'pray' }, { k: 'thankgod', by: b }, { k: 'amen' }]);
    } }));
  S.objs.push(npc('grandma', 66, 117, 'up', { lines: [[{ k: 'grandma', by: 'me' }, { k: 'quiet', by: 'np' }, { k: 'pray', by: 'np' }, { k: 'amen', by: 'me' }]] }));
  S.objs.push(npc('auntie', 236, 139, 'up', { lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'godlovesyou', by: 'np' }]] }));
  S.objs.push({ flat: true, y: 0, hit: [146, 18, 28, 36], go: [160, 100], draw() {}, tap() { say([{ k: 'cross' }]); } });

  S.enter = () => { candles.lit = false; };
  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'village', at: [262, 66] }];
  return S;
})();

// ================= GEDUNG GEREJA DI DESA =================
(function villageChurch() {
  const V = SCENES.village, baseBg = V.bg;
  V.bg = c => {
    baseBg(c);
    px(c, 252, 44, 20, 16, '#a9a6a0'); px(c, 252, 44, 20, 1, '#c9c6c0'); for (let y = 47; y < 60; y += 4) px(c, 252, y, 20, 1, '#8f8c86');
    bgOutlined(c, cc => {
      // menggantikan rumah hijau: dinding putih, atap curam, menara lonceng dengan salib
      px(cc, 230, 18, 60, 24, '#f4f0e6'); for (let y = 22; y < 42; y += 4) px(cc, 230, y, 60, 1, '#e6dfcf');
      for (let k = 0; k < 10; k++) px(cc, 228 + k, 8 + k, 64 - k * 2, 1, '#a8352b');
      px(cc, 228, 17, 64, 2, '#7d2a22');
      px(cc, 252, 0, 16, 18, '#f4f0e6'); px(cc, 252, 0, 16, 1, '#e6dfcf'); px(cc, 256, 4, 8, 8, '#5a4a3a'); disc(cc, 260, 9, 2, '#f4cf3a');
      px(cc, 255, 28, 10, 14, '#7d5230'); disc(cc, 260, 28, 5, '#7d5230'); px(cc, 259, 28, 2, 14, '#5a3a22'); px(cc, 252, 40, 16, 2, PAL.stoneD);
      for (const wx of [238, 278]) { px(cc, wx - 3, 24, 6, 10, '#4f86e0'); disc(cc, wx, 24, 3, '#4f86e0'); px(cc, wx - 3, 28, 6, 1, '#f4cf3a'); px(cc, wx, 21, 1, 13, '#3a2a20'); }
    });
  };
  V.exits.push({ hit: [248, 38, 28, 28], arrow: [262, 68, 'up'], go: [262, 60], to: 'church', at: [160, 160] });
})();

// ================= GAMBAR STIKER =================
const stChurch = (c, x, y) => {
  px(c, x - 14, y - 16, 28, 16, '#f4f0e6'); for (let k = 0; k < 8; k++) px(c, x - 15 + k, y - 24 + k, 30 - k * 2, 1, '#a8352b');
  px(c, x - 4, y - 34, 8, 12, '#f4f0e6'); px(c, x - 1, y - 42, 2, 8, '#f4cf3a'); px(c, x - 3, y - 39, 6, 2, '#f4cf3a');
  px(c, x - 3, y - 9, 6, 9, '#7d5230'); disc(c, x, y - 9, 3, '#7d5230');
};
Object.assign(ST_ART, {
  church: stChurch,
  pastor: (c, x, y) => drawPerson(c, x, y, { look: 'pastor', dir: 'down', mood: 'happy', noShadow: true }),
  churchbell: (c, x, y) => { oval(c, x, y - 12, 9, 10, '#d9a02a'); px(c, x - 10, y - 5, 20, 3, '#c98a1c'); oval(c, x, y - 15, 6, 6, '#f4cf3a'); disc(c, x, y - 1, 2, '#8a5a35'); px(c, x - 1, y - 24, 2, 3, '#8a5a35'); },
  dingdong: (c, x, y) => { oval(c, x - 4, y - 12, 8, 9, '#d9a02a'); oval(c, x - 4, y - 14, 5, 5, '#f4cf3a'); for (let i = 0; i < 3; i++) px(c, x + 8 + i * 3, y - 18 + i * 4, 3, 1, '#4f86e0'); },
  pray: (c, x, y) => { drawPerson(c, x, y, { look: 'me', dir: 'down', mood: 'sleepy', act: 'wash', noShadow: true }); drawHeart(c, x + 11, y - 26); },
  amen: (c, x, y) => { px(c, x - 4, y - 20, 3, 14, '#ffd7b5'); px(c, x + 1, y - 20, 3, 14, '#ffd7b5'); px(c, x - 4, y - 6, 8, 4, '#d9483b'); for (const [a, b] of [[-10, -22], [9, -18], [-8, -10]]) drawStar(c, x + a, y + b, '#ffd84a'); },
  candle: (c, x, y) => { px(c, x - 3, y - 14, 6, 14, '#fbf8f0'); px(c, x - 3, y - 14, 2, 14, '#ffffff'); px(c, x, y - 20, 1, 5, '#ffd84a'); px(c, x - 1, y - 18, 3, 2, '#f08a32'); },
  cross: (c, x, y) => { px(c, x - 2, y - 28, 5, 28, PAL.woodD); px(c, x - 2, y - 28, 2, 28, PAL.wood); px(c, x - 10, y - 21, 21, 5, PAL.woodD); px(c, x - 10, y - 21, 21, 2, PAL.wood); },
  quiet: (c, x, y) => { drawPerson(c, x, y, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); px(c, x - 1, y - 18, 2, 6, '#ffd7b5'); },
  godlovesyou: (c, x, y) => { drawHeart(c, x, y - 12, '#ef5a7a'); for (let k = 0; k < 8; k++) { const a = k * 0.785; px(c, x + Math.round(Math.cos(a) * 12), y - 12 + Math.round(Math.sin(a) * 12), 2, 1, '#ffd84a'); } },
  thankgod: (c, x, y) => { stChurch(c, x - 4, y); drawHeart(c, x + 14, y - 30); },
});
