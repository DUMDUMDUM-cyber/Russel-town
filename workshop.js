// Bengkel robot: Russel merakit robotnya sendiri (kaki, badan, tangan, kepala, warna, baterai, tombol).
// Robot yang selesai tersimpan di EX.robot dan berjalan-jalan di bengkel.

LOOKS.engineer = { skin: '#f3c6a0', hair: '#3a2418', style: 'cap', cap: '#f4cf3a', capD: '#c9a21f', shirt: '#f08a32', shirtD: '#bd5e1c', pants: '#3f4a6a', shoes: '#3a2a20' };

// ================= GAMBAR ROBOT =================
const RB_TONE = {
  red: ['#e2483d', '#a8352b', '#ff8a7a'], blue: ['#4f86e0', '#2f5bab', '#8fb4ee'], yellow: ['#f4cf3a', '#c9a21f', '#fff2a8'],
  green: ['#58a84a', '#3d7f33', '#8fd878'], pink: ['#f39ac0', '#cc6a95', '#fcd0e2'], orange: ['#f08a32', '#bd5e1c', '#ffb877'],
};
const RB_GRAY = ['#c9d4e0', '#9aa8b8', '#e8eef2'];
const RB_LEG = { rwheel: 6, rleg: 8, rtrack: 6 };
const RB_BODY = { rbbox: { w: 16, h: 12 }, rbround: { w: 14, h: 14 }, rbtall: { w: 12, h: 15 } };
const RB_M = '#a9b6c4', RB_MD = '#7d8a98', RB_ML = '#d6dee6', RB_K = '#3a3f4a', RB_SCREEN = '#2a3a4a', RB_OFF = '#5a6470', RB_EYE = '#7cf0c4';

