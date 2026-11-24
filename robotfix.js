// Robot lagi:
//  1. Bengkel Perbaikan Robot (di Bengkel Robot, meja angkat di kiri): robot rusak datang, Russel memperbaikinya:
//     pasang bagian yang copot (cari yang sama), kencangkan 3 sekrup, lap kotoran atau cat ulang, pasang baterai, tekan tombol.
//  2. Robot pendamping: robot buatan Russel bisa ikut ke semua tempat (ketuk robotnya → 跟我走, atau dari menu orang tua).

// ================= KATA BARU =================
Object.assign(WORDS, {
  fixrobot: ['修机器人', 'xiū jī qì rén', 'memperbaiki robot'],
  robotbroken: ['机器人坏了', 'jī qì rén huài le', 'robotnya rusak'],
  legoff: ['腿掉了', 'tuǐ diào le', 'kakinya copot'],
  armoff: ['手掉了', 'shǒu diào le', 'tangannya copot'],
  headoff: ['头掉了', 'tóu diào le', 'kepalanya copot'],
  findsame: ['找一样的', 'zhǎo yí yàng de', 'cari yang sama'],
  fixedit: ['修好了！', 'xiū hǎo le', 'sudah diperbaiki!'],
  tightenscrew: ['拧螺丝', 'nǐng luó sī', 'kencangkan sekrup'],
  wipeclean: ['擦一擦', 'cā yi cā', 'lap-lap'],
  thankfix: ['谢谢你修好我！', 'xiè xie nǐ xiū hǎo wǒ', 'terima kasih sudah memperbaikiku!'],
  nextrobot: ['下一个机器人', 'xià yí ge jī qì rén', 'robot berikutnya'],
  gohomebot: ['你先回去吧', 'nǐ xiān huí qù ba', 'kamu pulang dulu ya'],
  letsgo: ['我们走吧', 'wǒ men zǒu ba', 'ayo pergi'],
});
Object.assign(WORDS_EN, {
  fixrobot: 'fix the robot', robotbroken: 'The robot is broken', legoff: 'The leg fell off', armoff: 'The arms fell off', headoff: 'The head fell off',
  findsame: 'Find the same one', fixedit: 'Fixed!', tightenscrew: 'Tighten the screws', wipeclean: 'Wipe it clean', thankfix: 'Thank you for fixing me!',
  nextrobot: 'next robot', gohomebot: 'You can go back now', letsgo: "Let's go",
});
Object.assign(WORDS_JA, {
  fixrobot: ['ロボットを なおそう', 'robotto o naosō'], robotbroken: ['ロボットが こわれた', 'robotto ga kowareta'], legoff: ['あしが とれた', 'ashi ga toreta'],
  armoff: ['てが とれた', 'te ga toreta'], headoff: ['あたまが とれた', 'atama ga toreta'], findsame: ['おなじのを さがそう', 'onaji no o sagasō'],
  fixedit: ['なおった！', 'naotta!'], tightenscrew: ['ねじを しめよう', 'neji o shimeyō'], wipeclean: ['ふきふき', 'fukifuki'],
  thankfix: ['なおしてくれて ありがとう！', 'naoshite kurete arigatō!'], nextrobot: ['つぎの ロボット', 'tsugi no robotto'],
  gohomebot: ['さきに かえってね', 'saki ni kaette ne'], letsgo: ['いこう', 'ikō'],
});

// ================= 1. BENGKEL PERBAIKAN =================
const FIX_PARTS = { leg: ['rwheel', 'rleg', 'rtrack'], arm: ['raclaw', 'raball', 'rabig'], head: ['rhbox', 'rhround', 'rhears'] };
// warna bagian yang copot = warna stikernya, supaya mudah dicocokkan dengan pilihan di samping
const FIX_STCOL = { raclaw: 'blue', raball: 'red', rabig: 'orange', rhbox: 'blue', rhround: 'yellow', rhears: 'pink' };
const fixPick = a => a[Math.floor(Math.random() * a.length)];
function fixPatient() {
  return { leg: fixPick(FIX_PARTS.leg), body: fixPick(['rbbox', 'rbround', 'rbtall']), arm: fixPick(FIX_PARTS.arm), head: fixPick(FIX_PARTS.head), color: fixPick(RB_COLORS) };
}
// titik sekrup di badan (satuan gambar besar, relatif ke tengah bawah badan)
function fixScrewSpots(body) {
  if (body === 'rbround') return [[-5, -9], [4, -9], [-5, -3]];
  const B = RB_BODY[body];
  return [[-B.w / 2 + 1, -B.h + 2], [B.w / 2 - 2, -B.h + 2], [-B.w / 2 + 1, -3]];
}

