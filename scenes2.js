// Tempat: Sekolah, Kantor Ayah, Pegunungan.

// ================= SEKOLAH =================
SCENES.school = (() => {
  const S = {
    id: 'school', place: 'school', outdoor: true, walk: [6, 66, 314, 176], spawn: [16, 150],
    blocks: [[66, 0, 188, 64], [242, 92, 52, 14]], objs: [],
    lights: [[89, 44, 20], [117, 44, 20], [201, 44, 20], [229, 44, 20]],
  };
  S.bg = c => {
    drawGrass(c, 0, 0, W, H, 31, true);
    drawPath(c, 0, 64, W, 112, 9);
    bgOutlined(c, cc => {
      drawHouse(cc, 70, 4, 180, 58, { roof: '#3f9a9a', roofD: '#2a7272', roofL: '#5cb8b8', wall: '#fbefd0', wallD: '#ecdcb4', door: 82, windows: [12, 40, 124, 152], flowerbox: true, night: G.night });
      disc(cc, 160, 16, 7, PAL.woodD); disc(cc, 160, 16, 6, '#fbf8f0'); disc(cc, 160, 16, 5, '#ffffff'); px(cc, 160, 12, 1, 5, '#2a1d18'); px(cc, 160, 16, 3, 1, '#2a1d18');
      [[100, 62], [210, 62]].forEach(([x, y]) => {
        shadow(cc, x + 5, y + 1, 7);
        px(cc, x, y - 6, 10, 6, '#c9473a'); px(cc, x + 7, y - 6, 3, 6, '#a8352b'); px(cc, x - 1, y - 7, 12, 2, '#e8735a');
        drawFlower(cc, x + 3, y - 6, FLOWER_COLORS[1], 0); drawFlower(cc, x + 7, y - 6, FLOWER_COLORS[3], 0);
      });
      // tiang bendera
      shadow(cc, 273, 62, 6);
      px(cc, 272, 4, 2, 58, '#a9a6a0'); px(cc, 272, 4, 1, 58, '#d6d3cc'); px(cc, 271, 2, 4, 2, '#f4cf3a'); px(cc, 269, 60, 8, 3, PAL.stoneD); px(cc, 269, 60, 8, 1, PAL.stone);
    });
    // pagar semak rendah di tepi halaman
    for (let x = 0; x < W; x += 9) { px(c, x, 174, 6, 2, PAL.grassD); px(c, x + 1, 173, 4, 1, PAL.grass); }
  };
  S.objs.push({ flat: true, y: 0, skin: 'fn:schoolFlag', draw(c, t) {
    // bendera merah putih
    for (let i = 0; i < 18; i++) { const w = Math.round(Math.sin(t * 4 - i * 0.5) * 1.2); px(c, 274 + i, 6 + w, 1, 6, '#e2483d'); px(c, 274 + i, 12 + w, 1, 6, '#ffffff'); }
  } });
  S.objs.push({ y: 20, hit: [70, 0, 180, 62], go: [160, 72], draw() {}, tap() { say([{ k: 'school' }]); } });

  // bak pasir kecil di halaman (papan tulis pindah ke ruang kelas)
  S.objs.push({ flat: true, y: 0, hit: [36, 84, 52, 24], go: [62, 112], skin: 'bg',
    draw(c) {
      shadowRect(c, 36, 106, 53, 2);
      px(c, 35, 85, 54, 22, '#3a2616'); px(c, 36, 86, 52, 20, PAL.woodD); px(c, 36, 86, 52, 1, PAL.woodL); px(c, 36, 104, 52, 2, PAL.wood);
      px(c, 38, 88, 48, 16, '#f2dca0'); px(c, 38, 88, 48, 2, '#d9c088');
      [[42, 92, 7], [66, 96, 8], [50, 100, 6], [74, 91, 5]].forEach(([a, b, w]) => { px(c, a, b, w, 2, '#e3c47a'); px(c, a + 1, b - 1, w - 2, 1, '#fbecc4'); });
      [[46, 96], [60, 94], [70, 101], [41, 101], [80, 97]].forEach(([a, b]) => px(c, a, b, 1, 1, '#c9a24a'));
      px(c, 58, 90, 4, 5, '#e2483d'); px(c, 57, 89, 6, 1, '#c9372e'); px(c, 61, 90, 1, 5, '#a8352b'); px(c, 59, 87, 1, 2, '#7d5230');
    },
    tap() { say([{ k: 'sand' }]); }, arrive() { doAct(G.boy, 'wash', 1); fx('dust', 62, 96, 4); sfx('plant'); } });

  const teacher = npc('teacher', 98, 110, 'down', {
    lines: () => {
      const ck = SHIRT_COLORS[G.outfit.shirt][0], w = WORDS[ck];
      return [
        [{ k: 'helloteacher', by: 'me' }, { k: 'hello', zh: CHILD + '，你好！', by: 'np' }],
        [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }],
        [{ k: 'q_color', by: 'np' }, { card: langCard('我喜欢' + w[0] + '！', 'wǒ xǐ huan ' + w[1], 'Aku suka ' + w[2] + '!', 'I like ' + WORDS_EN[ck] + '!', [WORDS_JA[ck][0] + 'が すき！', WORDS_JA[ck][1] + ' ga suki!']), by: 'me' }],
        [{ k: 'q_study', by: 'np' }, { k: 'a_like', by: 'me' }],
      ];
    },
  });
  S.teacher = teacher; // Bu guru mengajar di ruang kelas (scenes3.js)

  // Měiměi main ayunan
  // dua ayunan: kiri untuk Evelyn, kanan bisa dinaiki Russel (ketuk lagi di mana saja = turun)
  const swing = {
    x: 182, y: 100, o: 0, o2: 0, hit: [180, 64, 32, 38], go: [194, 112], skin: 'fn:swing',
    draw(c) {
      px(c, 156, 68, 3, 32, PAL.woodD); px(c, 208, 68, 3, 32, PAL.woodD); px(c, 154, 66, 59, 3, PAL.wood);
      [[170, this.o, '#e2483d', '#a8352b'], [194, this.o2, '#4f86e0', '#2f5bab']].forEach(([sx, o, k, kd]) => {
        px(c, sx - 5 + Math.round(o / 2), 69, 1, 21, '#7d6a5a'); px(c, sx + 5 + Math.round(o / 2), 69, 1, 21, '#7d6a5a');
        px(c, sx - 7 + o, 90, 15, 3, k); px(c, sx - 7 + o, 92, 15, 1, kd);
      });
    },
    update() {
      this.o = Math.round(Math.sin(G.t * 2.6) * 6);
      this.o2 = G.boy.onSwing ? Math.round(Math.sin(G.t * 2.6 + 0.8) * 6) : Math.round(Math.sin(G.t * 1.3));
    },
    tap() { sfx('tap'); },
    arrive() {
      const b = G.boy; if (b.ride) return;
      b.onSwing = true; b.dir = 'down';
      b.ride = () => { b.x = 194 + swing.o2; b.y = 91; b.frame = 0; };
      b.rideEnd = () => { b.onSwing = false; b.x = 194; b.y = 112; };
      say([{ k: 'swing' }, { k: 'playtogether', zh: '我们一起玩！', by: G.boy }, { k: 'fun', by: meimei }]);
    },
  };
  const meimei = npc('meimei', 170, 91, 'down', {
    get hit() { return [this.x - 9, this.y - 25, 18, 25]; }, go: [158, 112],
    update(dt) { this.x = 170 + swing.o; if (this.act) { this.actT += dt; if (this.actT > this.actDur) this.act = null; } },
    lines: [
      [{ k: 'hello', zh: NAMES.meimei + '，你好！', by: 'me' }, { k: 'q_play', by: 'np' }, { k: 'a_ok', by: 'me' }],
      [{ k: 'swing', by: 'np' }, { k: 'playtogether', zh: '我们一起玩！', by: 'me' }],
    ],
  });
  S.objs.push(swing, meimei);

  // Tiāntian naik-turun perosotan
  // perosotan: Russel naik tangga, meluncur, lalu turun di bawah
  const slide = {
    x: 266, y: 106, hit: [240, 70, 56, 38], go: [247, 112], skin: 'obj-perosotan',
    arrive() {
      const b = G.boy; if (b.ride) return;
      if (!G.dog.hidden) { b.dogFollow = true; G.dog.trail = []; }
      b.ride = ridePath(
        [[247, 112], [249, 108, null, 'right'], [249, 78, null, 'right'], [262, 77, null, 'right'], [293, 107, 'slide', 'right'], [298, 112, null, 'down']],
        [0.3, 1.6, 0.5, 0.8, 0.3],
        i => { if (i === 3) { sfx('whoosh'); say([{ k: 'slide' }]); } },
        () => {
          b.dogFollow = false; fx('spark', 296, 96, 4);
          if (G.dog.hidden) say([{ k: 'fun', by: G.boy }]); else { G.dog.happyT = 1.5; say([{ k: 'fun', by: G.boy }, { k: 'woof' }]); }
        },
      );
    },
    draw(c) {
      px(c, 244, 76, 2, 30, '#7d8a98'); px(c, 252, 76, 2, 30, '#7d8a98');
      for (let y = 80; y < 106; y += 5) px(c, 244, y, 10, 1, '#a9b6c4');
      px(c, 242, 74, 22, 3, '#f4cf3a');
      for (let i = 0; i < 30; i++) { const yy = 76 + Math.round(i * 0.95); px(c, 262 + i, yy, 3, 4, i % 6 < 3 ? '#e2483d' : '#ef6a5a'); }
      px(c, 290, 104, 6, 2, '#e2483d');
    },
    tap() { say([{ k: 'slide' }]); },
  };
  const tiantian = npc('tiantian', 249, 108, 'up', {
    ph: 0, pt: 0, get go() { return [236, 116]; },
    update(dt) {
      if (this.act) { this.actT += dt; if (this.actT > this.actDur) this.act = null; }
      if (this.talkT > 0) { this.talkT -= dt; this.frame = 0; return; }
      this.pt += dt; this.ft += dt;
      const P = [[249, 108], [249, 76], [263, 76], [292, 106], [249, 108]];
      const dur = [2.2, 0.6, 0.9, 1.8], i = this.ph;
      const k = Math.min(1, this.pt / dur[i]);
      this.x = P[i][0] + (P[i + 1][0] - P[i][0]) * k; this.y = P[i][1] + (P[i + 1][1] - P[i][1]) * k;
      this.dir = i === 0 ? 'up' : i === 3 ? 'left' : 'right';
      this.frame = i === 2 ? 0 : [1, 0, 2, 0][Math.floor(this.ft * 7) % 4];
      if (i === 2 && this.pt < 0.05) sfx('whoosh');
      if (k >= 1) { this.ph = (i + 1) % 4; this.pt = 0; }
    },
    lines: [[{ k: 'hello', zh: NAMES.tiantian + '，你好！', by: 'me' }, { k: 'q_slide', by: 'np' }, { k: 'a_ok', by: 'me' }], [{ k: 'slide', by: 'np' }]],
  });
  S.objs.push(slide, tiantian);

  // Xiǎoyǔ lompat tali
  const xiaoyu = npc('xiaoyu', 128, 150, 'down', {
    skin: 'fn:jumpRope',
    draw(c, t) {
      const ph = Math.sin(t * 9), bob = this.talkT > 0 ? 0 : Math.round(Math.max(0, ph) * 3);
      const x = Math.round(this.x), y = Math.round(this.y);
      if (this.talkT <= 0 && ph <= 0) { for (let i = -8; i <= 8; i++) px(c, x + i, y - Math.round(Math.abs(i) / 4), 1, 1, '#e2483d'); }
      drawPerson(c, x, y, { look: 'xiaoyu', dir: this.dir, mood: 'happy', act: this.talkT > 0 ? this.act : 'rope', actT: t, bob });
      if (this.talkT <= 0 && ph > 0) { for (let i = -8; i <= 8; i++) px(c, x + i, y - 30 - bob + Math.round(Math.abs(i) * Math.abs(i) / 14), 1, 1, '#e2483d'); }
    },
    lines: [[{ k: 'hello', zh: NAMES.xiaoyu + '，你好！', by: 'me' }, { k: 'q_rope', by: 'np' }, { k: 'a_try', by: 'me' }], [{ k: 'jumprope', by: 'np' }]],
  });
  xiaoyu.tap = () => talk(xiaoyu, () => { if (xiaoyu.li % 2 === 1) doAct(G.boy, 'rope', 2.6); });
  S.objs.push(xiaoyu);

  // Lèle main bola
  const lele = npc('lele', 246, 150, 'left', {
    lines: [[{ k: 'hello', zh: NAMES.lele + '，你好！', by: 'me' }, { k: 'q_ball', by: 'np' }, { k: 'a_yes', by: 'me' }], [{ k: 'ball', by: 'np' }, { k: 'playtogether', zh: '一起玩！', by: 'me' }]],
  });
  lele.tap = () => {
    if (lele.mood === 'sad') { say([{ k: 'sad' }]); return; }
    talk(lele, () => kickTo(lele, G.boy));
  };
  S.objs.push(lele);

  const ball = {
    x: 222, y: 152, vx: 0, vy: 0, h: 0, vh: 0, hitLele: false, skin: 'fn:ball',
    get hit() { return [this.x - 8, this.y - 10, 16, 12]; }, get go() { return [this.x - (G.boy.x < this.x ? 8 : -8), this.y + 1]; },
    draw(c) {
      shadow(c, Math.round(this.x), Math.round(this.y), 3);
      const y = Math.round(this.y - 3 - this.h), x = Math.round(this.x);
      disc(c, x, y, 3, '#fbf8f0'); px(c, x - 1, y - 1, 2, 2, '#e2483d'); px(c, x + 2, y + 1, 1, 1, '#4f86e0');
    },
    update(dt) {
      if (this.h > 0 || this.vh) { this.vh -= 260 * dt; this.h += this.vh * dt; if (this.h <= 0) { this.h = 0; this.vh = Math.abs(this.vh) > 30 ? -this.vh * 0.45 : 0; if (this.vh) sfx('bounce'); } }
      this.x += this.vx * dt; this.y += this.vy * dt;
      this.vx *= 1 - dt * 1.2; this.vy *= 1 - dt * 1.2;
      if (this.x < 12 || this.x > 308) { this.vx *= -1; this.x = Math.max(12, Math.min(308, this.x)); }
      if (this.y < 116 || this.y > 172) { this.vy *= -1; this.y = Math.max(116, Math.min(172, this.y)); }
      if (this.hitLele && Math.hypot(this.x - lele.x, this.y - lele.y) < 10) {
        this.hitLele = false; this.vx *= -0.4; this.vy *= -0.4;
        lele.mood = 'sad'; lele.talkT = 6; sfx('bounce');
        say([{ card: langCard('哎哟', 'āi yō', 'aduh!', 'Ouch!', ['いたっ！', 'ita!']), zh: '哎哟！', by: lele }, { k: 'sad' }, { k: 'sorry', by: G.boy }, { k: 'itsok', by: lele }], () => { lele.mood = 'happy'; doAct(lele, 'wave', 1.2); fx('heart', lele.x, lele.y - 28, 2); });
        setTimeout(() => { if (lele.mood === 'sad') lele.mood = 'happy'; }, 9000);
      }
    },
    tap() { sfx('tap'); },
    arrive() {
      doAct(G.boy, 'kick', 0.5); sfx('bounce');
      const toLele = Math.random() < 0.35 && lele.mood !== 'sad';
      if (toLele) kickTo(this, lele, true);
      else { kickTo(this, { x: this.x + (this.x - G.boy.x) * 4 + rand(-20, 20), y: this.y + (this.y - G.boy.y) * 2 + rand(-12, 12) }); say([{ k: 'ball' }]); }
    },
  };
  function kickTo(from, target, hitLele) {
    if (from !== ball) { doAct(from, 'kick', 0.5); ball.x = from.x + (target.x < from.x ? -8 : 8); ball.y = from.y + 1; }
    const dx = target.x - ball.x, dy = target.y - ball.y, d = Math.hypot(dx, dy) || 1;
    const sp = Math.min(110, 40 + d * 1.3);
    ball.vx = dx / d * sp; ball.vy = dy / d * sp; ball.vh = 70; ball.h = 0.1; ball.hitLele = !!hitLele;
    sfx('bounce');
  }
  S.objs.push(ball);
  S.objs.push({ y: 176, skin: 'bg', draw(c) { drawBush(c, 300, 176, '#f4cf3a'); drawBush(c, 140, 178, null); } });

  S.exits = [
    { hit: [0, 128, 26, 44], arrow: [12, 150, 'left'], go: [6, 150], to: 'village', at: [300, 126],
      leave() { doAct(teacher, 'wave', 2); say([{ k: 'bye', zh: '再见！' }]); } },
    { hit: [294, 128, 26, 44], arrow: [308, 150, 'right'], go: [314, 150], to: 'office', at: [20, 140],
      leave() { say([{ k: 'bye', zh: '再见！' }]); } },
    { hit: [146, 36, 28, 32], arrow: [160, 76, 'up'], go: [160, 68], to: 'classroom', at: [160, 160] },
  ];
  return S;
})();