function rbLeg(c, x, y, k, t, moving) {
  if (k === 'rwheel') {
    px(c, x - 6, y - 5, 12, 2, RB_MD);
    for (const wx of [x - 5, x + 5]) {
      disc(c, wx, y - 3, 3, RB_K); disc(c, wx, y - 3, 1.5, RB_ML);
      const a = moving ? t * 8 : 0.8; px(c, wx + Math.round(Math.cos(a) * 2), y - 3 + Math.round(Math.sin(a) * 2), 1, 1, '#ffd84a');
    }
  } else if (k === 'rleg') {
    const step = moving ? Math.floor(t * 8) % 2 : 0;
    [[x - 5, step], [x + 2, moving ? 1 - step : 0]].forEach(([lx, lift]) => {
      px(c, lx, y - 8, 3, 6 - lift, RB_M); px(c, lx, y - 8, 1, 6 - lift, RB_ML); px(c, lx + 2, y - 8, 1, 6 - lift, RB_MD); px(c, lx, y - 5, 3, 1, RB_MD);
      px(c, lx - 1, y - 2 - lift, 5, 2, RB_K); px(c, lx - 1, y - 2 - lift, 5, 1, RB_OFF);
    });
  } else {
    px(c, x - 8, y - 6, 16, 6, RB_K); disc(c, x - 8, y - 3, 3, RB_K); disc(c, x + 8, y - 3, 3, RB_K);
    for (const rx of [-8, -3, 3, 8]) { disc(c, x + rx, y - 3, 1.5, RB_MD); px(c, x + rx, y - 3, 1, 1, RB_ML); }
    const off = moving ? Math.floor(t * 10) % 4 : 0;
    for (let i = 0; i < 5; i++) { px(c, x - 10 + ((i * 4 + off) % 20), y - 1, 2, 1, RB_OFF); px(c, x + 8 - ((i * 4 + off) % 20), y - 6, 2, 1, RB_OFF); }
  }
}
function rbBody(c, x, yb, k, T, t, on) {
  const [col, dark, light] = T, led = on ? (Math.floor(t * 3) % 2 ? RB_EYE : '#ffd84a') : RB_OFF, led2 = on ? (Math.floor(t * 3) % 2 ? '#ffd84a' : RB_EYE) : RB_OFF;
  if (k === 'rbbox') {
    px(c, x - 8, yb - 12, 16, 12, col); px(c, x - 8, yb - 12, 16, 1, light); px(c, x + 5, yb - 11, 3, 11, dark); px(c, x - 8, yb - 1, 16, 1, dark);
    px(c, x - 5, yb - 10, 9, 6, RB_SCREEN); px(c, x - 4, yb - 9, 2, 1, led); px(c, x - 1, yb - 9, 3, 1, led2); px(c, x - 4, yb - 7, 7, 1, on ? '#4f86e0' : RB_OFF);
    px(c, x - 4, yb - 3, 2, 1, '#ffd84a'); px(c, x - 1, yb - 3, 2, 1, led);
  } else if (k === 'rbround') {
    disc(c, x, yb - 7, 7, dark); disc(c, x - 0.5, yb - 7.5, 6, col); oval(c, x - 2.5, yb - 10.5, 2, 1, light);
    disc(c, x, yb - 7, 3, RB_SCREEN); disc(c, x, yb - 7, 1.5, led);
  } else {
    px(c, x - 6, yb - 15, 12, 15, col); px(c, x - 6, yb - 15, 12, 1, light); px(c, x + 3, yb - 14, 3, 14, dark); px(c, x - 6, yb - 1, 12, 1, dark);
    for (let i = 0; i < 3; i++) { px(c, x - 4, yb - 13 + i * 4, 6, 3, RB_SCREEN); px(c, x - 3, yb - 12 + i * 4, 4, 1, i === 1 ? led2 : led); }
  }
}
function rbArms(c, x, ys, hw, k, T, pose, t) {
  const [col, dark, light] = T;
  for (const s of [-1, 1]) {
    const up = pose === 'up' || (pose === 'alt' && (s < 0) === (Math.floor(t * 6) % 2 === 0)) || (pose === 'wave' && s > 0 && Math.floor(t * 5) % 2 === 0);
    const ax = s < 0 ? x - hw - 2 : x + hw, h = 7, y0 = up ? ys - h + 1 : ys;
    if (k === 'raball') for (let i = 0; i < h; i++) px(c, ax, y0 + i, 2, 1, i % 2 ? RB_ML : RB_MD);
    else { px(c, ax, y0, 2, h, RB_M); px(c, s < 0 ? ax : ax + 1, y0, 1, h, RB_MD); }
    const hx = ax + 1, hy = up ? y0 - 1 : y0 + h, dirY = up ? -1 : 1;
    if (k === 'raclaw') {
      px(c, hx - 2, hy, 5, 1, RB_K);
      px(c, hx - 2, hy + (up ? -2 : 1), 1, 2, RB_K); px(c, hx + 2, hy + (up ? -2 : 1), 1, 2, RB_K);
    } else if (k === 'raball') {
      disc(c, hx, hy + dirY, 2.5, dark); disc(c, hx - 0.5, hy + dirY - 0.5, 1.5, col);
    } else {
      disc(c, hx, hy + dirY, 3, dark); disc(c, hx - 0.5, hy + dirY - 0.5, 2.5, col); px(c, hx - 2, hy + dirY - 2, 2, 1, light);
      px(c, hx + s * 3, hy + dirY - 1, 1, 2, dark);
    }
  }
}
function rbHead(c, x, yh, k, T, t, on, dir) {
  const [col, dark, light] = T, blink = Math.floor(t * 2) % 7 === 0, dx = dir > 0 ? 1 : dir < 0 ? -1 : 0;
  const eyes = (a, b, ey) => {
    if (!on) { px(c, a, ey + 1, 2, 1, RB_OFF); px(c, b, ey + 1, 2, 1, RB_OFF); return; }
    if (blink) { px(c, a, ey + 1, 2, 1, RB_EYE); px(c, b, ey + 1, 2, 1, RB_EYE); return; }
    px(c, a, ey, 2, 2, RB_EYE); px(c, b, ey, 2, 2, RB_EYE); px(c, a, ey, 1, 1, '#ffffff'); px(c, b, ey, 1, 1, '#ffffff');
  };
  const tip = on ? (Math.floor(t * 2) % 2 ? '#e2483d' : '#ff9a8a') : RB_OFF;
  px(c, x - 2, yh - 1, 4, 1, RB_MD);
  if (k === 'rhbox') {
    px(c, x, yh - 15, 1, 3, RB_MD); disc(c, x, yh - 16, 1, tip);
    px(c, x - 7, yh - 12, 14, 11, col); px(c, x - 7, yh - 12, 14, 1, light); px(c, x + 5, yh - 11, 2, 10, dark); px(c, x - 7, yh - 2, 14, 1, dark);
    px(c, x - 5, yh - 10, 10, 6, RB_SCREEN); eyes(x - 4 + dx, x + 1 + dx, yh - 9); px(c, x - 1 + dx, yh - 6, 2, 1, on ? RB_EYE : RB_OFF);
    px(c, x - 8, yh - 8, 1, 3, RB_MD); px(c, x + 7, yh - 8, 1, 3, RB_MD);
  } else if (k === 'rhround') {
    px(c, x - 3, yh - 16, 1, 3, RB_MD); px(c, x + 3, yh - 16, 1, 3, RB_MD); disc(c, x - 3, yh - 17, 1, tip); disc(c, x + 3, yh - 17, 1, tip);
    disc(c, x, yh - 7, 7, dark); disc(c, x - 0.5, yh - 7.5, 6, col); oval(c, x - 3, yh - 11, 2, 1, light);
    oval(c, x, yh - 6, 5, 3, RB_SCREEN); eyes(x - 3 + dx, x + 1 + dx, yh - 7);
    px(c, x - 8, yh - 8, 1, 3, RB_MD); px(c, x + 7, yh - 8, 1, 3, RB_MD);
  } else {
    disc(c, x - 6, yh - 12, 3, dark); disc(c, x + 6, yh - 12, 3, dark); disc(c, x - 6, yh - 12, 2, col); disc(c, x + 6, yh - 12, 2, col); disc(c, x - 6, yh - 12, 1, '#ffb8c8'); disc(c, x + 6, yh - 12, 1, '#ffb8c8');
    px(c, x - 7, yh - 12, 14, 11, col); px(c, x - 7, yh - 12, 14, 1, light); px(c, x + 5, yh - 11, 2, 10, dark); px(c, x - 7, yh - 2, 14, 1, dark);
    px(c, x - 5, yh - 10, 10, 6, RB_SCREEN); eyes(x - 4 + dx, x + 1 + dx, yh - 9); px(c, x - 1 + dx, yh - 6, 2, 1, on ? '#ffb8c8' : RB_OFF);
  }
}
const rbHeight = cfg => (RB_LEG[cfg.leg] || 0) + ((RB_BODY[cfg.body] || {}).h || 0) + 16;
// o: { dir, moving, act, actT, awake, noShadow, dropKey, drop }
function drawMyRobot(c, x, y, cfg, t, o = {}) {
  x = Math.round(x); y = Math.round(y);
  const T = RB_TONE[cfg.color] || RB_GRAY, on = !!o.awake, act = o.act;
  if (!o.noShadow) shadow(c, x, y, 10);
  const bob = act === 'jump' ? Math.round(Math.abs(Math.sin((o.actT || 0) * 6)) * 9) : act === 'dance' ? (Math.floor(t * 6) % 2 ? 2 : 0) : o.moving && Math.floor(t * 8) % 2 ? 1 : 0;
  const dir = act === 'spin' ? (Math.floor((o.actT || 0) * 8) % 2 ? 1 : -1) : (o.dir || 0);
  const drop = key => (o.dropKey === key ? -Math.round(o.drop * o.drop * 34) : 0);
  const pose = act === 'dance' ? 'alt' : act === 'jump' ? 'up' : act === 'hello' ? 'wave' : 'down';
  if (cfg.leg) rbLeg(c, x, y - bob + drop('leg'), cfg.leg, t, o.moving || act === 'spin');
  const yb = y - (RB_LEG[cfg.leg] || 0) - bob, B = RB_BODY[cfg.body];
  if (!B) return;
  rbBody(c, x, yb + drop('body'), cfg.body, T, t, on);
  if (cfg.arm) rbArms(c, x, yb - B.h + 3 + drop('arm'), B.w / 2, cfg.arm, T, pose, t);
  if (cfg.head) rbHead(c, x, yb - B.h + drop('head'), cfg.head, T, t, on, dir);
}