BUILD.fixbot = {
  title: 'fixrobot', doneWord: 'fixedit',
  steps(S) {
    const P = S.pat = fixPatient();
    S.fixed = {}; S.screws = 0; S.bAct = null; S.bActT = 0; S.awake = false;
    const kind = S.broken = fixPick(['leg', 'arm', 'head']);
    S.extra = fixPick(['clean', 'paint']);
    S.mud = S.extra === 'clean' ? 3 : 0;
    const steps = [
      { key: kind, askList: () => [{ k: 'robotbroken' }, { k: kind + 'off' }, { k: 'findsame' }], opts: shuffled(FIX_PARTS[kind]), answer: P[kind],
        miss(S, k) { S.shake = 0.5; sfx('bounce'); say([{ k }, { k: 'notthis' }, { k: 'findsame' }]); },
        then(S) { S.fixed[kind] = true; },
        sayList: (S, k) => [{ k }, { k: 'fixedit' }] },
      { key: 'screw', taps: 3, icon: 'screwdriver', ask: 'tightenscrew', sfx: 'tap', each(S, i) { S.screws = i; }, count: ['screw', '颗', 'kē'] },
    ];
    if (S.extra === 'clean') steps.push({ key: 'mud', taps: 3, icon: 'wipeclean', ask: 'wipeclean', sfx: 'water', each(S, i) { S.mud = 3 - i; }, say: 'clean' });
    else steps.push({ key: 'color', colors: true, ask: 'pickcolor' });
    steps.push({ key: 'battery', opts: ['battery'], ask: 'putbattery', sfx: 'whoosh' });
    steps.push({ key: 'button', opts: ['button'], ask: 'pressbutton', sfx: 'chime' });
    return steps;
  },
  update(dt, S) {
    if (S.bAct) { S.bActT += dt; if (S.bActT > (S.bAct === 'dance' ? 3.2 : S.bAct === 'hello' ? 2.4 : 1.6)) S.bAct = null; }
  },
  draw(c, t, S) {
    if (!S.pat) return;
    const P = S.pat;
    // dinding bengkel, papan tanda perbaikan, lantai
    px(c, 0, 0, 160, 80, '#d3dfe6');
    for (let x = 0; x < 160; x += 20) { px(c, x, 0, 1, 74, '#c4d2da'); px(c, x + 1, 0, 1, 74, '#e0eaef'); }
    px(c, 0, 74, 160, 6, '#7d8a98'); px(c, 0, 74, 160, 1, '#a9b6c4');
    px(c, 10, 8, 30, 22, '#5f6c7a'); px(c, 11, 9, 28, 20, '#fff8e8'); px(c, 22, 12, 6, 14, '#e2483d'); px(c, 18, 16, 14, 6, '#e2483d');
    px(c, 116, 8, 36, 26, '#8a6440'); px(c, 117, 9, 34, 24, '#b08654');
    ['screwdriver', 'wrench', 'hammer'].forEach((k, i) => { if (ST_ART[k]) ST_ART[k](c, 123 + i * 11, 31); });
    px(c, 0, 80, 160, 30, '#a7adb6');
    for (let x = 0; x < 160; x += 16) px(c, x, 80, 1, 30, '#969ca6');
    for (let y = 88; y < 110; y += 10) px(c, 0, y, 160, 1, '#969ca6');
    // meja angkat
    px(c, 46, 100, 4, 8, '#5f6c7a'); px(c, 110, 100, 4, 8, '#5f6c7a');
    px(c, 38, 94, 84, 6, '#7d8a98'); px(c, 38, 94, 84, 1, '#c9d4e0');
    for (let i = 0; i < 14; i++) px(c, 40 + i * 6, 98, 3, 2, i % 2 ? '#f4cf3a' : '#3a3f4a');
    const shake = S.shake > 0 ? Math.round(Math.sin(S.shake * 40)) : 0;
    big2(() => {
      // robot yang diperbaiki
      const cfg = { leg: P.leg, body: P.body, arm: P.arm, head: P.head, color: S.extra === 'paint' ? S.cfg.color : P.color };
      if (!S.fixed[S.broken]) cfg[S.broken] = null;
      const legH = cfg.leg ? RB_LEG[cfg.leg] : 0, B = RB_BODY[P.body], x = 40 + shake * 0.5, yb = 47 - legH;
      drawMyRobot(c, x, 47, cfg, t, { noShadow: true, awake: S.awake, act: S.bAct, actT: S.bActT, dropKey: S.drop > 0 ? S.dropKey : null, drop: S.drop, dir: 0 });
      // sekrup: yang longgar menonjol dan bergoyang, yang sudah kencang rata
      if (!S.awake || S.step < S.steps.length) fixScrewSpots(P.body).forEach(([dx, dy], i) => {
        const sx = Math.round(x + dx), sy = Math.round(yb + dy);
        if (i < S.screws) { px(c, sx, sy, 2, 2, RB_MD); px(c, sx, sy, 1, 1, RB_ML); }
        else { const w = Math.floor(t * 6 + i) % 2; px(c, sx - 2 + w, sy - 2, 5, 4, RB_K); px(c, sx - 1 + w, sy - 1, 3, 2, '#e8eef2'); px(c, sx + w, sy - 1, 1, 2, RB_MD); }
      });
      // kotoran lumpur
      const mudSpots = [[-3, -B.h + 4], [3, -3], [-6, -B.h + 8]];
      for (let i = 0; i < S.mud; i++) { const [dx, dy] = mudSpots[i]; disc(c, x + dx, yb + dy, 2, '#7a5a3a'); px(c, x + dx - 1, yb + dy - 1, 1, 1, '#5a3a22'); px(c, x + dx + 1, yb + dy + 1, 1, 1, '#9a7a52'); }
      // bagian yang copot tergeletak di lantai (retak)
      if (!S.fixed[S.broken]) {
        const k = P[S.broken], T = RB_TONE[FIX_STCOL[k]] || RB_GRAY;
        if (S.broken === 'leg') rbLeg(c, 66, 52, k, t, false);
        else if (S.broken === 'arm') rbArms(c, 66, 41, 4, k, T, 'down', t);
        else rbHead(c, 66, 52, k, T, t, false, 0);
        px(c, 65, 44, 1, 2, RB_K); px(c, 66, 46, 1, 2, RB_K); px(c, 65, 48, 1, 2, RB_K);
      }
      // baterai meluncur masuk
      if (S.dropKey === 'battery' && S.drop > 0) { const bx = 40 + S.drop * 26, by = yb - B.h / 2 - 2; px(c, bx, by, 7, 4, RB_K); px(c, bx, by, 3, 4, '#f4cf3a'); px(c, bx + 7, by + 1, 1, 2, RB_ML); }
    });
    // tanda seru berkedip selama robot masih rusak
    if (!S.awake && Math.floor(t * 2) % 2) { px(c, 106, 30, 4, 10, '#e2483d'); px(c, 106, 42, 4, 4, '#e2483d'); }
    if (S.pulse > 0 && S.dropKey && S.dropKey.startsWith('mud')) for (let i = 0; i < 5; i++) px(c, 76 + Math.round(Math.cos(t * 9 + i) * 10), 50 + Math.round(Math.sin(t * 7 + i * 2) * 10), 2, 2, '#ffffff');
  },
  finish(S) {
    S.awake = true; S.bAct = 'hello'; S.bActT = 0;
    EX.fixN = (EX.fixN || 0) + 1; exSave();
    return [{ k: 'robotwakes' }, { k: 'thankfix', by: FIX_SPOT }, { k: 'great' }];
  },
  tapDone(S) { S.bAct = 'jump'; S.bActT = 0; sfx('bounce'); say([{ k: 'fixedit' }]); },
  doneOpts: S => [['dance', () => { S.bAct = 'dance'; S.bActT = 0; rbTune(); say([{ k: 'dance', by: FIX_SPOT }]); }], ['nextrobot', bdReset]],
};