// ================= KANTOR AYAH =================
SCENES.office = (() => {
  const S = {
    id: 'office', place: 'office', outdoor: false, walk: [8, 60, 312, 174], spawn: [20, 140],
    blocks: [[68, 84, 44, 18], [208, 84, 44, 18], [138, 126, 44, 18], [102, 40, 52, 16], [172, 40, 18, 16], [258, 148, 48, 26]], objs: [],
    lights: [[90, 70, 60], [230, 70, 60], [160, 116, 60]],
  };
  S.bg = c => {
    px(c, 0, 0, W, 50, '#e3eaf0'); for (let x = 0; x < W; x += 16) { px(c, x, 0, 1, 44, '#d6dfe7'); px(c, x + 1, 0, 1, 44, '#edf2f6'); }
    px(c, 0, 43, W, 7, '#9aa8b8'); px(c, 0, 43, W, 1, '#c6d0da'); px(c, 0, 49, W, 1, '#7d8a98');
    bgOutlined(c, cc => {
      for (const wx of [14, 226]) {
        px(cc, wx - 3, 3, 86, 38, '#7d8a98'); px(cc, wx - 3, 3, 86, 1, '#a9b6c4');
        drawCity(cc, wx, 6, 80, 32, G.night);
        px(cc, wx + 39, 6, 2, 32, '#7d8a98'); px(cc, wx, 38, 80, 1, '#5f6c7a');
        px(cc, wx - 5, 40, 90, 2, '#c6d0da');
      }
    });
    drawTiles(c, 0, 50, W, 130, 12, ['#a9bccf', '#a4b7cb', '#aec1d4'], '#98abc0', 18);
    wallFoot(c, 50);
    windowLight(c, 18, 52, 72, 24, 12); windowLight(c, 230, 52, 72, 24, 12);
    px(c, 0, 0, 4, H, '#7d8a98'); px(c, 316, 0, 4, H, '#7d8a98'); px(c, 0, 176, W, 4, '#7d8a98');
    // permadani di tengah ruangan
    oval(c, 160, 101, 53, 15, 'rgba(40,50,70,0.18)');
    oval(c, 160, 100, 53, 15, '#6f84a0'); oval(c, 160, 100, 51, 13, '#8fa4bc'); oval(c, 160, 100, 44, 10, '#a3b6cc'); oval(c, 160, 100, 42, 9, '#8fa4bc');
    // pintu ke bengkel robot: keset dan papan bergambar kepala robot
    px(c, 316, 92, 4, 32, '#4a5866'); px(c, 300, 96, 16, 24, '#6f7f92'); px(c, 301, 97, 14, 22, '#8497ab');
    for (let y = 99; y < 118; y += 4) px(c, 302, y, 12, 1, '#6f7f92');
    bgOutlined(c, cc => {
      px(cc, 303, 76, 15, 13, PAL.woodD); px(cc, 304, 77, 13, 11, PAL.wood); px(cc, 304, 77, 13, 1, PAL.woodL);
      px(cc, 306, 80, 9, 6, '#e8eef2'); px(cc, 307, 81, 7, 3, '#2a3a4a'); px(cc, 308, 82, 1, 1, '#7cf0c4'); px(cc, 312, 82, 1, 1, '#7cf0c4'); px(cc, 310, 78, 1, 2, '#e2483d');
    });
  };
  S.objs.push({ flat: true, y: 0, hit: [152, 10, 16, 16], go: [160, 64], skin: 'bg', draw(c, t) { drawClock(c, 160, 18, t); }, tap() { say([{ k: 'clock' }]); sfx('chime'); } });
  S.objs.push({ flat: true, y: 0, hit: [104, 2, 48, 52], go: [128, 64], skin: 'bg', draw(c) { drawBookshelf(c, 104, 4, 48, 50); }, tap() { say([{ k: 'book' }]); } });
  S.objs.push({ x: 180, y: 56, hit: [172, 26, 16, 32], go: [180, 66], skin: 'obj-dispenser-air', draw(c) { drawCooler(c, 180, 56); },
    tap() { say([{ k: 'water' }]); }, arrive() { G.boy.dir = 'down'; doAct(G.boy, 'eat', 1.2); sfx('water'); } });
  [[60, 60], [300, 62], [16, 172]].forEach(([x, y]) => S.objs.push({ x, y, skin: 'near:obj-tanaman-', draw(c) { drawPlantPot(c, x, y); } }));

  const desks = [[90, 102], [230, 102], [160, 144]].map(([x, y], i) => {
    const d = { x, y, ring: 0, hit: [x - 1, y - 30, 18, 16], go: [x + 8, y + 10], skin: 'near:obj-meja-',
      draw(c, t) { drawDesk(c, x, y, i === 2 ? null : (i === 1 || !dad.hidden), t); },
      tap() { say([{ k: 'computer' }]); sfx('tap'); } };
    return d;
  });
  desks.forEach(d => S.objs.push(d));
  S.objs.push({ x: 73, y: 102.5, ring: 0, hit: [64, 84, 18, 14], go: [66, 112], skin: 'fn:phoneRing',
    draw(c, t) { drawPhone(c, 74, 95, this.ring > 0, t); },
    update(dt) { if (this.ring > 0) this.ring -= dt; },
    tap() { this.ring = 1.2; sfx('chime'); say([{ k: 'phone' }, { k: 'hellophone', zh: '喂？', by: dad.hidden ? G.boy : dad }]); } });

  const dad = npc('dad', 80, 92, 'down', {
    get hidden() { return G.night; }, go: [80, 112],
    lines: [
      [{ k: 'dad', by: 'me' }, { k: 'q_visit', by: 'np' }, { k: 'a_visit', by: 'me' }],
      [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }],
      [{ k: 'q_eat', by: 'np' }, { k: 'a_eat', by: 'me' }],
    ],
  });
  S.objs.push(dad);
  // akuarium dengan ikan berenang
  S.objs.push({ x: 282, y: 172, hit: [258, 128, 48, 44], go: [282, 176], skin: 'obj-akuarium', draw(c, t) { drawAquarium(c, 282, 172, t); },
    tap() { say([{ k: 'aquarium' }, { k: 'fish' }]); sfx('bubbles'); } });
  // laptop di meja tengah
  S.objs.push({ x: 160, y: 144.5, hit: [144, 120, 22, 14], go: [160, 156], skin: 'bg', draw(c, t) { drawLaptop(c, 152, 132, t); },
    tap() { say([{ k: 'laptop' }]); sfx('tap'); } });
  S.objs.push(npc('colleague', 196, 122, 'right', { path: [[196, 122], [250, 122], [250, 160], [196, 160]], sp: 13,
    lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_son', by: 'np' }, { k: 'a_son', by: 'me' }], [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }]] }));
  S.objs.push(npc('uncle', 220, 92, 'down', { lines: [[{ k: 'uncle', zh: '叔叔好！', by: 'me' }, { k: 'q_name', by: 'np' }, { k: 'a_name', by: 'me' }]] }));

  // mesin kopi: Russel bisa mengambil kopi sendiri, lalu memberikannya ke Ayah
  const machine = { x: 218, y: 58, brewing: false, own: 0, noCup: 0, hit: [202, 26, 34, 32], go: [218, 68], skin: 'fn:coffeeMachine',
    draw(c, t) { drawCoffeeMachine(c, 218, 58, this.brewing, t, this.noCup > 0); },
    update(dt) {
      if (this.noCup > 0) this.noCup -= dt;
      if (this.own <= 0) return;
      this.own -= dt;
      if (Math.random() < dt * 3) fx('steam', 218, 34, 1);
      if (this.own <= 0) {
        this.brewing = false;
        if (bagAdd('coffee', 218, 44, true)) { this.noCup = 4; say([{ k: 'coffee' }, { k: 'givedad' }]); }
      }
    },
    tap() { say([{ k: 'coffeemachine' }]); },
    arrive() {
      if (this.brewing) return;
      doAct(G.boy, 'wash', 1.2); sfx('bubbles'); this.brewing = true; this.own = 1.6; this.noCup = 0;
    } };
  S.blocks.push([202, 44, 34, 14]);
  S.objs.push(machine);
  const uncle = S.objs.find(o => o.look === 'uncle');
  // robot: diketuk → pilih gambar: buat kopi (untuk Russel), buat susu, menari, atau ikuti Russel
  const robot = {
    voice: 'robot', x: 150, y: 120, dir: 1, st: 'patrol', pi: 0, wait: 0, carry: false, moving: false, route: [], timer: 0, what: 'coffee',
    patrol: [[150, 120], [250, 118], [250, 168], [150, 168]],
    get hit() { return [this.x - 9, this.y - 33, 18, 33]; }, get go() { return [this.x + (G.boy.x < this.x ? -16 : 16), this.y + 2]; },
    draw(c, t) { drawRobot(c, this.x, this.y, this.dir, t, this.carry, this.moving, this.st === 'dance'); },
    step(tx, ty, dt, sp = 24) {
      const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
      if (d < 1) { this.moving = false; return true; }
      const s = Math.min(d, sp * dt); this.x += dx / d * s; this.y += dy / d * s; this.moving = true;
      if (Math.abs(dx) > 0.5) this.dir = dx > 0 ? 1 : -1;
      return false;
    },
    follow(dt) { if (!this.route.length) return true; if (this.step(this.route[0][0], this.route[0][1], dt)) this.route.shift(); return !this.route.length; },
    update(dt) {
      if (this.st === 'patrol') {
        if (this.wait > 0) { this.wait -= dt; this.moving = false; return; }
        const [tx, ty] = this.patrol[this.pi];
        if (this.step(tx, ty, dt)) { this.pi = (this.pi + 1) % this.patrol.length; this.wait = 1.2; }
      } else if (this.st === 'toMachine') {
        if (this.follow(dt)) { this.st = 'brew'; this.timer = 3; machine.brewing = true; machine.own = 0; machine.noCup = 0; sfx('bubbles'); this.dir = 1; }
      } else if (this.st === 'brew') {
        this.timer -= dt;
        if (Math.random() < dt * 3) fx('steam', 218, 34, 1);
        if (this.timer <= 0) {
          machine.brewing = false; this.carry = this.what === 'milk' ? 'milk' : true; sfx('chime');
          say([{ k: this.what }]);
          this.route = [[218, 76]];
          this.st = 'toBoy';
        }
      } else if (this.st === 'toBoy') {
        // membawa minuman ke Russel, di mana pun dia berada
        const b = G.boy;
        if (!this.follow(dt)) return;
        if (Math.hypot(b.x - this.x, b.y - this.y) > 18) { this.step(b.x + (this.x < b.x ? -14 : 14), b.y + 1, dt, 36); return; }
        this.moving = false; this.dir = b.x > this.x ? 1 : -1;
        this.handOver();
      } else if (this.st === 'dance') {
        const b = G.boy;
        this.timer -= dt; this.moving = false;
        this.dir = Math.sin(this.timer * 5) > 0 ? 1 : -1;
        if (Math.random() < dt * 2.5) fx('note', this.x + (Math.random() < 0.5 ? -10 : 10), this.y - 34, 1);
        // Russel ikut melompat kalau berada di dekat robot
        if (!b.moving && !b.act && Math.hypot(b.x - this.x, b.y - this.y) < 70) doAct(b, 'hop', 0.9);
        if (this.timer <= 0) { this.st = 'patrol'; this.wait = 1; say([{ k: 'fun', by: b }]); }
      } else if (this.st === 'followBoy') {
        const b = G.boy;
        this.timer -= dt;
        if (this.timer <= 0) { this.st = 'back'; this.route = [[150, 120]]; return; }
        if (Math.hypot(b.x - this.x, b.y - this.y) > 22) this.step(b.x + (this.x < b.x ? -16 : 16), b.y + 1, dt, 40);
        else this.moving = false;
      } else if (this.st === 'deliver') {
        if (this.follow(dt)) {
          const who = this.target; this.carry = false; this.st = 'back';
          this.dir = who.x > this.x ? 1 : -1;
          doAct(who, 'wave', 1.4); who.talkT = 4; fx('heart', who.x, who.y - 34, 2);
          say([{ k: 'pleasedrink', by: this }, { k: 'thanks', by: who }]);
          this.route = who === dad ? [[58, 120], [150, 120]] : [[262, 120], [150, 120]];
        }
      } else if (this.st === 'back') {
        if (this.follow(dt)) { this.st = 'patrol'; this.pi = 0; }
      }
    },
    // susu langsung diminum Russel; kopi masuk tas untuk diberikan ke Ayah. Tas penuh: robot mengantar kopinya sendiri.
    handOver() {
      const b = G.boy;
      this.carry = false;
      if (this.what === 'milk') {
        b.dir = 'down'; doAct(b, 'eat', 1.4); sfx('eat'); fx('heart', b.x, b.y - 28, 2);
        say([{ k: 'giveyou', by: this }, { k: 'milk' }, { k: 'yummy', by: b }, { k: 'thanks', by: b }]);
      } else if (bagAdd('coffee', b.x, b.y - 20, true)) {
        fx('heart', b.x, b.y - 28, 2);
        say([{ k: 'giveyou', by: this }, { k: 'thanks', by: b }, { k: 'givedad', by: this }]);
      } else {
        this.carry = true; this.target = dad.hidden ? uncle : dad;
        this.route = this.target === dad ? [[200, 70], [60, 70], [58, 98]] : [[262, 70], [262, 98]];
        this.st = 'deliver';
        return;
      }
      this.st = 'back'; this.route = [[150, 120]];
    },
    brewFor(what, line) {
      this.what = what; this.st = 'toMachine'; this.route = [[this.x, 70], [218, 70], [218, 66]];
      say([{ k: line, by: this }]);
    },
    tap() {
      if (this.st !== 'patrol' && this.st !== 'followBoy') { say([{ k: 'robot' }]); return; }
      this.wait = 7; this.moving = false;
      sfx('chime'); say([{ k: 'robot', zh: '你好！我是机器人。', by: this }]);
      offerPics(this.x, this.y - 34, [
        picBtn('coffee', 'take', () => this.brewFor('coffee', 'makecoffee')),
        picBtn('milk', 'give', () => this.brewFor('milk', 'milk')),
        picBtn('dance', 'eat', () => {
          this.st = 'dance'; this.timer = 5;
          say([{ k: 'dance', by: this }]);
          [523, 659, 784, 659, 523, 659, 784, 1047, 784, 659, 523, 392, 523, 659, 784, 1047].forEach((f, i) => Snd.tone(f, 0.24, { gain: 0.09, when: i * 0.3, type: 'triangle' }));
        }),
        picBtn('followme', 'throw', () => {
          this.st = 'followBoy'; this.timer = 40;
          say([{ k: 'followme', by: G.boy }, { k: 'a_ok', by: this }]);
        }),
      ]);
    },
  };
  S.objs.push(robot);

  S.exits = [
    { hit: [0, 120, 26, 40], arrow: [12, 140, 'left'], go: [6, 140], to: 'school', at: [304, 150] },
    { hit: [294, 90, 26, 34], arrow: [306, 108, 'right'], go: [314, 108], to: 'workshop', at: [18, 130] },
  ];
  return S;
})();

// ================= KELUARGA JALAN-JALAN =================
// Ayah, Ibu, dan kakak (哥哥) ikut ke Pegunungan & Pantai. at = {dad, mom, gege: [x, y, arah]}
function familyTrip(S, at, more = {}) {
  const me = 'me', np = 'np';
  const person = (look, lines, afters) => {
    const p = npc(look, at[look][0], at[look][1], at[look][2], { lines });
    p.tap = function () { const i = this.li % lines.length, a = afters[i]; talk(this, a ? () => a(this) : null); };
    return p;
  };
  const drink = () => { G.boy.dir = 'down'; doAct(G.boy, 'eat', 1.2); sfx('eat'); fx('heart', G.boy.x, G.boy.y - 34, 2); say([{ k: 'thanks', by: G.boy }]); };
  const together = () => { doAct(G.boy, 'hop', 0.9); sfx('bounce'); fx('heart', G.boy.x, G.boy.y - 34, 3); say([{ k: 'playtogether', by: G.boy }, { k: 'fun', by: G.boy }]); };
  const dad = person('dad', [
    [{ k: 'dad', by: me }, { k: more.dadQ || 'q_climb', by: np }, { k: 'a_ok', by: me }],
    [{ k: 'q_tired', by: np }, { k: 'a_tired', by: me }],
    [{ k: 'q_happy', by: np }, { k: 'a_happy', by: me }],
  ], [more.dadDo]);
  const mom = person('mom', [
    [{ k: 'mom', by: me }, { k: 'q_water', by: np }, { k: 'a_yes', by: me }],
    [{ k: 'q_hungry', by: np }, { k: 'a_hungry', by: me }],
    [{ k: 'q_eat', by: np }, { k: 'a_eat', by: me }],
  ], [drink]);
  const gege = person('gege', [
    [{ k: 'gege', by: me }, { k: 'q_gege', by: np }, { k: 'a_ok', by: me }],
    more.gegeLine || [{ k: 'q_play', by: np }, { k: 'a_ok', by: me }],
  ], [together]);
  S.objs.push(dad, mom, gege);
  return { dad, mom, gege };
}

// ================= PEGUNUNGAN =================
SCENES.mountain = (() => {
  const S = {
    id: 'mountain', place: 'mountain', outdoor: true, walk: [6, 84, 314, 176], spawn: [300, 140],
    blocks: [[10, 98, 76, 28], [24, 124, 26, 56]], objs: [], lights: [],
  };
  // gunung: sisi kiri terang, sisi kanan berbayang, salju bergerigi
  const peak = (c, cx, base, h, w, col, shade, snow, snowD) => {
    for (let r = 0; r < h; r++) {
      const half = Math.round(w * r / h), ly = base - h + r, ridge = Math.round(Math.sin(r / 5) * 2 * Math.min(1, r / 12));
      px(c, cx - half, ly, half * 2 + 1, 1, col);
      px(c, cx + ridge, ly, Math.max(0, half - ridge + 1), 1, shade);
    }
    const sn = Math.round(h * 0.24);
    for (let r = 0; r < sn + 4; r++) {
      const half = Math.round(w * r / h), ly = base - h + r;
      for (let i = -half; i <= half; i++) {
        const edge = sn + Math.round(Math.sin(i / 2.2) * 2.4);
        if (r <= edge) px(c, cx + i, ly, 1, 1, i >= Math.round(Math.sin(r / 5) * 2 * Math.min(1, r / 12)) ? snowD : snow);
      }
    }
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 72; y++) {
      const k = y / 72;
      px(c, 0, y, W, 1, N ? `rgb(${30 + k * 20},${38 + k * 24},${80 + k * 30})` : `rgb(${143 + k * 60},${208 + k * 30},${242 + k * 8})`);
    }
    peak(c, 150, 66, 52, 46, N ? '#4a4f7a' : '#8f94b6', N ? '#3e4368' : '#777ca0', '#f4f7fa', N ? '#c6cce0' : '#d6deea');
    peak(c, 300, 66, 44, 40, N ? '#4a4f7a' : '#a2a7c6', N ? '#3e4368' : '#868bac', '#f4f7fa', N ? '#c6cce0' : '#d6deea');
    peak(c, 230, 66, 62, 52, N ? '#3e4370' : '#7f84a8', N ? '#34395e' : '#686d90', '#ffffff', N ? '#c6cce0' : '#d6deea');
    // bukit berlapis dengan barisan pinus kecil di kejauhan
    for (let x = 0; x < W; x++) px(c, x, 57 + Math.round(Math.sin(x / 31 + 1) * 3), 1, 20, N ? '#34583e' : '#4f9a58');
    for (let x = 96; x < W; x += 6) {
      const by = 58 + Math.round(Math.sin(x / 31 + 1) * 3), th = 4 + (x * 7) % 3;
      for (let k = 0; k < th; k++) px(c, x - Math.floor(k / 2), by - th + k, Math.floor(k / 2) * 2 + 1, 1, N ? '#2a4a34' : '#3c8348');
    }
    for (let x = 0; x < W; x++) px(c, x, 62 + Math.round(Math.sin(x / 22) * 4), 1, 20, N ? '#3f6a48' : '#5ea85a');
    drawGrass(c, 0, 74, W, 106, 41, true);
    drawPath(c, 96, 132, 224, 14, 12);
    // tebing batu berlapis
    px(c, 0, 40, 92, 62, '#8f8c86');
    groundPatches(c, 0, 40, 92, 62, 9, '#84817b', 0.5);
    const r = rng(9);
    // retakan tidak beraturan supaya terlihat seperti batu alam, bukan tembok
    for (let y = 47; y < 102; y += 7 + Math.floor(r() * 7)) {
      for (let x = Math.floor(r() * 10); x < 92;) {
        const len = Math.min(8 + Math.floor(r() * 20), 90 - x), dy = Math.floor(r() * 3) - 1;
        if (len <= 0) break;
        px(c, x, y + dy, len, 1, '#6f6c66'); px(c, x, y + dy + 1, len, 1, '#a9a6a0');
        if (x + len < 88 && r() < 0.35) { const ch = 3 + Math.floor(r() * 4); px(c, x + len, y + dy, 1, ch, '#6f6c66'); px(c, x + len + 1, y + dy, 1, ch, '#a09d97'); }
        x += len + 3 + Math.floor(r() * 9);
      }
    }
    for (let i = 0; i < 30; i++) px(c, Math.floor(r() * 90), 42 + Math.floor(r() * 58), 3, 1, r() < 0.5 ? '#b4b1aa' : '#77746e');
    px(c, 90, 40, 2, 62, '#6f6c66');
    // rumput di atas tebing, menjuntai
    px(c, 0, 38, 92, 4, '#5ea85a'); px(c, 0, 38, 92, 1, PAL.grassL);
    for (let x = 0; x < 92; x += 3) px(c, x, 42, 2, 1 + (x * 7) % 3, x % 2 ? '#4f9a3c' : '#5ea85a');
    // kolam dan sungai bertepi batu
    oval(c, 48, 113, 38, 14, '#c9ad72'); oval(c, 48, 112, 36, 12, '#3f8fc4'); oval(c, 48, 111, 33, 10, PAL.water); oval(c, 46, 109, 22, 5, '#6cbce6');
    [[18, 104], [10, 112], [14, 120], [76, 104], [86, 112], [80, 120], [60, 124], [36, 124]].forEach(([a, b]) => { oval(c, a, b, 3, 2, '#7f7c78'); oval(c, a - 1, b - 1, 2, 1, '#b4b0a8'); });
    px(c, 26, 120, 2, 60, '#c9ad72'); px(c, 48, 120, 2, 60, '#c9ad72');
    drawWater(c, 28, 120, 20, 60, 44);
    px(c, 28, 120, 1, 60, PAL.waterD); px(c, 47, 120, 1, 60, PAL.waterD);
    [[58, 110], [40, 115], [30, 106]].forEach(([a, b]) => px(c, a, b, 7, 1, PAL.waterL));
  };

  S.objs.push({ flat: true, y: 0, hit: [100, 4, 220, 56], go: [200, 92], draw() {}, tap() { say([{ k: 'mountain' }]); } });
  S.objs.push({ flat: true, y: 0, i: 0, get hidden() { return !G.night; }, hit: [40, 6, 40, 30], go: [100, 92], skin: 'fn:mtnNight',
    draw(c, t) { disc(c, 60, 18, 7, '#fff2c0'); disc(c, 63, 16, 6, '#2a3462'); [[96, 10], [120, 26], [200, 8], [270, 20], [24, 30], [176, 30]].forEach(([a, b], k) => { if ((Math.floor(t * 2) + k) % 3) px(c, a, b, 1, 1, '#ffffff'); }); },
    tap() { this.i++; say([{ k: this.i % 2 ? 'moon' : 'star' }]); } });
  for (let i = 0; i < 2; i++) S.objs.push({
    x: 60 + i * 140, y: 14 + i * 12, top: true, skin: 'fn:cloud', get hidden() { return G.night; },
    get hit() { return [this.x - 14, this.y - 7, 28, 14]; },
    draw(c) { oval(c, Math.round(this.x), this.y, 12, 4, '#ffffff'); disc(c, Math.round(this.x) - 4, this.y - 3, 4, '#ffffff'); disc(c, Math.round(this.x) + 4, this.y - 2, 3, '#ffffff'); },
    update(dt) { this.x += dt * 4; if (this.x > W + 20) this.x = -20; },
    tap() { say([{ k: 'cloud' }]); },
  });
  for (let i = 0; i < 2; i++) S.objs.push({
    x: 120 + i * 90, y: 30 + i * 10, t0: i * 2, top: true, get hidden() { return G.night; },
    get hit() { return [this.x - 8, this.y - 7, 16, 14]; },
    draw(c, t) { drawBird(c, this.x, this.y, t + i, i ? '#4f86e0' : '#e2483d'); },
    update(dt) { this.t0 += dt; this.x = 160 + Math.sin(this.t0 * 0.4 + i * 3) * 120; this.y = 34 + i * 10 + Math.sin(this.t0 * 1.3) * 6; },
    tap() { say([{ k: 'bird' }]); if (Snd.ctx) Snd.bird(); fx('note', this.x, this.y - 6, 1); },
  });

  // lompat ke kolam air terjun lalu berendam; ketuk lagi = naik
  function jumpIn() {
    const b = G.boy; if (b.ride) return;
    const sx = b.x, sy = b.y, tx = 50, ty = 116; let k = 0;
    say([{ k: 'jump', zh: '跳！' }]); sfx('whoosh');
    b.ride = dt => {
      k += dt / 0.6; const q = Math.min(1, k);
      b.x = sx + (tx - sx) * q; b.y = sy + (ty - sy) * q; b.jumpH = Math.sin(q * Math.PI) * 18; b.dir = 'left';
      if (q < 1) return;
      b.jumpH = 0; b.soak = true; b.dir = 'down'; sfx('splash'); fx('splash', tx, ty - 6, 8);
      say([{ k: 'swim' }, { k: 'cool', by: b }]);
      b.ride = () => { b.x = tx + Math.round(Math.sin(G.t * 0.8) * 6); b.y = ty; if (Math.random() < 0.03) fx('bubble', b.x + 4, b.y - 10, 1); };
      b.rideEnd = () => { b.soak = false; b.x = 92; b.y = 112; sfx('splash'); fx('splash', 88, 108, 5); };
    };
  }
  S.objs.push({ flat: true, y: 0, hit: [32, 44, 24, 54], go: [96, 106], draw(c, t) { drawWaterfall(c, 40, 46, 12, 56, t); },
    tap() { say([{ k: 'waterfall' }]); sfx('splash'); }, arrive: jumpIn });
  S.objs.push({ flat: true, y: 0, hit: [12, 100, 72, 24], go: [96, 110], draw() {}, tap() { say([{ k: 'water' }]); }, arrive: jumpIn });
  S.objs.push({ flat: true, y: 0, hit: [24, 126, 28, 54], go: [64, 150], draw() {}, tap() { say([{ k: 'river' }]); sfx('splash'); } });

  [[118, 96, 22], [146, 90, 18], [278, 100, 24], [304, 108, 18], [110, 178, 20], [210, 104, 20]].forEach(([x, y, h]) => S.objs.push({
    x, y, sway: 0, hit: [x - 9, y - h - 8, 18, h + 8], go: [x, y + 6], skin: 'fn:pine',
    draw(c) { drawPine(c, x + (this.sway > 0 ? Math.round(Math.sin(G.t * 40)) : 0), y, h); },
    update(dt) { if (this.sway > 0) this.sway -= dt; },
    tap() { this.sway = 0.5; say([{ k: 'tree' }]); sfx('shake'); },
  }));
  [[184, 124, 4], [250, 172, 5], [98, 128, 3], [68, 168, 4]].forEach(([x, y, rr]) => S.objs.push({ x, y, hit: [x - rr - 3, y - rr * 2 - 3, rr * 2 + 6, rr * 2 + 5], go: [x, y + 6], skin: 'near:obj-batu-', draw(c) { drawRock(c, x, y, rr); }, tap() { say([{ k: 'rock' }]); },
    arrive() { doAct(G.boy, 'hop', 0.9); sfx('bounce'); say([{ k: 'jump', zh: '跳！' }]); } }));
  [[132, 162], [140, 166], [126, 168], [238, 120]].forEach(([x, y]) => S.objs.push(pickup('mushroom', x, y, { respawn: 25 })));
  [[200, 160], [226, 150], [168, 172], [290, 166]].forEach(([x, y]) => S.objs.push(pickup('wildflower', x, y, { respawn: 20 })));

  // kelinci melompat
  S.objs.push({
    x: 200, y: 162, dir: 1, tx: 220, ty: 160, wait: 1, hopT: 0,
    get hit() { return [this.x - 9, this.y - 20, 18, 20]; }, get go() { return [this.x + (G.boy.x < this.x ? -14 : 14), this.y]; },
    draw(c, t) { drawRabbit(c, this.x, this.y, this.dir, t, this.hopT > 0); },
    update(dt) {
      if (this.wait > 0) { this.wait -= dt; this.hopT = 0; return; }
      const dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy);
      if (d < 1) { this.tx = rand(150, 300); this.ty = rand(150, 176); this.wait = rand(1, 3); return; }
      this.hopT = 1; this.dir = dx > 0 ? 1 : -1;
      const sp = this.fast > 0 ? 70 : 26; if (this.fast > 0) this.fast -= dt;
      const st = Math.min(d, sp * dt); this.x += dx / d * st; this.y += dy / d * st;
    },
    tap() { say([{ k: 'rabbit' }]); fx('heart', this.x, this.y - 20, 2); this.fast = 1; this.tx = rand(150, 300); this.ty = rand(150, 176); this.wait = 0; },
    receive(type) { this.wait = 2.5; if (ITEMS[type].food) { say([{ k: type }, { k: 'rabbit' }]); fx('heart', this.x, this.y - 20, 3); sfx('eat'); } else say([{ k: 'cannoteat' }]); },
  });
  // tupai di dekat pohon
  S.objs.push({
    x: 222, y: 106, dir: -1, t0: 0, hit: [212, 88, 20, 20], go: [222, 116],
    draw(c, t) { drawSquirrel(c, this.x, this.y, this.dir, t); },
    update(dt) { this.t0 += dt; this.x = 222 + Math.round(Math.sin(this.t0 * 0.8) * 8); this.dir = Math.cos(this.t0 * 0.8) > 0 ? 1 : -1; },
    tap() { say([{ k: 'squirrel' }]); fx('spark', this.x, this.y - 14, 3); this.t0 += 2; },
  });
  // pendaki
  S.objs.push(npc('hiker', 280, 140, 'left', { path: [[280, 140], [130, 140], [180, 158]], sp: 12,
    lines: [[{ k: 'uncle', zh: '叔叔好！', by: 'me' }, { k: 'q_bunny', by: 'np' }, { k: 'a_bunny', by: 'me' }], [{ k: 'q_tired', by: 'np' }, { k: 'a_tired', by: 'me' }]] }));

  // piknik keluarga: tikar & keranjang (ambil bakpao), Ayah, Ibu, dan kakak
  S.objs.push({ flat: true, x: 170, y: 116, hit: [148, 104, 44, 18], go: [170, 126], skin: 'bg',
    draw(c) { drawPicnic(c, 170, 116); },
    tap() { say([{ k: 'picnic' }]); },
    arrive() { if (bagAdd('bun', 158, 110, true)) say([{ k: 'picnic' }, { k: 'bun' }]); } });
  familyTrip(S, { mom: [158, 107, 'down'], gege: [182, 107, 'down'], dad: [204, 120, 'left'] }, {
    dadDo() { doAct(G.boy, 'hop', 0.9); sfx('bounce'); say([{ k: 'mountain', by: G.boy }]); },
    gegeLine: [{ k: 'q_bunny', by: 'np' }, { k: 'a_bunny', by: 'me' }],
  });

  S.exits = [{ hit: [294, 120, 26, 40], arrow: [308, 140, 'right'], go: [314, 140], to: 'farm', at: [16, 122] }];
  return S;
})();