// ================= MERAKIT ROBOT (jendela) =================
const RB_COLORS = ['red', 'blue', 'yellow', 'green', 'pink', 'orange'];
const RB_STEPS = [
  { key: 'leg', ask: 'foot', opts: ['rwheel', 'rleg', 'rtrack'] },
  { key: 'body', ask: 'rbody', opts: ['rbbox', 'rbround', 'rbtall'] },
  { key: 'arm', ask: 'hand', opts: ['raclaw', 'raball', 'rabig'] },
  { key: 'head', ask: 'head', opts: ['rhbox', 'rhround', 'rhears'] },
  { key: 'color', ask: 'pickcolor', opts: RB_COLORS },
  { key: 'battery', ask: 'putbattery', opts: ['battery'] },
  { key: 'button', ask: 'pressbutton', opts: ['button'] },
];
const RB = { step: 0, cfg: {}, drop: 0, dropKey: null, batt: 0, power: 0, done: false, wake: 0, act: null, actT: 0, cv: $('rb-cv'), src: document.createElement('canvas') };
RB.src.width = 160; RB.src.height = 110;
RB.sctx = RB.src.getContext('2d', { willReadFrequently: true });
RB.ctx = RB.cv.getContext('2d');
PANELS.robot = $('p-robot');
PANELS.robot.addEventListener('pointerdown', e => { if (e.target === PANELS.robot) closePanel(); });