// meja perbaikan di Bengkel Robot (kiri, di samping insinyur)
const FIX_SPOT = { voice: 'robot', x: 46, y: 108, hit: [20, 70, 54, 40], go: [48, 120],
  draw(c, t) {
    shadowRect(c, 22, 107, 50, 3);
    px(c, 26, 100, 3, 7, '#5f6c7a'); px(c, 66, 100, 3, 7, '#5f6c7a');
    px(c, 22, 96, 50, 5, '#7d8a98'); px(c, 22, 96, 50, 1, '#c9d4e0');
    for (let i = 0; i < 8; i++) px(c, 23 + i * 6, 99, 3, 2, i % 2 ? '#f4cf3a' : '#3a3f4a');
    // robot rusak abu-abu duduk lemas, kepalanya di samping
    drawMyRobot(c, 38, 96, { body: 'rbbox', arm: 'raclaw', color: null }, t, { noShadow: true, awake: false });
    rbHead(c, 58, 96, 'rhbox', RB_GRAY, t, false, 0);
    // papan tanda: palang merah
    px(c, 30, 72, 16, 12, '#5f6c7a'); px(c, 31, 73, 14, 10, '#fff8e8'); px(c, 36, 74, 4, 8, '#e2483d'); px(c, 33, 76, 10, 4, '#e2483d');
    if (Math.floor(t * 2) % 2) drawStar(c, 58, 72, '#ffd84a');
  },
  tap() { say([{ k: 'robotbroken' }, { k: 'fixrobot' }]); },
  arrive() { G.boy.dir = 'left'; bdOpen('fixbot'); } };
