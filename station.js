// Stasiun kereta: beli tiket di mesin, tunggu di peron, naik kereta, lalu melihat pemandangan dari jendela sampai tujuan.

LOOKS.stationmaster = { skin: '#efbf94', hair: '#2a1d18', style: 'cap', cap: '#2f4a7a', capD: '#1f3258', shirt: '#3f5f9a', shirtD: '#2f4a7a', tie: '#e2483d', pants: '#2a3450', shoes: '#1f1a16' };

const TRAIN_DEST = { mountain: [300, 140], beach: [20, 140], school: [16, 150], office: [20, 140], sushibar: [18, 152], carnival: [160, 80], zoo: [160, 128] };
G.ticket = null;

// ================= GAMBAR KECIL =================
function drawTicket(c, x, y, dest) {
  px(c, x - 19, y, 38, 20, '#3a2616'); px(c, x - 18, y + 1, 36, 18, '#fff6d8'); px(c, x - 18, y + 1, 36, 4, '#e2483d');
  for (let i = 0; i < 4; i++) px(c, x + 6, y + 6 + i * 3, 1, 2, '#c9a873');
  px(c, x - 16, y + 7, 3, 1, '#a8743c'); px(c, x - 16, y + 10, 5, 1, '#a8743c'); px(c, x - 16, y + 13, 4, 1, '#a8743c');
  if (dest) stationIcon(c, x + 12, y + 17, dest);
}
// ikon kecil tujuan (untuk tiket dan papan keberangkatan)
function stationIcon(c, x, y, dest) {
  if (dest === 'mountain') { for (let k = 0; k < 8; k++) px(c, x - k, y - 9 + k, k * 2 + 1, 1, k < 3 ? '#ffffff' : '#8a8fb0'); }
  else if (dest === 'beach') { px(c, x - 6, y - 8, 12, 5, '#8fd0f2'); disc(c, x + 3, y - 7, 1, '#ffd84a'); px(c, x - 6, y - 3, 12, 2, '#3f9fd6'); px(c, x - 6, y - 1, 12, 1, '#f2dca0'); }
  else if (dest === 'school') { px(c, x - 6, y - 5, 12, 5, '#fbefd0'); px(c, x - 7, y - 8, 14, 3, '#3f9a9a'); px(c, x - 1, y - 3, 2, 3, PAL.wood); px(c, x + 6, y - 11, 1, 6, '#a9a6a0'); px(c, x + 7, y - 11, 3, 2, '#e2483d'); }
  else if (dest === 'sushibar') { px(c, x - 5, y - 4, 10, 4, '#fbfaf2'); px(c, x - 6, y - 7, 12, 3, '#f59a6a'); px(c, x - 3, y - 7, 1, 3, '#ffc9a8'); px(c, x + 2, y - 7, 1, 3, '#ffc9a8'); }
  else if (dest === 'carnival') { px(c, x, y - 9, 1, 9, '#7d8a98'); for (let k = 0; k < 8; k++) { const a = k * 0.785; px(c, x + Math.round(Math.cos(a) * 5), y - 6 + Math.round(Math.sin(a) * 5), 2, 2, ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a'][k % 4]); } }
  else if (dest === 'zoo') { for (let k = 0; k < 7; k++) px(c, x - 3 + Math.round(k * 0.4), y - 4 - k, 3, 1, '#f4cf3a'); px(c, x - 1, y - 13, 6, 3, '#f4cf3a'); px(c, x + 2, y - 12, 1, 1, '#2a1d18'); px(c, x - 1, y - 15, 1, 2, '#a8642a'); px(c, x - 6, y - 4, 8, 4, '#f4cf3a'); disc(c, x - 3, y - 2, 1, '#a8642a'); }
  else { px(c, x - 4, y - 10, 8, 10, '#a9b6c4'); for (let k = 0; k < 3; k++) { px(c, x - 3, y - 9 + k * 3, 2, 2, '#e8f6fc'); px(c, x + 1, y - 9 + k * 3, 2, 2, '#e8f6fc'); } }
}

// ================= MESIN TIKET (jendela) =================
const TK = { step: 'dest', dest: null, t: 0, cv: $('tk-cv'), src: document.createElement('canvas') };
TK.src.width = 160; TK.src.height = 110;
TK.sctx = TK.src.getContext('2d', { willReadFrequently: true });
TK.ctx = TK.cv.getContext('2d');
PANELS.ticket = $('p-ticket');
PANELS.ticket.addEventListener('pointerdown', e => { if (e.target === PANELS.ticket) closePanel(); });
function tkOption(k, onClick, big) {
  const w = word(k), b = document.createElement('button');
  b.type = 'button'; b.className = 'tile proc-btn' + (big ? ' big' : ''); b.setAttribute('aria-label', w.id);
  b.innerHTML = `<img src="${stickerCanvas(k)}" alt=""><span class="tile-zh${LANG === 'ja' && [...w.zh].length > 4 ? ' long' : ''}">${rubyHTML(w.zh, w.py)}</span>`;
  b.addEventListener('click', onClick);
  return b;
}
function tkRender() {
  const box = $('tk-opts'); box.innerHTML = ''; box.className = 'proc';
  if (TK.step === 'dest') {
    box.classList.add('tk-grid');
    Object.keys(TRAIN_DEST).forEach(k => box.appendChild(tkOption(k, () => tkPick(k))));
  } else if (TK.step === 'coin') box.appendChild(tkOption('coin', tkPay, true));
  else box.appendChild(tkOption('ticket', tkTake, true));
}
function tkPick(k) { TK.dest = k; TK.step = 'coin'; TK.t = 0; sfx('pop'); tkRender(); say([{ k }, { k: 'coin' }]); }
function tkPay() {
  if (TK.step !== 'coin') return;
  const had = EX.coins > 0;
  if (had) { EX.coins--; exSave(); }
  TK.step = 'take'; TK.t = 0; sfx('chime'); tkRender();
  say(had ? [{ k: 'ticket' }] : [{ k: 'giveyou', by: stationMaster }, { k: 'ticket' }]);
}
function tkTake() {
  if (TK.step !== 'take') return;
  G.ticket = TK.dest; sfx('sparkle'); closePanel();
  doAct(G.boy, 'hop', 0.9);
  say([{ k: 'ticket' }, { k: G.ticket }, { k: 'waittrain' }]);
}
function tkOpen() { TK.step = 'dest'; TK.dest = null; TK.t = 0; tkRender(); say([{ k: 'buyticket' }, { k: 'q_where', by: stationMaster }]); }
PANEL_HOOK.ticket = dt => {
  const c = TK.sctx, t = G.t; TK.t += dt;
  px(c, 0, 0, 160, 84, '#efe8d8');
  for (let y = 0; y < 84; y += 14) { px(c, 0, y, 160, 1, '#ded5c0'); for (let x = (y / 14 % 2) * 10; x < 160; x += 20) px(c, x, y, 1, 14, '#ded5c0'); }
  px(c, 0, 82, 160, 2, 'rgba(50,40,30,0.2)');
  px(c, 0, 84, 160, 26, '#c9c6c0'); for (let x = 0; x < 160; x += 20) px(c, x, 84, 1, 26, '#b4b1aa'); px(c, 0, 96, 160, 1, '#b4b1aa');
  oval(c, 80, 101, 46, 5, 'rgba(50,40,30,0.25)');
  // badan mesin
  px(c, 37, 3, 86, 98, '#1f3f7f'); px(c, 38, 4, 84, 96, '#4f86e0'); px(c, 38, 4, 84, 2, '#8fb4ee'); px(c, 114, 6, 8, 94, '#3a6cc0'); px(c, 38, 98, 84, 2, '#2f5bab');
  // layar tujuan
  px(c, 46, 11, 60, 36, '#1f2a3a'); px(c, 48, 13, 56, 32, TK.dest ? '#e8f6fc' : '#cfe8f5');
  if (TK.dest) { const keep = SHADOW_TO; SHADOW_TO = _trash; try { ST_ART[TK.dest](c, 76, 43); } finally { SHADOW_TO = keep; } }
  else {
    const q = Math.floor(t * 2) % 2 ? '#4f86e0' : '#2f5bab';
    px(c, 70, 19, 12, 3, q); px(c, 80, 21, 3, 7, q); px(c, 74, 27, 7, 3, q); px(c, 74, 30, 3, 4, q); px(c, 74, 37, 3, 3, q);
  }
  // lubang koin
  px(c, 86, 52, 22, 13, '#2f5bab'); px(c, 87, 53, 20, 11, '#d9dfe8'); px(c, 96, 55, 2, 7, '#1f2a3a');
  if (TK.step === 'coin' && Math.floor(t * 2.5) % 2) disc(c, 75, 58, 6, '#fff2a8');
  if (TK.step === 'coin') { disc(c, 75, 58, 5, '#c99a1c'); disc(c, 75, 58, 4, '#f4cf3a'); px(c, 73, 55, 1, 5, '#fff2a8'); }
  if (TK.step === 'take' && TK.t < 0.5) { const p = TK.t / 0.5; disc(c, 75 + p * 22, 58, 4, '#f4cf3a'); }
  // tempat tiket keluar
  px(c, 46, 72, 68, 22, '#1f2a3a'); px(c, 48, 74, 64, 18, '#2a3448'); px(c, 52, 76, 56, 2, '#0f1520');
  if (TK.step === 'take') {
    const p = Math.min(1, Math.max(0, (TK.t - 0.4) / 0.7));
    drawTicket(c, 80, Math.round(56 + p * 19), TK.dest);
    px(c, 46, 72, 68, 3, '#1f2a3a');
    if (p >= 1 && Math.floor(t * 3) % 2) { drawStar(c, 110, 72, '#ffd84a'); drawStar(c, 52, 80, '#ffd84a'); }
  }
  TK.ctx.drawImage(upscale4(TK.src), 0, 0);
};
TK.cv.addEventListener('pointerdown', () => {
  if (TK.step === 'coin') tkPay();
  else if (TK.step === 'take' && TK.t > 1.1) tkTake();
  else if (TK.step === 'dest') say([{ k: 'q_where' }]);
});
$('tk-title').innerHTML = rubyHTML(word('buyticket').zh, word('buyticket').py);
$('tk-title').addEventListener('click', () => say([{ k: 'buyticket' }]));

// ================= TEMPAT: STASIUN =================
let stationMaster = null;
SCENES.station = (() => {
  const S = {
    id: 'station', place: 'station', outdoor: true, walk: [8, 106, 312, 174], spawn: [160, 160],
    blocks: [[26, 124, 36, 8], [216, 128, 56, 6], [282, 132, 28, 8]], objs: [], lights: [[60, 70, 50], [160, 70, 60], [260, 70, 50]],
  };
  S.bg = c => {
    const N = G.night;
    for (let y = 0; y < 72; y++) { const k = y / 72; px(c, 0, y, W, 1, N ? `rgb(${30 + k * 20},${38 + k * 24},${80 + k * 30})` : `rgb(${150 + k * 60},${212 + k * 26},${245})`); }
    // bukit dan pagar di seberang rel
    for (let x = 0; x < W; x += 2) { const h = 12 + Math.sin(x / 34) * 6 + Math.sin(x / 13) * 2; px(c, x, 68 - h, 2, h + 4, N ? '#34583e' : '#7cb878'); }
    px(c, 0, 66, W, 14, N ? '#3f6a48' : '#6dbb4f');
    groundPatches(c, 0, 66, W, 14, 71, N ? '#396240' : '#62b047', 0.55);
    for (let x = 4; x < W; x += 14) { px(c, x, 66, 2, 10, PAL.woodD); px(c, x, 66, 1, 10, PAL.wood); } px(c, 0, 69, W, 1, PAL.wood); px(c, 0, 73, W, 1, PAL.wood);
    // rel: kerikil, bantalan, batang rel
    const r = rng(73);
    px(c, 0, 78, W, 16, '#a89878');
    for (let i = 0; i < 240; i++) px(c, Math.floor(r() * W), 78 + Math.floor(r() * 16), 2, 1, r() < 0.5 ? '#988868' : '#bdad8e');
    for (let x = 0; x < W; x += 7) { px(c, x, 84, 5, 9, PAL.woodD); px(c, x, 84, 4, 1, PAL.wood); }
    px(c, 0, 86, W, 1, '#d6d9de'); px(c, 0, 87, W, 1, '#7c8088'); px(c, 0, 91, W, 1, '#d6d9de'); px(c, 0, 92, W, 1, '#7c8088');
    // peron: tepi, garis kuning, ubin
    px(c, 0, 94, W, 86, '#c9c6c0');
    drawTiles(c, 0, 104, W, 76, 20, ['#cfccc6', '#c9c6c0', '#d5d2cc'], '#b4b1aa', 74);
    px(c, 0, 94, W, 4, '#e8e5df'); px(c, 0, 94, W, 1, '#ffffff'); px(c, 0, 98, W, 1, '#a9a6a0');
    px(c, 0, 99, W, 5, '#f4cf3a'); px(c, 0, 99, W, 1, '#fff2a8'); px(c, 0, 103, W, 1, '#c9a21f');
    for (let x = 2; x < W; x += 5) { px(c, x, 100, 2, 1, '#d9b02a'); px(c, x + 2, 102, 2, 1, '#d9b02a'); }
    px(c, 0, 176, 144, 4, '#8a8780'); px(c, 176, 176, 144, 4, '#8a8780'); px(c, 146, 168, 28, 10, '#a8352b'); px(c, 147, 169, 26, 8, '#c9473a'); px(c, 149, 171, 22, 4, '#e2685a');
  };

  // atap peron dan tiang (berdiri di depan kereta)
  S.objs.push({ y: 101, hit: [132, 28, 56, 16], go: [160, 108], skin: 'fn:stationRoof',
    draw(c, t) {
      for (const x of [34, 284]) { shadow(c, x + 2, 104, 5); px(c, x, 16, 5, 88, '#7d8a98'); px(c, x, 16, 2, 88, '#a9b6c4'); px(c, x + 4, 16, 1, 88, '#5f6c7a'); px(c, x - 2, 100, 9, 4, '#5f6c7a'); }
      px(c, 0, 8, W, 8, '#3f6fb5'); px(c, 0, 8, W, 2, '#6c9ae6'); px(c, 0, 15, W, 1, '#2f4a7a');
      for (let x = 6; x < W; x += 20) px(c, x, 10, 1, 5, '#2f5bab');
      // papan keberangkatan
      px(c, 146, 16, 2, 13, RB_K); px(c, 172, 16, 2, 13, RB_K);
      px(c, 132, 28, 56, 16, '#1f2a3a'); px(c, 133, 29, 54, 14, '#2a3448');
      if (G.ticket) {
        stationIcon(c, 146, 42, G.ticket);
        for (let i = 0; i < 3; i++) px(c, 160 + i * 6, 34, 4, 4, Math.floor(t * 3) % 3 === i ? '#ffd84a' : '#5a6470');
      } else {
        for (let i = 0; i < 4; i++) px(c, 137 + i * 12, 33, 8, 2, Math.floor(t * 1.5) % 4 === i ? '#7cf0c4' : '#46505e');
        px(c, 137, 38, 46, 1, '#46505e');
      }
    },
    tap() { say([{ k: G.ticket || 'station' }]); } });
  // jam di tiang
  S.objs.push({ flat: false, y: 102, hit: [24, 22, 24, 24], go: [50, 108], skin: 'obj-jam', draw(c, t) { drawClock(c, 36, 34, t); }, tap() { say([{ k: 'clock' }]); sfx('chime'); } });

  // mesin tiket
  S.objs.push({ x: 44, y: 132, hit: [24, 96, 40, 38], go: [72, 134], skin: 'fn:ticketMachine',
    draw(c, t) {
      shadow(c, 44, 132, 19);
      px(c, 28, 100, 32, 32, '#4f86e0'); px(c, 28, 100, 32, 2, '#8fb4ee'); px(c, 54, 102, 6, 30, '#3a6cc0'); px(c, 28, 130, 32, 2, '#2f5bab');
      px(c, 31, 104, 20, 12, '#1f2a3a'); px(c, 32, 105, 18, 10, Math.floor(t * 2) % 2 ? '#cfe8f5' : '#e8f6fc');
      px(c, 37, 107, 8, 1, '#4f86e0'); px(c, 37, 110, 5, 1, '#4f86e0');
      px(c, 52, 106, 4, 6, '#d9dfe8'); px(c, 53, 107, 2, 4, '#1f2a3a');
      px(c, 33, 120, 22, 7, '#1f2a3a'); px(c, 34, 121, 20, 5, '#2a3448');
      px(c, 37, 92, 14, 8, '#e2483d'); px(c, 37, 92, 14, 1, '#ff8a7a'); px(c, 41, 94, 6, 4, '#fff6d8');
      if (!G.ticket && Math.floor(t * 2) % 2) drawStar(c, 66, 100, '#ffd84a');
    },
    tap() { say([{ k: 'ticketmachine' }]); },
    arrive() {
      G.boy.dir = 'left';
      if (G.ticket) { say([{ k: 'ticket' }, { k: G.ticket }, { k: 'waittrain' }]); return; }
      openPanel('ticket'); tkOpen();
    } });

  // bangku: duduk menunggu kereta
  S.objs.push({ x: 244, y: 134, hit: [214, 112, 60, 24], go: [244, 138], skin: 'obj-bangku',
    draw(c) {
      shadow(c, 244, 134, 28);
      px(c, 218, 116, 52, 8, '#c9473a'); px(c, 218, 116, 52, 1, '#e8735a'); px(c, 218, 123, 52, 1, '#a8352b');
      px(c, 216, 125, 56, 4, '#e2483d'); px(c, 216, 125, 56, 1, '#ff8a7a'); px(c, 216, 128, 56, 1, '#a8352b');
      for (const x of [220, 264]) { px(c, x, 129, 3, 5, RB_K); px(c, x, 124, 3, 1, RB_K); }
    },
    tap() { say([{ k: 'chair' }, { k: 'waittrain' }]); },
    arrive() {
      const b = G.boy; if (b.ride) return;
      b.dir = 'down';
      b.ride = () => { b.x = 244; b.y = 128; b.frame = 0; };
      b.rideEnd = () => { b.x = 244; b.y = 140; };
      say([{ k: 'sitdown' }, { k: 'waittrain' }]);
    } });

  // mesin minuman: susu masuk tas
  S.objs.push({ x: 296, y: 140, gone: 0, hit: [280, 100, 32, 42], go: [270, 142], skin: 'obj-mesin-minuman',
    draw(c, t) {
      shadow(c, 296, 140, 15);
      px(c, 282, 106, 28, 34, '#d9483b'); px(c, 282, 106, 28, 2, '#ef7a6a'); px(c, 306, 108, 4, 32, '#a8352b');
      px(c, 285, 110, 18, 16, '#e8f6fc');
      for (let i = 0; i < 3; i++) { px(c, 287 + i * 6, 112, 3, 5, this.gone > 0 && i === 1 ? '#cfe8f5' : '#ffffff'); px(c, 287 + i * 6, 112, 3, 1, '#4f86e0'); px(c, 287 + i * 6, 119, 3, 5, i === 1 ? '#f4c23a' : '#ffffff'); }
      px(c, 285, 130, 14, 6, '#1f2a3a'); px(c, 303, 112, 2, 4, Math.floor(t * 2) % 2 ? '#ffd84a' : '#8a8f98');
    },
    update(dt) { if (this.gone > 0) this.gone -= dt; },
    tap() { say([{ k: 'milk' }]); },
    arrive() { G.boy.dir = 'right'; if (this.gone > 0) { say([{ k: 'milk' }, { k: 'waittrain' }]); return; } if (bagAdd('milk', 292, 130, true)) { this.gone = 15; sfx('pop'); say([{ k: 'milk' }, { k: 'bag' }]); } } });

  // kepala stasiun dan penumpang
  stationMaster = npc('stationmaster', 112, 112, 'down', {
    lines: [
      [{ k: 'stationmaster', by: 'me' }, { k: 'q_where', by: 'np' }, { k: 'a_where', by: 'me' }],
      [{ k: 'yellowline', by: 'np' }, { k: 'a_ok', by: 'me' }],
      [{ k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }],
    ],
  });
  S.objs.push(stationMaster);
  S.objs.push(npc('auntie', 196, 118, 'left', { lines: [[{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_where', by: 'np' }, { k: 'a_where', by: 'me' }]] }));

  // kereta yang datang, berhenti, lalu berangkat lagi
  const DOOR_AT = { steam: -127, bullet: -107 };
  const tr = {
    x: -10, y: 92, type: 'steam', st: 'wait', timer: 7, v: 0, door: 0, greeted: false, n: 0, skin: 'fn:stationTrain',
    get hidden() { return this.st === 'wait'; },
    get doorX() { return Math.round(this.x + (DOOR_AT[this.type] || 0)); },
    get hit() { return this.st === 'wait' ? [0, 0, 0, 0] : [this.x - TRAIN_LEN[this.type], this.y - 48, TRAIN_LEN[this.type] + 4, 48]; },
    get go() { return this.st === 'stop' && G.ticket ? [this.doorX, 106] : null; },
    draw(c, t) {
      drawTrain(c, this.x, this.y, this.type, this.st === 'stop' ? 0 : t);
      if (this.type === 'freight') return;
      // pintu gerbong: membuka saat berhenti
      const dx = this.doorX, top = this.y - 39, h = 28, col = this.type === 'bullet' ? '#e8eef2' : '#3d7f33', open = Math.round(this.door * 7);
      px(c, dx - 8, top - 1, 16, h + 1, this.type === 'bullet' ? '#9aa0aa' : '#2f6a28');
      px(c, dx - 7, top, 14, h, '#3a3040'); px(c, dx - 7, top, 14, 3, '#fff2c8');
      px(c, dx - 7, top, 7 - open, h, col); px(c, dx + open, top, 7 - open, h, col);
      if (open < 3) { px(c, dx - 5, top + 4, 3, 7, '#bfe3f2'); px(c, dx + 2, top + 4, 3, 7, '#bfe3f2'); }
      if (this.st === 'stop' && G.ticket) drawArrow(c, dx, this.y + 10, 'up', t);
    },
    update(dt) {
      if (this.st === 'wait') {
        if (G.ticket && this.timer > 3) this.timer = 3;
        this.timer -= dt;
        if (this.timer <= 0) {
          this.n++;
          this.type = G.ticket ? (this.n % 2 ? 'steam' : 'bullet') : ['steam', 'freight', 'bullet'][this.n % 3];
          this.x = -10; this.st = 'in'; this.v = this.type === 'freight' ? 70 : 110; this.door = 0; sfx('horn');
        }
      } else if (this.st === 'in') {
        if (this.type === 'freight') {
          this.x += this.v * dt;
          if (this.x - TRAIN_LEN.freight > W + 10) { this.st = 'wait'; this.timer = rand(9, 15); }
        } else {
          const stopX = 160 - DOOR_AT[this.type], d = stopX - this.x;
          this.v = Math.max(16, Math.min(110, d * 1.2));
          this.x += Math.min(d, this.v * dt);
          if (this.type === 'steam' && Math.random() < dt * 6) fx('smoke', this.x - 14, this.y - 46, 1);
          if (!this.greeted && this.x > 90) {
            this.greeted = true;
            say([{ k: 'trainhere' }, { k: 'yellowline', by: stationMaster }]);
          }
          if (d < 0.5) { this.x = stopX; this.st = 'stop'; this.timer = G.ticket ? 30 : 9; sfx('door'); if (G.ticket) setTimeout(() => { if (G.scene === S) say([{ k: 'getin' }]); }, 400); }
        }
      } else if (this.st === 'stop') {
        this.door = Math.min(1, this.door + dt * 1.4);
        this.timer -= dt;
        if (this.timer <= 0) { this.st = 'out'; this.v = 0; doAct(stationMaster, 'wave', 1.2); sfx('horn'); }
      } else if (this.st === 'out') {
        this.door = Math.max(0, this.door - dt * 2);
        this.v = Math.min(120, this.v + dt * 50);
        this.x += this.v * dt;
        if (this.type === 'steam' && Math.random() < dt * 8) fx('smoke', this.x - 14, this.y - 46, 1);
        if (this.x - TRAIN_LEN[this.type] > W + 10) { this.st = 'wait'; this.greeted = false; this.timer = G.ticket ? 3 : rand(10, 16); }
      }
    },
    tap() {
      if (this.st !== 'stop') { say([{ k: { steam: 'steamtrain', bullet: 'bullettrain', freight: 'freighttrain' }[this.type] }]); sfx('horn'); return; }
      if (!G.ticket) { doAct(stationMaster, 'wave', 1.2); say([{ k: 'buyticket', by: stationMaster }]); return; }
      say([{ k: 'getin' }]);
    },
    arrive() { if (this.st === 'stop' && G.ticket) boardTrain(); },
  };
  S.objs.push(tr);
  S.enter = () => { tr.st = 'wait'; tr.greeted = false; tr.timer = G.ticket ? 3 : rand(4, 7); };

  S.exits = [{ hit: [140, 160, 40, 20], arrow: [160, 168, 'down'], go: [160, 176], to: 'village', at: [160, 66] }];
  return S;
})();

// ================= DI DALAM KERETA =================
const RD = { dest: null, s: 0, v: 0, st: 'go', stopT: 0, clack: 0, said: [], left: false, items: [], tunnel: null, bridge: null, end: 1200 };
function boardTrain() {
  const dest = G.ticket; G.ticket = null; sfx('door');
  fadeTo(() => {
    enterScene('trainride', [160, 132]);
    G.boy.dir = 'down';
    Object.assign(RD, { dest, s: 0, v: 0, st: 'go', stopT: 0, clack: 0, said: [], left: false, bridge: [520, 650], tunnel: dest === 'mountain' || dest === 'office' ? [800, 960] : null, end: 1240 });
    RD.items = [['tree', 60], ['cow', 210], ['tree', 330], ['sheep', 440], ['tree', 720], ['bird', 1000], [dest === 'beach' ? 'sea' : dest, 1110]];
  }, () => { sfx('horn'); say([{ k: 'train' }, { k: 'seat' }]); });
}
function rideLeave() {
  if (RD.left) return;
  RD.left = true; const dest = RD.dest; sfx('door');
  say([{ k: 'getoff' }]);
  fadeTo(() => { enterScene(dest, TRAIN_DEST[dest]); G.boy.dir = 'down'; }, () => { doAct(G.boy, 'wave', 1.2); say([{ k: 'arrived' }, { k: dest }]); });
}
const RX0 = 14, RX1 = 290, RY0 = 30, RY1 = 92;
function rideView(c, t) {
  const s = RD.s, N = G.night, dest = RD.dest, sx = wx => RX1 + (wx - s);
  c.save(); c.beginPath(); c.rect(RX0, RY0, RX1 - RX0, RY1 - RY0); c.clip();
  for (let y = RY0; y < 66; y++) { const k = (y - RY0) / 36; px(c, RX0, y, RX1 - RX0, 1, N ? `rgb(${30 + k * 20},${38 + k * 24},${80 + k * 30})` : `rgb(${150 + k * 60},${212 + k * 26},${245})`); }
  if (!N) for (let i = 0; i < 4; i++) { const cx = RX0 + ((i * 96 - s * 0.05) % 340 + 340) % 340 - 30; oval(c, cx, 38 + i * 3, 11, 2, '#ffffff'); oval(c, cx + 4, 36 + i * 3, 6, 2, '#ffffff'); }
  // gunung makin dekat kalau tujuannya ke gunung
  if (dest === 'mountain') for (let i = 0; i < 4; i++) {
    const px0 = RX1 + (i * 110 - (s - 300) * 0.3), h = 26 + (i % 2) * 8;
    if (px0 > RX0 - 60 && px0 < RX1 + 60) for (let k = 0; k < h; k++) { const w = Math.round(k * 1.1); px(c, px0 - w, 66 - h + k, w * 2 + 1, 1, k < 7 ? '#ffffff' : (N ? '#3e4368' : '#8f94b6')); px(c, px0, 66 - h + k, w + 1, 1, k < 7 ? '#d6deea' : (N ? '#34395e' : '#777ca0')); }
  }
  // bukit jauh
  for (let x = RX0; x < RX1; x += 2) { const h = 8 + Math.sin((x + s * 0.15) / 34) * 5 + Math.sin((x + s * 0.15) / 13) * 2; px(c, x, 66 - h, 2, h + 2, N ? '#34583e' : '#8fc49a'); }
  // gedung kalau tujuannya sekolah atau kantor
  if (dest === 'school' || dest === 'office') for (let i = 0; i < 8; i++) {
    const bx = RX1 + (620 + i * 44 - s) * 0.6, bh = 16 + (i * 7) % 16;
    if (bx > RX0 - 30 && bx < RX1 + 10) { px(c, bx, 66 - bh, 26, bh, ['#a9b6c4', '#c9d4e0', '#d9c8a8'][i % 3]); for (let wy = 66 - bh + 3; wy < 64; wy += 5) for (let wx = 3; wx < 24; wx += 6) px(c, bx + wx, wy, 3, 3, N ? '#ffd96a' : '#e8f6fc'); }
  }
  // tanah tengah dan laut
  px(c, RX0, 64, RX1 - RX0, 18, N ? '#3f6a48' : '#7cc85a');
  for (let x = RX0 - ((s * 0.5) % 24); x < RX1; x += 24) { px(c, x, 68, 3, 1, N ? '#34583e' : '#62b047'); px(c, x + 12, 74, 3, 1, N ? '#34583e' : '#93d36a'); }
  if (dest === 'beach' || dest === 'sushibar') {
    const xs = RX1 + (640 - s) * 0.6;
    if (xs < RX1) {
      px(c, xs - 4, 64, RX1 - xs + 4, 18, '#f2dca0'); px(c, xs, 62, RX1 - xs, 16, N ? '#2a4f7a' : '#3f9fd6');
      for (let i = 0; i < 12; i++) { const wx = xs + ((i * 37 - s * 0.2) % (RX1 - xs + 40) + (RX1 - xs + 40)) % (RX1 - xs + 40); px(c, wx, 64 + (i % 4) * 3, 8, 1, N ? '#3a6a9a' : '#a8dcf5'); }
    }
  }
  // tanah dekat dan tiang yang lewat cepat
  px(c, RX0, 80, RX1 - RX0, 12, N ? '#34583e' : '#6dbb4f');
  for (let x = RX0 - (s % 16); x < RX1; x += 16) { px(c, x, 84, 2, 1, N ? '#2a4a34' : '#4f9a3c'); px(c, x + 7, 88, 3, 1, N ? '#2a4a34' : '#93d36a'); }
  // sungai dan jembatan
  if (RD.bridge) {
    const xa = sx(RD.bridge[0]), xb = sx(RD.bridge[1]);
    if (xb > RX0 && xa < RX1) {
      px(c, xa, 64, xb - xa, 28, N ? '#2a4f7a' : PAL.water);
      for (let i = 0; i < 14; i++) px(c, xa + 6 + i * 9, 68 + (i % 4) * 5, 6, 1, PAL.waterL);
      px(c, xa, 76, xb - xa, 2, '#5f6c7a'); px(c, xa, 58, xb - xa, 2, '#7d8a98');
      for (let x = xa; x < xb; x += 14) { px(c, x, 58, 2, 18, '#7d8a98'); for (let k = 0; k < 14; k++) px(c, x + k, 60 + k, 1, 1, '#9aa8b8'); }
    }
  }
  // benda yang lewat
  RD.items.forEach(([k, wx]) => {
    const x = Math.round(sx(wx));
    if (x < RX0 - 24 || x > RX1 + 24) return;
    if (k === 'tree') drawTree(c, x, 86, { r: 11 });
    else if (k === 'cow') drawCow(c, x, 86, -1, t);
    else if (k === 'sheep') drawSheep(c, x, 86, -1, t);
    else if (k === 'bird') drawBird(c, x, 46, t, '#e2483d');
    else if (k === 'school') drawHouse(c, x - 24, 50, 48, 34, { roof: '#3f9a9a', roofD: '#2a7272', roofL: '#5cb8b8', wall: '#fbefd0', wallD: '#ecdcb4', door: 17, night: N });
    else if (k === 'office') { px(c, x - 14, 36, 28, 50, '#a9b6c4'); for (let wy = 40; wy < 82; wy += 6) for (let wxx = 3; wxx < 25; wxx += 7) px(c, x - 14 + wxx, wy, 4, 4, N ? '#ffd96a' : '#e8f6fc'); }
    else if (k === 'sushibar') drawHouse(c, x - 22, 54, 44, 30, { roof: '#2f4a7a', roofD: '#1f3258', roofL: '#4f6f9f', wall: '#e8d8b4', wallD: '#d4c098', door: 14, night: N });
    else if (k === 'zoo') {
      drawGiraffe(c, x + 8, 84, -1, t); drawElephant(c, x - 26, 86, 1, t, false);
      for (let fx0 = x - 46; fx0 < x + 30; fx0 += 6) px(c, fx0, 78, 2, 8, PAL.woodD); px(c, x - 46, 80, 76, 2, PAL.wood);
    }
    else if (k === 'carnival') {
      px(c, x - 1, 62, 2, 24, RB_MD);
      for (let i = 0; i < 8; i++) { const a = i * 0.785 + t * 0.5; px(c, x + Math.round(Math.cos(a) * 18) - 2, 58 + Math.round(Math.sin(a) * 18) - 2, 5, 4, ['#e2483d', '#f4cf3a', '#4f86e0', '#58a84a'][i % 4]); }
    }
  });
  for (let x = RX0 - (s % 130) + 40; x < RX1 + 10; x += 130) { px(c, x, 34, 2, 58, '#5a4a3a'); px(c, x - 5, 36, 12, 1, '#5a4a3a'); }
  // terowongan: jendela menjadi gelap, lampu lewat
  if (RD.tunnel) {
    const xa = sx(RD.tunnel[0]), xb = sx(RD.tunnel[1]);
    if (xb > RX0 && xa < RX1) {
      px(c, xa, RY0, xb - xa, RY1 - RY0, '#20242e');
      for (let wx = RD.tunnel[0] + 30; wx < RD.tunnel[1]; wx += 50) { const lx = sx(wx); px(c, lx, 44, 8, 2, '#ffd96a'); px(c, lx + 1, 46, 6, 1, 'rgba(255,217,106,0.45)'); }
      px(c, xa - 8, RY0, 8, RY1 - RY0, '#7f7c78'); px(c, xb, RY0, 8, RY1 - RY0, '#7f7c78');
      for (let y = RY0 + 3; y < RY1; y += 8) { px(c, xa - 8, y, 8, 1, '#5f5c58'); px(c, xb, y + 4, 8, 1, '#5f5c58'); }
    }
  }
  c.restore();
}
SCENES.trainride = (() => {
  const S = { id: 'trainride', place: 'train', outdoor: false, walk: [160, 132, 160, 132], spawn: [160, 132], blocks: [], objs: [], lights: [[60, 24, 50], [160, 24, 50], [260, 24, 50]] };
  S.bg = c => {
    // dinding gerbong, rak barang, kursi panjang, lantai
    px(c, 0, 0, W, 100, '#f2e8d5');
    px(c, 0, 0, W, 12, '#e3d7c0'); px(c, 0, 11, W, 1, '#c9bda6');
    px(c, 0, 96, W, 48, '#3f9a9a'); px(c, 0, 96, W, 2, '#5cb8b8');
    px(c, 0, 144, W, 36, '#7d8a98'); for (let y = 148; y < H; y += 6) px(c, 0, y, W, 1, '#6f7c8a');
    for (let x = 8; x < W; x += 20) px(c, x, 144, 1, 36, '#6f7c8a');
    px(c, 0, 144, W, 3, 'rgba(30,30,40,0.25)');
    // sandaran kursi panjang
    px(c, 8, 100, 284, 30, '#a8352b'); px(c, 10, 102, 280, 26, '#c9473a'); px(c, 10, 102, 280, 2, '#e8735a');
    for (let x = 40; x < 290; x += 42) px(c, x, 104, 1, 24, '#a8352b');
    // rak barang
    bgOutlined(c, cc => {
      px(cc, 10, 20, 280, 2, RB_MD); px(cc, 10, 20, 280, 1, RB_ML);
      for (const x of [20, 150, 280]) px(cc, x, 12, 2, 8, RB_MD);
      px(cc, 40, 12, 20, 8, '#a8743c'); px(cc, 40, 12, 20, 1, '#d39b5f'); px(cc, 48, 10, 4, 2, PAL.woodD);
      px(cc, 214, 13, 16, 7, '#4f86e0'); px(cc, 214, 13, 16, 1, '#8fb4ee');
    });
  };
  S.objs.push({ flat: true, y: 0, skin: 'fn:rideView', draw(c, t) { rideView(c, t); },
    hit: [RX0, RY0, RX1 - RX0, RY1 - RY0],
    tap() {
      // kata benda yang paling dekat di jendela
      let best = null, bd = 90;
      RD.items.forEach(([k, wx]) => { const x = RX1 + (wx - RD.s), d = Math.abs(x - 152); if (d < bd) { bd = d; best = k; } });
      if (RD.tunnel && RD.s > RD.tunnel[0] + 40 && RD.s < RD.tunnel[1] + 80) best = 'tunnel';
      else if (RD.bridge && RX1 + (RD.bridge[0] - RD.s) < 200 && RX1 + (RD.bridge[1] - RD.s) > 80) best = 'bridge';
      say([{ k: best || 'window' }]);
    } });
  // bingkai jendela di atas pemandangan
  S.objs.push({ flat: true, y: 0, skin: 'fn:rideFrame', draw(c) {
    px(c, RX0 - 2, RY0 - 2, RX1 - RX0 + 4, 2, PAL.woodD); px(c, RX0 - 2, RY1, RX1 - RX0 + 4, 3, PAL.woodD); px(c, RX0 - 2, RY1, RX1 - RX0 + 4, 1, PAL.wood);
    px(c, RX0 - 2, RY0, 2, RY1 - RY0, PAL.woodD); px(c, RX1, RY0, 2, RY1 - RY0, PAL.woodD);
    for (const x of [104, 197]) { px(c, x, RY0, 4, RY1 - RY0, PAL.woodD); px(c, x, RY0, 1, RY1 - RY0, PAL.wood); }
    for (const x of [60, 150, 240]) { px(c, x, 22, 1, 8, RB_MD); disc(c, x, 33, 3, '#f4cf3a'); disc(c, x, 33, 1, RB_MD); }
  } });
  // pintu: terbuka saat sampai
  S.objs.push({ flat: true, y: 0, hit: [294, 26, 26, 118], skin: 'fn:rideDoor',
    draw(c, t) {
      const opened = RD.st === 'stop';
      px(c, 294, 26, 22, 118, '#3a3040');
      if (opened) { px(c, 296, 30, 18, 110, '#cfe8f5'); px(c, 296, 120, 18, 20, '#c9c6c0'); }
      else { px(c, 296, 28, 18, 114, '#3f9a9a'); px(c, 296, 28, 18, 2, '#5cb8b8'); px(c, 299, 36, 12, 30, '#bfe3f2'); px(c, 300, 37, 3, 12, '#e8f6fc'); px(c, 298, 86, 2, 12, '#f4cf3a'); }
      if (opened) drawArrow(c, 304, 112, 'right', t);
    },
    tap() { if (RD.st === 'stop') rideLeave(); else say([{ k: 'train' }]); } });
  // bagian depan kursi: menutupi kaki, jadi semua terlihat duduk
  S.objs.push({ y: 133, skin: 'bg', draw(c) {
    px(c, 8, 128, 284, 16, '#a8352b'); px(c, 8, 128, 284, 3, '#e8735a'); px(c, 8, 131, 284, 1, '#c9473a');
    for (let x = 20; x < 290; x += 34) px(c, x, 136, 5, 8, '#8a2c22');
  },
  hit: [8, 126, 284, 18], tap() { say([{ k: 'seat' }]); } });
  const seatNpc = (look, x, line) => npc(look, x, 132, 'down', { lines: [line] });
  S.objs.push(seatNpc('auntie', 82, [{ k: 'auntie', zh: '阿姨好！', by: 'me' }, { k: 'q_where', by: 'np' }, { k: 'a_where', by: 'me' }]));
  S.objs.push(seatNpc('kid2', 236, [{ k: 'hello', by: 'me' }, { k: 'q_happy', by: 'np' }, { k: 'a_happy', by: 'me' }]));
  S.update = dt => {
    if (RD.st === 'go') {
      const left = RD.end - RD.s;
      RD.v = Math.max(14, Math.min(RD.v + dt * 45, 82, left * 0.9));
      RD.s += RD.v * dt;
      RD.clack -= dt;
      if (RD.clack <= 0) { RD.clack = 52 / Math.max(30, RD.v); if (Snd.ctx) Snd.tone(82, 0.05, { gain: 0.05, type: 'triangle' }); }
      // nama benda diucapkan saat lewat di tengah jendela
      const cross = (k, wx) => { if (!RD.said.includes(k + wx) && RX1 + (wx - RD.s) < 152) { RD.said.push(k + wx); if (!G.panel && k !== 'tree') say([{ k }]); } };
      RD.items.forEach(([k, wx]) => cross(k, wx));
      if (RD.bridge) cross('bridge', RD.bridge[0] - 40);
      if (RD.tunnel) cross('tunnel', RD.tunnel[0] - 40);
      if (left < 1) {
        RD.st = 'stop'; RD.stopT = 0; RD.s = RD.end; sfx('chime');
        say([{ k: 'arrived' }, { k: RD.dest }, { k: 'getoff' }]);
      }
    } else if (RD.st === 'stop') {
      RD.stopT += dt;
      if (RD.stopT > 9) rideLeave();
    }
  };
  S.exits = [];
  return S;
})();

// ================= JALAN MASUK DARI DESA =================
(function villageDoor() {
  const V = SCENES.village, baseBg = V.bg;
  V.bg = c => {
    baseBg(c);
    // gedung stasiun kecil di seberang rel, jalan penyeberangan di atas rel
    bgOutlined(c, cc => {
      drawHouse(cc, 138, 12, 44, 30, { roof: '#d9483b', roofD: '#a8352b', roofL: '#ef7a6a', door: 15, night: G.night });
      px(cc, 152, 22, 16, 5, PAL.woodD); px(cc, 153, 23, 14, 3, '#fff6d8'); px(cc, 155, 24, 7, 1, '#d9483b'); px(cc, 163, 24, 2, 1, '#4f86e0');
    });
    px(c, 148, 44, 24, 16, '#a9a6a0'); px(c, 148, 44, 24, 1, '#c9c6c0');
    for (let y = 47; y < 60; y += 4) px(c, 148, y, 24, 1, '#8f8c86');
  };
  V.exits.push({ hit: [144, 40, 32, 28], arrow: [160, 68, 'up'], go: [160, 60], to: 'station', at: [160, 160] });
})();

// ================= GAMBAR STIKER =================
Object.assign(ST_ART, {
  station: (c, x, y) => { drawHouse(c, x - 16, y - 28, 32, 26, { roof: '#d9483b', roofD: '#a8352b', roofL: '#ef7a6a', door: 9 }); px(c, x - 20, y - 2, 40, 1, '#d6d9de'); px(c, x - 20, y - 1, 40, 1, '#7c8088'); },
  ticket: (c, x, y) => drawTicket(c, x, y - 20, 'mountain'),
  buyticket: (c, x, y) => { drawTicket(c, x + 3, y - 22, null); drawItem(c, x - 14, y, 'coin'); },
  ticketmachine: (c, x, y) => { px(c, x - 9, y - 26, 18, 26, '#4f86e0'); px(c, x - 9, y - 26, 18, 2, '#8fb4ee'); px(c, x - 6, y - 22, 12, 8, '#cfe8f5'); px(c, x - 6, y - 10, 12, 6, '#1f2a3a'); px(c, x + 5, y - 13, 2, 2, '#f4cf3a'); },
  waittrain: (c, x, y) => { px(c, x - 16, y - 8, 32, 3, '#c9473a'); for (const a of [-14, 12]) px(c, x + a, y - 5, 2, 5, RB_K); drawClock(c, x, y - 18, 0); },
  trainhere: (c, x, y) => drawTrain(c, x + 22, y, 'bullet', 0),
  getin: (c, x, y) => { px(c, x - 8, y - 28, 16, 28, '#58a84a'); px(c, x - 6, y - 26, 12, 26, '#3a3040'); drawArrow(c, x, y - 12, 'up', 0); },
  getoff: (c, x, y) => { px(c, x - 8, y - 28, 16, 28, '#58a84a'); px(c, x - 6, y - 26, 12, 26, '#cfe8f5'); drawArrow(c, x, y - 12, 'down', 0); },
  arrived: (c, x, y) => { px(c, x - 8, y - 28, 2, 28, '#7d8a98'); for (let k = 0; k < 8; k++) px(c, x - 6, y - 28 + k, 16 - k * 2, 1, '#e2483d'); drawStar(c, x + 8, y - 8, '#ffd84a'); },
  stationmaster: (c, x, y) => drawPerson(c, x, y, { look: 'stationmaster', dir: 'down', mood: 'happy', noShadow: true }),
  yellowline: (c, x, y) => { px(c, x - 16, y - 7, 32, 6, '#f4cf3a'); for (let i = -14; i < 16; i += 5) px(c, x + i, y - 5, 2, 2, '#d9b02a'); drawPerson(c, x, y - 7, { look: 'me', dir: 'down', mood: 'happy', noShadow: true }); },
  tunnel: (c, x, y) => { oval(c, x, y - 12, 17, 13, '#7f7c78'); oval(c, x, y - 11, 11, 10, '#20242e'); px(c, x - 18, y - 2, 36, 3, '#7f7c78'); px(c, x - 18, y - 1, 36, 1, '#d6d9de'); },
  bridge: (c, x, y) => { px(c, x - 19, y - 12, 38, 3, '#7d8a98'); for (const a of [-16, -6, 4, 14]) px(c, x + a, y - 20, 2, 10, '#9aa8b8'); px(c, x - 19, y - 21, 38, 2, '#7d8a98'); px(c, x - 19, y - 8, 38, 6, PAL.water); px(c, x - 14, y - 5, 8, 1, PAL.waterL); },
  seat: (c, x, y) => { px(c, x - 9, y - 22, 18, 12, '#c9473a'); px(c, x - 9, y - 22, 18, 2, '#e8735a'); px(c, x - 10, y - 10, 20, 6, '#a8352b'); px(c, x - 10, y - 10, 20, 2, '#e8735a'); px(c, x - 7, y - 4, 3, 4, RB_K); px(c, x + 4, y - 4, 3, 4, RB_K); },
});