function rbOption(k, onClick) {
  const w = word(k), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn'; b.setAttribute('aria-label', w.id);
  b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', onClick);
  return b;
}
function rbRender() {
  const box = $('rb-opts'); box.innerHTML = ''; box.className = 'proc';
  $('rb-steps').innerHTML = RB_STEPS.map((s, i) => `<span class="fstar${RB.done || i < RB.step ? ' on' : ''}" aria-hidden="true"></span>`).join('');
  $('rb-steps').setAttribute('aria-label', 'Langkah ' + Math.min(RB.step + 1, RB_STEPS.length) + ' dari ' + RB_STEPS.length);
  if (RB.done) {
    box.classList.add('rb-grid');
    [['dance', () => rbAct('dance')], ['jump', () => rbAct('jump')], ['spin', () => rbAct('spin')], ['makenew', rbNew]].forEach(([k, fn]) => box.appendChild(rbOption(k, fn)));
    return;
  }
  const s = RB_STEPS[RB.step];
  if (s.key === 'color') {
    box.classList.add('rb-colors');
    RB_COLORS.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'swatch'; b.style.setProperty('--sw', RB_TONE[k][0]); b.setAttribute('aria-label', 'Warna ' + word(k).id);
      b.addEventListener('click', () => rbPick(k));
      box.appendChild(b);
    });
    return;
  }
  s.opts.forEach(k => box.appendChild(rbOption(k, () => rbPick(k))));
}
function rbPick(k) {
  if (RB.done) return;
  const s = RB_STEPS[RB.step];
  if (s.key === 'battery') { if (RB.batt > 0) return; RB.batt = 1; sfx('whoosh'); say([{ k: 'battery' }]); return; }
  if (s.key === 'button') { rbWake(); return; }
  RB.cfg[s.key] = k;
  if (s.key === 'color') { sfx('sparkle'); RB.flash = 0.5; } else { RB.dropKey = s.key; RB.drop = 1; sfx('pop'); }
  RB.step++; rbRender();
  say([{ k }, { k: RB_STEPS[RB.step].ask }]);
}
function rbWake() {
  RB.done = true; RB.wake = 3; RB.power = 1;
  EX.robot = { leg: RB.cfg.leg, body: RB.cfg.body, arm: RB.cfg.arm, head: RB.cfg.head, color: RB.cfg.color }; exSave();
  sfx('sparkle'); [523, 659, 784, 1047].forEach((f, i) => Snd.tone(f, 0.18, { gain: 0.09, when: i * 0.14, type: 'square' }));
  addCoins(2, myBot.x, myBot.y - 30);
  RB.act = 'hello'; RB.actT = 0;
  rbRender();
  say([{ k: 'robotwakes' }, { k: 'robot', zh: '你好！我是机器人。', by: myBot }, { k: 'myrobot', by: G.boy }, { k: 'great' }]);
}
function rbNew() {
  RB.step = 0; RB.cfg = {}; RB.done = false; RB.power = 0; RB.batt = 0; RB.act = null; RB.dropKey = null; RB.drop = 0;
  sfx('pop'); rbRender();
  say([{ k: 'makerobot' }, { k: RB_STEPS[0].ask }]);
}
function rbAct(act) {
  RB.act = act; RB.actT = 0;
  if (act === 'dance') { rbTune(); say([{ k: 'dance', by: myBot }]); }
  else if (act === 'jump') { sfx('bounce'); say([{ k: 'jump', zh: '跳！', by: myBot }]); }
  else { sfx('whoosh'); say([{ k: 'spin', by: myBot }]); }
}
function rbTune() { [523, 659, 784, 659, 523, 659, 784, 1047].forEach((f, i) => Snd.tone(f, 0.22, { gain: 0.09, when: i * 0.28, type: 'triangle' })); }
function rbOpen() {
  if (EX.robot) { RB.cfg = Object.assign({}, EX.robot); RB.step = RB_STEPS.length - 1; RB.done = true; RB.power = 1; RB.act = null; say([{ k: 'myrobot' }]); }
  else if (!RB.step && !RB.cfg.leg) { RB.power = 0; say([{ k: 'makerobot' }, { k: RB_STEPS[0].ask }]); }
  else say([{ k: RB_STEPS[RB.step].ask }]);
  rbRender();
}
PANEL_HOOK.robot = dt => {
  const c = RB.sctx, t = G.t;
  RB.drop = Math.max(0, RB.drop - dt * 2.4); RB.flash = Math.max(0, (RB.flash || 0) - dt);
  if (RB.wake > 0) RB.wake -= dt;
  if (RB.act) { RB.actT += dt; if (RB.actT > (RB.act === 'dance' ? 3.2 : RB.act === 'hello' ? 2.4 : 1.6)) RB.act = null; }
  // dinding, gambar rancangan, lantai
  px(c, 0, 0, 160, 80, '#d3dfe6');
  for (let x = 0; x < 160; x += 20) { px(c, x, 0, 1, 74, '#c4d2da'); px(c, x + 1, 0, 1, 74, '#e0eaef'); }
  px(c, 0, 74, 160, 6, '#7d8a98'); px(c, 0, 74, 160, 1, '#a9b6c4');
  px(c, 8, 10, 40, 30, '#2f5bab'); px(c, 9, 11, 38, 28, '#4f86e0');
  for (let i = 0; i < 4; i++) { px(c, 9, 17 + i * 6, 38, 1, '#6c9ae6'); px(c, 15 + i * 9, 11, 1, 28, '#6c9ae6'); }
  px(c, 22, 15, 12, 9, '#dfeaff'); px(c, 23, 16, 10, 7, '#4f86e0'); px(c, 25, 18, 2, 2, '#dfeaff'); px(c, 29, 18, 2, 2, '#dfeaff'); px(c, 24, 24, 8, 8, '#dfeaff'); px(c, 25, 25, 6, 6, '#4f86e0'); px(c, 24, 32, 3, 4, '#dfeaff'); px(c, 29, 32, 3, 4, '#dfeaff');
  px(c, 118, 8, 34, 3, PAL.woodD); px(c, 118, 8, 34, 1, PAL.woodL);
  disc(c, 124, 5, 2, '#58a84a'); px(c, 131, 3, 5, 5, '#e2483d'); disc(c, 144, 5, 3, '#f4cf3a');
  px(c, 0, 80, 160, 30, '#a7adb6');
  for (let x = 0; x < 160; x += 16) px(c, x, 80, 1, 30, '#969ca6');
  for (let y = 88; y < 110; y += 10) px(c, 0, y, 160, 1, '#969ca6');
  // meja rakit berputar
  oval(c, 80, 98, 44, 9, '#5f6c7a'); oval(c, 80, 96, 44, 9, '#7d8a98'); oval(c, 80, 95, 40, 7, '#c9d4e0'); oval(c, 80, 95, 34, 5, '#e8eef2');
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + (RB.done ? t : 0); px(c, 80 + Math.round(Math.cos(a) * 41), 96 + Math.round(Math.sin(a) * 8), 3, 1, i % 2 ? '#f4cf3a' : '#3a3f4a'); }
  PX = 2;
  try {
    drawMyRobot(c, 40, 47, RB.cfg, t, { noShadow: true, awake: RB.power > 0, act: RB.act, actT: RB.actT, dropKey: RB.drop > 0 ? RB.dropKey : null, drop: RB.drop, dir: 0 });
    // baterai masuk ke robot
    if (RB.batt > 0) {
      const p = 1 - RB.batt, bx = 70 - p * 28, by = 30;
      px(c, bx, by, 7, 4, '#3a3f4a'); px(c, bx, by, 3, 4, '#f4cf3a'); px(c, bx + 7, by + 1, 1, 2, '#c9d4e0');
    }
  } finally { PX = 1; }
  if (RB.batt > 0) {
    RB.batt -= dt * 1.3;
    if (RB.batt <= 0) { RB.batt = 0; RB.power = 0.5; RB.step++; sfx('chime'); rbRender(); say([{ k: 'pressbutton' }]); }
  }
  if (RB.flash > 0 || RB.wake > 0) for (let i = 0; i < 8; i++) { const a = t * 2 + i * 0.785; drawStar(c, Math.round(80 + Math.cos(a) * 56), Math.round(54 + Math.sin(a) * 34), i % 2 ? '#ffd84a' : '#fff2a8'); }
  // tombol besar saat langkah terakhir: boleh diketuk langsung di gambar
  if (!RB.done && RB_STEPS[RB.step].key === 'button') {
    const pr = Math.floor(t * 2.5) % 2;
    px(c, 128, 82 + pr, 22, 8, '#3a3f4a'); oval(c, 139, 82 + pr, 9, 4, '#a8352b'); oval(c, 139, 80 + pr * 2, 8, 3, '#e2483d'); oval(c, 137, 79 + pr * 2, 3, 1, '#ff9a8a');
  }
  RB.ctx.drawImage(upscale4(RB.src), 0, 0);
};
RB.cv.addEventListener('pointerdown', () => {
  if (RB.done) { rbAct(['dance', 'jump', 'spin'][Math.floor(Math.random() * 3)]); return; }
  const s = RB_STEPS[RB.step];
  if (s.key === 'battery' || s.key === 'button') rbPick(s.key);
  else say([{ k: s.ask }]);
});
$('rb-title').innerHTML = rubyHTML(word('makerobot').zh, word('makerobot').py);
$('rb-title').addEventListener('click', () => say([{ k: 'makerobot' }]));