SCENES.workshop.objs.push(FIX_SPOT);
SCENES.workshop.blocks.push([22, 94, 50, 10]);

// ================= 2. ROBOT PENDAMPING =================
const buddy = {
  voice: 'robot', x: 0, y: 0, dir: 1, moving: false, act: null, actT: 0, ft: 0, sc: null,
  get hidden() { return !EX.robot || !EX.robotFollow; },
  get hit() { const h = rbHeight(EX.robot || {}); return [this.x - 11, this.y - h, 22, h + 1]; },
  get go() { return [this.x + (G.boy.x < this.x ? -18 : 18), this.y + 2]; },
  draw(c, t) { drawMyRobot(c, this.x, this.y, EX.robot, t, { dir: this.dir, moving: this.moving, act: this.act, actT: this.actT, awake: true }); },
  place() {
    const b = G.boy, w = G.scene.walk, side = b.x > 160 ? 1 : -1;
    this.x = Math.max(w[0], Math.min(w[2], b.x + side * 26)); this.y = Math.max(w[1], Math.min(w[3], b.y - 4)); this.moving = false;
  },
  update(dt) {
    if (this.hidden) { this.sc = null; return; }
    if (this.sc !== G.scene) { this.sc = G.scene; this.place(); }
    if (this.act) { this.actT += dt; this.moving = false; if (this.actT > (this.act === 'dance' ? 4 : this.act === 'hello' ? 2.4 : 1.6)) this.act = null; return; }
    // berjalan di belakang Russel, sedikit lebih jauh dari Doudou supaya tidak bertumpuk
    const b = G.boy, w = G.scene.walk;
    if (b.ride || b.soak) { this.moving = false; return; }
    const face = b.dir === 'left' ? -1 : b.dir === 'right' ? 1 : (this.x < b.x ? 1 : -1);
    const tx = Math.max(w[0], Math.min(w[2], b.x - face * 30)), ty = Math.max(w[1], Math.min(w[3], b.y - 5));
    const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
    if (d > 8) {
      const st = Math.min(d, (d > 60 ? 90 : 56) * dt);
      this.x += dx / d * st; this.y += dy / d * st; this.moving = true;
      if (Math.abs(dx) > 1) this.dir = dx > 0 ? 1 : -1;
    } else { this.moving = false; if (!b.moving) this.dir = b.x >= this.x ? 1 : -1; }
  },
  doIt(act) { this.act = act; this.actT = 0; },
  tap() {
    this.dir = G.boy.x < this.x ? -1 : 1; sfx('chime');
    offerPics(this.x, this.y - rbHeight(EX.robot) - 2, [
      picBtn('hello', 'take', () => { this.doIt('hello'); say([{ k: 'robot', zh: '你好！我是机器人。', by: this }, { k: 'hello', by: G.boy }]); }),
      picBtn('dance', 'eat', () => { this.doIt('dance'); rbTune(); say([{ k: 'dance', by: this }]); }),
      picBtn('jump', 'give', () => { this.doIt('jump'); sfx('bounce'); say([{ k: 'jump', zh: '跳！', by: this }]); }),
      picBtn('spin', 'throw', () => { this.doIt('spin'); sfx('whoosh'); say([{ k: 'spin', by: this }]); }),
      picBtn('gohomebot', 'give', () => { robotFollow(false); say([{ k: 'gohomebot', by: G.boy }, { k: 'bye', by: this }]); }),
    ]);
  },
};
// robot ikut atau pulang ke bengkel
function robotFollow(on) {
  EX.robotFollow = !!on; exSave();
  if (on) { buddy.sc = G.scene; buddy.x = myBot.x; buddy.y = myBot.y; if (G.scene !== SCENES.workshop) buddy.place(); }
  else { fx('spark', buddy.x, buddy.y - 16, 6); myBot.x = buddy.x; myBot.y = buddy.y; myBot.wait = 3; }
  if ($('set-robot')) $('set-robot').checked = EX.robotFollow;
}
// di bengkel, robot yang berdiam diri disembunyikan selama robot pendamping ikut Russel
Object.defineProperty(myBot, 'hidden', { get() { return !EX.robot || EX.robotFollow; }, configurable: true });
myBot.tap = function () {
  this.wait = 7; this.moving = false; this.dir = G.boy.x < this.x ? -1 : 1;
  sfx('chime');
  offerPics(this.x, this.y - rbHeight(EX.robot) - 2, [
    picBtn('hello', 'take', () => { this.doIt('hello'); say([{ k: 'robot', zh: '你好！我是机器人。', by: this }, { k: 'hello', by: G.boy }]); }),
    picBtn('dance', 'eat', () => { this.doIt('dance'); rbTune(); say([{ k: 'dance', by: this }]); }),
    picBtn('jump', 'give', () => { this.doIt('jump'); sfx('bounce'); say([{ k: 'jump', zh: '跳！', by: this }]); }),
    picBtn('followme', 'take', () => { robotFollow(true); buddy.doIt('hello'); say([{ k: 'followme', by: G.boy }, { k: 'a_ok', by: buddy }, { k: 'letsgo', by: buddy }]); }),
  ]);
};
// masukkan ke semua tempat (juga tempat yang dibuat file sesudah ini)
const buddyIn = () => Object.values(SCENES).forEach(s => { if (s && s.objs && !s.objs.includes(buddy)) s.objs.push(buddy); });
buddyIn(); window.addEventListener('load', buddyIn);