// ================= ROBOT BUATAN RUSSEL (di bengkel) =================
const myBot = {
  voice: 'robot', x: 262, y: 124, dir: -1, moving: false, act: null, actT: 0, wait: 1.5, tx: 262, ty: 124, followT: 0, ft: 0,
  get hidden() { return !EX.robot; },
  get hit() { const h = rbHeight(EX.robot || {}); return [this.x - 11, this.y - h, 22, h + 1]; },
  get go() { return [this.x + (G.boy.x < this.x ? -18 : 18), this.y + 2]; },
  draw(c, t) { drawMyRobot(c, this.x, this.y, EX.robot, t, { dir: this.dir, moving: this.moving, act: this.act, actT: this.actT, awake: true }); },
  step(tx, ty, dt, sp) {
    const dx = tx - this.x, dy = ty - this.y, d = Math.hypot(dx, dy);
    if (d < 1) { this.moving = false; return true; }
    const s = Math.min(d, sp * dt); this.x += dx / d * s; this.y += dy / d * s; this.moving = true;
    if (Math.abs(dx) > 0.5) this.dir = dx > 0 ? 1 : -1;
    return false;
  },
  update(dt) {
    if (!EX.robot) return;
    if (this.act) {
      this.actT += dt; this.moving = false;
      if (this.act === 'dance') { const b = G.boy; if (Math.random() < dt * 2.5) fx('note', this.x + (Math.random() < 0.5 ? -12 : 12), this.y - 36, 1); if (!b.moving && !b.act && Math.hypot(b.x - this.x, b.y - this.y) < 70) doAct(b, 'hop', 0.9); }
      if (this.actT > (this.act === 'dance' ? 4 : this.act === 'hello' ? 2.4 : 1.6)) this.act = null;
      return;
    }
    if (this.followT > 0) {
      this.followT -= dt;
      const b = G.boy;
      if (Math.hypot(b.x - this.x, b.y - this.y) > 24) this.step(b.x + (this.x < b.x ? -20 : 20), b.y + 1, dt, 44); else this.moving = false;
      return;
    }
    if (this.wait > 0) { this.wait -= dt; this.moving = false; return; }
    if (this.step(this.tx, this.ty, dt, 18)) { [this.tx, this.ty] = [[262, 124], [226, 148], [282, 152], [216, 128]][Math.floor(Math.random() * 4)]; this.wait = rand(1.5, 4); }
  },
  doIt(act) { this.act = act; this.actT = 0; this.wait = 2; },
  tap() {
    this.wait = 7; this.moving = false; this.dir = G.boy.x < this.x ? -1 : 1;
    sfx('chime');
    offerPics(this.x, this.y - rbHeight(EX.robot) - 2, [
      picBtn('hello', 'take', () => { this.doIt('hello'); say([{ k: 'robot', zh: '你好！我是机器人。', by: this }, { k: 'hello', by: G.boy }]); }),
      picBtn('dance', 'eat', () => { this.doIt('dance'); rbTune(); say([{ k: 'dance', by: this }]); }),
      picBtn('jump', 'give', () => { this.doIt('jump'); sfx('bounce'); say([{ k: 'jump', zh: '跳！', by: this }]); }),
      picBtn('spin', 'throw', () => { this.doIt('spin'); sfx('whoosh'); say([{ k: 'spin', by: this }]); }),
      picBtn('followme', 'take', () => { this.followT = 40; say([{ k: 'followme', by: G.boy }, { k: 'a_ok', by: this }]); }),
    ]);
  },
};

// ================= TEMPAT: BENGKEL ROBOT =================
SCENES.workshop = (() => {
  const S = {
    id: 'workshop', place: 'workshop', outdoor: false, walk: [8, 70, 312, 174], spawn: [18, 130],
    blocks: [[122, 100, 76, 12], [14, 150, 96, 14], [252, 92, 42, 12], [280, 158, 26, 8]], objs: [], lights: [[160, 80, 110], [56, 72, 44], [260, 72, 44]],
  };
  S.bg = c => {
    // dinding panel logam, lantai ubin, garis keselamatan
    px(c, 0, 0, W, 66, '#d3dfe6');
    for (let x = 0; x < W; x += 20) { px(c, x, 0, 1, 58, '#c4d2da'); px(c, x + 1, 0, 1, 58, '#e0eaef'); }
    px(c, 0, 58, W, 8, '#7d8a98'); px(c, 0, 58, W, 1, '#a9b6c4'); px(c, 0, 65, W, 1, '#5f6c7a');
    for (let x = 0; x < W; x += 20) px(c, x + 9, 61, 2, 2, '#a9b6c4');
    drawTiles(c, 0, 66, W, 114, 16, ['#b6bbc4', '#b0b5be', '#bcc1ca'], '#a0a5ae', 61);
    wallFoot(c, 66);
    // garis kuning-hitam di sekeliling meja rakit
    const hz = (x, y, w, h) => { for (let i = 0; i < Math.max(w, h); i += 6) { const a = w > h ? [x + i, y, Math.min(3, w - i), h] : [x, y + i, w, Math.min(3, h - i)]; const b = w > h ? [x + i + 3, y, Math.min(3, Math.max(0, w - i - 3)), h] : [x, y + i + 3, w, Math.min(3, Math.max(0, h - i - 3))]; px(c, a[0], a[1], a[2], a[3], '#f4cf3a'); px(c, b[0], b[1], b[2], b[3], '#3a3f4a'); } };
    hz(110, 74, 100, 2); hz(110, 120, 100, 2); hz(110, 74, 2, 48); hz(208, 74, 2, 48);
    // tepi ruangan dan keset pintu
    px(c, 0, 0, 4, H, '#5f6c7a'); px(c, 316, 0, 4, H, '#5f6c7a'); px(c, 0, 176, W, 4, '#5f6c7a');
    px(c, 0, 114, 4, 32, '#3a4552'); px(c, 4, 118, 14, 24, '#6f7f92'); px(c, 5, 119, 12, 22, '#8497ab'); for (let y = 121; y < 140; y += 4) px(c, 6, y, 10, 1, '#6f7f92');
    bgOutlined(c, cc => {
      // semua di dinding digeser ke bawah supaya tidak tertutup tombol menu
      cc.save(); cc.translate(0, 14);
      // papan alat
      px(cc, 14, 8, 84, 34, '#8a6440'); px(cc, 15, 9, 82, 32, '#b08654');
      for (let y = 13; y < 40; y += 5) for (let x = 19; x < 96; x += 6) px(cc, x, y, 1, 1, '#8a6440');
      // palu
      px(cc, 28, 16, 3, 20, PAL.woodD); px(cc, 28, 16, 1, 20, PAL.woodL); px(cc, 23, 13, 13, 6, RB_MD); px(cc, 23, 13, 13, 2, RB_ML);
      // kunci pas
      px(cc, 53, 18, 3, 18, RB_M); px(cc, 53, 18, 1, 18, RB_ML); disc(cc, 54, 15, 4, RB_M); px(cc, 53, 11, 3, 4, '#b08654');
      // obeng
      px(cc, 79, 13, 2, 11, RB_ML); px(cc, 77, 24, 6, 12, '#e2483d'); px(cc, 77, 24, 2, 12, '#ff8a7a'); px(cc, 79, 11, 2, 2, RB_MD);
      // layar gambar rancangan robot
      px(cc, 112, 6, 92, 36, '#2f5bab'); px(cc, 114, 8, 88, 32, '#4f86e0');
      for (let i = 0; i < 5; i++) px(cc, 114, 12 + i * 6, 88, 1, '#6c9ae6');
      for (let i = 0; i < 8; i++) px(cc, 120 + i * 11, 8, 1, 32, '#6c9ae6');
      px(cc, 150, 11, 16, 11, '#dfeaff'); px(cc, 151, 12, 14, 9, '#4f86e0'); px(cc, 153, 14, 3, 3, '#dfeaff'); px(cc, 160, 14, 3, 3, '#dfeaff');
      px(cc, 157, 8, 1, 3, '#dfeaff'); px(cc, 152, 23, 12, 11, '#dfeaff'); px(cc, 153, 24, 10, 9, '#4f86e0');
      px(cc, 146, 24, 5, 2, '#dfeaff'); px(cc, 165, 24, 5, 2, '#dfeaff'); px(cc, 153, 35, 3, 4, '#dfeaff'); px(cc, 160, 35, 3, 4, '#dfeaff');
      [[124, 16, 14], [124, 24, 10], [176, 16, 14], [176, 24, 18], [176, 32, 8]].forEach(([a, b, w]) => px(cc, a, b, w, 1, '#dfeaff'));
      // rak suku cadang
      for (const y of [18, 32, 44]) { px(cc, 216, y, 88, 3, PAL.woodD); px(cc, 216, y, 88, 1, PAL.woodL); }
      px(cc, 216, 6, 3, 41, PAL.woodD); px(cc, 301, 6, 3, 41, PAL.woodD);
      rbHead(cc, 232, 18, 'rhbox', RB_TONE.blue, 0, false, 0); rbHead(cc, 258, 18, 'rhround', RB_TONE.yellow, 0, false, 0); rbHead(cc, 284, 18, 'rhears', RB_TONE.pink, 0, false, 0);
      rbLeg(cc, 230, 32, 'rwheel', 0, false); rbLeg(cc, 258, 32, 'rleg', 0, false); rbLeg(cc, 284, 32, 'rtrack', 0, false);
      [[228, 'raclaw'], [258, 'raball'], [288, 'rabig']].forEach(([x, k]) => { px(cc, x - 5, 38, 10, 6, '#c08a52'); px(cc, x - 5, 38, 10, 1, '#d9a56a'); px(cc, x - 1, 35, 2, 3, RB_M); });
      cc.restore();
    });
  };

  // meja rakit: selama belum ada robot, kerangka robot abu-abu menunggu di atas meja
  S.objs.push({ x: 160, y: 112, hit: [116, 54, 88, 60], go: [160, 118], skin: 'fn:workbench',
    draw(c, t) {
      shadow(c, 160, 113, 40);
      px(c, 125, 98, 4, 15, '#5f6c7a'); px(c, 191, 98, 4, 15, '#5f6c7a'); px(c, 125, 98, 1, 15, RB_M); px(c, 191, 98, 1, 15, RB_M); px(c, 129, 106, 62, 2, '#5f6c7a');
      px(c, 120, 90, 80, 8, '#7d8a98'); px(c, 120, 90, 80, 2, '#c9d4e0'); px(c, 120, 97, 80, 1, '#5f6c7a');
      for (let i = 0; i < 13; i++) px(c, 122 + i * 6, 95, 3, 1, i % 2 ? '#f4cf3a' : '#3a3f4a');
      px(c, 124, 84, 11, 6, '#c9473a'); px(c, 124, 84, 11, 1, '#e8735a'); px(c, 127, 83, 5, 1, RB_K);
      px(c, 184, 87, 3, 3, RB_MD); px(c, 189, 88, 3, 2, RB_ML); px(c, 194, 87, 2, 3, '#f4cf3a');
      if (!EX.robot) drawMyRobot(c, 160, 90, { leg: 'rleg', body: 'rbbox', arm: 'raclaw', head: 'rhbox' }, t, { noShadow: true, awake: false });
      else { px(c, 148, 84, 24, 6, '#dfeaff'); px(c, 149, 85, 22, 4, '#4f86e0'); px(c, 152, 86, 6, 1, '#dfeaff'); px(c, 161, 87, 7, 1, '#dfeaff'); }
      if (Math.floor(t * 2) % 2) { drawStar(c, 160, EX.robot ? 76 : 44, '#ffd84a'); }
    },
    tap() { say([{ k: 'makerobot' }]); },
    arrive() { G.boy.dir = 'up'; openPanel('robot'); rbOpen(); } });

  // layar, papan alat, rak: ketuk untuk mendengar namanya
  S.objs.push({ flat: true, y: 0, hit: [112, 20, 92, 36], go: [160, 72], draw() {}, tap() { say([{ k: 'robot' }]); } });
  [['hammer', 20, 24, 18], ['wrench', 46, 24, 18], ['screwdriver', 70, 24, 18]].forEach(([k, x, y, w]) => S.objs.push({ flat: true, y: 0, hit: [x, y, w, 30], go: [x + 9, 72], draw() {},
    tap() { say([{ k }]); }, arrive() { G.boy.dir = 'up'; doAct(G.boy, 'wave', 0.8); sfx('tap'); } }));
  const shelfWords = ['head', 'foot', 'hand', 'rwheel'];
  S.objs.push({ flat: true, y: 0, i: 0, hit: [216, 20, 88, 40], go: [232, 72], draw() {}, tap() { say([{ k: shelfWords[this.i++ % shelfWords.length] }]); } });

  // ban berjalan: suku cadang lewat terus
  S.objs.push({ flat: true, y: 0, i: 0, hit: [14, 138, 96, 28], go: [60, 170], skin: 'bg',
    draw(c, t) {
      shadowRect(c, 14, 165, 97, 3);
      px(c, 13, 149, 98, 16, '#3a2616'); px(c, 14, 150, 96, 14, '#5f6c7a'); px(c, 14, 150, 96, 1, RB_M);
      px(c, 14, 152, 96, 9, RB_K);
      const off = Math.floor(t * 18) % 8;
      for (let x = 14 + off - 8; x < 110; x += 8) if (x >= 14) px(c, x, 152, 2, 9, '#54596a');
      for (const rx of [18, 42, 62, 86, 106]) { disc(c, rx, 163, 1, RB_ML); }
      px(c, 14, 161, 96, 1, RB_MD);
      const pos = i => 14 + (t * 14 + i * 32) % 92;
      disc(c, pos(0), 155, 3, RB_K); disc(c, pos(0), 155, 1, '#ffd84a');
      px(c, pos(1) - 3, 151, 7, 6, RB_TONE.blue[0]); px(c, pos(1) - 2, 152, 5, 3, RB_SCREEN); px(c, pos(1) - 1, 153, 1, 1, RB_EYE); px(c, pos(1) + 1, 153, 1, 1, RB_EYE);
      px(c, pos(2) - 1, 150, 2, 7, RB_M); px(c, pos(2) - 3, 150, 6, 2, RB_MD);
    },
    tap() { say([{ k: ['screw', 'rwheel', 'head'][this.i++ % 3] }]); } });

  // stasiun isi daya: baterai berkedip
  S.objs.push({ x: 273, y: 104, hit: [250, 76, 46, 30], go: [273, 112], skin: 'obj-mesin-pembuat',
    draw(c, t) {
      shadow(c, 273, 104, 22);
      px(c, 252, 92, 42, 12, '#5f6c7a'); px(c, 252, 92, 42, 2, RB_M); px(c, 256, 95, 34, 7, RB_K);
      for (let i = 0; i < 4; i++) { const on = (Math.floor(t * 3) % 5) > i; px(c, 258 + i * 8, 96, 6, 5, on ? '#7cf0c4' : '#46505e'); }
      px(c, 254, 78, 12, 14, '#7d8a98'); px(c, 254, 78, 12, 2, '#c9d4e0'); px(c, 258, 75, 4, 3, RB_K);
      px(c, 257, 81, 5, 2, '#ffd84a'); px(c, 258, 83, 3, 2, '#ffd84a'); px(c, 259, 85, 2, 4, '#ffd84a');
    },
    tap() { say([{ k: 'battery' }]); sfx('chime'); } });

  // kotak perkakas
  S.objs.push({ x: 293, y: 166, hit: [278, 148, 30, 20], go: [270, 170], skin: 'obj-kotak-perkakas',
    draw(c) {
      shadow(c, 293, 166, 14);
      px(c, 281, 154, 24, 12, '#e2483d'); px(c, 281, 154, 24, 2, '#ff8a7a'); px(c, 281, 160, 24, 1, '#a8352b'); px(c, 300, 156, 5, 10, '#a8352b');
      px(c, 288, 150, 10, 2, RB_K); px(c, 288, 150, 2, 5, RB_K); px(c, 296, 150, 2, 5, RB_K); px(c, 291, 159, 4, 3, '#f4cf3a');
    },
    tap() { say([{ k: 'screw' }]); sfx('tap'); } });

  // robot penyapu kecil
  S.objs.push({ x: 150, y: 140, dir: 1, t0: 0, top: false, skin: 'fn:mouseBot',
    get hit() { return [this.x - 8, this.y - 9, 16, 10]; }, get go() { return [this.x + (G.boy.x < this.x ? -14 : 14), this.y + 1]; },
    draw(c, t) {
      const x = Math.round(this.x), y = Math.round(this.y);
      shadow(c, x, y, 7);
      px(c, x - 6, y - 5, 12, 4, '#e8eef2'); px(c, x - 5, y - 6, 10, 1, '#ffffff'); px(c, x - 6, y - 2, 12, 2, RB_MD);
      px(c, x - 3, y - 5, 6, 2, RB_SCREEN); px(c, x - 2, y - 5, 1, 1, RB_EYE); px(c, x + 1, y - 5, 1, 1, RB_EYE);
      px(c, x + this.dir * 7, y - 1, 1, 1, Math.floor(t * 8) % 2 ? RB_ML : RB_MD); px(c, x - 1, y - 8, 2, 2, Math.floor(t * 3) % 2 ? '#e2483d' : '#ff9a8a');
    },
    update(dt) {
      this.t0 += dt * 0.35;
      const nx = 190 + Math.sin(this.t0) * 66;
      this.dir = nx > this.x ? 1 : -1; this.x = nx; this.y = 142 + Math.sin(this.t0 * 2.3) * 8;
    },
    tap() { sfx('chime'); say([{ k: 'robot' }]); fx('note', this.x, this.y - 12, 1); } });

  const engineer = npc('engineer', 96, 112, 'right', {
    lines: [
      [{ k: 'hello', by: 'me' }, { k: 'engineer', by: 'np' }, { k: 'q_robot', by: 'np' }, { k: 'a_yes', by: 'me' }],
      [{ k: 'q_howru', by: 'np' }, { k: 'a_howru', by: 'me' }],
      [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }],
    ],
  });
  S.objs.push(engineer, myBot);

  S.exits = [{ hit: [0, 112, 24, 36], arrow: [12, 130, 'left'], go: [6, 130], to: 'office', at: [296, 108] }];
  return S;
})();