// pilihan di menu orang tua
(() => {
  const box = $('set-music') && $('set-music').closest('label');
  if (!box) return;
  const lab = document.createElement('label');
  lab.innerHTML = '<input type="checkbox" id="set-robot"> Robot buatan Russel ikut ke semua tempat (bisa juga: ketuk robotnya di Bengkel Robot → 跟我走; ketuk lagi → 你先回去吧 untuk menyuruhnya pulang)';
  box.parentNode.insertBefore(lab, box.nextSibling);
  const cb = $('set-robot');
  cb.addEventListener('change', e => {
    if (e.target.checked && !EX.robot) { e.target.checked = false; alert('Robot belum dirakit. Rakit dulu di Bengkel Robot (meja rakit di tengah).'); return; }
    robotFollow(e.target.checked);
  });
  const sync = syncParentSettings;
  syncParentSettings = function () { sync(); cb.checked = !!(EX.robot && EX.robotFollow); };
})();

// ================= STIKER =================
Object.assign(ST_ART, {
  fixrobot: (c, x, y) => { drawMyRobot(c, x - 5, y, { leg: 'rleg', body: 'rbbox', arm: 'raclaw', color: 'blue' }, 0, { noShadow: true }); ST_ART.wrench(c, x + 13, y); },
  robotbroken: (c, x, y) => { drawMyRobot(c, x - 4, y, { body: 'rbbox', arm: 'raclaw', color: 'blue' }, 0, { noShadow: true }); rbHead(c, x + 12, y, 'rhbox', RB_TONE.blue, 0, false, 0); },
  legoff: (c, x, y) => { drawMyRobot(c, x - 6, y - 2, { body: 'rbbox', arm: 'raclaw', head: 'rhbox', color: 'green' }, 0, { noShadow: true }); rbLeg(c, x + 12, y, 'rleg', 0, false); },
  armoff: (c, x, y) => { drawMyRobot(c, x - 6, y, { leg: 'rwheel', body: 'rbbox', head: 'rhbox', color: 'red' }, 0, { noShadow: true }); rbArms(c, x + 13, y - 11, 3, 'rabig', RB_TONE.red, 'down', 0); },
  headoff: (c, x, y) => { drawMyRobot(c, x - 6, y, { leg: 'rleg', body: 'rbtall', arm: 'raball', color: 'yellow' }, 0, { noShadow: true }); rbHead(c, x + 12, y, 'rhround', RB_TONE.yellow, 0, false, 0); },
  findsame: (c, x, y) => { rbHead(c, x - 9, y - 4, 'rhears', RB_TONE.pink, 0, true, 0); rbHead(c, x + 9, y - 4, 'rhears', RB_TONE.pink, 0, true, 0); px(c, x - 2, y - 13, 4, 1, '#3a3f4a'); px(c, x - 2, y - 10, 4, 1, '#3a3f4a'); },
  fixedit: (c, x, y) => { drawMyRobot(c, x - 3, y, { leg: 'rwheel', body: 'rbround', arm: 'raball', head: 'rhround', color: 'green' }, 0, { noShadow: true, awake: true }); drawStar(c, x + 13, y - 24, '#ffd84a'); },
  tightenscrew: (c, x, y) => { ST_ART.screw(c, x - 6, y); ST_ART.screwdriver(c, x + 8, y - 4); },
  wipeclean: (c, x, y) => { px(c, x - 8, y - 12, 16, 9, '#f4cf3a'); px(c, x - 8, y - 12, 16, 2, '#fff2a8'); for (let i = 0; i < 4; i++) px(c, x - 6 + i * 4, y - 8, 2, 2, '#d9b02a'); for (const [a, b] of [[-10, -18], [6, -20], [11, -14]]) { px(c, x + a, y + b, 3, 1, '#bfe3f2'); px(c, x + a, y + b + 2, 3, 1, '#bfe3f2'); px(c, x + a - 1, y + b + 1, 1, 1, '#bfe3f2'); px(c, x + a + 3, y + b + 1, 1, 1, '#bfe3f2'); } },
  thankfix: (c, x, y) => { drawMyRobot(c, x - 3, y, { leg: 'rleg', body: 'rbbox', arm: 'rabig', head: 'rhbox', color: 'orange' }, 0, { noShadow: true, awake: true, act: 'hello' }); drawHeart(c, x + 13, y - 26); },
  nextrobot: (c, x, y) => { drawMyRobot(c, x - 6, y, { leg: 'rtrack', body: 'rbtall', arm: 'raclaw', head: 'rhbox', color: 'pink' }, 0, { noShadow: true }); px(c, x + 10, y - 14, 8, 2, '#58a84a'); px(c, x + 15, y - 17, 3, 8, '#58a84a'); px(c, x + 18, y - 14, 2, 2, '#58a84a'); },
  gohomebot: (c, x, y) => { drawMyRobot(c, x - 6, y, { leg: 'rwheel', body: 'rbbox', arm: 'raball', head: 'rhbox', color: 'blue' }, 0, { noShadow: true, awake: true, dir: 1 }); px(c, x + 9, y - 18, 10, 9, '#8a6440'); px(c, x + 8, y - 20, 12, 2, '#e2483d'); px(c, x + 12, y - 14, 3, 5, '#5a3a22'); },
  letsgo: (c, x, y) => { drawMyRobot(c, x - 4, y, { leg: 'rleg', body: 'rbbox', arm: 'rabig', head: 'rhbox', color: 'blue' }, 0, { noShadow: true, awake: true, moving: true, dir: 1 }); for (let k = 0; k < 3; k++) px(c, x + 10 + k * 4, y - 12, 3, 2, '#58a84a'); },
});

THEMES.push(
  { name: 'Perbaikan robot', where: 'Bengkel Robot: ketuk meja angkat dengan robot abu-abu di kiri (dekat insinyur). Robot rusak datang: cari bagian yang sama dengan yang copot (kaki, tangan, atau kepala), kencangkan 3 sekrup sambil berhitung, lap kotorannya atau cat ulang, pasang baterai, lalu tekan tombol. Robot bangun dan berterima kasih; pilih 下一个机器人 untuk robot berikutnya.', words: ['fixrobot', 'robotbroken', 'legoff', 'armoff', 'headoff', 'findsame', 'fixedit', 'tightenscrew', 'screw', 'screwdriver', 'wipeclean', 'clean', 'putbattery', 'pressbutton', 'thankfix', 'nextrobot'] },
  { name: 'Robot pendamping', where: 'Setelah merakit robot, ketuk robotnya di Bengkel Robot lalu pilih 跟我走: robot ikut Russel ke semua tempat (juga setelah game ditutup). Ketuk robotnya di mana saja untuk menari, melompat, berputar, atau 你先回去吧 supaya pulang ke bengkel. Bisa juga dinyalakan/dimatikan di menu orang tua.', words: ['myrobot', 'followme', 'letsgo', 'a_ok', 'gohomebot', 'dance', 'jump', 'spin', 'bye'] },
);