// ================= GAMBAR STIKER =================
const stBot = (c, x, y, on) => drawMyRobot(c, x, y, { leg: 'rwheel', body: 'rbbox', arm: 'rabig', head: 'rhbox', color: 'blue' }, 0, { awake: on });
const stArm = (k, col) => (c, x, y) => rbArms(c, x, y - 12, 6, k, RB_TONE[col], 'down', 0);
const stBody = k => (c, x, y) => rbBody(c, x, y - 1, k, RB_TONE.blue, 0, true);
const stHead = (k, col) => (c, x, y) => rbHead(c, x, y - 1, k, RB_TONE[col], 0, true, 0);
const stLegs = k => (c, x, y) => rbLeg(c, x, y, k, 0, false);
const stBattery = (c, x, y) => { px(c, x - 8, y - 9, 15, 9, RB_K); px(c, x - 8, y - 9, 6, 9, '#f4cf3a'); px(c, x - 8, y - 9, 15, 1, '#70768a'); px(c, x - 8, y - 9, 6, 1, '#fff2a8'); px(c, x + 7, y - 7, 2, 5, RB_ML); };
const stButton = (c, x, y) => { px(c, x - 9, y - 5, 18, 5, RB_K); oval(c, x, y - 6, 7, 3, '#a8352b'); oval(c, x, y - 7, 6, 2, '#e2483d'); oval(c, x - 2, y - 8, 2, 1, '#ff9a8a'); };
const stHammer = (c, x, y) => { px(c, x - 1, y - 14, 3, 14, PAL.woodD); px(c, x - 1, y - 14, 1, 14, PAL.woodL); px(c, x - 6, y - 19, 13, 6, RB_MD); px(c, x - 6, y - 19, 13, 2, RB_ML); };
const stWrench = (c, x, y) => { px(c, x - 1, y - 13, 3, 13, RB_M); px(c, x - 1, y - 13, 1, 13, RB_ML); disc(c, x, y - 16, 4, RB_M); px(c, x - 1, y - 21, 3, 5, '#ffffff'); };
const stDriver = (c, x, y) => { px(c, x - 1, y - 20, 2, 11, RB_ML); px(c, x - 3, y - 10, 6, 10, '#e2483d'); px(c, x - 3, y - 10, 2, 10, '#ff8a7a'); };
const stScrew = (c, x, y) => { px(c, x - 4, y - 12, 9, 3, RB_MD); px(c, x - 4, y - 12, 9, 1, RB_ML); for (let i = 0; i < 4; i++) { px(c, x - 2, y - 9 + i * 2, 5, 1, RB_M); px(c, x - 1, y - 8 + i * 2, 3, 1, RB_MD); } px(c, x, y - 1, 1, 1, RB_MD); };
Object.assign(ST_ART, {
  workshop: (c, x, y) => { stBot(c, x - 5, y, true); stWrench(c, x + 13, y); },
  makerobot: (c, x, y) => { stBot(c, x - 5, y, false); stHammer(c, x + 14, y); },
  myrobot: (c, x, y) => { stBot(c, x, y, true); drawHeart(c, x + 13, y - 28); },
  engineer: (c, x, y) => drawPerson(c, x, y, { look: 'engineer', dir: 'down', mood: 'happy', noShadow: true }),
  q_robot: (c, x, y) => { stBot(c, x - 4, y, false); px(c, x + 11, y - 26, 6, 2, '#4f86e0'); px(c, x + 15, y - 25, 2, 5, '#4f86e0'); px(c, x + 12, y - 21, 4, 2, '#4f86e0'); px(c, x + 12, y - 17, 3, 2, '#4f86e0'); },
  rbody: stBody('rbbox'), rwheel: stLegs('rwheel'), rleg: stLegs('rleg'), rtrack: stLegs('rtrack'),
  rbbox: stBody('rbbox'), rbround: stBody('rbround'), rbtall: stBody('rbtall'),
  raclaw: stArm('raclaw', 'blue'), raball: stArm('raball', 'red'), rabig: stArm('rabig', 'orange'),
  rhbox: stHead('rhbox', 'blue'), rhround: stHead('rhround', 'yellow'), rhears: stHead('rhears', 'pink'),
  pickcolor: (c, x, y) => { oval(c, x, y - 7, 12, 7, '#d9b98a'); [[-7, -8, '#e2483d'], [-2, -11, '#f4cf3a'], [4, -10, '#4f86e0'], [7, -6, '#58a84a'], [-3, -5, '#f39ac0']].forEach(([a, b, k]) => disc(c, x + a, y + b, 2, k)); },
  battery: stBattery,
  putbattery: (c, x, y) => { stBody('rbbox')(c, x - 7, y); stBattery(c, x + 9, y - 2); },
  button: stButton,
  pressbutton: (c, x, y) => { stButton(c, x, y); px(c, x - 1, y - 20, 3, 8, '#ffd9b5'); px(c, x - 2, y - 14, 5, 3, '#ffd9b5'); },
  robotwakes: (c, x, y) => { stBot(c, x, y, true); drawStar(c, x - 14, y - 26, '#ffd84a'); drawStar(c, x + 15, y - 20, '#ffd84a'); },
  makenew: (c, x, y) => { stBot(c, x - 8, y, false); px(c, x + 11, y - 12, 8, 2, '#58a84a'); px(c, x + 14, y - 15, 2, 8, '#58a84a'); },
  spin: (c, x, y) => { stBot(c, x, y, true); for (let k = 0; k < 10; k++) { const a = k * 0.5; px(c, x + Math.round(Math.cos(a) * 14), y - 4 + Math.round(Math.sin(a) * 3), 2, 1, '#4f86e0'); } },
  hammer: stHammer, wrench: stWrench, screwdriver: stDriver, screw: stScrew,
});
